import express from "express";

const app = express();
app.use(express.json())

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/api/', (req, res) => {
    res.redirect(`http://localhost:${port}/`)
})

import { testsRouter } from "./tests/tests.mjs";
app.use("/api/tests", testsRouter)

app.listen(port, () => {
    console.log(`Tester app listening on port ${port}`);
})