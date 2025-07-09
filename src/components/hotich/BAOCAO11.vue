<template>
  <v-container>
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
    <v-row dense>
      <!-- Từ ngày -->
      <v-col cols="12" sm="6" md="3">
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
      <v-col cols="12" sm="6" md="3">
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

      <!-- Đơn vị -->
      <v-col cols="12" sm="6" md="3">
        <v-checkbox
          v-model="selectAllDonVi"
          label="Chọn tất cả đơn vị"
          @change="toggleAllDonVi"
          class="mb-1"
        ></v-checkbox>

        <v-autocomplete
          :items="donVis"
          item-text="DON VI"
          item-value="id"
          label="Đơn vị"
          v-model="selectedDonVis"
          multiple
          chips
        ></v-autocomplete>
      </v-col>

      <!-- Thủ tục -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          :items="thuTucs"
          item-text="tenTT"
          item-value="maTT"
          label="Thủ tục"
          v-model="selectedThuTuc"
        ></v-select>
      </v-col>

      <!-- Nút lọc -->
      <v-col cols="12">
        <v-btn color="primary" @click="fetchData">Lọc kết quả</v-btn>
      </v-col>

      <!-- Bảng kết quả -->
      <v-col cols="12">
        <v-data-table
          :headers="tableHeaders"
          :items="resultItemsWithTotal"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import dviJson2 from "./dviJson4.json";

export default {
  data() {
    return {
      fromDate: this.formatDate(new Date()),
      toDate: this.formatDate(new Date()),
      fromMenu: false,
      toMenu: false,
      igateToken: "",

      donVis: dviJson2,
      thuTucs: [
        {
          maTT: "1.012784.H21",
          tenTT: "Tách thửa hoặc hợp thửa đất.",
        },
        {
          maTT: "2.000635.000.00.00.H21",
          tenTT: "Cấp bản sao trích lục hộ tịch",
        },
        {
          maTT: "1.012765.H21",
          tenTT:
            "Đăng ký biến động quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất...",
        },
      ],
      selectedDonVis: [],
      selectedThuTuc: null,
      resultItems: [],
      selectAllDonVi: false,
      tableHeaders: [
        { text: "Đơn vị", value: "donVi" },
        { text: "Thủ tục", value: "tenTT" },
        { text: "Tổng hồ sơ", value: "total_receiver" },
        { text: "Đang giải quyết", value: "total" },
        { text: "Hoàn thành", value: "total_complete" },
        { text: "Tổng cộng", value: "tongCong" },
      ],
    };
  },
  watch: {
    selectedDonVis(val) {
      this.selectAllDonVi = val.length === this.donVis.length;
    },
  },
  computed: {
    resultItemsWithTotal() {
      const total = {
        donVi: "Tổng cộng",
        tenTT: "",
        total_receiver: 0,
        total: 0,
        total_complete: 0,
        tongCong: 0,
      };

      for (const item of this.resultItems) {
        total.total_receiver += item.total_receiver || 0;
        total.total += item.total || 0;
        total.total_complete += item.total_complete || 0;
        total.tongCong += item.tongCong || 0;
      }

      return [...this.resultItems, total];
    },
  },

  methods: {
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },

    toggleAllDonVi() {
      if (this.selectAllDonVi) {
        this.selectedDonVis = this.donVis.map((dv) => dv.id);
      } else {
        this.selectedDonVis = [];
      }
    },

    getTenTT(maTT) {
      const found = this.thuTucs.find((tt) => tt.maTT === maTT);
      return found ? found.tenTT : maTT;
    },

    async fetchData() {
      if (this.selectedDonVis.length === 0 || !this.selectedThuTuc) {
        alert("Vui lòng chọn đầy đủ thông tin!");
        return;
      }

      const formatAcceptedDate = (dateStr, offsetDay = 0) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + offsetDay);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}-${month}-${day}T23:59:59.165Z`;
      };

      const acceptedFrom = formatAcceptedDate(this.fromDate, -1);
      const acceptedTo = formatAcceptedDate(this.toDate, 0);
      this.resultItems = [];

      for (const donViId of this.selectedDonVis) {
        const donViObj = this.donVis.find((d) => d.id === donViId);
        const donViName = donViObj ? donViObj["DON VI"] : donViId;

        const url = `https://apiigate.gialai.gov.vn/pa/dbn-report/statistic/--by-procedure?agency-type=0&root-agency-id=60b87fb59adb921904a0213e&agency-id=${donViId}&procedure-level=0&agency-level=&accepted-from=${acceptedFrom}&accepted-to=${acceptedTo}`;

        try {
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${this.igateToken}`,
            },
          });
          const data = res.data || [];

          const matched = data.find(
            (item) => item.code === this.selectedThuTuc
          );

          this.resultItems.push({
            donVi: donViName,
            tenTT:
              matched?.translate?.[0]?.name ||
              this.getTenTT(this.selectedThuTuc),
            total_receiver: matched?.total_receiver || 0,
            total: matched?.total || 0,
            total_complete: matched?.total_complete || 0,
            tongCong:
              (matched?.total_receiver || 0) +
              (matched?.total || 0) +
              (matched?.total_complete || 0),
          });
        } catch (err) {
          console.error(`Lỗi với đơn vị ${donViName}:`, err);
          this.resultItems.push({
            donVi: donViName,
            tenTT: this.getTenTT(this.selectedThuTuc),
            total_receiver: 0,
            total: 0,
            total_complete: 0,
            tongCong: 0,
          });
        }
      }
    },
  },
};
</script>
