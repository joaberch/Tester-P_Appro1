<script>
import axios from "axios";

export default {
    data() {
        return {
            role: '',
        }
    },
    methods: {
        async disconnect() {
            const APIDisconnectCall = `${import.meta.env.VITE_API_URL}/me/disconnect`;

            try {
                await axios.post(APIDisconnectCall, {}, { withCredentials: true });

                this.$router.push('/login');
            } catch(error) {
                console.error("Erreur:", error)
            }
        },
        async getMe() {
            try {
                const APIGetMeCall = `${import.meta.env.VITE_API_URL}/me`;

                const res = await axios
                    .get(APIGetMeCall, {
                        withCredentials: true
                    }
                );
                this.role = res.data.role
            } catch (error) {
                console.error("Erreur:", error)
            }
        }
    },
    async mounted() {
        if (this.$route.name != "login") {
            await this.getMe();
        }
    },
}
</script>
<template>
    <div id="header" v-if="this.$route.name != 'login'">
        <RouterLink class="button" v-if="this.role == 'teacher' || this.role == 'admin'" :to="{ name: 'create-test' }">Créer un test</RouterLink>
        <RouterLink class="button" v-if="this.role == 'teacher' || this.role == 'admin'" :to="{ name: 'create-module'}">Créer un module</RouterLink>
        <RouterLink class="button" v-if="this.role == 'admin'" :to="{ name: 'admin' }">Console admin</RouterLink>
        <button @click="disconnect()">Se déconnecter</button>
    </div>
</template>
<style scoped>
#header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px 20px;
    background-color: #2c3e50;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

#header button, .button {
    background-color: #0084ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
    text-decoration: none;
}

#header button:hover, .button:hover {
    background-color: #0400ff;
}
</style>