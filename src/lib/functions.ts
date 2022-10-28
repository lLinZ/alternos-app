import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Dispatch, SetStateAction } from 'react';
import { baseUrl } from '../common/baseUrl';

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
/**
 * Funcion para validar el token de un usuario
 * @param setUserLogged Set state
 */
export const validarToken = async (router: any, setUserLogged: Dispatch<SetStateAction<any>>, setWidgets?: Dispatch<SetStateAction<any>>) => {
    const token = getCookieValue("token") || "";
    const username = getCookieValue("username") || "";

    const body = new FormData();

    body.append("username", username);
    body.append("token", token);
    const url = `${baseUrl}/validToken`;

    const options = {
        method: "POST",
        body
    }
    try {
        const respuesta = await fetch(url, options);

        const data = await respuesta.json();
        if (data.exito === "SI") {
            const newUser = data.usuario;
            const newWidgets = data.widgets;
            setUserLogged(newUser);
            setWidgets && setWidgets(newWidgets);
        } else {
            const alertaError1 = await Swal.fire({
                title: "Error",
                text: "Autentiquese correctamente",
                icon: "error"
            })
            router("/end");
        }
    } catch (error) {
        console.log(error);
        router("/end");
    }
}
export function numberWithDots(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
/**
 * Funcion para volver mayúsculas la primera letra de cada palabra en una cadena de strings
 * @param {string} str El estring que se va a formatear
 * @returns el string formateado
 * @author Linz web dev (José Linares)
 */
export const ucwords = (words: string) => {
    words += '';
    const formatted = words.toLowerCase().replace(/\b[a-z]/g, function (firstLetter) {
        return firstLetter.toUpperCase();
    });
    return formatted;
}
export const ucfirst = (str: string) => {
    //  discuss at: https://locutus.io/php/ucfirst/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //   example 1: ucfirst('kevin van zonneveld')
    //   returns 1: 'Kevin van zonneveld'
    str += '';
    const f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}