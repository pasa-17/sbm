/** MA'HAD SABILUL MUTTAQIN — Backend REST API (Fase 1: Beranda, Login QR, Wali, Ustadz, Admin)
 *  Jalankan setupAppEnvironment() SEKALI. Deploy: Web App, Execute as Me, Access Anyone. */
const APP_NAME = "Ma'had Sabilul Muttaqin";
const P = PropertiesService.getScriptProperties();
const H = {
  Users: ['UserID','Username','PassHash','Salt','Role','Nama','Email','WA','QRToken','Status','HalaqohID','PIN'],
  Santri: ['SantriID','NIS','Nama','TempatLahir','TanggalLahir','Alamat','HalaqohID','WaliID','Status','QRToken','JK','Hubungan','Foto'],
  Halaqoh: ['HalaqohID','Nama','Jenis','UstadzID','Keterangan'],
  Hafalan: ['ID','Tanggal','SantriID','Jenis','Surat','Juz','Dari','Sampai','Ukuran','Satuan','Nilai','Status','UstadzID','Catatan'],
  Absensi: ['ID','Tanggal','SantriID','Kegiatan','Status','PencatatID'],
  Notif: ['ID','Waktu','UserID','Judul','Isi','Dibaca'],
  Pengumuman: ['ID','Tanggal','Judul','Isi','Youtube'],
  Pengaturan: ['key','value'],
  Log: ['Waktu','UserID','Aksi','Detail'],
  SPP: ['ID','SantriID','Periode','Nominal','Tanggal','PencatatID','Sumber'],
  Saku: ['ID','Waktu','SantriID','Jenis','Nominal','Saldo','Keterangan','PencatatID'],
  Transfer: ['ID','Waktu','WaliID','SantriID','Jenis','Nominal','TglTransfer','Catatan','BuktiID','Status','VerifierID','CatatanVerif'],
  Izin: ['ID','Waktu','SantriID','WaliID','Jenis','Mulai','Selesai','Alasan','Status','PemutusID','Catatan']
};
// ---------- Sheets helper (memo per eksekusi) ----------
const _R = {};
function sh_(n) { return SpreadsheetApp.openById(P.getProperty('SPREADSHEET_ID')).getSheetByName(n); }
function rows_(n) {
  if (_R[n]) return _R[n];
  const v = sh_(n).getDataRange().getValues(), h = v[0].map(String);
  return (_R[n] = v.slice(1).filter(r => r.join('') !== '').map(r => { const o = {}; h.forEach((k, i) => o[k] = r[i]); return o; }));
}
function add_(n, list) {
  list = [].concat(list); if (!list.length) return;
  const sh = sh_(n);
  sh.getRange(sh.getLastRow() + 1, 1, list.length, H[n].length).setValues(list.map(o => H[n].map(k => o[k] === undefined ? '' : o[k])));
  delete _R[n];
}
function upd_(n, kc, k, patch) {
  const sh = sh_(n), v = sh.getDataRange().getValues(), h = v[0], ki = h.indexOf(kc);
  for (let i = 1; i < v.length; i++) if (String(v[i][ki]) === String(k)) {
    Object.keys(patch).forEach(f => { const c = h.indexOf(f); if (c > -1) v[i][c] = patch[f]; });
    sh.getRange(i + 1, 1, 1, h.length).setValues([v[i]]); delete _R[n]; return true;
  }
  return false;
}
function del_(n, kc, k) {
  const sh = sh_(n), v = sh.getDataRange().getValues(), ki = v[0].indexOf(kc);
  for (let i = v.length - 1; i >= 1; i--) if (String(v[i][ki]) === String(k)) sh.deleteRow(i + 1);
  delete _R[n];
}
const uid_ = p => p + Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
const tok_ = () => (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
const ok_ = (data, message) => ({ success: true, data, message: message || '' });
const fail_ = (message, data) => ({ success: false, message, data: data || null });
const hash_ = (p, salt) => Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + p));
const setting_ = (k, d) => { const r = rows_('Pengaturan').find(x => x.key === k); return r ? String(r.value) : d; };
function log_(u, a, d) { try { add_('Log', { Waktu: new Date(), UserID: u, Aksi: a, Detail: d }); } catch (e) {} }

// ---------- Token HMAC (tanpa simpan sesi) ----------
function secret_() { let s = P.getProperty('TOKEN_SECRET'); if (!s) { s = tok_(); P.setProperty('TOKEN_SECRET', s); } return s; }
function sign_(s) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, secret_())).replace(/=+$/, ''); }
function signToken_(p) { const b = Utilities.base64EncodeWebSafe(JSON.stringify(p)).replace(/=+$/, ''); return b + '.' + sign_(b); }
function verifyToken_(t) {
  const a = String(t || '').split('.'); if (a.length !== 2 || sign_(a[0]) !== a[1]) return null;
  let b = a[0]; while (b.length % 4) b += '=';
  const p = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(b)).getDataAsString());
  return p.x > Date.now() ? { id: p.u, role: p.r } : null;
}

// ---------- Entry points ----------
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet(e) {
  try { if (e.parameter.ping) return out_({ success: true, pong: 1 }); return out_(dispatch_({ action: 'home' })); }
  catch (err) { return out_(fail_(err.message)); }
}
function doPost(e) {
  const t0 = Date.now(); let res;
  try { res = dispatch_(JSON.parse((e.postData && e.postData.contents) || '{}')); }
  catch (err) { res = fail_(err.message); }
  res.ms = Date.now() - t0; return out_(res);
}
function dispatch_(b) {
  const r = ROUTES[b.action]; if (!r) return fail_('Aksi tidak dikenal.');
  const ctx = { s: verifyToken_(b.token), after: [], reqId: String(b.reqId || '') };
  if (r.roles && (!ctx.s || r.roles.indexOf(ctx.s.role) < 0)) return fail_('Sesi berakhir atau akses ditolak.', { code: 'AUTH' });
  if (!r.write) { try { return r.fn(ctx, b.data || {}); } catch (e) { return fail_(e.message); } }
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let res;
  try {
    const c = CacheService.getScriptCache(), k = ctx.reqId && 'idem_' + ctx.reqId, hit = k && c.get(k);
    if (hit) return JSON.parse(hit);
    res = r.fn(ctx, b.data || {});
    if (k && res.success) { const s = JSON.stringify(res); if (s.length < 90000) c.put(k, s, 21600); }
  } catch (e) { return fail_(e.message); } finally { lock.releaseLock(); }
  ctx.after.forEach(f => { try { f(); } catch (e) {} });   // email di luar lock
  return res;
}

