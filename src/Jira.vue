<template>
  <v-container>
    <h1>Quản lý Task Jira</h1>
    <v-row align="center" class="my-4">
      <v-col cols="12" sm="2">
        <v-menu
          v-model="menuFrom"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="tuNgay"
              label="Từ ngày"
              readonly
              dense
              outlined
              v-bind="attrs"
              v-on="on"
              @keyup.enter="timKiem"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="tuNgay"
            @input="menu1 = false"
            locale="vi"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" sm="2">
        <v-menu
          v-model="menuTo"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="denNgay"
              label="Đến ngày"
              readonly
              dense
              outlined
              v-bind="attrs"
              v-on="on"
              @keyup.enter="timKiem"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="denNgay"
            @input="menu2 = false"
            locale="vi"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" sm="2">
        <v-text-field
          v-model="nguoiTao"
          label="Người tạo"
          dense
          outlined
          @keyup.enter="timKiem"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="assignee"
          label="Người xử lý"
          dense
          outlined
          @keyup.enter="timKiem"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field
          v-model="issuekey"
          label="Mã Task"
          dense
          outlined
          @keyup.enter="timKiem"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="2">
        <v-btn
          color="primary"
          class="search-btn"
          block
          depressed
          @click="timKiem"
        >
          TÌM KIẾM
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :items-per-page="options.itemsPerPage"
      :options.sync="options"
      :loading="loading"
      item-value="issuekey"
      class="elevation-2 custom-group-table"
      hide-default-footer
      dense
    >
      <!-- Loading Overlay -->
      <template v-slot:loading>
        <v-sheet class="pa-3 text-center" color="transparent" elevation="0">
          <v-progress-circular
            indeterminate
            color="primary"
            size="40"
          ></v-progress-circular>
        </v-sheet>
      </template>

      <!-- Tùy chỉnh hàng -->
      <template v-slot:item="{ item, index }">
        <tr :class="index % 2 === 0 ? 'bg-light-blue' : ''">
          <td>{{ item.issuekey }}</td>
          <td>{{ item.summary }}</td>
          <td>{{ item.creator }}</td>
          <td>{{ item.assignee }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.created }}</td>
          <td>{{ item.updated }}</td>
          <td>
            <v-btn color="primary" @click="openDialog(item)"> Xem CT </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Footer phân trang -->
    <div class="d-flex justify-end align-center mt-4 flex-wrap gap-4">
      <!-- Pagination -->
      <v-pagination
        v-model="options.page"
        :length="
          Math.ceil(
            total / (options.itemsPerPage === -1 ? total : options.itemsPerPage)
          )
        "
        color="primary"
      ></v-pagination>

      <!-- Select số dòng -->
      <v-select
        v-model="options.itemsPerPage"
        :items="[10, 20, 50, 100, 200, { text: 'Tất cả', value: -1 }]"
        label="Dòng / trang"
        dense
        hide-details
        outlined
        style="max-width: 140px"
      ></v-select>
    </div>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      top
      right
    >
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title
          class="headline font-weight-bold"
          style="background-color: #1976d2"
          >📌 Chi tiết Task</v-card-title
        >
        <v-card-text>
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" sm="6">
                <strong>🔑 Issue Key:</strong> {{ selectedTask.issuekey }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>📝 Summary:</strong> {{ selectedTask.summary }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>👤 Người tạo:</strong> {{ selectedTask.creator }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>📅 Ngày tạo:</strong> {{ selectedTask.created }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>👥 Người xử lý:</strong> {{ selectedTask.assignee }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>📆 Due Date:</strong> {{ selectedTask.duedate }}
              </v-col>
              <v-col cols="12">
                <strong>🧾 Nội dung:</strong>
                <div class="mt-1" style="white-space: pre-line">
                  {{ selectedTask.description }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <strong>📌 Trạng thái:</strong> {{ selectedTask.status }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>🏢 Đơn vị nhập:</strong> {{ selectedTask.donViNhap }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>🔢 Mã SPDA:</strong>
                {{ selectedTask.customfield_13100.value }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>📁 Nhóm DV:</strong>
                {{ selectedTask.customfield_10328.value }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>⚙️ Công đoạn:</strong>
                {{ selectedTask.customfield_13000.value }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>📂 Loại SPDA:</strong>
                {{ selectedTask.customfield_14100.value }}
              </v-col>
              <v-col cols="12" sm="6">
                <strong>🏢 Đơn vị xử lý chính:</strong>
                {{ selectedTask.customfield_10349.value }}
              </v-col>
              <v-col
                cols="12"
                sm="6"
                :class="{
                  'text-red':
                    selectedTask.olaNhapYc &&
                    selectedTask.olaNhapYc.startsWith('-'),
                }"
              >
                <strong>📅 OLA:</strong>
                {{ selectedTask.olaNhapYc }}
              </v-col>
              <v-col
                cols="12"
                sm="6"
                :class="{
                  'text-red':
                    selectedTask.slaNhapYc &&
                    selectedTask.slaNhapYc.startsWith('-'),
                }"
              >
                <strong>📅 SLA:</strong>
                {{ selectedTask.slaNhapYc }}
              </v-col>
              <v-col cols="12">
                <strong>🔗 URL:</strong>
                <a
                  :href="`https://cntt.vnpt.vn/browse/${selectedTask.issuekey}`"
                  target="_blank"
                  class="text-primary font-weight-medium"
                >
                  https://cntt.vnpt.vn/browse/{{ selectedTask.issuekey }}
                </a>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog">ĐÓNG</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    return {
      tuNgay: firstDay,
      denNgay: today,
      menuFrom: false,
      menuTo: false,
      dialog: false, // Biến điều khiển việc hiển thị dialog
      selectedTask: {
        summary: "",
        creator: "",
        created: "",
        duedate: "",
        assignee: "",
        updated: "",
        status: "",
        issuekey: "",
        donViNhap: "",
        description: "",
        customfield_13100: {
          value: "",
          child: { value: "" },
        },
        customfield_13000: { value: "" },
        customfield_14100: { value: "" },
        customfield_10349: { value: "" },
        customfield_10328: {
          value: "",
          child: { value: "" },
        },
        customfield_10901: { value: "" },
        customfield_10329: { value: "" },
        olaNhapYc: "",
        slaNhapYc: "",
      }, // Lưu thông tin của dòng được chọn
      tasks: [],
      snackbar: false,
      snackbarText: "",
      snackbarColor: "error",
      headers: [
        { text: "Issue Key", value: "issuekey" },
        { text: "Tóm tắt", value: "summary" },
        { text: "Người tạo", value: "creator" },
        { text: "Người xử lý", value: "assignee" },
        { text: "Trạng thái", value: "status" },
        { text: "Ngày tạo", value: "created" },
        { text: "Ngày cập nhật", value: "updated" },
        { text: "Chi tiết", value: "" },
      ],
      total: 0,
      options: {
        page: 1,
        itemsPerPage: 100,
      },
      loading: false,
      nguoiTao: "",
      assignee: "",
      issuekey: "",
    };
  },
  watch: {
    options: {
      handler() {
        this.timKiem();
      },
      deep: true,
    },
  },
  methods: {
    openDialog(item) {
      const normalized = this.normalizeTaskData(item);
      normalized.olaNhapYc = this.extractOlaNhapYc(item.customfield_10352); // tính OLA
      normalized.slaNhapYc = this.extractOlaNhapYc(item.customfield_10901);
      this.selectedTask = normalized;
      console.log(this.selectedTask);
      this.dialog = true;
    },
    extractOlaNhapYc(customfield_10352) {
      let olaNhapYc = "";

      if (
        customfield_10352 &&
        Array.isArray(customfield_10352.completedCycles)
      ) {
        const firstCycle = customfield_10352.completedCycles[0];
        const remainingTimeObj = firstCycle?.remainingTime;

        if (remainingTimeObj && typeof remainingTimeObj.friendly === "string") {
          let friendly = remainingTimeObj.friendly;

          if (friendly.includes("h") && friendly.includes("m")) {
            // Ví dụ: "1h 30m" -> "1:30"
            olaNhapYc = friendly.replace("h ", ":").replace("m", "");
          } else if (friendly.endsWith("m")) {
            // Ví dụ: "90m" -> "01:30"
            const minutesStr = friendly.slice(0, -1); // loại bỏ 'm'
            const minutes = parseInt(minutesStr);

            if (!isNaN(minutes)) {
              if (minutes < 0) {
                olaNhapYc = `-${String(
                  Math.floor(Math.abs(minutes) / 60)
                ).padStart(2, "0")}:${String(Math.abs(minutes % 60)).padStart(
                  2,
                  "0"
                )}`;
              } else {
                olaNhapYc = `${String(Math.floor(minutes / 60)).padStart(
                  2,
                  "0"
                )}:${String(minutes % 60).padStart(2, "0")}`;
              }
            } else {
              olaNhapYc = friendly; // giữ nguyên nếu không phải số
            }
          } else {
            olaNhapYc = friendly; // giữ nguyên nếu không theo định dạng
          }
        }
      }

      return olaNhapYc;
    },
    // Đóng dialog
    closeDialog() {
      this.dialog = false;
      this.resetTask();
    },
    normalizeTaskData(task) {
      return {
        issuekey: task.issuekey || "",
        summary: task.summary || "",
        creator: task.creator || "",
        created: task.created || "",
        assignee: task.assignee || "",
        duedate: task.duedate || "",
        updated: task.updated || "",
        description: task.description || "",
        status: task.status || "",
        donViNhap: task.donViNhap || "",

        customfield_13100: {
          value: task.customfield_13100?.value || "",
          child: {
            value: task.customfield_13100?.child?.value || "",
          },
        },
        customfield_10328: {
          value: task.customfield_10328?.value || "",
          child: {
            value: task.customfield_10328?.child?.value || "",
          },
        },
        customfield_13000: {
          value: task.customfield_13000?.value || "",
        },
        customfield_14100: {
          value: task.customfield_14100?.value || "",
        },
        customfield_10349: {
          value: task.customfield_10349?.value || "",
        },
        customfield_10329: {
          value: task.customfield_10329?.value || "",
        },
      };
    },

    resetTask() {
      this.selectedTask = {
        summary: "",
        creator: "",
        created: "",
        duedate: "",
        assignee: "",
        updated: "",
        status: "",
        issuekey: "",
        donViNhap: "",
        description: "",
        customfield_13100: {
          value: "",
          child: { value: "" },
        },
        customfield_13000: { value: "" },
        customfield_14100: { value: "" },
        customfield_10349: { value: "" },
        customfield_10328: {
          value: "",
          child: { value: "" },
        },
        customfield_10901: { value: "" },
        customfield_10329: { value: "" },
      };
    },
    async timKiem() {
      if (this.nguoiTao && this.assignee) {
        this.snackbarText =
          "Vui lòng chỉ nhập 'Người tạo' hoặc 'Người xử lý', không được nhập cả hai.";
        this.snackbarColor = "error";
        this.snackbar = true;
        this.loading = false;
        return;
      }
      this.loading = true;
      const from = this.tuNgay;
      const to = this.denNgay;
      const maxResults = 100;
      let startAt = 0;
      let allIssues = [];

      try {
        while (true) {
          const url = `https://10.54.33.4/bsc/api/jira/jira-data?fromDate=${from}&toDate=${to}&startAt=${startAt}&maxResults=${maxResults}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) throw new Error("Lỗi khi gọi API");

          const data = await response.json();
          allIssues = allIssues.concat(data.issues);

          if (startAt + maxResults >= data.total) {
            break;
          }

          startAt += maxResults;
        }

        // Chỉ lọc theo một trong hai: người tạo hoặc người xử lý
        const filteredIssues = allIssues.filter((issue) => {
          const creator =
            issue.fields?.creator?.displayName?.toLowerCase() || "";
          const handler =
            issue.fields?.assignee?.displayName?.toLowerCase() || "";
          const nguoiTaoInput = this.nguoiTao?.trim().toLowerCase();
          const assigneeInput = this.assignee?.trim().toLowerCase();
          const issuekeyInput = this.issuekey?.trim().toLowerCase();

          if (issuekeyInput) {
            return issue.key.toLowerCase().includes(issuekeyInput);
          } else if (nguoiTaoInput) {
            return creator.includes(nguoiTaoInput);
          } else if (assigneeInput) {
            return handler.includes(assigneeInput);
          }

          return true; // Không lọc nếu cả hai đều rỗng
        });

        this.tasks = filteredIssues.map((issue, idx) => {
          const fields = issue.fields || {};
          const createdDate = fields.created
            ? new Date(fields.created).toISOString().slice(0, 10)
            : "";

          const updatedDate = fields.created
            ? new Date(fields.updated).toISOString().slice(0, 10)
            : "";

          return {
            ...fields,
            issuekey: issue.key,
            index: idx + 1,
            donViNhap: fields.customfield_10329?.value || "Không rõ",
            creator: fields.creator.displayName,
            assignee: fields.assignee.displayName,
            status: fields.status.name,
            created: createdDate,
            updated: updatedDate,
          };
        });

        this.total = filteredIssues.length;
        this.loading = false;
      } catch (error) {
        console.error("Lỗi gọi API Jira:", error);
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.search-btn {
  margin-top: -28px !important;
}
/* .v-icon--link {
  display: none !important;
} */
.custom-group-table th[aria-colindex="1"], /* Nhắm mục tiêu đến cột đầu tiên (cột group) trong header */
.custom-group-table td:nth-child(1) {
  /* Nhắm mục tiêu đến cột đầu tiên (cột group) trong body */
  min-width: 300px; /* Đặt chiều rộng tối thiểu mong muốn */
  width: auto !important; /* Cho phép cột tự động điều chỉnh nếu nội dung lớn hơn */
}

.custom-group-header-cell {
  min-width: 350px; /* Đặt chiều rộng tối thiểu cho ô header group */
  width: auto !important;
}
.custom-group-table th > span:last-child {
  display: none !important;
}
.bg-light-blue {
  background-color: #f0f8ff;
}
.custom-group-table th,
.custom-group-table td {
  padding: 10px !important;
  font-size: 14px;
}
.custom-group-table th {
  background-color: #1976d2;
  font-weight: bold;
}

.custom-group-table th span {
  color: #ffffff;
}
.v-data-table-header th {
  border-bottom: none !important;
}
.text-red {
  color: red;
  font-weight: bold;
}
</style>
