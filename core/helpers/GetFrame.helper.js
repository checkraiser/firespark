/** *	@helper GetFrame * *	@param name ***/FireSpark.core.helper.getFrame = function(name){	for (var i = 0; i < frames.length; i++){		if (frames[i].name == name)			return frames[i];	}		return false;}