const API_CAJERO = 'caja/cajero.php';
const API_MOVIMIENTO = 'caja/movimientos.php';
const SEARCH_FORM = document.getElementById('search-form');
const SAVE_FORM = document.getElementById('save-form');
const TBODY_MOV = document.getElementById('table-cliente');

document.addEventListener('DOMContentLoaded', function () {

    let today = new Date();
    let hour = today.getHours();
    let bienvenido = '';

    if (hour < 12) {
        bienvenido = "Buenos días, Bienvenido de nuevo";
    } else if (hour < 19) {
        bienvenido = "Buenas tardes, Bienvenido de nuevo";
    } else if (hour <= 23) {
        bienvenido = "Buenas noches, Bienvenido de nuevo";
    }

    document.getElementById("bienvenido").textContent = bienvenido;
});

SEARCH_FORM.addEventListener('submit', (event) => {
    event.preventDefault();
    const FORM = new FormData(SEARCH_FORM);
    fillTable(FORM);
});

async function fillTable(form = null) {
    TBODY_MOV.innerHTML = '';   
    (form) ? action = 'search' : action = 'search';
    const JSON = await dataFetch(API_CAJERO, action, form);
    if (JSON.status) {
        JSON.dataset.forEach(row => {
            TBODY_MOV.innerHTML += `
            <tr>
            <td>${row.id_cliente}</td>
            <td>${row.usuario}</td>
            <td>${row.nombre}</td>
            <td>${row.apellido}</td>
            <td>#${row.n_cuenta}</td>
            <td>$${row.saldo_cuenta}</td>
            <td>
                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modal" onclick="openUpdate(${row.id_cliente})">
                <box-icon name='edit' color='#ffffff' ></box-icon></button>                                    
            </td>
        </tr>
            `;
        });             
    } else {
        sweetAlert(4, JSON.exception, null);
    }
}

async function openUpdate(id_cliente) {        
    const FORM = new FormData();
    FORM.append('id_cliente', id_cliente);
    const JSON = await dataFetch(API_MOVIMIENTO, 'readOne', FORM);
    if (JSON.status) {
        cleanModal();

        document.getElementById('titulo-modal').textContent = 'Actualizar el saldo de cuenta';
        document.getElementById('btn-accion').textContent = 'Actualizar';
        document.getElementById('id-description').textContent = 'Id del usuario:';
        document.getElementById('title-ncuenta').textContent = 'Numero de cuenta:';
        document.getElementById('title-monto').textContent = 'Monto de cuenta:';

        document.getElementById('id').value = JSON.dataset.id_cliente;
        document.getElementById('ncuenta').value = JSON.dataset.n_cuenta;
        document.getElementById('monto').value = JSON.dataset.saldo_cuenta;
    } else {
        sweetAlert(2, JSON.exception, null);
    }
}

SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();    
    (document.getElementById('id').value) ? action = 'update' : action = null;
    const FORM = new FormData(SAVE_FORM);
    const JSON = await dataFetch(API_MOVIMIENTO, action, FORM);
    if (JSON.status) {
        fillTable();
        sweetAlert(1, JSON.message, null);
    } else {
        sweetAlert(2, JSON.exception, null);
    }
});

function cleanModal(){
    document.getElementById('id').value = ' ';
    document.getElementById('ncuenta').value = ' ';
    document.getElementById('monto').value = ' ';    
}