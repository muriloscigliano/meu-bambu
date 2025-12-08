import { gsap, SplitText, ScrollTrigger } from './gsap';

gsap.registerPlugin(SplitText, ScrollTrigger);

// Store SplitText instances for cleanup
const splitTextInstances: SplitText[] = [];
const scrollTriggerInstances: ScrollTrigger[] = [];

/**
 * Initialize text reveal animations using SplitText
 * Hero elements animate immediately, others use ScrollTrigger
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

    // Store instance for cleanup
    splitTextInstances.push(split);

    // Wrap each line in a mask span for overflow hidden effect
    split.lines.forEach((line) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'split-line-mask';
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Position lines off-screen BEFORE making visible (prevents flicker)
    gsap.set(split.lines, { yPercent: 110 });

    // NOW make element visible - lines are already positioned off-screen
    gsap.set(heading, { autoAlpha: 1 });

    // Check if this heading is inside the hero section
    const isInHero = heading.closest('[data-hero]') !== null;
    const delay = parseFloat(heading.getAttribute('data-delay') || '0');

    if (isInHero) {
      // Hero elements animate immediately on page load with staggered delay
      const isTitle = heading.classList.contains('hero__title');
      const baseDelay = isTitle ? 0.2 : 0.4; // Title first, then subtitle

      gsap.to(split.lines, {
        duration: 1,
        yPercent: 0,
        stagger: 0.08,
        delay: delay || baseDelay,
        ease: 'power4.out'
      });
    } else {
      // Other elements use ScrollTrigger
      const scrollTrigger = ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(split.lines, {
            duration: 0.8,
            yPercent: 0,
            stagger: 0.1,
            delay: delay,
            ease: 'power4.out'
          });
        }
      });

      scrollTriggerInstances.push(scrollTrigger);
    }
  });

  // Handle window resize - revert splits and reinitialize
  let resizeTimer: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Revert all splits
      splitTextInstances.forEach(split => split.revert());
      splitTextInstances.length = 0;

      // Kill all ScrollTriggers
      scrollTriggerInstances.forEach(st => st.kill());
      scrollTriggerInstances.length = 0;

      // Reinitialize
      initSplitTextReveal();
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function for Astro
  return () => {
    splitTextInstances.forEach(split => split.revert());
    scrollTriggerInstances.forEach(st => st.kill());
    window.removeEventListener('resize', handleResize);
  };
}

