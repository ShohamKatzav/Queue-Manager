import { Document, Schema, model, Types } from 'mongoose';

interface IAccount extends Document {
    email: string;
    password: string;
    userType: string;
    name: string;
    city: string;
    address: string;
    baseSchedule?: Types.ObjectId;
    dailySchedules?: Types.ObjectId[];
    appointments?: Types.ObjectId[];
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
    userType: {
        type: String,
        enum : ['client','business'],
        default: 'client',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    baseSchedule: {
        type: Schema.Types.ObjectId,
        ref: 'BaseSchedule',
        required: false
    },
    dailySchedules: [{
        type: Schema.Types.ObjectId,
        ref: 'DailySchedule',
        required: false
    }],
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: false
    }],
});

export default model<IAccount>('Account', AccountSchema);