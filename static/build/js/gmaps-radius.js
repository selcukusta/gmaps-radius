(function() {
  $(function() {
    var center_point, circleDrawHandler, clearMarkers, earthRadii, i, len, map, marker, markers, pin_image, polygonDestructionHandler, pos, searchBox, searchInput, static_positions, updateURL;
    markers = [];
    pin_image = './static/images/location.png';
    center_point = {
      lat: 40.987684,
      lng: 29.060062
    };
    static_positions = [];
    static_positions.push({
      lat: 40.987914,
      lng: 29.062032
    });
    static_positions.push({
      lat: 40.985813,
      lng: 29.057780
    });
    map = new google.maps.Map($('#map')[0], {
      zoom: 17,
      center: center_point,
      mapType: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      mapTypeControl: true,
      zoomControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    });
    for (i = 0, len = static_positions.length; i < len; i++) {
      pos = static_positions[i];
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: pin_image
      });
    }
    earthRadii = {
      mt: 6378100,
      km: 6378.1,
      mi: 3963.1676,
      ft: 20925524.9,
      "in": 251106299,
      yd: 6975174.98,
      fa: 3487587.49,
      na: 3443.89849,
      ch: 317053.408,
      rd: 1268213.63,
      fr: 31705.3408
    };
    polygonDestructionHandler = function() {
      return this.setMap(null);
    };
    clearMarkers = function() {
      var j, len1, m;
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        m.setMap(null);
      }
      return markers = [];
    };
    circleDrawHandler = function(e) {
      var circle, radius, select, unitKey;
      select = $('#unitSelector');
      unitKey = $('option', select).eq(select[0].selectedIndex).val();
      radius = parseFloat(document.getElementById('radiusInput').value);
      radius = (radius / earthRadii[unitKey]) * earthRadii['mt'];
      circle = new google.maps.Circle({
        center: e.latLng,
        clickable: true,
        draggable: false,
        editable: false,
        fillColor: '#004de8',
        fillOpacity: 0.27,
        map: map,
        radius: radius,
        strokeColor: '#004de8',
        strokeOpacity: 0.62,
        strokeWeight: 1
      });
      google.maps.event.addListener(circle, 'rightclick', polygonDestructionHandler);
      return google.maps.event.addListener(circle, 'click', circleDrawHandler);
    };
    google.maps.event.addListener(map, 'click', circleDrawHandler);
    searchInput = document.getElementById('searchInput');
    $(searchInput.form).on({
      submit: function() {
        return false;
      }
    });
    searchBox = new google.maps.places.SearchBox(searchInput);
    google.maps.event.addListener(searchBox, 'places_changed', function() {

      /* When a place is selected, center on it */
      var location;
      clearMarkers();
      location = searchBox.getPlaces()[0];
      if (location != null) {
        if (location.geometry.viewport != null) {
          map.fitBounds(location.geometry.viewport);
          map.panToBounds(location.geometry.viewport);
        } else {
          map.setCenter(location.geometry.location);
        }
        markers.push(new google.maps.Marker({
          position: location.geometry.location,
          map: map,
          title: location.name,
          clickable: false
        }));
      }
    });
    updateURL = function() {
      var center, params, ref, u;
      center = map.getCenter();
      params = {
        lat: _.round(center.lat(), 6).toString(),
        lng: _.round(center.lng(), 6).toString(),
        z: map.getZoom().toString(),
        u: $('#unitSelector').val(),
        r: $('#radiusInput').val()
      };
      if (!params.r) {
        delete params['r'];
      }
      u = new URI();
      u.setQuery(params);
      return (ref = window.history) != null ? typeof ref.replaceState === "function" ? ref.replaceState(null, null, u.toString()) : void 0 : void 0;
    };
    google.maps.event.addListener(map, 'bounds_changed', _.debounce(updateURL, 200));
    google.maps.event.addListener(map, 'zoom_changed', updateURL);
    $('#unitSelector, #radiusInput').on('change', updateURL);
    return $(window).on('hashchange', function(e) {
      var center, center_, newCenter, query, z;
      query = (new URI()).query(true);
      center_ = map.getCenter();
      center = [center_.lat(), center_.lng()];
      newCenter = [center[0], center[1]];
      if (query.lat != null) {
        newCenter[0] = parseFloat(query.lat);
      }
      if (query.lng != null) {
        newCenter[1] = parseFloat(query.lng);
      }
      if ($.grep(newCenter, isNaN).length === 0) {
        map.setCenter({
          lat: newCenter[0],
          lng: newCenter[1]
        });
      }
      if (query.z != null) {
        z = parseInt(query.z, 10);
        if (!isNaN(z)) {
          map.setZoom(z);
        }
      }
      if (query.r != null) {
        $('#radiusInput').val(query.r);
      }
      if (query.u != null) {
        return $('#unitSelector').val(query.u);
      }
    }).triggerHandler('hashchange');
  });

}).call(this);

//# sourceMappingURL=gmaps-radius.js.map
