import { Pages } from "../../interfaces/pages-type";

export const pages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Estado de cuenta', path: "/users/estadocuenta" },
];
export const traficoPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Estado de cuenta', path: "/users/estadocuenta" },

    // Ofertas
    { name: 'divider', path: "Ofertas" },
    { name: "Ofertas", path: "/offer/resume" },
];
export const ventasPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Estado de cuenta', path: "/users/estadocuenta" },

    // Ofertas
    { name: 'divider', path: "Ofertas" },
    { name: "Ofertas pendientes", path: "/offer/resume/pending" },
];
export const adminPages: Pages[] = [

    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Estado de cuenta', path: "/users/estadocuenta" },

    // Ofertas
    { name: 'divider', path: "Ofertas" },
    { name: "Ofertas", path: "/offer/resume" },
    { name: "Ofertas pendientes", path: "/offer/resume/pending" },
    { name: 'Agregar oferta', path: "/offer/add" },

    // Procesos
    { name: 'divider', path: "Procesos" },
    { name: 'Procesos', path: "/process" },
    { name: 'Agregar procesos', path: "/process/add" },
    { name: 'Procesos externos', path: "/process/external" },
    { name: 'Agregar procesos externos', path: "/process/external/add" },

    // Actividades
    { name: 'divider', path: "Actividades" },
    { name: 'Asignacion', path: "/assignment" },
    { name: 'Lista de actividades', path: "/activity" },
    { name: 'Agregar actividad', path: "/activity/add" },
    { name: 'Informacion para Brandcenter', path: "/brandcenter/add" },

    // Resumenes
    { name: 'divider', path: "Resúmenes" },
    { name: "Resumen de procesos", path: "/process/resume" },
    { name: "Resumen de actividades", path: "/activity/resume" },
    { name: "Resumen de casos", path: "/requirements/resume" },
    { name: "Resumen de cumplimiento", path: "/users/cumplimiento/resume" },
    { name: "Resumen de transacciones", path: "/transacciones/resume" },
    { name: "Analisis por caso", path: "/analisis/resume" },
    { name: "Status por caso", path: "/casos/status/resume" },
    { name: "Tareas por usuario", path: "/tareas/resume" },

    // Anuncios
    { name: 'divider', path: "Anuncios" },
    { name: "Registrar anuncio", path: "/announcement" },
];
export const notLoggedPages: Pages[] = [
    {
        name: "Log In",
        path: "/",
    },
    {
        name: "Registrarse",
        path: "/register"
    }
]