<template>
  <div class="p-4">
    <h2>Điều dưỡng</h2>

    <div class="mb-4">
      <button @click="startTour" class="btn">▶ Bắt đầu hướng dẫn</button>
      <button @click="showStep('step3')" class="btn ml">👀 Xem bước 3</button>
      <button @click="showStep('step5')" class="btn ml">👀 Xem bước 5</button>
    </div>

    <div id="step1" class="box">1️⃣ Nút phiếu điều trị</div>
    <div id="step2" class="box">2️⃣ Nhập diễn biến</div>
    <div id="step3" class="box">3️⃣ Nhấn Lưu</div>
    <div id="step4" class="box">4️⃣ Tạo đơn thuốc</div>
    <div id="step5" class="box">5️⃣ Ký số</div>
  </div>
</template>

<script>
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export default {
  name: "GuideDemo",
  data() {
    return {
      tour: null,
    };
  },
  mounted() {
    // Tạo tour ngay khi component load
    this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: true,
        classes: "shepherd-theme-arrows",
      },
    });

    // Các bước
    this.tour.addStep({
      id: "step1",
      text: "👉 <b>Bước 1:</b> Chọn nút phiếu điều trị",
      attachTo: { element: "#step1", on: "bottom" },
      buttons: [{ text: "Tiếp", action: () => this.tour.next() }],
    });

    this.tour.addStep({
      id: "step2",
      text: "✍ <b>Bước 2:</b> Nhập thông tin diễn biến",
      attachTo: { element: "#step2", on: "bottom" },
      buttons: [
        { text: "Quay lại", action: () => this.tour.back() },
        { text: "Tiếp", action: () => this.tour.next() },
      ],
    });

    this.tour.addStep({
      id: "step3",
      text: "💾 <b>Bước 3:</b> Nhấn Lưu để lưu phiếu điều trị",
      attachTo: { element: "#step3", on: "top" },
      buttons: [
        { text: "Quay lại", action: () => this.tour.back() },
        { text: "Tiếp", action: () => this.tour.next() },
      ],
    });

    this.tour.addStep({
      id: "step4",
      text: '<b>Bước 4:</b> Tạo đơn thuốc <br><img src="https://placehold.co/200x100" style="max-width:200px"/>',
      attachTo: { element: "#step4", on: "top" },
      buttons: [
        { text: "Quay lại", action: () => this.tour.back() },
        { text: "Tiếp", action: () => this.tour.next() },
      ],
    });

    this.tour.addStep({
      id: "step5",
      text: "✅ <b>Bước 5:</b> Ký số để hoàn tất",
      attachTo: { element: "#step5", on: "top" },
      buttons: [
        { text: "Quay lại", action: () => this.tour.back() },
        { text: "Hoàn tất", action: () => this.tour.complete() },
      ],
    });
  },
  methods: {
    startTour() {
      this.tour.start();
    },
    showStep(id) {
      if (!this.tour.isActive()) {
        this.tour.start();
      }
      this.tour.show(id);
    },
  },
};
</script>

<style scoped>
.p-4 {
  padding: 20px;
  font-family: sans-serif;
}

.mb-4 {
  margin-bottom: 20px;
}

.btn {
  padding: 6px 12px;
  background: #3d70ef;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.ml {
  margin-left: 10px;
}

.box {
  padding: 16px;
  margin-bottom: 10px;
  background: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
