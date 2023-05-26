# Goal
Create a Web IDE that can save, type check, compile, and run Java files.

## Mision
A user friendly and efficient Java IDE for document edition and management. Most Web IDE do not support command line arguments and we which to build a simple and efficient compiler that does.

## Vision
We envision a VSCode like web IDE which would be more efficient than usual API calls made in Web Java compilers.

# Background
Existing code worked on independently to create a ARM file from a Java file in a limited simple language was ran through the personal terminal. The ARM .s file was then compiled in a Raspberry Pi virtual machine.

## Grammar
* The following is the grammar utilizing regular expressions

Program  : MainClass 

MainClass : class id { StaticVarDecl* StaticMethodDecl* public static void main "(" String [] id ")" { Statement* }}

        
VarDecl : Type id (= Exp)? (, id (= Exp)? )* ;

StaticVarDecl : private static Type id (= Exp)? (, id (= Exp)? )* ;

StaticMethodDecl : public static Type id "(" FormalList? ")" {Statement*}

FormalList : Type id (, Type id)*

PrimeType   : int
            : boolean
            : String

Type : PrimeType

Statement   : VarDecl
	        : { Statement* }
            : System.out.println "(" Exp ")" ;
            : System.out.print "(" Exp ")" ;
            : LeftValue = Exp ;
	        : return Exp ;
	        : MethodCall ;

MethodCall : id "(" ExpList? ")" 
	
Exp : Exp op Exp
    : ! Exp
    : + Exp       
    : - Exp
    : "(" Exp ")"
    : LeftValue
    : INTEGER_LITERAL
    : STRING_LITERAL
    : true
    : false
    : MethodCall

ExpList : Exp (, Exp )*

LeftValue  : id

## Design
The overarching design is by building a consistent AST while valididating the input with the grammar rules so that whenever the type checker analyses a node with a specific type, it can also access all the required information. Then it builds an ARM Assembly .s file equivalent of the java file.

### AST Construction
The idea is to have a dimension NodeType whenever working with arrays to keep track of the number of bracket pairs through an updatable global variable and add it as a child so that the analyzer does not have to go through each node.

The Program Node points to the MainClass node. Then points to its StaticVar*, StaticMet* and the StaticMet of the main class. Note that for any NonTerminal* we would generate a chain of init nodes so that the first child is the nonterminal, and the second child points to the next nonterminal of its type.

                                            Program
                                                |
                                            Main Class
                        |                       |                           |
                    StaticMethDecl*         StaticVarDecl*              StaticMethDecl(main)
            |           |                           ...
        Type        StaticMethDecl
                |               |
            StaticMethDecl*     Statement*

** Updated the ASTNode * to poses line numbers and parent pointers.

