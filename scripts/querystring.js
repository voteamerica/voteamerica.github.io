/**
 * Tiny Query String - v0.1.2
 * https://github.com/richardwestenra/tiny-query-string
 */
(function(e,t){if(typeof define==="function"&&define.amd){define(["tinyQuery"],t)}else if(typeof module==="object"&&module.exports){module.exports=t()}else{e.tinyQuery=t()}})(this,function(){"use strict";var e=function(e){return new RegExp("[?&]("+e+")=?([^&#]*)","i")};var t=function(e){return typeof e!=="string"?typeof window!=="undefined"?window.location.search:"":e};return{get:function(e,t){if(typeof e==="object"){return this.getMany.apply(this,arguments)}else if(!e||t===false){return this.getAll.apply(this,arguments)}else{return this.getOne.apply(this,arguments)}},getOne:function(n,r){var i=t(r).match(e(n));if(!i){return false}else if(i[2]){return decodeURIComponent(i[2])}else{return true}},getMany:function(e,n){return e.reduce(function(e,r){e[r]=this.getOne(r,t(n));return e}.bind(this),{})},getAll:function(e){e=t(e).match(/\?(.+)/);if(!e){return{}}else{var n=e[1].split("&").map(function(e){return e.split("=")[0].toLowerCase()});return this.getMany.call(this,n,e[0])}},set:function(e){return typeof e==="object"?this.setMany.apply(this,arguments):this.setOne.apply(this,arguments)},setOne:function(n,r,i){i=t(i);var s=e(n),u=s.exec(i);if(r&&(typeof r==="string"||typeof r==="number")){n=n+"="+encodeURIComponent(r)}if(!i.length||i.indexOf("?")<0){return(i||"")+"?"+n}else if(u){return i.replace(s,u[0].charAt(0)+n)}else{return i+"&"+n}},setMany:function(e,n){if(Array.isArray(e)){return e.reduce(function(e,t){return this.setOne(t,false,e)}.bind(this),t(n))}return Object.keys(e).reduce(function(t,n){return this.setOne(n,e[n],t)}.bind(this),t(n))},remove:function(e,t){if(typeof e==="object"){return this.removeMany.apply(this,arguments)}else if(!e||t===false){return this.removeAll.apply(this,arguments)}else{return this.removeOne.apply(this,arguments)}},removeOne:function(e,n){n=t(n).match(/([^\?]*)(\?*.*)/);if(!n){return false}else if(!n[2].length){return n[1]}else{var r=Object.keys(this.getAll(n[2])).filter(function(t){return t!==e});return this.setMany(r,n[1])}},removeMany:function(e,n){return e.reduce(function(e,t){return this.removeOne(t,e)}.bind(this),t(n))},removeAll:function(e){return t(e).split("?")[0]}}});


// Update Query String properties on each page

(function(){
    // Helper functions (so we don't need to include jQuery on every page)
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

    // Change site design for souls2thepolls mirror.
    // (See https://github.com/voteamerica/voteamerica.github.io/blob/master/README.md#urls)
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

    // Update selfservice page UUID values
    if (qs.uuid) {
        forEach(qsa('.uuid'), function() {
            this.textContent = qs.uuid;
        });

        forEach(qsa('.self-service-url'), function() {
            this.href = tinyQuery.set(qs, this.href);
        });
    }
})();