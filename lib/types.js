'use strict';

var ou = require('./objectUtils');

var alternative = require('./alternative');


var types = {
  alternative: function(fields, props) {
    var s = alternative.schema(props.getValue(props.path), props.schema, props.context);

    return types.object(fields, ou.merge(props, { schema: s }));
  },
  array: function(fields, props) {
    var move = function(props, i, n) {
      return function(to) {
        if(!canMoveUp(i, n) && !canMoveDown(i, n)) return;
        var newList = props.getValue(props.path);
        var value = newList.splice(to, 1);

        newList.splice(i, 0, value[0]);
        props.update(props.path, newList, newList);
      };
    };
    var canMoveUp = function(i, n) {
      return i > 0 && i < n - 1;
    };
    var moveUp = function(props, i, n) {
      return function() {
        if(!canMoveUp(i, n)) return;
        var newList = props.getValue(props.path);
        var value = newList.splice(i, 1);

        newList.splice(i - 1, 0, value[0]);
        props.update(props.path, newList, newList);
      };
    };

    var canMoveDown = function(i, n) {
      return n > 1 && i < n - 2;
    };
    var moveDown = function(props, i, n) {
      return function() {
        if(!canMoveDown(i, n)) return;
        var newList = props.getValue(props.path);
        var value = newList.splice(i, 1);

        newList.splice(i + 1, 0, value[0]);
        props.update(props.path, newList, newList);
      };
    };

    var canRemoveItem = function(i, n) {
      return i < n;
    };

    var removeItem = function(props, i, n) {
      return function() {
        if(!canRemoveItem(i, n)) return;

        var newList = props.getValue(props.path);
        newList.splice(i, 1);
        props.update(props.path, newList, newList);
      };
    };

    var n = (props.getValue(props.path) || []).length + 1;
    var list = [];
    for (var i = 0; i < n; ++i) {
      list.push(fields.make(fields, ou.merge(props, {
        schema       : props.schema.items,
        path         : props.path.concat(i),
        move         : move(props, i, n),
        moveUp       : moveUp(props, i, n),
        moveDown     : moveDown(props, i, n),
        canMoveUp    : canMoveUp(i, n),
        canMoveDown  : canMoveDown(i, n),
        removeItem   : removeItem(props, i, n),
        canRemoveItem: canRemoveItem(i, n)
      })));
    }

    return list;
  },
  object: function(fields, props) {
    var keys = fullOrdering(props.schema['x-ordering'], props.schema.properties);
    return keys.map(function(key) {
      return fields.make(fields, ou.merge(props, {
        schema: props.schema.properties[key],
        path  : props.path.concat(key)
      }));
    });
  },
};

module.exports = types;

function fullOrdering(list, obj) {
  var keys = Object.keys(obj || {});
  var result = [];
  var i, k;

  for (i in list || []) {
    k = list[i];
    if (keys.indexOf(k) >= 0) {
      result.push(k);
    }
  }

  for (i in keys) {
    k = keys[i];
    if (result.indexOf(k) < 0) {
      result.push(k);
    }
  }

  return result;
}
