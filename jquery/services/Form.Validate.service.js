/** *	@service FormValidate *	@desc Validates form input values (required and email) using style class * *	@style .required *	@style .email * *	@param form string [memory] *	@param error string [memory] optional default p ***/FireSpark.jquery.service.FormValidate = {	input : function(){		return {			required : ['form'],			optional { error : 'p' }		};	},		run : function($memory){		var $result = true;				var checkRequired = function($index, $el){			if($(this).val() == ''){				$result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$($memory['form'] + ' .required').each(checkRequired);				var $emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;		var checkEmail = function($index, $el){			if(!$emailRegex.test($(this).val())){				$result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$($memory['form'] + ' .email').each(checkEmail);				$memory['valid'] = $result;		return $memory;	},		output : function(){		return [];	}};