<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-textarea label="Token" v-model="igateToken" outlined></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Mã đơn vị cha"
            v-model="maDonvi"
            outlined
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn
            @click="getDanhSachTK"
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
            >Get list Id</v-btn
          >
          <v-btn
            @click="deleteUser"
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
            >xÓA Id</v-btn
          >
          <v-btn
            @click="taoUser2"
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
            >Tạo user</v-btn
          >
          <v-btn
            @click="taoUser"
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
            >Tạo user</v-btn
          >
        </v-col>
        <v-col>
          <span>ids: {{ listDonviCon }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import dtiDonvi from "./dtiDonvi.json";
export default {
  name: "CoordinateConverter",
  data() {
    return {
      igateToken: "",
      maDonvi: "",
      listDonviCon: [],
      listAdd: [],
      dtiDonviJson: dtiDonvi,
    };
  },
  methods: {
    async getDanhSachTK() {
      console.log("vo day");
      this.listDonviCon = [];
      const getHsoIdUrl = `https://dti.gialai.gov.vn/ws/api/nhan_vien/get_list?id=${this.maDonvi}`;

      try {
        const getHsIdRes = await axios.get(getHsoIdUrl, {
          headers: {
            Authorization: `Bearer ${this.igateToken}`,
          },
        });
        console.log("getHsIdRes:", getHsIdRes);
        getHsIdRes.data.forEach((element) => {
          this.listDonviCon.push(element.Id);
        });
        console.log("listDonviCon:", this.listDonviCon);
      } catch (error) {
        console.log("error:", error);
      }
    },

    async deleteUser() {
      for (let user of this.listDonviCon) {
        const response = await axios.post(
          "https://dti.gialai.gov.vn/ws/api/nhan_vien/delete",
          {
            Id: user,
          },
          {
            headers: {
              Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
            },
          }
        );
        console.log(response);
      }
    },
    removeVietnameseTones(str) {
      return str
        .normalize("NFD") // Tách các ký tự gốc và dấu
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/đ/g, "d") // Chuyển đ thành d
        .replace(/Đ/g, "D"); // Chuyển Đ thành D
    },

    formatString(input) {
      return this.removeVietnameseTones(input)
        .toLowerCase() // Chuyển tất cả chữ sang chữ thường
        .replace(/[^a-z0-9\s]/g, "") // Loại bỏ các ký tự đặc biệt
        .replace(/\s+/g, ""); // Xóa khoảng trắng
    },

    taoUser2() {
      console.log(this.dtiDonviJson);
      this.listAdd = [];
      this.dtiDonviJson.forEach((item) => {
        if (item.IdCha == this.maDonvi) {
          this.listAdd.push({
            Id: item.Id,
            HoTen: item.Ten,
            TaiKhoan: this.formatString(item.Ten),
            DienThoai: "",
            MatKhau: "Vnpt@123",
            IdCoQuan: item.Id,
            DsIdNhomQuyen: ["5"],
          });
        }
        console.log("item", this.listAdd);
      });
    },
    async taoUser() {
      for (let user of this.listAdd) {
        console.log("user:", user);
        const response = await axios.post(
          "https://dti.gialai.gov.vn/ws/api/nhan_vien/create",
          {
            Id: 0,
            HoTen: user.HoTen,
            TaiKhoan: user.TaiKhoan,
            DienThoai: "",
            MatKhau: "Vnpt@123",
            IdCoQuan: user.Id,
            DsIdNhomQuyen: ["5"],
          },
          {
            headers: {
              Authorization: `Bearer ${this.igateToken}`, // Đính kèm token vào header
            },
          }
        );
        console.log(response);
      }
    },
  },
};
</script>

<style scoped>
.coordinate-converter {
  max-width: 400px;
  margin: auto;
  text-align: left;
}
label {
  display: block;
  margin-top: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  margin-top: 15px;
  padding: 10px 20px;
}
</style>
