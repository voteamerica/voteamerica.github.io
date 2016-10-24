var QueryString = {
    regex: function(name) {
        return new RegExp('[\\?&](' + name + ')=?([^&#]*)');
    },

    get: function(name, query) {
        query = query || window.location.search;
        var match = query.match( this.regex(name) );
        if (!match) {
            return false;
        } else if (match[2]) {
            return decodeURIComponent(match[2]);
        } else {
            return true;
        }
    },

    set: function(name, value, query) {
        query = query || window.location.search;
        var regex = this.regex(name),
        match = regex.exec(query),
        pair = value ? name + '=' + encodeURIComponent(value) : name;

        if (!query.length || query.indexOf('?') < 0) {
            // If there are no existing queries then create new one:
            return (query || '') + '?' + pair;
        } else if (match) {
            // If there is an existing query for this name then update the value:
            return query.replace(regex, match[0].charAt(0) + pair);
        } else {
            // If there are existing queries but not for this name then add it to the end:
            return query + '&' + pair;
        }
    },

    remove: function(name, query) {
        query = query || window.location.search;
        return query.replace(this.regex(name), '');
    }
};

(function(){
    function gid(id) {
      return document.getElementById(id);
    }
    function qsa(s) {
      return document.querySelectorAll(s);
    }
    function forEach(array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope || array[i], i, array[i]);
      }
    }

    if (QueryString.get('souls2thepolls')) {
        var intro = gid('intro');
        if (intro) {
          intro.classList.add('s2tp');
        }

        var logo = gid('logo');
        logo.setAttribute('src', '/images/logo-souls2thepolls.png');
        logo.setAttribute('width', 661);
        logo.setAttribute('height', 300);

        forEach(qsa('a[href^="/"]'), function() {
          this.href = QueryString.set('souls2thepolls', false, this.href);
        });
    }

    var uuid = QueryString.get('uuid');
    if (uuid) {
        forEach(qsa('.uuid'), function() {
            this.textContent = uuid;
        });
        forEach(qsa('.self-service-url'), function() {
            this.href = QueryString.set('uuid', uuid, this.href);
        });
    }
})();