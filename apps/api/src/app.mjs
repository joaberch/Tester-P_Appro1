import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.mjs";
import authenticate from "./middlewares/auth.mjs";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser())

const port = 3001;

import { sequelize } from "./db/sequelize.mjs";
sequelize
    .authenticate()
    .then((_) => console.log("La connexion à la base de données a bien été créé."))
    .catch((error) => console.error(`Impossible de se connecter à la base de données :\n- ${error}`));

import authRouter from "./router/auth.mjs";
app.use("/api/auth", authRouter);

app.use(authenticate);

import { meRouter } from "./router/me.mjs";
app.use("/api/me", meRouter);

import { loginRouter } from "./router/login.mjs";
app.use("/api/login", loginRouter);

import { testDoneRouter } from "./router/testDone.mjs";
app.use("/api/testsDone", testDoneRouter);

import { testsRouter } from "./router/tests.mjs";
app.use("/api/tests", testsRouter);

import { usersRouter } from "./router/users.mjs";
app.use("/api/users", usersRouter);

import { questionsRouter } from "./router/questions.mjs";
app.use("/api/questions", questionsRouter);

import { objectivesRouter } from "./router/objectives.mjs";
app.use("/api/objectives", objectivesRouter);

import { modulesRouter } from "./router/modules.mjs";
app.use("/api/modules", modulesRouter);

import { attachmentsRouter } from "./router/attachments.mjs";
app.use("/api/attachments", attachmentsRouter);

import { answersRouter } from "./router/answers.mjs";
app.use("/api/answers", answersRouter);

import { documentsRouter } from "./router/documents.mjs";
app.use("/api/documents", documentsRouter);

app.use(errorHandler)

app.use(({ res }) => {
    const message = "Impossible de trouver la ressource.";
    res.status(404).json(message);
});

app.listen(port, () => {
    console.log(`Tester app listening on port ${port}`);
})