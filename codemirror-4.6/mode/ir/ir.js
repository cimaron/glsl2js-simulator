// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode('ir', function() {

	var keywords1 = /^(abs|add|cmp|dp3|dp4|mad|max|mov|mul|pow|ret|rsq|seq|sge|slt|sub|tex)/i;
	var keywords2 = /^(if|else|endif|ret)/i;
	//var keywords3 = /^b_?(call|jump)\b/i;
	var variables1 = /^(temp|uniform|attribute|varying|result)/i;
	//var variables2 = /^(n?[zc]|p[oe]?|m)\b/i;
	//var errors = /^([hl][xy]|i[xy][hl]|slia|sll)\b/i;
	var numbers = /^([\da-f]+h|[0-7]+o|[01]+b|\d+)/i;

	return {
		startState: function() {
			return {context: 0};
		},
		token: function(stream, state) {
			
			if (!stream.column()) {
				state.context = 0;
			}
		
			if (stream.eatSpace()) {
				return null;
			}

			var w;

			w = stream.current();

			if (stream.eat('#')) {
				stream.skipToEnd();
				return 'comment';
			
			} else if (numbers.test(w)) {
				return 'number';
			} else if (keywords1.test(w)) {
				return 'keyword';
			} else if (keywords2.test(w)) {
				return 'keyword';
			} else {
				stream.next();
			}
			
			return null;
		}
	};
});

CodeMirror.defineMIME("text/x-glsl2js-ir", "ir");

});
