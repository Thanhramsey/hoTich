<template>
  <div>
    <v-container>
      <!-- File Upload -->
      <div>
        <label for="igateToken" style="font-size: large; font-weight: bold"
          >igateToken:</label
        >
        <v-icon class="ml-2 cursor-pointer round-icon">
          mdi-information-outline
        </v-icon>
        <textarea
          class="textarea"
          type="text"
          id="igateToken"
          v-model="igateToken"
          required
          style="
            width: 100%;
            height: 100px;
            box-sizing: border-box;
            border: 1px solid #bbbbbb !important;
          "
        ></textarea>
      </div>
      <v-file-input
        label="Upload Excel File"
        accept=".xlsx, .xls"
        v-model="file"
      ></v-file-input>

      <!-- Progress Linear -->
      <v-progress-linear
        v-if="progress > 0 && progress < 100"
        :value="progress"
        height="10"
        color="blue"
        class="my-4"
      ></v-progress-linear>

      <!-- Process Button -->
      <v-btn
        @click="processFile"
        style="
          color: white;
          font-weight: bold;
          width: 250px;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #bbbbbb !important;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 16px;
          background-color: rgb(38, 113, 184) !important;
        "
      >
        Process Hồ sơ
      </v-btn>

      <v-btn
        @click="processLLTP"
        style="
          color: white;
          font-weight: bold;
          width: 250px;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #bbbbbb !important;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 16px;
          background-color: rgb(0, 150, 136) !important;
        "
      >
        Đồng bộ LLTP
      </v-btn>

      <!-- Processed Addresses Table -->
      <v-data-table
        v-if="processedAddresses.length > 0"
        :headers="headers"
        :items="processedAddresses"
        class="mt-4"
      >
        <template v-slot:item.coordinates="{ item }">
          <span>{{ item.coordinates }}</span>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import axios from "axios";

