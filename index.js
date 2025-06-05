import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import { config } from "./config.js";
import { textData, buttonData, errorData, databaseBackup } from "./watcher.js";

const bot = new TelegramBot(config.TOKEN.Trial, { polling: true });

const botName = { Trial: `trialdynamicsbot`, Never: `neverfinishedbot` }.Trial;

let usersData = [];

bot.setMyCommands([{ command: `/start`, description: `Перезапуск 🔄️` }]);

async function intro(chatId, type = `edit`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (type) {
      case `send`:
        await bot.sendMessage(chatId, `ㅤ`).then((message) => {
          dataAboutUser.botMessageId = message.message_id;
          intro(chatId);
        });
        break;
      case `edit`:
        dataAboutUser.userAction = `regular`;
        await bot.editMessageText(
          `<b>👋 Добро пожаловать</b> в мир дисциплины с <b><i>neverfinished!</i></b>\n\n<b>•  Трекинг прогресса 💯</b>\nВеди учет своих <b><i>целей и достижений!</i></b>\n\n<b>•  Личные рекорды 🔥</b>\nПрокачивай <b><i>дисциплину</i></b>, побеждая <b><i>самого себя!</i></b>\n\n<b>💪 Начни сейчас и достигни своих целей вместе с <i>neverfinished!</i></b>`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `Погнали ➡️`, callback_data: `introNext` }]],
            },
          }
        );
        break;
      case `greeting`:
        dataAboutUser.userAction = `getName`;
        await bot.editMessageText(
          `<b>Как мне к тебе обращаться? 🤔</b>\n\n<i>Не парься, можно будет поменять в любое время через меню команд 🤝</i>`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `Оставить ${dataAboutUser.login} ✅`,
                    callback_data: `keepName`,
                  },
                ],
                [{ text: `⬅️ Назад`, callback_data: `introBack` }],
              ],
            },
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function goal(chatId, type = `show`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let selected;

  if (dataAboutUser.goalData.length) {
    selected = dataAboutUser.goalData[dataAboutUser.supportiveCount - 1];
  }

  try {
    switch (type) {
      case `show`:
        dataAboutUser.userAction = `goal`;
        await bot.editMessageText(
          `<b>Твои цели, ${dataAboutUser.login} 🏔</b>\n\n${
            dataAboutUser.goalData.length != 0
              ? `${!selected.marker ? selected.title : `☑️ ${selected.title}`}`
              : `<blockquote><b>Мечты это не то, что вы видите во сне. Это то, что не дает вам уснуть</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `${dataAboutUser.goalData.length > 1 ? `🔼` : ``}`, callback_data: `goalBack` },
                  {
                    text: `${dataAboutUser.goalData.length != 0 ? `${dataAboutUser.supportiveCount}/${dataAboutUser.goalData.length}` : ``}`,
                    callback_data: `goalSelect`,
                  },
                  { text: `${dataAboutUser.goalData.length > 1 ? `🔽` : ``}`, callback_data: `goalNext` },
                ],
                [{ text: `Добавить ✍️`, callback_data: `goalAdd` }],
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `${dataAboutUser.goalData.length != 0 ? `Отметить${selected.marker ? ` ✅` : ``}` : ``}`, callback_data: `goalMark` },
                ],
              ],
            },
          }
        );
        break;
      case `add`:
        dataAboutUser.userAction = `goalAdding`;
        await bot.editMessageText(`<b>${dataAboutUser.goalData.length + 1}. Новая цель 🏔</b>\n\nВведи текст цели`, {
          parse_mode: `HTML`,
          chat_id: chatId,
          message_id: dataAboutUser.botMessageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `goal` }]],
          },
        });
        break;
      case `select`:
        dataAboutUser.userAction = `goalEditing`;
        await bot.editMessageText(
          `<b>${dataAboutUser.supportiveCount}. Цель 🏔</b>\n\n${
            !selected.marker ? selected.title : `☑️ ${selected.title}`
          }\n\nВведи новый текст цели, чтобы изменить`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `goal` },
                  { text: `Удалить 🗑`, callback_data: `goalDelete` },
                ],
              ],
            },
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function note(chatId, type = `show`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let selected;

  if (dataAboutUser.noteData.length) {
    selected = dataAboutUser.noteData[dataAboutUser.supportiveCount - 1];
  }

  try {
    switch (type) {
      case `show`:
        dataAboutUser.userAction = `note`;
        await bot.editMessageText(
          `<b>Твои заметки, ${dataAboutUser.login} ⚡️</b>\n\n${
            dataAboutUser.noteData.length != 0
              ? `${!selected.marker ? selected.title : `☑️ ${selected.title}`}`
              : `<blockquote><b>Не позволяйте препятствиям встать на пути к победе. Вы сильнее тех испытаний, с которыми сталкиваетесь</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `${dataAboutUser.noteData.length > 1 ? `🔼` : ``}`, callback_data: `noteBack` },
                  {
                    text: `${dataAboutUser.noteData.length != 0 ? `${dataAboutUser.supportiveCount}/${dataAboutUser.noteData.length}` : ``}`,
                    callback_data: `noteSelect`,
                  },
                  { text: `${dataAboutUser.noteData.length > 1 ? `🔽` : ``}`, callback_data: `noteNext` },
                ],
                [{ text: `Добавить ✍️`, callback_data: `noteAdd` }],
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `${dataAboutUser.noteData.length != 0 ? `Отметить${selected.marker ? ` ✅` : ``}` : ``}`, callback_data: `noteMark` },
                ],
              ],
            },
          }
        );
        break;
      case `add`:
        dataAboutUser.userAction = `noteAdding`;
        await bot.editMessageText(`<b>${dataAboutUser.noteData.length + 1}. Новая заметка ⚡️</b>\n\nВведи текст заметки`, {
          parse_mode: `HTML`,
          chat_id: chatId,
          message_id: dataAboutUser.botMessageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `note` }]],
          },
        });
        break;
      case `select`:
        dataAboutUser.userAction = `noteEditing`;
        await bot.editMessageText(
          `<b>${dataAboutUser.supportiveCount}. Заметка ⚡️</b>\n\n${
            !selected.marker ? selected.title : `☑️ ${selected.title}`
          }\n\nВведи новый текст заметки, чтобы изменить`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `note` },
                  { text: `Удалить 🗑`, callback_data: `noteDelete` },
                ],
              ],
            },
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function feat(chatId, type = `show`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let selected;

  if (dataAboutUser.featData.length) {
    selected = dataAboutUser.featData[dataAboutUser.supportiveCount - 1];
  }

  try {
    switch (type) {
      case `show`:
        dataAboutUser.userAction = `feat`;
        await bot.editMessageText(
          `<b>Твои достижения, ${dataAboutUser.login} 🎖</b>\n\n${
            dataAboutUser.featData.length != 0
              ? `${!selected.marker ? selected.title : `☑️ ${selected.title}`}`
              : `<blockquote><b>Я не бегу за рекордами. Рекорды бегут за мной</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `${dataAboutUser.featData.length > 1 ? `🔼` : ``}`, callback_data: `featBack` },
                  {
                    text: `${dataAboutUser.featData.length != 0 ? `${dataAboutUser.supportiveCount}/${dataAboutUser.featData.length}` : ``}`,
                    callback_data: `featSelect`,
                  },
                  { text: `${dataAboutUser.featData.length > 1 ? `🔽` : ``}`, callback_data: `featNext` },
                ],
                [{ text: `Добавить ✍️`, callback_data: `featAdd` }],
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `${dataAboutUser.featData.length != 0 ? `Отметить${selected.marker ? ` ✅` : ``}` : ``}`, callback_data: `featMark` },
                ],
              ],
            },
          }
        );
        break;
      case `add`:
        dataAboutUser.userAction = `featAdding`;
        await bot.editMessageText(`<b>${dataAboutUser.featData.length + 1}. Новое достижение 🎖</b>\n\nВведи текст достижения`, {
          parse_mode: `HTML`,
          chat_id: chatId,
          message_id: dataAboutUser.botMessageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `feat` }]],
          },
        });
        break;
      case `select`:
        dataAboutUser.userAction = `featEditing`;
        await bot.editMessageText(
          `<b>${dataAboutUser.supportiveCount}. Достижение 🎖</b>\n\n${
            !selected.marker ? selected.title : `☑️ ${selected.title}`
          }\n\nВведи новый текст достижения, чтобы изменить`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `feat` },
                  { text: `Удалить 🗑`, callback_data: `featDelete` },
                ],
              ],
            },
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function sleep(chatId, type = `show`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (type) {
      case `show`:
        dataAboutUser.userAction = `sleep`;
        await bot.editMessageText(
          `<b>Твой сон, ${dataAboutUser.login} ✨</b>\n\n${
            dataAboutUser.sleepData.length != 0
              ? `<b>💤 ${dataAboutUser.sleepData[0].join(`:`)}\n☀️ ${
                  dataAboutUser.sleepData.length == 2 ? `${dataAboutUser.sleepData[1].join(`:`)}` : `-`
                }</b>\n\n`
              : `<blockquote><b>Кому-то я нравлюсь, а кому-то нет. Я от этого бессонницей страдать не буду</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `${dataAboutUser.sleepData.length != 0 ? `Изменить ⌚️` : `Добавить ⌚️`}`, callback_data: `sleepAdd` }],
                [
                  { text: `❕Советы`, callback_data: `sleepTips` },
                  { text: `digfusion❔`, callback_data: `digfusion` },
                ],
                [{ text: `⬅️ В меню`, callback_data: `menu` }],
              ],
            },
          }
        );
        break;
      case `tips`:
        dataAboutUser.userAction = `regular`;
        await bot.editMessageText(
          `<b>Советы для правильного режима 💤\n\nПеред сном:</b>\n<blockquote><b>• Отключи телефон 👀</b>\nИзбавит от лишних мыслей</blockquote>\n<blockquote><b>• Соблюдай темноту 🌙</b>\nГораздо быстрее уснешь</blockquote>\n\n<b>После сна:</b>\n<blockquote><b>• Избегай экранов 💻</b>\nНельзя потерять фокус</blockquote>\n<blockquote><b>• Займись спортом 🧘</b>\nБудешь супер энергичным</blockquote>`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleep` }]],
            },
          }
        );
        break;
      case `digfusion`:
        dataAboutUser.userAction = `regular`;
        await bot.editMessageText(
          `<b><i>❔digfusion • О нас</i></b>\n\n<blockquote>Компания <b><i>digfusion</i></b> - <b>начинающий стартап,</b> разрабатывающий <b>свои приложения</b> и предоставляющий услуги по <b>созданию чат-ботов</b> различных типов!\n\nБыстро, надежно и с умом. Нам доверяют <b>известные личности,</b> и мы делаем продукт, который <b>цепляет и приносит результат</b>\n\n<i>Это приложение разработано <b>digfusion</b> с душой 🤍</i></blockquote>\n\n<b><a href="https://digfusion.ru/">Сайт</a> • <a href="https://t.me/digfusion">Новости</a> • <a href="https://t.me/digfeedbacks">Отзывы</a></b>`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleep` }]],
            },
          }
        );
        break;
      case `addStart`:
        dataAboutUser.userAction = `sleepAddStart`;
        await bot.editMessageText(
          `<b>Твой сон, ${dataAboutUser.login} ✨</b>\n\nВо сколько ты ложишься спать?${
            dataAboutUser.sleepData.length != 0 ? `\n\n<b>Сейчас:</b>\n<blockquote>${dataAboutUser.sleepData[0].join(`:`)}</blockquote>` : ``
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleep` }]],
            },
          }
        );
        break;
      case `addFinish`:
        dataAboutUser.userAction = `sleepAddFinish`;
        await bot.editMessageText(
          `<b>Твой сон, ${dataAboutUser.login} ✨</b>\n\nВо сколько ты просыпаешься?${
            dataAboutUser.sleepData.length == 2 ? `\n\n<b>Сейчас:</b>\n<blockquote>${dataAboutUser.sleepData[1].join(`:`)}</blockquote>` : ``
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `sleepAdd` }]],
            },
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function streak(chatId, type = `show`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let selected;

  if (dataAboutUser.streakData.length) {
    selected = dataAboutUser.streakData[dataAboutUser.supportiveCount - 1];
  }

  try {
    switch (type) {
      case `show`:
        dataAboutUser.userAction = `streak`;
        await bot.editMessageText(
          `<b>Твои серии, ${dataAboutUser.login} 🔥</b>\n\n${
            dataAboutUser.streakData.length != 0
              ? `${selected.title}\n<blockquote>Длительность: <b>${selected.duration}</b></blockquote>`
              : `<blockquote><b>Если ты хочешь добиться успеха, ты должен быть постоянным</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`
          }`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `${dataAboutUser.streakData.length > 1 ? `🔼` : ``}`, callback_data: `streakBack` },
                  {
                    text: `${dataAboutUser.streakData.length != 0 ? `${dataAboutUser.supportiveCount}/${dataAboutUser.streakData.length}` : ``}`,
                    callback_data: `streakSelect`,
                  },
                  { text: `${dataAboutUser.streakData.length > 1 ? `🔽` : ``}`, callback_data: `streakNext` },
                ],
                [{ text: `Добавить ✍️`, callback_data: `streakAdd` }],
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `${dataAboutUser.streakData.length != 0 ? `Отметить${selected.marker ? ` ✅` : ``}` : ``}`, callback_data: `streakMark` },
                ],
              ],
            },
          }
        );
        break;
      case `add`:
        dataAboutUser.userAction = `streakAdding`;
        await bot.editMessageText(`<b>${dataAboutUser.streakData.length + 1}. Новая серия 🔥</b>\n\nВведи название серии`, {
          parse_mode: `HTML`,
          chat_id: chatId,
          message_id: dataAboutUser.botMessageId,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: `⬅️ Назад`, callback_data: `streak` }]],
          },
        });
        break;
      case `select`:
        dataAboutUser.userAction = `streakEditing`;
        await bot.editMessageText(
          `<b>${dataAboutUser.supportiveCount}. Серия 🔥</b>\n\n${selected.title}\n<blockquote>Длительность: <b>${selected.duration}</b></blockquote>\n\nВведи новый заголовок серии, чтобы изменить`,
          {
            parse_mode: `HTML`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `Обнулить 😕`, callback_data: `streakZero` }],
                [
                  { text: `⬅️ Назад`, callback_data: `streak` },
                  { text: `Удалить 🗑`, callback_data: `streakDelete` },
                ],
              ],
            },
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function menu(chatId, type = `edit`, navigate = false) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  dataAboutUser.userAction = `regular`;

  const currentTime = new Date().getHours();
  let helloText = `Добрый день`;

  if (currentTime >= 5 && currentTime <= 8) {
    helloText = `Доброе утро`;
  } else if (currentTime >= 9 && currentTime <= 16) {
    helloText = `Добрый день`;
  } else if (currentTime >= 17 && currentTime <= 22) {
    helloText = `Добрый вечер`;
  } else if (currentTime >= 23 || currentTime <= 4) {
    helloText = `Доброй ночи`;
  }

  try {
    switch (type) {
      case `edit`:
        await bot.editMessageText(
          `<b>${helloText}, ${dataAboutUser.login}! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n${
            navigate
              ? `<blockquote><b>Цели 🏔</b> — список целей на будущее\n\n<b>Заметки ⚡</b> — хранилище мыслей и идей\n\n<b>Достижения 🎖️</b> — твои большие победы\n\n<b>Сон ✨</b> — режим и советы для лучшего сна\n\n<b>Серии 🔥</b> — раздел самодисциплины</blockquote>\n\n<a href="https://t.me/${botName}/?start=hideNav"><b>Навигация по меню ⇧</b></a>`
              : `<a href="https://t.me/${botName}/?start=showNav"><b>Навигация по меню ⇨</b></a>`
          }`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `Цели 🏔`, callback_data: `goal` },
                  { text: `Заметки ⚡`, callback_data: `note` },
                ],
                [{ text: `Достижения 🎖️`, callback_data: `feat` }],
                [
                  { text: `Сон ✨`, callback_data: `sleep` },
                  { text: `Серии 🔥`, callback_data: `streak` },
                ],
              ],
            },
          }
        );
        break;
      case `firstMeeting`:
        await bot.editMessageText(
          `<b>Привет, ${dataAboutUser.login}! 🤘</b>\n\nСпасибо за регистрацию!\nТебя встречает меню <i><b>neverfinished!</b></i>\n\n<a href="https://t.me/${botName}/?start=showNav"><b>Навигация по меню ⇨</b></a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
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
          }
        );
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function StartAll() {
  if (fs.readFileSync("DB.json") != "[]" && fs.readFileSync("DB.json") != "") {
    let dataFromDB = JSON.parse(fs.readFileSync("DB.json"));
    usersData = dataFromDB.usersData || null;
  }

  bot.on(`text`, async (message) => {
    let chatId = message.chat.id;
    let text = message.text.replace("<", "‹").replace(">", "›");

    try {
      const userInfo = usersData.find((obj) => obj.chatId == chatId);

      if (userInfo) {
        Object.assign(userInfo, {
          chatId: chatId,
          login: userInfo.login ?? message.from.first_name,
          botMessageId: userInfo.botMessageId ?? null,
          userAction: userInfo.userAction ?? `regular`,
          supportiveCount: userInfo.supportiveCount ?? 1,
          goalData: userInfo.goalData ?? [],
          noteData: userInfo.noteData ?? [],
          featData: userInfo.achivData ?? [],
          sleepData: userInfo.sleepData ?? [],
          streakData: userInfo.streakData ?? [],
        });
      } else {
        usersData.push({
          chatId: chatId,
          login: message.from.first_name,
          botMessageId: null,
          userAction: `regular`,
          supportiveCount: 1,
          goalData: [],
          noteData: [],
          featData: [],
          sleepData: [],
          streakData: [],
        });
      }

      bot.deleteMessage(chatId, message.message_id);

      const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

      if (dataAboutUser) {
        switch (text) {
          case `/start`:
            intro(chatId, `send`);
            bot.deleteMessage(chatId, dataAboutUser.botMessageId);
            break;
          case `/start showNav`:
            menu(chatId, `edit`, true);
            break;
          case `/start hideNav`:
            menu(chatId);
            break;
        }
      }

      if (text && Array.from(text)[0] != "/") {
        switch (dataAboutUser.userAction) {
          case `getName`:
            dataAboutUser.login = text.slice(0, 20);
            menu(chatId, `firstMeeting`);
            break;

          case `goalAdding`:
            dataAboutUser.goalData.unshift({ title: text, marker: false });
            goal(chatId);
            break;
          case `goalEditing`:
            dataAboutUser.goalData[dataAboutUser.supportiveCount - 1].title = text;
            goal(chatId);
            break;

          case `noteAdding`:
            dataAboutUser.noteData.unshift({ title: text, marker: false });
            note(chatId);
            break;
          case `noteEditing`:
            dataAboutUser.noteData[dataAboutUser.supportiveCount - 1].title = text;
            note(chatId);
            break;

          case `featAdding`:
            dataAboutUser.featData.unshift({ title: text, marker: false });
            feat(chatId);
            break;
          case `featEditing`:
            dataAboutUser.featData[dataAboutUser.supportiveCount - 1].title = text;
            feat(chatId);
            break;

          case `streakAdding`:
            dataAboutUser.streakData.unshift({ title: text, marker: false, duration: 0 });
            streak(chatId);
            break;
          case `streakEditing`:
            dataAboutUser.streakData[dataAboutUser.supportiveCount - 1].title = text;
            streak(chatId);
            break;

          case `sleepAddStart`:
            if (/^([01]?\d|2[0-3])[: ]([0-5]\d)$/.test(text)) {
              dataAboutUser.sleepData[0] = [text.split(/[: ]/)[0], text.split(/[: ]/)[1]];
              sleep(chatId, `addFinish`);
            }
            break;
          case `sleepAddFinish`:
            if (/^([01]?\d|2[0-3])[: ]([0-5]\d)$/.test(text)) {
              dataAboutUser.sleepData[1] = [text.split(/[: ]/)[0], text.split(/[: ]/)[1]];
              sleep(chatId);
            }
            break;
        }
      }

      textData(chatId, message.from.username, dataAboutUser.login, text);
    } catch (error) {
      errorData(chatId, dataAboutUser.login, `${String(error)}`);
    }
  });

  bot.on(`callback_query`, async (query) => {
    let chatId = query.message.chat.id;
    let data = query.data;

    const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

    try {
      switch (data) {
        case `menu`:
          menu(chatId);
          dataAboutUser.supportiveCount = 1;
          break;
        case `introNext`:
          intro(chatId, `greeting`);
          break;
        case `introBack`:
          intro(chatId);
          break;
        case `keepName`:
          menu(chatId, `firstMeeting`);
          break;

        case `goal`:
          goal(chatId);
          break;
        case `note`:
          note(chatId);
          break;
        case `feat`:
          feat(chatId);
          break;
        case `sleep`:
          sleep(chatId);
          break;
        case `streak`:
          streak(chatId);
          break;

        case `goalAdd`:
          goal(chatId, `add`);
          break;
        case `goalSelect`:
          goal(chatId, `select`);
          break;
        case `goalNext`:
          `${
            dataAboutUser.supportiveCount < dataAboutUser.goalData.length ? (dataAboutUser.supportiveCount += 1) : (dataAboutUser.supportiveCount = 1)
          }`;
          goal(chatId);
          break;
        case `goalBack`:
          `${
            dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : (dataAboutUser.supportiveCount = dataAboutUser.goalData.length)
          }`;
          goal(chatId);
          break;
        case `goalMark`:
          dataAboutUser.goalData[dataAboutUser.supportiveCount - 1].marker = 1 - dataAboutUser.goalData[dataAboutUser.supportiveCount - 1].marker;
          goal(chatId);
          break;
        case `goalDelete`:
          dataAboutUser.goalData.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : ``}`;
          goal(chatId);
          break;

        case `noteAdd`:
          note(chatId, `add`);
          break;
        case `noteSelect`:
          note(chatId, `select`);
          break;
        case `noteNext`:
          `${
            dataAboutUser.supportiveCount < dataAboutUser.noteData.length ? (dataAboutUser.supportiveCount += 1) : (dataAboutUser.supportiveCount = 1)
          }`;
          note(chatId);
          break;
        case `noteBack`:
          `${
            dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : (dataAboutUser.supportiveCount = dataAboutUser.noteData.length)
          }`;
          note(chatId);
          break;
        case `noteMark`:
          dataAboutUser.noteData[dataAboutUser.supportiveCount - 1].marker = 1 - dataAboutUser.noteData[dataAboutUser.supportiveCount - 1].marker;
          note(chatId);
          break;
        case `noteDelete`:
          dataAboutUser.noteData.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : ``}`;
          note(chatId);
          break;

        case `featAdd`:
          feat(chatId, `add`);
          break;
        case `featSelect`:
          feat(chatId, `select`);
          break;
        case `featNext`:
          `${
            dataAboutUser.supportiveCount < dataAboutUser.featData.length ? (dataAboutUser.supportiveCount += 1) : (dataAboutUser.supportiveCount = 1)
          }`;
          feat(chatId);
          break;
        case `featBack`:
          `${
            dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : (dataAboutUser.supportiveCount = dataAboutUser.featData.length)
          }`;
          feat(chatId);
          break;
        case `featMark`:
          dataAboutUser.featData[dataAboutUser.supportiveCount - 1].marker = 1 - dataAboutUser.featData[dataAboutUser.supportiveCount - 1].marker;
          feat(chatId);
          break;
        case `featDelete`:
          dataAboutUser.featData.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : ``}`;
          feat(chatId);
          break;

        case `streakAdd`:
          streak(chatId, `add`);
          break;
        case `streakSelect`:
          streak(chatId, `select`);
          break;
        case `streakNext`:
          `${
            dataAboutUser.supportiveCount < dataAboutUser.streakData.length
              ? (dataAboutUser.supportiveCount += 1)
              : (dataAboutUser.supportiveCount = 1)
          }`;
          streak(chatId);
          break;
        case `streakBack`:
          `${
            dataAboutUser.supportiveCount > 1
              ? (dataAboutUser.supportiveCount -= 1)
              : (dataAboutUser.supportiveCount = dataAboutUser.streakData.length)
          }`;
          streak(chatId);
          break;
        case `streakMark`:
          dataAboutUser.streakData[dataAboutUser.supportiveCount - 1].marker = true;
          dataAboutUser.streakData[dataAboutUser.supportiveCount - 1].duration += 1;
          streak(chatId);
          break;
        case `streakDelete`:
          dataAboutUser.streakData.splice(dataAboutUser.supportiveCount - 1, 1);
          `${dataAboutUser.supportiveCount > 1 ? (dataAboutUser.supportiveCount -= 1) : ``}`;
          streak(chatId);
          break;
        case `streakZero`:
          dataAboutUser.streakData[dataAboutUser.supportiveCount - 1].marker = false;
          dataAboutUser.streakData[dataAboutUser.supportiveCount - 1].duration = 0;
          streak(chatId, `select`);
          break;

        case `sleepTips`:
          sleep(chatId, `tips`);
          break;
        case `digfusion`:
          sleep(chatId, `digfusion`);
          break;

        case `sleepAdd`:
          sleep(chatId, `addStart`);
          break;
      }

      buttonData(chatId, query.message.chat.username, dataAboutUser.login, data);
    } catch (error) {
      errorData(chatId, dataAboutUser.login, `${String(error)}`);
    }
  });

  // cron.schedule(`0 0 * * *`, function () {
  //   try {
  //     databaseBackup(usersData);
  //   } catch (error) {}
  // });

  cron.schedule(`*/1 * * * *`, function () {
    try {
      fs.writeFileSync("DB.json", JSON.stringify({ usersData }, null, 2));
    } catch (error) {}
  });
}

StartAll();
