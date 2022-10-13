class Item {
    constructor() {
        this.name= "";
        this.type= 0;
        this.description= "";
        this.inputType= 0;
        this.price= 0;
    }

    setName(string) {
        this.name = string;
    }

    setType(num) {
        this.type = num;
    }

    setDescription(string) {
        this.description= string;
    }

    setInputType(num) {
        this.inputType = num;
    }
    
    setPrice(num) {
        this.price = num;
    }

}