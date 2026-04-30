(function () {
  // ✅ FIXED: use Railway backend
  const API = 'https://ointment-booking-backend-production.up.railway.app/api';

  const $ = (id) => document.getElementById(id);

  let services = [];
  let specialties = [];
  let professionals = [];
  let pendingBook = { prof: null, slot: null };

  function tokenGet() {
    return localStorage.getItem('authToken');
  }

  function tokenSet(t) {
    if (t) localStorage.setItem('authToken', t);
    else localStorage.removeItem('authToken');
  }

  function showMessage(text, type) {
    const el = $('message');
    el.textContent = text;
    el.className = 'show ' + (type === 'error' ? 'error' : 'ok');
    if (!text) el.className = '';
  }

  async function apiRequest(path, opts) {
    const headers = { 'Content-Type': 'application/json', ...(opts && opts.headers) };
    const t = tokenGet();
    if (t) headers.Authorization = 'Bearer ' + t;

    const res = await fetch(API + path, { ...opts, headers });

    let data = {};
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
    return data;
  }

  function profDisplayName(p) {
    const u = p.userId;
    if (u && typeof u === 'object' && u.fullName) return u.fullName;
    return 'Professional';
  }

  function serviceMatchesProfessional(svc, prof) {
    if (!svc) return true;
    if (svc.providerType === 'any') return true;
    return svc.providerType === prof.type;
  }

  function filteredProfessionals() {
    const spec = $('filter-specialty').value;
    const svcId = $('filter-service').value;
    const svc = svcId ? services.find((s) => s._id === svcId) : null;

    return professionals.filter((p) => {
      if (spec && p.specialty !== spec) return false;
      if (svc && !serviceMatchesProfessional(svc, p)) return false;
      return true;
    });
  }

  async function loadProfessionals() {
    const spec = $('filter-specialty').value;
    const qs = spec ? '?specialty=' + encodeURIComponent(spec) : '';
    professionals = await apiRequest('/professionals' + qs, { method: 'GET' });
    renderProfessionals();
  }

  async function loadTimeSlots(profId) {
    const date = $('filter-date').value;
    const qs = new URLSearchParams({ isAvailable: 'true' });
    if (date) qs.set('date', date);
    return apiRequest('/time-slots/professional/' + profId + '?' + qs.toString(), { method: 'GET' });
  }

  function formatRange(start, end) {
    const a = new Date(start);
    const b = new Date(end);
    return a.toLocaleString() + ' - ' + b.toLocaleTimeString();
  }

  async function renderProfessionals() {
    const ul = $('pro-list');
    ul.innerHTML = '';
    const list = filteredProfessionals();

    for (const p of list) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${profDisplayName(p)}</strong> (${p.specialty})`;

      const slotsWrap = document.createElement('div');

      let slots = [];
      try {
        slots = await loadTimeSlots(p._id);
      } catch {
        slotsWrap.textContent = 'Error loading slots';
      }

      slots.forEach((sl) => {
        const btn = document.createElement('button');
        btn.textContent = formatRange(sl.startTime, sl.endTime);
        btn.onclick = () => openBookDialog(p, sl);
        slotsWrap.appendChild(btn);
      });

      li.appendChild(slotsWrap);
      ul.appendChild(li);
    }
  }

  function openBookDialog(prof, slot) {
    pendingBook = { prof, slot };
    $('dlg-summary').textContent =
      profDisplayName(prof) + ' · ' + formatRange(slot.startTime, slot.endTime);

    const sel = $('dlg-service');
    sel.innerHTML = '';

    const ok = services.filter((s) => serviceMatchesProfessional(s, prof));

    ok.forEach((s) => {
      const o = document.createElement('option');
      o.value = s._id;
      o.textContent = s.name;
      sel.appendChild(o);
    });

    $('dlg-book').showModal();
  }

  async function confirmBooking() {
    const { prof, slot } = pendingBook;
    const serviceId = $('dlg-service').value;

    await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        professionalId: prof._id,
        serviceId,
        timeSlotId: slot._id,
      }),
    });

    $('dlg-book').close();
    showMessage('Booking created', 'ok');
  }

  async function loadMyBookings() {
    const rows = await apiRequest('/bookings/my-bookings', { method: 'GET' });
    console.log(rows);
  }

  function showPanels(user) {
    if (user) {
      $('panel-auth').classList.add('hidden');
      $('panel-client').classList.remove('hidden');
    } else {
      $('panel-auth').classList.remove('hidden');
    }
  }

  async function boot() {
    // ✅ FIXED LOGIN
    $('btn-login').addEventListener('click', async () => {
      try {
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: $('email').value.trim(),
            password: $('password').value,
          }),
        });

        tokenSet(data.token);
        showPanels(data.user);
        await initClient();
      } catch (e) {
        showMessage(e.message, 'error');
      }
    });

    // ✅ FIXED REGISTER
    $('btn-register').addEventListener('click', async () => {
      try {
        const data = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email: $('email').value.trim(),
            password: $('password').value,
            fullName: $('fullName').value,
            role: $('role').value,
          }),
        });

        tokenSet(data.token);
        showPanels(data.user);
        await initClient();
      } catch (e) {
        showMessage(e.message, 'error');
      }
    });

    const t = tokenGet();
    if (!t) return;

    try {
      const user = await apiRequest('/auth/me', { method: 'GET' });
      showPanels(user);
      await initClient();
    } catch {
      tokenSet(null);
    }
  }

  async function initClient() {
    services = await apiRequest('/services', { method: 'GET' });
    specialties = await apiRequest('/professionals/specialties', { method: 'GET' });

    await loadProfessionals();
    await loadMyBookings();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();