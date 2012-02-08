/** *	@workflow WriteData *	@desc Submits data using ajax or iframe and loads template with response data into .status in form * *	@param sel form-parent selector string *	@param cls string [memory] optional default 'data' *	@param err string [memory] optional default span * *	@param url URL [memory] optional default FireSpark.smart.constant.defaulturl *	@param cntr string [memory] *	@param tpl string [memory] optional default 'tpl-default' * *	@param select boolean [memory] optional default false *	@param ld string [memory] optional default FireSpark.core.constant.loadmsg *	@param anm string [memory] optional default 'fadein' ('fadein', 'fadeout', 'slidein', 'slideout') *	@param dur integer [memory] optional default 1000 *	@param dly integer [memory] optional default 0 *	@param act string [memory] optional default 'all' ('all', 'first', 'last', 'remove') * *	@param frc boolean [memory] optional default FireSpark.smart.constant.poolforce *	@param cch boolean [memory] optional default false *	@param exp integer [memory] optional default FireSpark.smart.constant.poolexpiry * *	@param iframe string [memory] optional default false *	@param agt string [memory] optional default root *	@param root element [memory] optional default false * *	@param cnf boolean [memory] optional default false *	@param cnfmsg string [memory] optional default FireSpark.smart.constant.cnfmsg * *	@param slr string [memory] optional default false *	@param enc string [memory] optional default 'url' ('url', 'json') * *	@param data string [memory] optional default  *	@param type string [memory] optional default 'json' *	@param req string [memory] optional default 'POST' *	@param workflow Workflow [memory] optional default [{ service : FireSpark.jquery.workflow.TemplateApply, ... }] *	@param errorflow Workflow [memory] optional default [{ service : FireSpark.jquery.service.ElementContent, ... }] *	@param params array [memory] optional default [] *	@param stop boolean [memory] optional default false * *	@param ln boolean [memory] optional default false *	@param status string [memory] optional default 'valid' *	@param message string [memory] optional default 'message' * *	@return element element [memory] * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.smart.workflow.WriteData = {	input : function(){		return {			required : ['cntr', 'sel'],			optional : { 				src : 'form',				url : FireSpark.smart.constant.defaulturl,				cls : 'data',				err : 'span',				cch : true,				exp : FireSpark.smart.constant.poolexpiry,				frc : FireSpark.smart.constant.poolforce,				iframe : false,				agt : false,				root : false,				select : false,				ld : FireSpark.smart.constant.loadmsg,				anm : 'fadein',				dur : 1000,				dly : 0,				act : 'all'				tpl : 'tpl-default' ,				cnf : false,				cnfmsg : FireSpark.smart.constant.cnfmsg,				slr : false,				enc : 'url',				data : '',				type : 'json',				req : 'POST',				workflow : false,				errorflow :  false,				params : [],				stop : false,				ln : false,				status : 'valid',				message : 'message'			}		};	},		run : function($memory){		switch($memory['src']){			case 'form' : 				$readflow = {					service : FireSpark.core.service.ReadForm,					form : $memory['sel'] + ' form',					output : { request : 'req' }				};				break;						case 'div' : 				$readflow = {					service : FireSpark.jquery.service.DataRead,					input : { cntr : 'sel' }				};				break;						default :				break;		}			return Snowblozm.Kernel.execute([{			service : FireSpark.jquery.service.FormValidate,			form : $memory['sel'] + ' form',			input : { error : 'err' }		},			$readflow		,{			service : FireSpark.smart.workflow.ReadTmpl,			cntr : $memory['cntr'] || $memory['sel'] +' .status:last';			sel : $memory['slt'] || $memory['sel'] + ' input[name=submit]',			agt : $memory['agt'] || $memory['sel'] + ' form'		}], $memory);	},		output : function(){		return ['element'];	}};