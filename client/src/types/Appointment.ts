export type Appointment = {
    _id: string;
    client: { id: string, name: string };
    business: { id: string, city: string, address: string, name: string };
    time: Date;
}