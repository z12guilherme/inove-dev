// Licence CC BY-NC-SA 4.0
// Attribution — You must give appropriate credit.
// Non Commercial — You may not use the material for commercial purposes.

import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"

const canvasElement = document.getElementById('canvas');
if (canvasElement) {
    const app = TubesCursor(canvasElement, {
        tubes: {
            colors: ["#00C7B7", "#4361ee", "#6958d5"],
            lights: {
                intensity: 200,
                colors: ["#00C7B7", "#fe8a2e", "#ff008a", "#60aed5"]
            }
        }
    });

    document.body.addEventListener('click', () => {
        const colors = randomColors(3);
        const lightsColors = randomColors(4);
        app.tubes.setColors(colors);
        app.tubes.setLightsColors(lightsColors);
    });
}

function randomColors(count) {
    return new Array(count)
        .fill(0)
        .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
}