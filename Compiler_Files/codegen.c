#define TOFOLDER 1
#define EFFICIENT 0
#define PHOLDERFILE "_out.s"
#define OUTFOLDER "outFiles/"
#define REMOVEPHOLDER 1

#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "codegen.h"
#include "node.h"
#include "typecheck.h"
#include "liveness.h"
#include "y.tab.h"

#define MAX_VARS 20
#define MAX_ARGS 13
#define MAX_STK 13

char * folderName;

char *regArgs[]={ "r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11", "r12"};
const char nregArgs = sizeof(regArgs)/sizeof(char*);

char *regStk[]={"r12", "r11", "r10", "r9", "r8", "r7", "r6", "r5", "r4", "r3", "r2", "r1", "r0"};
char nregStk = sizeof(regStk)/sizeof(char*);
// r0 is also a return register

extern int parse(int argc, char* argv[] );
extern struct ASTNode* root;
extern int num_errors;
extern int * methodsInSymbolTable;
extern int num_methods;

extern struct SymbolTableEntry *symbol_table[50];
extern int num_entries;

char * staticVars[MAX_VARS];
struct SemanticData * staticVarsType[MAX_VARS];
int num_staticVars = 0;

char * args[MAX_ARGS];
struct SemanticData * argsType[MAX_ARGS];
int num_args = 0;

char * localVars[MAX_VARS];
struct SemanticData * localVarsType[MAX_VARS];
int num_localVars = 0;

char * strings[MAX_VARS];
int num_strings = 0;

int topStk = 0;

// JUST FOR THE LEFTVALUE NODE in case it is storing a value to a variable or not
bool storing = false;

FILE *fp;
FILE *ph;

int num_id = 0;

void addToLocal(char * id, struct SemanticData * type) {
    if (num_localVars < MAX_VARS) {
        localVars[num_localVars] = id;
        localVarsType[num_localVars] = type;
        num_localVars++;
    } else {
        printf("REACHED MAX LOCAL VARIABLES\n");
    }
}

void declareAllStaticVars() {
    struct ASTNode* temp1 = (root->children[0]->num_children>1&&root->children[0]->children[0]->node_type==NODETYPE_STATICVARDECLINIT)?root->children[0]->children[0]:NULL;
    temp1!=NULL?fprintf(fp, ".section .data\n"):0;

    while (temp1 != NULL) {
        struct ASTNode * temp2 = temp1->children[temp1->num_children - 1]->node_type==NODETYPE_STATICVARDECL?temp1->children[temp1->num_children - 1]:NULL;
        while (temp2 != NULL) {
            struct SemanticData * type = extractTypeData(temp2->children[0]);
            staticVars[num_staticVars] = temp2->data.value.string_value;
            staticVarsType[num_staticVars] = type;
            num_staticVars++;
            fprintf(fp, "%s: .word 0\n", temp2->data.value.string_value);
            // IS THERE ANY LEFT OF THE CHAIN
            temp2 = temp2->children[temp2->num_children - 1]->node_type==NODETYPE_STATICVARDECL?temp2->children[temp2->num_children - 1]:NULL;
        }
        // IF THERE IS ANOTHER CHAIN OF STATIC DECLARATIONS
        temp1 = temp1->children[0]->node_type==NODETYPE_STATICVARDECLINIT?temp1->children[0]:NULL;
    }
}

void defineStaticText() {
    fprintf(fp, "\n.section .text\n");
    fprintf(fp, "\n@ PRINT STRINGS\n");
    char text[100] = "iprint: .asciz \"%d\"\n";
    fprintf(fp, "%s", text);
    strcpy(text, "sprint: .asciz \"%s\"\n");
    fprintf(fp, "%s", text);
    strcpy(text, "iprintln: .asciz \"%d\\n\"\n");
    fprintf(fp, "%s", text);
    strcpy(text, "sprintln: .asciz \"%s\\n\"\n");
    fprintf(fp, "%s", text);

    fprintf(fp, "\n@ BOOLEAN STRINGS\n");
    strcpy(text, "true: .asciz \"true\"\n");
    fprintf(fp, "%s", text);
    strcpy(text, "false: .asciz \"false\"\n");
    fprintf(fp, "%s", text);

    struct ASTNode* temp1 = (root->children[0]->num_children>1&&root->children[0]->children[0]->node_type==NODETYPE_STATICVARDECLINIT)?root->children[0]->children[0]:NULL;
}

