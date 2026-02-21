const express = require('express')
const { parsearGasto } = require('./parser')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// POST /gastos/parsear
// Body: { "input": "45000, uber, transporte, hoy, ef" }
app.post('/gastos/parsear', (req, res) => {
  const { input } = req.body

  if (!input || typeof input !== 'string') {
    return res.status(400).json({
      ok: false,
      errores: ["El campo 'input' es requerido y debe ser un string"],
      advertencias: [],
      datos: null,
    })
  }

  const resultado = parsearGasto(input)

  const status = resultado.ok ? 200 : 422
  return res.status(status).json(resultado)
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
  console.log(`Probá: POST http://localhost:${PORT}/gastos/parsear`)
})
