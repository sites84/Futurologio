(() => {
  'use strict';
  if (window.__FUTUROLOGIO_VISUAL_SOCIAL_V4) return;
  window.__FUTUROLOGIO_VISUAL_SOCIAL_V4 = true;

  const API = 'https://motor-invencoes.edsonfernandesvet.workers.dev';
  const TOKEN_KEY = 'futuro_auth_token';
  const USER_KEY = 'futuro_social_user';
  const MAP_KEY = 'futuro_db_invention_ids';
  const token = () => localStorage.getItem(TOKEN_KEY) || '';
  const user = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } };
  const map = () => { try { return JSON.parse(localStorage.getItem(MAP_KEY) || '{}'); } catch { return {}; } };
  const visibleName = () => document.getElementById('name')?.textContent?.trim() || '';
  const catalog = () => window.FUTUROLOGIO_PRODUCTS || [];

  function currentProduct() {
    const name = visibleName();
    const current = window.FUTUROLOGIO_CURRENT_PRODUCT;
    if (current && (!name || String(current.name).trim() === name)) return current;
    return name ? catalog().find(p => String(p.name).trim() === name) || null : null;
  }

  // Deliberately do not trust FUTUROLOGIO_DB_ID_FOR here: older page loaders can
  // leave that global pointing at the previous invention. The current product
  // itself or the per-product localStorage map are the only accepted fallbacks.
  function currentDbId(p) {
    if (!p) return 0;
    if (Number(p.__dbId)) return Number(p.__dbId);
    return Number(map()[p.id] || 0);
  }

  const style = document.createElement('style');
  style.id = 'futuro-product-visual-social-v4';
  style.textContent = `
    .game-image-card{position:relative;overflow:hidden}
    .game-image-card .ft-image-stage{position:relative;width:100%;aspect-ratio:16/9;min-height:180px;border-radius:10px;overflow:hidden;background:radial-gradient(circle at 50% 40%,#24395c,#0b1120 70%);border:1px solid #30415f;display:flex;align-items:center;justify-content:center}
    .game-image-card .ft-image-stage img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;cursor:zoom-in!important}
    .ft-image-empty{width:100%;height:100%;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px;box-sizing:border-box;color:#9eb1d0}
    .ft-image-empty strong{display:block;color:#d8ff55;font-size:14px;margin-bottom:7px;text-transform:uppercase}
    .ft-image-empty span{font-size:11px;line-height:1.45;max-width:480px}
    .futuro-image-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;margin-top:10px}
    .futuro-image-action{border:1.5px solid #405476;border-radius:10px;background:#0b1427;color:#dce6ff;padding:9px 13px;font-size:10px;font-weight:1000;cursor:pointer;text-transform:uppercase;letter-spacing:.04em}
    .futuro-image-action.primary{background:#d8ff55;color:#091007;border-color:#fff}
    .futuro-image-action:disabled{opacity:.55;cursor:wait}
    .futuro-upload-status{font-size:10px;margin-top:7px;color:#9eb1d0;text-align:center;width:100%}
    .futuro-upload-status.ok{color:#d8ff55}.futuro-upload-status.err{color:#ff8da7}
    .game-image-card .ft-creator-label{display:none!important}
    .futuro-fullscreen{position:fixed;inset:0;background:rgba(2,5,12,.97);z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)}
    .futuro-fullscreen.open{display:flex}.futuro-fullscreen img{max-width:96vw;max-height:92vh;width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 0 0 2px #30415f,0 20px 70px rgba(0,0,0,.65)}
    .futuro-fullscreen-close{position:absolute;right:18px;top:16px;width:44px;height:44px;border:1px solid #58709b;border-radius:50%;background:#101a2e;color:#fff;font-size:25px;cursor:pointer}
  `;
  document.head.appendChild(style);

  function fullscreen(src, alt) {
    let o = document.getElementById('futuroImageFullscreen');
    if (!o) {
      o = document.createElement('div');
      o.id = 'futuroImageFullscreen';
      o.className = 'futuro-fullscreen';
      o.innerHTML = '<button type="button" class="futuro-fullscreen-close" aria-label="Fechar imagem">×</button><img alt="">';
      document.body.appendChild(o);
      o.addEventListener('click', e => {
        if (e.target === o || e.target.classList.contains('futuro-fullscreen-close')) o.classList.remove('open');
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') o.classList.remove('open'); });
    }
    const img = o.querySelector('img');
    img.src = src;
    img.alt = alt || 'Imagem da invenção';
    o.classList.add('open');
  }

  function getImageStage(card) {
    let stage = card.querySelector('.ft-image-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'ft-image-stage';
      card.prepend(stage);
    }
    return stage;
  }

  function clearCard(card) {
    card.querySelectorAll(':scope > *').forEach(el => el.remove());
  }

  function addUploadControls(card, hasImage, p, id) {
    const actions = document.createElement('div');
    actions.className = 'futuro-image-actions';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.hidden = true;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'futuro-image-action primary';
    button.textContent = hasImage ? 'Trocar imagem' : 'Enviar minha imagem';
    const status = document.createElement('div');
    status.className = 'futuro-upload-status';
    button.addEventListener('click', () => {
      if (!user()) { window.openAuth?.('register'); return; }
      input.click();
    });
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      input.value = '';
      upload(file, button, status, p, id);
    });
    actions.append(button, input, status);
    card.appendChild(actions);
  }

  async function upload(file, button, status, p, id) {
    if (!file) return;
    if (!id) { status.textContent = 'Esta invenção ainda não foi registrada no servidor.'; status.className = 'futuro-upload-status err'; return; }
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) { status.textContent = 'Use JPG, PNG, WebP ou GIF.'; status.className = 'futuro-upload-status err'; return; }
    if (file.size > 8 * 1024 * 1024) { status.textContent = 'A imagem deve ter no máximo 8 MB.'; status.className = 'futuro-upload-status err'; return; }
    button.disabled = true;
    status.textContent = 'ENVIANDO IMAGEM…';
    status.className = 'futuro-upload-status';
    try {
      const fd = new FormData();
      fd.append('image', file, file.name || 'invention-image');
      fd.append('invention_id', String(id));
      const r = await fetch(API + '/api/invention-image', { method: 'POST', headers: { Authorization: 'Bearer ' + token() }, body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Não foi possível enviar a imagem.');
      p.image_url = d.image_url || API + '/api/invention-image/' + id;
      p.imageUrl = p.image_url;
      p.__dbId = id;
      window.FUTUROLOGIO_CURRENT_PRODUCT = p;
      window.FUTUROLOGIO_CURRENT_DB_ID = id;
      status.textContent = 'IMAGEM SALVA. +5 XP POR UPLOAD VÁLIDO.';
      status.className = 'futuro-upload-status ok';
      render(p, id, true);
    } catch (e) {
      status.textContent = e.message || 'Falha no upload.';
      status.className = 'futuro-upload-status err';
      button.disabled = false;
    }
  }

  async function fetchImage(id) {
    try {
      const r = await fetch(API + '/api/invention/' + encodeURIComponent(id));
      if (!r.ok) return '';
      const d = await r.json();
      return d.image_url || '';
    } catch { return ''; }
  }

  let renderSeq = 0;
  async function render(p, id, force) {
    const card = document.querySelector('.game-image-card');
    if (!card || !p) return;
    const seq = ++renderSeq;
    const key = String(p.id) + '|' + String(id) + '|' + String(p.name);
    if (!force && card.dataset.futuroVisualKey === key) return;
    card.dataset.futuroVisualKey = key;

    // Completely rebuild this visual card. This prevents an image/label/button
    // belonging to the previous invention from surviving the next show().
    clearCard(card);
    const stage = getImageStage(card);
    let src = p.image_url || p.imageUrl || p.image || '';
    if (!src && id) src = await fetchImage(id);
    if (seq !== renderSeq || currentProduct()?.id !== p.id) return;
    if (src) {
      p.image_url = src;
      const img = document.createElement('img');
      img.src = src;
      img.alt = p.name || 'Imagem da invenção';
      img.addEventListener('click', () => fullscreen(img.currentSrc || img.src, img.alt));
      stage.appendChild(img);
      const meta = document.createElement('div');
      meta.className = 'game-image-meta';
      meta.innerHTML = '<b>CLIQUE PARA AMPLIAR</b>';
      card.appendChild(meta);
      addUploadControls(card, true, p, id);
    } else {
      stage.innerHTML = '<div class="ft-image-empty"><strong>IMAGEM DO CRIADOR</strong><span>Esta invenção ainda não possui uma imagem.</span></div>';
      const meta = document.createElement('div');
      meta.className = 'game-image-meta';
      meta.innerHTML = '<b>AGUARDANDO UPLOAD</b>';
      card.appendChild(meta);
      addUploadControls(card, false, p, id);
    }
  }

  function wrapShow() {
    if (window.__FUTUROLOGIO_SHOW_WRAPPED_V4 || typeof window.show !== 'function') return;
    const original = window.show;
    window.show = function(p) {
      window.FUTUROLOGIO_CURRENT_PRODUCT = p || null;
      window.FUTUROLOGIO_CURRENT_DB_ID = Number(p?.__dbId || 0);
      original(p);
      const shown = window.FUTUROLOGIO_CURRENT_PRODUCT || p;
      const id = currentDbId(shown);
      setTimeout(() => render(shown, id, true), 25);
      setTimeout(() => render(shown, id, true), 350);
    };
    window.__FUTUROLOGIO_SHOW_WRAPPED_V4 = true;
  }

  const name = document.getElementById('name');
  if (name) new MutationObserver(() => { setTimeout(() => { const p = currentProduct(); if (p) render(p, currentDbId(p), true); }, 30); }).observe(name, { childList: true, characterData: true, subtree: true });
  const timer = setInterval(() => {
    wrapShow();
    if (typeof window.show === 'function') {
      clearInterval(timer);
      const p = currentProduct();
      if (p) render(p, currentDbId(p), true);
    }
  }, 50);
})();
