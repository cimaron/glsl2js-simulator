<?php

?><!doctype html>
<html>
<head>
	<meta charset="utf-8">
    <title>GLSL2JS Simulator</title>
	
	<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script src="assets/js/jquery.cookie.js"></script>

	<script src="codemirror-4.6/lib/codemirror.js"></script>
	<link rel="stylesheet" href="codemirror-4.6/lib/codemirror.css">
	<script src="codemirror-4.6/mode/clike/clike.js"></script>
	<script src="codemirror-4.6/mode/javascript/javascript.js"></script>
	<script src="codemirror-4.6/mode/ir/ir.js"></script>

	<link href="assets/css/foundation.min.css" rel="stylesheet" />
	<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
	<script src="assets/js/foundation.min.js"></script>

	<script src="glsl.js"></script>

	<link href="simulator.css" rel="stylesheet" />
	<script src="simulator.js"></script>

</head>
<body>

<nav class="top-bar" data-topbar role="navigation">
	<ul class="title-area">
		<li class="name">
			<h1><a href="#">GLSL2JS Simulator</a></h1>
		</li>
		<!-- Remove the class "menu-icon" to get rid of menu icon. Take out "Menu" to just have icon alone --> 
		<li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
	</ul>
</nav>

<div class="row full-width expand-height" style="margin-top: 40px;">

	<div class="large-6 columns">
	
		<dl class="tabs" id="srctabs" data-tab>
			<dd class="active"><a href="#panel1">Source</a></dd>
			<dd><a href="#panel2">Intermediate</a></dd>
			<dd><a href="#panel3">Javascript</a></dd>
		</dl>
		<div class="tabs-content">
			<div class="content active" id="panel1">
				<textarea class="editor" id="source" data-type="x-shader/x-vertex"><?php if (isset($_COOKIE['source'])) { echo htmlentities($_COOKIE['source']); } ?></textarea>				
			</div>
			<div class="content" id="panel2">
				<textarea class="editor" id="intermediate" data-type="text/text"></textarea>				
			</div>
			<div class="content" id="panel3">
				<textarea class="editor" id="javascript" data-type="text/javascript"></textarea>
			</div>
		</div>

	</div>

	<div class="large-3 columns">

		<label for="shader-type">Shader Type:</label>
		<select class="form-control" id="shader-type" name="shader-type">
			<option value="x-shader/x-fragment" selected="selected">Fragment</option>
			<option value="x-shader/x-vertex">Vertex</option>
		</select>
		
		<div class="row">
			<div class="large-6 columns">
				Fold Constants: <input type="checkbox" class="optimization" id="fold_constants" value="1" />
			</div>
		</div>
		
		<ul class="button-group">
			<li><a href="#" class="button" id="btn-compile">Compile</a></li>
			<li><a href="#" class="button" id="btn-run">Run</a></li>
		</ul>
	</div>

	<div class="large-3 columns">
			<input id="show_uniforms" type="checkbox" checked="checked" /><label for="show_uniforms">Uniforms</label>
			<input id="show_atributes" type="checkbox" checked="checked" /><label for="show_attributes">Attributes</label>
			<input id="show_varying" type="checkbox" checked="checked" /><label for="show_varying">Varying</label>
			<input id="show_builtin" type="checkbox" checked="checked" /><label for="show_builtin">Builtin</label>
		<div>
			<table class="variables">
				<?php
				ob_start();
				?>
				<tr class="builtin" data-var-type="%type%">
					<td class="var_name">%name%</td>
					<td class="var_value">
						<div data-dropdown="%id%">%display%</div>
						<div class="f-dropdown content" data-dropdown-content="" id="%id%" tabindex="-1">
							%input%
						</div>
					</td>
				</tr>
				<?php
				$tpl = ob_get_clean();
				?>
				<script>Input.tpl = <?php echo json_encode($tpl); ?></script>
			</table>
		</div>
	</div>
</div>

<div class="console"></div>

<script>
$(document).foundation();
</script>

</body>
</html>

