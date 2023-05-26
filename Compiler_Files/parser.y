%{
#include <stdio.h>
#include <string.h>
#include "typecheck.h"
#include "node.h"
#include "codegen.h"
void yyerror(char *);

extern int yylex();

// Global variables defined by lex.yy.c.
extern int yylineno;
extern char* yytext;
extern FILE *yyin;

struct ASTNode *missingChild;
struct ASTNode *quantifier_parent;
int dim_counter = 0;

struct ASTNode* root;
%}

// Declares all variants of semantic values. Yacc/Bison copies all variants
// to the generated header file (y.tab.h) enclosed in a C-language union
// declaration, named `YYSTYPE`. Check out the header file to see it.
%union {
    struct ASTNode* node;
    int integer;
    char * string;
}

// Left hand non-terminals. They are all associated to the `node` variant
// declared in the %union section, which is of type `ASTNode *`.
%type <node> Program MainClass VarDecl VarDeclTail EqExpQ StaticVarDecl StaticVarDeclInit StaticMethodDecl StaticMethodDeclInit 
%type <node> FormalListQ FormalList FormalListTail PrimeType Statement StatementInit Type Exp ExpList ExpListQ ExpListTail
%type <node> TypeTail MethodCall LeftValue LeftValueInit Index Main

// Declares tokens. In the generated y.tab.h file, each token gets declared as 
// a enum constant and assigned with a unique number. These enum constants are
// used in the lex file, returned by `yylex()` to denote the symbolic tokens.

// These keyword-like tokens doesn't need to have a semantic value.
%token KW_BOOLEAN KW_CLASS KW_FALSE KW_INT MAIN KW_PUBLIC KW_TRUE KW_VOID KW_PRIVATE
%token TOK_PPLUS TOK_AND TOK_OR TOK_LESS TOK_GREAT TOK_LESSEQ TOK_GREATEQ TOK_EQUALEQ
%token TOK_NOTEQUAL TOK_PLUS TOK_MINUS TOK_STAR TOK_SLASH TOK_EQUAL KW_RETURN KW_IF KW_ELSE KW_WHILE KW_NEW
%token KW_LENGTH TOK_DOT TOK_SEMICOLON TOK_COMA TOK_LBRACE TOK_RBRACE TOK_LPARENT TOK_RPARENT
%token KW_STATIC KW_STRING SYSTEM_OUT_PRINT SYSTEM_OUT_PRINTLN TOK_EXCL
%token TOK_LBRACKET TOK_RBRACKET
%token INTEGER_PARSEINT

// These tokens have additional information aside from what kind of token it
// is, so they carry semantic information.
%token <integer> INTEGER_LITERAL
%token <string> STRING_LITERAL ID

%left TOK_AND TOK_OR
%left TOK_LESS TOK_LESSEQ TOK_GREAT TOK_GREATEQ TOK_EQUALEQ TOK_NOTEQUAL TOK_EXCL
%left TOK_PLUS TOK_MINUS
%left TOK_STAR TOK_SLASH

%start Program

%%

Program:
    /* Program: MainClass */
    MainClass {
        $$ = new_node(NODETYPE_PROGRAM);

        add_child($$, $1);
        root = $$;
    };

MainClass:
    /* MainClass: class id { StaticVarDecl* StaticMethodDecl* public static void main "(" String [] id ")" { Statement* }} */
    KW_CLASS ID TOK_LBRACE StaticVarDeclInit StaticMethodDeclInit
        Main TOK_LBRACE StatementInit TOK_RBRACE
    TOK_RBRACE
    {
        $$ = new_node(NODETYPE_MAINCLASS);

        set_string_value($$, $2);
        add_child($$, $4);
        add_child($$, $5);
        
        add_child($$, $6);

        add_child($6, $8);
    };