// ---------- Notifikasi (dalam aplikasi + email) ----------
function notif_(ctx, userId, judul, isi) {
  add_('Notif', { ID: uid_('N'), Waktu: new Date(), UserID: userId, Judul: judul, Isi: isi, Dibaca: '' });
  const u = rows_('Users').find(x => x.UserID === userId);
  if (u && u.Email && setting_('EMAIL_AKTIF', '1') === '1')
    ctx.after.push(() => MailApp.sendEmail({ to: u.Email, subject: APP_NAME + ' — ' + judul, body: isi + '\n\n— ' + APP_NAME }));
}

// ---------- Auth ----------
function session_(u, fokusSantri) {
  const exp = Date.now() + (u.Role === 'admin' ? 8 * 36e5 : 30 * 864e5);
  return ok_({ token: signToken_({ u: u.UserID, r: u.Role, i: Date.now(), x: exp }), boot: boot_(u), fokus: fokusSantri || '' });
}
function login_(c, d) {
  const q = String(d.username || '').trim().toLowerCase();
  let u = rows_('Users').find(x => String(x.Username).toLowerCase() === q);
  if (!u && q) { const sa = rows_('Santri').find(x => String(x.NIS).toLowerCase() === q); u = sa && rows_('Users').find(x => x.UserID === sa.WaliID && x.Role === 'wali'); }
  if (!u || u.PassHash !== hash_(String(d.password || ''), u.Salt)) return fail_('Username atau kata sandi salah.');
  if (u.Status === 'Menunggu') return fail_('Akun Anda menunggu persetujuan admin.', { code: 'PENDING' });
  if (u.Status !== 'Aktif') return fail_('Akun tidak aktif.');
  log_(u.UserID, 'LOGIN', 'sandi'); return session_(u);
}
function loginQR_(c, d) {
  const q = String(d.qr || '').trim(); if (q.length < 20) return fail_('QR tidak valid.');
  const sa = rows_('Santri').find(x => x.QRToken === q);
  let u = sa ? rows_('Users').find(x => x.UserID === sa.WaliID) : rows_('Users').find(x => x.QRToken === q);
  if (!u) return fail_('QR tidak dikenali atau sudah diganti.');
  if (u.Status !== 'Aktif') return fail_(u.Status === 'Menunggu' ? 'Akun menunggu persetujuan admin.' : 'Akun tidak aktif.');
  if (u.Role === 'admin') return fail_('Barcode admin hanya membuka halaman login. Masukkan sandi.', { code: 'NEED_PASS' });
  log_(u.UserID, 'LOGIN', 'qr'); return session_(u, sa && sa.SantriID);
}
const thumbOk_ = f => /^data:image\/jpeg;base64,/.test(f || '') && f.length < 40000 ? f : '';
function register_(c, d) {
  const em = String(d.email || '').trim().toLowerCase(), a = d.anak || {};
  if (!em || !d.password || String(d.password).length < 8) return fail_('Email dan kata sandi (min. 8 karakter) wajib.');
  if (!a.nama) return fail_('Nama santri wajib diisi.');
  if (rows_('Users').some(x => String(x.Username).toLowerCase() === em)) return fail_('Email sudah terdaftar.');
  const salt = tok_().slice(0, 16), id = uid_('U');
  add_('Users', { UserID: id, Username: em, PassHash: hash_(String(d.password), salt), Salt: salt, Role: 'wali', Nama: d.nama, Email: em, WA: String(d.wa || ''), QRToken: tok_(), Status: 'Menunggu' });
  add_('Santri', { SantriID: uid_('S'), NIS: d.anak.nis || '', Nama: a.nama, TempatLahir: a.tempatLahir || '', TanggalLahir: a.tanggalLahir || '', Alamat: a.alamat || '', WaliID: id, Status: 'Menunggu', QRToken: tok_(), JK: a.jk || '', Hubungan: d.hubungan || '', Foto: thumbOk_(a.foto) });
  rows_('Users').filter(x => x.Role === 'admin').forEach(x => notif_(c, x.UserID, 'Pendaftaran wali baru', d.nama + ' mendaftarkan ' + a.nama + '.'));
  return ok_(null, 'Pendaftaran terkirim. Tunggu persetujuan admin (maks. 1x24 jam kerja).');
}

