<script>
import User from '../components/admin/user.vue';
import axios from "axios";

export default {
    data() {
        return {
            users: [],
        }
    },
    components: {
        User
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            const APIGetStudentsCall = `${import.meta.env.VITE_API_URL}/users/`;

            try {
                const fetchedStudents = await axios
                    .get(APIGetStudentsCall, {
                        withCredentials: true
                    }
                );

                this.users = fetchedStudents.data.data;
            } catch(error) {
                console.error("Erreur:", error)
            }
        }
    }
}
</script>
<template>
    <div class="header">
        <RouterLink class="button back-btn" :to="{ name: 'home' }">Accueil</RouterLink>
        <RouterLink class="button" :to="{ name: 'create-user' }">Créer un utilisateur</RouterLink>
    </div>
    <div class="users">
        <div class="teachers">
            <h2>Professeurs</h2>
            <div class="user" v-for="user in users">
                <User :user="user" v-if="user.role=='teacher' && !user.isDeleted"/>
            </div>
        </div>
        <div class="students">
            <h2>Élèves</h2>
            <div class="user" v-for="user in users">
                <User :user="user" v-if="user.role=='student' && !user.isDeleted"/>
            </div>
        </div>
        <div class="admins">
            <h2>Administrateurs</h2>
            <div class="user" v-for="user in users">
                <User :user="user" v-if="user.role=='admin' && !user.isDeleted"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-left: 25px;
    margin-right: 25px;
}
.button {
    background-color: #0084ff; /* rouge */
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
    text-decoration: none;
}

.button:hover {
    background-color: #0400ff; /* rouge plus foncé au survol */
}

.back-btn {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 8px;
  background-color: #e5e7eb;
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #d1d5db;
}

.users {
    display: flex;
    gap: 40px;
    padding: 30px;
    background-color: #f4f6f9;
    min-height: 100vh;
    box-sizing: border-box;
}

.teachers,
.students,
.admins {
    flex: 1;
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 10px;
}

.user {
    margin-bottom: 20px;
}
</style>