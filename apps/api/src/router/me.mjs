import express from "express";
import auth from "../middlewares/auth.mjs";
import { disconnect, getMe } from "../controllers/me.mjs";

const meRouter = express();

meRouter.get('/', auth, getMe);

meRouter.post('/disconnect', disconnect)

export { meRouter };