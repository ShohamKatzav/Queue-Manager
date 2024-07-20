import express from 'express';
const router = express.Router();

import {
    GetSchedule,
    MakeAppointment,
    GetAppointmentsForClient }
    from '../controllers/ScheduleController';

router.get("/get-schedule", GetSchedule);
router.post("/make-appointment", MakeAppointment);
router.get("/get-appointments", GetAppointmentsForClient);

export default router;