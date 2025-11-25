# Wonderkids Daycare Website

A modern, responsive website for Wonderkids Daycare in Milton, Ontario. Built with clean HTML5, CSS3, and vanilla JavaScript.

## 🎨 Features

- **Fully Responsive** - Works beautifully on mobile, tablet, and desktop
- **Modern Design** - Clean, playful aesthetic with soft pastel colors
- **SEO Optimized** - Semantic HTML and meta tags for search engines
- **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- **Form Validation** - Client-side validation for enrollment and contact forms
- **Smooth Animations** - Subtle transitions and hover effects
- **Fast Loading** - Optimized code with minimal dependencies

## 📁 File Structure

```
wonderkids-daycare/
├── index.html          # Homepage
├── about.html          # About Us page
├── programs.html       # Programs page
├── enroll.html         # Enrollment/Waitlist page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── scripts.js      # JavaScript functionality
├── images/             # Image folder (add your images here)
└── README.md           # This file
```

## 🚀 Quick Start

1. **Download/Clone** this project to your local machine
2. **Open index.html** in your web browser to view the site
3. **Customize** the content and branding (see instructions below)
4. **Upload** to your web hosting service

## 🎨 Customizing Your Brand

### 1. Update Colors

Open `css/style.css` and find the `:root` section (lines 7-20):

```css
:root {
    /* CUSTOMIZE THESE COLORS */
    --primary: #FF9A8B;        /* Main brand color (buttons, links) */
    --primary-dark: #FF7B6B;   /* Darker shade of primary */
    --primary-light: #FFB4A8;  /* Lighter shade of primary */
    --secondary: #A8E6CF;      /* Secondary brand color */
    --secondary-dark: #88D4B0; /* Darker shade of secondary */
    --accent: #FFD3A5;         /* Accent color */
    --accent-dark: #FFC385;    /* Darker accent */
}
```

