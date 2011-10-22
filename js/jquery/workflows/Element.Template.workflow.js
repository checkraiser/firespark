/** *	@workflow ElementTemplate *	@desc Loads template with data into container * *	@param cntr string [message] * *	@param loader object [memory] optional default FireSpark.jquery.service.LoadAjax *	@param agent string [memory] optional default false * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param sel string [memory] optional default false *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param url URL [memory] *	@param arg string [memory] optional default '' *	@param type string [memory] optional default 'json' *	@param request string [memory] optional default 'POST' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'firespark' ***/FireSpark.jquery.workflow.ElementTemplate = {	input : function(){		return {			required : ['cntr', 'url'],			optional : { 				loader : FireSpark.jquery.service.LoadAjax,				agent : false,				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				sel : false,				ec : 'url',				arg : '',				type : 'json',				request : 'POST',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend :  { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'firespark'			}		};	},		run : function($memory){		return FireSpark.Kernel.execute([{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				element : 'cntr', 				template : 'tpl', 				data : 'arg', 				confirm : 'cf', 				selector : 'sel', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			select : true,			stop : true		}], $memory);	},		output : function(){		return [];	}};