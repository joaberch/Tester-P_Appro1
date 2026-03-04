<script>
import axios from "axios";

export default {
  props: {
    questions: {
      type: Array,
      required: true
    },
    test: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      answers: {},
      selectedAnswers: {},
    }
  },
  methods: {
    async fetchAnswers(questionId) {
      let APIGetQuestionAnswersCall = `${import.meta.env.VITE_API_URL}/questions/${questionId}/answers`;
      try {
        const fetchedAnswers = await axios.get(APIGetQuestionAnswersCall, {
          withCredentials: true
        });
        this.answers[questionId] = fetchedAnswers.data.data
      } catch (error) {
        console.error("Erreur: ", error);
      }
    },
    async fetchAllAnswers() {
      for (const question of this.questions) {
        if (question.type == "checkbox") {
          await this.fetchAnswers(question.idQuestion);
          this.selectedAnswers[question.idQuestion] = []; //Checkbox can have multiple correct answer
        }
      }
    },
    async createTestDone() {
      try {
        let APICreateDoneTestCall = `${import.meta.env.VITE_API_URL}/testsDone/`

        const payload = {
          score: null,
          idTest: this.test.idTest,
        }

        await axios
          .post(APICreateDoneTestCall,
            payload,
            {
              withCredentials: true
            });
      } catch (error) {
        console.error("Erreur: ", error);
      }
    },
    async send() {
      await this.createTestDone()

      this.$router.push('/');
    }
  },
  async mounted() {
    await this.fetchAllAnswers();
  }
}
</script>
<template>
  <div id="questions">
    <div class="question" v-for="question in this.questions" :key="question.idQuestion" :class="question.type">
      <div class="question-header">
        <p class="question-title">{{ question.question }}</p>
        <span class="question-points">{{ question.point }}pts</span>
      </div>
      <ul class="question-checkbox" v-if="question.type == 'checkbox'">
        <li v-for="answer in answers[question.idQuestion]" :key="answer.idAnswer">
          <label>
            <input type="checkbox" :value="answer.idAnswer" v-model="selectedAnswers[question.idQuestion]" />
            {{ answer.answer }}
          </label>
        </li>
      </ul>
      <div class="question-open" v-else-if="question.type == 'open'">
        <input type="text" v-model="selectedAnswers[question.idQuestion]" placeholder="Votre réponse">
      </div>
      <ul v-else-if="question.type == 'radiobox'">
        <li>
          <label>
            <input type="radio" v-model="selectedAnswers[question.idQuestion]" :name="'question-' + question.idQuestion"
              value="true" />
            Vrai
          </label>
        </li>
        <li>
          <label>
            <input type="radio" v-model="selectedAnswers[question.idQuestion]" :name="'question-' + question.idQuestion"
              value="false" />
            Faux
          </label>
        </li>
      </ul>
    </div>
  </div>
  <button @click="send">Envoyer</button>
</template>
<style scoped>
#questions {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Carte question */
.question {
  background: #ffffff;
  padding: 20px 25px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-left: 6px solid #3498db;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.question:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Type spécifique */
.question.checkbox {
  border-left-color: #3498db;
}

.question.open {
  border-left-color: #9b59b6;
}

.question.radiobox {
  border-left-color: #e67e22;
}

/* Header question */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-title {
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

.question-points {
  font-size: 14px;
  color: #7f8c8d;
}

/* Liste réponses */
li {
  list-style: none;
  padding: 0;
  margin-bottom: 8px;
}

ul {
  padding: 12px 16px;
  margin: 6px 0;
  background: #f4f6f9;
  border-radius: 8px;
  transition: background 0.2s ease;
}

ul:hover {
  background: #e0e6ed;
}

/* Radio et checkbox */
input[type="radio"],
input[type="checkbox"] {
  margin-right: 10px;
  accent-color: #3498db;
  /* modern color for radio/checkbox */
  cursor: pointer;
}

/* Input text */
input[type="text"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

/* Bouton envoyer */
button {
  margin-top: 30px;
  padding: 14px 28px;
  background: #2ecc71;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #27ae60;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 600px) {
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  button {
    width: 100%;
  }
}
</style>