void buildtoMethodCall(struct ASTNode * methodCall) {
    (methodCall->num_children>0 && methodCall->children[0]->node_type == NODETYPE_PARSEINT)?methodCall=methodCall->children[0]:0;
    struct ASTNode * tempPar = (methodCall->num_children>0 && methodCall->node_type != NODETYPE_PARSEINT)?methodCall->children[0]->children[0]:NULL;

    
    // SAVE ALL THE VALUES IN REG STK
    topStk>0?fprintf(fp, "\n\t@ SAVE ALL THE ACTIVE REGISTERS\n"):0;
    for (int i = 0; i < topStk; i++) {
        fprintf(fp, "\tstr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
    }

    struct ASTNode * exps[MAX_STK];
    int num_exps = 0;

    while (tempPar != NULL) {
        if (num_args < nregArgs) {
            exps[num_exps] = tempPar->children[0];
            num_exps++;
        } else {
            printf("TOO MANY ARGUMENTS\n");
            break;
        }
        (tempPar->num_children>1)?(tempPar=tempPar->children[1]):(tempPar=NULL);
    }
    // ORGANIZE ARGUMENTS IN ARRAY AND OFFSET
    // SAVE ARRAYS IN OFFSET AS ith is size and i+1th is pointer to array

    if (methodCall->node_type == NODETYPE_PARSEINT) {
        fprintf(fp, "\n\t@ parseInt conversion\n");
        evaluateExp(methodCall->children[0]);
        fprintf(fp, "\t@ Save string on argument register\n");
        fprintf(fp, "\tmov r0, %s\n", regStk[--topStk]);
    }
    if (num_exps > 0) {
        fprintf(fp, "\n\n\t@ Save all arguments on argument registers\n");
        evaluateExp(exps[0]);
        fprintf(fp, "\tmov %s, %s\t@ store parameter\n", regArgs[0], regStk[--topStk]);
    }
    for (int i = 1; i < num_exps; i++) {
        evaluateExp(exps[i]);
        fprintf(fp, "\tmov %s, %s\t@ store parameter\n", regArgs[i], regStk[--topStk]);
    }
    (num_exps > 0 || methodCall->node_type == NODETYPE_PARSEINT)?fprintf(fp, "\t@ Saved all arguments on argument registers\n\n"):0;

    if (methodCall->node_type == NODETYPE_PARSEINT) {
        fprintf(fp, "\tbl atoi\n");
    } else {
        strcmp("main", methodCall->children[0]->data.value.string_value)==0?fprintf(fp, "\tbl methodmain\n\n"):fprintf(fp, "\tbl %s\n\n", methodCall->children[0]->data.value.string_value);
    }

    topStk>0?fprintf(fp, "\n\t@ RECOVER ALL THE ACTIVE REGISTERS\n"):0;
    for (int i = 0; i < topStk; i++) {
        fprintf(fp, "\tldr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
    }

    fprintf(fp, "\t@ move result to stack\n\tmov %s, r0\n", regStk[topStk++]);
    return;
}

void evaluateExp(struct ASTNode * exp) {
    if (exp->node_type == NODETYPE_EXPEND) {
        if (exp->data.type == DATATYPE_INT) {
            fprintf(fp, "\tldr %s, =#%d\n", regStk[topStk++], exp->data.value.int_value);
        }
        if (exp->data.type == DATATYPE_STR) {
            strings[num_strings] = exp->data.value.string_value;
            fprintf(fp, "\tldr %s, =string%d\n", regStk[topStk++], num_strings);
            num_strings++;
        }
        if (exp->data.type == DATATYPE_BOOLEAN) {
            fprintf(fp, "\tldr %s, =#%d\n", regStk[topStk++], exp->data.value.boolean_value?1:0);
        }
        return;
    }

    if (exp->node_type == NODETYPE_SEXP) {
        evaluateExp(exp->children[0]);
        if (strcmp(exp->data.value.string_value, "-") == 0) {
            fprintf(fp, "\tldr %s, =#-1\n", regStk[topStk]);
            fprintf(fp, "\tmul %s, %s, %s\n", regStk[topStk - 1], regStk[topStk - 1], regStk[topStk]);
        }
        return;
    }

    if (exp->node_type == NODETYPE_NEGEXP) {
        evaluateExp(exp->children[0]);
        fprintf(fp, "\tadd %s, #1 \t@ negation of boolean\n", regStk[topStk-1]);
        fprintf(fp, "\tand %s, %s, #1\n", regStk[topStk - 1], regStk[topStk - 1]);
        return;
    }

    if (exp->node_type == NODETYPE_LEFTVALUE) {
        int index;
        struct SemanticData * type = NULL;
        for (index = 0; index < num_localVars; index++) {
            if (strcmp(localVars[index], exp->data.value.string_value)==0) {
                type = localVarsType[index];
                break;
            }
        }

        index=index>=num_localVars?-1:index;

        if (index == -1) {
            for (int i = 0; i < num_staticVars; i++) {
                if (strcmp(staticVars[i], exp->data.value.string_value)==0) {
                    type = (struct SemanticData *) staticVarsType[i];
                    break;
                }
            }
        }

        if (index == -1) {
            // STATIC
            fprintf(fp, "\tldr %s, =%s\n", regStk[topStk++], exp->data.value.string_value);
            if (storing && type->type!=DATATYPE_STR)
                fprintf(fp, "\tldr %s, [%s]\n", regStk[topStk - 2], regStk[topStk - 2]);
            if (!storing)
                fprintf(fp, "\tldr %s, [%s]\n", regStk[topStk - 1], regStk[topStk - 1]);
        } else {
            // LOCAL
            if (storing) {
                fprintf(fp, "\tadd %s, sp, #%d\n", regStk[topStk++], index*4);
            } else {
                fprintf(fp, "\tldr %s, [sp, #%d]\n", regStk[topStk++], index*4);
                // if (type->type == DATATYPE_STR) {
                //     fprintf(fp, "\tldr %s, [%s]\t@ it is a string we need to derefence\n", regStk[topStk - 1], regStk[topStk - 1]);
                // }
            }
        }

        // Dereference
        if (type->value.int_value > 0) {
            // GET OFFSET IF ARRAY
            struct ASTNode * tempPar = (exp->num_children>1)?exp->children[1]:NULL;

            struct ASTNode * exps[type->value.int_value];
            int num_exps = 0;

            while (tempPar != NULL) {
                exps[num_exps] = tempPar->children[0];
                num_exps++;
                (tempPar->num_children>1)?(tempPar=tempPar->children[1]):(tempPar=NULL);
            }

            if (num_exps > 0 && storing) {
                fprintf(fp, "\tldr %s, [%s]\n", regStk[topStk - 1], regStk[topStk - 1]);
            }

            for (int i = num_exps - 1; i > -1; i--) {
                bool store = storing;
                storing = false;
                evaluateExp(exps[i]);
                storing = store;
                fprintf(fp, "\tldr %s, =#4 \t@ consider size of the offset\n", regStk[topStk]);
                fprintf(fp, "\tadd %s, %s, #1 \t@ adding offset for the element in array passing the length\n", regStk[topStk - 1], regStk[topStk - 1]);
                fprintf(fp, "\tmul %s, %s, %s \n", regStk[topStk - 1], regStk[topStk - 1], regStk[topStk]);
                fprintf(fp, "\tadd %s, %s, %s \t@ adding offset for the element in array\n", regStk[topStk - 2], regStk[topStk - 2], regStk[topStk - 1]);
                topStk--;
                if ((i > 0 && exp->parent->node_type != NODETYPE_LEFTVALUELEN) || !storing)
                    fprintf(fp, "\tldr %s, [%s] @ test ldr %d\n", regStk[topStk - 1], regStk[topStk - 1], i);
            }
        }
    }

    if (exp->node_type == NODETYPE_BBINARY) {
        evaluateExp(exp->children[0]);
        evaluateExp(exp->children[1]);
        if (strcmp(exp->data.value.string_value, "&&") == 0) {
            fprintf(fp, "\tand %s, %s, %s\n", regStk[topStk - 2], regStk[topStk - 1], regStk[topStk - 2]);
        }
        if (strcmp(exp->data.value.string_value, "||") == 0) {
            fprintf(fp, "\torr %s, %s, %s\n", regStk[topStk - 2], regStk[topStk - 1], regStk[topStk - 2]);
        }
        topStk--;
    }

    if (exp->node_type == NODETYPE_IBINARYB) {
        evaluateExp(exp->children[0]);
        evaluateExp(exp->children[1]);
        fprintf(fp, "\tcmp %s, %s\n", regStk[topStk - 2], regStk[topStk - 1]);
        fprintf(fp, "\tmov %s, #0\n", regStk[--topStk - 1]);
        if (strcmp(exp->data.value.string_value, ">") == 0) {
            fprintf(fp, "\tmovgt %s, #1\n", regStk[topStk - 1]);
        }
        if (strcmp(exp->data.value.string_value, ">=") == 0) {
            fprintf(fp, "\tmovge %s, #1\n", regStk[topStk - 1]);
        }
        if (strcmp(exp->data.value.string_value, "==") == 0) {
            fprintf(fp, "\tmoveq %s, #1\n", regStk[topStk - 1]);
        }
        if (strcmp(exp->data.value.string_value, "!=") == 0) {
            fprintf(fp, "\tmovne %s, #1\n", regStk[topStk - 1]);
        }
        if (strcmp(exp->data.value.string_value, "<=") == 0) {
            fprintf(fp, "\tmovle %s, #1\n", regStk[topStk - 1]);
        }
        if (strcmp(exp->data.value.string_value, "<") == 0) {
            fprintf(fp, "\tmovlt %s, #1\n", regStk[topStk - 1]);
        }
    }

    if (exp->node_type == NODETYPE_IBINARY) {
        evaluateExp(exp->children[0]);
        evaluateExp(exp->children[1]);
        if (strcmp(exp->data.value.string_value, "+") == 0) {
            if (ExpType(exp->children[0])->type == DATATYPE_INT) {
                fprintf(fp, "\tadd %s, %s, %s\n", regStk[topStk - 2], regStk[topStk - 2], regStk[topStk - 1]);
            } else {
                fprintf(fp, "\n\t@String Concatenation\n");
                // SAVE ALL THE VALUES IN REG STK
                topStk>0?fprintf(fp, "\n\t@ SAVE ALL THE ACTIVE REGISTERS\n"):0;
                for (int i = 0; i < topStk; i++) {
                    fprintf(fp, "\tstr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
                }

                // GET SIZES FIRST WITH STRLEN
                fprintf(fp, "\t@ get sizes of strings with strlens\n");
                fprintf(fp, "\tmov %s, %s\t@ store 1st parameter\n", regArgs[0], regStk[topStk - 2]);
                fprintf(fp, "\tbl strlen\n");
                fprintf(fp, "\tstr %s, [sp, #%d]\n", regArgs[0], (num_localVars + num_args + topStk)*4);

                fprintf(fp, "\tldr %s, [sp, #%d]\t@ store 1st parameter\n", regArgs[0], (num_localVars + num_args + topStk - 1)*4);
                fprintf(fp, "\tbl strlen\n");

                // ADD THE SIZES WITH EACH OTHER AND 1 TO GET TOTAL SIZE
                fprintf(fp, "\t@ get total size through addition\n");
                fprintf(fp, "\tldr %s, [sp, #%d]\n", regArgs[1], (num_localVars + num_args + topStk)*4);
                fprintf(fp, "\tadd %s, %s, %s\n", regArgs[0], regArgs[0], regArgs[1]);
                fprintf(fp, "\tadd %s, %s, #1\n", regArgs[0], regArgs[0]);

                // MALLOC WITH THE CALCULATED SIZE
                fprintf(fp, "\t@ MALLOC A DYNAMIC STRING ADDRESS\n");
                fprintf(fp, "\tbl malloc\n");

                // STRCPY
                fprintf(fp, "\t@ copy the old const char * to the dynamic malloc\n");
                fprintf(fp, "\tldr %s, [sp, #%d]\n", regArgs[1], (num_localVars + num_args + topStk - 2)*4);
                fprintf(fp, "\tbl strcpy\n");

                // STRCAT
                fprintf(fp, "\n\t@ strcat the const char * 2 to the dynamic copied malloc\n");
                fprintf(fp, "\tldr %s, [sp, #%d]\n", regArgs[1], (num_localVars + num_args + topStk - 1)*4);
                fprintf(fp, "\tbl strcat\n");

                topStk - 2>0?fprintf(fp, "\n\t@ RECOVER ALL THE ACTIVE REGISTERS\n"):0;
                for (int i = 0; i < topStk - 2 ; i++) {
                    fprintf(fp, "\tldr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
                }

                fprintf(fp, "\t@ move result to stack\n\tmov %s, r0\n", regStk[topStk - 2]);
            }
        }
        if (strcmp(exp->data.value.string_value, "-") == 0) {
            fprintf(fp, "\tsub %s, %s, %s\n", regStk[topStk - 2], regStk[topStk - 2], regStk[topStk - 1]);
        }
        if (strcmp(exp->data.value.string_value, "*") == 0) {
            fprintf(fp, "\tmul %s, %s, %s\n", regStk[topStk - 2], regStk[topStk - 2], regStk[topStk - 1]);
        }
        topStk--;
        return;
    }

    if (exp->node_type == NODETYPE_EXP || exp->node_type == NODETYPE_PEXPP) {
        evaluateExp(exp->children[0]);
    }

    if (exp->node_type == NODETYPE_METHODCALL) {
        buildtoMethodCall(exp);
    }

    if (exp->node_type == NODETYPE_NEW) {
        // TODO
        fprintf(fp, "\t@ need to malloc an array\n");

        struct ASTNode * tempPar = exp->children[1];

        struct ASTNode * exps[MAX_STK];
        int num_exps = 0;

        // GET ORDER OF INDEX EXPRESSIONS
        while (tempPar != NULL) {
            if (num_args < nregArgs) {
                exps[num_exps] = tempPar->children[0];
                num_exps++;
            } else {
                printf("TOO MANY ARGUMENTS\n");
                break;
            }
            (tempPar->num_children>1)?(tempPar=tempPar->children[1]):(tempPar=NULL);
        }
        // ORGANIZE ARGUMENTS IN ARRAY AND OFFSET
        
        for (int i = num_exps - 1; i > -1; i--) {
            if (i == num_exps - 1) {
                fprintf(fp, "\n");
                evaluateExp(exps[i]);
                // Add size value
                fprintf(fp, "\tadd %s, %s, #1\t@ add space for length of dimension element\n", regStk[topStk], regStk[topStk - 1]);
                // SIZE SHOULD BE TIMES 4
                fprintf(fp, "\tldr %s, =#4\n", regStk[topStk + 1]);
                fprintf(fp, "\tmul %s, %s, %s\t@ size by the byte size\n", regStk[topStk], regStk[topStk], regStk[topStk + 1]);
                fprintf(fp, "\tmov r0, %s \t@ move to r0 for malloc\n", regStk[topStk]);
                topStk>0?fprintf(fp, "\n\t@ SAVE ALL THE ACTIVE REGISTERS\n"):0;
                for (int i = 0; i < topStk; i++) {
                    fprintf(fp, "\tstr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
                }
                fprintf(fp, "\tbl malloc\n");

                topStk>0?fprintf(fp, "\n\t@ RECOVER ALL THE ACTIVE REGISTERS\n"):0;
                for (int i = 0; i < topStk; i++) {
                    fprintf(fp, "\tldr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
                }

                fprintf(fp, "\tstr %s, [r0, #0]\n", regStk[topStk - 1]);
                fprintf(fp, "\tmov %s, #1 \t@ basic for loop to malloc all necessary spots\n", regStk[topStk++]);
                fprintf(fp, "\tmov %s, r0 \t@ register in array element\n", regStk[topStk++]);
            } else {
                fprintf(fp, "\n");
                fprintf(fp, "L%d:\n", num_id++);

                fprintf(fp, "\tcmp %s, %s\n", regStk[topStk - 3], regStk[topStk - 2]);
                fprintf(fp, "\tblt endL%d\n", num_id - 1);

                evaluateExp(exps[i]);
                // Add size value
                fprintf(fp, "\tadd %s, %s, #1\t@ add space for length of dimension element\n", regStk[topStk], regStk[topStk - 1]);
                // SIZE SHOULD BE TIMES 4
                fprintf(fp, "\tldr %s, =#4\n", regStk[topStk + 1]);
                fprintf(fp, "\tmul %s, %s, %s\t@ size by the byte size\n", regStk[topStk], regStk[topStk], regStk[topStk + 1]);
                fprintf(fp, "\tmov r0, %s \t@ move to r0 for malloc\n", regStk[topStk]);
                topStk>0?fprintf(fp, "\n\t@ SAVE ALL THE ACTIVE REGISTERS\n"):0;
                for (int i = 0; i < topStk; i++) {
                    fprintf(fp, "\tstr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
                }
                fprintf(fp, "\tbl malloc\n");

                topStk>0?fprintf(fp, "\n\t@ RECOVER ALL THE ACTIVE REGISTERS\n"):0;
                for (int i = 0; i < topStk; i++) {
                    fprintf(fp, "\tldr %s, [sp, #%d]\n", regStk[i], (num_localVars + num_args + i)*4);
                }

                fprintf(fp, "\tstr %s, [r0, #0]\n", regStk[topStk - 1]);
                // fprintf(fp, "\tmov %s, #1 \t@ basic for loop to malloc all necessary spots\n", regStk[topStk - 1]);
                // fprintf(fp, "\tmov %s, r0 \t@ register in array element\n", regStk[topStk++]);
                fprintf(fp, "\tldr %s, =#4\n", regStk[topStk - 1]);
                fprintf(fp, "\tmul %s, %s, %s\n", regStk[topStk - 1], regStk[topStk - 1], regStk[topStk - 3]);
                fprintf(fp, "\tstr r0, [%s, %s]\n", regStk[topStk - 2], regStk[topStk - 1]);
                fprintf(fp, "\tadd %s, %s, #1 \t@ move to next element\n", regStk[topStk - 3], regStk[topStk - 3]);
                fprintf(fp, "\tb L%d\n", num_id - 1);
                topStk = 3;
            }
        }

        (num_exps>1)?fprintf(fp, "\nendL%d:\n", num_id - 1):0;
        fprintf(fp, "\tmov %s, %s\t@ move array to top of stack\n", regStk[0], regStk[topStk - 1]);
        topStk = 1;

        fprintf(fp, "\t@ end of new array\n\n");
    }

    if (exp->node_type == NODETYPE_LEFTVALUELEN) {
        evaluateExp(exp->children[0]);
        fprintf(fp, "\t@ need get length of an array\n");
        fprintf(fp, "\tldr %s, [%s]\n", regStk[topStk - 1], regStk[topStk - 1]);
    }
}

void buildStatement(struct ASTNode * statement, int method) {
    
    statement->node_type==NODETYPE_STATEMENTINIT&&statement->num_children>0?buildStatement(statement->children[0], method):0;
    statement->node_type==NODETYPE_STATEMENTINIT&&statement->num_children>1?buildStatement(statement->children[1], method):0;
    
    statement->node_type==NODETYPE_STATICVARDECLINIT?buildStatement(statement->children[0], method):0;
    statement->node_type==NODETYPE_STATICVARDECLINIT&&statement->num_children>1?buildStatement(statement->children[1], method):0;
    
    if (statement->node_type == NODETYPE_METHODCALL) {
        buildtoMethodCall(statement);
        topStk--;
    }

    if (statement->node_type == NODETYPE_VARDECL || statement->node_type == NODETYPE_STATICVARDECL) {
        // check if it is static var
        fprintf(fp, "\n\t@ begin variable declaration of %s\n", statement->data.value.string_value);
        int index;
        for (index = 0; index < num_staticVars; index++) {
            if(strcmp(statement->data.value.string_value, staticVars[index])==0) {
                break;
            }
        }
        index>=num_staticVars?index=-1:0;

        // if local we need to add to stack
        (statement->num_children>1)?evaluateExp(statement->children[1]):fprintf(fp, "\tldr %s, =#0\n", regStk[topStk++]);
        if (index == -1) {
            struct SemanticData* type = extractTypeData(statement->children[0]);
            // Check if already declared
            for (index = 0; index < num_localVars; index++) {
                if (strcmp(localVars[index], statement->data.value.string_value)==0) {
                    type = localVarsType[index];
                    break;
                }
            }
            if (index >= num_localVars) {
                addToLocal(statement->data.value.string_value, type);
                fprintf(fp, "\tstr %s, [sp, #%d] \t@ storing for %s\n", regStk[--topStk], (num_localVars-1)*4, statement->data.value.string_value);
            } else {
                fprintf(fp, "\tstr %s, [sp, #%d] \t@ storing for %s\n", regStk[--topStk], (index)*4, statement->data.value.string_value);
            }
        } else {
            fprintf(fp, "\tldr %s, =%s\n\tstr %s, [%s, #0]\t@ storing static variable\n", regStk[topStk], staticVars[index], regStk[topStk - 1], regStk[topStk]);
            topStk--;
        }

        fprintf(fp, "\t@ end variable declaration of %s\n\n", statement->data.value.string_value);
        // IF IT HAS INLINE DECLARATIONS
        statement->children[statement->num_children - 1]->node_type==NODETYPE_STATICVARDECL?buildStatement(statement->children[statement->num_children - 1], method):NULL;
        return;
    }

    if (statement->node_type == NODETYPE_PRINT) {
        fprintf(fp, "\t@ begin of print\n");
        storing = false;
        struct SemanticData * type = ExpType(statement->children[0]);
        if (type->type == DATATYPE_INT) {
            // GET VALUE EXP
            evaluateExp(statement->children[0]);
            fprintf(fp, "\tldr r0, =iprint\n\tmov r1, %s\t@ recovering exp value from top of stack\n\n\tbl printf\n\n", regStk[--topStk]);
        }
        if (type->type == DATATYPE_STR) {
            // GET VALUE EXP
            evaluateExp(statement->children[0]);
            fprintf(fp, "\tldr r0, =sprint\n\tmov r1, %s\t@ recovering exp value from top of stack\n", regStk[--topStk]);
            fprintf(fp, "\n\tbl printf\n");
        }
        if (type->type == DATATYPE_BOOLEAN) {
            evaluateExp(statement->children[0]);
            fprintf(fp, "\tldr r0, =sprint\n\tcmp %s, #1\n\tldreq r1, =true\t@ loading the true string\n\tldrne r1, =false\t@ loading the false string\n", regStk[--topStk]);
            fprintf(fp, "\n\tbl printf\n");
        }
        fprintf(fp, "\t@ end of print\n");
        fprintf(fp, "\n");
        return;
    }

    if (statement->node_type == NODETYPE_PRINTLN) {
        fprintf(fp, "\t@ begin of println\n");
        struct SemanticData * type = ExpType(statement->children[0]);
        if (type->type == DATATYPE_INT) {
            // GET VALUE EXP
            evaluateExp(statement->children[0]);
            fprintf(fp, "\tldr r0, =iprintln\n\tmov r1, %s\t@ recovering exp value from top of stack\n\n\tbl printf\n\n", regStk[--topStk]);
        }
        if (type->type == DATATYPE_STR) {
            // GET VALUE EXP
            evaluateExp(statement->children[0]);
            fprintf(fp, "\tldr r0, =sprintln\n\tmov r1, %s\t@ recovering exp value from top of stack\n", regStk[--topStk]);
            fprintf(fp, "\n\tbl printf\n");
        }
        if (type->type == DATATYPE_BOOLEAN) {
            evaluateExp(statement->children[0]);
            fprintf(fp, "\tldr r0, =sprintln\n\tcmp %s, #1\n\tldreq r1, =true\t@ loading the true string\n\tldrne r1, =false\t@ loading the false string\n", regStk[--topStk]);
            fprintf(fp, "\n\tbl printf\n");
        }
        fprintf(fp, "\t@ end of println\n");
        fprintf(fp, "\n");
        return;
    }

    if (statement->node_type == NODETYPE_LEFTVALUE) {
        // get variable should be topStk - 2 if staticVar
        fprintf(fp, "\t@ begin redefinition of %s\n", statement->children[0]->data.value.string_value);

        // Need new value for variable
        evaluateExp(statement->children[1]);
        
        // Get the value to be replaced
        storing = true;
        evaluateExp(statement->children[0]);
        storing = false;

        // if staticVar variable else local variable
        fprintf(fp, "\tstr %s, [%s, #0] \n", regStk[topStk - 2], regStk[topStk - 1]);
        topStk--;
        topStk--;

        fprintf(fp, "\t@ end redefinition of %s\n", statement->children[0]->data.value.string_value);
        fprintf(fp, "\n");
        return;
    }

    if (statement->node_type == NODETYPE_RETURN) {
        evaluateExp(statement->children[0]);
        fprintf(fp, "\tmov r0, %s \t@ value to return\n", regStk[--topStk]);
        fprintf(fp, "\tb end%s\n", strcmp(symbol_table[method]->id, "main")!=0?symbol_table[method]->id:"methodmain");
    }

    if (statement->node_type == NODETYPE_IF) {
        // IF STATEMENTS
        int id_inprint = num_id;
        num_id++;

        fprintf(fp, "\t@ begin of if statement\n");
        evaluateExp(statement->children[0]);
        fprintf(fp, "\tcmp %s, #1\n", regStk[--topStk]);
        fprintf(fp, "\tbeq L%d\n", id_inprint);
        fprintf(fp, "\t@ begin of else statement\n");
        // Print the else statement
        buildStatement(statement->children[2], method);
        fprintf(fp, "\tb endL%d\n", id_inprint);
        fprintf(fp, "\t@ end of else statement\n");
        fprintf(fp, "\nL%d:\n", id_inprint);
        buildStatement(statement->children[1], method);
        fprintf(fp, "\t@ end of if statement\n");
        fprintf(fp, "\nendL%d:\n", id_inprint);
    }

    if (statement->node_type == NODETYPE_WHILE) {
        // WHILE STATEMENTS
        int id_inprint = num_id;
        num_id++;

        fprintf(fp, "\t@ begin of while statement\n");
        fprintf(fp, "L%d:\n", id_inprint);
        evaluateExp(statement->children[0]);
        fprintf(fp, "\tcmp %s, #1\n", regStk[--topStk]);
        fprintf(fp, "\tbne endL%d\n", id_inprint);
        buildStatement(statement->children[1], method);
        fprintf(fp, "\tb L%d\n", id_inprint);
        fprintf(fp, "\t@ end of while statement\n");
        fprintf(fp, "\nendL%d:\n", id_inprint);
    }
}

void InitializeMethod(int method) {
    int allocateBytes = MAX_VARS + MAX_ARGS;
    strcmp(symbol_table[method]->id, "main")!=0?fprintf(fp, "%s:\n", symbol_table[method]->id):fprintf(fp, "methodmain:\n");
    fprintf(fp, "\tpush {lr}\n\n\t@ allocate stack for function\n\tsub sp, sp, #%d\n", 4 * allocateBytes);

    //  store arguments
    // SAVE ALL ARGUMENT NAMES
    struct ASTNode * tempPar = (symbol_table[method]->node->num_children>1 && symbol_table[method]->node->children[1]->node_type == NODETYPE_FORMALLIST)?symbol_table[method]->node->children[1]:NULL;
    while (tempPar != NULL) {
        if (num_args < nregArgs) {
            args[num_args] = tempPar->data.value.string_value;
            argsType[num_args] = extractTypeData(tempPar->children[0]);
            num_args++;
        } else {
            printf("TOO MANY ARGUMENTS\n");
            break;
        }
        (tempPar->num_children>1)?(tempPar=tempPar->children[1]):(tempPar=NULL);
    }
    // ORGANIZE ARGUMENTS IN ARRAY AND OFFSET
    // SAVE ARRAYS IN OFFSET AS ith is size and i+1th is pointer to array

    fprintf(fp, "\n\t@ Save all arguments on stack\n");
    if (num_args > 0) {
        fprintf(fp, "\tstr %s, [sp, #%d]\t@ store %s parameter\n", regArgs[0], 0, args[0]);
        addToLocal(args[0], argsType[0]);
    }
    for (int i = 1; i < num_args; i++) {
        fprintf(fp, "\tstr %s, [sp, #%d]\t@ store %s parameter\n", regArgs[i], i*4, args[num_args - i]);
        addToLocal(args[i], argsType[0]);
    }

    fprintf(fp, "\t@ Saved all arguments\n");
    fprintf(fp, "\n");

    // Procedure inside statement
    symbol_table[method]->node->children[symbol_table[method]->node->num_children - 1]->node_type==NODETYPE_STATEMENTINIT ? buildStatement(symbol_table[method]->node->children[symbol_table[method]->node->num_children - 1], method):0;

    // return sp to before
    strcmp(symbol_table[method]->id, "main")!=0?fprintf(fp, "end%s:\n", symbol_table[method]->id):fprintf(fp, "endmethodmain:\n");
    fprintf(fp, "\tadd sp, sp, #%d\n\tpop {pc}\n", 4 * allocateBytes);

    strcmp(symbol_table[method]->id, "main") == 0?0:fprintf(fp, "\n\tbx lr\n");

    fprintf(fp, "@ end of %s function\n\n", symbol_table[method]->id);

    num_args = 0;
    num_localVars = 0;
}

void startPlaceholderFile() {
    declareAllStaticVars();

    defineStaticText();


    fprintf(fp, "\n.global main\n.balign 4\nmain:\n\tpush {lr}\n\tsub r0, r0, #1\n\tstr r0, [r1, #0]\t@ store size in &argv[0] so that the argv array starts at &argv[1] for main\n\tmov r0, r1\n");

    // UPDATE THE STATIC VARS IF DECLARED
    (root->children[0]->num_children>1&&root->children[0]->children[0]->node_type==NODETYPE_STATICVARDECLINIT)?buildStatement(root->children[0]->children[0], -1):NULL;

    // Jump to method defined main
    fprintf(fp, "\tbl methodmain\n\tpop {pc}\n\n");

    fprintf(fp, "\n.global %s\n.balign 4\n", "methodmain");
    for (int i = num_methods - 1; i >= 0; i--) {
        // printf("%s\n", symbol_table[methodsInSymbolTable[i - 1]]->id);
        InitializeMethod(methodsInSymbolTable[i]);
    }

    num_strings>0?fprintf(fp, ".section .text\n"):0;
    for (int i = 0; i < num_strings; i++) {
        fprintf(fp, "string%d: .asciz %s\n", i, strings[i]);
    }
}

void generate(int argc, char * argv []) {
    // To write to the current directory

    const char * name = PHOLDERFILE;
    char * file = strdup("");
    strcat(file, folderName);
    strcat(file, name);

    fp = fopen(file, "w");
    if(fp == NULL) {
        printf("File can't be opened\n");
        exit(1);
    }
    // StartPlaceholder
    startPlaceholderFile();
    fclose(fp);
    // FINISHED PLACEHOLDER

    makeARM(argc, argv);
}

void makeARM(int argc, char * argv []) {
    // IMPROVE REGISTER ALLOCATION
    char *file = strdup("");
    strcat(file, folderName);

    char * name = strdup(argv[1]);
    char * tok = strtok(name, "/");
    while (tok != NULL) {
        name = tok;
        tok = strtok(NULL, "/");
    }
    // Remove .java from name
    name[strlen(name) - 5] = '\0';

    // Name the ARM by class name
    // name = strdup(root->children[0]->data.value.string_value);

    // Cap name length
    // (strlen(name) + 1)>4?name[7]='\0':0;
    name = strcat(name, ".s");

    strcat(file, name);

    fp = fopen(file, "w");
    file = strdup("");
    strcat(file, folderName);
    strcat(file, PHOLDERFILE);
    ph = fopen(file, "r");
    if(fp == NULL || ph == NULL) {
        printf("File can't be opened\n");
        exit(1);
    }

    if (EFFICIENT)
        impoveARM();
    else
        pastePlaceHolder();

    if (REMOVEPHOLDER) {
        file = strdup("");
        if (TOFOLDER) {
            strcat(file, folderName);
        }
        strcat(file, PHOLDERFILE);
        if(remove(file))
            printf("\nUnable to delete file!");
    }

    fclose(fp);
    fclose(ph);
}

int main(int argc, char* argv[] )
{

    // Checks for syntax errors and constructs AST
    if (parse(argc, argv) != 0)
        return -1;
    // Traverse the AST to check for semantic or type errors
    checkProgram(root);

    folderName = strdup("");
    if (TOFOLDER)
        folderName = strdup(OUTFOLDER);


    // Generates an equivalent ARM Assembly code traversing the AST
    if (num_errors > 0) {return -1;}
    generate(argc, argv);
    
    return 1;
}