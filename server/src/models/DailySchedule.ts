import { Document, Schema, model, Types } from 'mongoose';

export interface ITimeSlot extends Document {
  start: string;
  end: string;
  available: boolean;
}

export interface IDailySchedule extends Document {
  date: Date;
  day: string;
  slots: ITimeSlot[];
  account: Types.ObjectId;
}

export const TimeSlotSchema = new Schema<ITimeSlot>({
  start: { type: String, required: true },
  end: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const DailyScheduleSchema = new Schema<IDailySchedule>({
  date: { type: Date, required: true, index: true },
  day: { type: String, required: true },
  slots: { type: [TimeSlotSchema], required: true, index: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
});

export default model<IDailySchedule>('DailySchedule', DailyScheduleSchema);