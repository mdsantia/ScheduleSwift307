#include "node.h"

void addToLocal(char * id, struct SemanticData * type);

void declareAllStaticVars();

void defineStaticText();

void InitializeMethod(int method);

void buildtoMethodCall(struct ASTNode * methodCall);

void evaluateExp(struct ASTNode* exp);

void buildStatement(struct ASTNode * statement, int method);

void addToLocal(char * id, struct SemanticData * type);

void startPlaceholderFile();

void generate(int argc, char * argv []);

void makeARM(int argc, char * argv []);

int main(int argc, char* argv[] );