### Type Checking
The type checker combines the dimensionality node with helper functions like extractTypeData to access the leaf of the subtree containing its data so that the analyzer does not have to study each node at a time. We also keep track of the different symbols (id's) encountered so far in the table containing its SemanticData (DataType and dimension), its parent scope which represents as the supremum to which the symbol reaches, line number in case of a report, and its id name.

#### Type Checking Pseudo Algorithm
1. We have the grammar analyzer to test the input
2. Call the type checker so that it starts by adding all the methods to the symbol table, leaving the formalList and statment checking of the method for last just in case a static var declaration already uses a variable.
    2a. Have the inScopeDecl combined with VarInTable helpers functions that functionally checks if there is an existing variable with the id in the given scope to through a report if set bool to true, if not it is added.
3. Check the static var declarations by having a ExpType helper function that returns a SemanticData* that contains the type and dimension in case of an expresion
    3a. The ExpType is a type checker for nodes of EXP type or relatives to access the required data only
4. Move onto the formal lists left behind by the methods in a global array keeping track of the indeces in the table that are methods
    4a. Also adds with the same idea of 2a all the parameters but its parent methods as their scope
5. Each method is going to have their statement child, therefore there is a helper function to type check the statement with the same idea of chained nonterminals so it could recurse, and also has the same idea of varInTable without reporting if we are using the leftvalue non-terminal for example.
    5a. We use the ExpType helper function as well, so to account for indeces of an array type is by taking the difference of the dimentionality we already calculated for the variable (symbol id) with the dimentionality of the left value node to be the resulting dimensionality
    5b. For the methodCall statement, we traverse the subtrees of the formallist and explist simultaneously to compare each child has the same type and has the same number of parameters as the trees are built equivalently

** The VarInScope works by accessing the symbol_table entry and having a while loop to reach a parent scope if they have it in common, so it recurses until it finds a variable in the scope or it reaches the end of the symbol_table

### ARM Assembly Generator
The ARM Generator compiles the inputed files by assuming it is valid, and translates the code into the equivalent ARM Assembly into the "out.s" file.

#### Memory allocation
The main take aways of my code is the different stacks that allow me to access the top most available registers through a global int which specifies the index of the register stacks. First it starts the algorithm in a main, which is not the inline method main, to define static variables (especially in case of expression declarations) and offset the argv and move it to r0 register. The callee stack pointers are allocated as a constant upperbound by the maximum number of arguments and local variables my code can currently support. Whenever accessing or redefining a variable, it goes through the variable name arrays. Variables also have a corresponding array to keep track and easy access of the types of each.

### High Level Performance Summary
I do traverse the AST, however, not node by node. I only traverse the required information to type check reaching NODETYPE_TYPEs and if the code is valid, then compiles it into an equivalent ARM .s file. I do so with helper functions specialized for each nonterminal. 

#### Type Checking
I type check by specific non-terminals and may even return the intermediate data type and dimensionality of the node. This is because when building the AST, I had an int global variable to keep track of the dimensionality of a Type and Leftvalue. The type checks is valid whenever all types and dimensions are corresponding to each expression.

#### ARM Code Generation
After building the AST, and successful typechecking, the algorithm move on to code generating. It would write the corresponding code into the *.s file by doing specific sections at a time. First define static variables, then call methods. Methods have embbeded statements which only depend on expressions and specific actions. The expressions are calculated using the register stack and store variables and arguments to its method stack pointer. When calling any method, it stores the live registers to the stack and recovers them after. r0 is the return register.

With further details, we have two main functions, evaluateExp and buildStatement. The latter is the one in charge of running through every single type of statement and calling the expression builder so that the top most register holds the values used in the statement. For example, variable declaration would load the expresion in the left side (place to store) and the expression holds the top most register for that, and then does the same with the right expression (the value to store) so that the value is stored appropriately. We also have loops (if and while), array implementation up to two dimensions by allocating the necessary size to each element, array length by containing in the first element of its array its size, parseInt/strcat with C library functions. The former has operations for all Strings, integers, and booleans.

##### Further Efficiency
The previous points generate a correct ARM code file through a placeholder file. Then we have a liveness.c in charge of creating a control graph reading line by line through a doubly linked list with nodes of a data structure that contains all the necessary information, namely: instruction, registers, next and previous potential states, Use and Def sets. Then, we have a liveness analyser that traverses the doubly linked to define the LiveIn, LiveOut in each state to generate an interference graph to replace the registers/remove lines that would make more efficient. From here, we traverse from the root of the linked list to print the new improved file.

## How to Run
### Generate ARM
1. make
2. ./codegen filename

### COMMANDs to reach and for VM Raspberry
1. ssh vm2.cs.purdue.edu
2. ssh
3. Enter the password
4. scp -r mdsantia@data.cs.purdue.edu:/u/riker/u87/mdsantia/cs352/p5/Completed_p5/outFiles/ ./

### COMPILE to .S
1. gcc -g -o out outFiles/<program>.s
2. ./out <args>

### GDB PYTHON TRACER
This helps count the number of memory access actions occured in an ARM file when ran

The python script to trace the execution of the debugged program.
Should be used from within GDB interface:
In the RaspberryPi after compiling
1. gdb ./out
2. (gdb) set args <arg0> <arg1> <arg2>
3. (gdb) source gdb_tracer.py
The traced instructions will be written to 'gdb-log.txt'.

#### To move the log output to the Data server
In the RaspberryPi enter
1. scp gdb-log.txt mdsantia@data.cs.purdue.edu:/u/riker/u87/mdsantia/cs352/p5/Completed_p5/gdb-log.txt

# TODO
1. Work on a user web interface
    a. Add/remove files
    b. Edit files
    c. Esthetics and usability
    d. Command Line arguments
    e. Run/Compile Button
2. Save files to a database
    a. Add and edit files 
3. Implement integration between Java compiler to ARM
    a. Optimize ARM
    b. Multi-dimensional Array optimization
    c. Increase grammar
    d. Object-Oriented implementation

# How to Run
1. cd to Web UI
2. npm init
3. npm i mongodb
4. npm run dev

# Developers
## Micky Santiago-Zayas
1. Work independently in the compiler
## Khoa Raisr
1. Join after most efforts for the compiler where done