import express from 'express';
const router = express.Router();
import tokenGuard from '../guards/TokenGuard';

import {
    DoesAccountExists,
    Auth,
    Verify,
    GetBusinesses,
    GetBusinessesCount
}
    from '../controllers/AccountController';

router.post("/is-exist", DoesAccountExists);
router.post("/auth", Auth);
router.post("/verify", tokenGuard, Verify);
router.get("/get-businesses", tokenGuard, GetBusinesses);
router.get("/get-businesses-count", tokenGuard, GetBusinessesCount);

export default router;