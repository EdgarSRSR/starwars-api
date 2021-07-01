'use strict';

const Hapi = require('hapi'),
	subscriptions = require('./modules/subscriptions'),
	plugins = require('./modules/plugins'),
	routes = require('./init/routes'),
	basicAuthValidation = require('./modules/auth').basicAuth;

const start = (host, port) => {
	return new Promise((resolve, reject) => {

		// Создать сервер
		const server = new Hapi.Server();
		server.connection({host,port});

		// Зарегистрируйте все плагины
		server.register(plugins, (err) => {
			if (err) {
				console.error(err);
				return reject(err);
			}

			server.auth.strategy('basic', 'basic', true, { validateFunc: basicAuthValidation });

			// Инициализация рауты
			server.route(routes(server));

			// Настройка того, какие рауты размещают подписки
			subscriptions(server);

			// Начните принимать запросы
			server.start( (err) => {
				if (err) {
					console.error(err);
					return reject(err);
				}

				// Сервер успешно запущен - зарегистрируйте рауты
				console.log(`Server running at: ${server.info.uri}`);
				resolve();
			});

			server.on('request-error', (req, err) => {
				console.error(err);
			});
		});
	});
};

module.exports = {
	start
};

