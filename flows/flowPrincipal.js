const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAnswer(
    "Bivenido a *Móvil Tech*",
    "Reparacion de celulares iPhone y otras marcas"
  )
  .addAnswer(
    [
        "¿Como podemos ayudarte?",
        "",
        "*1* Ver estatus de reparacion",
        "*2* Deparamento ventas",
        "*3* Administracion",
    ]
  )  
  .addAnswer('Responda con el numero de la opcion!')

module.exports = flowPrincipal;