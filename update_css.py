import re

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\css\\styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """/* Hero Section - Resn Style */
#hero.resn-hero {
    width: 100%;
    height: 100vh;
    background: #050505; /* Deep dark background */
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
    opacity: 0.6;
}

/* Orbs */
.resn-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    z-index: 0;
    opacity: 0.5;
    animation: floatOrb 10s infinite alternate ease-in-out;
}
.orb-1 {
    width: 400px;
    height: 400px;
    background: #00C7B7;
    top: -10%;
    left: -10%;
}
.orb-2 {
    width: 300px;
    height: 300px;
    background: #4A00E0;
    bottom: -10%;
    right: -5%;
    animation-delay: -5s;
}
.orb-3 {
    width: 250px;
    height: 250px;
    background: #8E2DE2;
    top: 40%;
    left: 40%;
    animation-delay: -2s;
}

@keyframes floatOrb {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 50px) scale(1.2); }
}

.resn-grid-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 1;
}

.z-index-2 {
    z-index: 2;
}

.hero-badge span {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(0, 199, 183, 0.1);
    border: 1px solid rgba(0, 199, 183, 0.3);
    border-radius: 30px;
    color: #00C7B7;
    font-size: 12px;
    letter-spacing: 3px;
    font-weight: 700;
    text-transform: uppercase;
}

.resn-hero-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 6vw; /* Huge typography */
    line-height: 1.1;
    margin: 0;
    letter-spacing: -2px;
    text-transform: uppercase;
}

.resn-hero-title .outline-text {
    color: transparent;
    -webkit-text-stroke: 2px rgba(255, 255, 255, 0.8);
}

.resn-hero-title .glow-text {
    color: #fff;
    text-shadow: 0 0 40px rgba(0, 199, 183, 0.5);
    background: -webkit-linear-gradient(#fff, #b3fff9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.resn-hero-desc {
    font-size: 1.2rem;
    color: #a0aab5;
    max-width: 600px;
    line-height: 1.6;
    font-weight: 300;
}

/* Resn Style Button */
.resn-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 18px 45px;
    color: #fff !important;
    text-decoration: none;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 14px;
    overflow: hidden;
    border-radius: 50px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 1;
    border: 1px solid rgba(0, 199, 183, 0.3);
}

.resn-btn-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: #00C7B7;
    z-index: -1;
    border-radius: 50px;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform: scaleX(0);
    transform-origin: right;
}

.resn-btn:hover {
    border-color: transparent;
    box-shadow: 0 10px 30px rgba(0, 199, 183, 0.4);
    transform: translateY(-3px);
}

.resn-btn:hover .resn-btn-bg {
    transform: scaleX(1);
    transform-origin: left;
}

.resn-btn-text {
    transition: transform 0.3s;
}

/* Mouse Scroll Indicator */
.resn-scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    text-align: center;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
}

.resn-scroll-indicator:hover {
    opacity: 1;
}

.mouse {
    width: 26px;
    height: 40px;
    border: 2px solid #fff;
    border-radius: 20px;
    margin: 0 auto 10px;
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

.resn-scroll-indicator p {
    color: #fff;
    font-size: 10px;
    letter-spacing: 3px;
    margin: 0;
}

@keyframes scrollWheel {
    0% { top: 6px; opacity: 1; }
    100% { top: 20px; opacity: 0; }
}

@media (max-width: 768px) {
    .resn-hero-title { font-size: 3rem; }
    .resn-hero-desc { font-size: 1rem; padding: 0 20px; }
}

"""

# We replace from /* Hero Section */ to just before /* Sections General */
content = re.sub(r'/\* Hero Section \*/.*?/\* Sections General \*/', new_css + '/* Sections General */', content, flags=re.DOTALL)

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\css\\styles.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS updated.")
