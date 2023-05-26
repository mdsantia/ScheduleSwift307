#include "typecheck.h"
#include "node.h"
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

int num_errors = 0;
int num_entries = 0;
int num_methods = 0;
struct SymbolTableEntry *symbol_table[50];
int* methodsInSymbolTable;

static void report_type_violation(int line_number) {
    fprintf(stderr, "Type Violation in Line %d\n", line_number);
    num_errors++;
}

void checkProgram(struct ASTNode * program){
    num_entries = 0;
    methodsInSymbolTable = malloc(sizeof(int)*8);
    checkMain(program->children[program->num_children-1]);
}

void checkMain(struct ASTNode * mainClass){
    char * nameOfClass = mainClass -> data.value.string_value;
    // METHOD
    struct ASTNode* method=(mainClass->children[0]->node_type==NODETYPE_STATICMETHODDECLINIT)?mainClass->children[0]: NULL;
    method=(mainClass->num_children>1 && mainClass->children[1]->node_type==NODETYPE_STATICMETHODDECLINIT)?mainClass->children[1]:method;
    (method!=NULL)?checkStaticMethodDeclInit(mainClass, method):0;
    // STATIC VAR DECL
    (mainClass->children[0]->node_type!=NODETYPE_VARDECL && mainClass->children[0]->node_type==NODETYPE_STATICVARDECLINIT)? checkStaticVarDeclInit(mainClass , mainClass->children[0]):0;
    // ADDING MAIN TO TABLE
    checkStaticMethodDecl(mainClass, mainClass->children[mainClass->num_children - 1]);
    checkFormalLists();
    // for (int i = 0; i < num_entries; i++) {
    //     // printf("ID %s TYPE %d DIM %d LINE %d\n", symbol_table[i]->id, symbol_table[i]->type->type, symbol_table[i]->type->value.int_value, symbol_table[i]->linenumber);
    //     printf("%p\n", symbol_table[i]->scope);
    // }
}

void checkStaticVarDecl(struct ASTNode * scope, struct ASTNode* StaticVarDecl) {
    char * id = StaticVarDecl->data.value.string_value;
    struct SemanticData * var_type = extractTypeData(StaticVarDecl -> children[0]);
    struct SemanticData * exp_type = NULL;
    (StaticVarDecl->num_children > 1 && StaticVarDecl->children[1]->node_type==NODETYPE_EXP)? exp_type = ExpType(StaticVarDecl->children[1]->children[0]):NULL;
    variableDeclTest(scope, StaticVarDecl, var_type, exp_type);
    if (StaticVarDecl->num_children > 1)
        if (StaticVarDecl->children[StaticVarDecl->num_children - 1]->node_type == NODETYPE_STATICVARDECL)
            checkStaticVarTail(scope, StaticVarDecl->children[StaticVarDecl->num_children - 1]);
}

void checkStaticVarTail(struct ASTNode * scope, struct ASTNode * StaticVarTail) {
    struct SemanticData * var_type = extractTypeData(StaticVarTail -> children[0]);
    struct SemanticData * exp_type = NULL;
    (StaticVarTail->num_children > 1 && StaticVarTail->children[1]->node_type==NODETYPE_EXP)? exp_type = ExpType(StaticVarTail->children[1]->children[0]):NULL;
    variableDeclTest(scope, StaticVarTail, var_type, exp_type);
    if (StaticVarTail -> children[ StaticVarTail -> num_children - 1]->node_type == NODETYPE_STATICVARDECL) {
        checkStaticVarTail(scope, StaticVarTail -> children[ StaticVarTail -> num_children - 1]);
    }
}

void checkStaticVarDeclInit(struct ASTNode * scope, struct ASTNode* StaticVarDeclInit) {
    for (int i = 0; i < StaticVarDeclInit->num_children; i++) {
        enum NodeType t = StaticVarDeclInit->children[i]->node_type;
        if (t == NODETYPE_STATICVARDECLINIT) {
            // Works for vardecltail
            checkStaticVarDeclInit(scope, StaticVarDeclInit->children[i]);
        } else {
            checkStaticVarDecl(scope, StaticVarDeclInit -> children[i]);
        }
    }
}

void checkStaticMethodDecl(struct ASTNode * scope, struct ASTNode* StaticMethodDecl) {
    struct SemanticData* typeData = extractTypeData(StaticMethodDecl->children[0]);
    if (!varInTable(StaticMethodDecl, typeData)) {
        add_to_symbol_table(scope, StaticMethodDecl, StaticMethodDecl->data.value.string_value, typeData, StaticMethodDecl->linenumber);
        methodsInSymbolTable[num_methods] = num_entries - 1;
        num_methods++;
    }
}

