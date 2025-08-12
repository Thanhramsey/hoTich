<template>
  <div>
    <v-app>
      <v-container>
        <section style="display: none">
          <section class="mb-5">
            <h2 class="mb-5">Get Token(Dùng ở local)</h2>
          </section>
          <hr class="mb-5" />
          <div>
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              v-model="username"
              required
              style="
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
              "
            />
          </div>
          <div>
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              style="
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
              "
            />
          </div>
          <button
            @click="getToken"
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
          >
            Get Token
          </button>
          <p v-if="token">Token: {{ token }}</p>
        </section>

        <section>
          <section class="mb-5">
            <h2 class="mb-5">Get TT Hồ sơ</h2>
            <v-row>
              <v-col cols="12" xs="12" md="5">
                <div>
                  <label
                    for="gliToken"
                    style="font-size: large; font-weight: bold"
                    >gliToken:</label
                  >
                  <v-icon
                    class="ml-2 cursor-pointer round-icon"
                    @click="copyToClipboard(1)"
                    :style="iconStyle"
                  >
                    mdi-content-copy
                  </v-icon>
                  <v-text-field
                    v-model="token"
                    label="token"
                    outlined
                    append-icon="mdi-close-circle"
                    @click:append="clearText2"
                  ></v-text-field>

                  <v-text-field
                    id="lgspaccesstoken"
                    v-model="lgspaccesstoken"
                    label="lgspaccesstoken"
                    outlined
                    append-icon="mdi-close-circle"
                    @click:append="clearText3"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" xs="12" md="5"
                ><div>
                  <div class="d-flex align-center">
                    <label
                      for="igateToken"
                      style="font-size: large; font-weight: bold"
                    >
                      igateToken:
                    </label>
                    <v-icon
                      class="ml-2 cursor-pointer round-icon"
                      @click="copyToClipboard(2)"
                      :style="iconStyle"
                    >
                      mdi-content-copy
                    </v-icon>
                  </div>
                  <!-- Dialog -->
                  <v-dialog
                    v-model="dialog"
                    class="custom-dialog"
                    persistent
                    max-width="90%"
                    :style="imageStyle"
                  >
                    <v-card>
                      <v-card-title class="headline" style="margin-bottom: 20px"
                        >Lấy token Igate<v-icon
                          :style="closeIconStyle"
                          @click="dialog = false"
                        >
                          mdi-close
                        </v-icon></v-card-title
                      >
                      <v-card-text>
                        <v-img :src="currentImage" alt="Description" />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="dialog = false">Đóng</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog
                    v-model="notificationDialog"
                    max-width="700px"
                    persistent
                  >
                    <v-card>
                      <v-card-title class="headline">
                        <span v-if="isSuccess">Success</span>
                        <span v-else>Error</span>
                      </v-card-title>
                      <v-card-text>
                        <v-alert
                          :type="isSuccess ? 'success' : 'error'"
                          border="left"
                          colored-border
                          max-width="400px"
                        >
                          {{ notificationMessage }}
                        </v-alert>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          style="
                            color: white;
                            background-color: #1976d2 !important;
                          "
                          text
                          @click="notificationDialog = false"
                          >Close</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog
                    v-model="dialogDV"
                    class="custom-dialog"
                    persistent
                    max-width="90%"
                    :style="imageStyle"
                  >
                    <v-card>
                      <v-card-title class="headline" style="margin-bottom: 20px"
                        >Dialog Đơn vị<v-icon
                          :style="closeIconStyle"
                          @click="dialogDV = false"
                        >
                          mdi-close
                        </v-icon></v-card-title
                      >
                      <v-card-text>
                        <v-text-field
                          v-model="searchDV"
                          label="Tìm kiếm..."
                          class="mb-3"
                          outlined
                          dense
                        ></v-text-field>

                        <v-data-table
                          :headers="headersDV"
                          :items="itemsdDV"
                          :search="searchDV"
                          class="elevation-1"
                        ></v-data-table>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="dialog = false">Đóng</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-textarea
                    class="textarea"
                    type="text"
                    id="igateToken"
                    v-model="igateToken"
                    required
                  ></v-textarea>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="2"
                xs="12"
                class="d-flex flex-column justify-center"
              >
                <v-btn
                  @click="getToken"
                  :disabled="loading"
                  variant="outlined"
                  style="
                    color: white;
                    font-weight: bold;
                    width: auto;
                    padding: 20px;
                    margin: 10px 0;
                    border: 1px solid #bbbbbb !important;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 16px;
                    background-color: #006400 !important;
                  "
                  >Lấy token</v-btn
                >
              </v-col>
            </v-row>

            <v-row>
              <!-- <label for="maHso" style="font-size: large; font-weight: bold"
                >Mã hồ sơ:</label
              > -->

              <!-- <input
                type="text"
                id="maHso"
                v-model="maHso"
                required
                style="
                  width: auto;
                  padding: 10px;
                  margin: 10px;
                  border: 1px solid #bbbbbb !important;
                  border-radius: 4px;
                  box-sizing: border-box;
                  font-size: 16px;
                "
              />
              <span v-if="maHso" @click="clearText" class="clear-icon">❌</span> -->
              <v-col cols="12" md="6" sm="8">
                <v-text-field
                  label="Mã Hồ sơ"
                  v-model="maHso"
                  outlined
                  append-icon="mdi-close-circle"
                  @click:append="clearText"
                ></v-text-field>
                <v-checkbox
                  v-model="isHaveFile"
                  color="red"
                  label="Có gửi file"
                  value="red"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="6" sm="2">
                <v-icon
                  class="ml-2 cursor-pointer round-icon"
                  @click="extractMaHo"
                  :style="iconStyle"
                >
                  mdi mdi-atom
                </v-icon>
              </v-col>
            </v-row>
            <p v-if="eformData" style="color: red; display: none">
              eformData: {{ eformData }}
            </p>
            <v-btn
              @click="fetchData"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 20px;
                margin: 10px 10px 10px 0px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
            >
              <v-progress-circular
                v-if="loading"
                indeterminate
                color="white"
                size="20"
                class="ml-2"
              ></v-progress-circular>
              Lấy dữ liệu hồ sơ
            </v-btn>
            <v-btn
              @click="pushHoTich2"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                width: auto;
                font-weight: bold;
                padding: 20px;
                margin: 10px 10px 10px 0px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38 184 50) !important;
              "
            >
              Đẩy qua hộ tịch
            </v-btn>

            <v-btn
              @click="endHoSo"
              :disabled="loading"
              variant="outlined"
              style="
                color: white;
                font-weight: bold;
                width: auto;
                padding: 20px;
                margin: 10px 10px 10px 0px;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: #ce7a58 !important;
              "
              >Kết thúc hồ sơ</v-btn
            >
            <v-btn
              @click="showDialogDV"
              variant="outlined"
              style="
                color: white;
                width: auto;
                font-weight: bold;
                padding: 20px;
                margin: 10px 0;
                border: 1px solid #bbbbbb !important;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 16px;
                background-color: rgb(38, 113, 184) !important;
              "
            >
              Tra Cứu Mã Đơn vị
            </v-btn>
            <p v-if="donViNop" style="color: red">
              <b>Hồ sơ của đơn vị: {{ donViNop }}</b>
            </p>
            <p v-if="noiDangKy" style="color: red">
              <b>Nơi đăng ký trong eform: {{ noiDangKy }}</b>
            </p>
          </section>
          <section class="mt-5">
            <p v-if="requestBody" style="color: red; display: none">
              Body gửi đi: {{ requestBody }}
            </p>
            <div style="position: relative" class="my-editor-container">
              <!-- <v-textarea
                v-model="requestBodyString"
                label="Request Body"
                outlined
                auto-grow
                rows="10"
              ></v-textarea> -->
              <textarea ref="editor" v-model="requestBodyString"></textarea>
              <v-btn
                small
                color="warning"
                style="position: absolute; top: 4px; right: 4px; z-index: 1"
                @click="filterRequestBody"
              >
                Lọc inputSend
              </v-btn>
            </div>

            <!-- <v-row>
              <textarea ref="editor"></textarea>
            </v-row> -->

            <p v-if="responseHT" style="color: purple">
              Kết quả trả về từ hộ tịch: {{ responseHT }}
            </p>
          </section>
        </section>
      </v-container>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        timeout="3000"
        bottom
        elevation="10"
      >
        <span style="font-size: 18px; font-weight: bold">{{
          notificationMessage
        }}</span>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import { jsonToXml } from "./jsonToXml.js";
