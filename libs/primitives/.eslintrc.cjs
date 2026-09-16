const config = require('../../.eslintrc.cjs');

module.exports = {
	...config,
	overrides: [
		...(config.overrides || []),
		{
			files: ['src/test/helpers/**/*.ts'],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
};
