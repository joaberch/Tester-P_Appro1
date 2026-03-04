<script>
import User from '../components/admin/user.vue';
import axios from "axios";

export default {
    data() {
        return {
            users: [],
        }
    },
    props: {
        user: {
            type: Object,
            required: true,
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
        <RouterLink class="button" :to="{ name: 'home' }">Accueil</RouterLink>
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