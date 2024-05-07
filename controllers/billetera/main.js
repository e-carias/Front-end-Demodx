const API_MONTO = 'billetera/usuario.php';
const API_MOVIMIENTO = 'billetera/movimientos.php';
const TBODY_ROWS = document.getElementById('monto');
const TBODY_MOV = document.getElementById('table-m');

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
    fillTable();
    fillMov();
});

async function fillTable(form = null) {
    TBODY_ROWS.innerHTML = '';   
    (form) ? action = null : action = 'readMonto';
    const JSON = await dataFetch(API_MONTO, action, form);
    if (JSON.status) {
        TBODY_ROWS.innerHTML += `
        <div class="stats-figure">$${JSON.dataset.saldo_cuenta}</div> 
        `;
    } else {
        sweetAlert(4, JSON.exception, null);
    }
}

async function fillMov(form = null) {
    TBODY_MOV.innerHTML = '';   
    (form) ? action = null : action = 'readAll';
    const JSON = await dataFetch(API_MOVIMIENTO, action, form);
    if (JSON.status) {
        JSON.dataset.forEach(row => {
            var monto = row.variacion;
            if(monto>=0)
                {
                    monto = '+'+monto;
                 }
            TBODY_MOV.innerHTML += `
                <tr>
                    <td style="color: #230000;">${row.nombre} ${row.apellido}</td>
                    <td style="color: #230000;">$${monto}</td>
                    <td style="color: #230000;">${row.fecha}</td>
                </tr>
            `;
        });             
    } else {
        sweetAlert(4, JSON.exception, null);
    }
}