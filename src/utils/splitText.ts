import { gsap, SplitText, ScrollTrigger } from './gsap';
import { GSAP_CONFIGS } from './constants';
import { safeQuerySelectorAll } from './dom';

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * Initializes text reveal animations using SplitText
 * Splits text into lines and animates each line on scroll
 *
 * @returns void
 *
 * @example
 * ```html
 * <h1 data-split="heading">Your heading here</h1>
 * ```
 */
export function initSplitTextReveal(): void {
	try {
		const headings = safeQuerySelectorAll('[data-split="heading"]');

		if (headings.length === 0) {
			console.info('[SplitText] No headings found with [data-split="heading"]');
			return;
		}

		headings.forEach((heading) => {
			try {
				// Make element visible (preventing FOUC - Flash of Unstyled Content)
				gsap.set(heading, { autoAlpha: 1 });

				// Split text into lines
				const split = new SplitText(heading, {
					type: 'lines',
					linesClass: 'split-line',
					tag: 'span', // Use span instead of div for inline display
				});

				if (!split.lines || split.lines.length === 0) {
					console.warn('[SplitText] No lines created for element:', heading);
					return;
				}

				// Wrap each line in a mask span for overflow clipping
				split.lines.forEach((line) => {
					try {
						const wrapper = document.createElement('span');
						wrapper.className = 'split-line-mask';

						const parentNode = line.parentNode;
						if (!parentNode) {
							console.warn('[SplitText] Line has no parent node:', line);
							return;
						}

						parentNode.insertBefore(wrapper, line);
						wrapper.appendChild(line);
					} catch (error) {
						console.error('[SplitText] Failed to wrap line:', error);
					}
				});

				// Animate the lines with scroll trigger
				gsap.from(split.lines, {
					duration: GSAP_CONFIGS.splitText.duration,
					yPercent: GSAP_CONFIGS.splitText.yPercent,
					stagger: GSAP_CONFIGS.splitText.stagger,
					ease: GSAP_CONFIGS.splitText.ease,
					scrollTrigger: {
						trigger: heading,
						start: 'top 80%',
						toggleActions: 'play none none none',
					},
				});
			} catch (error) {
				console.error('[SplitText] Failed to process heading:', heading, error);
			}
		});
	} catch (error) {
		console.error('[SplitText] Failed to initialize split text reveal:', error);
	}
}
