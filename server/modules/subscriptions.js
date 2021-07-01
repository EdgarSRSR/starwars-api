'use strict';

// See: https://github.com/hapijs/nes

const Hoek = require('hoek'),
	routes = require('../init/routes');

module.exports = (server) => {
	const socketTaggedRoutes = server.table()[0].table
		.filter(route => route.settings.tags && Hoek.contain(route.settings.tags, 'socket'))
		.map(route => route.path);
	socketTaggedRoutes.forEach(path => {
		server.subscription(path);
		console.log(`Registered subscription for path ${path}`)
	});
};