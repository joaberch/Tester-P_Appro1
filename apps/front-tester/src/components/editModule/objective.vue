<script>
import axios from 'axios';

export default {
    props: {
        objective: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            saveTimeout: null,
        }
    },
    methods: {
        debounceUpdateObjective(objective) {
            clearTimeout(this.saveTimeout);

            this.saveTimeout = setTimeout(() => {
                this.updateObjective(objective);
            }, 1000)
        },
        async updateObjective(objective) {
            const APIUpdateObjectiveCall = `${import.meta.env.VITE_API_URL}/objectives/${this.objective.idObjective}`;

            const payload = {
                name: objective.name,
                description: objective.description,
                bloomLevel: objective.bloomLevel,
            }

            try {
                await axios
                    .put(APIUpdateObjectiveCall, payload, {
                        withCredentials: true
                    }
                );
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async archivateObjective() {
            const APIArchivateObjectiveCall = `${import.meta.env.VITE_API_URL}/objectives/archivate/${this.objective.idObjective}`;

            try {
                await axios
                    .put(APIArchivateObjectiveCall, {}, {
                        withCredentials: true
                    }
                );

                this.objective.isDeleted = true;
            } catch (error) {
                console.error("Erreur:", error)
            }
        }
    }
}
</script>
<template>
    <div class="objective-card" v-if="!this.objective.isDeleted">
        <div>
            <div class="head">
                Objectif:
                <input type="text" v-model="objective.name" placeholder="Nom" @input="updateObjective(objective)" />
                <button class="delete" @click="archivateObjective(objective)">Supprimer</button>
            </div>

            Description:<textarea v-model="objective.description" placeholder="Description" @input="updateObjective(objective)"></textarea>

            Niveau de bloom:<select v-model="objective.bloomLevel" @change="updateObjective(objective)">
                <option :value="1">1 - Connaître</option>
                <option :value="2">2 - Comprendre</option>
                <option :value="3">3 - Appliquer</option>
                <option :value="4">4 - Analyser</option>
                <option :value="5">5 - Évaluer</option>
                <option :value="6">6 - Créer</option>
            </select>
        </div>
    </div>
</template>
<style scoped>
/* ==============================
   Carte objectif
   ============================== */
.objective-card {
    background-color: #fdfdfd;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.25s ease;
}

.objective-card:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Conteneur interne pour inputs et textarea */
.objective-card > div {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* Ligne contenant nom et bouton supprimer */
.objective-card > div > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

/* ==============================
   Inputs et textarea
   ============================== */
input,
select {
    padding: 10px 12px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e0;
    transition: all 0.2s ease;
    width: 100%;
}

textarea {
    padding: 10px 0px;
    padding-left: 6px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e0;
    transition: all 0.2s ease;
    width: 100%;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

textarea {
    resize: vertical;
    min-height: 70px;
}

/* ==============================
   Bouton Supprimer
   ============================== */
.delete {
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    transition: background 0.2s ease;
}

.delete:hover {
    background-color: #dc2626;
}

/* ==============================
   Sélecteur Bloom
   ============================== */
select {
    max-width: 200px;
}

/* Responsive léger pour mobile */
@media (max-width: 500px) {
    .objective-card > div > div:first-child {
        flex-direction: column;
        align-items: stretch;
    }

    .delete {
        width: 100%;
    }
}
</style>