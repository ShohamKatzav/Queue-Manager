export type Slot = {
    _id: string;
    start: string;
    end: string;
    available: boolean;
}
export type Day = {
    _id: string;
    date: Date;
    day: string;
    slots: Slot[];
}