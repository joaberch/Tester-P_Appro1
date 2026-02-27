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
    methods: {
        async archivateQuestion(idQuestion) {
            try {
                const APIArchivateQuestionCall = `http://localhost:3000/api/questions/archivate/${idQuestion}`
                
                await axios
                    .put(APIArchivateQuestionCall, {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.token}`
                        }
                    }
                );
                this.question.isDeleted = true; //Change locally to not reload page
            } catch (error) {
                console.error("Erreur :", error)
            }
        }
    }
}
</script>
<template>
    <div class="question" v-if="!question.isDeleted">
        <div class="question-header">
            Question : <input type="text" v-model="question.question" placeholder="Texte de la question" />
            Points : <input type="number" v-model.number="question.point" min="0" class="points" placeholder="Points" />
            <button @click="archivateQuestion(question.idQuestion)" class="delete-btn">Supprimer</button>
        </div>

        <label>
            Type :
            <select v-model="question.type">
                <option value="checkbox">checkbox</option>
                <option value="OPEN">Ouverte</option>
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