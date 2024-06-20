import TelegramBot from "node-telegram-bot-api";



const TOKEN = "7279660476:AAGHOLKPGLzGTvMXff4mAYBZ8XnLrQV2e8w";
const bot = new TelegramBot(TOKEN, { polling: true });

let logged = false





async function first(chatId){
	try {
		if (!logged) {
			await bot.sendMessage(
				chatId,
				"<b>👋 Добро пожаловать</b> в мир целеустремленности и личностного роста с <b><i>neverfinished!</i></b>\n\n<b>•  Трекинг прогресса 🏆</b>\nВеди учет своих амбициозных <b><i>целей</i></b> и великих <b><i>достижений!</i></b>\n\n<b>•  Составление задач и правил на день 🫡</b>\nВыполняй свои <b><i>задачи на день</i></b>, не забывая про <b><i>собственные принципы!</i></b>\n\n<b>•  Отслеживание графика сна 🌙</b>\nУлучшай свой <b><i>режим сна</i></b> и проводи день <b><i>энергичнее!</i></b>\n\n<b>💪 Начни сейчас и достигни своих целей вместе с <i>neverfinished!</i></b>",
				{
					parse_mode: "HTML",
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[{ text: "Далее➡️ ", callback_data: "next" }],
						],
					},
				}
			);
		}
	} catch (error) {
		console.log(error);
	}
}





async function menuNav(chatId, messageId){
	try {
		await bot.editMessageText(
			`<b>Привет, Чемпион 💯</b>\n\n<b>Какой план на сегодняdddddddddd?</b>\n\n<a href="https://t.me/neverfinishedbot/?start=hideNav">Навигация по меню ⇧</a>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "Цели 🏔", callback_data: "goal" },
							{ text: "Задачи ⚡", callback_data: "todo" },
						],
						[
							{ text: "Достижения 🎖️", callback_data: "achievement" },
						],
						[
							{ text: "Сон ✨", callback_data: "sleep" },
							{ text: "Серии 🔥", callback_data: "streak" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}





async function menu(chatId, messageId){
	try {
		await bot.editMessageText(
			`<b>Привет, Чемпион 💯</b>\n\n<b>Какой план на сегодня? </b>\n\n<a href="https://t.me/neverfinishedbot/?start=showNav">Навигация по меню ⇨</a>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "Цели 🏔", callback_data: "goal" },
							{ text: "Задачи ⚡", callback_data: "todo" },
						],
						[
							{ text: "Достижения 🎖️", callback_data: "achievement" },
						],
						[
							{ text: "Сон ✨", callback_data: "sleep" },
							{ text: "Серии 🔥", callback_data: "streak" },
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
							{ text: "⬅️ В меню", callback_data: "menu" },
							{ text: "Отметить ✅", callback_data: "goal_done" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}





async function goal(chatId, messageId){
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
							{ text: "⬅️ В меню", callback_data: "menu" },
							{ text: "Отметить ✅", callback_data: "goal_done" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}





async function achievement(chatId, messageId){
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
							{ text: "⬅️ В меню", callback_data: "menu" },
							{ text: "Отметить ✅", callback_data: "goal_done" },
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
							{ text: "⬅️ В меню", callback_data: "menu" },
							{ text: "Отметить ✅", callback_data: "goal_done" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}





async function streak(chatId, messageId){
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
							{ text: "⬅️ В меню", callback_data: "menu" },
							{ text: "Отметить ✅", callback_data: "goal_done" },
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
					first(chatId);
					break;
				// case "/start showNav": 
				// 	menuNav(chatId, cur_mes);
				// 	break;
				// case "/start hideNav":
				// 	menu(chatId, cur_mes);
				// 	break;
				case "/restart":
					first(chatId)
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
			}
			bot.deleteMessage(chatId, messageId);
			console.log(message);
		});

		bot.on("callback_query", async (query) => {
			let chatId = query.message.chat.id;
			let data = query.data;
			let messageId = query.message.message_id;


			switch (data) {
				case "next":
					menu(chatId, messageId);
					break;
				case "menu":
					menu(chatId, messageId);
					break;
				case "todo":
					todo(chatId, messageId);
					break;
				case "goal":
					goal(chatId, messageId);
					break;
				case "achievement":
					achievement(chatId, messageId);
					break;
				case "sleep":
					sleep(chatId, messageId);
					break;
				case "streak":
					streak(chatId, messageId);
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
					
			}
		});
	} catch (error) {}
}

StartAll();
