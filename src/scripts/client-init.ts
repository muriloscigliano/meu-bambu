/* Client-side initialization for GSAP, ScrollTrigger and Lenis */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scrolling with Lenis (integrated with GSAP)
const lenis = new Lenis({
	lerp: 0.08,
	smoothWheel: true,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Basic reveal-on-view animation utility
if (!prefersReducedMotion) {
	const elements = document.querySelectorAll('[data-reveal]');
	elements.forEach((el) => {
		gsap.fromTo(
			el,
			{ autoAlpha: 0, y: 24 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el as Element,
					start: 'top 85%',
					once: true,
				},
			}
		);
	});
}

// Micro interaction: subtle scale on hover for elements with [data-hover-scale]
document.querySelectorAll('[data-hover-scale]').forEach((el) => {
	let tween: gsap.core.Tween | null = null;
	(el as HTMLElement).addEventListener('mouseenter', () => {
		tween?.kill();
		tween = gsap.to(el, { scale: 1.03, duration: 0.2, ease: 'power2.out' });
	});
	(el as HTMLElement).addEventListener('mouseleave', () => {
		tween?.kill();
		tween = gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.inOut' });
	});
});

// Expose Lenis API for scroll control
// Usage: window.lenis.stop() / window.lenis.start() / window.lenis.scrollTo(target)
(window as any).lenis = lenis;

// Expose minimal API for debugging
(window as any).__gsap = gsap;


