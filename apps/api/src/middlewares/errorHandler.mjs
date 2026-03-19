import { ValidationError } from "sequelize";

export function errorHandler(err, req, res, next) {
    console.error(err); //dev log
    if (err.name == "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({ message: "Impossible de supprimer cet élément car il est encore lié à d'autres tables.", data: err });
    }
    if (err.name == "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "L'élément a des attributs uniques.", data: err })
    }
    if (err instanceof SequelizeUniqueConstraintError) {
        res.status(400).json({ message: "L'utilisateur a déjà été assigné à ce test", data: err })
    }
    if (err instanceof ValidationError) {
        res.status(400).json({ message: err.message, data: err });
    }
    res.status(err.status || 500).json({ message: err.message });
}