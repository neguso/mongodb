var fs = require('fs');
var path = require('path');

exports.Resources = {

	/**
	 * Creates a public resource.
	 * @param {string|Buffer} data
	 * @param {string} extension - File extension.
	 * @returns {string} A key used to identify the resource.
	 */
	store: function(data, extension) {
		//todo
	},

	/**
	 * Load resource content.
	 * @param {string} key
	 * @returns {string|Buffer} Returns the resource content.
	 */
	load: function(key) {
		//todo
	},

	/**
	 * Update resource content.
	 * @param {string} key
	 * @param {string,Buffer} data
	 */
	update: function(key, data) {
		//todo
	},

	/**
	 * Remove resources.
	 * @param {string,string[]} keys
	 */
	remove: function(keys) {
		//todo
	},

	/**
	 * Get the local path for a resource.
	 * @param {string} key
	 * @returns Returns the file path for a resource.
	 */
	path: function(key) {
		//todo
		return 'file';
	},

	/**
	 * Get the URL for a resource.
	 * @param key
	 * @returns {string} URL
	 */
	url: function(key) {
		//todo
		return 'url';
	}

};
