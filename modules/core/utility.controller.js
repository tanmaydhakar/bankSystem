const Json2csvParser = require('json2csv').Parser;

//to convert json to csv
exports.jsonToCSV = function (data) {
	var fLine = data[0];
	var csvHeader = [];
	for (element in fLine) {
		csvHeader.push(element);
	}
	const parser = new Json2csvParser({
		csvHeader
	});
	const csvFile = parser.parse(data);
	return csvFile;
};