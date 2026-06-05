document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("roomModal");
    const btnsDetails = document.querySelectorAll(".btn-details");
    const closeBtn = document.querySelector(".close-modal");

    // Referencias a los campos del modal
    const modalGallery = document.getElementById("modalGallery");
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");
    const modalPax = document.getElementById("modalPax");
    const modalArea = document.getElementById("modalArea");
    const modalBed = document.getElementById("modalBed");
    const modalHistory = document.getElementById("modalHistory");
    const historyBox = document.querySelector(".modal-history-box");

    btnsDetails.forEach(btn => {
        btn.addEventListener("click", () => {
            
            // 1. Clonar la galería de imágenes de la tarjeta al modal
            modalGallery.innerHTML = ''; // Limpiar galería anterior
            const card = btn.closest('.room-card');
            const galleryImages = card.querySelectorAll('.gallery-img');
            
            galleryImages.forEach(imgDiv => {
                const bgUrl = imgDiv.style.backgroundImage;
                const newImg = document.createElement('div');
                newImg.className = 'modal-gallery-img';
                newImg.style.backgroundImage = bgUrl;
                modalGallery.appendChild(newImg);
            });

            // 2. Extraer los demás datos del botón
            const name = btn.getAttribute("data-name");
            const price = btn.getAttribute("data-price");
            const pax = btn.getAttribute("data-pax");
            const area = btn.getAttribute("data-area");
            const bed = btn.getAttribute("data-bed");
            const history = btn.getAttribute("data-history");
            const servicesRaw = btn.getAttribute("data-services");

            // 3. Inyectar los textos en el Modal
            modalTitle.textContent = name;
            modalPrice.textContent = `$${price} MX$`;
            modalPax.textContent = pax;
            modalArea.textContent = area;
            modalBed.textContent = bed;
            modalHistory.textContent = history;

            // 4. Renderizar lista de servicios
            const existingServicesList = document.querySelector(".modal-services-list");
            if (existingServicesList) existingServicesList.remove();

            const servicesList = document.createElement('ul');
            servicesList.className = 'modal-services-list';
            
            if (servicesRaw) {
                const servicesArray = servicesRaw.split(',');
                servicesArray.forEach(service => {
                    if(service.trim() !== '') {
                        const li = document.createElement('li');
                        li.innerHTML = `<i class="fas fa-check"></i> ${service.trim()}`;
                        servicesList.appendChild(li);
                    }
                });
            }
            historyBox.after(servicesList);

            // 5. Mostrar Modal
            modal.style.display = "flex";
            setTimeout(() => { modal.classList.add("show"); }, 10);
            
            // Prevenir scroll de la página de fondo
            document.body.style.overflow = "hidden";
        });
    });

    const closeModal = () => {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }, 300); 
    };

    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});