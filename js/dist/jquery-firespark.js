var FireSpark = FireSpark || {};
FireSpark.core = {};

FireSpark.core.service = {};
FireSpark.core.workflow = {};

FireSpark.core.helper = {};
FireSpark.core.constant = {};

FireSpark.core.constant.loadmsg = '<span class="loading">Loading ...</span>';
FireSpark.core.constant.loaderror = '<span class="error">The requested resource could not be loaded</span>';

/**
 *	@component AjaxBarrier
**/
FireSpark.core.ajax = {
	requests : 0,
	
	barrier_function : function() {
		
	},
	
	start : function(){
		this.requests++;
	},
	
	end : function(){
		this.requests--;
		if(this.requests <= 0){
			this.requests = 0;
			this.barrier_function();
			this.barrier_function = function() {}
		}
	},
	
	barrier : function($bfunc){
		this.barrier_function = $bfunc;
	}
};

/** *	@service LoadConfirm *	@desc Confirms whether to continue  * *	@param confirm boolean [memory] optional default false *	@param value string [memory] ***/FireSpark.core.service.LoadConfirm = {	input : function(){		return {			required : ['value'],			optional : { confirm : false }		}	},		run : function($memory){		if($memory['confirm']){			$memory['valid'] = confirm($memory['value']);			return $memory;		}		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service WindowReload *	@desc Reloads the window * *	@param continue string [message] optional default false ***/FireSpark.core.service.WindowReload = {	input : function(){		return {			'optional' : { 'continue' : false }		};	},		run : function($memory){		window.location.hash = '';		if($memory['continue'] || false){			window.location = $memory['continue'];		}		else {			window.location.reload();		}		$memory['valid'] = false;		return $memory;	},		output : function(){		return [];	}};/** *	@helper DataSplit * *	@param data *	@param separator optional default : ***/FireSpark.core.helper.dataSplit = function($data, $separator){	$separator = $separator || ':';	return $data.split($separator);}/** *	Equals helper * *	@param value1 *	@param value2 ***/FireSpark.core.helper.equals = function(value1, value2){	return value1==value2;}/**
 *	@helper genderString 
**/
FireSpark.core.helper.genderString = function($ch){
	switch($ch){
		case 'M' :
			return 'Male';
		case 'F' :
			return 'Female';
		case 'N' :
		default :
			return '';
			break;
	}
}
/** *	GetDate helper * *	@param time ***/FireSpark.core.helper.getDate = function(time){	var d = new Date(time);	return d.toDateString();}/** *	@helper GetFrame * *	@param name ***/FireSpark.core.helper.getFrame = function(name){	for (var i = 0; i < frames.length; i++){		if (frames[i].name == name)			return frames[i];	}		return false;}/**
 *	@helper readFileSize
 *
**/
FireSpark.core.helper.readFileSize = function(size){
	var kb = size/1024.0;
	if(kb > 1024.0){
		var mb = kb/1024.0;
		return mb.toFixed(2) + ' MB';
	}
	return kb.toFixed(2) + ' KB';
}
/** *	@helper ShortString * *	@param data ***/FireSpark.core.helper.shortString = function($data, $size, $short){	var $maxlen = $size || 15;	var $len = $maxlen - 5;	return $short ? ($data.length < $maxlen ? $data : $data.substr(0, $len) + ' ...') : $data;}FireSpark.jquery = {};

FireSpark.jquery.service = {};
FireSpark.jquery.workflow = {};

FireSpark.jquery.helper = {};
FireSpark.jquery.constant = {};

FireSpark.jquery.template = {};

/**
 *	@component HashLaunch
**/
FireSpark.jquery.HashLaunch = {
	idle : true,
	
	current : '',
	
	check : function(){
		if(FireSpark.jquery.HashLaunch.idle && FireSpark.jquery.HashLaunch.current != window.location.hash){
			FireSpark.jquery.HashLaunch.current = window.location.hash;
			Snowblozm.Kernel.launch(FireSpark.jquery.HashLaunch.current);
		}
	}
};

/**
 *	@service ContainerData
 *	@desc Used to prepare container data
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *
 *	@param iframe string [memory] optional default false
 *	@param agent string [memory] optional default false
 *	@param root object [memory] optional default false
 *
 *	@param url string [memory] optional default ''
 *	@param data object [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *	@param args array [args]
 *
 *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ContainerRender }
 *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent }
 *	@param stop boolean [memory] optional default false
 *
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.ContainerData = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				iframe : false,
				root : false,
				agent : false,
				url : '',
				data : '', 
				type : 'json', 
				request : 'POST', 
				process : false, 
				mime : 'application/x-www-form-urlencoded' ,
				workflowend : { service : FireSpark.jquery.service.ContainerRender },
				errorflowend : { service : FireSpark.jquery.service.ElementContent },
				loaddata : FireSpark.core.constant.loadmsg,
				anm : 'fadein',
				dur : 1000,
				dly : 0, 
				stop : false
			}
		}
	},
	
	run : function($memory){
		if($memory['iframe']){
			var $loader = FireSpark.jquery.service.LoadIframe;
		}
		else {
			var $loader = FireSpark.jquery.service.LoadAjax;
		}
		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
			return Snowblozm.Kernel.run($memory['workflowend'], $memory);
		}
		else {
			return Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.service.ElementContent,
				element : '#load-status',
				select : true,
				animation : 'slidein',
				data : '<span class="state loading">Loading ...</span>',
				duration : 500
			},{
				service : $loader,
				args : $memory['args'],
				agent : $memory['agent'] || $memory['root'],
				workflow : [
					$memory['workflowend']
				],
				errorflow : [
					$memory['errorflowend']
				]
			}], $memory);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service ContainerRemove
 *	@desc Used to remove container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param inl boolean [memory] optional default false
 *
**/
FireSpark.jquery.service.ContainerRemove = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : '#ui-global-0',
				inl : false
			}
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];
		
		if($memory['inl'] || false){
			// To do
		}
		else {
			$memory = Snowblozm.Kernel.execute([{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tls-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tlc-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.workflow.TileShow
			}], $memory);
		}
		
		$memory['valid'] = false;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service ContainerRender
 *	@desc Used to render container
 *
 *	@param key string [memory] optional default 'ui-global'
 *	@param id long int [memory] optional default '0'
 *	@param ins string [memory] optional default '#ui-global-0'
 *	@param root object [memory] optional default false
 *	@param tpl template [memory] optional default '#tpl-def-tls'
 *	@param inl boolean [memory] optional default false
 *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove')
 *	@param tile string [memory] optional default false
 *	@param data object [memory] optional default {}
 *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param dur integer [memory] optional default 1000
 *	@param dly integer [memory] optional default 0
 *	@param bg boolean [memory] optional default false
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ContainerRender = {
	input : function(){
		return {
			optional : { 
				key : 'ui-global', 
				id : '0',
				ins : 'ui-global-0',
				root : false,
				tpl : '#tpl-def-tls',
				inl : false,
				act : 'first',
				tile : false,
				data : {},
				anm : 'fadein',
				dur : 1000,
				dly : 0,
				bg : false
			}
		}
	},
	
	run : function($memory){		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
		} else {
			$value = $memory['data'];
		}
		
		$value['id'] = $memory['id'];
		$value['key'] = $memory['key'];
		$value['instance'] = $memory['ins'];
		
		if($value['valid'] || false){
		} else {
			Snowblozm.Registry.save($instance, false);
			return Snowblozm.Kernel.run({
				service : FireSpark.jquery.service.ElementContent,
				element : '#load-status',
				select : true,
				animation : 'slidein',
				data : '<span class="error">'+$value['msg']+'</span><span class="hidden">'+$value['details']+'</span>',
				duration : 500
			}, {});
		}
		
		var $render = function(){
			$value['ui'] = $value['ui'] || $value['message']['ui'] || false;
		
			if($value['ui'] || false){
				$templates  = $value['ui']['templates'] || {};
				$flag = false;
				
				for(var $i in $templates){
					if(Snowblozm.Registry.get($templates[$i]) || false){
					} else {
						$flag = true;
						break;
					}
				}
				
				if($flag || false){
					$('#load-status').html('<span class="error">Error Loading Data</span>').stop(true, true).hide().slideDown(500).delay(1500).slideUp(1500);
					return;
				}		
			}		
	
			$('#load-status').html('<span class="state">Initializing ...</span>').stop(true, true).hide().slideDown(500).delay(500).slideUp(500);
				
			if($memory['inl'] || false){
				// To do
			}
			else {
				$memory = Snowblozm.Kernel.execute([{
					service : FireSpark.jquery.service.ElementContent,
					element : '.tls-' + $instance,
					select : true,
					action : 'remove'
				},{
					service : FireSpark.jquery.workflow.TemplateApply,
					input : { action : 'act', animation : 'anm', duration : 'dur', delay : 'dly' },
					element : $memory['ins'] + '>.tiles',
					select : true,
					animation : 'fadein',
					template : $memory['tpl'] + '-tls',
					data : $value,
				}], $memory);
				
				if($memory['valid'] || false){
				} else {
					return $memory;
				}
			}
			
			$workflow = [{
				service : FireSpark.jquery.service.ElementContent,
				element : '.tlc-' + $instance,
				select : true,
				action : 'remove'
			},{
				service : FireSpark.jquery.workflow.TemplateApply,
				input : { action : 'act', animation : 'anm', duration : 'dur', delay : 'dly' },
				element : $memory['ins'] + '>.bands',
				select : true,
				template : $memory['tpl'] + '-tcs',
				animation : 'none',
				data : $value
			}];
			
			if($memory['bg'] || false){
			}
			else {
				$workflow.push({
					service : FireSpark.jquery.workflow.TileShow
				});
			}
				
			$memory = Snowblozm.Kernel.execute($workflow, $memory);
			Snowblozm.Registry.save($instance, $value);
		}
		
		$value['ui'] = $value['message']['ui'];
		
		if($value['ui'] || false){
			$templates  = $value['ui']['templates'] || {};
			$memory['tpl'] = $value['ui']['tpl'];
			
			FireSpark.core.ajax.barrier($render);
			$barrier = false;
			
			for(var $i in $templates){
				if(Snowblozm.Registry.get($templates[$i]) || false){
				} else {
					$barrier = true;
					
					Snowblozm.Kernel.execute([{
						service : FireSpark.jquery.service.RegistrySave,
						key : $templates[$i],
						value : true
					},{
						service : FireSpark.jquery.service.LoadAjax,
						url : $templates[$i],
						type : 'html',
						request : 'GET',
						workflow : [{
							service : FireSpark.jquery.service.ElementContent,
							element : '#ui-templates',
							select : true,
							action : 'last',
							duration : 5
						}],
						errorflow : [{
							service : FireSpark.jquery.service.RegistrySave,
							key : $templates[$i]
						}]
					}], {});
				}
			}
			
			if($barrier){
				$('#load-status').html('<span class="state loading">Loading ...</span>').stop(true, true).slideDown(500);
			} else {
				$render();
			}
		}
		else {
			$render();
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/** *	@service CookieMake *	@desc Creates a new Cookie * *	@param key string [message] *	@param value string [message] optional default null *	@param expires integer[message] default 1 day *	@param path string [memory] optional default '/' ***/FireSpark.jquery.service.CookieMake = {	input : function(){		return {			required : ['key'],			optional : { expires : 1, value : null, path : '/' }		};	},		run : function($memory){		$.cookie($memory['key'], null, {			path: $memory['path']		});				$.cookie($memory['key'], $memory['value'], {			expires : $memory['expires'],			path: $memory['path']		});				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service DataEncode *	@desc Encodes data from url-encoded other formats * *	@param type string [memory] optional default 'url' ('url', 'json', 'rest-id') *	@param data string [memory] optional default false *	@param url string [memory] optional default false * *	@return data object [memory] *	@return result string [memory] *	@return mime string [memory] *	@return url string [memory] ***/FireSpark.jquery.service.DataEncode = {	input : function(){		return {			optional : { type : 'url', data : false, url : '' }		}	},		run : function($memory){		var $data = $memory['data'];		var $type = $memory['type'];		var $mime =  'application/x-www-form-urlencoded';				if($data !== false && $data != ''){			$data = $data.replace(/\+/g, '%20');			if($type != 'url'){				var $params = $data.split('&');				var $result = {};				for(var $i=0, $len=$params.length; $i<$len; $i++){					var $prm = ($params[$i]).split('=');					$result[$prm[0]] = unescape($prm[1]);				}				$memory['data'] = $data = $result;			}						switch($type){				case 'json' :					$data = JSON.stringify($data);					$mime =  'application/json';					break;								case 'rest-id' :					$memory['url'] = $memory['url'] + '/' + $data['id'];									case 'url' :				default :					break;			}		}				$memory['result'] = $data;		$memory['mime'] = $mime;		$memory['valid'] = true;		return $memory;	},		output : function(){		return ['data', 'result', 'mime', 'url'];	}};/** *	@service DataRead *	@desc Serializes div into url-encoded data and reads form submit parameters * *	@param cntr string [memory] *	@param cls string [memory] optional default 'data' * *	@return data object [memory] ***/FireSpark.jquery.service.DataRead = {	input : function(){		return {			required : ['cntr'],			optional : { cls : 'data' }		};	},		run : function($memory){		var $d = new Date();		var $params = '_ts=' +  $d.getTime();				var serialize = function($index, $el){			if($(this).attr('name') || false){				$params = $params + '&' + $(this).attr('name') + '=' +  $(this).val();			}		}		$($memory['cntr'] + ' .' + $memory['cls']).each(serialize);				$memory['data'] = $params;		$memory['valid'] = true;		return $memory;	},		output : function(){		return ['data'];	}};/** *	@service ElementButton *	@desc creates button UI element * *	@param selector string [memory] ***/FireSpark.jquery.service.ElementButton = {	input : function(){		return {};	},		run : function($memory){		$($memory['selector']).button();		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it or removes it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param data html/text [memory] optional default ''
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout', 'none')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove')
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ElementContent = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				data : '',
				animation : 'fadein',
				duration : 1000,
				delay : 0,
				action : 'all'
			}
		};
	},
	
	run : function($memory){
		if($memory['select'] || false){
			var $element = $($memory['element']);
			if(!$element.length && $memory['action'] != 'remove'){
				$element = $('#main-container');
			}
		}
		else {
			$element = $memory['element'];
		}
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		switch($memory['action']){
			case 'all' :
				if($animation == 'fadein' || $animation == 'slidein'){
					$element.hide();
				}
				$element.html($memory['data']);
				$element.trigger('load');
				break;
			
			case 'first' :
				$element.prepend($memory['data']);
				$element.trigger('load');
				break;
			
			case 'last' :
				$element.append($memory['data']);
				$element.trigger('load');
				break;
				
			case 'remove' :
				$element.remove();
				break;
				
			default :
				break;
		}
		
		if($memory['action'] != 'remove'){
			$element.stop(true, true).delay($memory['delay']);
			
			switch($animation){
				case 'fadein' :
					$element.fadeIn($duration);
					break;
				case 'fadeout' :
					$element.fadeOut($duration);
					break;
				case 'slidein' :
					$element.slideDown($duration);
					break;
				case 'slideout' :
					$element.slideUp($duration);
					break;
				case 'none' :
					break;
				default :
					$element.html('Animation type not supported').fadeIn($duration);
					break;
			}
		}
		
		$memory['element'] = $element;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/** *	@service ElementEditor *	@desc creates editor UI element * *	@param selector string [memory] ***/FireSpark.jquery.service.ElementEditor = {	input : function(){		return {};	},		run : function($memory){		$element = $($memory['selector']);		$temp = $element;				$element.each(function($index, $el){			$name = $temp.attr('id') || $temp.attr('name');			$instance = CKEDITOR.instances[$name] || false;			if($instance){				try {					CKEDITOR.remove($instance);				}				catch(e) {}				delete $instance;			}			$temp = $temp.slice(1);		});				$element.ckeditor();		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service ElementState *	@desc Enables and disables element * *	@param element string [memory] optional default false *	@param disabled boolean [memory] optional default false ***/FireSpark.jquery.service.ElementState = {	input : function(){		return {			optional : { element : false, disabled : false }		};	},		run : function($memory){		if($memory['element']){			if($memory['disabled']){				$($memory['element']).attr('disabled', true);			}			else {				$($memory['element']).removeAttr('disabled');			}		}		$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service ElementTab
 *	@desc Creates a new tab and returns the element
 *
 *	@param tabui string [memory]
 *  @param title string [memory]
 *  @param autoload boolean [memory] optional default false
 *  @param taburl string [memory] optional default false
 *
 *	@return element Element [memory]
 *
**/
FireSpark.jquery.service.ElementTab = {
	input : function(){
		return {
			required : ['tabui', 'title'],
			optional : { autoload : false,	taburl : false }
		};
	},
	
	run : function($memory){
		var $tabui = Snowblozm.Registry.get($memory['tabui']);
		$memory['element'] = $tabui.add($memory['title'], $memory['autoload'], $memory['taburl']);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/**
 *	@service ElementTabpanel
 *	@desc Creates a Tabpanel at element and saves a reference
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param savekey string [memory]
 *	@param cache boolean [memory] optional default false
 *	@param collapsible boolean [memory] optional default false
 *	@param event string [memory] optional default 'click'
 *	@param tablink boolean [memory] optional default false
 *	@param indexstart integer [memory] optional default 0
 *
 *	@save tabpanel object
 *
**/
FireSpark.jquery.service.ElementTabpanel = {
	input : function(){
		return {
			required : ['element', 'savekey'],
			optional : { 
				select : false, 
				cache : false,	
				collapsible : false, 
				event : 'click', 
				tablink : false, 
				indexstart : 0 
			}
		};
	},
	
	run : function($memory){
		if($memory['select']){
			var $element = $($memory['element']);
		}
		else {
			var $element = $memory['element'];
		}
		$element.hide();
		
		var $tab = new Array();
		var $index = $memory['indexstart'];
		
		var $options = {
			cache : $memory['cache'],
			collapsible : $memory['collapsible'],
			event : $memory['event'],
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function($event, $ui) {
				$tab[$index] = $($ui.panel);
			}
		};
		
		if($memory['tablink']){
			$options.load = function($event, $ui) {
				$('a', $ui.panel).click(function() {
					$($ui.panel).load(this.href);
					return false;
				});
			}
		}
		
		var $tabpanel = $element.tabs($options);
		$element.fadeIn(1000);
		
		$('.ui-icon-close').live( "click", function() {
			var $indx = $("li", $tabpanel).index($(this).parent());
			$tabpanel.tabs( "remove", $indx );
		});
		$index--;
		
		Snowblozm.Registry.save($memory['savekey'], {
			add : function($tabtitle, $autoload, $taburl){
				$index++;
				var $url = '#ui-tab-' + $index;
				if($autoload || false){
					$url = $taburl;
				}
				$tabpanel.tabs('add', $url, $tabtitle);
				$tabpanel.tabs('select', '#ui-tab-' + $index);
				return $tab[$index];
			}
		});
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service ElementToggle
 *	@desc Toggles element with another content and animates it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param content string [memory] optional default false
 *	@param child string [memory] optional default '.tile-content'
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'slidein')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ElementToggle = {
	input : function(){
		return {
			required : ['element'],
			optional : { 
				select : false,
				content : false,
				child : '.tile-content',
				animation : 'fadein',
				duration : 500,
				delay : 0
			}
		};
	},
	
	run : function($memory){
		if($memory['select'] || false){
			var $element = $($memory['element']);
			if(!$element.length){
				$element = $('#main-container');
			}
		}
		else {
			$element = $memory['element'];
		}
		
		$element.children($memory['child']).hide();
		
		if($memory['content'] || false){
			$element = $element.children($memory['content']);
		}
		else {
			$element = $element.children($memory['child']).eq(0);
		}
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		$element.trigger('load');
		$element.delay($memory['delay']);
		
		switch($animation){
			case 'fadein' :
				$element.fadeIn($duration);
				break;
			case 'slidein' :
				$element.slideDown($duration);
				break;
			default :
				$element.html('Animation type not supported').fadeIn($duration);
				break;
		}
		
		$memory['element'] = $element;
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['element'];
	}
};
/** *	@service FormRead *	@desc Serializes form into url-encoded data and reads form submit parameters * *	@param form string [memory] * *	@return url string [memory] *	@return request string [memory] *	@return data object [memory] ***/FireSpark.jquery.service.FormRead = {	input : function(){		return {			required : ['form']		};	},		run : function($memory){		var $form = $($memory['form']);				$memory['url'] = $form.attr('action');		$memory['request'] = $form.attr('method').toUpperCase();				var $params = $form.serialize();		var $d= new Date();		$params = $params + '&_ts=' +  $d.getTime();		$memory['data'] = $params;				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['url', 'request', 'data'];	}};/** *	@service FormValidate *	@desc Validates form input values (required and email) using style class * *	@style .required *	@style .email * *	@param form string [memory] *	@param error string [memory] optional default span ***/FireSpark.jquery.service.FormValidate = {	input : function(){		return {			required : ['form'],			optional : { error : 'span' }		};	},		run : function($memory){		var $result = true;		var $error = $memory['error'];				var fail = function($el, $sel){			$el.next($sel).stop(true, true).slideDown(1000).delay(5000).fadeOut(1000);		}				var $value = false;		var checkMatch = function($index, $el){			if($value && $(this).val()!=$value ){				$result = false;				fail($(this), $error + '.error');				return false;			}			$value = $(this).val();		}		$($memory['form'] + ' .match').each(checkMatch);				var checkRequired = function($index, $el){			if($(this).val() == ''){				$result = false;				fail($(this), $error + '.error');				return false;			}		}		$($memory['form'] + ' .required').each(checkRequired);				var $emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;		var checkEmail = function($index, $el){			if(!$emailRegex.test($(this).val())){				$result = false;				fail($(this), $error + '.error');				return false;			}		}		$($memory['form'] + ' .email').each(checkEmail);				$memory['valid'] = $result;		return $memory;	},		output : function(){		return [];	}};/** *	@service LaunchMessage *	@desc Processes data to run workflows * *	@param data object [memory] optional default {} *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' ***/FireSpark.jquery.service.LaunchMessage = {	input : function(){		return {			optional : { data : {}, launch : false, status : 'valid', message : 'message' }		};	},		run : function($memory){		if($memory['launch']){			var $status = $memory['status'];			var $data = $memory['data'] || {};			if($data[$status] || false){				var $key = $memory['message'];				var $message = $data[$key] || false;				if($message){					$message['service'] = Snowblozm.Registry.load($memory['launch']);					return Snowblozm.Kernel.run($message, {});				}			}		}			$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server
 *
 *	@param url string [memory]
 *	@param data object [memory] optional default ''
 *	@param type string [memory] optional default 'json'
 *	@param request string [memory] optional default 'POST'
 *	@param process boolean [memory] optional default false
 *	@param mime string [memory] optional default 'application/x-www-form-urlencoded'
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *	@param stop boolean [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadAjax = {
	input : function(){
		return {
			required : ['url', 'workflow'],
			optional : { 
				data : '', 
				type : 'json', 
				request : 'POST', 
				process : false, 
				mime : 'application/x-www-form-urlencoded' ,
				errorflow : false,
				stop : false
			}
		}
	},
	
	run : function($memory){
		
		FireSpark.core.ajax.start();
		
		/**
		 *	Load data from server using AJAX
		**/
		$.ajax({
			url: $memory['url'],
			data: $memory['data'],
			dataType : $memory['type'],
			type : $memory['request'],
			processData : $memory['process'],
			contentType : $memory['mime'],
			
			success : function($data, $status, $request){
				$memory['data'] = $data;
				//$memory['status'] = $status;
				
				/**
				 *	Run the workflow
				**/
				Snowblozm.Kernel.execute($memory['workflow'], $memory);
				FireSpark.core.ajax.end();
			},
			
			error : function($request, $status, $error){
				$memory['error'] = $error;
				//$memory['status'] = $status;
				$memory['data'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error : ' + $error + ']</span>';
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					Snowblozm.Kernel.execute($memory['errorflow'], $memory);
				}
				FireSpark.core.ajax.end();
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		return { valid : $memory['stop'] };
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service LoadIframe
 *	@desc Uses IFRAME to load data from server
 *
 *	@param agent string [memory] 
 *	@param type string [memory] optional default 'json' ('json', 'html')
 *
 *	@param workflow Workflow [memory]
 *	@param errorflow	Workflow [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadIframe = {
	input : function(){
		return {
			required : ['agent', 'workflow'],
			optional : { 
				type : 'json', 
				errorflow : false
			}
		}
	},
	
	run : function($memory){
		
		FireSpark.core.ajax.start();
		
		/**
		 *	Genarate unique framename
		**/
		var $d= new Date();
		var $framename = 'firespark_iframe_' + $d.getTime();
		
		/**
		 *	Set target attribute to framename in agent
		**/
		$($memory['agent']).attr('target', $framename);
		
		/**
		 *	Create IFRAME and define callbacks
		**/
		var $iframe = $('<iframe id="' + $framename + '" name="'+ $framename + '" style="width:0;height:0;border:0px solid #fff;"></iframe>')
			.insertAfter($memory['agent'])
			.bind('load', function(){
				try {
					var $frame = FireSpark.core.helper.getFrame($framename);
					var $data = $frame.document.body.innerHTML;
					switch($memory['type']){
						case 'html' :
							$memory['data'] = $data;
							break;
						case 'json' :
						default :
							$memory['data'] = $.parseJSON($data);
							break;
					}
					
					/**
					 *	Run the workflow
					**/
					Snowblozm.Kernel.execute($memory['workflow'], $memory);
					FireSpark.core.ajax.end();
				}
				catch($error){
					$memory['error'] = $error.description;
					$memory['result'] = FireSpark.core.constant.loaderror + '<span class="hidden"> [Error :' + $error.description + ']</span>';
					
					/**
					 *	Run the errorflow if any
					**/
					if($memory['errorflow']){
						Snowblozm.Kernel.execute($memory['errorflow'], $memory);
					}
					FireSpark.core.ajax.end();
				}
			})
			.bind('error', function($error){
				$memory['error'] = $error;
				$memory['result'] = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					Snowblozm.Kernel.execute($memory['errorflow'], $memory);
				}
				FireSpark.core.ajax.end();
			});
			
		/**
		 *	Remove IFRAME after timeout (150 seconds)
		**/
		window.setTimeout(function(){
			$iframe.remove();
		}, 150000);
		
		/**
		 *	@return true 
		 *	to continue default browser event with target on iframe
		**/
		return { valid : true };
	},
	
	output : function(){
		return [];
	}
};
/** *	@service NavigatorInit *	@desc Initializes navigator launch triggers * *	@param selector string [memory] *	@param event string [memory] optional default 'click' *	@param attribute string [memory] *	@param escaped boolean [memory] optional default false *	@param hash boolean [memory] optional default false ***/FireSpark.jquery.service.NavigatorInit = {	input : function(){		return {			required : ['selector', 'attribute'],			optional : { event : 'click', escaped : false, hash : false, pathname : false }		};	},		run : function($memory){		$($memory['selector']).live($memory['event'], function(){			FireSpark.jquery.HashLaunch.idle = false;						var $root = $(this);			var $navigator = $root.attr($memory['attribute']);						if($memory['attribute'] == 'href' || false){				$navigator = unescape($navigator);			}						$result = Snowblozm.Kernel.launch($navigator, $memory['escaped'], $root);						if($memory['hash']){				FireSpark.jquery.HashLaunch.current = window.location.hash = $navigator;			}						FireSpark.jquery.HashLaunch.idle = true;			return $result;		});				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/** *	@service RegistrySave *	@desc Saves a new Reference * *	@param key string [message] *	@param value string [message] optional default false ***/FireSpark.jquery.service.RegistrySave = {	input : function(){		return {			required : ['key'],			optional : { value : false }		};	},		run : function($memory){		Snowblozm.Registry.save($memory['key'], $memory['value']);				$memory['valid'] = true;		return $memory;	},		output : function(){		return [];	}};/**
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [memory]
 *	@param data object [memory] optional default {}
 *
 *	@return result html [memory]
 *
**/
FireSpark.jquery.service.TemplateApply = {
	input : function(){
		return {
			required : ['template'],
			optional : { data : {} }
		};
	},
	
	run : function($memory){
		$memory['result'] = $.tmpl($memory['template'], $memory['data']);
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result'];
	}
};
/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data object [memory] optional default {}
 *	@param key string [memory] optional default 'template'
 *	@param template string [memory] optional default 'tpl-default' (FireSpark.jquery.template.Default)
 *
 *	@param result Template [memory]
 *	@param data object [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	input : function(){
		return {
			optional : { data : {}, key : 'template', template : 'tpl-default' }
		};
	},
	
	run : function($memory){
		if($memory['data'][$memory['key']]){
			$memory['result'] = $.template($memory['data'][$memory['key']]);
		}
		else if ($memory['data']['message'] && $memory['data']['message'][$memory['key']]){
			$memory['result'] = $.template($memory['data']['message'][$memory['key']]);
			$memory['data']['content'] = $memory['data']['message']['content'] || false;
		}
		else if($memory['template'].charAt(0) == '#'){
			$memory['result'] = $.template($memory['template']);
		}
		else {
			$memory['result'] = Snowblozm.Registry.get($memory['template']);
		}
		
		$memory['valid'] = true;
		return $memory;
	},
	
	output : function(){
		return ['result', 'data'];
	}
};
/** *	@workflow BindTemplate *	@desc Binds template with data into element * *	@param cntr string [memory] *	@param select boolean [memory] optional default true *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' *	@param arg string [memory] optional default {} * *	@return element element [memory] ***/FireSpark.jquery.workflow.BindTemplate = {	input : function(){		return {			required : ['cntr'],			optional : { 				select : true, 				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				arg : ''			}		};	},		run : function($memory){		$memory = Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.DataEncode,			input : { data : 'arg' },			type : 'json'		},{ 			service : FireSpark.jquery.workflow.TemplateApply,			input : {				element : 'cntr',				template : 'tpl', 				animation : 'anm',				duration : 'dur',				delay : 'dly'			}		}], $memory);				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['element'];	}};/** *	@workflow CookieLogin *	@desc Sign in using Cookie * *	@param key string [message] optional default 'sessionid' *	@param value string [message] optional default null *	@param expires integer[message] optional default 1 day *	@param path string [memory] optional default '/' *	@param continue string [message] optional default false ***/FireSpark.jquery.workflow.CookieLogin = {	input : function(){		return {			optional : { key : 'sessionid', value : null, expires : 1, path : '/', 'continue' : false }		}	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.CookieMake		},{			service : FireSpark.core.service.WindowReload		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow DataSubmit *	@desc Submits data using ajax or iframe and loads template with response data into .status in form * *	@param sel form-parent selector string [memory] *	@param cntr container selector string [memory] optional default 'sel .status:last' *	@param url string URL [memory]  *	@param req string Request type [memory] optional default POST *	@param cls string [memory] optional default 'data' *	@param iframe string [memory] optional default false *	@param error string [memory] optional default span * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param type string [memory] optional default 'json' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' ***/FireSpark.jquery.workflow.DataSubmit = {	input : function(){		return {			required : ['sel', 'url'],			optional : { 				cntr : false,				req : 'POST',				cls : 'data',				iframe : false,				error : 'span',				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				ec : 'url',				type : 'json',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend : { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		if($memory['iframe']){			var $loader = FireSpark.jquery.service.LoadIframe;		}		else {			var $loader = FireSpark.jquery.service.LoadAjax;		}				if($memory['cntr']){		} else {			$memory['cntr'] = $memory['sel'] +' .status:last';		}				return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.FormValidate,			input : { form : 'sel' }		},{			service : FireSpark.jquery.service.DataRead,			input : { cntr : 'sel' }		},{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				element : 'cntr',				request : 'req',				template : 'tpl', 				confirm : 'cf', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly',				agent : 'sel'			},			loader : $loader,			select : true,			selector : $memory['sel'] + ' .button.load'		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow ElementHtml *	@desc Loads HTML content into container * **	@param iframe string [memory] optional default false *	@param error string [memory] optional default span * *	@param url URL [memory] *	@param cntr string [memory] *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove') ***/FireSpark.jquery.workflow.ElementHtml = {	input : function(){		return {			required : ['url', 'cntr'],			optional : { 				iframe : false,				agent : false,				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0,				act : 'all'			}		};	},		run : function($memory){		if($memory['iframe']){			var $loader = FireSpark.jquery.service.LoadIframe;		}		else {			var $loader = FireSpark.jquery.service.LoadAjax;		}				return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.workflow.LoadHtml,			input : { element : 'cntr', animation : 'anm', duration : 'dur', delay : 'dly', loaddata : 'ld', action : 'act' },			select : true,			loader : $loader		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow ElementTemplate *	@desc Loads template with data into container * *	@param cntr string [message] * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param sel string [memory] optional default false *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param arg string [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' ***/FireSpark.jquery.workflow.ElementTemplate = {	input : function(){		return {			required : ['cntr', 'url'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				sel : false,				ec : 'url',				arg : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				element : 'cntr', 				template : 'tpl', 				data : 'arg', 				confirm : 'cf', 				selector : 'sel', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			select : true,			stop : true		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow FormSubmit *	@desc Submits form using ajax or iframe and loads template with response data into div.status in form * *	@param sel form-parent selector string *	@param cntr container selector string [memory] optional default 'sel .status:last' *	@param iframe string [memory] optional default false *	@param error string [memory] optional default span * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param type string [memory] optional default 'json' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' ***/FireSpark.jquery.workflow.FormSubmit = {	input : function(){		return {			required : ['sel'],			optional : { 				cntr : false,				iframe : false,				error : 'span',				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				ec : 'url',				type : 'json',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend : { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		if($memory['iframe']){			var $loader = FireSpark.jquery.service.LoadIframe;		}		else {			var $loader = FireSpark.jquery.service.LoadAjax;		}				if($memory['cntr']){		} else {			$memory['cntr'] = $memory['sel'] +' .status:last';		}				return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.FormValidate,			form : $memory['sel'] + ' form'		},{			service : FireSpark.jquery.service.FormRead,			form : $memory['sel'] + ' form'		},{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				element : 'cntr',				template : 'tpl', 				confirm : 'cf', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			loader : $loader,			select : true,			selector : $memory['sel'] + ' input[name=submit]',			agent : $memory['sel'] + ' form'		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow LoadHtml *	@desc Loads HTML content into element * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param url URL [memory] *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove') * *	@return element element [memory] ***/FireSpark.jquery.workflow.LoadHtml = {	input : function(){		return {			required : ['url', 'element'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				select : false, 				loaddata : FireSpark.core.constant.loadmsg,				animation : 'fadein',				duration : 1000,				delay : 0,				action : 'all'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.ElementContent,			input : { data : 'loaddata' },			duration : 5		},{			service : $memory['loader'],			type : 'html',			request : 'GET',			args : ['element', 'animation', 'duration', 'delay', 'action'],			workflow : [{				service : FireSpark.jquery.service.ElementContent			}],			errorflow : [{				service : FireSpark.jquery.service.ElementContent			}]		}], $memory);	},		output : function(){		return ['element'];	}};/** *	@workflow LoadTemplate *	@desc Loads template with data into element * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove') * *	@param key string [memory] optional default 'template' *	@param template string [memory] optional default 'tpl-default' * *	@param confirm boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param selector string [memory] optional default false *	@param encode string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param data string [memory] optional default  *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } *	@param stop boolean [memory] optional default false * *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@return element element [memory] ***/FireSpark.jquery.workflow.LoadTemplate = {	input : function(){		return {			required : ['element', 'url'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				select : false, 				loaddata : FireSpark.core.constant.loadmsg,				animation : 'fadein',				duration : 1000,				delay : 0, 				action : 'all',				key : 'template', 				template : 'tpl-default' ,				confirm : false,				confirmmsg : 'Are you sure you want to continue ?',				selector : false,				encode : 'url',				data : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				stop : false,				launch : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.core.service.LoadConfirm,			input : { value : 'confirmmsg' }		},{			service : FireSpark.jquery.service.DataEncode,			input : { type : 'encode' },			output : { result : 'data' }		},{			service : FireSpark.jquery.service.ElementState,			input : { element : 'selector' },			disabled : true		},{			service : FireSpark.jquery.service.ElementContent,			input : { data : 'loaddata' },			duration : 5		},{			service : $memory['loader'],			args : ['element', 'selector', 'template', 'animation', 'duration', 'delay', 'action', 'key', 'launch', 'status', 'message'],			workflow : [{				service : FireSpark.jquery.service.ElementState,				input : { element : 'selector' }			},{				service : FireSpark.jquery.service.LaunchMessage			},				$memory['workflowend']			],			errorflow : [{				service : FireSpark.jquery.service.ElementState,				input : { element : 'selector' }			}, 				$memory['errorflowend']			]		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow TabTemplate *	@desc Loads template with data into new tab in tabui * *	@param tabui string [message] optional default 'tabuipanel' *	@param title string [message] optional default 'Krishna' * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param sel string [memory] optional default false *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param arg string [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' ***/FireSpark.jquery.workflow.TabTemplate = {	input : function(){		return {			required : ['url'],			optional : { 				tabui : 'tabuipanel',				title : 'Krishna',				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				sel : false,				ec : 'url',				arg : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'firespark'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.ElementTab		},{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				template : 'tpl', 				data : 'arg', 				confirm : 'cf', 				selector : 'sel', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			stop : true		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow TemplateApply *	@desc Applies template with data * *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param template string [memory] optional default 'tpl-default' *	@param data object [memory] optional default {} *	@param key string [memory] optional default 'template' *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 *	@param action string [memory] optional default 'all' * *	@return element element [memory] ***/FireSpark.jquery.workflow.TemplateApply = {	input : function(){		return {			required : ['element'],			optional : { 				select : false, 				data : {}, 				key : 'template', 				template : 'tpl-default' ,				animation : 'fadein',				duration : 1000,				delay : 0,				action : 'all'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{				service : FireSpark.jquery.service.TemplateRead			},{				service : FireSpark.jquery.service.TemplateApply,				input : { template : 'result' }			},{				service : FireSpark.jquery.service.ElementContent,				input : { data : 'result' }			}], $memory);	},		output : function(){		return ['element'];	}};/** *	@workflow TileInitialize *	@desc Activates container elements using templates for TileUI * *	@param key string [memory] optional default 'ui-global' *	@param id long int [memory] optional default '0' *	@param ins string [memory] optional default '#ui-global-0' *	@param tpl template [memory] optional default '#tpl-def-tls' *	@param inl boolean [memory] optional default false *	@param act string [memory] optional default 'first' ('all', 'first', 'last', 'remove') *	@param tile string [memory] optional default false * *	@param iframe string [memory] optional default false *	@param agent string [memory] optional default false *	@param root object [memory] optional default false * *	@param url string [memory] optional default '' *	@param data object [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param process boolean [memory] optional default false *	@param mime string [memory] optional default 'application/x-www-form-urlencoded' *	@param args array [args] * *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ContainerRender } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } *	@param stop boolean [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 *	@param bg boolean [memory] optional default false * *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@return element element [memory] ***/FireSpark.jquery.workflow.TileInitialize = {	input : function(){		return {			optional : { 				key : 'ui-global', 				id : '0',				ins : 'ui-global-0',				tpl : '#tpl-def-tls',				inl : false,				act : 'first',				tile : false,				iframe : false,				root : false,				agent : false,				url : '',				data : '', 				type : 'json', 				request : 'POST', 				process : false, 				mime : 'application/x-www-form-urlencoded',				workflowend : { service : FireSpark.jquery.service.ContainerRender },				errorflowend : { service : FireSpark.jquery.service.ElementContent },				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				bg : false,				stop : false,				launch : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.ContainerData,			args : ['key', 'id', 'ins', 'root', 'ln', 'status', 'message', 'tpl', 'inl', 'act', 'tile', 'anm', 'dur', 'dly', 'bg'],			workflow : [{				service : FireSpark.jquery.service.LaunchMessage,				input : {					ln : 'launch'				}			},				$memory['workflowend'],			],			errorflow : [				$memory['errorflowend']			]		}], $memory);	},		output : function(){		return [];	}};/** *	@workflow TileShow *	@desc Shows tile content into parent element * *	@param ins string [memory] optional default '#ui-global-0' *	@param select boolean [memory] optional default true *	@param tile string [memory] optional false *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 500 *	@param dly integer [memory] optional default 0 * *	@return element element [memory] ***/FireSpark.jquery.workflow.TileShow = {	input : function(){		return {			optional : { 				ins : '#ui-global-0',				select : true, 				tile : false,				anm : 'fadein',				dur : 500,				dly : 0			}		};	},		run : function($memory){		$memory = Snowblozm.Kernel.execute([{				service : FireSpark.jquery.service.ElementToggle,				element : $memory['ins'] + '>.bands',				input : { 					content : 'tile',					animation : 'anm',					duration : 'dur',					delay : 'dly'				},				child : '.tile-content'		}], $memory);				$memory['valid'] = true;		return $memory;	},		output : function(){		return ['element'];	}};/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<span class="{{if valid}}success{{else}}error{{/if}}">${msg}</span>\
	<span class="hidden">${details}</span>\
');

Snowblozm.Registry.save('tpl-default', FireSpark.jquery.template.Default);
/**
 *	@template Tiles
**/
FireSpark.jquery.template.Tiles = $.template('\
	<ul class="hover-menu horizontal tls-${key}-${id}">\
		<span class="tilehead">\
			${tilehead}\
			{{if FireSpark.core.helper.equals(close, true)}}\
				<a class="launch close hover" href="#/tileclose/key/${key}/id/${id}/ins/${instance}" title="Close"></a>\
			{{/if}}\
		</span>\
		{{each tiles}}\
		<li>\
			{{if FireSpark.core.helper.equals(!privileged || (privileged && admin), true)}}\
				{{if tpl}}\
					{{tmpl tpl}}\
				{{else urlhash}}\
					<a href="${urlhash}" class="navigate tile ${style}">${name}</a>\
				{{else}}\
					<a href="#/showtile/ins/${instance}/tile/${tile}-${id}" class="navigate tile ${style}">${name}</a>\
				{{/if}}\
			{{/if}}\
		</li>\
		{{/each}}\
	</ul>\
');

Snowblozm.Registry.save('tpl-tiles', FireSpark.jquery.template.Tiles);

/**
 *	@template Bands
**/
FireSpark.jquery.template.Bands = $.template('\
	{{each tiles}}\
		<span></span>\
		{{if $value.tiletpl}}\
			{{tmpl $value.tiletpl}}\
		{{/if}}\
	{{/each}}\
');

Snowblozm.Registry.save('tpl-bands', FireSpark.jquery.template.Bands);

/**
 *	@template Container
**/
FireSpark.jquery.template.Container = $.template('\
	<div class="tiles"></div>\
	{{if inline}}<div class="bands"></div>{{/if}}\
');

Snowblozm.Registry.save('tpl-container', FireSpark.jquery.template.Container);
