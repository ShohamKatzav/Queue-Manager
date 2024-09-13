// use to fetch data
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

//use to create a schedule
export type WorkingDay = {
    day: string;
    startingTime: string;
    endingTime: string;
}

export type Schedule = {
    appointmentLength: number;
    week: WorkingDay[];
}