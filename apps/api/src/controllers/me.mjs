import * as meService from "../services/me.mjs";

export async function disconnect(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussi." })
}

export async function getMe(req, res) {
    const azureOid = req.user.oid;

    const user = await meService.getUser(azureOid);
    if (!user) {
        console.log("user not found")
        res.status(404).json(`Utilisateur introuvable`)
    }
    res.status(200).json(user);
}