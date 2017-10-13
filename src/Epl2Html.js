Epl2Html.prototype = new Epl2Printer;

function Epl2Html ()
{
	var container;
	var buffer;
	var self = this;

	function init (containerId)
	{
		var container_id = containerId;
		container = document.getElementById(container_id);
	}

	this.open = open;
	function open (options)
	{
		container.innerHtml = '';
		console.log("epl2: opened connection to Epl2Html printer '"+container.id+"'");
	}

	function dots (value) { return value+'px'; }
	function inches (value) { return value/resolution+'in'; }

	var page;
	var gapLength = 18;
	var labelLength;
	var labelWidth;
	var mode = 'gap';
	var orientation = 'top';
	var resolution = 203;

	this.commands.A = function () {
		var text = document.createElement('p');
		text.style.left = inches(arguments[1]);
		text.style[orientation] = inches(arguments[2]);
		text.style.transform = 'rotate('+(arguments[3]*90)+'deg)';
		text.className += 'font'+arguments[4];
		text.style.transform += ' scaleX('+arguments[5]+')';
		text.style.transform += ' scaleY('+arguments[6]+')';
		if (arguments[7] == 'R') {
			text.style.background = 'black';
			text.style.color = 'white';
		}
		text.innerText = arguments[8].replace(/^"|"$/g, '');
		page.appendChild(text);
	};
	this.commands.LO = function () {
		var line = document.createElement('hr');
		line.style.left = inches(arguments[1]);
		line.style[orientation] = inches(arguments[2]);
		line.style.width = inches(arguments[3]);
		line.style.height = inches(arguments[4]);
		page.appendChild(line);
	};
	this.commands.N = function () {
		buffer = '';
		page = document.createElement('div');
		page.className = 'page';
	};
	this.commands.P = function () {
		var labelSets = arguments[1];
		while (labelSets--) {
			container.appendChild(page);
		}
	};
	this.commands.q = function () {
		labelWidth = arguments[1];
		page.style.width = inches(labelWidth);
	};
	this.commands.Q = function ()
	{
		if (arguments[1] < 0 || arguments[1] > 65536)
			return console.error("Qp1 value out of bounds");
		if (mode != 'continuous') {
			labelLength = arguments[1];
			page.style.height = inches(labelLength);
		}

		if (arguments[2] > 240) return console.error("Qp2 value out of max bound");
		switch (resolution) {
			case 300:
				if (arguments[2] < 18) return console.error("Qp2 value out of min bound");
				break;
			case 203:
			default:
				if (arguments[2] < 16) return console.error("Qp2 value out of min bound");
		}
		switch (mode) {
			case 'gap':
				gapLength = arguments[2];
				page.style.marginBottom = inches(gapLength);
				break;
		}
	}

	if (arguments.length) init.apply(this, arguments);
}
