<script>
import axios from "axios";

export default {
    props: {
        question: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            answers: [],
            saveTimeout: null,
        }
    },
    mounted() {
        this.fetchAllAnswers(this.question.idQuestion)
    },
    methods: {
        async fetchAllAnswers(questionId) {
            const APIGetAnswersOfQuestionCall = `${import.meta.env.VITE_API_URL}/questions/${questionId}/answers`;

            const fetchedAnswers = await axios
                .get(APIGetAnswersOfQuestionCall, {
                    withCredentials: true
                }
                );

            this.answers = fetchedAnswers.data.data;
        },
        async createAnswer() {
            const newAnswer = {
                answer: "", //base value
                isCorrect: false, //base value
                isDeleted: false, //base value
                idQuestion: this.question.idQuestion,
            }

            const APICreateAnswerCall = `${import.meta.env.VITE_API_URL}/answers`;

            try {
                const createdAnswer = await axios
                    .post(APICreateAnswerCall, newAnswer, {
                        withCredentials: true
                    }
                    );

                    this.answers.push(createdAnswer.data.data);
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        debounceUpdateAnswer(answer) {
            clearTimeout(this.saveTimeout);

            this.saveTimeout = setTimeout(() => {
                this.updateAnswer(answer);
            }, 1000)
        },
        async updateAnswer(answer) {
            const APIUpdateAnswerCall = `${import.meta.env.VITE_API_URL}/answers/${answer.idAnswer}`

            const payload = {
                answer: answer.answer,
                isCorrect: answer.isCorrect,
                isDeleted: answer.isDeleted,
            }

            try {
                await axios
                    .put(APIUpdateAnswerCall, payload, {
                        withCredentials: true
                    }
                );
            } catch (error) {
                console.error("Erreur:", error)
            }
        },
        async archivateAnswer(answer) {
            const APIArchivateAnswerCall = `${import.meta.env.VITE_API_URL}/answers/archivate/${answer.idAnswer}`

            try {
                await axios
                    .put(APIArchivateAnswerCall, {}, {
                        withCredentials: true
                    }
                );

                this.answers = this.answers.filter(a => a.idAnswer !== answer.idAnswer);
            } catch (error) {
                console.error("Erreur: ", error)
            }
        }
    }
}
</script>
<template>
    <div class="answers">
        <div v-if="this.question.type == 'checkbox'">
            <div v-for="answer in answers">
                <div v-if="!answer.isDeleted">
                    <input type="checkbox" v-model="answer.isCorrect" @change="debounceUpdateAnswer(answer)"/> <!--TODO - debounced save-->
                    <input type="text" v-model="answer.answer" placeholder="Texte de la réponse" @input="debounceUpdateAnswer(answer)"/> <!--TODO - debounced save-->
                    <button class="delete" @click="archivateAnswer(answer)">Supprimer</button>
                </div>
            </div>
            <button class="add-answer-btn" @click="createAnswer()">Ajouter une réponse possible</button>
        </div>
        <div v-else-if="this.question.type == 'radiobox'">
            <div v-for="answer in answers">
                <div v-if="!answer.isDeleted">
                    <input type="radio" v-model="answer.isCorrect" :name="'question-' + question.idQuestion" @change="debounceUpdateAnswer(answer)" /> <!--TODO - debounced save-->
                    <input type="text" v-model="answer.answer" placeholder="Texte de la réponse" @input="debounceUpdateAnswer(answer)"/> <!--TODO - debounced save-->
                    <button class="delete" @click="archivateAnswer(answer)">Supprimer</button>
                </div>
            </div>
            <button class="add-answer-btn" @click="createAnswer()">Ajouter une réponse possible</button>
        </div>
    </div>
</template>
<style scoped>
.answers {
    margin: 20px 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.answer-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: #fafafa;
    transition: background-color 0.2s, box-shadow 0.2s;
}

.answer-item:hover {
    background-color: #f0f8ff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.answers input[type="text"] {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.answers input[type="checkbox"],
.answers input[type="radio"] {
    transform: scale(1.2);
    cursor: pointer;
}

.answers button {
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: background-color 0.2s;
}

.delete:hover {
    background-color: #c0392b;
}

.delete {
    background-color: #e74c3c;
}

.add-answer-btn {
    margin-top: 10px;
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.add-answer-btn:hover {
    background-color: #2980b9;
}

/* Responsive for small screens */
@media (max-width: 480px) {
    .answer-item {
        flex-direction: column;
        align-items: stretch;
    }
    
    .answers input[type="text"] {
        width: 100%;
    }
    
    .answers button {
        align-self: flex-end;
        margin-top: 6px;
    }
}
</style>