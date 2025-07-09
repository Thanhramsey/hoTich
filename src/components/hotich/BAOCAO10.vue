<template>
  <v-container>
    <v-row>
      <!-- Từ ngày -->
      <v-col cols="12" sm="6" md="4">
        <v-menu
          ref="fromMenu"
          v-model="fromMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Từ ngày"
              v-model="fromDate"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="fromDate"
            @input="fromMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <!-- Đến ngày -->
      <v-col cols="12" sm="6" md="4">
        <v-menu
          ref="toMenu"
          v-model="toMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Đến ngày"
              v-model="toDate"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="toDate"
            @input="toMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <!-- IGATE Token -->
      <v-col cols="12">
        <textarea
          class="textarea"
          v-model="igateToken"
          required
          placeholder="Dán IGATE Token vào đây"
          style="
            width: 100%;
            height: 100px;
            box-sizing: border-box;
            border: 1px solid #bbbbbb !important;
          "
        ></textarea>
      </v-col>

      <!-- Nút tải báo cáo -->
      <v-col cols="12">
        <v-btn color="primary" @click="exportDossier">Tải báo cáo</v-btn>
      </v-col>

      <!-- Bảng kết quả -->
      <v-col cols="12">
        <v-data-table
          :headers="tableHeaders"
          :items="tableItems"
          class="elevation-1"
          :items-per-page="50"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Kết quả báo cáo</v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr
              :style="
                item.stt === 'Tổng'
                  ? 'font-weight: bold; background: #f0f0f0'
                  : ''
              "
            >
              <td>{{ item.stt }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.tong }}</td>
              <td>{{ item.online }}</td>
              <td>{{ item.offline }}</td>
              <td>{{ item.resolved }}</td>
              <td>{{ item.unresolved }}</td>
              <td>{{ item.tonKy }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";
import dviJson2 from "./dviJson2.json";

export default {
  data() {
    return {
      igateToken: "",
      json2: dviJson2,
      fromDate: this.formatDate(new Date()),
      toDate: this.formatDate(new Date()),
      fromMenu: false,
      toMenu: false,

      tableHeaders: [
        { text: "STT", value: "stt", width: 50 },
        { text: "Địa phương", value: "name" },
        { text: "TỔNG HS", value: "tong" },
        { text: "NỘP TRỰC TUYẾN", value: "online" },
        { text: "NỘP TRỰC TIẾP", value: "offline" },
        { text: "Hoàn thành", value: "resolved" },
        { text: "Đang xử lý", value: "unresolved" },
        { text: "Tồn kỳ trước", value: "tonKy" },
      ],
      tableItems: [],
    };
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },

    async exportDossier() {
      const fromISO = `${this.fromDate}T00:00:00.000Z`;
      const toISO = `${this.toDate}T23:59:59.999Z`;
      const apiUrl = `https://apiigate.gialai.gov.vn/pa/dni-dossier-statistic/--01-2020-percentage?from-date=${fromISO}&to-date=${toISO}&type=&agency-id=60b87fb59adb921904a0213e`;

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });

        const data = response.data || [];
        const dataMap = {};
        for (const item of data) {
          if (item.agency?.code) {
            dataMap[item.agency.code] = item;
          }
        }

        const output = [];
        this.tableItems = [];
        let stt = 1;

        for (const dv of this.json2) {
          const code = dv["MA DON VI"];
          const name = dv["DON VI"];
          const item = dataMap[code];

          const tong = item?.procedureLevelUnknown || 0;
          const online = item?.receivedOnline || 0;
          const offline = item?.receivedDirect || 0;
          const resolved = item?.resolved || 0;
          const unresolved = item?.unresolved || 0;
          const tonKy = item?.receivedOld || 0;

          output.push([
            stt,
            name,
            tong,
            online,
            offline,
            resolved,
            unresolved,
            tonKy,
            name,
          ]);

          this.tableItems.push({
            stt: stt++,
            name,
            tong,
            online,
            offline,
            resolved,
            unresolved,
            tonKy,
          });
        }

        // 👉 Thêm hàng Tổng
        const totalRow = {
          stt: "Tổng",
          name: "",
          tong: 0,
          online: 0,
          offline: 0,
          resolved: 0,
          unresolved: 0,
          tonKy: 0,
        };

        for (const row of this.tableItems) {
          totalRow.tong += row.tong || 0;
          totalRow.online += row.online || 0;
          totalRow.offline += row.offline || 0;
          totalRow.resolved += row.resolved || 0;
          totalRow.unresolved += row.unresolved || 0;
          totalRow.tonKy += row.tonKy || 0;
        }

        this.tableItems.push(totalRow);

        // Excel export
        const header = [
          [
            "STT",
            "Địa phương",
            "TỔNG HS",
            "Trong đó",
            "",
            "Trong đó",
            "",
            "Tồn kỳ trước",
            "Ghi chú",
          ],
          [
            "",
            "",
            "",
            "NỘP\nTRỰC TUYẾN",
            "NỘP\nTRỰC TIẾP",
            "Hoàn thành",
            "Đang xử lý",
            "",
            "",
          ],
        ];

        const sheetData = [...header, ...output];
        sheetData.push([
          "Tổng",
          "",
          totalRow.tong,
          totalRow.online,
          totalRow.offline,
          totalRow.resolved,
          totalRow.unresolved,
          totalRow.tonKy,
          "",
        ]);

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        ws["!merges"] = [
          { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
          { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
          { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
          { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },
          { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } },
          { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Báo cáo");
        XLSX.writeFile(wb, "bao_cao_giailai.xlsx");
      } catch (err) {
        console.error("Lỗi khi tải hoặc xử lý dữ liệu:", err);
        alert("Không thể tạo báo cáo. Kiểm tra token hoặc kết nối.");
      }
    },
  },
};
</script>
