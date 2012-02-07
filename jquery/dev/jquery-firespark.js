/**
 * @initialize FireSpark
**/
FireSpark = {
	core : {
		service : {},
		workflow : {},
		helper : {},
		constant : {}
	},
	ui : {
		service : {},
		workflow : {},
		helper : {},
		constant : {},
		template : {}
	},
	smart : {
		service : {},
		workflow : {},
		helper : {},
		constant : {}
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
		
		FireSpark.jquery.helper.LoadBarrier.start();
		
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
				FireSpark.jquery.helper.LoadBarrier.end();
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
				FireSpark.jquery.helper.LoadBarrier.end();
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
		
		FireSpark.jquery.helper.LoadBarrier.start();
		
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
					FireSpark.jquery.helper.LoadBarrier.end();
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
					FireSpark.jquery.helper.LoadBarrier.end();
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
				FireSpark.jquery.helper.LoadBarrier.end();
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
 *	@helper readFileSize
 *
 *	@param size
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
/**
 *	@helper readGender 
 *
 *	@param ch gender character
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.core.helper.readGender = function($ch){
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ContainerData = {
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
				workflowend : { service : FireSpark.ui.service.ContainerRender },
				errorflowend : { service : FireSpark.ui.service.ElementContent },
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
			var $loader = FireSpark.core.service.LoadIframe;
		}
		else {
			var $loader = FireSpark.core.service.LoadAjax;
		}
		
		var $instance = $memory['key']+'-'+$memory['id'];
		var $value = Snowblozm.Registry.get($instance) || false;
		
		if($value || false){
			return Snowblozm.Kernel.run($memory['workflowend'], $memory);
		}
		else {
			return Snowblozm.Kernel.execute([{
				service : FireSpark.ui.service.ElementContent,
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
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
/**
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementContent = {
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
		if($memory['select']){
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
		
		if($animation == 'fadein' || $animation == 'slidein'){
			$element.hide();
		}
		
		switch($memory['action']){
			case 'all' :
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
/**
 *	@service ElementSection
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementSection = {
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
		if($memory['select']){
			var $element = $($memory['element']);
			if(!$element.length){
				$element = $('#main-container');
			}
		}
		else {
			$element = $memory['element'];
		}
		
		$element.children($memory['child']).hide();
		
		if($memory['content']){
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
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.ElementTab = {
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
 *	@service TemplateApply
 *	@desc Applies template
 *
 *	@param template Template [memory]
 *	@param data object [memory] optional default {}
 *
 *	@return result html [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.TemplateApply = {
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
 *	@param template string [memory] optional default 'tpl-default' (FireSpark.jquery.template.Default)
 *
 *	@param result Template [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.ui.service.TemplateRead = {
	input : function(){
		return {
			optional : { template : 'tpl-default' }
		};
	},
	
	run : function($memory){
		$tpl = $memory['template'];
		$template = Snowblozm.Registry.get($tpl);
		
		if(!$template && $tpl.charAt(0) == '#'){
			$template = $.template($tpl);
			if($template){
				Snowblozm.Registry.save($tpl, $template);
			}
		}
	
		$memory['result'] = $template;
		$memory['valid'] = ($template || false) ? true : false;
		return $memory;
	},
	
	output : function(){
		return ['result'];
	}
};
/**
 *	@service DataImport
 *	@desc Uses AJAX and IFRAME to load data from server and saves in pool
 *
 *	@param imports array [memory]
 *	@param workflow Workflow [memory]
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.DataImport = {
	input : function(){
		return {
			required : ['imports', 'workflow']
		}
	},
	
	run : function($memory){
		/**
		 *	Set barrier
		**/
		$workflow = $memory['workflow'];
		$imports = $memory['imports'];
		
		FireSpark.core.helper.LoadBarrier.barrier(function(){
			$flag = false;
			for(var $i in $imports){
				if(Snowblozm.Registry.get($imports[$i]) || false){
				} else {
					$flag = true;
					break;
				}
			}
				
			if($flag || false){
				FireSpark.smart.helper.dataState(FireSpark.smart.constant.loaderror);
				return { valid : false };
			}
			
			Snowblozm.Kernel.execute($workflow, $memory);
		});
		
		/**
		 *	Load imports
		**/
		$barrier = false;
		
		for(var $i in $imports){
			$key = 'FIRESPARK_IMPORT_' + $imports[$i];
			
			if(Snowblozm.Registry.get($key) || false){
			} else {
				$barrier = true;
				
				Snowblozm.Kernel.execute([,{
					service : FireSpark.core.service.LoadAjax,
					url : $imports[$i],
					type : 'html',
					request : 'GET',
					workflow : [{
						service : FireSpark.ui.service.ElementContent,
						element : FireSpark.smart.constant.importdiv,
						select : true,
						action : 'last',
						duration : 5
					},{
						service : FireSpark.core.service.DataRegistry,
						key : $key,
						value : true
					}]
				}], {});
			}
		}
		
		/**
		 *	Finalize barrier
		**/
		if($barrier){
			FireSpark.smart.helper.dataState(FireSpark.smart.constant.loadstatus);
			return { valid : false };
		} else {
			return Snowblozm.Kernel.execute($workflow, $memory);
		}
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@service DataLoad
 *	@desc Uses AJAX and IFRAME to load data from server and saves in pool
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
 *	@param force boolean [memory] optional default FireSpark.smart.constant.poolforce
 *	@param cache boolean [memory] optional default false
 *	@param expiry integer [memory] optional default FireSpark.smart.constant.poolexpiry
 *
 *	@param iframe string [memory] optional default false
 *	@param agent string [memory] optional default root
 *	@param root element [memory] optional default false
 *
 *	@return data string [memory]
 *	@return error string [memory] optional
 *
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
**/
FireSpark.smart.service.DataLoad = {
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
				stop : false,
				cache : true,
				expiry : FireSpark.smart.constant.poolexpiry,
				force : FireSpark.smart.constant.poolforce,
				iframe : false,
				agent : false,
				root : false
			}
		}
	},
	
	run : function($memory){
		/**
		 *	Check AJAX
		**/
		if($memory['iframe']){
			$memory['agent'] = $memory['agent'] ? $memory['agent'] : $memory['root'];
			
			return Snowblozm.Kernel.run({
				service : FireSpark.jquery.service.LoadIframe,
				args : $memory['args']
			}, $memory);
		}
		else if($memory['force'] === false){
			/**
			 *	Check pool
			**/
			$key = 'FIRESPARK_SI_DATA_URL_' + $memory['url'] + '_DATA_' + $memory['data'] + '_TYPE_' + $memory['type'] + '_REQUEST_' + $memory['request'];
			$data = Snowblozm.Registry.get($key);
			
			if($data){
				if($data['valid'] || false){
					$memory['data'] = $data;
					
					/**
					 *	Run the workflow
					**/
					return Snowblozm.Kernel.execute($memory['workflow'], $memory);
				}
			}
		}
		
		$workflow = $memory['workflow'];
		
		if($memory['cache']){
			$workflow.shift({
				service : FireSpark.core.service.DataRegistry,
				input : { value : 'data' },
				key : $key,
				expiry : $memory['expiry']
			});
		}
		
		/**
		 *	Load AJAX
		**/
		return Snowblozm.Kernel.run({
			service : FireSpark.jquery.service.LoadAjax,
			args : $memory['args'],
			workflow : $workflow
		}, $memory);
	},
	
	output : function(){
		return [];
	}
};
/**
 *	@config FireSpark.core
**/
FireSpark.core.constant = {
	validations : {
		required : {
			cls : '.required',
			helper : FireSpark.core.helper.CheckRequired
		},
		email : {
			cls : '.email',
			helper : FireSpark.core.helper.CheckEmail
		},
		match : {
			cls : '.match',
			helper : FireSpark.core.helper.CheckMatch
		}
	},
	validation_status : 'span'
}

/**
 *	@config FireSpark.ui
**/
FireSpark.ui.constant = {
	transforms : {
		uibutton : {
			cls : '.uibutton',
			helper : FireSpark.ui.helper.transformButton,
			config : {}
		},
		ckeditor : {
			cls : '.ckeditor',
			helper : FireSpark.ui.helper.transformCKEditor,
			config : {}
		},
		uitabpanel : {
			cls : '.uitabpanel',
			helper : FireSpark.ui.helper.transformTabpanel,
			config : { 
				savekey : 'tabpanel',
				select : false, 
				cache : false,	
				collapsible : false, 
				event : 'click', 
				tablink : false, 
				indexstart : 0 
			}
		}
	}
};

/**
 *	@config FireSpark.smart
**/
FireSpark.smart.constant = {
	statusdiv : '#load-status',
	loaderror : '<span class="error">Error Loading Data</span>',
	loadstatus : '<span class="state loading">Loading ...</span>',
	importdiv : '#ui-imports',
	maindiv : '#ui-global-0',
	poolexpiry : 150,
	poolforce : false
};
