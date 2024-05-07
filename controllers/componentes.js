
const SERVER_URL = 'http://localhost/DemoDX/back-end-Demodx/api/';


function confirmAction(message) {
    return Swal.fire({
        title: 'Advertencia',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        closeOnClickOutside: false,
        closeOnEsc: false,
    }).then((result) => {
        // Se verifica si fue clickeado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (result.isConfirmed) {
            return true;
        } else {
            return false;
        }
    });
}

function sweetAlert(type, text, url) {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
    }
    // Se muestra el mensaje. Requiere la librería sweetalert para funcionar.
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        closeOnClickOutside: false,
        closeOnEsc: false,
        confirmButtonText: 'Aceptar',
    }).then(function () {
        if (url) {
            // Se direcciona a la página web indicada.
            location.href = url
        }
    });
}

function sweetToast(type, text){
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
    }
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        title: title,
        text: text,
        icon: icon,
      });
}

async function fillSelect(filename, action, select, selected = null) {
    // Petición para obtener los datos.
    const JSON = await dataFetch(filename, action);
    let content = '';
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje.
    if (JSON.status) {
        content += '<option disabled selected>Seleccione una opción</option>';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        JSON.dataset.forEach(row => {
            // Se obtiene el dato del primer campo.
            value = Object.values(row)[0];
            // Se obtiene el dato del segundo campo.
            text = Object.values(row)[1];
            // Se verifica cada valor para enlistar las opciones.
            if (value != selected) {
                content += `<option value="${value}">${text}</option>`;
            } else {
                content += `<option value="${value}" selected>${text}</option>`;
            }
        });
    } else {
        content += '<option>No hay opciones disponibles</option>';
    }
    // Se agregan las opciones a la etiqueta select mediante el id.
    document.getElementById(select).innerHTML = content;
    // Se inicializa el componente Select del formulario para que funcione el menú de opciones.
}

async function logOut() {
    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cerrar la sesión?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Petición para eliminar la sesión.
        const JSON = await dataFetch(USER_API, 'logOut');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (JSON.status) {
            sweetAlert(1, JSON.message, 'index.html');
        } else {
            sweetAlert(2, JSON.exception, null);
        }
    }
}

async function dataFetch(filename, action, form = null) {
    // Se define una constante tipo objeto para establecer las opciones de la petición.
    const OPTIONS = new Object;
    // Se determina el tipo de petición a realizar.
    if (form) {
        OPTIONS.method = 'post';
        OPTIONS.body = form;
    } else {
        OPTIONS.method = 'get';
    }
    try {
        // Se declara una constante tipo objeto con la ruta específica del servidor.
        const PATH = new URL(SERVER_URL + filename);
        // Se agrega un parámetro a la ruta con el valor de la acción solicitada.
        PATH.searchParams.append('action', action);
        // Se define una constante tipo objeto con la respuesta de la petición.
        const RESPONSE = await fetch(PATH.href, OPTIONS);
        // Se retorna el resultado en formato JSON.
        return RESPONSE.json();
    } catch (error) {
        // Se muestra un mensaje en la consola del navegador web cuando ocurre un problema.
        console.log(error);
    }
}