# Mobile Responsiveness - Detailed Recommendations & Code Fixes

**Status:** Ready for Implementation  
**Prepared:** March 28, 2026

---

## 1. COMPREHENSIVE MEDIA QUERY STRATEGY

### Current State:
Only 1 media query at 768px with 4 rules

### Required Media Queries:

```css
/* ============================================
   MOBILE-FIRST RESPONSIVE DESIGN
   ============================================ */

/* BASE STYLES (Default - Mobile 320px+) */
/* These go in main CSS without @media */

/*
   For Tablet & UP (600px+): Minor adjustments
*/
@media (min-width: 600px) {
    /* Slightly larger spacing, multi-column grids */
}

/*
   For Tablet & UP (768px+): Side-by-side layout
*/
@media (min-width: 768px) {
    /* Current desktop-like layout */
    .dashboard-container {
        flex-direction: row;
    }
    
    .sidebar {
        width: 250px;
    }
}

/*
   For Large Screens (1024px+): Full optimization
*/
@media (min-width: 1024px) {
    /* Maximum width containers, enhanced spacing */
}

/*
   For Desktop & UP (1200px+): Premium layout
*/
@media (min-width: 1200px) {
    /* Desktop-optimized spacing and sizing */
}

/*
   For Extra Large Screens (1440px+): Ultra-wide
*/
@media (min-width: 1440px) {
    /* Distribution across very wide screens */
}
```

---

## 2. TYPOGRAPHY FIXES - IMPLEMENT RESPONSIVE FONT SCALES

### Current Problems:
- Hero h1: 3em (too large everywhere)
- CTA h2: 2.5em (fixed)
- Auth title: 2.5em (fixed)
- No scaling adjustment

### Solution: Responsive Typography Scale

```css
/* ============================================
   RESPONSIVE TYPOGRAPHY
   ============================================ */

/* MOBILE FIRST (320px - 599px) */
body {
    font-size: 14px;  /* 14px base on small phones */
    line-height: 1.5;
}

h1 {
    font-size: 1.75em;  /* 24.5px on mobile */
    line-height: 1.2;
}

h2 {
    font-size: 1.5em;   /* 21px on mobile */
}

h3 {
    font-size: 1.25em;  /* 17.5px on mobile */
}

h4 {
    font-size: 1.1em;   /* 15.4px on mobile */
}

p {
    font-size: 0.95em;  /* 13.3px on mobile */
}

.hero-content h1 {
    font-size: 2em;     /* 28px on mobile - down from 3em */
}

.cta h2 {
    font-size: 1.8em;   /* 25.2px on mobile - down from 2.5em */
}

.auth-header h1 {
    font-size: 1.8em;   /* 25px on mobile - down from 2.5em */
}

.stat-number {
    font-size: 2em;     /* 28px on cards - down from 3em */
}

.tagline {
    font-size: 1em;     /* 14px on mobile - down from 1.2em */
}

/* TABLET (600px - 767px) */
@media (min-width: 600px) {
    body {
        font-size: 15px;  /* 15px base on tablets */
    }
    
    h1 {
        font-size: 2em;   /* 30px */
    }
    
    h2 {
        font-size: 1.75em;  /* 26.25px */
    }
    
    .hero-content h1 {
        font-size: 2.2em;   /* 33px */
    }
    
    .cta h2 {
        font-size: 2em;     /* 30px */
    }
    
    .stat-number {
        font-size: 2.2em;   /* 33px */
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    body {
        font-size: 16px;  /* 16px base (standard) */
    }
    
    h1 {
        font-size: 2.5em;   /* 40px */
    }
    
    h2 {
        font-size: 2em;     /* 32px */
    }
    
    .hero-content h1 {
        font-size: 3em;     /* 48px - original */
    }
    
    .cta h2 {
        font-size: 2.5em;   /* 40px - original */
    }
    
    .auth-header h1 {
        font-size: 2.5em;   /* 40px - original */
    }
    
    .stat-number {
        font-size: 3em;     /* 48px - original */
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css) - Add before existing rules

---

## 3. PADDING & SPACING RESPONSIVE ADJUSTMENTS

### Current Problems:
- Hero padding: 80px (too large on mobile)
- Auth box padding: 40px (too large for small screens)
- Main content padding: 30px (should be 15px on mobile)
- File upload area: 30px (should be 20px on mobile)

### Solution:

```css
/* ============================================
   RESPONSIVE SPACING
   ============================================ */

