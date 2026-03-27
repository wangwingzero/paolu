(() => {
  const copyTargets = document.querySelectorAll("[data-copy]");

  const showToast = (message) => {
    const existing = document.querySelector(".copied-tip");
    if (existing) {
      existing.remove();
    }
    const toast = document.createElement("div");
    toast.className = "copied-tip";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  };

  copyTargets.forEach((element) => {
    element.addEventListener("click", async () => {
      const text = element.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast(`已复制：${text}`);
      } catch {
        showToast("复制失败。看来连剪贴板都想跑路。");
      }
    });
  });
})();
