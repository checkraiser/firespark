/** *	@workflow FormSubmit *	@desc Submits form using ajax or iframe and loads template with response data into div.status in form * *	@param sel form-parent selector string *	@param iframe string [memory] optional default false *	@param error string [memory] optional default span * *	@param loaddata string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 * *	@param key string [memory] optional default 'template' *	@param tpl string [memory] optional default 'tpl-default' * *	@param cf boolean [memory] optional default false *	@param confirmmsg string [memory] optional default 'Are you sure you want to continue ?' *	@param ec string [memory] optional default 'url' ('url', 'json') * *	@param type string [memory] optional default 'json' *	@param workflowend Workflow [memory] optional default { service : FireSpark.jquery.workflow.TemplateApply } *	@param errorflowend Workflow [memory] optional default { service : FireSpark.jquery.service.ElementContent } * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' ***/FireSpark.jquery.workflow.FormSubmit = {	input : function(){		return {			required : ['sel'],			optional : { 				iframe : false,				error : 'span',				loaddata : FireSpark.core.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0, 				key : 'template', 				tpl : 'tpl-default' ,				cf : false,				confirmmsg : 'Are you sure you want to continue ?',				ec : 'url',				type : 'json',				workflowend : { service : FireSpark.jquery.workflow.TemplateApply },				errorflowend : { service : FireSpark.jquery.service.ElementContent },				ln : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		if($memory['iframe']){			var $loader = FireSpark.jquery.service.LoadIframe;		}		else {			var $loader = FireSpark.jquery.service.LoadAjax;		}				return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.FormValidate,			form : $memory['sel'] + ' form'		},{			service : FireSpark.jquery.service.FormRead,			form : $memory['sel'] + ' form'		},{			service : FireSpark.jquery.workflow.LoadTemplate,			input : { 				template : 'tpl', 				confirm : 'cf', 				encode : 'ec', 				launch : 'ln' ,				animation : 'anm',				duration : 'dur',				delay : 'dly'			},			loader : $loader,			element : $memory['sel'] +' span.status',			select : true,			selector : $memory['sel'] + ' input[name=submit]',			agent : $memory['sel'] + ' form'		}], $memory);	},		output : function(){		return [];	}};