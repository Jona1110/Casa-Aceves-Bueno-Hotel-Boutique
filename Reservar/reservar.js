document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("reservaForm");
    const roomSelect = document.getElementById("room");
    const checkIn = document.getElementById("checkIn");
    const checkOut = document.getElementById("checkOut");
    const depositDisplay = document.getElementById("depositDisplay");
    const formStatus = document.getElementById("formStatus");
    
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxnWYfILnIAWUjBxWVuCJQ5AAeqYebUYdY01onSRr3Oin3EXi62Ok_QGxLJEDF73_kR/exec";

    // 1. Cargar habitaciones dinámicamente desde el backend
    try {
        const response = await fetch(WEB_APP_URL);
        const habitaciones = await response.json();
        
        roomSelect.innerHTML = '<option value="">Selecciona una suite</option>';
        habitaciones.forEach(h => {
            let opt = document.createElement("option");
            opt.value = h.nombre;
            opt.textContent = `${h.nombre} - $${h.precio} por noche`;
            opt.dataset.precio = h.precio;
            roomSelect.appendChild(opt);
        });
    } catch (err) {
        roomSelect.innerHTML = '<option value="">Error al cargar habitaciones</option>';
    }

    // 2. Lógica de fechas y cálculo de anticipo en tiempo real
    const calcularAnticipo = () => {
        if(checkIn.value && checkOut.value && roomSelect.value) {
            const start = new Date(checkIn.value);
            const end = new Date(checkOut.value);
            const noches = (end - start) / (1000 * 60 * 60 * 24);
            const precio = roomSelect.options[roomSelect.selectedIndex].dataset.precio;
            
            if(noches > 0) {
                const total = noches * precio;
                const anticipo = total * 0.5;
                depositDisplay.value = `$${anticipo.toLocaleString()} MXN`;
                return total;
            }
        }
        return 0;
    };

    [checkIn, checkOut, roomSelect].forEach(el => el.addEventListener("change", calcularAnticipo));
    checkIn.min = new Date().toISOString().split("T")[0];
    checkIn.addEventListener("change", () => checkOut.min = checkIn.value);

    // 3. Enviar Reserva
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = form.querySelector("button");
        
        // Efectos visuales de carga
        btn.innerText = "Procesando...";
        btn.disabled = true;
        formStatus.innerHTML = '<p style="color: var(--accent);">Procesando su solicitud, por favor espere...</p>';
        
        const payload = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            room: roomSelect.value,
            checkIn: checkIn.value,
            checkOut: checkOut.value,
            guests: document.getElementById("guests").value,
            total: calcularAnticipo() // Envía el total calculado realmente
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            if(result.status === "success") {
                alert("Reserva registrada con éxito. Estado: Pendiente de pago.");
                form.reset();
                depositDisplay.value = "$0.00 MXN";
                formStatus.innerHTML = '';
            } else {
                alert(result.message);
                formStatus.innerHTML = '';
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
            formStatus.innerHTML = '';
        } finally {
            btn.innerText = "Solicitar Reserva";
            btn.disabled = false;
        }
    });
});