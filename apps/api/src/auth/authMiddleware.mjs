import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";

const auth = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decodedToken = jwt.verify(token, privateKey);
        req.user = decodedToken;next();
    } catch (error) {
        return res.status(401).json({ message: "Access denied" });
    }
};

export { auth };