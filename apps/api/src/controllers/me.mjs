export async function disconnect(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussi." })
}

export async function getMe(req, res) {
    res.json({ userId: req.user.userId, role: req.user.role });
}