void checkStaticMethodDeclInit(struct ASTNode * scope, struct ASTNode* StaticMethodDeclInit) {
    if (StaticMethodDeclInit->node_type==NODETYPE_VARDECL) {
        return;
    }
    for (int i = 0; i < StaticMethodDeclInit->num_children; i++) {
        enum NodeType t = StaticMethodDeclInit->children[i]->node_type;
        if (t == NODETYPE_STATICMETHODDECLINIT) {
            // Works for vardecltail
            checkStaticMethodDeclInit(scope, StaticMethodDeclInit->children[i]);
        } else {
            checkStaticMethodDecl(scope, StaticMethodDeclInit->children[i]);
        }
    }
}

struct SemanticData * ExpType(struct ASTNode * Exp) {
    struct SemanticData* dim = NULL;
    if (Exp==NULL) return NULL;
    if (Exp->node_type == NODETYPE_EXPEND) {
        dim = malloc(sizeof(struct SemanticData));
        dim->value.int_value = 0;
        dim->type = Exp->data.type;
        return dim;
    }
    if (Exp->node_type == NODETYPE_NEGEXP || Exp->node_type == NODETYPE_SEXP || Exp->node_type == NODETYPE_PEXPP) {
        struct SemanticData * dim = ExpType(Exp->children[0]);
        if (Exp->node_type == NODETYPE_NEGEXP && (dim->type != DATATYPE_BOOLEAN && dim->type != DATATYPE_UNDEFINED)) {
            dim->type = DATATYPE_UNDEFINED;
            report_type_violation(Exp->linenumber);
        }
        if (Exp->node_type == NODETYPE_SEXP && (dim->type != DATATYPE_INT && dim->type != DATATYPE_UNDEFINED)) {
            dim->type = DATATYPE_UNDEFINED;
            report_type_violation(Exp->linenumber);
        }
        return dim;
    }
    if (Exp->node_type == NODETYPE_LEFTVALUELEN) {
        if (ExpType(Exp->children[0])->value.int_value < 1) {
            report_type_violation(Exp->linenumber);
        }
        dim = malloc(sizeof(struct SemanticData));
        dim->type = DATATYPE_INT;
        dim->value.int_value = 0;
    }
    if (Exp->node_type == NODETYPE_LEFTVALUE) {
        // Check all variables with appropriate name to find one in the scope, ideally dim - index = new dim
        dim = malloc(sizeof(struct SemanticData));
        int index = isDeclInScope(Exp, Exp->data.value.string_value, false);
        if (index < 0) {
            report_type_violation(Exp->linenumber);
            dim->type = DATATYPE_UNDEFINED;
        } else {
            // printf("%d\n", symbol_table[index]->node->node_type);
            if (symbol_table[index]->node != NULL && symbol_table[index]->node->node_type == NODETYPE_STATICMETHODDECL) {
                report_type_violation(Exp->linenumber);
                dim->type = DATATYPE_UNDEFINED;
            }
            struct SemanticData * entryData = symbol_table[index]->type;
            dim->type = entryData->type;
            struct ASTNode * tempPar = (Exp->num_children>1)?Exp->children[1]:NULL;

            int num_exps = 0;

            while (tempPar != NULL) {
                num_exps++;
                (tempPar->num_children>1)?(tempPar=tempPar->children[1]):(tempPar=NULL);
            }

            dim->value.int_value = entryData->value.int_value - num_exps;
        }
        // while all Exp children are int
        struct ASTNode * temp = Exp->num_children>1?Exp->children[1]:NULL;
        while (temp != NULL) {
            if (ExpType(temp->children[0])->type != DATATYPE_INT) {
                report_type_violation(temp->linenumber);
            }
            temp=temp->num_children>1?temp->children[1]:NULL;
        }
    }
    if (Exp->node_type == NODETYPE_METHODCALL) {
        dim = checkMethod(Exp->children[0]);
    }
    if (Exp->node_type == NODETYPE_NEW) {
        dim = malloc(sizeof(struct SemanticData));

        int num_exps = 0;

        dim->type = Exp->children[0]->data.type;
        struct ASTNode * index = Exp->children[1];
        struct ASTNode * tempIndex = index;
        while (tempIndex != NULL) {
            struct SemanticData * type = ExpType(tempIndex->children[0]);
            num_exps++;
            if (type->type != DATATYPE_INT || type->value.int_value != 0) {
                report_type_violation(tempIndex->children[0]->linenumber);
                break;
            }
            tempIndex=tempIndex->children[1];
        }
        dim->value.int_value = num_exps;
        return dim;
    }
    
