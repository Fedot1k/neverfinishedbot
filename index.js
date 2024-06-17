import TelegramBot from "node-telegram-bot-api";

const TOKEN = "7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w";

const bot = new TelegramBot(TOKEN, { polling: true });

let rndNum = 0;

async function StartAll() {
	try {
		bot.on("message", async (message) => {
			let text = message.text;
			let chatId = message.chat.id;
			let messageId = message.message_id;

			switch (text) {
                case "/start":
					bot.sendMessage(
						chatId,
						"<b>Добро пожаловать!</b> <b>\n\nNeverFinished - бот для развития самодисциплины.</b> <i>\n\nДисциплина > Мотивация</i>",
						{
							parse_mode: "HTML",
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[{ text: "Далее", callback_data: "next" }],
								],
							},
						}
					);
					break;
			}

			bot.deleteMessage(chatId, messageId);
		});

		bot.on("callback_query", async (query) => {
			let chatId = query.message.chat.id;
			let data = query.data;
			let messageId = query.message.message_id;

            try {
                if (data.includes("button_")) {
                    let match = data.match(/^button_(.*)$/);
    
                    if (parseInt(match[1]) == rndNum) {
                        await bot.editMessageText(
                            `<b>Ты красавичка!!! 👍\n\n</b>Ответ: <b>${rndNum}!</b>`,
                            {
                                parse_mode: "html",
                                chat_id: chatId,
                                message_id: messageId,
                                disable_web_page_preview: true,
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: "Играть снова 🔃", callback_data: "play" }],
                                    ],
                                },
                            }
                        );
                    } else {
                        await bot.editMessageText(
                            `<b>Ты не красавичка!!! 😡\n\n</b>Ответ вообще-то <b>${rndNum}!!!!!!</b>`,
                            {
                                parse_mode: "html",
                                chat_id: chatId,
                                message_id: messageId,
                                disable_web_page_preview: true,
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: "Давай занова 🖕", callback_data: "play" }],
                                    ],
                                },
                            }
                        );
                    }
                }
            } catch (error) {
                
            }

			switch (data) {
				case "next":
					await bot.editMessageText(
						`<b>Добрый день, Чемпион 🏅</b>\n\n<a href="https://t.me/digfusionbot/?start=showNavigationListInMenuHome">Навигация по меню</a>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{ text: "Задачи на день ⚡", callback_data: "todo" },
									],
									[
										{ text: "Цели 🎯", callback_data: "goals" },
									],
									[
										{ text: "Достижения 🏆", callback_data: "achievements" },
									],
									[
										{ text: "Правила 📚", callback_data: "rules" },
									],
									[
										{ text: "Сон 🌙", callback_data: "sleep" },
									],
								],
							},
						}
					);
					break;
				case "goals":
					await bot.editMessageText(
						`<b>Твои цели 🦾</b>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{ text: "- Добавить цель -", callback_data: "add_goal" },
									],
									[
										{ text: "- Удалить цель -", callback_data: "delete_goal" },
									],
									[
										{ text: "⬅️ В меню", callback_data: "tomenu" },
										{ text: "Отметить ✅", callback_data: "goals_done" },
									],
								],
							},
						}
					);
					break;
				case "todo":
					await bot.editMessageText(
						`<b>Твои задачи на сегодня</b>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{ text: "- Добавить задачу -", callback_data: "add_goal" },
									],
									[
										{ text: "- Удалить задачу -", callback_data: "delete_goal" },
									],
									[
										{ text: "- Изменить дату -", callback_data: "add_time" },
									],
									[
										{ text: "⬅️ В меню", callback_data: "tomenu" },
										{ text: "Отметить ✅", callback_data: "goals_done" },
									],
								],
							},
						}
					);
					break;
				case "tomenu":
					await bot.editMessageText(
						`<b>Добрый день, Чемпион 🏅</b>\n\n<a href="https://t.me/digfusionbot/?start=showNavigationListInMenuHome">Навигация по меню</a>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{ text: "Задачи на день ⚡", callback_data: "todo" },
									],
									[
										{ text: "Цели 🎯", callback_data: "goals" },
									],
									[
										{ text: "Достижения 🏆", callback_data: "achievements" },
									],
									[
										{ text: "Правила 📚", callback_data: "rules" },
									],
									[
										{ text: "Сон 🌙", callback_data: "sleep" },
									],
								],
							},
						}
					);
					break;
			}
		});
	} catch (error) {}
}

StartAll();
