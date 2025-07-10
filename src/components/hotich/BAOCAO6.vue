<template>
  <div id="attach-dialog-bc6">
    <v-app>
      <v-container>
        <v-row>
          <v-col>
            <v-textarea
              label="Token"
              v-model="igateToken"
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="5" xs="12">
            <!-- Textfield nhập processId -->
            <v-text-field
              label="Mã Hồ sơ"
              v-model="maHso2"
              outlined
              append-icon="mdi-close-circle"
              @click:append="clearText"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5" xs="12">
            <!-- Textfield nhập processId -->
            <v-text-field
              label="Mã Hồ sơ Liên Thông"
              v-model="maHso"
              outlined
              append-icon="mdi-close-circle"
              @click:append="clearText2"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2" xs="12">
            <v-icon
              class="cursor-pointer round-icon"
              @click="extractMaHo"
              :style="iconStyle"
            >
              mdi mdi-atom
            </v-icon>
            <span style="color: red; font-weight: bold; margin-left: 10px"
              >Module: {{ module }}</span
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              @click="dialogLT = true"
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
                background-color: rgb(38, 113, 184) !important;
              "
              >Tra cứu TTLT</v-btn
            >
            <v-btn
              @click="fetchData"
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
                background-color: rgb(231 13 34) !important;
              "
              >Get log hồ sơ</v-btn
            >

            <v-btn
              @click="getKetQua"
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
            <v-btn
              @click="checkTrangThai"
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
                background-color: #fd7e14 !important;
              "
              >KTTT hồ sơ</v-btn
            >
            <v-btn
              @click="endHoSo"
              variant="outlined"
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
                background-color: #ce7a58 !important;
              "
              >Kết thúc hồ sơ</v-btn
            >
            <v-btn
              @click="resendNhieuHoSo"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: #ce7a58 !important;
              "
              >Kéo hso về mcua
              <v-progress-circular
                v-if="loading"
                indeterminate
                color="white"
                size="20"
                class="ml-2"
              ></v-progress-circular
            ></v-btn>
          </v-col>
        </v-row>
        <v-row v-if="istrangThaiHoSoSuccess">
          <v-col cols="10">
            <v-textarea
              variant="solo"
              bg-color="amber-lighten-4"
              color="orange orange-darken-4"
              v-model="trangThaiHoSoString"
            >
            </v-textarea>
          </v-col>
          <v-col cols="2">
            <p>Trạng thái hiện tại : {{ trangThaiHienTai }}</p>
            <v-btn
              @click="istrangThaiHoSoSuccess = false"
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
                background-color: rgb(38, 113, 184) !important;
              "
              >Ẩn đi
            </v-btn>
            <v-btn
              @click="updateTrangThai"
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
                display: none;
                background-color: rgb(38, 113, 184) !important;
              "
              >Cập nhật trạng thái
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-data-table
            :headers="tableHeaders"
            :items="data"
            :items-per-page="30"
            class="elevation-1 custom-align"
            no-data-text="Không có log"
          >
            <template v-slot:item.requestBody="{ item }">
              <pre
                style="
                  max-width: 500px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{ item.requestBody }}
              </pre>
              <v-icon
                class="ml-2 cursor-pointer round-icon"
                @click="copyToClipboard(item.requestBody)"
                :style="iconStyle"
              >
                mdi-table-edit
              </v-icon>
            </template>
            <template v-slot:item.responseBody="{ item }">
              <pre>{{ item.responseBody }}</pre>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn color="primary" @click="handleButtonClick(item)">
                Gọi lại
              </v-btn>
            </template>
          </v-data-table>
        </v-row>
        <!-- Dialog -->
        <v-dialog
          v-model="dialog"
          class="custom-dialog"
          persistent
          max-width="90%"
          attach="#attach-dialog-bc6"
        >
          <v-card>
            <v-card-title class="headline" style="margin-bottom: 20px"
              >Gọi lại<v-icon :style="closeIconStyle" @click="dialog = false">
                mdi-close
              </v-icon></v-card-title
            >
            <v-card-text>
              <v-textarea v-model="callAgainTextarea"> </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                @click="callAgainFunction()"
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
                  background-color: rgb(38, 113, 184) !important;
                "
              >
                Gọi lại
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false">Đóng</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogLT"
          class="custom-dialog"
          persistent
          max-width="90%"
          attach="#attach-dialog-bc6"
        >
          <v-card height="80vh">
            <v-card-title class="headline" style="margin-bottom: 0px"
              >Tra cứu trạng thái liên thông<v-icon
                :style="closeIconStyle"
                @click="dialogLT = false"
              >
                mdi-close
              </v-icon></v-card-title
            >
            <iframe
              src="https://lienthong.dichvucong.gov.vn/#/tra-cuu-ho-so"
              style="width: 100%; height: 100%; border: none"
            >
            </iframe>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="ketQuaDialog"
          max-width="700px"
          persistent
          attach="#attach-dialog-bc6"
        >
          <v-card>
            <v-card-title class="headline">
              <v-icon left>
                {{ isAllSuccess ? "mdi-check-circle" : "mdi-alert-circle" }}
              </v-icon>
              {{
                isAllSuccess
                  ? "Tất cả hồ sơ gửi lại thành công"
                  : "Kết quả gửi lại hồ sơ"
              }}
            </v-card-title>

            <v-card-text>
              <v-alert
                v-for="(item, index) in ketQuaNhieu"
                :key="index"
                :type="item.status === 'success' ? 'success' : 'error'"
                dense
                outlined
                class="mb-2"
              >
                <strong>{{ item.nationCode }}:</strong>
                {{
                  item.status === "success"
                    ? "✅ Thành công"
                    : "❌ Thất bại: " + (item.message || "Không rõ lỗi")
                }}
              </v-alert>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="ketQuaDialog = false">
                Đóng
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  watch: {},
  computed: {
    iconStyle() {
      return {
        backgroundColor: "#1976d2 !important" /* Màu nền của icon */,
        color: "white" /* Màu của icon */,
        borderRadius: "50%" /* Bo tròn để tạo hình tròn */,
        padding: "10px" /* Thêm không gian xung quanh icon */,
        fontSize: "25px" /* Kích thước icon */,
        marginBottom: "5px",
      };
    },
    closeIconStyle() {
      return {
        position: "absolute" /* Đặt vị trí tuyệt đối cho icon đóng */,
        right: "16px" /* Căn chỉnh từ bên phải */,
        top: "16px" /* Căn chỉnh từ trên cùng */,
        cursor: "pointer" /* Thay đổi con trỏ khi hover */,
        color: "white" /* Màu của icon, có thể thay đổi theo ý muốn */,
        borderRadius: "50%",
        backgroundColor: "#1976d2 !important",
        padding: "5px" /* Thêm không gian xung quanh icon */,
        fontSize: "15px" /* Kích thước icon */,
      };
    },

    imageStyle() {
      return {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    },
    isAllSuccess() {
      return (
        this.ketQuaNhieu.length > 0 &&
        this.ketQuaNhieu.every((item) => item.status === "success")
      );
    },
  },
  data() {
    return {
      igateToken: "",
      maHso: "",
      maHso2: "",
      ketQuaDialog: false,
      isSuccess: false,
      ketQuaNhieu: [],
      ketQua: "",
      loading: false,
      module: "",
      hsoId: "",
      dialog: false,
      dialogLT: false,
      callAgainTextarea: "",
      tableHeaders: [
        { text: "Dossier Code", value: "dossierCode", align: "start" },
        { text: "Call Time", value: "callTime", align: "start" },
        { text: "Request Body", value: "requestBody", align: "start" },
        { text: "Response Body", value: "responseBody", align: "end" },
        // { text: "Security Key", value: "securityKey" },
        { text: "Trang Thai", value: "requestBody.trangThai" },
        { text: "Action", value: "action", sortable: false, align: "end" },
      ],
      data: [],
      trangThaiHoSo: {},
      trangThaiHoSoString: "",
      istrangThaiHoSoSuccess: false,
      trangThaiHienTai: "",
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      if (this.maHso2 != "") {
        await this.getHsoId();
      }
      this.loading = false;
      this.getTTHosO();
    },
    clearText() {
      this.maHso2 = ""; // Xóa nội dung input
    },
    clearText2() {
      this.maHso = ""; // Xóa nội dung input
    },
    showError() {
      this.ketQuaDialog = true; // Mở dialog
      this.loading = false;
    },

    extractMaHo() {
      const match = this.maHso.match(/(H21|G22)\.\d{2}\.\d{2}-\d{6}-\d{4}/);
      const match2 = this.maHso2.match(/(H21|G22)\.\d{2}\.\d{2}-\d{6}-\d{4}/);
      if (match) {
        this.maHso = match[0]; // Gán lại chỉ phần cần lấy
      } else if (match2) {
        this.maHso2 = match2[0];
      } else {
        alert("Không tìm thấy mã hồ sơ hợp lệ!");
      }
    },

    async endHoSo() {
      this.loading = true;
      await this.getHsoId();
      if (this.hsoId) {
        await this.endProcess();
      }
    },

    async endProcess() {
      if (this.hsoId == "") {
        alert("Không có thông tin");
      } else {
        const url =
          "https://apiigate.gialai.gov.vn/pa/dossier/--force-end-process";
        var endRequestBody = [
          {
            id: this.hsoId,
            code: this.maHso2,
          },
        ]; // Chuyển requestBodyString về dạng object
        console.log(this.requestBody);
        try {
          const response = await axios.put(url, endRequestBody, {
            headers: {
              Authorization: `Bearer ${this.igateToken}`,
              "Content-Type": "application/json", // Content-Type của body là JSON
            },
          });
          console.log("Response:", response.data);
          this.loading = false;
          alert("Kết thúc thành công");
        } catch (error) {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        } finally {
          alert("Không có thông tin");
        }
      }
    },

    copyToClipboard(item) {
      this.dialog = true;
      console.log(item);
      this.callAgainTextarea = JSON.stringify(item, null, 2);
    },

    async checkTrangThai() {
      const response = await axios.post(
        "https://apiigate.gialai.gov.vn/ad/service/judicial-civil-status/--dossiers",
        {
          maTinh: "64",
          maDinhDanhHoSo: [this.maHso2],
          module: this.module, // Nối tiền tố với name
        },
        {
          headers: {
            Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
          },
        }
      );
      if (response) {
        this.istrangThaiHoSoSuccess = true;
        this.trangThaiHoSo = response.data.value[0];
        this.trangThaiHoSoString = JSON.stringify(this.trangThaiHoSo, null, 2);
        this.trangThaiHienTai = response.data.value[0].trangThai;
      }
    },

    async updateTrangThai() {},

    async getHsoId() {
      const maHsoTrimmed = this.maHso2.trim().replace(/\s+/g, "");
      const getHsoIdUrl = `https://apiigate.gialai.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=${maHsoTrimmed}`;

      try {
        const getHsId = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        if (getHsId.data.content[0]) {
          this.maHso2 = getHsId.data.content[0].code;
          this.maHso = getHsId.data.content[0].nationCode;
          this.module = getHsId.data.content[0].eForm.data.loaiHTTP;
          this.hsoId = getHsId.data.content[0].id;
        }
      } catch (error) {
        alert("lỖI");
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },

    async keoHoSo() {
      this.loading = true;
      const nationCode = this.maHso.trim();
      if (!nationCode) {
        alert("Vui lòng nhập mã hồ sơ!");
        return;
      }
      if (!this.igateToken) {
        alert("Vui lòng nhập token!");
        return;
      }

      try {
        const resendResponse = await axios.post(
          // "https://wsms.gialai.vnpt.vn/wsms/api/igate/resend-one",
          "https://wsms.gialai.vnpt.vn/wsms/api/igate/resend-one",
          {
            nationCode,
            token: this.igateToken,
          }
        );
        console.log(resendResponse);

        const result = resendResponse.data;
        if (result.status === "success") {
          // alert("Gửi lại thành công!");
          this.ketQua = "Gửi lại thành công!";
          this.isSuccess = true;
          this.showError();
        } else {
          this.ketQua = "Gửi lại thất bại: " + JSON.stringify(result);
          this.isSuccess = false;
          this.showError();
        }
      } catch (error) {
        console.error("Lỗi:", error);
        this.isSuccess = false;
        this.ketQua =
          "Gửi lại thất bại: " + (error.response?.data || error.message);
        this.showError();
      }
    },

    async resendNhieuHoSo() {
      this.loading = true;
      const rawList = this.maHso
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (!this.igateToken || rawList.length === 0) {
        alert("Vui lòng nhập mã hồ sơ và token.");
        return;
      }

      this.ketQuaNhieu = [];

      for (let ma of rawList) {
        try {
          const res = await axios.post(
            "https://wsms.gialai.vnpt.vn/wsms/api/igate/resend-one",
            {
              nationCode: ma,
              token: this.igateToken,
            }
          );

          this.ketQuaNhieu.push({
            nationCode: ma,
            status: res.data.status,
            message: res.data.message || "",
          });
        } catch (err) {
          this.ketQuaNhieu.push({
            nationCode: ma,
            status: "error",
            message: err.message || "Lỗi không xác định",
          });
        }
      }
      this.loading = false;
      this.ketQuaDialog = true;
    },

    async getTTHosO() {
      const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
      this.data = [];

      const getHsoIdUrl = `https://apiigate.gialai.gov.vn/ad/api/lienthongDVCLT/getLog?nationCode=${maHsoTrimmed}`;

      try {
        const response = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        if (response.data && response.data.content.length > 0) {
          response.data.content.forEach((element) => {
            if (element.requestBody.trangThai) {
              // Check if element already exists based on trangThai and responseBody.status
              const exists = this.data.some(
                (item) =>
                  item.requestBody.trangThai ===
                    element.requestBody.trangThai &&
                  item.responseBody.status === element.responseBody.status
              );

              if (!exists) {
                this.data.push(element);
                if (this.module == "") {
                  if (
                    element.requestBody.maTTHC == "2.000986" ||
                    element.requestBody.maTTHC == "2.001023"
                  ) {
                    this.module = "LTKS";
                  } else if (element.requestBody.maTTHC == "1.011733") {
                    this.module = "LTKT";
                  }
                }
                this.maHso2 = element.requestBody.maHoSo;
              }
            }
          });
        }

        this.data.sort(
          (a, b) => a.requestBody.trangThai - b.requestBody.trangThai
        );

        console.log("content:", response);
      } catch (error) {
        alert(error);
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },

    async callAgainFunction() {
      console.log(this.callAgainTextarea);
      const dayLaiUrl = `https://apiigate.gialai.gov.vn/ad/api/lienthongDVCLT/capNhatTrangThaiHoSoDVCLTHoTich`;
      try {
        const response = await axios.post(
          dayLaiUrl,
          JSON.parse(this.callAgainTextarea, null, 2),
          {
            headers: {
              Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
            },
          }
        );
        if (response) {
          console.log(response.data);
          if (response.data.status == 200) {
            alert(response.data.title);
          } else {
            alert(response.data.errors.soHoSoLT[0]);
          }
        }
      } catch (error) {
        alert(error);
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },

    async handleButtonClick(item) {
      console.log(item);
      const dayLaiUrl = `https://apiigate.gialai.gov.vn/ad/api/lienthongDVCLT/capNhatTrangThaiHoSoDVCLTHoTich`;
      try {
        const response = await axios.post(dayLaiUrl, item.requestBody, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
          },
        });
        if (response) {
          console.log(response.data);
          if (response.data.status == 200) {
            alert(response.data.title);
          } else {
            alert(response.data.errors.soHoSoLT[0]);
          }
        }
      } catch (error) {
        alert(error);
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      }
    },

    async getKetQua() {
      if (this.maHso2 == "") {
        alert("chưa nhập mã hồ sơ");
        return;
      }
      const maHsoTrimmed = this.maHso2.trim().replace(/\s+/g, "");
      const getKetQuaUrl = `https://apiigate.gialai.gov.vn/pa/judicial-civil-status/--sync-dossiers?code=${maHsoTrimmed}`;
      const response = await axios.post(
        getKetQuaUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
          },
        }
      );
      if (response) {
        alert(response);
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

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #bbbbbb !important;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}
.response-column {
  max-width: 300px; /* Đặt độ rộng tối đa */
  white-space: nowrap; /* Không cho phép xuống dòng */
  overflow: hidden; /* Ẩn phần vượt quá */
  text-overflow: ellipsis; /* Hiển thị dấu "..." khi nội dung vượt quá */
}

button {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #bbbbbb !important;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  background-color: rgb(38, 113, 184) !important;
}

p {
  color: red;
}
</style>
