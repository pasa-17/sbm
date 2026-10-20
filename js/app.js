const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rp = n => 'Rp ' + String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const SURAT = "Al-Fatihah|Al-Baqarah|Ali 'Imran|An-Nisa'|Al-Ma'idah|Al-An'am|Al-A'raf|Al-Anfal|At-Taubah|Yunus|Hud|Yusuf|Ar-Ra'd|Ibrahim|Al-Hijr|An-Nahl|Al-Isra'|Al-Kahfi|Maryam|Taha|Al-Anbiya'|Al-Hajj|Al-Mu'minun|An-Nur|Al-Furqan|Asy-Syu'ara'|An-Naml|Al-Qasas|Al-'Ankabut|Ar-Rum|Luqman|As-Sajdah|Al-Ahzab|Saba'|Fatir|Yasin|As-Saffat|Sad|Az-Zumar|Gafir|Fussilat|Asy-Syura|Az-Zukhruf|Ad-Dukhan|Al-Jasiyah|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Az-Zariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqi'ah|Al-Hadid|Al-Mujadalah|Al-Hasyr|Al-Mumtahanah|As-Saff|Al-Jumu'ah|Al-Munafiqun|At-Tagabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqah|Al-Ma'arij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddassir|Al-Qiyamah|Al-Insan|Al-Mursalat|An-Naba'|An-Nazi'at|'Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Insyiqaq|Al-Buruj|At-Tariq|Al-A'la|Al-Gasyiyah|Al-Fajr|Al-Balad|Asy-Syams|Al-Lail|Ad-Duha|Asy-Syarh|At-Tin|Al-'Alaq|Al-Qadr|Al-Bayyinah|Az-Zalzalah|Al-'Adiyat|Al-Qari'ah|At-Takasur|Al-'Asr|Al-Humazah|Al-Fil|Quraisy|Al-Ma'un|Al-Kausar|Al-Kafirun|An-Nasr|Al-Lahab|Al-Ikhlas|Al-Falaq|An-Nas".split('|');
const IC = {
  home: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>', book: '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a7 7 0 0 1 4 6"/>', qr: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>', id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M14 10h4M14 14h4"/>',
  check: '<path d="m5 12 5 5L20 7"/>', cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>', mega: '<path d="M3 11v3l12 5V6zM15 8a4 4 0 0 1 0 8"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/>', copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 14l2 2 4-4"/>', cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  bld: '<path d="M3 21h18M5 21V10l7-6 7 6v11M10 21v-5h4v5"/>', din: '<path d="M17 7 7 17M7 7v10h10"/>', dout: '<path d="M7 17 17 7M7 7h10v10"/>', up: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>', moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>', msg: '<path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', alert: '<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.5"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>', chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', print: '<path d="M7 9V3h10v6M7 17H4v-6h16v6h-3"/><path d="M7 14h10v7H7z"/>',
  chev: '<path d="m6 9 6 6 6-6"/>', cam: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.7 2.5 1.8c0 2.4-5 1.4-5 4 0 1.1 1.1 1.7 2.5 1.7s2.5-.6 2.5-1.5"/>'
};
const ic = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[n] || ''}</svg>`;
const S = { token: localStorage.getItem('msm:t') || '', b: null, info: Store.get('info', null), view: 'home', tab: '', anak: 0, sub: 'saku', staff: false, flt: 'Semua', q: '' };
const ROLE_LABEL = { wali: 'Wali Santri', ustadz: 'Ustadz', admin: 'Administrator', bendahara_spp: 'Bendahara SPP', bendahara_saku: 'Bendahara Uang Saku' };
const TABS = {
  wali: [['beranda', 'home', 'Beranda'], ['hafalan', 'book', 'Hafalan'], ['keu', 'wallet', 'Keuangan'], ['profil', 'user', 'Profil']],
  ustadz: [['setoran', 'book', 'Setoran'], ['absensi', 'check', 'Absensi'], ['izin', 'clip', 'Izin'], ['profil', 'user', 'Profil']],
  bendahara_spp: [['verif', 'shield', 'Verifikasi'], ['transaksi', 'wallet', 'Transaksi'], ['rekap', 'chart', 'Rekap'], ['profil', 'user', 'Profil']],
  bendahara_saku: [['verif', 'shield', 'Verifikasi'], ['transaksi', 'wallet', 'Transaksi'], ['rekap', 'chart', 'Rekap'], ['profil', 'user', 'Profil']],
  admin: [['dasbor', 'home', 'Dasbor'], ['santri', 'users', 'Santri'], ['halaqoh', 'bld', 'Halaqoh'], ['keu', 'wallet', 'Keuangan'], ['atur', 'cog', 'Pengaturan']]
};
const TITLE = { kartu: 'Kartu Santri', absen: 'Absensi', izin: 'Izin Santri', info: 'Informasi', notif: 'Notifikasi' };
// ---------- util ----------
const isStaff = () => ['ustadz', 'bendahara_spp', 'bendahara_saku'].indexOf(S.b.user.role) > -1;
const cur = () => S.b.anak && S.b.anak[S.anak];
const ini = n => String(n || '?').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const avatar = (s, c) => s && s.Foto ? `<img class="av ${c || ''}" src="${s.Foto}" alt="">` : `<div class="av ${c || ''}">${esc(ini(s && (s.Nama || s))) }</div>`;
const bln = p => ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][+String(p).slice(5, 7) - 1] || p;
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function tgl(d) { try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } }
function hijri() { try { return new Intl.DateTimeFormat('id-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch (e) { return ''; } }
function tahunAjaran() { const i = (S.b && S.b.info || S.info || {}).tahunAjaran; if (i) return i; const d = new Date(), y = d.getFullYear(); return d.getMonth() >= 6 ? y + '/' + (y + 1) : (y - 1) + '/' + y; }
function waLink(n, t) { n = String(n || '').replace(/\D/g, '').replace(/^0/, '62'); return n ? 'https://wa.me/' + n + (t ? '?text=' + encodeURIComponent(t) : '') : ''; }
const opt = (list, sel) => list.map(o => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return `<option value="${esc(v)}"${String(v) === String(sel) ? ' selected' : ''}>${esc(l)}</option>`; }).join('');
const radios = (name, list, def, cls) => `<div class="opts ${cls || ''}">${list.map(v => `<label><input type="radio" name="${name}" value="${esc(Array.isArray(v) ? v[0] : v)}"${(Array.isArray(v) ? v[0] : v) === def ? ' checked' : ''}><span>${esc(Array.isArray(v) ? v[1] : v)}</span></label>`).join('')}</div>`;
function toast(m, err) { const t = $('#toast'); t.textContent = m; t.className = 'show' + (err ? ' err' : ''); clearTimeout(toast.t); toast.t = setTimeout(() => t.className = '', 3400); }
function modal(h) { const m = $('#modal'); m.innerHTML = '<div>' + h + '</div>'; m.hidden = false; drawQR(); }
function closeModal() { $('#modal').hidden = true; $('#modal').innerHTML = ''; stopCam(); }
function setTheme(t) { document.documentElement.dataset.theme = t; localStorage.setItem('msm:theme', t); }
setTheme(localStorage.getItem('msm:theme') || 'light');
function drawQR() { document.querySelectorAll('[data-qr]').forEach(el => { if (!el.firstChild && window.QRCode) new QRCode(el, { text: el.dataset.qr, width: +el.dataset.sz || 90, height: +el.dataset.sz || 90 }); }); }
function thumb(file, max, q) {   // kompres foto: kartu/pasfoto ±6 KB, bukti transfer ±200 KB
  return new Promise((res, rej) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => { let w = img.width, h = img.height; const k = max / Math.max(w, h); if (k < 1) { w *= k; h *= k; } const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h);
      let qq = q, d = c.toDataURL('image/jpeg', qq); const lim = max > 400 ? 270000 : 30000; while (d.length > lim && qq > .25) { qq -= .1; d = c.toDataURL('image/jpeg', qq); } URL.revokeObjectURL(u); res(d); };
    img.onerror = () => rej(new Error('Foto tidak bisa dibaca.')); img.src = u;
  });
}
async function call(action, data, okMsg) { const r = await api(action, data); if (!r.success) { toast(r.message || 'Gagal', true); return r; } if (okMsg !== false && r.message) toast(r.message); return r; }
async function refresh() { const r = await api('boot'); if (r.success) { S.b = r.data; Store.set('boot:' + r.data.user.id, r.data); render(); } return r; }
function logout() { localStorage.removeItem('msm:t'); Object.keys(localStorage).filter(k => k.indexOf('msm:v1:boot:') === 0).forEach(k => localStorage.removeItem(k)); S.token = ''; S.b = null; S.view = 'home'; render(); }
window.onExpired = () => { toast('Sesi berakhir, silakan masuk lagi.', true); logout(); };
const pinField = () => `<label class="f">PIN 4 angka</label><input name="pin" type="password" inputmode="numeric" maxlength="4" pattern="\\d{4}" placeholder="••••" required autocomplete="off">`;
// ---------- halaman publik ----------
const V = {
  home() {
    const i = S.info || {}, yt = (i.youtube || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return `<div class="top"><div class="logo">${ic('bld', 22)}</div><div class="brand"><b>Ma'had Sabilul Muttaqin</b><small>Beranda</small></div><button class="ibtn" data-act="theme">${ic('moon')}</button></div>
    <div class="card hero"><span class="pill dk">Aplikasi Santri</span><h1 style="margin:10px 0 6px">Assalamu'alaikum</h1><p class="mut">${esc(i.alamat || 'Salamrejo, Resapombo, Doko, Blitar')}</p><p style="margin:10px 0 16px">Pantau hafalan, absensi, SPP, dan uang saku santri langsung dari HP.</p><button class="btn k w" data-act="goLogin">Masuk ke Portal</button></div>
    ${(i.pengumuman || []).length ? '<div class="sec"><h2>Informasi Terbaru</h2></div>' + i.pengumuman.map(p => `<div class="item"><div class="ib">${ic('mega')}</div><div class="g"><b>${esc(p.Judul)}</b><span class="mut">${tgl(p.Tanggal)}</span><p>${esc(p.Isi)}</p></div></div>`).join('') : ''}
    ${yt ? `<div class="sec"><h2>Video</h2></div><iframe loading="lazy" src="https://www.youtube.com/embed/${yt[1]}" allowfullscreen></iframe>` : ''}
    <p class="mut c" style="margin-top:28px">© ${new Date().getFullYear()} Ma'had Sabilul Muttaqin</p>`;
  },
  login() {
    const st = S.staff, i = S.info || {}, wc = waLink(i.wa_admin, 'Assalamu\'alaikum, saya wali santri ingin bertanya.');
    return `<div class="top"><div class="logo">${ic('bld', 22)}</div><div class="brand"><b>Ma'had Sabilul Muttaqin</b><small>Portal ${st ? 'Staf & Ustadz' : 'Wali Santri'}</small></div><button class="btn m sm" data-act="swStaff">${ic('users', 15)} ${st ? 'Portal Wali' : 'Staf & Ustadz'}</button></div>
    <div class="c" style="margin:14px 0 18px"><span class="accpill">${ic('shield', 14)} Akses resmi ${st ? 'staf & ustadz' : 'wali santri'}</span><h1 style="margin:14px 0 8px">Selamat Datang${st ? '' : ',<br>Bapak/Ibu'}</h1><p class="mut">${st ? 'Masuk untuk mengelola hafalan, absensi, dan keuangan santri.' : 'Pantau tahfidz, kehadiran halaqoh, dan administrasi ananda secara transparan.'}</p></div>
    <form class="card" data-form="login"><label class="f">${st ? 'Username' : 'Nomor Induk Santri (NIS) / Email Wali'}</label><div class="fld">${ic('id', 18)}<input name="username" required autocomplete="username" placeholder="${st ? 'Username' : 'Contoh: 202409101 atau email wali'}"></div>
    <div style="display:flex;justify-content:space-between"><label class="f">Kata Sandi</label><button type="button" class="lnk" data-act="lupa">Lupa Sandi?</button></div><div class="fld">${ic('lock', 18)}<input name="password" id="pw" type="password" required autocomplete="current-password" placeholder="Masukkan kata sandi"><button type="button" class="eye" data-act="eye">${ic('eye', 18)}</button></div>
    <button class="btn w">${ic('out', 18)} Masuk ke Portal ${st ? '' : 'Wali'}</button><p class="mut c" style="margin:12px 0 8px;font-weight:700;letter-spacing:.1em">ATAU PINDAI QR</p><button type="button" class="btn m w" data-act="scanLogin">${ic('qr', 18)} Login via Kartu ${st ? 'Staf' : 'Santri Digital'}</button></form>
    ${st ? '' : `<div class="card" style="background:var(--mint)"><p class="c" style="margin-bottom:10px">Belum terdaftar sebagai Wali Santri?</p><button class="btn s w" data-act="goDaftar">${ic('user', 18)} Daftar Akun Wali Santri</button></div>
    <div class="card"><h3 style="margin-bottom:12px">${ic('shield', 18)} Layanan Khusus Wali Santri</h3><div class="grid"><div class="box"><b>Hafalan & Ziyadah</b><p class="mut">Update capaian tahfidz & murajaah harian ananda.</p></div><div class="box"><b>SPP & Uang Saku</b><p class="mut">Cek tagihan, konfirmasi transfer, dan saldo secara real-time.</p></div></div>
    ${wc ? `<a class="btn m w" style="margin-top:12px" href="${wc}" target="_blank" rel="noopener">${ic('msg', 18)} Hubungi Admin Ma'had</a>` : ''}</div>`}
    <p class="mut c" style="margin-top:20px"><button class="lnk" data-act="goHome">← Kembali ke beranda</button></p>`;
  },
  daftar() {
    const sec = (n, t, s) => `<div style="display:flex;gap:10px;align-items:center;margin:10px 0 12px"><span class="ib" style="width:32px;height:32px;border-radius:50%;font-weight:800">${n}</span><div><h3>${t}</h3><span class="mut">${s}</span></div></div>`;
    return `<div class="top"><button class="ibtn" data-act="goLogin">${ic('chev', 22).replace('<svg', '<svg style="transform:rotate(90deg)"')}</button><div class="brand"><b>Pendaftaran Wali Santri</b><small>Ma'had Sabilul Muttaqin</small></div></div>
    <div class="card hero c"><span class="ib" style="margin:0 auto 10px;background:var(--gold2);color:#4e3d00;border-radius:50%">${ic('bld', 22)}</span><span class="lbl gold">Gerbang penerimaan santri baru</span><h2 style="margin:6px 0">Daftar Akun Wali Santri</h2><p class="mut">Pendaftaran mandiri orang tua/wali untuk akses portal pemantauan hafalan, absensi, dan keuangan.</p></div>
    <form data-form="daftar" class="card">${sec(1, 'Data Diri Wali Santri', 'Identitas penanggung jawab resmi')}
    <label class="f">Nama Lengkap & Gelar</label><input name="nama" required placeholder="Contoh: H. Bambang Irawan, S.T."><label class="f">Hubungan dengan Santri</label>${radios('hubungan', ['Ayah Kandung', 'Ibu Kandung', 'Wali / Kerabat'], 'Ayah Kandung')}
    <label class="f">Nomor WhatsApp Aktif</label><input name="wa" inputmode="tel" required placeholder="0812 3456 7890"><label class="f">Email Aktif</label><input name="email" type="email" required placeholder="nama.wali@email.com">
    <label class="f">Kata Sandi (min. 8 karakter)</label><input name="password" type="password" minlength="8" required><label class="f">Konfirmasi Kata Sandi</label><input name="password2" type="password" minlength="8" required>
    ${sec(2, 'Data Santri (Anak ke-1)', 'Calon peserta didik ma\'had')}
    <label class="f">Nama Lengkap Santri</label><input name="a_nama" required placeholder="Contoh: Muhammad Rayhan Al-Fatih"><label class="f">NIS / No. Registrasi (opsional)</label><input name="a_nis"><label class="f">Tempat Lahir</label><input name="a_tempat"><label class="f">Tanggal Lahir</label><input name="a_tgl" type="date">
    <label class="f">Jenis Kelamin Santri</label>${radios('a_jk', [['L', 'Santri Putra'], ['P', 'Santri Putri']], 'L')}
    <label class="f">Pasfoto Santri (3x4, JPG/PNG)</label><input name="a_foto" type="file" accept="image/*">
    ${sec(3, 'Alamat & Domisili Keluarga', 'Untuk surat & pengiriman rapor')}<textarea name="a_alamat" rows="3" placeholder="Nama jalan, RT/RW, Desa, Kecamatan, Kabupaten"></textarea>
    <label style="display:flex;gap:10px;align-items:flex-start;margin:6px 0 14px"><input type="checkbox" required style="width:auto;margin:3px 0"><span class="mut">Saya menyatakan data yang diisi adalah benar dan bersedia mematuhi tata tertib ma'had.</span></label>
    <button class="btn w">Kirim Pendaftaran Akun</button><div class="box" style="margin-top:12px;display:flex;gap:10px;align-items:center">${ic('shield', 20)}<span class="mut"><b>Verifikasi 1x24 jam kerja.</b> Admin akan mencocokkan data lalu menempatkan santri di halaqoh.</span></div>
    <p class="c mut" style="margin-top:14px">Sudah punya akun? <button type="button" class="lnk" data-act="goLogin">Masuk ke Portal Wali</button></p></form>`;
  }
};
// ---------- komponen bersama ----------
function transferCard(t) {
  return `<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div><span class="pill">${t.Jenis === 'SPP' ? 'SPP' : 'TOP-UP UANG SAKU'}</span><div class="big amt" style="font-size:22px;margin-top:6px">${rp(t.Nominal)}</div><span class="mut">${esc(t.TglTransfer || '')}</span></div><span class="pill warn">Perlu cek</span></div>
  <div class="box" style="margin:12px 0"><div class="row"><span class="mut">Santri</span><b>${esc(t.Santri)}</b></div><div class="row"><span class="mut">NIS & Halaqoh</span><span>${esc(t.NIS || '-')} • ${esc(t.Halaqoh || '-')}</span></div><div class="row"><span class="mut">Wali Santri</span><span>${esc(t.Wali)}</span></div>${t.Catatan ? `<div class="row"><span class="mut">Catatan</span><span>${esc(t.Catatan)}</span></div>` : ''}</div>
  <div class="grid"><button class="btn m" data-act="bukti" data-id="${esc(t.ID)}">${ic('eye', 16)} Lihat Bukti</button><span></span><button class="btn m" data-act="tolak" data-id="${esc(t.ID)}">${ic('x', 16)} Tolak</button><button class="btn" data-act="terima" data-id="${esc(t.ID)}" data-j="${esc(t.Jenis)}">${ic('check', 16)} Terima</button></div></div>`;
}
function izinCards(list, aksi) {
  return list.map(z => `<div class="card"><div style="display:flex;justify-content:space-between;gap:8px"><div><b>${esc(z.Santri || '')}</b><div class="mut">${esc(z.Jenis)} • ${esc(String(z.Mulai).slice(0, 10))} s.d. ${esc(String(z.Selesai).slice(0, 10))}</div></div><span class="pill warn">${esc(z.Status)}</span></div><p style="margin:8px 0">${esc(z.Alasan)}</p>${aksi ? `<div class="grid"><button class="btn m" data-act="izinPutus" data-id="${esc(z.ID)}" data-s="0">Tolak</button><button class="btn" data-act="izinPutus" data-id="${esc(z.ID)}" data-s="1">Setujui</button></div>` : ''}</div>`).join('');
}
const empty = t => `<div class="card c mut">${esc(t)}</div>`;
// ---------- halaman portal ----------
const PG = {};
Object.assign(PG, {
  // ===== WALI =====
  beranda() {
    const a = cur(); if (!a) return empty('Belum ada data santri.'); const b = S.b, i = b.info, ju = a.juz.length, pct = Math.round(ju / 30 * 100), last = a.hafalan[0];
    const abs = a.absensi.filter(x => String(x.Tanggal).slice(0, 10) === today()), hadir = abs.filter(x => x.Status === 'H').length, iz = a.izin[0], wl = waLink(i.wa_spp, 'Assalamu\'alaikum, saya wali ' + a.Nama + ' ingin bertanya tentang SPP.');
    const tile = (act, icn, t, sub, cls, d) => `<button class="tile ${cls || ''}" data-act="${act}" ${d || ''}><div class="ib ${cls === 'warn' ? 'y' : ''}">${ic(icn, 22)}</div><b>${t}</b><small>${esc(sub)}</small></button>`;
    const sakuSt = a.saldo === 0 ? 'Habis' : a.saldo <= i.saldoMin ? 'Menipis' : 'Aman (Cukup)';
    return `<div class="chips"><span class="chip">Tahun Ajaran ${esc(tahunAjaran())}</span><span class="chip n">${ic('cal', 14)} ${esc(hijri())}</span></div>
    <div class="greet"><div><small>Ahlan wa Sahlan,</small><h1>${esc(b.user.nama.split(' ').slice(0, 2).join(' '))}</h1></div>${b.anak.length > 1 ? `<button class="sw" data-act="nextAnak">${avatar(a, 'sm')}<span>${esc(a.Nama.split(' ')[0])}<small>${esc(a.Halaqoh)}</small></span>${ic('chev', 16)}</button>` : ''}</div>
    <div class="card hero"><div style="display:flex;justify-content:space-between;align-items:center"><span class="lbl">${ic('id', 14)} Kartu Identitas Santri</span><span class="pill dk">${esc(a.Status)}</span></div>
    <div class="hrow" style="margin-top:12px">${avatar(a, 'xl')}<div><h2>${esc(a.Nama)}</h2><span class="mut">NIS ${esc(a.NIS || '-')} • ${a.JK === 'P' ? 'Putri' : 'Putra'}</span><div class="gold" style="font-weight:700;font-size:13px;margin-top:4px">${esc(a.Halaqoh)}</div></div></div>
    <div class="foot"><div><small>Ustadz Pembimbing</small><div style="font-weight:700">${esc(a.Ustadz || '-')}</div></div><button class="btn l sm" data-act="tab" data-t="kartu">Lihat Kartu Santri ›</button></div></div>
    <div class="sec"><h2>Layanan Utama</h2></div><div class="grid g3">
    ${tile('tab', 'book', 'Hafalan Qur\'an', 'Juz ' + ju + ' (' + pct + '%)', '', 'data-t="hafalan"')}${tile('tab', 'home', 'Absensi', abs.length ? hadir + '/' + abs.length + ' hadir hari ini' : 'Belum ada data', '', 'data-t="absen"')}
    ${tile('keu', 'coin', 'Keuangan SPP', a.sppLunas ? 'Lunas ' + bln(b.periode).slice(0, 3) : 'Belum lunas', a.sppLunas ? '' : 'warn', 'data-v="spp"')}${tile('tab', 'clip', 'Izin Santri', iz ? iz.Status : 'Ajukan izin', '', 'data-t="izin"')}
    ${tile('tab', 'mega', 'Informasi', (i.pengumuman || []).length + ' pengumuman', '', 'data-t="info"')}${tile('keu', 'wallet', 'Uang Saku', rp(a.saldo), a.saldo <= i.saldoMin ? 'bad' : '', 'data-v="saku"')}</div>
    <div class="sec"><h2>Capaian Tahfidz</h2><span class="pill ok">${ju} dari 30 juz</span></div>
    <div class="card"><span class="mut" style="font-weight:700;letter-spacing:.05em">JUZ TERCAPAI</span><div style="display:flex;justify-content:space-between;align-items:flex-end;margin:4px 0 8px"><h2>Juz yang sudah disetor</h2><div class="amt" style="font-size:32px">${pct}<small style="font-size:16px">%</small></div></div><div class="prog"><i style="width:${pct}%"></i></div>
    ${last ? `<div class="box item" style="box-shadow:none;margin-top:14px"><div class="ib">${ic('book')}</div><div class="g"><b>${esc(last.Surat || 'Iqro jilid ' + last.Juz)} (${esc(last.Dari)}–${esc(last.Sampai)})</b><span class="mut">Setoran ${tgl(last.Tanggal)}</span></div><span class="pill gold">${esc(last.Nilai)}</span></div>${last.Catatan ? `<div class="row"><div class="ib">${ic('msg', 18)}</div><div class="g"><span class="mut">Catatan Ustadz</span><i>"${esc(last.Catatan)}"</i></div></div>` : ''}` : '<p class="mut" style="margin-top:12px">Belum ada setoran tercatat.</p>'}</div>
    <div class="sec"><h2>Ringkasan Finansial</h2></div><div class="grid"><div class="card" style="margin:0"><span class="mut">Uang Saku</span><div class="amt" style="font-size:24px;margin:4px 0">${rp(a.saldo)}</div><span class="pill ${a.saldo <= i.saldoMin ? 'bad' : 'ok'}">Status: ${sakuSt}</span><button class="btn m w sm" style="margin-top:10px" data-act="konfWali" data-j="Saku">${ic('plus', 14)} Top Up Saldo</button></div>
    <div class="card" style="margin:0"><span class="mut">SPP ${esc(bln(b.periode))}</span><div class="amt" style="font-size:24px;margin:4px 0;color:${a.sppLunas ? '#047857' : 'var(--danger)'}">${a.sppLunas ? 'LUNAS' : 'BELUM'}</div><span class="mut">${a.sppLunas ? 'Alhamdulillah, tercatat' : 'Segera lakukan pembayaran'}</span>${a.sppLunas || !wl ? `<button class="btn m w sm" style="margin-top:10px" data-act="keu" data-v="spp">Lihat Riwayat</button>` : `<a class="btn m w sm" style="margin-top:10px" href="${wl}" target="_blank" rel="noopener">Hubungi Bendahara</a>`}</div></div>
    ${(i.pengumuman || [])[0] ? `<div class="item" style="margin-top:18px;background:var(--mint)"><div class="ib">${ic('mega')}</div><div class="g"><b>${esc(i.pengumuman[0].Judul)}</b><span class="mut">${esc(String(i.pengumuman[0].Isi).slice(0, 80))}</span></div></div>` : ''}`;
  },
  hafalan() {
    const a = cur(); if (!a) return ''; return `<div class="sec"><h2>Capaian Juz</h2><span class="pill ok">${a.juz.length}/30</span></div><div class="card"><div class="juz">${Array.from({ length: 30 }, (_, k) => `<span class="${a.juz.indexOf(k + 1) > -1 ? 'on' : ''}">${k + 1}</span>`).join('')}</div></div>
    <div class="sec"><h2>Riwayat Setoran</h2></div>${a.hafalan.length ? '<div class="card">' + a.hafalan.map(h => `<div class="row"><div class="ib">${ic('book', 20)}</div><div class="g"><b>${esc(h.Surat || 'Iqro jilid ' + h.Juz)}</b><span class="mut">${tgl(h.Tanggal)} • ${esc(h.Dari)}–${esc(h.Sampai)} ${esc(h.Satuan)}</span></div><div class="r"><span class="pill gold">${esc(h.Nilai)}</span><div class="mut">${esc(h.Status)}</div></div></div>`).join('') + '</div>' : empty('Belum ada setoran.')}${PG.absen()}`;
  },
  absen() { const a = cur(); return '<div class="sec"><h2>Absensi Terakhir</h2></div>' + (a && a.absensi.length ? '<div class="card">' + a.absensi.map(x => `<div class="row"><div class="g"><b>${esc(x.Kegiatan)}</b><span class="mut">${tgl(x.Tanggal)}</span></div><span class="pill ${x.Status === 'H' ? 'ok' : x.Status === 'A' ? 'bad' : 'warn'}">${{ H: 'Hadir', I: 'Izin', S: 'Sakit', A: 'Alpa' }[x.Status] || esc(x.Status)}</span></div>`).join('') + '</div>' : empty('Belum ada data absensi.')); },
  info() { const l = S.b.info.pengumuman || []; return '<div class="sec"><h2>Informasi</h2></div>' + (l.length ? l.map(p => `<div class="item"><div class="ib">${ic('mega')}</div><div class="g"><b>${esc(p.Judul)}</b><span class="mut">${tgl(p.Tanggal)}</span><p>${esc(p.Isi)}</p></div></div>`).join('') : empty('Belum ada informasi.')); },
  kartu() {
    const a = cur(); if (!a) return '';
    return `<div class="sec" style="margin-top:6px"><div><span class="chip n" style="color:var(--sec)">IDENTITAS RESMI SANTRI</span><h1 style="font-size:26px">Kartu Santri Digital</h1></div></div>
    <div class="ktp"><div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center;margin-bottom:6px"><div style="flex:1"><small>Ma'had Sabilul Muttaqin</small><b style="font-size:15px">KARTU SANTRI</b></div></div><div class="hrow" style="align-items:flex-start">${avatar(a, 'xl')}<div style="min-width:0"><h3>${esc(a.Nama)}</h3><small>NIS</small><b class="n">${esc(a.NIS || '-')}</b><small style="margin-top:4px">Halaqoh</small>${esc(a.Halaqoh)}<small style="margin-top:4px">Wali Santri</small>${esc(S.b.user.nama)}</div></div></div><div class="qr" data-qr="${esc(a.QRToken)}" data-sz="78"></div></div>
    <p class="mut c" style="margin:10px 0">Tunjukkan QR ini ke scanner pos santri atau untuk masuk cepat.</p>
    <div class="fl"><button data-act="print">${ic('print', 16)} Cetak Fisik</button><button data-act="kirimKartu">${ic('msg', 16)} Kirim ke WhatsApp</button><button data-act="gantiFoto">${ic('cam', 16)} Ganti Foto</button></div>
    <div class="card"><div class="hrow"><div class="ib">${ic('id', 22)}</div><div><h3>Detail Legalitas & Validasi</h3><span class="mut">Status tercatat di database Ma'had</span></div></div><div class="box" style="margin-top:12px"><div class="row"><span class="mut">Status Santri</span><span class="pill ok">${esc(a.Status)}</span></div><div class="row"><span class="mut">Halaqoh</span><b>${esc(a.Halaqoh)}</b></div><div class="row"><span class="mut">Ustadz Pembimbing</span><b>${esc(a.Ustadz || '-')}</b></div><div class="row"><span class="mut">Jenis Setoran</span><b>${a.Jenis === 'Iqro' ? 'Iqro' : 'Al-Qur\'an'}</b></div></div></div>
    <div class="card" style="background:var(--mint);display:flex;gap:12px;align-items:center"><div class="ib" style="background:#fff">${ic('qr', 22)}</div><div style="flex:1"><h3>Gerbang & Presensi Cepat</h3><span class="mut">Dekatkan layar ke scanner pos santri</span></div><button class="btn sm" data-act="bigQR">Maksimalkan</button></div>`;
  },
  izin() {
    const a = cur(), b = S.b;
    if (b.user.role !== 'wali') return `<div class="sec"><h2>Pengajuan Izin</h2></div>${(b.izin || []).length ? izinCards(b.izin, true) : empty('Tidak ada pengajuan izin yang menunggu.')}`;
    return `<div class="sec"><h2>Izin Santri</h2></div><form class="card" data-form="izin"><label class="f">Jenis izin</label><select name="jenis">${opt(['Sakit', 'Pulang', 'Keperluan Keluarga', 'Lainnya'])}</select><div class="grid"><div><label class="f">Mulai</label><input type="date" name="mulai" value="${today()}" required></div><div><label class="f">Sampai</label><input type="date" name="selesai" value="${today()}" required></div></div><label class="f">Alasan</label><textarea name="alasan" rows="2" required></textarea><button class="btn w">Ajukan Izin untuk ${esc(a ? a.Nama.split(' ')[0] : '')}</button></form>
    <div class="sec"><h2>Riwayat Izin</h2></div>${a && a.izin.length ? '<div class="card">' + a.izin.map(z => `<div class="row"><div class="g"><b>${esc(z.Jenis)}</b><span class="mut">${esc(String(z.Mulai).slice(0, 10))} s.d. ${esc(String(z.Selesai).slice(0, 10))}</span></div><span class="pill ${z.Status === 'Disetujui' ? 'ok' : z.Status === 'Ditolak' ? 'bad' : 'warn'}">${esc(z.Status)}</span></div>`).join('') + '</div>' : empty('Belum ada pengajuan.')}`;
  },
  notif() { return '<div class="sec"><h2>Notifikasi</h2></div>' + (S.b.notif.length ? '<div class="card">' + S.b.notif.map(n => `<div class="row"><div class="ib ${n.Dibaca ? '' : 'y'}">${ic('bell', 20)}</div><div class="g"><b>${esc(n.Judul)}</b><span class="mut">${esc(n.Isi)}</span></div></div>`).join('') + '</div>' : empty('Belum ada notifikasi.')); },
  profil() {
    const b = S.b, u = b.user;
    return `<div class="card hero"><div class="hrow">${avatar(u.nama, 'xl')}<div><h2>${esc(u.nama)}</h2><span class="pill dk">${ROLE_LABEL[u.role]}</span></div></div></div>
    ${u.role === 'wali' ? '<div class="sec"><h2>Santri Anda</h2></div><div class="card">' + b.anak.map(a => `<div class="row">${avatar(a, 'sm')}<div class="g"><b>${esc(a.Nama)}</b><span class="mut">NIS ${esc(a.NIS || '-')} • ${esc(a.Halaqoh)}</span></div><span class="pill ${a.Status === 'Aktif' ? 'ok' : ''}">${esc(a.Status)}</span></div>`).join('') + '</div>' : ''}
    <div class="card"><div class="row" style="cursor:pointer" data-act="tab" data-t="notif"><div class="ib">${ic('bell')}</div><div class="g"><b>Notifikasi</b></div>${b.notif.filter(n => !n.Dibaca).length ? `<span class="pill bad">${b.notif.filter(n => !n.Dibaca).length} baru</span>` : ''}</div><div class="row" style="cursor:pointer" data-act="theme"><div class="ib">${ic('moon')}</div><div class="g"><b>Mode Terang / Gelap</b></div></div></div>
    ${isStaff() ? `<form class="card" data-form="pin"><h3>${ic('lock', 18)} PIN Otorisasi ${u.pin ? '<span class="pill ok">aktif</span>' : '<span class="pill warn">belum dibuat</span>'}</h3><p class="mut" style="margin:4px 0 8px">PIN 4 angka diminta setiap menyimpan data penting.</p>${u.pin ? '<label class="f">PIN lama</label><input name="lama" type="password" inputmode="numeric" maxlength="4">' : ''}<label class="f">PIN baru</label><input name="pin" type="password" inputmode="numeric" maxlength="4" pattern="\\d{4}" required><button class="btn w">Simpan PIN</button></form>` : ''}
    ${u.role.indexOf('bendahara') === 0 ? rekForm(b.rek, 'Rekening Tujuan Transfer') : ''}
    <button class="btn g w" data-act="logout">${ic('out', 18)} Keluar</button>`;
  },
  keu() {
    const r = S.b.user.role; if (r === 'admin') return keuAdmin(); const a = cur(); if (!a) return ''; const i = S.b.info, saku = S.sub !== 'spp';
    const seg = `<div class="seg"><button class="${saku ? 'on' : ''}" data-act="sub" data-v="saku">Uang Saku Digital</button><button class="${saku ? '' : 'on'}" data-act="sub" data-v="spp">SPP Bulanan</button></div>`;
    const kid = `<div class="greet" style="margin:4px 0 10px"><div class="hrow">${avatar(a, 'sm')}<div><b style="font-size:16px">${esc(a.Nama)}</b><div class="mut">${esc(a.Halaqoh)} • NIS ${esc(a.NIS || '-')}</div></div></div>${S.b.anak.length > 1 ? `<button class="btn m sm" data-act="nextAnak">Ganti</button>` : ''}</div>`;
    const rk = saku ? S.b.rek.saku : S.b.rek.spp, rekC = rk && rk.norek ? `<div class="card"><div class="hrow"><div class="ib" style="font-weight:800">${esc((rk.bank || 'BANK').slice(0, 4))}</div><div><span class="mut">Rekening resmi Ma'had</span><h3>${esc(rk.bank)}</h3></div></div><div class="box" style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;gap:8px"><div><span class="mut">Nomor Rekening</span><div class="amt" style="font-size:20px">${esc(rk.norek)}</div><span class="mut">a.n. ${esc(rk.an)}</span></div><button class="btn m sm" data-act="salin" data-v="${esc(rk.norek)}">${ic('copy', 14)} Salin</button></div></div>` : empty('Rekening tujuan transfer belum diatur bendahara.');
    const pend = a.transfer.filter(t => t.Status === 'Menunggu' && (saku ? t.Jenis === 'Saku' : t.Jenis === 'SPP')).length;
    const konf = `<button class="btn w" data-act="konfWali" data-j="${saku ? 'Saku' : 'SPP'}">${ic('up', 18)} Konfirmasi Bukti Transfer ${pend ? '<span class="dot"></span>' : ''}</button>`;
    const stt = t => `<span class="pill ${t.Status === 'Diterima' ? 'ok' : t.Status === 'Ditolak' ? 'bad' : 'warn'}">${t.Status === 'Menunggu' ? 'Menunggu verifikasi' : esc(t.Status)}</span>`;
    const trf = a.transfer.filter(t => t.Jenis === (saku ? 'Saku' : 'SPP') && t.Status !== 'Diterima');
    if (saku) return kid + seg + `<div class="card hero"><div style="display:flex;justify-content:space-between"><span class="lbl">${ic('wallet', 14)} Dompet Kartu Santri</span><span class="pill ${a.saldo <= i.saldoMin ? 'bad' : 'dk'}">${a.saldo === 0 ? 'Habis' : a.saldo <= i.saldoMin ? 'Menipis' : 'Aman'}</span></div><span class="lbl" style="display:block;margin-top:14px">Total Saldo Aktif</span><div class="big">${rp(a.saldo)}</div><button class="btn k w" style="margin-top:14px" data-act="konfWali" data-j="Saku">${ic('plus', 18)} Top Up Saldo</button></div>${rekC}${konf}
      <div class="sec"><h2>Riwayat Transaksi</h2></div><div class="card">${trf.map(t => `<div class="row"><div class="ib">${ic('up', 20)}</div><div class="g"><b>Konfirmasi top up</b><span class="mut">${tgl(t.Waktu)}</span></div><div class="r"><div class="amt">${rp(t.Nominal)}</div>${stt(t)}</div></div>`).join('')}${a.saku.map(k => `<div class="row"><div class="ib ${k.Jenis === 'Setor' ? 'in' : 'r'}">${ic(k.Jenis === 'Setor' ? 'din' : 'dout', 20)}</div><div class="g"><b>${k.Jenis === 'Setor' ? 'Setoran Uang Saku' : 'Penarikan Uang Saku'}</b><span class="mut">${tgl(k.Waktu)}${k.Keterangan ? ' • ' + esc(k.Keterangan) : ''}</span></div><div class="r"><div class="amt ${k.Jenis === 'Setor' ? 'in' : 'out'}">${k.Jenis === 'Setor' ? '+' : '-'}${rp(k.Nominal)}</div><span class="mut">Saldo ${rp(k.Saldo)}</span></div></div>`).join('') || (trf.length ? '' : '<p class="mut c">Belum ada transaksi.</p>')}</div>`;
    const wl = waLink(i.wa_spp, 'Assalamu\'alaikum, saya wali ' + a.Nama + ' ingin bertanya tentang SPP ' + bln(S.b.periode) + '.');
    return kid + seg + `${a.sppLunas ? '' : `<div class="banner"><span>${ic('alert', 22)}</span><div class="g"><b>SPP ${esc(bln(S.b.periode))} belum lunas</b></div>${wl ? `<a class="btn sm" href="${wl}" target="_blank" rel="noopener">${ic('msg', 14)} WA</a>` : ''}</div>`}
      <div class="card hero"><span class="lbl">SPP ${esc(bln(S.b.periode))} ${esc(S.b.periode.slice(0, 4))}</span><div class="big">${a.sppLunas ? 'LUNAS' : 'BELUM LUNAS'}</div></div>${rekC}${konf}
      <div class="sec"><h2>Riwayat SPP</h2></div><div class="card">${trf.map(t => `<div class="row"><div class="ib">${ic('up', 20)}</div><div class="g"><b>Konfirmasi transfer SPP</b><span class="mut">${tgl(t.Waktu)}</span></div><div class="r"><div class="amt">${rp(t.Nominal)}</div>${stt(t)}</div></div>`).join('')}${a.spp.map(p => `<div class="row"><div class="ib in">${ic('check', 20)}</div><div class="g"><b>Pembayaran SPP ${esc(bln(p.Periode))}</b><span class="mut">${tgl(p.Tanggal)} • ${esc(p.Sumber)}</span></div><div class="r"><div class="amt">${rp(p.Nominal)}</div><span class="pill ok">Lunas</span></div></div>`).join('') || (trf.length ? '' : '<p class="mut c">Belum ada pembayaran tercatat.</p>')}</div>`;
  }
});
function rekForm(r, t) { r = r || {}; return `<form class="card" data-form="rek"><h3>${esc(t)}</h3><label class="f">Nama bank</label><input name="bank" value="${esc(r.bank)}" placeholder="Bank Syariah Indonesia"><label class="f">Nomor rekening</label><input name="norek" value="${esc(r.norek)}" inputmode="numeric"><label class="f">Atas nama</label><input name="an" value="${esc(r.an)}"><button class="btn w">Simpan Rekening</button></form>`; }
// ===== USTADZ =====
Object.assign(PG, {
  setoran() {
    const b = S.b, sudah = b.setorHariIni, q = S.q.toLowerCase(), f = S.flt, hq = b.halaqoh.map(h => h.Nama + ' (' + h.Jenis + ')').join(', ') || 'Belum ada halaqoh';
    const l = b.santri.filter(s => (s.Nama + s.NIS).toLowerCase().indexOf(q) > -1 && (f === 'Semua' || (f === 'Sudah Setor') === (sudah.indexOf(s.SantriID) > -1)));
    const n1 = b.santri.filter(s => sudah.indexOf(s.SantriID) > -1).length;
    return `<div class="banner"><span>${ic('bell', 20)}</span><div class="g">Waktunya halaqoh, silakan input setoran hafalan.</div></div>
    <div class="card hero"><span class="pill dk">${ic('check', 12)} Sesi aktif</span><h2 style="margin:8px 0 2px">${esc(hq)}</h2><span class="mut">${esc(b.user.nama)}</span><button class="btn k w" style="margin-top:14px" data-act="scan">${ic('qr', 18)} Scan Kartu Santri (Presensi Cepat)</button></div>
    <input data-act="cari" value="${esc(S.q)}" placeholder="Cari nama santri atau NIS…"><div class="fl">${[['Semua', b.santri.length], ['Sudah Setor', n1], ['Belum Setor', b.santri.length - n1]].map(x => `<button class="${f === x[0] ? 'on' : ''}" data-act="flt" data-v="${x[0]}">${x[0]} (${x[1]})</button>`).join('')}</div>
    <div class="sec"><h3 class="mut" style="font-size:11px;letter-spacing:.06em">DAFTAR SANTRI HALAQOH</h3></div>${l.map(s => `<div class="item">${avatar(s)}<div class="g"><b>${esc(s.Nama)}</b><span class="mut">NIS: ${esc(s.NIS || '-')}</span></div>${sudah.indexOf(s.SantriID) > -1 ? '<span class="pill ok">Sudah setor</span>' : '<span class="pill bad">Belum setor</span>'}<button class="btn sm" data-act="setor" data-id="${esc(s.SantriID)}">Input</button></div>`).join('') || empty('Tidak ada santri.')}`;
  },
  absensi() {
    return `<div class="sec"><h2>Absensi Harian</h2></div><form class="card" data-form="absen"><div class="grid"><div><label class="f">Kegiatan</label><select name="kegiatan">${opt(['Tahajud', 'Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Halaqoh'])}</select></div><div><label class="f">Tanggal</label><input type="date" name="tanggal" value="${today()}"></div></div>
    ${S.b.santri.map(s => `<div class="row">${avatar(s, 'sm')}<div class="g"><b>${esc(s.Nama)}</b></div><select name="s_${esc(s.SantriID)}" style="width:105px;margin:0">${opt([['H', 'Hadir'], ['I', 'Izin'], ['S', 'Sakit'], ['A', 'Alpa']])}</select></div>`).join('')}${pinField()}<button class="btn w">Simpan Absensi</button></form>`;
  }
});
// ===== BENDAHARA =====
const isSpp = () => S.b.user.role === 'bendahara_spp';
function perhatian() {
  const b = S.b, min = b.info.saldoMin, sp = isSpp(), l = sp ? b.santri.filter(s => !s.lunas) : b.santriSaldo.filter(s => s.saldo <= min);
  const f = S.flt; const lst = l.slice(0, 40);
  return `<div class="sec"><div><h2>Perhatian Keuangan Santri</h2><span class="mut">${sp ? 'Tunggakan SPP ' + esc(bln(b.periode)) : 'Saldo kritis (≤ ' + rp(min) + ')'} butuh tindak lanjut wali</span></div></div>
  ${lst.map(s => { const w = waLink(s.WA, sp ? 'Assalamu\'alaikum, kami dari bendahara SPP Ma\'had. SPP ' + s.Nama + ' periode ' + bln(b.periode) + ' belum tercatat. Mohon dilunasi. Jazakumullah.' : 'Assalamu\'alaikum, saldo uang saku ' + s.Nama + ' tinggal ' + rp(s.saldo) + '. Mohon top up. Jazakumullah.'); return `<div class="item"><div class="ib r">${ic('alert', 20)}</div><div class="g"><b>${esc(s.Nama)}</b><span class="mut">NIS: ${esc(s.NIS || '-')} • ${sp ? 'Belum lunas' : 'Sisa ' + rp(s.saldo)}</span></div>${w ? `<a class="btn m sm" href="${w}" target="_blank" rel="noopener">${ic(sp ? 'send' : 'msg', 14)} ${sp ? 'Tagih Wali' : 'Notif WA'}</a>` : ''}</div>`; }).join('') || empty('Tidak ada yang perlu ditindaklanjuti.')}`;
}
Object.assign(PG, {
  verif() {
    const b = S.b, n = b.transfer.length;
    return `${n ? `<div class="banner d"><span>${ic('mega', 22)}</span><div class="g"><b>AMANAH REKAP</b><br>Terdapat <b>${n} konfirmasi transfer</b> santri yang perlu diverifikasi segera.</div></div>` : ''}
    <div class="card"><div class="hrow"><div class="ib">${ic('qr', 22)}</div><div style="flex:1"><h3>Loket Kasir & Teller</h3><span class="mut">Scan barcode kartu santri</span></div><button class="btn sm" data-act="scan">${ic('qr', 14)} Pindai</button></div></div>
    <div class="sec"><h2>Menunggu Validasi ${n ? `<span class="pill bad">${n}</span>` : ''}</h2></div>${b.transfer.map(transferCard).join('') || empty('Tidak ada konfirmasi yang menunggu.')}${perhatian()}`;
  },
  transaksi() {
    const b = S.b, sp = isSpp(), l = sp ? b.santri : b.santriSaldo, pick = S.pick || '';
    return `<div class="sec"><h2>Catat Transaksi</h2></div><form class="card" data-form="${sp ? 'sppBayar' : 'saku'}"><button type="button" class="btn m w" data-act="scan" style="margin-bottom:12px">${ic('qr', 18)} Scan Kartu Santri</button><label class="f">Santri</label><select name="santriId" required><option value="">— pilih santri —</option>${opt(l.map(s => [s.SantriID, s.Nama + ' • ' + (s.NIS || '-') + (sp ? (s.lunas ? ' (lunas)' : '') : ' (' + rp(s.saldo) + ')')]), pick)}</select>
    ${sp ? `<label class="f">Bulan SPP</label><input type="month" name="periode" value="${esc(b.periode)}" required><label class="f">Nominal</label><input name="nominal" inputmode="numeric" value="${b.nominal || ''}" required>`
      : `<label class="f">Jenis</label>${radios('jenis', [['Setor', 'Setoran'], ['Tarik', 'Penarikan']], 'Setor')}<label class="f">Nominal</label><input name="nominal" inputmode="numeric" required><label class="f">Keterangan</label><input name="ket" placeholder="Contoh: Jajan koperasi">`}
    ${pinField()}<button class="btn w">Simpan Transaksi</button></form>`;
  },
  rekap() {
    const b = S.b, sp = isSpp();
    if (sp) { const l = b.santri.filter(s => s.lunas).length; return `<div class="sec"><h2>Rekap SPP</h2></div><div class="card"><label class="f">Bulan</label><input type="month" value="${esc(b.periode)}" data-act="periode"><div class="grid"><div class="stat"><span class="mut">Lunas</span><b>${l}</b></div><div class="stat bad"><span class="mut">Belum lunas</span><b>${b.santri.length - l}</b></div></div></div><div class="card">${b.santri.map(s => `<div class="row"><div class="g"><b>${esc(s.Nama)}</b><span class="mut">${esc(s.Halaqoh || '-')} • Wali ${esc(s.Wali || '-')}</span></div><span class="pill ${s.lunas ? 'ok' : 'bad'}">${s.lunas ? 'Lunas' : 'Belum'}</span></div>`).join('')}</div>`; }
    const tot = b.santriSaldo.reduce((x, s) => x + s.saldo, 0);
    return `<div class="sec"><h2>Rekap Uang Saku</h2></div><div class="card hero"><span class="lbl">Total saldo seluruh santri</span><div class="big">${rp(tot)}</div></div><div class="card">${b.santriSaldo.map(s => `<div class="row"><div class="g"><b>${esc(s.Nama)}</b><span class="mut">${esc(s.Halaqoh || '-')}</span></div><b class="${s.saldo <= b.info.saldoMin ? 'amt out' : ''}">${rp(s.saldo)}</b></div>`).join('')}</div>`;
  }
});
// ===== ADMIN =====
function keuAdmin() {
  const b = S.b, min = b.info.saldoMin, sp = b.sppData.santri.filter(s => !s.lunas), kr = b.santriSaldo.filter(s => s.saldo <= min);
  return `<div class="sec"><h2>Keuangan</h2></div><div class="grid"><div class="stat bad"><span class="mut">SPP ${esc(bln(b.periode))} tertunda</span><b>${sp.length}</b></div><div class="stat"><span class="mut">Saldo kritis</span><b>${kr.length}</b></div></div>
  <div class="sec"><h2>Konfirmasi Menunggu ${b.transfer.length ? `<span class="pill bad">${b.transfer.length}</span>` : ''}</h2></div>${b.transfer.map(transferCard).join('') || empty('Tidak ada.')}
  <div class="sec"><h2>SPP Belum Lunas</h2></div><div class="card">${sp.map(s => `<div class="row"><div class="g"><b>${esc(s.Nama)}</b><span class="mut">${esc(s.Halaqoh || '-')}</span></div><span class="pill bad">Belum</span></div>`).join('') || '<p class="mut c">Semua lunas.</p>'}</div>
  <div class="sec"><h2>Saldo Kritis</h2></div><div class="card">${kr.map(s => `<div class="row"><div class="g"><b>${esc(s.Nama)}</b></div><b class="amt out">${rp(s.saldo)}</b></div>`).join('') || '<p class="mut c">Tidak ada.</p>'}</div>`;
}
Object.assign(PG, {
  dasbor() {
    const b = S.b, akt = b.santri.filter(s => s.Status === 'Aktif').length, sp = b.sppData.santri.filter(s => !s.lunas).length, kr = b.santriSaldo.filter(s => s.saldo <= b.info.saldoMin).length, us = b.users.filter(u => u.Role === 'ustadz').length;
    const st = (ico, l, v, cls) => `<div class="stat ${cls || ''}"><div class="ib ${cls ? 'r' : ''}" style="width:38px;height:38px;margin-bottom:8px">${ic(ico, 18)}</div><span class="mut">${l}</span><b>${v}</b></div>`;
    return `<div class="card hero"><span class="pill dk">T.A ${esc(tahunAjaran())}</span><h2 style="margin:8px 0 2px">Administrator Ma'had</h2><span class="mut">Kelola seluruh santri, ustadz, dan capaian halaqoh tahfidz dalam satu sentuhan.</span></div>
    <div class="grid">${st('users', 'Total Santri', akt)}${st('user', 'Asatidzah', us)}${st('coin', 'SPP Tertunda', sp + ' santri')}${st('wallet', 'Saku Kritis', kr + ' santri', 'bad')}</div>
    <div class="sec"><h2>Aksi Kilat</h2></div><div class="fl"><button class="on" data-act="editSantri" data-id="">+ Santri Baru</button><button data-act="editHalaqoh" data-id="">+ Tambah Halaqoh</button><button data-act="tab" data-t="keu">Keuangan</button></div>
    ${b.pendaftar.length ? `<div class="banner"><span>${ic('user', 20)}</span><div class="g"><b>${b.pendaftar.length} pendaftaran wali</b> menunggu persetujuan</div><button class="btn sm" data-act="tab" data-t="santri">Tinjau</button></div>` : ''}
    <div class="sec"><h2>Pengajuan Izin</h2></div>${b.izin.length ? izinCards(b.izin, true) : empty('Tidak ada pengajuan izin.')}
    <div class="sec"><h2>Pengumuman Baru</h2></div><form class="card" data-form="info"><input name="judul" placeholder="Judul" required><textarea name="isi" rows="3" placeholder="Isi informasi" required></textarea><button class="btn w">Publikasikan</button></form>`;
  },
  santri() {
    const b = S.b, q = S.q.toLowerCase(), hq = id => (b.halaqoh.find(h => h.HalaqohID === id) || {}).Nama || '-';
    const pend = b.pendaftar.map(p => `<form class="card" data-form="approve" data-uid="${esc(p.UserID)}"><span class="pill warn">Menunggu persetujuan</span><h3 style="margin-top:6px">${esc(p.Nama)}</h3><p class="mut">${esc(p.Email)} • ${esc(p.WA)}</p>${p.anak.map(a => `<div class="row">${avatar(a, 'sm')}<div class="g"><b>${esc(a.Nama)}</b><span class="mut">${esc(a.TempatLahir)} ${a.TanggalLahir ? tgl(a.TanggalLahir) : ''} • ${a.JK === 'P' ? 'Putri' : 'Putra'}</span></div></div>`).join('')}<label class="f">NIS</label><input name="nis" value="${esc((p.anak[0] || {}).NIS || '')}"><label class="f">Halaqoh</label><select name="halaqohId"><option value="">— pilih —</option>${opt(b.halaqoh.map(h => [h.HalaqohID, h.Nama]))}</select><div class="grid"><button class="btn m" name="tolak" value="1" formnovalidate>Tolak</button><button class="btn" name="ok" value="1">Setujui</button></div></form>`).join('');
    return `${pend}<div class="sec"><h2>Data Santri</h2><button class="btn sm" data-act="editSantri" data-id="">${ic('plus', 14)} Tambah</button></div><input placeholder="Cari nama / NIS…" data-act="cari" value="${esc(S.q)}">${b.santri.filter(s => s.Status !== 'Menunggu' && (s.Nama + s.NIS).toLowerCase().indexOf(q) > -1).map(s => `<div class="item">${avatar(s)}<div class="g"><b>${esc(s.Nama)}</b><span class="mut">NIS ${esc(s.NIS || '-')} • ${esc(hq(s.HalaqohID))}</span></div><span class="pill ${s.Status === 'Aktif' ? 'ok' : ''}">${esc(s.Status)}</span><button class="btn m sm" data-act="editSantri" data-id="${esc(s.SantriID)}">Ubah</button></div>`).join('') || empty('Tidak ada data.')}`;
  },
  halaqoh() {
    return `<div class="sec"><div><h2>Manajemen Halaqoh</h2><span class="mut">Daftar kelompok talaqqi & tahsin al-Qur'an</span></div><button class="btn sm" data-act="editHalaqoh" data-id="">${ic('plus', 14)} Baru</button></div>${S.b.halaqoh.map(h => `<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div class="hrow"><div class="ib">${ic('book', 22)}</div><div><h3>${esc(h.Nama)}</h3><span class="mut">${esc(h.Ustadz || 'Belum ada ustadz')}</span></div></div><div><span class="pill">${esc(h.Jenis)}</span> <span class="pill ok">${h.Jumlah} Santri</span></div></div><button class="btn w" style="margin-top:12px" data-act="editHalaqoh" data-id="${esc(h.HalaqohID)}">Kelola</button></div>`).join('') || empty('Belum ada halaqoh.')}`;
  },
  atur() {
    const b = S.b, s = b.set;
    return `<div class="sec"><h2>Akun Ustadz & Bendahara</h2></div><div class="card">${b.users.filter(u => u.Role !== 'admin').map(u => `<div class="row">${avatar(u.Nama, 'sm')}<div class="g"><b>${esc(u.Nama)}</b><span class="mut">${ROLE_LABEL[u.Role]} • ${esc(u.Username)}</span></div><button class="btn m sm" data-act="userQR" data-id="${esc(u.UserID)}">QR</button></div>`).join('') || '<p class="mut c">Belum ada akun.</p>'}</div>
    <form class="card" data-form="user"><h3>Tambah akun</h3><input name="Nama" placeholder="Nama lengkap" required><select name="Role">${opt([['ustadz', 'Ustadz'], ['bendahara_spp', 'Bendahara SPP'], ['bendahara_saku', 'Bendahara Uang Saku']])}</select><input name="Username" placeholder="Username" required><input name="password" placeholder="Kata sandi awal" required><input name="Email" type="email" placeholder="Email"><input name="WA" placeholder="WhatsApp"><button class="btn w">Buat Akun</button></form>
    <form class="card" data-form="atur"><h3>Pengaturan Umum</h3><label class="f">Tahun ajaran (mis. 2026/2027)</label><input name="TAHUN_AJARAN" value="${esc(s.TAHUN_AJARAN)}"><label class="f">Link YouTube beranda</label><input name="YOUTUBE" value="${esc(b.info.youtube)}"><label class="f">WA Admin / Wali Care</label><input name="WA_ADMIN" value="${esc(s.WA_ADMIN)}"><label class="f">WA Bendahara SPP</label><input name="WA_BENDAHARA_SPP" value="${esc(b.info.wa_spp)}"><label class="f">WA Bendahara Uang Saku</label><input name="WA_BENDAHARA_SAKU" value="${esc(b.info.wa_saku)}">
    <label class="f">Nominal SPP per bulan</label><input name="SPP_NOMINAL" inputmode="numeric" value="${esc(s.SPP_NOMINAL)}"><label class="f">Tanggal pengingat SPP (1–28)</label><input name="SPP_TGL" inputmode="numeric" value="${esc(s.SPP_TGL)}"><label class="f">Batas saldo menipis (Rp)</label><input name="SALDO_MENIPIS" inputmode="numeric" value="${esc(s.SALDO_MENIPIS)}"><label class="f">Email notifikasi (1 = aktif, 0 = mati)</label><input name="EMAIL_AKTIF" value="${esc(s.EMAIL_AKTIF)}"><button class="btn w">Simpan Pengaturan</button></form>
    ${rekForm(b.rek.spp, 'Rekening SPP').replace('data-form="rek"', 'data-form="rek" data-j="SPP"')}${rekForm(b.rek.saku, 'Rekening Uang Saku').replace('data-form="rek"', 'data-form="rek" data-j="SAKU"')}<div class="card"><div class="row" style="cursor:pointer" data-act="theme"><div class="ib">${ic('moon')}</div><div class="g"><b>Mode Terang / Gelap</b></div></div></div><button class="btn g w" data-act="logout">${ic('out', 18)} Keluar</button>`;
  }
});
// ---------- cangkang ----------
function shell() {
  const b = S.b, r = b.user.role, tabs = TABS[r] || [], unread = b.notif.filter(n => !n.Dibaca).length;
  if (!S.tab || (!tabs.some(t => t[0] === S.tab) && !TITLE[S.tab])) S.tab = tabs[0][0];
  const lab = (tabs.find(t => t[0] === S.tab) || [0, 0, TITLE[S.tab]])[2];
  const btn = t => `<button class="${S.tab === t[0] ? 'on' : ''}" data-act="tab" data-t="${t[0]}">${ic(t[1], 22)}${t[2]}</button>`;
  const fab = r === 'admin' ? '' : `<button class="fab" data-act="${r === 'wali' ? 'tab' : 'scan'}" data-t="kartu">${ic('qr', 26)}</button>`;
  const dock = r === 'admin' ? tabs.map(btn).join('') : tabs.slice(0, 2).map(btn).join('') + fab + tabs.slice(2).map(btn).join('');
  return `<div class="top"><div class="logo">${ic('bld', 22)}</div><div class="brand"><b>Ma'had Sabilul Muttaqin</b><small>${esc(lab)}${r !== 'wali' && r !== 'admin' ? ' • ' + ROLE_LABEL[r] : ''}</small></div><button class="ibtn" data-act="tab" data-t="notif">${ic('bell', 22)}${unread ? `<i>${unread}</i>` : ''}</button><button class="ibtn" data-act="tab" data-t="${r === 'admin' ? 'atur' : 'profil'}">${avatar(S.b.user.nama, 'me')}</button></div>
  ${(PG[S.tab] || PG.notif)()}<nav class="dock">${dock}</nav>`;
}
function render() { $('#app').innerHTML = S.token && S.b ? shell() : (V[S.view] || V.home)(); drawQR(); }
// ---------- scan (kamera + scanner USB) ----------
let camStream = null, camOn = false;
function stopCam() { camOn = false; if (camStream) camStream.getTracks().forEach(t => t.stop()); camStream = null; }
function scanModal(onCode) {
  modal(`<h3>Scan Barcode / QR</h3><p class="mut">Arahkan kamera ke QR, atau gunakan scanner USB (otomatis mengetik lalu Enter).</p><video id="cam" playsinline muted style="width:100%;border-radius:16px;margin:8px 0" hidden></video><input id="scanIn" placeholder="Kode QR…" autofocus><div class="grid"><button class="btn s" id="camBtn">${ic('cam', 18)} Buka Kamera</button><button class="btn g" data-act="close">Tutup</button></div>`);
  const done = c => { c = String(c).trim(); if (c.length > 10) { closeModal(); onCode(c); } };
  $('#scanIn').addEventListener('keydown', e => { if (e.key === 'Enter') done(e.target.value); });
  $('#camBtn').onclick = async () => {
    if (!('BarcodeDetector' in window)) return toast('Kamera belum didukung browser ini. Pakai scanner USB atau ketik kode.', true);
    try { camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); const v = $('#cam'); v.srcObject = camStream; v.hidden = false; await v.play(); camOn = true; const det = new BarcodeDetector({ formats: ['qr_code', 'code_128'] });
      (async function loop() { if (!camOn) return; try { const r = await det.detect(v); if (r.length) return done(r[0].rawValue); } catch (e) {} setTimeout(loop, 250); })();
    } catch (e) { toast('Kamera tidak bisa dibuka (izin ditolak?).', true); }
  };
}
async function afterLogin(r) { localStorage.setItem('msm:t', r.data.token); S.token = r.data.token; S.b = r.data.boot; S.tab = ''; S.q = ''; S.flt = 'Semua'; S.anak = Math.max(0, (S.b.anak || []).findIndex(a => a.SantriID === r.data.fokus)); Store.set('boot:' + S.b.user.id, S.b); render(); }
// ---------- aksi klik ----------
const A = {
  theme() { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); },
  goHome() { S.view = 'home'; render(); }, goDaftar() { S.view = 'daftar'; render(); }, goLogin() { S.view = 'login'; render(); }, swStaff() { S.staff = !S.staff; render(); },
  eye() { const p = $('#pw'); p.type = p.type === 'password' ? 'text' : 'password'; }, lupa() { toast('Hubungi admin Ma\'had untuk mengatur ulang kata sandi.'); },
  logout, close: closeModal, print() { window.print(); },
  tab(t) { S.tab = t.dataset.t; S.q = ''; if (S.tab === 'notif') api('readNotif'); render(); window.scrollTo(0, 0); },
  keu(t) { S.sub = t.dataset.v || 'saku'; S.tab = 'keu'; render(); window.scrollTo(0, 0); },
  sub(t) { S.sub = t.dataset.v; render(); }, flt(t) { S.flt = t.dataset.v; render(); },
  nextAnak() { S.anak = (S.anak + 1) % S.b.anak.length; render(); },
  salin(t) { (navigator.clipboard ? navigator.clipboard.writeText(t.dataset.v) : Promise.reject()).then(() => toast('Nomor rekening disalin.'), () => toast(t.dataset.v)); },
  scanLogin() { scanModal(async c => { const r = await call('loginQR', { qr: c }, false); if (r.success) afterLogin(r); }); },
  scan() {
    const rl = S.b.user.role;
    scanModal(async c => { const r = await call('scanSantri', { qr: c }, false); if (!r.success) return; if (rl === 'ustadz') A.setor({ dataset: { id: r.data.santriId } }); else { S.pick = r.data.santriId; S.tab = 'transaksi'; render(); toast('Santri terpilih.'); } });
  },
  cari(t) { S.q = t.value; clearTimeout(A.ct); A.ct = setTimeout(() => { render(); const i = document.querySelector('[data-act=cari]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 300); },
  periode(t) { if (!t.value) return; call('sppData', { periode: t.value }, false).then(r => { if (r.success) { Object.assign(S.b, r.data); render(); } }); },
  bigQR() { const a = cur(); modal(`<h3 class="c">${esc(a.Nama)}</h3><div class="c" style="padding:20px"><div style="display:inline-block;background:#fff;padding:14px;border-radius:16px" data-qr="${esc(a.QRToken)}" data-sz="240"></div></div><button class="btn w" data-act="close">Tutup</button>`); },
  kirimKartu() { const a = cur(); window.open('https://wa.me/?text=' + encodeURIComponent('Kartu Santri ' + a.Nama + ' (NIS ' + (a.NIS || '-') + ') — ' + location.href), '_blank'); },
  gantiFoto() { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = async () => { if (!i.files[0]) return; try { const f = await thumb(i.files[0], 160, .7), r = await call('fotoWali', { santriId: cur().SantriID, foto: f }); if (r.success) refresh(); } catch (e) { toast(e.message, true); } }; i.click(); },
  setor(t) {
    const s = S.b.santri.find(x => x.SantriID === t.dataset.id); if (!s) return toast('Santri tidak ditemukan.', true);
    const iq = (S.b.halaqoh.find(h => h.HalaqohID === s.HalaqohID) || {}).Jenis === 'Iqro', d = new Date().getDay(), kg = ['Tahajud', 'Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    modal(`<h3>Formulir Setoran & Mutaba'ah</h3><div class="item" style="box-shadow:none;background:var(--mint)">${avatar(s)}<div class="g"><b>${esc(s.Nama)}</b><span class="mut">NIS ${esc(s.NIS || '-')}</span></div></div>
    <form data-form="setor" data-id="${esc(s.SantriID)}"><h3 style="margin:14px 0 8px">${ic('check', 18)} 1. Absensi Ibadah Harian</h3><div class="abs">${kg.map(k => `<div><b>${k}</b>${radios('k_' + k, [['H', 'H'], ['A', 'A'], ['I', 'I'], ['S', 'S']], 'H', 'hais')}</div>`).join('')}</div>
    ${d === 1 || d === 4 ? `<label class="box" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b>Puasa Sunnah Senin–Kamis</b><input type="checkbox" name="puasa" style="width:auto;margin:0"></label>` : ''}
    <h3 style="margin:16px 0 8px">${ic('book', 18)} 2. Setoran Hafalan & Mutaba'ah</h3><p class="mut" style="margin-bottom:8px">Kosongkan ayat/halaman jika hanya mencatat absensi.</p>
    ${iq ? `<label class="f">Jilid Iqro</label><select name="juz">${opt([1, 2, 3, 4, 5, 6])}</select>` : `<div class="grid"><div><label class="f">Pilih Surat (1–114)</label><select name="surat">${opt(SURAT.map((n, i) => [n, String(i + 1).padStart(2, '0') + '. ' + n]))}</select></div><div><label class="f">Pilih Juz</label><select name="juz">${opt(Array.from({ length: 30 }, (_, i) => [i + 1, 'Juz ' + (i + 1)]))}</select></div></div>`}
    <div class="grid"><div><label class="f">${iq ? 'Dari halaman' : 'Dari ayat'}</label><input name="dari" type="number" min="1"></div><div><label class="f">${iq ? 'Sampai halaman' : 'Sampai ayat'}</label><input name="sampai" type="number" min="1"></div></div>
    <label class="f">Takaran Setoran</label>${radios('satuan', ['Baris', 'Halaman', 'Lembar'], 'Halaman')}<label class="f">Predikat Nilai Tajwid & Kelancaran</label>${radios('nilai', ['Mardud', 'Maqbul', 'Jayyid', 'Mumtaz'], 'Maqbul')}<label class="f">Instruksi Santri</label>${radios('status', [['Lanjut', 'Lanjut Halaman Baru'], ['Mengulang', 'Mengulang (Muraja\'ah)']], 'Lanjut')}
    <label class="f">Catatan Ustadz (evaluasi tajwid)</label><textarea name="catatan" rows="2"></textarea>${pinField()}<button class="btn w">${ic('lock', 18)} Simpan Data & Verifikasi PIN</button></form>`);
  },
  editSantri(t) {
    const s = S.b.santri.find(x => x.SantriID === t.dataset.id) || {};
    modal(`<h3>${s.SantriID ? 'Ubah' : 'Tambah'} Santri</h3><form data-form="santri" data-id="${esc(s.SantriID || '')}"><label class="f">Nama</label><input name="Nama" value="${esc(s.Nama)}" required><label class="f">NIS</label><input name="NIS" value="${esc(s.NIS)}"><label class="f">Jenis kelamin</label>${radios('JK', [['L', 'Putra'], ['P', 'Putri']], s.JK || 'L')}<label class="f">Tempat lahir</label><input name="TempatLahir" value="${esc(s.TempatLahir)}"><label class="f">Tanggal lahir</label><input type="date" name="TanggalLahir" value="${esc(String(s.TanggalLahir || '').slice(0, 10))}"><label class="f">Alamat</label><textarea name="Alamat" rows="2">${esc(s.Alamat)}</textarea><label class="f">Halaqoh</label><select name="HalaqohID"><option value="">—</option>${opt(S.b.halaqoh.map(h => [h.HalaqohID, h.Nama]), s.HalaqohID)}</select><label class="f">Status</label><select name="Status">${opt(['Aktif', 'Nonaktif', 'Lulus'], s.Status || 'Aktif')}</select><label class="f">Pasfoto (opsional)</label><input name="foto" type="file" accept="image/*"><button class="btn w">Simpan</button>${s.SantriID ? `<div class="grid" style="margin-top:8px"><button type="button" class="btn m" data-act="qrSantri" data-id="${esc(s.SantriID)}">QR Santri</button><button type="button" class="btn d" data-act="hapusSantri" data-id="${esc(s.SantriID)}">Hapus</button></div>` : ''}</form>`);
  },
  qrSantri(t) { const s = S.b.santri.find(x => x.SantriID === t.dataset.id); showQR(s.Nama, s.QRToken, 'santri', s.SantriID); }, userQR(t) { const u = S.b.users.find(x => x.UserID === t.dataset.id); showQR(u.Nama, u.QRToken, 'user', u.UserID); },
  async hapusSantri(t) { if (!confirm('Hapus santri ini? Tindakan tidak bisa dibatalkan.')) return; const r = await call('deleteSantri', { id: t.dataset.id }); if (r.success) { closeModal(); refresh(); } },
  async regen(t) { if (!confirm('Buat ulang barcode? Barcode lama langsung tidak berlaku.')) return; const r = await call('regenQR', { type: t.dataset.type, id: t.dataset.id }); if (r.success) { closeModal(); refresh(); } },
  editHalaqoh(t) {
    const h = S.b.halaqoh.find(x => x.HalaqohID === t.dataset.id) || {};
    modal(`<h3>${h.HalaqohID ? 'Kelola' : 'Tambah'} Halaqoh</h3><form data-form="halaqoh" data-id="${esc(h.HalaqohID || '')}"><label class="f">Nama</label><input name="Nama" value="${esc(h.Nama)}" required><label class="f">Jenis</label><select name="Jenis">${opt([['Quran', "Al-Qur'an"], ['Iqro', 'Iqro']], h.Jenis)}</select><label class="f">Ustadz penanggung jawab</label><select name="UstadzID"><option value="">—</option>${opt(S.b.users.filter(u => u.Role === 'ustadz').map(u => [u.UserID, u.Nama]), h.UstadzID)}</select><label class="f">Keterangan</label><input name="Keterangan" value="${esc(h.Keterangan)}"><button class="btn w">Simpan</button></form>`);
  },
  konfWali(t) {
    const a = cur(), j = t.dataset.j, rk = j === 'Saku' ? S.b.rek.saku : S.b.rek.spp;
    modal(`<h3>Konfirmasi Transfer ${j === 'Saku' ? 'Uang Saku' : 'SPP'}</h3>${rk && rk.norek ? `<div class="box" style="margin:8px 0"><b>${esc(rk.bank)} ${esc(rk.norek)}</b><div class="mut">a.n. ${esc(rk.an)}</div></div>` : ''}<form data-form="transfer" data-j="${j}" data-id="${esc(a.SantriID)}"><label class="f">Nominal (Rp)</label><input name="nominal" inputmode="numeric" required><label class="f">Tanggal transfer</label><input type="date" name="tgl" value="${today()}" required><label class="f">Catatan</label><input name="catatan"><label class="f">Unggah bukti transfer (wajib)</label><input type="file" name="bukti" accept="image/*" required><button class="btn w">${ic('send', 18)} Kirim Konfirmasi</button></form>`);
  },
  async bukti(t) { const r = await call('buktiLihat', { id: t.dataset.id }, false); if (r.success) modal(`<h3>Bukti Transfer</h3><img class="thumb" src="${r.data}" alt="Bukti transfer"><button class="btn w" style="margin-top:12px" data-act="close">Tutup</button>`); },
  async terima(t) {
    const d = { id: t.dataset.id, terima: true }; if (t.dataset.j === 'SPP') { const p = prompt('Periode SPP yang dibayar (yyyy-MM):', S.b.periode); if (!p) return; d.periode = p; }
    if (isStaff()) { const pin = prompt('Masukkan PIN 4 angka:'); if (!pin) return; d.pin = pin; }
    const r = await call('transferVerif', d); if (r.success) refresh();
  },
  async tolak(t) { const c = prompt('Alasan penolakan (opsional):'); if (c === null) return; const d = { id: t.dataset.id, terima: false, catatan: c }; if (isStaff()) { const pin = prompt('Masukkan PIN 4 angka:'); if (!pin) return; d.pin = pin; } const r = await call('transferVerif', d); if (r.success) refresh(); },
  async izinPutus(t) { const s = t.dataset.s === '1', c = s ? '' : prompt('Alasan penolakan (opsional):'); if (c === null) return; const r = await call('izinPutus', { id: t.dataset.id, setuju: s, catatan: c }); if (r.success) refresh(); }
};
function showQR(nama, qr, type, id) { modal(`<h3>QR — ${esc(nama)}</h3><div class="c" style="padding:14px"><div style="display:inline-block;background:#fff;padding:12px;border-radius:14px" data-qr="${esc(qr)}" data-sz="200"></div></div><p class="mut">Cetak untuk kartu. Berisi token acak, bukan NIS.</p><div class="grid"><button class="btn m" data-act="regen" data-type="${type}" data-id="${esc(id)}">Buat Ulang</button><button class="btn" data-act="close">Tutup</button></div>`); }
document.addEventListener('click', e => { if (e.target.id === 'modal') return closeModal(); const t = e.target.closest('[data-act]'); if (t && t.tagName !== 'INPUT' && A[t.dataset.act]) A[t.dataset.act](t, e); });
document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.act === 'cari') A.cari(e.target); });
document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.act === 'periode') A.periode(e.target); });
// ---------- form ----------
const F = {
  async login(d) { const r = await call('login', d, false); if (r.success) afterLogin(r); },
  async daftar(d) {
    if (d.password !== d.password2) return toast('Konfirmasi kata sandi tidak sama.', true);
    let foto = ''; if (d.a_foto && d.a_foto.size) { try { foto = await thumb(d.a_foto, 160, .7); } catch (e) { return toast(e.message, true); } }
    const r = await call('register', { nama: d.nama, hubungan: d.hubungan, wa: d.wa, email: d.email, password: d.password, anak: { nama: d.a_nama, nis: d.a_nis, jk: d.a_jk, tempatLahir: d.a_tempat, tanggalLahir: d.a_tgl, alamat: d.a_alamat, foto } });
    if (r.success) { S.view = 'login'; S.staff = false; render(); }
  },
  async setor(d, f) {
    const kg = ['Tahajud', 'Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'], items = kg.map(k => ({ santriId: f.dataset.id, kegiatan: k, status: d['k_' + k] }));
    if (d.puasa) items.push({ santriId: f.dataset.id, kegiatan: 'Puasa Sunnah', status: 'H' });
    const r1 = await call('absensi', { pin: d.pin, items }, false); if (!r1.success) return;
    if (d.dari && d.sampai) { const r2 = await call('setoran', Object.assign({ santriId: f.dataset.id }, d)); if (!r2.success) return; } else toast('Absensi tersimpan.');
    closeModal(); refresh();
  },
  async absen(d) { const items = Object.keys(d).filter(k => k.indexOf('s_') === 0).map(k => ({ santriId: k.slice(2), status: d[k] })); await call('absensi', { tanggal: d.tanggal, kegiatan: d.kegiatan, pin: d.pin, items }); },
  async transfer(d, f) {
    let bukti; try { bukti = await thumb(d.bukti, 1000, .7); } catch (e) { return toast(e.message, true); }
    const r = await call('transferKirim', { santriId: f.dataset.id, jenis: f.dataset.j, nominal: d.nominal, tglTransfer: d.tgl, catatan: d.catatan, bukti }); if (r.success) { closeModal(); refresh(); }
  },
  async izin(d) { const r = await call('izinKirim', Object.assign({ santriId: cur().SantriID }, d)); if (r.success) refresh(); },
  async sppBayar(d) { const r = await call('sppCatat', d); if (r.success) { S.pick = ''; refresh(); } },
  async saku(d) { const r = await call('sakuCatat', { santriId: d.santriId, jenis: d.jenis, nominal: d.nominal, ket: d.ket, pin: d.pin }); if (r.success) { S.pick = ''; refresh(); } },
  async santri(d, f) {
    const p = Object.assign({ SantriID: f.dataset.id }, d); delete p.foto; if (d.foto && d.foto.size) { try { p.Foto = await thumb(d.foto, 160, .7); } catch (e) { return toast(e.message, true); } }
    const r = await call('saveSantri', p); if (r.success) { closeModal(); refresh(); }
  },
  async halaqoh(d, f) { const r = await call('saveHalaqoh', Object.assign({ HalaqohID: f.dataset.id }, d)); if (r.success) { closeModal(); refresh(); } },
  async approve(d, f, ev) { const tolak = ev.submitter && ev.submitter.name === 'tolak'; if (tolak && !confirm('Tolak pendaftaran ini?')) return; const r = await call('approve', { userId: f.dataset.uid, halaqohId: d.halaqohId, nis: d.nis, tolak }); if (r.success) refresh(); },
  async user(d, f) { const r = await call('saveUser', d); if (r.success) { f.reset(); refresh(); } },
  async atur(d) { const r = await call('savePengaturan', d); if (r.success) refresh(); },
  async rek(d, f) { const r = await call('saveRek', Object.assign({ jenis: f.dataset.j }, d)); if (r.success) refresh(); },
  async pin(d, f) { const r = await call('setPin', d); if (r.success) { f.reset(); refresh(); } },
  async info(d, f) { const r = await call('saveInfo', d); if (r.success) { f.reset(); refresh(); } }
};
document.addEventListener('submit', async e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault(); const btn = e.submitter; if (btn) btn.disabled = true;
  try { await F[f.dataset.form](Object.fromEntries(new FormData(f)), f, e); } catch (err) { toast(err.message || 'Terjadi kesalahan.', true); } finally { if (btn) btn.disabled = false; }
});
// ---------- init ----------
(async function init() {
  warmUp(); render();
  if (S.token) { const c = Object.keys(localStorage).find(k => k.indexOf('msm:v1:boot:') === 0); if (c) { try { S.b = JSON.parse(localStorage.getItem(c)); render(); } catch (e) {} } await refresh(); }
  const r = await api('home'); if (r.success) { S.info = r.data; Store.set('info', r.data); if (!S.token) render(); }
})();
