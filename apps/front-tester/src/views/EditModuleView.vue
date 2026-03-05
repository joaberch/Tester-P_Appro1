<script>
import axios from 'axios';
import Objective from '../components/editModule/Objective.vue';

export default {
    components: {
        Objective
    },
    data() {
        return {
            module: [],
            objectives: [],
        }
    },
    methods: {
        async fetchModule() {
            const APIFetchModuleCall = `${import.meta.env.VITE_API_URL}/modules/${this.$route.params.id}`;

            try {
                const fetchedModule = await axios
                    .get(APIFetchModuleCall, {
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

                this.objectives = fetchedObjectives.data.data;
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async save() {
            const APIUpdateModuleCall = `${import.meta.env.VITE_API_URL}/modules/${this.$route.params.id}`

            const payload = {
                name: this.module.name,
                description: this.module.description,
                isDeleted: this.module.isDeleted,
            }

            try {
                await axios
                    .put(APIUpdateModuleCall, payload, {
                        withCredentials: true
                    }
                    );
            } catch (error) {
                console.error("Erreur:", error);
            }
        },
        async createObjective() {
            const APICreateObjectiveCall = `${import.meta.env.VITE_API_URL}/objectives/`

            const payload = {
                name: '', //base value
                description: '', //base value
                bloomLevel: 1, //base value
                isDeleted: false, //base value
                idModule: this.$route.params.id,
            }

            try {
                const createdObjective = await axios
                    .post(APICreateObjectiveCall, payload, {
                        withCredentials: true
                    }
                    );

                this.objectives.push(createdObjective.data.data)
            } catch (error) {
                console.error("Erreur:", error)
            }
        }
    },
    mounted() {
        this.fetchModule();
        this.fetchObjectives();
    }
}
</script>
<template>
    <div class="module-container">
        <div class="header">
            <RouterLink :to="{ name: 'module' }" class="back-btn">Retour</RouterLink>
            <h2>Modifier le module</h2>
        </div>

        <div class="edit-form">
            <div class="form-group">
                <label>Nom du module</label>
                <input type="text" v-model="module.name" required @input="save()" /> <!--TODO - debounce-->

                <label>Description</label>
                <textarea v-model="module.description" rows="4" @input="save()"></textarea> <!--TODO - debounce-->

                <label>
                    <input type="checkbox" v-model="module.isDeleted" @change="save()" />Archiver le module
                </label>
            </div>
        </div>

        <div class="objectives">
            <div v-for="objective in objectives" :key="objective.idObjective">
                <div v-if="!objective.isDeleted" class="objective">
                    <Objective :objective="objective" />
                </div>
            </div>
        </div>

        <button @click="createObjective()">Créer un objectif</button>
    </div>
</template>
<style scoped>
/* ==============================
   Bouton Retour
   ============================== */
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
    margin-bottom: 15px;
}

.back-btn:hover {
    background-color: #d1d5db;
}

/* ==============================
   Container principal
   ============================== */
.module-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* ==============================
   Header
   ============================== */
.header {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
}

/* ==============================
   Formulaire module
   ============================== */
.edit-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-weight: 500;
    font-size: 14px;
    color: #555;
}

input[type="text"],
textarea,
select {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    transition: all 0.2s ease;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.15);
}

textarea {
    resize: vertical;
    min-height: 80px;
}

.checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

/* ==============================
   Actions du formulaire
   ============================== */
.form-actions {
    display: flex;
    justify-content: flex-end;
}

.save-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease;
}

.save-btn:hover {
    background-color: #2980b9;
}

/* ==============================
   Liste des objectifs
   ============================== */
.objectives {
    display: flex;
    flex-direction: column;
}

.objective {
    margin-top: 20px;
}

/* ==============================
   Bouton Créer un objectif
   ============================== */
button {
    background-color: #10b981;
    /* vert */
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    align-self: flex-start;
}

button:hover {
    background-color: #059669;
}

/* ==============================
   Objectif individuel (Objective.vue)
   ============================== */
.objective-card {
    background: #f9fafb;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.2s ease;
}

.objective-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.objective-card>div {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.objective-card input,
.objective-card textarea,
.objective-card select {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    transition: all 0.2s ease;
}

.objective-card input:focus,
.objective-card textarea:focus,
.objective-card select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.objective-card textarea {
    resize: vertical;
    min-height: 60px;
}

/* Bouton Supprimer objectif */
.objective-card .delete {
    align-self: flex-start;
    background-color: #ef4444;
    /* rouge */
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
}

.objective-card .delete:hover {
    background-color: #dc2626;
}
</style>