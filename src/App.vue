<script>

import { computed } from 'vue';
import NavSideBar from './components/NavSideBar.vue'
import { RouterView } from 'vue-router';

export default {
  components: {
    NavSideBar,
    RouterView
  },

  computed: {
    NotFound() {
      return this.$route.name === 'notfound'
    }
  }
}

</script>

<template>
  <div class="app" v-if="!NotFound">
    <div class="nav-sidebar">
      <nav-side-bar></nav-side-bar>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
  <router-view v-if="NotFound"></router-view>
</template>

<style scoped>
  .app {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
  }

  .nav-sidebar {
    width: 18%;
  }

  .main-content {
    width: 82%;
    background-color: lightgray;
  }

</style>
