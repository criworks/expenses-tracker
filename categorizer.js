/**
 * Categorizer
 * Mapea keywords a categorías. Las keywords se comparan en lowercase
 * contra la descripción del gasto. Primera coincidencia gana.
 */

const CATEGORIAS = {
  Básicos: [
    "básicos", "basicos", "arriendo", "renta", "gastos comunes", "comunidad", "luz", "electricidad",
    "agua", "gas", "cuenta", "dividendo"
  ],
  Suscripciones: [
    "suscripciones", "suscripción", "suscripcion", "spotify", "netflix", "amazon prime", "hbo", "disney", "youtube premium",
    "apple", "icloud", "notion", "chatgpt", "openai", "suscripcion", "suscripción"
  ],
  Mercado: [
    "mercado", "supermercado", "jumbo", "lider", "líder", "santa isabel", "unimarc", "tottus", "acuenta",
    "supermercado", "panaderia", "panadería", "verduleria", "verdulería",
    "feria", "carniceria", "carnicería", "almacen", "almacén", "mercado"
  ],
  Inversión: [
    "inversión", "inversion", "ahorro", "ropa", "zapatillas", "zapatos", "audifono", "audífono",
    "auricular", "audifonos", "earphone", "headphone",
    "electronico", "electrónico", "utensilio", "cocina", "impuesto",
    "sii", "contribuciones", "seguro", "herramienta", "libro", "curso",
    "tecnologia", "tecnología", "computador", "celular", "tablet"
  ],
  Ocio: [
    "ocio", "entretenimiento", "bar", "bares", "cine", "teatro", "concierto", "evento", "fiesta",
    "alfajor", "dulce", "snack", "helado", "copa", "trago", "cerveza",
    "vino", "pub", "discoteca", "karaoke", "juego", "videojuego", "steam",
    "café", "cafe", "cafeteria", "cafetería", "almuerzo", "comida", "cena",
    "desayuno", "restaurante", "restaurant", "sushi", "pizza", "hamburgesa",
    "empanada", "sandwich", "lunch"
  ],
  Delivery: [
    "delivery", "uber eats", "ubereats", "rappi", "pedidosya", "pedidos ya",
    "domicilio", "delivery", "despacho", "a domicilio"
  ],
  Transporte: [
    "transporte", "uber", "cabify", "bolt", "indriver", "taxi", "metro", "bip",
    "microbus", "micro", "bus", "transporte", "combustible", "bencina",
    "gasolina", "estacionamiento", "peaje", "tren"
  ],
};

// Orden importa: Delivery antes de Transporte para que "uber eats" no caiga en Transporte
const ORDEN_PRIORIDAD = [
  "Delivery",
  "Suscripciones",
  "Básicos",
  "Mercado",
  "Inversión",
  "Ocio",
  "Transporte",
];

/**
 * @param {string} descripcion
 * @returns {string} categoría detectada o "Sin categoría"
 */
function categorizar(descripcion) {
  const texto = descripcion.toLowerCase();

  for (const categoria of ORDEN_PRIORIDAD) {
    const keywords = CATEGORIAS[categoria];
    if (keywords.some((kw) => texto.includes(kw))) {
      return categoria;
    }
  }

  return "Sin categoría";
}

module.exports = { categorizar, CATEGORIAS };
