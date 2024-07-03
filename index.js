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

let sleep_tips_text = `<b>Основные советы для правильного режима 💤</b>\n\nПеред сном:<blockquote><b>• Отключите телефон 👀</b>\nВоздействие синего света нарушает работу ритмов сна\n\n<b>• Составьте план на день 📚</b>\nЭто поможет избавиться от лишних мыслей и лучше отдохнуть\n\n<b>• Соблюдайте темноту 🌙</b>\nСоздание оптимальных условий способствует хорошему сну</blockquote>\n\nПосле сна:<blockquote><b>• Выпейте воды 💧</b>\nЭто восполнит водный баланс вашего тела\n\n<b>• Избегайте соц. сетей 💻</b>\nЭто может нарушить ваш утренний ритм\n\n<b>• Сделайте зарядку 🧘</b>\nФизическая активность пробуждает организм и делает вас энергичнее</blockquote>`;





async function set_login(chatId) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
  dataAboutUser.login = dataAboutUser.TelegramUsername;
}





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
            dataAboutUser.action = `intro`;
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
        dataAboutUser.action = `intro`;
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
        dataAboutUser.action = `who`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}






async function menu(chatId, nav = 1) {
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
    switch (nav) {
      case 1:
        await bot.editMessageText(
          `<b>${hello_text}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`,
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
          `<b>${hello_text}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n<blockquote>${navtext}</blockquote>\n\n<a href="https://t.me/${BotName}/?start=hideNav">Навигация по меню ⇧</a>`,
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
              `<b>${hello_text}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`,
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
      case 4:
        await bot.editMessageText(
          `<b>Привет, ${dataAboutUser.login}! 🤘</b>\n\nСпасибо за регистрацию!\nТебя встречает меню <i><b>neverfinished!</b></i>\n\n<a href="https://t.me/${BotName}/?start=showNav">Навигация по меню ⇨</a>`,
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
    }
  } catch (error) {
    console.log(error);
  }
}





async function goals(chatId, goals_stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (goals_stage) {
      case 1:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `◀️`, callback_data: `back_page` },
                { text: `1 стр`, callback_data: `cur_page` },
                { text: `▶️`, callback_data: `next_page` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Редактировать ✍️`, callback_data: `edit_goals` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals`;
        break;
      case 2:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🏔</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `◀️`, callback_data: `back_page` },
                { text: `1 стр`, callback_data: `cur_page` },
                { text: `▶️`, callback_data: `next_page` },
              ],
              [
                { text: `Добавить`, callback_data: `add_goal` },
                { text: `Удалить`, callback_data: `delete_goal` },
                { text: `Изменить`, callback_data: `change_goal` },
              ],
              [
                { text: `⬅️ Назад`, callback_data: `back_to_goals` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals`;
        break;
      case 3:
        await bot.editMessageText(`<b>Запиши свою новую цель</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_goals` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals_add`;
        break;
      case 4:
        await bot.editMessageText(`<b>Какую цель ты хочешь удалить?</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_goals` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals_delete`;
        break;
      case 5:
        await bot.editMessageText(`<b>Какую цель ты хочешь изменить?</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_goals` },
              ],
            ],
          },
        });
        dataAboutUser.action = `goals_change`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}





async function notes(chatId, notes_stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (notes_stage) {
      case 1:
        await bot.editMessageText(`<b>Твои заметки, ${dataAboutUser.login} ⚡</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `◀️`, callback_data: `back_page` },
                { text: `1 стр`, callback_data: `cur_page` },
                { text: `▶️`, callback_data: `next_page` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Редактировать ✍️`, callback_data: `edit_notes` },
              ],
            ],
          },
        });
        dataAboutUser.action = `notes`;
        break;
      case 2:
        await bot.editMessageText(`<b>Твои заметки, ${dataAboutUser.login} ⚡</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `◀️`, callback_data: `back_page` },
                { text: `1 стр`, callback_data: `cur_page` },
                { text: `▶️`, callback_data: `next_page` },
              ],
              [
                { text: `Добавить`, callback_data: `add_note` },
                { text: `Удалить`, callback_data: `delete_note` },
                { text: `Изменить`, callback_data: `change_note` },
              ],
              [
                { text: `⬅️ Назад`, callback_data: `back_to_notes` },
              ],
            ],
          },
        });
        dataAboutUser.action = `notes`;
        break;
      case 3:
        await bot.editMessageText(`<b>Запиши свою новую заметку</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_notes` },
              ],
            ],
          },
        });
        dataAboutUser.action = `notes_add`;
        break;
      case 4:
        await bot.editMessageText(`<b>Какую заметку ты хочешь удалить?</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_notes` },
              ],
            ],
          },
        });
        dataAboutUser.action = `notes_delete`;
        break;
      case 5:
        await bot.editMessageText(`<b>Какую заметку ты хочешь изменить?</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_notes` },
              ],
            ],
          },
        });
        dataAboutUser.action = `notes_change`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}




async function achivs(chatId, achivs_stage = 1) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (achivs_stage) {
      case 1:
        await bot.editMessageText(`<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `◀️`, callback_data: `back_page` },
                { text: `1 стр`, callback_data: `cur_page` },
                { text: `▶️`, callback_data: `next_page` },
              ],
              [
                { text: `⬅️ В меню`, callback_data: `menu` },
                { text: `Редактировать ✍️`, callback_data: `edit_achivs` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivs`;
        break;
      case 2:
        await bot.editMessageText(`<b>Твои цели, ${dataAboutUser.login} 🎖️</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `◀️`, callback_data: `back_page` },
                { text: `1 стр`, callback_data: `cur_page` },
                { text: `▶️`, callback_data: `next_page` },
              ],
              [
                { text: `Добавить`, callback_data: `add_achiv` },
                { text: `Удалить`, callback_data: `delete_achiv` },
                { text: `Изменить`, callback_data: `change_achiv` },
              ],
              [
                { text: `⬅️ Назад`, callback_data: `back_to_achivs` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivs`;
        break;
      case 3:
        await bot.editMessageText(`<b>Запиши свое новое достижение</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_achivs` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivs_add`;
        break;
      case 4:
        await bot.editMessageText(`<b>Какое достижение ты хочешь удалить?</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_achivs` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivs_delete`;
        break;
      case 5:
        await bot.editMessageText(`<b>Какое достижение ты хочешь изменить?</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_edit_achivs` },
              ],
            ],
          },
        });
        dataAboutUser.action = `achivs_change`;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}





