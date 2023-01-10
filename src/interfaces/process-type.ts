import { Activity } from "./activity-type";

export type Process = {
    id: number;
    name: string;
    categoria: string;
    description: string;
    owner_id?: number;
    owner_name: string;
    actividades?: Activity[];
    costo: string;
    precio: string;
    centrodecosto1: string;
    centrodecosto2: string;
}

export type IProcessNoDetails = {
    name: string;
    id: number;
    owner_id: number;
    owner_name: string;
}

export type ISelectedProcess = {
    id: number;
    name: string;
    actividades: any[];
}