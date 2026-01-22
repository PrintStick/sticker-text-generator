console.log("updateSticker called with text:", textInput.value);

document.addEventListener("DOMContentLoaded", () => {

  const canvas = new fabric.Canvas("canvas", { backgroundColor: "transparent" });
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

  const fonts = ["Arial","Georgia","Verdana","Impact","system-ui","-apple-system"];
  fonts.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    fontSelect.appendChild(opt);
  });

  function getShadow() {
    if (!shadowToggle.checked) return null;
    return new fabric.Shadow({
      color: shadowColor.value,
      blur: +shadowBlur.value,
      offsetX: +shadowX.value,
      offsetY: +shadowY.value
    });
  }

  function updateSticker() {
    const text = textInput.value;
    if (!text) return; // skip empty
    canvas.clear();

    const outline = new fabric.Text(text, {
      fontFamily: fontSelect.value,
      fontSize: 120,
      fill: "transparent",
      stroke: thickOutlineColor.value,
      strokeWidth: 20,
      originX: "center",
      originY: "center"
    });

    const main = new fabric.Text(text, {
      fontFamily: fontSelect.value,
      fontSize: 120,
      fill: textColor.value,
      stroke: thinOutlineColor.value,
      strokeWidth: 4,
      originX: "center",
      originY: "center"
    });

    const sticker = new fabric.Group([outline, main], {
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: "center",
      originY: "center",
      shadow: getShadow()
    });

    canvas.add(sticker);
    canvas.renderAll();
  }

  // add event listeners
  document.querySelectorAll("input, select").forEach(el => el.addEventListener("input", updateSticker));

  fontUpload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const name = file.name.replace(/\.(ttf|otf)$/i, "");
    const reader = new FileReader();
    reader.onload = () => {
      const font = new FontFace(name, reader.result);
      font.load().then(f => {
        document.fonts.add(f);
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        fontSelect.appendChild(opt);
        fontSelect.value = name;
        updateSticker();
      });
    };
    reader.readAsArrayBuffer(file);
  });

  exportPNG.addEventListener("click", () => {
    const obj = canvas.getObjects()[0];
    if (!obj) return;
    const bounds = obj.getBoundingRect(true);
    canvas.setWidth(bounds.width + 40);
    canvas.setHeight(bounds.height + 40);
    obj.set({ left: canvas.width / 2, top: canvas.height / 2 });
    canvas.renderAll();
    const url = canvas.toDataURL({ format: "png", multiplier: 3 });
    const a = document.createElement("a");
    a.href = url;
    a.download = "sticker.png";
    a.click();
  });

});

const canvas = new fabric.Canvas("canvas", { backgroundColor: "transparent" });

const fonts = ["Arial","Georgia","Verdana","Impact","system-ui","-apple-system"];
const fontSelect = document.getElementById("fontSelect");
fonts.forEach(f => {
  const opt = document.createElement("option");
  opt.value = f;
  opt.textContent = f;
  fontSelect.appendChild(opt);
});

function getShadow() {
  if (!document.getElementById("shadowToggle").checked) return null;
  return new fabric.Shadow({
    color: shadowColor.value,
    blur: +shadowBlur.value,
    offsetX: +shadowX.value,
    offsetY: +shadowY.value
  });
}

function updateSticker() {
  const text = textInput.value;
  canvas.clear();

  const outline = new fabric.Text(text, {
    fontFamily: fontSelect.value,
    fontSize: 120,
    fill: "transparent",
    stroke: thickOutlineColor.value,
    strokeWidth: 20,
    originX: "center",
    originY: "center"
  });

  const main = new fabric.Text(text, {
    fontFamily: fontSelect.value,
    fontSize: 120,
    fill: textColor.value,
    stroke: thinOutlineColor.value,
    strokeWidth: 4,
    originX: "center",
    originY: "center"
  });

  const sticker = new fabric.Group([outline, main], {
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: "center",
    originY: "center",
    shadow: getShadow()
  });

  canvas.add(sticker);
  canvas.renderAll();
}

document.querySelectorAll("input, select").forEach(el =>
  el.addEventListener("input", updateSticker)
);

fontUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const name = file.name.replace(/\.(ttf|otf)$/i, "");
  const reader = new FileReader();
  reader.onload = () => {
    const font = new FontFace(name, reader.result);
    font.load().then(f => {
      document.fonts.add(f);
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      fontSelect.appendChild(opt);
      fontSelect.value = name;
      updateSticker();
    });
  };
  reader.readAsArrayBuffer(file);
});

exportPNG.addEventListener("click", () => {
  const obj = canvas.getObjects()[0];
  const bounds = obj.getBoundingRect(true);
  canvas.setWidth(bounds.width + 40);
  canvas.setHeight(bounds.height + 40);
  obj.set({ left: canvas.width / 2, top: canvas.height / 2 });
  canvas.renderAll();
  const url = canvas.toDataURL({ format: "png", multiplier: 3 });
  const a = document.createElement("a");
  a.href = url;
  a.download = "sticker.png";
  a.click();
});
