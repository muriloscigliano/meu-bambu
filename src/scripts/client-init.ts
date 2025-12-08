import { initLenis, destroyLenis } from '../utils/lenis';
import { initSplitTextReveal } from '../utils/splitText';
import { initImageTrail } from '../utils/imageTrail';
import { initMarqueeScrollDirection } from '../utils/marquee';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Store cleanup functions
let cleanupFunctions: (() => void)[] = [];

/**
 * Initialize all animations when DOM is ready
 * Following Astro best practices
 */
function initAnimations() {
  // Clear previous cleanup functions
  cleanupFunctions.forEach(cleanup => cleanup());
  cleanupFunctions = [];

  // Initialize smooth scroll first
  initLenis();

  // Wait for fonts to load for accurate text splitting
  document.fonts.ready.then(() => {
    const splitCleanup = initSplitTextReveal();
    if (splitCleanup) {
      cleanupFunctions.push(splitCleanup);
    }
  });

  // Initialize image trail effect
  const trailCleanup = initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 6
  });
  if (trailCleanup) {
    cleanupFunctions.push(trailCleanup);
  }

  // Initialize marquee scroll direction
  initMarqueeScrollDirection();
}

/**
 * Cleanup function for Astro page transitions
 */
function cleanup() {
  // Run all cleanup functions
  cleanupFunctions.forEach(fn => fn());
  cleanupFunctions = [];

  // Destroy Lenis
  destroyLenis();

  // Kill all ScrollTrigger instances
  ScrollTrigger.killAll();

  // Clear GSAP ticker
  gsap.ticker.lagSmoothing(500, 16);
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // Cleanup on page unload (for Astro page transitions)
  document.addEventListener('astro:before-preparation', cleanup);
  window.addEventListener('beforeunload', cleanup);
}

