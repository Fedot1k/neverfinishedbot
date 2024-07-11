import TelegramBot from "node-telegram-bot-api";

const TOKEN = `7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w`;
const bot = new TelegramBot(TOKEN, { polling: true });
const BotName = `neverfinishedbot`;

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
              inline_keyboard: [[{ text: `Далее➡️`, callback_data: `next` }]],
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
            inline_keyboard: [[{ text: `Далее➡️`, callback_data: `next` }]],
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
                  callback_data: `leavename`,
                },
              ],
              [{ text: `⬅️Назад`, callback_data: `back` }],
            ],
          },
        });
        dataAboutUser.action = `set_login`;
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
        });
        dataAboutUser.action = `menu`;
        break;
      case 3:
        if (dataAboutUser.loginOver) {
          await bot
            .sendMessage(chatId, `<b>${hello_text}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`, {
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
            })
            .then((message) => {
              dataAboutUser.messageId = message.message_id;
              dataAboutUser.action = `menu`;
            });
        }
        break;
      case 4:
        await bot.editMessageText(`<b>Привет, ${dataAboutUser.login}! 🤘</b>\n\nСпасибо за регистрацию!\nТебя встречает меню <i><b>neverfinished!</b></i>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`, {
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
        });
        dataAboutUser.action = `menu`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function goals(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let show_text = ``;

  for (let i = 1; i <= dataAboutUser.goals_data.goals_title_list.length; i++) {
    show_text += `${dataAboutUser.goals_data.goals_num == i ? `\n\n${dataAboutUser.goals_data.goals_marked[i - 1] == 1 ? `<s>${i}. ${dataAboutUser.goals_data.goals_title_list[i - 1]}</s>` : `• ${i}. ${dataAboutUser.goals_data.goals_title_list[i - 1]} •`}\n<blockquote>${dataAboutUser.goals_data.goals_text_list[i - 1]}</blockquote>` : `\n\n${dataAboutUser.goals_data.goals_marked[i - 1] == 1 ? `<s>${i}. ${dataAboutUser.goals_data.goals_title_list[i - 1]}</s>` : `${i}. ${dataAboutUser.goals_data.goals_title_list[i - 1]}`}`}`;
  }

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>${show_text}\n\n<a href="https://t.me/${BotName}/?start=markDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `back_page_goal` },
                { text: `• №  ${dataAboutUser.goals_data.goals_num}•`, callback_data: `cur_page_goals` },
                { text: `🔽`, callback_data: `next_page_goal` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `add_goal` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals`;
        break;
      case 2:
        await bot.editMessageText(`Цель: <b>${dataAboutUser.goals_data.goals_num}. 🏔\n\n• ${dataAboutUser.goals_data.goals_title_list[dataAboutUser.goals_data.goals_num - 1]} •</b>\n<blockquote>${dataAboutUser.goals_data.goals_text_list[dataAboutUser.goals_data.goals_num - 1]}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=markDone">Отметить текущий</a>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `edit_goal` },
                { text: `Удалить`, callback_data: `delete_goal` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `back_to_goals` }],
            ],
          },
        });
        dataAboutUser.action = `about_goal`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите <u>название цели</u> 👀\n\nПример:</b> Побывать в Японии 🌸`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_goals` }]],
          },
        });
        dataAboutUser.action = `add_goal_title`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите <u>описание цели</u> 👀\n\nПример:</b> Изучить Кунг-Фу ⛩️`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_goals_after` }]],
          },
        });
        dataAboutUser.action = `add_goal_text`;
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
                { text: `⬅️ Назад`, callback_data: `back_to_cur_goal` },
                { text: `Не менять ✅`, callback_data: `dont_change_title` },
              ],
            ],
          },
        });
        dataAboutUser.action = `edit_goal_title`;
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
                { text: `⬅️ Назад`, callback_data: `back_to_cur_goal` },
                { text: `Не менять ✅`, callback_data: `dont_change_text` },
              ],
            ],
          },
        });
        dataAboutUser.action = `edit_goal_text`;
        break;
      case 7:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>\n\n<blockquote>We dont want to tell our dreams. We want to show them.</blockquote> ~ Cristiano Ronaldo 🇵🇹`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `add_goal` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function notes(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let show_text = `\n`;

  for (let i = 1; i <= dataAboutUser.notes_data.notes_title_list.length; i++) {
    show_text += `${dataAboutUser.notes_data.notes_num == i ? `\n• ${i}. ${dataAboutUser.notes_data.notes_title_list[i - 1]} •\n<blockquote>${dataAboutUser.notes_data.notes_text_list[i - 1]}</blockquote>` : `\n${i}. ${dataAboutUser.notes_data.notes_title_list[i - 1]}`}`;
  }

  show_text += `\n\n<a href="https://t.me/${BotName}/?start=markDone">Отметить текущий</a>`;

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои заметки, ${dataAboutUser.login} ⚡</b>${show_text}`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `back_page_note` },
                { text: `• №  ${dataAboutUser.notes_data.notes_num}•`, callback_data: `cur_page_notes` },
                { text: `🔽`, callback_data: `next_page_note` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `add_note` },
              ],
            ],
          },
        });
        dataAboutUser.action = `notes`;
        break;
      case 2:
        await bot.editMessageText(`Заметка<b> •№ ${dataAboutUser.notes_data.notes_num}• ⚡</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `edit_note` },
                { text: `Удалить`, callback_data: `delete_note` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `back_to_notes` }],
            ],
          },
        });
        dataAboutUser.action = `about_note`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите название заметки</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_notes` }]],
          },
        });
        dataAboutUser.action = `add_note_title`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите описание заметки</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_notes` }]],
          },
        });
        dataAboutUser.action = `add_note_text`;
        break;
      case 5:
        await bot.editMessageText(`<b>Введите новое название заметки</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_cur_note` }]],
          },
        });
        dataAboutUser.action = `edit_note_title`;
        break;
      case 6:
        await bot.editMessageText(`<b>Введите новое описание заметки</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_cur_note` }]],
          },
        });
        dataAboutUser.action = `edit_note_text`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function achivs(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let show_text = `\n`;

  for (let i = 1; i <= dataAboutUser.achivs_data.achivs_title_list.length; i++) {
    show_text += `${dataAboutUser.achivs_data.achivs_num == i ? `\n• ${i}. ${dataAboutUser.achivs_data.achivs_title_list[i - 1]} •\n<blockquote>${dataAboutUser.achivs_data.achivs_text_list[i - 1]}</blockquote>` : `\n${i}. ${dataAboutUser.achivs_data.achivs_title_list[i - 1]}`}`;
  }

  show_text += `\n\n<a href="https://t.me/${BotName}/?start=markDone">Отметить текущий</a>`;

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>${show_text}`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `back_page_achiv` },
                { text: `• №  ${dataAboutUser.achivs_data.achivs_num}•`, callback_data: `cur_page_achivs` },
                { text: `🔽`, callback_data: `next_page_achiv` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `add_achiv` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivs`;
        break;
      case 2:
        await bot.editMessageText(`Достижение<b> •№ ${dataAboutUser.achivs_data.achivs_num}• 🎖️</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `edit_achiv` },
                { text: `Удалить`, callback_data: `delete_achiv` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `back_to_achivs` }],
            ],
          },
        });
        dataAboutUser.action = `about_achiv`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите название достижения</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_achivs` }]],
          },
        });
        dataAboutUser.action = `add_achiv_title`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите описание достижения</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_achivs` }]],
          },
        });
        dataAboutUser.action = `add_achiv_text`;
        break;
      case 5:
        await bot.editMessageText(`<b>Введите новое название достижения</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_cur_achiv` }]],
          },
        });
        dataAboutUser.action = `edit_achiv_title`;
        break;
      case 6:
        await bot.editMessageText(`<b>Введите новое описание достижения</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_cur_achiv` }]],
          },
        });
        dataAboutUser.action = `edit_achiv_text`;
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
        await bot.editMessageText(`<b>Твой график сна, ${dataAboutUser.login} ✨</b>\n\nВремя засыпания: <b>${dataAboutUser.sleep_data.sleep_at}</b>\nВремя подъема: <b>${dataAboutUser.sleep_data.wake_at}</b>\n\nКоличество сна: <b>${dataAboutUser.sleep_data.sleep_duration} 😴</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: `Изменить график ⌚`, callback_data: `edit_sleep` }],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Советы ⁉️`, callback_data: `sleep_tips` },
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
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_sleep` }]],
          },
        });
        dataAboutUser.action = `sleep_sleep_at`;
        break;
      case 3:
        await bot.editMessageText(`<b>Во сколько ты просыпаешься? 🤔</b>\n\nПример: <code>6:30</code>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_sleep` }]],
          },
        });
        dataAboutUser.action = `sleep_wake_at`;
        break;
      case 4:
        await bot.editMessageText(sleep_tips_text, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_sleep` }]],
          },
        });
        dataAboutUser.action = `sleep`;
        break;
      case 5:
        if (!/[a-z]/i.test(time) && time.includes(":")) {
          time = time.replace(/\s/g, "");
          let parse = time.split(":");

          if (parse[1].length === 2 && Number(parse[0]) >= 0 && Number(parse[0]) <= 23 && Number(parse[1]) >= 0 && Number(parse[1]) <= 59) {
            dataAboutUser.sleep_data.sleep_at = parse[0] + ":" + parse[1];

            if (dataAboutUser.sleep_data.wake_at != `-`) {
              let h1 = Number(dataAboutUser.sleep_data.sleep_at.split(":")[0]);
              let m1 = Number(dataAboutUser.sleep_data.sleep_at.split(":")[1]);
              let h2 = Number(dataAboutUser.sleep_data.wake_at.split(":")[0]);
              let m2 = Number(dataAboutUser.sleep_data.wake_at.split(":")[1]);

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

              dataAboutUser.sleep_data.sleep_duration = `${(dur - (dur % 60)) / 60}:${dur % 60 < 10 ? `0` : ``}${dur % 60}`;
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
            dataAboutUser.sleep_data.wake_at = parse[0] + ":" + parse[1];

            let h1 = Number(dataAboutUser.sleep_data.sleep_at.split(":")[0]);
            let m1 = Number(dataAboutUser.sleep_data.sleep_at.split(":")[1]);
            let h2 = Number(dataAboutUser.sleep_data.wake_at.split(":")[0]);
            let m2 = Number(dataAboutUser.sleep_data.wake_at.split(":")[1]);

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

            dataAboutUser.sleep_data.sleep_duration = `${(dur - (dur % 60)) / 60}:${dur % 60 < 10 ? `0` : ``}${dur % 60}`;

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
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_sleep` }]],
          },
        });
        dataAboutUser.action = `sleep_sleep_at`;
        break;
      case 8:
        await bot.editMessageText(`<b>Во сколько ты просыпаешься? 🤔</b>\n\nПример: <code>6:30</code>\n\n<b>Неверный формат 🫤</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_sleep` }]],
          },
        });
        dataAboutUser.action = `sleep_wake_at`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

async function streaks(chatId, stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  let show_text = `\n`;

  for (let i = 1; i <= dataAboutUser.streaks_data.streaks_title_list.length; i++) {
    show_text += `${dataAboutUser.streaks_data.streaks_num == i ? `\n• ${i}. ${dataAboutUser.streaks_data.streaks_title_list[i - 1]} •\n<blockquote>${dataAboutUser.streaks_data.streak_duration[i - 1]}</blockquote>` : `\n${i}. ${dataAboutUser.streaks_data.streaks_title_list[i - 1]}`}`;
  }

  show_text += `\n\n<a href="https://t.me/${BotName}/?start=markDone">Отметить текущий</a>`;

  try {
    switch (stage) {
      case 1:
        await bot.editMessageText(`<b>Твои Серии, ${dataAboutUser.login} 🔥</b>${show_text}`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `🔼`, callback_data: `back_page_streak` },
                { text: `• №  ${dataAboutUser.streaks_data.streaks_num}•`, callback_data: `cur_page_streaks` },
                { text: `🔽`, callback_data: `next_page_streak` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Добавить`, callback_data: `add_streak` },
              ],
            ],
          },
        });
        dataAboutUser.action = `streaks`;
        break;
      case 2:
        await bot.editMessageText(`Серия<b> •№ ${dataAboutUser.streaks_data.streaks_num}• 🔥</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить`, callback_data: `edit_streak` },
                { text: `Удалить`, callback_data: `delete_streak` },
              ],
              [{ text: `⬅️ Назад`, callback_data: `back_to_streaks` }],
            ],
          },
        });
        dataAboutUser.action = `about_streak`;
        break;
      case 3:
        await bot.editMessageText(`<b>Введите название серии</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_streaks` }]],
          },
        });
        dataAboutUser.action = `add_streak_title`;
        break;
      case 4:
        await bot.editMessageText(`<b>Введите новое название серии</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `back_to_cur_streak` }]],
          },
        });
        dataAboutUser.action = `edit_streak_title`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

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

          goals_data: { goals_title_list: [], goals_text_list: [], goals_marked: [], goals_num: 1 },

          notes_data: { notes_title_list: [], notes_text_list: [], notes_marked: [], notes_num: 1 },

          achivs_data: { achivs_title_list: [], achivs_text_list: [], achivs_marked: [], achivs_num: 1 },

          streaks_data: { streaks_title_list: [], streaks_duration: [], streaks_marked: [], streaks_num: 1 },

          sleep_data: { sleep_duration: 0, sleep_at: `-`, wake_at: `-` },
        });
      }

      const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

      switch (text) {
        case `/start`:
          first(chatId);
          break;
        case `/restart`:
          menu(chatId, 3);
          break;
        case `/start showNav`:
          menu(chatId, 1, true);
          break;
        case `/start hideNav`:
          menu(chatId);
          break;
        case `/start markDone`:
          `${dataAboutUser.goals_data.goals_marked[dataAboutUser.goals_data.goals_num - 1] == 1 ? dataAboutUser.goals_data.goals_marked[dataAboutUser.goals_data.goals_num - 1] = 0 : dataAboutUser.goals_data.goals_marked[dataAboutUser.goals_data.goals_num - 1] = 1}`;
          goals(chatId);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
      }

      if (dataAboutUser.action == `set_login` && Array.from(text)[0] != "/") {
        dataAboutUser.login = text;
        dataAboutUser.loginOver = true;
        menu(chatId, 4);
      } else if (dataAboutUser.action == `sleep_sleep_at`) {
        sleep(chatId, 5, text);
      } else if (dataAboutUser.action == `sleep_wake_at`) {
        sleep(chatId, 6, text);
      } else if (dataAboutUser.action == `add_goal_title`) {
        dataAboutUser.goals_data.goals_title_list.push(text);
        dataAboutUser.goals_data.goals_marked.push(0);
        goals(chatId, 4);
      } else if (dataAboutUser.action == `add_goal_text`) {
        dataAboutUser.goals_data.goals_text_list.push(text);
        `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
      } else if (dataAboutUser.action == `edit_goal_title`) {
        dataAboutUser.goals_data.goals_title_list[dataAboutUser.goals_data.goals_num - 1] = text;
        goals(chatId, 6);
      } else if (dataAboutUser.action == `edit_goal_text`) {
        dataAboutUser.goals_data.goals_text_list[dataAboutUser.goals_data.goals_num - 1] = text;
        goals(chatId, 2);
      } else if (dataAboutUser.action == `add_note_title`) {
        dataAboutUser.notes_data.notes_title_list.push(text);
        notes(chatId, 4);
      } else if (dataAboutUser.action == `add_note_text`) {
        dataAboutUser.notes_data.notes_text_list.push(text);
        notes(chatId);
      } else if (dataAboutUser.action == `edit_note_title`) {
        dataAboutUser.notes_data.notes_title_list[dataAboutUser.notes_data.notes_num - 1] = text;
        notes(chatId, 6);
      } else if (dataAboutUser.action == `edit_note_text`) {
        dataAboutUser.notes_data.notes_text_list[dataAboutUser.notes_data.notes_num - 1] = text;
        notes(chatId, 2);
      } else if (dataAboutUser.action == `add_achiv_title`) {
        dataAboutUser.achivs_data.achivs_title_list.push(text);
        achivs(chatId, 4);
      } else if (dataAboutUser.action == `add_achiv_text`) {
        dataAboutUser.achivs_data.achivs_text_list.push(text);
        achivs(chatId);
      } else if (dataAboutUser.action == `edit_achiv_title`) {
        dataAboutUser.achivs_data.achivs_title_list[dataAboutUser.achivs_data.achivs_num - 1] = text;
        achivs(chatId, 6);
      } else if (dataAboutUser.action == `edit_achiv_text`) {
        dataAboutUser.achivs_data.achivs_text_list[dataAboutUser.achivs_data.achivs_num - 1] = text;
        achivs(chatId, 2);
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
        ////////////////////////////////

        case `menu`:
          menu(chatId);
          break;
        case `goals`:
          `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
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
          dataAboutUser.login = dataAboutUser.TelegramUsername;
          dataAboutUser.loginOver = true;
          menu(chatId, 4);
          break;

        ////////////////////////////////

        case `back_to_goals_after`:
          dataAboutUser.goals_data.goals_text_list.push(`без описания`);
          `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
          break;
        case `cur_page_goals`:
          `${dataAboutUser.goals_data.goals_title_list.length != 0 ? goals(chatId, 2) : 0}`;
          break;
        case `add_goal`:
          goals(chatId, 3);
          break;
        case `delete_goal`:
          dataAboutUser.goals_data.goals_title_list.splice(dataAboutUser.goals_data.goals_num - 1, 1);
          dataAboutUser.goals_data.goals_text_list.splice(dataAboutUser.goals_data.goals_num - 1, 1);
          dataAboutUser.goals_data.goals_marked.splice(dataAboutUser.goals_data.goals_num - 1, 1);
          `${dataAboutUser.goals_data.goals_num == dataAboutUser.goals_data.goals_title_list.length + 1 && dataAboutUser.goals_data.goals_num != 1 ? (dataAboutUser.goals_data.goals_num -= 1) : (dataAboutUser.goals_data.goals_num += 0)}`;
          `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
          break;
        case `edit_goal`:
          goals(chatId, 5);
          break;
        case `next_page_goal`:
          if (dataAboutUser.goals_data.goals_num == dataAboutUser.goals_data.goals_title_list.length) {
            dataAboutUser.goals_data.goals_num = 1;
          } else if (dataAboutUser.goals_data.goals_num < dataAboutUser.goals_data.goals_title_list.length) {
            dataAboutUser.goals_data.goals_num += 1;
          }
          `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
          break;
        case `back_page_goal`:
          if (dataAboutUser.goals_data.goals_num > 1) {
            dataAboutUser.goals_data.goals_num -= 1;
          } else if (dataAboutUser.goals_data.goals_num == 1 && dataAboutUser.goals_data.goals_title_list.length != 0) {
            dataAboutUser.goals_data.goals_num = dataAboutUser.goals_data.goals_title_list.length;
          }
          `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
          break;
        case `back_to_cur_goal`:
          goals(chatId, 2);
          break;
        case `back_to_goals`:
          `${dataAboutUser.goals_data.goals_title_list.length >= 1 ? goals(chatId) : goals(chatId, 7)}`;
          break;
        case `dont_change_title`:
          goals(chatId, 6);
          break;
        case `dont_change_text`:
          goals(chatId, 2);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;

        ////////////////////////////////

        case `edit_sleep`:
          sleep(chatId, 2);
          break;
        case `back_to_sleep`:
          sleep(chatId, 1);
          break;
        case `sleep_tips`:
          sleep(chatId, 4);
          break;
        case ``:
          break;
        case ``:
          break;

        ////////////////////////////////

        case `back_to_notes`:
          notes(chatId, 1);
          break;
        case `cur_page_notes`:
          `${dataAboutUser.notes_data.notes_title_list.length != 0 ? notes(chatId, 2) : 0}`;
          break;
        case `add_note`:
          notes(chatId, 3);
          break;
        case `delete_note`:
          dataAboutUser.notes_data.notes_title_list.splice(dataAboutUser.notes_data.notes_num - 1, 1);
          dataAboutUser.notes_data.notes_text_list.splice(dataAboutUser.notes_data.notes_num - 1, 1);
          notes(chatId, 1);
          break;
        case `edit_note`:
          notes(chatId, 5);
          break;
        case `next_page_note`:
          if (dataAboutUser.notes_data.notes_num == dataAboutUser.notes_data.notes_title_list.length) {
            dataAboutUser.notes_data.notes_num = 1;
          } else if (dataAboutUser.notes_data.notes_num < dataAboutUser.notes_data.notes_title_list.length) {
            dataAboutUser.notes_data.notes_num += 1;
          }
          notes(chatId, 1);
          break;
        case `back_page_note`:
          if (dataAboutUser.notes_data.notes_num == 1) {
            dataAboutUser.notes_data.notes_num = dataAboutUser.notes_data.notes_title_list.length;
          } else if (dataAboutUser.notes_data.notes_num > 1) {
            dataAboutUser.notes_data.notes_num -= 1;
          }
          notes(chatId, 1);
          break;
        case `back_to_cur_note`:
          notes(chatId, 2);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;

        ////////////////////////////////

        case `back_to_achivs`:
          achivs(chatId, 1);
          break;
        case `cur_page_achivs`:
          `${dataAboutUser.achivs_data.achivs_title_list.length != 0 ? achivs(chatId, 2) : 0}`;
          break;
        case `add_achiv`:
          achivs(chatId, 3);
          break;
        case `delete_achiv`:
          dataAboutUser.achivs_data.achivs_title_list.splice(dataAboutUser.achivs_data.achivs_num - 1, 1);
          dataAboutUser.achivs_data.achivs_text_list.splice(dataAboutUser.achivs_data.achivs_num - 1, 1);
          achivs(chatId, 1);
          break;
        case `edit_achiv`:
          achivs(chatId, 5);
          break;
        case `next_page_achiv`:
          if (dataAboutUser.achivs_data.achivs_num == dataAboutUser.achivs_data.achivs_title_list.length) {
            dataAboutUser.achivs_data.achivs_num = 1;
          } else if (dataAboutUser.achivs_data.achivs_num < dataAboutUser.achivs_data.achivs_title_list.length) {
            dataAboutUser.achivs_data.achivs_num += 1;
          }
          achivs(chatId, 1);
          break;
        case `back_page_achiv`:
          if (dataAboutUser.achivs_data.achivs_num == 1 && dataAboutUser.achivs_data.achivs_title_list.length != 0) {
            dataAboutUser.achivs_data.achivs_num = dataAboutUser.achivs_data.achivs_title_list.length;
          } else if (dataAboutUser.achivs_data.achivs_num > 1) {
            dataAboutUser.achivs_data.achivs_num -= 1;
          }
          achivs(chatId, 1);
          break;
        case `back_to_cur_achiv`:
          achivs(chatId, 2);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;

        ////////////////////////////////

        case `back_to_achivs`:
          achivs(chatId, 1);
          break;
        case `cur_page_achivs`:
          `${dataAboutUser.achivs_data.achivs_title_list.length != 0 ? achivs(chatId, 2) : 0}`;
          break;
        case `add_achiv`:
          achivs(chatId, 3);
          break;
        case `delete_achiv`:
          dataAboutUser.achivs_data.achivs_title_list.splice(dataAboutUser.achivs_data.achivs_num - 1, 1);
          dataAboutUser.achivs_data.achivs_text_list.splice(dataAboutUser.achivs_data.achivs_num - 1, 1);
          achivs(chatId, 1);
          break;
        case `edit_achiv`:
          achivs(chatId, 5);
          break;
        case `next_page_achiv`:
          if (dataAboutUser.achivs_data.achivs_num == dataAboutUser.achivs_data.achivs_title_list.length) {
            dataAboutUser.achivs_data.achivs_num = 1;
          } else if (dataAboutUser.achivs_data.achivs_num < dataAboutUser.achivs_data.achivs_title_list.length) {
            dataAboutUser.achivs_data.achivs_num += 1;
          }
          achivs(chatId, 1);
          break;
        case `back_page_achiv`:
          if (dataAboutUser.achivs_data.achivs_num == 1 && dataAboutUser.achivs_data.achivs_title_list.length != 0) {
            dataAboutUser.achivs_data.achivs_num = dataAboutUser.achivs_data.achivs_title_list.length;
          } else if (dataAboutUser.achivs_data.achivs_num > 1) {
            dataAboutUser.achivs_data.achivs_num -= 1;
          }
          achivs(chatId, 1);
          break;
        case `back_to_cur_achiv`:
          achivs(chatId, 2);
          break;
        case ``:
          break;
        case ``:
          break;
        case ``:
          break;
      }
    } catch (error) {}
  });
}

StartAll();
