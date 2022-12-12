export type Pago = {
    trx_id: number;
    user_id: number;
    user_name: string;
    fecha: Date;
    monto: number;
    formapago: string;
    referencia: string;
    concepto: string;
    status: string;
}