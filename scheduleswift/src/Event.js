class Event {
    constructor(creatorUsername, facilityId, confId) {
        this.confirmationID= confId;
        this.organizers= {};
        this.organizers[0] = creatorUsername;
        this.numOrganizers= 1;
        this.hostID= facilityId;
        this.items= {};
        this.numItems= 0;
        this.totalPrice= 0; 
    }

    setConfirmationID(confirmationID) {
        this.confirmationID = confirmationID;
    }

    calculateTotalPrice(){
        // TODO Function to calculate per items
        return this.totalPrice;
    }

    addOrganizer(organizer) {
        this.organizers[this.numOrganizers] = organizer;
        this.numOrganizers++;
    }

    addItem(item) {
        this.items[this.numItems]= item;
        this.numItems++;
    }

}