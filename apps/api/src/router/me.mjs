import express from "express";
import { auth } from "../auth/authMiddleware.mjs";

const meRouter = express();

meRouter.get('/', auth, (req, res) => {
    res.json({ userId: req.user.userId, role: req.user.role, login: req.user.login });
});

meRouter.post('/disconnect', (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Déconnexion réussi." })
})

export { meRouter };