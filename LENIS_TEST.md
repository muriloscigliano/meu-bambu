# 🧪 Lenis Testing Guide

## ✅ All Issues Fixed

### What Was Fixed:
1. ✅ **Script import path** - Changed from `is:inline` with relative path to proper module import
2. ✅ **CSS class mismatch** - Fixed `.footer-wrap` → `.footer__wrap` and `.footer-wrap__dark` → `.footer__dark`
3. ✅ **Main element z-index** - Added proper layering for parallax effect
4. ✅ **Footer z-index** - Removed negative z-index that caused issues

---

## 🧪 How to Test Lenis

### 1. Start the Preview Server
```bash
npm run preview
```
Open: **http://localhost:4323/**

---

### 2. Test in Chrome DevTools

**Open DevTools (F12) → Console Tab**

#### Test 1: Check if Lenis Instance Exists
```javascript
window.lenis
```
**Expected:** Should return a Lenis object with properties like `velocity`, `animatedScroll`, etc.

#### Test 2: Check Lenis Configuration
```javascript
console.log({
  lerp: window.lenis.options.lerp,
  wheelMultiplier: window.lenis.options.wheelMultiplier,
  isScrolling: window.lenis.isScrolling
});
```
**Expected:**
```javascript
{
  lerp: 0.1,
  wheelMultiplier: 1,
  isScrolling: false
}
```

#### Test 3: Test Smooth Scroll
```javascript
window.lenis.scrollTo(1000, { duration: 2 });
```
**Expected:** Page should smoothly scroll to 1000px over 2 seconds.

#### Test 4: Check GSAP Integration
```javascript
console.log(gsap.ticker._listeners.length > 0);
```
**Expected:** `true` (Lenis is hooked into GSAP ticker)

---

### 3. Visual Tests

#### ✅ Smooth Scrolling
- **Action:** Scroll with mouse wheel
- **Expected:** Smooth, inertial scrolling (not instant jumps)
- **Feel:** Should have "momentum" like iOS scrolling

#### ✅ Footer Parallax
- **Action:** Scroll to the bottom of the page
- **Expected:** Footer slides up from -25% as you scroll
- **Effect:** Dark overlay fades in gradually

#### ✅ No Console Errors
- **Check:** DevTools Console tab
- **Expected:** No red errors related to Lenis, GSAP, or ScrollTrigger

---

## 📊 Performance Checklist

| Test | Expected Behavior | Status |
|------|------------------|---------|
| Smooth scroll works | Page scrolls with inertia | ⏳ Test |
| No jank/stuttering | Smooth 60fps scrolling | ⏳ Test |
| Footer parallax works | Footer moves up on scroll | ⏳ Test |
| Dark overlay fades in | Opacity animates smoothly | ⏳ Test |
| Mobile touch works | Smooth touch scrolling | ⏳ Test |
| No console errors | Clean console | ⏳ Test |

---

## 🔧 Current Configuration

### Lenis Settings (`/src/utils/lenis.ts`)
```javascript
{
  lerp: 0.1,              // Smoothness factor (lower = smoother)
  wheelMultiplier: 1,     // Mouse wheel scroll speed
  touchMultiplier: 2,     // Touch scroll speed (1.5 on iOS)
  gestureOrientation: 'vertical'
}
```

### Footer Parallax (`/src/components/sections/FooterCTA.astro`)
```javascript
{
  trigger: footer wrapper,
  start: 'top bottom',
  end: 'top top',
  scrub: true,
  yPercent: -25  // ← Adjust this to change parallax amount
}
```

---

## 🎨 Customization

### Change Scroll Speed
Edit `/src/utils/lenis.ts`:
```javascript
wheelMultiplier: 1.5,  // Faster scrolling
```

### Change Smoothness
```javascript
lerp: 0.05,  // More smooth (slower)
lerp: 0.2,   // Less smooth (faster response)
```

### Change Footer Parallax Amount
Edit `/src/components/sections/FooterCTA.astro` line 241:
```javascript
yPercent: -10,  // Less parallax (subtle)
yPercent: -50,  // More parallax (dramatic)
```

---

## ⚠️ Troubleshooting

### If Lenis is NOT working:

1. **Check console for errors:**
   ```javascript
   // Look for:
   // - Module import errors
   // - "Lenis is not defined"
   // - ScrollTrigger errors
   ```

2. **Verify Lenis is imported:**
   ```javascript
   console.log(typeof Lenis);  // Should be "function"
   ```

3. **Check if client-init.ts is loading:**
   ```javascript
   // In DevTools → Sources tab
   // Look for: src/scripts/client-init.ts
   ```

4. **Hard refresh:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

---

## 🎯 Quick Test Commands

Copy/paste these into the console:

```javascript
// Full diagnostic test
console.log({
  lenisExists: !!window.lenis,
  lenisVersion: window.lenis?.version,
  isScrolling: window.lenis?.isScrolling,
  velocity: window.lenis?.velocity,
  gsapActive: gsap.ticker._listeners.length > 0,
  scrollTriggerActive: ScrollTrigger.getAll().length
});
```

**Expected output:**
```javascript
{
  lenisExists: true,
  lenisVersion: "1.1.9",
  isScrolling: false,
  velocity: 0,
  gsapActive: true,
  scrollTriggerActive: 1
}
```

---

## ✅ Success Indicators

Your Lenis setup is working correctly if:

1. ✅ `window.lenis` exists in console
2. ✅ Scrolling feels smooth and has momentum
3. ✅ Footer parallax effect is visible
4. ✅ No console errors
5. ✅ Touch scrolling works on mobile
6. ✅ ScrollTrigger animations work

---

## 📝 Notes

- Lenis uses `requestAnimationFrame` for smooth 60fps scrolling
- GSAP ticker is synced with Lenis for perfect animation timing
- ScrollTrigger automatically updates with Lenis scroll position
- Footer parallax uses `scrub: true` for scroll-linked animation

**Current Status:** ✅ All fixed and ready to test!

