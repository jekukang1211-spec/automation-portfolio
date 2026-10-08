// 모든 페이지 공통: config.js 값을 화면에 채우고, 자주 쓰는 도우미 함수를 둔다.
(function applyConfig() {
  const S = window.SITE || {};
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = S.brand || ""));
  document.querySelectorAll("[data-kmong]").forEach((el) => {
    el.href = S.kmongUrl || "#";
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-contact-text]").forEach((el) => (el.textContent = S.contactText || "문의하기"));
})();

window.U = {
  won: (n) => (Math.round(n) || 0).toLocaleString("ko-KR") + "원",
  num: (n) => (Math.round(n) || 0).toLocaleString("ko-KR"),
  esc: (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
  ymd(d = new Date()) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  },
  // 항상 같은 샘플 데이터가 나오도록 시드 고정 난수 (데모 재현성)
  rng(seed) {
    let s = seed | 0 || 1;
    return () => {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return (s >>> 0) / 4294967296;
    };
  },
  // 브라우저 저장소는 막혀 있을 수 있으므로 항상 try/catch
  store: {
    get(k, fallback) {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
  },
  table(headers, rows, max = 50) {
    const head = "<tr>" + headers.map((h) => `<th>${U.esc(h)}</th>`).join("") + "</tr>";
    const body = rows.slice(0, max).map((r) => "<tr>" + r.map((c) => `<td>${U.esc(c)}</td>`).join("") + "</tr>").join("");
    const more = rows.length > max ? `<p class="muted small">… 외 ${rows.length - max}행 (엑셀 다운로드에는 전부 포함)</p>` : "";
    return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>${more}`;
  },
};
