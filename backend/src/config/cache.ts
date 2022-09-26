const nodeCache = require('node-cache');

/** 
    Creates a custom wrapper around 'node-cache' to add custom methods 
    
    @param ttlSeconds = # of seconds that the cache will store the key / value
    pair for
    @checkperiod: how often the check will be run for cleanup
    @useClones: false - will not allow values to differ. If I update user A in
    the cache, all instances of user A will be updated
**/
class NodeCache {
  declare cache: any;

  constructor(ttlSeconds) {
    this.cache = new nodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.5,
      useClones: false,
    });
  }

  /**
   * Get from the store if it has the key / value or not
   * @param {string} key: ie - `currentUser_${id}`
   * @param  {function / dbquery} storeFunction -
   * async () => {
   * return await Representative.scope("currentUser").findByPk(user.id);
   * }
   **/
  getOrStore(key, storeFunction) {
    const value = this.cache.get(key);
    // check if key is in the store, if it is - return it
    if (value) return Promise.resolve(value);

    // if its not, run the query (storeFunction), set the key / value and return it
    return storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }

  // set an item in the cache
  set(key, value) {
    this.cache.set(key, value);
  }

  // if the cache has the key, return the value
  get(key) {
    if (this.cache.has(key)) return this.cache.get(key);
  }

  // check if the cache has the key, return boolean
  has(key) {
    if (this.cache.has(key)) return true;
    return false;
  }

  // delete a single key / value from the cache
  del(key) {
    this.cache.del(key);
  }

  /** delete multiple key / value pairs from the cache
   * @param {array} keys - array of {string} keys
   **/
  delMultiple(keys: string[]) {
    const verify = [];

    for (const key of keys) {
      this.cache.del(key);
      if (this.cache.has(key)) verify.push(key);
    }

    return verify;
  }

  /** Searching for keys with a set starting string
   * @param startStr - the string to look for
   *  Returns all values found that match
   */
  getStartsWith(startStr = '') {
    if (!startStr) return;

    const values = [];

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) values.push(this.cache.get(key));
    }

    return values;
  }

  /** delete all keys starting with
   * @param {string} startStr
   **/
  delStarstWith(startStr = '') {
    if (!startStr) return;

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) this.del(key);
    }
  }

  // delete everything from the cache
  flush() {
    this.cache.flushAll();
  }
}

export { NodeCache };
