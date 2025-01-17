"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSelector = exports.createUseSelector = void 0;

var _react = require("react");

var _Provider = require("./Provider");

var _utils = require("./utils");

var defaultEqualityFn = function defaultEqualityFn(a, b) {
  return a === b;
};

var createUseSelector = function createUseSelector(customContext) {
  return function (selector) {
    var equalityFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityFn;
    var forceUpdate = (0, _utils.useForceUpdate)();

    var _useContext = (0, _react.useContext)(customContext),
        state = _useContext.state,
        subscribe = _useContext.subscribe;

    var selected = selector(state);
    var ref = (0, _react.useRef)(null);
    (0, _utils.useIsomorphicLayoutEffect)(function () {
      ref.current = {
        equalityFn: equalityFn,
        selector: selector,
        state: state,
        selected: selected
      };
    });
    (0, _utils.useIsomorphicLayoutEffect)(function () {
      var callback = function callback(nextState) {
        try {
          if (ref.current.state === nextState || ref.current.equalityFn(ref.current.selected, ref.current.selector(nextState))) {
            // not changed
            return;
          }
        } catch (e) {// ignored (stale props or some other reason)
        }

        forceUpdate();
      };

      var unsubscribe = subscribe(callback);
      return unsubscribe;
    }, [subscribe, forceUpdate]);
    return selected;
  };
};

exports.createUseSelector = createUseSelector;
var useSelector = createUseSelector(_Provider.defaultContext);
exports.useSelector = useSelector;