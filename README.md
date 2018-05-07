gmaps-radius
============

This very simple little web app allows you to draw circles on top of a Google Map, with a radius that you specify.

Query parameters
----------------

This tool supports the following optional query parameters:

* `lat`: Viewport center latitude
* `lng`: Viewport center longitude
* `z`: Default zoom level
* `r`: Default circle radius
* `u`: Default circle radius units

Static POI Markers
------------------
Can be changed from gmaps-radius.coffee file:

```javascript
    # Define static positions
    center_point = { lat: 40.987684, lng: 29.060062 }
    static_positions = []
    static_positions.push({ lat: 40.987914, lng: 29.062032 })
    static_positions.push({ lat: 40.985813, lng: 29.057780 })
    # Define static positions
```

Build
-----
> `npm install`

> `npm install -g grunt-cli`

> `grunt build`