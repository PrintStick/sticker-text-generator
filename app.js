document.addEventListener("DOMContentLoaded", () => {

  const canvas = new fabric.Canvas("canvas", { backgroundColor: "transparent" });

  // Elements
  const textInput = document.getElementById("textInput");
  const updateButton = document.getElementById("updateButton");

  const textColor = document.getElementById("textColor");
  const textColorHex = document.getElementById("textColorHex");

  const thinOutlineColor = document.getElementById("thinOutlineColor");
  const thinOutlineHex = document.getElementById("thinOutlineHex");

  const thickOutlineColor = document.getElementById("thickOutlineColor");
  const thickOutlineHex = document.getElementById("thickOutlineHex");

  const shadowToggle = document.getElementById("shadowToggle");
  const shadowColor = document.getElementById("shadowColor");
  const shadowHex = document.getElementById("shadowHex");
  const shadowBlur = document.getElementById("shadowBlur");
  const shadowX = document.getElementById("shadowX");
  const shadowY = document.getElementById("shadowY");

  const fontSelect = document.getElementById("fontSelect");
  const fontUpload = document.getElementById("fontUpload");
  const exportPNG = document.getElementById("exportPNG");

  // Default fonts
  const fonts = ["Arial","Georgia","Verdana","Impact","Times New Roman"];
  fonts.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    fontSelect.appendChild(opt);
  });

  // Sync color pickers with hex input
  function syncColor(colorInput, hexInput) {
    colorInput.addEventListener("input", () => {
      hexInput.value = colorInput.value;
      updateSticker();
    });
    hexInput.addEventListener("input", () => {
      if(/^#([0-9A-Fa-f]{3}){1,2}$/.test(hexInput.value)) {
        colorInput.value = hexInput.value;
        updateSticker();
      }
    });
  }

  syncColor(textColor, textColorHex);
  syncColor(thinOutlineColor, thinOutlineHex);
  syncColor(thickOutlineColor, thickOutlineHex);
  syncColor(shadowColor, shadowHex);

  // Shadow helper
  function getShadow() {
    if (!shadowToggle.checked) return null;
    return new fabric.Shadow({
      color: shadowColor.value,
      blur: +shadowBlur.value,
      offsetX: +shadowX.value,
      offsetY: +shadowY.value
    });
  }

  // Main function to render text
  function updateSticker() {
    const text = textInput.value.trim();
    if (!text) return;

    const selectedFont = fontSelect.value;

    // Wait for font to load
    document.fonts.load(`120px "${selectedFont}"`).then(() => {
      canvas.clear();

      const outline = new fabric.Text(text, {
        fontFamily: selectedFont,
        fontSize: 120,
        fill: "transparent",
        stroke: thickOutlineColor.value,
        strokeWidth: 20,
        originX: "center",
        originY: "center"
      });

      const main = new fabric.Text(text, {
        fontFamily: selectedFont,
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
    }).catch(err => console.error("Font failed to load:", selectedFont, err));
  }

  // Event listeners
  textInput.addEventListener("input", updateSticker);
  updateButton.addEventListener("click", updateSticker);
  [shadowToggle, shadowBlur, shadowX, shadowY, fontSelect].forEach(el => el.addEventListener("input", updateSticker));

  // Font upload
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

  // Export PNG
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
