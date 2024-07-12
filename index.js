import TelegramBot from "node-telegram-bot-api";

const BotName = `neverfinishedbot`;
const TOKEN = `7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w`;
const bot = new TelegramBot(TOKEN, { polling: true });

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

let sleep_tips_text = `<b>Основные советы для правильного режима 💤</b>\n\nПеред сном:<blockquote><b>• Отключите телефон 👀</b>\nВоздействие синего света нарушает работу ритмов сна\n\n<b>• Составьте план на день 📚</b>\nЭто поможет избавиться от лишних мыслей и лучше отдохнуть\n\n<b>• Соблюдайте темноту 🌙</b>\nСоздание оптимальных условий способствует хорошему сну</blockquote>\n\nПосле сна:<blockquote><b>• Выпейте воды 💧</b>\nЭто восполнит водный баланс вашего тела\n\n<b>• Избегайте соц. сетей 💻</b>\nЭто может нарушить ваш утренний ритм\n\n<b>• Сделайте зарядку 🧘</b>\nФизическая активность пробуждает организм и делает вас энергичнее</blockquote>`;

async function first(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (stage) {
      case 1:
        await bot
          .sendMessage(chatId, first_text, {
            parse_mode: `HTML`,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `Далее➡️`, callback_data: `introNext` }]],
            },
          })
          .then((message) => {
            dataAboutUser.messageId = message.message_id;
            dataAboutUser.action = `intro`;
          });
        break;
      case 2:
        await bot.editMessageText(first_text, {
          parse_mode: `HTML`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `Далее➡️`, callback_data: `introNext` }]],
          },
        });
        dataAboutUser.action = `intro`;
        break;
      case 3:
        await bot.editMessageText(second_text, {
          parse_mode: `HTML`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Оставить ${dataAboutUser.TelegramUsername} ✅`,
                  callback_data: `leaveName`,
                },
              ],
              [{ text: `⬅️Назад`, callback_data: `introBack` }],
            ],
          },
        });
        dataAboutUser.action = `setLogin`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function menu(chatId, stage = 1, navActive = false) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  const current_time = new Date().getHours();
  let hello_text = `Добрый день`;

  if (current_time >= 5 && current_time <= 10) {
    hello_text = `Доброе утро`;
  } else if (current_time >= 11 && current_time <= 16) {
    hello_text = `Добрый день`;
  } else if (current_time >= 17 && current_time <= 22) {
    hello_text = `Добрый вечер`;
  } else if (current_time > 22 || current_time < 5) {
    hello_text = `Доброй ночи`;
  }

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>${hello_text}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n${navActive ? `<blockquote>${navtext}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=hideNav">Навигация по меню ⇧</a>` : `<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`}`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Цели 🏔`, callback_data: `goal` },
                { text: `Заметки ⚡`, callback_data: `note` },
              ],
              [{ text: `Достижения 🎖️`, callback_data: `achiv` }],
              [
                { text: `Сон ✨`, callback_data: `sleep` },
                { text: `Серии 🔥`, callback_data: `streak` },
              ],
            ],
          },
        });
        dataAboutUser.action = `menu`;
        break;
      case 2:
        if (dataAboutUser.loginOver) {
          await bot
            .sendMessage(chatId, `<b>${hello_text}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`, {
              parse_mode: `HTML`,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `Цели 🏔`, callback_data: `goal` },
                    { text: `Заметки ⚡`, callback_data: `note` },
                  ],
                  [{ text: `Достижения 🎖️`, callback_data: `achiv` }],
                  [
                    { text: `Сон ✨`, callback_data: `sleep` },
                    { text: `Серии 🔥`, callback_data: `streak` },
                  ],
                ],
              },
            })
            .then((message) => {
              dataAboutUser.messageId = message.message_id;
              dataAboutUser.action = `menu`;
            });
        }
        break;
      case 3:
        await bot.editMessageText(`<b>Привет, ${dataAboutUser.login}! 🤘</b>\n\nСпасибо за регистрацию!\nТебя встречает меню <i><b>neverfinished!</b></i>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Цели 🏔`, callback_data: `goal` },
                { text: `Заметки ⚡`, callback_data: `note` },
              ],
              [{ text: `Достижения 🎖️`, callback_data: `achiv` }],
              [
                { text: `Сон ✨`, callback_data: `sleep` },
                { text: `Серии 🔥`, callback_data: `streak` },
              ],
            ],
          },
        });
        dataAboutUser.action = `menu`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function goal(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let showText = ``;

  for (let i = 1; i <= dataAboutUser.goalData.title.length; i++) {
    showText += `${dataAboutUser.supportiveCount == i ? `\n\n${dataAboutUser.goalData.marker[i - 1] == 1 ? `• <s>${i}. ${dataAboutUser.goalData.title[i - 1]}</s> •` : `• ${i}. ${dataAboutUser.goalData.title[i - 1]} •`}\n<blockquote>${dataAboutUser.goalData.text[i - 1]}</blockquote>` : `\n\n${dataAboutUser.goalData.marker[i - 1] == 1 ? `<s>${i}. ${dataAboutUser.goalData.title[i - 1]}</s>` : `${i}. ${dataAboutUser.goalData.title[i - 1]}`}`}`;
  }

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>${showText}\n\n<a href="https://t.me/${BotName}/?start=goalMarkDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `goalPageBack` },
                { text: `• №  ${dataAboutUser.supportiveCount}•`, callback_data: `goalCur` },
                { text: `🔽`, callback_data: `goalPageNext` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `goalAdd` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goal`;
        break;
      case 2:
        await bot.editMessageText(`Цель: <b>${dataAboutUser.supportiveCount}. 🏔\n\n${dataAboutUser.goalData.marker[dataAboutUser.supportiveCount - 1] == 1 ? `• <s>${dataAboutUser.goalData.title[dataAboutUser.supportiveCount - 1]}</s> •` : `• ${dataAboutUser.goalData.title[dataAboutUser.supportiveCount - 1]} •`}</b>\n<blockquote>${dataAboutUser.goalData.text[dataAboutUser.supportiveCount - 1]}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=goalMarkDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `goalEdit` },
                { text: `Удалить`, callback_data: `goalDelete` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `goalBack` }],
            ],
          },
        });
        dataAboutUser.action = `goalAbout`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите <u>название цели</u> 👀\n\nПример:</b> Побывать в Японии 🌸`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `goalBack` }]],
          },
        });
        dataAboutUser.action = `goalAddTitle`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите <u>описание цели</u> 👀\n\nПример:</b> Изучить Кунг-Фу ⛩️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `goalBackProtect` }]],
          },
        });
        dataAboutUser.action = `goalAddText`;
        break;
      case 5:
        await bot.editMessageText(`<b>Введите <u>новое название цели</u> 👀\n\nПример:</b> Посетить концерт Cactus Jack 🌵`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `goalBackCur` },
                { text: `Не менять ✅`, callback_data: `goalNotEditTitle` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goalEditTitle`;
        break;
      case 6:
        await bot.editMessageText(`<b>Введите <u>новое описание цели</u> 👀\n\nПример:</b> Сделать фото с Тревисом 🪐`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `goalBackCur` },
                { text: `Не менять ✅`, callback_data: `goalNotEditText` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goalEditText`;
        break;
      case 7:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>\n\n<blockquote>Dreams are not what you see in your sleep. They are the things that dont let you sleep.</blockquote> ~ Cristiano Ronaldo 🇵🇹`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `goalAdd` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goal`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function note(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let showText = ``;

  for (let i = 1; i <= dataAboutUser.noteData.title.length; i++) {
    showText += `${dataAboutUser.supportiveCount == i ? `\n\n${dataAboutUser.noteData.marker[i - 1] == 1 ? `• <s>${i}. ${dataAboutUser.noteData.title[i - 1]}</s> •` : `• ${i}. ${dataAboutUser.noteData.title[i - 1]} •`}\n<blockquote>${dataAboutUser.noteData.text[i - 1]}</blockquote>` : `\n\n${dataAboutUser.noteData.marker[i - 1] == 1 ? `<s>${i}. ${dataAboutUser.noteData.title[i - 1]}</s>` : `${i}. ${dataAboutUser.noteData.title[i - 1]}`}`}`;
  }

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои заметки, ${dataAboutUser.login} ⚡</b>${showText}\n\n<a href="https://t.me/${BotName}/?start=noteMarkDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `notePageBack` },
                { text: `• №  ${dataAboutUser.supportiveCount}•`, callback_data: `noteCur` },
                { text: `🔽`, callback_data: `notePageNext` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `noteAdd` },
              ],
            ],
          },
        });
        dataAboutUser.action = `note`;
        break;
      case 2:
        await bot.editMessageText(`Заметка: <b>${dataAboutUser.supportiveCount}. ⚡\n\n${dataAboutUser.noteData.marker[dataAboutUser.supportiveCount - 1] == 1 ? `• <s>${dataAboutUser.noteData.title[dataAboutUser.supportiveCount - 1]}</s> •` : `• ${dataAboutUser.noteData.title[dataAboutUser.supportiveCount - 1]} •`}</b>\n<blockquote>${dataAboutUser.noteData.text[dataAboutUser.supportiveCount - 1]}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=noteMarkDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `noteEdit` },
                { text: `Удалить`, callback_data: `noteDelete` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `noteBack` }],
            ],
          },
        });
        dataAboutUser.action = `noteAbout`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите <u>название заметки</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `noteBack` }]],
          },
        });
        dataAboutUser.action = `noteAddTitle`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите <u>описание заметки</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `noteBackProtect` }]],
          },
        });
        dataAboutUser.action = `noteAddText`;
        break;
      case 5:
        await bot.editMessageText(`<b>Введите <u>новое название заметки</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `noteBackCur` },
                { text: `Не менять ✅`, callback_data: `noteNotEditTitle` },
              ],
            ],
          },
        });
        dataAboutUser.action = `noteEditTitle`;
        break;
      case 6:
        await bot.editMessageText(`<b>Введите <u>новое описание заметки</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `noteBackCur` },
                { text: `Не менять ✅`, callback_data: `noteNotEditText` },
              ],
            ],
          },
        });
        dataAboutUser.action = `noteEditText`;
        break;
      case 7:
        await bot.editMessageText(`<b>Твои заметки, ${dataAboutUser.login} ⚡</b>\n\n<blockquote>Dont let small obstacles get in the way of being victorious. Remember you are stronger than the challenges you face.</blockquote> ~ Cristiano Ronaldo 🇵🇹`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `noteAdd` },
              ],
            ],
          },
        });
        dataAboutUser.action = `note`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function achiv(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let showText = ``;

  for (let i = 1; i <= dataAboutUser.achivData.title.length; i++) {
    showText += `${dataAboutUser.supportiveCount == i ? `\n\n${dataAboutUser.achivData.marker[i - 1] == 1 ? `• <u>${i}. ${dataAboutUser.achivData.title[i - 1]}</u> •` : `• ${i}. ${dataAboutUser.achivData.title[i - 1]} •`}\n<blockquote>${dataAboutUser.achivData.text[i - 1]}</blockquote>` : `\n\n${dataAboutUser.achivData.marker[i - 1] == 1 ? `<s>${i}. ${dataAboutUser.achivData.title[i - 1]}</s>` : `${i}. ${dataAboutUser.achivData.title[i - 1]}`}`}`;
  }

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>${showText}\n\n<a href="https://t.me/${BotName}/?start=achivMarkDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `achivPageBack` },
                { text: `• №  ${dataAboutUser.supportiveCount}•`, callback_data: `achivCur` },
                { text: `🔽`, callback_data: `achivPageNext` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `achivAdd` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achiv`;
        break;
      case 2:
        await bot.editMessageText(`Достижение: <b>${dataAboutUser.supportiveCount}. 🎖️\n\n${dataAboutUser.achivData.marker[dataAboutUser.supportiveCount - 1] == 1 ? `• <u>${dataAboutUser.achivData.title[dataAboutUser.supportiveCount - 1]}</u> •` : `• ${dataAboutUser.achivData.title[dataAboutUser.supportiveCount - 1]} •`}</b>\n<blockquote>${dataAboutUser.achivData.text[dataAboutUser.supportiveCount - 1]}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=achivMarkDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `achivEdit` },
                { text: `Удалить`, callback_data: `achivDelete` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `achivBack` }],
            ],
          },
        });
        dataAboutUser.action = `achivAbout`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите <u>название достижения</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `achivBack` }]],
          },
        });
        dataAboutUser.action = `achivAddTitle`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите <u>описание достижения</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `achivBackProtect` }]],
          },
        });
        dataAboutUser.action = `achivAddText`;
        break;
      case 5:
        await bot.editMessageText(`<b>Введите <u>новое название достижения</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `achivBackCur` },
                { text: `Не менять ✅`, callback_data: `achivNotEditTitle` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivEditTitle`;
        break;
      case 6:
        await bot.editMessageText(`<b>Введите <u>новое описание достижения</u> 👀\n\nПример:</b> Пока нет ⚙️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `achivBackCur` },
                { text: `Не менять ✅`, callback_data: `achivNotEditText` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivEditText`;
        break;
      case 7:
        await bot.editMessageText(`<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>\n\n<blockquote>I dont follow records. Records follow me.</blockquote> ~ Cristiano Ronaldo 🇵🇹`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `achivAdd` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achiv`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function sleep(chatId, stage = 1, time = null) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твой график сна, ${dataAboutUser.login} ✨</b>\n\nВремя засыпания: <b>${dataAboutUser.sleepData.sleepAt}</b>\nВремя подъема: <b>${dataAboutUser.sleepData.wakeAt}</b>\n\nКоличество сна: <b>${dataAboutUser.sleepData.dur} 😴</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: `Изменить график ⌚`, callback_data: `sleepEdit` }],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Советы ⁉️`, callback_data: `sleepTips` },
              ],
            ],
          },
        });
        dataAboutUser.action = `sleep`;
        break;
      case 2:
        await bot.editMessageText(`<b>Во сколько ты идешь спать? 🤔</b>\n\nПример: <code>22:30</code>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleepBack` }]],
          },
        });
        dataAboutUser.action = `addSleepAt`;
        break;
      case 3:
        await bot.editMessageText(`<b>Во сколько ты просыпаешься? 🤔</b>\n\nПример: <code>6:30</code>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleepBack` }]],
          },
        });
        dataAboutUser.action = `addWakeAt`;
        break;
      case 4:
        await bot.editMessageText(sleep_tips_text, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleepBack` }]],
          },
        });
        dataAboutUser.action = `sleep`;
        break;
      case 5:
        if (!/[a-z]/i.test(time) && time.includes(":")) {
          time = time.replace(/\s/g, "");
          let parse = time.split(":");

          if (parse[1].length === 2 && Number(parse[0]) >= 0 && Number(parse[0]) <= 23 && Number(parse[1]) >= 0 && Number(parse[1]) <= 59) {
            dataAboutUser.sleepData.sleepAt = parse[0] + ":" + parse[1];

            if (dataAboutUser.sleepData.wakeAt != `-`) {
              let h1 = Number(dataAboutUser.sleepData.sleepAt.split(":")[0]);
              let m1 = Number(dataAboutUser.sleepData.sleepAt.split(":")[1]);
              let h2 = Number(dataAboutUser.sleepData.wakeAt.split(":")[0]);
              let m2 = Number(dataAboutUser.sleepData.wakeAt.split(":")[1]);

              let dur = 0;

              if (h1 > h2) {
                dur = 1440 - h1 * 60 - m1 + (h2 * 60 + m2);
              } else if (h1 < h2) {
                dur = h2 * 60 + m2 - (h1 * 60 + m1);
              } else if (h1 == h2 && m1 < m2) {
                dur = m2 - m1;
              } else if (h1 == h2 && m1 > m2) {
                dur = 1440 - h1 * 60 - m1 + (h2 * 60 + m2);
              }

              dataAboutUser.sleepData.dur = `${(dur - (dur % 60)) / 60}:${dur % 60 < 10 ? `0` : ``}${dur % 60}`;
            }

            sleep(chatId, 3);
          } else {
            sleep(chatId, 7);
          }
        } else {
          sleep(chatId, 7);
        }
        break;
      case 6:
        if (!/[a-z]/i.test(time) && time.includes(":")) {
          time = time.replace(/\s/g, "");
          let parse = time.split(":");

          if (parse[1].length === 2 && Number(parse[0]) >= 0 && Number(parse[0]) <= 23 && Number(parse[1]) >= 0 && Number(parse[1]) <= 59) {
            dataAboutUser.sleepData.wakeAt = parse[0] + ":" + parse[1];

            let h1 = Number(dataAboutUser.sleepData.sleepAt.split(":")[0]);
            let m1 = Number(dataAboutUser.sleepData.sleepAt.split(":")[1]);
            let h2 = Number(dataAboutUser.sleepData.wakeAt.split(":")[0]);
            let m2 = Number(dataAboutUser.sleepData.wakeAt.split(":")[1]);

            let dur = 0;

            if (h1 > h2) {
              dur = 1440 - h1 * 60 - m1 + (h2 * 60 + m2);
            } else if (h1 < h2) {
              dur = h2 * 60 + m2 - (h1 * 60 + m1);
            } else if (h1 == h2 && m1 < m2) {
              dur = m2 - m1;
            } else if (h1 == h2 && m1 > m2) {
              dur = 1440 - h1 * 60 - m1 + (h2 * 60 + m2);
            }

            dataAboutUser.sleepData.dur = `${(dur - (dur % 60)) / 60}:${dur % 60 < 10 ? `0` : ``}${dur % 60}`;

            sleep(chatId);
          } else {
            sleep(chatId, 8);
          }
        } else {
          sleep(chatId, 8);
        }
        break;
      case 7:
        await bot.editMessageText(`<b>Во сколько ты идешь спать? 🤔</b>\n\nПример: <code>22:30</code>\n\n<b>Неверный формат 🫤</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleepBack` }]],
          },
        });
        dataAboutUser.action = `addSleepAt`;
        break;
      case 8:
        await bot.editMessageText(`<b>Во сколько ты просыпаешься? 🤔</b>\n\nПример: <code>6:30</code>\n\n<b>Неверный формат 🫤</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleepBack` }]],
          },
        });
        dataAboutUser.action = `addWakeAt`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function streak(chatId, stage = 1) {}

async function StartAll() {
  bot.on(`message`, async (message) => {
    let text = message.text;
    let chatId = message.chat.id;
    let usermessage = message.message_id;

    try {
      if (!usersData.find((obj) => obj.chatId == chatId)) {
        usersData.push({
          chatId: chatId,
          login: null,
          TelegramUsername: message.from.first_name,
          messageId: null,
          action: null,
          loginOver: false,
          supportiveCount: 1,

          goalData: { title: [], text: [], marker: [] },

          noteData: { title: [], text: [], marker: [] },

          achivData: { title: [], text: [], marker: [] },

          streakData: { title: [], dur: [], marker: [], record: [] },

          sleepData: { dur: 0, sleepAt: `-`, wakeAt: `-` },
        });
      }

      const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

      switch (text) {
        case `/start`:
          first(chatId);
          break;
        case `/restart`:
          menu(chatId, 2);
          break;
        case `/start showNav`:
          menu(chatId, 1, true);
          break;
        case `/start hideNav`:
          menu(chatId);
          break;
        case `/start goalMarkDone`:
          dataAboutUser.goalData.marker[dataAboutUser.supportiveCount - 1] = 1 - dataAboutUser.goalData.marker[dataAboutUser.supportiveCount - 1];
          goal(chatId);
          break;
        case `/start noteMarkDone`:
          dataAboutUser.noteData.marker[dataAboutUser.supportiveCount - 1] = 1 - dataAboutUser.noteData.marker[dataAboutUser.supportiveCount - 1];
          note(chatId);
          break;
        case `/start achivMarkDone`:
          dataAboutUser.achivData.marker[dataAboutUser.supportiveCount - 1] = 1 - dataAboutUser.achivData.marker[dataAboutUser.supportiveCount - 1];
          achiv(chatId);
          break;
      }

      if (dataAboutUser.action == `setLogin` && Array.from(text)[0] != "/") {
        dataAboutUser.login = text;
        dataAboutUser.loginOver = true;
        menu(chatId, 3);
      } else if (dataAboutUser.action == `addSleepAt`) {
        sleep(chatId, 5, text);
      } else if (dataAboutUser.action == `addWakeAt`) {
        sleep(chatId, 6, text);
      } else if (dataAboutUser.action == `goalAddTitle`) {
        dataAboutUser.goalData.title.push(text);
        dataAboutUser.goalData.marker.push(0);
        goal(chatId, 4);
      } else if (dataAboutUser.action == `goalAddText`) {
        dataAboutUser.goalData.text.push(text);
        `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
      } else if (dataAboutUser.action == `goalEditTitle`) {
        dataAboutUser.goalData.title[dataAboutUser.supportiveCount - 1] = text;
        goal(chatId, 6);
      } else if (dataAboutUser.action == `goalEditText`) {
        dataAboutUser.goalData.text[dataAboutUser.supportiveCount - 1] = text;
        goal(chatId, 2);
      } else if (dataAboutUser.action == `noteAddTitle`) {
        dataAboutUser.noteData.title.push(text);
        dataAboutUser.noteData.marker.push(0);
        note(chatId, 4);
      } else if (dataAboutUser.action == `noteAddText`) {
        dataAboutUser.noteData.text.push(text);
        `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
      } else if (dataAboutUser.action == `noteEditTitle`) {
        dataAboutUser.noteData.title[dataAboutUser.supportiveCount - 1] = text;
        note(chatId, 6);
      } else if (dataAboutUser.action == `noteEditText`) {
        dataAboutUser.noteData.text[dataAboutUser.supportiveCount - 1] = text;
        note(chatId, 2);
      } else if (dataAboutUser.action == `achivAddTitle`) {
        dataAboutUser.achivData.title.push(text);
        dataAboutUser.achivData.marker.push(0);
        achiv(chatId, 4);
      } else if (dataAboutUser.action == `achivAddText`) {
        dataAboutUser.achivData.text.push(text);
        `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
      } else if (dataAboutUser.action == `achivEditTitle`) {
        dataAboutUser.achivData.title[dataAboutUser.supportiveCount - 1] = text;
        achiv(chatId, 6);
      } else if (dataAboutUser.action == `achivEditText`) {
        dataAboutUser.achivData.text[dataAboutUser.supportiveCount - 1] = text;
        achiv(chatId, 2);
      }

      bot.deleteMessage(chatId, usermessage);
    } catch (error) {}
  });

  bot.on(`callback_query`, async (query) => {
    let chatId = query.message.chat.id;
    let data = query.data;

    const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

    try {
      switch (data) {
        // Menu And Introduction

        case `menu`:
          menu(chatId);
          break;
        case `introNext`:
          first(chatId, 3);
          break;
        case `introBack`:
          first(chatId, 2);
          break;
        case `leaveName`:
          dataAboutUser.login = dataAboutUser.TelegramUsername;
          dataAboutUser.loginOver = true;
          menu(chatId, 3);
          break;

        // Head Buttons

        case `goal`:
          dataAboutUser.supportiveCount = 1;
          `${dataAboutUser.goalData.title.length >= 1 ? dataAboutUser.supportiveCount == 1 : dataAboutUser.supportiveCount == 0}`;
          `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
          break;
        case `note`:
          dataAboutUser.supportiveCount = 1;
          `${dataAboutUser.noteData.title.length >= 1 ? dataAboutUser.supportiveCount == 1 : dataAboutUser.supportiveCount == 0}`;
          `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
          break;
        case `achiv`:
          dataAboutUser.supportiveCount = 1;
          `${dataAboutUser.achivData.title.length >= 1 ? dataAboutUser.supportiveCount == 1 : dataAboutUser.supportiveCount == 0}`;
          `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
          break;
        case `streak`:
          dataAboutUser.supportiveCount = 1;
          `${dataAboutUser.streakData.title.length >= 1 ? dataAboutUser.supportiveCount == 1 : dataAboutUser.supportiveCount == 0}`;
          `${dataAboutUser.streakData.title.length >= 1 ? streak(chatId) : streak(chatId, 7)}`;
          break;
        case `sleep`:
          sleep(chatId);
          break;

        // Goal Button

        case `goalBackProtect`:
          dataAboutUser.goalData.text.push(`без описания`);
          `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
          break;
        case `goalCur`:
          `${dataAboutUser.goalData.title.length != 0 ? goal(chatId, 2) : 0}`;
          break;
        case `goalAdd`:
          goal(chatId, 3);
          break;
        case `goalDelete`:
          dataAboutUser.goalData.title.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.goalData.text.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.goalData.marker.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount == dataAboutUser.goalData.title.length + 1 && dataAboutUser.supportiveCount != 1 ? (dataAboutUser.supportiveCount -= 1) : 0}`;
          `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
          break;
        case `goalEdit`:
          goal(chatId, 5);
          break;
        case `goalPageNext`:
          if (dataAboutUser.supportiveCount == dataAboutUser.goalData.title.length) {
            dataAboutUser.supportiveCount = 1;
          } else if (dataAboutUser.supportiveCount < dataAboutUser.goalData.title.length) {
            dataAboutUser.supportiveCount += 1;
          }
          `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
          break;
        case `goalPageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (dataAboutUser.supportiveCount == 1 && dataAboutUser.goalData.title.length != 0) {
            dataAboutUser.supportiveCount = dataAboutUser.goalData.title.length;
          }
          `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
          break;
        case `goalBackCur`:
          goal(chatId, 2);
          break;
        case `goalBack`:
          `${dataAboutUser.goalData.title.length >= 1 ? goal(chatId) : goal(chatId, 7)}`;
          break;
        case `goalNotEditTitle`:
          goal(chatId, 6);
          break;
        case `goalNotEditText`:
          goal(chatId, 2);
          break;

        // Note Button

        case `noteBackProtect`:
          dataAboutUser.noteData.text.push(`без описания`);
          `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
          break;
        case `noteCur`:
          `${dataAboutUser.noteData.title.length != 0 ? note(chatId, 2) : 0}`;
          break;
        case `noteAdd`:
          note(chatId, 3);
          break;
        case `noteDelete`:
          dataAboutUser.noteData.title.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.noteData.text.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.noteData.marker.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount == dataAboutUser.noteData.title.length + 1 && dataAboutUser.supportiveCount != 1 ? (dataAboutUser.supportiveCount -= 1) : 0}`;
          `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
          break;
        case `noteEdit`:
          note(chatId, 5);
          break;
        case `notePageNext`:
          if (dataAboutUser.supportiveCount == dataAboutUser.noteData.title.length) {
            dataAboutUser.supportiveCount = 1;
          } else if (dataAboutUser.supportiveCount < dataAboutUser.noteData.title.length) {
            dataAboutUser.supportiveCount += 1;
          }
          `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
          break;
        case `notePageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (dataAboutUser.supportiveCount == 1 && dataAboutUser.noteData.title.length != 0) {
            dataAboutUser.supportiveCount = dataAboutUser.noteData.title.length;
          }
          `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
          break;
        case `noteBackCur`:
          note(chatId, 2);
          break;
        case `noteBack`:
          `${dataAboutUser.noteData.title.length >= 1 ? note(chatId) : note(chatId, 7)}`;
          break;
        case `noteNotEditTitle`:
          note(chatId, 6);
          break;
        case `noteNotEditText`:
          note(chatId, 2);
          break;

        // Achiv Button

        case `achivBackProtect`:
          dataAboutUser.achivData.text.push(`без описания`);
          `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
          break;
        case `achivCur`:
          `${dataAboutUser.achivData.title.length != 0 ? achiv(chatId, 2) : 0}`;
          break;
        case `achivAdd`:
          achiv(chatId, 3);
          break;
        case `achivDelete`:
          dataAboutUser.achivData.title.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.achivData.text.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.achivData.marker.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount == dataAboutUser.achivData.title.length + 1 && dataAboutUser.supportiveCount != 1 ? (dataAboutUser.supportiveCount -= 1) : 0}`;
          `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
          break;
        case `achivEdit`:
          achiv(chatId, 5);
          break;
        case `achivPageNext`:
          if (dataAboutUser.supportiveCount == dataAboutUser.achivData.title.length) {
            dataAboutUser.supportiveCount = 1;
          } else if (dataAboutUser.supportiveCount < dataAboutUser.achivData.title.length) {
            dataAboutUser.supportiveCount += 1;
          }
          `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
          break;
        case `achivPageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (dataAboutUser.supportiveCount == 1 && dataAboutUser.achivData.title.length != 0) {
            dataAboutUser.supportiveCount = dataAboutUser.achivData.title.length;
          }
          `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
          break;
        case `achivBackCur`:
          achiv(chatId, 2);
          break;
        case `achivBack`:
          `${dataAboutUser.achivData.title.length >= 1 ? achiv(chatId) : achiv(chatId, 7)}`;
          break;
        case `achivNotEditTitle`:
          achiv(chatId, 6);
          break;
        case `achivNotEditText`:
          achiv(chatId, 2);
          break;

        // Streak Button

        case `streakBackProtect`:
          dataAboutUser.streakData.text.push(`без описания`);
          `${dataAboutUser.streakData.title.length >= 1 ? streak(chatId) : streak(chatId, 7)}`;
          break;
        case `streakCur`:
          `${dataAboutUser.streakData.title.length != 0 ? streak(chatId, 2) : 0}`;
          break;
        case `streakAdd`:
          streak(chatId, 3);
          break;
        case `streakDelete`:
          dataAboutUser.streakData.title.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.streakData.text.splice(dataAboutUser.supportiveCount - 1, 1);
          dataAboutUser.streakData.marker.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount == dataAboutUser.streakData.title.length + 1 && dataAboutUser.supportiveCount != 1 ? (dataAboutUser.supportiveCount -= 1) : 0}`;
          `${dataAboutUser.streakData.title.length >= 1 ? streak(chatId) : streak(chatId, 7)}`;
          break;
        case `streakEdit`:
          streak(chatId, 5);
          break;
        case `pageNext`:
          if (dataAboutUser.supportiveCount == dataAboutUser.streakData.title.length) {
            dataAboutUser.supportiveCount = 1;
          } else if (dataAboutUser.supportiveCount < dataAboutUser.streakData.title.length) {
            dataAboutUser.supportiveCount += 1;
          }
          `${dataAboutUser.streakData.title.length >= 1 ? streak(chatId) : streak(chatId, 7)}`;
          break;
        case `pageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (dataAboutUser.supportiveCount == 1 && dataAboutUser.streakData.title.length != 0) {
            dataAboutUser.supportiveCount = dataAboutUser.streakData.title.length;
          }
          `${dataAboutUser.streakData.title.length >= 1 ? streak(chatId) : streak(chatId, 7)}`;
          break;
        case `streakBackCur`:
          streak(chatId, 2);
          break;
        case `streakBack`:
          `${dataAboutUser.streakData.title.length >= 1 ? streak(chatId) : streak(chatId, 7)}`;
          break;
        case `streakNotEditTitle`:
          streak(chatId, 6);
          break;
        case `streakNotEditText`:
          streak(chatId, 2);
          break;

        // Sleep Button

        case `sleepEdit`:
          sleep(chatId, 2);
          break;
        case `sleepBack`:
          sleep(chatId, 1);
          break;
        case `sleepTips`:
          sleep(chatId, 4);
          break;
      }
    } catch (error) {}
  });
}

StartAll();
