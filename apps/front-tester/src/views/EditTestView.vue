<script>
import axios from "axios";
import TestInformation from "../components/editTest/testInformation.vue";
import TestQuestion from "../components/editTest/testQuestion.vue";

export default {
    components: {
      TestInformation,
      TestQuestion
    },
    data() {
        return {
            test: [],
            questions: [],
        }
    },
    mounted() {
      this.fetchTestData();
      this.fetchTestQuestions();
    },
    methods: {
      async fetchTestData() {
        const APIGetTestDataCall = `http://localhost:3000/api/tests/${this.$route.params.id}`

        const fetchedTest = await axios
          .get(APIGetTestDataCall, {
            withCredentials: true
          });
          this.test = fetchedTest.data.data;
      },
      async fetchTestQuestions() {
        const APIGetTestQuestionsCall = `http://localhost:3000/api/tests/${this.$route.params.id}/questions`

        const fetchedQuestions = await axios
          .get(APIGetTestQuestionsCall, {
            withCredentials: true
          })

          this.questions = fetchedQuestions.data.data;
      },
      async createQuestion() {
        try {
          const APICreateQuestion = `http://localhost:3000/api/questions`
  
          const payload = {
            question: '', //base value
            point: 1, //base value
            type: 'open', //base value
            isDeleted: false,
            idTest: this.test.idTest,
          }

          const createdQuestion = await axios
            .post(APICreateQuestion, payload, {
              withCredentials: true
            }
          );

          this.questions.push(createdQuestion.data.data);
        } catch(error) {
          console.error(error)
        }
      }
    }
}
</script>
<template>
  <div class="edit-test-page">
    <div id="header">
      <RouterLink :to="{ name: 'home' }">Accueil</RouterLink>
      <h1>Modifier le test</h1>
    </div>

    <TestInformation :test="this.test"/>

    <div id="questions">
      <h2>Questions</h2>
      
      <TestQuestion :question="question" v-for="(question, index) in questions" class="question" :key="question.idQuestion || index"/>
      <button @click="createQuestion()" id="add-question-btn">Ajouter une question</button>
    </div>
  </div>
</template>
<style scoped>
.in-line {
  display: flex; /*TODO*/
}

.edit-test-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

#header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

#header h1 {
  margin: 0;
}

#test-info label {
  display: block;
  margin-bottom: 1rem;
}

#test-info input,
#test-info textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#questions {
  margin-top: 2rem;
}

.question {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}

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

#add-question-btn,
button[id="save-btn"] {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#add-question-btn:hover,
button[id="save-btn"]:hover {
  background-color: #40a9ff;
}
</style>