<script>
import axios from 'axios';

export default {
    props: {
        user: {
            type: Object,
            required: true,
        }
    },
    methods: {
        async updateUser() {
            const APIUpdateUserCall = `http://localhost:3000/api/users/${this.user.idUser}`

            const payload = {
                login: this.user.login,
                firstname: this.user.firstname,
                name: this.user.name,
                role: this.user.role,
            }

            try {
                await axios
                    .put(APIUpdateUserCall, payload, {
                        withCredentials: true
                    }
                );
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async archivateUser() {
            const APIArchivateUserCall = `http://localhost:3000/api/users/archivate/${this.user.idUser}`;

            try {
                await axios
                    .put(APIArchivateUserCall, {}, {
                        withCredentials: true
                    }
                );
                this.user.isDeleted = true;
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
    }
}
</script>
<template>
    <div class="user">
        <span>login: <input type="text" v-model="user.login" @change="updateUser()"/></span> <!--must have length of 7-->
        <span>Prénom: <input type="text" v-model="user.firstname" @change="updateUser()" /></span>
        <span>Nom: <input type="text" v-model="user.name" @change="updateUser()" /></span>
        <span>Rôle: 
            <select v-model="user.role" @change="updateUser()">
                <option value="student">Élève</option>
                <option value="teacher">Professeur</option>
                <option value="admin">Administrateur</option>
            </select>
        </span>
        <p>Créé le {{ user.createdAt }}</p>
        <button @click="archivateUser()">Supprimer</button>
    </div>
</template>
<style scoped>
.user {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    border-radius: 10px;
    background-color: #fafafa;
    border: 1px solid #e5e7eb;
    transition: 0.2s ease;
}

.user:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.user span {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #555;
}

.user input,
.user select {
    margin-top: 5px;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    transition: 0.2s ease;
}

.user input:focus,
.user select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.user p {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
}

.user button {
    margin-top: 10px;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background-color: #ef4444;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s ease;
}

.user button:hover {
    background-color: #dc2626;
}
</style>