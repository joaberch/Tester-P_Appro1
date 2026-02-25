<script>
export default {
  name: "Element",
  props: {
    element: {
      type: Object,
      required: true
    },
    isTest: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    redirect() {
      if (this.isTest) { //test
        return { path: `/test/${this.element.idTest}` };
      } else { //module
        return { path: `/module/${this.element.idModule}` };
      }
    }
  }
}
</script>

<template>
  <RouterLink :to="redirect()" class="element-card">
    <div class="element-card-header">
      <strong>{{ element.name }}</strong>
      <div class="element-meta">
        <span v-if="element.isFormative" class="badge">Formatif</span>
        <span v-if="isTest">{{ element.duration }}m</span>
      </div>
    </div>

    <p class="element-description">
      {{ element.description }}
    </p>
  </RouterLink>
</template>

<style scoped>
.element-card {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-radius: 14px;
  --primary: #2563eb;
  --text-main: #111827;
  --text-muted: #6b7280;
  text-decoration: none;

  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: 16px 18px;
  margin: 12px 0;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.element-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  border-color: #d1d5db;
}

/* HEADER (nom + infos à droite) */
.element-card strong {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
}

.element-card>strong+p {
  margin-top: 4px;
}

/* Première ligne = alignement horizontal */
.element-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

/* Badge Formatif */
.badge {
  display: inline-block;
  background: #e0edff;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.element-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.element-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>