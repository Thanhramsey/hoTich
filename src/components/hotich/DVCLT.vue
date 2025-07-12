<template>
  <div>
    <v-text-field label="Mã Hồ sơ" v-model="code" outlined append-icon="mdi-close-circle"></v-text-field>
    <v-textarea class="textarea" type="text" id="igateToken" v-model="igateToken" placeholder="igateToken"
      required></v-textarea>
    <v-btn @click="runProcess" style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 10px;
                margin: 10px 10px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: #28a745 !important;
              ">Lấy kết quả</v-btn>
    <p v-if="log.length">
      <strong>Log:</strong>
    <ul>
      <li v-for="(item, index) in log" :key="index">{{ item }}</li>
    </ul>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      token: "Bearer", // ⚠️ Thay bằng token thực tế
      code: "",
      maxRetries: 5,
      log: [],
      igateToken: "",
    };
  },
  methods: {
    async getObject1() {
      const maHsoTrimmed = this.code.trim().replace(/\s+/g, "");
      const url = `https://apiigate.gialai.gov.vn/pa/api-integration/--data?code=${maHsoTrimmed}&fields=commonEForm%2CdetailEForm`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${this.igateToken}` },
      });
      return res.data;
    },

    async callDossierAPI(object1) {
      const url = `https://apiigate.gialai.gov.vn/ad/service/judicial-civil-status/--dossiers`;
      const body = {
        eformData: {
          noiDangKy: object1.detailEForm.data.noiDangKy,
        },
        maDinhDanhHoSo: [object1.code],
        module: object1.detailEForm.data.loaiHTTP,
        maTinh: "52",
      };

      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${this.igateToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },

    async getStatusLog(nationCode) {
      const url = `https://apiigate.gialai.gov.vn/ad/api/lienthongDVCLT/getLog?api=capNhatTrangThaiHoSoDVCLTHoTich&nationCode=${nationCode}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.igateToken}`,
        },
      });
      return res.data.content;
    },

    async updateStatusFromLog(logItem, trangThai, ghiChu) {
      const body = {
        ...logItem.requestBody,
        trangThai: trangThai,
        ghiChu: ghiChu,
      };

      const url = `https://apiigate.gialai.gov.vn/integration/api/lienthongDVCLT/capNhatTrangThaiHoSoDVCLTHoTich`;
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${this.igateToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },

    async ensureStatuses(object1) {
      const requiredStatuses = {
        1: "Tiếp nhận hồ sơ vào hệ thống",
        3: "Hồ sơ đủ điều kiện giải quyết",
        7: "Đã chuyển cán bộ tư pháp",
      };

      const logs = await this.getStatusLog(object1.nationCode);
      const existingStatuses = logs.map((log) => log.requestBody.trangThai);

      // 🔍 Nếu đã có trạng thái 5 thì bỏ qua luôn
      if (existingStatuses.includes(5)) {
        this.log.push(
          "✔️ Đã có trạng thái 5 → Bỏ qua cập nhật trạng thái 1,3,7."
        );
        return;
      }

      // ✅ Nếu chưa có 5, thì đảm bảo có đủ 1,3,7
      for (const [status, ghiChu] of Object.entries(requiredStatuses)) {
        if (!existingStatuses.includes(Number(status))) {
          this.log.push(
            `⚙️ Thiếu trạng thái ${status}, đang gọi API cập nhật...`
          );
          const sourceLog = logs[0]; // lấy log đầu tiên làm mẫu
          await this.updateStatusFromLog(sourceLog, Number(status), ghiChu);
          this.log.push(`✅ Đã cập nhật trạng thái ${status}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          this.log.push(`✔️ Đã có trạng thái ${status}`);
        }
      }
    },
    async ensureStatusesFromLogs(logs) {
      const requiredStatuses = {
        1: "Tiếp nhận hồ sơ vào hệ thống",
        3: "Hồ sơ đủ điều kiện giải quyết",
        7: "Đã chuyển cán bộ tư pháp",
      };

      const existingStatuses = logs.map((log) => log.requestBody.trangThai);

      for (const [status, ghiChu] of Object.entries(requiredStatuses)) {
        if (!existingStatuses.includes(Number(status))) {
          this.log.push(
            `⚙️ Thiếu trạng thái ${status}, đang gọi API cập nhật...`
          );
          const sourceLog = logs[0]; // dùng log đầu tiên làm mẫu
          await this.updateStatusFromLog(sourceLog, Number(status), ghiChu);
          this.log.push(`✅ Đã cập nhật trạng thái ${status}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          this.log.push(`✔️ Đã có trạng thái ${status}`);
        }
      }
    },

    async callSyncAPI(code) {
      const url = `https://apiigate.gialai.gov.vn/pa/judicial-civil-status/--sync-dossiers?new=true&code=${code}&showInputSend=keytest_8957`;
      const res = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${this.igateToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },

   async waitForTrangThai4(object1) {
  const maxRetries = this.maxRetries;

  for (let i = 0; i < maxRetries; i++) {
    this.log.push(`🔁 Đồng bộ lần ${i + 1}...`);

    const syncResult = await this.callSyncAPI(object1.code);

    const checkTrangThai4 = (list) => {
      return list?.some(item =>
        item?.result?.value?.some(val => val.trangThai === 4)
      );
    };

    const extractTrangThaiList = (list, label) => {
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        const values = item?.result?.value || [];
        values.forEach(val => {
          this.log.push(`📄 [${label}] mã hồ sơ: ${val.maHoSoMCDT || "?"} → trạng thái: ${val.trangThai}`);
        });
      });
    };

    // 🔍 In các trạng thái đang có ra log
    extractTrangThaiList(syncResult.List_Suss, "SUCCESS");
    extractTrangThaiList(syncResult.List_ERR, "ERROR");

    const foundInSuss = checkTrangThai4(syncResult.List_Suss || []);
    const foundInErr = checkTrangThai4(syncResult.List_ERR || []);

    if (foundInSuss || foundInErr) {
      this.log.push("✅ Đã nhận được trạng thái 4 trong đồng bộ.");
      return;
    }

    if (i === maxRetries - 1) {
      this.log.push("❌ Đã thử 5 lần nhưng không nhận được trạng thái 4. Hồ sơ có thể chưa ban hành bên hộ tịch hoặc cán bộ nhập tay.");
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
},



    async runProcess() {
      this.log = [];
      try {
        this.log.push("🔍 Đang lấy thông tin hồ sơ...");
        const object1 = await this.getObject1();

        // 🔍 Lấy danh sách trạng thái log
        const logs = await this.getStatusLog(object1.nationCode);
        const existingStatuses = logs.map((log) => log.requestBody.trangThai);

        // ✅ Nếu đã có trạng thái 5 thì kết thúc sớm
        if (existingStatuses.includes(5)) {
          this.log.push(
            "✔️ Hồ sơ đã có trạng thái 5 → Không cần thực hiện gì thêm."
          );
          return;
        }

        // ✅ Nếu chưa có trạng thái 5 → xử lý đảm bảo đủ 1, 3, 7
        await this.ensureStatusesFromLogs(logs);
// 🔁 Bắt đầu vòng lặp chờ trạng thái 4
        this.log.push("🔁 Bắt đầu gọi API đồng bộ để kiểm tra trạng thái 4...");
await this.waitForTrangThai4(object1);

        // 🔁 Bắt đầu vòng lặp chờ trạng thái 4
        // for (let i = 0; i < this.maxRetries; i++) {
        //   this.log.push(`🔁 Lần ${i + 1}: Gọi API lấy kết quả...`);
        //   const result = await this.callDossierAPI(object1);
        //   this.log.push("Mã hồ sơ liên thông:", object1.nationCode);

        //   const trangThai = result?.value?.[0]?.trangThai;
        //   this.log.push(`✅ Trạng thái trả về: ${trangThai}`);

        //   if (trangThai === 4) {
        //     this.log.push(
        //       "🎯 Đã nhận trạng thái 4! Gọi API đồng bộ một cửa..."
        //     );
        //     const syncResult = await this.callSyncAPI(object1.code);
        //     this.log.push("✅ API đồng bộ trả về thành công.");
        //     break;
        //   }

        //   if (i === this.maxRetries - 1) {
        //     this.log.push(
        //       "❌ Đã thử 5 lần nhưng không nhận được trạng thái 4. Có thể chưa ban hành bên hộ tịch hoặc thiếu trạng thái 1,3,7"
        //     );
        //   }

        //   await new Promise((resolve) => setTimeout(resolve, 3000));
        // }
      } catch (err) {
        this.log.push(`❌ Lỗi: ${err.response?.data?.message || err.message}`);
      }
    },
  },
};
</script>
<style scoped>
textarea {
  width: 100%;
  /* Chiều rộng 100% của phần tử chứa */
  height: 100px;
  /* Chiều cao cụ thể */
  box-sizing: border-box;
  /* Đảm bảo kích thước bao gồm padding và border */
  border: 1px solid #bbbbbb !important;
}
</style>