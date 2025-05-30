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
        await bot.editMessageText(
          `<b>Как пожелаете к вам обращаться в будущем? 🤔</b>\n\n<i><b>*neverfinished</b> несет ответственность за конфиденциальность ваших данных 🤫</i>`,
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
        await bot.editMessageText(
          `<b>Твои цели, ${dataAboutUser.login} 🏔</b>\n\n${
            dataAboutUser.goalData.length != 0
              ? `${!selected.marker ? selected.title : `☑️ ${selected.title}`}`
              : `<blockquote><b>Мечты это не то, что вы видите во сне. Это то, что не дает вам уснуть.</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`
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

async function menu(chatId, type = `edit`, navigate = false) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

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
          achivData: userInfo.achivData ?? [],
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
          achivData: [],
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
            dataAboutUser.userAction = `regular`;
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
            dataAboutUser.userAction = `regular`;
            menu(chatId, `firstMeeting`);
            break;
          case `goalAdding`:
            dataAboutUser.goalData.unshift({ title: text, marker: false });
            dataAboutUser.userAction = `goal`;
            goal(chatId);
            break;
          case `goalEditing`:
            dataAboutUser.goalData[dataAboutUser.supportiveCount - 1].title = text;
            dataAboutUser.userAction = `goal`;
            goal(chatId);
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
          dataAboutUser.userAction = `getName`;
          break;
        case `introBack`:
          intro(chatId);
          dataAboutUser.userAction = `regular`;
          break;
        case `keepName`:
          menu(chatId, `firstMeeting`);
          dataAboutUser.userAction = `regular`;
          break;

        case `goal`:
          goal(chatId);
          dataAboutUser.userAction = `goal`;
          break;
        case `note`:
          note(chatId);
          dataAboutUser.userAction = `note`;
          break;
        case `feat`:
          feat(chatId);
          dataAboutUser.userAction = `feat`;
          break;
        case `sleep`:
          sleep(chatId);
          dataAboutUser.userAction = `sleep`;
          break;
        case `streak`:
          streak(chatId);
          dataAboutUser.userAction = `streak`;
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
        case `goalSelect`:
          dataAboutUser.userAction = `goalEditing`;
          goal(chatId, `select`);
          break;
        case `goalAdd`:
          dataAboutUser.userAction = `goalAdding`;
          goal(chatId, `add`);
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
