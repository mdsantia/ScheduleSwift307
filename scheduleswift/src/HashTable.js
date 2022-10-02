/***
 * Code acquired from https://linuxhint.com/javascript-hash-tables/#:~:text=In%20JavaScript%2C%20a%20%E2%80%9Chash%20table,key%20within%20a%20hash%20table.
 * This class is the stepping stone to implementing a HashTable for all our id's such as confirmation
 * numbers and facility and user ids
 */

class HashTable {
    constructor() {
        this.object= {};
        this.size = 0;
        this.length = 0;
    }


    /** TODO: Redefine hashFunc to generate unique identifier */
    hashFunc(key) {
        return key.toString().length % this.size;
    }

    addPair(key, value) {
        const hash = this.hashFunc(key);
        if (!this.object.hasOwnProperty(hash)) {
            this.object[hash] = {};
        }
        if (!this.object[hash].hasOwnProperty(key)) {
            this.length++;
        }
        this.object[hash][key] = value;
    }

    searchFunction(key) {
        const hash = this.hashFunc(key);
        if (this.object.hasOwnProperty(hash) && this.object[hash].hasOwnProperty(key)) {
            return this.object[hash][key];
        } else {
            return null;
        }
    }

}

/** Example of how to initialize a hashtable to contain different values */

/**
const hashtable = new HashTable();
hashtable.addPair("Alex", "01");
hashtable.addPair("Stepheny", "23");
hashtable.addPair("Max", "90");
console.log(hashtable.searchFunction("Max"));
*/

/** To run, just install Code Runner Extension in VSCode and Control+ALT N or Control+Option N 
 * Or F1 and then select Run Code and the output should appear
*/