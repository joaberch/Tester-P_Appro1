import express from "express";
import { login } from "../controllers/login.mjs";

const loginRouter = express();

loginRouter.post("/", login)

export { loginRouter };