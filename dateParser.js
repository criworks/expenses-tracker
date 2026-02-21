/**
 * Date Parser
 * Resuelve strings de fecha humana en español a objetos Date.
 * Trabaja con la fecha actual como referencia.
 */

const DIAS_SEMANA = {
  domingo: 0, lunes: 1, martes: 2, miercoles: 3, miércoles: 3,
  jueves: 4, viernes: 5, sabado: 6, sábado: 6,
};

/**
 * @param {string|undefined} input - texto de fecha del usuario
 * @returns {{ fecha: Date, fechaStr: string, raw: string }}
 */
function parsearFecha(input) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const raw = (input || "").trim().toLowerCase();

  // Sin input → hoy
  if (!raw || raw === "hoy" || raw === "today") {
    return formatear(hoy, raw || "hoy");
  }

  // "ayer"
  if (raw === "ayer" || raw === "yesterday") {
    const d = new Date(hoy);
    d.setDate(d.getDate() - 1);
    return formatear(d, raw);
  }

  // "anteayer"
  if (raw === "anteayer") {
    const d = new Date(hoy);
    d.setDate(d.getDate() - 2);
    return formatear(d, raw);
  }

  // Día de semana: "lunes", "el lunes", etc.
  for (const [nombre, numDia] of Object.entries(DIAS_SEMANA)) {
    if (raw === nombre || raw === `el ${nombre}`) {
      const d = new Date(hoy);
      const diff = (hoy.getDay() - numDia + 7) % 7 || 7; // si es hoy mismo, 7 días atrás
      d.setDate(d.getDate() - diff);
      return formatear(d, raw);
    }
  }

  // Solo número de día: "15", "3"
  if (/^\d{1,2}$/.test(raw)) {
    const dia = parseInt(raw, 10);
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), dia);
    // Si el día ya pasó en este mes o es hoy, ok. Si es futuro, mes anterior.
    if (d > hoy) d.setMonth(d.getMonth() - 1);
    return formatear(d, raw);
  }

  // Formato DD/MM o DD-MM
  const matchDM = raw.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (matchDM) {
    const d = new Date(hoy.getFullYear(), parseInt(matchDM[2], 10) - 1, parseInt(matchDM[1], 10));
    return formatear(d, raw);
  }

  // Formato DD/MM/YYYY o DD-MM-YYYY
  const matchFull = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (matchFull) {
    let year = parseInt(matchFull[3], 10);
    if (year < 100) year += 2000;
    const d = new Date(year, parseInt(matchFull[2], 10) - 1, parseInt(matchFull[1], 10));
    return formatear(d, raw);
  }

  // Fallback → hoy con advertencia
  return { ...formatear(hoy, raw), advertencia: `No se reconoció la fecha "${raw}", se usó hoy` };
}

function formatear(date, raw) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return {
    fecha: date,
    fechaStr: `${dd}/${mm}/${yyyy}`,
    raw,
  };
}

module.exports = { parsearFecha };