    if (Exp->node_type == NODETYPE_IBINARY || Exp->node_type == NODETYPE_IBINARYB) {
        struct SemanticData * dim1 = ExpType(Exp->children[0]);
        struct SemanticData * dim2 = ExpType(Exp->children[1]);
        // Should we account for the new PrimeType Index dimensionality?
        dim = dim1;
        if (strcmp(Exp->data.value.string_value, "+") == 0) {
            if (dim1->type != dim2->type || (dim1->type != DATATYPE_INT && dim1->type != DATATYPE_STR) || dim1->value.int_value != dim2->value.int_value || dim1->value.int_value != 0) {
                if (dim1->type != DATATYPE_UNDEFINED && dim2->type != DATATYPE_UNDEFINED) {
                    report_type_violation(Exp->children[1]->linenumber);
                    dim->type = DATATYPE_UNDEFINED;
                }
            }
        } else {
            if (dim1->type != dim2->type || dim1->type != DATATYPE_INT || dim1->value.int_value != dim2->value.int_value || dim1->value.int_value != 0) {
                if (dim1->type != DATATYPE_UNDEFINED && dim2->type != DATATYPE_UNDEFINED) {
                    printf("first %d second %d\n", dim1->value.int_value, dim2->value.int_value);
                    report_type_violation(Exp->children[1]->linenumber);
                    dim->type = DATATYPE_UNDEFINED;
                }
            }
            if (Exp->node_type == NODETYPE_IBINARYB) {
                dim->type = DATATYPE_BOOLEAN;
            }
        }
    }
    if (Exp->node_type == NODETYPE_BBINARY) {
        struct SemanticData * dim1 = ExpType(Exp->children[0]);
        struct SemanticData * dim2 = ExpType(Exp->children[1]);
        // Should we account for the new PrimeType Index dimensionality?
        dim = dim1;
        if (dim1->type != dim2->type || dim1->type != DATATYPE_BOOLEAN || dim1->value.int_value != dim2->value.int_value || dim1->value.int_value != 0) {
            if (dim1->type != DATATYPE_UNDEFINED && dim2->type != DATATYPE_UNDEFINED) {
                report_type_violation(Exp->children[1]->linenumber);
                dim->type = DATATYPE_UNDEFINED;
            }
        }
    }
    if (Exp->node_type == NODETYPE_BINARY || Exp->node_type == NODETYPE_BINARYB) {
        struct SemanticData * dim1 = ExpType(Exp->children[0]);
        struct SemanticData * dim2 = ExpType(Exp->children[1]);
        // Should we account for the new PrimeType Index dimensionality?
        dim = dim1;
        if (dim1->type != dim2->type || dim1->value.int_value != dim2->value.int_value || dim1->value.int_value != 0) {
            if (dim1->type != DATATYPE_UNDEFINED && dim2->type != DATATYPE_UNDEFINED) {
                report_type_violation(Exp->children[1]->linenumber);
                dim->type = DATATYPE_UNDEFINED;
            }
        }
        if (Exp->node_type == NODETYPE_BINARYB) {
            dim->type = DATATYPE_BOOLEAN;
        }
    }

    return dim;
}

void checkStatementInit(struct ASTNode* scope, struct ASTNode* statement, struct ASTNode* method){
    for (int i = 0; i < statement->num_children; i++) {
        enum NodeType t = statement->children[i]->node_type;
        if (t == NODETYPE_STATEMENTINIT) {
            // Works for vardecltail
            checkStatementInit(scope, statement->children[i], method);
        } else {
            checkStatement(scope, statement -> children[i], method);
        }
    }
}

