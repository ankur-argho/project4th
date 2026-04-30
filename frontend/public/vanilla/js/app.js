(function () {
  const API = '/api';

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
    } catch {
      /* empty */
    }
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
    return a.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' – ' + b.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  async function renderProfessionals() {
    const ul = $('pro-list');
    ul.innerHTML = '';
    const list = filteredProfessionals();

    for (const p of list) {
      const li = document.createElement('li');
      const left = document.createElement('div');
      left.innerHTML =
        '<strong>' +
        profDisplayName(p) +
        '</strong><span style="color:#5c6578;font-size:.85rem"> · ' +
        (p.specialty || '') +
        ' · ' +
        (p.type || '') +
        '</span>';

      const slotsWrap = document.createElement('div');
      slotsWrap.className = 'slots';

      let slots = [];
      try {
        slots = await loadTimeSlots(p._id);
      } catch {
        slotsWrap.textContent = 'Could not load slots';
      }

      if (!slots.length) {
        const span = document.createElement('span');
        span.style.color = '#94a3b8';
        span.style.fontSize = '0.85rem';
        span.textContent = $('filter-date').value ? 'No open slots this date' : 'Pick a date to see slots';
        slotsWrap.appendChild(span);
      } else {
        for (const sl of slots) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'slot-btn';
          b.textContent = formatRange(sl.startTime, sl.endTime);
          b.addEventListener('click', () => openBookDialog(p, sl));
          slotsWrap.appendChild(b);
        }
      }

      li.appendChild(left);
      li.appendChild(slotsWrap);
      ul.appendChild(li);
    }
  }

  function openBookDialog(prof, slot) {
    pendingBook = { prof, slot };
    const dlg = $('dlg-book');
    $('dlg-summary').textContent =
      profDisplayName(prof) + ' · ' + formatRange(slot.startTime, slot.endTime);

    const sel = $('dlg-service');
    sel.innerHTML = '';
    const ok = services.filter((s) => s.isActive !== false && serviceMatchesProfessional(s, prof));
    if (!ok.length) {
      showMessage('No compatible services for this professional.', 'error');
      return;
    }
    for (const s of ok) {
      const o = document.createElement('option');
      o.value = s._id;
      o.textContent = s.name + ' ($' + s.price + ')';
      sel.appendChild(o);
    }
    $('dlg-notes').value = '';
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else alert('Your browser does not support <dialog>. Use the React app to book.');
  }

  async function confirmBooking() {
    const serviceId = $('dlg-service').value;
    const notes = $('dlg-notes').value.trim();
    const { prof, slot } = pendingBook;
    if (!prof || !slot || !serviceId) return;
    try {
      await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          professionalId: prof._id,
          serviceId,
          timeSlotId: slot._id,
          notes,
        }),
      });
      $('dlg-book').close();
      showMessage('Booking created (pending professional confirmation).', 'ok');
      await loadProfessionals();
      await loadMyBookings();
    } catch (e) {
      showMessage(e.message, 'error');
    }
  }

  async function loadMyBookings() {
    const tbody = $('bookings-table').querySelector('tbody');
    tbody.innerHTML = '';
    try {
      const rows = await apiRequest('/bookings/my-bookings', { method: 'GET' });
      for (const b of rows) {
        const tr = document.createElement('tr');
        const slot = b.timeSlotId;
        const when = slot && slot.startTime ? formatRange(slot.startTime, slot.endTime) : '—';
        const prof = b.professionalId;
        const pname = prof ? profDisplayName(prof) : '—';
        const svc = b.serviceId;
        const sname = svc && svc.name ? svc.name : '—';
        const actions =
          b.status !== 'cancelled' && b.status !== 'completed'
            ? '<button type="button" class="btn-ghost cancel-b" data-id="' +
              b._id +
              '">Cancel</button>'
            : '';
        tr.innerHTML =
          '<td>' +
          when +
          '</td><td>' +
          pname +
          '</td><td>' +
          sname +
          '</td><td>' +
          b.status +
          '</td><td>' +
          actions +
          '</td>';
        tbody.appendChild(tr);
      }
      tbody.querySelectorAll('.cancel-b').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Cancel this booking?')) return;
          try {
            await apiRequest('/bookings/' + btn.getAttribute('data-id') + '/cancel', { method: 'PUT' });
            showMessage('Booking cancelled.', 'ok');
            await loadMyBookings();
            await loadProfessionals();
          } catch (e) {
            showMessage(e.message, 'error');
          }
        });
      });
    } catch {
      tbody.innerHTML = '<tr><td colspan="5">Could not load bookings.</td></tr>';
    }
  }

  function renderAuthToolbar(user) {
    const bar = $('auth-toolbar');
    bar.innerHTML = '';
    if (!user) return;
    const span = document.createElement('span');
    span.style.fontSize = '0.9rem';
    span.textContent = user.fullName + ' (' + user.role + ')';
    const out = document.createElement('button');
    out.type = 'button';
    out.className = 'btn-ghost';
    out.textContent = 'Sign out';
    out.addEventListener('click', () => {
      tokenSet(null);
      location.reload();
    });
    bar.appendChild(span);
    bar.appendChild(out);
  }

  function showPanels(user) {
    const auth = $('panel-auth');
    const client = $('panel-client');
    const bookings = $('panel-bookings');
    if (user) {
      auth.classList.add('hidden');
      renderAuthToolbar(user);
      if (user.role === 'client') {
        client.classList.remove('hidden');
        bookings.classList.remove('hidden');
      } else {
        client.classList.add('hidden');
        bookings.classList.add('hidden');
        showMessage('Signed in as professional. Use the React app for schedule and confirmations.', 'ok');
      }
    } else {
      auth.classList.remove('hidden');
      client.classList.add('hidden');
      bookings.classList.add('hidden');
    }
  }

  async function boot() {
    $('btn-login').addEventListener('click', async () => {
      showMessage('');
      try {
        const data = apiRequest('https://ointment-booking-backend-production.up.railway.app/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: $('email').value.trim(),
            password: $('password').value,
          }),
        });
        tokenSet(data.token);
        showPanels(data.user);
        if (data.user.role === 'client') await initClient();
      } catch (e) {
        showMessage(e.message, 'error');
      }
    });

    $('btn-register').addEventListener('click', async () => {
      showMessage('');
      const role = $('role').value;
      const body = {
        email: $('email').value.trim(),
        password: $('password').value,
        fullName: $('fullName').value.trim(),
        role,
      };
      if (role === 'professional') {
        body.professionalType = 'doctor';
      }
      try {
        const data = apiRequest('https://ointment-booking-backend-production.up.railway.app/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        tokenSet(data.token);
        showPanels(data.user);
        if (data.user.role === 'client') await initClient();
      } catch (e) {
        showMessage(e.message, 'error');
      }
    });

    $('filter-specialty').addEventListener('change', () => {
      loadProfessionals();
    });
    $('filter-service').addEventListener('change', () => {
      renderProfessionals();
    });
    $('filter-date').addEventListener('change', () => {
      renderProfessionals();
    });

    $('dlg-cancel').addEventListener('click', () => $('dlg-book').close());
    $('dlg-confirm').addEventListener('click', confirmBooking);

    const t = tokenGet();
    if (!t) {
      showPanels(null);
      return;
    }
    try {
      const user = await apiRequest('/auth/me', { method: 'GET' });
      showPanels(user);
      if (user.role === 'client') await initClient();
    } catch {
      tokenSet(null);
      showPanels(null);
    }
  }

  async function initClient() {
    try {
      services = await apiRequest('/services?isActive=true', { method: 'GET' });
      specialties = await apiRequest('/professionals/specialties', { method: 'GET' });

      const fs = $('filter-specialty');
      fs.innerHTML = '<option value="">All specialties</option>';
      for (const s of specialties) {
        const o = document.createElement('option');
        o.value = s;
        o.textContent = s;
        fs.appendChild(o);
      }

      const sv = $('filter-service');
      sv.innerHTML = '<option value="">All services</option>';
      for (const s of services) {
        const o = document.createElement('option');
        o.value = s._id;
        o.textContent = s.name;
        sv.appendChild(o);
      }

      await loadProfessionals();
      await loadMyBookings();
    } catch (e) {
      showMessage(e.message, 'error');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
