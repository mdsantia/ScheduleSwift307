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