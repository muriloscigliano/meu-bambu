/**
 * Animation System for Meu Bambu
 * Simple scroll-triggered animations using GSAP
 */

import { gsap, ScrollTrigger } from './gsap';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all page animations
 */
export function initAnimations() {
  initHeaderAnimations();
  initFadeInAnimations();
  initStaggerAnimations();
  initImageRevealAnimations();
}

/**
 * Header entrance animation
 */
function initHeaderAnimations() {
  const headerItems = document.querySelectorAll('[data-header-item]');
  if (headerItems.length === 0) return;

  gsap.to(headerItems, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.1,
    ease: 'power3.out'
  });
}

/**
 * Fade-in animations for [data-animate="fade-in"]
 */
function initFadeInAnimations() {
  const elements = document.querySelectorAll('[data-animate="fade-in"]');

  elements.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-delay') || '0');
    const isInHero = el.closest('[data-hero]') !== null;

    if (isInHero) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power2.out'
      });
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
    }
  });
}

/**
 * Stagger animations for [data-animate="stagger"] with [data-stagger-item] children
 */
function initStaggerAnimations() {
  const containers = document.querySelectorAll('[data-animate="stagger"]');

  containers.forEach((container) => {
    const items = container.querySelectorAll('[data-stagger-item]');
    if (items.length === 0) return;

    const delay = parseFloat(container.getAttribute('data-delay') || '0');
    const isInHero = container.closest('[data-hero]') !== null;

    if (isInHero) {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: delay,
        stagger: 0.1,
        ease: 'power2.out'
      });
    } else {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
          });
        }
      });
    }
  });
}

/**
 * Image reveal animations for [data-animate="image-reveal"]
 */
function initImageRevealAnimations() {
  const images = document.querySelectorAll('[data-animate="image-reveal"]');

  images.forEach((img) => {
    ScrollTrigger.create({
      trigger: img,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(img, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut'
        });
      }
    });
  });
}

/**
 * Cleanup all animations
 */
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach(t => t.kill());
}

/**
 * Refresh ScrollTrigger after layout changes
 */
export function refreshAnimations() {
  ScrollTrigger.refresh();
}
