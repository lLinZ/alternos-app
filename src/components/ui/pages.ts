import { Pages } from "../../interfaces/pages-type";

export const administracionPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },

    // Clientes
    { name: 'divider', path: "Clientes" },
    { name: "Registro de cliente", path: "/user/add/client" },

    // Resumenes
    { name: 'divider', path: "Resúmenes" },
    { name: "Revision de pagos", path: "/pagos" },
    { name: "Estado de cuenta por cliente", path: "/client/estadocuenta" },
];
export const clientePages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
];
export const usuarioPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
];
export const invitadoPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
];
export const traficoPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },

    // Ofertas
    { name: 'divider', path: "Ofertas" },
    { name: "Ofertas", path: "/offer/resume" },

    // Resumenes
    { name: 'divider', path: "Resúmenes" },
    { name: "Resumen de procesos", path: "/process/resume" },
    { name: "Resumen de actividades", path: "/activity/resume" },
    { name: "Resumen de tareas por caso", path: "/tareas/casos" },
    { name: "Resumen de casos", path: "/requirements/resume" },
    { name: "Resumen casos cerrados", path: "/requirements/closed/resume" },
    { name: "Resumen de cumplimiento", path: "/users/cumplimiento/resume" },
    { name: "Analisis por caso", path: "/analisis/resume" },
    { name: "Status por caso", path: "/casos/status/resume" },
    { name: "Tareas por usuario", path: "/tareas/resume" },
    { name: "Kanban por usuario", path: "/kanban/usuario" },
    { name: "Kanban por caso", path: "/kanban/caso" },
];
export const ventasPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },

    // Ofertas
    { name: 'divider', path: "Ofertas" },
    { name: 'Agregar oferta', path: "/offer/add" },
    { name: "Ofertas pendientes", path: "/offer/resume/pending" },

    // Resumenes
    { name: 'divider', path: "Resúmenes" },
    { name: 'Resumen de casos', path: "/requirements/resume" },
    { name: "Resumen de ofertas por status", path: "/offer/resume/status" },

    // Clientes
    { name: 'divider', path: "Clientes" },
    { name: "Registro de cliente", path: "/user/add/client" },
];
export const adminPages: Pages[] = [

    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Estado de cuenta', path: "/users/estadocuenta" },
    { name: "Administrar usuarios", path: "/admin" },
    { name: "Agregar admin", path: "/register/admin" },
    { name: "Revision de pagos", path: "/pagos" },

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
    { name: "Resumen de tareas por caso", path: "/tareas/casos" },
    { name: "Resumen de ofertas por status", path: "/offer/resume/status" },
    { name: "Resumen de casos", path: "/requirements/resume" },
    { name: "Resumen casos cerrados", path: "/requirements/closed/resume" },
    { name: "Resumen de cumplimiento", path: "/users/cumplimiento/resume" },
    { name: "Resumen de transacciones", path: "/transacciones/resume" },
    { name: "Resumen de pagos del periodo", path: "/pagos/periodo/resume" },
    { name: "Estado de cuenta por cliente", path: "/client/estadocuenta" },
    { name: "Analisis por caso", path: "/analisis/resume" },
    { name: "Status por caso", path: "/casos/status/resume" },
    { name: "Tareas por usuario", path: "/tareas/resume" },
    { name: "Kanban por usuario", path: "/kanban/usuario" },
    { name: "Kanban por caso", path: "/kanban/caso" },

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