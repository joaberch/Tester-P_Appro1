import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { privateKey } from "../auth/private_key.mjs";

const tenant_id = process.env.TENANT_ID
const client_id = process.env.CLIENT_ID

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenant_id}/discovery/v2.0/keys`
})

//Récupérer la clef publique (clef de signature) selon le header du token JWT
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("Error getting signed key:", err)
      return callback(err)
    }
    const signingKey = key.getPublicKey() //Extraire la clef publique
    callback(null, signingKey)
  })
}

function verifyToken(token) {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
          console.log("Error in verifyToken:", err)
          return reject(err)
        }
        //Valider le aud(ience) et le iss(uer)
        if (decoded.aud !== `api://${client_id}`) {
          return reject(new Error("Invalid token"))
        }
        if (decoded.iss !== `https://sts.windows.net/${tenant_id}/`) {
          return reject(new Error("Invalid token"))
        }
        resolve(decoded)
      })
    })
  } catch (error) {
    console.log("Error in verifyToken:", error)
  }
}

const authenticate = async (req, res, next) => {
  next()

  const token = req.cookies.token
  if (!token) {
    return res.status(401).send('Accès refusé: Pas de token fourni.')
  }

  try {
    const decodedToken = await verifyToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('La vérification du token a échoué.', error)
    res.status(400).send('Token invalide')
  }
}

const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decodedToken = jwt.verify(token, privateKey);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Access denied" });
    }
};

export { auth };
export default authenticate;