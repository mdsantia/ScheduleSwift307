#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "liveness.h"

extern FILE * fp;
extern FILE * ph;

// Reading C file backwards: by Shehbaz Jaffer in https://stackoverflow.com/questions/6922829/read-file-backwards-last-line-first
void impoveARM() {
    char buf[256];
    int ch;
    int count;

    fseek(ph, 0, SEEK_END);
    while (ftell(ph) > 1 ){
        fseek(ph, -2, SEEK_CUR);
        if(ftell(ph) <= 2)
                break;
        ch =fgetc(ph);
        count = 0;
        while(ch != '\n'){
                buf[count++] = ch;
                if(ftell(ph) < 2)
                        break;
                fseek(ph, -2, SEEK_CUR);
                ch =fgetc(ph);
        }
        for (int i =count -1 ; i >= 0 && count > 0  ; i--)
            fprintf(fp, "%c", buf[i]);
        fprintf(fp, "\n");
    }
}

void pastePlaceHolder() {
    char buf[256];

    while(fgets(buf, sizeof(buf), ph) != NULL) {
        fprintf(fp, "%s", buf);
    }
}