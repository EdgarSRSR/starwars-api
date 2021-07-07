'use strict';

const boom = require('boom'),
	joi = require('joi'),
	db = require('../data/firebase-connector'),
	bcrypt = require('bcrypt'),
	auth = require('../modules/auth'),
	transform = require('../transforms/user-transform');

const _convertSnapshotToUser = (obj) => {
	const val = obj,
		// Идентификатор пользователя
		key = Object.keys(val)[0],
		user = Object.assign({}, val[key], { id: key });
	return user;
};

const _hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) {
				return reject(err);
			}

			return resolve(hash);
		});
	});
};

//Получить пользователя из бд, если он существует
const _getUser = (username, password) => {
	return new Promise((resolve, reject) => {

		// Нет имени пользователя для проверки...
		if (username === undefined || username === null) {
			return reject('имя пользователя пустое');
		}

		// Запросите базу данных для имени пользователя, соответствующего аргументу
		db.database().ref('users').orderByChild('username').equalTo(username).once('value').then(snapshot => {

			// Нет имени пользователя
			if (!snapshot.exists()) {
				return resolve();
			}

			const user = _convertSnapshotToUser(snapshot.val());

			// Хэшируйте пароль и посмотрите, соответствует ли он базе данных
			bcrypt.compare(password, user.password, (err, isValid) => {
				// Пароль неверен - неудачная попытка
				if (err || !isValid) {
					return reject(err);
				} 

				// Пароль правильный, разрешите с помощью пользовательских данных
				resolve(user);
			});

		}).catch(err => reject(err));
	});
};

// Схема: пользователь
const getUser = (request, reply) => {
	const { username, password } =  request.query;
	_getUser(username, password)
		.then(user => {
			if (!user) {
				return new Promise((resolve, reject) => reject(boom.notFound()));
			}
			return user;
		})
		.then(user => transform.user(user))
		.then(user => reply(user))
		.catch((err = new Error()) => {
			return reply(boom.wrap(err));
		})
};

// Схема: пользователь
const newUser = (request, reply) => {
	const { username, password, scope = 'USER' } =  request.payload;
	_getUser(username, password)
		.then(user => {
			// Пользователь уже существует - не создавайте другого
			if (user) {
				return new Promise((resolve, reject) => reject(boom.conflict()));
			}

			// Хэш-пароль
			return _hashPassword(password);
		}).then(password => 
			// Отправить нового пользователя в Firebase
			db.database().ref('users').push({
				username,
				password,
				scope
			})
		)
		.then(user => user.once('value'))
		.then(snapshot => _convertSnapshotToUser({
			[snapshot.key]: snapshot.val()
		}))
		.then(user => transform.user(user))
		.then(user => reply(user))
		.catch((err = new Error()) => {
			return reply(boom.wrap(err));
		})
};

const schema = {
	user: {
		id: joi
			.string()
			.required()
			.description('идентификатор пользователя')
			.example(''),
		scope: joi
			.string()
			.valid(auth.scopes)
			.description('область доступа для этого пользователя')
			.example('USER')
	}
};

module.exports = {
	_getUser,
	getUser,
	newUser,
	schema,
};