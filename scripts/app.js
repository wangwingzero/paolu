(() => {
  const copyTargets = document.querySelectorAll("[data-copy]");
  const copyBlocks = document.querySelectorAll("[data-copy-block]");
  const statusPage = document.body.dataset.page === "status";

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

  copyBlocks.forEach((element) => {
    element.addEventListener("click", async () => {
      const text = element.getAttribute("data-copy-block") || element.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast("已复制代码块");
      } catch {
        showToast("复制失败。看来连剪贴板都想跑路。");
      }
    });
  });

  if (!statusPage) {
    return;
  }

  const statusMap = {
    operational: {
      label: "运行正常",
      tone: "is-operational",
      summary: "主要入口都还活着，暂时不用集体怀疑人生。"
    },
    degraded: {
      label: "部分降级",
      tone: "is-degraded",
      summary: "还能用，但别假装一切风平浪静。"
    },
    outage: {
      label: "服务中断",
      tone: "is-outage",
      summary: "已经不是小抖动了，该排查的赶紧排查。"
    }
  };

  const statusEndpoints = ["/api/status.json", "/status/data/status.json"];

  const loadStatusPayload = async () => {
    let lastError;

    for (const endpoint of statusEndpoints) {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = new Error(`${endpoint}: ${error.message}`);
      }
    }

    throw lastError || new Error("no status endpoint available");
  };

  const renderStatusPage = async () => {
    const overallLabel = document.querySelector("#overall-label");
    const overallSummary = document.querySelector("#overall-summary");
    const updatedAt = document.querySelector("#updated-at");
    const monitorCount = document.querySelector("#monitor-count");
    const statusGrid = document.querySelector("#status-grid");
    const incidentList = document.querySelector("#incident-list");

    try {
      const data = await loadStatusPayload();
      const services = Array.isArray(data.services) ? data.services : [];
      const incidents = Array.isArray(data.incidents) ? data.incidents : [];
      const hasOutage = services.some((service) => service.status === "outage");
      const hasDegraded = services.some((service) => service.status === "degraded");
      const overall = hasOutage ? statusMap.outage : hasDegraded ? statusMap.degraded : statusMap.operational;

      overallLabel.textContent = overall.label;
      overallLabel.className = `status-title ${overall.tone}`;
      overallSummary.textContent = data.page?.summary || overall.summary;
      updatedAt.textContent = data.page?.updatedAt || "--";
      monitorCount.textContent = `${services.length} 项`;

      statusGrid.innerHTML = services.map((service) => {
        const tone = statusMap[service.status] || statusMap.degraded;
        return `
          <article class="service-card">
            <div class="service-head">
              <div>
                <p class="service-name">${service.name ?? "未命名服务"}</p>
                <p class="service-host">${service.host ?? ""}</p>
              </div>
              <span class="status-pill ${tone.tone}">${tone.label}</span>
            </div>
            <p class="service-summary">${service.summary ?? "暂无说明。"}</p>
            <div class="service-stats">
              <div><span>可用率</span><strong>${service.uptime ?? "--"}</strong></div>
              <div><span>延迟</span><strong>${service.latency ?? "--"}</strong></div>
            </div>
            <a class="service-link" href="${service.url ?? "#"}" target="_blank" rel="noreferrer">打开服务 →</a>
          </article>
        `;
      }).join("");

      incidentList.innerHTML = incidents.length
        ? incidents.map((incident) => `
          <article class="feed-item">
            <p class="feed-time">${incident.time ?? "--"}</p>
            <h3>${incident.title ?? "未命名事件"}</h3>
            <p>${incident.detail ?? ""}</p>
          </article>
        `).join("")
        : `<article class="feed-item"><p class="feed-time">当前</p><h3>暂无事件</h3><p>今天先别自己吓自己。</p></article>`;
    } catch (error) {
      overallLabel.textContent = "状态数据加载失败";
      overallLabel.className = "status-title is-outage";
      overallSummary.textContent = `读取自动状态接口失败：${error.message}`;
      updatedAt.textContent = "--";
      monitorCount.textContent = "--";
      statusGrid.innerHTML = `<article class="service-card"><p class="service-summary">自动状态接口没接上，当前已尝试 Worker API 和本地回退 JSON。先把部署打通，再谈服务到底挂没挂。</p></article>`;
      incidentList.innerHTML = `<article class="feed-item"><p class="feed-time">错误</p><h3>状态页失联</h3><p>展示面已经起来，但数据源没接上。</p></article>`;
    }
  };

  renderStatusPage();
})();
