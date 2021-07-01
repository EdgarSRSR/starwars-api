'use strict';

// See: https://github.com/hapijs/good

module.exports = {
	register: require('good'),
	options: {
		reporters: {
			console: [{
				module: 'good-squeeze',
				name: 'Squeeze',
				args: [{
					// Log everything
					log: '*',
					response: ['api', 'ops']
				}]
			},{
				module: 'good-console'
			}, 'stdout']
		}
	}
};