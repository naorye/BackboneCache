define([
    'jQuery',
    'Backbone'
], function ($, Backbone) {

    if (Backbone.Cache) return Backbone.Cache;

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

    var originalModelFetch = Backbone.Model.prototype.fetch,
        originalCollectionFetch = Backbone.Collection.prototype.fetch;

    Backbone.Collection.prototype.fetch = function(options) {
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
                return originalCollectionFetch.call(this, options);
            }
        } else {
            return originalCollectionFetch.call(this, options);
        }
    };

    Backbone.Model.prototype.fetch = function(options) {
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
                return originalModelFetch.call(this, options);
            }
        } else {
            return originalModelFetch.call(this, options);
        }
    };

    return Backbone.Cache;
});