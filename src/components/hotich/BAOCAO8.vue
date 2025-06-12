<template>
  <div class="excel-generator">
    <h2>📄 Tạo file KPI từ Template</h2>
    <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
    <button @click="generateExcel" :disabled="!workbook">Tạo file mới</button>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default {
  name: "ExcelGenerator",
  data() {
    return {
      workbook: null,
      templateData: [],
      danhsach: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        this.workbook = XLSX.read(data, { type: "array" });

        // Đọc sheet 'template'
        const templateSheet = this.workbook.Sheets["Template"];
        this.templateData = XLSX.utils.sheet_to_json(templateSheet, {
          defval: "",
        });

        // Đọc sheet 'danhsach'
        const danhsachSheet = this.workbook.Sheets["danhsach"];
        const rawDanhsach = XLSX.utils.sheet_to_json(danhsachSheet, {
          header: 1,
        });
        this.danhsach = rawDanhsach.flat().filter((v) => !!v); // loại bỏ null/empty
      };
      reader.readAsArrayBuffer(file);
    },

    generateExcel() {
      if (!this.templateData.length || !this.danhsach.length) {
        alert("Thiếu dữ liệu template hoặc danh sách!");
        return;
      }

      let finalData = [];

      this.danhsach.forEach((maNV) => {
        this.templateData.forEach((row) => {
          const newRow = { ...row, "Mã NV": maNV };
          finalData.push(newRow);
        });
      });

      const newSheet = XLSX.utils.json_to_sheet(finalData, {
        header: Object.keys(this.templateData[0]),
      });

      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, "generated");

      const wbout = XLSX.write(newWorkbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "output.xlsx"
      );
    },
  },
};
</script>

<style scoped>
.excel-generator {
  padding: 20px;
  border: 1px solid #ccc;
  max-width: 400px;
}
button {
  margin-top: 10px;
}
</style>
