/** *	@service NavigatorInit *	@desc Initializes Navigator * *	@param selector string [message] *	@param event string [message] optional default 'click' *	@param attribute string [message] *	@param escaped boolean [message] optional default false ***/ServiceClient.jquery.service.NavigatorInit = {	run : function(message, memory){		var result = $(message.selector);		result.live(message.event || 'click', function(){			return ServiceClient.Kernel.navigate($(this).attr(message.attribute), message.escaped || false);		});		return true;	}};