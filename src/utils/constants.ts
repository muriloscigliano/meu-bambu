/**
 * Global constants for the Meu Bambu application
 * Centralizes magic numbers, breakpoints, and configuration values
 */

/**
 * Responsive breakpoints in pixels
 */
export const BREAKPOINTS = {
	mobile: 480,
	tablet: 768,
	laptop: 992,
	desktop: 1200,
} as const;

/**
 * Animation timing values in seconds
 */
export const ANIMATION_TIMINGS = {
	fast: 0.15,
	base: 0.3,
	medium: 0.5,
	slow: 0.7,
	slowest: 0.8,
} as const;

/**
 * GSAP animation configurations
 */
export const GSAP_CONFIGS = {
	splitText: {
		duration: 0.8,
		yPercent: 110,
		stagger: 0.1,
		ease: 'power4.out',
	},
	imageTrail: {
		fadeIn: {
			duration: 0.3,
			scale: { from: 0.8, to: 1 },
			rotate: { from: -5, to: 0 },
		},
		fadeOut: {
			duration: 0.8,
			scale: 0.6,
			rotate: 5,
		},
	},
	parallax: {
		whyChoose: {
			yPercent: 15,
			scrub: 1.5,
		},
		footer: {
			yPercent: -75,
			scale: 0.95,
		},
	},
} as const;

/**
 * Image trail configuration
 */
export const IMAGE_TRAIL_CONFIG = {
	stopDuration: 300, // ms before trail stops after no movement
	trailLength: 5, // number of images in trail
	moveDistance: 15, // divisor for movement threshold
	minWidth: 992, // minimum viewport width to enable trail
	cleanupInterval: 100, // ms between cleanup checks
} as const;

/**
 * Marquee configuration
 */
export const MARQUEE_CONFIG = {
	speedMultipliers: {
		mobile: 0.25,
		tablet: 0.5,
		desktop: 1,
	},
} as const;

/**
 * CSS spacing values (for reference, prefer CSS variables)
 */
export const SPACING = {
	xs: '8px',
	sm: '12px',
	md: '24px',
	lg: '36px',
	xl: '48px',
	'2xl': '90px',
} as const;

/**
 * CSS easing curves
 */
export const EASING = {
	bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	standard: 'cubic-bezier(0.625, 0.05, 0, 1)',
} as const;

/**
 * Helper function to get speed multiplier based on viewport width
 */
export function getSpeedMultiplier(width: number): number {
	if (width < BREAKPOINTS.mobile) return MARQUEE_CONFIG.speedMultipliers.mobile;
	if (width < BREAKPOINTS.laptop) return MARQUEE_CONFIG.speedMultipliers.tablet;
	return MARQUEE_CONFIG.speedMultipliers.desktop;
}

/**
 * Helper function to check if viewport supports image trail
 */
export function shouldEnableImageTrail(): boolean {
	return typeof window !== 'undefined' && window.innerWidth >= IMAGE_TRAIL_CONFIG.minWidth;
}

/**
 * Type definitions
 */
export type Breakpoint = keyof typeof BREAKPOINTS;
export type AnimationTiming = keyof typeof ANIMATION_TIMINGS;
export type SpacingSize = keyof typeof SPACING;
