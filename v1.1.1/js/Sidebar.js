/**********************************

SIDEBAR CODE

**********************************/

function Sidebar(loopy){

	var self = this;
	
	Sidebar.COLOR_SLIDER_OPTIONS = {
		0 : "colorRainbow",
		1 : "colorTol",
		2 : "colorWong"}

	PageUI.call(self, document.getElementById("sidebar"));

	// Edit
	self.edit = function(object){
		self.showPage(object._CLASS_);
		self.currentPage.edit(object);
	};

	// Go back to main when the thing you're editing is killed
	subscribe("kill",function(object){
		if(self.currentPage.target==object){
			self.showPage("Edit");
		}
	});

	////////////////////////////////////////////////////////////////////////////////////////////
	// ACTUAL PAGES ////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////

	// Node!
	(function(){
		var page = new SidebarPage();

		backToTopButton(self, page);

		page.addComponent("label", new ComponentInput({
			label: "<br><br>Name:"
			//label: "Name:"
		}));
		page.addComponent("hue", new ComponentSlider({
			bg: "colorRainbow",
			label: "Color:",
			options: [0,1,2,3,4,5],
			oninput: function(value){
				Node.defaultHue = value;
			}
		}));
		page.addComponent("shape", new ComponentSlider({
			bg: "shape",
			label: "Shape of point on graph",
			options: ["circle","triangle","rect","rectRot","star","cross","crossRot"],
			oninput: function(value){
				Node.defaultShape = value;
			}

		}));
		page.addComponent("init", new ComponentSlider({
			bg: "initial",
			label: "Start Amount:",
			options: [0, 0.16, 0.33, 0.50, 0.66, 0.83, 1],
			//options: [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1],
			oninput: function(value){
				Node.defaultValue = value;
			}
		}));
		page.addComponent("explodes",new ComponentSlider({
			bg: "explodes",
			label: "Explodes:",
			value: true,
			options: [false, true],
			oninput: function(value) {
				console.log("DOES Explode?: " + value);
			}
		}));
		page.addComponent("explodeUpperThreshold", new ComponentSlider({
			bg: "explodeUpper",
			label: "Exploding Upper Bound:",
			options: [1, 5, 10, 25, 100, 1000, 2147483647],
			oninput: function(value){
				Node.defaultValue = value;
			}
		}));
		page.addComponent("explodeLowerThreshold", new ComponentSlider({
			bg: "explodeLower",
			label: "Exploding Lower Bound:",
			options: [0, -1, -5, -10, -100, -1000, -2147483648],
			//options: [0, 1, 5, 10, 100, 1000, 2147483647],
			oninput: function(value){
				Node.defaultValue = value;
			}
		}));
		page.onedit = function(){

			// Set color of Slider
			var node = page.target;
			var color = Node.COLOR_SETS[node.palette][node.hue];
			page.getComponent("init").setBGColor(color);
			page.getComponent("shape").setBGColor(color);
			page.getComponent("explodeUpperThreshold").setBGColor(color);
			page.getComponent("explodeLowerThreshold").setBGColor(color);

			// Focus on the name field IF IT'S "" or "?"
			var name = node.label;
			if(name=="" || name=="?") page.getComponent("label").select();

		};
		deleteMeButton(self, page, "delete node");
		self.addPage("Node", page);
	})();

	// Edge!
	(function(){
		var page = new SidebarPage();
		backToTopButton(self, page);

		page.addComponent("strength", new ComponentSlider({
			bg: "strength",
			label: "<br><br>Relationship:",
			//label: "Relationship:",
			options: [1, -1],
			oninput: function(value){
				Edge.defaultStrength = value;
			}
		}));
		page.addComponent(new ComponentHTML({
			html: "(to make a stronger relationship, draw multiple arrows!)<br><br>"+
			"(to make a delayed relationship, draw longer arrows)"
		}));
		deleteMeButton(self, page, "delete arrow");
		self.addPage("Edge", page);
	})();

	// Label!
	(function(){
		var page = new SidebarPage();
		backToTopButton(self, page);

		page.addComponent("text", new ComponentInput({
			label: "<br><br>Label:",
			//label: "Label:",
			textarea: true
		}));
		page.onshow = function(){
			// Focus on the text field
			page.getComponent("text").select();
		};
		page.onhide = function(){
			
			// If you'd just edited it...
			var label = page.target;
			if(!page.target) return;

			// If text is "" or all spaces, DELETE.
			var text = label.text;
			if(/^\s*$/.test(text)){
				// that was all whitespace, KILL.
				page.target = null;
				label.kill();
			}

		};
		deleteMeButton(self, page, "delete label");
		self.addPage("Label", page);
	})();

	// Graph!
	(function(){
		var page = new SidebarPage();

		backToTopButton(self, page);
		page.addComponent(new ComponentHTML({
			html: "<br><br>You can move the graph by simply clicking and dragging anywhere on it!<br><br>" + 
			"To change whether the graph is displaying, click the \"Toggle graph visibility\" button in the top menu.",
		}));
		page.addComponent("timeWindow", new ComponentSlider({
			bg: "graphTime",
			label: "Time window length (seconds):",
			options: [5, 10, 15, 20, 25, 30, 45],
			oninput: function(value) {
				NodeGraph.defaultTimeWindow = value;
			}
		}));
		page.addComponent("graphH", new ComponentSlider({
			bg: "graphSize",
			label: "Vertical graph size",
			options: [262, 350, 525, 700],
			oninput: function(value) {
				NodeGraph.defaultHeight = value;
				publish("graph/resize");
			}
		}));
		page.addComponent("graphW", new ComponentSlider({
			bg: "graphSize",
			label: "Horizontal graph size",
			options: [300, 400, 600, 800],
			oninput: function(value) {
				NodeGraph.defaultWidth = value;
				publish("graph/resize");
			}
		}));
		page.onedit = function() {
			page.getComponent("timeWindow").setBGColor("#000000");
		}
		self.addPage("Graph", page);
	})();

	// Edit
	(function(){
		var page = new SidebarPage();
		page.addComponent(new ComponentHTML({
			html: ""+
			
			"<b style='font-size:1.4em'>LOOPY</b> (v1.1.1)<br>a tool for thinking in systems<br><br>"+

			"<span class='mini_button' onclick='publish(\"modal\",[\"examples\"])'>see examples</span> "+
			"<span class='mini_button' onclick='publish(\"modal\",[\"howto\"])'>how to</span> "+
			"<span class='mini_button' onclick='publish(\"modal\",[\"credits\"])'>credits</span><br><br>"+

			"<hr/><br>"+

			// "<span class='mini_button' onclick='publish(\"debug/toggle\")'>toggle debug values</span> <br><br>"+
			"<span class='mini_button' onclick='publish(\"model/resetZoom\")'>reset zoom</span> <br><br>"+
			"<span class='mini_button' onclick='publish(\"graph/toggleVisible\")'>toggle Graph visibility</span> <br><br>"+
			"Color Palette: <br>" +
			"<span class='mini_button' onclick='publish(\"node/changeColor\",[0])'>Rainbow</span> "+
			"<span class='mini_button' onclick='publish(\"node/changeColor\",[1])',>Tol</span> "+
			"<span class='mini_button' onclick='publish(\"node/changeColor\",[2])'>Wong</span><br><br>"+
			"<span class='mini_button' onclick='publish(\"modal\",[\"save_link\"])'>save as link</span> <br><br>"+
			"<span class='mini_button' onclick='publish(\"export/file\")'>save as file</span> "+
			"<span class='mini_button' onclick='publish(\"import/file\")'>load from file</span> <br><br>"+
			"<span class='mini_button' onclick='publish(\"modal\",[\"embed\"])'>embed in your website</span> <br><br>"+
			"<span class='mini_button' onclick='publish(\"modal\",[\"save_gif\"])'>make a GIF using LICEcap</span> <br><br>"+

			"<hr/><br>"+
				
			"<a target='_blank' href='../'>LOOPY</a> is "+
			"made by <a target='_blank' href='http://ncase.me'>nicky case</a> "+
			"with your support <a target='_blank' href='https://www.patreon.com/ncase'>on patreon</a> &lt;3<br><br>"+
			"<span style='font-size:0.85em'>P.S: go read <a target='_blank' href='https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557'>Thinking In Systems</a>, thx</span>"

		}));
		self.addPage("Edit", page);
	})();

	// Ctrl-S to SAVE
	subscribe("key/save",function(){
		if(Key.control){ // Ctrl-S or ⌘-S
			publish("modal",["save_link"]);
		}
	});

 	subscribe("node/changeColor", function(n) {
        Node.defaultPalette = n;
        self.pages[0].components[2].dom.children[1].firstChild.src = "" +
        "css/sliders/" + Sidebar.COLOR_SLIDER_OPTIONS[Node.defaultPalette] + ".png";
        // the lines above SUCKS, but it changes the slider image which is what we need
    }); 

}

