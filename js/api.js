// Lapisan jaringan: timeout, retry baca, reqId idempoten untuk tulis, pengukur waktu
const Perf = { rows: [], table() { console.table(this.rows.slice(-30)); } };
const READ = /^(home|boot|scanSantri)$/;
const Store = {
  get(k, d) { try { const v = localStorage.getItem('msm:v1:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('msm:v1:' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('msm:v1:' + k); } catch (e) {} }
};
async function apiOnce(action, data, timeout, reqId) {
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), timeout), t0 = performance.now();
  try {
    const res = await fetch(GAS_URL, { method: 'POST', redirect: 'follow', cache: 'no-store', signal: ctrl.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // wajib: hindari CORS preflight
      body: JSON.stringify({ action, token: localStorage.getItem('msm:t') || '', reqId, data: data || {} }) });
    const text = await res.text();
    try { const j = JSON.parse(text); Perf.rows.push({ action, total: Math.round(performance.now() - t0), server: j.ms }); return j; }
    catch (e) { return { success: false, retryable: true, message: 'Server membalas bukan JSON (HTTP ' + res.status + ').' }; }
  } catch (err) {
    return { success: false, retryable: true, message: err.name === 'AbortError' ? 'Server terlalu lama merespons.' : 'Koneksi terputus.' };
  } finally { clearTimeout(timer); }
}
async function api(action, data, opt = {}) {
  const isRead = READ.test(action), reqId = isRead ? '' : (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random());
  let res;
  for (let i = 0; i < (isRead ? 3 : 2); i++) {
    if (i) await new Promise(r => setTimeout(r, 1200 * i));
    res = await apiOnce(action, data, isRead ? (i ? 40000 : 25000) : 90000, reqId);
    if (res.success || !res.retryable) break;
  }
  if (!res.success && res.data && res.data.code === 'AUTH' && window.onExpired) onExpired();
  return res;
}
function warmUp() { fetch(GAS_URL + '?ping=' + Date.now(), { mode: 'no-cors', cache: 'no-store' }).catch(() => {}); }
