import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Simple iOS detection for touch optimization
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

let lenis: Lenis | null = null;

/**
 * Initializes Lenis smooth scroll library
 * Integrates with GSAP ScrollTrigger for synchronized animations
 *
 * @returns Lenis instance or null if initialization fails
 *
 * @example
 * ```typescript
 * const smoothScroll = initLenis();
 * ```
 */
export function initLenis(): Lenis | null {
	try {
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
		lenis.on('scroll', () => {
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
	} catch (error) {
		console.error('[Lenis] Failed to initialize smooth scroll:', error);
		return null;
	}
}

/**
 * Destroys the current Lenis instance and cleans up
 * Call this when unmounting or before re-initializing
 *
 * @returns void
 */
export function destroyLenis(): void {
	try {
		if (lenis) {
			lenis.destroy();
			lenis = null;
		}
	} catch (error) {
		console.error('[Lenis] Failed to destroy instance:', error);
	}
}

/**
 * Gets the current Lenis instance
 *
 * @returns Current Lenis instance or null if not initialized
 */
export function getLenis(): Lenis | null {
	return lenis;
}

/**
 * Refreshes ScrollTrigger and resizes Lenis
 * Use this when DOM content changes dynamically
 *
 * @returns void
 */
export function refreshScrollTrigger(): void {
	try {
		ScrollTrigger.refresh();
		if (lenis) {
			lenis.resize();
		}
	} catch (error) {
		console.error('[Lenis] Failed to refresh ScrollTrigger:', error);
	}
}
