
function Simulator() {

	this.target = "vertex";

	this.source = "";
	this.objectCode = null;		
	this.program = null;

	this.console = $('.console');
}

Simulator.prototype.getTarget = function() {
	return this.target;
};

Simulator.prototype.getSource = function() {
	return this.source;
};

Simulator.prototype.getIntermediate = function() {

	if (this.objectCode) {
		return this.objectCode.toString();
	}

	return "";
};

Simulator.prototype.getJavascript = function() {

	if (this.program) {
		return this.program.toString(glsl.target[this.target]);
	}
	
	return "";
};

Simulator.prototype.setTarget = function(target) {
	this.target = target;
};

Simulator.prototype.setSource = function(src) {
	this.source = src;
};

Simulator.prototype.compile = function(options) {
	var src, type, error, start, end, compile_state;

	this.log("Compiling shader of type " + this.target);

	options = options || {};
	options.target = glsl.target[this.target];

	start = new Date().getTime();
	compile_state = glsl.compile(this.source, options);	
	end = new Date().getTime();

	if (compile_state.getErrors().length) {
		this.logError(compile_state.getErrors().join("\n"));		
	}
	
	if (compile_state.getWarnings().length) {
		this.logWarning(compile_state.getWarnings().join("\n"));		
	}

	if (!compile_state.getStatus()) {
		return;
	}

	this.logInfo("Compiled successfully in " + (end - start) + "ms");	

	try {
		this.log("AST.toString():\n" + compile_state.getAst().join("\n"));
		this.objectCode = compile_state.getIR();
	
		this.program = new glsl.program();
		this.program.addObjectCode(compile_state.getIR(), glsl.target[this.target]);
		
		if (this.program.error) {
			this.logError(this.program.error);
		} else {
			this.program.build();			
		}
		
	} catch (e) {
		console.log(e);
		this.logError(e);	
	}
};

Simulator.prototype.run = function() {
};


Simulator.prototype.log = function() {
	this._log('log', arguments);
};

Simulator.prototype.logError = function() {
	this._log('error', arguments);
};

Simulator.prototype.logWarning = function() {
	this._log('warning', arguments);
};

Simulator.prototype.logInfo = function() {
	this._log('info', arguments);
};

Simulator.prototype._log = function(type, args) {
	var i, text, line, col;
	
	for (i = 0; i < args.length; i++) {

		if (args[i] instanceof Error) {
			text = $('<span />').text(args[i]).text();
			this.console.append('<div class="' + type + '">' + text + '</div>');
		} else {
			text = $('<span />').text(args[i]).text();
			this.console.append('<div class="' + type + '">' + text + '</div>');			
		}
	}

	this.console.scrollTop(this.console.prop('scrollHeight'));
};


function Input() {
		
}

Input.prototype.renderFloat = function() {
	
	
	
};






$().ready(function() {
				   
	var sim = new Simulator();
	sim.setTarget($('#shader-type').val());
	var editors = [];
	
	$('.editor').each(function(i, el) {
		
		var name = $(this).attr('id');
		
		editors[name] = CodeMirror.fromTextArea(this, {
			indentUnit : 4,
			indentWithTabs : true,
			mode : {
				name : $(this).data('type'),
			},
			lineNumbers : true
		});
		
		$(this).data('CodeMirror', editors[name]);
	});

	if (window.glsl) {
		sim.logInfo("GLSL compiler loaded successfully");
		sim.logInfo("Target set to " + sim.getTarget());
	} else {
		sim.logWarning("GLSL compiler not loaded");	
	}
	
	editors.source.on('change', function() {
		sim.setSource(editors.source.getValue());
		$.cookie('source', editors.source.getValue());
	});

	$('#srctabs').on('toggled', function(event, tab) {
		var editor = tab.find('.editor');
		var name = editor.attr('id');
		editors[name].refresh();
		editors[name].setValue(sim['get' + name.charAt(0).toUpperCase() + name.slice(1)]());
		resize();
	});

	$('#btn-compile').click(function() {		 
		var options = {};
		
		options.opt = {};
		$('input[type="checkbox"].optimization').each(function(i, el) {
			var id = $(this).attr('id');
			options.opt[id] = $(this).prop('checked');
		});

		sim.setSource(editors.source.getValue());
		sim.compile(options);
		
		editors.intermediate.setValue(sim.getIntermediate());
		editors.javascript.setValue(sim.getJavascript());
	});

	$('#shader-type').on('change', function() {
		var mime = $(this).val();
		editors.source.setOption("mode", mime);
		sim.setTarget(mime);
		sim.logInfo("Switching target to " + mime);
	});

	function resize() {
		$('.expand-height').height($(window).height() - $('nav').outerHeight() - $('.console').outerHeight() - ($('.expand-height').outerHeight(true) - $('.expand-height').innerHeight()));
		
		$('.editor').each(function(i, el) {
			var name = $(this).attr('id');
			var cm = $(this).next('.CodeMirror');
			cm.css('height', 10);
			var height = cm.closest('.expand-height').innerHeight();
			cm.css('height', height - (cm.offset().top - $('.expand-height').offset().top));
		});
		
	}

	$(window).resize(resize);

	resize();

});

