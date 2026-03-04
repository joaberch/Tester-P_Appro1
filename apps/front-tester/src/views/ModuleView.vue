<script>
import axios from 'axios';

export default {
    data() {
        return {
            module: [],
            objectives: [],
        }
    },
    mounted() {
        this.fetchModule();
        this.fetchObjectives();
    },
    methods: {
        async fetchModule() {
            const APIGetModuleCall = `${import.meta.env.VITE_API_URL}/modules/${this.$route.params.id}`;

            try {
                const fetchedModule = await axios
                    .get(APIGetModuleCall, {
                        withCredentials: true
                    }
                );

                this.module = fetchedModule.data.data;
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async fetchObjectives() {
          const APIGetModuleObjectivesCall = `${import.meta.env.VITE_API_URL}/objectives/?idModule=${this.$route.params.id}`

          try {
            const fetchedObjectives = await axios
              .get(APIGetModuleObjectivesCall, {
                withCredentials: true
              }
            );

            this.objectives = fetchedObjectives.data.data.filter(o => o.isDeleted == false);
          } catch (error) {
            console.error("Erreur:", error)
          }
        },
        goToEdit() {
          this.$router.push(`/module/edit/${this.$route.params.id}`);
        }
    }
}
</script>
<template>
  <div class="module-container">
    <div class="header">
      <RouterLink :to="{ name: 'home' }" class="back-btn">Accueil</RouterLink>
      <h2>{{ module.name }}</h2>
      <button class="edit-btn" @click="goToEdit()">
        Modifier le module
      </button>
    </div>

    <div class="module-info">
      <p class="description">
        {{ module.description }}
      </p>

      <p v-if="module.isDeleted" class="archived">
        ATTENTION! Ce module a été archivé.
      </p>
    </div>

    <div class="objectives-section">
      <h3>Objectifs du module</h3>

      <div class="objectives" v-if="this.objectives.length > 0">
        <div v-for="objective in objectives" :key="objective.idObjective">
          <div>
            <p>{{ objective.name }}</p>
            <p class="data">
              <span>{{ objective.description }}</span>
              <span>
                {{ objective.bloomLevel }} - 
                <span v-if="objective.bloomLevel==1">Connaître</span>
                <span v-else-if="objective.bloomLevel==2">Comprendre</span>
                <span v-else-if="objective.bloomLevel==3">Appliquer</span>
                <span v-else-if="objective.bloomLevel==4">Analyser</span>
                <span v-else-if="objective.bloomLevel==5">Évaluer</span>
                <span v-else-if="objective.bloomLevel==6">Créer</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="no-objectives" v-else>
        Aucun objectif défini.
      </div>
    </div>
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

.data {
  display: flex;
  justify-content: space-between;
}

.module-container {
  max-width: 900px;
  margin: 50px auto;
  padding: 40px;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  font-family: "Inter", "Segoe UI", sans-serif;
  transition: all 0.3s ease;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 15px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 0.5px;
}

/* Module info */
.module-info {
  margin-bottom: 35px;
}

.description {
  font-size: 16px;
  line-height: 1.8;
  color: #4b5563;
}

.archived {
  margin-top: 15px;
  padding: 10px 14px;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

/* Objectives Section */
.objectives-section h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.objectives > div {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 18px 20px;
  border-radius: 12px;
  transition: all 0.25s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
}

.objectives > div:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}

.objectives p {
  margin: 5px 0;
}

.objectives span {
  font-size: 14px;
  color: #6b7280;
}

.no-objectives {
  padding: 15px;
  background-color: #f3f4f6;
  border-radius: 8px;
  font-style: italic;
  color: #6b7280;
}

/* Buttons */
.edit-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.25s ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
}

.edit-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Responsive */
@media (max-width: 768px) {
  .module-container {
    padding: 25px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header h2 {
    font-size: 20px;
  }
}
</style>