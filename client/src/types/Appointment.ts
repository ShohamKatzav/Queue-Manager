export type Appointment = {
    _id: string;
    client: { _id: string, name: string };
    business: { _id: string, city: string, address: string, name: string };
    slot: string;
    time: Date;
}