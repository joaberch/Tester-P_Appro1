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
            selectedAnswers: [],
        }
    },
    mounted() {
        this.fetchAllAnswers(this.question.idQuestion)
    },
    methods: {
        async fetchAllAnswers(questionId) {
            const APIGetAnswersOfQuestionCall = `http://localhost:3000/api/questions/${questionId}/answers`;

            const fetchedAnswers = await axios
                .get(APIGetAnswersOfQuestionCall, {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`
                    }
                }
            );

            this.answers = fetchedAnswers.data.data;
        }
    }
}
</script>
<template>
    <div class="answers">
        <div v-if="this.question.type == 'checkbox'">
            <div v-for="answer in answers">
                <input type="checkbox" :value="answer.idAnswer" v-model="selectedAnswers">{{ answer.answer }}</input>
            </div>
        </div>
        <div v-else-if="this.question.type == 'radiobox'">
            <div v-for="answer in answers">
                <input type="radio" :value="answer.idAnswer" v-model="selectedAnswers" :name="'question-' + question.idQuestion">{{ answer.answer }}</input>
            </div>
        </div>
    </div>
</template>