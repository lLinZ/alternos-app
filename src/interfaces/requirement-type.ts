export interface Case {
    id: number;
    description: string;
    user_id: number;
    user_name: string;
    process_id: number;
    process_name: string;
    process_owner_id: number;
    process_owner_name: string;
    status: string;
    inicio: Date;
    vence: Date;
    completed_at: string;
    comentario_cierre: string;
}