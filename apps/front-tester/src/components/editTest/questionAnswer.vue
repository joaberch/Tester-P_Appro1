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
            console.log(this.answers)
        }
    }
}
</script>
<template>
    <div class="answers">
        <div v-if="this.question.type == 'checkbox'">
            TODO
        </div>
        <div v-else-if="this.question.type == 'radiobox'">
            <input type="radio" :name="'question-' + question.idQuestion" value="true">Vrai</input>
            <input type="radio" :name="'question-' + question.idQuestion" value="false">Faux</input>
        </div>
    </div>
</template>