define([
    'jQuery',
    'Backbone'
], function ($, Backbone) {

    Backbone.Cache = function() {
        this.store = {};
    };
    $.extend(Backbone.Cache.prototype, Backbone.Events, {
        set: function(key, value) {
            this.trigger("set", key, value);
            this.store[key] = value;
        },
        has: function(key) {
            var isHas = !!this.store[key];
            this.trigger("has", key, isHas);
            return isHas;
        },
        get: function(key) {
            var value = this.store[key];
            this.trigger("get", key, value);
            return value;
        },
        remove: function(key) {
            var value = this.store[key];
            this.trigger("remove", key, value);
            delete this.store[key];
            return value;
        },
        clear: function() {
            this.trigger("clear");
            this.store = {};
        }
    });

    Backbone.CachedCollection = Backbone.Collection.extend({
        fetch: function(options) {
            if (this.cacheKey && this.cacheObject) {
                var cacheObject = this.cacheObject,
                    cacheKey = this.cacheKey;
                if (cacheObject.has(cacheKey)) {
                    var resp = cacheObject.get(cacheKey),
                        method = options.update ? 'update' : 'reset';
                    this[method](resp, options);
                    if (options.success) options.success(this, resp, options);
                    return $.Deferred().resolve();
                } else {
                    var success = options.success;
                    options.success = function(entity, resp, options) {
                        cacheObject.set(cacheKey, resp);
                        if (success) success(entity, resp, options);
                    };
                    return Backbone.Collection.prototype.fetch.call(this, options);
                }
            } else {
                return Backbone.Collection.prototype.fetch.call(this, options);
            }
        }
    });

    Backbone.CachedModel = Backbone.Model.extend({
        fetch: function(options) {
            if (this.cacheKey && this.cacheObject) {
                options = options || {};
                var cacheObject = this.cacheObject,
                    cacheKey = this.cacheKey,
                    success = options.success;
                if (cacheObject.has(cacheKey)) {
                    var resp = cacheObject.get(cacheKey);
                    this.set(this.parse(resp, options), options);
                    if (success) success(this, resp, options);
                    return $.Deferred().resolve();
                } else {
                    options.success = function(entity, resp, options) {
                        cacheObject.set(cacheKey, resp);
                        if (success) success(entity, resp, options);
                    };
                    return Backbone.Model.prototype.fetch.call(this, options);
                }
            } else {
                return Backbone.Model.prototype.fetch.call(this, options);
            }
        }
    });

    return Backbone;
});