// ---------- Bootstrap per peran (1 panggilan = 1 layar) ----------
function bootBase_(u) {
  const base = { user: { id: u.UserID, nama: u.Nama, role: u.Role, qr: u.QRToken }, info: info_(), notif: rows_('Notif').filter(n => n.UserID === u.UserID).slice(-20).reverse() };
  const san = rows_('Santri'), hal = rows_('Halaqoh'), us = rows_('Users');
  const nmU = id => (us.find(x => x.UserID === id) || {}).Nama || '';
  if (u.Role === 'wali') {
    base.anak = san.filter(s => s.WaliID === u.UserID).map(s => {
      const h = hal.find(x => x.HalaqohID === s.HalaqohID) || {}, hf = rows_('Hafalan').filter(x => x.SantriID === s.SantriID);
      const juz = {}; hf.filter(x => x.Status === 'Lanjut' && x.Juz).forEach(x => juz[x.Juz] = 1);
      return Object.assign({}, s, { Halaqoh: h.Nama || '-', Jenis: h.Jenis || '', Ustadz: nmU(h.UstadzID), juz: Object.keys(juz).map(Number).sort((a, b) => a - b),
        hafalan: hf.slice(-10).reverse(), absensi: rows_('Absensi').filter(x => x.SantriID === s.SantriID).slice(-20).reverse() });
    });
  } else if (u.Role === 'ustadz') {
    base.halaqoh = hal.filter(h => h.UstadzID === u.UserID);
    const ids = base.halaqoh.map(h => h.HalaqohID), hari = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
    base.santri = san.filter(s => ids.indexOf(s.HalaqohID) > -1 && s.Status === 'Aktif');
    base.setorHariIni = rows_('Hafalan').filter(x => String(x.Tanggal).slice(0, 10) === hari && x.UstadzID === u.UserID).map(x => x.SantriID);
  } else if (u.Role === 'admin') {
    base.santri = san; base.halaqoh = hal.map(h => Object.assign({}, h, { Ustadz: nmU(h.UstadzID), Jumlah: san.filter(s => s.HalaqohID === h.HalaqohID && s.Status === 'Aktif').length }));
    base.users = us.filter(x => x.Role !== 'wali').map(x => ({ UserID: x.UserID, Nama: x.Nama, Role: x.Role, Username: x.Username, WA: x.WA, QRToken: x.QRToken }));
    base.pendaftar = us.filter(x => x.Role === 'wali' && x.Status === 'Menunggu').map(x => ({ UserID: x.UserID, Nama: x.Nama, Email: x.Email, WA: x.WA, anak: san.filter(s => s.WaliID === x.UserID) }));
  }
  return base;
}
function info_() {
  return { nama: APP_NAME, alamat: 'Salamrejo, Resapombo, Doko, Blitar', pengumuman: rows_('Pengumuman').slice(-5).reverse(), youtube: setting_('YOUTUBE', ''),
    saldoMin: +setting_('SALDO_MENIPIS', '10000'), wa_admin: setting_('WA_ADMIN', ''), tahunAjaran: setting_('TAHUN_AJARAN', ''), wa_spp: setting_('WA_BENDAHARA_SPP', ''), wa_saku: setting_('WA_BENDAHARA_SAKU', ''), sosmed: { instagram: setting_('IG', ''), youtube: setting_('YT_CHANNEL', ''), facebook: setting_('FB', '') } };
}
const me_ = c => rows_('Users').find(x => x.UserID === c.s.id);

// ---------- Ustadz ----------
function setoran_(c, d) {
  pin_(c, d);
  const s = rows_('Santri').find(x => x.SantriID === d.santriId), h = s && rows_('Halaqoh').find(x => x.HalaqohID === s.HalaqohID);
  if (!h || h.UstadzID !== c.s.id) return fail_('Santri ini bukan di halaqoh Anda.');
  if (h.Jenis === 'Iqro' ? !d.juz && !d.dari : !d.surat) return fail_('Data setoran belum lengkap.');
  const jenis = h.Jenis || 'Quran', tgl = new Date();
  add_('Hafalan', { ID: uid_('H'), Tanggal: tgl, SantriID: s.SantriID, Jenis: jenis, Surat: d.surat || '', Juz: d.juz || '', Dari: d.dari || '', Sampai: d.sampai || '', Ukuran: d.ukuran || '', Satuan: d.satuan || '', Nilai: d.nilai || '', Status: d.status || 'Lanjut', UstadzID: c.s.id, Catatan: d.catatan || '' });
  notif_(c, s.WaliID, 'Setoran hafalan ' + s.Nama, 'Setoran ' + (d.surat || 'Iqro jilid ' + d.juz) + ' ayat/hal ' + (d.dari || '-') + '–' + (d.sampai || '-') + ', nilai ' + (d.nilai || '-') + ', status ' + (d.status || 'Lanjut') + '. Ustadz: ' + me_(c).Nama + '.');
  return ok_(null, 'Setoran tersimpan. Wali diberi tahu.');
}
function absensi_(c, d) {
  pin_(c, d);
  const ids = rows_('Halaqoh').filter(h => h.UstadzID === c.s.id).map(h => h.HalaqohID);
  const mine = {}; rows_('Santri').filter(s => ids.indexOf(s.HalaqohID) > -1).forEach(s => mine[s.SantriID] = 1);
  const tgl = String(d.tanggal || tz_(new Date(), 'yyyy-MM-dd')).slice(0, 10), ex = rows_('Absensi'), baru = []; let n = 0;
  (d.items || []).forEach(i => {
    const keg = i.kegiatan || d.kegiatan; if (!mine[i.santriId] || !keg || ['H', 'A', 'I', 'S'].indexOf(i.status) < 0) return;
    const old = ex.find(x => x.SantriID === i.santriId && x.Kegiatan === keg && dstr_(x.Tanggal) === tgl);   // simpan ulang = perbarui, bukan dobel
    if (old) upd_('Absensi', 'ID', old.ID, { Status: i.status, PencatatID: c.s.id }); else baru.push({ ID: uid_('A'), Tanggal: tgl, SantriID: i.santriId, Kegiatan: keg, Status: i.status, PencatatID: c.s.id });
    n++;
  });
  add_('Absensi', baru);
  return ok_(null, n + ' absensi tersimpan.');
}
function scanSantri_(c, d) {
  const s = rows_('Santri').find(x => x.QRToken === String(d.qr || '').trim()); if (!s) return fail_('Kartu tidak dikenali.');
  const h = rows_('Halaqoh').find(x => x.HalaqohID === s.HalaqohID);
  if (c.s.role === 'ustadz' && (!h || h.UstadzID !== c.s.id)) return fail_('Santri ini bukan di halaqoh Anda.');
  return ok_({ santriId: s.SantriID });
}