void checkStatement(struct ASTNode* scope, struct ASTNode* statement, struct ASTNode* method) {
    statement->node_type==NODETYPE_STATEMENTINIT?checkStatementInit(scope, statement, method):0;
    statement->node_type == NODETYPE_METHODCALL?checkMethod(statement->children[0]):0;
    if (statement->node_type == NODETYPE_VARDECL || statement->node_type == NODETYPE_STATICVARDECL) {
        struct ASTNode* temp = statement;
        struct SemanticData* typeData = extractTypeData(temp->children[0]);
        while(temp != NULL) {
            struct ASTNode * expr = (temp->num_children>1 && temp->children[1]->node_type==NODETYPE_EXP)?temp->children[1]:NULL;
            struct SemanticData * expType = (expr != NULL && expr->num_children>0 && expr->node_type == NODETYPE_EXP)?ExpType(expr->children[0]):NULL;
            if (expr != NULL && expr->num_children==0) {
                expType = malloc(sizeof(struct SemanticData));
                expType->type = typeData->type;
                expType->value.int_value = 0;
            }
            variableDeclTest(scope, temp, typeData, expType);
            temp=(temp->num_children>1 && temp->children[temp->num_children - 1]->node_type == NODETYPE_STATICVARDECL)?temp->children[temp->num_children - 1]:NULL;
        }
    }
    if (statement->node_type == NODETYPE_IF || statement->node_type == NODETYPE_WHILE) {
        struct SemanticData* exprType = ExpType(statement->children[0]);
        if (exprType->type != DATATYPE_BOOLEAN) {
            report_type_violation(statement->children[0]->linenumber);
        }
        statement->num_children>1?checkStatement(statement->children[1], statement->children[1], method):0;
        statement->num_children>2?checkStatement(statement->children[2], statement->children[2], method):0;
    }
    if (statement->node_type == NODETYPE_PRINT || statement->node_type == NODETYPE_PRINTLN) {
        struct SemanticData * type = ExpType(statement->children[0]);
        if (type->type!=DATATYPE_UNDEFINED && type->value.int_value != 0) {
            report_type_violation(statement->children[0]->linenumber);
        }
        
    }
    if (statement->node_type == NODETYPE_RETURN) {
        struct SemanticData* methodType = extractTypeData(method->children[0]);
        struct SemanticData* returnType = (statement->num_children > 0)?ExpType(statement->children[0]):NULL;
        if (returnType != NULL && methodType->type == DATATYPE_VOID)
            report_type_violation(statement->children[0]->linenumber);
        else if (returnType != NULL && (methodType->type != returnType->type || methodType->value.int_value != returnType->value.int_value)) {
            report_type_violation(statement->children[0]->linenumber);
        }
    }
    if (statement->node_type == NODETYPE_LEFTVALUE) {
        struct SemanticData * expType = ExpType(statement->children[1]);
        int index = isDeclInScope(statement->children[0],statement->children[0]->data.value.string_value,false);
        if (index < 0 || (symbol_table[index]->type->type != expType->type && expType->type != DATATYPE_UNDEFINED)) {
            report_type_violation(statement->linenumber);
        }
    }
}

struct SemanticData * checkMethod(struct ASTNode * methodCall) {
    if (methodCall->node_type == NODETYPE_PARSEINT) {
        struct SemanticData * dim = malloc(sizeof(struct SemanticData));
        dim->type = DATATYPE_INT;
        dim->value.int_value = 0;
        if (ExpType(methodCall->children[0])->type != DATATYPE_STR) {
            report_type_violation(methodCall->children[0]->linenumber);
        }
        return dim;
    }
    int index = indexInEntryTable(find_symbol(methodCall->data.value.string_value, 0));
    // Method undeclared
    if (index < 0) {
        report_type_violation(methodCall->linenumber);
        return NULL;
    }
    struct ASTNode * tempCall = (methodCall->num_children>0)?methodCall->children[0]:NULL;
    struct ASTNode * tempEntry = (symbol_table[index]->node->num_children>1 && symbol_table[index]->node->children[1]->node_type == NODETYPE_FORMALLIST)?symbol_table[index]->node->children[1]:NULL;
    while (tempCall != NULL && tempEntry != NULL) {
        struct SemanticData * callType = ExpType(tempCall->children[0]);
        struct SemanticData * entryType = extractTypeData(tempEntry->children[0]);
        if ((entryType->type != callType->type && callType->type != DATATYPE_UNDEFINED) || entryType->value.int_value != callType->value.int_value) {
            break;
        }
        (tempCall->num_children>1)?(tempCall=tempCall->children[1]):(tempCall=NULL);
        (tempEntry->num_children>1)?(tempEntry=tempEntry->children[1]):(tempEntry=NULL);
    }
    while (tempCall != NULL) {
        struct SemanticData * callType = ExpType(tempCall->children[0]);
        (tempCall->num_children>1)?(tempCall=tempCall->children[1]):(tempCall=NULL);
    }
    while (tempEntry != NULL) {
        report_type_violation(methodCall->linenumber);
        (tempEntry->num_children>1)?(tempEntry=tempEntry->children[1]):(tempEntry=NULL);
    }
    return extractTypeData(symbol_table[index]->node->children[0]);
}

struct SemanticData * extractTypeData(struct ASTNode * Type) {
    struct SemanticData* t = malloc(sizeof(struct SemanticData));
    t->type = Type->children[0]->data.type;
    t->value.int_value = Type->children[1]->data.value.int_value;
    return t;
}

