const { addKeyword } = require("@bot-whatsapp/bot");
const { getItems } = require("../api/items.service");
const { getTicket, getUser } = require("../api/users.service");
const { readFileSync } = require("fs");
const { join } = require("path");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Recuperamos el prompt "VENDEDOR"
 */
const getPrompt = async () => {
  const pathPromp = join(process.cwd(), "promps");
  const text = readFileSync(join(pathPromp, "02_VENDEDOR.txt"), "utf-8");
  return text;
};

/**
 * Exportamos
 * @param {*} chatgptClass
 * @returns
 */
module.exports = {
  flowOfertas: (chatgptClass) => {
    return addKeyword("OFERTAS", { //TODO!!
      sensitive: true,
    })
      .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
        const jid = ctx.key.remoteJid;
        const refProvider = await provider.getInstance();

        await refProvider.presenceSubscribe(jid);
        await delay(500);

        await refProvider.sendPresenceUpdate("composing", jid);

        const user = await getUser(ctx.from);

        const lastTicket = await getTicket(user[0].id);
        if (!lastTicket.data.length) {
          await flowDynamic("No tienes ticket abierto!");
          return endFlow();
        }
        
        const listTickets = await getTicket(user[0].id);
        if (!listTickets.data.length) {
          await flowDynamic("No tenemos articulos disponibles");
          return endFlow();
        }

        const items = await getItems();

        const listItems = items.data.map((i) => `ARTICULO:${i.attributes.name}, PRECIO_SUGERIDO:${i.attributes.price}`).join('\n')

        const model = listTickets.data[0].attributes.model // Huawai
        

        const data = await getPrompt();//TXT

        await chatgptClass.handleMsgChatGPT(data); //OK

        await refProvider.sendPresenceUpdate("paused", jid);

        const textFromAI = await chatgptClass.handleMsgChatGPT(
          `modelo_telefono="${model}", cliente="${user[0].username}", lista_de_articulos="${listItems}"`
        );

        //modelo_telefono = Iphone X cliente = Leifer Mendez

        console.log(textFromAI.text);

        await flowDynamic(textFromAI.text);
      })
      .addAnswer(
        `¿Te interesa?`,
        { capture: true },
        async (ctx, { fallBack }) => {
          const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body);
          await fallBack(textFromAI.text);
        }
      );
  },
};
