/**
 *	@template Default
**/
FireSpark.jquery.template.Default = $.template('\
	<span class="{{if valid}}success{{else}}error{{/if}}">${msg}</span>\
	<span class="hidden">${details}</span>\
');

Snowblozm.Registry.save('tpl-default', FireSpark.jquery.template.Default);
