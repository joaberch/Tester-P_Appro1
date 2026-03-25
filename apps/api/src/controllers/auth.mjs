export async function storeToken(req, res) {
    const { token } = req.body; //Extraire le token depuis le corps de la requête

    //Vérifier que le token a bien été récupéré
    if (!token) {
        return res.status(400).json({ error: 'Token manquant' });
    }

    //Stocker le token dans un cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'None',
        maxAge: 3600000 //Durée de validité du cookie (en ms), 3600000 = 1h
    });

    res.status(200).json({ message: 'Token stocké en cookie sécurisé' });
}

export async function checkToken(req, res) {
    const token = req.cookies.token; //Extraire le token depuis le cookie

    //Vérifier si le cookie existe
    if (token) {
        res.json({ token });
    } else {
        res.status(404).json({ error: 'Token non trouvé' });
    }
}

export async function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    })
    res.status(200).json({ message: 'Déconnexion réussie, token supprimé'})
}