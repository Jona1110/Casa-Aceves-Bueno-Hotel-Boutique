/**
 * Sistema de Reservas - Casa Aceves & Bueno
 * Backend para registro y validación de disponibilidad
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reservas");
  const data = JSON.parse(e.postData.contents);
  
  // 1. Validar disponibilidad en Calendar antes de registrar
  if (isRoomOccupied(data.room, data.checkIn, data.checkOut)) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "La habitación ya está ocupada en esas fechas."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Calcular montos
  const total = parseFloat(data.total);
  const deposit = total * 0.50;

  // 3. Registrar en Google Sheets
  const newRow = [
    generateID(),              // ID_Reserva
    data.name,                 // Nombre_Huesped
    data.email,                // Email
    data.phone,                // Telefono
    data.checkIn,              // Fecha_Entrada
    data.checkOut,             // Fecha_Salida
    data.room,                 // Habitacion
    data.guests,               // Cantidad_Huespedes
    total,                     // Monto_Total
    deposit,                   // Anticipo_50
    "Pendiente",               // Status (Inicial siempre Pendiente)
    "",                        // Link_Comprobante (Vacío al inicio)
    new Date()                 // Fecha_Registro
  ];
  
  sheet.appendRow(newRow);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Reserva registrada con éxito. Estado: Pendiente de pago.",
    id: newRow[0]
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función que verifica disponibilidad en Google Calendar
 */
function isRoomOccupied(roomName, startStr, endStr) {
  const cal = CalendarApp.getCalendarById('digitality1110@gmail.com');
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  // Busca eventos en el rango de fechas
  const events = cal.getEvents(start, end);
  
  // Verifica si algún evento coincide con la habitación solicitada
  for (let i = 0; i < events.length; i++) {
    if (events[i].getTitle().includes(roomName)) {
      return true; // Habitación ocupada
    }
  }
  return false; // Disponible
}

/**
 * Generador de IDs simples
 */
function generateID() {
  return "RES-" + Math.floor(1000 + Math.random() * 9000);
}