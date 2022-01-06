module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/recommended'
	],
	rules: {
		'comma-dangle': [ 2, 'always-multiline' ],
		'semi': [ 2, 'always' ],
		'curly': [ 2, 'multi-line' ],
		'space-before-function-paren': [ 2, 'always' ],
		'no-tabs': 0,
		'no-console': 0,
		'sort-vars': 2,
		'dot-notation': 0,

		'vue/html-indent': [ 2, 'tab' ],
		'vue/singleline-html-element-content-newline': 0,
		'vue/no-v-html': 0,
		'vue/order-in-components': 0,

		'nuxt/no-cjs-in-config': 'off',
	}
}
