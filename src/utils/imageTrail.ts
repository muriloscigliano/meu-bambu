import { gsap, ScrollTrigger } from './gsap';
import { IMAGE_TRAIL_CONFIG, GSAP_CONFIGS, shouldEnableImageTrail } from './constants';
import { safeQuerySelector, safeQuerySelectorAll, isHTMLElement } from './dom';

gsap.registerPlugin(ScrollTrigger);

/**
 * Configuration options for image trail effect
 */
interface ImageTrailConfig {
	minWidth?: number;
	moveDistance?: number;
	stopDuration?: number;
	trailLength?: number;
}

/**
 * Point in 2D space
 */
interface Point {
	x: number;
	y: number;
}

/**
 * Internal state management for image trail
 */
interface State {
	trailInterval: ReturnType<typeof setInterval> | null;
	globalIndex: number;
	last: Point;
	trailImageTimestamps: Map<HTMLElement, number>;
	trailImages: HTMLElement[];
	isActive: boolean;
}

/**
 * Math utility functions for image trail calculations
 */
const MathUtils = {
	/**
	 * Linear interpolation between two values
	 */
	lerp: (a: number, b: number, n: number): number => (1 - n) * a + n * b,

	/**
	 * Calculate Euclidean distance between two points
	 */
	distance: (x1: number, y1: number, x2: number, y2: number): number =>
		Math.hypot(x2 - x1, y2 - y1),
};

/**
 * Initializes cursor-following image trail effect
 * Creates an interactive trail of images that follow the mouse cursor
 *
 * @param config - Optional configuration overrides
 * @returns Cleanup function to remove event listeners and stop animations
 *
 * @example
 * ```typescript
 * const cleanup = initImageTrail({ trailLength: 10 });
 * // Later, when component unmounts:
 * cleanup();
 * ```
 */
