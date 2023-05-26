#ifndef TYPE_CHECK_H
#define TYPE_CHECK_H

#include "node.h"

struct SymbolTableEntry{
    char * id;
    struct ASTNode * scope;
    struct ASTNode * node;
    struct SemanticData * type;
    int linenumber;
};

// Adds an entry to the symbol table.
void add_to_symbol_table(struct ASTNode * scope, struct ASTNode * node, char* id, struct SemanticData * TypeData, int linenumber);
int indexInEntryTable(struct SymbolTableEntry ** current_entry);

// Looks for an entry in the symbol table with the given name.
// Returns NULL if there is no such entry.
struct SymbolTableEntry ** find_symbol(char* id, int after_index);

void checkProgram(struct ASTNode* program);
void checkMain(struct ASTNode* mainClass);
void checkStatement(struct ASTNode* scope, struct ASTNode* statement, struct ASTNode* method);
void checkStatementInit(struct ASTNode* scope, struct ASTNode* statement, struct ASTNode* method);
void checkStaticVarDeclInit(struct ASTNode * scope, struct ASTNode* StaticVarDeclInit);
void checkStaticVarTail(struct ASTNode * scope, struct ASTNode* StaticVarTail);
void checkStaticVarDecl(struct ASTNode * scope, struct ASTNode* StaticVarDecl);
void checkStaticMethodDeclInit(struct ASTNode * scope, struct ASTNode* StaticMethodDeclInit);
void checkStaticMethodDecl(struct ASTNode * scope, struct ASTNode* StaticMethodDeclInit);
struct SemanticData * checkMethod(struct ASTNode * methodCall);
struct SemanticData * extractTypeData(struct ASTNode* Type);
struct SemanticData * ExpType(struct ASTNode* Exp);
bool varInTable(struct ASTNode * node, struct SemanticData *t);
int isDeclInScope(struct ASTNode * node, char * id, bool reportIfExists);
void variableDeclTest(struct ASTNode * scope, struct ASTNode * node, struct SemanticData *t, struct SemanticData * Expt);
void checkFormalLists();

extern int num_errors;
extern int num_entries;

#endif
