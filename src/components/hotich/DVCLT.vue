<template>
  <div>
    <v-text-field
                  label="Mã Hồ sơ"
                  v-model="code"
                  outlined
                  append-icon="mdi-close-circle"
                ></v-text-field>
      <v-textarea
                    class="textarea"
                    type="text"
                    id="igateToken"
                    v-model="igateToken"
                    placeholder="igateToken"
                    required
                  ></v-textarea>
    <v-btn
              @click="runProcess"
              style="
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
              "
              >Lấy kết quả</v-btn
            >
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
      const url = `https://apiigate.gialai.gov.vn/pa/api-integration/--data?code=${this.code}&fields=commonEForm%2CdetailEForm`;
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

    async runProcess() {
      this.log = [];
      try {
        this.log.push("🔍 Đang lấy thông tin hồ sơ...");

        const object1 = await this.getObject1();

        for (let i = 0; i < this.maxRetries; i++) {
          this.log.push(`🔁 Lần ${i + 1}: Gọi API lấy kết quả...`);

          const result = await this.callDossierAPI(object1);
          this.log.push("Mã hồ sơ liên thông:", object1.nationCode);
          const trangThai = result?.value?.[0]?.trangThai;

          this.log.push(`✅ Trạng thái trả về: ${trangThai}`);

          if (trangThai === 4) {
            this.log.push(
              "🎯 Đã nhận trạng thái 4! Gọi API đồng bộ một cửa..."
            );
            const syncResult = await this.callSyncAPI(object1.code);
            this.log.push("✅ API số đồng bộ trả về thành công.");
            break;
          }

          if (i === this.maxRetries - 1) {
            this.log.push(
              "❌ Đã thử 5 lần nhưng không nhận được trạng thái 4.Có thể chưa ban hành bên hộ tịch hoặc thiếu trạng thái 1,3,7"
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 3000)); // đợi 1 giây
        }
      } catch (err) {
        this.log.push(`❌ Lỗi: ${err.response?.data?.message || err.message}`);
      }
    },
  },
};
</script>
<style scoped>
textarea {
  width: 100%; /* Chiều rộng 100% của phần tử chứa */
  height: 100px; /* Chiều cao cụ thể */
  box-sizing: border-box; /* Đảm bảo kích thước bao gồm padding và border */
  border: 1px solid #bbbbbb !important;
}
</style>