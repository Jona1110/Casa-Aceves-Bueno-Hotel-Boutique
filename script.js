document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica del Menú Móvil
    const hamburger = document.getElementById("hamburgerMenu");
    const navMenu = document.getElementById("navMenu");

    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // 2. Animaciones de Scroll (Reveal)
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target); // Solo anima una vez
            }
        });
    }, { 
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px" // Previene que cargue antes de tiempo
    });

    reveals.forEach(el => observer.observe(el));
});