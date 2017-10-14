var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var _ = require("underscore");
var github = require("./github.js");


// Which person is assigned to most to issues?
function findMostFrequentAssignee(user, repo)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues) 
		{
			var names = _.pluck(issues,"assignee")
			var frequency = _.countBy(names, function (name) { return name; });
			var max = _.max(_.keys(frequency), function(item){ return frequency[item] })
			resolve({ userName: max, count: frequency[max] });
		});
	});
}

// How many closed issues?
function countClosed(user, repo)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues) 
		{			
			var closed = _.where(issues, { state: "closed" })
			resolve(closed.length);
		});
	});
}

// How many words in an issue's title versus an issue's body?
function titleBodyWordCountRatio(user, repo, number)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getAnIssue(user, repo, number).then(function (issue) 
		{
			var titleWords = issue.title.split(/\W+|\d+/).length;
			var bodyWords  = issue.body.split(/\W+|\d+/);

			// HINT: http://stackoverflow.com/questions/4964484/why-does-split-on-an-empty-string-return-a-non-empty-array

			if ( issue.body == "" )
			{
				resolve("NA")
			}

			var bodyWords = bodyWords.length;		
			var str = ( titleWords / bodyWords ) + "";
			resolve(str);
		});
	});
}

function maxStars(user, repo)
{
	return new Promise(function (resolve, reject)
	{
		github.getStargazers(user, repo).then(function (stargazers)
		{
			var max = _.max(stargazers, function(user) { return user.stargazers_count } )
			resolve({ userName: max.name, count: max.stargazers_count });
		});
	});
}

exports.findMostFrequentAssignee = findMostFrequentAssignee;
exports.countClosed = countClosed;
exports.titleBodyWordCountRatio = titleBodyWordCountRatio;
exports.maxStars = maxStars;