// Taking a note out of 1000i100's book in refactoring
function backToTopButton(sidebar, page){
	page.addComponent(new ComponentButton({
		header: true,
		label: "back to top",
		onclick: function(){
			sidebar.showPage("Edit");
		}
	}));
}

function deleteMeButton(sidebar, page, label){
	page.addComponent(new ComponentButton({
		label: label,
		onclick: function(me){
			me.kill();
			sidebar.showPage("Edit");
		}
	}))
}

function SidebarPage(){

	// TODO: be able to focus on next component with an "Enter".

	var self = this;
	self.target = null;

	// DOM
	self.dom = document.createElement("div");
	self.show = function(){ self.dom.style.display="block"; self.onshow(); };
	self.hide = function(){ self.dom.style.display="none"; self.onhide(); };

	// Components
	self.components = [];
	self.componentsByID = {};
	self.addComponent = function(propName, component){

		// One or two args
		if(!component){
			component = propName;
			propName = "";
		}

		component.page = self; // tie to self
		component.propName = propName; // tie to propName
		self.dom.appendChild(component.dom); // add to DOM

		// remember component
		self.components.push(component);
		self.componentsByID[propName] = component;

		// return!
		return component;

	};
	self.getComponent = function(propName){
		return self.componentsByID[propName];
	};

	// Edit
	self.edit = function(object){

		// New target to edit!
		self.target = object;

		// Show each property with its component
		for(var i=0;i<self.components.length;i++){
			self.components[i].show();
		}

		// Callback!
		self.onedit();

	};

	// TO IMPLEMENT: callbacks
	self.onedit = function(){};
	self.onshow = function(){};
	self.onhide = function(){};

	// Start hiding!
	self.hide();

}



