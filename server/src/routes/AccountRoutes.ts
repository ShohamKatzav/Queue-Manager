import express from 'express';
const router = express.Router();

import {
    DoesAccountExists,
    Auth,
    Verify }
    from '../controllers/AccountController';

router.post("/is-exist", DoesAccountExists);
router.post("/auth", Auth);
router.post("/verify", Verify);

export default router;