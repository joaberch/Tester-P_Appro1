<script>
import axios from "axios";
import { RouterLink } from "vue-router";
import TestDescription from "../components/test/testDescription.vue";
import Question from "../components/test/question.vue";
import { jsPDF } from "jspdf";
import Student from "../components/test/student.vue";

export default {
  components: {
    TestDescription,
    Question,
    Student
  },
  data() {
    return {
      test: [],
      questions: [],
      students: [],
      assignedStudents: [],
      fetchedStudents: [],
      fetchedAssignedStudents: [],
      loaded: false,
      isStarted: false,
      role: '',
      isAssigned: false,
      selectedStudents: null,
      filter: '',
    }
  },
  async mounted() {
    this.fetchTest();
    this.fetchQuestions();
    this.getMe()
    this.loaded = true;
  },
  methods: {
    async startTest() {
      await this.fetchQuestions()
      this.isStarted = true;
    },
    async fetchQuestions() {
      let APIGetQuestionsCall = `${import.meta.env.VITE_API_URL}/tests/${this.$route.params.id}/questions`;

      const fetchedQuestions = await axios.get(APIGetQuestionsCall, {
        withCredentials: true
      });
      this.questions = fetchedQuestions.data.data;
    },
    async fetchTest() {
      let APIGetTestCall = `${import.meta.env.VITE_API_URL}/tests/${this.$route.params.id}`;

      const fetchedTest = await axios.get(APIGetTestCall, {
        withCredentials: true
      });
      this.test = fetchedTest.data.data;
    },
    async getQuestionAnswer(id) {
      const APIGetQuestionAnswers = `${import.meta.env.VITE_API_URL}/questions/${id}/answers`;

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
    async getMe() {
      const APIGetMeCall = `${import.meta.env.VITE_API_URL}/me`;

      try {
        const res = await axios
          .get(APIGetMeCall, {
            withCredentials: true
          }
          );
        this.role = res.data.role
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
    },
    async fetchStudents() {
      const APIGetStudentsCall = `${import.meta.env.VITE_API_URL}/users/students`;

      try {
        const fetchedStudents = await axios.get(APIGetStudentsCall, {
          withCredentials: true
        });

        let allStudents = fetchedStudents.data.data;
        this.fetchedStudents = allStudents.filter(student => !this.assignedStudents.some(assigned => assigned.idUser == student.idUser));
        this.students = this.fetchedStudents;
      } catch (error) {
        console.error("Erreur:", error)
      }
    },
    async openAssign() {
      if (this.fetchedAssignedStudents.length == 0 && this.fetchedStudents.length == 0) {
        await this.fetchAssignedStudents(); //order is important to filter unassigned students
        await this.fetchStudents();
      }
      this.isAssigned = true;
    },
    async fetchAssignedStudents() {
      const APIFetchAssignedStudentsCall = `http://localhost:3000/api/users/assignedTo/${this.test.idTest}`;

      try {
        const res = await axios.get(APIFetchAssignedStudentsCall, {
          withCredentials: true
        });

        this.fetchedAssignedStudents = res.data.data.assignedUser;
        this.assignedStudents = this.fetchedAssignedStudents
      } catch (error) {
        console.error("Erreur:", error)
      }
    },
    async assign() {
      const APIAssignStudentsCall = `http://localhost:3000/api/tests/${this.test.idTest}/user/${this.selectedStudents}`;

      const payload = {}

      try {
        await axios.post(APIAssignStudentsCall, payload, {
          withCredentials: true
        })
      } catch (error) {
        console.error("Erreur:", error)
      }
    },
    changeAssignment({ student, isAssigned}) {
      if (isAssigned) {
        this.students.push(student);
        this.assignedStudents = this.assignedStudents.filter(s => s.idUser != student.idUser);
      } else {
        this.assignedStudents.push(student);
        this.students = this.students.filter(s => s.idUser != student.idUser);
      }
    },
    updateFilter() {
      const filter = this.filter.toLowerCase();

      if (filter == '') {
        this.students = this.fetchedStudents;
        this.assignedStudents = this.fetchedAssignedStudents;
      } else {
        this.students = this.fetchedStudents.filter(s => s.firstname.toLowerCase().includes(filter) || s.name.toLowerCase().includes(filter));
  
        this.assignedStudents = this.fetchedAssignedStudents.filter(s => s.firstname.toLowerCase().includes(filter) || s.name.toLowerCase().includes(filter));
      }

    }
  }
}
</script>
<template>
  <div v-if="isAssigned" class="assign-page" @click.self="isAssigned = false">
    <div class="form">
      <input type="text" placeholder="Recherche" v-model="filter" @input="updateFilter()"/>
      <div class="students-container">
        <div class="unassigned">
          <h2>Non assigné</h2>
          <div class="students">
            <div class="student" v-for="student in students">
              <Student :student="student" :isAssigned="false" :idTest="test.idTest" @change-assignment="changeAssignment" />
            </div>
          </div>
        </div>
        <div class="assigned">
          <h2>Assigné</h2>
          <div class="students">
            <div class="student" v-for="student in assignedStudents">
              <Student :student="student" :isAssigned="true" :idTest="test.idTest" @change-assignment="changeAssignment" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="test-page">
    <div v-if="!this.loaded">Chargement du test...</div>
    <div v-else>
      <div id="header">
        <RouterLink class="back-btn" :to="{ name: 'home' }">Accueil</RouterLink>
        <div class="right-part" v-if="this.role == 'teacher' || this.role == 'admin'">
          <button @click="openAssign()">Assigner le test</button>
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
      <button @click="exportToPDF()" v-if="this.role == 'teacher' || this.role == 'admin'">Exporter en PDF</button>
    </div>
  </div>
</template>
<style scoped>
.students-container {
  display: flex;
  flex-direction: row;
}

.students {
  width: 280px;
  max-height: 420px;
  overflow-y: auto;
  padding: 12px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: inset 0 0 0 1px #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* columns */
.unassigned,
.assigned {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.unassigned h2,
.assigned h2 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

/* modal layout */
.assign-page {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  backdrop-filter: blur(3px);
  z-index: 1000;
}

.assign-page .form {
  background: white;
  padding: 30px 35px;
  border-radius: 14px;

  display: flex;
  flex-direction: column;
  gap: 40px;

  box-shadow: 0 20px 50px rgba(0,0,0,0.25);

  animation: popup 0.25s ease;
}

/* popup animation */
@keyframes popup {
  from {
    transform: scale(.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* scrollbars */
.students::-webkit-scrollbar {
  width: 6px;
}

.students::-webkit-scrollbar-thumb {
  background: #cbd5f5;
  border-radius: 4px;
}

/* main page */
.test-page {
  min-height: 100vh;
  background: #f4f6fb;
  padding: 40px 24px;
  font-family: "Inter", Arial, sans-serif;
}

/* header */
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.right-part {
  display: flex;
  gap: 10px;
}

/* buttons */
button {
  padding: 10px 18px;
  background: linear-gradient(135deg,#6366f1,#4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all .25s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99,102,241,0.35);
}

button:active {
  transform: translateY(0);
  box-shadow: none;
}

/* edit button */
#header .button {
  padding: 10px 16px;
  border-radius: 8px;
  background: #f59e0b;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
}

#header .button:hover {
  background: #ea580c;
}

/* description card */
#description {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

/* back button */
.back-btn {
  padding: 8px 14px;
  border-radius: 8px;
  background: #e5e7eb;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
}

.back-btn:hover {
  background: #d1d5db;
}
</style>