import dviJson from "./dviJson.json";
import noiDangKyJson from "./noiDangKy.json";
import maDVHotTich from "./maDVHotTich.json";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/material.css";
import "codemirror/addon/search/searchcursor.js";

export default {
  components: {},
  watch: {
    requestBodyString(newValue) {
      if (newValue !== this.cmInstance.getValue()) {
        this.cmInstance.setValue(newValue);
      }
    },
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
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
  },
  data() {
    return {
      username: "",
      password: "",
      token: "",
      isHaveFile: false,
      lgspaccesstoken: "",
      maHso: "",
      hsoId: "",
      igateToken: "",
      eformData: "",
      requestBody: {
        maDonVi: "",
        module: "",
        maHoSo: "",
        ngayTiepNhan: "",
        data: "",
      },
      responseHT: "",
      requestBodyString: "",
      dialog: false,
      dialogDV: false,
      currentImage: "",
      notificationDialog: false,
      notificationMessage: "",
      isSuccess: false,
      loading: false,
      dViData: dviJson,
      noiDangKyJson: noiDangKyJson,
      donViNop: "",
      noiDangKy: "",
      ltRequest: {},
      isDVCLT: false,
      headersDV: [
        { text: "Mã Đơn vị", value: "value" },
        { text: "Tên đơn vị", value: "label" },
      ],
      itemsdDV: maDVHotTich,
      searchDV: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      cmInstance: null,
    };
  },
  mounted() {
    this.cmInstance = CodeMirror.fromTextArea(this.$refs.editor, {
      lineNumbers: true,
      mode: "application/json",
      theme: "material",
      tabSize: 5,
      lineWrapping: true,
    });
    this.cmInstance.setValue(this.requestBodyString);
    this.cmInstance.on("change", () => {
      this.requestBodyString = this.cmInstance.getValue();
      // Phát ra sự kiện input để v-model có thể lắng nghe
      this.$emit("input", this.requestBodyString);
    });
  },
  methods: {
    removeVietnameseTones(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    },

    highlightErrors(errorsText) {
      if (!this.cmInstance || !errorsText) return;

      // Xóa highlight cũ
      this.errorMarks = this.errorMarks || [];
      this.errorMarks.forEach((m) => m.clear());
      this.errorMarks = [];

      // Sử dụng match() để lấy tất cả các chuỗi camelCase khớp
      // và GÁN KẾT QUẢ ĐÓ VÀO BIẾN fields
      const camelCaseRegex = /\b[a-z]+(?:[A-Z][a-z0-9]*)+\b/g;
      const fields = errorsText.match(camelCaseRegex) || []; // Gán kết quả vào fields, nếu không tìm thấy thì gán mảng rỗng

      // Giờ đây, biến fields đã chứa tất cả các chuỗi camelCase
      console.log("Các chuỗi camelCase tìm thấy:");
      console.log(fields);

      // Xử lý các trường hợp không tìm thấy
      if (fields.length === 0) {
        console.log("Không tìm thấy chuỗi camelCase nào.");
      }

      console.log("fields for highlight:", fields);
      // Loại prefix 'n', 'nc', 'capn'... ra khỏi đầu nếu cần
      const cleanedFields = fields.map((f) => {
        return f.replace(/^(n|nc|capn|apn|pn)+/, "");
      });

      // Loại trùng
      const uniqueFields = [...new Set(cleanedFields)];
      console.log("Cleaned unique fields for highlight:", uniqueFields);
      let firstPos = null;

      uniqueFields.forEach((field) => {
        const rxKey = new RegExp(
          '"' + field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s*:',
          "g"
        );
        let cursor = this.cmInstance.getSearchCursor(rxKey);
        let found = false;
        while (cursor.findNext()) {
          const from = cursor.from(),
            to = cursor.to();
          const mark = this.cmInstance.markText(from, to, {
            className: "cm-error-highlight",
          });
          this.errorMarks.push(mark);
          if (!firstPos) firstPos = from;
          found = true;
        }

        if (!found) {
          const rxEsc = new RegExp(
            '\\\\"' + field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '\\\\":',
            "g"
          );
          const cursor2 = this.cmInstance.getSearchCursor(rxEsc);
          while (cursor2.findNext()) {
            const from = cursor2.from(),
              to = cursor2.to();
            const mark = this.cmInstance.markText(from, to, {
              className: "cm-error-highlight",
            });
            this.errorMarks.push(mark);
            if (!firstPos) firstPos = from;
          }
        }
      });

      if (firstPos) {
        this.cmInstance.scrollIntoView(firstPos, 100);
        this.cmInstance.setCursor(firstPos);
      }
    },
    copyToClipboard(type) {
      var textarea = "";
      if (type == 1) {
        textarea = document.getElementById("gliToken");
      } else {
        textarea = document.getElementById("igateToken");
      }

      if (textarea) {
        textarea.select();
        document.execCommand("copy");
      }
    },

    filterRequestBody() {
      try {
        const parsed = JSON.parse(this.requestBodyString);
        if (parsed.inputSend && typeof parsed.inputSend === "object") {
          this.requestBodyString = JSON.stringify(parsed.inputSend, null, 2);
        } else {
          this.$toast?.error?.("Không tìm thấy hoặc inputSend không hợp lệ");
        }
      } catch (err) {
        this.$toast?.error?.("Dữ liệu JSON không hợp lệ");
      }
    },

    extractMaHo() {
      const match = this.maHso.match(
        /H21\.\d{3}-\d{6}-\d{4}|G22\.\d{2}\.\d{2}-\d{6}-\d{4}/
      );
      if (match) {
        this.maHso = match[0];
      } else {
        alert("Không tìm thấy mã hồ sơ hợp lệ!");
      }
    },

    showImage(image) {
      this.currentImage = image; // Cập nhật đường dẫn hình ảnh
      this.dialog = true; // Mở dialog
    },

    showDialogDV() {
      this.dialogDV = true; // Mở dialog
    },

    showError() {
      // this.notificationDialog = true; // Mở dialog
      // this.snackbarText = 'Thông báo bạn muốn hiển thị';
      this.snackbarColor = this.isSuccess ? "success" : "error";
      this.snackbar = true;
    },

    getB64Auth(user, password) {
      const source = user + ":" + password;
      const Authorization = "Basic " + Buffer.from(source).toString("base64");
      return Authorization;
    },
    clearText() {
      this.maHso = ""; // Xóa nội dung input
    },
    clearText2() {
      this.token = ""; // Xóa nội dung input
    },
    clearText3() {
      this.lgspaccesstoken = ""; // Xóa nội dung input
    },

    async getToken() {
      try {
        const response = await axios.post(
          "https://wsms.gialai.vnpt.vn/wsms/api/igate/login-lgsp-gli",
          // "http://localhost:8087/wsms_war/api/igate/login-lgsp-gli",
          null,
          {
            headers: {},
          }
        );
        console.log("Token:", response.data);
        this.token = response.data.access_token;
        this.lgspaccesstoken = response.data.lgspaccesstoken;

        const response2 = await axios.post(
          "https://wsms.gialai.vnpt.vn/wsms/api/igate/login-igate",
          null,
          {
            headers: {},
          }
        );
        console.log("Token:", response2.data);
        this.igateToken = response2.data.access_token;
      } catch (error) {
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
          console.error("Header phản hồi lỗi:", error.response.headers);
        } else if (error.request) {
          // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          // Một lỗi đã xảy ra trong quá trình thiết lập yêu cầu
          console.error("Thông báo lỗi:", error.message);
        }
        console.error("Cấu hình lỗi:", error);
      }
    },

    async getLTRequest() {
      const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
      const getLTRequestURL = `https://apiigate.gialai.gov.vn/pa/judicial-civil-status/--send?code=${maHsoTrimmed}&showIntputSendEnable=true`;

      try {
        const dataLT = await axios.post(
          getLTRequestURL,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
            },
          }
        );
        console.log("content LT:", dataLT);
        this.ltRequest = dataLT.data.input;
        this.requestBodyString = JSON.stringify(this.ltRequest, null, 2);
      } catch (error) {
        this.loading = false;
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        this.showError();
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

    async getHsoId() {
      const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
      const getHsoIdUrl = `https://apiigate.gialai.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=${maHsoTrimmed}`;
      this.requestBodyString = "";
      try {
        const getHsId = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        console.log("content:", getHsId);
        if (getHsId.data.content[0].nationCode) {
          this.maHso = getHsId.data.content[0].code;
        }
        this.hsoId = getHsId.data.content[0].id;
        this.isDVCLT = getHsId.data.content[0].isDVCLT;

        console.log(
          " getHsId.data.content[0].eForm.data.loaiHTTP",
          getHsId.data.content[0].eForm.data.loaiHTTP
        );
        if (
          getHsId.data.content[0].eForm.data.loaiHTTP == "LTKS" ||
          getHsId.data.content[0].eForm.data.loaiHTTP == "LTKT" ||
          getHsId.data.content[0].eForm.data.loaiHTTP == "LTKH"
        ) {
          await this.getLTRequest();
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
        } else {
          let agency = getHsId.data.content[0].agency.code;
          if (agency) {
            let dvi = this.dViData.content.find((room) => room.code === agency);
            this.donViNop = dvi.name;

            var maNoiDangKy = getHsId.data.content[0].eForm.data.noiDangKy;
            let noiDangKyName = this.noiDangKyJson.find(
              (data) => data.maDonViHanhChinh === maNoiDangKy
            );
            this.noiDangKy = noiDangKyName.tenDonViHanhChinh;
          }
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
          this.showError();
          this.requestBody.maDonVi =
            getHsId.data.content[0].eForm.data.noiDangKy;
          const date = new Date(getHsId.data.content[0].acceptedDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cộng 1 để có tháng chính xác
          const day = String(date.getDate()).padStart(2, "0");

          this.requestBody.ngayTiepNhan = `${year}-${month}-${day}`;
          this.requestBody.module = getHsId.data.content[0].eForm.data.loaiHTTP;
          this.requestBody.maHoSo = getHsId.data.content[0].code;
          this.eformData = getHsId.data.content[0].eForm.data;
          let innerXML = jsonToXml(this.eformData);
          this.requestBody.data = `<hotich><hoso>${innerXML}</hoso></hotich>`;
          this.responseHT = "";
          this.requestBodyString = JSON.stringify(this.requestBody, null, 2);
        }
      } catch (error) {
        this.loading = false;
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        this.showError();
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      } finally {
        this.loading = false; // Kết thúc hiển thị loader
        this.showError();
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
      this.loading = true;
      if (this.hsoId == "") {
        this.loading = false;
        this.notificationMessage = "Không có thông tin";
        this.isSuccess = false;
        this.showError();
      } else {
        const url =
          "https://apiigate.gialai.gov.vn/pa/dossier/--force-end-process";
        var endRequestBody = [
          {
            id: this.hsoId,
            code: this.maHso,
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

          this.notificationMessage = "Thành công";
          this.isSuccess = true;
        } catch (error) {
          this.notificationMessage = error.response
            ? error.response.data
            : error.message;
          this.isSuccess = false;
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        } finally {
          this.loading = false; // Kết thúc hiển thị loader
          this.showError();
        }
      }
    },

    async getData() {
      const url = `https://apiigate.gialai.gov.vn/pa/dossier/${this.hsoId}/--online`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        // Lưu dữ liệu vào biến data
        console.log("Data:", response.data);

        if (
          response.data.eForm.data.loaiHTTP == "LTKS" ||
          response.data.eForm.data.loaiHTTP == "LTKT"
        ) {
          await this.getLTRequest();
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
        } else {
          this.requestBody.maDonVi = response.data.eForm.data.noiDangKy;
          const date = new Date(response.data.acceptedDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cộng 1 để có tháng chính xác
          const day = String(date.getDate()).padStart(2, "0");

          this.requestBody.ngayTiepNhan = `${year}-${month}-${day}`;
          this.requestBody.module = response.data.eForm.data.loaiHTTP;
          this.requestBody.maHoSo = response.data.code;
          this.eformData = response.data.eForm.data;
          let innerXML = jsonToXml(this.eformData);
          this.requestBody.data = `<hotich><hoso>${innerXML}</hoso></hotich>`;
          this.responseHT = "";
          this.requestBodyString = JSON.stringify(this.requestBody, null, 2);
          this.isSuccess = true;
          this.notificationMessage = "Get thông tin hồ sơ thành công";
          this.showError();
        }
      } catch (error) {
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      } finally {
        this.loading = false; // Kết thúc hiển thị loader
        this.showError();
      }
    },

    async fetchData() {
      this.loading = true;
      await this.handleSend();
    },

    async handleSend() {
      this.resultApi1 = null;
      // this.resultApi2 = null;
      // this.errorMsg = "";

      try {
        // 1. Gọi API 1
        const maHsoTrimmed = this.maHso.trim().replace(/\s+/g, "");
        var api1Url = `https://apiigate.gialai.gov.vn/pa/api-integration/--data?code=${maHsoTrimmed}&fields=commonEForm%2CdetailEForm%2CdossierFee%2CcurrentTask`;
        if (this.isHaveFile) {
          api1Url = `https://apiigate.gialai.gov.vn/pa/api-integration/--data?code=${maHsoTrimmed}&fields=commonEForm%2CdetailEForm%2CdossierFormFile%2CdossierFee%2CcurrentTask`;
        }
        const res1 = await axios.get(api1Url, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });

        const data1 = res1.data;
        this.resultApi1 = JSON.stringify(data1, null, 2);

        // 2. Lấy option từ API 1
        const option = `${data1.commonEForm.eformId}-${data1.detailEForm.id}`;
        const api2Url = `https://apiigate.gialai.gov.vn/ad/service/judicial-civil-status/--new-dossier?option=${option}&showIntputSendEnable=true`;

        const body = {
          dossierCode: data1.code,
          resource: data1,
        };

        // 3. Gửi API 2
        const res2 = await axios.post(api2Url, body, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
            "Content-Type": "application/json", // Content-Type của body là JSON
          },
        });
        // this.resultApi2 = JSON.stringify(res2.data, null, 2);
        this.requestBodyString = JSON.stringify(res2.data, null, 2);

        // var res2 = {
        //   data: {
        //     title: "Có lỗi xảy ra.",
        //     errors:
        //       "cbsSoDDCN có độ dài vượt quá số lượng cho phép. Vui lòng kiểm tra lại thông tin.ncbsLoaiGiayToTuyThan không tồn tại. Vui lòng kiểm tra lại thông tin danh mục theo mô tả trong tài liệu kỹ thuật đã cung cấp.ncbsSoDDCN có định dạng không đúng. Vui lòng kiểm tra lại tài liệu kỹ thuật đã cung cấp.",
        //     status: 500,
        //     inputSend: {
        //       maHoSoMCDT: "H21.129-250812-0035",
        //       maHoSoLT: "BS",
        //       data: '{"nycNgayCapGiayToTuyThan":"25/06/2023","nycEmail":"","noiDangKyTruocDay":"23710","nycSoGiayToTuyThan":"034184022854","cbsDanTocKhac":"","nycSoDienThoai":"0366607768","thongTinKhac":"","loaiBanSao":0,"cbsQuocTich":"VN","cbsNgayCapGiayToTuyThan":"22/06/2023","nycLoaiGiayToTuyThan":4,"nycHoTen":{"Ho":"DƯƠNG","ChuDem":"THỊ","Ten":"TUYẾT ANH"},"quyenSoDangKyTruocDay":"2023","cbsNgaySinh":{"namSinh":"2021","thangSinh":"06","ngaySinh":"24"},"cbsNoiCapGiayToTuyThan":"UBND xã Ia Băng, tỉnh Gia Lai","cbsGioiTinh":1,"cbsHoTen":{"Ho":"DƯƠNG","ChuDem":"HOÀNG ","Ten":"PHÚ"},"cbsNoiCuTru":{"dcChiTiet":"Thôn Ia Băng","quocGia":"VN","maTinh":"52","maXa":"23710"},"noiDangKy":"23710","nycNoiCuTru":{"dcChiTiet":"Thôn Hàm Rồng","quocGia":"VN","maTinh":"52","maXa":"23710"},"cbsDanToc":"63001","loaiBSCC":"","cbsSoGiayToTuyThan":"120","cbsLoaiCuTru":1,"ngayDangKyTruocDay":"22/06/2023","cbsLoaiGiayToTuyThan":10,"cbsSoDDCN":"0654221015358","nycNoiCapGiayToTuyThan":"Cục cảnh sát quản lý hành chính về trật tự xã hội","nycQuanHe":"Mẹ","nycLoaiCuTru":1,"soDangKyTruocDay":"120"}',
        //       module: "BS",
        //       ngayTiepNhan: "12/08/2025 ",
        //       maDonVi: "23710",
        //     },
        //   },
        // };
        // this.requestBodyString = JSON.stringify(res2.data, null, 2);

        this.cmInstance.setValue(this.requestBodyString);

        // Xóa highlight cũ nếu có
        this.cmInstance.getAllMarks().forEach((mark) => mark.clear());

        // Nếu có errors -> highlight
        if (res2.data.errors) {
          console.log("data", res2.data.errors);
          this.highlightErrors(res2.data.errors);
        }

        this.isSuccess = true;
        this.notificationMessage = "Get thông tin hồ sơ thành công";
      } catch (error) {
        this.isSuccess = false;
        this.notificationMessage = "Get thông tin hồ sơ không thành công";
        if (error.response) {
          console.error("Dữ liệu phản hồi lỗi:", error.response.data);
          console.error("Trạng thái phản hồi lỗi:", error.response.status);
        } else if (error.request) {
          console.error("Yêu cầu lỗi:", error.request);
        } else {
          console.error("Thông báo lỗi:", error.message);
        }
      } finally {
        this.loading = false; // Kết thúc hiển thị loader
        this.showError();
      }
    },

    async pushHoTich2() {
      this.loading = true;
      if (this.token === "") {
        this.loading = false;
        this.notificationMessage = "Chưa có token GLI";
        this.isSuccess = false;
        this.showError();
        return;
      }

      const url = "https://wsms.gialai.vnpt.vn/wsms/api/igate/push-ho-tich"; // Gọi API nội bộ
      // const url = "http://localhost:8087/wsms_war/api/igate/push-ho-tich"; // Gọi API nội
      const bodySend = JSON.parse(this.requestBodyString);

      try {
        const response = await axios.post(url, bodySend, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            lgspaccesstoken: `${this.lgspaccesstoken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response:", response.data);
        this.responseHT = response.data;
        this.notificationMessage = response.data;
        this.isSuccess = true;
      } catch (error) {
        this.notificationMessage = error.response
          ? error.response.data
          : error.message;
        this.isSuccess = false;
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      } finally {
        this.loading = false;
        this.showError();
      }
    },

    async pushHoTich() {
      this.loading = true;
      if (this.token == "") {
        this.loading = false;
        this.notificationMessage = "Chưa có token GLI";
        this.isSuccess = false;
        this.showError();
      } else {
        var url =
          "https://congdichvu.gialai.gov.vn:443/hotich/1.0/dangKyHoTich";
        var bodySend = JSON.parse(this.requestBodyString); // Chuyển requestBodyString về dạng object

        if (
          bodySend.module == "LTKS" ||
          bodySend.module == "LTKT" ||
          bodySend.module == "LTKH"
        ) {
          url =
            "https://congdichvu.gialai.gov.vn:443/apiLienThongKSKT/1.0/nhanHoSoDKHT";
        }
        console.log(bodySend);
        try {
          const response = await axios.post(url, bodySend, {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json", // Content-Type của body là JSON
            },
          });
          console.log("Response:", response.data);

          this.responseHT = response.data;
          this.notificationMessage = response.data;
          this.isSuccess = true;
        } catch (error) {
          this.notificationMessage = error.response
            ? error.response.data
            : error.message;
          this.isSuccess = false;
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        } finally {
          this.loading = false; // Kết thúc hiển thị loader
          this.showError();
        }
      }
    },
  },
};
</script>

<style scoped>
.cm-s-material .highlight-error {
  background-color: rgba(255, 0, 0, 0.3);
  border-bottom: 2px solid red;
}

.my-editor-container :deep(.CodeMirror) {
  height: auto;
  border: 1px solid #ccc;
  min-height: 200px;
}
.my-editor-container :deep(.CodeMirror .CodeMirror-scroll) {
  min-height: 200px;
  overflow: hidden !important; /* This is the key line */
}
.CodeMirror .cm-error-highlight {
  background-color: yellow;
  color: red !important;
  font-weight: bold;
}
</style>
