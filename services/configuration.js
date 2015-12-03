var g = 0;

module.exports = {

	load: function() {
		return g;
	},

	save: function() {
		g++;
	}

};
