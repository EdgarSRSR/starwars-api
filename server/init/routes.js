'use strict';

const joi = require('joi'),
	handlers = require('../handlers'),
	auth = require('../modules/auth');

// Passing in server, mostly to deal with server.publish in the different handlers
const routes = (server) => [{
	method: 'GET',
	path: '/api/v1/characters',
	config: {
		handler: handlers.characters.getAllCharacters,
		description: 'Получает всех персонажей "Звездных войн"',
		tags: ['api', 'v1', 'starwars'],
		validate: {
			query: {
				page: joi
					.number()
					.integer()
					.min(0)
					.default(1)
					.description('номер страницы результатов'),
				limit: joi
					.number()
					.integer()
					.min(0)
					.default(10)
					.description('количество результатов для отображения на странице'),
				sort: joi
					.string()
					.default("имя")
					.description('ключ для сортировки результатов')
			}
		},
		response: {
			schema: handlers.characters.schema.characters
		}
	}
},{
	method: 'GET',
	path: '/api/v1/character/{name}',
	config: {
		handler: handlers.characters.getCharacterByName,
		description: 'Получает информацию об одном персонаже "Звездных войн"',
		tags: ['api', 'v1', 'starwars'],
		validate: {
			params: {
				name: joi
					.string()
					.required()
					.description('имя персонажа "Звездных войн"')
			}
		},
		response: {
			schema: handlers.characters.schema.character
		}
	}
},{
	method: 'GET',
	path: '/api/v1/planets',
	config: {
		handler: handlers.planets.getAllPlanets,
		description: 'Получает все планеты Звездных войн',
		tags: ['api', 'v1', 'starwars'],
		response: {
			schema: handlers.planets.schema.planets
		}
	}
},{
	method: 'GET',
	path: '/api/v2/planets',
	config: {
		handler: handlers.planets.getAllPlanetsAndFetchUrls,
		description: 'Получает все планеты Звездных войн и меняет URL-адреса на полезные данные',
		tags: ['api', 'v2', 'starwars'],
		response: {
			schema: handlers.planets.schema.planetsV2
		}
	}
},{
	method: 'GET',
	path: '/api/v1/user',
	config: {
		handler: handlers.user.getUser,
		description: 'Получить объект пользователя из базы данных',
		tags: ['api', 'v1', 'user'],
		validate: {
			query: {
				username: joi
					.string()
					.required()
					.description('имя пользователя'),
				password: joi
					.string()
					.required()
					.description('пароль')
			}
		},
		response: {
			schema: handlers.user.schema.user
		},
		auth: false
	}
},{
	method: 'POST',
	path: '/api/v1/user',
	config: {
		handler: handlers.user.newUser,
		description: 'Опубликуйте новый объект пользователя в базе данных',
		tags: ['api', 'v1', 'user'],
		validate: {
			payload: {
				username: joi
					.string()
					.required()
					.description('username'),
				password: joi
					.string()
					.required()
					.description('password'),
				scope: joi
					.string()
					.valid(auth.scopes)
					.description('scope')
			}
		},
		response: {
			schema: handlers.user.schema.user
		},
		// Разрешить доступ к этому маршруту только администраторам.
		auth: {
			scope: ['ADMIN']
		}
	}
},{
	method: 'GET',
	path: '/api/v1/vote/{id}',
	config: {
		handler: handlers.votes.getVotesForCharacterById,
		description: 'Получает все голоса за персонажа из "Звездных войн"',
		tags: ['api', 'v1', 'vote', 'socket'],
		validate: {
			params: {
				id: joi
					.string()
					.required()
					.description('идентификатор персонажа "звездных войн')
			}
		},
		response: {
			schema: handlers.votes.schema.get
		}
	}
},{
	method: 'DELETE',
	path: '/api/v1/vote/{id}',
	config: {
		handler: handlers.votes.deleteVoteForCharacterById,
		description: 'Удаляет голос пользователя за персонажа из "Звездных войн"',
		tags: ['api', 'v1', 'vote'],
		validate: {
			params: {
				id: joi
					.string()
					.required()
					.description('идентификатор персонажа "звездных войн')
					.example('1')
			}
		},
		response: {
			schema: handlers.votes.schema.delete
		}
	}
},{
	method: 'POST',
	path: '/api/v1/vote/{id}',
	config: {
		handler: handlers.votes.postVoteForCharacterById(server),
		description: 'Опубликуйте голосование пользователя за персонажа из "Звездных войн"',
		tags: ['api', 'v1', 'vote'],
		validate: {
			params: {
				id: joi
					.string()
					.required()
					.description('идентификатор персонажа "звездных войн')
			},
			payload: {
				type: joi
					.string()
					.valid('up','down')
					.required()
					.description('это голосование за или против')
			}
		},
		response: {
			schema: handlers.votes.schema.post
		}
	}
}];

module.exports = routes;