document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. STAR CANVAS ---
    const canvas = document.getElementById('stardust-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });
        const particles = [];
        for (let i = 0; i < 48; i++) {
            particles.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + 0.5, speedX: Math.random() * 0.5 - 0.25, speedY: Math.random() * 0.5 - 0.25, opacity: Math.random() * 0.5 + 0.2 });
        }
        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.speedX; p.y += p.speedY;
                if (p.x > width) p.x = 0; if (p.x < 0)
