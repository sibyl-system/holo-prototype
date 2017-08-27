// Sibyl
// Holo prototype

// Discord
const Keys = require('./keychain');
const { Client, WebhookClient } = require('discord.js');
const client = new Client();
// Other
const chalk = require('chalk');
const snekfetch = require('snekfetch');
const Holo = require('./Holo');
const dbInfo = require('./database');
const dbManager = new (require('./DatabaseManager'))(dbInfo);

/*
 *  Temporary
 * Message Event
 */

function createHolo(user, extra) {
	let channel = extra.message.channel;
	let webhook;
	channel.fetchWebhooks().then(webhooks => {
		if(webhooks.has('name', 'sibyl-holo')) webhook = webhooks.find('name','sibyl-holo');
		let {message} =  extra;
		let botMember = message.guild.me;
		if(!botMember.hasPermission('MANAGE_WEBHOOKS')) return message.channel.sendMessage(':warning: Sibyl requires `ADMINISTRATOR` permissions in order to function.');
		if(!user.holo) user.holo = {};
		if(!user.holo.webhook) {
			console.log('hello');
			message.channel.createWebhook('sibyl-holo', 'http://bit.ly/2utJn7V')
			.then(webhook => {
				user.holo = new Holo(webhook, {name: extra.name, avatar: extra.avatar}, extra.author.id);
				user.holo.webhook = webhook;
				user.holo.webhook.owner = '';
				dbManager.push(`users/${message.author.id}/`, user);
			}).catch(error => console.log);
		} else if(user.holo.webhook) {
			console.log('hi kek');
			user.holo = new Holo(user.holo.webhook, {name: extra.name, avatar: extra.avatar}, extra.author.id);
			user.holo.webhook = new WebhookClient(user.holo.webhook.id, user.holo.webhook.token);
			user.holo.webhook.owner = '';
			user.holo.webhook.options = {};
			user.holo.webhook.rest = {};
			user.holo.webhook.resolver = {};
			dbManager.push(`users/${message.author.id}/`, user);
		}
	});
}

function handleUser(user, extra) {
	createHolo(user, extra);
}

client.on('message', message => {

	// helper variables
	let prefix = 's!';
	let { guild, channel, content, author } = message;
	let suffix = content.split(' ')[0].substring(prefix.length);

	// s!holo Seagull ; http://bit.ly/2utJn7V
	// s!holo Akane ; http://bit.ly/2wRhHd9
	
	dbManager.get(`users/${message.author.id}`)
	.then(user => {
		if(user === {}) return;
		if(!user.holo) return;
		if(!user.holo.webhook) return;
		if(message.content.startsWith(prefix)) return;
		if(user.holoEnabled == true) {
			message.delete();
			let webhook = new WebhookClient(user.holo.webhook.id, user.holo.webhook.token);
			webhook.sendMessage(message.content, {username: user.holo.name, avatarURL: user.holo.avatar});
		}
	});

	if(!content.startsWith(prefix)) return;
	let args = content.split(' ').splice(1).join(' ').trim().split(';');

	if(suffix == 'holo' && ['enable','disable'].indexOf(args[0]) === -1) {
		let name = args[0];
		let avatar = args[1];

		if(!name && avatar) return message.channel.send(`:warning: A holo name was not given`);
		if(!avatar && name) return message.channel.send(`:warning: A holo avatar was not given`);
		else if(!avatar && !name) return message.channel.send(`:warning: Neither a holo avatar or a holo name was given`);
		dbManager.get(`users/${author.id}`).then(data => { handleUser(data, { message, author, name, avatar }) });
	} else if(suffix == 'holo' && ['enable','disable'].indexOf(args[0]) !== -1) {
		dbManager.get(`users/${author.id}`)
		.then(user => {
			if(args[0] == 'enable') user.holoEnabled = true
			else user.holoEnabled = false;
			message.channel.send(`Holo has been \`${args[0]}d\``);
			dbManager.push(`users/${author.id}`, user);
		});
	}
});

client.login(Keys.sibylAccount);
process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.stack);
});