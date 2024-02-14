require("dotenv").config();
const { createBot, createProvider, addKeyword, createFlow } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const ChatGPTClass = require('./chatgpt.class')

const ChatGPTInstance = new ChatGPTClass()


const flowInicial = addKeyword('hola')
  .addAnswer('Buenas!')
  .addAnswer('¿Pregunta lo que quieras?', { capture: true },
    async (ctx, { flowDynamic }) => {
      const body = ctx.body
      const respuesta = await ChatGPTInstance.handleMsgChatGPT(body)
      const message = respuesta.text
      await flowDynamic(message)
    }
  )

const main = async () => {
  const adapterDB = new MockAdapter();

  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    provider: adapterProvider,
    database: adapterDB,
    flow: createFlow([flowInicial])
  });

  QRPortalWeb();
};

main();