// ---------- Admin ----------
function saveSantri_(c, d) {
  if (d.SantriID) { const p = Object.assign({}, d); delete p.QRToken; upd_('Santri', 'SantriID', d.SantriID, p); }
  else add_('Santri', Object.assign({ SantriID: uid_('S'), QRToken: tok_(), Status: 'Aktif' }, d));
  log_(c.s.id, 'SANTRI', d.Nama); return ok_(boot_(me_(c)).santri, 'Data santri disimpan.');
}
function deleteSantri_(c, d) { del_('Santri', 'SantriID', d.id); log_(c.s.id, 'HAPUS_SANTRI', d.id); return ok_(null, 'Dihapus.'); }
function saveHalaqoh_(c, d) {
  if (d.HalaqohID) upd_('Halaqoh', 'HalaqohID', d.HalaqohID, d); else add_('Halaqoh', Object.assign({ HalaqohID: uid_('HQ') }, d));
  return ok_(null, 'Halaqoh disimpan.');
}
function saveUser_(c, d) {
  if (!d.Username || !d.password || !d.Nama) return fail_('Nama, username, dan sandi wajib.');
  if (['ustadz', 'bendahara_spp', 'bendahara_saku'].indexOf(d.Role) < 0) return fail_('Peran tidak valid.');
  if (rows_('Users').some(x => String(x.Username).toLowerCase() === String(d.Username).toLowerCase())) return fail_('Username sudah dipakai.');
  const salt = tok_().slice(0, 16);
  add_('Users', { UserID: uid_('U'), Username: d.Username, PassHash: hash_(d.password, salt), Salt: salt, Role: d.Role, Nama: d.Nama, Email: d.Email || '', WA: String(d.WA || ''), QRToken: tok_(), Status: 'Aktif' });
  return ok_(null, 'Akun dibuat.');
}
function approve_(c, d) {
  const w = rows_('Users').find(x => x.UserID === d.userId); if (!w) return fail_('Akun tidak ditemukan.');
  const anak = rows_('Santri').filter(s => s.WaliID === w.UserID);
  if (d.tolak) {
    upd_('Users', 'UserID', w.UserID, { Status: 'Ditolak' }); anak.forEach(s => upd_('Santri', 'SantriID', s.SantriID, { Status: 'Ditolak' }));
    notif_(c, w.UserID, 'Pendaftaran ditolak', 'Mohon maaf, pendaftaran ditolak. ' + (d.catatan || '')); return ok_(null, 'Ditolak.');
  }
  if (!d.halaqohId) return fail_('Pilih halaqoh untuk santri.');
  upd_('Users', 'UserID', w.UserID, { Status: 'Aktif' });
  anak.forEach((s, i) => upd_('Santri', 'SantriID', s.SantriID, { Status: 'Aktif', HalaqohID: d.halaqohId, NIS: (i === 0 && d.nis) || s.NIS }));
  notif_(c, w.UserID, 'Pendaftaran disetujui', 'Akun Anda aktif. Silakan masuk dan pantau perkembangan putra/putri Anda.');
  return ok_(null, 'Wali disetujui.');
}
function regenQR_(c, d) {
  const t = tok_(); upd_(d.type === 'santri' ? 'Santri' : 'Users', d.type === 'santri' ? 'SantriID' : 'UserID', d.id, { QRToken: t });
  log_(c.s.id, 'REGEN_QR', d.id); return ok_({ qr: t }, 'Barcode baru dibuat. Barcode lama tidak berlaku.');
}
function savePengaturan_(c, d) {
  Object.keys(d).forEach(k => { if (!upd_('Pengaturan', 'key', k, { value: d[k] })) add_('Pengaturan', { key: k, value: d[k] }); });
  return ok_(null, 'Pengaturan disimpan.');
}
function saveInfo_(c, d) { add_('Pengumuman', { ID: uid_('P'), Tanggal: new Date(), Judul: d.judul, Isi: d.isi }); return ok_(null, 'Pengumuman dipublikasikan.'); }
function readNotif_(c) { rows_('Notif').filter(n => n.UserID === c.s.id && !n.Dibaca).forEach(n => upd_('Notif', 'ID', n.ID, { Dibaca: '1' })); return ok_(null); }

const ANY = ['wali', 'ustadz', 'admin', 'bendahara_spp', 'bendahara_saku'];
const ROUTES = {
  home: { fn: () => ok_(info_()) }, login: { fn: login_ }, loginQR: { fn: loginQR_ }, register: { write: true, fn: register_ },
  boot: { roles: ANY, fn: c => ok_(boot_(me_(c))) },
  readNotif: { roles: ANY, write: true, fn: readNotif_ },
  setoran: { roles: ['ustadz'], write: true, fn: setoran_ }, absensi: { roles: ['ustadz'], write: true, fn: absensi_ },
  scanSantri: { roles: ['ustadz', 'admin', 'bendahara_spp', 'bendahara_saku'], fn: scanSantri_ },
  saveSantri: { roles: ['admin'], write: true, fn: saveSantri_ }, deleteSantri: { roles: ['admin'], write: true, fn: deleteSantri_ },
  saveHalaqoh: { roles: ['admin'], write: true, fn: saveHalaqoh_ }, saveUser: { roles: ['admin'], write: true, fn: saveUser_ },
  approve: { roles: ['admin'], write: true, fn: approve_ }, regenQR: { roles: ['admin'], write: true, fn: regenQR_ },
  savePengaturan: { roles: ['admin'], write: true, fn: savePengaturan_ }, saveInfo: { roles: ['admin'], write: true, fn: saveInfo_ }
};

