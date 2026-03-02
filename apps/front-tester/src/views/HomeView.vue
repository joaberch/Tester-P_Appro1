<script>
import TestsModules from "../components/home/tests-modules.vue"
import { decodeToken } from "../utils/decodeToken.mjs";
    
export default {
    components: {
        TestsModules
    },
    methods: {
        disconnect() {
            localStorage.removeItem("token");
            this.$router.push('/login');
        }
    },
    data() {
        return {
            tokenExist: false,
            token: '',
        }
    },
    mounted() {
        localStorage.getItem('token') ? (this.tokenExist = true, this.token = decodeToken(localStorage.token)) : this.tokenExist = false;
    }
}
</script>
<template>
    <div id="header">
        <RouterLink class="button" v-if="this.token.role == 'teacher' || this.token.role == 'admin'" :to="{ name: 'create-test' }">Créer un test</RouterLink>
        <RouterLink class="button" v-if="this.token.role == 'teacher' || this.token.role == 'admin'" :to="{ name: 'create-module'}">Créer un module</RouterLink>
        <button v-if="this.token.role == 'admin'">Console admin</button>
        <button @click="disconnect()">Se déconnecter</button>
    </div>
    <TestsModules />
</template>
<style scoped>
#header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px 20px;
    background-color: #2c3e50; /* gris foncé */
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#header button, .button {
    background-color: #e74c3c; /* rouge */
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
    background-color: #c0392b; /* rouge plus foncé au survol */
}
</style>