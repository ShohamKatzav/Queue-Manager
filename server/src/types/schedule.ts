
type WorkingDayDTO = {
    day: string;
    startingTime: string;
    endingTime: string;
};

type ScheduleDTO = {
    appointmentLength: number;
    week: WorkingDayDTO[];
    accountID: string;
};