const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    constructor() {
        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.lasTickets = [];

        this.init();
    }

    get toJson() {
        return {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            lasTickets: this.lasTickets
        }
    }

    init(){
        const { today, tickets, lasTickets, last } = require('../db/data.json');
        if(today === this.today){
            this.tickets = tickets;
            this.lasTickets = lasTickets;
            this.last = last;
        }else{
            // Es otro día
            this.saveDB();
        }
    }

    saveDB(){
        const dbPatch = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPatch, JSON.stringify(this.toJson));
    }

    nextTicket(){
        this.last += 1;
        const ticket = new Ticket(this.last, null);
        this.tickets.push(ticket);

        this.saveDB();
        return "Ticket "+ ticket.numero;
    }

    nextTicketTo(escritorio){

        if(this.tickets.length === 0){
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;
        this.lasTickets.unshift(ticket);

        if(this.lasTickets.length > 4){
            this.lasTickets.splice(-1,1);
        }

        this.saveDB();
        return ticket;
    }
}  

module.exports = TicketControl;