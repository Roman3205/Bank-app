<script>

import NavSideBar from './components/NavSideBar.vue'
import InfoBlock from './components/InfoBlock.vue'
import { RouterView } from 'vue-router';

export default {
  components: {
    NavSideBar,
    RouterView,
    InfoBlock
  },

  computed: {
    NotFound() {
      return this.$route.name === 'notfound'
    },

    Auth() {
      return this.$route.name === 'login' || this.$route.name === 'register'
    }
  }
}

</script>

<template>
  <div class="app" v-if="!NotFound && !Auth">
    <div class="nav-sidebar">
      <nav-side-bar></nav-side-bar>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
  <router-view v-if="NotFound"></router-view>
  <div class="auth-menu" v-if="Auth">
    <div class="router col-lg-6">
      <router-view></router-view>
    </div>
    <div class="content-block col-lg-6">
      <info-block></info-block>
    </div>
  </div>
</template>

<style scoped lang="scss">
  * {
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .app, .auth-menu {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
    font-family: monospace, 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }

  .nav-sidebar {
    width: 18%;
    overflow: hidden;
  }

  .main-content {
    width: 82%;
    background-color: lightgray;
  }

  .auth-menu {
    background-color: rgb(64, 138, 249);
    color: #e9e9e9;
  }

  .content-block, .router {
    align-self: flex-start;
    margin-top: 30px;
  }

  @media screen and (max-width: 1400px) {
    .auth-menu {
      flex-direction: column;
      gap: 80px;
      height: 100%;
      padding: 60px 0px;
    }

    .router, .content-block {
      align-self: center;
    }
  }

</style>
