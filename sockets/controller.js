const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit("last-ticket", ticketControl.last);
    socket.emit("estado-actual", ticketControl.lasTickets);
    socket.emit("tickets-pendientes", ticketControl.tickets.length);

    socket.on('next-ticket', (payload, callback) => {
        const next = ticketControl.nextTicket();
        if (typeof callback === 'function') {
            callback(next);
            socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);
        } else {
            console.error('El callback no es una función');
        }
    });

    socket.on('atender-ticket', ({escritorio}, callback) => {

        if( !escritorio ){
            return callback({
                ok: false,
                msg: "El escritorio es obligatorio"
            })
        }

        const ticket = ticketControl.nextTicketTo(escritorio);

        socket.broadcast.emit("estado-actual", ticketControl.lasTickets);
        socket.emit("tickets-pendientes", ticketControl.tickets.length);
        socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);


        if( !ticket ){
            callback({
                ok: false,
                msg: "No hay tickets disponibles"
            })
        }else{
            callback({
                ok: true,
                ticket
            });
        }
    });
}

module.exports = { 
    socketController 
};