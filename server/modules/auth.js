'use strict';

// See: https://github.com/hapijs/hapi-auth-basic

const bcrypt = require('bcrypt'),
	Hoek = require('hoek');

const badAttempt = (username) => {
	console.log(`User '${username}' was rejected access...`);
};

// Функция проверки подлинности для базовой аутентификации HTTP
const validate = (username, password, cb) => {
	require('../handlers/user-handler')._getUser(username, password).then((user) => {
		// Нет неудачной попытки пользователя
		if (!user) {
			badAttempt(username);
			return cb(null, false);
		}

		// Предоставьте эти элементы пользователю
		if (user.scope) {
			Hoek.assert(Hoek.contain(scopes, user.scope), `this user has a scope (${user.scope}) that is not valid (valid: ${scopes})`);
		}
		const userExposed = {
			id: user.id,
			scope: user.scope
		};

		// Вызовите обратный вызов
		cb(null, true, userExposed);

	}).catch(err => {
		badAttempt(username);
		return cb(null, false);
	});
};

const basicAuth = (req, username, password, cb) => validate(username, password, cb);


const scopes = ['USER','ADMIN'];

module.exports = {
	basicAuth,
	validate,
	scopes
};