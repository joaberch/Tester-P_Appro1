
export async function disconnect(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Déconnexion réussi." })
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getMe(req, res) {
    try {
        res.json({ userId: req.user.userId, role: req.user.role });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}