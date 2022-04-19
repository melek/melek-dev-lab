// Graceful "observable" vanilla databinding 
// https://gist.github.com/austinhyde/4321f22a476e1cbee65f

function observable(value) {
    var listeners = [];
  
    function notify(newValue) {
      listeners.forEach(function(listener){ listener(newValue); });
    }
  
    function accessor(newValue) {
      if (arguments.length && newValue !== value) {
        value = newValue;
        notify(newValue);
      }
      return value;
    }
  
    accessor.subscribe = function(listener) { listeners.push(listener); };
  
    return accessor;
  }
  
  function computed(calculation, dependencies) {
    var value = observable(calculation());
  
    function listener(v) {value(calculation()); }
    dependencies.forEach(function(dependency) {
      dependency.subscribe(listener);
    });
  
    function getter() { return value(); }
    getter.subscribe = value.subscribe;
  
    return getter;
  }
  
  function bindValue(input, observable) {
    var initial = observable();
    input.value = initial;
    observable.subscribe(function(){ input.value = observable(); });
  
    var converter = function(v) { return v; };
    if (typeof initial == 'number') {
      converter = function(n){ return isNaN(n = parseFloat(n)) ? 0 : n; };
    }
  
    input.addEventListener('input', function() {
      observable(converter(input.value));
    });
  }

// LDG
  function bindInnerHTML(input, observable) {
    var initial = observable();
    input.innerHTML = initial;
    observable.subscribe(function(){ input.innerHTML = observable(); });
  }
