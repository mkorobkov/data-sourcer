'use strict';

var expect = require('chai').expect;

var DataSourcer = require('../../index');

describe('prepareSourceOptions(name[, options])', function() {

	var dataSourcer;

	before(function() {
		dataSourcer = new DataSourcer();
	});

	it('should be a function', function() {
		expect(dataSourcer.prepareSourceOptions).to.be.a('function');
	});

	it('should return an options object for a source', function() {

		var name = 'somewhere';
		var options = {
			sourcesWhiteList: [ 'somewhere' ],
			sourcesBlackList: [ 'other' ],
			requestQueue: {
				concurrency: 1,
				delay: 0
			},
			filter: {
				include: {
					someField: ['1']
				}
			},
			sourceOptions: {
				somewhere: {
					some: 'option'
				},
				another: {
					option: 1
				}
			}
		};

		var sourceOptions = dataSourcer.prepareSourceOptions(name, options);

		// Check for options that should have been omitted.
		expect(sourceOptions.sourcesWhiteList).to.be.undefined;
		expect(sourceOptions.sourcesBlackList).to.be.undefined;
		expect(sourceOptions.requestQueue).to.be.undefined;

		// Check for options that should be kept.
		expect(sourceOptions.filter).to.deep.equal(options.filter);

		// Check for options that should have been added.
		expect(sourceOptions.request).to.be.a('function');

		// Test for mutating options.
		sourceOptions.test = 'change';
		sourceOptions.filter.include.someField = ['2'];
		expect(sourceOptions.filter.include.someField).to.not.deep.equal(options.filter.include.someField);

		// Check for name-spaced sourceOptions.
		expect(sourceOptions.sourceOptions).to.not.be.undefined;
		expect(sourceOptions.sourceOptions['somewhere']).to.not.be.undefined;
		expect(sourceOptions.sourceOptions['another']).to.be.undefined;
	});
});