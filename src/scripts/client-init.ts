/**
 * Client-side initialization
 * GSAP ScrollTrigger + Lenis Smooth Scroll
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// ============================================
// GSAP Setup
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Lenis Smooth Scroll Setup
// ============================================
const lenis = new Lenis({
	autoRaf: true,
});

// Sync Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// ============================================
// Scroll Reveal Animations
// ============================================
if (!prefersReducedMotion) {
	const revealElements = document.querySelectorAll('[data-reveal]');
	
	revealElements.forEach((element) => {
		gsap.fromTo(
			element,
			{ 
				autoAlpha: 0, 
				y: 24 
			},
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: element,
					start: 'top 85%',
					once: true,
				},
			}
		);
	});
}

// ============================================
// Hover Scale Micro-interactions
// ============================================
const hoverElements = document.querySelectorAll('[data-hover-scale]');

hoverElements.forEach((element) => {
	let tween: gsap.core.Tween | null = null;
	
	const handleMouseEnter = () => {
		tween?.kill();
		tween = gsap.to(element, { 
			scale: 1.03, 
			duration: 0.2, 
			ease: 'power2.out' 
		});
	};
	
	const handleMouseLeave = () => {
		tween?.kill();
		tween = gsap.to(element, { 
			scale: 1, 
			duration: 0.2, 
			ease: 'power2.inOut' 
		});
	};
	
	element.addEventListener('mouseenter', handleMouseEnter);
	element.addEventListener('mouseleave', handleMouseLeave);
});

// ============================================
// Expose Global APIs
// ============================================
declare global {
	interface Window {
		lenis: Lenis;
		gsap: typeof gsap;
	}
}

// Expose Lenis for external control
window.lenis = lenis;

// Expose GSAP for debugging
window.gsap = gsap;