// ---------- SETUP — jalankan SEKALI ----------
function setupAppEnvironment() {
  if (P.getProperty('SPREADSHEET_ID')) { Logger.log('⚠️ Setup sudah pernah dijalankan. Berhenti.'); return; }
  const root = DriveApp.createFolder('📁 ' + APP_NAME), ss = SpreadsheetApp.create('🗃️ Database — ' + APP_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  Object.keys(H).forEach((n, i) => {
    const sh = i === 0 ? ss.getActiveSheet().setName(n) : ss.insertSheet(n);
    sh.getRange(1, 1, 1, H[n].length).setValues([H[n]]).setFontWeight('bold').setBackground('#0D4D3D').setFontColor('#fff'); sh.setFrozenRows(1);
  });
  ['WA'].forEach(() => ss.getSheetByName('Users').getRange('H:H').setNumberFormat('@'));
  P.setProperties({ SPREADSHEET_ID: ss.getId(), ROOT_FOLDER_ID: root.getId() });
  fase2Setup_();
  const pass = tok_().slice(0, 10), salt = tok_().slice(0, 16);
  add_('Users', { UserID: uid_('U'), Username: 'admin', PassHash: hash_(pass, salt), Salt: salt, Role: 'admin', Nama: 'Administrator', QRToken: tok_(), Status: 'Aktif' });
  add_('Pengaturan', [{ key: 'EMAIL_AKTIF', value: '1' }, { key: 'SALDO_MENIPIS', value: '10000' }]);
  Logger.log('✅ Setup selesai. Spreadsheet: ' + ss.getUrl());
  Logger.log('🔑 LOGIN ADMIN → username: admin | sandi: ' + pass + '  (SIMPAN, hanya tampil sekali)');
}

// =====================================================================
// FASE 2 — SPP, Uang Saku, Konfirmasi Transfer, Perizinan, Pengingat
// Untuk app yang sudah berjalan: jalankan upgradeFase2() SEKALI.
// =====================================================================
const rp_ = n => 'Rp' + String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const tz_ = (d, f) => Utilities.formatDate(d, 'Asia/Jakarta', f);
const per_ = v => v instanceof Date ? tz_(v, 'yyyy-MM').slice(0, 7) : String(v || '').slice(0, 7);
const curPer_ = () => per_(new Date());
const nm_ = id => (rows_('Santri').find(x => x.SantriID === id) || {}).Nama || '';
const unm_ = id => (rows_('Users').find(x => x.UserID === id) || {}).Nama || '';
const rek_ = j => ({ bank: setting_('BANK_' + j, ''), norek: setting_('NOREK_' + j, ''), an: setting_('AN_' + j, '') });
const saldo_ = sid => { const r = rows_('Saku').filter(x => x.SantriID === sid); return r.length ? +r[r.length - 1].Saldo : 0; };
const bendahara_ = j => rows_('Users').filter(x => x.Role === 'bendahara_' + String(j).toLowerCase() && x.Status === 'Aktif');

function fase2Setup_() {
  const ss = SpreadsheetApp.openById(P.getProperty('SPREADSHEET_ID'));
  Object.keys(H).forEach(n => {
    if (ss.getSheetByName(n)) return;
    const sh = ss.insertSheet(n);
    sh.getRange(1, 1, 1, H[n].length).setValues([H[n]]).setFontWeight('bold').setBackground('#0D4D3D').setFontColor('#fff'); sh.setFrozenRows(1);
  });
  Object.keys(H).forEach(n => {   // sheet lama: tambahkan kolom baru di ujung kanan
    const sh = ss.getSheetByName(n), hr = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(String);
    H[n].forEach(k => { if (hr.indexOf(k) < 0) { sh.getRange(1, hr.length + 1, 1, 1).setValues([[k]]).setFontWeight('bold').setBackground('#0D4D3D').setFontColor('#fff'); hr.push(k); } });
  });
  // Hindari Sheets mengubah "2026-10" / "0812…" menjadi tanggal / angka
  [['SPP', 'C:C'], ['Pengaturan', 'B:B'], ['Transfer', 'G:G'], ['Izin', 'F:G'], ['Absensi', 'B:B']].forEach(x => ss.getSheetByName(x[0]).getRange(x[1]).setNumberFormat('@'));
  if (!P.getProperty('UPLOADS_FOLDER')) P.setProperty('UPLOADS_FOLDER', DriveApp.getFolderById(P.getProperty('ROOT_FOLDER_ID')).createFolder('📂 Uploads').getId());
}
function upgradeFase2() { fase2Setup_(); Logger.log('✅ Upgrade Fase 2 selesai. Deploy ulang: Kelola deployment → Versi baru.'); }

const dstr_ = v => v instanceof Date ? tz_(v, 'yyyy-MM-dd') : String(v || '').slice(0, 10);
const hq_ = id => (rows_('Halaqoh').find(x => x.HalaqohID === id) || {}).Nama || '';
const waliOf_ = id => rows_('Users').find(x => x.UserID === id) || {};
function pin_(c, d) {
  const u = me_(c); if (!u || u.Role === 'admin' || u.Role === 'wali') return;
  if (!u.PIN) throw new Error('Buat PIN 4 digit dulu di menu Profil.');
  const ch = CacheService.getScriptCache(), k = 'pin_' + u.UserID, n = +ch.get(k) || 0;
  if (n >= 5) throw new Error('PIN terkunci 10 menit karena salah berulang.');
  if (hash_(String(d.pin || ''), u.Salt) !== u.PIN) { ch.put(k, String(n + 1), 600); throw new Error('PIN salah.'); }
}
function setPin_(c, d) {
  const u = me_(c); if (!/^\d{4}$/.test(String(d.pin || ''))) return fail_('PIN harus 4 angka.');
  if (u.PIN && hash_(String(d.lama || ''), u.Salt) !== u.PIN) return fail_('PIN lama salah.');
  upd_('Users', 'UserID', u.UserID, { PIN: hash_(String(d.pin), u.Salt) }); return ok_(null, 'PIN disimpan.');
}
function fotoWali_(c, d) {
  const s = rows_('Santri').find(x => x.SantriID === d.santriId); if (!s || (c.s.role !== 'admin' && s.WaliID !== c.s.id)) return fail_('Santri tidak ditemukan.');
  const f = thumbOk_(d.foto); if (!f) return fail_('Foto tidak valid.'); upd_('Santri', 'SantriID', s.SantriID, { Foto: f }); return ok_({ Foto: f }, 'Foto diperbarui.');
}
function sppData_(periode) {
  const lunas = {}; rows_('SPP').filter(x => per_(x.Periode) === periode).forEach(x => lunas[x.SantriID] = 1);
  return { periode, nominal: +setting_('SPP_NOMINAL', '0'), santri: rows_('Santri').filter(s => s.Status === 'Aktif').map(s => ({ SantriID: s.SantriID, Nama: s.Nama, NIS: s.NIS, Halaqoh: hq_(s.HalaqohID), Wali: waliOf_(s.WaliID).Nama, WA: waliOf_(s.WaliID).WA, lunas: !!lunas[s.SantriID] })) };
}
function transferList_(j) {
  return rows_('Transfer').filter(x => x.Jenis === j && x.Status === 'Menunggu').map(t => { const o = Object.assign({}, t); delete o.BuktiID; o.Santri = nm_(t.SantriID); o.Wali = unm_(t.WaliID); const sa = rows_('Santri').find(x => x.SantriID === t.SantriID) || {}; o.NIS = sa.NIS; o.Halaqoh = hq_(sa.HalaqohID); return o; });
}
function izinMenunggu_(santriIds) {
  return rows_('Izin').filter(x => x.Status === 'Menunggu' && (!santriIds || santriIds.indexOf(x.SantriID) > -1)).map(x => Object.assign({}, x, { Santri: nm_(x.SantriID) }));
}
function boot_(u) {
  const b = bootBase_(u); b.periode = curPer_(); b.user.pin = !!u.PIN;
  const sal = () => rows_('Santri').filter(s => s.Status === 'Aktif').map(s => ({ SantriID: s.SantriID, Nama: s.Nama, NIS: s.NIS, Halaqoh: hq_(s.HalaqohID), Wali: waliOf_(s.WaliID).Nama, WA: waliOf_(s.WaliID).WA, saldo: saldo_(s.SantriID) }));
  if (u.Role === 'wali') {
    b.rek = { spp: rek_('SPP'), saku: rek_('SAKU') };
    b.anak.forEach(a => {
      const id = a.SantriID, mine = n => rows_(n).filter(x => x.SantriID === id);
      a.sppLunas = mine('SPP').some(x => per_(x.Periode) === b.periode); a.spp = mine('SPP').slice(-6).reverse();
      a.saldo = saldo_(id); a.saku = mine('Saku').slice(-10).reverse(); a.izin = mine('Izin').slice(-10).reverse();
      a.transfer = mine('Transfer').slice(-10).reverse().map(t => { const o = Object.assign({}, t); delete o.BuktiID; return o; });
    });
  } else if (u.Role === 'bendahara_spp') { Object.assign(b, sppData_(b.periode)); b.rek = rek_('SPP'); b.transfer = transferList_('SPP'); }
  else if (u.Role === 'bendahara_saku') {
    b.rek = rek_('SAKU'); b.transfer = transferList_('Saku');
    b.santriSaldo = sal();
  } else if (u.Role === 'ustadz') b.izin = izinMenunggu_(b.santri.map(s => s.SantriID));
  else if (u.Role === 'admin') {
    b.izin = izinMenunggu_(null); b.santri = b.santri.map(s => { const o = Object.assign({}, s); delete o.Foto; return o; });
    b.sppData = sppData_(b.periode); b.santriSaldo = sal(); b.transfer = transferList_('SPP').concat(transferList_('Saku'));
    b.set = { SPP_NOMINAL: setting_('SPP_NOMINAL', ''), SPP_TGL: setting_('SPP_TGL', '10'), SALDO_MENIPIS: setting_('SALDO_MENIPIS', '10000'), EMAIL_AKTIF: setting_('EMAIL_AKTIF', '1'), WA_ADMIN: setting_('WA_ADMIN', ''), TAHUN_AJARAN: setting_('TAHUN_AJARAN', '') }; b.rek = { spp: rek_('SPP'), saku: rek_('SAKU') };
  }
  return b;
}

// ---- Uang saku ----
function sakuTx_(c, sid, jenis, nominal, ket) {
  nominal = Math.round(+nominal); if (!(nominal > 0)) throw new Error('Nominal tidak valid.');
  const s = rows_('Santri').find(x => x.SantriID === sid); if (!s || s.Status !== 'Aktif') throw new Error('Santri tidak ditemukan.');
  const lama = saldo_(sid), baru = jenis === 'Setor' ? lama + nominal : lama - nominal;
  if (jenis !== 'Setor' && jenis !== 'Tarik') throw new Error('Jenis transaksi tidak valid.');
  if (baru < 0) throw new Error('Saldo tidak cukup (saldo ' + rp_(lama) + ').');
  add_('Saku', { ID: uid_('K'), Waktu: new Date(), SantriID: sid, Jenis: jenis, Nominal: nominal, Saldo: baru, Keterangan: ket || '', PencatatID: c.s ? c.s.id : '' });
  notif_(c, s.WaliID, 'Uang saku ' + s.Nama, (jenis === 'Setor' ? 'Setoran ' : 'Penarikan ') + rp_(nominal) + '. Saldo sekarang ' + rp_(baru) + '.');
  if (jenis === 'Tarik' && baru <= +setting_('SALDO_MENIPIS', '10000'))
    notif_(c, s.WaliID, baru === 0 ? 'Uang saku habis' : 'Uang saku menipis', 'Saldo uang saku ' + s.Nama + ' tinggal ' + rp_(baru) + '. Mohon top up atau hubungi bendahara uang saku.');
  return baru;
}
function sakuCatat_(c, d) { pin_(c, d); const b = sakuTx_(c, d.santriId, d.jenis, d.nominal, d.ket); return ok_({ saldo: b }, 'Tercatat. Saldo ' + rp_(b)); }

// ---- SPP ----
function sppBayar_(c, sid, periode, nominal, sumber) {
  const s = rows_('Santri').find(x => x.SantriID === sid); if (!s) throw new Error('Santri tidak ditemukan.');
  if (!/^\d{4}-\d{2}$/.test(periode)) throw new Error('Periode harus berformat yyyy-MM.');
  if (rows_('SPP').some(x => x.SantriID === sid && per_(x.Periode) === periode)) throw new Error('SPP ' + periode + ' sudah lunas.');
  add_('SPP', { ID: uid_('P'), SantriID: sid, Periode: periode, Nominal: Math.round(+nominal) || +setting_('SPP_NOMINAL', '0'), Tanggal: new Date(), PencatatID: _c.s ? _c.s.id : '', Sumber: sumber || 'Tunai' });
  notif_(_c, s.WaliID, 'SPP ' + periode + ' lunas', 'SPP ' + s.Nama + ' periode ' + periode + ' sebesar ' + rp_(nominal) + ' telah dicatat lunas. Jazakumullah khairan.');
}
let _c = {};
function sppCatat_(c, d) { pin_(c, d); _c = c; sppBayar_(c, d.santriId, d.periode, d.nominal, 'Tunai'); return ok_(sppData_(d.periode), 'SPP tercatat lunas.'); }
function sppData_route_(c, d) { return ok_(sppData_(d.periode || curPer_())); }

// ---- Konfirmasi transfer ----
function simpanBukti_(dataUrl) {
  const m = /^data:image\/jpeg;base64,(.+)$/.exec(dataUrl || '');
  if (!m || m[1].length > 400000) throw new Error('Foto bukti transfer wajib (JPEG, maks ±200 KB).');
  return DriveApp.getFolderById(P.getProperty('UPLOADS_FOLDER')).createFile(Utilities.newBlob(Utilities.base64Decode(m[1]), 'image/jpeg', 'bukti_' + Date.now() + '.jpg')).getId();
}
function transferKirim_(c, d) {
  const s = rows_('Santri').find(x => x.SantriID === d.santriId && x.WaliID === c.s.id); if (!s) return fail_('Santri tidak ditemukan.');
  if (['SPP', 'Saku'].indexOf(d.jenis) < 0 || !(+d.nominal > 0)) return fail_('Jenis dan nominal wajib diisi.');
  add_('Transfer', { ID: uid_('T'), Waktu: new Date(), WaliID: c.s.id, SantriID: s.SantriID, Jenis: d.jenis, Nominal: Math.round(+d.nominal), TglTransfer: d.tglTransfer || '', Catatan: d.catatan || '', BuktiID: simpanBukti_(d.bukti), Status: 'Menunggu' });
  bendahara_(d.jenis).forEach(u => notif_(c, u.UserID, 'Konfirmasi transfer ' + (d.jenis === 'SPP' ? 'SPP' : 'uang saku'), 'Wali ' + me_(c).Nama + ' (santri ' + s.Nama + ') mengirim konfirmasi ' + rp_(d.nominal) + ', tanggal ' + (d.tglTransfer || '-') + '. Mohon diverifikasi di aplikasi.'));
  return ok_(null, 'Konfirmasi terkirim. Menunggu verifikasi bendahara.');
}
function transferVerif_(c, d) {
  _c = c; pin_(c, d);
  const t = rows_('Transfer').find(x => x.ID === d.id); if (!t || t.Status !== 'Menunggu') return fail_('Konfirmasi tidak ditemukan atau sudah diproses.');
  if (c.s.role !== 'admin' && c.s.role !== 'bendahara_' + String(t.Jenis).toLowerCase()) return fail_('Bukan wewenang Anda.');
  if (d.terima) {
    if (t.Jenis === 'SPP') sppBayar_(c, t.SantriID, d.periode || per_(t.TglTransfer) || curPer_(), t.Nominal, 'Transfer');
    else sakuTx_(c, t.SantriID, 'Setor', t.Nominal, 'Transfer ' + t.ID);
  }
  upd_('Transfer', 'ID', t.ID, { Status: d.terima ? 'Diterima' : 'Ditolak', VerifierID: c.s.id, CatatanVerif: d.catatan || '' });
  notif_(c, t.WaliID, 'Konfirmasi transfer ' + (d.terima ? 'diterima' : 'ditolak'), 'Konfirmasi ' + rp_(t.Nominal) + ' (' + t.Jenis + ' ' + nm_(t.SantriID) + ') ' + (d.terima ? 'telah diterima.' : 'ditolak. ' + (d.catatan || '')));
  return ok_(null, d.terima ? 'Diterima dan tercatat.' : 'Ditolak.');
}
function bukti_(c, d) {
  const t = rows_('Transfer').find(x => x.ID === d.id); if (!t) return fail_('Data tidak ditemukan.');
  if (c.s.role !== 'admin' && t.WaliID !== c.s.id && c.s.role !== 'bendahara_' + String(t.Jenis).toLowerCase()) return fail_('Tidak berhak melihat bukti ini.');
  return ok_('data:image/jpeg;base64,' + Utilities.base64Encode(DriveApp.getFileById(t.BuktiID).getBlob().getBytes()));
}
function saveRek_(c, d) {
  const j = c.s.role === 'bendahara_spp' ? 'SPP' : c.s.role === 'bendahara_saku' ? 'SAKU' : String(d.jenis || '').toUpperCase();
  if (['SPP', 'SAKU'].indexOf(j) < 0) return fail_('Jenis rekening tidak valid.');
  const o = {}; o['BANK_' + j] = d.bank || ''; o['NOREK_' + j] = d.norek || ''; o['AN_' + j] = d.an || ''; return savePengaturan_(c, o);
}

// ---- Perizinan ----
function izinKirim_(c, d) {
  const s = rows_('Santri').find(x => x.SantriID === d.santriId && x.WaliID === c.s.id); if (!s) return fail_('Santri tidak ditemukan.');
  if (!d.mulai || !d.selesai || d.selesai < d.mulai) return fail_('Tanggal izin tidak valid.');
  add_('Izin', { ID: uid_('Z'), Waktu: new Date(), SantriID: s.SantriID, WaliID: c.s.id, Jenis: d.jenis || 'Keperluan Keluarga', Mulai: d.mulai, Selesai: d.selesai, Alasan: d.alasan || '', Status: 'Menunggu' });
  const h = rows_('Halaqoh').find(x => x.HalaqohID === s.HalaqohID);
  [h && h.UstadzID].concat(rows_('Users').filter(x => x.Role === 'admin').map(x => x.UserID)).filter(Boolean).forEach(id => notif_(c, id, 'Pengajuan izin ' + s.Nama, d.jenis + ' ' + d.mulai + ' s.d. ' + d.selesai + '. ' + (d.alasan || '')));
  return ok_(null, 'Pengajuan izin terkirim.');
}
function izinPutus_(c, d) {
  const z = rows_('Izin').find(x => x.ID === d.id); if (!z || z.Status !== 'Menunggu') return fail_('Pengajuan tidak ditemukan atau sudah diputuskan.');
  const s = rows_('Santri').find(x => x.SantriID === z.SantriID), h = s && rows_('Halaqoh').find(x => x.HalaqohID === s.HalaqohID);
  if (c.s.role !== 'admin' && !(h && h.UstadzID === c.s.id)) return fail_('Bukan wewenang Anda.');
  if (d.setuju) {
    const list = [], end = new Date(String(z.Selesai).slice(0, 10) + 'T12:00:00');
    for (let t = new Date(String(z.Mulai).slice(0, 10) + 'T12:00:00'), i = 0; t <= end && i < 31; i++, t.setDate(t.getDate() + 1))
      list.push({ ID: uid_('A'), Tanggal: tz_(t, 'yyyy-MM-dd'), SantriID: z.SantriID, Kegiatan: 'Izin Pondok', Status: 'I', PencatatID: c.s.id });
    add_('Absensi', list);
  }
  upd_('Izin', 'ID', z.ID, { Status: d.setuju ? 'Disetujui' : 'Ditolak', PemutusID: c.s.id, Catatan: d.catatan || '' });
  notif_(c, z.WaliID, 'Izin ' + (d.setuju ? 'disetujui' : 'ditolak'), 'Izin ' + nm_(z.SantriID) + ' (' + z.Jenis + ') ' + (d.setuju ? 'disetujui' : 'ditolak. ' + (d.catatan || '')));
  return ok_(null, d.setuju ? 'Izin disetujui.' : 'Izin ditolak.');
}

// ---- Pengingat harian (trigger) ----
function kirimPengingat() {
  const tgl = +Utilities.formatDate(new Date(), 'Asia/Jakarta', 'd'); if (tgl !== +setting_('SPP_TGL', '10')) return;
  const c = { s: null, after: [] }, lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const per = curPer_(), aktif = rows_('Santri').filter(s => s.Status === 'Aktif');
    const belum = aktif.filter(s => !rows_('SPP').some(x => x.SantriID === s.SantriID && per_(x.Periode) === per));
    belum.forEach(s => notif_(c, s.WaliID, 'SPP ' + per + ' belum dibayar', 'SPP ' + s.Nama + ' periode ' + per + ' belum tercatat. Mohon lakukan pembayaran atau hubungi bendahara SPP.'));
    bendahara_('SPP').forEach(u => notif_(c, u.UserID, 'Rekap SPP ' + per, 'Lunas: ' + (aktif.length - belum.length) + ', belum lunas: ' + belum.length + ', konfirmasi menunggu: ' + transferList_('SPP').length + '.'));
  } finally { lock.releaseLock(); }
  c.after.forEach(f => { try { f(); } catch (e) {} });
}
function pasangTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'kirimPengingat').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('kirimPengingat').timeBased().everyDays(1).atHour(8).create(); Logger.log('✅ Pengingat harian aktif (jam 08.00).');
}

Object.assign(ROUTES, {
  sakuCatat: { roles: ['bendahara_saku'], write: true, fn: sakuCatat_ },
  sppCatat: { roles: ['bendahara_spp'], write: true, fn: sppCatat_ },
  sppData: { roles: ['bendahara_spp', 'admin'], fn: sppData_route_ },
  transferKirim: { roles: ['wali'], write: true, fn: transferKirim_ },
  transferVerif: { roles: ['bendahara_spp', 'bendahara_saku', 'admin'], write: true, fn: transferVerif_ },
  buktiLihat: { roles: ['wali', 'bendahara_spp', 'bendahara_saku', 'admin'], fn: bukti_ },
  saveRek: { roles: ['bendahara_spp', 'bendahara_saku', 'admin'], write: true, fn: saveRek_ },
  izinKirim: { roles: ['wali'], write: true, fn: izinKirim_ }, setPin: { roles: ['ustadz', 'bendahara_spp', 'bendahara_saku'], write: true, fn: setPin_ }, fotoWali: { roles: ['wali', 'admin'], write: true, fn: fotoWali_ },
  izinPutus: { roles: ['ustadz', 'admin'], write: true, fn: izinPutus_ }
});
