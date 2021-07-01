'use strict';

// See: https://github.com/glennjones/hapi-swagger

const pkg = require('../../package.json');

module.exports = {
	register: require('hapi-swagger'),
	options: {
		info: {
			title: 'hapi-swagger-training documentation',
			description: `
This API is to demo various aspects of Hapi, Swagger, Nes, etc.
To see all routes, [click here](/).
To see V1 routes only, [click here](/?tags=v1).
To see V2 routes only, [click here](/?tags=v2).
To view the swagger.json, [click here](/swagger.json).
				`,
			version: pkg.version,
			contact: {
				name: 'Clint Goodman',
				url: 'https://cgwebsites.net/'
			},
			license: {
				name: pkg.license
			}
		},
		documentationPath: '/',
		jsonEditor: true,
		tags: [{
			'name': 'starwars',
			'description': 'working with star wars data'
		},{
			'name': 'vote',
			'description': 'working with voting'
		},{
			'name': 'user',
			'description': 'working with users'
		}],
		pathPrefixSize: 2,
		basePath: '/api/',
		pathReplacements: [{
			replaceIn: 'groups',
			pattern: /v([0-9]+)\//,
			replacement: ''
		},{
			replaceIn: 'groups',
			pattern: /s$/,
			replacement: ''
		},{
			replaceIn: 'groups',
			pattern: /\/(character|planet)/,
			replacement: '/starwars'
		}]
	}
};