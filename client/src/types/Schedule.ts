export type Slot = {
    start: string;
    end: string;
    available: boolean;
    _id: string;
}
export type Day = {
    date: Date;
    day: string;
    slots: Slot[];
}