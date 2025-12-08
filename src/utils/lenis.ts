import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Device detection for optimizations
const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

let lenis: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;

/**
 * Initialize Lenis smooth scroll with GSAP integration
 * Follows Astro best practices with proper cleanup
 */
export function initLenis() {
  // Prevent re-initialization
  if (lenis) {
    return lenis;
  }

  // Initialize Lenis with device-specific optimizations
  lenis = new Lenis({
    lerp: isMobile ? 0.15 : 0.1, // Faster on mobile for better responsiveness
    wheelMultiplier: 1,
    touchMultiplier: isIOS ? 1.5 : 2, // Better touch response on iOS
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false, // Disable on touch devices for native feel
    syncTouchLerp: 0.1,
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

  // Refresh ScrollTrigger when Lenis resizes
  const refreshListener = () => {
    lenis?.resize();
  };
  ScrollTrigger.addEventListener('refresh', refreshListener);

  // Return lenis instance
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