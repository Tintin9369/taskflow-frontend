// ===============================
// TaskFlow - taskModal.js
// ===============================

export function openModal() {
console.log("j'execute openModal")
  document.querySelector(".modal-backdrop").classList.remove("hidden");
}

export function closeModal() {
  document.querySelector(".modal-backdrop").classList.add("hidden");
}
