<template>
  <v-container>
    <v-textarea
      label="Nhập chuỗi"
      v-model="inputString"
      rows="5"
      outlined
    ></v-textarea>

    <v-row style="margin: 10px">
      <v-btn
        @click="generateJavaCode"
        color="primary"
        style="
          color: white;
          font-weight: bold;
          width: 150px;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #bbbbbb !important;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 16px;
          background-color: rgb(38, 113, 184) !important;
        "
        >Java Code</v-btn
      >
      <v-btn
        @click="generateJson"
        color="secondary"
        style="
          color: white;
          font-weight: bold;
          width: 150px;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #bbbbbb !important;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 16px;
          background-color: rgb(38, 113, 184) !important;
        "
        >JSON</v-btn
      >
    </v-row>

    <v-textarea
      label="Kết quả"
      v-model="output"
      rows="10"
      outlined
      readonly
    ></v-textarea>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      inputString: "", // Lưu trữ chuỗi nhập vào
      output: "", // Kết quả đầu ra
    };
  },
  methods: {
    // Hàm xử lý cho nút 1: Tạo Java code
    generateJavaCode() {
      const lines = this.inputString.trim().split(/\s+/); // Tách các chuỗi nhập vào theo dòng
      let result = lines
        .map((line) => `@JsonProperty("${line}")\n    private String ${line};`)
        .join("\n\n"); // Tạo format Java
      this.output = result;
    },

    // Hàm xử lý cho nút 2: Tạo JSON
    generateJson() {
      const lines = this.inputString.trim().split(/\s+/); // Tách các chuỗi nhập vào theo dòng
      let result =
        "{\n" + lines.map((line) => `  "${line}": ""`).join(",\n") + "\n}"; // Tạo format JSON
      this.output = result;
    },
  },
};
</script>
