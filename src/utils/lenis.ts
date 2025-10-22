import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Simple iOS detection for touch optimization
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

let lenis: Lenis | null = null;

export function initLenis() {
  // Clean up any existing instance
  if (lenis) {
    lenis.destroy();
  }

  // Initialize Lenis with iOS optimizations
  lenis = new Lenis({
    lerp: 0.1, // Lower values = smoother but slower, higher values = faster but less smooth
    wheelMultiplier: 1, // Adjust scroll speed
    touchMultiplier: isIOS ? 1.5 : 2, // Better touch response on iOS
    gestureOrientation: 'vertical', // 'vertical', 'horizontal', or 'both'
  });

  // Connect Lenis with GSAP ScrollTrigger for perfect sync
  lenis.on('scroll', (e) => {
    ScrollTrigger.update();
  });

  // Integrate with GSAP's ticker for smooth animation frame sync
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger after Lenis is ready
  ScrollTrigger.addEventListener('refresh', () => {
    lenis?.resize();
  });

  return lenis;
}

export function destroyLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function getLenis() {
  return lenis;
}

// Global refresh function for components to use
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
  if (lenis) {
    lenis.resize();
  }
} 