export interface Client {
    id: number;
    name: string;
    phone: string;
    username: string;
    contacto: string;
    password: string;
    role_id: number;
    role_name: string;
    function_id: number;
    function_name: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}