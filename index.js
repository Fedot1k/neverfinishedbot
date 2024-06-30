import TelegramBot from "node-telegram-bot-api";

const TOKEN = `7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w`;
const bot = new TelegramBot(TOKEN, { polling: true });

const FedotId = 870204479;
const BotName = `neverfinishedbot`

let usersData = [];

bot.setMyCommands([
  {
    command: `/restart`,
    description: `Перезапуск 🔄️`,
  },
]);

let navtext = `<b>"Цели 🏔"</b> - список целей на будущее.\n\n<b>"Заметки ⚡"</b> - хранилище мыслей и идей.\n\n<b>"Достижения 🎖️"</b> - твои достижения и большие победы.\n\n<b>"Сон ✨"</b> - график сна и советы для правильного ночного режима.\n\n<b>"Серии 🔥"</b> - раздел для трекинга и развития самодисциплины.`;

let first_text = `<b>👋 Добро пожаловать</b> в мир целеустремленности и эффективности с <b><i>neverfinished!</i></b>\n\n<b>•  Трекинг прогресса 💯</b>\nВеди учет своих амбициозных <b><i>целей</i></b> и великих <b><i>достижений!</i></b>\n\n<b>•  Составление заметок ⚡</b>\nЗаписывай свои <b><i>мысли и идеи</i></b>, которые <b><i>нельзя забыть!</i></b>\n\n<b>•  Отчет по личным рекордам 🔥</b>\nПрокачивай <b><i>дисциплину</i></b>, сохраняя победные серии над <b><i>самим собой!</i></b>\n\n<b>•  Отслеживание графика сна ✨</b>\nУлучшай свой <b><i>режим сна</i></b> и проводи день <b><i>энергичнее!</i></b>\n\n<b>💪 Начни сейчас и достигни своих целей вместе с <i>neverfinished!</i></b>`;

let second_text = `<b>Как пожелаете к вам обращаться в будущем? 🤔</b>\n\n<i><b>*neverfinished</b> несет ответственность за конфиденциальность ваших данных 🤫</i>`;





async function loginOver(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  dataAboutUser.loginOver = true;
}





async function first(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (stage) {
      case 1:
        await bot
          .sendMessage(
            chatId,
            first_text,
            {
              parse_mode: `HTML`,
              disable_web_page_preview: true,
              reply_markup: 
              {
                inline_keyboard: [[{ text: `Далее➡️`, callback_data: `next` }]],
              },
            }
          )
          .then((message) => {
            dataAboutUser.messageId = message.message_id;
            dataAboutUser.action = `intro`
          });
          break;
      case 2:
        await bot.editMessageText(
          first_text,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.messageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `Далее➡️`, callback_data: `next` }]],
            },
          }
        );
        dataAboutUser.action = `intro`
        break;
      case 3:
        await bot.editMessageText(
          second_text,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.messageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `Оставить ${dataAboutUser.TelegramUsername} ✅`,
                    callback_data: `leavename`,
                  },
                ],
                [{ text: `⬅️Назад`, callback_data: `back` }],
              ],
            },
          }
        );
        dataAboutUser.action = `who`
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function menu(chatId, nav = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (nav) {
      case 1:
        await bot.editMessageText(
          `<b>Привет, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой план на сегодня?</b>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.messageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `Цели 🏔`, callback_data: `goals` },
                  { text: `Заметки ⚡`, callback_data: `notes` },
                ],
                [{ text: `Достижения 🎖️`, callback_data: `achivs` }],
                [
                  { text: `Сон ✨`, callback_data: `sleep` },
                  { text: `Серии 🔥`, callback_data: `streaks` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `menu`;
        break;
      case 2:
        await bot.editMessageText(
          `<b>Привет, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой план на сегодня?</b>\n\n<blockquote>${navtext}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=hideNav">Навигация по меню ⇧</a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.messageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `Цели 🏔`, callback_data: `goals` },
                  { text: `Заметки ⚡`, callback_data: `notes` },
                ],
                [{ text: `Достижения 🎖️`, callback_data: `achivs` }],
                [
                  { text: `Сон ✨`, callback_data: `sleep` },
                  { text: `Серии 🔥`, callback_data: `streaks` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `menu`;
        break;
      case 3:
        if (dataAboutUser.loginOver) {
          await bot
            .sendMessage(
              chatId,
              `<b>Привет, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой план на сегодня?</b>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`,
              {
                parse_mode: `HTML`,
                disable_web_page_preview: true,
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: `Цели 🏔`, callback_data: `goals` },
                      { text: `Заметки ⚡`, callback_data: `notes` },
                    ],
                    [{ text: `Достижения 🎖️`, callback_data: `achivs` }],
                    [
                      { text: `Сон ✨`, callback_data: `sleep` },
                      { text: `Серии 🔥`, callback_data: `streaks` },
                    ],
                  ],
                },
              }
            )
            .then((message) => {
              dataAboutUser.messageId = message.message_id;
              dataAboutUser.action = `menu`;
            });
          }
          break;
    }
  } catch (error) {
    console.log(error);
  }
}





