import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

export function initRive() {
  const canvases = document.querySelectorAll('.rive-canvas');

  canvases.forEach((canvas) => {
    const src = canvas.dataset.rive;
    if (!src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(canvas);
            loadRive(canvas, src);
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(canvas);
  });
}

const coverFiles = new Set(['typing.riv', 'legos.riv']);

function loadRive(canvas, src) {
  const container = canvas.parentElement;
  const fit = coverFiles.has(src) ? Fit.Cover : Fit.Contain;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }

  resize();

  const rive = new Rive({
    src: '/' + src,
    canvas,
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit, alignment: Alignment.Center }),
    onLoad: () => {
      rive.resizeDrawingSurfaceToCanvas();
    },
  });

  window.addEventListener('resize', () => {
    resize();
    rive.resizeDrawingSurfaceToCanvas();
  });
}
