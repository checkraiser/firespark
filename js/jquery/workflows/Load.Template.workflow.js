/** *	@workflow LoadTemplate *	@desc Loads template with data into element * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param element string [memory] *	@param select boolean [memory] optional default false *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param animation string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param duration integer [memory] optional default 1000 *	@param delay integer [memory] optional default 0 *	@param action string [memory] optional default 'all' ('all', 'first', 'last', 'remove') * *	@param key string [memory] optional default 'template' *	@param template string [memory] optional default 'tpl-default' * *	@param confirm boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param selector string [memory] optional default false *	@param encode string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param data string [memory] optional default  *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } *	@param stop boolean [memory] optional default false * *	@param launch boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@return element element [memory] ***/FireSpark.jquery.workflow.LoadTemplate = {	input : function(){		return {			required : ['element', 'url'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				select : false, 				loaddata : FireSpark.core.constant.loadmsg,				animation : 'fadein',				duration : 1000,				delay : 0, 				action : 'all',				key : 'template', 				template : 'tpl-default' ,				confirm : false,				confirmmsg : 'Are you sure you want to continue ?',				selector : false,				encode : 'url',				data : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				stop : false,				launch : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		return Snowblozm.Kernel.execute([{			service : FireSpark.core.service.LoadConfirm,			input : { value : 'confirmmsg' }		},{			service : FireSpark.jquery.service.DataEncode,			input : { type : 'encode' },			output : { result : 'data' }		},{			service : FireSpark.jquery.service.ElementState,			input : { element : 'selector' },			disabled : true		},{			service : FireSpark.jquery.service.ElementContent,			input : { data : 'loaddata' },			duration : 5		},{			service : $memory['loader'],			args : ['element', 'selector', 'template', 'animation', 'duration', 'delay', 'action', 'key', 'launch', 'status', 'message'],			workflow : [{				service : FireSpark.jquery.service.ElementState,				input : { element : 'selector' }			},{				service : FireSpark.jquery.service.LaunchMessage			},				$memory['workflowend']			],			errorflow : [{				service : FireSpark.jquery.service.ElementState,				input : { element : 'selector' }			}, 				$memory['errorflowend']			]		}], $memory);	},		output : function(){		return [];	}};