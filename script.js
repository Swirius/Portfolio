function $(sel, ctx = document) { return ctx.querySelector(sel) }
function buildMailto(form) {
  const to = (form.action || 'mailto:tu.email@dominio.com').replace('mailto:', '');
  const subject = encodeURIComponent(form.subject.value.trim());
  const body = encodeURIComponent(form.body.value.trim());
  const url = `mailto:${to}?subject=${subject}&body=${body}`;
  window.location.href = url;
  return false;
}
window.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-copy'));
      if (!target) return;
      const text = target.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copiado ✓';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      });
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Contact form handler: Formspree POST with mailto fallback
function encodeMailto(subject, body, to) {
  const s = encodeURIComponent(subject || '');
  const b = encodeURIComponent(body || '');
  return `mailto:${to}?subject=${s}&body=${b}`;
}
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    const statusEl = document.getElementById('contact-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const endpoint = form.getAttribute('action');
      const fallback = form.getAttribute('data-fallback');
      statusEl.textContent = 'Sending...';
      const fd = new FormData(form);
      try {
        const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          statusEl.textContent = 'Message sent successfully ✓';
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        statusEl.textContent = 'Could not send. Opening email client...';
        const url = encodeMailto(fd.get('subject'), fd.get('message'), (fallback || 'mailto:').replace('mailto:', ''));
        window.location.href = url;
      }
    });
  }
});