/////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENTS ///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function Component(){
	var self = this;
	self.dom = null;
	self.page = null;
	self.propName = null;
	self.show = function(){
		// TO IMPLEMENT
	};
	self.getValue = function(){
		return self.page.target[self.propName];
	};
	self.setValue = function(value){
		
		// Model's been changed!
		publish("model/changed");

		// Edit the value!
		self.page.target[self.propName] = value;
		self.page.onedit(); // callback!
		
	};
}

function ComponentInput(config){

	// Inherit
	var self = this;
	Component.apply(self);

	// DOM: label + text input
	self.dom = document.createElement("div");
	var label = _createLabel(config.label);
	var className = config.textarea ? "component_textarea" : "component_input";
	var input = _createInput(className, config.textarea);
	input.oninput = function(event){
		self.setValue(input.value);
	};
	self.dom.appendChild(label);
	self.dom.appendChild(input);

	// Show
	self.show = function(){
		input.value = self.getValue();
	};

	// Select
	self.select = function(){
		setTimeout(function(){ input.select(); },10);
	};

}

function ComponentSlider(config){

	// Inherit
	var self = this;
	Component.apply(self);

	// TODO: control with + / -, alt keys??

	// DOM: label + slider
	self.dom = document.createElement("div");
	var label = _createLabel(config.label);
	self.dom.appendChild(label);
	var sliderDOM = document.createElement("div");
	sliderDOM.setAttribute("class","component_slider");
	self.dom.appendChild(sliderDOM);

	// Slider DOM: graphic + pointer
	var slider = new Image();
	slider.draggable = false;
	slider.src = "css/sliders/"+config.bg+".png";
	slider.setAttribute("class","component_slider_graphic");
	var pointer = new Image();
	pointer.draggable = false;
	pointer.src = "css/sliders/slider_pointer.png";
	pointer.setAttribute("class","component_slider_pointer");
	sliderDOM.appendChild(slider);
	sliderDOM.appendChild(pointer);
	var movePointer = function(){
		var value = self.getValue();
		var optionIndex = config.options.indexOf(value);
		var x = (optionIndex+0.5) * (250/config.options.length);
		pointer.style.left = (x-7.5)+"px";
	};

	// On click... (or on drag)
	var isDragging = false;
	var onmousedown = function(event){
		isDragging = true;
		sliderInput(event);
	};
	var onmouseup = function(){
		isDragging = false;
	};
	var onmousemove = function(event){
		if(isDragging) sliderInput(event);
	};
	var sliderInput = function(event){

		// What's the option?
		var index = event.x/250;
		var optionIndex = Math.floor(index*config.options.length);
		var option = config.options[optionIndex];
		if(option===undefined) return;
		self.setValue(option);

		// Callback! (if any)
		if(config.oninput){
			config.oninput(option);
		}

		// Move pointer there.
		movePointer();

	};
	_addMouseEvents(slider, onmousedown, onmousemove, onmouseup);

	// Show
	self.show = function(){
		movePointer();
	};

	// BG Color!
	self.setBGColor = function(color){
		slider.style.background = color;
	};

}

function ComponentButton(config){

	// Inherit
	var self = this;
	Component.apply(self);

	// DOM: just a button
	self.dom = document.createElement("div");
	var button = _createButton(config.label, function(){
		config.onclick(self.page.target);
	});
	self.dom.appendChild(button);

	// Unless it's a HEADER button!
	if(config.header){
		button.setAttribute("header","yes");
	}

}

function ComponentHTML(config){

	// Inherit
	var self = this;
	Component.apply(self);

	// just a div
	self.dom = document.createElement("div");
	self.dom.innerHTML = config.html;

}

function ComponentOutput(config){

	// Inherit
	var self = this;
	Component.apply(self);

	// DOM: just a readonly input that selects all when clicked
	self.dom = _createInput("component_output");
	self.dom.setAttribute("readonly", "true");
	self.dom.onclick = function(){
		self.dom.select();
	};

	// Output the string!
	self.output = function(string){
		self.dom.value = string;
	};
}