const USER_API = 'billetera/usuario.php';


const info_user = document.getElementById('info-user');

document.addEventListener('DOMContentLoaded', async () => {
	const JSON = await dataFetch(USER_API, 'getUser');
	if (JSON.session) {
		// Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
		if (JSON.status) {
                        info_user.innerHTML = `<div class="card-body text-center">
                                 <h5 class="card-title">${JSON.username}</h5>                                 
                              </div>
                              <div class="card-body text-center w-100">                                 
                                 <a class="btn btn-outline-danger w-100" onclick="logOut()">Cerrar Sesión <i class="fa-solid fa-right-from-bracket"></i></a>                                 
                              </div>
                        `;
		} else {
			sweetAlert(3, JSON.exception, 'index.html');
		}
	} else {
		// Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
		if (location.pathname != '/DemoDX/Front-end-Demodx/views/billetera/index.html') {
			location.href = 'index.html';
		}
	}
});