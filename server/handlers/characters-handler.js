'use strict';

const joi = require('joi'),
	boom = require('boom'),
	swapi = require('../data/swapi'),
	transform = require('../transforms/characters-transform');

// персонажи
const getAllCharacters = (request, reply) => {
	const { page, limit, sort } =  request.query;
	swapi.characters(page, limit, sort)
		.then(data => transform.characters(data))
		.then(data => reply(data))
		.catch((err = new Error()) => {
			return reply(boom.wrap(err));
		});
};

// Schema: персонажи
const getCharacterByName = (request, reply) => {
	swapi.character(request.params.name)
		.then(data => transform.character(data))
		.then(data => reply(data))
		.catch((err = new Error()) => {
			return reply(boom.wrap(err));
		});
};

const schema = {
	character: joi.object().keys({
		id: joi
			.number()
			.required()
			.integer()
			.min(0)
			.description('идентификатор персонажа')
			.example(1),
		name: joi
			.string()
			.required()
			.description('имя персонажа')
			.example('Luke'),
		birth: joi
			.string()
			.required()
			.description('год рождения персонажа')
			.example('19BBY'),
		gender: joi
			.string()
			.required()
			.valid('мужчина','female','n/a')
			.description('пол персонажа')
			.example('мужчина'),
		home: joi
			.string()
			.required()
			.description('дом персонажа')
			.example('Tatooine'),
		films: joi
			.array()
			.items(
				joi
				.string()
				.required()
				.description('название фильма')
				.example('Revenge of the Sith')
			)
	}).label('персонаж'),
	// Using a getter here so that I can refer to `this`, in reference to the character node of the schema object
	get characters () {
		return joi
			.array()
			.items(this.character)
			.label('list_of_characters')
	}
};

module.exports = {
	getAllCharacters,
	getCharacterByName,
	schema
};