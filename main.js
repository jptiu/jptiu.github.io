const profile = {
  links: {
    linkedin: "",
    gitlab: ""
  }
};

function getPreferredTheme() {
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      showToast(`${label} copied`);
    } catch {
      showToast("Copy failed");
    } finally {
      textarea.remove();
    }
  }
}

function initTheme() {
  setTheme(getPreferredTheme());
  const btn = document.querySelector('[data-action="toggle-theme"]');
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    setTheme(current === "dark" ? "light" : "dark");
    showToast(`Theme: ${document.documentElement.dataset.theme}`);
  });
}

function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      const label = btn.getAttribute("data-label") || "Value";
      if (!value) return;
      await copyText(value, label);
    });
  });
}

function initLinks() {
  const map = profile.links || {};
  document.querySelectorAll("[data-link]").forEach((a) => {
    const key = a.getAttribute("data-link");
    const href = key ? map[key] : "";
    if (!href) {
      a.hidden = true;
      return;
    }
    a.href = href;
  });
}

function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = year;
  });
}

function initTyping() {
  const el = document.querySelector('[data-typing="role"]');
  if (!el) return;
  const full = el.textContent || "";
  if (!full.trim()) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  el.textContent = "";
  let i = 0;

  const tick = () => {
    i += 1;
    el.textContent = full.slice(0, i);
    if (i < full.length) {
      window.setTimeout(tick, 18);
    }
  };
  window.setTimeout(tick, 120);
}

function initHotkeys() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target;
    const tag = target && target.tagName ? String(target.tagName).toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    const key = String(e.key || "").toLowerCase();
    if (key === "t") {
      const current = document.documentElement.dataset.theme || "dark";
      setTheme(current === "dark" ? "light" : "dark");
      showToast(`Theme: ${document.documentElement.dataset.theme}`);
      return;
    }

    if (key === "c") {
      const phoneBtn = document.querySelector('[data-copy][data-label="Phone"]');
      const value = phoneBtn ? phoneBtn.getAttribute("data-copy") : "";
      if (value) copyText(value, "Phone");
      return;
    }

    if (key === "g") {
      if (reduceMotion) {
        window.location.hash = "#contact";
        return;
      }
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

initTheme();
initLinks();
initYear();
initCopyButtons();
initTyping();
initHotkeys();