export default {
  data() {
    return {
      file: null, // For storing the uploaded file
      addresses: [], // Array to hold the addresses from the Excel file
      processedAddresses: [], // Array to hold the processed addresses with coordinates
      progress: 0, // To track the progress percentage
      totalAddresses: 0, // Total number of addresses to process
      hsoId: "",
      igateToken: "",
      headers: [
        { text: "Mã hồ sơ", value: "address" },
        { text: "Trạng thái xử lý", value: "coordinates" },
      ],
    };
  },
  methods: {
    async processFile() {
      if (!this.file) return;

      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Clear existing addresses and processed data
        this.addresses = [];
        this.processedAddresses = [];

        json.forEach((row, index) => {
          if (index > 0) {
            this.addresses.push(row[1]); // Assuming column 2 is the address
          }
        });
        console.log("this.addresses:", this.addresses);

        this.totalAddresses = this.addresses.length;
        await this.processAddresses();
      };

      reader.readAsArrayBuffer(this.file);
    },

    async processLLTP() {
      if (!this.file) return;

      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Clear existing addresses and processed data
        this.addresses = [];
        this.processedAddresses = [];

        json.forEach((row, index) => {
          if (index > 0) {
            this.addresses.push(row[1]); // Assuming column 2 is the address
          }
        });
        console.log("this.addresses:", this.addresses);

        this.totalAddresses = this.addresses.length;
        await this.processlltp2();
      };

      reader.readAsArrayBuffer(this.file);
    },

    async processlltp2() {
      for (let i = 0; i < this.addresses.length; i++) {
        const address = this.addresses[i];
        const coordinates = await this.syncLLTP(address);
        this.processedAddresses.push({
          address,
          coordinates,
        });

        // Update progress
        this.progress = Math.round(((i + 1) / this.totalAddresses) * 100);
      }

      this.downloadProcessedFile(); // Call method to download the file
    },

    async syncLLTP(code) {
      const trimmedCode = code.trim().replace(/\s+/g, "");
      const url = `https://apiigate.gialai.gov.vn/pa/v2/lyLichTuPhap/--sync-dossiers?code=${trimmedCode}`;

      try {
        const response = await axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.igateToken}`,
            },
          }
        );

        console.log("Đồng bộ LLTP thành công:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Lỗi đồng bộ LLTP:",
          error.response?.data || error.message
        );
        return "Thất bại";
      }
    },

    async processAddresses() {
      for (let i = 0; i < this.addresses.length; i++) {
        const address = this.addresses[i];
        const coordinates = await this.endHoSo(address);
        this.processedAddresses.push({
          address,
          coordinates,
        });

        // Update progress
        this.progress = Math.round(((i + 1) / this.totalAddresses) * 100);
      }

      this.downloadProcessedFile2(); // Call method to download the file
    },

    async endHoSo(id) {
      try {
        const hsoId = await this.getHsoId(id);
        if (!hsoId) return "Không tìm thấy hồ sơ nào.";

        const result = await this.endProcess(hsoId, id);
        return result ? "Thành công" : "Thất bại";
      } catch (error) {
        console.error("Lỗi khi kết thúc hồ sơ:", error);
        return "Thất bại";
      }
    },

    async getHsoId(id) {
      const trimmedId = id.trim().replace(/\s+/g, "");
      const url = `https://apiigate.gialai.gov.vn/pa/dossier/search?page=0&size=1&applicant-organization=&spec=slice&code=${trimmedId}`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        const content = response.data.content;
        if (content && content.length > 0) {
          return content[0].id; // Trả về `hsoId`
        }
        console.warn("Không tìm thấy hồ sơ nào.");
        return null;
      } catch (error) {
        console.error(
          "Lỗi khi lấy dữ liệu hồ sơ:",
          error.response?.data || error.message
        );
        return null;
      }
    },

    async endProcess(hsoId, code) {
      const url =
        "https://apiigate.gialai.gov.vn/pa/dossier/--force-end-process";
      const requestBody = [
        {
          id: hsoId,
          code: code.trim(),
        },
      ];

      try {
        const response = await axios.put(url, requestBody, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Kết thúc thành công:", response.data);
        return true;
      } catch (error) {
        console.error(
          "Lỗi khi kết thúc hồ sơ:",
          error.response?.data || error.message
        );
        return false;
      }
    },

    async getCoordinates(address) {
      // let simplifiedAddress = this.simplifyAddress(address);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: address,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data.length > 0) {
          return { lat: response.data[0].lat, lon: response.data[0].lon };
        } else {
          return await this.findNearby(address);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return "Không tìm thấy";
      }
    },

    async findNearby(address) {
      const simplifiedAddress = this.simplifyAddress(address);

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: simplifiedAddress,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data.length > 0) {
          return { lat: response.data[0].lat, lon: response.data[0].lon };
        } else {
          return "Không tìm thấy";
        }
      } catch (error) {
        console.error("Error fetching nearby coordinates:", error);
        return "Không tìm thấy";
      }
    },

    simplifyAddress(address) {
      const replacements = [
        { find: "\\bTP\\.?\\s*\\b", replace: "Thành phố " },
        { find: "\\bTp\\.?\\s*\\b", replace: "Thành phố " },
        { find: "\\bp\\.\\s*\\b", replace: "Phường " },
        { find: "\\bP\\.\\s*\\b", replace: "Phường " },
        { find: "\\bQ\\.\\s*\\b", replace: "Quận " },
        { find: "\\bH\\.\\s*\\b", replace: "Huyện " },
        { find: "\\bh\\.\\s*\\b", replace: "Huyện " },
        // { find: "\\bT\\.\\s*\\b", replace: "Tổ " },
        { find: "\\bHẻm\\b", replace: "" },
      ];

      let simplifiedAddress = address;

      // Sử dụng biểu thức chính quy để thay thế chính xác
      replacements.forEach((item) => {
        simplifiedAddress = simplifiedAddress.replace(
          new RegExp(item.find, "gi"),
          item.replace
        );
      });

      return simplifiedAddress;
    },

    downloadProcessedFile() {
      const wsData = [
        ["STT", "Mã hồ sơ", "Trạng thái"],
        ...this.processedAddresses.map((item, index) => [
          index + 1,
          item.address,
          item.coordinates,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Processed Addresses");

      XLSX.writeFile(wb, "Processed_Addresses.xlsx");
    },

    downloadProcessedFile2() {
      const wsData = [
        ["STT", "Mã hồ sơ", "Kết quả", "Thông báo"],
        ...this.processedAddresses.map((item, index) => [
          index + 1,
          item.address,
          item.coordinates?.success ? "Thành công" : "Thất bại",
          item.coordinates?.message ?? "",
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "LLTP");

      XLSX.writeFile(wb, "Dong_bo_LLTP.xlsx");
    },
  },
};
</script>

<style scoped>
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
