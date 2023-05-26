HEADERS = $(shell find . -name "*.h")
AFILES = typecheck.c node.c codegen.c liveness.c

directory = ./outFiles
LYCFILES = y.tab.c lex.yy.c
# LYOBJS = $(LYCFILES:.c=.o)
CFLAGS = -g

all: codegen 
ifeq ("$(wildcard $(directory))", "")
	@mkdir $(directory)
endif
.PHONY: all

codegen:	$(AFILES) $(LYCFILES)
			gcc $(CFLAGS) $(AFILES) $(LYCFILES) -o codegen -lfl

y.tab.c:	parser.y
			bison -v -y -d -g -t --verbose parser.y

lex.yy.c:	parser.l
			flex -l parser.l

clean:
	rm -f lex.yy.c y.tab.c y.tab.h y.dot y.output parser codegen *.s
	rm -r $(directory)