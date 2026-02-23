import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";

const auth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        const message = "Vous n'êtes pas connecté. Ajoutez votre jeton d'authentification dans la requête.";
        return res.status(401).json({ message });
    }

    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(
        token, privateKey,
        (error, decodedToken) => {
            if (error) {
                const message = "Access denied";
                return res.status(401).json({ message });
            }
            const userId = decodedToken.idUser;
            if (req.body.idUser && req.body.idUser !== userId) {
                const message = "Identifiant invalide.";
                return res.status(401).json({ message });
            }
            next();
        }
    );
};

export { auth };