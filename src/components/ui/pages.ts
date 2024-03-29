import { Pages } from "../../interfaces/pages-type";

export const administracionPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },

    // Clientes
    { name: 'divider', path: "Clientes" },
    { name: "Añadir cliente", path: "/user/add/client" },
    { name: "Lista de clientes", path: "/clients" },

    // Avisos de cobro
    { name: 'divider', path: "Avisos de cobro" },
    { name: "Añadir aviso de cobro", path: "/avisosdecobro/add" },
    { name: "Lista de avisos de cobro", path: "/avisosdecobro" },

    // Resumenes
    { name: 'divider', path: "Reportes" },
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
    { name: "Lista de Ofertas", path: "/offers" },
    { name: "Ofertas por Confirmar", path: "/offer/resume" },

    // Procesos
    { name: 'divider', path: "Procesos" },
    { name: 'Procesos', path: "/process" },
    // { name: 'Agregar procesos', path: "/process/add" },
    { name: 'Procesos externos', path: "/process/external" },
    { name: 'Agregar procesos externos', path: "/process/external/add" },

    // Actividades
    { name: 'divider', path: "Actividades" },
    { name: 'Lista de actividades', path: "/activity" },
    { name: 'Asignacion de actividades a procesos', path: "/assignment" },
    // { name: 'Agregar actividad', path: "/activity/add" },

    // Resumenes
    { name: 'divider', path: "Reportes" },
    { name: "Lista de procesos", path: "/process/resume" },
    { name: "Lista de actividades", path: "/activity/resume" },
    { name: "Lista de tareas por requerimiento", path: "/tareas/casos" },
    { name: "Lista de requerimientos", path: "/requirements/resume" },
    // { name: "Resumen requerimientos cerrados", path: "/requirements/closed/resume" },
    // { name: "Resumen requerimientos externos", path: "/requirements/external/resume" },
    { name: "Efectividad por usuario", path: "/users/cumplimiento/resume" },
    { name: "Analisis por requerimiento", path: "/analisis/resume" },
    { name: "Porcentaje de culminación por requerimiento", path: "/casos/status/resume" },
    { name: "Tareas por usuario", path: "/tareas/resume" },
    { name: "Kanban por usuario", path: "/kanban/usuario" },
    { name: "Kanban por requerimiento", path: "/kanban/caso" },
    { name: "Gantt por requerimiento", path: "/gantt/caso" },
];
export const ventasPages: Pages[] = [
    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },

    // Ofertas
    { name: 'divider', path: "Ofertas" },
    { name: "Lista de Ofertas", path: "/offers" },
    { name: "Ofertas Confirmadas en proceso de aprobación", path: "/offer/resume/pending" },
    { name: 'Agregar oferta', path: "/offer/add" },
    { name: 'Briefings por oferta', path: "/requirements/briefings" },

    // Resumenes
    { name: 'divider', path: "Reportes" },
    { name: "Kanban por requerimiento", path: "/kanban/caso" },
    { name: "Lista de tareas por requerimiento", path: "/tareas/casos" },
    { name: 'Lista de requerimientos', path: "/requirements/resume" },
    { name: "lista requerimientos externos", path: "/requirements/external/resume" },
    { name: "Lista de ofertas", path: "/offer/resume/status" },

    // Clientes
    { name: 'divider', path: "Clientes" },
    { name: "Añadir cliente", path: "/user/add/client" },
    { name: "Lista de clientes", path: "/clients" },

    // Avisos de cobro
    { name: 'divider', path: "Avisos de cobro" },
    { name: "Añadir aviso de cobro", path: "/avisosdecobro/add" },
    { name: "Lista de avisos de cobro", path: "/avisosdecobro" },

];
export const adminPages: Pages[] = [

    // Menu principal
    { name: 'divider', path: "Menu principal" },
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },

    // Ofertas
    { name: 'divider', path: "Comercial" },
    { name: "Añadir cliente", path: "/user/add/client" },
    { name: 'Agregar oferta', path: "/offer/add" },
    { name: "Ofertas Confirmadas en proceso de aprobación", path: "/offer/resume/pending" },
    { name: "Lista de clientes", path: "/clients" },
    { name: "Lista de Ofertas", path: "/offers" },
    // { name: "Ofertas", path: "/offer/resume" },

    // Procesos
    { name: 'divider', path: "Procesos y Actividades" },
    { name: 'Procesos', path: "/process" },
    // { name: 'Agregar procesos', path: "/process/add" },
    // { name: 'Procesos externos', path: "/process/external" },
    // { name: 'Agregar procesos externos', path: "/process/external/add" },

    // Actividades
    // { name: 'divider', path: "Actividades" },
    { name: 'Actividades', path: "/activity" },
    { name: 'Asociar actividades y procesos', path: "/assignment" },
    // { name: 'Agregar actividad', path: "/activity/add" },

    // Avisos de cobro
    { name: 'divider', path: "Administración" },
    { name: 'Estado de cuenta', path: "/users/estadocuenta" },
    { name: "Lista de avisos de cobro", path: "/avisosdecobro" },
    { name: "Añadir aviso de cobro", path: "/avisosdecobro/add" },
    { name: "Revision de pagos", path: "/pagos" },

    // Resumenes
    { name: 'divider', path: "Reportes" },
    { name: "Lista de procesos", path: "/process/resume" },
    { name: "Lista de actividades", path: "/activity/resume" },
    { name: "Lista de tareas por requerimiento", path: "/tareas/casos" },
    { name: "lista de ofertas", path: "/offer/resume/status" },
    { name: "Lista de requerimientos", path: "/requirements/resume" },
    // { name: "Resumen requerimientos cerrados", path: "/requirements/closed/resume" },
    // { name: "Resumen requerimientos externos", path: "/requirements/external/resume" },
    { name: "Efectividad por usuario", path: "/users/cumplimiento/resume" },
    { name: "Lista de transacciones", path: "/transacciones/resume" },
    { name: "Reporte de pagos del periodo", path: "/pagos/periodo/resume" },
    { name: "Estado de cuenta por cliente", path: "/client/estadocuenta" },
    { name: "Analisis por requerimiento", path: "/analisis/resume" },
    { name: "Porcentaje de culminación por requerimiento", path: "/casos/status/resume" },
    { name: "Tareas por usuario", path: "/tareas/resume" },
    { name: "Kanban por usuario", path: "/kanban/usuario" },
    { name: "Kanban por requerimiento", path: "/kanban/caso" },
    { name: "Gantt por requerimiento", path: "/gantt/caso" },

    // Administración del sistema
    { name: 'divider', path: "Admin. del sistema" },
    { name: "Administrar parámetros", path: "/register/params" },
    { name: "Administrar usuarios", path: "/admin" },
    { name: "Administrar departamentos", path: "/departamentos" },
    { name: "Agregar administradores", path: "/register/admin" },

    { name: 'divider', path: "Otras funciones" },
    { name: "Registrar anuncio", path: "/announcement" },
    { name: 'Informacion para Brandcenter', path: "/brandcenter/add" },
    { name: 'Administración de Brandcenter', path: "/brandcenter" },
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