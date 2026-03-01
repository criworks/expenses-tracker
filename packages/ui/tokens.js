/**
 * Design Tokens — Expenses Tracker
 *
 * Fuente única de verdad para colores, tipografía y spacing.
 * Usado por web/ (Tailwind CSS) y mobile/ (NativeWind).
 *
 * Convención de uso:
 *   web/    → clases Tailwind con valores arbitrarios: bg-[#111217]
 *   mobile/ → clases NativeWind con valores arbitrarios: bg-[#111217]
 *   ambos   → pueden importar este archivo para lógica dinámica de estilos
 */

export const colors = {
  // Fondos principales
  bg:           "#111217", // Main Background
  bgElevated:   "#262A35", // Interactive/Surface Elements, Nav Tabs, Date pickers, Skeleton
  bgSubtle:     "#262A35", 

  // Bordes
  border:       "#262A35",
  borderMuted:  "#111217",
  borderActive: "#ffffff",

  // Texto
  text:         "#ffffff", // Active/Focus/Primary Text/Amounts
  textMuted:    "#60677D", // Muted/Inactive/Secondary Text
  textSubtle:   "#60677D",
  textDisabled: "#60677D",

  // Action / Brand
  action:       "#ffffff", // Main Action Color

  // Categorías (Mantenidos para web. Mobile usa Emojis + bgElevated según guidelines)
  cat: {
    basicos:       "#4a7c59",
    suscripciones: "#5b6fa6",
    mercado:       "#8a6d3b",
    inversion:     "#6b5b95",
    ocio:          "#a65b5b",
    delivery:      "#a67c52",
    transporte:    "#4a7a8a",
    sinCategoria:  "#60677D",
  },

  // Estados
  success:  "#4a7c59",
  error:    "#663333",
  warning:  "#8a6d3b",
};

export const spacing = {
  xs:  8,
  sm:  12,
  md:  16,
  lg:  24,
  xl:  32,
};

export const fontSize = {
  xs:   12,   // Base
  sm:   14,   
  md:   16,   
  lg:   18,   // Section headers ("Hoy", "Ayer")
  xl:   24,   // Month titles / Totals
  xxl:  40,   // Big amount inputs
  "3xl": 64,  // Massive amount inputs
};

export const letterSpacing = {
  tight:  -1,
  normal:  0,
  wide:    2,
  wider:   3,
  widest:  6,
};

export const fontWeight = {
  normal:   "400", // Regular text
  medium:   "500", // Menu items, section headers
  semibold: "600", // Totals, Big inputs
};

export const radius = {
  none: 0,
  md:   16,   // Standard cards or structural containers
  full: 9999, // Pills, nav buttons, and emoji containers
};

// Mapeo de categorías → color (útil para lookup dinámico)
export const categoryColor = (categoria) => {
  const map = {
    "Básicos":       colors.cat.basicos,
    "Suscripciones": colors.cat.suscripciones,
    "Mercado":       colors.cat.mercado,
    "Inversión":     colors.cat.inversion,
    "Ocio":          colors.cat.ocio,
    "Delivery":      colors.cat.delivery,
    "Transporte":    colors.cat.transporte,
  };
  return map[categoria] ?? colors.cat.sinCategoria;
};
