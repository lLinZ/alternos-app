export type Activity = {
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
    duration: number;
}

export interface SelectedActivity {
    id: number;
    name: string;
    orden: number;
    precedencia:number;
}

export type ActivityFromProcess = {
    id: number;
    activity_name: string;
    owner_id: number;
    owner_name: string;
    duration: number;
}