/** *	@service InterfaceUrl *	@desc Used to launch URL/Hash SmartInterface navigator * *	@author Vibhaj Rajan <vibhaj8@gmail.com> ***/FireSpark.smart.service.InterfaceUrl = {	idle : true,		current : '',	path : '#',	view : '',	base : '',		input : function(){		return {			optional : { 				navigator : false,				escaped : false,				root : false,				event : false,				save : false,				nofrc : false			}		}	},		run : function($memory){		$navigator = $memory['navigator'] === false ?  FireSpark.smart.service.InterfaceUrl.base : $memory['navigator'];		$escaped = $memory['escaped'];		$root = $memory['root'];		$event = $memory['event'];		$save = $memory['save'];		$force = $memory['nofrc'] ? false : true;				if(($event || FireSpark.smart.service.InterfaceUrl.idle) && FireSpark.smart.service.InterfaceUrl.current != $navigator){			if($event && $navigator[0] == '!'){				$navigator = FireSpark.smart.service.InterfaceUrl.path + $navigator;			}						if($save || false){				FireSpark.smart.service.InterfaceUrl.current = window.location.hash = $navigator;			}						var $hash = $navigator.split('!');						if(FireSpark.smart.service.InterfaceUrl.path != $hash[0]){				if($save || false){					FireSpark.smart.service.InterfaceUrl.path = $hash[0];				}								var $nav = ($hash[1] || false) ? '#' + $hash[1] : false;				return { valid : Snowblozm.Kernel.launch($hash[0], $escaped, { root : $root, nav : $nav, frc : $force }) };			}			else if($hash[1] || false) {				$hash[1] = '#' + $hash[1];				if($save || false){					FireSpark.smart.service.InterfaceUrl.view = $hash[1];				}								return { valid : Snowblozm.Kernel.launch($hash[1], $escaped, { root : $root }) };			}		}				return { valid : false };	},		output : function(){		return [];	}};