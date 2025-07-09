<template>
  <v-container>
    <v-card>
      <v-card-title>Lọc đơn vị từ JSON</v-card-title>
      <v-card-text>
        <v-list two-line>
          <v-list-item v-for="(item, index) in json2Filtered" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ item["DON VI"] }}</v-list-item-title>
              <v-list-item-subtitle
                >Mã: {{ item["MA DON VI"] }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import dviJson4 from "./dviJson3.json";
import dviJson2 from "./dviJsonIgate.json";
export default {
  name: "FilterDonVi",

  data() {
    return {
      json1: dviJson2,
      json2: dviJson4,
      json2Filtered: [],
    };
  },
  mounted() {
    this.filterJson2();
  },
  methods: {
    filterJson2() {
      const merged = this.json2.map((item) => {
        const found = this.json1.find((obj) => obj.code === item["MA DON VI"]);
        return {
          ...item,
          id: found ? found.id : null,
        };
      });

      console.log(merged);
    },
  },
};
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid #eee;
}
</style>
