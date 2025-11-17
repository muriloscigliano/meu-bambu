import { gsap, ScrollTrigger } from './gsap';
import { getSpeedMultiplier } from './constants';
import { safeQuerySelector, safeQuerySelectorAll } from './dom';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes marquee components with scroll-based direction changes
 * Marquees reverse direction based on scroll direction
 *
 * @returns void
 *
 * @example
 * ```html
 * <div data-marquee-scroll-direction-target data-marquee-speed="15">
 *   <div data-marquee-scroll-target>
 *     <div data-marquee-collection-target>Content</div>
 *   </div>
 * </div>
 * ```
 */
export function initMarqueeScrollDirection(): void {
	try {
		const marquees = safeQuerySelectorAll('[data-marquee-scroll-direction-target]');

		if (marquees.length === 0) {
			console.info('[Marquee] No marquees found with [data-marquee-scroll-direction-target]');
			return;
		}

		marquees.forEach((marquee) => {
			try {
				// Query marquee elements
				const marqueeContent = safeQuerySelector<HTMLElement>(
					'[data-marquee-collection-target]',
					marquee
				);
				const marqueeScroll = safeQuerySelector<HTMLElement>(
					'[data-marquee-scroll-target]',
					marquee
				);

				if (!marqueeContent || !marqueeScroll) {
					console.warn('[Marquee] Missing required child elements in marquee:', marquee);
					return;
				}

				// Get data attributes
				const speed = marquee.getAttribute('data-marquee-speed');
				const direction = marquee.getAttribute('data-marquee-direction');
				const duplicate = marquee.getAttribute('data-marquee-duplicate');
				const scrollSpeed = marquee.getAttribute('data-marquee-scroll-speed');

				// Convert data attributes to usable types with defaults
				const marqueeSpeedAttr = parseFloat(speed || '15');
				const marqueeDirectionAttr = direction === 'right' ? 1 : -1; // 1 for right, -1 for left
				const duplicateAmount = parseInt(duplicate || '0', 10);
				const scrollSpeedAttr = parseFloat(scrollSpeed || '10');

				// Calculate speed based on viewport
				const speedMultiplier = getSpeedMultiplier(window.innerWidth);
				let marqueeSpeed =
					marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;

				// Precompute styles for the scroll container
				marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
				marqueeScroll.style.width = `${scrollSpeedAttr * 2 + 100}%`;

				// Duplicate marquee content for seamless loop
				if (duplicateAmount > 0) {
					const fragment = document.createDocumentFragment();
					for (let i = 0; i < duplicateAmount; i++) {
						const clone = marqueeContent.cloneNode(true);
						fragment.appendChild(clone);
					}
					marqueeScroll.appendChild(fragment);
				}

				// GSAP animation for marquee content
				const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');

				if (marqueeItems.length === 0) {
					console.warn('[Marquee] No items found for animation:', marquee);
					return;
				}

				const animation = gsap
					.to(marqueeItems, {
						xPercent: -100,
						repeat: -1,
						duration: marqueeSpeed,
						ease: 'linear',
					})
					.totalProgress(0.5);

				// Initialize marquee in the correct direction
				gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
				animation.timeScale(marqueeDirectionAttr);
				animation.play();

				// Set initial marquee status
				marquee.setAttribute('data-marquee-status', 'normal');

				// ScrollTrigger logic for direction inversion
				ScrollTrigger.create({
					trigger: marquee,
					start: 'top bottom',
					end: 'bottom top',
					onUpdate: (self) => {
						const isScrollingDown = self.direction === 1;
						const currentDirection = isScrollingDown ? -marqueeDirectionAttr : marqueeDirectionAttr;

						// Update animation direction and marquee status
						animation.timeScale(currentDirection);
						marquee.setAttribute('data-marquee-status', isScrollingDown ? 'inverted' : 'normal');
					},
				});

				// Extra speed effect on scroll
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: marquee,
						start: '0% 100%',
						end: '100% 0%',
						scrub: 0,
					},
				});

				const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
				const scrollEnd = -scrollStart;

				tl.fromTo(
					marqueeScroll,
					{ x: `${scrollStart}vw` },
					{ x: `${scrollEnd}vw`, ease: 'none' }
				);
			} catch (error) {
				console.error('[Marquee] Failed to initialize marquee:', marquee, error);
			}
		});
	} catch (error) {
		console.error('[Marquee] Failed to initialize marquee scroll direction:', error);
	}
}
