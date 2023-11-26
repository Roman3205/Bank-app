<script>

import NavSideBar from '@/components/NavSideBar.vue'
import InfoBlock from '@/components/InfoBlock.vue'
import { RouterView } from 'vue-router'
import CookieInfo from '@/components/CookieInfo.vue'
import { mapActions, mapState } from 'vuex'
import OplataPage from '@/views/OplataPage.vue'
import NotFound from '@/views/NotFoundPage.vue'
import OplataFillPage from '@/views/OplataFillPage.vue'

export default {
  components: {
    NavSideBar,
    RouterView,
    InfoBlock,
    CookieInfo,
    OplataPage,
    NotFound,
    OplataFillPage
},

  created() {
    if (!localStorage.getItem('cookieAlert')) {
      localStorage.setItem('cookieAlert', true)
    } else if (localStorage.getItem('cookieAlert')) {
      this.cookieAlert = true ? localStorage['cookieAlert'] === 'true' : false
    } else {
      return
    }
  },

  computed: {
    ...mapState({
      color: state => state.color,
      backgroundBlock: state => state.backgroundBlock,
      background: state => state.background
    }),

    NotFound() {
      return this.$route.name === 'notfound'
    },

    Auth() {
      return this.$route.name === 'login' || this.$route.name === 'register' || this.$route.name === 'restore'
    },

    Oplata() {
      return this.$route.name === 'oplata'
    },

    OplataFill() {
      return this.$route.name === 'oplataFill'
    }
  },
  
  methods: {
    cookieAction(val) {
      localStorage['cookieAlert'] = val
      this.cookieAlert = val
    },

    ...mapActions({
      setColorTheme: 'setColorTheme',
      loadUser: 'mainModule/loadUser'
    }),
  },

  data() {
    return {
      cookieAlert: true
    }
  },

  mounted() {
    this.loadUser()
    this.setColorTheme()
  }
}

</script>

<template>
  <div class="app" v-if="!NotFound && !Auth && !Oplata && !OplataFill">
    <div class="nav-sidebar">
      <nav-side-bar></nav-side-bar>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <!-- <teleport to="body"> -->
      <cookie-info v-model:cookieAlert="this.cookieAlert" @accept="cookieAction"></cookie-info>
    <!-- </teleport> -->
  </div>
  <not-found v-else-if="NotFound"></not-found>
  <oplata-page v-else-if="Oplata"></oplata-page>
  <oplata-fill-page v-else-if="OplataFill"></oplata-fill-page>
  <div class="auth-menu" v-else-if="Auth">
      <router-view></router-view>
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
    height: 100vh!important;
    font-family: monospace, 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }

  .nav-sidebar {
    width: 18%;
    overflow: hidden;
  }

  .main-content {
    width: 82%;
  }

  .nav-sidebar, .main-content {
    color: v-bind(color);
    background-color: v-bind(background);
  }

  .nav-sidebar {
    background-color: v-bind(backgroundBlock);
  }

  :global(.container) {
    min-width: 100%!important;
  }

  :global(.container::-webkit-scrollbar-thumb) {
      width: 12px;
      border-radius: 20px;
      background: rgb(13,110,253);
  }

  :global(.container::-webkit-scrollbar) {
      background: rgb(177, 208, 255);
      border-radius: 20px;
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
    }

    .content-block {
      align-self: center;
    }
  }

</style>
