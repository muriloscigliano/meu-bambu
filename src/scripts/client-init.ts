import { initLenis } from '../utils/lenis';
import { initSplitTextReveal } from '../utils/splitText';

// Initialize all animations when DOM is ready
function initAnimations() {
  // Wait for fonts to load for accurate text splitting
  document.fonts.ready.then(() => {
    initSplitTextReveal();
  });
  
  // Initialize smooth scroll
  initLenis();
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
}

