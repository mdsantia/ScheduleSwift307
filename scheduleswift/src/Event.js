class Event {
    constructor() {
        this.confirmation_id= "";
        this.organizers= {};
        this.num_organizers= 0;
        this.host_id= "";
        this.items= {};
        this.num_items= 0;
        this.total_price= 0; 
    }

    add_item(item) {
        this.items[this.num_items]= item;
        this.num_items++;
    }

}