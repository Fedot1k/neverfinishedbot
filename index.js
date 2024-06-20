import TelegramBot from "node-telegram-bot-api";

const TOKEN = `7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w`;
const bot = new TelegramBot(TOKEN, { polling: true });
const fedotId = 870204479;

let usersData = [];

bot.setMyCommands([
  // {
  //   command: `/restart`,
  //   description: `Перезапуск 🔄️`,
  // },
]);

async function first(chatId, messageId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    if (!dataAboutUser.ableback) {
      await bot
        .sendMessage(
          chatId,
          `<b>👋 Добро пожаловать</b> в мир целеустремленности и эффективности с <b><i>neverfinished!</i></b>\n\n<b>•  Трекинг прогресса 💯</b>\nВеди учет своих амбициозных <b><i>целей</i></b> и великих <b><i>достижений!</i></b>\n\n<b>•  Составление ежедневных планов ⚡</b>\nВыполняй свои <b><i>задачи на день</i></b>, не забывая про <b><i>собственные принципы!</i></b>\n\n<b>•  Отчет по личным рекордам 🔥</b>\nПрокачивай <b><i>дисциплину</i></b>, сохраняя победные серии над <b><i>самим собой!</i></b>\n\n<b>•  Отслеживание графика сна ✨</b>\nУлучшай свой <b><i>режим сна</i></b> и проводи день <b><i>энергичнее!</i></b>\n\n<b>💪 Начни сейчас и достигни своих целей вместе с <i>neverfinished!</i></b>`,
          {
            parse_mode: `HTML`,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `Далее➡️`, callback_data: `next` }]],
            },
          }
        )
        .then((message) => {
          dataAboutUser.messageId = message.message_id;
          dataAboutUser.ableback = true;
        });
    } else if (dataAboutUser.ableback) {
      await bot.editMessageText(
        `<b>👋 Добро пожаловать</b> в мир целеустремленности и эффективности с <b><i>neverfinished!</i></b>\n\n<b>•  Трекинг прогресса 💯</b>\nВеди учет своих амбициозных <b><i>целей</i></b> и великих <b><i>достижений!</i></b>\n\n<b>•  Составление ежедневных планов ⚡</b>\nВыполняй свои <b><i>задачи на день</i></b>, не забывая про <b><i>собственные принципы!</i></b>\n\n<b>•  Отчет по личным рекордам 🔥</b>\nПрокачивай <b><i>дисциплину</i></b>, сохраняя победные серии над <b><i>самим собой!</i></b>\n\n<b>•  Отслеживание графика сна ✨</b>\nУлучшай свой <b><i>режим сна</i></b> и проводи день <b><i>энергичнее!</i></b>\n\n<b>💪 Начни сейчас и достигни своих целей вместе с <i>neverfinished!</i></b>`,
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
    }
  } catch (error) {
    console.log(error);
  }
}

async function second(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(
      `<b>Как пожелаете к вам обращаться в будущем? 🤔</b>\n\n<b><i>(Изменяется в настройках)</i></b>\n\n<i><b>*neverfinished</b> несет ответственность за конфиденциальность ваших данных 🤫</i>`,
      {
        parse_mode: `HTML`,
        chat_id: chatId,
        message_id: dataAboutUser.messageId,
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Оставить ${dataAboutUser.username}✅`,
                callback_data: `leavename`,
              },
            ],
            [{ text: `⬅️Назад`, callback_data: `back` }],
          ],
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function menuNav(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(
      `<b>Привет, ${dataAboutUser.username} 💯</b>\n\n<b>Какой план на сегодняdddddddddd?</b>\n\n<a href="https://t.me/neverfinishedbot/?start=hideNav">Навигация по меню ⇧</a>`,
      {
        parse_mode: `html`,
        chat_id: chatId,
        message_id: dataAboutUser.messageId,
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              { text: `Цели 🏔`, callback_data: `goal` },
              { text: `Задачи ⚡`, callback_data: `todo` },
            ],
            [{ text: `Достижения 🎖️`, callback_data: `achievement` }],
            [
              { text: `Сон ✨`, callback_data: `sleep` },
              { text: `Серии 🔥`, callback_data: `streak` },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function menu(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(
      `<b>Привет, ${dataAboutUser.username} 💯</b>\n\n<b>Какой план на сегодня? </b>\n\n<a href="https://t.me/neverfinishedbot/?start=showNav">Навигация по меню ⇨</a>`,
      {
        parse_mode: `html`,
        chat_id: chatId,
        message_id: dataAboutUser.messageId,
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              { text: `Цели 🏔`, callback_data: `goal` },
              { text: `Задачи ⚡`, callback_data: `todo` },
            ],
            [{ text: `Достижения 🎖️`, callback_data: `achievement` }],
            [
              { text: `Сон ✨`, callback_data: `sleep` },
              { text: `Серии 🔥`, callback_data: `streak` },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function todo(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои задачи на сегодня</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `- Добавить задачу -`, callback_data: `add_goal` }],
          [{ text: `- Удалить задачу -`, callback_data: `delete_goal` }],
          [{ text: `- Изменить дату -`, callback_data: `add_time` }],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `goal_done` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function goal(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои цели 🦾</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `- Добавить цель -`, callback_data: `add_goal` }],
          [{ text: `- Удалить цель -`, callback_data: `delete_goal` }],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `goal_done` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function achievement(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои цели 🦾</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `- Добавить цель -`, callback_data: `add_goal` }],
          [{ text: `- Удалить цель -`, callback_data: `delete_goal` }],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `goal_done` },
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
    await bot.editMessageText(`<b>Твои цели 🦾</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `- Добавить цель -`, callback_data: `add_goal` }],
          [{ text: `- Удалить цель -`, callback_data: `delete_goal` }],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `goal_done` },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function streak(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    await bot.editMessageText(`<b>Твои цели 🦾</b>`, {
      parse_mode: `html`,
      chat_id: chatId,
      message_id: dataAboutUser.messageId,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `- Добавить цель -`, callback_data: `add_goal` }],
          [{ text: `- Удалить цель -`, callback_data: `delete_goal` }],
          [
            { text: `⬅️ В меню`, callback_data: `menu` },
            { text: `Отметить ✅`, callback_data: `goal_done` },
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
      let messageId = message.message_id;

      usersData = [];

      const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

      if (!dataAboutUser) {
        usersData.push({
          chatId: chatId,
          username: message.from.first_name,
          messageId: ``,
          ableback: false,
        });
      }

      switch (text) {
        case `/start`: // TODO: remove user on start
          first(chatId);
          break;
        // case `/start showNav`: // TODO: add restart
        //   menu(chatId);
        //   break;
        // case `/start hideNav`:
        //   menu(chatId);
        //   break;
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
      bot.deleteMessage(chatId, messageId);
      console.log(message);
    });
  } catch (error) {}

  try {
    bot.on(`callback_query`, async (query) => {
      let chatId = query.message.chat.id;
      let data = query.data;

      switch (data) {
        case `next`:
          second(chatId);
          break;
        case `menu`:
          menu(chatId);
          break;
        case `todo`:
          todo(chatId);
          break;
        case `goal`:
          goal(chatId);
          break;
        case `achievement`:
          achievement(chatId);
          break;
        case `sleep`:
          sleep(chatId);
          break;
        case `streak`:
          streak(chatId);
          break;
        case `back`:
          first(chatId);
          break;
        case `leavename`:
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
