<script>
import axios from 'axios';

export default {
    data() {
        return {
            user: {},
            error: '',
        }
    },
    methods: {
        async createUser() {
            const APICreateUserCall = `${import.meta.env.VITE_API_URL}/users`;

            const payload = {
                firstname: this.user.firstname,
                name: this.user.name,
                login: this.user.login,
                password: this.user.password,
                role: this.user.role,
                isDeleted: this.user.isDeleted,
            }

            if (!payload.firstname || !payload.name || !payload.login || !payload.password || !payload.role) {
              this.error = "Champ vide.";
              return;
            } else if (payload.login.length != 7) {
              this.error = `Le login doit avoir 7 caractères de long, il en a ${payload.login.length}.`;
              return;
            }

            try {
                await axios
                    .post(APICreateUserCall, payload, {
                        withCredentials: true
                    }
                );

                this.$router.push('/admin')
            } catch (error) {
              console.error("Erreur:", error.name)
              this.error = `Erreur lors de la création de l'utilisateur, veuillez vérifier qu'aucun utilisateur avec l'identifiant ${payload.login} n'existe déjà.`
            }
        }
    }
}
</script>
<template>
  <div id="create-user">
    <RouterLink class="back-btn" :to="{ name: 'home'}">Accueil</RouterLink>
    <h2>Créer un nouvel utilisateur</h2>

    <div class="input">
      <label for="firstname">Prénom :</label>
      <input type="text" v-model="user.firstname" placeholder="Entrez le prénom" />
    </div>

    <div class="input">
      <label for="lastname">Nom :</label>
      <input type="text" v-model="user.name" placeholder="Entrez le nom" />
    </div>

    <div class="input">
      <label for="login">Login :</label> <!--7 length-->
      <input type="login" v-model="user.login" placeholder="Entrez le login de l'utilisateur (7 caractères)" />
      <p></p>
    </div>

    <div class="input">
      <label for="password">Mot de passe :</label>
      <input id="password" type="password" v-model="user.password" placeholder="Entrez le mot de passe" />
    </div>

    <div class="input">
      <label>Rôle :</label>
      <select id="role" v-model="user.role">
        <option disabled value="">Sélectionnez un rôle</option>
        <option value="admin">Administrateur</option>
        <option value="teacher">Enseignant</option>
        <option value="student">Étudiant</option>
      </select>
    </div>

    <div class="checkbox-group">
      <label>
        <input type="checkbox" v-model="user.isDeleted" />
        Archivé
      </label>
    </div>

    <div class="error" v-if="error">
      <p>Erreur : {{ error }}</p>
    </div>

    <button class="save-btn" @click="createUser()">Créer</button>
  </div>
</template>
<style scoped>
.error {
  background-color: #ffe6e6;
  border: 1px solid #ff4d4f;
  color: #b00020;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 12px 0;
  font-size: 14px;
  font-weight: 500;
}

.error p {
  margin: 0;
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

#create-user {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#create-user h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input label {
  margin-bottom: 5px;
  font-weight: 500;
}

.input input,
.input textarea,
.input select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.save-btn {
  display: block;
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #2980b9;
}

@media (max-width: 480px) {
  .checkbox-group {
    flex-direction: column;
  }
}
</style>