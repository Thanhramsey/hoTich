<template>
  <v-container>
    <!-- Textarea để nhập token -->
    <v-textarea label="Token" v-model="token" outlined></v-textarea>

    <!-- Textfield nhập code -->
    <v-row>
      <v-col>
        <!-- Textfield nhập processId -->
        <v-text-field
          label="Process ID"
          v-model="processId"
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Code" v-model="code" outlined></v-text-field>
      </v-col>
      <!-- Textfield nhập name -->
      <v-col>
        <v-text-field label="Name" v-model="name" outlined></v-text-field>
      </v-col>
      <!-- Textfield nhập tiền tố -->
      <v-col>
        <v-text-field label="Tiền tố" v-model="prefix" outlined></v-text-field>
      </v-col>
    </v-row>
    <!-- Nút gọi API -->
    <v-row>
      <v-col>
        <label>Chọn văn phòng đăng ký đất đai</label>
        <select
          placeholder="Chọn văn phòng"
          v-model="selectedItem"
          style="
            height: 40px;
            font-weight: bold;
            width: auto;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #bbbbbb !important;
            border-radius: 4px;
            box-sizing: border-box;
          "
        >
          <option value="" disabled>Chọn văn phòng đăng ký đất đai</option>
          <option v-for="item in donvis" :key="item.key" :value="item.key">
            {{ item.value }}
          </option>
        </select>
      </v-col>
      <v-col>
        <v-btn
          @click="cloneProcess"
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
            background-color: rgb(38, 113, 184) !important;
          "
          >Clone Quy Trình</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  created() {},
  data() {
    return {
      token: "", // Biến chứa token từ textarea
      processId: "", // Biến chứa processId từ textfield
      code: "", // Biến chứa code từ textfield
      name: "", // Biến chứa name từ textfield
      prefix: "", // Biến chứa tiền tố
      processCloneId: "",
      definedTask: "",
      processDefinition: "",
      selectedItem: null,
      search: "",
      loading: false,
      donvis: [
        {
          key: "6635a42e2f006c34b683c31a",
          value: "Bộ phận tiếp nhận văn phòng đăng ký đất đai tỉnh Gia lai.",
        },
        {
          key: "6635a42e2f006c34b683c2fc",
          value: "Chi nhánh Văn phòng Đăng ký đất đai  thị xã An Khê",
        },
        {
          key: "6635a42e2f006c34b683c2fa",
          value: "Chi nhánh Văn phòng Đăng ký đất đai  thị xã Ayun Pa",
        },
        {
          key: "6635a42e2f006c34b683c2f8",
          value: "Chi nhánh Văn phòng Đăng ký đất đai TP Pleiku",
        },
        {
          key: "6635a42e2f006c34b683c302",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Prông",
        },
        {
          key: "6635a42e2f006c34b683c316",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Păh",
        },
        {
          key: "6635a42e2f006c34b683c300",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Pưh",
        },
        {
          key: "6635a42e2f006c34b683c2fe",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Chư Sê",
        },
        {
          key: "6635a42e2f006c34b683c314",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Ia Grai",
        },
        {
          key: "6635a42e2f006c34b683c308",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Ia Pa",
        },
        {
          key: "6635a42e2f006c34b683c318",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện KBang",
        },
        {
          key: "6635a42e2f006c34b683c306",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Krông Pa",
        },
        {
          key: "6635a42e2f006c34b683c310",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Kông Chro",
        },
        {
          key: "6635a42e2f006c34b683c30e",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Mang Yang",
        },
        {
          key: "6635a42e2f006c34b683c304",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Phú Thiện",
        },
        {
          key: "6635a42e2f006c34b683c30c",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Đak Pơ",
        },
        {
          key: "6635a42e2f006c34b683c30a",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Đak Đoa",
        },
        {
          key: "6635a42e2f006c34b683c312",
          value: "Chi nhánh Văn phòng Đăng ký đất đai huyện Đức Cơ",
        },
        {
          key: "6635f778ce635e4fa0955abb",
          value: "Chuyên viên văn phòng đăng ký đất đai tỉnh Gia Lai",
        },
        {
          key: "6635ef572f006c34b683c37c",
          value: "Lãnh đạo văn phòng đăng ký đất đai tỉnh Gia Lai",
        },
      ],
    };
  },
  methods: {
    async cloneProcess() {
      try {
        // Gọi API clone quy trình
        await axios
          .post(
            "https://apiigate.gialai.gov.vn/bpm/process-definition/--clone-process",
            {
              processId: this.processId,
              code: this.code,
              name: this.prefix + this.name, // Nối tiền tố với name
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
              },
            }
          )
          .then((response) => {
            this.processCloneId = response.data.id;

            // Gọi API thứ hai, sử dụng id từ API đầu tiên
            const apiUrl = `https://apiigate.gialai.gov.vn/bpm/process-definition/${this.processCloneId}`;

            return axios.get(apiUrl, {
              headers: {
                Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
              },
            });
          })
          .then((response) => {
            this.processDefinition = response.data;
            this.definedTask = response.data.definedTask;
            this.definedTask.forEach((task) => {
              const taskDefinitionKey = task.id; // Lấy task-definition-key từ từng task

              // Gọi API thứ hai với process-definition-id và task-definition-key
              const apiUrl = `https://apiigate.gialai.gov.vn/bpm/process-definition-task/--find-by-activiti-task?process-definition-id=${this.processCloneId}&task-definition-key=${taskDefinitionKey}`;

              axios
                .get(apiUrl, {
                  headers: {
                    Authorization: `Bearer ${this.token}`, // Đính kèm token vào header
                  },
                })
                .then((taskResponse) => {
                  const originalJson = taskResponse.data;
                  const transformedJson = {
                    name: originalJson.name,
                    remind: originalJson.remind,
                    processingTime: originalJson.processingTime,
                    processingTimeUnit: originalJson.processingTimeUnit,
                    position: null,
                    assignee: originalJson.assignee,
                    isFirst: originalJson.isFirst,
                    isLast: originalJson.isLast,
                    description: originalJson.description,
                    totalDayProcessAgency:
                      originalJson.dynamicVariable?.totalDayProcessAgency || "",
                    dayProcessAgencyUnit:
                      originalJson.dynamicVariable?.dayProcessAgencyUnit || "d",
                    processBranch: "",
                    variable: {
                      processComments: originalJson.variable.processComments,
                      canPaused: originalJson.variable.canPaused,
                      canPrintDossiersCostReport:
                        originalJson.variable.canPrintDossiersCostReport,
                      canUploadResult: originalJson.variable.canUploadResult,
                      canIncreaseDue: originalJson.variable.canIncreaseDue,
                      canUseDigitalSign:
                        originalJson.variable.canUseDigitalSign,
                      canUseDigitalSignSmartCA:
                        originalJson.variable.canUseDigitalSignSmartCA,
                      canUseDigitalSignVGCA:
                        originalJson.variable.canUseDigitalSignVGCA,
                      canUseDigitalSignVNPTCA:
                        originalJson.variable.canUseDigitalSignVNPTCA,
                      canUseDigitalSignNEAC:
                        originalJson.variable.canUseDigitalSignNEAC,
                      canUseDigitalSignQNM:
                        originalJson.variable.canUseDigitalSignQNM,
                      canUpdateDossierComp:
                        originalJson.variable.canUpdateDossierComp,
                      canUpdateApplicant:
                        originalJson.variable.canUpdateApplicant,
                      canCancelDosssier:
                        originalJson.variable.canCancelDosssier,
                      canChoiceNextStep:
                        originalJson.variable.canChoiceNextStep,
                      canUpdateDosssierDetail:
                        originalJson.variable.canUpdateDosssierDetail,
                      canResendDossierToPriviousStep:
                        originalJson.variable.canResendDossierToPriviousStep,
                      canDeleteDossier: originalJson.variable.canDeleteDossier,
                      canPrintReceiptTicket:
                        originalJson.variable.canPrintReceiptTicket,
                      canEvictDossier: originalJson.variable.canEvictDossier,
                      canConfirmDossierPaper:
                        originalJson.variable.canConfirmDossierPaper,
                      canSendDocument: originalJson.variable.canSendDocument,
                      canConnectedIOffice:
                        originalJson.variable.canConnectedIOffice,
                      canConnectedQLVB: originalJson.variable.canConnectedQLVB,
                      canConnectedIOfficeV4:
                        originalJson.variable.canConnectedIOfficeV4,
                      canSyncLicenseBXD:
                        originalJson.variable.canSyncLicenseBXD,
                      mustRatingOfficials:
                        originalJson.variable.mustRatingOfficials,
                      mustPublishInvoice:
                        originalJson.variable.mustPublishInvoice,
                      mustChooseAssignee:
                        originalJson.variable.mustChooseAssignee,
                      mustSendSMSToApplicant:
                        originalJson.variable.mustSendSMSToApplicant,
                      mustAttachResultsFile:
                        originalJson.variable.mustAttachResultsFile,
                      mustConfirm: originalJson.variable.mustConfirm,
                      mustSignTypeOrg: originalJson.variable.mustSignTypeOrg,
                      requireSaveIstorage:
                        originalJson.variable.requireSaveIstorage,
                      mustConstraintDigitalSignatureFileResults:
                        originalJson.variable
                          .mustConstraintDigitalSignatureFileResults,
                      officerSMSTemplate:
                        originalJson.variable.officerSMSTemplate,
                      officerSMSTemplateId: "",
                      officerSMSDefaultSend:
                        originalJson.variable.officerSMSTemplate?.defaultSend ||
                        false,
                      officerEmailTemplate:
                        originalJson.variable.officerEmailTemplate,
                      officerEmailDefaultSend:
                        originalJson.variable.officerEmailTemplate
                          ?.defaultSend || false,
                      officerZaloTemplate:
                        originalJson.variable.officerZaloTemplate,
                      officerZaloDefaultSend:
                        originalJson.variable.officerZaloTemplate
                          ?.defaultSend || false,
                      citizenSMSTemplate:
                        originalJson.variable.citizenSMSTemplate,
                      citizenSMSTemplateId: "",
                      citizenSMSDefaultSend:
                        originalJson.variable.citizenSMSTemplate?.defaultSend ||
                        false,
                      citizenEmailTemplate:
                        originalJson.variable.citizenEmailTemplate,
                      citizenEmailDefaultSend:
                        originalJson.variable.citizenEmailTemplate
                          ?.defaultSend || false,
                      citizenZaloTemplate:
                        originalJson.variable.citizenZaloTemplate,
                      citizenZaloDefaultSend:
                        originalJson.variable.citizenZaloTemplate
                          ?.defaultSend || false,
                      form: null,
                      deadlineForAdditionalRequests: false,
                      printReceiptPaper: false,
                      sampleReceiptPaper: [],
                      attachResultFileToEmail: false,
                      dossierReselectAgencyProcessing: false,
                    },
                    dynamicVariable: JSON.stringify(
                      originalJson.dynamicVariable
                    ),
                    activiti: originalJson.activiti,
                    candidateGroup: originalJson.candidateGroup,
                    processDefinition: this.processDefinition,
                  };

                  console.log(transformedJson);
                })
                .catch((error) =>
                  console.error(`Error for task ${taskDefinitionKey}:`, error)
                );
            });
          });
      } catch (error) {
        console.error("Error cloning process:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
