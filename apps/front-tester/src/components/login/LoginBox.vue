<script>
import msalInstance, { loginRequest } from "../../config/authConfig";
import axios from "axios";

export default {
    data() {
        return {
            isPasswordDisplayed: false,
            errorMessage: '',
            isLogin: false,
        }
    },
    methods: {
        async azureLogin() {
            if (this.isLogin) {
                console.error("Une tentative de connexion est déjà en cours.");
                return;
            }
            this.isLogin = true;

            try {
                await msalInstance.loginRedirect(loginRequest);
            } catch (error) {
                console.error(error);
            } finally {
                this.isLogin = false;
            }
        },
    },
    async mounted() {
        try {
            const res = await msalInstance.handleRedirectPromise();
            if (!res) return;

            const token = res.idToken;
            const APIStoreTokenCall = `${import.meta.env.VITE_API_URL}/auth/token`;
            await axios.post(APIStoreTokenCall, { token: token }, {
                withCredentials: true,
            });
        } catch (error) {
            console.error(error);
        }
    }
}
</script>
<template>
    <div class="global">
        <div class="wrapper">
            <div>
                <h1>Connexion</h1>
                <button @click="azureLogin()" class="btn">Connexion Azure</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.global {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f0f2f5;
    font-family: Arial, sans-serif;
}

.wrapper {
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 350px;
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.input-box {
    margin-bottom: 20px;
    position: relative;
}

.input-box input {
    width: 100%;
    padding: 12px 0px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
}

.input-box input:focus {
    border-color: #007bff;
}

.input-box i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #888;
}

.error {
    color: red;
    font-size: 0.85em;
    margin-top: 5px;
}

.btn {
    width: 100%;
    padding: 12px;
    border: none;
    background-color: #007bff;
    color: white;
    font-size: 1em;
    border-radius: 8px;
    cursor: pointer;
}

.btn:hover {
    background-color: #0056b3;
}
</style>