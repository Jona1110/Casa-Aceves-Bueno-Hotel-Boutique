// Simulación de envío del Formulario de Contacto
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita recargar la página
            
            // Aquí en un futuro se conectaría con EmailJS, Formspree o Google Sheets
            
            // Simular carga
            const btn = contactForm.querySelector("button[type='submit']");
            const originalText = btn.innerText;
            btn.innerText = "Enviando...";
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                
                // Mostrar mensaje de éxito
                formStatus.textContent = "¡Mensaje enviado con éxito! Te contactaremos pronto.";
                formStatus.className = "form-status success";
                
                // Limpiar formulario
                contactForm.reset();

                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 5000);
            }, 1500);
        });
    }
});