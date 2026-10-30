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
                if (p.x > width) p.x = 0; if (p.x < 0) p.x = width;
                if (p.y > height) p.y = 0; if (p.y < 0) p.y = height;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(253, 226, 138, ${p.opacity})`; ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- 2. FREQUENCY SLIDER & POPUP ---
    const track = document.getElementById("spectrumTrack");
    const notch = document.getElementById("spectrumNotch");
    const labels = document.querySelectorAll(".spectrum-label");
    const cards = document.querySelectorAll(".codex-card");
    const popup = document.getElementById("sliderPopup");
    const popupTitle = document.getElementById("popupTitle");
    const popupImg = document.getElementById("popupImg");
    const popupBtn = document.getElementById("popupBtn");
    
    const codexData = [
        { name: "Aligned Horizon", img: "assets/display-alignedhorizon.png", target: "product-0" },
        { name: "Alignment Mini", img: "assets/display-alignmentmini.png", target: "product-1" },
        { name: "Alignment Snapshot", img: "assets/display-alignmentsnapshot.png", target: "product-2" },
        { name: "Alignment Codex", img: "assets/display-alignmentcodex.png", target: "product-3" }
    ];

    if (track && notch) {
        let isDragging = false;
        const totalSteps = labels.length - 1;
        let currentIndex = 0;

        function setActiveIndex(index) {
            currentIndex = Math.max(0, Math.min(index, totalSteps));
            const percentage = (currentIndex / totalSteps) * 100;
            notch.style.left = `${percentage}%`;
            
            labels.forEach((label, i) => label.classList.toggle("active", i === currentIndex));
            cards.forEach((card, i) => card.classList.toggle("active-card", i === currentIndex));

            // Update Popup Content
            popupTitle.textContent = codexData[currentIndex].name;
            popupImg.src = codexData[currentIndex].img;
            popupBtn.onclick = () => {
                document.getElementById(codexData[currentIndex].target).scrollIntoView({ behavior: 'smooth', block: 'center' });
                popup.classList.remove("show");
            };

            // Show Popup
            popup.classList.add("show");
        }

        labels.forEach((label, index) => label.addEventListener("click", () => setActiveIndex(index)));
        
        notch.addEventListener("mousedown", () => isDragging = true);
        notch.addEventListener("touchstart", () => isDragging = true);
        window.addEventListener("mouseup", () => { isDragging = false; setTimeout(() => popup.classList.remove("show"), 3000); });
        window.addEventListener("touchend", () => { isDragging = false; setTimeout(() => popup.classList.remove("show"), 3000); });
        
        window.addEventListener("mousemove", (e) => { if (isDragging) updateNotch(e.clientX); });
        window.addEventListener("touchmove", (e) => { if (isDragging) updateNotch(e.touches[0].clientX); });

        function updateNotch(clientX) {
            const rect = track.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0; if (x > rect.width) x = rect.width;
            const index = Math.round((x / rect.width) * totalSteps);
            setActiveIndex(index);
        }
        setActiveIndex(0);
    }

    // --- 3. CHECKOUT BUILDER MATH ---
    const radios = document.querySelectorAll('input[name="codex_type"]');
    const checkboxes = document.querySelectorAll('input[name="companion"]');
    const totalPriceEl = document.getElementById("totalPrice");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const errorText = document.getElementById("errorText");

    if (checkoutBtn) {
        function calculateTotal() {
            let total = 0;
            let selectedCodex = null;
            
            radios.forEach(radio => {
                if (radio.checked) { total += parseInt(radio.value); selectedCodex = radio.dataset.name; }
            });
            checkboxes.forEach(box => {
                if (box.checked) total += parseInt(box.value);
            });

            totalPriceEl.textContent = total;
            if (selectedCodex) {
                checkoutBtn.disabled = false;
                errorText.style.display = "none";
            } else {
                checkoutBtn.disabled = true;
                errorText.style.display = "block";
            }
        }

        radios.forEach(r => r.addEventListener("change", calculateTotal));
        checkboxes.forEach(c => c.addEventListener("change", calculateTotal));

        document.querySelectorAll('.select-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectValue = btn.dataset.select;
                radios.forEach(r => {
                    if (r.dataset.name.toLowerCase().includes(selectValue) || r.value === selectValue) {
                        r.checked = true;
                    }
                });
                calculateTotal();
            });
        });

        checkoutBtn.addEventListener("click", () => {
            alert(`Proceeding to checkout with a total of $${totalPriceEl.textContent}. You will be redirected to Payhip.`);
        });
    }
});
