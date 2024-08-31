import express from 'express';
const router = express.Router();

import {
    GetSchedule
}
    from '../controllers/ScheduleController';

router.get("/get-schedule", GetSchedule);

export default router;