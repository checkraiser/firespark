/** *	Alert module * *	@param title string *	@param data content (text/html) ***/ServiceClient.jquery.module.Alert = (function(){	return {		execute : function(args){			alert(args.title + " : " + args.data);		}	};})();