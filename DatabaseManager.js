/*
 * Database manager to 
 * organise and make things
 * quicker
 */

class DatabaseManager {

	constructor(info) {

		this.firebase = require('firebase-admin');
		this.info = {
			credential: this.firebase.credential.cert(info.serviceaccount),
			databaseURL: info.databaseURL
		};
		this.firebase.initializeApp(this.info);
		this.database = this.firebase.database();

	}

	get(ref) {

		return new Promise((resolve, reject) => {
			this.database.ref(ref).once('value', snapshot => {
				let value = snapshot.val() || {};
				resolve(value);
			}).catch(err => reject);
		});

	}

	push(ref, data) {

		return new Promise((resolve, reject) => {
			this.database.ref(ref).set(data)
			.then(resolve)
			.catch(reject);
		});

	}

}

module.exports = DatabaseManager;