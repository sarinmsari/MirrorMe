document.addEventListener("DOMContentLoaded", async () => {
  const video = document.getElementById("mirror");
  const flipBtn = document.getElementById("flipBtn");
  const snapBtn = document.getElementById("snapBtn");
  const canvas = document.getElementById("canvas");
  const infoText = document.querySelector(".info-text");
  const fixBtn = document.getElementById("fixBtn");
  const buttonSection = document.querySelector(".button-section");
  const infoSection = document.querySelector(".info-section");

  let flipped = true; // start mirrored

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    infoSection.style.display = "none";
    buttonSection.style.display = "flex";
    video.style.display = "block";
  } catch (err) {
    buttonSection.style.display = "none";
    video.style.display = "none";
    infoText.innerHTML = "⚠️ Camera access required!<br/>Please allow it in the site settings.";
    fixBtn.style.display = "flex";
    fixBtn.addEventListener("click", () => {
      const extId = chrome.runtime.id; // dynamically get your extension's ID
      chrome.tabs.create({ url: `chrome://extensions/?id=${extId}` });
    });

  }

  // Toggle mirror effect
  flipBtn.addEventListener("click", () => {
    flipped = !flipped;
    video.style.transform = flipped ? "scaleX(-1)" : "scaleX(1)";
  });

  // Take a snapshot
  snapBtn.addEventListener("click", () => {
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (flipped) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image
    const dataUrl = canvas.toDataURL("image/png");
    const filename = `Mirra-snap-${Date.now()}.png`;
    chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: false
    });
  });
});