Main:
    KW_PUBLIC KW_STATIC KW_VOID MAIN TOK_LPARENT KW_STRING TOK_LBRACKET TOK_RBRACKET ID TOK_RPARENT {
        struct ASTNode * main = new_node(NODETYPE_STATICMETHODDECL);
        const char * textName = "main";
        set_string_value(main, strdup(textName));
        struct ASTNode* primeType = new_node(NODETYPE_PRIMETYPE);
        struct ASTNode* type = new_node(NODETYPE_PRIMETYPE);
        struct ASTNode * dim = new_node(NODETYPE_DIM);
        type->data.type = DATATYPE_VOID;
        add_child(main, primeType);
        add_child(primeType, type);
        dim_counter = -1;
        set_int_value(dim, dim_counter);
        add_child(primeType, dim);
        dim_counter = 0;

        struct ASTNode* formallist = new_node(NODETYPE_FORMALLIST);
        set_string_value(formallist, $9);

        add_child(main, formallist);
        
        primeType = new_node(NODETYPE_PRIMETYPE);
        type = new_node(NODETYPE_PRIMETYPE);
        type->data.type = DATATYPE_STR;
        add_child(formallist, primeType);
        add_child(primeType, type);

        dim = new_node(NODETYPE_DIM);
        dim_counter = 1;
        set_int_value(dim, dim_counter);
        add_child(primeType, dim);
        dim_counter = 0;

        $$ = main;
    }

VarDecl:
    /* VarDecl : Type id (= Exp)? (, id (= Exp)? )* ; */
    Type ID EqExpQ VarDeclTail {
        $$ = new_node(NODETYPE_VARDECL);

        set_string_value($$, $2);
        add_child($$, $1);
        add_child($$, $3);
        add_child($$, $4);
    };

StaticVarDecl:
    /* StaticVarDecl : private static Type id (= Exp)? (, id (= Exp)? )* ; */
    KW_PRIVATE KW_STATIC Type ID EqExpQ VarDeclTail TOK_SEMICOLON {
        $$ = new_node(NODETYPE_STATICVARDECL);

        set_string_value($$, $4);
        add_child($$, $3);
        add_child($$, $5);
        add_child($$, $6);
    };

VarDeclTail:
    /* (, id (= Exp)? )* */
    VarDeclTail TOK_COMA ID EqExpQ {
        $$ = new_node(NODETYPE_STATICVARDECL);

        set_string_value($$, $3);
        add_child($$, missingChild);
        add_child($$, $4);
        add_child($$, $1);
    }
    | { $$ = NULL; };

EqExpQ:
    /* (= Exp)? */
    TOK_EQUAL Exp {
        $$ = new_node(NODETYPE_EXP);

        add_child($$, $2);
    }
    | { $$ = NULL; };

StaticMethodDecl:
    /* StaticMethodDecl : public static Type id "(" FormalList? ")" {Statement*} */
    KW_PUBLIC KW_STATIC Type ID TOK_LPARENT FormalListQ TOK_RPARENT TOK_LBRACE StatementInit TOK_RBRACE {
        $$ = new_node(NODETYPE_STATICMETHODDECL);

        set_string_value($$, $4);
        add_child($$, $3);

        add_child($$, $6);
        add_child($$, $9);
    };

StaticMethodDeclInit:
    StaticMethodDeclInit StaticMethodDecl {
        $$ = new_node(NODETYPE_STATICMETHODDECLINIT);

        set_string_value($$, $2->data.value.string_value);
        add_child($$, $2);
        add_child($$, $1);
    }
    | { $$ = NULL; };

StaticVarDeclInit:
    StaticVarDeclInit StaticVarDecl {
        $$ = new_node(NODETYPE_STATICVARDECLINIT);
        add_child($$, $1);
        add_child($$, $2);
    }
    | { $$ = NULL; };

FormalListQ:
    /* FormalList? */
    FormalList { $$ = $1; }
    | { $$ = NULL; };

FormalList:
    /* FormalList : Type id (, Type id)* */
    Type ID FormalListTail {
        $$ = new_node(NODETYPE_FORMALLIST);

        set_string_value($$, $2);
        add_child($$, $1);
        add_child($$, $3);
    };

