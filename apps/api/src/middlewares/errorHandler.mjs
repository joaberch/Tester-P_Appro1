import { ValidationError } from "sequelize";

export function errorHandler(err, req, res, next) {
    console.error(err); //dev log

    const safeError = {
        name: err.name,
        message: err.message,
        errors: err.errors ? err.errors.map(e => ({
            message: e.message,
            path: e.path,
            value: e.value,
        })) : undefined
    };

    if (err.name == "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({ message: "Impossible de supprimer cet élément car il est encore lié à d'autres tables.", data: safeError });
    }
    if (err.name == "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "L'élément a des attributs uniques.", data: safeError })
    }
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message, data: safeError });
    }
    return res.status(err.status || 500).json({ message: err.message || "Internal server error", data: safeError });
}