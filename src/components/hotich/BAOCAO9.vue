<template>
  <v-container>
    <v-file-input
      label="Tải lên file Excel"
      @change="handleFileUpload"
      accept=".xlsx, .xls"
      outlined
    ></v-file-input>

    <v-btn @click="generateAndExport" :disabled="!fileReady">
      Tải file kết quả
    </v-btn>
  </v-container>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      templateSheet: [],
      danhsachSheet: [],
      fileReady: false,
    };
  },
  methods: {
    handleFileUpload(fileList) {
      const file = fileList instanceof FileList ? fileList[0] : fileList;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Đọc sheet Template
        const templateSheet = XLSX.utils.sheet_to_json(
          workbook.Sheets["Template"],
          { defval: "" }
        );

        this.templateSheet = templateSheet.map((row) => ({
          maTTHC: row["Mã TTHC"],
          tenTTHC: row["Tên TTHC"],
          cap: row["CAP"],
          donvi: row["DONVI"],
        }));
        console.log("templateSheet", this.templateSheet);

        // Đọc sheet danhsach

        const danhsach = XLSX.utils.sheet_to_json(workbook.Sheets["danhsach"], {
          defval: "",
        });
        this.danhsachSheet = danhsach.map((row) => ({
          ma: row["Mã đơn vị/phòng, ban"],
          cap: row["Cấp đơn vị/phòng, ban"],
        }));
        console.log("danhsachSheet", this.danhsachSheet);
        // Cho phép bấm nút
        this.fileReady = true;
      };

      reader.readAsArrayBuffer(file);
    },

    generateAndExport() {
      const output = [];

      this.templateSheet.forEach((row) => {
        const caps = (row.cap || "").split(";").map((c) => c.trim());

        let isFirst = true;

        // Nếu có Cấp Tỉnh

        // Với Cấp Huyện & Xã
        ["Cấp Huyện", "Cấp Xã"].forEach((capTarget) => {
          if (caps.includes(capTarget)) {
            this.danhsachSheet
              .filter((d) => d.cap === capTarget)
              .forEach((d) => {
                output.push({
                  "Mã TTHC": isFirst ? row.maTTHC : "",
                  "Tên TTHC": isFirst ? row.tenTTHC : "",
                  "Đơn vị": d.ma,
                  Cấp: capTarget,
                });
                isFirst = false;
              });
          }
        });
      });

      // Xuất file Excel
      const ws = XLSX.utils.json_to_sheet(output);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "KetQua");
      XLSX.writeFile(wb, "ket_qua_tthc.xlsx");
    },

    // generateAndExport() {
    //   const output = [];

    //   this.templateSheet.forEach((row) => {
    //     const caps = (row.cap || "").split(";").map((c) => c.trim());

    //     if (caps.includes("Cấp Tỉnh")) {
    //       output.push({
    //         "Mã TTHC": row.maTTHC,
    //         "Tên TTHC": row.tenTTHC,
    //         "Đơn vị": row.donvi,
    //         Cấp: row.cap,
    //       });
    //     }

    //     ["Cấp Huyện", "Cấp Xã"].forEach((capTarget) => {
    //       if (caps.includes(capTarget)) {
    //         this.danhsachSheet
    //           .filter((d) => d.cap === capTarget)
    //           .forEach((d) => {
    //             output.push({
    //               "Mã TTHC": row.maTTHC,
    //               "Tên TTHC": row.tenTTHC,
    //               "Đơn vị": d.ma,
    //               Cấp: row.cap,
    //             });
    //           });
    //       }
    //     });
    //   });

    //   // Xuất file Excel
    //   const ws = XLSX.utils.json_to_sheet(output);
    //   const wb = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, "KetQua");
    //   XLSX.writeFile(wb, "ket_qua_tthc.xlsx");
    // },
  },
};
</script>
