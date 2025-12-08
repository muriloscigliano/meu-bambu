import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;

/**
 * Check if device is mobile/touch
 * Lenis should be disabled on mobile - native scroll is better
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for touch capability and screen width
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isNarrow = window.innerWidth < 1024;

  return hasTouch && isNarrow;
}

/**
 * Initialize Lenis smooth scroll with GSAP integration
 * Disabled on mobile devices for better native scroll experience
 */
export function initLenis() {
  // Prevent re-initialization
  if (lenis) {
    return lenis;
  }

  // Skip Lenis on mobile - native scroll is better
  if (isMobileDevice()) {
    return null;
  }

  // Respect user's reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  // Initialize Lenis for desktop only
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    gestureOrientation: 'vertical',
    smoothWheel: true,
    infinite: false
  });

  // Connect Lenis with GSAP ScrollTrigger for perfect sync
  scrollCallback = () => {
    ScrollTrigger.update();
  };
  lenis.on('scroll', scrollCallback);

  // Integrate with GSAP's ticker for smooth animation frame sync
  rafCallback = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(rafCallback);

  // Disable GSAP's lag smoothing for smoother animations
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Destroy Lenis instance and cleanup
 * Important for Astro page transitions
 */
export function destroyLenis() {
  if (lenis) {
    // Remove GSAP ticker callback
    if (rafCallback) {
      gsap.ticker.remove(rafCallback);
      rafCallback = null;
    }

    // Remove scroll listener
    if (scrollCallback) {
      lenis.off('scroll', scrollCallback);
      scrollCallback = null;
    }

    // Destroy Lenis instance
    lenis.destroy();
    lenis = null;
  }
}

/**
 * Get current Lenis instance
 */
export function getLenis() {
  return lenis;
}

/**
 * Scroll to a specific target
 */
export function scrollTo(target: string | number | HTMLElement, options?: any) {
  if (lenis) {
    lenis.scrollTo(target, options);
  }
}

/**
 * Stop smooth scrolling
 */
export function stopScroll() {
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Start smooth scrolling
 */
export function startScroll() {
  if (lenis) {
    lenis.start();
  }
}

/**
 * Global refresh function for components to use
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
  if (lenis) {
    lenis.resize();
  }
} 