FormalListTail:
    /* (, Type id)* */
    FormalListTail TOK_COMA Type ID {
        $$ = new_node(NODETYPE_FORMALLIST);

        set_string_value($$, $4);
        add_child($$, $3);
        add_child($$, $1);
    }
    | { $$ = NULL; };

Type:                   
    /* Type : PrimeType */
    /* : Type [ ] */
    PrimeType TypeTail {
        $$ = new_node(NODETYPE_PRIMETYPE);
        missingChild = $$;
        add_child($$, $1);
        struct ASTNode * dim = new_node(NODETYPE_DIM);
        set_int_value(dim, dim_counter);
        add_child($$, dim);
        dim_counter = 0;
    };

TypeTail:
    /* : TypeTail [ ] */
    TypeTail TOK_LBRACKET TOK_RBRACKET {
        dim_counter++;
    }
    | { dim_counter = 0; };

PrimeType:
    /* PrimeType : int */
    /* : boolean */
	/* : String */
    KW_INT {
        $$ = new_node(NODETYPE_PRIMETYPE);

        $$ -> data.type = DATATYPE_INT;

        dim_counter = 0;
    }
    | KW_BOOLEAN {
        $$ = new_node(NODETYPE_PRIMETYPE);

        $$ -> data.type = DATATYPE_BOOLEAN;

        dim_counter = 0;
    }
    | KW_STRING {
        $$ = new_node(NODETYPE_PRIMETYPE);

        $$ -> data.type = DATATYPE_STR;

        dim_counter = 0;
    };               

Statement:              
    /* Statement : VarDecl ;*/
    /* : { Statement* } */
    VarDecl TOK_SEMICOLON {
        $$ = $1;
    }
    | TOK_LBRACE StatementInit TOK_RBRACE {
        $$ = new_node(NODETYPE_STATEMENTINIT);

        add_child($$, $2);
    }
    /* : if "(" Exp ")" Statement else Statement */
    /* : while "(" Exp ")" Statement */
    | KW_IF TOK_LPARENT Exp TOK_RPARENT Statement KW_ELSE Statement {
        $$ = new_node(NODETYPE_IF);

        add_child($$, $3);
        add_child($$, $5);
        add_child($$, $7);
    }
    | KW_WHILE TOK_LPARENT Exp TOK_RPARENT Statement {
        $$ = new_node(NODETYPE_WHILE);

        add_child($$, $3);
        add_child($$, $5);
    }
    /* : System.out.println "(" Exp ")" ; */
    /* : System.out.print "(" Exp ")" ; */
    | SYSTEM_OUT_PRINTLN TOK_LPARENT Exp TOK_RPARENT TOK_SEMICOLON {
        $$ = new_node(NODETYPE_PRINTLN);

        add_child($$, $3);
    }
    | SYSTEM_OUT_PRINT TOK_LPARENT Exp TOK_RPARENT TOK_SEMICOLON {
        $$ = new_node(NODETYPE_PRINT);

        add_child($$, $3);
    }
    /* : LeftValue = Exp ; */
    | LeftValue TOK_EQUAL Exp TOK_SEMICOLON {
        $$ = new_node(NODETYPE_LEFTVALUE);

        add_child($$, $1);
        add_child($$, $3);
    }
	/* : return Exp ; */
	/* : MethodCall ; */
    | KW_RETURN Exp TOK_SEMICOLON {
        $$ = new_node(NODETYPE_RETURN);

        add_child($$, $2);
    }
    | MethodCall TOK_SEMICOLON {
        $$ = new_node(NODETYPE_METHODCALL);

        add_child($$, $1);
    };

StatementInit:
    StatementInit Statement {
        $$ = new_node(NODETYPE_STATEMENTINIT);

        add_child($$, $1);
        add_child($$, $2);
    }
    | { $$ = NULL; };