**How to choose colors:**
- Use a color picker tool like [Coolors.co](https://coolors.co) or [Adobe Color](https://color.adobe.com)
- Ensure good contrast for accessibility (test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
- Stick to 2-3 main colors for consistency

### 2. Add Your Logo

1. Save your logo as `logo.png` or `logo.jpg` in the `images/` folder
2. In each HTML file, find this line in the header:
   ```html
   <img src="images/logo-placeholder.png" alt="Wonderkids Daycare Milton Logo" class="logo-img">
   ```
3. Replace `logo-placeholder.png` with your logo filename

**Logo recommendations:**
- PNG format with transparent background
- Dimensions: 200-400px wide, 50-100px tall
- Keep file size under 100KB

### 3. Add Photos

Replace placeholder images with your actual photos:

**Required Images:**
- `images/hero-image.jpg` - Homepage hero (1920x1080px recommended)
- `images/infants-program.jpg` - Infant classroom (800x600px)
- `images/toddlers-program.jpg` - Toddler classroom (800x600px)
- `images/preschool-program.jpg` - Preschool classroom (800x600px)
- `images/about-mission.jpg` - Children playing/learning (800x600px)
- `images/about-facility.jpg` - Exterior or classroom (800x600px)
- `images/staff-1.jpg` through `staff-4.jpg` - Team photos (400x400px square)
- `images/nutrition.jpg` - Meal or children eating (600x500px)

**To add the hero background image:**
Open `css/style.css` and find the `.hero` section (around line 380):
```css
.hero {
    /* Uncomment these lines and add your image: */
    background-image: url('../images/hero-image.jpg');
    background-size: cover;
    background-position: center;
}
```

**Image optimization tips:**
- Use JPEG for photos, PNG for graphics with transparency
- Compress images with [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
- Target file sizes: Hero image under 300KB, other images under 150KB

### 4. Update Contact Information

Search for and replace these placeholders in ALL HTML files:

- `[Address]` → Your street address
- `[Postal Code]` → Your postal code (e.g., L9T 1A1)
- `[YEAR]` → Year you established (e.g., 2020)
- `(647) 289-6983` → Your phone number
- `info@wonderkidsdaycare.ca` → Your email address

**Quick find & replace:**
1. Open each HTML file in a text editor (VS Code, Notepad++, etc.)
2. Use Ctrl+F (Windows) or Cmd+F (Mac) to find placeholders
3. Replace with your actual information

### 5. Update Google Maps

On `contact.html`, find the iframe section and replace with your Google Maps embed code:

1. Go to [Google Maps](https://maps.google.com)
2. Search for your address
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the existing iframe in `contact.html` (around line 150)

### 6. Add Social Media Links

In the footer of each HTML file, update the social media links:

```html
<a href="https://facebook.com/yourpage" class="social-link" aria-label="Facebook">
<a href="https://instagram.com/yourpage" class="social-link" aria-label="Instagram">
```

### 7. Customize Content

**Text to customize:**
- About Us page: Add your daycare's story, mission, and team bios
- Programs page: Adjust age ranges and program details
- Testimonials: Replace with real parent testimonials (get permission first!)
- FAQ sections: Add your most common questions

## 📝 Form Setup

The enrollment and contact forms currently show a success message but **don't actually send data**. You need to connect them to a backend service.

### Options for Form Handling:

**1. Email Service (Easiest)**
- [Formspree](https://formspree.io) - Free for 50 submissions/month
- [FormSubmit](https://formsubmit.co) - Free, no registration needed
- Simply add `action="https://formspree.io/f/YOUR_ID"` to the form tag

**2. Netlify Forms** (If hosting on Netlify)
- Add `netlify` attribute to form tag
- Forms appear in Netlify dashboard automatically

**3. Custom Backend**
- Build your own API endpoint
- Update the fetch() calls in `js/scripts.js` (lines 147 and 217)

**Example with Formspree:**
```html
<form id="waitlistForm" action="https://formspree.io/f/YOUR_ID" method="POST">
```

## 🌐 Hosting Your Website

### Recommended Hosting Options:

**Free Options:**
1. **Netlify** ([netlify.com](https://netlify.com))
   - Drag & drop deployment
   - Free SSL certificate
   - Custom domain support

2. **GitHub Pages** ([pages.github.com](https://pages.github.com))
   - Free with GitHub account
   - Custom domain support

3. **Vercel** ([vercel.com](https://vercel.com))
   - Free tier available
   - Fast deployment

**Paid Options:**
- **SiteGround** - Great for small businesses
- **Bluehost** - WordPress hosting if you want a CMS
- **HostGator** - Budget-friendly option

### Deployment Steps (Netlify):
1. Create free account at [netlify.com](https://netlify.com)
2. Drag your entire project folder to Netlify
3. Site goes live instantly!
4. Connect your custom domain in settings

## ✅ Pre-Launch Checklist

Before launching your website, verify:

- [ ] All placeholder text replaced with real content
- [ ] All images added and optimized
- [ ] Logo added to all pages
- [ ] Contact information updated everywhere
- [ ] Google Maps embed working
- [ ] Social media links added
- [ ] Forms connected to backend/email service
- [ ] Test on mobile devices
- [ ] Test forms submission
- [ ] Check all links work
- [ ] Run spell-check on all content
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Verify accessibility (use [WAVE tool](https://wave.webaim.org))

## 📱 Testing Responsive Design

**Test on real devices if possible:**
- Mobile: iPhone, Android phones
- Tablet: iPad, Android tablets
- Desktop: Various screen sizes

**Browser testing tools:**
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Firefox Responsive Design Mode
- [BrowserStack](https://browserstack.com) for testing on multiple devices

## 🔧 Common Customizations

### Change Fonts

Update the Google Fonts link in the `<head>` of each HTML file and update CSS variables:

```css
:root {
    --font-heading: 'Your Font', sans-serif;
    --font-body: 'Your Font', sans-serif;
}
```

### Add a Blog Section

1. Create `blog.html` page
2. Add link to navigation menu
3. Style blog posts with existing classes

### Add a Photo Gallery

1. Create `gallery.html` page
2. Use a lightbox library like [GLightbox](https://biati-digital.github.io/glightbox/)
3. Add gallery link to navigation

## 🆘 Troubleshooting

**Problem: Images not showing**
- Check file path is correct (case-sensitive!)
- Ensure images are in the `images/` folder
- Check file extensions match (`.jpg` vs `.JPG`)

**Problem: Navigation menu not working on mobile**
- Check that `scripts.js` is loading properly
- Open browser console (F12) to check for JavaScript errors

**Problem: Forms not submitting**
- Ensure you've connected form to a backend service
- Check browser console for errors
- Verify form action URL is correct

**Problem: Colors look different on mobile**
- Check color contrast ratios
- Test in actual mobile browsers, not just DevTools
- Some browsers adjust colors for readability

## 📞 Support

If you need help customizing this website:

1. Check this README thoroughly
2. Search for your issue on [Stack Overflow](https://stackoverflow.com)
3. Hire a web developer on platforms like Upwork or Fiverr

## 📄 License

This website template is provided as-is for use by Wonderkids Daycare. Feel free to modify and customize as needed.

## 🎓 Learning Resources

Want to learn more about web development?

- [MDN Web Docs](https://developer.mozilla.org) - Comprehensive web development guide
- [W3Schools](https://w3schools.com) - Tutorials and references
- [CSS-Tricks](https://css-tricks.com) - CSS tips and techniques
- [freeCodeCamp](https://freecodecamp.org) - Free coding courses

---

**Built with ❤️ for Wonderkids Daycare - Milton, Ontario**

*Last updated: 2024*
