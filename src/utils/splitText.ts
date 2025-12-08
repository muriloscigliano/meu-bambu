import { gsap, SplitText, ScrollTrigger } from './gsap';

gsap.registerPlugin(SplitText, ScrollTrigger);

// Store SplitText instances for cleanup
const splitTextInstances: SplitText[] = [];
const scrollTriggerInstances: ScrollTrigger[] = [];

/**
 * Initialize text reveal animations using SplitText
 * Simplified for better performance
 */
export function initSplitTextReveal() {
  const headings = document.querySelectorAll('[data-split="heading"]');

  if (headings.length === 0) return;

  headings.forEach((heading) => {
    const split = new SplitText(heading, {
      type: 'lines',
      linesClass: 'split-line',
      tag: 'span'
    });

    splitTextInstances.push(split);

    // Wrap each line in a mask span
    split.lines.forEach((line) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'split-line-mask';
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Set initial state
    gsap.set(split.lines, { yPercent: 100 });
    gsap.set(heading, { autoAlpha: 1 });

    const isInHero = heading.closest('[data-hero]') !== null;
    const delay = parseFloat(heading.getAttribute('data-delay') || '0');

    if (isInHero) {
      const isTitle = heading.classList.contains('hero__title');
      const baseDelay = isTitle ? 0.2 : 0.4;

      gsap.to(split.lines, {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.06,
        delay: delay || baseDelay,
        ease: 'power3.out'
      });
    } else {
      const st = ScrollTrigger.create({
        trigger: heading,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.7,
            stagger: 0.05,
            delay: delay,
            ease: 'power3.out'
          });
        }
      });
      scrollTriggerInstances.push(st);
    }
  });

  // Return cleanup function
  return () => {
    splitTextInstances.forEach(split => split.revert());
    splitTextInstances.length = 0;
    scrollTriggerInstances.forEach(st => st.kill());
    scrollTriggerInstances.length = 0;
  };
}

