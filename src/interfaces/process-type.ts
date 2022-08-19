import { Activity } from "./activity-type";

export type Process = {
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
    actividades?: Activity[];
}