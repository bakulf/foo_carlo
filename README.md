### Foo - the language ###

0: Each instruction is separated by ;
1: Each instruction must start with a numeric indicator. Ex: 123: foo;
2: The first instruction is 0;
3: The instructions do not need to be in order... nice;
4: There is only one variable: foo;
5: Assign values to foo using :=. For instance: 0: foo := 123;
6: use goto X to move the execution to instruction X;
7: empty instructions are allowed;
8: if stmt is composed by a op b<comma> ops. For instance: 0: self.age <= foo<comma> goto 5;
9: Unknown instructions are printed;


## Example ##

echo "0: foo := 1; 1: Tanti auguri a tee; 2: self.age <= foo, goto 5; 3: foo := foo + 1; 4: goto 1; 5:"  | node foo.js
