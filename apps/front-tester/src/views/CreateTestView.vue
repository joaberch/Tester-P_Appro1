<script>
import axios from "axios";

export default {
    data() {
        return {
            test: {
                name: '',
                description: '',
                duration: 0,
                isDeleted: false,
                isFormative: false,
            },
            modules: [],
            moduleChosen: null,
        }
    },
    mounted() {
        this.fetchAllModules()
    },
    methods: {
        async fetchAllModules() {
            const APIGetAllModulesCall = `http://localhost:3000/api/modules`;

            try {
                const fetchedModules = await axios
                    .get(APIGetAllModulesCall, {
                        headers: {
                            Authorization: `Bearer ${localStorage.token}`
                        }
                    }
                );

                this.modules = fetchedModules.data.data;
            } catch(error) {

            }
        },
        async createTest() {
            const APICreateTest = `http://localhost:3000/api/tests`;

            const payload = {
                name: this.test.name,
                description: this.test.description,
                duration: this.test.duration,
                isDeleted: this.test.isDeleted,
                isFormative: this.test.isFormative,
                idModule: this.moduleChosen,
            }

            try {
                await axios
                    .post(APICreateTest, payload, {
                        headers: {
                            Authorization: `Bearer ${localStorage.token}`
                        }
                    }
                );

                this.$router.push('/')
            } catch (error) {
                if (error instanceof SequelizeValidationError) {
                    console.error("Propriété manquante.")
                }
                console.error("Erreur:", error)
            }
        }
    }
}
</script>
<template>
    <div id="create-test-container">
        <h2>Créer un nouveau test</h2>

        <div class="form-group">
            <label for="test-name">Titre du test :</label>
            <input id="test-name" type="text" v-model="test.name" placeholder="Entrez le titre du test" />
        </div>

        <div class="form-group">
            <label for="test-description">Description :</label>
            <textarea id="test-description" v-model="test.description" placeholder="Entrez la description"></textarea>
        </div>

        <div class="form-group">
            <label for="test-duration">Durée (minutes) :</label>
            <input id="test-duration" type="number" min="0" v-model.number="test.duration"
                placeholder="Durée du test" />
        </div>

        <div class="checkbox-group">
            <label>
                <input type="checkbox" v-model="test.isDeleted" />
                Archivé
            </label>

            <label>
                <input type="checkbox" v-model="test.isFormative" />
                Formatif
            </label>
        </div>

        <div class="form-group">
            <label for="module-select">Module associé :</label>
            <select id="module-select" v-model="moduleChosen">
                <option disabled value="">-- Sélectionner un module --</option>
                <option v-for="module in modules" :key="module.idModule" :value="module.idModule">
                    {{ module.idModule }} - {{ module.name }}
                </option>
            </select>
        </div>

        <button class="save-btn" @click="createTest()">Créer le test</button>
    </div>
</template>
<style scoped>
#create-test-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#create-test-container h2 {
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