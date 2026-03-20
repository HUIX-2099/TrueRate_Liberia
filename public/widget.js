/**
 * TrueRate Liberia - Rate at a Glance Widget
 * Embed the live USD/LRD rate on any website.
 * Usage: <script src="https://truerateliberia.com/widget.js"></script>
 *        <div data-truerate-widget></div>
 */
(function () {
  "use strict";

  var BASE = "https://truerateliberia.com";
  var WIDGET_ID = "data-truerate-widget";

  function init() {
    var els = document.querySelectorAll("[" + WIDGET_ID + "]");
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function getOpt(el, key, fallback) {
    var val = el.getAttribute("data-" + key);
    return val != null && val !== "" ? val : fallback;
  }

  function formatTime(iso) {
    if (!iso) return "";
    try {
      var d = new Date(iso);
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch (_) {
      return "";
    }
  }

  function styles(theme) {
    var isDark = theme === "dark" || (theme === "auto" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var bg = isDark ? "#1a1a1a" : "#f8fafc";
    var fg = isDark ? "#f1f5f9" : "#0f172a";
    var muted = isDark ? "#94a3b8" : "#64748b";
    var accent = "#16a34a";
    var border = isDark ? "#334155" : "#e2e8f0";
    var link = isDark ? "#4ade80" : "#15803d";
    return {
      container: "font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.4;background:" + bg + ";color:" + fg + ";border:1px solid " + border + ";border-radius:8px;padding:12px 16px;display:inline-block;min-width:200px;box-sizing:border-box;",
      rate: "font-size:24px;font-weight:700;color:" + accent + ";margin:4px 0 2px 0;letter-spacing:-0.5px;",
      label: "font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:" + muted + ";",
      meta: "font-size:11px;color:" + muted + ";margin-top:6px;",
      link: "color:" + link + ";text-decoration:none;font-weight:600;font-size:12px;",
      linkHover: "text-decoration:underline;",
    };
  }

  function html(rate, updated, theme, base, compact) {
    var s = styles(theme);
    var t = formatTime(updated);
    var rateStr = typeof rate === "number" && rate > 0 ? rate.toFixed(2) : "—";
    var meta = compact ? "" : '<div style="' + s.meta + '">' + (t ? "Updated " + t : "") + "</div>";
    return (
      '<div style="' + s.container + '">' +
        '<div style="' + s.label + '">USD → LRD</div>' +
        '<div style="' + s.rate + '">' + rateStr + ' LRD</div>' +
        meta +
        '<a href="' + base + '" target="_blank" rel="noopener noreferrer" style="' + s.link + '" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">TrueRate Liberia →</a>' +
      "</div>"
    );
  }

  function loadingHtml(theme, base) {
    var s = styles(theme);
    return (
      '<div style="' + s.container + '">' +
        '<div style="' + s.label + '">USD → LRD</div>' +
        '<div style="' + s.rate + '">...</div>' +
        '<a href="' + base + '" target="_blank" rel="noopener noreferrer" style="' + s.link + '">TrueRate Liberia →</a>' +
      "</div>"
    );
  }

  function render(el) {
    var base = getOpt(el, "base", BASE);
    var theme = getOpt(el, "theme", "auto");
    var compact = getOpt(el, "compact", "false") === "true";

    el.innerHTML = loadingHtml(theme, base);

    var apiUrl = base.replace(/\/$/, "") + "/api/rates/live";
    fetch(apiUrl, { method: "GET", credentials: "omit" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        var rate = data && typeof data.rate === "number" ? data.rate : null;
        var updated = (data && data.timestamp) || (data && data.market && data.market.timestamp) || null;
        el.innerHTML = html(rate, updated, theme, base, compact);
      })
      .catch(function () {
        el.innerHTML = html(null, null, theme, base, compact);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
