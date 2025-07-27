<template>
  <div class="VueXlsx">
    <v-card height="100%" class="big-card">
      <v-tabs
        v-model="tab"
        background-color="primary"
        dark
        direction="vertical"
      >
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card height="100%" class="big-card">
            <v-card-text>
              <component v-bind:is="item.content"></component>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import BAOCAO1 from "./BAOCAO1";
import BAOCAO2 from "./BAOCAO2";
import BAOCAO3 from "./BAOCAO3";
import BAOCAO4 from "./BAOCAO4";
import BAOCAO5 from "./BAOCAO5";
import BAOCAO6 from "./BAOCAO6";
import BAOCAO8 from "./BAOCAO8";
import BAOCAO9 from "./BAOCAO9";
import BAOCAO10 from "./BAOCAO10";
import BAOCAO11 from "./BAOCAO11";
import BAOCAO12 from "./BAOCAO12";
import DVCLT from "./DVCLT";
// import BAOCAO7 from "./BAOCAO7";
export default {
  components: {
    BAOCAO1,
    BAOCAO6,
    BAOCAO2,
    BAOCAO3,
    BAOCAO4,
    BAOCAO5,
    BAOCAO8,
    BAOCAO9,
    BAOCAO10,
    BAOCAO11,
    BAOCAO12,
    DVCLT,
    // BAOCAO7,
  },
  data() {
    return {
      tableTitle: "MTP",
      tab: 0,
      items: [
        { tab: "Gửi hồ sơ", content: "BAOCAO1" },
        { tab: "DVCLT", content: "BAOCAO6" },
        // { tab: "Đồng bộ KQ Hộ tịch", content: "DVCLT" },
        { tab: "Kết thúc hàng loạt", content: "BAOCAO2" },
        { tab: "Tạo object", content: "BAOCAO3" },
        { tab: "Clone quy trình DD", content: "BAOCAO4" },
        { tab: "Clone xã", content: "BAOCAO5" },
        { tab: "Clone ", content: "BAOCAO8" },
        // { tab: "Ex ", content: "BAOCAO9" },
        // { tab: "Exa ", content: "BAOCAO10" },
        // { tab: "Exa2 ", content: "BAOCAO11" },
        // { tab: "Exa222 ", content: "BAOCAO12" },
        // { tab: "DTI", content: "BAOCAO7" },
      ],
    };
  },
  methods: {},
};
</script>

<style></style>
