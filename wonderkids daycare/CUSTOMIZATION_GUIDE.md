# Quick Customization Guide

This guide shows you exactly where to make changes to personalize the website for Wonderkids Daycare.

## 🎯 Priority 1: Essential Updates

### 1. Contact Information (ALL HTML FILES)

**Find and replace these in EVERY HTML file:**

| Placeholder | Replace With | Location |
|------------|--------------|----------|
| `[Address]` | Your street address | Footer & Contact page |
| `[Postal Code]` | Your postal code | Footer & Contact page |
| `(647) 289-6983` | Your phone number | Footer, Contact page, Throughout |
| `info@wonderkidsdaycare.ca` | Your email | Footer & Contact page |
| `[YEAR]` | Year established | Footer (all pages) |

**Quick way to do this:**
1. Open each HTML file in a text editor
2. Use Find & Replace (Ctrl+H or Cmd+H)
3. Replace all instances at once

### 2. Logo (ALL HTML FILES)

**In each HTML file, find this line in the `<header>` section:**
```html
<img src="images/logo-placeholder.png" alt="Wonderkids Daycare Milton Logo" class="logo-img">
```

**Replace with:**
```html
<img src="images/YOUR-LOGO-FILENAME.png" alt="Wonderkids Daycare Milton Logo" class="logo-img">
```

### 3. Brand Colors (css/style.css)

**Open:** `css/style.css`
**Find:** Lines 7-20 (the `:root` section)
**Change these colors:**

```css
:root {
    /* CUSTOMIZE THESE - Use any hex color code */
    --primary: #FF9A8B;        /* Main buttons, links */
    --primary-dark: #FF7B6B;   /* Hover states */
    --primary-light: #FFB4A8;  /* Light backgrounds */
    --secondary: #A8E6CF;      /* Secondary elements */
    --secondary-dark: #88D4B0; /* Secondary hover */
    --accent: #FFD3A5;         /* Accent highlights */
    --accent-dark: #FFC385;    /* Accent hover */
}
```

