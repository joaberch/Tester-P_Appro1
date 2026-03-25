import express from "express";
const authRouter = express.Router()
import { storeToken, checkToken, logout } from "../controllers/auth.mjs";

//Définir les routes du routeur
authRouter.post('/token', storeToken) //Stocke le token dans le backend pour une meilleure sécurité
authRouter.get('/check', checkToken) //Récupère le token depuis le backend
authRouter.post('/logout', logout) //Se déconnecter, supprimer le token

export default authRouter;