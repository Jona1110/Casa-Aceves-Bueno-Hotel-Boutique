document.addEventListener("DOMContentLoaded", () => {
    // Animación suave de entrada para la cita histórica
    const quote = document.querySelector(".premium-quote");
    if (quote) {
        quote.style.opacity = "0";
        setTimeout(() => {
            quote.style.transition = "opacity 1.5s ease";
            quote.style.opacity = "1";
        }, 500);
    }
});