/* MOBILE (320px - 599px) */
.hero {
    padding: 40px 15px;  /* Down from 80px 20px */
}

.auth-box {
    padding: 25px;       /* Down from 40px */
}

.main-content {
    padding: 15px;       /* Down from 30px */
}

.file-upload-area {
    padding: 20px;       /* Down from 30px */
}

.section {
    padding: 20px;       /* Down from 25px */
}

.stat-box {
    padding: 20px;       /* Down from 25px */
    gap: 12px;           /* Tighter gap */
}

.modal-content {
    padding: 20px;       /* Down from 30px */
    width: 95%;          /* Wider margin on mobile */
}

.feature-card {
    padding: 20px;       /* Down from 30px */
}

/* TABLET (600px - 767px) */
@media (min-width: 600px) {
    .hero {
        padding: 60px 20px;  /* Moderate increase */
    }
    
    .auth-box {
        padding: 30px;   /* Moderate increase */
    }
    
    .main-content {
        padding: 20px;   /* Slight increase */
    }
    
    .file-upload-area {
        padding: 25px;   /* Slight increase */
    }
    
    .section {
        padding: 22px;   /* Slight increase */
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    .hero {
        padding: 80px 20px;  /* Original */
    }
    
    .auth-box {
        padding: 40px;       /* Original */
    }
    
    .main-content {
        padding: 30px;       /* Original */
    }
    
    .file-upload-area {
        padding: 30px;       /* Original */
    }
    
    .section {
        padding: 25px;       /* Original */
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css) - Add to media queries

---

## 4. SIDEBAR - CRITICAL FIX - Hide on Mobile

### Current Problem:
- Fixed 250px width forces impossible layout on mobile
- No hamburger menu
- Takes up 70% of 320px screen

### Solution 1: SIMPLE - Stack on Mobile

```css
/* ============================================
   DASHBOARD CONTAINER - RESPONSIVE
   ============================================ */

/* MOBILE (320px - 767px) - STACK VERTICALLY */
.dashboard-container {
    display: flex;
    flex-direction: column;  /* Stack vertically on mobile */
    min-height: 100vh;
}

.sidebar {
    width: 100%;              /* Full width as a collapsed header */
    max-height: 200px;        /* Limit height when expanded */
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    padding: 10px 0;          /* Reduced padding */
    order: -1;                /* Place above main content */
}

.sidebar-menu {
    list-style: none;
    display: flex;            /* Horizontal on mobile */
    flex-wrap: wrap;          /* Wrap items */
    gap: 0;                   /* Remove gaps for space */
}

.sidebar-menu li {
    margin: 0;
    flex: 1;
    min-width: 80px;          /* Each item takes portion */
}

.sidebar-menu li a {
    padding: 10px 8px;        /* Reduced padding */
    font-size: 0.85em;        /* Smaller text */
    text-align: center;       /* Center for mobile */
    border-left: none;        /* Remove desktop border */
    border-bottom: 3px solid transparent;  /* Bottom accent instead */
    display: flex;            /* For vertical centering */
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.sidebar-menu li a:hover,
.sidebar-menu li.active a {
    border-left: none;
    border-bottom-color: var(--primary-color);
    background: rgba(217, 118, 66, 0.05);
}

.main-content {
    flex: 1;
    padding: 15px;             /* Mobile padding */
    background: var(--light-bg);
    order: 1;
}

/* TABLET (600px - 767px) - HORIZONTAL SIDEBAR AS TOP BAR */
@media (min-width: 600px) {
    .sidebar {
        width: 100%;
        max-height: none;
        padding: 15px 0;
    }
    
    .sidebar-menu {
        justify-content: center;
        gap: 5px;
    }
    
    .sidebar-menu li a {
        padding: 12px 15px;
        flex-direction: row;
        font-size: 0.95em;
    }
    
    .main-content {
        padding: 20px;
    }
}

/* DESKTOP (768px+) - SIDE SIDEBAR */
@media (min-width: 768px) {
    .dashboard-container {
        flex-direction: row;    /* Back to side-by-side */
    }
    
    .sidebar {
        width: 250px;           /* Fixed width on desktop */
        max-height: none;
        flex-shrink: 0;
        padding: 20px 0;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
        order: 0;
    }
    
    .sidebar-menu {
        display: flex;
        flex-direction: column;  /* Vertical on desktop */
        flex-wrap: nowrap;
    }
    
    .sidebar-menu li {
        margin: 5px 0;
        flex: none;
        min-width: auto;
    }
    
    .sidebar-menu li a {
        padding: 15px 25px;     /* Original */
        border-left: 4px solid transparent;  /* Back to left border */
        border-bottom: none;
        text-align: left;
        flex-direction: row;
        font-size: 1em;
    }
    
    .sidebar-menu li a:hover,
    .sidebar-menu li.active a {
        border-left-color: var(--primary-color);
        border-bottom: none;
    }
    
    .main-content {
        padding: 30px;
        order: 0;
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css) - Replace existing dashboard styles

---

## 5. LEADER PROFILE SECTION - Mobile Fixes

### Current Problem:
- min-width: 280px on image forces overflow on 320px screens
- min-width: 300px on profile info container
- flex-wrap: wrap forces two lines that don't fit
- Image height 320px is too tall on mobile

### Solution:

```css
/* ============================================
   LEADER PROFILE SECTION (Dashboard)
   ============================================ */

/* MOBILE (320px - 599px) */
.leader-profile-section {
    background: linear-gradient(135deg, #D97642 0%, #2A9D8F 100%);
    color: white;
    padding: 20px 15px;      /* Reduced from 40px */
    border-radius: 12px;
    margin-bottom: 20px;     /* Reduced from 30px */
    box-shadow: 0 8px 16px rgba(217, 118, 66, 0.15);
}

.leader-profile-content {
    display: flex;
    flex-direction: column; /* Stack vertically on mobile */
    gap: 20px;             /* Reduced from 40px */
    align-items: center;
}

.leader-profile-pic {
    min-width: auto;        /* CRITICAL FIX */
    max-width: 100%;        /* Fit to container */
    width: 200px;           /* Scale down on mobile */
    height: 200px;          /* Scale height */
    min-height: auto;       /* Remove fixed minimum */
    max-height: none;
    border-radius: 12px;
    object-fit: cover;
    border: 6px solid rgba(255,255,255,0.3);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    flex-shrink: 0;
}

.leader-profile-info {
    flex: 1;
    min-width: auto;        /* CRITICAL FIX */
    width: 100%;
    text-align: center;     /* Center text on mobile */
}

.leader-profile-info h1 {
    font-size: 1.8em;       /* Down from 2.5em */
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.leader-profile-info p {
    font-size: 1em;         /* Down from 1.2em */
    opacity: 0.95;
    line-height: 1.6;
}

.vision-statement {
    background: rgba(255,255,255,0.15);
    padding: 16px;          /* Down from 24px */
    border-radius: 10px;
    margin-top: 16px;       /* Down from 24px */
    border-left: 5px solid rgba(255,255,255,0.6);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.vision-statement h3 {
    margin: 0 0 10px 0;     /* Down from 12px */
    font-size: 1.2em;       /* Down from 1.4em */
    font-weight: 600;
}

.vision-statement p {
    margin: 6px 0;          /* Down from 8px */
    line-height: 1.6;       /* Down from 1.7 */
    font-size: 0.95em;
}

/* TABLET (600px - 767px) */
@media (min-width: 600px) {
    .leader-profile-section {
        padding: 30px;
        margin-bottom: 25px;
    }
    
    .leader-profile-content {
        gap: 30px;
    }
    
    .leader-profile-pic {
        width: 240px;
        height: 240px;
    }
    
    .leader-profile-info {
        text-align: left;   /* Left-align on tablet */
    }
    
    .leader-profile-info h1 {
        font-size: 2em;
    }
    
    .leader-profile-info p {
        font-size: 1.1em;
    }
    
    .vision-statement {
        padding: 20px;
        margin-top: 20px;
    }
    
    .vision-statement h3 {
        font-size: 1.3em;
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    .leader-profile-section {
        padding: 40px;
        margin-bottom: 30px;
    }
    
    .leader-profile-content {
        flex-direction: row;    /* Side-by-side on desktop */
        gap: 40px;
        align-items: center;
    }
    
    .leader-profile-pic {
        min-width: 280px;       /* Back to original */
        max-width: 380px;
        width: auto;
        height: auto;
        min-height: 320px;
        max-height: 420px;
        flex-shrink: 0;
    }
    
    .leader-profile-info {
        flex: 1;
        min-width: 300px;       /* Back to original */
        text-align: left;
    }
    
    .leader-profile-info h1 {
        font-size: 2.5em;
    }
    
    .leader-profile-info p {
        font-size: 1.2em;
    }
    
    .vision-statement {
        padding: 24px;
        margin-top: 24px;
    }
    
    .vision-statement h3 {
        font-size: 1.4em;
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css) + [dashboard.html](src/main/resources/static/dashboard.html#L14-L100)

---

## 6. NEWS IMAGES CONTAINER - Height Reduction

### Current Problem:
- Fixed 300px height too tall on mobile
- Takes up entire screen on small phones

### Solution:

```css
/* ============================================
   NEWS IMAGES CONTAINER
   ============================================ */

/* MOBILE (320px - 599px) */
.news-images-container {
    width: 100%;
    height: 150px;          /* Down from 300px */
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    gap: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) #f0f0f0;
}

.news-image {
    height: 150px;          /* Down from 300px */
    width: auto;
    max-width: none;
    object-fit: contain;
    flex-shrink: 0;
    cursor: pointer;
}

/* TABLET (600px - 767px) */
@media (min-width: 600px) {
    .news-images-container {
        height: 200px;
    }
    
    .news-image {
        height: 200px;
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    .news-images-container {
        height: 300px;      /* Back to original */
    }
    
    .news-image {
        height: 300px;      /* Back to original */
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css) + [dashboard.html](src/main/resources/static/dashboard.html#L56-L75)

---

## 7. FORM ROW & GRIDS - Responsive Columns

### Current State:
Uses `minmax(200px, 1fr)` which is mostly OK but could be better

### Optimization:

```css
/* ============================================
   RESPONSIVE FORM & GRID LAYOUTS
   ============================================ */

/* MOBILE (320px - 599px) - SINGLE COLUMN */
.form-row {
    display: grid;
    grid-template-columns: 1fr;  /* Single column on mobile */
    gap: 15px;                   /* Reduced from 20px */
}

.stats-row {
    display: grid;
    grid-template-columns: 1fr;  /* Single column stacks nicely */
    gap: 15px;                   /* Reduced from 20px */
}

.feature-grid {
    display: grid;
    grid-template-columns: 1fr;  /* Single column */
    gap: 20px;                   /* Reduced from 30px */
    max-width: 100%;             /* Full width on mobile */
}

.preview-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));  /* Smaller thumbs */
    gap: 12px;                   /* Reduced from 15px */
}

/* TABLET (600px - 767px) - TWO COLUMNS */
@media (min-width: 600px) {
    .form-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .stats-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .feature-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
    }
    
    .preview-container {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
}

/* DESKTOP (768px+) - MULTIPLE COLUMNS */
@media (min-width: 768px) {
    .form-row {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  /* Original logic */
        gap: 20px;
    }
    
    .stats-row {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  /* Original */
        gap: 20px;
    }
    
    .feature-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));  /* Original */
        gap: 30px;
    }
    
    .preview-container {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));  /* Original */
        gap: 15px;
    }
}

