(function () {
  'use strict';

  /* ---- Pencarian & filter kategori langsung (tanpa reload) ---- */
  var grid = document.getElementById('grid');
  if (grid) {
    var q = document.getElementById('q');
    var chips = document.querySelectorAll('#chips .chip');
    var kInput = document.getElementById('kategoriInput');
    var cards = grid.querySelectorAll('.card');
    var empty = document.getElementById('empty');
    var count = document.getElementById('count');
    var aktif = parseInt(kInput.value || '0', 10);

    function terapkan() {
      var kata = q.value.trim().toLowerCase();
      var n = 0;
      cards.forEach(function (c) {
        var cocokK = !aktif || parseInt(c.dataset.k, 10) === aktif;
        var cocokT = !kata || c.dataset.text.indexOf(kata) !== -1;
        var tampil = cocokK && cocokT;
        c.classList.toggle('hidden', !tampil);
        if (tampil) n++;
      });
      empty.classList.toggle('hidden', n > 0);
      count.textContent = n + ' event ditemukan';
    }

    q.addEventListener('input', terapkan);
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        aktif = parseInt(ch.dataset.k, 10);
        kInput.value = aktif || '';
        chips.forEach(function (x) { x.classList.toggle('on', x === ch); });
        terapkan();
      });
    });
    document.getElementById('filterForm').addEventListener('submit', function (ev) {
      ev.preventDefault(); terapkan();
    });
    terapkan();
  }

  /* ---- Validasi form pendaftaran ---- */
  var form = document.getElementById('daftarForm');
  if (form) {
    var aturan = {
      nama_peserta: function (v) { return v.trim().length >= 3 ? '' : 'Nama minimal 3 karakter.'; },
      nim:          function (v) { return /^[0-9A-Za-z]{5,20}$/.test(v.trim()) ? '' : 'NIM 5-20 karakter (huruf/angka).'; },
      email:        function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Format email tidak valid.'; }
    };
    function cek(input) {
      var pesan = aturan[input.name](input.value);
      var f = input.closest('.field');
      f.classList.toggle('bad', !!pesan);
      f.querySelector('.err-msg').textContent = pesan;
      return !pesan;
    }
    Object.keys(aturan).forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener('blur', function () { cek(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('bad')) cek(el); });
    });
    form.addEventListener('submit', function (ev) {
      var ok = true;
      Object.keys(aturan).forEach(function (n) { if (!cek(form.elements[n])) ok = false; });
      if (!ok) { ev.preventDefault(); return; }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Menyimpan...';
    });
  }

  /* ---- Modal hapus event (admin) ---- */
  var modal = document.getElementById('modalHapus');
  if (modal) {
    document.querySelectorAll('[data-hapus]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.getElementById('hapusId').value = b.dataset.hapus;
        document.getElementById('modalText').textContent =
          '"' + b.dataset.nama + '" dan seluruh data pendaftarnya akan dihapus permanen.';
        modal.classList.add('open');
      });
    });
    document.getElementById('batalHapus').addEventListener('click', function () { modal.classList.remove('open'); });
    modal.addEventListener('click', function (ev) { if (ev.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') modal.classList.remove('open'); });
  }

  /* ---- Notifikasi hilang otomatis ---- */
  var fl = document.getElementById('flash');
  if (fl) { setTimeout(function () { fl.remove(); }, 6000); }
})();
