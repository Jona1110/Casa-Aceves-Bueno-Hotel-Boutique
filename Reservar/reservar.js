/**
 * LÓGICA DE CONTROL DE RESERVACIONES - CASA ACEVES & BUENO
 */
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("reservaForm");
    const roomSelect = document.getElementById("room");
    const checkIn = document.getElementById("checkIn");
    const checkOut = document.getElementById("checkOut");
    const depositDisplay = document.getElementById("depositDisplay");
    const formStatus = document.getElementById("formStatus");
    
    // Dirección URL del despliegue productivo de Google Apps Script
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxnWYfILnIAWUjBxWVuCJQ5AAeqYebUYdY01onSRr3Oin3EXi62Ok_QGxLJEDF73_kR/exec";

    // 1. CARGA DINÁMICA DE HABITACIONES DESDE EL GOOGLE SHEET
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
        console.error("Error al obtener la colección de habitaciones:", err);
        roomSelect.innerHTML = '<option value="">Error al cargar habitaciones</option>'; 
    }

    // CÁLCULO EN TIEMPO REAL DEL MONTO TOTAL Y EL ANTICIPO REQUERIDO (50%)
    const calcularAnticipo = () => {
        if(checkIn.value && checkOut.value && roomSelect.value) {
            const start = new Date(checkIn.value);
            const end = new Date(checkOut.value);
            
            // Transformación de milisegundos a días completos de estancia
            const noches = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
            const precio = roomSelect.options[roomSelect.selectedIndex].dataset.precio;
            
            if(noches > 0) {
                const total = noches * precio;
                depositDisplay.value = `$${(total * 0.5).toLocaleString('es-MX', {minimumFractionDigits: 2})} MXN`;
                return total;
            }
        }
        depositDisplay.value = "$0.00 MXN";
        return 0;
    };
    
    [checkIn, checkOut, roomSelect].forEach(el => el.addEventListener("change", calcularAnticipo));

    // 2. PROCESAMIENTO Y ENVÍO DEL FORMULARIO DE RESERVACIÓN
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Detiene de manera estricta la recarga automática de la página
        
        const btn = form.querySelector("button");
        btn.innerText = "Verificando disponibilidad..."; 
        btn.disabled = true;

        const payload = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            room: roomSelect.value,
            checkIn: checkIn.value,
            checkOut: checkOut.value,
            guests: document.getElementById("guests").value,
            total: calcularAnticipo()
        };

        try {
            // El uso de text/plain evita que el navegador ejecute una petición OPTIONS Preflight previa
            const response = await fetch(WEB_APP_URL, { 
                method: "POST", 
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                }
            });
            
            const result = await response.json();
            
            if(result.status === "success") {
                // Formateo estructurado del Ticket descriptivo para enviar al hotel
                const msg = `¡Hola! Me gustaría confirmar mi reserva en Casa Aceves & Bueno.

*ID de Reserva:* ${result.idReserva}
*Nombre:* ${payload.name}
*Suite:* ${payload.room}
*Entrada:* ${payload.checkIn}
*Salida:* ${payload.checkOut}
*Anticipo (50%):* $${result.anticipo.toLocaleString('es-MX', {minimumFractionDigits: 2})} MXN

Quedo a la espera de sus datos bancarios para realizar el depósito.`;

                // Construcción de la URL de redirección con el texto pre-cargado codificado para la API de WhatsApp
                const waLink = `https://wa.me/523351282650?text=${encodeURIComponent(msg)}`;
                
                // Redirección inmediata del navegador hacia WhatsApp
                window.location.href = waLink; 
            } else {
                alert("Atención: " + result.message);
                btn.innerText = "Solicitar Reserva"; 
                btn.disabled = false;
            }
        } catch (error) {
            console.error("Fallo detallado en la conexión con la Web App de Google:", error);
            alert("Error al procesar la reserva. Por favor, intente de nuevo.");
            btn.innerText = "Solicitar Reserva"; 
            btn.disabled = false;
        }
    });
});
