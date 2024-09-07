import { Business } from "./Business";
import { Client } from "./Client";

export type Appointment = {
    _id: string;
    client: Client;
    business: Business;
    slot: string;
    time: Date;
}