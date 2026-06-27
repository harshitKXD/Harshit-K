@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2') format('woff2');
}

@font-face {
  font-family: 'Playfair Display';
  font-style: italic;
  font-weight: 400 900;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/playfairdisplay/v37/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtbK-F0.woff2') format('woff2');
}

@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTmf3ZGMZpg.woff2') format('woff2');
}

@font-face {
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2') format('woff2');
}

:root {
  --cream: #F7F1E3;
  --burgundy: #5D2E46;
  --mahogany: #3D1F2F;
  --mustard: #F2CC8F;
  --teal: #81B29A;
  --warm-grey: #4A4E69;

  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 331 35% 27%;
  --primary-foreground: 43 41% 93%;
  --secondary: 36 78% 76%;
  --secondary-foreground: 331 35% 27%;
  --muted: 43 41% 93%;
  --muted-foreground: 234 15% 35%;
  --accent: 154 25% 60%;
  --accent-foreground: 331 35% 27%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 36 30% 80%;
  --input: 36 30% 80%;
  --ring: 331 35% 27%;
  --radius: 0.5rem;
}

@layer base {
  body {
    background-color: var(--cream);
    color: var(--warm-grey);
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    color: var(--burgundy);
  }

  * {
    border-color: hsl(var(--border));
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--cream);
}

::-webkit-scrollbar-thumb {
  background: var(--burgundy);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--mahogany);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Editorial Typography Effect */
.elena-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--burgundy);
  white-space: nowrap;
  position: relative;
}

.elena-char {
  display: inline-block;
  position: relative;
  will-change: transform;
  transform-style: preserve-3d;
}

.elena-char-inner {
  display: inline-block;
  will-change: transform;
  transform-style: preserve-3d;
}

.is-hidden .elena-char {
  transform: translate3d(0, -2rem, 0);
}

.is-hidden .elena-char-inner {
  transform: translate3d(0, 2rem, 0);
}

.is-visible .elena-char {
  transform: translate3d(0, 0, 0);
}

.is-visible .elena-char-inner {
  transform: translate3d(0, 0, 0);
}

/* Marquee animation */
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Selection color */
::selection {
  background-color: var(--burgundy);
  color: var(--cream);
}
