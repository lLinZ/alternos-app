import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const getFormatDistanceToNow = (date: any) => {
    const fromNow = formatDistanceToNow(date, { locale: es });
    return `Creada hace ${fromNow}`;
}
/**
 * Función para el manejo de alertas en base al status de la solicitud HTTP enviada
 * @param {number} status Status de la respuesta HTTP
 * @param {string} mensajePersonalizado Mensaje que se puede mostrar en el Sweet Alert
 * @author Linz web dev (José Linares)
 */
export const alertHandler = (status: number, mensajePersonalizado = false) => {
    switch (status) {
        case 204:
            Swal.fire({
                title: "Oops!",
                html: mensajePersonalizado ? mensajePersonalizado : "No se encontraron resultados",
                icon: "warning",
            })
            break;
        case 400:
            console.log("Error con los datos enviados");
            Swal.fire({
                title: "Error",
                html: mensajePersonalizado ? mensajePersonalizado : "Revise los datos enviados",
                icon: "error",
            })
            break;
        case 401:
            console.log("Autenticación erronea");
            Swal.fire({
                title: "Error",
                html: mensajePersonalizado ? mensajePersonalizado : "Autentiquese correctamente para poder ingresar data",
                icon: "error",
            })
            break;
        case 403:
            console.log("Autorizacion denegada");
            Swal.fire({
                title: "Error",
                html: mensajePersonalizado ? mensajePersonalizado : "No tiene acceso a la información",
                icon: "error",
            })
            break;
        case 405:
            console.log("Método no permitido");
            Swal.fire({
                title: "Alerta",
                html: mensajePersonalizado ? mensajePersonalizado : "Método de conexión no permitido",
                icon: "warning",
            })
            break;
        case 500:
            Swal.fire({
                title: "Error",
                html: mensajePersonalizado ? mensajePersonalizado : `Ocurrió un error interno del servidor`,
                icon: "error",
            })
            break;
        default:
            Swal.fire({
                title: "Error",
                html: mensajePersonalizado ? mensajePersonalizado : `Ocurrió un error interno del servidor`,
                icon: "error",
            })
            break;
    }
}
/**
 * Funcion para crear una cookie
 * @param {string} cname Nombre de la cookie a crear
 * @param {any} cvalue Dato de la cookie
 * @param {date} exdays Dias para la expiracion de la cookie
 * @author Linz web dev (José Linares)
 */
export const createCookie = async (cname: string, cvalue: any, exdays: number = 30) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/**
 * Funcion para borrar una cookie en el documento
 * @param {string} name Nombre de la cookie a borrar
 * @param {string} path Direccion de la cookie
 * @author Linz web dev (José Linares)
 */
export const deleteCookie = async (name: string, path = "/") => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}
/**
 * Funcion para buscar una cookie por su nombre
 * @param {string} name Nombre de la cookie
 * @returns Valor de la cookie
 * @author Linz web dev (José Linares)
 */
export const getCookieValue = (name: string) => (decodeURIComponent(document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''))