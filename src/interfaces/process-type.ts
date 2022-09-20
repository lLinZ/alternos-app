import { Activity } from "./activity-type";

export type Process = {
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
    actividades?: Activity[];
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