MethodCall:
    /* MethodCall : id "(" ExpList? ")" */
    ID TOK_LPARENT ExpListQ TOK_RPARENT {
        $$ = new_node(NODETYPE_METHODCALL);

        set_string_value($$, $1);
        add_child($$, $3);
    }
    /* : Integer.ParseInt "(" Exp ")" */
    | INTEGER_PARSEINT TOK_LPARENT Exp TOK_RPARENT {
        $$ = new_node(NODETYPE_PARSEINT);

        add_child($$, $3);
    };

Exp:                    
    /* op && || < >  <= >= == != + - * / */
    /* Exp op Exp */
    Exp TOK_AND Exp {
        $$ = new_node(NODETYPE_BBINARY);
        set_string_value($$, "&&");

        add_child($$, $1);
        add_child($$, $3);
    }
    | Exp TOK_OR Exp {
        $$ = new_node(NODETYPE_BBINARY);
        set_string_value($$, "||");

        add_child($$, $1);
        add_child($$, $3);
    }
    | Exp TOK_LESS Exp {
        $$ = new_node(NODETYPE_IBINARYB);
        set_string_value($$, "<");

        add_child($$, $1);
        add_child($$, $3);
    } 
    | Exp TOK_GREAT Exp {
        $$ = new_node(NODETYPE_IBINARYB);
        set_string_value($$, ">");

        add_child($$, $1);
        add_child($$, $3);
    }
    | Exp TOK_LESSEQ Exp {
        $$ = new_node(NODETYPE_IBINARYB);
        set_string_value($$, "<=");

        add_child($$, $1);
        add_child($$, $3);
    } 
    | Exp TOK_GREATEQ Exp {
        $$ = new_node(NODETYPE_IBINARYB);
        set_string_value($$, ">=");

        add_child($$, $1);
        add_child($$, $3);
    }
    | Exp TOK_EQUALEQ Exp {
        $$ = new_node(NODETYPE_IBINARYB);
        set_string_value($$, "==");

        add_child($$, $1);
        add_child($$, $3);
    } 
    | Exp TOK_NOTEQUAL Exp {
        $$ = new_node(NODETYPE_IBINARYB);
        set_string_value($$, "!=");

        add_child($$, $1);
        add_child($$, $3);
    }
    | Exp TOK_PLUS Exp {
        $$ = new_node(NODETYPE_IBINARY);
        set_string_value($$, "+");

        add_child($$, $1);
        add_child($$, $3);
    } 
    | Exp TOK_MINUS Exp {
        $$ = new_node(NODETYPE_IBINARY);
        set_string_value($$, "-");

        add_child($$, $1);
        add_child($$, $3);
    }
    | Exp TOK_STAR Exp {
        $$ = new_node(NODETYPE_IBINARY);
        set_string_value($$, "*");

        add_child($$, $1);
        add_child($$, $3);
    } 
    | Exp TOK_SLASH Exp {
        $$ = new_node(NODETYPE_IBINARY);
        set_string_value($$, "/");

        add_child($$, $1);
        add_child($$, $3);
    }
    /* : ! Exp */
    /* : + Exp */
    | TOK_EXCL Exp {
        $$ = new_node(NODETYPE_NEGEXP);
        set_string_value($$, "!");

        add_child($$, $2);
    }
    | TOK_PLUS Exp {
        $$ = new_node(NODETYPE_SEXP);
        set_string_value($$, "+");

        add_child($$, $2);
    }
    /* : - Exp */
    /* : "(" Exp ")" */
    | TOK_MINUS Exp {
        $$ = new_node(NODETYPE_SEXP);
        set_string_value($$, "-");

        add_child($$, $2);
    }
    | TOK_LPARENT Exp TOK_RPARENT {
        $$ = new_node(NODETYPE_PEXPP);

        add_child($$, $2);
    }
    /* : LeftValue */
    /* : LeftValue . length */
    | LeftValue {
        $$ = $1;
    }
    | LeftValue TOK_DOT KW_LENGTH {
        $$ = new_node(NODETYPE_LEFTVALUELEN);

        add_child($$, $1);

        struct ASTNode * dim = new_node(NODETYPE_DIM);
        set_int_value(dim, dim_counter);
        dim_counter = 0;
    }
    /* : INTEGER_LITERAL */
    /* : STRING_LITERAL */
    | INTEGER_LITERAL {
        $$ = new_node(NODETYPE_EXPEND);

        set_int_value($$, $1);
        $$ -> data.type = DATATYPE_INT;
    }
    | STRING_LITERAL {
        $$ = new_node(NODETYPE_EXPEND);

        set_string_value($$, $1);
        $$ -> data.type = DATATYPE_STR;
    }
    /* : true */
    /* : false */
    | KW_TRUE {
        $$ = new_node(NODETYPE_EXPEND);

        set_boolean_value($$, true);
        $$ -> data.type = DATATYPE_BOOLEAN;
    }
    | KW_FALSE {
        $$ = new_node(NODETYPE_EXPEND);

        set_boolean_value($$, false);
        $$ -> data.type = DATATYPE_BOOLEAN;
    }
    /* : MethodCall */
    /* : new PrimeType Index */
    | MethodCall {
        $$ = new_node(NODETYPE_METHODCALL);

        add_child($$, $1);
    }
    | KW_NEW PrimeType Index {
        $$ = new_node(NODETYPE_NEW);

        add_child($$, $2);
        add_child($$, $3);
        struct ASTNode * dim = new_node(NODETYPE_DIM);
        set_int_value(dim, dim_counter);
        add_child($$, dim);
        dim_counter = 0;
    };

