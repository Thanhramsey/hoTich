<template>
  <v-app id="inspire">
    <v-app-bar app flat color="#ffffff" dark class="elevation-2 app-bar-2">
      <!-- Logo + Tên -->
      <v-toolbar-title class="d-flex align-center">
        <v-img
          src="./logo_vnpt.png"
          contain
          max-width="40"
          class="mr-3"
        ></v-img>
        <span class="text-h6 font-weight-bold vnpt-text"></span>
      </v-toolbar-title>

      <v-btn
        text
        class="text-capitalize font-weight-medium vnpt-text"
        :class="{ 'text-primary': $route.path === '/hotich' }"
        @click="$router.push('/hotich')"
        style="color: #0057a6; background-color: #ffffff !important"
      >
        Hộ Tịch
      </v-btn>

      <v-btn
        text
        class="text-capitalize font-weight-medium vnpt-text"
        :class="{ 'text-primary': $route.path === '/jira' }"
        @click="$router.push('/jira')"
        style="color: #0057a6; background-color: #ffffff !important"
      >
        Jira
      </v-btn>
      <v-btn
        text
        class="text-capitalize font-weight-medium vnpt-text"
        :class="{ 'text-primary': $route.path === '/his' }"
        @click="$router.push('/his')"
        style="color: #0057a6; background-color: #ffffff !important"
      >
        His
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <div v-if="$route.path === '/'">
          <HomeTabs />
        </div>
        <router-view v-else />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HomeTabs from "./components/hotich/HoTich.vue";

export default {
  components: {
    HomeTabs,
  },
};
</script>

<style scoped>
.v-app-bar {
  border-radius: 0 0 12px 12px;
  padding: 5px 20px;
}
.v-btn {
  margin-left: 10px;
}
.v-btn:hover {
  background-color: #ffffff;
}
.vnpt-text {
  color: #0057a6 !important;
}
.app-bar-2 {
  height: 70px !important;
}
</style>
