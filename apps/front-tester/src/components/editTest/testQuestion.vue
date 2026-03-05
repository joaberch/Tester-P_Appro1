<script>
import QuestionAnswer from './questionAnswer.vue';
import axios from "axios";

export default {
    props: {
        question: {
            type: Object,
            required: true,
        }
    },
    components: {
        QuestionAnswer,
    },
    data() {
        return {
            saveTimeout: null
        }
    },
    methods: {
        async archivateQuestion(idQuestion) {
            try {
                const APIArchivateQuestionCall = `${import.meta.env.VITE_API_URL}/questions/archivate/${idQuestion}`
                
                await axios
                    .put(APIArchivateQuestionCall, {}, {
                        withCredentials: true
                    }
                );
                this.question.isDeleted = true; //Change locally to not reload page
            } catch (error) {
                console.error("Erreur :", error)
            }
        },
        debounceSaveQuestion(question) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.saveQuestion(question);
            }, 1000)
        },
        async saveQuestion(question) { //TODO - automatically update on exit of input or type changed, check the ressources used
            const APIUpdateQuestion = `${import.meta.env.VITE_API_URL}/questions/${question.idQuestion}`;

            const payload = {
                question: question.question,
                point: question.point,
                type: question.type,
            }

            try {
                await axios
                    .put(APIUpdateQuestion, payload, {
                        withCredentials: true
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
    <div class="question" v-if="!question.isDeleted">
        <div class="question-header">
            Question : <input type="text" v-model="question.question" placeholder="Texte de la question" @input="debounceSaveQuestion(this.question)" />
            Points : <input type="number" v-model.number="question.point" min="0" class="points" placeholder="Points" @input="debounceSaveQuestion(this.question)" />
            <button @click="archivateQuestion(question.idQuestion)" class="delete-btn">Supprimer</button>
        </div>

        <label>
            Type :
            <select v-model="question.type" @change="debounceSaveQuestion(this.question)">
                <option value="checkbox">checkbox</option>
                <option value="open">Ouverte</option>
                <option value="radiobox">radiobox</option>
            </select>
        </label>

        <QuestionAnswer :question="question" /> 
    </div>
</template>
<style scoped>
.question-header {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
}

.question-header input[type="text"] {
    flex: 1;
}

.points {
    width: 70px;
}

.delete-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    border-radius: 3px;
}

.answers {
    margin-top: 0.5rem;
}

.answer {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.3rem;
}

.answer input {
    flex: 1;
}
</style>