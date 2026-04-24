import re

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\css\\styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """/* Hero Section - High Conversion Blue Style */
#hero.hc-hero {
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #0d1b2a 0%, #050a12 100%); /* Deep brand blue to almost black */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

#hero-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.5; /* Keeping 3D canvas subtle */
}

/* Orbs */
.hc-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    z-index: 0;
    opacity: 0.4;
    animation: floatOrb 12s infinite alternate ease-in-out;
}
.orb-1 {
    width: 450px;
    height: 450px;
    background: #00C7B7; /* Teal */
    top: -10%;
    left: -10%;
}
.orb-2 {
    width: 350px;
    height: 350px;
    background: #007BFF; /* Classic Tech Blue */
    bottom: -15%;
    right: -5%;
    animation-delay: -4s;
}
.orb-3 {
    width: 300px;
    height: 300px;
    background: #1b263b; /* Mid Blue */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -2s;
}

@keyframes floatOrb {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(60px, 60px) scale(1.1); }
}

.hc-grid-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 1;
}

.z-index-2 {
    z-index: 2;
}

/* Badge Pulse */
.hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 18px;
    background: rgba(13, 27, 42, 0.6);
    border: 1px solid rgba(0, 199, 183, 0.3);
    border-radius: 50px;
    color: #b3c2d1;
    font-size: 13px;
    letter-spacing: 2px;
    font-weight: 600;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
}

.badge-pulse {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #00C7B7;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 0 0 0 0 rgba(0, 199, 183, 0.7);
    animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 199, 183, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 199, 183, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 199, 183, 0); }
}

/* Title */
.hc-hero-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 4.5rem;
    line-height: 1.1;
    color: #ffffff;
    margin: 0;
    letter-spacing: -1px;
}

.hc-hero-title .hc-highlight {
    color: #00C7B7;
    background: -webkit-linear-gradient(0deg, #00C7B7, #48ebd9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}

/* Description */
.hc-hero-desc {
    font-size: 1.15rem;
    color: #aeb9c6;
    max-width: 650px;
    line-height: 1.6;
    font-weight: 400;
}

/* Buttons */
.hc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 36px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 50px;
    transition: all 0.3s ease;
    text-decoration: none;
}

.hc-btn-primary {
    background: #00C7B7;
    color: #050a12 !important;
    border: 2px solid #00C7B7;
    box-shadow: 0 8px 25px rgba(0, 199, 183, 0.3);
}

.hc-btn-primary:hover {
    background: #00a699;
    border-color: #00a699;
    box-shadow: 0 12px 30px rgba(0, 199, 183, 0.5);
    transform: translateY(-2px);
    color: #050a12 !important;
}

.hc-btn-outline {
    background: transparent;
    color: #ffffff !important;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.hc-btn-outline:hover {
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    color: #ffffff !important;
}

/* Mouse Scroll Indicator */
.hc-scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s;
}

.hc-scroll-indicator:hover {
    opacity: 1;
}

.mouse {
    width: 24px;
    height: 38px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    position: relative;
}

.wheel {
    width: 4px;
    height: 8px;
    background: #00C7B7;
    border-radius: 2px;
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    animation: scrollWheel 2s infinite;
}

@keyframes scrollWheel {
    0% { top: 6px; opacity: 1; }
    100% { top: 18px; opacity: 0; }
}

@media (max-width: 768px) {
    .hc-hero-title { font-size: 2.8rem; }
    .hc-hero-desc { font-size: 1rem; padding: 0 15px; }
    .hc-btn { width: 100%; justify-content: center; }
    .hc-orb { filter: blur(80px); }
}
"""

content = re.sub(r'/\* Hero Section - Resn Style \*/.*?/\* Sections General \*/', new_css + '/* Sections General */', content, flags=re.DOTALL)

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\css\\styles.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS updated to Blue High Conversion style.")
