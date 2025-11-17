/**
 * Main client-side initialization script
 * Orchestrates all animations and interactive features
 */

import { initLenis } from '../utils/lenis';
import { initSplitTextReveal } from '../utils/splitText';
import { initImageTrail } from '../utils/imageTrail';
import { initMarqueeScrollDirection } from '../utils/marquee';
import { IMAGE_TRAIL_CONFIG } from '../utils/constants';

// Track initialization to prevent double-initialization
let isInitialized = false;

/**
 * Initializes all animations and interactive features
 * Called when DOM is ready
 */
function initAnimations(): void {
	// Prevent double initialization
	if (isInitialized) {
		console.warn('[Client] Animations already initialized');
		return;
	}

	try {
		isInitialized = true;

		// Initialize smooth scroll first (other animations depend on it)
		initLenis();

		// Wait for fonts to load for accurate text splitting
		document.fonts.ready
			.then(() => {
				initSplitTextReveal();
			})
			.catch((error) => {
				console.error('[Client] Failed to wait for fonts:', error);
				// Initialize anyway in case font loading fails
				initSplitTextReveal();
			});

		// Initialize image trail effect (desktop only)
		initImageTrail({
			minWidth: IMAGE_TRAIL_CONFIG.minWidth,
			moveDistance: IMAGE_TRAIL_CONFIG.moveDistance,
			stopDuration: 350, // Slightly longer than default
			trailLength: 6, // One more than default
		});

		// Initialize marquee scroll direction
		initMarqueeScrollDirection();

		console.info('[Client] All animations initialized successfully');
	} catch (error) {
		console.error('[Client] Failed to initialize animations:', error);
	}
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
	try {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initAnimations);
		} else {
			// DOM already loaded, initialize immediately
			initAnimations();
		}
	} catch (error) {
		console.error('[Client] Failed to set up initialization:', error);
	}
}
