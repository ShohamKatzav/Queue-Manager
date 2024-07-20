import { Document, Schema, model, Types } from 'mongoose';


interface IWorkingDay extends Document {
  day: string;
  startingTime: string;
  endingTime: string;
}

interface IBaseSchedule extends Document {
  appointmentLength: number;
  week: IWorkingDay[];
  account: Types.ObjectId;
}


const WorkingDaySchema = new Schema<IWorkingDay>({
  day: { type: String, required: true },
  startingTime: { type: String, required: true },
  endingTime: { type: String, required: true },
});

const BaseScheduleSchema = new Schema<IBaseSchedule>({
  appointmentLength: { type: Number, required: true },
  week: { type: [WorkingDaySchema], required: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
});

export default model<IBaseSchedule>('BaseSchedule', BaseScheduleSchema);