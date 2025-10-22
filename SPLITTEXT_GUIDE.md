# 🎬 SplitText Animation Guide
## Smooth Line-by-Line Text Reveals

---

## ✅ Implementation Complete

Your site now has production-ready SplitText animations that reveal text smoothly line-by-line as you scroll!

### 📍 What's Been Added

1. ✅ **SplitText Utility** (`/src/utils/splitText.ts`)
2. ✅ **Automatic Initialization** (integrated in `client-init.ts`)
3. ✅ **FOUC Prevention** (CSS hides elements until ready)
4. ✅ **Font Loading Wait** (ensures accurate splits)
5. ✅ **Applied to All Major Text Elements**

---

## 🎯 Where It's Applied

### Current Animations:

| Component | Elements Animated | Split Type |
|-----------|------------------|------------|
| **Hero** | H1 Title + Subtitle | Lines |
| **ProductPanels** | H2 Title | Lines |
| **ProductSheets** | H2 Title | Lines |
| **PerfectFor** | H2 Title + Description | Lines |
| **WhyChoose** | H2 Title + Description | Lines |
| **FooterCTA** | H2 Title | Lines |

---

## 🎨 How It Works

### The Animation:
```javascript
gsap.from(lines, {
  yPercent: 110,      // Starts 110% below (hidden)
  duration: 0.8,      // Takes 0.8 seconds
  stagger: 0.08,      // 0.08s delay between lines
  ease: 'expo.out',   // Smooth deceleration
  scrollTrigger: {
    trigger: heading,  // Triggers when heading enters viewport
    start: 'top 80%',  // Starts when top hits 80% of viewport
    once: true         // Only animates once
  }
});
```

### Visual Effect:
1. Text lines start **hidden** (110% below, masked by overflow:hidden)
2. As you **scroll**, lines **slide up** one by one
3. **Smooth stagger** creates elegant reveal
4. Each line uses **expo.out** easing for natural motion

---

## 🎛️ Configuration

### Split Types Available:

#### 1. **Lines** (Current Default)
```html
<h1 data-split="heading" data-split-reveal="lines">Your Title</h1>
```
- **Duration:** 0.8s
- **Stagger:** 0.08s between lines
- **Effect:** Each line reveals sequentially
- **Best for:** Titles, headings

#### 2. **Words**
```html
<h1 data-split="heading" data-split-reveal="words">Your Title</h1>
```
- **Duration:** 0.6s
- **Stagger:** 0.06s between words
- **Effect:** Each word reveals sequentially
- **Best for:** Short phrases, taglines

#### 3. **Characters**
```html
<h1 data-split="heading" data-split-reveal="chars">Your Title</h1>
```
- **Duration:** 0.4s
- **Stagger:** 0.01s between characters
- **Effect:** Each letter reveals sequentially
- **Best for:** Special effects, short text

---

## 🎬 Customization

### Change Timing (Edit `/src/utils/splitText.ts`)

```javascript
const splitConfig = {
  lines: { 
    duration: 1.0,    // Slower reveal (was 0.8)
    stagger: 0.12     // More delay between lines (was 0.08)
  },
  words: { 
    duration: 0.8,    // Slower words
    stagger: 0.08     // More delay
  },
  chars: { 
    duration: 0.6,    // Slower chars
    stagger: 0.02     // More delay
  }
};
```

### Change Easing

```javascript
gsap.from(targets, {
  yPercent: 110,
  duration: config.duration,
  stagger: config.stagger,
  ease: 'power2.out',   // Different easing options:
  // ease: 'expo.out',     // Current (smooth deceleration)
  // ease: 'power4.out',   // More dramatic
  // ease: 'back.out',     // Slight overshoot
  // ease: 'elastic.out',  // Bouncy effect
  scrollTrigger: {
    trigger: heading,
    start: 'clamp(top 80%)',
    once: true
  }
});
```

### Change Start Position

```javascript
gsap.from(targets, {
  yPercent: 150,    // Start further down (more dramatic)
  // yPercent: 50,   // Start closer (subtle)
  opacity: 0,       // Add fade in
  rotation: 2,      // Add slight rotation
  ...
});
```

### Change Trigger Point

```javascript
scrollTrigger: {
  trigger: heading,
  start: 'top 90%',    // Trigger sooner (when top hits 90%)
  // start: 'top 70%', // Trigger later
  // start: 'center center', // Trigger at center
  once: true
}
```

---

## 📝 Adding to New Elements

### Step 1: Add Data Attributes
```html
<!-- Any element you want to animate -->
<h3 data-split="heading" data-split-reveal="lines">
  New Animated Text
</h3>
```

