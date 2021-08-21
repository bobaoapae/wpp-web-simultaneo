function _classCallCheck (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _defineProperties (target, props) {
    for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass (Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _toConsumableArray (arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles (arr) {
    if (Array.isArray(arr)) {
        let arr2 = new Array(arr.length);

        for (let i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
    }
}

function _iterableToArray (iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]') return Array.from(iter);
}

function _nonIterableSpread () {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
}

function processOptions (value) {
    let options;

    if (typeof value === 'function') {
        // Simple options (callback-only)
        options = {
            callback: value
        };
    } else {
        // Options object
        options = value;
    }

    return options;
}

function throttle (callback, delay) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let timeout;
    let lastState;
    let currentArgs;

    let throttled = function throttled (state) {
        let _len = arguments.length;
        let args = new Array(_len > 1 ? _len - 1 : 0);
        for (let key = 1; key < _len; key++) {
            args[key - 1] = arguments[key];
        }

        currentArgs = args;
        if (timeout && state === lastState) return;
        let leading = options.leading;

        if (typeof leading === 'function') {
            leading = leading(state, lastState);
        }

        if ((!timeout || state !== lastState) && leading) {
            callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
        }

        lastState = state;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
            timeout = 0;
        }, delay);
    };

    throttled._clear = function () {
        clearTimeout(timeout);
        timeout = null;
    };

    return throttled;
}

function deepEqual (val1, val2) {
    if (val1 === val2) return true;

    if (typeof (val1) === 'object') {
        for (let key in val1) {
            if (!deepEqual(val1[key], val2[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
}

let VisibilityState =
    /*#__PURE__*/
    function () {
        function VisibilityState (el, options, binding) {
            _classCallCheck(this, VisibilityState);

            this.el = el;
            this.observer = null;
            this.frozen = false;
            this.binding = binding;
            this.createObserver(options, binding);
        }

        _createClass(VisibilityState, [{
            key: 'createObserver',
            value: function createObserver (options, binding) {
                let _this = this;

                if (this.observer) {
                    this.destroyObserver();
                }

                if (this.frozen) return;
                this.options = processOptions(options);

                this.callback = function (result, entry) {
                    _this.options.callback(result, entry);

                    if (result && _this.options.once) {
                        _this.frozen = true;

                        _this.destroyObserver();
                    }
                }; // Throttle

                if (this.callback && this.options.throttle) {
                    let _ref = this.options.throttleOptions || {},
                        _leading = _ref.leading;

                    this.callback = throttle(this.callback, this.options.throttle, {
                        leading: function leading (state) {
                            return _leading === 'both' || _leading === 'visible' && state || _leading === 'hidden' && !state;
                        }
                    });
                }

                this.oldResult = undefined;
                this.observer = new IntersectionObserver(function (entries) {
                    let entry = entries[0];

                    if (entries.length > 1) {
                        let intersectingEntry = entries.find(function (e) {
                            return e.isIntersecting;
                        });

                        if (intersectingEntry) {
                            entry = intersectingEntry;
                        }
                    }

                    if (_this.callback) {
                        // Use isIntersecting if possible because browsers can report isIntersecting as true, but intersectionRatio as 0, when something very slowly enters the viewport.
                        let result = entry.isIntersecting && entry.intersectionRatio >= _this.threshold;
                        if (result === _this.oldResult) return;
                        _this.oldResult = result;

                        _this.callback(result, entry);
                    }
                }, this.options.intersection); // Wait for the element to be in document

                binding.instance.$nextTick(function () {
                    if (_this.observer) {
                        _this.observer.observe(_this.el);
                    }
                });
            }
        }, {
            key: 'destroyObserver',
            value: function destroyObserver () {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                } // Cancel throttled call

                if (this.callback && this.callback._clear) {
                    this.callback._clear();

                    this.callback = null;
                }
            }
        }, {
            key: 'threshold',
            get: function get () {
                return this.options.intersection && this.options.intersection.threshold || 0;
            }
        }]);

        return VisibilityState;
    }();

function beforeMount (el, binding) {
    let value = binding.value;
    if (!value) return;

    if (typeof IntersectionObserver === 'undefined') {
        console.warn('[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill');
    } else {
        let state = new VisibilityState(el, value, binding);
        el._vue_visibilityState = state;
    }
}

function updated (el, binding) {
    let value = binding.value,
        oldValue = binding.oldValue;
    if (deepEqual(value, oldValue)) return;
    let state = el._vue_visibilityState;

    if (!value) {
        unmounted(el);
        return;
    }

    if (state) {
        state.createObserver(value, binding);
    } else {
        beforeMount(el, binding);
    }
}

function unmounted (el) {
    let state = el._vue_visibilityState;

    if (state) {
        state.destroyObserver();
        delete el._vue_visibilityState;
    }
}

const ObserveVisibility = {
    beforeMount: beforeMount,
    updated: updated,
    unmounted: unmounted
};

function install (app) {
    app.directive('observe-visibility', ObserveVisibility);
}

const plugin = {
    install: install
};

export default plugin;

