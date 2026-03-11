<script>
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL

export default {
    props: {
        user: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            isDisplayed: false,
            localUser: {},
        }
    },
    methods: {
        async updateUser() {
            const APIUpdateUserCall = `${VITE_API_URL}/users/${this.user.idUser}`

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
                Object.assign(this.user, this.localUser);
                this.isDisplayed = false;
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async archivateUser() {
            const APIArchivateUserCall = `${VITE_API_URL}/users/archivate/${this.user.idUser}`;

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
        openUser() {
            this.localUser = { ...this.user };
            this.isDisplayed = true;
        }
    }
}
</script>
<template>
    <div class="user-card" @click="openUser()" v-if="!isDisplayed">
        <span>{{ user.firstname }} {{ user.name }}</span>
        <span>{{ user.login }}</span>
    </div>
    <div class="user" v-else>
        <span>login: <input type="text" v-model="localUser.login" /></span> <!--must have length of 7-->
        <span>Prénom: <input type="text" v-model="localUser.firstname" /></span>
        <span>Nom: <input type="text" v-model="localUser.name" /></span>
        <span>Rôle: 
            <select v-model="localUser.role">
                <option value="student">Élève</option>
                <option value="teacher">Professeur</option>
                <option value="admin">Administrateur</option>
            </select>
        </span>
        <p>Créé le {{ user.createdAt }}</p>
        <button class="save" @click="updateUser()">Sauvegarder</button>
        <button class="delete" @click="archivateUser()">Supprimer</button>
    </div>
</template>
<style scoped>
.user-card {
    padding: 15px;
    border-radius: 12px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.user {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    border-radius: 12px;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
}

.user:hover {
    box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}

.user span {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #4b5563;
}

.user input,
.user select {
    margin-top: 6px;
    padding: 10px 12px;
    border-radius: 8px;
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
    color: #9ca3af;
    margin-top: 5px;
}

.user button {
    margin-top: 12px;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.user button.save {
    background-color: #3b82f6;
    color: white;
}

.user button.save:hover {
    background-color: #2563eb;
}

.user button.delete {
    background-color: #ef4444;
    color: white;
}

.user button.delete:hover {
    background-color: #dc2626;
}

/* Responsive small screens */
@media (max-width: 480px) {
    .user, .user-card {
        padding: 15px;
    }
    .user input, .user select {
        font-size: 13px;
        padding: 8px 10px;
    }
    .user button {
        font-size: 13px;
        padding: 8px 10px;
    }
}
</style>