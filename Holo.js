class Holo {

	constructor(webhook, settings, user) {

		this.webhook = webhook;
		this.name = settings.name;
		this.avatar = settings.avatar;
		this.user = user;

	}

	echo(message) {

		this.webhook.send(message, {
			username: this.name,
			avatar: this.avatar
			
		})

	}

}

module.exports = Holo;