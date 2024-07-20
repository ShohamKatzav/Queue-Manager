import express from 'express';
const router = express.Router();

import {
    DoesAccountExists,
    Auth,
    Verify,
    GetBuisnesses }
    from '../controllers/AccountController';

router.post("/is-exist", DoesAccountExists);
router.post("/auth", Auth);
router.post("/verify", Verify);
router.get("/get-businesses", GetBuisnesses);

export default router;