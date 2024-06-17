import TelegramBot from "node-telegram-bot-api";

const TOKEN = "7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w";

const bot = new TelegramBot(TOKEN, { polling: true });

async function tomenu(chatId, messageId){
	try {
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
	} catch (error) {
		console.log(error);
	}
}

async function todo(chatId, messageId){
	try {
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
	} catch (error) {
		console.log(error);
	}
}

async function goals(chatId, messageId){
	try {
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
	} catch (error) {
		console.log(error);
	}
}

async function achievements(chatId, messageId){
	try {
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
	} catch (error) {
		console.log(error);
	}
}

async function rules(chatId, messageId){
	try {
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
	} catch (error) {
		console.log(error);
	}
}

async function sleep(chatId, messageId){
	try {
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
	} catch (error) {
		console.log(error);
	}
}


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


			switch (data) {
				case "next":
					tomenu(chatId, messageId);
					break;
				case "tomenu":
					tomenu(chatId, messageId);
					break;
				case "todo":
					todo(chatId, messageId);
					break;
				case "goals":
					goals(chatId, messageId);
					break;
				case "achievements":
					achievements(chatId, messageId);
					break;
				case "rules":
					rules(chatId, messageId);
					break;
				case "sleep":
					sleep(chatId, messageId);
					break;
			}
		});
	} catch (error) {}
}

StartAll();
