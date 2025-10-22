import { gsap, SplitText, ScrollTrigger } from './gsap';

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * Initialize text reveal animations using SplitText
 * Simple approach - all text animates on page load
 */
export function initSplitTextReveal() {
  const headings = document.querySelectorAll('[data-split="heading"]');
  
  if (headings.length === 0) return;

  headings.forEach((heading) => {
    // Make element visible (preventing FOUC)
    gsap.set(heading, { autoAlpha: 1 });
    
    const split = new SplitText(heading, {
      type: 'lines',
      linesClass: 'split-line',
      tag: 'span'  // Use span instead of div
    });
    
    // Wrap each line in a mask span
    split.lines.forEach((line) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'split-line-mask';
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
    
    // Animate the lines
    gsap.from(split.lines, {
      duration: 0.8,
      yPercent: 110,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
}

