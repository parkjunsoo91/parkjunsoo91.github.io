'use strict';

document.getElementById('edit').onclick = function() {updateText()};
document.getElementById('share').onclick = function() {exportTree()};
document.getElementById('favorite').onclick = function() {importTree()};

var cy = cytoscape({
	container: document.getElementById('cy'),
	//elements: getPreset(false),
	elements: evaluationSet,
	style: [ // the stylesheet for the graph
	    {
			selector: 'node[type="type1"]', //title
			style: titleNodeStyle,
	    },
	    {
			selector: 'node[type="type2"]', //chapter
			style: chapterNodeStyle,
	    },
	    {
			selector: 'node[type="type3"]', //keyword (limited), made from right toolbar
			style: keywordNodeStyle,
	    },
	    {
			selector: 'node[type="suggestion"]',
			style: suggestionNodeStyle,
	    },
	    {
			selector: 'node[type="type4"]', //descriptions (unlimited), made with right click
			style: descriptionNodeStyle,
	    },
		{
			selector: 'edge[type="default"]',
			style: defaultEdgeStyle,
		},
		{
			selector: 'edge[type="suggestion"]',
			style: suggestionEdgeStyle,
		},
		{
			selector: 'core',
			style: defaultCoreStyle
		}
	],

	layout: {
	    name: 'preset',
	    rows: 1
  	},

	// initial viewport state:
	zoom: 1,
	pan: { x: 0, y: 0 },

  	// interaction options:
	minZoom: 1e-1,
	maxZoom: 1e1,
	zoomingEnabled: true,
	userZoomingEnabled: true,
	panningEnabled: true,
	userPanningEnabled: true,
	boxSelectionEnabled: false,
	selectionType: 'single',
	touchTapThreshold: 8,
	desktopTapThreshold: 4,
	autolock: false,
	autoungrabify: false,
	autounselectify: false,

	// rendering options:
	headless: false,
	styleEnabled: true,
	hideEdgesOnViewport: false,
	hideLabelsOnViewport: false,
	textureOnViewport: false,
	motionBlur: false,
	motionBlurOpacity: 0.2,
	wheelSensitivity: 0.1,
	pixelRatio: 'auto'

});

var achievements = {
	firstEdge: {earned:false, msg:"Congratulations! You just made your first connection between node elements!"},
	firstChapterComplete: {earned:false, msg:"Congratulations! You just completed your first chapter!"},
}
updateProgress();
playLayout();

//global variables
var state = 'normal'
var selected = null;

cy.on('tap', 'node', function(evt){
	var node = evt.target;
	console.log(node.id() + ' selected');

	//edge adding mode
	if (state == 'edge'){
		state = 'normal';
		addEdge(selected.id(), node.id());
	}

	//show text content in UI
	var text = node.data('text');
	var textarea = document.getElementById('textarea')
	textarea.value = text;
	selected = node;
	console.log(node.data())
});

var newIds = 1000;
function newId(){
	newIds += 1;
	return newIds;
}

function reward(achievement, n){
	if (achievements[achievement]['earned'] == false){
		achievements[achievement]['earned'] = true;
		showRewardMsg(achievements[achievement]['msg']);
		increaseNodenum(n);
	}
}

function playLayout(){
	var layout = cy.layout(layoutOptions);
	layout.run();
	setTimeout(function(){
		layout.stop();
	}, 1000)
}

function updateProgress(){
	var chapters = cy.nodes("[type='type2']");
	for (var i=0; i < chapters.length; i++){
		var chapter = chapters[i]
		var progress = chapterProgress(chapter);
		var progressPrev = chapter.data('progress');
		chapter.data('progress', progress);
		chapter.style('background-blacken', -0.6+progress*0.8);
		if (progressPrev != 1 && progress == 1){
			reward('firstChapterComplete', 5);
		}
	}
}

function chapterProgress(node){
	var type3nodes = node.neighborhood("[type='type3']");
	var type4nodes = node.neighborhood("[type='type4']");
	var type3nodesRec3 = type3nodes.neighborhood("[type='type3']");
	var type3nodesRec4 = type3nodes.neighborhood("[type='type4']");
	var children = type3nodes.length + type4nodes.length + type3nodesRec3.length + type3nodesRec4.length;
	var progress = Math.min(1, 0.2 * children);
	return progress;
}

