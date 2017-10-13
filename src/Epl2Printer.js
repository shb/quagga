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
