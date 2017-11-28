'use strict';

var id = 0

function presetnewId(){
	id += 1;
	return id
}

var chapters = [
'What is Gamification and\ngamification research?',
'Does gamification work?',
'Effective gamification \ndesign and ethical \nconsiderations',
'Motivation Theory',
'Engagement and\n Fun Theory',
'Behavioral \nEconomics Theory',
]

var evaluationSet = [
	{
		data: { 
			id: presetnewId(), 
			type:'type1', 
			text:'5분 사탐', 
		},
		position: {x: 0, y: 0}
	},
	{
		data: { 
			id: presetnewId(), 
			type:'type2', 
			text:'이슬람교', 
		},
		position: {x: 100, y: -100}
	},
	{
		data: { 
			id: presetnewId(), 
			type:'type2', 
			text:'우상론과 베이컨', 
		},
		position: {x: -100, y: -100}
	},
	{
		data: { 
			id: presetnewId(), 
			type:'default', 
			source: 1,
			target: 2,
		},
	},
	{
		data: { 
			id: presetnewId(), 
			type:'default', 
			source: 1,
			target: 3, 
		},
	},
]

var initialElements = [{
		data: { 
			id: presetnewId(), 
			type:'type1', 
			text:'Game\nStudies' 
		},
		position: {x: 0, y: 0}
	}]

function getPreset(filled){
	for (var i = 0; i < chapters.length; i++) {
		var element = {
			data: {
				id: presetnewId(),
				type: 'type2',
				text: chapters[i],
				progress: 0.0,
			},
			position: {x:0, y:-50 * (i+1)},

		};
		initialElements.push(element);
	}

	for (var i = 0; i < chapters.length; i++) {
		var element = {data: {
			id: presetnewId(),
			type: 'default',
			source: i+1,
			target: i+2,
		}};
		initialElements.push(element);
	}


	if (filled == true){
		
		var tempId;

		tempId = addInitialNode('type3', 'Service System');
		addInitialEdge(tempId, findInitialElementId('type2', 'What is Gamification'))
		tempId = addInitialNode('type3', 'Affordance');
		addInitialEdge(tempId, findInitialElementId('type3', 'Service System'))

		tempId = addInitialNode('type3', 'Gamification\nresearch');
		addInitialEdge(tempId, findInitialElementId('type2', 'Does gamification'))
		tempId = addInitialNode('type3', 'Goal Setting\nTheory');
		addInitialEdge(tempId, findInitialElementId('type3', 'research'))

		tempId = addInitialNode('type4', "In game studies, games have been defined in terms of a set of necessary conditions. These conditions can be divided into systemic and experiential conditions. This approach is compatible with service marketing theory, which emphasizes customer’s role as co-producer of the service and which can be used also for marketing of goods and products.")
		addInitialEdge(tempId, findInitialElementId('type3', 'Service System'));
		tempId = addInitialNode('type4', "The affordances of the environment are what it offers the animal, what it provides or furnishes, either for good or ill. The verb to afford is found in the dictionary, the noun affordance is not. I have made it up. I mean by it something that refers to both the environment and the animal in a way that no existing term does. It implies the complementarity of the animal and the environment.")
		addInitialEdge(tempId, findInitialElementId('type3', 'Affordance'));
		tempId = addInitialNode('type4', "The willingness to work towards attainment of goal is main source of job motivation. Clear, particular and difficult goals are greater motivating factors than easy, general and vague goals.")
		addInitialEdge(tempId, findInitialElementId('type3', 'Goal Setting'));
	}
	return initialElements
}


function addInitialNode(type, text){
	var data = {
			id: presetnewId(),
			type: type,
			text: text,
		} 
	initialElements.push({
		data: data
	});
	return data['id'];
};


function addInitialEdge(id1, id2)
{
	var data = {
		id: presetnewId(),
		type: 'default',
		source: id1,
		target: id2,
	}
	initialElements.push({data:data});
	return data['id'];
}

function findInitialElementId(type, str){
	var id = '-1'
	for (var i=0; i < initialElements.length; i++){
		var data = initialElements[i]['data'];
		if (data['type'] == type && data['text'].search(str) != -1){
			id = data['id'];
			break;
		}
	}
	return id;
}

//TBD: add recommendation presets: map "definition" keyword with the recommended defs. render them.
var suggestions = [
"Huotari's definition\nof gamification",

];

var suggestMap = {
	'definition': suggestions[0]
};