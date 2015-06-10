/*
 *	Include scripts for your theme here
 */

var matches = (function() {
  var fn = Element.prototype.matchesSelector 
        || Element.prototype.webkitMatchesSelector 
        || Element.prototype.mozMatchesSelector 
        || Element.prototype.msMatchesSelector 
        || Element.prototype.oMatchesSelector 
        || Element.prototype.matches 
        || Element.prototype.webkitMatches
        || Element.prototype.mozMatches
        || Element.prototype.msMatches
        || Element.prototype.oMatches;
  return function matches(el, sel) { return fn.apply(el, [sel]); };
})();

function isa(el, sel) {
  return matches(el, sel) || 
         matches(el, sel + ' *');
}

function find(el, sel) {
  if (!isa(el, sel))
    return null;
  
  while(el) {
    if (matches(el, sel))
      return el;
    
    el = el.parentElement;
  }
}

addEventListener('WebComponentsReady', function() {
  var titleStyle = document.querySelector('.title').style;
  var toolbar = document.querySelector('paper-toolbar');
  var buttons = toolbar.querySelectorAll('.toolbar-button');

  for (var i = 0, l = buttons.length; i < l; i++) {
    var button = buttons[i];
    button.$.ink.style.color = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
  }

  addEventListener('paper-header-transform', function(e) {
    var d = e.detail;
    var m = d.height - d.condensedHeight;
    var scale = Math.max(0.75, (m - d.y) / (m / 0.25)  + 0.75);
    titleStyle.transform = titleStyle.webkitTransform =
        'scale(' + scale + ') translateZ(0)';

    var progress = ((m - d.y) / m);
    updateColors(progress);
  });
  
  updateColors(1);
  
  function updateColors(progress) {
    var color = Math.floor(progress * 255);
    toolbar.style.color = 'rgb(' + color + ',' + color + ',' + color + ')';
    toolbar.style.boxShadow = '0 1px 5px 0px rgba(95, 95, 95, ' + (1 - (progress / 2)) + ')';

    for (var i = 0, l = buttons.length; i < l; i++) {
      var button = buttons[i];
      button.$.ink.style.color = 'rgb(' + color + ',' + color + ',' + color + ')';
    }
  }
});

addEventListener('click', function(evt) {
  if (evt.defaultPrevented) {
    return;
  }
  
  var t = evt.target;
  var target = find(t, 'a[href]');
  
  if (target) {
    //evt.preventDefault();
  }
});

function animate(element, starter) {
  return new Promise(function(resolve, reject) {
    function finish() {
      resolve();
      element.removeEventListener('transitionend', finish);
    }
    
    element.addEventListener('transitionend', finish);
    starter(element);
  });
}

function animateElevation(element, to) {
  if (element.elevation == to) {
    return Promise.resolve();
  }
  
  return animate(element, function(e) {
    e.elevation = to;
  });
}