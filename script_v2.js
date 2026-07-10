const envoltura = document.querySelector('.envoltura-sobre');
const carta = document.querySelector('.carta');
const panelInferior = document.querySelector('.panel-inferior');
const raiz = document.documentElement;

let animando = false;

function aplicarEscalaTexto(fontSize) {
  const gap = Math.max(6, Math.round(fontSize * 0.72));
  raiz.style.setProperty('--font-hoja-size', `${fontSize}px`);
  raiz.style.setProperty('--gap-parrafo', `${gap}px`);
}

function ajustarTextoCarta() {
  const hoja = document.querySelector('.hoja-larga.superior');
  const texto = hoja?.querySelector('.texto-hoja');
  if (!hoja || !texto) return;

  const estilos = getComputedStyle(hoja);
  const paddingTop = parseFloat(estilos.paddingTop) || 0;
  const paddingBottom = parseFloat(estilos.paddingBottom) || 0;
  const espacioDisponible = hoja.clientHeight - paddingTop - paddingBottom;

  const esMovil = window.innerWidth <= 420;
  let min = esMovil ? 9.6 : 10.4;
  let max = esMovil ? 12.4 : 13.6;
  let mejor = min;

  for (let i = 0; i < 16; i += 1) {
    const mid = (min + max) / 2;
    aplicarEscalaTexto(mid);

    if (texto.scrollHeight <= espacioDisponible) {
      mejor = mid;
      min = mid;
    } else {
      max = mid;
    }
  }

  aplicarEscalaTexto(mejor);
}

function abrirCarta() {
  if (animando || carta.classList.contains('abierta')) return;

  animando = true;
  carta.classList.add('mostrar-carta');
  envoltura.classList.add('desactivar-sobre');

  setTimeout(() => {
    carta.classList.remove('mostrar-carta');
    carta.classList.add('abierta');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panelInferior.classList.add('desplegada');
      });
    });

    setTimeout(() => {
      animando = false;
    }, 250);
  }, 550);
}

function cerrarCarta() {
  if (animando || !carta.classList.contains('abierta')) return;

  animando = true;
  panelInferior.classList.remove('desplegada');

  setTimeout(() => {
    carta.classList.remove('abierta');
    envoltura.classList.remove('desactivar-sobre');

    setTimeout(() => {
      animando = false;
    }, 600);
  }, 900);
}

window.addEventListener('load', ajustarTextoCarta);
window.addEventListener('resize', ajustarTextoCarta);
if (document.fonts?.ready) {
  document.fonts.ready.then(ajustarTextoCarta);
}

document.addEventListener('click', (e) => {
  const sobreTrigger = e.target.closest('.sello') ||
    e.target.classList.contains('sobre') ||
    e.target.classList.contains('solapa-derecha') ||
    e.target.classList.contains('solapa-izquierda');

  if (sobreTrigger) {
    if (animando || carta.classList.contains('abierta')) return;
    envoltura.classList.toggle('abierto');
    return;
  }

  if (e.target.closest('.carta')) {
    if (!envoltura.classList.contains('abierto')) return;

    if (!carta.classList.contains('abierta')) {
      abrirCarta();
    } else {
      cerrarCarta();
    }
  }
});
