#!/usr/bin/env node
/**
 * CLI — Gastos Parser
 *
 * Uso:
 *   node index.js                              → modo interactivo (REPL)
 *   node index.js "45000, uber, transporte"    → argumento directo
 *   node index.js --test                       → suite de casos
 */

const readline = require('readline')
const { parsearGasto } = require('./src/parser')

const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const GRAY = '\x1b[90m'

function printResultado(input, resultado) {
  console.log()
  console.log(`${DIM}Input:${RESET} ${input}`)
  console.log('─'.repeat(52))

  if (!resultado.ok) {
    console.log(`${RED}${BOLD}✗ Error de parseo${RESET}`)
    resultado.errores.forEach(e => console.log(`  ${RED}• ${e}${RESET}`))
  } else {
    const d = resultado.datos

    // Indicador de fuente de categoría
    const srcLabel = {
      campo: `${GRAY}[campo]${RESET}`,
      item: `${YELLOW}[inferida del item]${RESET}`,
      ninguna: `${RED}[sin categoría]${RESET}`,
    }[d.categoriaSrc]

    console.log(`${GREEN}${BOLD}✓ Gasto parseado${RESET}`)
    console.log(`  ${BOLD}Monto:     ${RESET}${CYAN}${d.montoFormateado}${RESET}`)
    console.log(`  ${BOLD}Item:      ${RESET}${d.item}`)
    console.log(`  ${BOLD}Categoría: ${RESET}${CYAN}${d.categoria}${RESET} ${srcLabel}`)
    console.log(`  ${BOLD}Fecha:     ${RESET}${d.fecha}`)
    console.log(`  ${BOLD}Método:    ${RESET}${d.metodo}`)
  }

  if (resultado.advertencias.length > 0) {
    resultado.advertencias.forEach(a => console.log(`  ${YELLOW}⚠ ${a}${RESET}`))
  }

  console.log()
}

function runTests() {
  const casos = [
    // Categoría explícita gana (fuente: campo)
    { input: '45000, almuerzo con equipo, ocio, ayer, tc', desc: 'Categoría explícita: ocio' },
    { input: '1200 | uber | transporte | hoy | ef', desc: 'Categoría explícita: transporte' },
    { input: '89990 - spotify - suscripciones', desc: 'Categoría explícita, sin fecha ni método' },
    { input: '590000, arriendo depto, basicos, 5, tc', desc: "Typo 'basicos' → matchea Básicos" },

    // Categoría vacía → inferida del item (fuente: item)
    { input: '2800, rappi, , ayer, tc', desc: 'Categoría vacía → infiere del item: Delivery' },
    {
      input: '15000, jumbo supermercado, , , ef',
      desc: 'Categoría vacía → infiere del item: Mercado',
    },
    { input: '1200, uber eats', desc: 'Solo 2 campos → infiere Delivery de item' },
    { input: '3500, alfajor, , , ef', desc: 'Categoría vacía → infiere Ocio' },

    // Categoría no reconocida → fallback a item
    {
      input: '5000, sushi rappi, comida rapida, hoy, tc',
      desc: "Cat desconocida 'comida rapida' → fallback Delivery por item",
    },
    {
      input: '50000, auriculares sony, gadgets, , tc',
      desc: "Cat desconocida 'gadgets' → fallback Inversión por item",
    },

    // Variantes de monto
    { input: '$45.000, netflix, suscripciones, , tc', desc: 'Monto con $ y puntos de miles' },
    { input: '12k, cabify, , lunes, ef', desc: 'Monto con k, sin categoría → Transporte' },

    // Variantes de fecha
    { input: '3000, café, ocio, anteayer, ef', desc: 'Fecha: anteayer' },
    { input: '8000, bencina, transporte, 15/02, ef', desc: 'Fecha: DD/MM' },

    // Casos de error esperados
    { input: 'solocampo', desc: 'ERROR: sin delimitador' },
    { input: '', desc: 'ERROR: input vacío' },
    { input: 'abc, netflix, suscripciones', desc: 'ERROR: monto inválido' },
  ]

  console.log(`\n${BOLD}${CYAN}═══ Suite de Tests ═══${RESET}\n`)
  let ok = 0
  let warn = 0
  let fail = 0

  casos.forEach(({ input, desc }) => {
    const resultado = parsearGasto(input)
    const tieneAdvertencias = resultado.advertencias.length > 0
    const icono = !resultado.ok
      ? `${RED}✗${RESET}`
      : tieneAdvertencias
        ? `${YELLOW}~${RESET}`
        : `${GREEN}✓${RESET}`

    console.log(`${icono} ${BOLD}${desc}${RESET}`)
    printResultado(input, resultado)

    if (!resultado.ok) fail++
    else if (tieneAdvertencias) warn++
    else ok++
  })

  console.log('─'.repeat(52))
  console.log(
    `${BOLD}Resultado:${RESET} ${GREEN}${ok} ok${RESET} · ${YELLOW}${warn} con advertencias${RESET} · ${RED}${fail} error${RESET}\n`
  )
}

function modoInteractivo() {
  console.log(`\n${BOLD}${CYAN}Gastos Parser — Modo Interactivo${RESET}`)
  console.log(`${DIM}Formato: MONTO, ITEM, CATEGORIA, FECHA, METODO${RESET}`)
  console.log(`${DIM}Delimitadores: , | - /${RESET}`)
  console.log(`${DIM}Categoría y fecha opcionales. Método default: TC${RESET}`)
  console.log(`${DIM}Comandos: .test  .salir${RESET}\n`)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${CYAN}>${RESET} `,
  })

  rl.prompt()

  rl.on('line', line => {
    const input = line.trim()
    if (!input) {
      rl.prompt()
      return
    }
    if (input === '.salir' || input === '.exit') {
      console.log('Chaito 👋 Muac 💋')
      rl.close()
      return
    }
    if (input === '.test') {
      runTests()
      rl.prompt()
      return
    }

    printResultado(input, parsearGasto(input))
    rl.prompt()
  })

  rl.on('close', () => process.exit(0))
}

const args = process.argv.slice(2)
if (args[0] === '--test') runTests()
else if (args.length > 0) printResultado(args.join(' '), parsearGasto(args.join(' ')))
else modoInteractivo()
