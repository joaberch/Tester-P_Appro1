import express from "express";
import { auth } from "../auth/authMiddleware.mjs";

const meRouter = express();

meRouter.get('/me', auth, (req, res) => {
    res.json({ userId: req.user.userId, role: req.user.role, login: req.user.login });
});

export { meRouter };