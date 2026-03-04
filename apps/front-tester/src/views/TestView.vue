<script>
import axios from "axios";
import { RouterLink } from "vue-router";
import TestDescription from "../components/test/testDescription.vue";
import Question from "../components/test/question.vue";
import { jsPDF } from "jspdf";

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
    this.fetchTest();
    this.fetchQuestions();
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
        withCredentials: true
      });
      this.questions = fetchedQuestions.data.data;
    },
    async fetchTest() {
      let APIGetTestCall = `http://localhost:3000/api/tests/${this.$route.params.id}`;

      const fetchedTest = await axios.get(APIGetTestCall, {
        withCredentials: true
      });
      this.test = fetchedTest.data.data;
    },
    async getQuestionAnswer(id) {
      const APIGetQuestionAnswers = `http://localhost:3000/api/questions/${id}/answers`;

      try {
        const fetchedAnswers = await axios
          .get(APIGetQuestionAnswers, {
            withCredentials: true
          }
          );
        return fetchedAnswers.data.data;
      } catch (error) {
        console.error("Erreur:", error)
      }
    },
    async exportToPDF() {
      const doc = new jsPDF();

      doc.setFontSize(20); //title
      doc.text(this.test.name, 20, 20);

      doc.setFontSize(12); //other
      doc.text(this.test.description, 20, 35);

      let startY = 50;

      for (let i = 0; i < this.questions.length; ++i) { //questions
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
        doc.setFontSize(14);
        doc.text(`${i + 1}. ${this.questions[i].question}`, 20, startY);
        startY += 10;
        if (this.questions[i].type != "open") {
          const answers = await this.getQuestionAnswer(this.questions[i].idQuestion);
          if (this.questions[i].type == "radiobox") {
            for (let j = 0; j < answers.length; ++j) {
              doc.text("(  )  " + answers[j].answer, 20, startY)
              startY += 10;
            }
          } else if (this.questions[i].type == "checkbox") {
            for (let j = 0; j < answers.length; ++j) {
              doc.text("[  ]  " + answers[j].answer, 20, startY)
              startY += 10;
            }
          }
          startY += 10
        } else {
          startY += 20
        }

      };

      doc.save(`${this.test.name}.pdf`);
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
        <div class="right-part">
          <RouterLink class="button" :to="{ name: 'edit-test' }">Modifier le test</RouterLink>
          <!--<RouterLink class="button" :to="{ name: 'correct-test' }">Corriger les tests</RouterLink>-->
        </div>
      </div>
      <div id="description">
        <TestDescription @start-test="startTest" :test="test" />
      </div>
      <div v-if="this.isStarted">
        <Question :questions="this.questions" :test="test" />
      </div>
      <button @click="exportToPDF()">Exporter en PDF</button>
    </div>
  </div>
</template>
<style scoped>
button {
  margin-top: 20px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

button:active {
  transform: translateY(0px);
  box-shadow: none;
}

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

#header .button {
  padding: 8px 16px;
  border: none;
  background-color: #f39c12;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

#header .button:hover {
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