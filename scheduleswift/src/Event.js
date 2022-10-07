class Event {
    Event() {
        this.confirmationID= "";
        this.organizers= {};
        this.numOrganizers= 0;
        this.hostID= "";
        this.items= {};
        this.numItems= 0;
        this.totalPrice= 0; 
    }

    setConfirmationID(confirmationID) {
        this.confirmationID = confirmationID;
    }

    setHostID(hostID) {
        this.hostID = hostID
    }

    setTotalPrice(totalPrice) {
        this.totalPrice = totalPrice;
    }

    addOrganizer(organizer) {
        this.organizers[this.numOrganizers] = organizer;
        this.numItems++;
    }

    addItem(item) {
        this.items[this.numItems]= item;
        this.numItems++;
    }

}