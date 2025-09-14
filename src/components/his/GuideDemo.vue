<template>
  <div class="VueXlsx">
    <v-card height="100%" class="big-card">
      <!-- Tabs list -->
      <v-tabs
        v-model="tab"
        background-color="primary"
        dark
        direction="vertical"
      >
        <v-tab v-for="(item, idx) in items" :key="idx">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <!-- Nội dung của từng tab -->
      <v-card height="100%" class="big-card pa-4">
        <v-card-text>
          <BACSI v-if="tab === 0" />
          <DIEUDUONG v-if="tab === 1" ref="dieuduong" />
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import BACSI from "./BACSI";
import DIEUDUONG from "./DIEUDUONG";

export default {
  components: { BACSI, DIEUDUONG },
  data() {
    return {
      tab: 0,
      items: [{ tab: "Bác Sĩ" }, { tab: "Điều dưỡng" }],
    };
  },
  watch: {
    // // Khi chuyển sang tab Điều dưỡng
    // tab(val) {
    //   if (val === 1) {
    //     this.$nextTick(() => {
    //       setTimeout(() => {
    //         if (this.$refs.dieuduong && this.$refs.dieuduong.tour) {
    //           this.$refs.dieuduong.tour.show("step1");
    //         }
    //       }, 120); // delay nhỏ để DOM render xong
    //     });
    //   }
    // },
  },
};
</script>

<style scoped>
.big-card {
  overflow: auto;
}
</style>
