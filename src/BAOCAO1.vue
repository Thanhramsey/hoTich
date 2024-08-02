<template>
  <div>
    <section>
      <section class="mb-5">
        <h2 class="mb-5">Get Token</h2>
      </section>
      <hr class="mb-5" />
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
    <button @click="getToken">Get Token</button>
     <p v-if="token">Token: {{ token }}</p>
    </section>

    <section>
      <section class="mb-5">
        <h2 class="mb-5">Get TT Hồ sơ</h2>
        <div>
          <label for="igateToken">igateToken:</label>
          <textarea  class="textarea" type="text" id="igateToken" v-model="igateToken" required />
        </div>
        <div>
          <label for="hsoId">ID hồ sơ:</label>
          <input type="text" id="hsoId" v-model="hsoId" required />
        </div>         
        <p v-if="eformData">eformData: {{ eformData }}</p>
        <button @click="fetchData">Get TT Hồ sơ</button>
      </section>
      <section class="mt-5">
          <h2 class="mb-5">Đẩy qua hộ tịch</h2>
           <button @click="pushHoTich">Đẩy qua hộ tịch</button>

            <p v-if="responseHT">responseHT: {{ responseHT }}</p>
      </section>
    </section>
  </div>
</template>

<script>

import axios from 'axios';
import { jsonToXml } from './jsonToXml.js';

export default {
  components: {
  },
  watch: {
    
  },
  data() {
    return {
      username: 'imsqeSUzd7YRbvAoAoZvKkOPx0Ia',
      password: 'YcJE_MIA9Wo9Vijr8lz8vUQJde8a',
      token: '',
      hsoId: "",
      igateToken:"",
      eformData:"",
      requestBody: {
        maDonVi: '',
        module: '',
        maHoSo: '',
        ngayTiepNhan: '',
        data: ''
      },
      responseHT:""
    };
  },
  methods: {
    

   async getToken() {
      const tokenUrl = '/api/token'; // Sử dụng proxy
      const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
      
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');

      try {
        const response = await axios.post(tokenUrl, data, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.log('Token:', response.data);
        this.token = response.data.access_token; 
      } catch (error) {
        if (error.response) {
          // Máy chủ đã phản hồi với mã trạng thái nằm ngoài phạm vi 2xx
          console.error('Dữ liệu phản hồi lỗi:', error.response.data);
          console.error('Trạng thái phản hồi lỗi:', error.response.status);
          console.error('Header phản hồi lỗi:', error.response.headers);
        } else if (error.request) {
          // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
          console.error('Yêu cầu lỗi:', error.request);
        } else {
          // Một lỗi đã xảy ra trong quá trình thiết lập yêu cầu
          console.error('Thông báo lỗi:', error.message);
        }
        console.error('Cấu hình lỗi:', error.config);
      }
    }, 
    async fetchData() {
     
      const url = `https://apiigate.gialai.gov.vn/pa/dossier/${this.hsoId}/--online`;

      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${this.igateToken}`
          }
        });
        // Lưu dữ liệu vào biến data        
        console.log('Data:',  response.data);
        this.requestBody.maDonVi = response.data.eForm.data.noiDangKy;
        const date = new Date(response.data.acceptedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cộng 1 để có tháng chính xác
        const day = String(date.getDate()).padStart(2, '0');

        this.requestBody.ngayTiepNhan = `${year}-${month}-${day}`;
        this.requestBody.module = response.data.eForm.data.loaiHTTP;      
        this.requestBody.maHoSo = response.data.code;
        this.eformData = response.data.eForm.data; 
        let innerXML = jsonToXml(this.eformData);
        this.requestBody.data = `<hotich><hoso>${innerXML}</hoso></hotich>`;
        this.responseHT = "";
      } catch (error) {
        if (error.response) {
          console.error('Dữ liệu phản hồi lỗi:', error.response.data);
          console.error('Trạng thái phản hồi lỗi:', error.response.status);
        } else if (error.request) {
          console.error('Yêu cầu lỗi:', error.request);
        } else {
          console.error('Thông báo lỗi:', error.message);
        }
      }
    },
      async pushHoTich() {
      const url = 'https://congdichvu.gialai.gov.vn:443/hotich/1.0/dangKyHoTich';          
      console.log(this.requestBody);
        try {
          const response = await axios.post(url, this.requestBody, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json' // Content-Type của body là JSON
            }
          });
          console.log('Response:', response.data);
          this.responseHT = response.data;
        } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
        }
      }


  },
};
</script>

<style>
.textarea {
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

p{
  color: red;
}
</style>