function exportTree(){
	var myObj = cy.json();
	var myJson= JSON.stringify(myObj);
	localStorage.setItem("myTree", myJson);
}

function importTree(){
	var text = localStorage.getItem("myTree");
	var obj = JSON.parse(text);
	cy.json(obj);
	updateProgress();
}

function addNode(pos, type){
	var data = {
		id: newId(),
		type: 'type4',
		text: 'new paragraph',
	};
	if (type == 'suggestion'){
		data['type'] = 'suggestion';
	}
	var ele = cy.add({
  		group:'nodes',
    	data: data,
    	position: {
          x: pos.x,
          y: pos.y
      	},
  	});
  	return ele;
}

function addEdge(id1, id2, type){
	var data = {
		id: newId(),
		type: 'default',
		source: id1,
		target: id2,
	};
	if (type == 'suggestion'){
		data['type'] = 'suggestion';
	}
	var ele = cy.add({
		group: 'edges',
		data: data,
	});
	reward('firstEdge');
	updateProgress();
	return ele;
}

function removeElement(ele){
	ele.remove();
	if (ele.data('type') == 'type3'){
		increaseNodenum();
	}
	updateProgress();
}




function updateText(){
	if (selected == null){
		return;
	}
	var text = document.getElementById('textarea').value;
	console.log(text)
	selected.data('text', text);
	handleSuggestion(selected);
}

function handleSuggestion(node){
	var text = node.data('text');
	Object.keys(suggestMap).forEach(function(key,index) {
    // key: the name of the object key
    // index: the ordinal position of the key within the object
	    if (text.search(key) != -1){
	    	var newtext = suggestMap[key]
	    	var pos = node.position();
	    	var newNode = addNode({x:pos.x, y:pos.y-100}, 'suggestion');
	    	newNode.data('text', newtext);
	    	addEdge(node.id(), newNode.id(), 'suggestion')
	    	addQtip(newNode);
	    }
	});
}

function showRewardMsg(msg){
	var x = document.getElementById('cardReward');
	if (x.style.display === 'none'){
		x.style.display = 'block';
	}
	document.getElementById('rewardMsg').innerHTML = msg;
}


function addPredefinedNode(){

  if(document.getElementById('nodenum').value == 0) {
    var x = document.getElementById('cardError');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    }
    return;
  }

  var data = {
		id: newId(),
		type: 'type3',
		text: 'new keyword'
	};
	var ele = cy.add({
  		group:'nodes',
    	data: data,
    	position: {
          x: 0,
          y: 0
      	}
  	});

    decreaseNodenum();
}

function increaseNodenum(n){
	console.log(n)
	var resource = parseInt(document.getElementById('nodenum').value);
	if (n == undefined){
		n = 1;
	}
	resource += n;
	document.getElementById('nodenum').value = resource;
}

function decreaseNodenum(){
	var resource = document.getElementById('nodenum').value;
	if(resource == 0) {
	  return;
	}
	resource -= 1;
	document.getElementById('nodenum').value = resource;
}

function addFruit(){

  if(document.getElementById('fruitnum').value == 0) {
    return;
  }

	var img = document.createElement('img');
  img.src = "images/fruit2.png";
  img.style = "height:50px";

  var src = document.getElementById("fspawn_p");
  src.appendChild(img);

  decreaseFruitnum();
}

function decreaseFruitnum(){
    var resource = document.getElementById('fruitnum').value;
    if(resource == 0) {
      return;
    }
    resource -= 1;
    document.getElementById('fruitnum').value = resource;
}

function addSun(){

  if(document.getElementById('sunnum').value == 0) {
    return;
  }

	var img = document.createElement('img');
  img.src = "images/sun4.png";
  img.style = "height:100px";

  var src = document.getElementById("sspawn_p");
  src.appendChild(img);

  decreaseSunnum();
}

function decreaseSunnum(){
    var resource = document.getElementById('sunnum').value;
    if(resource == 0) {
      return;
    }
    resource -= 1;
    document.getElementById('sunnum').value = resource;
}

