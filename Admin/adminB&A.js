// Tu link oficial
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxnWYfILnIAWUjBxWVuCJQ5AAeqYebUYdY01onSRr3Oin3EXi62Ok_QGxLJEDF73_kR/exec";

let calendarioReservas;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los datos con FETCH al cargar
    fetch(WEB_APP_URL + "?action=getReservas")
        .then(response => response.json())
        .then(data => {
            actualizarEstadisticas(data); // Calcula métricas
            construirTabla(data);         // Llena tabla
            construirCalendario(data);    // Dibuja calendario
        })
        .catch(error => {
            document.getElementById('tableBody').innerHTML = '<tr><td colspan="6" class="loading-text">Error al conectar con la base de datos.</td></tr>';
            console.error("Error:", error);
        });
});

/**
 * Calcula y muestra las métricas en las tarjetas superiores
 */
function actualizarEstadisticas(data) {
    const total = data.length;
    const pagadas = data.filter(r => r.Status === 'Pagado').length;
    const pendientes = data.filter(r => r.Status === 'Pendiente').length;
    
    document.getElementById('statTotal').innerText = total;
    document.getElementById('statPagado').innerText = pagadas;
    document.getElementById('statPendiente').innerText = pendientes;
}

/**
 * Mapea los datos crudos del Sheet y los inyecta en la tabla HTML
 */
/**
 * Mapea los datos crudos del Sheet y los inyecta en la tabla HTML
 */
function construirTabla(data) {
    const tbody = document.getElementById('tableBody');
    
    function formatearFecha(fechaStr) {
        if (!fechaStr) return "";
        const date = new Date(fechaStr);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        return fechaStr;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-text">No hay reservas registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(row => {
        const entrada = formatearFecha(row.Fecha_Entrada);
        const salida = formatearFecha(row.Fecha_Salida);
        const statusClass = row.Status === 'Pagado' ? 'status-pagado' : 'status-pendiente';
        
        const actionButton = row.Status === 'Pendiente' 
            ? `<button class="btn-action" onclick="confirmarPago('${row.ID_Reserva}', this)"><i class="fas fa-check"></i> Aprobar</button>` 
            : `<span style="color: var(--text-light); font-size: 0.8rem;"><i class="fas fa-lock"></i> Completada</span>`;

        return `
            <tr>
                <td><strong>${row.ID_Reserva}</strong></td>
                <td>${row.Nombre_Huesped}</td>
                <td><a href="https://wa.me/${row.Telefono}" target="_blank" style="color: var(--primary); text-decoration: none;">${row.Telefono}</a></td>
                <td>${row.Habitacion}</td>
                <td>${entrada} al ${salida}</td>
                <td><span class="status-badge ${statusClass}">${row.Status}</span></td>
                <td>${actionButton}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Construye el calendario visualmente
 */
function construirCalendario(data) {
    const calendarEl = document.getElementById('calendar');
    
    const eventosCalendario = data.map(row => {
        return {
            id: row.ID_Reserva,
            title: `${row.Habitacion} - ${row.Nombre_Huesped}`,
            start: row.Fecha_Entrada, // Formato YYYY-MM-DD recibido del backend
            end: row.Fecha_Salida,
            backgroundColor: row.Status === 'Pagado' ? 'var(--success)' : 'var(--warning)',
            extendedProps: { status: row.Status }
        };
    });

    calendarioReservas = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        events: eventosCalendario
    });
    calendarioReservas.render();
}

/**
 * Envía la orden de actualización al backend
 */
function confirmarPago(id, btnElement) {
    if(confirm(`¿Estás seguro de marcar la reserva ${id} como PAGADA?`)) {
        btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btnElement.disabled = true;

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateStatus',
                id: id,
                status: 'Pagado'
            })
        })
        .then(response => response.json())
        .then(result => {
            if(result.status === "success") {
                location.reload(); 
            } else {
                alert("Error al actualizar la base de datos.");
                btnElement.innerHTML = '<i class="fas fa-check"></i> Aprobar';
                btnElement.disabled = false;
            }
        })
        .catch(error => {
            alert("Error de conexión.");
            btnElement.disabled = false;
        });
    }
}