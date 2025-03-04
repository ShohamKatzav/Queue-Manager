import { Image } from "./Image";


export type Business = {
    _id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
    image: Image
}