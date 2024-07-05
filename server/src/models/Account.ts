import { Document, Schema, model } from 'mongoose';

interface IAccount extends Document {
    email: string;
    password: string;
}

const AccountSchema = new Schema<IAccount>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

export default model<IAccount>('Account', AccountSchema);