struct SymbolTableEntry ** find_symbol(char* id, int after_index){
    for (int i = after_index; i < num_entries; ++i) {
        if(strcmp(id, symbol_table[i]->id) == 0){
            return symbol_table + sizeof(struct SymbolTableEntry)*i;
        }
    }
    return NULL;
}

void add_to_symbol_table(struct ASTNode * scope, struct ASTNode * node, char* id, struct SemanticData* TypeData, int linenumber){
    struct SymbolTableEntry* entry = malloc(sizeof(struct SymbolTableEntry));
    entry->scope = scope;
    entry->node = node;
    entry->id =id;
    entry->type = TypeData;
    symbol_table[num_entries] = entry;
    num_entries++;
    entry->linenumber = linenumber;
}

void variableDeclTest(struct ASTNode * scope, struct ASTNode * node, struct SemanticData * t, struct SemanticData * Expt) {
    char * id = node->data.value.string_value;
    // bool type_violation_exists = false;
    // Reports an error if the variable initializer expression has a
    // different type.
    if (Expt != NULL && Expt->type != DATATYPE_UNDEFINED && (t->type != Expt->type || t->value.int_value != Expt->value.int_value)) {
        report_type_violation(node->linenumber);
    }
    // Reports an error if the declared variable is declared before (i.e.,
    // already exists in the symbol table).
    if (!varInTable(node, t)) {
        add_to_symbol_table(scope, node, id, t, node->linenumber);
    }
}

bool varInTable(struct ASTNode * variableNode, struct SemanticData * var_type) {
    char * id = variableNode->data.value.string_value;

    int index = isDeclInScope(variableNode, id, true);
    if (index > -1) {
        struct SymbolTableEntry * found_entry = symbol_table[index];
        
        // Changes the type of the variable to undefined, unless the 
        // redefinition is the same type as the existing one.
        if (found_entry->type->type != var_type->type || found_entry->type->value.int_value != var_type->value.int_value) 
            found_entry->type->type = DATATYPE_UNDEFINED;
        return true;
    }
    return false;
}

int indexInEntryTable(struct SymbolTableEntry ** current_entry) {
    if (current_entry==NULL)
        return -1;
    return ((int) (current_entry - symbol_table))/sizeof(struct SymbolTableEntry);
}

int isDeclInScope(struct ASTNode * node, char * id, bool reportIfExists) {
    int index = indexInEntryTable(find_symbol(id, 0));
    while (index > -1) {
        struct SymbolTableEntry * found_entry = symbol_table[index];
        struct ASTNode * temp = node;
        while(found_entry->scope != temp && temp->parent != NULL) {
            temp = temp->parent;
        }
        if (temp->parent != NULL && reportIfExists) {
            int line = node->linenumber;
            if (node->linenumber < found_entry->linenumber) {
                line = found_entry->linenumber;
                found_entry->node = node;
                found_entry->linenumber = node->linenumber;
            }
            report_type_violation(line);
        }
        if (temp->parent != NULL)
            return index;
        // for (int i =0; i<num_entries; i++) {
        //     printf("scope %s name %s\n", symbol_table[i]->scope->data.value.string_value, symbol_table[i]->id);
        // }
        index = indexInEntryTable(find_symbol(id, index + 1));
    }
    // it is -1;
    return index;
}

void checkFormalLists() {
    for (int i = 0; i < num_methods; i++) {
        struct ASTNode * tempPar = (symbol_table[methodsInSymbolTable[i]]->node->num_children>1 && symbol_table[methodsInSymbolTable[i]]->node->children[1]->node_type == NODETYPE_FORMALLIST)?symbol_table[methodsInSymbolTable[i]]->node->children[1]:NULL;
        while (tempPar != NULL) {
            struct SemanticData * parType = extractTypeData(tempPar->children[0]);
            if (!varInTable(tempPar, parType)) {
                add_to_symbol_table(symbol_table[methodsInSymbolTable[i]]->node, tempPar, tempPar->data.value.string_value, parType, tempPar->linenumber);
            }
            (tempPar->num_children>1)?(tempPar=tempPar->children[1]):(tempPar=NULL);
        }
        symbol_table[methodsInSymbolTable[i]]->node->children[symbol_table[methodsInSymbolTable[i]]->node->num_children - 1]->node_type==NODETYPE_STATEMENTINIT ? checkStatementInit(symbol_table[methodsInSymbolTable[i]]->node, symbol_table[methodsInSymbolTable[i]]->node->children[symbol_table[methodsInSymbolTable[i]]->node->num_children - 1], symbol_table[methodsInSymbolTable[i]]->node):0;
    }
}