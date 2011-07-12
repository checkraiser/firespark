/**
 *	@project FireSpark
 *	@desc JavaScript Service Architecture and Workflow Framework
 *
 *	@class FireSpark
 *	@desc Provides Registry and Kernel functionalities
 *	
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	Services are generic modules providing resuable stateless functionalities
 *
 *	interface Service {
 *		public function run(message, memory){
 *			... use message for receiving configurations ...
 *			... use memory for managing state in workflows ...
 *			... save reference in Registry instead of returning objects ...
 *		}
 *	}
 *
 *	Workflows are array of services that use common memory for state management
 *
 *	workflow = [{	
 *		service : ...,
 *		( ... params : ... )
 *	}];
 *
 * 	Navigator is index (workflow alias) followed by parameters to be overrided delimited by ':'
 *	indexes usually starts with # (href programming)
 *
 *	example #testtab:tabtitle=Krishna:loadurl=test.php
 *
 *	basic escape = with ~
 *
 *	escapes for usage in form id
 *	# by _ 
 *	= by .
 *	
**/

var FireSpark = (function(){
	/**
	 *	@var references array
	 *	@desc an array for saving references
	 *	
	 *	references may be accessed through the Registry
	 *
	**/
	var references = new Array();
	
	/**
	 *	@var navigators array
	 *	@desc an array that saves indexes to service workflows
	 *
	**/
	var navigators = new Array();
	
	return {
		/**
		 *	@var Registry object
		 *	@desc manages references and navigators
		 *
		**/
		Registry : {
			/**
			 *	@method save
			 *	@desc saves a Reference with index
			 *
			 *	@param index string
			 *	@param reference object or any type
			 *
			**/
			save : function(index, reference){
				references[index] = reference;
			},
			
			/**
			 *	@method get
			 *	@desc gets the Reference for index
			 *
			 *	@param index string
			 *
			**/
			get : function(index){
				return references[index];
			},
			
			/**
			 *	@method remove
			 *	@desc removes a Reference with index
			 *
			 *	@param index string
			 *
			**/
			remove : function(index){
				references[index] = 0;
			},
			
			/**
			 *	@method add
			 *	@desc adds a Navigator index
			 *
			 *	@param index string
			 *	@param workflow object
			 *
			**/
			add : function(index, workflow){
				navigators[index] = workflow;
			},
			
			/**
			 *	@method removeNavigator
			 *	@desc removes a Navigator index
			 *
			 *	@param index string
			 *
			**/
			removeNavigator : function(index){
				navigators[index] = 0;
			}
		},
		
		/**
		 *	@var Kernel object
		 *	
		 *	@desc manages the following tasks
		 *		runs services and workflows when requested
		 *		processes navigators when received and launch workflows
		 *
		**/
		Kernel : {			
			/** 
			 *	@method run
			 *	@desc executes a workflow with the given definition
			 *
			 *	@param config object
			 *	@param mem object optional default {}
			 *
			**/
			run : function(config, mem){
				/**
				 *	create a new memory if not passed
				**/
				var memory = mem || {};
				var result = true;
				
				for(var i in config){
					var service = config[i].service;
					var message = config[i];
					var strict = config[i].strict || true;
					
					/**
					 *	continue on invalid state
					**/
					if(result !== true && strict === true)
						continue;
					
					/**
					 *	run the service with the message and memory
					**/
					result = service.run(message, memory);
				}
				
				return result;
			},
			
			/**
			 *	@method launch
			 *	@desc processes the navigator received to launch workflows
			 *
			 *	@param navigator string
			 *	@param escaped boolean optional default false
			 *
			**/
			launch : function(navigator, escaped){
				
				/**
				 *	Process escaped navigator
				**/
				if(escaped || false){
					navigator = navigator.replace(/_/g, '#');
					navigator = navigator.replace(/\./g, '=');
				}
				
				/**
				 *	Parse navigator
				 **/
				var req = navigator.split(':');
				var index = req[0];
				
				/**
				 *	Construct message for workflow
				**/
				var message = {};
				for(var i=1, len=req.length; i<len; i++){
					var param = (req[i]).split('=');
					var arg = param[1];
					arg = arg.replace(/~/g, '=');
					message[param[0]] = arg;
				}
				
				/**
				 *	Run the workflow
				**/
				if(navigators[index] || false){
					message['service'] = navigators[index];
					return this.run([message]);
				}
				
				return false;
			}
		}
	};
})();
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
 *	@param element string [message|memory]
 *	@param data html/text [message|memory] optional default ''
 *	@param animation string [message] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout')
 *	@param duration integer [message] optional default 1000
 *	@param delay integer [message] optional default 0
 *
 *	@return element element [memory]
 *
