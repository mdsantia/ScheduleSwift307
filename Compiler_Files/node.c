#include "node.h"
#include <stdlib.h>
#include <string.h>

extern int yylineno;

struct ASTNode* new_node(enum NodeType t){
    struct ASTNode* ast_node = malloc(sizeof(struct ASTNode));
    memset(ast_node, 0, sizeof(struct ASTNode));
    ast_node->node_type = t;
    set_line_number(ast_node, yylineno);
    return ast_node;
}

int add_child(struct ASTNode* parent, struct ASTNode* child){
    if (parent->num_children < MAX_NUM_CHILDREN) {
        if (child != NULL) {
            parent -> children[parent->num_children] = child;
            parent -> num_children++;
            set_parent_node(parent, child);
        }
        return 0;
    } else {
        return -1;
    }
}

void set_string_value(struct ASTNode* node, char* s){
    node->data.type = DATATYPE_STR;
    char * replace = (char *) malloc(sizeof(char) * (strlen(s) + 1));
    strcpy(replace, s);
    node->data.value.string_value = replace;
}

void set_int_value(struct ASTNode* node, int i){
    node->data.type = DATATYPE_INT;
    node->data.value.int_value = i;
}

void set_boolean_value(struct ASTNode* node, bool b){
    node->data.type = DATATYPE_BOOLEAN;
    node->data.value.boolean_value = b;
}

void set_line_number(struct ASTNode* node, int line_number){
    node->linenumber = line_number;
}

void set_parent_node(struct ASTNode* parent, struct ASTNode* child) {
    child->parent = parent;
}

