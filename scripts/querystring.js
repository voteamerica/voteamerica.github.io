// TinyQueryString - A really tiny URL query string utility
// github.com/richardwestenra/tiny-query-string
!function(t,e){"function"==typeof define&&define.amd?define(["tinyQuery"],e):"object"==typeof module&&module.exports?module.exports=e():t.tinyQuery=e()}(this,function(){"use strict";var t=function(t){return RegExp("[?&]("+t+")=?([^&#]*)","i")},e=function(t){return"string"!=typeof t?"undefined"!=typeof window?window.location.search:"":t};return{get:function(t,e){return"object"==typeof t?this.getMany.apply(this,arguments):t&&e!==!1?this.getOne.apply(this,arguments):this.getAll.apply(this,arguments)},getOne:function(n,r){var i=e(r).match(t(n));return i?i[2]?decodeURIComponent(i[2]):!0:!1},getMany:function(t,n){return t.reduce(function(t,r){return t[r]=this.getOne(r,e(n)),t}.bind(this),{})},getAll:function(t){if(t=e(t).match(/\?(.+)/)){var n=t[1].split("&").map(function(t){return t.split("=")[0].toLowerCase()});return this.getMany.call(this,n,t[0])}return{}},set:function(t){return"object"==typeof t?this.setMany.apply(this,arguments):this.setOne.apply(this,arguments)},setOne:function(n,r,i){i=e(i);var u=t(n),o=u.exec(i);return!r||"string"!=typeof r&&"number"!=typeof r||(n=n+"="+encodeURIComponent(r)),!i.length||i.indexOf("?")<0?(i||"")+"?"+n:o?i.replace(u,o[0].charAt(0)+n):i+"&"+n},setMany:function(t,n){return Array.isArray(t)?t.reduce(function(t,e){return this.setOne(e,!1,t)}.bind(this),e(n)):Object.keys(t).reduce(function(e,n){return this.setOne(n,t[n],e)}.bind(this),e(n))},remove:function(t,e){return"object"==typeof t?this.removeMany.apply(this,arguments):t&&e!==!1?this.removeOne.apply(this,arguments):this.removeAll.apply(this,arguments)},removeOne:function(t,n){if(n=e(n).match(/([^\?]*)(\?*.*)/)){if(n[2].length){var r=Object.keys(this.getAll(n[2])).filter(function(e){return e!==t});return this.setMany(r,n[1])}return n[1]}return!1},removeMany:function(t,n){return t.reduce(function(t,e){return this.removeOne(e,t)}.bind(this),e(n))},removeAll:function(t){return e(t).split("?")[0]}}});


// Update Query String properties on each page

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

    var qs = tinyQuery.getAll();

    if (qs.souls2thepolls) {
        var intro = gid('intro');
        if (intro) {
          intro.classList.add('s2tp');
        }

        var logo = gid('logo');
        logo.setAttribute('src', '/images/logo-souls2thepolls.png');
        logo.setAttribute('width', 661);
        logo.setAttribute('height', 300);

        forEach(qsa('a[href^="/"]'), function() {
          this.href = tinyQuery.set('souls2thepolls', false, this.href);
        });

        forEach(qsa('.twitter-mention-button'), function() {
          var url = this.getAttribute('data-url');
          this.setAttribute('data-url', tinyQuery.set('souls2thepolls', false, url));
        });
    }

    if (qs.uuid) {
        forEach(qsa('.uuid'), function() {
            this.textContent = qs.uuid;
        });

        forEach(qsa('.self-service-url'), function() {
            this.href = tinyQuery.set(qs, this.href);
        });
    }
})();