**Color Picker Tools:**
- [Coolors.co](https://coolors.co/generate) - Generate palettes
- [Adobe Color](https://color.adobe.com/create) - Professional tool
- [HTML Color Codes](https://htmlcolorcodes.com/) - Pick from wheel

---

## 🎯 Priority 2: Content Updates

### 4. About Us Page (about.html)

**Team Member Information - Find these sections:**

```html
<!-- Around line 150-200 -->
<h3 class="team-name">[Director Name]</h3>
<p class="team-role">Director & Lead Educator</p>
<p class="team-bio">Passionate about early childhood education...</p>
```

**Replace with:**
- Real names
- Actual roles
- Personal bios (2-3 sentences each)
- Add photos to `images/staff-1.jpg`, etc.

### 5. Programs Page (programs.html)

**Adjust age ranges if needed:**

```html
<!-- Find these and adjust as needed -->
<div class="program-badge">6 weeks - 18 months</div>
<div class="program-badge">18 months - 3 years</div>
<div class="program-badge">3 - 5 years</div>
```

**Update program features:**
- Each program has a bulleted list (`<ul class="program-detail-list">`)
- Add/remove/edit bullets to match your actual programs

### 6. Testimonials (index.html & programs.html)

**Find testimonial sections:**

```html
<div class="testimonial-card">
    <p class="testimonial-text">"Quote here..."</p>
    <strong>Parent Name</strong>
    <span>Parent of X-year-old</span>
</div>
```

**Replace with:**
- Real testimonials (get written permission!)
- Actual parent names (first names only for privacy)
- Real child ages

### 7. Homepage Hero (index.html)

**Customize the tagline (around line 50):**

```html
<h1 class="hero-title">Where Curiosity Blooms & Friendships Grow</h1>
<p class="hero-subtitle">Quality early learning and childcare in Milton, Ontario</p>
```

Change these to match your brand voice!

---

## 🎯 Priority 3: Images

### 8. Add Images to images/ folder

**Required images (see IMAGE_GUIDE.txt for details):**
1. `logo.png` - Your logo
2. `hero-image.jpg` - Homepage hero background
3. `infants-program.jpg` - Infant classroom
4. `toddlers-program.jpg` - Toddler classroom
5. `preschool-program.jpg` - Preschool classroom
6. `about-mission.jpg` - Children learning/playing
7. `about-facility.jpg` - Your facility exterior/interior
8. `staff-1.jpg` through `staff-4.jpg` - Team photos
9. `nutrition.jpg` - Meals or children eating

### 9. Add Hero Background Image

**Open:** `css/style.css`
**Find:** Around line 380 (`.hero` section)
**Uncomment these lines:**

```css
.hero {
    /* UNCOMMENT THESE 3 LINES: */
    background-image: url('../images/hero-image.jpg');
    background-size: cover;
    background-position: center;
}
```

---

## 🎯 Priority 4: Forms & Functionality

### 10. Connect Forms to Email

**Option A: Use Formspree (Easiest)**

1. Go to [Formspree.io](https://formspree.io)
2. Sign up for free account
3. Create a new form
4. Copy your form endpoint

**In enroll.html, find:**
```html
<form id="waitlistForm" class="enrollment-form" novalidate>
```

**Change to:**
```html
<form id="waitlistForm" action="https://formspree.io/f/YOUR_ID" method="POST" class="enrollment-form">
```

**Repeat for contact.html contact form**

### 11. Google Maps Embed

**Get your embed code:**
1. Go to [Google Maps](https://google.com/maps)
2. Search for your address
3. Click "Share" button
4. Click "Embed a map" tab
5. Copy the `<iframe>` code

**In contact.html, find (around line 150):**
```html
<iframe src="https://www.google.com/maps/embed?pb=...">
```

**Replace entire `<iframe>` tag with your code**

### 12. Social Media Links

**In the footer of EVERY HTML file, update:**

```html
<a href="#" class="social-link" aria-label="Facebook">
```

**Change `href="#"` to your actual social media URLs:**
```html
<a href="https://facebook.com/wonderkidsmilton" class="social-link" aria-label="Facebook">
<a href="https://instagram.com/wonderkidsmilton" class="social-link" aria-label="Instagram">
```

---

## 🔧 Optional Customizations

### 13. Change Fonts

**Current fonts:** Quicksand (headings) and Poppins (body text)

**To change:**

1. Pick fonts from [Google Fonts](https://fonts.google.com)
2. In each HTML file `<head>`, replace this line:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
```

3. In `css/style.css`, update:
```css
:root {
    --font-heading: 'YourFont', sans-serif;
    --font-body: 'YourFont', sans-serif;
}
```

### 14. Adjust Spacing

**In css/style.css, find:**
```css
:root {
    --section-padding: 5rem 0;  /* Space between sections */
}
```

Make sections tighter: `3rem 0`
Make sections airier: `7rem 0`

### 15. Button Style

**Make buttons more rounded:**

```css
:root {
    --radius-md: 12px;  /* Change to 20px or 30px */
}
```

**Make buttons larger:**

```css
.btn {
    padding: 1rem 2.5rem;  /* Increase these values */
    font-size: 1.125rem;   /* Increase font size */
}
```

---

## 📋 Before Launch Checklist

Print this and check off as you go:

**Content:**
- [ ] All placeholder text replaced
- [ ] Contact information updated in all 5 HTML files
- [ ] About Us content written
- [ ] Team bios and photos added
- [ ] Testimonials added (with permission)
- [ ] Program details verified

**Images:**
- [ ] Logo added
- [ ] Hero image added
- [ ] All program images added
- [ ] Team photos added
- [ ] All images optimized (under 300KB each)

**Functionality:**
- [ ] Forms connected to email/backend
- [ ] Google Maps embed added
- [ ] Social media links updated
- [ ] Test forms submission
- [ ] Test on mobile device
- [ ] Test in Chrome, Firefox, Safari

**SEO & Accessibility:**
- [ ] Meta descriptions updated
- [ ] All images have alt text
- [ ] Links are descriptive
- [ ] Test with [WAVE tool](https://wave.webaim.org)

**Final Checks:**
- [ ] Spell-check all content
- [ ] Verify phone number is clickable on mobile
- [ ] Verify email links open email client
- [ ] All internal links work
- [ ] Site loads fast (under 3 seconds)

---

## 🆘 Common Issues & Fixes

### Images Not Showing
**Problem:** Broken image icons appear
**Fix:**
- Check file path matches exactly (case-sensitive!)
- Ensure image is in `images/` folder
- Check file extension (.jpg vs .JPG)

### Mobile Menu Not Working
**Problem:** Hamburger menu doesn't open
**Fix:**
- Ensure `js/scripts.js` is loading
- Check browser console for errors (press F12)
- Clear browser cache

### Colors Not Changing
**Problem:** Updated CSS colors but site looks the same
**Fix:**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Make sure you saved the CSS file
- Check you edited `css/style.css` not another file

### Forms Not Sending
**Problem:** Form shows success but email never arrives
**Fix:**
- Verify you added form action URL
- Check spam folder
- Verify Formspree account is active
- Check browser console for errors

---

## 📞 Need More Help?

1. **Check README.md** - Detailed documentation
2. **Check IMAGE_GUIDE.txt** - Image specifications
3. **Browser Console** - Press F12 to see errors
4. **Validate HTML** - Use [W3C Validator](https://validator.w3.org)
5. **Test Accessibility** - Use [WAVE Tool](https://wave.webaim.org)

---

## 🎉 You're Ready!

Once you've completed this checklist, your website is ready to launch! Upload to your hosting provider and start welcoming new families.

**Good luck with Wonderkids Daycare!** 🌟