async function goals(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: `⬅️ В меню`, callback_data: `page` },
            { text: `Отметить ✅`, callback_data: `page` },
          ],
          [
            { text: `Добавить`, callback_data: `add_goal` },
          ],
          [
            { text: `Удалить`, callback_data: `delete_goal` }
          ],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `done_goal` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}





async function notes(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои заметки, ${dataAboutUser.login} ⚡</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: `+ Добавить +`, callback_data: `add_goal` },
          ],
          [
            { text: `- Удалить -`, callback_data: `delete_goal` }
          ],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}




async function achivs(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: `+ Добавить +`, callback_data: `add_goal` },
          ],
          [
            { text: `- Удалить -`, callback_data: `delete_goal` }
          ],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}





async function sleep(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твой график сна, ${dataAboutUser.login} ✨</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: `+ Добавить +`, callback_data: `add_goal` },
          ],
          [
            { text: `- Удалить -`, callback_data: `delete_goal` }
          ],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}





async function streaks(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои победные серии, ${dataAboutUser.login} 🔥</b>\n\n`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: `+ Добавить +`, callback_data: `add_goal` },
          ],
          [
            { text: `- Удалить -`, callback_data: `delete_goal` }
          ],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `done_goal` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}





async function StartAll() {
  try {
    bot.on(`message`, async (message) => {
      let text = message.text;
      let chatId = message.chat.id;
      let usermessage = message.message_id;

      if (!usersData.find((obj) => obj.chatId == chatId)) {
        usersData.push({
          chatId: chatId,
          login: message.from.first_name,
          TelegramUsername: message.from.first_name,
          messageId: null,
          action: null,
          loginOver: false,
        });
      }

      switch (text) {
        case `/start`:
          first(chatId);
          break;
        case `/restart`:
          menu(chatId, 3);
          break;
        case `/start showNav`:
          menu(chatId, 2);
          break;
        case `/start hideNav`:
          menu(chatId);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
      }

      const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

      if (dataAboutUser.action == `who` && Array.from(text)[0] != "/") {
        dataAboutUser.login = text;
        loginOver(chatId);
        menu(chatId);
      }

      bot.deleteMessage(chatId, usermessage);
      console.log(message);
    });
  } catch (error) {}


  try {
    bot.on(`callback_query`, async (query) => {
      let chatId = query.message.chat.id;
      let data = query.data;

      switch (data) {
        case `menu`:
          menu(chatId);
          break;
        case `goals`:
          goals(chatId);
          break;
        case `notes`:
          notes(chatId);
          break;
        case `achivs`:
          achivs(chatId);
          break;
        case `sleep`:
          sleep(chatId);
          break;
        case `streaks`:
          streaks(chatId);
          break;
        case `next`:
          first(chatId, 3);
          break;
        case `back`:
          first(chatId, 2);
          break;
        case `leavename`:
          loginOver(chatId);
          menu(chatId);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
      }
    });
  } catch (error) {}
}

StartAll();