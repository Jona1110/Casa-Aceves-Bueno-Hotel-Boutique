document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SISTEMA DE FILTRADO DE SERVICIOS
    // ==========================================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const serviceCards = document.querySelectorAll(".service-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove("active"));
            // Agregar clase active al botón clickeado
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            // Filtrar las tarjetas
            serviceCards.forEach(card => {
                // Remover animaciones previas
                card.classList.remove("fade-in");
                
                // Forzar un reflow para reiniciar la animación
                void card.offsetWidth; 

                const categories = card.getAttribute("data-category");

                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("hidden");
                    card.classList.add("fade-in");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });

    // ==========================================
    // 2. LÓGICA DEL ACORDEÓN DE POLÍTICAS
    // ==========================================
    const accordions = document.querySelectorAll(".accordion-header");

    accordions.forEach(acc => {
        acc.addEventListener("click", function() {
            // Cerrar los demás acordeones abiertos
            accordions.forEach(item => {
                if (item !== this) {
                    item.classList.remove("active");
                    item.nextElementSibling.style.maxHeight = null;
                    item.querySelector("i").classList.replace("fa-minus", "fa-plus");
                }
            });

            // Alternar (Toggle) el acordeón actual
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            const icon = this.querySelector("i");

            if (panel.style.maxHeight) {
                // Si está abierto, cerrarlo
                panel.style.maxHeight = null;
                icon.classList.replace("fa-minus", "fa-plus");
            } else {
                // Si está cerrado, abrirlo
                panel.style.maxHeight = panel.scrollHeight + "px";
                icon.classList.replace("fa-plus", "fa-minus");
            }
        });
    });
});