cy.on('tap', function(event){
	var evtTarget = event.target;
	if (evtTarget == cy) {
		console.log('background tap')
	} else {
		console.log('tap on some element')
	}
});



function addQtip(ele){
	ele.qtip({
		content: 'do you like the suggestion? You can ACCEPT the suggestion.',
		position: {
		    my: 'top center',
		    at: 'bottom center'
	  	},
	  	style: {
		    classes: 'qtip-bootstrap',
		    tip: {
				width: 16,
				height: 8
		    }
  		}
  	});
}

cy.contextMenus({
	menuItems: [

	    {
	        id: 'accept-suggestion',
	        content: 'accept suggestion',
	        tooltipText: 'add suggested node to your tree',
	        selector: 'node[type="suggestion"]',
	        onClickFunction: function (event) {
	          var target = event.target || event.cyTarget;
	          if(document.getElementById('nodenum').value == 0) {
			    return;
			  }
			  target.data('type', 'type3');
			  var edges = target.connectedEdges();
			  for (var i=0; i < edges.length; i++){
			  	edges[i].data('type', 'default');
			  }
			  decreaseNodenum();
	        },
	        hasTrailingDivider: true
		},
		{
	        id: 'add-node',
	        content: 'add node',
	        tooltipText: 'add node',
	        image: {src : "images/add.svg", width : 12, height : 12, x : 6, y : 4},
	        coreAsWell: true,
	        onClickFunction: function (event) {
				var pos = event.position || event.cyPosition;
		        addNode(pos);
	        }
	    },
	    {
	    	id: 'add-connected-node',
	    	content: 'add connected node',
	    	tooltipText: 'create a node connected to this node',
	    	image: {src : "images/add.svg", width : 12, height : 12, x : 6, y : 4},
	    	selector: 'node',
	    	onClickFunction: function(event) {
	    		var target = event.target || event.cyTarget;
	    		var pos = event.position || event.cyPosition;
	    		var newNode = addNode(pos);
	    		addEdge(target.id(), newNode.id());
	    	}
	    },
	    {
	    	id: 'add-edge',
	    	content: 'add edge',
	    	tooltipText: 'add an edge connecting to another node',
	    	image: {src : "images/add.svg", width : 12, height : 12, x : 6, y : 4},
	    	selector: 'node',
	    	onClickFunction: function(event) {
	    		var target = event.target || event.cyTarget;
	    		//TBD: change game state to edge addition state, and possibly show edge following cursor
	    		state = 'edge';
	    		selected = event.target;
	    	}
	    },
	    {
	        id: 'hide',
	        content: 'hide',
	        tooltipText: 'hide',
	        selector: 'node[type="type4"]',
	        onClickFunction: function (event) {
	          var target = event.target || event.cyTarget;
	          target.data('hidden', true);
	          target.style({'label':'-'});
	        },
	        disabled: false,
		},
		{
	        id: 'unhide',
	        content: 'unhide',
	        tooltipText: 'unhide',
	        selector: 'node[type="type4"]',
	        onClickFunction: function (event) {
	          var target = event.target || event.cyTarget;
	          target.data('hidden', false);
	          target.style({'label': target.data('text')});
	        },
	        disabled: false,
	        hasTrailingDivider: true
		},
	    {
	        id: 'remove',
	        content: 'remove',
	        tooltipText: 'remove',
	        image: {src : "images/remove.svg", width : 12, height : 12, x : 6, y : 4},
	        selector: 'node, edge',
	        onClickFunction: function (event) {
	          var target = event.target || event.cyTarget;
	          removeElement(target);
	        }
		},
	    {
	        id: 'remove-selected',
	        content: 'remove selected',
	        tooltipText: 'remove selected',
	        image: {src : "images/remove.svg", width : 12, height : 12, x : 6, y : 6},
	        coreAsWell: true,
	        onClickFunction: function (event) {
	          cy.$(':selected').remove();
	        }
	    },
	]
});

//help button
// Get the modal
var modal = document.getElementById("helpModal");

// Get the button that opens the modal
var btn = document.getElementById("helpbtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