### Step 2: Choose Split Type
```html
<!-- Lines (default) -->
<h1 data-split="heading">Title</h1>

<!-- Or specify explicitly -->
<h2 data-split="heading" data-split-reveal="words">Subtitle</h2>
<p data-split="heading" data-split-reveal="chars">Special Text</p>
```

### That's it! 
The animation will automatically apply when the page loads.

---

## 🎨 Advanced Examples

### Example 1: Fade + Slide
```javascript
// In splitText.ts, modify the gsap.from():
gsap.from(targets, {
  yPercent: 110,
  opacity: 0,        // Add fade
  duration: config.duration,
  stagger: config.stagger,
  ease: 'expo.out'
});
```

### Example 2: Slide from Left
```javascript
gsap.from(targets, {
  xPercent: -20,     // Start from left
  opacity: 0,
  duration: config.duration,
  stagger: config.stagger,
  ease: 'expo.out'
});
```

### Example 3: Scale + Slide
```javascript
gsap.from(targets, {
  yPercent: 110,
  scale: 0.8,        // Start smaller
  duration: config.duration,
  stagger: config.stagger,
  ease: 'back.out'   // Slight overshoot
});
```

---

## 🔍 Testing

### View the Effect:
1. **Build:** `npm run build`
2. **Preview:** `npm run preview`
3. **Open:** http://localhost:4323/

### What to Look For:
- ✅ Text should be **hidden initially**
- ✅ Lines should **slide up** as you scroll
- ✅ Each line has **slight delay** (stagger)
- ✅ Animation is **smooth** with expo easing
- ✅ Only animates **once per page load**

### Debug in Console:
```javascript
// Check if SplitText is working
document.querySelectorAll('[data-split="heading"]').length
// Should return number of animated elements

// Check if elements have been split
document.querySelectorAll('.line').length
// Should return number of lines created
```

---

## 🚨 Troubleshooting

### Issue: Text Flashes Before Animating (FOUC)
**Solution:** CSS automatically hides `[data-split="heading"]` until ready
```css
[data-split="heading"] {
  visibility: hidden; /* Already added */
}
```

### Issue: Text Not Splitting Correctly
**Cause:** Font not loaded yet
**Solution:** Already handled - waits for `document.fonts.ready`

### Issue: Animation Not Triggering
**Check:**
1. Element has `data-split="heading"` attribute
2. Element is visible in viewport when scrolling
3. ScrollTrigger is registered
4. No console errors

### Issue: Stagger Too Fast/Slow
**Solution:** Edit `splitConfig` in `/src/utils/splitText.ts`

---

## 📊 Performance Notes

### Optimizations Included:
- ✅ **Waits for fonts** before splitting
- ✅ **Only splits once** (no re-splitting on scroll)
- ✅ **Uses GPU acceleration** (transform properties)
- ✅ **Optimized text rendering** (CSS font properties)
- ✅ **Clamps ScrollTrigger** start values
- ✅ **`once: true`** - animation only plays once

### Best Practices:
- Use **lines** for most headings (fastest)
- Use **words** for short phrases only
- Use **chars** sparingly (most expensive)
- Limit to **important headings** (not body text)

---

## 🎓 Technical Details

### CSS Classes Added by SplitText:
```html
<!-- After splitting -->
<h1 data-split="heading">
  <div class="line" style="overflow:hidden">
    <div>First line text</div>
  </div>
  <div class="line" style="overflow:hidden">
    <div>Second line text</div>
  </div>
</h1>
```

### mask: 'lines' Creates:
- Outer div with `overflow: hidden` (mask)
- Inner div that slides up (animated element)
- This creates the "reveal" effect

---

## 📚 Resources

### GSAP Documentation:
- [SplitText Docs](https://gsap.com/docs/v3/Plugins/SplitText/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Easing Visualizer](https://gsap.com/docs/v3/Eases)

### Files Modified:
- ✅ `/src/utils/splitText.ts` - Main utility
- ✅ `/src/scripts/client-init.ts` - Initialization
- ✅ `/src/styles/global.css` - FOUC prevention + rendering optimization
- ✅ All component files - Added data attributes

---

## ✨ Current Setup Summary

```javascript
// Default Configuration
{
  splitType: 'lines',
  duration: 0.8s,
  stagger: 0.08s,
  ease: 'expo.out',
  trigger: 'top 80%',
  once: true
}
```

**Status:** ✅ Production Ready
**Performance:** ✅ Optimized
**Accessibility:** ✅ Compatible (SplitText v13+ has built-in ARIA support)

---

**Your SplitText animation system is now live and ready!** 🎉

Test it at: http://localhost:4323/

