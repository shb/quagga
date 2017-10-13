(function () {

if ('undefined' == typeof module && 'object' == typeof window) {
	var exports = window;
}
Epl2Printer.prototype.commands = {};

function Epl2Printer ()
{
	/* Epl2 constructor */

	/*
	 * Function: open
	 * 
	 * Open a connection to the selected printer
	 */
	this.open = open;
	function open (options) {}

	/*
	 * Function: send
	 * 
	 * Send a string of EPL2 code to the printer
	 */
	this.send = send;
	function send (command)
	{
		var args = command.trim().split(',');
		var parsed = args[0].match(/^([A-Za-z]{1,2})(.*)$/);
		if (parsed) {
			args[0] = parsed[2];
			args.unshift(parsed[1]);
		}

		if (args[0] in this.commands) {
			return this.commands[args[0]].apply(self, args);
		} else {
			console.info("epl2: Unrecognized command: "+args[0]);
			return null;
		}
	}

	/*
	 * Function: print
	 *
	 * Send a whole file for printing
	 */
	this.print = print;
	function print (source)
	{
		var code = '';

		if ('string' == typeof source) {
			code = source;
		} else if ('undefined' != typeof source.value) {
			code = source.value;
		} else {
			console.error("epl2: Undefined source contents");
		}

		var commands = code.split(/\n/);
		for (var c in commands)
		{
			this.send(commands[c]);
		}

	}
}
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
exports.Epl2Html = Epl2Html;

/* Close the module */
}) ();
