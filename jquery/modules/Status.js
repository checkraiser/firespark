/** *	Status module * *	@param selector string *	@param value string *	@param show integer  *	@param hide integer ***/ServiceClient.jquery.module.Status = {	run : function(message, memory){		var el = $(message.selector)		el.html(message.value);		if(message.show || false){			el.fadeIn(message.show);		}		if(message.hide || false){			el.fadeOut(message.hide);		}		return true;	}};