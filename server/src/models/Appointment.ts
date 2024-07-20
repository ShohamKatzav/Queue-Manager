import { Document, Schema, model, Types } from 'mongoose';

interface IAppointment extends Document {
    client: Types.ObjectId;
    business: Types.ObjectId;
    slot: Types.ObjectId;
    time: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    slot: {
        type: Schema.Types.ObjectId,
        ref: 'DailySchedule.slots',
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

export default model<IAppointment>('Appointment', AppointmentSchema);