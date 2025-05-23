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
              inline_keyboard: [
                [{ text: `Погнали ➡️`, callback_data: `introNext` }],
              ],
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
                [{ text: `⬅️Назад`, callback_data: `introBack` }],
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

async function goal(chatId, type = `edit`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let showText = ``;

  for (let i = 1; i <= dataAboutUser.goalData.length; i++) {
    showText += `${
      dataAboutUser.supportiveCount == i
        ? `\n\n${
            dataAboutUser.goalData.marker[i - 1]
              ? `• <s>${i}. ${dataAboutUser.goalData.title[i - 1]}</s> •`
              : `• ${i}. ${dataAboutUser.goalData.title[i - 1]} •`
          }\n<blockquote>${dataAboutUser.goalData.text[i - 1]}</blockquote>`
        : `\n\n${
            dataAboutUser.goalData.marker[i - 1]
              ? `<s>${i}. ${dataAboutUser.goalData.title[i - 1].slice(0, 100)}${
                  dataAboutUser.goalData.title[i - 1].length > 100 ? `...` : ``
                }</s>`
              : `${i}. ${dataAboutUser.goalData.title[i - 1].slice(0, 100)}${
                  dataAboutUser.goalData.title[i - 1].length > 100 ? `...` : ``
                }`
          }`
    }`;
  }

  try {
    switch (type) {
      case `edit`:
        if (dataAboutUser.goalData.length > 1) {
          await bot.editMessageText(
            `<b>Твои цели, ${dataAboutUser.login} 🏔</b>${showText}\n\n<a href="https://t.me/${botName}/?start=goalMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `🔼`, callback_data: `goalPageBack` },
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `goalCur`,
                    },
                    { text: `🔽`, callback_data: `goalPageNext` },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `goalAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.goalData.length == 1) {
          await bot.editMessageText(
            `<b>Твои цели, ${dataAboutUser.login} 🏔</b>${showText}\n\n<a href="https://t.me/${botName}/?start=goalMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `goalCur`,
                    },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `goalAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.goalData.length == 0) {
          await bot.editMessageText(
            `<b>Твои цели, ${dataAboutUser.login} 🏔</b>\n\n<blockquote><b>Мечты это не то, что вы видите во сне. Это то, что не дает вам уснуть.</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `goalAdd` },
                  ],
                ],
              },
            }
          );
        }
        dataAboutUser.action = `goal`;
        break;
      case 2:
        await bot.editMessageText(
          `Цель: <b>${dataAboutUser.supportiveCount}. 🏔\n\n${
            dataAboutUser.goalData.marker[dataAboutUser.supportiveCount - 1]
              ? `• <s>${
                  dataAboutUser.goalData.title[
                    dataAboutUser.supportiveCount - 1
                  ]
                }</s> •`
              : `• ${
                  dataAboutUser.goalData.title[
                    dataAboutUser.supportiveCount - 1
                  ]
                } •`
          }</b>\n<blockquote>${
            dataAboutUser.goalData.text[dataAboutUser.supportiveCount - 1]
          }</blockquote>\n\n<a href="https://t.me/${botName}/?start=goalMarkDone"><b>Отметить текущий</b></a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
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
          }
        );
        dataAboutUser.action = `goalAbout`;
        break;
      case 3:
        await bot.editMessageText(
          `Цель: ${
            dataAboutUser.goalData.title.length + 1
          }. <b><u>Введите название</u> 👀\n\nПример:</b> Посетить концерт Cactus Jack 🌵`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `goalBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `goalAddTitle`;
        break;
      case 4:
        await bot.editMessageText(
          `Цель: ${dataAboutUser.goalData.title.length}. <b><u>Введите описание</u> ✌️\n\nПример:</b> Сделать фото с Тревисом 🪐`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `goalBackProtect` }],
              ],
            },
          }
        );
        dataAboutUser.action = `goalAddText`;
        break;
      case 5:
        await bot.editMessageText(
          `Цель: ${dataAboutUser.supportiveCount}. <b><u>Введите новое название</u> 👀\n\nПример:</b> Побывать в Японии 🌸`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `goalBackCur` },
                  { text: `Не менять ✅`, callback_data: `goalNotEditTitle` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `goalEditTitle`;
        break;
      case 6:
        await bot.editMessageText(
          `Цель: ${dataAboutUser.supportiveCount}. <b><u>Введите новое описание</u> ✌️\n\nПример:</b> Изучить Кунг-Фу ⛩️`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `goalBackCur` },
                  { text: `Не менять ✅`, callback_data: `goalNotEditText` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `goalEditText`;
        break;
      case 7:
        await bot.editMessageText(
          `<b>Удалить данные о <u>Целях</u>? 🏔</b>\n\n<b><i>Подтвердите свой выбор ⛩️</i></b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `Удалить ✅`, callback_data: `goalClearApprove` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `goalClearApprove`;
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function note(chatId, type = `edit`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let showText = ``;

  for (let i = 1; i <= dataAboutUser.noteData.length; i++) {
    showText += `${
      dataAboutUser.supportiveCount == i
        ? `\n\n${
            dataAboutUser.noteData.marker[i - 1]
              ? `• <s>${i}. ${dataAboutUser.noteData.title[i - 1]}</s> •`
              : `• ${i}. ${dataAboutUser.noteData.title[i - 1]} •`
          }\n<blockquote>${dataAboutUser.noteData.text[i - 1]}</blockquote>`
        : `\n\n${
            dataAboutUser.noteData.marker[i - 1]
              ? `<s>${i}. ${dataAboutUser.noteData.title[i - 1].slice(0, 100)}${
                  dataAboutUser.noteData.title[i - 1].length > 100 ? `...` : ``
                }</s>`
              : `${i}. ${dataAboutUser.noteData.title[i - 1].slice(0, 100)}${
                  dataAboutUser.noteData.title[i - 1].length > 100 ? `...` : ``
                }`
          }`
    }`;
  }

  try {
    switch (type) {
      case `edit`:
        if (dataAboutUser.noteData.title.length > 1) {
          await bot.editMessageText(
            `<b>Твои заметки, ${dataAboutUser.login} ⚡</b>${showText}\n\n<a href="https://t.me/${botName}/?start=noteMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `🔼`, callback_data: `notePageBack` },
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `noteCur`,
                    },
                    { text: `🔽`, callback_data: `notePageNext` },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `noteAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.noteData.title.length == 1) {
          await bot.editMessageText(
            `<b>Твои заметки, ${dataAboutUser.login} ⚡</b>${showText}\n\n<a href="https://t.me/${botName}/?start=noteMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `noteCur`,
                    },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `noteAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.noteData.title.length == 0) {
          await bot.editMessageText(
            `<b>Твои заметки, ${dataAboutUser.login} ⚡</b>\n\n<blockquote><b>Не позволяйте препятствиям встать на пути к победе. Вы сильнее тех испытаний, с которыми сталкиваетесь.</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `noteAdd` },
                  ],
                ],
              },
            }
          );
        }
        dataAboutUser.action = `note`;
        break;
      case 2:
        await bot.editMessageText(
          `Заметка: <b>${dataAboutUser.supportiveCount}. ⚡\n\n${
            dataAboutUser.noteData.marker[dataAboutUser.supportiveCount - 1]
              ? `• <s>${
                  dataAboutUser.noteData.title[
                    dataAboutUser.supportiveCount - 1
                  ]
                }</s> •`
              : `• ${
                  dataAboutUser.noteData.title[
                    dataAboutUser.supportiveCount - 1
                  ]
                } •`
          }</b>\n<blockquote>${
            dataAboutUser.noteData.text[dataAboutUser.supportiveCount - 1]
          }</blockquote>\n\n<a href="https://t.me/${botName}/?start=noteMarkDone"><b>Отметить текущий</b></a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
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
          }
        );
        dataAboutUser.action = `noteAbout`;
        break;
      case 3:
        await bot.editMessageText(
          `Заметка: ${
            dataAboutUser.noteData.title.length + 1
          }. <b><u>Введите название</u> 👀\n\nПример:</b> Рано проснуться 🦾`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `noteBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `noteAddTitle`;
        break;
      case 4:
        await bot.editMessageText(
          `Заметка: ${dataAboutUser.noteData.title.length}. <b><u>Введите описание</u> ✌️\n\nПример:</b> Заправить кровать 🥱`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `noteBackProtect` }],
              ],
            },
          }
        );
        dataAboutUser.action = `noteAddText`;
        break;
      case 5:
        await bot.editMessageText(
          `Заметка: ${dataAboutUser.supportiveCount}. <b><u>Введите новое название</u> 👀\n\nПример:</b> Сходить в зал 🦍`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `noteBackCur` },
                  { text: `Не менять ✅`, callback_data: `noteNotEditTitle` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `noteEditTitle`;
        break;
      case 6:
        await bot.editMessageText(
          `Заметка: ${dataAboutUser.supportiveCount}. <b><u>Введите новое описание</u> ✌️\n\nПример:</b> Отдохнуть в сауне ♨️`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `noteBackCur` },
                  { text: `Не менять ✅`, callback_data: `noteNotEditText` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `noteEditText`;
        break;
      case 7:
        await bot.editMessageText(
          `<b>Удалить данные о <u>Заметках</u>? ⚡</b>\n\n<b><i>Подтвердите свой выбор ⛩️</i></b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `Удалить ✅`, callback_data: `noteClearApprove` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `noteClearApprove`;
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function achiv(chatId, type = `edit`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let showText = ``;

  for (let i = 1; i <= dataAboutUser.achivData.title.length; i++) {
    showText += `${
      dataAboutUser.supportiveCount == i
        ? `\n\n${
            dataAboutUser.achivData.marker[i - 1]
              ? `• <s>${i}. ${dataAboutUser.achivData.title[i - 1]}</s> •`
              : `• ${i}. ${dataAboutUser.achivData.title[i - 1]} •`
          }\n<blockquote>${dataAboutUser.achivData.text[i - 1]}</blockquote>`
        : `\n\n${
            dataAboutUser.achivData.marker[i - 1]
              ? `<s>${i}. ${dataAboutUser.achivData.title[i - 1].slice(
                  0,
                  100
                )}${
                  dataAboutUser.achivData.title[i - 1].length > 100 ? `...` : ``
                }</s>`
              : `${i}. ${dataAboutUser.achivData.title[i - 1].slice(0, 100)}${
                  dataAboutUser.achivData.title[i - 1].length > 100 ? `...` : ``
                }`
          }`
    }`;
  }

  try {
    switch (type) {
      case `edit`:
        if (dataAboutUser.achivData.title.length > 1) {
          await bot.editMessageText(
            `<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>${showText}\n\n<a href="https://t.me/${botName}/?start=achivMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `🔼`, callback_data: `achivPageBack` },
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `achivCur`,
                    },
                    { text: `🔽`, callback_data: `achivPageNext` },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `achivAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.achivData.title.length == 1) {
          await bot.editMessageText(
            `<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>${showText}\n\n<a href="https://t.me/${botName}/?start=achivMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `achivCur`,
                    },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `achivAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.achivData.title.length == 0) {
          await bot.editMessageText(
            `<b>Твои достижения, ${dataAboutUser.login} 🎖️</b>\n\n<blockquote><b>Я не бегу за рекордами. Рекорды бегут за мной.</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `achivAdd` },
                  ],
                ],
              },
            }
          );
        }
        dataAboutUser.action = `achiv`;
        break;
      case 2:
        await bot.editMessageText(
          `Достижение: <b>${dataAboutUser.supportiveCount}. 🎖️\n\n${
            dataAboutUser.achivData.marker[dataAboutUser.supportiveCount - 1]
              ? `• <u>${
                  dataAboutUser.achivData.title[
                    dataAboutUser.supportiveCount - 1
                  ]
                }</u> •`
              : `• ${
                  dataAboutUser.achivData.title[
                    dataAboutUser.supportiveCount - 1
                  ]
                } •`
          }</b>\n<blockquote>${
            dataAboutUser.achivData.text[dataAboutUser.supportiveCount - 1]
          }</blockquote>\n\n<a href="https://t.me/${botName}/?start=achivMarkDone"><b>Отметить текущий</b></a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
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
          }
        );
        dataAboutUser.action = `achivAbout`;
        break;
      case 3:
        await bot.editMessageText(
          `Достижение: ${
            dataAboutUser.noteData.title.length + 1
          }. <b><u>Введите название</u> 👀\n\nПример:</b> 20 подтягиваний ⭐`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `achivBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `achivAddTitle`;
        break;
      case 4:
        await bot.editMessageText(
          `Достижение: ${dataAboutUser.noteData.title.length}. <b><u>Введите описание</u> ✌️\n\nПример:</b> Выход на турнике 💯`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `achivBackProtect` }],
              ],
            },
          }
        );
        dataAboutUser.action = `achivAddText`;
        break;
      case 5:
        await bot.editMessageText(
          `Достижение: ${dataAboutUser.supportiveCount}. <b><u>Введите новое название</u> 👀\n\nПример:</b> Прочитанная книга 📖`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `achivBackCur` },
                  { text: `Не менять ✅`, callback_data: `achivNotEditTitle` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `achivEditTitle`;
        break;
      case 6:
        await bot.editMessageText(
          `Достижение: ${dataAboutUser.supportiveCount}. <b><u>Введите новое описание</u> ✌️\n\nПример:</b> Новые знания и навыки 😎`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ Назад`, callback_data: `achivBackCur` },
                  { text: `Не менять ✅`, callback_data: `achivNotEditText` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `achivEditText`;
        break;
      case 7:
        await bot.editMessageText(
          `<b>Удалить данные о <u>Достижениях</u>? 🎖️</b>\n\n<b><i>Подтвердите свой выбор ⛩️</i></b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `Удалить ✅`, callback_data: `achivClearApprove` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `achivClearApprove`;
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function sleep(chatId, type = `edit`, time = null) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  try {
    switch (type) {
      case `edit`:
        await bot.editMessageText(
          `<b>Твой график сна, ${dataAboutUser.login} ✨</b>\n\nВремя засыпания: <b>${dataAboutUser.sleepData.sleepAt}</b>\nВремя подъема: <b>${dataAboutUser.sleepData.wakeAt}</b>\n\nКоличество сна: <b>${dataAboutUser.sleepData.dur} 😴</b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${
                      dataAboutUser.sleepData.dur == 0
                        ? `Добавить график ⌚`
                        : `Изменить график ⌚`
                    }`,
                    callback_data: `sleepEdit`,
                  },
                ],
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `Советы ⁉️`, callback_data: `sleepTips` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `sleep`;
        break;
      case 2:
        await bot.editMessageText(
          `<b>Во сколько ты <u>идешь спать?</u> 😪</b>\n\nПример: <code>22:30</code>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `sleepBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `addSleepAt`;
        break;
      case 3:
        await bot.editMessageText(
          `<b>Во сколько ты <u>просыпаешься?</u> 👀</b>\n\nПример: <code>6:30</code>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `sleepBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `addWakeAt`;
        break;
      case 4:
        await bot.editMessageText(
          `<b>Основные советы для правильного режима 💤\n\nПеред сном:</b><blockquote><b>• Отключите телефон 👀</b>\nВоздействие синего света нарушает работу ритмов сна\n\n<b>• Составьте план на день 📚</b>\nЭто поможет избавиться от лишних мыслей и лучше отдохнуть\n\n<b>• Соблюдайте темноту 🌙</b>\nСоздание оптимальных условий способствует хорошему сну</blockquote>\n\n<b>После сна:</b><blockquote><b>• Выпейте воды 💧</b>\nЭто восполнит водный баланс вашего тела\n\n<b>• Избегайте соц. сетей 💻</b>\nЭто может нарушить ваш утренний ритм\n\n<b>• Сделайте зарядку 🧘</b>\nФизическая активность пробуждает организм и делает вас энергичнее</blockquote>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `sleepBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `sleep`;
        break;
      case 5:
        if (!/[a-z]/i.test(time) && time.includes(":")) {
          time = time.replace(/\s/g, "");
          let parse = time.split(":");

          if (
            parse[1].length === 2 &&
            Number(parse[0]) >= 0 &&
            Number(parse[0]) <= 23 &&
            Number(parse[1]) >= 0 &&
            Number(parse[1]) <= 59
          ) {
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

              dataAboutUser.sleepData.dur = `${(dur - (dur % 60)) / 60}:${
                dur % 60 < 10 ? `0` : ``
              }${dur % 60}`;
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

          if (
            parse[1].length === 2 &&
            Number(parse[0]) >= 0 &&
            Number(parse[0]) <= 23 &&
            Number(parse[1]) >= 0 &&
            Number(parse[1]) <= 59
          ) {
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

            dataAboutUser.sleepData.dur = `${(dur - (dur % 60)) / 60}:${
              dur % 60 < 10 ? `0` : ``
            }${dur % 60}`;

            sleep(chatId);
          } else {
            sleep(chatId, 8);
          }
        } else {
          sleep(chatId, 8);
        }
        break;
      case 7:
        await bot.editMessageText(
          `<b>Во сколько ты <u>идешь спать?</u> 😪</b>\n\nПример: <code>22:30</code>\n\n<b>Неверный формат 🫤</b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `sleepBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `addSleepAt`;
        break;
      case 8:
        await bot.editMessageText(
          `<b>Во сколько ты <u>просыпаешься?</u> 👀</b>\n\nПример: <code>6:30</code>\n\n<b>Неверный формат 🫤</b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `sleepBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `addWakeAt`;
        break;
      case 9:
        await bot.editMessageText(
          `<b>Удалить данные о <u>Сне</u>? ✨</b>\n\n<b><i>Подтвердите свой выбор ⛩️</i></b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `Удалить ✅`, callback_data: `sleepClearApprove` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `sleepClearApprove`;
        break;
    }
  } catch (error) {
    errorData(chatId, dataAboutUser.login, `${String(error)}`);
  }
}

async function streak(chatId, type = `edit`) {
  const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

  let showText = ``;

  for (let i = 1; i <= dataAboutUser.streakData.title.length; i++) {
    showText += `${
      dataAboutUser.supportiveCount == i
        ? `\n\n• ${i}. ${
            dataAboutUser.streakData.title[i - 1]
          } •\n<blockquote>Сегодня: ${
            dataAboutUser.streakData.marker[i - 1] ? `✅` : `❌`
          }\nДлительность: <b>${
            dataAboutUser.streakData.dur[i - 1]
          }</b>\nРекорд: <b>${
            dataAboutUser.streakData.record[i - 1]
          }</b></blockquote>`
        : `\n\n${i}. ${dataAboutUser.streakData.title[i - 1].slice(0, 100)}${
            dataAboutUser.streakData.title[i - 1].length > 100 ? `...` : ``
          }\n<blockquote>Сегодня: ${
            dataAboutUser.streakData.marker[i - 1] ? `✅` : `❌`
          }</blockquote>`
    }`;
  }

  try {
    switch (type) {
      case `edit`:
        if (dataAboutUser.streakData.title.length > 1) {
          await bot.editMessageText(
            `<b>Твои серии, ${dataAboutUser.login} 🔥</b>${showText}\n\n<a href="https://t.me/${botName}/?start=streakMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `🔼`, callback_data: `streakPageBack` },
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `streakCur`,
                    },
                    { text: `🔽`, callback_data: `streakPageNext` },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `streakAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.streakData.title.length == 1) {
          await bot.editMessageText(
            `<b>Твои серии, ${dataAboutUser.login} 🔥</b>${showText}\n\n<a href="https://t.me/${botName}/?start=streakMarkDone"><b>Отметить текущий</b></a>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `• №  ${dataAboutUser.supportiveCount} •`,
                      callback_data: `streakCur`,
                    },
                  ],
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `streakAdd` },
                  ],
                ],
              },
            }
          );
        } else if (dataAboutUser.streakData.title.length == 0) {
          await bot.editMessageText(
            `<b>Твои серии, ${dataAboutUser.login} 🔥</b>\n\n<blockquote><b>Если ты хочешь добиться успеха, ты должен быть постоянным.</b></blockquote><i> ~ Криштиану Роналду 🇵🇹</i>`,
            {
              parse_mode: `html`,
              chat_id: chatId,
              message_id: dataAboutUser.botMessageId,
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: `⬅️ В меню`, callback_data: `menu` },
                    { text: `Добавить ✍️`, callback_data: `streakAdd` },
                  ],
                ],
              },
            }
          );
        }
        dataAboutUser.action = `streak`;
        break;
      case 2:
        await bot.editMessageText(
          `Серия: <b>${dataAboutUser.supportiveCount}. 🔥\n\n• ${
            dataAboutUser.streakData.title[dataAboutUser.supportiveCount - 1]
          } •</b>\n<blockquote>Сегодня: ${
            dataAboutUser.streakData.marker[dataAboutUser.supportiveCount - 1]
              ? `✅`
              : `❌`
          }\nДлительность: <b>${
            dataAboutUser.streakData.dur[dataAboutUser.supportiveCount - 1]
          }</b>\nРекорд: <b>${
            dataAboutUser.streakData.record[dataAboutUser.supportiveCount - 1]
          }</b></blockquote>\n\n<a href="https://t.me/${botName}/?start=streakMarkDone"><b>Отметить текущий</b></a>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `Изменить`, callback_data: `streakEdit` },
                  { text: `Удалить`, callback_data: `streakDelete` },
                ],
                [{ text: `⬅️ Назад`, callback_data: `streakBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `streakAbout`;
        break;
      case 3:
        await bot.editMessageText(
          `Серия: ${
            dataAboutUser.streakData.title.length + 1
          }. <b><u>Введите название</u> 👀\n\nПример:</b> Пить только воду 💧`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `streakBack` }],
              ],
            },
          }
        );
        dataAboutUser.action = `streakAddTitle`;
        break;
      case 4:
        await bot.editMessageText(
          `Серия: ${dataAboutUser.supportiveCount}. <b><u>Введите новое название</u> ✌️\n\nПример:</b> Тренироваться каждый день 💪`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: `⬅️ Назад`, callback_data: `streakBackCur` }],
              ],
            },
          }
        );
        dataAboutUser.action = `streakEditTitle`;
        break;
      case 5:
        await bot.editMessageText(
          `<b>Удалить данные о <u>Сериях</u>? 🔥</b>\n\n<b><i>Подтвердите свой выбор ⛩️</i></b>`,
          {
            parse_mode: `html`,
            chat_id: chatId,
            message_id: dataAboutUser.botMessageId,
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `⬅️ В меню`, callback_data: `menu` },
                  { text: `Удалить ✅`, callback_data: `streakClearApprove` },
                ],
              ],
            },
          }
        );
        dataAboutUser.action = `streakClearApprove`;
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
          `<b>${helloText}, ${
            dataAboutUser.login
          }! 💯</b>\n\n<b>Какой у тебя план на сегодня?</b>\n\n${
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

  bot.on(`message`, async (message) => {
    let chatId = message.chat.id;
    let text = message.text;

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

      switch (text) {
        case `/start`:
          bot.deleteMessage(chatId, dataAboutUser.botMessageId);
          dataAboutUser.userAction = `regular`;
          intro(chatId, `send`);
          break;
        case `/start showNav`:
          menu(chatId, `edit`, true);
          break;
        case `/start hideNav`:
          menu(chatId);
          break;
        case `/start goalMarkDone`:
          dataAboutUser.goalData.marker[dataAboutUser.supportiveCount - 1] =
            !dataAboutUser.goalData.marker[dataAboutUser.supportiveCount - 1];
          goal(chatId);
          break;
        case `/start noteMarkDone`:
          dataAboutUser.noteData.marker[dataAboutUser.supportiveCount - 1] =
            !dataAboutUser.noteData.marker[dataAboutUser.supportiveCount - 1];
          note(chatId);
          break;
        case `/start achivMarkDone`:
          dataAboutUser.achivData.marker[dataAboutUser.supportiveCount - 1] =
            !dataAboutUser.achivData.marker[dataAboutUser.supportiveCount - 1];
          achiv(chatId);
          break;
        case `/start streakMarkDone`:
          dataAboutUser.streakData.dur[dataAboutUser.supportiveCount - 1] += 1;
          dataAboutUser.streakData.marker[
            dataAboutUser.supportiveCount - 1
          ] = true;
          if (
            dataAboutUser.streakData.dur[dataAboutUser.supportiveCount - 1] >
            dataAboutUser.streakData.record[dataAboutUser.supportiveCount - 1]
          ) {
            dataAboutUser.streakData.record[
              dataAboutUser.supportiveCount - 1
            ] += 1;
          }
          streak(chatId);
          break;
      }

      if (Array.from(text)[0] != "/") {
        if (dataAboutUser.action == `setLogin` && text.length <= 30) {
          dataAboutUser.login = text;
          menu(chatId, `firstMeeting`);
        } else if (dataAboutUser.action == `addSleepAt`) {
          sleep(chatId, 5, text);
        } else if (dataAboutUser.action == `addWakeAt`) {
          sleep(chatId, 6, text);
        } else if (
          dataAboutUser.action == `goalAddTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.goalData.title.push(text);
          dataAboutUser.goalData.text.push(`Без описания`);
          dataAboutUser.goalData.marker.push(false);
          goal(chatId, 4);
        } else if (
          dataAboutUser.action == `goalAddText` &&
          text.length <= 700
        ) {
          dataAboutUser.goalData.text[dataAboutUser.goalData.title.length - 1] =
            text;
          goal(chatId);
        } else if (
          dataAboutUser.action == `goalEditTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.goalData.title[dataAboutUser.supportiveCount - 1] =
            text;
          goal(chatId, 6);
        } else if (
          dataAboutUser.action == `goalEditText` &&
          text.length <= 700
        ) {
          dataAboutUser.goalData.text[dataAboutUser.supportiveCount - 1] = text;
          goal(chatId, 2);
        } else if (
          dataAboutUser.action == `noteAddTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.noteData.title.push(text);
          dataAboutUser.noteData.text.push(`Без описания`);
          dataAboutUser.noteData.marker.push(false);
          note(chatId, 4);
        } else if (
          dataAboutUser.action == `noteAddText` &&
          text.length <= 700
        ) {
          dataAboutUser.noteData.text[dataAboutUser.noteData.title.length - 1] =
            text;
          note(chatId);
        } else if (
          dataAboutUser.action == `noteEditTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.noteData.title[dataAboutUser.supportiveCount - 1] =
            text;
          note(chatId, 6);
        } else if (
          dataAboutUser.action == `noteEditText` &&
          text.length <= 700
        ) {
          dataAboutUser.noteData.text[dataAboutUser.supportiveCount - 1] = text;
          note(chatId, 2);
        } else if (
          dataAboutUser.action == `achivAddTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.achivData.title.push(text);
          dataAboutUser.achivData.text.push(`Без описания`);
          dataAboutUser.achivData.marker.push(false);
          achiv(chatId, 4);
        } else if (
          dataAboutUser.action == `achivAddText` &&
          text.length <= 700
        ) {
          dataAboutUser.achivData.text[
            dataAboutUser.achivData.title.length - 1
          ] = text;
          achiv(chatId);
        } else if (
          dataAboutUser.action == `achivEditTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.achivData.title[dataAboutUser.supportiveCount - 1] =
            text;
          achiv(chatId, 6);
        } else if (
          dataAboutUser.action == `achivEditText` &&
          text.length <= 700
        ) {
          dataAboutUser.achivData.text[dataAboutUser.supportiveCount - 1] =
            text;
          achiv(chatId, 2);
        } else if (
          dataAboutUser.action == `streakAddTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.streakData.title.push(text);
          dataAboutUser.streakData.marker.push(false);
          dataAboutUser.streakData.record.push(0);
          dataAboutUser.streakData.dur.push(0);
          streak(chatId, 1);
        } else if (
          dataAboutUser.action == `streakEditTitle` &&
          text.length <= 500
        ) {
          dataAboutUser.streakData.title[dataAboutUser.supportiveCount - 1] =
            text;
          streak(chatId, 2);
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

        // head buttons

        case `goal`:
          dataAboutUser.supportiveCount = 1;
          `${
            dataAboutUser.goalData.title.length >= 1
              ? dataAboutUser.supportiveCount == 1
              : dataAboutUser.supportiveCount == 0
          }`;
          goal(chatId);
          break;
        case `note`:
          dataAboutUser.supportiveCount = 1;
          `${
            dataAboutUser.noteData.title.length >= 1
              ? dataAboutUser.supportiveCount == 1
              : dataAboutUser.supportiveCount == 0
          }`;
          note(chatId);
          break;
        case `achiv`:
          dataAboutUser.supportiveCount = 1;
          `${
            dataAboutUser.achivData.title.length >= 1
              ? dataAboutUser.supportiveCount == 1
              : dataAboutUser.supportiveCount == 0
          }`;
          achiv(chatId);
          break;
        case `streak`:
          dataAboutUser.supportiveCount = 1;
          `${
            dataAboutUser.streakData.title.length >= 1
              ? dataAboutUser.supportiveCount == 1
              : dataAboutUser.supportiveCount == 0
          }`;
          streak(chatId);
          break;
        case `sleep`:
          sleep(chatId);
          break;

        // clear buttons

        case `goalClear`:
          goal(chatId, 7);
          break;
        case `noteClear`:
          note(chatId, 7);
          break;
        case `achivClear`:
          achiv(chatId, 7);
          break;
        case `streakClear`:
          streak(chatId, 5);
          break;
        case `sleepClear`:
          sleep(chatId, 9);
          break;

        // clear approve buttons

        case `goalClearApprove`:
          dataAboutUser.goalData.title = [];
          dataAboutUser.goalData.text = [];
          dataAboutUser.goalData.marker = [];
          menu(chatId);
          break;
        case `noteClearApprove`:
          dataAboutUser.noteData.title = [];
          dataAboutUser.noteData.text = [];
          dataAboutUser.noteData.marker = [];
          menu(chatId);
          break;
        case `achivClearApprove`:
          dataAboutUser.achivData.title = [];
          dataAboutUser.achivData.text = [];
          dataAboutUser.achivData.marker = [];
          menu(chatId);
          break;
        case `streakClearApprove`:
          dataAboutUser.streakData.title = [];
          dataAboutUser.streakData.dur = [];
          dataAboutUser.streakData.marker = [];
          dataAboutUser.streakData.record = [];
          menu(chatId);
          break;
        case `sleepClearApprove`:
          dataAboutUser.sleepData.dur = 0;
          dataAboutUser.sleepData.sleepAt = `-`;
          dataAboutUser.sleepData.wakeAt = `-`;
          menu(chatId);
          break;

        // goal button

        case `goalBackProtect`:
          dataAboutUser.goalData.text.push(`Без описания`);
          goal(chatId);
          break;
        case `goalCur`:
          `${dataAboutUser.goalData.title.length != 0 ? goal(chatId, 2) : 0}`;
          break;
        case `goalAdd`:
          goal(chatId, 3);
          break;
        case `goalDelete`:
          dataAboutUser.goalData.title.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.goalData.text.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.goalData.marker.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          `${
            dataAboutUser.supportiveCount ==
              dataAboutUser.goalData.title.length + 1 &&
            dataAboutUser.supportiveCount != 1
              ? (dataAboutUser.supportiveCount -= 1)
              : 0
          }`;
          goal(chatId);
          break;
        case `goalEdit`:
          goal(chatId, 5);
          break;
        case `goalPageNext`:
          if (
            dataAboutUser.supportiveCount == dataAboutUser.goalData.title.length
          ) {
            dataAboutUser.supportiveCount = 1;
          } else if (
            dataAboutUser.supportiveCount < dataAboutUser.goalData.title.length
          ) {
            dataAboutUser.supportiveCount += 1;
          }
          goal(chatId);
          break;
        case `goalPageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (
            dataAboutUser.supportiveCount == 1 &&
            dataAboutUser.goalData.title.length != 0
          ) {
            dataAboutUser.supportiveCount = dataAboutUser.goalData.title.length;
          }
          goal(chatId);
          break;
        case `goalBackCur`:
          goal(chatId, 2);
          break;
        case `goalBack`:
          goal(chatId);
          break;
        case `goalNotEditTitle`:
          goal(chatId, 6);
          break;
        case `goalNotEditText`:
          goal(chatId, 2);
          break;

        // note button

        case `noteBackProtect`:
          dataAboutUser.noteData.text.push(`Без описания`);
          note(chatId);
          break;
        case `noteCur`:
          `${dataAboutUser.noteData.title.length != 0 ? note(chatId, 2) : 0}`;
          break;
        case `noteAdd`:
          note(chatId, 3);
          break;
        case `noteDelete`:
          dataAboutUser.noteData.title.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.noteData.text.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.noteData.marker.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          `${
            dataAboutUser.supportiveCount ==
              dataAboutUser.noteData.title.length + 1 &&
            dataAboutUser.supportiveCount != 1
              ? (dataAboutUser.supportiveCount -= 1)
              : 0
          }`;
          note(chatId);
          break;
        case `noteEdit`:
          note(chatId, 5);
          break;
        case `notePageNext`:
          if (
            dataAboutUser.supportiveCount == dataAboutUser.noteData.title.length
          ) {
            dataAboutUser.supportiveCount = 1;
          } else if (
            dataAboutUser.supportiveCount < dataAboutUser.noteData.title.length
          ) {
            dataAboutUser.supportiveCount += 1;
          }
          note(chatId);
          break;
        case `notePageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (
            dataAboutUser.supportiveCount == 1 &&
            dataAboutUser.noteData.title.length != 0
          ) {
            dataAboutUser.supportiveCount = dataAboutUser.noteData.title.length;
          }
          note(chatId);
          break;
        case `noteBackCur`:
          note(chatId, 2);
          break;
        case `noteBack`:
          note(chatId);
          break;
        case `noteNotEditTitle`:
          note(chatId, 6);
          break;
        case `noteNotEditText`:
          note(chatId, 2);
          break;

        // achiv button

        case `achivBackProtect`:
          dataAboutUser.achivData.text.push(`Без описания`);
          achiv(chatId);
          break;
        case `achivCur`:
          `${dataAboutUser.achivData.title.length != 0 ? achiv(chatId, 2) : 0}`;
          break;
        case `achivAdd`:
          achiv(chatId, 3);
          break;
        case `achivDelete`:
          dataAboutUser.achivData.title.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.achivData.text.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.achivData.marker.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          `${
            dataAboutUser.supportiveCount ==
              dataAboutUser.achivData.title.length + 1 &&
            dataAboutUser.supportiveCount != 1
              ? (dataAboutUser.supportiveCount -= 1)
              : 0
          }`;
          achiv(chatId);
          break;
        case `achivEdit`:
          achiv(chatId, 5);
          break;
        case `achivPageNext`:
          if (
            dataAboutUser.supportiveCount ==
            dataAboutUser.achivData.title.length
          ) {
            dataAboutUser.supportiveCount = 1;
          } else if (
            dataAboutUser.supportiveCount < dataAboutUser.achivData.title.length
          ) {
            dataAboutUser.supportiveCount += 1;
          }
          achiv(chatId);
          break;
        case `achivPageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (
            dataAboutUser.supportiveCount == 1 &&
            dataAboutUser.achivData.title.length != 0
          ) {
            dataAboutUser.supportiveCount =
              dataAboutUser.achivData.title.length;
          }
          achiv(chatId);
          break;
        case `achivBackCur`:
          achiv(chatId, 2);
          break;
        case `achivBack`:
          achiv(chatId);
          break;
        case `achivNotEditTitle`:
          achiv(chatId, 6);
          break;
        case `achivNotEditText`:
          achiv(chatId, 2);
          break;

        // streak button

        case `streakCur`:
          `${
            dataAboutUser.streakData.title.length != 0 ? streak(chatId, 2) : 0
          }`;
          break;
        case `streakAdd`:
          streak(chatId, 3);
          break;
        case `streakDelete`:
          dataAboutUser.streakData.title.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.streakData.marker.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.streakData.record.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          dataAboutUser.streakData.dur.splice(
            dataAboutUser.supportiveCount - 1,
            1
          );
          `${
            dataAboutUser.supportiveCount ==
              dataAboutUser.streakData.title.length + 1 &&
            dataAboutUser.supportiveCount != 1
              ? (dataAboutUser.supportiveCount -= 1)
              : 0
          }`;
          streak(chatId);
          break;
        case `streakEdit`:
          streak(chatId, 4);
          break;
        case `streakPageNext`:
          if (
            dataAboutUser.supportiveCount ==
            dataAboutUser.streakData.title.length
          ) {
            dataAboutUser.supportiveCount = 1;
          } else if (
            dataAboutUser.supportiveCount <
            dataAboutUser.streakData.title.length
          ) {
            dataAboutUser.supportiveCount += 1;
          }
          streak(chatId);
          break;
        case `streakPageBack`:
          if (dataAboutUser.supportiveCount > 1) {
            dataAboutUser.supportiveCount -= 1;
          } else if (
            dataAboutUser.supportiveCount == 1 &&
            dataAboutUser.streakData.title.length != 0
          ) {
            dataAboutUser.supportiveCount =
              dataAboutUser.streakData.title.length;
          }
          streak(chatId);
          break;
        case `streakBackCur`:
          streak(chatId, 2);
          break;
        case `streakBack`:
          streak(chatId);
          break;

        // sleep button

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

      buttonData(
        chatId,
        query.message.chat.username,
        dataAboutUser.login,
        data
      );
    } catch (error) {
      errorData(chatId, dataAboutUser.login, `${String(error)}`);
    }
  });

  cron.schedule(`1 0 * * *`, function () {
    for (let i = 1; i <= dataAboutUser.streakData.title.length; i++) {
      if (!dataAboutUser.streakData.marker[i - 1]) {
        dataAboutUser.streakData.dur[i - 1] = 0;
      }
      dataAboutUser.streakData.marker[i - 1] = false;
    }
  });

  // cron.schedule(`0 0 * * 1`, function () {
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
