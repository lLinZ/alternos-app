import { Settings } from "../../interfaces/settings-type";

export const settings: Settings[] = [
    { name: 'Mi perfil', path: "/profile" },
    { name: 'Cerrar sesión', path: "/end" },
];
export const adminSettings: Settings[] = [
    { name: 'Mi perfil', path: "/profile" },
    { name: "Administrar usuarios", path: "/admin" },
    { name: "Revision de pagos", path: "/pagos" },
    { name: "Agregar admin", path: "/register/admin" },
    { name: 'Cerrar sesión', path: "/end" },
]