FireSpark = {};
FireSpark.core = {};

FireSpark.core.service = {};
FireSpark.core.workflow = {};

FireSpark.core.helper = {};
FireSpark.core.constant = {};

FireSpark.core.constant.loadmsg = '<p class="loading">Loading ...</p>';
FireSpark.core.constant.loaderror = '<p class="error">The requested resource could not be loaded</p>';
/**
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
FireSpark.jquery = {};

FireSpark.jquery.service = {};
FireSpark.jquery.workflow = {};

FireSpark.jquery.helper = {};
FireSpark.jquery.constant = {};

FireSpark.jquery.template = {};
/**
 *	@service ElementContent
 *	@desc Fills element with content and animates it and returns element in memory
 *
 *	@param element string [memory]
 *	@param select boolean [memory] optional default false
 *	@param data html/text [memory] optional default ''
 *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [memory] optional default 1000
 *	@param delay integer [memory] optional default 0
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
		
		var $animation = $memory['animation'];
		var $duration = $memory['duration'];
		
		if($animation == 'fadein' || $animation == 'slidein'){
			$element.hide();
		}
		
		$element.html($memory['data']);
		$element.trigger('load');
		$element.delay($memory['delay']);
		
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
/**
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
/**
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
			},
			
			error : function($request, $status, $error){
				$memory['error'] = $error;
				//$memory['status'] = $status;
				$memory['data'] = FireSpark.core.constant.loaderror + ' [Error : ' + $error + ']';
				
				/**
				 *	Run the errorflow if any
				**/
				if($memory['errorflow']){
					Snowblozm.Kernel.execute($memory['errorflow'], $memory);
				}
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
				}
				catch($error){
					$memory['error'] = $error.description;
					$memory['result'] = FireSpark.core.constant.loaderror + '[Error :' + $error.description + ']';
					
					/**
					 *	Run the errorflow if any
					**/
					if($memory['errorflow']){
						Snowblozm.Kernel.execute($memory['errorflow'], $memory);
					}
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
/**
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
/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<p class="{{if valid}}success{{else}}error{{/if}}">${msg}</p>\
');

Snowblozm.Registry.save('tpl-default', FireSpark.jquery.template.Default);