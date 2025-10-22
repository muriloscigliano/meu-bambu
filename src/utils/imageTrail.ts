import { gsap, ScrollTrigger } from './gsap';

gsap.registerPlugin(ScrollTrigger);

interface ImageTrailConfig {
  minWidth?: number;
  moveDistance?: number;
  stopDuration?: number;
  trailLength?: number;
}

interface State {
  trailInterval: NodeJS.Timeout | null;
  globalIndex: number;
  last: { x: number; y: number };
  trailImageTimestamps: Map<HTMLElement, number>;
  trailImages: HTMLElement[];
  isActive: boolean;
}

export function initImageTrail(config: ImageTrailConfig = {}) {
  // Config + defaults
  const options = {
    minWidth: config.minWidth ?? 992,
    moveDistance: config.moveDistance ?? 15,
    stopDuration: config.stopDuration ?? 300,
    trailLength: config.trailLength ?? 5
  };

  const wrapper = document.querySelector('[data-trail="wrapper"]') as HTMLElement;
  
  if (!wrapper || window.innerWidth < options.minWidth) {
    return;
  }
  
  // State management
  const state: State = {
    trailInterval: null,
    globalIndex: 0,
    last: { x: 0, y: 0 },
    trailImageTimestamps: new Map(),
    trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')) as HTMLElement[],
    isActive: false
  };

  // Utility functions
  const MathUtils = {
    lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
    distance: (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1)
  };

  function getRelativeCoordinates(e: MouseEvent, rect: DOMRect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function activate(trailImage: HTMLElement, x: number, y: number) {
    if (!trailImage) return;

    const rect = trailImage.getBoundingClientRect();
    const styles = {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
      zIndex: String(state.globalIndex),
      display: 'block'
    };

    Object.assign(trailImage.style, styles);
    state.trailImageTimestamps.set(trailImage, Date.now());

    // Animate how the images will appear
    gsap.fromTo(
      trailImage,
      { autoAlpha: 0, scale: 0.8, rotate: -5 },
      {
        scale: 1,
        autoAlpha: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true
      }
    );

    state.last = { x, y };
  }

  function fadeOutTrailImage(trailImage: HTMLElement) {
    if (!trailImage) return;
    
    // Animate how the images will disappear
    gsap.to(trailImage, {
      opacity: 0,
      scale: 0.6,
      rotate: 5,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(trailImage, { autoAlpha: 0 });
      }
    });
  }

  function handleOnMove(e: MouseEvent) {
    if (!state.isActive) return;

    const rectWrapper = wrapper.getBoundingClientRect();
    const { x: relativeX, y: relativeY } = getRelativeCoordinates(e, rectWrapper);
    
    const distanceFromLast = MathUtils.distance(
      relativeX, 
      relativeY, 
      state.last.x, 
      state.last.y
    );

    if (distanceFromLast > window.innerWidth / options.moveDistance) {
      const lead = state.trailImages[state.globalIndex % state.trailImages.length];
      const tail = state.trailImages[(state.globalIndex - options.trailLength) % state.trailImages.length];

      activate(lead, relativeX, relativeY);
      fadeOutTrailImage(tail);
      state.globalIndex++;
    }
  }

  function cleanupTrailImages() {
    const currentTime = Date.now();
    for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
      if (currentTime - timestamp > options.stopDuration) {
        fadeOutTrailImage(trailImage);
        state.trailImageTimestamps.delete(trailImage);
      }
    }
  }

  function startTrail() {
    if (state.isActive) return;
    
    state.isActive = true;
    wrapper.addEventListener('mousemove', handleOnMove);
    state.trailInterval = setInterval(cleanupTrailImages, 100);
  }

  function stopTrail() {
    if (!state.isActive) return;
    
    state.isActive = false;
    wrapper.removeEventListener('mousemove', handleOnMove);
    if (state.trailInterval) {
      clearInterval(state.trailInterval);
      state.trailInterval = null;
    }
    
    // Clean up remaining trail images
    state.trailImages.forEach(fadeOutTrailImage);
    state.trailImageTimestamps.clear();
  }

  // Initialize ScrollTrigger
  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: startTrail,
    onEnterBack: startTrail,
    onLeave: stopTrail,
    onLeaveBack: stopTrail
  });

  // Clean up on window resize
  const handleResize = () => {
    if (window.innerWidth < options.minWidth && state.isActive) {
      stopTrail();
    } else if (window.innerWidth >= options.minWidth && !state.isActive) {
      const inView = ScrollTrigger.isInViewport(wrapper);
      if (inView) startTrail();
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    stopTrail();
    window.removeEventListener('resize', handleResize);
  };
}

