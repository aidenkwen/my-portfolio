import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

export function initRive() {
  const canvases = document.querySelectorAll('.rive-canvas');

  canvases.forEach((canvas) => {
    const src = canvas.dataset.rive;
    if (!src) return;

    const isHoverOnly = canvas.closest('.card--dark') !== null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(canvas);
            if (isHoverOnly) {
              loadRiveHover(canvas, src);
            } else {
              loadRive(canvas, src);
            }
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(canvas);
  });
}

const coverFiles = new Set(['typing.riv', 'legos.riv']);

function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
}

function loadRive(canvas, src) {
  const fit = coverFiles.has(src) ? Fit.Cover : Fit.Contain;

  resizeCanvas(canvas);

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
    resizeCanvas(canvas);
    rive.resizeDrawingSurfaceToCanvas();
  });
}

function loadRiveHover(canvas, src) {
  const card = canvas.closest('.card--dark');

  resizeCanvas(canvas);

  let hoverInput = null;

  const rive = new Rive({
    src: '/' + src,
    canvas,
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => {
      rive.resizeDrawingSurfaceToCanvas();
      const inputs = rive.stateMachineInputs('State Machine 1');
      if (inputs) {
        hoverInput = inputs.find((i) => i.name === 'hover');
      }
    },
  });

  card.addEventListener('mouseenter', () => {
    if (hoverInput) hoverInput.value = true;
  });

  card.addEventListener('mouseleave', () => {
    if (hoverInput) hoverInput.value = false;
  });

  window.addEventListener('resize', () => {
    resizeCanvas(canvas);
    rive.resizeDrawingSurfaceToCanvas();
  });
}
