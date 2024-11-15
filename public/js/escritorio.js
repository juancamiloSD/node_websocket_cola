const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const params = new URLSearchParams(window.location.search);

if(!params.has('escritorio')){
    window.location = 'index.html';
    throw new Error('Escritorio no especificado');
}

const escritorio = params.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendiente) => {
    if(pendiente === 0){
        lblPendientes.style.display = 'none';
    }else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendiente;
    }
});

btnAtender.addEventListener('click', () => {
    socket.emit("atender-ticket", { escritorio }, ({ok, ticket, msg}) => {
        if( !ok ){
            lblTicket.innerText = `Nadie`;
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ` + ticket.numero;
    });
//   socket.emit('next-ticket', null, (ticket) => {
//     lblNuevoTicket.innerText = ticket;
//   });
});