export function initImageTrail(config: ImageTrailConfig = {}): (() => void) | undefined {
	try {
		// Merge config with defaults
		const options = {
			minWidth: config.minWidth ?? IMAGE_TRAIL_CONFIG.minWidth,
			moveDistance: config.moveDistance ?? IMAGE_TRAIL_CONFIG.moveDistance,
			stopDuration: config.stopDuration ?? IMAGE_TRAIL_CONFIG.stopDuration,
			trailLength: config.trailLength ?? IMAGE_TRAIL_CONFIG.trailLength,
		};

		// Check if viewport supports image trail
		if (typeof window === 'undefined') {
			console.warn('[ImageTrail] Not in browser environment');
			return;
		}

		if (window.innerWidth < options.minWidth) {
			console.info('[ImageTrail] Viewport too small, trail disabled');
			return;
		}

		const wrapper = safeQuerySelector<HTMLElement>('[data-trail="wrapper"]');

		if (!wrapper) {
			console.warn('[ImageTrail] Wrapper element not found. Add [data-trail="wrapper"] to enable trail.');
			return;
		}

		if (!isHTMLElement(wrapper)) {
			console.error('[ImageTrail] Wrapper must be an HTMLElement');
			return;
		}

		// Initialize trail images
		const trailImageNodes = safeQuerySelectorAll<HTMLElement>('[data-trail="item"]');
		const trailImages = Array.from(trailImageNodes);

		if (trailImages.length === 0) {
			console.warn('[ImageTrail] No trail images found. Add [data-trail="item"] to images.');
			return;
		}

		// State management
		const state: State = {
			trailInterval: null,
			globalIndex: 0,
			last: { x: 0, y: 0 },
			trailImageTimestamps: new Map(),
			trailImages,
			isActive: false,
		};

		/**
		 * Gets mouse coordinates relative to an element
		 */
		function getRelativeCoordinates(e: MouseEvent, rect: DOMRect): Point {
			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};
		}

		/**
		 * Activates a trail image at the specified position
		 */
		function activate(trailImage: HTMLElement, x: number, y: number): void {
			if (!trailImage) {
				console.warn('[ImageTrail] Invalid trail image element');
				return;
			}

			try {
				const rect = trailImage.getBoundingClientRect();
				const styles = {
					left: `${x - rect.width / 2}px`,
					top: `${y - rect.height / 2}px`,
					zIndex: String(state.globalIndex),
					display: 'block',
				};

				Object.assign(trailImage.style, styles);
				state.trailImageTimestamps.set(trailImage, Date.now());

				// Animate appearance
				gsap.fromTo(
					trailImage,
					{
						autoAlpha: 0,
						scale: GSAP_CONFIGS.imageTrail.fadeIn.scale.from,
						rotate: GSAP_CONFIGS.imageTrail.fadeIn.rotate.from,
					},
					{
						scale: GSAP_CONFIGS.imageTrail.fadeIn.scale.to,
						autoAlpha: 1,
						rotate: GSAP_CONFIGS.imageTrail.fadeIn.rotate.to,
						duration: GSAP_CONFIGS.imageTrail.fadeIn.duration,
						ease: 'power2.out',
						overwrite: true,
					}
				);

				state.last = { x, y };
			} catch (error) {
				console.error('[ImageTrail] Failed to activate trail image:', error);
			}
		}

		/**
		 * Fades out a trail image with animation
		 */
		function fadeOutTrailImage(trailImage: HTMLElement): void {
			if (!trailImage) return;

			try {
				gsap.to(trailImage, {
					opacity: 0,
					scale: GSAP_CONFIGS.imageTrail.fadeOut.scale,
					rotate: GSAP_CONFIGS.imageTrail.fadeOut.rotate,
					duration: GSAP_CONFIGS.imageTrail.fadeOut.duration,
					ease: 'power2.out',
					onComplete: () => {
						gsap.set(trailImage, { autoAlpha: 0 });
					},
				});
			} catch (error) {
				console.error('[ImageTrail] Failed to fade out trail image:', error);
			}
		}

		/**
		 * Handles mouse movement to create trail effect
		 */
		function handleOnMove(e: MouseEvent): void {
			if (!state.isActive) return;

			try {
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
					const tail =
						state.trailImages[(state.globalIndex - options.trailLength) % state.trailImages.length];

					activate(lead, relativeX, relativeY);
					fadeOutTrailImage(tail);
					state.globalIndex++;
				}
			} catch (error) {
				console.error('[ImageTrail] Error in mouse move handler:', error);
			}
		}

		/**
		 * Cleans up old trail images
		 * FIXED: Avoids race condition by collecting items to delete first
		 */
		function cleanupTrailImages(): void {
			try {
				const currentTime = Date.now();
				const toDelete: HTMLElement[] = [];

				// First pass: collect items to delete
				for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
					if (currentTime - timestamp > options.stopDuration) {
						toDelete.push(trailImage);
					}
				}

				// Second pass: delete collected items (avoids modifying Map during iteration)
				toDelete.forEach((trailImage) => {
					fadeOutTrailImage(trailImage);
					state.trailImageTimestamps.delete(trailImage);
				});
			} catch (error) {
				console.error('[ImageTrail] Error in cleanup:', error);
			}
		}

		/**
		 * Starts the trail effect
		 */
		function startTrail(): void {
			if (state.isActive) return;

			try {
				state.isActive = true;
				wrapper.addEventListener('mousemove', handleOnMove);

				// Clear any existing interval before creating new one
				if (state.trailInterval) {
					clearInterval(state.trailInterval);
				}

				state.trailInterval = setInterval(cleanupTrailImages, IMAGE_TRAIL_CONFIG.cleanupInterval);
			} catch (error) {
				console.error('[ImageTrail] Failed to start trail:', error);
			}
		}

		/**
		 * Stops the trail effect and cleans up
		 */
		function stopTrail(): void {
			if (!state.isActive) return;

			try {
				state.isActive = false;
				wrapper.removeEventListener('mousemove', handleOnMove);

				if (state.trailInterval) {
					clearInterval(state.trailInterval);
					state.trailInterval = null;
				}

				// Clean up remaining trail images
				state.trailImages.forEach(fadeOutTrailImage);
				state.trailImageTimestamps.clear();
			} catch (error) {
				console.error('[ImageTrail] Failed to stop trail:', error);
			}
		}

		/**
		 * Handles window resize to enable/disable trail
		 */
		function handleResize(): void {
			try {
				if (window.innerWidth < options.minWidth && state.isActive) {
					stopTrail();
				} else if (window.innerWidth >= options.minWidth && !state.isActive) {
					const inView = ScrollTrigger.isInViewport(wrapper);
					if (inView) startTrail();
				}
			} catch (error) {
				console.error('[ImageTrail] Error in resize handler:', error);
			}
		}

		// Initialize ScrollTrigger
		try {
			ScrollTrigger.create({
				trigger: wrapper,
				start: 'top bottom',
				end: 'bottom top',
				onEnter: startTrail,
				onEnterBack: startTrail,
				onLeave: stopTrail,
				onLeaveBack: stopTrail,
			});
		} catch (error) {
			console.error('[ImageTrail] Failed to create ScrollTrigger:', error);
			return;
		}

		// Set up resize listener
		window.addEventListener('resize', handleResize);

		// Return cleanup function
		return (): void => {
			try {
				stopTrail();
				window.removeEventListener('resize', handleResize);
			} catch (error) {
				console.error('[ImageTrail] Error during cleanup:', error);
			}
		};
	} catch (error) {
		console.error('[ImageTrail] Failed to initialize image trail:', error);
		return;
	}
}
