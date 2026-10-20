const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SURAT = "Al-Fatihah|Al-Baqarah|Ali 'Imran|An-Nisa'|Al-Ma'idah|Al-An'am|Al-A'raf|Al-Anfal|At-Taubah|Yunus|Hud|Yusuf|Ar-Ra'd|Ibrahim|Al-Hijr|An-Nahl|Al-Isra'|Al-Kahfi|Maryam|Taha|Al-Anbiya'|Al-Hajj|Al-Mu'minun|An-Nur|Al-Furqan|Asy-Syu'ara'|An-Naml|Al-Qasas|Al-'Ankabut|Ar-Rum|Luqman|As-Sajdah|Al-Ahzab|Saba'|Fatir|Yasin|As-Saffat|Sad|Az-Zumar|Gafir|Fussilat|Asy-Syura|Az-Zukhruf|Ad-Dukhan|Al-Jasiyah|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Az-Zariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqi'ah|Al-Hadid|Al-Mujadalah|Al-Hasyr|Al-Mumtahanah|As-Saff|Al-Jumu'ah|Al-Munafiqun|At-Tagabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqah|Al-Ma'arij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddassir|Al-Qiyamah|Al-Insan|Al-Mursalat|An-Naba'|An-Nazi'at|'Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Insyiqaq|Al-Buruj|At-Tariq|Al-A'la|Al-Gasyiyah|Al-Fajr|Al-Balad|Asy-Syams|Al-Lail|Ad-Duha|Asy-Syarh|At-Tin|Al-'Alaq|Al-Qadr|Al-Bayyinah|Az-Zalzalah|Al-'Adiyat|Al-Qari'ah|At-Takasur|Al-'Asr|Al-Humazah|Al-Fil|Quraisy|Al-Ma'un|Al-Kausar|Al-Kafirun|An-Nasr|Al-Lahab|Al-Ikhlas|Al-Falaq|An-Nas".split('|');
const S = { token: localStorage.getItem('msm:t') || '', b: null, info: Store.get('info', null), view: 'home', tab: '', anak: 0 };
const TABS = {
  wali: [['beranda', '🏠', 'Beranda'], ['hafalan', '📖', 'Hafalan'], ['absen', '🗓️', 'Absensi'], ['kartu', '🪪', 'Kartu']],
  ustadz: [['setoran', '📖', 'Setoran'], ['absensi', '✅', 'Absensi']],
  admin: [['dasbor', '📊', 'Dasbor'], ['santri', '👥', 'Santri'], ['pendaftar', '📝', 'Daftar'], ['halaqoh', '🕌', 'Halaqoh'], ['atur', '⚙️', 'Atur']],
  bendahara_spp: [['keu', '💰', 'SPP']], bendahara_saku: [['keu', '💰', 'Uang Saku']]
};
const ROLE_LABEL = { wali: 'Wali Santri', ustadz: 'Ustadz', admin: 'Admin', bendahara_spp: 'Bendahara SPP', bendahara_saku: 'Bendahara Uang Saku' };
// ---------- util ----------
function toast(m, err) { const t = $('#toast'); t.textContent = m; t.className = 'show' + (err ? ' err' : ''); clearTimeout(toast.t); toast.t = setTimeout(() => t.className = '', 3200); }
function modal(h) { const m = $('#modal'); m.innerHTML = '<div>' + h + '</div>'; m.hidden = false; }
function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; stopCam(); }
function opt(list, sel) { return list.map(o => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return `<option value="${esc(v)}"${String(v) === String(sel) ? ' selected' : ''}>${esc(l)}</option>`; }).join(''); }
function tgl(d) { try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } }
function waLink(n, t) { n = String(n || '').replace(/\D/g, '').replace(/^0/, '62'); return n ? 'https://wa.me/' + n + (t ? '?text=' + encodeURIComponent(t) : '') : ''; }
function setTheme(t) { document.documentElement.dataset.theme = t; localStorage.setItem('msm:theme', t); }
setTheme(localStorage.getItem('msm:theme') || 'light');
async function call(action, data, okMsg) { const r = await api(action, data); if (!r.success) { toast(r.message || 'Gagal', true); return r; } if (okMsg !== false && r.message) toast(r.message); return r; }
async function refresh() { const r = await api('boot'); if (r.success) { S.b = r.data; Store.set('boot:' + r.data.user.id, r.data); render(); } return r; }
function logout() { localStorage.removeItem('msm:t'); Object.keys(localStorage).filter(k => k.indexOf('msm:v1:boot:') === 0).forEach(k => localStorage.removeItem(k)); S.token = ''; S.b = null; S.view = 'home'; render(); }
window.onExpired = () => { toast('Sesi berakhir, silakan masuk lagi.', true); logout(); };
// ---------- tampilan publik ----------
const V = {
  home() {
    const i = S.info || {}, yt = (i.youtube || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return `<div class="bar"><b>🕌 ${esc(i.nama || "Ma'had Sabilul Muttaqin")}</b><button class="btn g sm" data-act="theme">🌓</button></div>
    <div class="card hero"><h1>Assalamu'alaikum</h1><p class="mut">${esc(i.alamat || 'Salamrejo, Resapombo, Doko, Blitar')}</p><p style="margin-top:10px">Pantau hafalan, absensi, dan perkembangan santri langsung dari HP.</p></div>
    <h2>Masuk Portal</h2><div class="grid" style="margin:10px 0">${['wali', 'ustadz', 'bendahara', 'admin'].map(r => `<button class="btn g" data-act="goLogin" data-r="${r}">${{ wali: '👪 Wali', ustadz: '📖 Ustadz', bendahara: '💰 Bendahara', admin: '🛡️ Admin' }[r]}</button>`).join('')}</div>
    ${(i.pengumuman || []).length ? '<h2>Informasi</h2>' + i.pengumuman.map(p => `<div class="card"><h3>${esc(p.Judul)}</h3><p class="mut">${tgl(p.Tanggal)}</p><p>${esc(p.Isi)}</p></div>`).join('') : ''}
    ${yt ? `<h2>Video</h2><iframe loading="lazy" src="https://www.youtube.com/embed/${yt[1]}" allowfullscreen></iframe>` : ''}
    <p class="mut" style="text-align:center;margin-top:24px">© ${esc(i.nama || "Ma'had Sabilul Muttaqin")}</p>`;
  },
  login() {
    return `<div class="bar"><button class="btn g sm" data-act="goHome">← Beranda</button><button class="btn g sm" data-act="theme">🌓</button></div>
    <div class="card hero"><h2>Selamat Datang</h2><p class="mut">Masuk ke portal ${esc(S.hint || '')}</p></div>
    <form class="card" data-form="login"><label>Username / Email</label><input name="username" required autocomplete="username"><label>Kata sandi</label><input name="password" type="password" required autocomplete="current-password">
    <button class="btn w">Masuk</button><p class="mut" style="text-align:center;margin:10px 0">atau</p><button type="button" class="btn g w" data-act="scanLogin">📷 Masuk dengan Scan QR / Kartu</button></form>
    <div class="card"><p>Wali baru?</p><button class="btn s w" data-act="goDaftar" style="margin-top:8px">Daftar Akun Wali</button></div>`;
  },
  daftar() {
    return `<div class="bar"><button class="btn g sm" data-act="goLogin">← Kembali</button></div>
    <div class="card hero"><h2>Daftar Akun Wali Santri</h2><p class="mut">Akun diverifikasi admin maksimal 1x24 jam kerja.</p></div>
    <form class="card" data-form="daftar"><h3>1. Data Wali</h3><label>Nama lengkap</label><input name="nama" required><label>Nomor WhatsApp</label><input name="wa" inputmode="tel" required><label>Email aktif</label><input name="email" type="email" required>
    <label>Kata sandi (min. 8)</label><input name="password" type="password" minlength="8" required>
    <h3 style="margin-top:10px">2. Data Santri</h3><label>Nama lengkap santri</label><input name="a_nama" required><label>NIS (jika ada)</label><input name="a_nis"><label>Tempat lahir</label><input name="a_tempat"><label>Tanggal lahir</label><input name="a_tgl" type="date"><label>Alamat</label><textarea name="a_alamat" rows="2"></textarea>
    <button class="btn w">Kirim Pendaftaran</button></form>`;
  }
};
// ---------- portal ----------
const PG = {
  beranda() {
    const a = S.b.anak[S.anak]; if (!a) return '<div class="card">Belum ada data santri.</div>';
    const i = S.b.info, last = a.hafalan[0];
    return `${S.b.anak.length > 1 ? `<div class="seg">${S.b.anak.map((x, k) => `<button class="${k === S.anak ? 'on' : ''}" data-act="anak" data-k="${k}">${esc(x.Nama.split(' ')[0])}</button>`).join('')}</div>` : ''}
    <div class="card hero"><span class="pill gold">${esc(a.Status)}</span><h2 style="margin-top:6px">${esc(a.Nama)}</h2><p class="mut">NIS ${esc(a.NIS || '-')} • ${esc(a.Halaqoh)}</p><p class="mut">Ustadz: ${esc(a.Ustadz || '-')}</p></div>
    <div class="card"><h3>Capaian Tahfidz</h3><p class="mut">${a.juz.length} dari 30 juz</p><div class="prog" style="margin:8px 0"><i style="width:${a.juz.length / 30 * 100}%"></i></div>
    <div class="juz">${Array.from({ length: 30 }, (_, k) => `<span class="${a.juz.indexOf(k + 1) > -1 ? 'on' : ''}">${k + 1}</span>`).join('')}</div>
    ${last ? `<div class="row"><span>Terakhir: ${esc(last.Surat || 'Iqro ' + last.Juz)} ${esc(last.Dari)}–${esc(last.Sampai)}</span><span class="pill ok">${esc(last.Nilai)}</span></div>` : ''}</div>
    <div class="grid">${waLink(i.wa_spp) ? `<a class="btn g" href="${waLink(i.wa_spp, 'Assalamu\'alaikum, saya wali ' + a.Nama + ' ingin bertanya tentang SPP.')}" target="_blank">💬 WA Bendahara SPP</a>` : ''}${waLink(i.wa_saku) ? `<a class="btn g" href="${waLink(i.wa_saku, 'Assalamu\'alaikum, saya wali ' + a.Nama + ' ingin bertanya tentang uang saku.')}" target="_blank">💬 WA Uang Saku</a>` : ''}</div>`;
  },
  hafalan() { const a = S.b.anak[S.anak]; return '<h2>Riwayat Setoran</h2>' + (a && a.hafalan.length ? '<div class="card">' + a.hafalan.map(h => `<div class="row"><div><b>${esc(h.Surat || 'Iqro jilid ' + h.Juz)}</b><div class="mut">${tgl(h.Tanggal)} • ${esc(h.Dari)}–${esc(h.Sampai)} ${esc(h.Satuan)}</div></div><span class="pill ${h.Status === 'Lanjut' ? 'ok' : 'bad'}">${esc(h.Nilai)} • ${esc(h.Status)}</span></div>`).join('') + '</div>' : '<div class="card mut">Belum ada setoran.</div>'); },
  absen() { const a = S.b.anak[S.anak]; return '<h2>Absensi</h2>' + (a && a.absensi.length ? '<div class="card">' + a.absensi.map(x => `<div class="row"><span>${tgl(x.Tanggal)} • ${esc(x.Kegiatan)}</span><span class="pill ${x.Status === 'H' ? 'ok' : x.Status === 'A' ? 'bad' : ''}">${{ H: 'Hadir', I: 'Izin', S: 'Sakit', A: 'Alpa' }[x.Status] || esc(x.Status)}</span></div>`).join('') + '</div>' : '<div class="card mut">Belum ada data.</div>'); },
  kartu() { const a = S.b.anak[S.anak]; if (!a) return ''; return `<h2>Kartu Santri Digital</h2><div class="card"><div class="ktp"><div><small>MA'HAD SABILUL MUTTAQIN</small><b>KARTU SANTRI</b><h3 style="margin-top:8px">${esc(a.Nama)}</h3><small>NIS</small><b>${esc(a.NIS || '-')}</b><small>HALAQOH</small>${esc(a.Halaqoh)}</div><div class="qr" id="qr1"></div></div><p class="mut" style="margin-top:8px">Gunakan QR ini untuk masuk cepat dan presensi.</p></div>`; },
  notif() { return '<h2>Notifikasi</h2><div class="card">' + (S.b.notif.length ? S.b.notif.map(n => `<div class="row"><div><b>${esc(n.Judul)}</b><div class="mut">${esc(n.Isi)}</div></div>${n.Dibaca ? '' : '<span class="pill gold">baru</span>'}</div>`).join('') : '<span class="mut">Belum ada notifikasi.</span>') + '</div>'; },
  keu() { return '<div class="card hero"><h2>Modul Keuangan</h2><p class="mut">SPP dan uang saku tersedia di Fase 2.</p></div>'; },
  // ustadz
  setoran() {
    const sudah = S.b.setorHariIni, hq = S.b.halaqoh.map(h => h.Nama + ' (' + h.Jenis + ')').join(', ') || 'belum ada halaqoh';
    return `<div class="card hero"><h2>Halaqoh Anda</h2><p class="mut">${esc(hq)}</p><button class="btn s w" style="margin-top:10px" data-act="scan">📷 Scan Kartu Santri</button></div><h2>Daftar Santri</h2><div class="card">${S.b.santri.map(s => `<div class="row"><div><b>${esc(s.Nama)}</b><div class="mut">NIS ${esc(s.NIS || '-')}</div></div>${sudah.indexOf(s.SantriID) > -1 ? '<span class="pill ok">Sudah setor</span>' : ''}<button class="btn sm" data-act="setor" data-id="${esc(s.SantriID)}">Setor</button></div>`).join('') || '<span class="mut">Belum ada santri.</span>'}</div>`;
  },
  absensi() {
    return `<h2>Absensi Harian</h2><form class="card" data-form="absen"><label>Kegiatan</label><select name="kegiatan">${opt(['Tahajud', 'Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Halaqoh'])}</select><label>Tanggal</label><input type="date" name="tanggal" value="${new Date().toISOString().slice(0, 10)}">
    ${S.b.santri.map(s => `<div class="row"><span>${esc(s.Nama)}</span><select name="s_${esc(s.SantriID)}" style="width:110px;margin:0">${opt([['H', 'Hadir'], ['I', 'Izin'], ['S', 'Sakit'], ['A', 'Alpa']])}</select></div>`).join('')}<button class="btn w" style="margin-top:12px">Simpan Absensi</button></form>`;
  },
  // admin
  dasbor() {
    const b = S.b, st = [['Santri aktif', b.santri.filter(s => s.Status === 'Aktif').length], ['Halaqoh', b.halaqoh.length], ['Ustadz', b.users.filter(u => u.Role === 'ustadz').length], ['Menunggu', b.pendaftar.length]];
    return `<div class="card hero"><h2>Administrator</h2><p class="mut">Kelola santri, halaqoh, dan akun.</p></div><div class="grid">${st.map(x => `<div class="stat"><span class="mut">${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>
    <h2 style="margin-top:18px">Pengumuman Baru</h2><form class="card" data-form="info"><input name="judul" placeholder="Judul" required><textarea name="isi" rows="3" placeholder="Isi informasi" required></textarea><button class="btn w">Publikasikan</button></form>`;
  },
  santri() {
    const q = (S.q || '').toLowerCase(), hq = id => (S.b.halaqoh.find(h => h.HalaqohID === id) || {}).Nama || '-';
    return `<div class="bar"><h2>Data Santri</h2><button class="btn sm" data-act="editSantri" data-id="">+ Tambah</button></div><input placeholder="Cari nama / NIS…" data-act="cari" value="${esc(S.q || '')}"><div class="card">${S.b.santri.filter(s => s.Status !== 'Menunggu' && (s.Nama + s.NIS).toLowerCase().indexOf(q) > -1).map(s => `<div class="row"><div><b>${esc(s.Nama)}</b><div class="mut">NIS ${esc(s.NIS || '-')} • ${esc(hq(s.HalaqohID))}</div></div><button class="btn g sm" data-act="editSantri" data-id="${esc(s.SantriID)}">Ubah</button></div>`).join('') || '<span class="mut">Tidak ada data.</span>'}</div>`;
  },
  pendaftar() {
    return '<h2>Pendaftaran Wali</h2>' + (S.b.pendaftar.map(p => `<form class="card" data-form="approve" data-uid="${esc(p.UserID)}"><h3>${esc(p.Nama)}</h3><p class="mut">${esc(p.Email)} • ${esc(p.WA)}</p>${p.anak.map(a => `<div class="row"><span>${esc(a.Nama)}</span><span class="mut">${esc(a.TempatLahir)} ${esc(a.TanggalLahir ? tgl(a.TanggalLahir) : '')}</span></div>`).join('')}
    <label>NIS</label><input name="nis" value="${esc((p.anak[0] || {}).NIS || '')}"><label>Halaqoh</label><select name="halaqohId"><option value="">— pilih —</option>${opt(S.b.halaqoh.map(h => [h.HalaqohID, h.Nama]))}</select>
    <div class="grid"><button class="btn s" name="ok" value="1">Setujui</button><button class="btn d" name="tolak" value="1" formnovalidate>Tolak</button></div></form>`).join('') || '<div class="card mut">Tidak ada pendaftaran baru.</div>');
  },
  halaqoh() {
    return `<div class="bar"><h2>Halaqoh</h2><button class="btn sm" data-act="editHalaqoh" data-id="">+ Tambah</button></div><div class="card">${S.b.halaqoh.map(h => `<div class="row"><div><b>${esc(h.Nama)}</b> <span class="pill">${esc(h.Jenis)}</span><div class="mut">${esc(h.Ustadz || 'Belum ada ustadz')} • ${h.Jumlah} santri</div></div><button class="btn g sm" data-act="editHalaqoh" data-id="${esc(h.HalaqohID)}">Ubah</button></div>`).join('') || '<span class="mut">Belum ada halaqoh.</span>'}</div>`;
  },
  atur() {
    const i = S.b.info;
    return `<h2>Akun Ustadz & Bendahara</h2><div class="card">${S.b.users.filter(u => u.Role !== 'admin').map(u => `<div class="row"><div><b>${esc(u.Nama)}</b><div class="mut">${ROLE_LABEL[u.Role]} • ${esc(u.Username)}</div></div><button class="btn g sm" data-act="userQR" data-id="${esc(u.UserID)}">QR</button></div>`).join('') || '<span class="mut">Belum ada.</span>'}</div>
    <form class="card" data-form="user"><h3>Tambah akun</h3><input name="Nama" placeholder="Nama" required><select name="Role">${opt([['ustadz', 'Ustadz'], ['bendahara_spp', 'Bendahara SPP'], ['bendahara_saku', 'Bendahara Uang Saku']])}</select><input name="Username" placeholder="Username" required><input name="password" placeholder="Kata sandi" required><input name="Email" type="email" placeholder="Email"><input name="WA" placeholder="WhatsApp"><button class="btn w">Buat Akun</button></form>
    <form class="card" data-form="atur"><h3>Pengaturan Beranda & Kontak</h3><label>Link YouTube</label><input name="YOUTUBE" value="${esc(i.youtube)}"><label>WA Bendahara SPP</label><input name="WA_BENDAHARA_SPP" value="${esc(i.wa_spp)}"><label>WA Bendahara Uang Saku</label><input name="WA_BENDAHARA_SAKU" value="${esc(i.wa_saku)}"><button class="btn w">Simpan</button></form>`;
  }
};
function shell() {
  const r = S.b.user.role, tabs = TABS[r] || [], unread = S.b.notif.filter(n => !n.Dibaca).length;
  if (!S.tab || (!tabs.some(t => t[0] === S.tab) && S.tab !== 'notif')) S.tab = tabs[0][0];
  const half = Math.ceil(tabs.length / 2), btn = t => `<button class="${S.tab === t[0] ? 'on' : ''}" data-act="tab" data-t="${t[0]}"><span>${t[1]}</span>${t[2]}</button>`;
  return `<div class="bar"><div><b>🕌 Ma'had Sabilul Muttaqin</b><div class="mut">${ROLE_LABEL[r]} — ${esc(S.b.user.nama)}</div></div><div><button class="btn g sm" data-act="tab" data-t="notif">🔔${unread ? ' ' + unread : ''}</button> <button class="btn g sm" data-act="theme">🌓</button> <button class="btn g sm" data-act="logout">Keluar</button></div></div>
  ${(PG[S.tab] || PG.notif)()}
  <nav class="dock">${tabs.slice(0, half).map(btn).join('')}<button class="fab" data-act="${r === 'ustadz' ? 'scan' : 'tab'}" data-t="notif">${r === 'ustadz' ? '📷' : '🔔'}</button>${tabs.slice(half).map(btn).join('')}</nav>`;
}
function render() {
  const app = $('#app');
  app.innerHTML = S.token && S.b ? shell() : (V[S.view] || V.home)();
  const q = $('#qr1'); if (q && window.QRCode) { const a = S.b.anak[S.anak]; new QRCode(q, { text: a.QRToken, width: 96, height: 96 }); }
}
// ---------- scan (kamera + scanner USB) ----------
let camStream = null, camOn = false;
function stopCam() { camOn = false; if (camStream) camStream.getTracks().forEach(t => t.stop()); camStream = null; }
function scanModal(onCode) {
  modal(`<h3>Scan Barcode / QR</h3><p class="mut">Arahkan kamera ke QR, atau gunakan scanner USB (ketik lalu Enter).</p><video id="cam" playsinline muted style="width:100%;border-radius:16px;margin:8px 0" hidden></video>
  <input id="scanIn" placeholder="Kode QR…" autofocus><div class="grid"><button class="btn s" id="camBtn">📷 Buka Kamera</button><button class="btn g" data-act="close">Tutup</button></div>`);
  const done = c => { c = String(c).trim(); if (c.length > 10) { closeModal(); onCode(c); } };
  $('#scanIn').addEventListener('keydown', e => { if (e.key === 'Enter') done(e.target.value); });
  $('#camBtn').onclick = async () => {
    if (!('BarcodeDetector' in window)) return toast('Kamera belum didukung browser ini. Pakai scanner/ketik kode.', true);
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); const v = $('#cam'); v.srcObject = camStream; v.hidden = false; await v.play(); camOn = true;
      const det = new BarcodeDetector({ formats: ['qr_code', 'code_128'] });
      (async function loop() { if (!camOn) return; try { const r = await det.detect(v); if (r.length) return done(r[0].rawValue); } catch (e) {} setTimeout(loop, 250); })();
    } catch (e) { toast('Kamera tidak bisa dibuka (izin ditolak?).', true); }
  };
}
async function afterLogin(r) { localStorage.setItem('msm:t', r.data.token); S.token = r.data.token; S.b = r.data.boot; S.tab = ''; S.anak = Math.max(0, (S.b.anak || []).findIndex(a => a.SantriID === r.data.fokus)); Store.set('boot:' + S.b.user.id, S.b); render(); }
// ---------- aksi klik ----------
const A = {
  theme() { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); },
  goHome() { S.view = 'home'; render(); }, goDaftar() { S.view = 'daftar'; render(); },
  goLogin(t) { S.hint = t.dataset && t.dataset.r ? ROLE_LABEL[t.dataset.r] || 'Bendahara' : ''; S.view = 'login'; render(); },
  logout, close: closeModal,
  tab(t) { S.tab = t.dataset.t; if (S.tab === 'notif') api('readNotif'); render(); },
  anak(t) { S.anak = +t.dataset.k; render(); },
  scanLogin() { scanModal(async c => { const r = await call('loginQR', { qr: c }, false); if (r.success) afterLogin(r); }); },
  scan() { scanModal(async c => { const r = await call('scanSantri', { qr: c }, false); if (r.success) A.setor({ dataset: { id: r.data.santriId } }); }); },
  cari(t) { S.q = t.value; clearTimeout(A.ct); A.ct = setTimeout(() => { render(); const i = document.querySelector('[data-act=cari]'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 300); },
  setor(t) {
    const s = S.b.santri.find(x => x.SantriID === t.dataset.id); if (!s) return toast('Santri tidak ditemukan.', true);
    const iq = (S.b.halaqoh.find(h => h.HalaqohID === s.HalaqohID) || {}).Jenis === 'Iqro';
    modal(`<h3>Setoran — ${esc(s.Nama)}</h3><form data-form="setor" data-id="${esc(s.SantriID)}" data-iq="${iq ? 1 : 0}">${iq ? `<label>Jilid (1–6)</label><select name="juz">${opt([1, 2, 3, 4, 5, 6])}</select>` : `<label>Surat</label><select name="surat">${opt(SURAT.map((n, i) => [n, (i + 1) + '. ' + n]))}</select><label>Juz</label><select name="juz">${opt(Array.from({ length: 30 }, (_, i) => i + 1))}</select>`}
    <div class="grid"><div><label>${iq ? 'Dari halaman' : 'Dari ayat'}</label><input name="dari" type="number" min="1" required></div><div><label>${iq ? 'Sampai halaman' : 'Sampai ayat'}</label><input name="sampai" type="number" min="1" required></div></div>
    <label>Ukuran setoran</label><select name="satuan">${opt(['Baris', 'Halaman', 'Lembar'])}</select><label>Nilai</label><select name="nilai">${opt(['Mumtaz', 'Jayyid', 'Maqbul', 'Mardud'])}</select><label>Status</label><select name="status">${opt(['Lanjut', 'Mengulang'])}</select><label>Catatan</label><textarea name="catatan" rows="2"></textarea>
    <button class="btn w">Simpan Setoran</button></form>`);
  },
  editSantri(t) {
    const s = S.b.santri.find(x => x.SantriID === t.dataset.id) || {};
    modal(`<h3>${s.SantriID ? 'Ubah' : 'Tambah'} Santri</h3><form data-form="santri" data-id="${esc(s.SantriID || '')}"><label>Nama</label><input name="Nama" value="${esc(s.Nama)}" required><label>NIS</label><input name="NIS" value="${esc(s.NIS)}"><label>Tempat lahir</label><input name="TempatLahir" value="${esc(s.TempatLahir)}"><label>Tanggal lahir</label><input type="date" name="TanggalLahir" value="${esc(String(s.TanggalLahir || '').slice(0, 10))}"><label>Alamat</label><textarea name="Alamat" rows="2">${esc(s.Alamat)}</textarea><label>Halaqoh</label><select name="HalaqohID"><option value="">—</option>${opt(S.b.halaqoh.map(h => [h.HalaqohID, h.Nama]), s.HalaqohID)}</select>
    <button class="btn w">Simpan</button>${s.SantriID ? `<div class="grid" style="margin-top:8px"><button type="button" class="btn g" data-act="qrSantri" data-id="${esc(s.SantriID)}">QR Santri</button><button type="button" class="btn d" data-act="hapusSantri" data-id="${esc(s.SantriID)}">Hapus</button></div>` : ''}</form>`);
  },
  qrSantri(t) { const s = S.b.santri.find(x => x.SantriID === t.dataset.id); showQR(s.Nama, s.QRToken, 'santri', s.SantriID); },
  userQR(t) { const u = S.b.users.find(x => x.UserID === t.dataset.id); showQR(u.Nama, u.QRToken, 'user', u.UserID); },
  async hapusSantri(t) { if (!confirm('Hapus santri ini? Tindakan tidak bisa dibatalkan.')) return; const r = await call('deleteSantri', { id: t.dataset.id }); if (r.success) { closeModal(); refresh(); } },
  async regen(t) { if (!confirm('Buat ulang barcode? Barcode lama langsung tidak berlaku.')) return; const r = await call('regenQR', { type: t.dataset.type, id: t.dataset.id }); if (r.success) { closeModal(); refresh(); } },
  editHalaqoh(t) {
    const h = S.b.halaqoh.find(x => x.HalaqohID === t.dataset.id) || {};
    modal(`<h3>${h.HalaqohID ? 'Ubah' : 'Tambah'} Halaqoh</h3><form data-form="halaqoh" data-id="${esc(h.HalaqohID || '')}"><label>Nama</label><input name="Nama" value="${esc(h.Nama)}" required><label>Jenis</label><select name="Jenis">${opt([['Quran', "Al-Qur'an"], ['Iqro', 'Iqro']], h.Jenis)}</select><label>Ustadz penanggung jawab</label><select name="UstadzID"><option value="">—</option>${opt(S.b.users.filter(u => u.Role === 'ustadz').map(u => [u.UserID, u.Nama]), h.UstadzID)}</select><label>Keterangan</label><input name="Keterangan" value="${esc(h.Keterangan)}"><button class="btn w">Simpan</button></form>`);
  }
};
function showQR(nama, qr, type, id) {
  modal(`<h3>QR — ${esc(nama)}</h3><div id="qrBig" style="display:grid;place-items:center;padding:12px"></div><p class="mut">Cetak/simpan QR ini untuk kartu. Token acak, tidak berisi NIS.</p><div class="grid"><button class="btn g" data-act="regen" data-type="${type}" data-id="${esc(id)}">Buat Ulang</button><button class="btn" data-act="close">Tutup</button></div>`);
  if (window.QRCode) new QRCode($('#qrBig'), { text: qr, width: 200, height: 200 });
}
document.addEventListener('click', e => { if (e.target.id === 'modal') return closeModal(); const t = e.target.closest('[data-act]'); if (t && t.tagName !== 'INPUT' && A[t.dataset.act]) A[t.dataset.act](t, e); });
document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.act === 'cari') A.cari(e.target); });
// ---------- form ----------
const F = {
  async login(d) { const r = await call('login', d, false); if (r.success) afterLogin(r); },
  async daftar(d, f) {
    const r = await call('register', { nama: d.nama, wa: d.wa, email: d.email, password: d.password, anak: { nama: d.a_nama, nis: d.a_nis, tempatLahir: d.a_tempat, tanggalLahir: d.a_tgl, alamat: d.a_alamat } });
    if (r.success) { S.view = 'login'; render(); }
  },
  async setor(d, f) { const r = await call('setoran', Object.assign({ santriId: f.dataset.id }, d)); if (r.success) { closeModal(); refresh(); } },
  async absen(d) {
    const items = Object.keys(d).filter(k => k.indexOf('s_') === 0).map(k => ({ santriId: k.slice(2), status: d[k] }));
    await call('absensi', { tanggal: d.tanggal, kegiatan: d.kegiatan, items });
  },
  async santri(d, f) { const r = await call('saveSantri', Object.assign({ SantriID: f.dataset.id }, d)); if (r.success) { closeModal(); refresh(); } },
  async halaqoh(d, f) { const r = await call('saveHalaqoh', Object.assign({ HalaqohID: f.dataset.id }, d)); if (r.success) { closeModal(); refresh(); } },
  async approve(d, f, ev) { const tolak = ev.submitter && ev.submitter.name === 'tolak'; if (tolak && !confirm('Tolak pendaftaran ini?')) return; const r = await call('approve', { userId: f.dataset.uid, halaqohId: d.halaqohId, nis: d.nis, tolak }); if (r.success) refresh(); },
  async user(d, f) { const r = await call('saveUser', d); if (r.success) { f.reset(); refresh(); } },
  async atur(d) { const r = await call('savePengaturan', d); if (r.success) refresh(); },
  async info(d, f) { const r = await call('saveInfo', d); if (r.success) f.reset(); }
};
document.addEventListener('submit', async e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault();
  const btn = e.submitter; if (btn) btn.disabled = true;
  try { await F[f.dataset.form](Object.fromEntries(new FormData(f)), f, e); } finally { if (btn) btn.disabled = false; }
});
// ---------- init ----------
(async function init() {
  warmUp(); render();
  if (S.token) { const c = Object.keys(localStorage).find(k => k.indexOf('msm:v1:boot:') === 0); if (c) { try { S.b = JSON.parse(localStorage.getItem(c)); render(); } catch (e) {} } await refresh(); }
  const r = await api('home'); if (r.success) { S.info = r.data; Store.set('info', r.data); if (!S.token) render(); }
})();
