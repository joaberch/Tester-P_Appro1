import express from "express";

const app = express();
app.use(express.json())

const port = 3000;

import { sequelize } from "./db/sequelize.mjs";
sequelize
    .authenticate()
    .then((_) => console.log("La connexion à la base de données a bien été créé."))
    .catch((error) => console.error(`Impossible de se connecter à la base de données :\n- ${error}`));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/api/', (req, res) => {
    res.redirect(`http://localhost:${port}/`)
})

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

import { attachementsRouter } from "./router/attachements.mjs";
app.use("/api/attachements", attachementsRouter);

app.use(({ res }) => {
    const message = "Impossible de trouver la ressource.";
    res.status(404).json(message);
});

app.listen(port, () => {
    console.log(`Tester app listening on port ${port}`);
})