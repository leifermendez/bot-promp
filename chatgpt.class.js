require('dotenv').config();
const { CoreClass } = require('@bot-whatsapp/bot');


class ChatGPTClass extends CoreClass {
  queue = [];
  optionsGPT = { model: "gpt-3.5-turbo" };
  openai = undefined;

  constructor(_database, _provider) {
    super(null, _database, _provider)
    this.init().then();
  }

  /**
   * Esta funciona inicializa
   */
  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI(
      {
        apiKey: process.env.OPENAI_API_KEY
      }
    );
  };

  handleMsg = async (ctx) => {

    const state = {
      getMyState: this.stateHandler.getMyState(ctx.from),
      get: this.stateHandler.get(ctx.from),
      getAllState: this.stateHandler.getAllState,
      update: this.stateHandler.updateState(ctx),
      clear: this.stateHandler.clear(ctx.from),
    }

    const { from, body } = ctx

    const conversationList = state.getMyState()?.conversationList ?? []
    const interaccionChatGPT = await this.openai.sendMessage(body,
      {
        conversationId: !conversationList.length
          ? undefined
          : conversationList[conversationList.length - 1].conversationId,
        parentMessageId: !conversationList.length
          ? undefined
          : conversationList[conversationList.length - 1].id,
      });

    conversationList.push(interaccionChatGPT);
    const parseMessage = {
      ...interaccionChatGPT,
      answer: interaccionChatGPT.text
    }

    await state.update({ threadId: null, conversationList })

    this.sendFlowSimple([parseMessage], from)
  }
}

module.exports = ChatGPTClass;