/***
 * Code acquired from https://linuxhint.com/javascript-hash-tables/#:~:text=In%20JavaScript%2C%20a%20%E2%80%9Chash%20table,key%20within%20a%20hash%20table.
 * This class is the stepping stone to implementing a HashTable for all our id's such as confirmation
 * numbers and facility and user ids
 */

class HashTable {
    constructor() {
        this.object= {};
        this.ids= {};
        this.size = 0;
        this.length = 0;
        this.hashLength = 5;
        const maxAttempts = 5;
    }

    incHashLength() {
        this.hashLength++;
    }

    /** Generation of unique identifier 
     * It is a recursive function such that if the cap of attempts to make id
     * is exceeded, the hash lenght is increased
    */
    makeUniqueID(attempt) {
        // Reference to ran string https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < this.hashLength; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        if (this.idUnique(result)) {
            return result;
        } else {
            if (attempt >= maxAttempts) {
            // The hash is not unique so it cannot be added
                return this.makeUniqueID(attempt++);
            } else {
                this.incHashLength;
                this.makeUniqueID;
            }
        }
    }

    hashFunc(key) {
        return key.toString().length % this.size;
    }

    addPair(key) {
        const value = this.makeUniqueID(0);
        const hash = this.hashFunc(key);
        this.ids[this.length] = value;
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

    idUnique(id) {
        for (var i = 0; i < this.length; i++) {
            if (id===this.ids[i]) {
                return false;
            }
        }
        return true;
    }

}

/** Example of how to initialize a hashtable to contain different values */

/**
const hashtable = new HashTable();
hashtable.addPair("Alex", hashtable.makeUniqueID("Bert"));
console.log(hashtable.searchFunction("Alex"));
hashtable.addPair("Bert", hashtable.makeUniqueID("Bert"));
console.log(hashtable.searchFunction("Bert"));
console.log(hashtable.idUnique(hashtable.searchFunction("Alex")));
console.log(hashtable.idUnique("10"));
*/

/** To run, just install Code Runner Extension in VSCode and Control+ALT N or Control+Option N 
 * Or F1 and then select Run Code and the output should appear
*/