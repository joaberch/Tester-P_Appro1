<script>
import axios from "axios";
import { RouterLink } from "vue-router";
import TestDescription from "../components/test/testDescription.vue";
import Question from "../components/test/question.vue";

export default {
    components: {
        TestDescription,
        Question
    },
    data() {
        return {
            test: [],
            questions: [],
            loaded: false,
            isStarted: false,
        }
    },
    async mounted() {
        let APIGetTestCall = `http://localhost:3000/api/tests/${this.$route.params.id}`;

        const fetchedTest = await axios.get(APIGetTestCall, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            }
        });
        this.test = fetchedTest.data.data;

        this.loaded = true;
    },
    methods: {
        async startTest() {
            await this.fetchQuestions()
            this.isStarted = true;
        },
        async fetchQuestions() {
            let APIGetQuestionsCall = `http://localhost:3000/api/tests/${this.$route.params.id}/questions`;

            const fetchedQuestions = await axios.get(APIGetQuestionsCall, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`
                }
            });
            this.questions = fetchedQuestions.data.data;
        }
    }
}
</script>
<template>
  <div class="test-page">
    <div v-if="!this.loaded">Chargement du test...</div>
    <div v-else>
      <div id="header">
        <RouterLink :to="{ name: 'home' }">Accueil</RouterLink>
        <button>Modifier le test</button>
      </div>
      <div id="description">
        <TestDescription @start-test="startTest" :test="test"/>
      </div>
      <div v-if="this.isStarted">
        <Question :questions="this.questions" :test="test"/>
      </div>
    </div>
  </div>
</template>
<style scoped>
.test-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 40px 20px;
  font-family: Arial, Helvetica, sans-serif;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

#header a {
  text-decoration: none;
  color: #3498db;
  font-weight: bold;
  font-size: 16px;
}

#header a:hover {
  text-decoration: underline;
}

#header button {
  padding: 8px 16px;
  border: none;
  background-color: #f39c12;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

#header button:hover {
  background-color: #e67e22;
}

#description {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

div[v-if] {
  font-size: 18px;
  text-align: center;
  padding: 40px;
}
</style>