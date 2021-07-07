'use strict';

const boom = require('boom'),
	joi = require('joi'),
	swapi = require('../data/swapi'),
	transform = require('../transforms/planets-transform');

// Schema: planets
const getAllPlanets = (request, reply) => {
	swapi.residents()
		.then(data => reply(data))
		.catch((err = new Error()) => {
			return reply(boom.wrap(err));
		});
};

// Schema: planetsV2
const getAllPlanetsAndFetchUrls = (request, reply) => {
	swapi.residents()
		.then(data => transform.planets(data))
		.then(data => reply(data))
		.catch((err = new Error()) => {
			return reply(boom.wrap(err));
		});
};

const schema = {
	planet: joi.object().keys({
			climate: joi
				.string()
				.required()
				.description('климат планеты')
				.example('Засушливый'),
			diameter: joi
				.string()
				.required()
				.description('диаметр планеты')
				.example('10465'),
			films: joi
				.array()
				.items(
					joi
					.string()
					.uri()
					.description('uri for film')
					.example('http://swapi.co/api/films/1/')
				).label('url'),
			gravity: joi
				.string()
				.required()
				.description('гравитация планеты')
				.example('1'),
			name: joi
				.string()
				.required()
				.description('название планеты')
				.example('Tatooine'),
			orbital_period: joi
				.string()
				.required()
				.description('орбитальный период планеты')
				.example('304'),
			population: joi
				.string()
				.required()
				.description('население планеты')
				.example('120000'),
			residents: joi
				.array()
				.items(
					joi
					.string()
					.uri()
					.description('uri for character')
					.example('http://swapi.co/api/people/1/')
				).label('url'),
			rotation_period: joi
				.string()
				.required()
				.description('период вращения планеты')
				.example('23'),
			surface_water: joi
				.string()
				.required()
				.description('поверхностные воды планеты')
				.example('1'),
			terrain: joi
				.string()
				.required()
				.description('рельеф планеты')
				.example('Пустыня')
		}).unknown(true).label('планета'),
	
	get planets () {
		return joi
			.array()
			.items(this.planet)
			.label('list_of_planets')
	}
};

module.exports = {
	getAllPlanets,
	getAllPlanetsAndFetchUrls,
	schema
};