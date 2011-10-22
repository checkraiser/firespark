package aquadew.core;import java.util.Map;import java.util.HashMap;/** *	@class Block *	@desc Flexible object built with hashmap * *	@author Vibhaj Rajan <vibhaj8@gmail.com> * **/public class Block {		/**	 *	@var map	 *	@desc hash map instance	 *	**/	private Map map;		/**	 *	@constructor	**/	public Block(){		this.map = new HashMap<String, Object>();	}		/**	 *	@method set	 *	@desc puts a new key into the map	 *	 *	@param key string 	 *	@param value object	 *	**/	public void set(String key, Object value){		this.map.put(key, value);		return;	}		/**	 *	@method isset	 *	@desc check if key exists in the map	 *	 *	@param key string 	 *	 *	@return boolean	 *	**/	public boolean isset(String key){		return this.map.containsKey(key);	}		/**	 *	@method getBlock	 *	@desc returns block at specified key	 *	 *	@param key string 	 *	 *	@return block	 *	**/	public Block getBlock(String key){		return (Block) this.map.get(key);	}		/**	 *	@method getString	 *	@desc returns string at specified key	 *	 *	@param key string 	 *	 *	@return string	 *	**/	public String getString(String key){		return String.valueOf(this.map.get(key));	}		/**	 *	@method getInt	 *	@desc returns integer at specified key	 *	 *	@param key string 	 *	 *	@return int	 *	**/	public int getInt(String key){		return Integer.valueOf(this.map.get(key));	}	}