document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM loaded, JS running");

  // --- Canvas setup ---
  const canvas = new fabric.Canvas("canvas", { backgroundColor: "transparent" });

  // --- Element references ---
  const textInput = document.getElementById("textInput");
  const textColor = document.getElementById("textColor");
  const thinOutlineColor = document.getElementById("thinOutlineColor");
  const thickOutlineColor = document.getElementById("thickOutlineColor");
  const shadowToggle = document.getElementById("shadowToggle");
  const shadowColor = document.getElementById("shadowColor");
  const shadowBlur = document.getElementById("shadowBlur");
  const shadowX = document.getElementById("shadowX");
  const shadowY = document.getElementById("shadowY");
  const fontUpload = document.getElementById("fontUpload");
  const exportPNG = document.getElementById("exportPNG");
  const fontSelect = document.getElementById("fontSelect");

  // --- Default fonts ---
  const fonts = ["Arial","Georgia","Verdana","Impact","system-ui","-apple-system"];
  fonts.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    fontSelect.appendChild(opt);
  });

  // --- Shadow helper ---
  function getShadow() {
    if (!shadowToggle.checked) return null;
    return new fabric.Shadow({
      color: shadowColor.value,
      blur: +shadowBlur.value,
      offsetX: +shadowX.value,
      offsetY: +shadowY.value
    });
  }

  // --- Main update function ---
  function updateSticker() {
    const text = textInput.value;
    if (!text) return; // skip if empty
    canvas.clear();

    // Thick outline in back
    const outline = new fabric.Text(text, {
      fontFamily: fontSelect.value,
      fontSize: 120,
