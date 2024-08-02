<template>
  <div>
    <section>
      <section class="mb-5">
        <h2 class="mb-5">Get Token(Dùng ở local)</h2>
      </section>
      <hr class="mb-5" />
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required style="width: 100%;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;"/>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required style="width: 100%;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;" />
      </div>
    <button @click="getToken" style="width: 150px;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;background-color: rgb(38, 113, 184) !important;">Get Token</button>
     <p v-if="token">Token: {{ token }}</p>
    </section>

    <section>
      <section class="mb-5">
        <h2 class="mb-5">Get TT Hồ sơ</h2>
        <div>
          <label for="igateToken">gliToken:</label>
          <textarea  class="textarea" type="text" id="igateToken" v-model="token" required style="width: 100%; height: 100px;box-sizing: border-box; border: 1px solid #bbbbbb !important;"></textarea>
        </div>
        <div>
          <label for="igateToken">igateToken:</label>
          <textarea  class="textarea" type="text" id="igateToken" v-model="igateToken" required style="width: 100%; height: 100px;box-sizing: border-box; border: 1px solid #bbbbbb !important;"></textarea>
        </div>
        <div>
          <label for="maHso">Mã hồ sơ:</label>
          <input type="text" id="maHso" v-model="maHso" required style="width: 100%;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;"/>
        </div>         
        <p v-if="eformData" style="color:red;display: none;">eformData: {{ eformData }}</p>
        <button @click="fetchData" style="width: 150px;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;background-color: rgb(38, 113, 184) !important;">Get TT Hồ sơ</button>
      </section>
      <section class="mt-5">
          <h2 class="mb-5">Đẩy qua hộ tịch</h2>
           <button @click="pushHoTich" style="width: 150px;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;background-color: rgb(38, 113, 184) !important;">Đẩy qua hộ tịch</button>
            <p v-if="requestBody" style="color:red">Body gửi đi: {{ requestBody }}</p>
            <p v-if="responseHT" style="color:purple">responseHT: {{ responseHT }}</p>
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
      maHso: "",
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
            "Access-Control-Allow-Origin ":"*",
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

    async getHsoId() {
      const getHsoIdUrl = `https://apiigate.gialai.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=${this.maHso}`;
      
      try {
        const getHsId = await axios.get(getHsoIdUrl, {
          headers: {
            'Authorization': `Bearer ${this.igateToken}`
          }
        });
        console.log("content:", getHsId);
        this.hsoId = getHsId.data.content[0].id;
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

    async getData() {
      const url = `https://apiigate.gialai.gov.vn/pa/dossier/${this.hsoId}/--online`;

      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${this.igateToken}`
          }
        });
        // Lưu dữ liệu vào biến data        
        console.log('Data:', response.data);
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
    
    async fetchData() {
      await this.getHsoId();
      if (this.hsoId) {
        await this.getData();
      }
    },
    // async fetchData() {


    //   const getHsoIdUrl = `https://apiigate.gialai.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=${this.maHso}`;
      
    //   try {
    //     const getHsId= await axios.get(getHsoIdUrl, {
    //       headers: {
    //         'Authorization': `Bearer ${this.igateToken}`
    //       }
    //     });
    //     console.log("content:",getHsId);
    //     this.hsoId = getHsId.data.content[0].id;
    //   } catch (error) {
    //     if (error.response) {
    //       console.error('Dữ liệu phản hồi lỗi:', error.response.data);
    //       console.error('Trạng thái phản hồi lỗi:', error.response.status);
    //     } else if (error.request) {
    //       console.error('Yêu cầu lỗi:', error.request);
    //     } else {
    //       console.error('Thông báo lỗi:', error.message);
    //     }
    //   }

     
    //   const url = `https://apiigate.gialai.gov.vn/pa/dossier/${this.hsoId}/--online`;

    //   try {
    //     const response = await axios.get(url, {
    //       headers: {
    //         'Authorization': `Bearer ${this.igateToken}`
    //       }
    //     });
    //     // Lưu dữ liệu vào biến data        
    //     console.log('Data:',  response.data);
    //     this.requestBody.maDonVi = response.data.eForm.data.noiDangKy;
    //     const date = new Date(response.data.acceptedDate);
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cộng 1 để có tháng chính xác
    //     const day = String(date.getDate()).padStart(2, '0');

    //     this.requestBody.ngayTiepNhan = `${year}-${month}-${day}`;
    //     this.requestBody.module = response.data.eForm.data.loaiHTTP;      
    //     this.requestBody.maHoSo = response.data.code;
    //     this.eformData = response.data.eForm.data; 
    //     let innerXML = jsonToXml(this.eformData);
    //     this.requestBody.data = `<hotich><hoso>${innerXML}</hoso></hotich>`;
    //     this.responseHT = "";

    //   } catch (error) {
    //     if (error.response) {
    //       console.error('Dữ liệu phản hồi lỗi:', error.response.data);
    //       console.error('Trạng thái phản hồi lỗi:', error.response.status);
    //     } else if (error.request) {
    //       console.error('Yêu cầu lỗi:', error.request);
    //     } else {
    //       console.error('Thông báo lỗi:', error.message);
    //     }
    //   }
    // },
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

<style scoped>
textarea {
  width: 100%; /* Chiều rộng 100% của phần tử chứa */
  height: 100px; /* Chiều cao cụ thể */
  box-sizing: border-box; /* Đảm bảo kích thước bao gồm padding và border */
  border: 1px solid #bbbbbb !important;
}

input {
  width: 100%;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;
}

button {
  width: 150px;padding: 10px;margin: 10px 0;border: 1px solid #bbbbbb !important;border-radius: 4px;box-sizing: border-box;font-size: 16px;background-color: rgb(38, 113, 184) !important;
}

p{
  color: red;
}
</style>
