process.stdin.resume();
process.stdin.setEncoding('utf8');

let pos = 0;
let foo = 0;

function dieIfNot(what, msg) {
  if (!what) {
    console.error(msg);
    process.exit(1);
  }
}

function parseBody(body) {
  const comma = body.indexOf(",");
  if (comma !== -1) {
    const parts = body.substr(0, comma).split(" ");
    dieIfNot(parts.length, `If condition requires 3 parts: "${body}"`);
    return { op: "if", a: parts[0], b: parts[2], c: parts[1], then: parseBody(body.substr(comma +1).trim()) };
  }

  const parts = body.split(" ");
  if (parts.length === 0) {
    return { op: "nop" };
  }

  switch (parts[0]) {
    case "":
      return { op: "nop" };

    case "foo":
      dieIfNot(parts[1] === ":=", `Wrong foo use in "${body}"`);
      dieIfNot(parts.length === 5 || parts.length === 3, `Invalid assigned ${body}`);
      return { op: "assign", what: parts.slice(2) }

    case "goto":
      return { op: "goto", what: parseInt(parts.slice(1), 10) }

    default:
      return { op: "print", what: parts }
  }
}

function parseValue(what) {
  switch (what) {
    case "foo": return foo;
    case "pos": return pos;
    case "self.age": return 42;
    default: return parseInt(what, 10);
  }
}

function exec(ops) {
  while (true) {
    let op = ops[pos];
    if (!op) {
      process.exit(0);
    }

    execOp(op);
  }
}

function execOp(op) {
  if (op.op === "goto") {
    pos = op.what;
    return;
  }

  switch (op.op) {
    case "nop":
      break;

    case "assign": {
      if (op.what.length === 1) {
        foo = parseValue(op.what[0]);
        break;
      }

      const a = parseValue(op.what[0]);
      const b = parseValue(op.what[2]);
      switch (op.what[1]) {
        case "+": foo = a + b; break;
        case "-": foo = a - b; break;
        case "*": foo = a * b; break;
        case "/": foo = a / b; break;
        break;
      }
      break;
    }

    case "print":
      process.stdout.write(op.what.join(" ") + "\n");
      break;

    case "if": {
      const a = parseValue(op.a);
      const b = parseValue(op.b);

      let then = false;
      switch (op.c) {
        case "<=": then = a <= b; break;
        case "<": then = a < b; break;
        case ">=": then = a >= b; break;
        case ">": then = a > b; break;
        case "=": then = a = b; break;
        default:
          dieIfNot(false, `Invalid compare op: ${op.c}`);
      }

      if (then) {
        execOp(op.then);
      }
      break;
    }

    default:
      dieIfNot(false, `Invalid op: ${op.op}`);
  }

  pos++;
}

let buffer = "";
process.stdin.on('data', chunk => {
  buffer += chunk;
});

process.stdin.on('end', _ => {
  const ops = {};

  buffer.split(";").map(op => op.trim()).forEach(op => {
    if (op.length) {
      const pos = op.indexOf(":");
      dieIfNot(pos >= 1, `"${op}" invalid! A identifier is required`);
      const id = op.substr(0, pos);
      const body = op.substr(pos+1).trim();
      ops[id] = parseBody(body);
    }
  });

  exec(ops);
});
