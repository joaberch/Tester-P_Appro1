import * as loginService from "../services/login.mjs"

export async function login(req, res) {
    const token = await loginService.login(req.headers.authorization, req.body);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE,
        sameSite: process.env.COOKIE_SAMESITE
    });

    res.status(200).json(token);
}