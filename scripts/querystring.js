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

    if (!query.length) {
      // If there are no existing queries then create new one:
      return '?' + pair;
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