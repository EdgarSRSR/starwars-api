'use strict';

// See: https://github.com/gabaroar/hapi-cors

module.exports = {
	register: require('hapi-cors'),
	options: {
		origins: ['*'],
		allowCredentials: 'true',
		exposeHeaders: ['content-type', 'content-length', 'api-version'],
		maxAge: 600,
		methods: ['POST, GET, OPTIONS, DELETE, PUT'],
		headers: ['Accept', 'Content-Type', 'Authorization', 'api-version']
	}
};