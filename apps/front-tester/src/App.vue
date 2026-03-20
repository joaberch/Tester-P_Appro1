<script>
import { RouterView } from 'vue-router';
import Header from './components/global/header.vue';
import Footer from './components/global/footer.vue';

export default {
  components: {
    Header,
    Footer
  }
}
</script>
<template>
  <Header></Header>
  <RouterView />
  <Footer></Footer>
</template>
