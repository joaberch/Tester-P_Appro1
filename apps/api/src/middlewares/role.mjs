import { getUser } from "../services/me.mjs";

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        const me = await getUser(req.user.oid) //TODO cleaner
        if(!allowedRoles.includes(me.role)) {
            return res.status(403).json({ message: "Vous n'avez pas le rôle requis pour accéder à la ressource" } );
        }
        next();
    }
}

export default authorizeRoles;