/**
 * Animation System for Meu Bambu
 * Comprehensive scroll-triggered animations using GSAP
 */

import { gsap, ScrollTrigger } from './gsap';

gsap.registerPlugin(ScrollTrigger);

// Store all animation instances for cleanup
const animations: gsap.core.Tween[] = [];
const triggers: ScrollTrigger[] = [];

/**
 * Initialize all page animations
 */
export function initAnimations() {
  // Wait for fonts to load for accurate measurements
  document.fonts.ready.then(() => {
    initHeaderAnimations();
    initFadeInAnimations();
    initStaggerAnimations();
    initImageRevealAnimations();
    initParallaxAnimations();
    initCounterAnimations();
    initButtonAnimations();
  });
}

/**
 * Header entrance animation - slides down on page load
 */
function initHeaderAnimations() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const headerItems = header.querySelectorAll('[data-header-item]');
  if (headerItems.length === 0) return;

  // Animate header items from CSS initial state
  const anim = gsap.to(headerItems, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.1,
    ease: 'power3.out',
    clearProps: 'transform'
  });

  animations.push(anim);
}

/**
 * Fade-in animations for elements with [data-animate="fade-in"]
 * Supports optional [data-delay] attribute for custom delays
 */
function initFadeInAnimations() {
  const elements = document.querySelectorAll('[data-animate="fade-in"]');

  elements.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-delay') || '0');
    const isInHero = el.closest('[data-hero]') !== null;

    // For hero elements, animate immediately with delay
    if (isInHero) {
      const anim = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power2.out',
        clearProps: 'transform'
      });
      animations.push(anim);
      return;
    }

    // For other elements, use scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Slide-up animations for elements with [data-animate="slide-up"]
 */
function initSlideUpAnimations() {
  const elements = document.querySelectorAll('[data-animate="slide-up"]');

  elements.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 60 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Staggered animations for card grids and lists
 * Use [data-animate="stagger"] on parent and [data-stagger-item] on children
 * Supports optional [data-delay] attribute for custom delays
 */
function initStaggerAnimations() {
  const containers = document.querySelectorAll('[data-animate="stagger"]');

  containers.forEach((container) => {
    const items = container.querySelectorAll('[data-stagger-item]');
    if (items.length === 0) return;

    const delay = parseFloat(container.getAttribute('data-delay') || '0');
    const isInHero = container.closest('[data-hero]') !== null;

    // For hero elements, animate immediately with delay
    if (isInHero) {
      const anim = gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: delay,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform'
      });
      animations.push(anim);
      return;
    }

    // For other elements, use scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Image reveal animations with clip-path
 * Use [data-animate="image-reveal"] on image containers
 */
function initImageRevealAnimations() {
  const images = document.querySelectorAll('[data-animate="image-reveal"]');

  images.forEach((img) => {
    const trigger = ScrollTrigger.create({
      trigger: img,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(img, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          clearProps: 'clipPath'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Parallax effect for background images
 * Use [data-animate="parallax"] on elements
 */
function initParallaxAnimations() {
  const elements = document.querySelectorAll('[data-animate="parallax"]');

  elements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.3');

    const anim = gsap.to(el, {
      yPercent: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    animations.push(anim);
  });
}

/**
 * Counter animations for numbers
 * Use [data-animate="counter"] with [data-count-to="100"]
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-animate="counter"]');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-count-to') || '0', 10);
    const suffix = counter.getAttribute('data-count-suffix') || '';
    const prefix = counter.getAttribute('data-count-prefix') || '';

    const obj = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(obj, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = prefix + Math.round(obj.value).toLocaleString('pt-BR') + suffix;
          }
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Button hover micro-interactions
 */
function initButtonAnimations() {
  const buttons = document.querySelectorAll('.btn, [data-animate="button"]');

  buttons.forEach((btn) => {
    // Magnetic effect on hover
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Subtle magnetic follow
    btn.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Section entrance animations
 * Auto-initializes sections with [data-section] attribute
 */
export function initSectionAnimations() {
  const sections = document.querySelectorAll('[data-section]');

  sections.forEach((section) => {
    const sectionTitle = section.querySelector('[data-section-title]');
    const sectionDesc = section.querySelector('[data-section-desc]');
    const sectionContent = section.querySelector('[data-section-content]');

    const elements = [sectionTitle, sectionDesc, sectionContent].filter(Boolean);

    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Scale-in animation for feature cards
 */
export function initScaleInAnimations() {
  const elements = document.querySelectorAll('[data-animate="scale-in"]');

  elements.forEach((el) => {
    gsap.set(el, { opacity: 0, scale: 0.9 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.5)'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Line drawing animation for SVG paths
 */
export function initLineDrawAnimations() {
  const paths = document.querySelectorAll('[data-animate="line-draw"]');

  paths.forEach((path) => {
    const length = (path as SVGPathElement).getTotalLength?.() || 0;

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    const trigger = ScrollTrigger.create({
      trigger: path,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const anim = gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut'
        });
        animations.push(anim);
      }
    });

    triggers.push(trigger);
  });
}

/**
 * Cleanup all animations
 */
export function cleanupAnimations() {
  animations.forEach(anim => anim?.kill?.());
  triggers.forEach(trigger => trigger?.kill?.());
  animations.length = 0;
  triggers.length = 0;
}

/**
 * Refresh ScrollTrigger calculations
 */
export function refreshAnimations() {
  ScrollTrigger.refresh();
}
