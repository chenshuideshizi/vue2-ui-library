
export const on =  function(element, event, handler) {
    if (element && event && handler) {
        element.addEventListener(event, handler, false);
    }
};


export const off = function(element, event, handler) {
    if (element && event) {
      element.removeEventListener(event, handler, false);
    }
}


export const once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};


export function hasClass(el, cls) {
  if (!el || !cls) return false;
    return el.classList.contains(cls);

};

export function addClass(el, cls) {
  if (!el) return;

  var classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;
    el.classList.add(clsName);
  }
};

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  const classes = cls.split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    if (!classes[i]) continue
    el.classList.remove(classes[i]);
  }
};

export const getStyle =  function(element, styleName) {
  if (!element || !styleName) return null;

  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

export function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (const prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    element.style[styleName] = value;
  }
};



