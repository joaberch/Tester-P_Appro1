<script>
import axios from "axios";

export default {
    props: {
        test: {
            type: Object,
            required: true,
        }
    },
    methods: {
      async save() {
        const APIUpdateTestCall = `http://localhost:3000/api/tests/${this.test.idTest}`;

        const payload = {
          name: this.test.name,
          description: this.test.description,
          duration: this.test.duration,
          isDeleted: this.test.isDeleted,
          isFormative: this.test.isFormative,
        }

        try {
          const updatedTest = await axios
            .put(APIUpdateTestCall, payload, {
              withCredentials: true
            }
          );

        } catch(error) {
          console.error("Erreur:", error)
        }
      }
    }
}
</script>
<template>
    <div id="test-info">
      <label>
        Titre du test :
        <input type="text" v-model="test.name" :placeholder="this.test.name" />
      </label>
      <label>
        Description :
        <textarea v-model="test.description" :placeholder="this.test.description"></textarea>
      </label>
      <label>
        Durée (en minutes) :
        <input type="text" v-model="test.duration" :placeholder="this.test.duration" />
      </label>
      <label class="in-line">
        Archivé :
        <input type="checkbox" :checked="this.test.isDeleted" v-model="test.isDeleted" />
      </label>
      <label class="in-line">
        Formatif :
        <input type="checkbox" :checked="this.test.isFormative" v-model="test.isFormative" />
      </label>
    </div>
    <button id="save-btn" @click="save()">Enregistrer</button>
</template>
<style scoped>
#save-btn {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#save-btn:hover {
  background-color: #40a9ff;
}
#test-info {
  margin-bottom: 2rem;
}

#test-info label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
}

#test-info input[type="text"],
#test-info textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  box-sizing: border-box;
}

#test-info textarea {
  min-height: 80px;
  resize: vertical;
}

.in-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.in-line input[type="checkbox"] {
  width: auto;
  margin: 0;
}
</style>