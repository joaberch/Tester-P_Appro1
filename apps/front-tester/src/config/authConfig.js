import { PublicClientApplication } from '@azure/msal-browser'

const tenant_id = import.meta.env.VITE_TENANT_ID
const client_id = import.meta.env.VITE_CLIENT_ID
const redirect_uri = import.meta.env.VITE_REDIRECT_URI

if (!tenant_id || !client_id || !redirect_uri) {
    throw new Error(".env value not found")
}

export const msalConfig = {
    auth: {
        clientId: client_id,
        authority: `https://login.microsoftonline.com/${tenant_id}`,
        redirectUri: redirect_uri,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message) => {
                console.log("MSAL", message);
            },
            logLevel: 3
        }
    }
}

export const loginRequest = {
    scopes: ["openid", "profile", "email"]
}

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
    console.log("MSAL Init");
}).catch ((error) => {
    console.log("Error : MSAL did not init", error);
})

export default msalInstance