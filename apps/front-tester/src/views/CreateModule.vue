<script>
import axios from 'axios';

export default {
    data() {
        return {
            module: {},
        }
    },
    methods: {
        async create() {
            const APICreateModuleCall = `http://localhost:3000/api/modules/`;

            const payload = {
                name: this.module.name,
                description: this.module.name,
                bloomLevel: this.module.name,
                isDeleted: this.module.isDeleted,
            }

            try {
                await axios
                    .post(APICreateModuleCall, payload, {
                        headers: {
                            Authorization: `Bearer ${localStorage.token}`
                        }
                    }
                );
                
            } catch (error) {
                console.error("Erreur:", error)
            }
        }
    }
}
</script>
<template>
  <div id="create-module-container">
    <RouterLink class="back-btn" :to="{ name: 'home'}">Accueil</RouterLink>
    <h2>Créer un nouveau module</h2>

    <div class="form-group">
      <label for="module-name">Nom du module :</label>
      <input id="module-name" type="text" v-model="module.name" placeholder="Entrez le nom du module" />
    </div>

    <div class="form-group">
      <label for="module-description">Description :</label>
      <textarea id="module-description" v-model="module.description" placeholder="Entrez la description"></textarea>
    </div>

    <div class="checkbox-group">
      <label>
        <input type="checkbox" v-model="module.isDeleted" />
        Archivé
      </label>
    </div>

    <button class="save-btn" @click="create()">Créer le module</button>
  </div>
</template>

<style scoped>
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

#create-module-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#create-module-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
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
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #1e8449;
}

/* Responsive */
@media (max-width: 480px) {
  .checkbox-group {
    flex-direction: column;
  }
}
</style>