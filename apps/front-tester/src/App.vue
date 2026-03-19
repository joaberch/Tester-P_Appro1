<script>
import { RouterView } from 'vue-router';
import Header from './components/global/header.vue';

export default {
  components: {
    Header
  }
}
</script>

<template>
  <Header></Header>
  <RouterView />
</template>

<style scoped>

</style>
