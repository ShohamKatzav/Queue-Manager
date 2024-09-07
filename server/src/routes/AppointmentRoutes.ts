import express from 'express';
const router = express.Router();

import {
    MakeAppointment,
    GetAppointments,
    GetAppointmentsTotalCount,
    GetScheduledDaysInMonth,
    CancelAppointment,
    RescheduleAppointment
}
    from '../controllers/AppointmentController';

router.post("/make-appointment", MakeAppointment);
router.get("/get-appointments", GetAppointments);
router.get("/get-appointments-count", GetAppointmentsTotalCount);
router.get("/get-shceduled-days-in-month", GetScheduledDaysInMonth);
router.delete("/delete-appointment", CancelAppointment);
router.put("/reschedule-appointment", RescheduleAppointment);

export default router;