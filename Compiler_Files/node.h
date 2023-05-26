#ifndef NODE_H
#define NODE_H
#define MAX_NUM_CHILDREN 6
#define MAX_NUM_ENTRIES 6

#include <stdbool.h>

enum DataType { DATATYPE_UNDEFINED, DATATYPE_STR, DATATYPE_INT, DATATYPE_BOOLEAN, DATATYPE_VOID };

// Returns the name of the given data type.
static inline const char *type_string(enum DataType t) {
    static const char *names[] = {"Undefined", "String", "Integer", "Boolean", "Void"};
    return names[t % 5];
}

struct SemanticData {
    enum DataType type;
    union value_t {
        char* string_value;
        int int_value;
        bool boolean_value;
    } value;
};

enum NodeType {
    NODETYPE_PROGRAM,
    NODETYPE_MAINCLASS,
    
    NODETYPE_VARDECL,
    NODETYPE_STATICVARDECL,
    NODETYPE_STATICMETHODDECL,
    NODETYPE_STATICVARDECLINIT,
    NODETYPE_STATICMETHODDECLINIT,
    NODETYPE_FORMALLIST,
    NODETYPE_PRIMETYPE,
    NODETYPE_STATEMENT,
    NODETYPE_STATEMENTINIT,
    NODETYPE_PRINT,
    NODETYPE_PRINTLN,
    NODETYPE_METHODCALL,
    NODETYPE_LEFTVALUE,
    
    NODETYPE_EXP,
    NODETYPE_IF,
    NODETYPE_WHILE,
    NODETYPE_PARSEINT,
    NODETYPE_RETURN,
    NODETYPE_NEGEXP,
    NODETYPE_SEXP,
    NODETYPE_PEXPP,
    NODETYPE_EXPEND,
    NODETYPE_EXPLIST,
    NODETYPE_LEFTVALUELEN,
    NODETYPE_TYPE,
    NODETYPE_BINARY,
    NODETYPE_BBINARY,
    NODETYPE_BINARYB,
    NODETYPE_IBINARY,
    NODETYPE_IBINARYB,
    NODETYPE_DIM,
    NODETYPE_NEW,
};

struct ASTNode {
    struct ASTNode* children[MAX_NUM_CHILDREN];
    struct ASTNode* parent;
    int linenumber;
    int num_children;
    
    enum NodeType node_type;
    struct SemanticData data;
};


// Creates a new node with 0 children on the heap using `malloc()`.
struct ASTNode* new_node(enum NodeType t);
// Adds the given children to the parent node. Returns -1 if the capacity is full.
int add_child(struct ASTNode* parent, struct ASTNode* child);

// Sets the data of the node to the given value and the corresponding type.

void set_string_value(struct ASTNode* node, char* s);
void set_int_value(struct ASTNode* node, int i);
void set_boolean_value(struct ASTNode* node, bool b);
void set_line_number(struct ASTNode* node, int line_number);
void set_parent_node(struct ASTNode* parent, struct ASTNode* child);

#endif
