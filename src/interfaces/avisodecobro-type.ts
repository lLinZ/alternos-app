export interface AvisoDeCobro {
    id: number;
    customer_id: number;
    customer_name: string;
    fecha: Date;
    offer_id: number;
    salesman_id: number;
    salesman_name: string;
    cuota: number;
    total_cuotas: number;
    monto: number;
    frecuencia: string;
    status: string;
}
