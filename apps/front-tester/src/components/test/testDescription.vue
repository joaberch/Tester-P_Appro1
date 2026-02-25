<script>
export default {
    props: {
        test: {
            type: Object,
            required: true
        },
    },
    emits: ['start-test'],
    methods: {
        startTest() {
            this.$emit('start-test');
        }
    }
}
</script>
<template>
    <strong v-if="test.isDeleted">Attention, ce test a été archivé!</strong>
    <div class="title">
        <h2>{{ test.name }}</h2>
        <p class="badge" v-if="test.isFormative">Formatif</p>
    </div>
    <p><strong>Description: </strong>{{ test.description }}</p>
    <p><strong>Durée: </strong>{{ test.duration }} minutes</p>
    <button @click="startTest()">Commencer le test</button>
</template>
<style scoped>
.title {
  display: flex;
  align-items: center; /* centre verticalement */
  gap: 12px; /* espace entre titre et badge */
  margin-bottom: 15px; /* remplace le margin-bottom du h2 */
}

h2 {
  margin: 0; /* important en flex */
  font-size: 26px;
  color: #2c3e50;
}

/* Badge Formatif */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e0edff;
  color: var(--primary, #3498db); /* fallback si var non définie */
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: fit-content; /* évite qu'il prenne toute la hauteur */
}

strong {
  color: #e74c3c;
}

p {
  margin: 8px 0;
  color: #555;
  line-height: 1.5;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background-color: #2ecc71;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background-color: #27ae60;
}
</style>