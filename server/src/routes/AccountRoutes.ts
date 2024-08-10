import express from 'express';
const router = express.Router();

import {
    DoesAccountExists,
    Auth,
    Verify,
    GetBusinesses,
    GetBusinessesCount }
    from '../controllers/AccountController';

router.post("/is-exist", DoesAccountExists);
router.post("/auth", Auth);
router.post("/verify", Verify);
router.get("/get-businesses", GetBusinesses);
router.get("/get-businesses-count", GetBusinessesCount);

export default router;