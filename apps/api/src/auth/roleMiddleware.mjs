const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Vous n'avez pas le rôle requis pour accéder à la ressource" } );
        }
        next();
    }
}

export default authorizeRoles;