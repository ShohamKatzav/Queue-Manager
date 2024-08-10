import express from 'express';
const router = express.Router();

import {
    GetSchedule,
    MakeAppointment,
    GetAppointmentsForClient,
    GetAppointmentsTotalCount,
    CancelAppointment,
    RescheduleAppointment }
    from '../controllers/ScheduleController';

router.get("/get-schedule", GetSchedule);
router.post("/make-appointment", MakeAppointment);
router.get("/get-appointments", GetAppointmentsForClient);
router.get("/get-appointments-count", GetAppointmentsTotalCount);
router.delete("/delete-appointment", CancelAppointment);
router.put("/reschedule-appointment", RescheduleAppointment);

export default router;