**/
FireSpark.jquery.service.ElementContent = {
	run : function(message, memory){
		if(message.element || false){
			var element = $(message.element);
		}
		else {
			var element = memory.element;
		}
		
		var animation = message.animation || 'fadein';
		var duration = message.duration || 1000;
		
		if(animation == 'fadein' || animation == 'slidein'){
			element.hide();
		}
		
		element.html(message.data || memory.data || '');
		element.trigger('load');
		element.delay(message.delay || 0);
		
		switch(animation){
			case 'fadein' :
				element.fadeIn(duration);
				break;
			case 'fadeout' :
				element.fadeOut(duration);
				break;
			case 'slidein' :
				element.slideIn(duration);
				break;
			case 'slideout' :
				element.slideOut(duration);
				break;
			default :
				element.html('Animation type not supported').fadeIn(duration);
				break;
		}
		
		memory.element = element;
		
		return true;
	}
};
/**
 *	@service ElementTab
 *	@desc Creates a new tab and returns the element
 *
 *	@param tabui string [message]
 *  @param tabtitle string [message]
 *  @param autoload boolean [message] optional default false
 *  @param taburl string [message] optional default false
 *
 *	@return element Element [memory]
 *
**/
FireSpark.jquery.service.ElementTab = {
	run : function(message, memory){
		var tabui = FireSpark.Registry.get(message.tabui);
		memory.element = tabui.add(message.tabtitle, message.autoload || false, message.taburl || false);
		return true;
	}
};
/**
 *	@service ElementTabpanel
 *	@desc Creates a Tabpanel at element and saves a reference
 *
 *	@param element string [message|memory]
 *	@param savekey string [message]
 *	@param cache boolean [message] optional default false
 *	@param collapsible boolean [message] optional default false
 *	@param event string [message] optional default 'click'
 *	@param tablink boolean [message] optional default false
 *	@param indexstart integer [message] optional default 0
 *
 *	@save tabpanel object
 *
**/
FireSpark.jquery.service.ElementTabpanel = {
	run : function(message, memory){
		if(message.element || false){
			var element = $(message.element);
		}
		else {
			var element = memory.element;
		}
		element.hide();
		
		var tab = new Array();
		var index = message.indexstart || 0;
		
		var options = {
			cache : message.cache || false,
			collapsible : message.collapsible || false,
			event : message.event || 'click',
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				tab[index] = $(ui.panel);
			}
		};
		
		if(message.tablink || false){
			options.load = function(event, ui) {
				$('a', ui.panel).click(function() {
					$(ui.panel).load(this.href);
					return false;
				});
			}
		}
		
		var tabpanel = element.tabs(options);
		element.fadeIn(1000);
		
		$('.ui-icon-close').live( "click", function() {
			var indx = $("li", tabpanel).index($(this).parent());
			tabpanel.tabs( "remove", indx );
		});
		index--;
		
		FireSpark.Registry.save(message.savekey, {
			add : function(tabtitle, autoload, taburl){
				index++;
				var url = '#ui-tab-'+index;
				if(autoload || false){
					url = taburl;
				}
				tabpanel.tabs('add', url, tabtitle);
				tabpanel.tabs('select', '#ui-tab-'+index);
				return tab[index];
			}
		});
		return true;
	}	
};
/**
 *	@service LoadAjax
 *	@desc Uses AJAX to load data from server
 *
 *	@param loadurl string [message|memory]
 *	@param loadparams object [message|memory]
 *	@param datatype string [message|memory] optional default 'json'
 *	@param request string [message|memory] optional default 'POST'
 *	@param processData boolean [message] optional default true
 *	@param contentType string [message|memory] optional default 'application/x-www-form-urlencoded'
 *
 *	@param workflow Workflow [message]
 *	@param errorflow	Workflow [message] optional default false
 *
 *	@return data string [memory]
 *	@return status integer Status code [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadAjax = {
	run : function(message, memory){
		
		/**
		 *	Load data from server using AJAX
		**/
		$.ajax({
			url: message.loadurl || memory.loadurl,
			data: message.loadparams || memory.loadparams || {},
			dataType : message.datatype || memory.datatype || 'json',
			type : message.request || memory.request || 'POST',
			processData : memory.processData || true,
			contentType : message.contentType || memory.contentType || 'application/x-www-form-urlencoded',
			
			success : function(data, status, request){
				memory.data = data;
				memory.status = status;
				
				/**
				 *	Run the workflow
				**/
				FireSpark.Kernel.run(message.workflow, memory);
			},
			
			error : function(request, status, error){
				memory.error = error;
				memory.status = status;
				memory.data = FireSpark.core.constant.loaderror + ' [Error : ' + error + ']';
				
				/**
				 *	Run the errorflow if any
				**/
				if(message.errorflow || false){
					FireSpark.Kernel.run(message.errorflow, memory);
				}
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		return false;
	}
};
/**
 *	@service LoadIframe
 *	@desc Uses IFRAME to load data from server
 *
 *	@param agent string [message] 
 *	@param datatype string [message|memory] optional default 'json' ('json', 'html')
 *
 *	@param workflow Workflow [message]
 *	@param errorflow	Workflow [message] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
**/
FireSpark.jquery.service.LoadIframe = {
	run : function(message, memory){
		
		/**
		 *	Genarate unique framename
		**/
		var d= new Date();
		var framename = 'firespark_iframe_' + d.getTime();
		
		/**
		 *	Set target attribute to framename in agent
		**/
		$(message.agent).attr('target', framename);
		
		/**
		 *	Create IFRAME and define callbacks
		**/
		var iframe = $('<iframe id="'+framename+'" name="'+framename+'" style="width:0;height:0;border:0px solid #fff;"></iframe>')
			.insertAfter(message.agent)
			.bind('load', function(){
				try {
					var frame = FireSpark.core.helper.getFrame(framename);
					var data = frame.document.body.innerHTML;
					switch(message.datatype){
						case 'html' :
							memory.data = data;
							break;
						case 'json' :
						default :
							memory.data = $.parseJSON(data);
							break;
					}
					
					/**
					 *	Run the workflow
					**/
					FireSpark.Kernel.run(message.workflow, memory);
				}
				catch(error){
					memory.error = error.description;
					memory.data = FireSpark.core.constant.loaderror + '[Error :' + error.description + ']';
					
					/**
					 *	Run the errorflow if any
					**/
					if(message.errorflow || false){
						FireSpark.Kernel.run(message.errorflow, memory);
					}
				}
			})
			.bind('error', function(error){
				memory.error = error;
				memory.data = FireSpark.core.constant.loaderror;
				
				/**
				 *	Run the errorflow if any
				**/
				if(message.errorflow || false){
					FireSpark.Kernel.run(message.errorflow, memory);
				}
			});
			
		/**
		 *	Remove IFRAME after timeout (150 seconds)
		**/
		window.setTimeout(function(){
			iframe.remove();
		}, 150000);
		
		/**
		 *	@return true 
		 *	to continue default browser event on iframe
		**/
		return true;
	}
};
/**
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [message|memory]
 *	@param data object [message|memory]
 *
 *	@return data html [memory]
 *
**/
FireSpark.jquery.service.TemplateApply = {
	run : function(message, memory){
		memory.data = $.tmpl(message.template || memory.template, message.data || memory.data);
		return true;
	}
};
/**
 *	@service TemplateRead
 *	@desc Reads template definition into memory
 *
 *	@param data.template string [memory]
 *	@param template string [message] optional default FireSpark.jquery.template.Default
 *
 *	@param template template [memory]
 *
**/
FireSpark.jquery.service.TemplateRead = {
	run : function(message, memory){
		if(memory.data.template || false){
			memory.template = $.template(memory.data.template);
		}
		else if(message.template || false){
			memory.template = FireSpark.Registry.get(message.template);
		}
		else{
			memory.template = FireSpark.jquery.template.Default;
		}
		
		return true;
	}
};
/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<p class="{{if valid}}success{{else}}error{{/if}}">${msg}</p>\
');