/* LARGE DESKTOP (1024px+) - OPTIMIZE DISTRIBUTION */
@media (min-width: 1024px) {
    .feature-grid {
        grid-template-columns: repeat(3, 1fr);  /* 3 columns on large desktop */
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css)

---

## 8. ALERTS - Maximum Width Responsive Fix

### Current Problem:
- max-width: 400px on 320px screen causes overflow

### Solution:

```css
/* ============================================
   ALERTS RESPONSIVE
   ============================================ */

/* MOBILE (320px - 599px) */
#alertContainer {
    position: fixed;
    top: 10px;           /* Reduced from 20px */
    right: 10px;         /* Reduced from 20px */
    left: 10px;          /* NEW - for mobile width */
    z-index: 9999;
    max-width: none;     /* Remove desktop max-width */
    width: auto;         /* Stretch to available space */
}

.alert {
    padding: 12px 15px;  /* Reduced from 15px 20px */
    border-radius: 8px;
    margin-bottom: 8px;  /* Reduced from 10px */
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s;
    font-size: 0.95em;   /* Slightly smaller on mobile */
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* TABLET & UP (600px+) */
@media (min-width: 600px) {
    #alertContainer {
        top: 15px;
        right: 15px;
        left: auto;        /* Back to right-only positioning */
        max-width: 450px;  /* Slightly larger */
    }
    
    .alert {
        padding: 15px 18px;
        margin-bottom: 10px;
        font-size: 1em;
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    #alertContainer {
        top: 20px;
        right: 20px;
        max-width: 400px;  /* Original */
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css)

---

## 9. NAVBAR - Mobile Optimization

### Current Problem:
- Items might squeeze on 320px screen
- Username text too long
- No hamburger menu

### Solution (Simple):

```css
/* ============================================
   NAVBAR - RESPONSIVE
   ============================================ */

/* MOBILE (320px - 599px) */
.navbar {
    padding: 12px 0;         /* Reduced from 15px */
}

.nav-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 12px;         /* Reduced from 20px */
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h2 {
    font-size: 1.2em;        /* Reduced from automatic */
    margin: 0;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 10px;               /* Reduced from 15px */
}

.user-name {
    font-weight: 600;
    font-size: 0.85em;       /* Smaller on mobile */
    max-width: 100px;        /* Limit username width */
    white-space: nowrap;     /* Prevent wrapping */
    overflow: hidden;
    text-overflow: ellipsis;
}

/* TABLET & UP (600px+) */
@media (min-width: 600px) {
    .navbar {
        padding: 15px 0;
    }
    
    .nav-container {
        padding: 0 20px;
    }
    
    .nav-brand h2 {
        font-size: 1.3em;
    }
    
    .nav-menu {
        gap: 15px;
    }
    
    .user-name {
        font-size: 0.95em;
        max-width: none;
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css)

---

## 10. AUTHENTICATION BOX - Mobile Optimization

### Current Problem:
- 40px padding leaves minimal space on 320px
- Modal content width not optimized

### Solution:

```css
/* ============================================
   AUTH CONTAINER & BOX
   ============================================ */

/* MOBILE (320px - 599px) */
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    padding: 15px;          /* Reduced from 20px */
}

.auth-box {
    background: white;
    border-radius: 15px;    /* Reduced from 20px for mobile */
    padding: 25px;          /* Reduced from 40px - CRITICAL */
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
}

.auth-header {
    text-align: center;
    margin-bottom: 25px;    /* Reduced from 30px */
}

.auth-header h1 {
    color: var(--primary-color);
    font-size: 1.8em;       /* Reduced from 2.5em */
    margin-bottom: 5px;
}

.auth-header p {
    color: var(--text-muted);
    font-size: 0.95em;      /* Smaller on mobile */
}

.auth-step h2 {
    color: var(--primary-color);
    margin-bottom: 18px;    /* Reduced from 20px */
    font-size: 1.3em;       /* Reduced from 1.5em */
}

.form-group {
    margin-bottom: 16px;    /* Reduced from 20px */
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 11px 12px;     /* Reduced from 12px 15px */
    font-size: 16px;        /* Keep for iOS zoom prevention */
}

.auth-footer {
    text-align: center;
    margin-top: 15px;       /* Reduced from 20px */
}

/* TABLET & UP (600px+) */
@media (min-width: 600px) {
    .auth-container {
        padding: 20px;
    }
    
    .auth-box {
        padding: 35px;      /* Between mobile and desktop */
        border-radius: 18px;
    }
    
    .auth-header {
        margin-bottom: 28px;
    }
    
    .auth-header h1 {
        font-size: 2.2em;
    }
    
    .auth-step h2 {
        font-size: 1.4em;
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    .auth-container {
        padding: 20px;
    }
    
    .auth-box {
        padding: 40px;      /* Original */
        border-radius: 20px;
    }
    
    .auth-header {
        margin-bottom: 30px;
    }
    
    .auth-header h1 {
        font-size: 2.5em;   /* Original */
    }
    
    .auth-step h2 {
        font-size: 1.5em;   /* Original */
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css)

---

## 11. PROFILE PAGE - Responsive Layout

### Current Problem:
- Profile container max-width: 900px (good but not optimized)
- Field rows have tight spacing on mobile
- Modal positioning needs adjustment

### Solution:

```css
/* ============================================
   PROFILE PAGE - RESPONSIVE
   ============================================ */

/* MOBILE (320px - 599px) */
.profile-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 12px;        /* Add mobile padding */
}

.profile-header {
    background: linear-gradient(135deg, #D97642 0%, #2A9D8F 100%);
    color: white;
    padding: 20px;          /* Reduced from 30px */
    border-radius: 10px;
    text-align: center;
    margin-bottom: 20px;    /* Reduced from 30px */
}

.profile-pic-container {
    width: 100px;           /* Reduced from 120px */
    height: 100px;
    margin: 0 auto 12px;    /* Reduced from 15px */
}

.profile-header h1 {
    font-size: 1.5em;       /* Reduced from 28px (2em) */
}

.profile-section {
    background: white;
    border-radius: 8px;     /* Reduced from 10px */
    padding: 18px;          /* Reduced from 25px */
    margin-bottom: 15px;    /* Reduced from 20px */
}

.field-row {
    margin-bottom: 12px;    /* Reduced from 15px */
    padding: 12px;          /* Reduced from 15px */
}

.field-label {
    min-width: auto;        /* Remove on mobile */
    display: inline;        /* Stack better */
    font-weight: 600;
    margin-bottom: 5px;
}

.field-value {
    word-break: break-word;  /* Prevent overflow */
}

.field-display {
    flex-direction: column;  /* Stack on mobile */
    gap: 10px;              /* Reduced from 20px */
}

/* TABLET & UP (600px+) */
@media (min-width: 600px) {
    .profile-container {
        padding: 0 15px;
    }
    
    .profile-header {
        padding: 25px;
        margin-bottom: 25px;
    }
    
    .profile-pic-container {
        width: 110px;
        height: 110px;
    }
    
    .profile-section {
        padding: 22px;
        margin-bottom: 18px;
    }
    
    .field-row {
        padding: 14px;
        margin-bottom: 14px;
    }
    
    .field-display {
        flex-direction: row;
        gap: 15px;
    }
}

/* DESKTOP (768px+) */
@media (min-width: 768px) {
    .profile-container {
        max-width: 900px;   /* Original */
        padding: 0 20px;
    }
    
    .profile-header {
        padding: 30px;      /* Original */
        margin-bottom: 30px;
    }
    
    .profile-pic-container {
        width: 120px;       /* Original */
        height: 120px;
    }
    
    .profile-section {
        padding: 25px;      /* Original */
        margin-bottom: 20px;
    }
    
    .field-row {
        padding: 15px;      /* Original */
        margin-bottom: 15px;
    }
}
```

**Implementation File:** [styles.css](src/main/resources/static/css/styles.css) + [profile.html](src/main/resources/static/profile.html)

---

## 12. IMPLEMENTATION CHECKLIST

### Phase 1: Core Typography & Spacing (2-3 hours)
- [ ] Add responsive typography CSS (Section 2)
- [ ] Add responsive padding CSS (Section 3)
- [ ] Test on 320px, 375px, 600px, 768px+ viewports

### Phase 2: Sidebar & Dashboard (3-4 hours)
- [ ] Update dashboard container styles (Section 4)
- [ ] Update leader profile section (Section 5)
- [ ] Update news images container (Section 6)
- [ ] Test sidebar collapse/expand behavior

### Phase 3: Forms & Layouts (2-3 hours)
- [ ] Update form grids (Section 7)
- [ ] Update alerts (Section 8)
- [ ] Update navbar (Section 9)

### Phase 4: Auth & Profile Pages (2-3 hours)
- [ ] Update auth box (Section 10)
- [ ] Update profile page (Section 11)
- [ ] Test on multiple devices

### Phase 5: Testing & Refinement (2-3 hours)
- [ ] Test all pages on actual mobile devices
- [ ] Test on tablet devices
- [ ] Test on desktop (verify no regression)
- [ ] Fine-tune spacing as needed

---

## Total Estimated Time: 11-16 hours

### By Skill Level:
- **Junior Dev:** 16-20 hours
- **Mid-level Dev:** 11-16 hours
- **Senior Dev:** 8-12 hours

---

## Files to Modify

1. **CRITICAL:**
   - [styles.css](src/main/resources/static/css/styles.css) - Add all media queries

2. **IMPORTANT:**
   - [dashboard.html](src/main/resources/static/dashboard.html) - Inline styles
   - [profile.html](src/main/resources/static/profile.html) - Inline styles
   - [login.html](src/main/resources/static/login.html) - Inline styles

3. **NICE TO HAVE:**
   - [create-ticket.html](src/main/resources/static/create-ticket.html)
   - [my-tickets.html](src/main/resources/static/my-tickets.html)
   - [index.html](src/main/resources/static/index.html)

---

## Testing Tools Recommended

1. **Chrome DevTools** - Built-in device simulator
2. **Firefox Responsive Design Mode** - Alt option
3. **Real Devices:**
   - iPhone SE or older (320px)
   - iPhone 12/13 (390px)
   - Galaxy S20 (360px)
   - iPad/Android Tablet

4. **Online Tools:**
   - ResponsivelyApp.com
   - BrowserStack.com (paid)
   - Google Mobile-Friendly Test

