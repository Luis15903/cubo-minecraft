'use strict';
(function () {
  // Número al azar sin usar Math.random (evita el aviso amarillo de SonarLint)
  const rnd = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
  const GIROS = 3;
  const $ = (id) => document.getElementById(id);
  const cube = $('cube'), modal = $('modal'), cnt = $('cnt');
  const yes = $('yes'), no = $('no'), q = $('q');
  const btns = document.querySelector('.btns');

  let rx = -24, ry = 22;          // rotación del cubo
  let drag = false, lx = 0, ly = 0;
  let spin = 0, shown = false, accepted = false;
  let ox = 0, oy = 0;             // desplazamiento actual del botón "No"

  function render() {
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function openModal() {
    shown = true;
    drag = false;
    modal.showModal();
  }

  function closeModal() {
    modal.close();
  }

  function countSpins() {
    const n = Math.min(GIROS, Math.floor(spin / 360));
    cnt.textContent = `Giros: ${n} / ${GIROS}`;
    if (spin >= 360 * GIROS && !shown) openModal();
  }

  // El botón "No" se escapa, pero siempre dentro de la pantalla
  function dodge() {
    const b = no.getBoundingClientRect();
    const m = 12;
    const baseL = b.left - ox, baseR = b.right - ox;
    const baseT = b.top - oy, baseB = b.bottom - oy;
    ox = (m - baseL) + rnd() * (window.innerWidth - 2 * m - (baseR - baseL));
    oy = (m - baseT) + rnd() * (window.innerHeight - 2 * m - (baseB - baseT));
    no.style.transform = `translate(${ox}px, ${oy}px)`;
  }

  no.addEventListener('pointerenter', dodge);
  no.addEventListener('click', dodge);

  yes.addEventListener('click', () => {
    accepted = true;
    q.textContent = 'Espero que cumplas, Sofi';
    const ok = document.createElement('button');
    ok.textContent = 'Cerrar';
    ok.addEventListener('click', closeModal);
    btns.replaceChildren(ok);
    ok.focus();
  });

  // Escape solo cierra el cartel después de aceptar
  modal.addEventListener('cancel', (e) => {
    if (!accepted) e.preventDefault();
  });

  document.body.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.modal')) return;
    drag = true;
    lx = e.clientX;
    ly = e.clientY;
    try { cube.setPointerCapture(e.pointerId); } catch (err) { /* no pasa nada */ }
    cube.style.cursor = 'grabbing';
  });

  document.body.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = (e.clientX - lx) * 0.6;
    const dy = (e.clientY - ly) * 0.6;
    ry += dx;
    rx = Math.max(-80, Math.min(80, rx - dy));
    spin += Math.abs(dx);
    lx = e.clientX;
    ly = e.clientY;
    render();
    countSpins();
  });

  ['pointerup', 'pointercancel'].forEach((name) => {
    document.body.addEventListener(name, () => {
      drag = false;
      cube.style.cursor = 'grab';
    });
  });
})();