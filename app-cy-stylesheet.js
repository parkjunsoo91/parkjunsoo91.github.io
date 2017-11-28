'use strict';

var defaultNodeStyle = {
	//node body
	//shape
	'width': 'label',
	'height': 'label',
	'shape': 'rectangle',
	//background
	'background-color': '#000',
	//border
	'border-width': 2,
	'border-style': 'solid',
	'border-color': '#663300',
	//padding
	'padding': '10px',
	//labels
	//label text
	'label': 'data(text)',
	//basic font styling
	'color': 'black',
	'font-size': 16,
	//wrapping text
	'text-wrap': 'wrap',
	'text-max-width': 400,
	//node label alignment
	'text-valign': 'center',
	'text-halign': 'center',
};

var titleNodeStyle = Object.assign({}, defaultNodeStyle);
titleNodeStyle['background-color'] = '#F88';
titleNodeStyle['font-size'] = 24;
titleNodeStyle['text-transform'] = 'uppercase'

var chapterNodeStyle = Object.assign({}, defaultNodeStyle);
chapterNodeStyle['background-color'] = '#663300';
chapterNodeStyle['color'] = 'white';

var keywordNodeStyle = Object.assign({}, defaultNodeStyle);
keywordNodeStyle['background-color'] = 'green';
keywordNodeStyle['background-blacken'] = -0.6;
keywordNodeStyle['shape'] = 'roundrectangle';
keywordNodeStyle['font-size'] = 20;


var suggestionNodeStyle = Object.assign({}, defaultNodeStyle);
suggestionNodeStyle['background-color'] = 'blue';
suggestionNodeStyle['shape'] = 'ellipse';
suggestionNodeStyle['border-opacity'] = 0.2;
suggestionNodeStyle['background-opacity'] = 0.3;


var descriptionNodeStyle = Object.assign({}, defaultNodeStyle);
descriptionNodeStyle['background-color'] = 'yellow';
descriptionNodeStyle['background-blacken'] = -0.6;


var defaultEdgeStyle = {
	'width': 5,
	'curve-style': 'haystack',
	'haystack-radius': 0,
	'line-color': '#a62',
	'line-style': 'solid',
	'target-arrow-color': '#0f0',
	'target-arrow-shape': 'triangle',
};

var suggestionEdgeStyle = Object.assign({}, defaultEdgeStyle);
suggestionEdgeStyle['line-style'] = 'dashed';
suggestionEdgeStyle['opacity'] = 0.5;



var defaultCoreStyle = {
	'active-bg-color': 'blue'
};