async function sleep(chatId, sleep_stage = 1, time = null) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let sleep_duration = 0;

  try {
    switch (sleep_stage) {
      case 1:
        await bot.editMessageText(`<b>Твой график сна, ${dataAboutUser.login} ✨</b>\n\nВремя засыпания: <b>${dataAboutUser.sleep_at}</b>\nВремя подъема: <b>${dataAboutUser.wake_at}</b>\n\nКоличество сна: <b>${sleep_duration} 😴</b>`, {
          parse_mode: `html`,
          chat_id: chatId,
          message_id: dataAboutUser.messageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `Изменить график ⌚`, callback_data: `edit_sleep` },
              ],
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
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_sleep` },
              ],
            ],
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
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_sleep` },
              ],
            ],
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
            inline_keyboard: [
              [
                { text: `⬅️ Назад`, callback_data: `back_to_sleep` },
              ],
            ],
          },
        });
        dataAboutUser.action = `sleep`;
        break;
      case 5:
        if (!/[a-z]/i.test(time) && time.includes(":")) {
          time = time.replace(/\s/g, '');
          let parse = time.split(":");

          if (parse[1].length === 2 && Number(parse[0]) >= 0 && Number(parse[0]) <= 23 && Number(parse[1]) >= 0 && Number(parse[1]) <= 59) {
            dataAboutUser.sleep_at = time;
            sleep(chatId, 3);
          }
        }
        break;
      case 6:
        if (!/[a-z]/i.test(time) && time.includes(":")) {
          time = time.replace(/\s/g, '');
          let parse = time.split(":");

          if (parse[1].length === 2 && Number(parse[0]) >= 0 && Number(parse[0]) <= 23 && Number(parse[1]) >= 0 && Number(parse[1]) <= 59) {
            dataAboutUser.wake_at = time;

            let h1 = Number(dataAboutUser.sleep_at.split(":")[0]);
            let h2 = Number(parse[0]);
            let m1 = Number(dataAboutUser.sleep_at.split(":")[1]);
            let m2 = Number(parse[1]);

            if (h1 > h2) {
              sleep_duration = (1440 - (h1 * 60) - m1) + ((h2 * 60) + m2);
            } else if (h1 < h2) {
              sleep_duration = ((h2 * 60) + m2) - ((h1 * 60) + m1);
            } else if (h1 == h2 && m1 < m2) {
              sleep_duration = m2 - m1;
            } else if (h1 == h2 && m1 > m2) {
              sleep_duration = (1440 - (h1 * 60) - m1) + ((h2 * 60) + m2);
            }
            console.log(sleep_duration);

            sleep(chatId);
          }
        }
        break;
    }
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
    dataAboutUser.action = `streaks`;
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
          login: null,
          TelegramUsername: message.from.first_name,
          messageId: null,
          action: null,
          loginOver: false,


          goals_list: [],

          notes_list: [],

          achivs_list: [],

          streaks_list: [],


          streaks_duration: [],
          sleep_at: `-`,
          wake_at: `-`,
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
        menu(chatId, 4);
      } else if (dataAboutUser.action == `sleep_sleep_at`) {
        sleep(chatId, 5, text);
      } else if (dataAboutUser.action == `sleep_wake_at`) {
        sleep(chatId, 6, text);
      }

      bot.deleteMessage(chatId, usermessage);
      console.log(message.chat.first_name);
      console.log(message.text);
    });
  } catch (error) {}


  try {
    bot.on(`callback_query`, async (query) => {
      let chatId = query.message.chat.id;
      let data = query.data;

      switch (data) {

        ////////////////////////////////

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
          set_login(chatId);
          menu(chatId, 4);
          break;
        
        ////////////////////////////////

        case `edit_goals`:
          goals(chatId, 2);
          break;
        case `back_to_goals`:
          goals(chatId, 1);
          break;
        case `back_to_edit_goals`:
          goals(chatId, 2);
          break;
        case `add_goal`:
          goals(chatId, 3);
          break;
        case `delete_goal`:
          goals(chatId, 4);
          break;
        case `change_goal`:
          goals(chatId, 5);
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
        
        ////////////////////////////////
        
        case `edit_notes`:
          notes(chatId, 2);
          break;
        case `back_to_notes`:
          notes(chatId, 1);
          break;
        case `back_to_edit_notes`:
          notes(chatId, 2);
          break;
        case `add_note`:
          notes(chatId, 3);
          break;
        case `delete_note`:
          notes(chatId, 4);
          break;
        case `change_note`:
          notes(chatId, 5);
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
        
        ////////////////////////////////
        
        case `edit_achivs`:
          achivs(chatId, 2);
          break;
        case `back_to_achivs`:
          achivs(chatId, 1);
          break;
        case `back_to_edit_achivs`:
          achivs(chatId, 2);
          break;
        case `add_achiv`:
          achivs(chatId, 3);
          break;
        case `delete_achiv`:
          achivs(chatId, 4);
          break;
        case `change_achiv`:
          achivs(chatId, 5);
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