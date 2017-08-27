/*
 * Holo class
 */

class Holo {

	constructor(webhook, settings, user) {
		this.webhook = webhook;
		this.name = settings.name;
		this.avatar = settings.avatar;
		this.user = user;
	}
	
}

module.exports = Holo;