Index:
    /* Index :  [ Exp ] */
    /* : Index [ Exp ] */
    Index TOK_LBRACKET Exp TOK_RBRACKET {
        $$ = new_node(NODETYPE_EXP);
        add_child($$, $3);
        add_child($$, $1);
        dim_counter++;
    }
    | TOK_LBRACKET Exp TOK_RBRACKET { 
        dim_counter = 0;
        $$ = new_node(NODETYPE_EXP);
        add_child($$, $2);
        dim_counter++;
    };

ExpListQ:
    /* ExpList? */
    ExpList { $$ = $1; }
    | { $$ = NULL; };

ExpList:
    /* ExpList : Exp (, Exp )* */
    Exp ExpListTail {
        $$ = new_node(NODETYPE_EXPLIST);

        add_child($$, $1);
        add_child($$, $2);
    };

ExpListTail:
    /* (, Exp )* */
    ExpListTail TOK_COMA Exp {
        $$ = new_node(NODETYPE_EXPLIST);
        add_child($$, $3);
        add_child($$, $1);
    }
    | { $$ = NULL; };

LeftValue:
    /* LeftValue  : id */
	/* : LeftValue [ Exp ] */
    ID LeftValueInit {
        $$ = new_node(NODETYPE_LEFTVALUE);

        set_string_value($$, $1);
        struct ASTNode * dim = new_node(NODETYPE_DIM);
        set_int_value(dim, dim_counter);
        add_child($$, dim);
        add_child($$, $2);
        dim_counter = 0;
    };

LeftValueInit:
    /* LeftValue [ Exp ] */
    LeftValueInit TOK_LBRACKET Exp TOK_RBRACKET {

        $$ = new_node(NODETYPE_LEFTVALUE);

        add_child($$, $3);
        add_child($$, $1);

        dim_counter++;
    }
    | { dim_counter = 0; $$ = NULL; };

%%

void yyerror(char* s) {
    fprintf(stderr, "Syntax errors in line %d\n", yylineno);
}

int parse(int argc, char* argv[] )
{
    yyin = fopen( argv[1], "r" );

    // Checks for syntax errors and constructs AST
    if (yyparse() != 0)
        return 1;

    // Traverse the AST to check for semantic errors if no syntac errors
    // checkProgram(root);
    
    return 0;
}
