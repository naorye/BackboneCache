# Backbone.Cache

> Backbone cache plugin for models and collections

## Getting Started

This is a Backbone cache plugin. After integrating this plugin with your application you can easily cahce your collections and models data.

This Implementation Relies on the following libraries:

- Backbone (https://github.com/documentcloud/backbone)
- jQuery (http://jquery.com/)

More information can be found here: <a href="http://www.webdeveasy.com/backbone-cache" target="_blank">http://www.webdeveasy.com/backbone-cache</a>

## Usage

1. Define your cache object (can be more then one). In this sample we define global application cache.

    ```app.globalCache = new Backbone.Cache();```

2. For each model / collection which you want to cache, extend from `Backbone.CachedModel` / `Backbone.CachedCollection` and set the `cacheKey` and `cacheObject` properties.
 
    ```
    var UserPermissions = Backbone.CachedModel.extend({
        cacheObject: app.globalCache,
        initialize: function() {
            var userId = this.get('id');
            if (userId) {
                this.cacheKey = "UserPermissions_" + userId;
            }
        },
        urlRoot: 'api/user/permissions'
    });
    ```

3. Somewhere in the application call fetch.

    ```
    var user1Permissions = new UserPermissions({ id: 1 });
    user1Permissions.fetch();
    ```

4. Later in the application call another fetch. This time the cached data returns without server calling.

    ```
    var permissions = new UserPermissions({ id: 1 });
    permissions.fetch();
    ```

* * *

Copyright (c) 2013 naorye
