/**
 *	TemplateUI renderer
 *
 *	@param loadurl string
 *	@param loadparams object
 *
**/
ServiceClient.jquery.renderer.TemplateUI = function(params){
	var loadurl = params.loadurl;
	var loadparams = params.loadparams;
	
	/**
	 * @param view View
	 * @param template Template
	**/
	this.render = function(memory){
		memory.view.html('<p>Loading ...</p>');
		$.ajax({
			url: loadurl,
			data: loadparams,
			dataType : 'json',
			type : 'POST',
			success : function(data, status, request){
				memory.view.hide();
				memory.view.html($.tmpl(memory.template, data.tpldata))
				memory.view.fadeIn(1000);
				if(data.service||false)
					ServiceClient.client.Kernel.run(data.service);
			},
			error : function(request, status, error){
				memory.view.html('<p>The requested resource could not be loaded</p>');
			}
		});
	}
}
