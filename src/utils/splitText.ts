import { gsap, SplitText, ScrollTrigger } from './gsap';

gsap.registerPlugin(SplitText, ScrollTrigger);

// Store SplitText instances for cleanup
const splitTextInstances: SplitText[] = [];
const scrollTriggerInstances: ScrollTrigger[] = [];

/**
 * Initialize text reveal animations using SplitText
 * Follows Astro best practices with proper cleanup and resize handling
 */
export function initSplitTextReveal() {
  const headings = document.querySelectorAll('[data-split="heading"]');

  if (headings.length === 0) return;

  headings.forEach((heading) => {
    const split = new SplitText(heading, {
      type: 'lines',
      linesClass: 'split-line',
      tag: 'span'  // Use span instead of div for better semantics
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

    // Animate the lines with ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: heading,
      start: 'top 80%',
      once: true, // Only animate once for better performance
      onEnter: () => {
        gsap.to(split.lines, {
          duration: 0.8,
          yPercent: 0,
          stagger: 0.1,
          ease: 'power4.out'
        });
      }
    });

    // Store ScrollTrigger instance for cleanup
    scrollTriggerInstances.push(scrollTrigger);
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

