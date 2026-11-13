var Ef = { exports: {} }, jn = {};
var eh;
function ry() {
  if (eh) return jn;
  eh = 1;
  var p = /* @__PURE__ */ Symbol.for("react.transitional.element"), G = /* @__PURE__ */ Symbol.for("react.fragment");
  function q(y, B, J) {
    var al = null;
    if (J !== void 0 && (al = "" + J), B.key !== void 0 && (al = "" + B.key), "key" in B) {
      J = {};
      for (var Al in B)
        Al !== "key" && (J[Al] = B[Al]);
    } else J = B;
    return B = J.ref, {
      $$typeof: p,
      type: y,
      key: al,
      ref: B !== void 0 ? B : null,
      props: J
    };
  }
  return jn.Fragment = G, jn.jsx = q, jn.jsxs = q, jn;
}
var ah;
function oy() {
  return ah || (ah = 1, Ef.exports = ry()), Ef.exports;
}
var c = oy(), Nf = { exports: {} }, Z = {};
var uh;
function dy() {
  if (uh) return Z;
  uh = 1;
  var p = /* @__PURE__ */ Symbol.for("react.transitional.element"), G = /* @__PURE__ */ Symbol.for("react.portal"), q = /* @__PURE__ */ Symbol.for("react.fragment"), y = /* @__PURE__ */ Symbol.for("react.strict_mode"), B = /* @__PURE__ */ Symbol.for("react.profiler"), J = /* @__PURE__ */ Symbol.for("react.consumer"), al = /* @__PURE__ */ Symbol.for("react.context"), Al = /* @__PURE__ */ Symbol.for("react.forward_ref"), bl = /* @__PURE__ */ Symbol.for("react.suspense"), _l = /* @__PURE__ */ Symbol.for("react.memo"), M = /* @__PURE__ */ Symbol.for("react.lazy"), j = /* @__PURE__ */ Symbol.for("react.activity"), Y = /* @__PURE__ */ Symbol.for("react.view_transition"), Nl = Symbol.iterator;
  function Ml(d) {
    return d === null || typeof d != "object" ? null : (d = Nl && d[Nl] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var Xl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, cl = Object.assign, Vl = {};
  function xl(d, _, R) {
    this.props = d, this.context = _, this.refs = Vl, this.updater = R || Xl;
  }
  xl.prototype.isReactComponent = {}, xl.prototype.setState = function(d, _) {
    if (typeof d != "object" && typeof d != "function" && d != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, d, _, "setState");
  }, xl.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function me() {
  }
  me.prototype = xl.prototype;
  function Hl(d, _, R) {
    this.props = d, this.context = _, this.refs = Vl, this.updater = R || Xl;
  }
  var ut = Hl.prototype = new me();
  ut.constructor = Hl, cl(ut, xl.prototype), ut.isPureReactComponent = !0;
  var rl = Array.isArray;
  function F() {
  }
  var P = { H: null, A: null, T: null, S: null }, Tt = Object.prototype.hasOwnProperty;
  function ft(d, _, R) {
    var U = R.ref;
    return {
      $$typeof: p,
      type: d,
      key: _,
      ref: U !== void 0 ? U : null,
      props: R
    };
  }
  function Ll(d, _) {
    return ft(d.type, _, d.props);
  }
  function nt(d) {
    return typeof d == "object" && d !== null && d.$$typeof === p;
  }
  function rt(d) {
    var _ = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(R) {
      return _[R];
    });
  }
  var _t = /\/+/g;
  function hl(d, _) {
    return typeof d == "object" && d !== null && d.key != null ? rt("" + d.key) : _.toString(36);
  }
  function z(d) {
    switch (d.status) {
      case "fulfilled":
        return d.value;
      case "rejected":
        throw d.reason;
      default:
        switch (typeof d.status == "string" ? d.then(F, F) : (d.status = "pending", d.then(
          function(_) {
            d.status === "pending" && (d.status = "fulfilled", d.value = _);
          },
          function(_) {
            d.status === "pending" && (d.status = "rejected", d.reason = _);
          }
        )), d.status) {
          case "fulfilled":
            return d.value;
          case "rejected":
            throw d.reason;
        }
    }
    throw d;
  }
  function Q(d, _, R, U, $) {
    var ll = typeof d;
    (ll === "undefined" || ll === "boolean") && (d = null);
    var il = !1;
    if (d === null) il = !0;
    else
      switch (ll) {
        case "bigint":
        case "string":
        case "number":
          il = !0;
          break;
        case "object":
          switch (d.$$typeof) {
            case p:
            case G:
              il = !0;
              break;
            case M:
              return il = d._init, Q(
                il(d._payload),
                _,
                R,
                U,
                $
              );
          }
      }
    if (il)
      return $ = $(d), il = U === "" ? "." + hl(d, 0) : U, rl($) ? (R = "", il != null && (R = il.replace(_t, "$&/") + "/"), Q($, _, R, "", function(pt) {
        return pt;
      })) : $ != null && (nt($) && ($ = Ll(
        $,
        R + ($.key == null || d && d.key === $.key ? "" : ("" + $.key).replace(
          _t,
          "$&/"
        ) + "/") + il
      )), _.push($)), 1;
    il = 0;
    var A = U === "" ? "." : U + ":";
    if (rl(d))
      for (var X = 0; X < d.length; X++)
        U = d[X], ll = A + hl(U, X), il += Q(
          U,
          _,
          R,
          ll,
          $
        );
    else if (X = Ml(d), typeof X == "function")
      for (d = X.call(d), X = 0; !(U = d.next()).done; )
        U = U.value, ll = A + hl(U, X++), il += Q(
          U,
          _,
          R,
          ll,
          $
        );
    else if (ll === "object") {
      if (typeof d.then == "function")
        return Q(
          z(d),
          _,
          R,
          U,
          $
        );
      throw _ = String(d), Error(
        "Objects are not valid as a React child (found: " + (_ === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : _) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return il;
  }
  function C(d, _, R) {
    if (d == null) return d;
    var U = [], $ = 0;
    return Q(d, U, "", "", function(ll) {
      return _.call(R, ll, $++);
    }), U;
  }
  function ol(d) {
    if (d._status === -1) {
      var _ = d._result, R = _();
      R.then(
        function(U) {
          (d._status === 0 || d._status === -1) && (d._status = 1, d._result = U, R.status === void 0 && (R.status = "fulfilled", R.value = U));
        },
        function(U) {
          (d._status === 0 || d._status === -1) && (d._status = 2, d._result = U, R.status === void 0 && (R.status = "rejected", R.reason = U));
        }
      ), d._status === -1 && (d._status = 0, d._result = R);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var nl = typeof reportError == "function" ? reportError : function(d) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var _ = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof d == "object" && d !== null && typeof d.message == "string" ? String(d.message) : String(d),
        error: d
      });
      if (!window.dispatchEvent(_)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", d);
      return;
    }
    console.error(d);
  };
  function it(d) {
    var _ = P.T, R = {};
    R.types = _ !== null ? _.types : null, P.T = R;
    try {
      var U = d(), $ = P.S;
      $ !== null && $(R, U), typeof U == "object" && U !== null && typeof U.then == "function" && U.then(F, nl);
    } catch (ll) {
      nl(ll);
    } finally {
      _ !== null && R.types !== null && (_.types = R.types), P.T = _;
    }
  }
  function Ht(d) {
    var _ = P.T;
    if (_ !== null) {
      var R = _.types;
      R === null ? _.types = [d] : R.indexOf(d) === -1 && R.push(d);
    } else it(Ht.bind(null, d));
  }
  var Bt = {
    map: C,
    forEach: function(d, _, R) {
      C(
        d,
        function() {
          _.apply(this, arguments);
        },
        R
      );
    },
    count: function(d) {
      var _ = 0;
      return C(d, function() {
        _++;
      }), _;
    },
    toArray: function(d) {
      return C(d, function(_) {
        return _;
      }) || [];
    },
    only: function(d) {
      if (!nt(d))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return d;
    }
  };
  return Z.Activity = j, Z.Children = Bt, Z.Component = xl, Z.Fragment = q, Z.Profiler = B, Z.PureComponent = Hl, Z.StrictMode = y, Z.Suspense = bl, Z.ViewTransition = Y, Z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P, Z.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(d) {
      return P.H.useMemoCache(d);
    }
  }, Z.addTransitionType = Ht, Z.cache = function(d) {
    return function() {
      return d.apply(null, arguments);
    };
  }, Z.cacheSignal = function() {
    return null;
  }, Z.cloneElement = function(d, _, R) {
    if (d == null)
      throw Error(
        "The argument must be a React element, but you passed " + d + "."
      );
    var U = cl({}, d.props), $ = d.key;
    if (_ != null)
      for (ll in _.key !== void 0 && ($ = "" + _.key), _)
        !Tt.call(_, ll) || ll === "key" || ll === "__self" || ll === "__source" || ll === "ref" && _.ref === void 0 || (U[ll] = _[ll]);
    var ll = arguments.length - 2;
    if (ll === 1) U.children = R;
    else if (1 < ll) {
      for (var il = Array(ll), A = 0; A < ll; A++)
        il[A] = arguments[A + 2];
      U.children = il;
    }
    return ft(d.type, $, U);
  }, Z.createContext = function(d) {
    return d = {
      $$typeof: al,
      _currentValue: d,
      _currentValue2: d,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, d.Provider = d, d.Consumer = {
      $$typeof: J,
      _context: d
    }, d;
  }, Z.createElement = function(d, _, R) {
    var U, $ = {}, ll = null;
    if (_ != null)
      for (U in _.key !== void 0 && (ll = "" + _.key), _)
        Tt.call(_, U) && U !== "key" && U !== "__self" && U !== "__source" && ($[U] = _[U]);
    var il = arguments.length - 2;
    if (il === 1) $.children = R;
    else if (1 < il) {
      for (var A = Array(il), X = 0; X < il; X++)
        A[X] = arguments[X + 2];
      $.children = A;
    }
    if (d && d.defaultProps)
      for (U in il = d.defaultProps, il)
        $[U] === void 0 && ($[U] = il[U]);
    return ft(d, ll, $);
  }, Z.createRef = function() {
    return { current: null };
  }, Z.forwardRef = function(d) {
    return { $$typeof: Al, render: d };
  }, Z.isValidElement = nt, Z.lazy = function(d) {
    return {
      $$typeof: M,
      _payload: { _status: -1, _result: d },
      _init: ol
    };
  }, Z.memo = function(d, _) {
    return {
      $$typeof: _l,
      type: d,
      compare: _ === void 0 ? null : _
    };
  }, Z.startTransition = it, Z.unstable_useCacheRefresh = function() {
    return P.H.useCacheRefresh();
  }, Z.use = function(d) {
    return P.H.use(d);
  }, Z.useActionState = function(d, _, R) {
    return P.H.useActionState(d, _, R);
  }, Z.useCallback = function(d, _) {
    return P.H.useCallback(d, _);
  }, Z.useContext = function(d) {
    return P.H.useContext(d);
  }, Z.useDebugValue = function() {
  }, Z.useDeferredValue = function(d, _) {
    return P.H.useDeferredValue(d, _);
  }, Z.useEffect = function(d, _) {
    return P.H.useEffect(d, _);
  }, Z.useEffectEvent = function(d) {
    return P.H.useEffectEvent(d);
  }, Z.useId = function() {
    return P.H.useId();
  }, Z.useImperativeHandle = function(d, _, R) {
    return P.H.useImperativeHandle(d, _, R);
  }, Z.useInsertionEffect = function(d, _) {
    return P.H.useInsertionEffect(d, _);
  }, Z.useLayoutEffect = function(d, _) {
    return P.H.useLayoutEffect(d, _);
  }, Z.useMemo = function(d, _) {
    return P.H.useMemo(d, _);
  }, Z.useOptimistic = function(d, _) {
    return P.H.useOptimistic(d, _);
  }, Z.useReducer = function(d, _, R) {
    return P.H.useReducer(d, _, R);
  }, Z.useRef = function(d) {
    return P.H.useRef(d);
  }, Z.useState = function(d) {
    return P.H.useState(d);
  }, Z.useSyncExternalStore = function(d, _, R) {
    return P.H.useSyncExternalStore(
      d,
      _,
      R
    );
  }, Z.useTransition = function() {
    return P.H.useTransition();
  }, Z.version = "19.3.1", Z;
}
var nh;
function Cf() {
  return nh || (nh = 1, Nf.exports = dy()), Nf.exports;
}
var zl = Cf(), zf = { exports: {} }, xn = {}, Af = { exports: {} }, Of = {};
var ih;
function my() {
  return ih || (ih = 1, (function(p) {
    function G(z, Q) {
      var C = z.length;
      z.push(Q);
      l: for (; 0 < C; ) {
        var ol = C - 1 >>> 1, nl = z[ol];
        if (0 < B(nl, Q))
          z[ol] = Q, z[C] = nl, C = ol;
        else break l;
      }
    }
    function q(z) {
      return z.length === 0 ? null : z[0];
    }
    function y(z) {
      if (z.length === 0) return null;
      var Q = z[0], C = z.pop();
      if (C !== Q) {
        z[0] = C;
        l: for (var ol = 0, nl = z.length, it = nl >>> 1; ol < it; ) {
          var Ht = 2 * (ol + 1) - 1, Bt = z[Ht], d = Ht + 1, _ = z[d];
          if (0 > B(Bt, C))
            d < nl && 0 > B(_, Bt) ? (z[ol] = _, z[d] = C, ol = d) : (z[ol] = Bt, z[Ht] = C, ol = Ht);
          else if (d < nl && 0 > B(_, C))
            z[ol] = _, z[d] = C, ol = d;
          else break l;
        }
      }
      return Q;
    }
    function B(z, Q) {
      var C = z.sortIndex - Q.sortIndex;
      return C !== 0 ? C : z.id - Q.id;
    }
    if (p.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var J = performance;
      p.unstable_now = function() {
        return J.now();
      };
    } else {
      var al = Date, Al = al.now();
      p.unstable_now = function() {
        return al.now() - Al;
      };
    }
    var bl = [], _l = [], M = 1, j = null, Y = 3, Nl = !1, Ml = !1, Xl = !1, cl = !1, Vl = typeof setTimeout == "function" ? setTimeout : null, xl = typeof clearTimeout == "function" ? clearTimeout : null, me = typeof setImmediate < "u" ? setImmediate : null;
    function Hl(z) {
      for (var Q = q(_l); Q !== null; ) {
        if (Q.callback === null) y(_l);
        else if (Q.startTime <= z)
          y(_l), Q.sortIndex = Q.expirationTime, G(bl, Q);
        else break;
        Q = q(_l);
      }
    }
    function ut(z) {
      if (Xl = !1, Hl(z), !Ml)
        if (q(bl) !== null)
          Ml = !0, rl || (rl = !0, nt());
        else {
          var Q = q(_l);
          Q !== null && hl(ut, Q.startTime - z);
        }
    }
    var rl = !1, F = -1, P = 5, Tt = -1;
    function ft() {
      return cl ? !0 : !(p.unstable_now() - Tt < P);
    }
    function Ll() {
      if (cl = !1, rl) {
        var z = p.unstable_now();
        Tt = z;
        var Q = !0;
        try {
          l: {
            Ml = !1, Xl && (Xl = !1, xl(F), F = -1), Nl = !0;
            var C = Y;
            try {
              t: {
                for (Hl(z), j = q(bl); j !== null && !(j.expirationTime > z && ft()); ) {
                  var ol = j.callback;
                  if (typeof ol == "function") {
                    j.callback = null, Y = j.priorityLevel;
                    var nl = ol(
                      j.expirationTime <= z
                    );
                    if (z = p.unstable_now(), typeof nl == "function") {
                      j.callback = nl, Hl(z), Q = !0;
                      break t;
                    }
                    j === q(bl) && y(bl), Hl(z);
                  } else y(bl);
                  j = q(bl);
                }
                if (j !== null) Q = !0;
                else {
                  var it = q(_l);
                  it !== null && hl(
                    ut,
                    it.startTime - z
                  ), Q = !1;
                }
              }
              break l;
            } finally {
              j = null, Y = C, Nl = !1;
            }
            Q = void 0;
          }
        } finally {
          Q ? nt() : rl = !1;
        }
      }
    }
    var nt;
    if (typeof me == "function")
      nt = function() {
        me(Ll);
      };
    else if (typeof MessageChannel < "u") {
      var rt = new MessageChannel(), _t = rt.port2;
      rt.port1.onmessage = Ll, nt = function() {
        _t.postMessage(null);
      };
    } else
      nt = function() {
        Vl(Ll, 0);
      };
    function hl(z, Q) {
      F = Vl(function() {
        z(p.unstable_now());
      }, Q);
    }
    p.unstable_IdlePriority = 5, p.unstable_ImmediatePriority = 1, p.unstable_LowPriority = 4, p.unstable_NormalPriority = 3, p.unstable_Profiling = null, p.unstable_UserBlockingPriority = 2, p.unstable_cancelCallback = function(z) {
      z.callback = null;
    }, p.unstable_forceFrameRate = function(z) {
      0 > z || 125 < z ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : P = 0 < z ? Math.floor(1e3 / z) : 5;
    }, p.unstable_getCurrentPriorityLevel = function() {
      return Y;
    }, p.unstable_next = function(z) {
      switch (Y) {
        case 1:
        case 2:
        case 3:
          var Q = 3;
          break;
        default:
          Q = Y;
      }
      var C = Y;
      Y = Q;
      try {
        return z();
      } finally {
        Y = C;
      }
    }, p.unstable_requestPaint = function() {
      cl = !0;
    }, p.unstable_runWithPriority = function(z, Q) {
      switch (z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          z = 3;
      }
      var C = Y;
      Y = z;
      try {
        return Q();
      } finally {
        Y = C;
      }
    }, p.unstable_scheduleCallback = function(z, Q, C) {
      var ol = p.unstable_now();
      switch (typeof C == "object" && C !== null ? (C = C.delay, C = typeof C == "number" && 0 < C ? ol + C : ol) : C = ol, z) {
        case 1:
          var nl = -1;
          break;
        case 2:
          nl = 250;
          break;
        case 5:
          nl = 1073741823;
          break;
        case 4:
          nl = 1e4;
          break;
        default:
          nl = 5e3;
      }
      return nl = C + nl, z = {
        id: M++,
        callback: Q,
        priorityLevel: z,
        startTime: C,
        expirationTime: nl,
        sortIndex: -1
      }, C > ol ? (z.sortIndex = C, G(_l, z), q(bl) === null && z === q(_l) && (Xl ? (xl(F), F = -1) : Xl = !0, hl(ut, C - ol))) : (z.sortIndex = nl, G(bl, z), Ml || Nl || (Ml = !0, rl || (rl = !0, nt()))), z;
    }, p.unstable_shouldYield = ft, p.unstable_wrapCallback = function(z) {
      var Q = Y;
      return function() {
        var C = Y;
        Y = Q;
        try {
          return z.apply(this, arguments);
        } finally {
          Y = C;
        }
      };
    };
  })(Of)), Of;
}
var ch;
function hy() {
  return ch || (ch = 1, Af.exports = my()), Af.exports;
}
var Df = { exports: {} }, et = {};
var sh;
function vy() {
  if (sh) return et;
  sh = 1;
  var p = Cf();
  function G(M) {
    var j = "https://react.dev/errors/" + M;
    if (1 < arguments.length) {
      j += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var Y = 2; Y < arguments.length; Y++)
        j += "&args[]=" + encodeURIComponent(arguments[Y]);
    }
    return "Minified React error #" + M + "; visit " + j + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function q() {
  }
  var y = {
    d: {
      f: q,
      r: function() {
        throw Error(G(522));
      },
      D: q,
      C: q,
      L: q,
      m: q,
      X: q,
      S: q,
      M: q
    },
    p: 0,
    findDOMNode: null
  }, B = /* @__PURE__ */ Symbol.for("react.portal"), J = /* @__PURE__ */ Symbol.for("react.recoverable"), al = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function Al(M, j, Y) {
    var Nl = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: B,
      key: Nl == null ? null : Nl === al ? al : "" + Nl,
      children: M,
      containerInfo: j,
      implementation: Y
    };
  }
  var bl = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function _l(M, j) {
    if (M === "font") return "";
    if (typeof j == "string")
      return j === "use-credentials" ? j : "";
  }
  return et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = y, et.browser = function(M) {
    return { $$typeof: J, _reason: M };
  }, et.createPortal = function(M, j) {
    var Y = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!j || j.nodeType !== 1 && j.nodeType !== 9 && j.nodeType !== 11)
      throw Error(G(299));
    return Al(M, j, null, Y);
  }, et.flushSync = function(M) {
    var j = bl.T, Y = y.p;
    try {
      if (bl.T = null, y.p = 2, M) return M();
    } finally {
      bl.T = j, y.p = Y, y.d.f();
    }
  }, et.preconnect = function(M, j) {
    typeof M == "string" && (j ? (j = j.crossOrigin, j = typeof j == "string" ? j === "use-credentials" ? j : "" : void 0) : j = null, y.d.C(M, j));
  }, et.prefetchDNS = function(M) {
    typeof M == "string" && y.d.D(M);
  }, et.preinit = function(M, j) {
    if (typeof M == "string" && j && typeof j.as == "string") {
      var Y = j.as, Nl = _l(Y, j.crossOrigin), Ml = typeof j.integrity == "string" ? j.integrity : void 0, Xl = typeof j.fetchPriority == "string" ? j.fetchPriority : void 0;
      Y === "style" ? y.d.S(
        M,
        typeof j.precedence == "string" ? j.precedence : void 0,
        {
          crossOrigin: Nl,
          integrity: Ml,
          fetchPriority: Xl
        }
      ) : Y === "script" && y.d.X(M, {
        crossOrigin: Nl,
        integrity: Ml,
        fetchPriority: Xl,
        nonce: typeof j.nonce == "string" ? j.nonce : void 0
      });
    }
  }, et.preinitModule = function(M, j) {
    if (typeof M == "string")
      if (typeof j == "object" && j !== null) {
        if (j.as == null || j.as === "script") {
          var Y = _l(
            j.as,
            j.crossOrigin
          );
          y.d.M(M, {
            crossOrigin: Y,
            integrity: typeof j.integrity == "string" ? j.integrity : void 0,
            nonce: typeof j.nonce == "string" ? j.nonce : void 0,
            fetchPriority: typeof j.fetchPriority == "string" ? j.fetchPriority : void 0
          });
        }
      } else j == null && y.d.M(M);
  }, et.preload = function(M, j) {
    if (typeof M == "string" && typeof j == "object" && j !== null && typeof j.as == "string") {
      var Y = j.as, Nl = _l(Y, j.crossOrigin);
      y.d.L(M, Y, {
        crossOrigin: Nl,
        integrity: typeof j.integrity == "string" ? j.integrity : void 0,
        nonce: typeof j.nonce == "string" ? j.nonce : void 0,
        type: typeof j.type == "string" ? j.type : void 0,
        fetchPriority: typeof j.fetchPriority == "string" ? j.fetchPriority : void 0,
        referrerPolicy: typeof j.referrerPolicy == "string" ? j.referrerPolicy : void 0,
        imageSrcSet: typeof j.imageSrcSet == "string" ? j.imageSrcSet : void 0,
        imageSizes: typeof j.imageSizes == "string" ? j.imageSizes : void 0,
        media: typeof j.media == "string" ? j.media : void 0
      });
    }
  }, et.preloadModule = function(M, j) {
    if (typeof M == "string")
      if (j) {
        var Y = _l(j.as, j.crossOrigin);
        y.d.m(M, {
          as: typeof j.as == "string" && j.as !== "script" ? j.as : void 0,
          crossOrigin: Y,
          integrity: typeof j.integrity == "string" ? j.integrity : void 0,
          nonce: typeof j.nonce == "string" ? j.nonce : void 0,
          fetchPriority: typeof j.fetchPriority == "string" ? j.fetchPriority : void 0
        });
      } else y.d.m(M);
  }, et.requestFormReset = function(M) {
    y.d.r(M);
  }, et.unstable_batchedUpdates = function(M, j) {
    return M(j);
  }, et.useFormState = function(M, j, Y) {
    return bl.H.useFormState(M, j, Y);
  }, et.useFormStatus = function() {
    return bl.H.useHostTransitionStatus();
  }, et.version = "19.3.1", et;
}
var fh;
function yy() {
  if (fh) return Df.exports;
  fh = 1;
  function p() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(p);
      } catch (G) {
        console.error(G);
      }
  }
  return p(), Df.exports = vy(), Df.exports;
}
var rh;
function gy() {
  if (rh) return xn;
  rh = 1;
  var p = hy(), G = Cf(), q = yy();
  function y(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function B(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function J(l) {
    for (var t = l, e = t; e && !e.alternate; )
      t = e, (t.flags & 4098) !== 0 && (l = t.return), e = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? l : null;
  }
  function al(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Al(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function bl(l) {
    if (J(l) !== l)
      throw Error(y(188));
  }
  function _l(l) {
    var t = l.alternate;
    if (!t) {
      if (t = J(l), t === null) throw Error(y(188));
      return t !== l ? null : l;
    }
    for (var e = l, a = t; ; ) {
      var u = e.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (a = u.return, a !== null) {
          e = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === e) return bl(u), l;
          if (n === a) return bl(u), t;
          n = n.sibling;
        }
        throw Error(y(188));
      }
      if (e.return !== a.return) e = u, a = n;
      else {
        for (var i = !1, s = u.child; s; ) {
          if (s === e) {
            i = !0, e = u, a = n;
            break;
          }
          if (s === a) {
            i = !0, a = u, e = n;
            break;
          }
          s = s.sibling;
        }
        if (!i) {
          for (s = n.child; s; ) {
            if (s === e) {
              i = !0, e = n, a = u;
              break;
            }
            if (s === a) {
              i = !0, a = n, e = u;
              break;
            }
            s = s.sibling;
          }
          if (!i) throw Error(y(189));
        }
      }
      if (e.alternate !== a) throw Error(y(190));
    }
    if (e.tag !== 3) throw Error(y(188));
    return e.stateNode.current === e ? l : t;
  }
  function M(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = M(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  function j(l, t, e, a, u, n) {
    for (; l !== null; ) {
      if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && e(l, a, u, n) || (l.tag !== 22 || l.memoizedState === null) && (t || l.tag !== 5 && l.tag !== 27) && j(
        l.child,
        t,
        e,
        a,
        u,
        n
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function Y(l) {
    for (l = l.return; l !== null; ) {
      if (l.tag === 3 || l.tag === 5 || l.tag === 27) return l;
      l = l.return;
    }
    return null;
  }
  function Nl(l) {
    var t = !1;
    for (l = l.return; l !== null && (l.tag === 4 && (t = !0), !(l.tag === 3 || l.tag === 5 || l.tag === 27)); )
      l = l.return;
    return t;
  }
  function Ml(l) {
    var t = [null, null], e = Y(l);
    return e === null || Xl(
      t,
      l,
      e.child,
      { foundSelf: !1 }
    ), t;
  }
  function Xl(l, t, e, a) {
    for (; e !== null; ) {
      if (e === t) a.foundSelf = !0;
      else if (e.tag === 5 || e.tag === 27 || e.tag === 6) {
        if (a.foundSelf) return l[1] = e, !0;
        l[0] = e;
      } else if ((e.tag !== 22 || e.memoizedState === null) && Xl(
        l,
        t,
        e.child,
        a
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function cl(l) {
    switch (l.tag) {
      case 5:
      case 27:
      case 6:
        return l.stateNode;
      case 3:
        return l.stateNode.containerInfo;
      default:
        throw Error(y(559));
    }
  }
  var Vl = null, xl = null;
  function me(l, t, e) {
    return l === e ? !0 : l === t ? (Vl = l, !0) : !1;
  }
  function Hl(l, t, e) {
    return l === e ? (xl = l, !1) : l === t ? (xl !== null && (Vl = l), !0) : !1;
  }
  function ut(l) {
    if (l === null) return null;
    do
      l = l === null ? null : l.return;
    while (l && l.tag !== 5 && l.tag !== 27 && l.tag !== 3);
    return l || null;
  }
  function rl(l, t, e) {
    for (var a = 0, u = l; u; u = e(u)) a++;
    u = 0;
    for (var n = t; n; n = e(n)) u++;
    for (; 0 < a - u; ) l = e(l), a--;
    for (; 0 < u - a; ) t = e(t), u--;
    for (; a--; ) {
      if (l === t || t !== null && l === t.alternate)
        return l;
      l = e(l), t = e(t);
    }
    return null;
  }
  var F = Object.assign, P = /* @__PURE__ */ Symbol.for("react.element"), Tt = /* @__PURE__ */ Symbol.for("react.transitional.element"), ft = /* @__PURE__ */ Symbol.for("react.portal"), Ll = /* @__PURE__ */ Symbol.for("react.fragment"), nt = /* @__PURE__ */ Symbol.for("react.strict_mode"), rt = /* @__PURE__ */ Symbol.for("react.profiler"), _t = /* @__PURE__ */ Symbol.for("react.consumer"), hl = /* @__PURE__ */ Symbol.for("react.context"), z = /* @__PURE__ */ Symbol.for("react.forward_ref"), Q = /* @__PURE__ */ Symbol.for("react.suspense"), C = /* @__PURE__ */ Symbol.for("react.suspense_list"), ol = /* @__PURE__ */ Symbol.for("react.memo"), nl = /* @__PURE__ */ Symbol.for("react.lazy"), it = /* @__PURE__ */ Symbol.for("react.activity"), Ht = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), Bt = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), d = /* @__PURE__ */ Symbol.for("react.view_transition"), _ = /* @__PURE__ */ Symbol.for("react.recoverable"), R = Symbol.iterator;
  function U(l) {
    return l === null || typeof l != "object" ? null : (l = R && l[R] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var $ = /* @__PURE__ */ Symbol.for("react.client.reference");
  function ll(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === $ ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Ll:
        return "Fragment";
      case rt:
        return "Profiler";
      case nt:
        return "StrictMode";
      case Q:
        return "Suspense";
      case C:
        return "SuspenseList";
      case it:
        return "Activity";
      case d:
        return "ViewTransition";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case ft:
          return "Portal";
        case hl:
          return l.displayName || "Context";
        case _t:
          return (l._context.displayName || "Context") + ".Consumer";
        case z:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case ol:
          return t = l.displayName || null, t !== null ? t : ll(l.type) || "Memo";
        case nl:
          t = l._payload, l = l._init;
          try {
            return ll(l(t));
          } catch {
          }
      }
    return null;
  }
  var il = Array.isArray, A = G.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, X = q.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, pt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Da = [], le = -1;
  function ct(l) {
    return { current: l };
  }
  function Ul(l) {
    0 > le || (l.current = Da[le], Da[le] = null, le--);
  }
  function vl(l, t) {
    le++, Da[le] = l.current, l.current = t;
  }
  var Zl = ct(null), na = ct(null), te = ct(null), Ma = ct(null);
  function Ca(l, t) {
    switch (vl(te, t), vl(na, l), vl(Zl, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? om(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = om(t), l = dm(t, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    Ul(Zl), vl(Zl, l);
  }
  function De() {
    Ul(Zl), Ul(na), Ul(te);
  }
  function pu(l) {
    var t = l.memoizedState;
    t !== null && (ju._currentValue = t.memoizedState, vl(Ma, l)), t = Zl.current;
    var e = dm(t, l.type);
    t !== e && (vl(na, l), vl(Zl, e));
  }
  function Ra(l) {
    na.current === l && (Ul(Zl), Ul(na)), Ma.current === l && (Ul(Ma), ju._currentValue = pt);
  }
  var Eu, Tn;
  function ot(l) {
    if (Eu === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        Eu = t && t[1] || "", Tn = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Eu + l + Tn;
  }
  var Me = !1;
  function r(l, t) {
    if (!l || Me) return "";
    Me = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var T = function() {
                throw Error();
              };
              if (Object.defineProperty(T.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(T, []);
                } catch (N) {
                  var m = N;
                }
                Reflect.construct(l, [], T);
              } else {
                try {
                  T.call();
                } catch (N) {
                  m = N;
                }
                T = !1;
                try {
                  var S = Object.getOwnPropertyDescriptor(
                    l.prototype,
                    "props"
                  );
                  Object.defineProperty(l.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), T = !0, new l();
                } finally {
                  T && (S !== void 0 ? Object.defineProperty(l.prototype, "props", S) : delete l.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (N) {
                m = N;
              }
              (T = l()) && typeof T.catch == "function" && T.catch(function() {
              });
            }
          } catch (N) {
            if (N && m && typeof N.stack == "string")
              return [N.stack, m.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = a.DetermineComponentFrameRoot(), i = n[0], s = n[1];
      if (i && s) {
        var f = i.split(`
`), v = s.split(`
`);
        for (u = a = 0; a < f.length && !f[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; u < v.length && !v[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (a === f.length || u === v.length)
          for (a = f.length - 1, u = v.length - 1; 1 <= a && 0 <= u && f[a] !== v[u]; )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (f[a] !== v[u]) {
            if (a !== 1 || u !== 1)
              do
                if (a--, u--, 0 > u || f[a] !== v[u]) {
                  var b = `
` + f[a].replace(" at new ", " at ");
                  return l.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", l.displayName)), b;
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      Me = !1, Error.prepareStackTrace = e;
    }
    return (e = l ? l.displayName || l.name : "") ? ot(e) : "";
  }
  function E(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return ot(l.type);
      case 16:
        return ot("Lazy");
      case 13:
        return l.child !== t && t !== null ? ot("Suspense Fallback") : ot("Suspense");
      case 19:
        return ot("SuspenseList");
      case 0:
      case 15:
        return r(l.type, !1);
      case 11:
        return r(l.type.render, !1);
      case 1:
        return r(l.type, !0);
      case 31:
        return ot("Activity");
      case 30:
        return ot("ViewTransition");
      default:
        return "";
    }
  }
  function L(l) {
    try {
      var t = "", e = null;
      do
        t += E(l, e), e = l, l = l.return;
      while (l);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var dl = Object.prototype.hasOwnProperty, Jt = p.unstable_scheduleCallback, Wi = p.unstable_cancelCallback, vh = p.unstable_shouldYield, yh = p.unstable_requestPaint, Et = p.unstable_now, gh = p.unstable_getCurrentPriorityLevel, Rf = p.unstable_ImmediatePriority, Uf = p.unstable_UserBlockingPriority, _n = p.unstable_NormalPriority, Sh = p.unstable_LowPriority, qf = p.unstable_IdlePriority, bh = p.log, jh = p.unstable_setDisableYieldValue, Nu = null, Nt = null;
  function Ce(l) {
    if (typeof bh == "function" && jh(l), Nt && typeof Nt.setStrictMode == "function")
      try {
        Nt.setStrictMode(Nu, l);
      } catch {
      }
  }
  var zt = Math.clz32 ? Math.clz32 : _h, xh = Math.log, Th = Math.LN2;
  function _h(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (xh(l) / Th | 0) | 0;
  }
  var pn = 256, En = 262144, Nn = 4194304;
  function ia(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & -l;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function zn(l, t, e) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var u = 0, n = l.suspendedLanes, i = l.pingedLanes;
    l = l.warmLanes;
    var s = a & 134217727;
    return s !== 0 ? (a = s & ~n, a !== 0 ? u = ia(a) : (i &= s, i !== 0 ? u = ia(i) : e || (e = s & ~l, e !== 0 && (u = ia(e))))) : (s = a & ~n, s !== 0 ? u = ia(s) : i !== 0 ? u = ia(i) : e || (e = a & ~l, e !== 0 && (u = ia(e)))), u === 0 ? 0 : t !== 0 && t !== u && (t & n) === 0 && (n = u & -u, e = t & -t, n >= e || n === 32 && (e & 4194048) !== 0) ? t : u;
  }
  function zu(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Hf(l, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var e = l.entangledLanes;
    if (e !== 0)
      for (l = l.entanglements, e &= t; 0 < e; ) {
        var a = 31 - zt(e), u = 1 << a;
        t |= l[a], e &= ~u;
      }
    return t;
  }
  function ph(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Bf() {
    var l = Nn;
    return Nn <<= 1, (Nn & 62914560) === 0 && (Nn = 4194304), l;
  }
  function ki(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function Au(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Eh(l, t, e, a, u, n) {
    var i = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var s = l.entanglements, f = l.expirationTimes, v = l.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var b = 31 - zt(e), T = 1 << b;
      s[b] = 0, f[b] = -1;
      var m = v[b];
      if (m !== null)
        for (v[b] = null, b = 0; b < m.length; b++) {
          var S = m[b];
          S !== null && (S.lane &= -536870913);
        }
      e &= ~T;
    }
    a !== 0 && Yf(l, a, 0), n !== 0 && u === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t));
  }
  function Yf(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - zt(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | e & 261930;
  }
  function Gf(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var a = 31 - zt(e), u = 1 << a;
      u & t | l[a] & t && (l[a] |= t), e &= ~u;
    }
  }
  function Qf(l, t) {
    var e = t & -t;
    return e = (e & 42) !== 0 ? 1 : Ii(e), (e & (l.suspendedLanes | t)) !== 0 ? 0 : e;
  }
  function Ii(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function Pi(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Xf() {
    var l = X.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : $m(l.type));
  }
  function Vf(l, t) {
    var e = X.p;
    try {
      return X.p = l, t();
    } finally {
      X.p = e;
    }
  }
  var he = Math.random().toString(36).slice(2), Wl = "__reactFiber$" + he, yt = "__reactProps$" + he, Ua = "__reactContainer$" + he, Lf = "__reactEvents$" + he, Nh = "__reactListeners$" + he, zh = "__reactHandles$" + he, Zf = "__reactResources$" + he, Ou = "__reactMarker$" + he, An = "__reactLoad$" + he;
  function On(l) {
    delete l[Wl], delete l[yt], delete l[Nh], delete l[zh];
  }
  function ca(l) {
    var t;
    if (t = l[Wl]) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[Ua] || e[Wl]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = Om(l); l !== null; ) {
            if (e = l[Wl]) return e;
            l = Om(l);
          }
        return t;
      }
      l = e, e = l.parentNode;
    }
    return null;
  }
  function qa(l) {
    if (l = l[Wl] || l[Ua]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Du(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(y(33));
  }
  function Ha(l) {
    var t = l[Zf];
    return t || (t = l[Zf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Kl(l) {
    l[Ou] = !0;
  }
  function wf(l) {
    l[An] = void 0;
  }
  var Kf = /* @__PURE__ */ new Set(), Jf = {};
  function sa(l, t) {
    Ba(l, t), Ba(l + "Capture", t);
  }
  function Ba(l, t) {
    for (Jf[l] = t, l = 0; l < t.length; l++)
      Kf.add(t[l]);
  }
  var Ah = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ff = {}, $f = {};
  function Oh(l) {
    return dl.call($f, l) ? !0 : dl.call(Ff, l) ? !1 : Ah.test(l) ? $f[l] = !0 : (Ff[l] = !0, !1);
  }
  var sl = !1;
  function Wf() {
    var l = sl;
    return sl = !1, l;
  }
  function Dn(l, t, e) {
    if (Oh(t))
      if (e === null) l.removeAttribute(t);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, e);
      }
  }
  function Mn(l, t, e) {
    if (e === null) l.removeAttribute(t);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, e);
    }
  }
  function ve(l, t, e, a) {
    if (a === null) l.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(e);
          return;
      }
      l.setAttributeNS(t, e, a);
    }
  }
  function At(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function kf(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Dh(l, t, e) {
    var a = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var u = a.get, n = a.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(i) {
          e = "" + i, n.call(this, i);
        }
      }), Object.defineProperty(l, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return e;
        },
        setValue: function(i) {
          e = "" + i;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function lc(l) {
    if (!l._valueTracker) {
      var t = kf(l) ? "checked" : "value";
      l._valueTracker = Dh(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function If(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), a = "";
    return l && (a = kf(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== e ? (t.setValue(l), !0) : !1;
  }
  var Mh = /[\n"\\]/g;
  function Yt(l) {
    return l.replace(
      Mh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function tc(l, t, e, a, u, n, i, s) {
    l.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.type = i : l.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + At(t)) : l.value !== "" + At(t) && (l.value = "" + At(t)) : i !== "submit" && i !== "reset" || l.removeAttribute("value"), t != null ? i === "number" && l.value == t ? ec(l, At(l.value)) : ec(l, At(t)) : e != null ? ec(l, At(e)) : a != null && l.removeAttribute("value"), u == null && n != null && (l.defaultChecked = !!n), u != null && (l.checked = u && typeof u != "function" && typeof u != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? l.name = "" + At(s) : l.removeAttribute("name");
  }
  function Pf(l, t, e, a, u, n, i, s) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || e != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        lc(l);
        return;
      }
      e = e != null ? "" + At(e) : "", t = t != null ? "" + At(t) : e, s || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = s ? l.checked : !!a, l.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (l.name = i), lc(l);
  }
  function ec(l, t) {
    l.defaultValue !== "" + t && (l.defaultValue = "" + t);
  }
  function Ya(l, t, e, a) {
    if (l = l.options, t) {
      t = {};
      for (var u = 0; u < e.length; u++)
        t["$" + e[u]] = !0;
      for (e = 0; e < l.length; e++)
        u = t.hasOwnProperty("$" + l[e].value), l[e].selected !== u && (l[e].selected = u), u && a && (l[e].defaultSelected = !0);
    } else {
      for (e = "" + At(e), t = null, u = 0; u < l.length; u++) {
        if (l[u].value === e) {
          l[u].selected = !0, a && (l[u].defaultSelected = !0);
          return;
        }
        t !== null || l[u].disabled || (t = l[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function lr(l, t, e) {
    if (t != null && (t = "" + At(t), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + At(e) : "";
  }
  function tr(l, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(y(92));
        if (il(a)) {
          if (1 < a.length) throw Error(y(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), t = e;
    }
    e = At(t), l.defaultValue = e, a = l.textContent, a === e && a !== "" && a !== null && (l.value = a), lc(l);
  }
  function Ga(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Ch = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function er(l, t, e) {
    var a = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, e) : typeof e != "number" || e === 0 || Ch.has(t) ? t === "float" ? l.cssFloat = e : l[t] = ("" + e).trim() : l[t] = e + "px";
  }
  function ar(l, t, e) {
    if (t != null && typeof t != "object")
      throw Error(y(62));
    if (l = l.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "", sl = !0);
      for (var u in t)
        a = t[u], t.hasOwnProperty(u) && e[u] !== a && (er(l, u, a), sl = !0);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && er(l, n, t[n]);
  }
  function ac(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Rh = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Uh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Cn(l) {
    return Uh.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function ee() {
  }
  var uc = null;
  function nc(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Qa = null, Xa = null;
  function ur(l) {
    var t = qa(l);
    if (t && (l = t.stateNode)) {
      var e = l[yt] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (tc(
            l,
            e.value,
            e.defaultValue,
            e.defaultValue,
            e.checked,
            e.defaultChecked,
            e.type,
            e.name
          ), t = e.name, e.type === "radio" && t != null) {
            for (e = l; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll(
              'input[name="' + Yt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var a = e[t];
              if (a !== l && a.form === l.form) {
                var u = a[yt] || null;
                if (!u) throw Error(y(90));
                tc(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (t = 0; t < e.length; t++)
              a = e[t], a.form === l.form && If(a);
          }
          break l;
        case "textarea":
          lr(l, e.value, e.defaultValue);
          break l;
        case "select":
          t = e.value, t != null && Ya(l, !!e.multiple, t, !1);
      }
    }
  }
  var ic = !1;
  function nr(l, t, e) {
    if (ic) return l(t, e);
    ic = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (ic = !1, (Qa !== null || Xa !== null) && (Ci(), Qa && (t = Qa, l = Xa, Xa = Qa = null, ur(t), l)))
        for (t = 0; t < l.length; t++) ur(l[t]);
    }
  }
  function Mu(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var a = e[yt] || null;
    if (a === null) return null;
    e = a[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (l = l.type, a = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !a;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (e && typeof e != "function")
      throw Error(
        y(231, t, typeof e)
      );
    return e;
  }
  var ye = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), cc = !1;
  if (ye)
    try {
      var Cu = {};
      Object.defineProperty(Cu, "passive", {
        get: function() {
          cc = !0;
        }
      }), window.addEventListener("test", Cu, Cu), window.removeEventListener("test", Cu, Cu);
    } catch {
      cc = !1;
    }
  var Re = null, sc = null, Rn = null;
  function ir() {
    if (Rn) return Rn;
    var l, t = sc, e = t.length, a, u = "value" in Re ? Re.value : Re.textContent, n = u.length;
    for (l = 0; l < e && t[l] === u[l]; l++) ;
    var i = e - l;
    for (a = 1; a <= i && t[e - a] === u[n - a]; a++) ;
    return Rn = u.slice(l, 1 < a ? 1 - a : void 0);
  }
  function Un(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function qn() {
    return !0;
  }
  function cr() {
    return !1;
  }
  function dt(l) {
    function t(e, a, u, n, i) {
      this._reactName = e, this._targetInst = u, this.type = a, this.nativeEvent = n, this.target = i, this.currentTarget = null;
      for (var s in l)
        l.hasOwnProperty(s) && (e = l[s], this[s] = e ? e(n) : n[s]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? qn : cr, this.isPropagationStopped = cr, this;
    }
    return F(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = qn);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = qn);
      },
      persist: function() {
      },
      isPersistent: qn
    }), t;
  }
  var Ue = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Hn = dt(Ue), Ru = F({}, Ue, { view: 0, detail: 0 }), qh = dt(Ru), fc, rc, Uu, Bn = F({}, Ru, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: dc,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Uu && (Uu && l.type === "mousemove" ? (fc = l.screenX - Uu.screenX, rc = l.screenY - Uu.screenY) : rc = fc = 0, Uu = l), fc);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : rc;
    }
  }), sr = dt(Bn), Hh = F({}, Bn, { dataTransfer: 0 }), Bh = dt(Hh), Yh = F({}, Ru, { relatedTarget: 0 }), oc = dt(Yh), Gh = F({}, Ue, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Qh = dt(Gh), Xh = F({}, Ue, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Vh = dt(Xh), Lh = F({}, Ue, { data: 0 }), fr = dt(Lh), Zh = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, wh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Kh = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Jh(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = Kh[l]) ? !!t[l] : !1;
  }
  function dc() {
    return Jh;
  }
  var Fh = F({}, Ru, {
    key: function(l) {
      if (l.key) {
        var t = Zh[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Un(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? wh[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: dc,
    charCode: function(l) {
      return l.type === "keypress" ? Un(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? Un(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), $h = dt(Fh), Wh = F({}, Bn, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), rr = dt(Wh), kh = F({}, Ue, { submitter: 0 }), Ih = dt(kh), Ph = F({}, Ru, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: dc
  }), lv = dt(Ph), tv = F({}, Ue, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ev = dt(tv), av = F({}, Bn, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), uv = dt(av), nv = F({}, Ue, {
    newState: 0,
    oldState: 0,
    source: 0
  }), iv = dt(nv), cv = [9, 13, 27, 32], mc = ye && "CompositionEvent" in window, qu = null;
  ye && "documentMode" in document && (qu = document.documentMode);
  var sv = ye && "TextEvent" in window && !qu, or = ye && (!mc || qu && 8 < qu && 11 >= qu), dr = " ", mr = !1;
  function hr(l, t) {
    switch (l) {
      case "keyup":
        return cv.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function vr(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Va = !1;
  function fv(l, t) {
    switch (l) {
      case "compositionend":
        return vr(t);
      case "keypress":
        return t.which !== 32 ? null : (mr = !0, dr);
      case "textInput":
        return l = t.data, l === dr && mr ? null : l;
      default:
        return null;
    }
  }
  function rv(l, t) {
    if (Va)
      return l === "compositionend" || !mc && hr(l, t) ? (l = ir(), Rn = sc = Re = null, Va = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return or && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var ov = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function yr(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!ov[l.type] : t === "textarea";
  }
  function gr(l, t, e, a) {
    Qa ? Xa ? Xa.push(a) : Xa = [a] : Qa = a, t = Yi(t, "onChange"), 0 < t.length && (e = new Hn(
      "onChange",
      "change",
      null,
      e,
      a
    ), l.push({ event: e, listeners: t }));
  }
  var Hu = null, Bu = null;
  function dv(l) {
    nm(l, 0);
  }
  function Yn(l) {
    var t = Du(l);
    if (If(t)) return l;
  }
  function Sr(l, t) {
    if (l === "change") return t;
  }
  var br = !1;
  if (ye) {
    var hc;
    if (ye) {
      var vc = "oninput" in document;
      if (!vc) {
        var jr = document.createElement("div");
        jr.setAttribute("oninput", "return;"), vc = typeof jr.oninput == "function";
      }
      hc = vc;
    } else hc = !1;
    br = hc && (!document.documentMode || 9 < document.documentMode);
  }
  function xr() {
    Hu && (Hu.detachEvent("onpropertychange", Tr), Bu = Hu = null);
  }
  function Tr(l) {
    if (l.propertyName === "value" && Yn(Bu)) {
      var t = [];
      gr(
        t,
        Bu,
        l,
        nc(l)
      ), nr(dv, t);
    }
  }
  function mv(l, t, e) {
    l === "focusin" ? (xr(), Hu = t, Bu = e, Hu.attachEvent("onpropertychange", Tr)) : l === "focusout" && xr();
  }
  function hv(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Yn(Bu);
  }
  function vv(l, t) {
    if (l === "click") return Yn(t);
  }
  function yv(l, t) {
    if (l === "input" || l === "change")
      return Yn(t);
  }
  function gv(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var Ot = typeof Object.is == "function" ? Object.is : gv;
  function Yu(l, t) {
    if (Ot(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!dl.call(t, u) || !Ot(l[u], t[u]))
        return !1;
    }
    return !0;
  }
  function yc(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  function _r(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function pr(l, t) {
    var e = _r(l);
    l = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (a = l + e.textContent.length, l <= t && a >= t)
          return { node: e, offset: t - l };
        l = a;
      }
      l: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break l;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = _r(e);
    }
  }
  function Er(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Er(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Nr(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = yc(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = yc(l.document);
    }
    return t;
  }
  function gc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var Sv = ye && "documentMode" in document && 11 >= document.documentMode, La = null, Sc = null, Gu = null, bc = !1;
  function zr(l, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    bc || La == null || La !== yc(a) || (a = La, "selectionStart" in a && gc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Gu && Yu(Gu, a) || (Gu = a, a = Yi(Sc, "onSelect"), 0 < a.length && (t = new Hn(
      "onSelect",
      "select",
      null,
      t,
      e
    ), l.push({ event: t, listeners: a }), t.target = La)));
  }
  function fa(l, t) {
    var e = {};
    return e[l.toLowerCase()] = t.toLowerCase(), e["Webkit" + l] = "webkit" + t, e["Moz" + l] = "moz" + t, e;
  }
  var Za = {
    animationend: fa("Animation", "AnimationEnd"),
    animationiteration: fa("Animation", "AnimationIteration"),
    animationstart: fa("Animation", "AnimationStart"),
    transitionrun: fa("Transition", "TransitionRun"),
    transitionstart: fa("Transition", "TransitionStart"),
    transitioncancel: fa("Transition", "TransitionCancel"),
    transitionend: fa("Transition", "TransitionEnd")
  }, jc = {}, Ar = {};
  ye && (Ar = document.createElement("div").style, "AnimationEvent" in window || (delete Za.animationend.animation, delete Za.animationiteration.animation, delete Za.animationstart.animation), "TransitionEvent" in window || delete Za.transitionend.transition);
  function ra(l) {
    if (jc[l]) return jc[l];
    if (!Za[l]) return l;
    var t = Za[l], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in Ar)
        return jc[l] = t[e];
    return l;
  }
  var Or = ra("animationend"), Dr = ra("animationiteration"), Mr = ra("animationstart"), bv = ra("transitionrun"), jv = ra("transitionstart"), xv = ra("transitioncancel"), Cr = ra("transitionend"), Rr = /* @__PURE__ */ new Map(), xc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  xc.push("scrollEnd");
  function Ft(l, t) {
    Rr.set(l, t), sa(t, [l]);
  }
  var Tv = 0;
  function ge(l, t) {
    if (l.name != null && l.name !== "auto") return l.name;
    if (t.autoName !== null) return t.autoName;
    l = It.identifierPrefix;
    var e = Tv++;
    return l = "_" + l + "t_" + e.toString(32) + "_", t.autoName = l;
  }
  function Ur(l) {
    if (l == null || typeof l == "string")
      return l;
    var t = null, e = ru;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = l[e[a]];
        if (u != null) {
          if (u === "none") return "none";
          t = t == null ? u : t + (" " + u);
        }
      }
    return t ?? l.default;
  }
  function Se(l, t) {
    return l = Ur(l), t = Ur(t), t == null ? l === "auto" ? null : l : t === "auto" ? null : t;
  }
  var Gn = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, Gt = [], wa = 0, Tc = 0;
  function Qn() {
    for (var l = wa, t = Tc = wa = 0; t < l; ) {
      var e = Gt[t];
      Gt[t++] = null;
      var a = Gt[t];
      Gt[t++] = null;
      var u = Gt[t];
      Gt[t++] = null;
      var n = Gt[t];
      if (Gt[t++] = null, a !== null && u !== null) {
        var i = a.pending;
        i === null ? u.next = u : (u.next = i.next, i.next = u), a.pending = u;
      }
      n !== 0 && qr(e, u, n);
    }
  }
  function Xn(l, t, e, a) {
    Gt[wa++] = l, Gt[wa++] = t, Gt[wa++] = e, Gt[wa++] = a, Tc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function _c(l, t, e, a) {
    return Xn(l, t, e, a), Vn(l);
  }
  function oa(l, t) {
    return Xn(l, null, null, t), Vn(l);
  }
  function qr(l, t, e) {
    l.lanes |= e;
    var a = l.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = l.return; n !== null; )
      n.childLanes |= e, a = n.alternate, a !== null && (a.childLanes |= e), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (u = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, u && t !== null && (u = 31 - zt(e), l = n.hiddenUpdates, a = l[u], a === null ? l[u] = [t] : a.push(t), t.lane = e | 536870912), n) : null;
  }
  function Vn(l) {
    if (50 < sn)
      throw sn = 0, Mi = null, Error(y(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Ka = {};
  function _v(l, t, e, a) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function gt(l, t, e, a) {
    return new _v(l, t, e, a);
  }
  function pc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function be(l, t) {
    var e = l.alternate;
    return e === null ? (e = gt(
      l.tag,
      t,
      l.key,
      l.mode
    ), e.elementType = l.elementType, e.type = l.type, e.stateNode = l.stateNode, e.alternate = l, l.alternate = e) : (e.pendingProps = t, e.type = l.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = l.flags & 1206910976, e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, t = l.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = l.sibling, e.index = l.index, e.ref = l.ref, e.refCleanup = l.refCleanup, e;
  }
  function Hr(l, t) {
    l.flags &= 1206910978;
    var e = l.alternate;
    return e === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.type = e.type, t = e.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Ln(l, t, e, a, u, n) {
    var i = 0;
    if (a = l, typeof a == "function") pc(a) && (i = 1);
    else if (typeof a == "string")
      i = k0(
        l,
        e,
        Zl.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (a) {
        case it:
          return l = gt(31, e, t, u), l.elementType = it, l.lanes = n, l;
        case Ll:
          return da(e.children, u, n, t);
        case nt:
          i = 8, u |= 24;
          break;
        case rt:
          return l = gt(12, e, t, u | 2), l.elementType = rt, l.lanes = n, l;
        case Q:
          return l = gt(13, e, t, u), l.elementType = Q, l.lanes = n, l;
        case C:
          return l = gt(19, e, t, u), l.elementType = C, l.lanes = n, l;
        case Ht:
        case d:
          return l = u | 32, l = gt(30, e, t, l), l.elementType = d, l.lanes = n, l.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, l;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case hl:
                i = 10;
                break l;
              case _t:
                i = 9;
                break l;
              case z:
                i = 11;
                break l;
              case ol:
                i = 14;
                break l;
              case nl:
                i = 16, a = null;
                break l;
            }
          i = 29, e = Error(
            y(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = gt(i, e, t, u), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function da(l, t, e, a) {
    return l = gt(7, l, a, t), l.lanes = e, l;
  }
  function Ec(l, t, e) {
    return l = gt(6, l, null, t), l.lanes = e, l;
  }
  function Br(l) {
    var t = gt(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function Nc(l, t, e) {
    return t = gt(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = e, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var Yr = /* @__PURE__ */ new WeakMap();
  function Qt(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = Yr.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: L(t)
      }, Yr.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: L(t)
    };
  }
  var Ja = [], Fa = 0, Zn = null, Qu = 0, Xt = [], Vt = 0, qe = null, ae = 1, ue = "";
  function je(l, t) {
    Ja[Fa++] = Qu, Ja[Fa++] = Zn, Zn = l, Qu = t;
  }
  function Gr(l, t, e) {
    Xt[Vt++] = ae, Xt[Vt++] = ue, Xt[Vt++] = qe, qe = l;
    var a = ae;
    l = ue;
    var u = 32 - zt(a) - 1;
    a &= ~(1 << u), e += 1;
    var n = 32 - zt(t) + u;
    if (30 < n) {
      var i = u - u % 5;
      n = (a & (1 << i) - 1).toString(32), a >>= i, u -= i, ae = 1 << 32 - zt(t) + u | e << u | a, ue = n + l;
    } else
      ae = 1 << n | e << u | a, ue = l;
  }
  function wn(l) {
    l.return !== null && (je(l, 1), Gr(l, 1, 0));
  }
  function zc(l) {
    for (; l === Zn; )
      Zn = Ja[--Fa], Ja[Fa] = null, Qu = Ja[--Fa], Ja[Fa] = null;
    for (; l === qe; )
      qe = Xt[--Vt], Xt[Vt] = null, ue = Xt[--Vt], Xt[Vt] = null, ae = Xt[--Vt], Xt[Vt] = null;
  }
  function Qr(l, t) {
    Xt[Vt++] = ae, Xt[Vt++] = ue, Xt[Vt++] = qe, ae = t.id, ue = t.overflow, qe = l;
  }
  var Jl = null, pl = null, W = !1, He = null, Lt = !1, Ac = Error(y(519));
  function Be(l) {
    var t = Error(
      y(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Xu(Qt(t, l)), Ac;
  }
  function Xr(l) {
    var t = l.stateNode, e = l.type, a = l.memoizedProps;
    switch (t[Wl] = l, t[yt] = a, e) {
      case "dialog":
        I("cancel", t), I("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        I("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < rn.length; e++)
          I(rn[e], t);
        break;
      case "source":
        I("error", t);
        break;
      case "img":
      case "image":
      case "link":
        I("error", t), I("load", t);
        break;
      case "details":
        I("toggle", t);
        break;
      case "input":
        I("invalid", t), Pf(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        I("invalid", t);
        break;
      case "textarea":
        I("invalid", t), tr(t, a.value, a.defaultValue, a.children);
    }
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || a.suppressHydrationWarning === !0 || fm(t.textContent, e) ? (a.popover != null && (I("beforetoggle", t), I("toggle", t)), a.onScroll != null && I("scroll", t), a.onScrollEnd != null && I("scrollend", t), a.onClick != null && (t.onclick = ee), t = !0) : t = !1, t || Be(l, !0);
  }
  function Kn(l) {
    for (Jl = l.return; Jl; )
      switch (Jl.tag) {
        case 5:
        case 31:
        case 13:
          Lt = !1;
          return;
        case 27:
        case 3:
          Lt = !0;
          return;
        default:
          Jl = Jl.return;
      }
  }
  function $a(l) {
    if (l !== Jl) return !1;
    if (!W) return Kn(l), W = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || uf(l.type, l.memoizedProps)), e = !e), e && pl && Be(l), Kn(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(y(317));
      pl = Am(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(y(317));
      pl = Am(l);
    } else
      t === 27 ? (t = pl, Pe(l.type) ? (l = hf, hf = null, pl = l) : pl = t) : pl = Jl ? wt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function ma() {
    pl = Jl = null, W = !1;
  }
  function Oc() {
    var l = He;
    return l !== null && (jt === null ? jt = l : jt.push.apply(
      jt,
      l
    ), He = null), l;
  }
  function Xu(l) {
    He === null ? He = [l] : He.push(l);
  }
  var Dc = ct(null), ha = null, xe = null;
  function Ye(l, t, e) {
    vl(Dc, t._currentValue), t._currentValue = e;
  }
  function Te(l) {
    l._currentValue = Dc.current, Ul(Dc);
  }
  function Jn(l, t, e) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === e) break;
      l = l.return;
    }
  }
  function Mc(l, t, e, a) {
    var u = l.child;
    for (u !== null && (u.return = l); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var s = n;
          n = u;
          for (var f = 0; f < t.length; f++)
            if (s.context === t[f]) {
              n.lanes |= e, s = n.alternate, s !== null && (s.lanes |= e), Jn(
                n.return,
                e,
                l
              ), a || (i = null);
              break l;
            }
          n = s.next;
        }
      } else if (u.tag === 18) {
        if (i = u.return, i === null) throw Error(y(341));
        i.lanes |= e, n = i.alternate, n !== null && (n.lanes |= e), Jn(i, e, l), i = null;
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null ? (u.lanes |= e, i = u.alternate, i !== null && (i.lanes |= e), Jn(
          u.return,
          e,
          l
        ), i = u.child, i = i !== null ? i.sibling : null) : i = u.child;
      if (i !== null) i.return = u;
      else
        for (i = u; i !== null; ) {
          if (i === l) {
            i = null;
            break;
          }
          if (u = i.sibling, u !== null) {
            u.return = i.return, i = u;
            break;
          }
          i = i.return;
        }
      u = i;
    }
  }
  function va(l, t, e, a) {
    l = null;
    for (var u = t, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var i = u.alternate;
        if (i === null) throw Error(y(387));
        if (i = i.memoizedProps, i !== null) {
          var s = u.type;
          Ot(u.pendingProps.value, i.value) || (l !== null ? l.push(s) : l = [s]);
        }
      } else if (u === Ma.current) {
        if (i = u.alternate, i === null) throw Error(y(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (l !== null ? l.push(ju) : l = [ju]);
      }
      u = u.return;
    }
    return l !== null && Mc(
      t,
      l,
      e,
      a
    ), t.flags |= 262144, l !== null;
  }
  function Fn(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!Ot(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function ya(l) {
    ha = l, xe = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function kl(l) {
    return Vr(ha, l);
  }
  function $n(l, t) {
    return ha === null && ya(l), Vr(l, t);
  }
  function Vr(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, xe === null) {
      if (l === null) throw Error(y(308));
      xe = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else xe = xe.next = t;
    return e;
  }
  var pv = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(e, a) {
        l.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(e) {
        return e();
      });
    };
  }, Ev = p.unstable_scheduleCallback, Nv = p.unstable_NormalPriority, Bl = {
    $$typeof: hl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Cc() {
    return {
      controller: new pv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Vu(l) {
    l.refCount--, l.refCount === 0 && Ev(Nv, function() {
      l.controller.abort();
    });
  }
  function Lr(l, t) {
    if ((l.pendingLanes & 4194048) !== 0) {
      var e = l.transitionTypes;
      for (e === null && (e = l.transitionTypes = []), l = 0; l < t.length; l++) {
        var a = t[l];
        e.indexOf(a) === -1 && e.push(a);
      }
    }
  }
  var Lu = null;
  function zv(l) {
    var t = l.transitionTypes;
    return l.transitionTypes = null, t;
  }
  var Zu = null, Rc = 0, ga = 0, Wa = null;
  function Av(l, t) {
    if (Zu === null) {
      var e = Zu = [];
      Rc = 0, ga = $s(), Wa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return Rc++, t.then(Zr, Zr), t;
  }
  function Zr() {
    if (--Rc === 0 && (Lu = null, Zu !== null)) {
      Wa !== null && (Wa.status = "fulfilled");
      var l = Zu;
      Zu = null, ga = 0, Wa = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Ov(l, t) {
    var e = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        e.push(u);
      }
    };
    return l.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var u = 0; u < e.length; u++) (0, e[u])(t);
      },
      function(u) {
        for (a.status = "rejected", a.reason = u, u = 0; u < e.length; u++)
          (0, e[u])(void 0);
      }
    ), a;
  }
  var wr = A.S;
  A.S = function(l, t) {
    if (Yd = Et(), typeof t == "object" && t !== null && typeof t.then == "function" && Av(l, t), Lu !== null)
      for (var e = hu; e !== null; )
        Lr(e, Lu), e = e.next;
    if (e = l.types, e !== null) {
      for (var a = hu; a !== null; )
        Lr(a, e), a = a.next;
      if (ga !== 0) {
        a = Lu, a === null && (a = Lu = []);
        for (var u = 0; u < e.length; u++) {
          var n = e[u];
          a.indexOf(n) === -1 && a.push(n);
        }
      }
    }
    wr !== null && wr(l, t);
  };
  var Sa = ct(null);
  function Uc() {
    var l = Sa.current;
    return l !== null ? l : Tl.pooledCache;
  }
  function Wn(l, t) {
    t === null ? vl(Sa, Sa.current) : vl(Sa, t.pool);
  }
  function Kr() {
    var l = Uc();
    return l === null ? null : { parent: Bl._currentValue, pool: l };
  }
  var ka = Error(y(460)), qc = Error(y(474)), kn = Error(y(542)), In = { then: function() {
  } };
  function Jr(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Fr(l, t, e) {
    switch (e = l[e], e === void 0 ? l.push(t) : e !== t && (t.then(ee, ee), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Wr(l), l === void 0 && !("reason" in t) ? Error(y(600)) : l;
      default:
        if (typeof t.status == "string") t.then(ee, ee);
        else {
          if (l = Tl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(y(482));
          l = t, l.status = "pending", l.then(
            function(a) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, Wr(l), l;
        }
        throw ja = t, ka;
    }
  }
  function ba(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (ja = e, ka) : e;
    }
  }
  var ja = null;
  function $r() {
    if (ja === null) throw Error(y(459));
    var l = ja;
    return ja = null, l;
  }
  function Wr(l) {
    if (l === ka || l === kn)
      throw Error(y(483));
  }
  var Ia = null, wu = 0;
  function Pn(l) {
    var t = wu;
    return wu += 1, Ia === null && (Ia = []), Fr(Ia, l, t);
  }
  function Ge(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function li(l, t) {
    throw t.$$typeof === P ? Error(y(525)) : (l = Object.prototype.toString.call(t), Error(
      y(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function kr(l) {
    function t(h, o) {
      if (l) {
        var g = h.deletions;
        g === null ? (h.deletions = [o], h.flags |= 16) : g.push(o);
      }
    }
    function e(h, o) {
      if (!l) return null;
      for (; o !== null; )
        t(h, o), o = o.sibling;
      return null;
    }
    function a(h) {
      for (var o = /* @__PURE__ */ new Map(); h !== null; )
        h.key === null ? o.set(h.index, h) : o.set(h.key, h), h = h.sibling;
      return o;
    }
    function u(h, o) {
      return h = be(h, o), h.index = 0, h.sibling = null, h;
    }
    function n(h, o, g) {
      return h.index = g, l ? (g = h.alternate, g !== null ? (g = g.index, g < o ? (h.flags |= 2, o) : g) : (h.flags |= 134217730, o)) : (h.flags |= 1048576, o);
    }
    function i(h) {
      return l && h.alternate === null && (h.flags |= 134217730), h;
    }
    function s(h, o, g, x) {
      return o === null || o.tag !== 6 ? (o = Ec(g, h.mode, x), o.return = h, o) : (o = u(o, g), o.return = h, o);
    }
    function f(h, o, g, x) {
      var O = g.type;
      return O === Ll ? (h = b(
        h,
        o,
        g.props.children,
        x,
        g.key
      ), Ge(h, g), h) : o !== null && (o.elementType === O || typeof O == "object" && O !== null && O.$$typeof === nl && ba(O) === o.type) ? (o = u(o, g.props), Ge(o, g), o.return = h, o) : (o = Ln(
        g.type,
        g.key,
        g.props,
        null,
        h.mode,
        x
      ), Ge(o, g), o.return = h, o);
    }
    function v(h, o, g, x) {
      return o === null || o.tag !== 4 || o.stateNode.containerInfo !== g.containerInfo || o.stateNode.implementation !== g.implementation ? (o = Nc(g, h.mode, x), o.return = h, o) : (o = u(o, g.children || []), o.return = h, o);
    }
    function b(h, o, g, x, O) {
      return o === null || o.tag !== 7 ? (o = da(
        g,
        h.mode,
        x,
        O
      ), o.return = h, o) : (o = u(o, g), o.return = h, o);
    }
    function T(h, o, g) {
      if (typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint")
        return o = Ec(
          "" + o,
          h.mode,
          g
        ), o.return = h, o;
      if (typeof o == "object" && o !== null) {
        switch (o.$$typeof) {
          case Tt:
            return g = Ln(
              o.type,
              o.key,
              o.props,
              null,
              h.mode,
              g
            ), Ge(g, o), g.return = h, g;
          case ft:
            return o = Nc(
              o,
              h.mode,
              g
            ), o.return = h, o;
          case nl:
            return o = ba(o), T(h, o, g);
        }
        if (il(o) || U(o))
          return o = da(
            o,
            h.mode,
            g,
            null
          ), o.return = h, o;
        if (typeof o.then == "function")
          return T(h, Pn(o), g);
        if (o.$$typeof === hl)
          return T(
            h,
            $n(h, o),
            g
          );
        li(h, o);
      }
      return null;
    }
    function m(h, o, g, x) {
      var O = o !== null ? o.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
        return O !== null ? null : s(h, o, "" + g, x);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case Tt:
            return g.key === O ? f(h, o, g, x) : null;
          case ft:
            return g.key === O ? v(h, o, g, x) : null;
          case nl:
            return g = ba(g), m(h, o, g, x);
        }
        if (il(g) || U(g))
          return O !== null ? null : b(h, o, g, x, null);
        if (typeof g.then == "function")
          return m(
            h,
            o,
            Pn(g),
            x
          );
        if (g.$$typeof === hl)
          return m(
            h,
            o,
            $n(h, g),
            x
          );
        li(h, g);
      }
      return null;
    }
    function S(h, o, g, x, O) {
      if (typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint")
        return h = h.get(g) || null, s(o, h, "" + x, O);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case Tt:
            return h = h.get(
              x.key === null ? g : x.key
            ) || null, f(o, h, x, O);
          case ft:
            return h = h.get(
              x.key === null ? g : x.key
            ) || null, v(o, h, x, O);
          case nl:
            return x = ba(x), S(
              h,
              o,
              g,
              x,
              O
            );
        }
        if (il(x) || U(x))
          return h = h.get(g) || null, b(o, h, x, O, null);
        if (typeof x.then == "function")
          return S(
            h,
            o,
            g,
            Pn(x),
            O
          );
        if (x.$$typeof === hl)
          return S(
            h,
            o,
            g,
            $n(o, x),
            O
          );
        li(o, x);
      }
      return null;
    }
    function N(h, o, g, x) {
      for (var O = null, el = null, H = o, V = o = 0, Ql = null; H !== null && V < g.length; V++) {
        H.index > V ? (Ql = H, H = null) : Ql = H.sibling;
        var ul = m(
          h,
          H,
          g[V],
          x
        );
        if (ul === null) {
          H === null && (H = Ql);
          break;
        }
        l && H && ul.alternate === null && t(h, H), o = n(ul, o, V), el === null ? O = ul : el.sibling = ul, el = ul, H = Ql;
      }
      if (V === g.length)
        return e(h, H), W && je(h, V), O;
      if (H === null) {
        for (; V < g.length; V++)
          H = T(h, g[V], x), H !== null && (o = n(
            H,
            o,
            V
          ), el === null ? O = H : el.sibling = H, el = H);
        return W && je(h, V), O;
      }
      for (H = a(H); V < g.length; V++)
        Ql = S(
          H,
          h,
          V,
          g[V],
          x
        ), Ql !== null && (l && (ul = Ql.alternate, ul !== null && H.delete(ul.key === null ? V : ul.key)), o = n(
          Ql,
          o,
          V
        ), el === null ? O = Ql : el.sibling = Ql, el = Ql);
      return l && H.forEach(function(ua) {
        return t(h, ua);
      }), W && je(h, V), O;
    }
    function D(h, o, g, x) {
      if (g == null) throw Error(y(151));
      for (var O = null, el = null, H = o, V = o = 0, Ql = null, ul = g.next(); H !== null && !ul.done; V++, ul = g.next()) {
        H.index > V ? (Ql = H, H = null) : Ql = H.sibling;
        var ua = m(h, H, ul.value, x);
        if (ua === null) {
          H === null && (H = Ql);
          break;
        }
        l && H && ua.alternate === null && t(h, H), o = n(ua, o, V), el === null ? O = ua : el.sibling = ua, el = ua, H = Ql;
      }
      if (ul.done)
        return e(h, H), W && je(h, V), O;
      if (H === null) {
        for (; !ul.done; V++, ul = g.next())
          ul = T(h, ul.value, x), ul !== null && (o = n(ul, o, V), el === null ? O = ul : el.sibling = ul, el = ul);
        return W && je(h, V), O;
      }
      for (H = a(H); !ul.done; V++, ul = g.next())
        ul = S(H, h, V, ul.value, x), ul !== null && (l && (Ql = ul.alternate, Ql !== null && H.delete(
          Ql.key === null ? V : Ql.key
        )), o = n(ul, o, V), el === null ? O = ul : el.sibling = ul, el = ul);
      return l && H.forEach(function(fy) {
        return t(h, fy);
      }), W && je(h, V), O;
    }
    function K(h, o, g, x) {
      if (typeof g == "object" && g !== null && g.type === Ll && g.key === null && g.props.ref === void 0 && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case Tt:
            l: {
              for (var O = g.key; o !== null; ) {
                if (o.key === O) {
                  if (O = g.type, O === Ll) {
                    if (o.tag === 7) {
                      e(
                        h,
                        o.sibling
                      ), x = u(
                        o,
                        g.props.children
                      ), Ge(x, g), x.return = h, h = x;
                      break l;
                    }
                  } else if (o.elementType === O || typeof O == "object" && O !== null && O.$$typeof === nl && ba(O) === o.type) {
                    e(
                      h,
                      o.sibling
                    ), x = u(o, g.props), Ge(x, g), x.return = h, h = x;
                    break l;
                  }
                  e(h, o);
                  break;
                } else t(h, o);
                o = o.sibling;
              }
              g.type === Ll ? (x = da(
                g.props.children,
                h.mode,
                x,
                g.key
              ), Ge(x, g), x.return = h, h = x) : (x = Ln(
                g.type,
                g.key,
                g.props,
                null,
                h.mode,
                x
              ), Ge(x, g), x.return = h, h = x);
            }
            return i(h);
          case ft:
            l: {
              for (O = g.key; o !== null; ) {
                if (o.key === O)
                  if (o.tag === 4 && o.stateNode.containerInfo === g.containerInfo && o.stateNode.implementation === g.implementation) {
                    e(
                      h,
                      o.sibling
                    ), x = u(o, g.children || []), x.return = h, h = x;
                    break l;
                  } else {
                    e(h, o);
                    break;
                  }
                else t(h, o);
                o = o.sibling;
              }
              x = Nc(g, h.mode, x), x.return = h, h = x;
            }
            return i(h);
          case nl:
            return g = ba(g), K(
              h,
              o,
              g,
              x
            );
        }
        if (il(g))
          return N(
            h,
            o,
            g,
            x
          );
        if (U(g)) {
          if (O = U(g), typeof O != "function") throw Error(y(150));
          return g = O.call(g), D(
            h,
            o,
            g,
            x
          );
        }
        if (typeof g.then == "function")
          return K(
            h,
            o,
            Pn(g),
            x
          );
        if (g.$$typeof === hl)
          return K(
            h,
            o,
            $n(h, g),
            x
          );
        li(h, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint" ? (g = "" + g, o !== null && o.tag === 6 ? (e(h, o.sibling), x = u(o, g), x.return = h, h = x) : (e(h, o), x = Ec(g, h.mode, x), x.return = h, h = x), i(h)) : e(h, o);
    }
    return function(h, o, g, x) {
      try {
        wu = 0;
        var O = K(
          h,
          o,
          g,
          x
        );
        return Ia = null, O;
      } catch (H) {
        if (H === ka || H === kn) throw H;
        var el = gt(29, H, null, h.mode);
        return el.lanes = x, el.return = h, el;
      }
    };
  }
  var xa = kr(!0), Ir = kr(!1), Qe = !1;
  function Hc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Bc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function Xe(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Ve(l, t, e) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (fl & 2) !== 0) {
      var u = a.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), a.pending = t, t = Vn(l), qr(l, null, e), t;
    }
    return Xn(l, a, t, e), Vn(l);
  }
  function Ku(l, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, Gf(l, e);
    }
  }
  function Yc(l, t) {
    var e = l.updateQueue, a = l.alternate;
    if (a !== null && (a = a.updateQueue, e === a)) {
      var u = null, n = null;
      if (e = e.firstBaseUpdate, e !== null) {
        do {
          var i = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null
          };
          n === null ? u = n = i : n = n.next = i, e = e.next;
        } while (e !== null);
        n === null ? u = n = t : n = n.next = t;
      } else u = n = t;
      e = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks
      }, l.updateQueue = e;
      return;
    }
    l = e.lastBaseUpdate, l === null ? e.firstBaseUpdate = t : l.next = t, e.lastBaseUpdate = t;
  }
  var Gc = !1;
  function Ju() {
    if (Gc) {
      var l = Wa;
      if (l !== null) throw l;
    }
  }
  function Fu(l, t, e, a) {
    Gc = !1;
    var u = l.updateQueue;
    Qe = !1;
    var n = u.firstBaseUpdate, i = u.lastBaseUpdate, s = u.shared.pending;
    if (s !== null) {
      u.shared.pending = null;
      var f = s, v = f.next;
      f.next = null, i === null ? n = v : i.next = v, i = f;
      var b = l.alternate;
      b !== null && (b = b.updateQueue, s = b.lastBaseUpdate, s !== i && (s === null ? b.firstBaseUpdate = v : s.next = v, b.lastBaseUpdate = f));
    }
    if (n !== null) {
      var T = u.baseState;
      i = 0, b = v = f = null, s = n;
      do {
        var m = s.lane & -536870913, S = m !== s.lane;
        if (S ? (tl & m) === m : (a & m) === m) {
          m !== 0 && m === ga && (Gc = !0), b !== null && (b = b.next = {
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: null,
            next: null
          });
          l: {
            var N = l, D = s;
            m = t;
            var K = e;
            switch (D.tag) {
              case 1:
                if (N = D.payload, typeof N == "function") {
                  T = N.call(K, T, m);
                  break l;
                }
                T = N;
                break l;
              case 3:
                N.flags = N.flags & -65537 | 128;
              case 0:
                if (N = D.payload, m = typeof N == "function" ? N.call(K, T, m) : N, m == null) break l;
                T = F({}, T, m);
                break l;
              case 2:
                Qe = !0;
            }
          }
          m = s.callback, m !== null && (l.flags |= 64, S && (l.flags |= 8192), S = u.callbacks, S === null ? u.callbacks = [m] : S.push(m));
        } else
          S = {
            lane: m,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          }, b === null ? (v = b = S, f = T) : b = b.next = S, i |= m;
        if (s = s.next, s === null) {
          if (s = u.shared.pending, s === null)
            break;
          S = s, s = S.next, S.next = null, u.lastBaseUpdate = S, u.shared.pending = null;
        }
      } while (!0);
      b === null && (f = T), u.baseState = f, u.firstBaseUpdate = v, u.lastBaseUpdate = b, n === null && (u.shared.lanes = 0), $e |= i, l.lanes = i, l.memoizedState = T;
    }
  }
  function Pr(l, t) {
    if (typeof l != "function")
      throw Error(y(191, l));
    l.call(t);
  }
  function lo(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++)
        Pr(e[l], t);
  }
  var Le = ct(null), ti = ct(0);
  function to(l, t) {
    l = ze, vl(ti, l), vl(Le, t), ze = l | t.baseLanes;
  }
  function Qc() {
    vl(ti, ze), vl(Le, Le.current);
  }
  function Xc() {
    ze = ti.current, Ul(Le), Ul(ti);
  }
  var Il = ct(null), st = null;
  function Ze(l) {
    var t = l.alternate;
    vl(Pl, Pl.current & 1), vl(Il, l), st === null && (t === null || Le.current !== null || t.memoizedState !== null) && (st = l);
  }
  function Vc(l) {
    vl(Pl, Pl.current), vl(Il, l), st === null && (st = l);
  }
  function eo(l) {
    l.tag === 22 ? (vl(Pl, Pl.current), vl(Il, l), st === null && (st = l)) : we();
  }
  function we() {
    vl(Pl, Pl.current), vl(Il, Il.current);
  }
  function Dt(l) {
    Ul(Il), st === l && (st = null), Ul(Pl);
  }
  var Pl = ct(0);
  function $u(l, t) {
    vl(Il, Il.current), vl(Pl, t);
  }
  function Lc(l) {
    Ul(Pl), Ul(Il), st === l && (st = null);
  }
  function ei(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || df(e) || mf(e)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var _e = 0, w = null, jl = null, Yl = null, ai = !1, Pa = !1, Ta = !1, ui = 0, Wu = 0, lu = null, Dv = 0;
  function Cl() {
    throw Error(y(321));
  }
  function Zc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!Ot(l[e], t[e])) return !1;
    return !0;
  }
  function wc(l, t, e, a, u, n) {
    return _e = n, w = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, A.H = l === null || l.memoizedState === null ? Qo : Xo, Ta = !1, n = e(a, u), Ta = !1, Pa && (n = uo(
      t,
      e,
      a,
      u
    )), ao(l), n;
  }
  function ao(l) {
    A.H = oi;
    var t = jl !== null && jl.next !== null;
    if (_e = 0, Yl = jl = w = null, ai = !1, Wu = 0, lu = null, t) throw Error(y(300));
    l === null || Gl || (l = l.dependencies, l !== null && Fn(l) && (Gl = !0));
  }
  function uo(l, t, e, a) {
    w = l;
    var u = 0;
    do {
      if (Pa && (lu = null), Wu = 0, Pa = !1, 25 <= u) throw Error(y(301));
      if (u += 1, Yl = jl = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      A.H = Yv, n = t(e, a);
    } while (Pa);
    return n;
  }
  function Mv() {
    var l = A.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? ku(t) : t, l = l.useState()[0], (jl !== null ? jl.memoizedState : null) !== l && (w.flags |= 1024), t;
  }
  function Kc() {
    var l = ui !== 0;
    return ui = 0, l;
  }
  function Jc(l, t, e) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~e;
  }
  function Fc(l) {
    if (ai) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      ai = !1;
    }
    _e = 0, Yl = jl = w = null, Pa = !1, Wu = ui = 0, lu = null;
  }
  function mt() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Yl === null ? w.memoizedState = Yl = l : Yl = Yl.next = l, Yl;
  }
  function ql() {
    if (jl === null) {
      var l = w.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = jl.next;
    var t = Yl === null ? w.memoizedState : Yl.next;
    if (t !== null)
      Yl = t, jl = l;
    else {
      if (l === null)
        throw w.alternate === null ? Error(y(467)) : Error(y(310));
      jl = l, l = {
        memoizedState: jl.memoizedState,
        baseState: jl.baseState,
        baseQueue: jl.baseQueue,
        queue: jl.queue,
        next: null
      }, Yl === null ? w.memoizedState = Yl = l : Yl = Yl.next = l;
    }
    return Yl;
  }
  function ni() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ku(l) {
    var t = Wu;
    return Wu += 1, lu === null && (lu = []), l = Fr(lu, l, t), t = w, (Yl === null ? t.memoizedState : Yl.next) === null && (t = t.alternate, A.H = t === null || t.memoizedState === null ? Qo : Xo), l;
  }
  function ii(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return ku(l);
      if (l.$$typeof === _) return;
      if (l.$$typeof === hl) return kl(l);
    }
    throw Error(y(438, String(l)));
  }
  function $c(l) {
    var t = null, e = w.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var a = w.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = ni(), w.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), a = 0; a < l; a++)
        e[a] = Bt;
    return t.index++, e;
  }
  function pe(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function ci(l) {
    var t = ql();
    return Wc(t, jl, l);
  }
  function Wc(l, t, e) {
    var a = l.queue;
    if (a === null) throw Error(y(311));
    a.lastRenderedReducer = e;
    var u = l.baseQueue, n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var i = u.next;
        u.next = n.next, n.next = i;
      }
      t.baseQueue = u = n, a.pending = null;
    }
    if (n = l.baseState, u === null) l.memoizedState = n;
    else {
      t = u.next;
      var s = i = null, f = null, v = t, b = !1;
      do {
        var T = v.lane & -536870913;
        if (T !== v.lane ? (tl & T) === T : (_e & T) === T) {
          var m = v.revertLane;
          if (m === 0)
            f !== null && (f = f.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: v.action,
              hasEagerState: v.hasEagerState,
              eagerState: v.eagerState,
              next: null
            }), T === ga && (b = !0);
          else if ((_e & m) === m) {
            v = v.next, m === ga && (b = !0);
            continue;
          } else
            T = {
              lane: 0,
              revertLane: v.revertLane,
              gesture: null,
              action: v.action,
              hasEagerState: v.hasEagerState,
              eagerState: v.eagerState,
              next: null
            }, f === null ? (s = f = T, i = n) : f = f.next = T, w.lanes |= m, $e |= m;
          T = v.action, Ta && e(n, T), n = v.hasEagerState ? v.eagerState : e(n, T);
        } else
          m = {
            lane: T,
            revertLane: v.revertLane,
            gesture: v.gesture,
            action: v.action,
            hasEagerState: v.hasEagerState,
            eagerState: v.eagerState,
            next: null
          }, f === null ? (s = f = m, i = n) : f = f.next = m, w.lanes |= T, $e |= T;
        v = v.next;
      } while (v !== null && v !== t);
      if (f === null ? i = n : f.next = s, !Ot(n, l.memoizedState) && (Gl = !0, b && (e = Wa, e !== null)))
        throw e;
      l.memoizedState = n, l.baseState = i, l.baseQueue = f, a.lastRenderedState = n;
    }
    return u === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function kc(l) {
    var t = ql(), e = t.queue;
    if (e === null) throw Error(y(311));
    e.lastRenderedReducer = l;
    var a = e.dispatch, u = e.pending, n = t.memoizedState;
    if (u !== null) {
      e.pending = null;
      var i = u = u.next;
      do
        n = l(n, i.action), i = i.next;
      while (i !== u);
      Ot(n, t.memoizedState) || (Gl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), e.lastRenderedState = n;
    }
    return [n, a];
  }
  function no(l, t, e) {
    var a = w, u = ql(), n = W;
    if (n) {
      if (e === void 0) throw Error(y(407));
      e = e();
    } else e = t();
    var i = !Ot(
      (jl || u).memoizedState,
      e
    );
    if (i && (u.memoizedState = e, Gl = !0), u = u.queue, ls(so.bind(null, a, u, l), [
      l
    ]), l = u.getSnapshot !== t || i || Yl !== null && (Yl.memoizedState.tag & 1) !== 0, tu(
      l ? 9 : 8,
      { destroy: void 0 },
      co.bind(null, a, u, e, t),
      null
    ), l) {
      if (a.flags |= 2048, Tl === null) throw Error(y(349));
      n || (_e & 127) !== 0 || io(a, t, e);
    }
    return e;
  }
  function io(l, t, e) {
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = w.updateQueue, t === null ? (t = ni(), w.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
  }
  function co(l, t, e, a) {
    t.value = e, t.getSnapshot = a, fo(t) && ro(l);
  }
  function so(l, t, e) {
    return e(function() {
      fo(t) && ro(l);
    });
  }
  function fo(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !Ot(l, e);
    } catch {
      return !0;
    }
  }
  function ro(l) {
    var t = oa(l, 2);
    t !== null && xt(t, l, 2);
  }
  function Ic(l) {
    var t = mt();
    if (typeof l == "function") {
      var e = l;
      if (l = e(), Ta) {
        Ce(!0);
        try {
          e();
        } finally {
          Ce(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: pe,
      lastRenderedState: l
    }, t;
  }
  function oo(l, t, e, a) {
    return l.baseState = e, Wc(
      l,
      jl,
      typeof a == "function" ? a : pe
    );
  }
  function Cv(l, t, e, a, u) {
    if (ri(l)) throw Error(y(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: u,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(i) {
          n.listeners.push(i);
        }
      };
      A.T !== null ? e(!0) : n.isTransition = !1, a(n), e = t.pending, e === null ? (n.next = t.pending = n, mo(t, n)) : (n.next = e.next, t.pending = e.next = n);
    }
  }
  function mo(l, t) {
    var e = t.action, a = t.payload, u = l.state;
    if (t.isTransition) {
      var n = A.T, i = {};
      i.types = n !== null ? n.types : null, A.T = i;
      try {
        var s = e(u, a), f = A.S;
        f !== null && f(i, s), ho(l, t, s);
      } catch (v) {
        Pc(l, t, v);
      } finally {
        n !== null && i.types !== null && (n.types = i.types), A.T = n;
      }
    } else
      try {
        n = e(u, a), ho(l, t, n);
      } catch (v) {
        Pc(l, t, v);
      }
  }
  function ho(l, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(a) {
        vo(l, t, a);
      },
      function(a) {
        return Pc(l, t, a);
      }
    ) : vo(l, t, e);
  }
  function vo(l, t, e) {
    t.status = "fulfilled", t.value = e, yo(t), l.state = e, t = l.pending, t !== null && (e = t.next, e === t ? l.pending = null : (e = e.next, t.next = e, mo(l, e)));
  }
  function Pc(l, t, e) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = e, yo(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function yo(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function go(l, t) {
    return t;
  }
  function So(l, t) {
    if (W) {
      var e = Tl.formState;
      if (e !== null) {
        l: {
          var a = w;
          if (W) {
            if (pl) {
              t: {
                for (var u = pl, n = Lt; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break t;
                  }
                  if (u = wt(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break t;
                  }
                }
                n = u.data, u = n === "F!" || n === "F" ? u : null;
              }
              if (u) {
                pl = wt(
                  u.nextSibling
                ), a = u.data === "F!";
                break l;
              }
            }
            Be(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return e = mt(), e.memoizedState = e.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: go,
      lastRenderedState: t
    }, e.queue = a, e = Bo.bind(
      null,
      w,
      a
    ), a.dispatch = e, a = Ic(!1), n = ns.bind(
      null,
      w,
      !1,
      a.queue
    ), a = mt(), u = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = u, e = Cv.bind(
      null,
      w,
      u,
      n,
      e
    ), u.dispatch = e, a.memoizedState = l, [t, e, !1];
  }
  function bo(l) {
    var t = ql();
    return jo(t, jl, l);
  }
  function jo(l, t, e) {
    if (t = Wc(
      l,
      t,
      go
    )[0], l = ci(pe)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = ku(t);
      } catch (i) {
        throw i === ka ? kn : i;
      }
    else a = t;
    t = ql();
    var u = t.queue, n = u.dispatch;
    return e !== t.memoizedState && (w.flags |= 2048, tu(
      9,
      { destroy: void 0 },
      Rv.bind(null, u, e),
      null
    )), [a, n, l];
  }
  function Rv(l, t) {
    l.action = t;
  }
  function xo(l) {
    var t = ql(), e = jl;
    if (e !== null)
      return jo(t, e, l);
    ql(), t = t.memoizedState, e = ql();
    var a = e.queue.dispatch;
    return e.memoizedState = l, [t, a, !1];
  }
  function tu(l, t, e, a) {
    return l = { tag: l, create: e, deps: a, inst: t, next: null }, t = w.updateQueue, t === null && (t = ni(), w.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (a = e.next, e.next = l, l.next = a, t.lastEffect = l), l;
  }
  function To() {
    return ql().memoizedState;
  }
  function si(l, t, e, a) {
    var u = mt();
    w.flags |= l, u.memoizedState = tu(
      1 | t,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function fi(l, t, e, a) {
    var u = ql();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    jl !== null && a !== null && Zc(a, jl.memoizedState.deps) ? u.memoizedState = tu(t, n, e, a) : (w.flags |= l, u.memoizedState = tu(
      1 | t,
      n,
      e,
      a
    ));
  }
  function _o(l, t) {
    si(8390656, 8, l, t);
  }
  function ls(l, t) {
    fi(2048, 8, l, t);
  }
  function Uv(l) {
    w.flags |= 4;
    var t = w.updateQueue;
    if (t === null)
      t = ni(), w.updateQueue = t, t.events = [l];
    else {
      var e = t.events;
      e === null ? t.events = [l] : e.push(l);
    }
  }
  function po(l) {
    var t = ql().memoizedState;
    return Uv({ ref: t, nextImpl: l }), function() {
      if ((fl & 2) !== 0) throw Error(y(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Eo(l, t) {
    return fi(4, 2, l, t);
  }
  function No(l, t) {
    return fi(4, 4, l, t);
  }
  function zo(l, t) {
    if (typeof t == "function") {
      l = l();
      var e = t(l);
      return function() {
        typeof e == "function" ? e() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function Ao(l, t, e) {
    e = e != null ? e.concat([l]) : null, fi(4, 4, zo.bind(null, t, l), e);
  }
  function ts() {
  }
  function Oo(l, t) {
    var e = ql();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && Zc(t, a[1]) ? a[0] : (e.memoizedState = [l, t], l);
  }
  function Do(l, t) {
    var e = ql();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && Zc(t, a[1]))
      return a[0];
    if (a = l(), Ta) {
      Ce(!0);
      try {
        l();
      } finally {
        Ce(!1);
      }
    }
    return e.memoizedState = [a, t], a;
  }
  function es(l, t, e) {
    return e === void 0 || (_e & 1073741824) !== 0 && (tl & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = e, l = Qd(), w.lanes |= l, $e |= l, e);
  }
  function Mo(l, t, e, a) {
    return Ot(e, t) ? e : Le.current !== null ? (l = es(l, e, a), Ot(l, t) || (Gl = !0), l) : (_e & 106) === 0 || (_e & 1073741824) !== 0 && (tl & 261930) === 0 ? (Gl = !0, l.memoizedState = e) : (l = Qd(), w.lanes |= l, $e |= l, t);
  }
  function Co(l, t, e, a, u) {
    var n = X.p;
    X.p = n !== 0 && 8 > n ? n : 8;
    var i = A.T, s = {};
    s.types = i !== null ? i.types : null, A.T = s, ns(l, !1, t, e);
    try {
      var f = u(), v = A.S;
      if (v !== null && v(s, f), f !== null && typeof f == "object" && typeof f.then == "function") {
        var b = Ov(
          f,
          a
        );
        Iu(
          l,
          t,
          b,
          Ut(l)
        );
      } else
        Iu(
          l,
          t,
          a,
          Ut(l)
        );
    } catch (T) {
      Iu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: T },
        Ut()
      );
    } finally {
      X.p = n, i !== null && s.types !== null && (i.types = s.types), A.T = i;
    }
  }
  function qv() {
  }
  function as(l, t, e, a) {
    if (l.tag !== 5) throw Error(y(476));
    var u = Ro(l).queue;
    Co(
      l,
      u,
      t,
      pt,
      e === null ? qv : function() {
        return Uo(l), e(a);
      }
    );
  }
  function Ro(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: pt,
      baseState: pt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: pe,
        lastRenderedState: pt
      },
      next: null
    };
    var e = {};
    return t.next = {
      memoizedState: e,
      baseState: e,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: pe,
        lastRenderedState: e
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function Uo(l) {
    var t = Ro(l);
    t.next === null && (t = l.alternate.memoizedState), Iu(
      l,
      t.next.queue,
      {},
      Ut()
    );
  }
  function us() {
    return kl(ju);
  }
  function qo() {
    return ql().memoizedState;
  }
  function Ho() {
    return ql().memoizedState;
  }
  function Hv(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = Ut();
          l = Xe(e);
          var a = Ve(t, l, e);
          a !== null && (xt(a, t, e), Ku(a, t, e)), t = { cache: Cc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Bv(l, t, e) {
    var a = Ut();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ri(l) ? Yo(t, e) : (e = _c(l, t, e, a), e !== null && (xt(e, l, a), Go(e, t, a)));
  }
  function Bo(l, t, e) {
    var a = Ut();
    Iu(l, t, e, a);
  }
  function Iu(l, t, e, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ri(l)) Yo(t, u);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var i = t.lastRenderedState, s = n(i, e);
          if (u.hasEagerState = !0, u.eagerState = s, Ot(s, i))
            return Xn(l, t, u, 0), Tl === null && Qn(), !1;
        } catch {
        }
      if (e = _c(l, t, u, a), e !== null)
        return xt(e, l, a), Go(e, t, a), !0;
    }
    return !1;
  }
  function ns(l, t, e, a) {
    if (a = {
      lane: 2,
      revertLane: $s(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ri(l)) {
      if (t) throw Error(y(479));
    } else
      t = _c(
        l,
        e,
        a,
        2
      ), t !== null && xt(t, l, 2);
  }
  function ri(l) {
    var t = l.alternate;
    return l === w || t !== null && t === w;
  }
  function Yo(l, t) {
    Pa = ai = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function Go(l, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, Gf(l, e);
    }
  }
  var oi = {
    readContext: kl,
    use: ii,
    useCallback: Cl,
    useContext: Cl,
    useEffect: Cl,
    useImperativeHandle: Cl,
    useLayoutEffect: Cl,
    useInsertionEffect: Cl,
    useMemo: Cl,
    useReducer: Cl,
    useRef: Cl,
    useState: Cl,
    useDebugValue: Cl,
    useDeferredValue: Cl,
    useTransition: Cl,
    useSyncExternalStore: Cl,
    useId: Cl,
    useHostTransitionStatus: Cl,
    useFormState: Cl,
    useActionState: Cl,
    useOptimistic: Cl,
    useMemoCache: Cl,
    useCacheRefresh: Cl,
    useEffectEvent: Cl
  }, Qo = {
    readContext: kl,
    use: ii,
    useCallback: function(l, t) {
      return mt().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: kl,
    useEffect: _o,
    useImperativeHandle: function(l, t, e) {
      e = e != null ? e.concat([l]) : null, si(
        4194308,
        4,
        zo.bind(null, t, l),
        e
      );
    },
    useLayoutEffect: function(l, t) {
      return si(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      si(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var e = mt();
      t = t === void 0 ? null : t;
      var a = l();
      if (Ta) {
        Ce(!0);
        try {
          l();
        } finally {
          Ce(!1);
        }
      }
      return e.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, e) {
      var a = mt();
      if (e !== void 0) {
        var u = e(t);
        if (Ta) {
          Ce(!0);
          try {
            e(t);
          } finally {
            Ce(!1);
          }
        }
      } else u = t;
      return a.memoizedState = a.baseState = u, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: u
      }, a.queue = l, l = l.dispatch = Bv.bind(
        null,
        w,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = mt();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = Ic(l);
      var t = l.queue, e = Bo.bind(null, w, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: ts,
    useDeferredValue: function(l, t) {
      var e = mt();
      return es(e, l, t);
    },
    useTransition: function() {
      var l = Ic(!1);
      return l = Co.bind(
        null,
        w,
        l.queue,
        !0,
        !1
      ), mt().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var a = w, u = mt();
      if (W) {
        if (e === void 0)
          throw Error(y(407));
        e = e();
      } else {
        if (e = t(), Tl === null)
          throw Error(y(349));
        (tl & 127) !== 0 || io(a, t, e);
      }
      u.memoizedState = e;
      var n = { value: e, getSnapshot: t };
      return u.queue = n, _o(so.bind(null, a, n, l), [
        l
      ]), a.flags |= 2048, tu(
        9,
        { destroy: void 0 },
        co.bind(
          null,
          a,
          n,
          e,
          t
        ),
        null
      ), e;
    },
    useId: function() {
      var l = mt(), t = Tl.identifierPrefix;
      if (W) {
        var e = ue, a = ae;
        e = (a & ~(1 << 32 - zt(a) - 1)).toString(32) + e, t = "_" + t + "R_" + e, e = ui++, 0 < e && (t += "H" + e.toString(32)), t += "_";
      } else
        e = Dv++, t = "_" + t + "r_" + e.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: us,
    useFormState: So,
    useActionState: So,
    useOptimistic: function(l) {
      var t = mt();
      t.memoizedState = t.baseState = l;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = ns.bind(
        null,
        w,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: $c,
    useCacheRefresh: function() {
      return mt().memoizedState = Hv.bind(
        null,
        w
      );
    },
    useEffectEvent: function(l) {
      var t = mt(), e = { impl: l };
      return t.memoizedState = e, function() {
        if ((fl & 2) !== 0)
          throw Error(y(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, Xo = {
    readContext: kl,
    use: ii,
    useCallback: Oo,
    useContext: kl,
    useEffect: ls,
    useImperativeHandle: Ao,
    useInsertionEffect: Eo,
    useLayoutEffect: No,
    useMemo: Do,
    useReducer: ci,
    useRef: To,
    useState: function() {
      return ci(pe);
    },
    useDebugValue: ts,
    useDeferredValue: function(l, t) {
      var e = ql();
      return Mo(
        e,
        jl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = ci(pe)[0], t = ql().memoizedState;
      return [
        typeof l == "boolean" ? l : ku(l),
        t
      ];
    },
    useSyncExternalStore: no,
    useId: qo,
    useHostTransitionStatus: us,
    useFormState: bo,
    useActionState: bo,
    useOptimistic: function(l, t) {
      var e = ql();
      return oo(e, jl, l, t);
    },
    useMemoCache: $c,
    useCacheRefresh: Ho,
    useEffectEvent: po
  }, Yv = {
    readContext: kl,
    use: ii,
    useCallback: Oo,
    useContext: kl,
    useEffect: ls,
    useImperativeHandle: Ao,
    useInsertionEffect: Eo,
    useLayoutEffect: No,
    useMemo: Do,
    useReducer: kc,
    useRef: To,
    useState: function() {
      return kc(pe);
    },
    useDebugValue: ts,
    useDeferredValue: function(l, t) {
      var e = ql();
      return jl === null ? es(e, l, t) : Mo(
        e,
        jl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = kc(pe)[0], t = ql().memoizedState;
      return [
        typeof l == "boolean" ? l : ku(l),
        t
      ];
    },
    useSyncExternalStore: no,
    useId: qo,
    useHostTransitionStatus: us,
    useFormState: xo,
    useActionState: xo,
    useOptimistic: function(l, t) {
      var e = ql();
      return jl !== null ? oo(e, jl, l, t) : (e.baseState = l, [l, e.queue.dispatch]);
    },
    useMemoCache: $c,
    useCacheRefresh: Ho,
    useEffectEvent: po
  };
  function is(l, t, e, a) {
    t = l.memoizedState, e = e(a, t), e = e == null ? t : F({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var cs = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var a = Ut(), u = Xe(a);
      u.payload = t, e != null && (u.callback = e), t = Ve(l, u, a), t !== null && (xt(t, l, a), Ku(t, l, a));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var a = Ut(), u = Xe(a);
      u.tag = 1, u.payload = t, e != null && (u.callback = e), t = Ve(l, u, a), t !== null && (xt(t, l, a), Ku(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = Ut(), a = Xe(e);
      a.tag = 2, t != null && (a.callback = t), t = Ve(l, a, e), t !== null && (xt(t, l, e), Ku(t, l, e));
    }
  };
  function Vo(l, t, e, a, u, n, i) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, i) : t.prototype && t.prototype.isPureReactComponent ? !Yu(e, a) || !Yu(u, n) : !0;
  }
  function Lo(l, t, e, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, a), t.state !== l && cs.enqueueReplaceState(t, t.state, null);
  }
  function _a(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var a in t)
        a !== "ref" && (e[a] = t[a]);
    }
    if (l = l.defaultProps) {
      e === t && (e = F({}, e));
      for (var u in l)
        e[u] === void 0 && (e[u] = l[u]);
    }
    return e;
  }
  function Zo(l) {
    Gn(l);
  }
  function wo(l) {
    console.error(l);
  }
  function Ko(l) {
    Gn(l);
  }
  function di(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Jo(l, t, e) {
    try {
      var a = l.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function ss(l, t, e) {
    return e = Xe(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      di(l, t);
    }, e;
  }
  function Fo(l) {
    return l = Xe(l), l.tag = 3, l;
  }
  function $o(l, t, e, a) {
    var u = e.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var n = a.value;
      l.payload = function() {
        return u(n);
      }, l.callback = function() {
        Jo(t, e, a);
      };
    }
    var i = e.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (l.callback = function() {
      Jo(t, e, a), typeof u != "function" && (We === null ? We = /* @__PURE__ */ new Set([this]) : We.add(this));
      var s = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: s !== null ? s : ""
      });
    });
  }
  function Gv(l, t, e, a, u) {
    if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = e.alternate, t !== null && va(
        t,
        e,
        u,
        !0
      ), e = Il.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
          case 19:
            return st === null ? Ri() : e.alternate === null && Rl === 0 && (Rl = 3), e.flags &= -257, e.flags |= 65536, e.lanes = u, a === In ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Ks(l, a, u)), !1;
          case 22:
            return e.flags |= 65536, a === In ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), Ks(l, a, u)), !1;
        }
        throw Error(y(435, e.tag));
      }
      return Ks(l, a, u), Ri(), !1;
    }
    if (W)
      return t = Il.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, a !== Ac && (l = Error(y(422), { cause: a }), Xu(Qt(l, e)))) : (a !== Ac && (t = Error(y(423), {
        cause: a
      }), Xu(
        Qt(t, e)
      )), l = l.current.alternate, l.flags |= 65536, u &= -u, l.lanes |= u, a = Qt(a, e), u = ss(
        l.stateNode,
        a,
        u
      ), Yc(l, u), Rl !== 4 && (Rl = 2)), !1;
    var n = Error(y(520), { cause: a });
    if (n = Qt(n, e), cn === null ? cn = [n] : cn.push(n), Rl !== 4 && (Rl = 2), t === null) return !0;
    a = Qt(a, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, l = u & -u, e.lanes |= l, l = ss(e.stateNode, a, l), Yc(e, l), !1;
        case 1:
          if (t = e.type, n = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (We === null || !We.has(n))))
            return e.flags |= 65536, u &= -u, e.lanes |= u, u = Fo(u), $o(
              u,
              l,
              e,
              a
            ), Yc(e, u), !1;
          break;
        case 22:
          if (e.memoizedState !== null)
            return e.flags |= 65536, !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var fs = Error(y(461)), Gl = !1;
  function wl(l, t, e, a) {
    t.child = l === null ? Ir(t, null, e, a) : xa(
      t,
      l.child,
      e,
      a
    );
  }
  function Wo(l, t, e, a, u) {
    e = e.render;
    var n = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var s in a)
        s !== "ref" && (i[s] = a[s]);
    } else i = a;
    return ya(t), a = wc(
      l,
      t,
      e,
      i,
      n,
      u
    ), s = Kc(), l !== null && !Gl ? (Jc(l, t, u), Ee(l, t, u)) : (W && s && wn(t), t.flags |= 1, wl(l, t, a, u), t.child);
  }
  function ko(l, t, e, a, u) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" && !pc(n) && n.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = n, Io(
        l,
        t,
        n,
        a,
        u
      )) : (l = Ln(
        e.type,
        null,
        a,
        t,
        t.mode,
        u
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !gs(l, u)) {
      var i = n.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Yu, e(i, a) && l.ref === t.ref)
        return Ee(l, t, u);
    }
    return t.flags |= 1, l = be(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Io(l, t, e, a, u) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Yu(n, a) && l.ref === t.ref)
        if (Gl = !1, t.pendingProps = a = n, gs(l, u))
          (l.flags & 131072) !== 0 && (Gl = !0);
        else
          return t.lanes = l.lanes, Ee(l, t, u);
    }
    return rs(
      l,
      t,
      e,
      a,
      u
    );
  }
  function Po(l, t, e, a) {
    var u = a.children, n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (n = n !== null ? n.baseLanes | e : e, l !== null) {
          for (a = t.child = l.child, u = 0; a !== null; )
            u = u | a.lanes | a.childLanes, a = a.sibling;
          a = u & ~n;
        } else a = 0, t.child = null;
        return ld(
          l,
          t,
          n,
          e,
          a
        );
      }
      if ((e & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Wn(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? to(t, n) : Qc(), eo(t);
      else
        return a = t.lanes = 536870912, ld(
          l,
          t,
          n !== null ? n.baseLanes | e : e,
          e,
          a
        );
    } else
      n !== null ? (Wn(t, n.cachePool), to(t, n), we(), t.memoizedState = null) : (l !== null && Wn(t, null), Qc(), we());
    return wl(l, t, u, e), t.child;
  }
  function Pu(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function ld(l, t, e, a, u) {
    var n = Uc();
    return n = n === null ? null : { parent: Bl._currentValue, pool: n }, t.memoizedState = {
      baseLanes: e,
      cachePool: n
    }, l !== null && Wn(t, null), Qc(), eo(t), l !== null && va(l, t, a, !0), t.childLanes = u, null;
  }
  function mi(l, t) {
    return t = hi(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function td(l, t, e) {
    return xa(t, l.child, null, e), l = mi(t, t.pendingProps), l.flags |= 2, Dt(t), t.memoizedState = null, l;
  }
  function Qv(l, t, e) {
    var a = t.pendingProps, u = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (W) {
        if (a.mode === "hidden")
          return l = mi(t, a), t.lanes = 536870912, l.memoizedState = { baseLanes: 0, cachePool: null }, Pu(null, l);
        if (Vc(t), (l = pl) ? (l = zm(
          l,
          Lt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: qe !== null ? { id: ae, overflow: ue } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Br(l), e.return = t, t.child = e, Jl = t, pl = null)) : l = null, l === null) throw Be(t);
        return t.lanes = 536870912, null;
      }
      return mi(t, a);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if (Vc(t), u)
        if (t.flags & 256)
          t.flags &= -257, t = td(
            l,
            t,
            e
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(y(558));
      else if (Gl || va(l, t, e, !1), u = (e & l.childLanes) !== 0, Gl || u) {
        if (Le.current === null) {
          if (a = Tl, a !== null && (i = Qf(a, e), i !== 0 && i !== n.retryLane))
            throw n.retryLane = i, oa(l, i), xt(a, l, i), fs;
          Ri();
        }
        t = td(
          l,
          t,
          e
        );
      } else
        l = n.treeContext, pl = wt(i.nextSibling), Jl = t, W = !0, He = null, Lt = !1, l !== null && Qr(t, l), t = mi(t, a), t.flags |= 134221824;
      return t;
    }
    return l = be(l.child, {
      mode: a.mode,
      children: a.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function eu(l, t) {
    var e = t.ref;
    if (e === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(y(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function rs(l, t, e, a, u) {
    return ya(t), e = wc(
      l,
      t,
      e,
      a,
      void 0,
      u
    ), a = Kc(), l !== null && !Gl ? (Jc(l, t, u), Ee(l, t, u)) : (W && a && wn(t), t.flags |= 1, wl(l, t, e, u), t.child);
  }
  function ed(l, t, e, a, u, n) {
    return ya(t), t.updateQueue = null, e = uo(
      t,
      a,
      e,
      u
    ), ao(l), a = Kc(), l !== null && !Gl ? (Jc(l, t, n), Ee(l, t, n)) : (W && a && wn(t), t.flags |= 1, wl(l, t, e, n), t.child);
  }
  function ad(l, t, e, a, u) {
    if (ya(t), t.stateNode === null) {
      var n = Ka, i = e.contextType;
      typeof i == "object" && i !== null && (n = kl(i)), n = new e(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = cs, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, Hc(t), i = e.contextType, n.context = typeof i == "object" && i !== null ? kl(i) : Ka, n.state = t.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (is(
        t,
        e,
        i,
        a
      ), n.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (i = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), i !== n.state && cs.enqueueReplaceState(n, n.state, null), Fu(t, a, n, u), Ju(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var s = t.memoizedProps, f = _a(e, s);
      n.props = f;
      var v = n.context, b = e.contextType;
      i = Ka, typeof b == "object" && b !== null && (i = kl(b));
      var T = e.getDerivedStateFromProps;
      b = typeof T == "function" || typeof n.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, b || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (s || v !== i) && Lo(
        t,
        n,
        a,
        i
      ), Qe = !1;
      var m = t.memoizedState;
      n.state = m, Fu(t, a, n, u), Ju(), v = t.memoizedState, s || m !== v || Qe ? (typeof T == "function" && (is(
        t,
        e,
        T,
        a
      ), v = t.memoizedState), (f = Qe || Vo(
        t,
        e,
        f,
        a,
        m,
        v,
        i
      )) ? (b || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = v), n.props = a, n.state = v, n.context = i, a = f) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, Bc(l, t), i = t.memoizedProps, b = _a(e, i), n.props = b, T = t.pendingProps, m = n.context, v = e.contextType, f = Ka, typeof v == "object" && v !== null && (f = kl(v)), s = e.getDerivedStateFromProps, (v = typeof s == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i !== T || m !== f) && Lo(
        t,
        n,
        a,
        f
      ), Qe = !1, m = t.memoizedState, n.state = m, Fu(t, a, n, u), Ju();
      var S = t.memoizedState;
      i !== T || m !== S || Qe || l !== null && l.dependencies !== null && Fn(l.dependencies) ? (typeof s == "function" && (is(
        t,
        e,
        s,
        a
      ), S = t.memoizedState), (b = Qe || Vo(
        t,
        e,
        b,
        a,
        m,
        S,
        f
      ) || l !== null && l.dependencies !== null && Fn(l.dependencies)) ? (v || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, S, f), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        S,
        f
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = S), n.props = a, n.state = S, n.context = f, a = b) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, eu(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = xa(
      t,
      l.child,
      null,
      u
    ), t.child = xa(
      t,
      null,
      e,
      u
    )) : wl(l, t, e, u), t.memoizedState = n.state, l = t.child) : l = Ee(
      l,
      t,
      u
    ), l;
  }
  function ud(l, t, e, a) {
    return ma(), t.flags |= 256, wl(l, t, e, a), t.child;
  }
  var os = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ds(l) {
    return { baseLanes: l, cachePool: Kr() };
  }
  function ms(l, t, e) {
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= Rt), l;
  }
  function nd(l, t, e) {
    var a = t.pendingProps, u = !1, n = (t.flags & 128) !== 0, i;
    if ((i = n) || (i = l !== null && l.memoizedState === null ? !1 : (Pl.current & 2) !== 0), i && (u = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (W) {
        if (u ? Ze(t) : we(), (l = pl) ? (l = zm(
          l,
          Lt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: qe !== null ? { id: ae, overflow: ue } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Br(l), e.return = t, t.child = e, Jl = t, pl = null)) : l = null, l === null) throw Be(t);
        return mf(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return n = a.children, a = a.fallback, u ? (we(), u = t.mode, n = hi(
        { mode: "hidden", children: n },
        u
      ), a = da(
        a,
        u,
        e,
        null
      ), n.return = t, a.return = t, n.sibling = a, t.child = n, a = t.child, a.memoizedState = ds(e), a.childLanes = ms(
        l,
        i,
        e
      ), t.memoizedState = os, Pu(null, a)) : (Ze(t), hs(t, n));
    }
    var s = l.memoizedState;
    if (s !== null) {
      var f = s.dehydrated;
      if (f !== null)
        return Xv(
          l,
          t,
          n,
          i,
          a,
          f,
          s,
          e
        );
    }
    return u ? (we(), u = a.fallback, n = t.mode, s = l.child, f = s.sibling, a = be(s, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = s.subtreeFlags & 1206910976, f !== null ? u = be(f, u) : (u = da(
      u,
      n,
      e,
      null
    ), u.flags |= 2), u.return = t, a.return = t, a.sibling = u, t.child = a, Pu(null, a), a = t.child, u = l.child.memoizedState, u === null ? u = ds(e) : (n = u.cachePool, n !== null ? (s = Bl._currentValue, n = n.parent !== s ? { parent: s, pool: s } : n) : n = Kr(), u = {
      baseLanes: u.baseLanes | e,
      cachePool: n
    }), a.memoizedState = u, a.childLanes = ms(
      l,
      i,
      e
    ), t.memoizedState = os, Pu(l.child, a)) : (Ze(t), e = l.child, l = e.sibling, e = be(e, {
      mode: "visible",
      children: a.children
    }), e.return = t, e.sibling = null, l !== null && (i = t.deletions, i === null ? (t.deletions = [l], t.flags |= 16) : i.push(l)), t.child = e, t.memoizedState = null, e);
  }
  function hs(l, t) {
    return t = hi(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function hi(l, t) {
    return l = gt(22, l, null, t), l.lanes = 0, l;
  }
  function vi(l, t, e) {
    return xa(t, l.child, null, e), l = hs(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function Xv(l, t, e, a, u, n, i, s) {
    if (e)
      return t.flags & 256 ? (Ze(t), t.flags &= -257, vi(
        l,
        t,
        s
      )) : t.memoizedState !== null ? (we(), t.child = l.child, t.flags |= 128, null) : (we(), n = u.fallback, i = t.mode, u = hi(
        { mode: "visible", children: u.children },
        i
      ), n = da(
        n,
        i,
        s,
        null
      ), n.flags |= 2, u.return = t, n.return = t, u.sibling = n, t.child = u, xa(t, l.child, null, s), u = t.child, u.memoizedState = ds(s), u.childLanes = ms(
        l,
        a,
        s
      ), t.memoizedState = os, Pu(null, u));
    if (Ze(t), mf(n)) {
      if (a = n.nextSibling && n.nextSibling.dataset, a) var f = a.dgst;
      return a = f, a !== "" && (u = Error(y(419)), u.stack = "", u.digest = a, Xu({ value: u, source: null, stack: null })), vi(
        l,
        t,
        s
      );
    }
    if (Gl || va(l, t, s, !1), a = (s & l.childLanes) !== 0, Gl || a) {
      if (Le.current !== null)
        return vi(
          l,
          t,
          s
        );
      if (a = Tl, a !== null && (u = Qf(
        a,
        s
      ), u !== 0 && u !== i.retryLane))
        throw i.retryLane = u, oa(l, u), xt(a, l, u), fs;
      return df(n) || Ri(), vi(
        l,
        t,
        s
      );
    }
    return df(n) ? (t.flags |= 192, t.child = l.child, null) : (l = i.treeContext, pl = wt(n.nextSibling), Jl = t, W = !0, He = null, Lt = !1, l !== null && Qr(t, l), t = hs(
      t,
      u.children
    ), t.flags |= 134221824, t);
  }
  function id(l, t, e) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), Jn(l.return, t, e);
  }
  function cd(l) {
    for (var t = null; l !== null; ) {
      var e = l.alternate;
      e !== null && ei(e) === null && (t = l), l = l.sibling;
    }
    return t;
  }
  function yi(l, t, e, a, u, n) {
    var i = l.memoizedState;
    i === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: e,
      tailMode: u,
      treeForkCount: n
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = e, i.tailMode = u, i.treeForkCount = n);
  }
  function vs(l) {
    var t = l.child;
    for (l.child = null; t !== null; ) {
      var e = t.sibling;
      t.sibling = l.child, l.child = t, t = e;
    }
  }
  function ys(l, t, e) {
    var a = t.pendingProps, u = a.revealOrder, n = a.tail;
    a = a.children;
    var i = Pl.current;
    if (t.flags & 128)
      return $u(t, i), null;
    var s = (i & 2) !== 0;
    if (s ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, $u(t, i), u === "backwards" && l !== null ? (vs(l), wl(l, t, a, e), vs(l)) : wl(l, t, a, e), a = W ? Qu : 0, !s && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && id(l, e, t);
        else if (l.tag === 19)
          id(l, e, t);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t)
            break l;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (u) {
      case "backwards":
        e = cd(t.child), e === null ? (u = t.child, t.child = null) : (u = e.sibling, e.sibling = null, vs(t)), yi(
          t,
          !0,
          u,
          null,
          n,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (e = null, u = t.child, t.child = null; u !== null; ) {
          if (l = u.alternate, l !== null && ei(l) === null) {
            t.child = u;
            break;
          }
          l = u.sibling, u.sibling = e, e = u, u = l;
        }
        yi(
          t,
          !0,
          e,
          null,
          n,
          a
        );
        break;
      case "together":
        yi(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        e = cd(t.child), e === null ? (u = t.child, t.child = null) : (u = e.sibling, e.sibling = null), yi(
          t,
          !1,
          u,
          e,
          n,
          a
        );
    }
    return t.child;
  }
  function sd(l, t, e) {
    var a = t.pendingProps;
    return Ye(t, t.type, a.value), wl(l, t, a.children, e), t.child;
  }
  function Ee(l, t, e) {
    if (l !== null && (t.dependencies = l.dependencies), $e |= t.lanes, (e & t.childLanes) === 0)
      if (l !== null) {
        if (va(
          l,
          t,
          e,
          !1
        ), (e & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(y(153));
    if (t.child !== null) {
      for (l = t.child, e = be(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        l = l.sibling, e = e.sibling = be(l, l.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function gs(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Fn(l)));
  }
  function Vv(l, t, e) {
    switch (t.tag) {
      case 3:
        Ca(t, t.stateNode.containerInfo), Ye(t, Bl, l.memoizedState.cache), ma();
        break;
      case 27:
      case 5:
        pu(t);
        break;
      case 4:
        Ca(t, t.stateNode.containerInfo);
        break;
      case 10:
        Ye(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Vc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return Ze(t), t.flags |= 128, null;
          a = va(
            l,
            t,
            e,
            !1
          );
          var u = t.child.childLanes;
          return a || (e & u) !== 0 ? nd(l, t, e) : (Ze(t), l = Ee(
            l,
            t,
            e
          ), l !== null ? l.sibling : null);
        }
        Ze(t);
        break;
      case 19:
        if (t.flags & 128)
          return ys(
            l,
            t,
            e
          );
        if (u = (l.flags & 128) !== 0, a = (e & t.childLanes) !== 0, a || (va(
          l,
          t,
          e,
          !1
        ), a = (e & t.childLanes) !== 0), u) {
          if (a)
            return ys(
              l,
              t,
              e
            );
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), $u(t, Pl.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Po(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        Ye(t, Bl, l.memoizedState.cache);
    }
    return Ee(l, t, e);
  }
  function fd(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Gl = !0;
      else {
        if (!gs(l, e) && (t.flags & 128) === 0)
          return Gl = !1, Vv(
            l,
            t,
            e
          );
        Gl = (l.flags & 131072) !== 0;
      }
    else
      Gl = !1, W && (t.flags & 1048576) !== 0 && Gr(t, Qu, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (l = ba(t.elementType), t.type = l, typeof l == "function")
            pc(l) ? (a = _a(l, a), t.tag = 1, t = ad(
              null,
              t,
              l,
              a,
              e
            )) : (t.tag = 0, t = rs(
              null,
              t,
              l,
              a,
              e
            ));
          else {
            if (l != null) {
              var u = l.$$typeof;
              if (u === z) {
                t.tag = 11, t = Wo(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (u === ol) {
                t.tag = 14, t = ko(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (u === hl) {
                t.tag = 10, t.type = l, t = sd(
                  null,
                  t,
                  e
                );
                break l;
              }
            }
            throw t = ll(l) || l, Error(y(306, t, ""));
          }
        }
        return t;
      case 0:
        return rs(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return a = t.type, u = _a(
          a,
          t.pendingProps
        ), ad(
          l,
          t,
          a,
          u,
          e
        );
      case 3:
        l: {
          if (Ca(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(y(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          u = n.element, Bc(l, t), Fu(t, a, null, e);
          var i = t.memoizedState;
          if (a = i.cache, Ye(t, Bl, a), a !== n.cache && Mc(
            t,
            [Bl],
            e,
            !0
          ), Ju(), a = i.element, n.isDehydrated)
            if (n = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = ud(
                l,
                t,
                a,
                e
              );
              break l;
            } else if (a !== u) {
              u = Qt(
                Error(y(424)),
                t
              ), Xu(u), t = ud(
                l,
                t,
                a,
                e
              );
              break l;
            } else
              for (l = t.stateNode.containerInfo, l.nodeType === 9 ? l = l.body : l = l.nodeName === "HTML" ? l.ownerDocument.body : l, pl = wt(l.firstChild), Jl = t, W = !0, He = null, Lt = !0, e = Ir(
                t,
                null,
                a,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 134221824, e = e.sibling;
          else {
            if (ma(), a === u) {
              t = Ee(
                l,
                t,
                e
              );
              break l;
            }
            wl(l, t, a, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return eu(l, t), l === null ? (e = Um(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : W || (t.stateNode = mm(
          t.type,
          t.pendingProps,
          te.current,
          t
        )) : t.memoizedState = Um(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return pu(t), l === null && W && (a = t.stateNode = Dm(
          t.type,
          t.pendingProps,
          te.current
        ), Jl = t, Lt = !0, u = pl, Pe(t.type) ? (hf = u, pl = wt(a.firstChild)) : pl = u), wl(
          l,
          t,
          t.pendingProps.children,
          e
        ), eu(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && W && ((u = a = pl) && (a = H0(
          a,
          t.type,
          t.pendingProps,
          Lt
        ), a !== null ? (t.stateNode = a, Jl = t, pl = wt(a.firstChild), Lt = !1, u = !0) : u = !1), u || Be(t)), pu(t), u = t.type, n = t.pendingProps, i = l !== null ? l.memoizedProps : null, a = n.children, uf(u, n) ? a = null : i !== null && uf(u, i) && (t.flags |= 32), t.memoizedState !== null && (u = wc(
          l,
          t,
          Mv,
          null,
          null,
          e
        ), ju._currentValue = u), eu(l, t), wl(l, t, a, e), t.child;
      case 6:
        return l === null && W && ((l = e = pl) && (e = B0(
          e,
          t.pendingProps,
          Lt
        ), e !== null ? (t.stateNode = e, Jl = t, pl = null, l = !0) : l = !1), l || Be(t)), null;
      case 13:
        return nd(l, t, e);
      case 4:
        return Ca(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = xa(
          t,
          null,
          a,
          e
        ) : wl(l, t, a, e), t.child;
      case 11:
        return Wo(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return a = t.pendingProps, eu(l, t), wl(l, t, a, e), t.child;
      case 8:
        return wl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return wl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return sd(l, t, e);
      case 9:
        return u = t.type._context, a = t.pendingProps.children, ya(t), u = kl(u), a = a(u), t.flags |= 1, wl(l, t, a, e), t.child;
      case 14:
        return ko(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 15:
        return Io(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 19:
        return ys(l, t, e);
      case 31:
        return Qv(l, t, e);
      case 22:
        return Po(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        return ya(t), a = kl(Bl), l === null ? (u = Uc(), u === null && (u = Tl, n = Cc(), u.pooledCache = n, n.refCount++, n !== null && (u.pooledCacheLanes |= e), u = n), t.memoizedState = { parent: a, cache: u }, Hc(t), Ye(t, Bl, u)) : ((l.lanes & e) !== 0 && (Bc(l, t), Fu(t, null, null, e), Ju()), u = l.memoizedState, n = t.memoizedState, u.parent !== a ? (u = { parent: a, cache: a }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), Ye(t, Bl, a)) : (a = n.cache, Ye(t, Bl, a), a !== u.cache && Mc(
          t,
          [Bl],
          e,
          !0
        ))), wl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= l === null ? 18882560 : 18874368 : W && wn(t), l !== null && l.memoizedProps.name !== a.name ? t.flags |= 4194816 : eu(l, t), wl(l, t, a.children, e), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(y(156, t.tag));
  }
  function Ne(l) {
    l.flags |= 4;
  }
  function Ss(l, t, e, a, u) {
    var n;
    if ((n = (l.mode & 32) !== 0) && (n = e === null ? Ym(t, a) : Ym(t, a) && (a.src !== e.src || a.srcSet !== e.srcSet)), n) {
      if (l.flags |= 16777216, (u & 335544128) === u)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (Zd()) l.flags |= 8192;
        else
          throw ja = In, qc;
    } else l.flags &= -16777217;
  }
  function rd(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Gm(t))
      if (Zd()) l.flags |= 8192;
      else
        throw ja = In, qc;
  }
  function gi(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Bf() : 536870912, l.lanes |= t, cu |= t);
  }
  function ln(l, t) {
    if (!W)
      switch (l.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var e = l.tail, a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (t = l.tail, e = null; t !== null; )
            t.alternate !== null && (e = t), t = t.sibling;
          e === null ? l.tail = null : e.sibling = null;
      }
  }
  function El(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, a = 0;
    if (t)
      for (var u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags & 1206910976, a |= u.flags & 1206910976, u.return = l, u = u.sibling;
    else
      for (u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = l, u = u.sibling;
    return l.subtreeFlags |= a, l.childLanes = e, t;
  }
  function Lv(l, t, e) {
    var a = t.pendingProps;
    switch (zc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return El(t), null;
      case 1:
        return El(t), null;
      case 3:
        return e = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Te(Bl), De(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && ($a(t) ? Ne(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Oc())), El(t), null;
      case 26:
        var u = t.type, n = t.memoizedState;
        return l === null ? (Ne(t), n !== null ? (El(t), rd(t, n)) : (El(t), Ss(
          t,
          u,
          null,
          a,
          e
        ))) : n ? n !== l.memoizedState ? (Ne(t), El(t), rd(t, n)) : (El(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && Ne(t), El(t), Ss(
          t,
          u,
          l,
          a,
          e
        )), null;
      case 27:
        if (Ra(t), e = te.current, u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && Ne(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(y(166));
            return El(t), t.subtreeFlags &= -33554433, null;
          }
          l = Zl.current, $a(t) ? Xr(t) : (l = Dm(u, a, e), t.stateNode = l, Ne(t));
        }
        return El(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (Ra(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && Ne(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(y(166));
            return El(t), t.subtreeFlags &= -33554433, null;
          }
          if (n = Zl.current, $a(t))
            Xr(t);
          else {
            var i = dn(
              te.current
            );
            switch (n) {
              case 1:
                n = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                n = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    n = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    n = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    n = i.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(
                      n.firstChild
                    );
                    break;
                  case "select":
                    n = typeof a.is == "string" ? i.createElement("select", {
                      is: a.is
                    }) : i.createElement("select"), a.multiple ? n.multiple = !0 : a.size && (n.size = a.size);
                    break;
                  default:
                    n = typeof a.is == "string" ? i.createElement(u, { is: a.is }) : i.createElement(u);
                }
            }
            n[Wl] = t, n[yt] = a;
            l: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break l;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break l;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = n;
            l: switch (tt(n, u, a), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break l;
              case "img":
                a = !0;
                break l;
              default:
                a = !1;
            }
            a && Ne(t);
          }
        }
        return El(t), t.subtreeFlags &= -33554433, Ss(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          e
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && Ne(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(y(166));
          if (l = te.current, $a(t)) {
            if (l = t.stateNode, e = t.memoizedProps, a = null, u = Jl, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            l[Wl] = t, l = !!(l.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || fm(l.nodeValue, e)), l || Be(t, !0);
          } else
            l = dn(l).createTextNode(
              a
            ), l[Wl] = t, t.stateNode = l;
        }
        return El(t), null;
      case 31:
        if (e = t.memoizedState, l === null || l.memoizedState !== null) {
          if (a = $a(t), e !== null) {
            if (l === null) {
              if (!a) throw Error(y(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(y(557));
              l[Wl] = t;
            } else
              ma(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            El(t), l = !1;
          } else
            e = Oc(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), l = !0;
          if (!l)
            return t.flags & 256 ? (Dt(t), t) : (Dt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(y(558));
        }
        return El(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (u = $a(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!u) throw Error(y(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(y(317));
              u[Wl] = t;
            } else
              ma(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            El(t), u = !1;
          } else
            u = Oc(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return t.flags & 256 ? (Dt(t), t) : (Dt(t), null);
        }
        return Dt(t), (t.flags & 128) !== 0 ? (t.lanes = e, t) : (e = a !== null, l = l !== null && l.memoizedState !== null, e && (a = t.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), n = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== u && (a.flags |= 2048)), e !== l && e && (t.child.flags |= 8192), gi(t, t.updateQueue), El(t), null);
      case 4:
        return De(), l === null && Ps(t.stateNode.containerInfo), t.flags |= 67108864, El(t), null;
      case 10:
        return Te(t.type), El(t), null;
      case 19:
        if (Lc(t), a = t.memoizedState, a === null) return El(t), null;
        if (u = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (u) ln(a, !1);
          else {
            if (Rl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = ei(l), n !== null) {
                  for (t.flags |= 128, ln(a, !1), l = n.updateQueue, t.updateQueue = l, gi(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    Hr(e, l), e = e.sibling;
                  return $u(
                    t,
                    Pl.current & 1 | 2
                  ), W && je(t, a.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && Et() > Oi && (t.flags |= 128, u = !0, ln(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = ei(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, gi(t, l), ln(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !n.alternate && !W)
                return El(t), null;
            } else
              2 * Et() - a.renderingStartTime > Oi && e !== 536870912 && (t.flags |= 128, u = !0, ln(a, !1), t.lanes = 4194304);
          a.isBackwards ? (n.sibling = t.child, t.child = n) : (l = a.last, l !== null ? l.sibling = n : t.child = n, a.last = n);
        }
        if (a.tail !== null) {
          l = a.tail;
          l: {
            for (e = l; e !== null; ) {
              if (e.alternate !== null) {
                e = !1;
                break l;
              }
              e = e.sibling;
            }
            e = !0;
          }
          return a.rendering = l, a.tail = l.sibling, a.renderingStartTime = Et(), l.sibling = null, n = Pl.current, n = u ? n & 1 | 2 : n & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !e || W ? $u(t, n) : (e = n, vl(Il, t), vl(Pl, e), st === null && (st = t)), W && je(t, a.treeForkCount), l;
        }
        return El(t), null;
      case 22:
      case 23:
        return Dt(t), Xc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (El(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : El(t), e = t.updateQueue, e !== null && gi(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== e && (t.flags |= 2048), l !== null && Ul(Sa), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), Te(Bl), El(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, El(t), null;
    }
    throw Error(y(156, t.tag));
  }
  function Zv(l, t) {
    switch (zc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Te(Bl), De(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ra(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Dt(t), t.alternate === null)
            throw Error(y(340));
          ma();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (Dt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(y(340));
          ma();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return Lc(t), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null), t.flags |= 4, t) : null;
      case 4:
        return De(), null;
      case 10:
        return Te(t.type), null;
      case 22:
      case 23:
        return Dt(t), Xc(), l !== null && Ul(Sa), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Te(Bl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function od(l, t) {
    switch (zc(t), t.tag) {
      case 3:
        Te(Bl), De();
        break;
      case 26:
      case 27:
      case 5:
        Ra(t);
        break;
      case 4:
        De();
        break;
      case 31:
        t.memoizedState !== null && Dt(t);
        break;
      case 13:
        Dt(t);
        break;
      case 19:
        Lc(t);
        break;
      case 10:
        Te(t.type);
        break;
      case 22:
      case 23:
        Dt(t), Xc(), l !== null && Ul(Sa);
        break;
      case 24:
        Te(Bl);
    }
  }
  function tn(l, t) {
    try {
      var e = t.updateQueue, a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        e = u;
        do {
          if ((e.tag & l) === l) {
            a = void 0;
            var n = e.create, i = e.inst;
            a = n(), i.destroy = a;
          }
          e = e.next;
        } while (e !== u);
      }
    } catch (s) {
      gl(t, t.return, s);
    }
  }
  function Ke(l, t, e) {
    try {
      var a = t.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var i = a.inst, s = i.destroy;
            if (s !== void 0) {
              i.destroy = void 0, u = t;
              var f = e, v = s;
              try {
                v();
              } catch (b) {
                gl(
                  u,
                  f,
                  b
                );
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (b) {
      gl(t, t.return, b);
    }
  }
  function dd(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        lo(t, e);
      } catch (a) {
        gl(l, l.return, a);
      }
    }
  }
  function md(l, t, e) {
    e.props = _a(
      l.type,
      l.memoizedProps
    ), e.state = l.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (a) {
      gl(l, t, a);
    }
  }
  function ne(l, t) {
    try {
      var e = l.ref;
      if (e !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            var u = l.stateNode, n = ge(l.memoizedProps, u);
            (u.ref === null || u.ref.name !== n) && (u.ref = jm(n)), a = u.ref;
            break;
          case 7:
            if (l.stateNode === null) {
              var i = new qt(l);
              j(
                l.child,
                !1,
                U0,
                i,
                void 0,
                void 0
              ), l.stateNode = i;
            }
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof e == "function" ? l.refCleanup = e(a) : e.current = a;
      }
    } catch (s) {
      gl(l, t, s);
    }
  }
  function lt(l, t) {
    var e = l.ref, a = l.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          gl(l, t, u);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (u) {
          gl(l, t, u);
        }
      else e.current = null;
  }
  function Si(l, t) {
    if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && l.alternate === null && t !== null)
      for (var e = 0; e < t.length; e++)
        Nm(
          l.stateNode,
          t[e]
        );
  }
  function hd(l) {
    for (var t = l.return; t !== null && (js(t) && Nm(l.stateNode, t.stateNode), !bs(t)); )
      t = t.return;
  }
  function en(l) {
    for (var t = l.return; t !== null && (js(t) && q0(l.stateNode, t.stateNode), !bs(t)); )
      t = t.return;
  }
  function bs(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 27;
  }
  function js(l) {
    return l && l.tag === 7 && l.stateNode !== null;
  }
  function xs(l) {
    var t = l.type, e = l.memoizedProps, a = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break l;
        case "img":
          e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (u) {
      gl(l, l.return, u);
    }
  }
  function Ts(l, t, e) {
    try {
      var a = l.stateNode;
      y0(a, l.type, e, t), a[yt] = t;
    } catch (u) {
      gl(l, l.return, u);
    }
  }
  function vd(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Pe(l.type) || l.tag === 4;
  }
  function _s(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || vd(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Pe(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function ps(l, t, e, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      u = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(u, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(u), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = ee)), Si(l, a), sl = !0;
    else if (u !== 4 && (u === 27 && (Si(l, a), a = null, Pe(l.type) && (e = l.stateNode, t = null)), l = l.child, l !== null))
      for (ps(
        l,
        t,
        e,
        a
      ), l = l.sibling; l !== null; )
        ps(
          l,
          t,
          e,
          a
        ), l = l.sibling;
  }
  function bi(l, t, e, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      u = l.stateNode, t ? e.insertBefore(u, t) : e.appendChild(u), Si(l, a), sl = !0;
    else if (u !== 4 && (u === 27 && (Si(l, a), a = null, Pe(l.type) && (e = l.stateNode)), l = l.child, l !== null))
      for (bi(
        l,
        t,
        e,
        a
      ), l = l.sibling; l !== null; )
        bi(
          l,
          t,
          e,
          a
        ), l = l.sibling;
  }
  function yd(l) {
    var t = l.stateNode, e = l.memoizedProps;
    try {
      for (var a = l.type, u = t.attributes; u.length; )
        t.removeAttributeNode(u[0]);
      tt(t, a, e), t[Wl] = l, t[yt] = e;
    } catch (n) {
      gl(l, l.return, n);
    }
  }
  var ji = !1, Mt = null;
  function gd(l) {
    (l.tag === 30 || (l.subtreeFlags & 33554432) !== 0) && (ji = !0);
  }
  var ie = null;
  function Sd() {
    var l = ie;
    return ie = null, l;
  }
  var St = 0;
  function au(l, t, e, a, u) {
    return St = 0, bd(
      l.child,
      t,
      e,
      a,
      u
    );
  }
  function bd(l, t, e, a, u) {
    for (var n = !1; l !== null; ) {
      if (l.tag === 5) {
        var i = l.stateNode;
        if (a !== null) {
          var s = sf(i);
          a.push(s), s.view && (n = !0);
        } else
          n || sf(i).view && (n = !0);
        ji = !0, Sm(
          i,
          St === 0 ? t : t + "_" + St,
          e
        ), St++;
      } else (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && u || bd(
        l.child,
        t,
        e,
        a,
        u
      ) && (n = !0));
      l = l.sibling;
    }
    return n;
  }
  function ce(l, t) {
    for (; l !== null; )
      l.tag === 5 ? bm(l.stateNode, l.memoizedProps) : (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && t || ce(
        l.child,
        t
      )), l = l.sibling;
  }
  function xi(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if ((l.tag !== 22 || l.memoizedState === null) && (xi(l), l.tag === 30 && (l.flags & 18874368) !== 0 && l.stateNode.paired)) {
          var t = l.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(y(544));
          var e = t.name;
          t = Se(t.default, t.share), t !== "none" && (au(
            l,
            e,
            t,
            null,
            !1
          ) || ce(l.child, !1));
        }
        l = l.sibling;
      }
  }
  function Es(l, t) {
    if (l.tag === 30) {
      var e = l.stateNode, a = l.memoizedProps, u = ge(a, e), n = Se(
        a.default,
        e.paired ? a.share : a.enter
      );
      n !== "none" ? au(l, u, n, null, !1) ? (xi(l), e.paired || t || ou(l, a.onEnter)) : ce(l.child, !1) : xi(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        Es(l, t), l = l.sibling;
    else xi(l);
  }
  function Ns(l) {
    if (Mt !== null && Mt.size !== 0) {
      var t = Mt;
      if ((l.subtreeFlags & 18874368) !== 0)
        for (l = l.child; l !== null; ) {
          if (l.tag !== 22 || l.memoizedState === null) {
            if (l.tag === 30 && (l.flags & 18874368) !== 0) {
              var e = l.memoizedProps, a = e.name;
              if (a != null && a !== "auto") {
                var u = t.get(a);
                if (u !== void 0) {
                  var n = Se(
                    e.default,
                    e.share
                  );
                  if (n !== "none" && (au(
                    l,
                    a,
                    n,
                    null,
                    !1
                  ) ? (n = l.stateNode, u.paired = n, n.paired = u, ou(l, e.onShare)) : ce(l.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Ns(l);
          }
          l = l.sibling;
        }
    }
  }
  function zs(l) {
    if (l.tag === 30) {
      var t = l.memoizedProps, e = ge(t, l.stateNode), a = Mt !== null ? Mt.get(e) : void 0, u = Se(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      u !== "none" && (au(l, e, u, null, !1) ? a !== void 0 ? (u = l.stateNode, a.paired = u, u.paired = a, Mt.delete(e), ou(l, t.onShare)) : ou(l, t.onExit) : ce(l.child, !1)), Mt !== null && Ns(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        zs(l), l = l.sibling;
    else
      Mt !== null && Ns(l);
  }
  function jd(l) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var t = l.memoizedProps, e = ge(t, l.stateNode);
        t = Se(t.default, t.update), l.flags &= -5, t !== "none" && au(
          l,
          e,
          t,
          l.memoizedState = [],
          !1
        );
      } else
        (l.subtreeFlags & 33554432) !== 0 && jd(l);
      l = l.sibling;
    }
  }
  function As(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if (l.tag !== 22 || l.memoizedState === null) {
          if (l.tag === 30 && (l.flags & 18874368) !== 0) {
            var t = l.stateNode;
            t.paired !== null && (t.paired = null, ce(l.child, !1));
          }
          As(l);
        }
        l = l.sibling;
      }
  }
  function Ti(l) {
    if (l.tag === 30)
      l.stateNode.paired = null, ce(l.child, !1), As(l);
    else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        Ti(l), l = l.sibling;
    else As(l);
  }
  function xd(l) {
    for (l = l.child; l !== null; )
      l.tag === 30 ? ce(l.child, !1) : (l.subtreeFlags & 33554432) !== 0 && xd(l), l = l.sibling;
  }
  function Os(l, t, e, a, u, n, i) {
    for (var s = !1; t !== null; ) {
      if (t.tag === 5) {
        var f = t.stateNode;
        if (n !== null && St < n.length) {
          var v = n[St], b = sf(f);
          (v.view || b.view) && (s = !0);
          var T;
          if (T = (l.flags & 4) === 0)
            if (b.clip) T = !0;
            else {
              T = v.rect;
              var m = b.rect;
              T = T.y !== m.y || T.x !== m.x || T.height !== m.height || T.width !== m.width;
            }
          T && (l.flags |= 4), b.abs ? b = !v.abs : (v = v.rect, b = b.rect, b = v.height !== b.height || v.width !== b.width), b && (l.flags |= 32);
        } else l.flags |= 32;
        (l.flags & 4) !== 0 && Sm(
          f,
          St === 0 ? e : e + "_" + St,
          u
        ), s && (l.flags & 4) !== 0 || (ie === null && (ie = []), ie.push(
          f,
          St === 0 ? a : a + "_" + St,
          t.memoizedProps
        )), St++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && i ? l.flags |= t.flags & 32 : Os(
        l,
        t.child,
        e,
        a,
        u,
        n,
        i
      ) && (s = !0));
      t = t.sibling;
    }
    return s;
  }
  function Td(l, t) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var e = l.memoizedProps, a = l.stateNode, u = ge(e, a), n = Se(e.default, e.update), i;
        i = l.memoizedState, l.memoizedState = null, a = l;
        var s = l.child;
        St = 0, u = Os(
          a,
          s,
          u,
          u,
          n,
          i,
          !1
        ), (l.flags & 4) !== 0 && u && ou(l, e.onUpdate);
      } else
        (l.subtreeFlags & 33554432) !== 0 && Td(l);
      l = l.sibling;
    }
  }
  var Fl = !1, ml = !1, se = !1, Ds = !1, _d = typeof WeakSet == "function" ? WeakSet : Set, $l = null, fe = !1, an = !1, _i = !1, Ms = !1;
  function wv(l, t, e) {
    if (l = l.containerInfo, ef = xu, l = Nr(l), gc(l)) {
      if ("selectionStart" in l)
        var a = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          a = (a = l.ownerDocument) && a.defaultView || window;
          var u = a.getSelection && a.getSelection();
          if (u && u.rangeCount !== 0) {
            a = u.anchorNode;
            var n = u.anchorOffset, i = u.focusNode;
            u = u.focusOffset;
            try {
              a.nodeType, i.nodeType;
            } catch {
              a = null;
              break l;
            }
            var s = 0, f = -1, v = -1, b = 0, T = 0, m = l, S = null;
            t: for (; ; ) {
              for (var N; m !== a || n !== 0 && m.nodeType !== 3 || (f = s + n), m !== i || u !== 0 && m.nodeType !== 3 || (v = s + u), m.nodeType === 3 && (s += m.nodeValue.length), (N = m.firstChild) !== null; )
                S = m, m = N;
              for (; ; ) {
                if (m === l) break t;
                if (S === a && ++b === n && (f = s), S === i && ++T === u && (v = s), (N = m.nextSibling) !== null) break;
                m = S, S = m.parentNode;
              }
              m = N;
            }
            a = f === -1 || v === -1 ? null : { start: f, end: v };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (af = { focusedElem: l, selectionRange: a }, xu = !1, e = (e & 335544064) === e, $l = t, t = e ? 9270 : 1024; $l !== null; ) {
      if (l = $l, e && (a = l.deletions, a !== null))
        for (n = 0; n < a.length; n++)
          e && zs(a[n]);
      if (l.alternate === null && (l.flags & 2) !== 0)
        e && gd(l), pi(e);
      else {
        if (l.tag === 22) {
          if (a = l.alternate, l.memoizedState !== null) {
            a !== null && a.memoizedState === null && e && zs(a), pi(e);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            e && gd(l), pi(e);
            continue;
          }
        }
        a = l.child, (l.subtreeFlags & t) !== 0 && a !== null ? (a.return = l, $l = a) : (e && jd(l), pi(e));
      }
    }
    Mt = null;
  }
  function pi(l) {
    for (; $l !== null; ) {
      var t = $l, e = l, a = t.alternate, u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((u & 1024) !== 0 && a !== null) {
            e = void 0, u = a.memoizedProps, a = a.memoizedState;
            var n = t.stateNode;
            try {
              var i = _a(
                t.type,
                u
              );
              e = n.getSnapshotBeforeUpdate(
                i,
                a
              ), n.__reactInternalSnapshotBeforeUpdate = e;
            } catch (s) {
              gl(t, t.return, s);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, e = a.nodeType, e === 9)
              of(a);
            else if (e === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  of(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          e && a !== null && (e = ge(
            a.memoizedProps,
            a.stateNode
          ), u = t.memoizedProps, u = Se(u.default, u.update), u !== "none" && au(
            a,
            e,
            u,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((u & 1024) !== 0) throw Error(y(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, $l = a;
        break;
      }
      $l = t.return;
    }
  }
  function pd(l, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        re(l, e), a & 4 && tn(5, e);
        break;
      case 1:
        if (re(l, e), a & 4)
          if (l = e.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (i) {
              gl(e, e.return, i);
            }
          else {
            var u = _a(
              e.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                u,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (i) {
              gl(
                e,
                e.return,
                i
              );
            }
          }
        a & 64 && dd(e), a & 512 && ne(e, e.return);
        break;
      case 3:
        if (re(l, e), a & 64 && (l = e.updateQueue, l !== null)) {
          if (t = null, e.child !== null)
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            lo(l, t);
          } catch (i) {
            gl(e, e.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && yd(e);
      case 26:
      case 5:
        re(l, e), t === null && a & 4 && xs(e), a & 512 && ne(e, e.return);
        break;
      case 12:
        re(l, e);
        break;
      case 31:
        re(l, e), a & 4 && Ad(l, e);
        break;
      case 13:
        re(l, e), a & 4 && Od(l, e), a & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = a0.bind(
          null,
          e
        ), Y0(l, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || Fl, !a) {
          var n = t !== null && t.memoizedState !== null || ml;
          t = Fl, u = ml, Fl = a, (ml = n) && !u ? (a = 2, (e.subtreeFlags & 8772) !== 0 && (a |= 1), kt(
            l,
            e,
            a
          )) : re(l, e), Fl = t, ml = u;
        }
        break;
      case 30:
        re(l, e), a & 512 && ne(e, e.return);
        break;
      case 7:
        a & 512 && ne(e, e.return);
      default:
        re(l, e);
    }
  }
  function Cs(l, t) {
    for (l = l.child; l !== null; )
      Ed(l, t), l = l.sibling;
  }
  function Ed(l, t) {
    switch (l.tag) {
      case 5:
      case 26:
        try {
          var e = l.stateNode;
          if (t) {
            var a = e.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var u = l.stateNode, n = l.memoizedProps.style, i = n != null && n.hasOwnProperty("display") ? n.display : null;
            u.style.display = i == null || typeof i == "boolean" ? "" : ("" + i).trim();
          }
        } catch (f) {
          gl(l, l.return, f);
        }
        Rs(l, t);
        break;
      case 6:
        try {
          l.stateNode.nodeValue = t ? "" : l.memoizedProps, sl = !0;
        } catch (f) {
          gl(l, l.return, f);
        }
        break;
      case 18:
        try {
          var s = l.stateNode;
          t ? gm(s, !0) : gm(l.stateNode, !1);
        } catch (f) {
          gl(l, l.return, f);
        }
        break;
      case 22:
      case 23:
        l.memoizedState === null && Cs(l, t);
        break;
      default:
        Cs(l, t);
    }
  }
  function Rs(l, t) {
    if (l.subtreeFlags & 67108864)
      for (l = l.child; l !== null; ) {
        l: {
          var e = l, a = t;
          switch (e.tag) {
            case 4:
              Ed(e, a);
              break l;
            case 22:
              e.memoizedState === null && Rs(e, a);
              break l;
            default:
              Rs(e, a);
          }
        }
        l = l.sibling;
      }
  }
  function Nd(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, Nd(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && On(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var Ol = null, bt = !1;
  function $t(l, t, e) {
    for (e = e.child; e !== null; )
      zd(l, t, e), e = e.sibling;
  }
  function zd(l, t, e) {
    if (Nt && typeof Nt.onCommitFiberUnmount == "function")
      try {
        Nt.onCommitFiberUnmount(Nu, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        ml || lt(e, t), $t(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && !ml && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        ml || lt(e, t), en(e);
        var a = Ol, u = bt;
        Pe(e.type) && (Ol = e.stateNode, bt = !1), $t(
          l,
          t,
          e
        ), Mm(
          e.stateNode,
          e.type,
          e.memoizedProps
        ), Ol = a, bt = u;
        break;
      case 5:
        ml || lt(e, t), en(e);
      case 6:
        if (e.tag === 6 && en(e), a = Ol, u = bt, Ol = null, $t(
          l,
          t,
          e
        ), Ol = a, bt = u, Ol !== null)
          if (bt)
            try {
              (Ol.nodeType === 9 ? Ol.body : Ol.nodeName === "HTML" ? Ol.ownerDocument.body : Ol).removeChild(e.stateNode), sl = !0;
            } catch (n) {
              gl(
                e,
                t,
                n
              );
            }
          else
            try {
              Ol.removeChild(e.stateNode), sl = !0;
            } catch (n) {
              gl(
                e,
                t,
                n
              );
            }
        break;
      case 18:
        Ol !== null && (bt ? (l = Ol, ym(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), Tu(l)) : ym(Ol, e.stateNode));
        break;
      case 4:
        a = Ol, u = bt, Ol = e.stateNode.containerInfo, bt = !0, $t(
          l,
          t,
          e
        ), Ol = a, bt = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ke(2, e, t), ml || Ke(4, e, t), $t(
          l,
          t,
          e
        );
        break;
      case 1:
        ml || (lt(e, t), a = e.stateNode, typeof a.componentWillUnmount == "function" && md(
          e,
          t,
          a
        )), $t(
          l,
          t,
          e
        );
        break;
      case 21:
        $t(
          l,
          t,
          e
        );
        break;
      case 22:
        ml = (a = ml) || e.memoizedState !== null, $t(
          l,
          t,
          e
        ), ml = a;
        break;
      case 30:
        lt(e, t), $t(
          l,
          t,
          e
        );
        break;
      case 7:
        ml || lt(e, t), $t(
          l,
          t,
          e
        );
        break;
      default:
        $t(
          l,
          t,
          e
        );
    }
  }
  function Ad(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Tu(l);
      } catch (e) {
        gl(t, t.return, e);
      }
    }
  }
  function Od(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Tu(l);
      } catch (e) {
        gl(t, t.return, e);
      }
  }
  function Kv(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new _d()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new _d()), t;
      default:
        throw Error(y(435, l.tag));
    }
  }
  function Ei(l, t) {
    var e = Kv(l);
    t.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var u = u0.bind(null, l, a);
        a.then(u, u);
      }
    });
  }
  function ht(l, t, e) {
    var a = t.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var n = a[u], i = l, s = t, f = s;
        l: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (Pe(f.type)) {
                Ol = f.stateNode, bt = !1;
                break l;
              }
              break;
            case 5:
              Ol = f.stateNode, bt = !1;
              break l;
            case 3:
            case 4:
              Ol = f.stateNode.containerInfo, bt = !0;
              break l;
          }
          f = f.return;
        }
        if (Ol === null) throw Error(y(160));
        zd(i, s, n), Ol = null, bt = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Dd(t, l, e), t = t.sibling;
  }
  var Wt = null;
  function Dd(l, t, e) {
    var a = l.alternate, u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (u & 4 && (a = l.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var n = 0; n < a.length; n++) {
            var i = a[n];
            i.ref.impl = i.nextImpl;
          }
        ht(t, l, e), vt(l), u & 4 && (Ke(3, l, l.return), tn(3, l), Ke(5, l, l.return));
        break;
      case 1:
        ht(t, l, e), vt(l), u & 512 && (ml || a === null || lt(a, a.return)), u & 64 && Fl && (l = l.updateQueue, l !== null && (t = l.callbacks, t !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? t : e.concat(t))));
        break;
      case 26:
        if (n = Wt, ht(t, l, e), vt(l), u & 512 && (ml || a === null || lt(a, a.return)), u & 4)
          if (u = a !== null ? a.memoizedState : null, e = l.memoizedState, a === null)
            if (e === null)
              if (l.stateNode === null)
                if (Fl)
                  l.stateNode = mm(
                    l.type,
                    l.memoizedProps,
                    t.containerInfo,
                    l
                  );
                else {
                  l: {
                    t = l.type, e = l.memoizedProps, u = n.ownerDocument || n;
                    t: switch (t) {
                      case "title":
                        a = u.getElementsByTagName("title")[0], (!a || a[Ou] || a[Wl] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = u.createElement(t), u.head.insertBefore(
                          a,
                          u.querySelector("head > title")
                        )), tt(a, t, e), a[Wl] = l, Kl(a), t = a;
                        break l;
                      case "link":
                        if (n = Bm(
                          "link",
                          "href",
                          u
                        ).get(t + (e.href || ""))) {
                          for (i = 0; i < n.length; i++)
                            if (a = n[i], a.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && a.getAttribute("rel") === (e.rel == null ? null : e.rel) && a.getAttribute("title") === (e.title == null ? null : e.title) && a.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                              n.splice(i, 1);
                              break t;
                            }
                        }
                        a = u.createElement(t), tt(a, t, e), u.head.appendChild(a);
                        break;
                      case "meta":
                        if (n = Bm(
                          "meta",
                          "content",
                          u
                        ).get(t + (e.content || ""))) {
                          for (i = 0; i < n.length; i++)
                            if (a = n[i], a.getAttribute("content") === (e.content == null ? null : "" + e.content) && a.getAttribute("name") === (e.name == null ? null : e.name) && a.getAttribute("property") === (e.property == null ? null : e.property) && a.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && a.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                              n.splice(i, 1);
                              break t;
                            }
                        }
                        a = u.createElement(t), tt(a, t, e), u.head.appendChild(a);
                        break;
                      default:
                        throw Error(y(468, t));
                    }
                    a[Wl] = l, Kl(a), t = a;
                  }
                  l.stateNode = t;
                }
              else
                Fl || Sf(n, l.type, l.stateNode);
            else
              l.stateNode = Hm(
                n,
                e,
                l.memoizedProps
              );
          else
            u !== e ? (u === null ? (t = a.stateNode, t === null || ml || t.parentNode.removeChild(t)) : u.count--, e === null ? Fl || Sf(n, l.type, l.stateNode) : Hm(n, e, l.memoizedProps)) : e === null && l.stateNode !== null && Ts(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        ht(t, l, e), vt(l), u & 512 && (ml || a === null || lt(a, a.return)), a !== null && u & 4 && Ts(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (n = se, se = !1, ht(t, l, e), se = n, vt(l), u & 512 && (ml || a === null || lt(a, a.return)), l.flags & 32) {
          t = l.stateNode;
          try {
            Ga(t, ""), sl = !0;
          } catch (b) {
            gl(l, l.return, b);
          }
        }
        u & 4 && l.stateNode != null && (t = l.memoizedProps, Ts(
          l,
          t,
          a !== null ? a.memoizedProps : t
        )), u & 1024 && (Ds = !0);
        break;
      case 6:
        if (ht(t, l, e), vt(l), u & 4) {
          if (l.stateNode === null)
            throw Error(y(162));
          t = l.memoizedProps, e = l.stateNode;
          try {
            e.nodeValue = t, sl = !0;
          } catch (b) {
            gl(l, l.return, b);
          }
        }
        break;
      case 3:
        if (sl = !1, Qi = null, n = Wt, Wt = mn(t.containerInfo), ht(t, l, e), Wt = n, vt(l), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Tu(t.containerInfo);
          } catch (b) {
            gl(l, l.return, b);
          }
        Ds && (Ds = !1, Md(l)), sl = !1;
        break;
      case 4:
        u = se, se = Fl, a = Wf(), n = Wt, Wt = mn(
          l.stateNode.containerInfo
        ), ht(t, l, e), vt(l), Wt = n, sl && an && (_i = !0), sl = a, se = u;
        break;
      case 12:
        ht(t, l, e), vt(l);
        break;
      case 31:
        ht(t, l, e), vt(l), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, Ei(l, t)));
        break;
      case 13:
        ht(t, l, e), vt(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Ai = Et()), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, Ei(l, t)));
        break;
      case 22:
        n = l.memoizedState !== null, i = a !== null && a.memoizedState !== null;
        var s = Fl, f = ml, v = se;
        Fl = s || n, se = v || n, ml = f || i, ht(t, l, e), ml = f, se = v, Fl = s, vt(l), u & 8192 && (t = l.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, !n || a === null || i || Fl || ml || (t = i || ml, e = Fl, a = ml, Fl = n || Fl, ml = t, Je(l, 2), Fl = e, ml = a), !n && se || Cs(l, n)), u & 4 && (t = l.updateQueue, t !== null && (e = t.retryQueue, e !== null && (t.retryQueue = null, Ei(l, e))));
        break;
      case 19:
        ht(t, l, e), vt(l), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, Ei(l, t)));
        break;
      case 30:
        u & 512 && (ml || a === null || lt(a, a.return)), u = Wf(), n = an, i = (e & 335544064) === e, s = l.memoizedProps, an = i && Se(
          s.default,
          s.update
        ) !== "none", ht(t, l, e), vt(l), i && a !== null && sl && (l.flags |= 4), an = n, sl = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (ml || a === null || lt(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = l);
      default:
        ht(t, l, e), vt(l);
    }
  }
  function vt(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, a = l.return; a !== null; ) {
          if (vd(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var u = l.return; u !== null; ) {
          if (js(u)) {
            var n = u.stateNode;
            a === null ? a = [n] : a.push(n);
          }
          if (bs(u)) break;
          u = u.return;
        }
        var i = a;
        if (e == null) throw Error(y(160));
        switch (e.tag) {
          case 27:
            var s = e.stateNode, f = _s(l);
            bi(
              l,
              f,
              s,
              i
            );
            break;
          case 5:
            var v = e.stateNode;
            e.flags & 32 && (Ga(v, ""), e.flags &= -33);
            var b = _s(l);
            bi(
              l,
              b,
              v,
              i
            );
            break;
          case 3:
          case 4:
            var T = e.stateNode.containerInfo, m = _s(l);
            ps(
              l,
              m,
              T,
              i
            );
            break;
          default:
            throw Error(y(161));
        }
      } catch (S) {
        gl(l, l.return, S);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function Md(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        Md(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, xu = !0, t.reset(), xu = !1), l = l.sibling;
      }
  }
  function uu(l, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Cd(t, l), t = t.sibling;
    else Td(t);
  }
  function Cd(l, t) {
    var e = l.alternate;
    if (e === null) Es(l, !1);
    else
      switch (l.tag) {
        case 3:
          if (Ms = fe = !1, Sd(), uu(t, l), !fe && !_i) {
            if (l = ie, l !== null)
              for (var a = 0; a < l.length; a += 3) {
                e = l[a];
                var u = l[a + 1];
                bm(e, l[a + 2]), e = e.ownerDocument.documentElement, e !== null && e.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + u + ")"
                  }
                );
              }
            l = t.containerInfo, l = l.nodeType === 9 ? l.documentElement : l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "" && (l.style.viewTransitionName = "none", l.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), l.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Ms = !0;
          }
          ie = null;
          break;
        case 5:
          uu(t, l);
          break;
        case 4:
          a = fe, fe = !1, uu(t, l), fe && (_i = !0), fe = a;
          break;
        case 22:
          l.memoizedState === null && (e.memoizedState !== null ? Es(l, !1) : uu(t, l));
          break;
        case 30:
          a = fe, u = Sd(), fe = !1, uu(t, l), fe && (l.flags |= 4);
          var n = l.memoizedProps, i = l.stateNode;
          t = ge(n, i), i = ge(e.memoizedProps, i);
          var s = Se(n.default, n.update);
          s === "none" ? t = !1 : (n = e.memoizedState, e.memoizedState = null, e = l.child, St = 0, t = Os(
            l,
            e,
            t,
            i,
            s,
            n,
            !0
          ), St !== (n === null ? 0 : n.length) && (l.flags |= 32)), (l.flags & 4) !== 0 && t ? (ou(
            l,
            l.memoizedProps.onUpdate
          ), ie = u) : u !== null && (u.push.apply(u, ie), ie = u), fe = (l.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          uu(t, l);
      }
  }
  function re(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        pd(l, t.alternate, t), t = t.sibling;
  }
  function Je(l, t) {
    for (l = l.child; l !== null; ) {
      var e = l, a = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ke(4, e, e.return), Je(
            e,
            a
          );
          break;
        case 1:
          lt(e, e.return);
          var u = e.stateNode;
          typeof u.componentWillUnmount == "function" && md(
            e,
            e.return,
            u
          ), Je(
            e,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && Mm(
            e.stateNode,
            e.type,
            e.memoizedProps
          );
        case 5:
          lt(e, e.return), e.tag !== 5 && e.tag !== 27 || en(e), Je(
            e,
            a
          );
          break;
        case 6:
          en(e);
          break;
        case 26:
          lt(e, e.return), u = e.stateNode, e.memoizedState !== null || u === null || ml || u.parentNode.removeChild(u), Je(
            e,
            a
          );
          break;
        case 22:
          e.memoizedState === null && Je(
            e,
            a
          );
          break;
        case 30:
          lt(e, e.return), Je(
            e,
            a
          );
          break;
        case 7:
          lt(e, e.return);
        default:
          Je(
            e,
            a
          );
      }
      l = l.sibling;
    }
  }
  function kt(l, t, e) {
    for (e = (t.subtreeFlags & 8772) !== 0 ? e : e & -2, t = t.child; t !== null; ) {
      var a = t.alternate, u = l, n = t, i = n.flags, s = (e & 1) !== 0;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          kt(
            u,
            n,
            e
          ), tn(4, n);
          break;
        case 1:
          if (kt(
            u,
            n,
            e
          ), a = n, u = a.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (b) {
              gl(a, a.return, b);
            }
          if (a = n, u = a.updateQueue, u !== null) {
            var f = a.stateNode;
            try {
              var v = u.shared.hiddenCallbacks;
              if (v !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < v.length; u++)
                  Pr(v[u], f);
            } catch (b) {
              gl(a, a.return, b);
            }
          }
          s && i & 64 && dd(n), ne(n, n.return);
          break;
        case 27:
          (e & 2) !== 0 && yd(n);
        case 5:
          n.tag !== 5 && n.tag !== 27 || hd(n), kt(
            u,
            n,
            e
          ), s && a === null && i & 4 && xs(n), ne(n, n.return);
          break;
        case 6:
          hd(n);
          break;
        case 26:
          f = n.stateNode, n.memoizedState !== null || f === null || Fl || Sf(
            mn(f.ownerDocument),
            n.type,
            f
          ), kt(
            u,
            n,
            e
          ), s && a === null && i & 4 && xs(n), ne(n, n.return);
          break;
        case 12:
          kt(
            u,
            n,
            e
          );
          break;
        case 31:
          kt(
            u,
            n,
            e
          ), s && i & 4 && Ad(u, n);
          break;
        case 13:
          kt(
            u,
            n,
            e
          ), s && i & 4 && Od(u, n);
          break;
        case 22:
          n.memoizedState === null && kt(
            u,
            n,
            e
          ), ne(n, n.return);
          break;
        case 30:
          kt(
            u,
            n,
            e
          ), ne(n, n.return);
          break;
        case 7:
          ne(n, n.return);
        default:
          kt(
            u,
            n,
            e
          );
      }
      t = t.sibling;
    }
  }
  function Us(l, t) {
    var e = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== e && (l != null && l.refCount++, e != null && Vu(e));
  }
  function qs(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Vu(l));
  }
  function Zt(l, t, e, a) {
    var u = (e & 335544064) === e;
    if (t.subtreeFlags & (u ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Rd(
          l,
          t,
          e,
          a
        ), t = t.sibling;
    else u && xd(t);
  }
  function Rd(l, t, e, a) {
    var u = (e & 335544064) === e;
    u && t.alternate === null && t.return !== null && t.return.alternate !== null && Ti(t);
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Zt(
          l,
          t,
          e,
          a
        ), n & 2048 && tn(9, t);
        break;
      case 1:
        Zt(
          l,
          t,
          e,
          a
        );
        break;
      case 3:
        Zt(
          l,
          t,
          e,
          a
        ), u && Ms && (l = l.containerInfo, l = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, l.style.viewTransitionName === "root" && (l.style.viewTransitionName = ""), l = l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "none" && (l.style.viewTransitionName = "")), n & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== n && (t.refCount++, n != null && Vu(n)));
        break;
      case 12:
        if (n & 2048) {
          Zt(
            l,
            t,
            e,
            a
          ), n = t.stateNode;
          try {
            var i = t.memoizedProps, s = i.id, f = i.onPostCommit;
            typeof f == "function" && f(
              s,
              t.alternate === null ? "mount" : "update",
              n.passiveEffectDuration,
              -0
            );
          } catch (v) {
            gl(t, t.return, v);
          }
        } else
          Zt(
            l,
            t,
            e,
            a
          );
        break;
      case 31:
        Zt(
          l,
          t,
          e,
          a
        );
        break;
      case 13:
        Zt(
          l,
          t,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, s = t.alternate, t.memoizedState !== null ? (u && s !== null && s.memoizedState === null && Ti(s), i._visibility & 2 ? Zt(
          l,
          t,
          e,
          a
        ) : un(
          l,
          t
        )) : (u && s !== null && s.memoizedState !== null && Ti(t), i._visibility & 2 ? Zt(
          l,
          t,
          e,
          a
        ) : (i._visibility |= 2, nu(
          l,
          t,
          e,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), n & 2048 && Us(s, t);
        break;
      case 24:
        Zt(
          l,
          t,
          e,
          a
        ), n & 2048 && qs(t.alternate, t);
        break;
      case 30:
        u && (n = t.alternate, n !== null && (ce(n.child, !0), ce(t.child, !0))), Zt(
          l,
          t,
          e,
          a
        );
        break;
      default:
        Zt(
          l,
          t,
          e,
          a
        );
    }
  }
  function nu(l, t, e, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, i = t, s = e, f = a, v = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          nu(
            n,
            i,
            s,
            f,
            u
          ), tn(8, i);
          break;
        case 23:
          break;
        case 22:
          var b = i.stateNode;
          i.memoizedState !== null ? b._visibility & 2 ? nu(
            n,
            i,
            s,
            f,
            u
          ) : un(
            n,
            i
          ) : (b._visibility |= 2, nu(
            n,
            i,
            s,
            f,
            u
          )), u && v & 2048 && Us(
            i.alternate,
            i
          );
          break;
        case 24:
          nu(
            n,
            i,
            s,
            f,
            u
          ), u && v & 2048 && qs(i.alternate, i);
          break;
        default:
          nu(
            n,
            i,
            s,
            f,
            u
          );
      }
      t = t.sibling;
    }
  }
  function un(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l, a = t, u = a.flags;
        switch (a.tag) {
          case 22:
            un(e, a), u & 2048 && Us(
              a.alternate,
              a
            );
            break;
          case 24:
            un(e, a), u & 2048 && qs(a.alternate, a);
            break;
          default:
            un(e, a);
        }
        t = t.sibling;
      }
  }
  var pa = 8192;
  function Ea(l, t, e) {
    if (l.subtreeFlags & pa)
      for (l = l.child; l !== null; )
        Ud(
          l,
          t,
          e
        ), l = l.sibling;
  }
  function Ud(l, t, e) {
    switch (l.tag) {
      case 26:
        Ea(
          l,
          t,
          e
        ), l.flags & pa && (l.memoizedState !== null ? I0(
          e,
          Wt,
          l.memoizedState,
          l.memoizedProps
        ) : (l = l.stateNode, (t & 335544128) === t && Xm(e, l)));
        break;
      case 5:
        Ea(
          l,
          t,
          e
        ), l.flags & pa && (l = l.stateNode, (t & 335544128) === t && Xm(e, l));
        break;
      case 3:
      case 4:
        var a = Wt;
        Wt = mn(l.stateNode.containerInfo), Ea(
          l,
          t,
          e
        ), Wt = a;
        break;
      case 22:
        l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = pa, pa = 16777216, Ea(
          l,
          t,
          e
        ), pa = a) : Ea(
          l,
          t,
          e
        ));
        break;
      case 30:
        if ((l.flags & pa) !== 0 && (a = l.memoizedProps.name, a != null && a !== "auto")) {
          var u = l.stateNode;
          u.paired = null, Mt === null && (Mt = /* @__PURE__ */ new Map()), Mt.set(a, u);
        }
        Ea(
          l,
          t,
          e
        );
        break;
      default:
        Ea(
          l,
          t,
          e
        );
    }
  }
  function qd(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function nn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          $l = a, Bd(
            a,
            l
          );
        }
      qd(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        Hd(l), l = l.sibling;
  }
  function Hd(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        nn(l), l.flags & 2048 && Ke(9, l, l.return);
        break;
      case 3:
        nn(l);
        break;
      case 12:
        nn(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, Ni(l)) : nn(l);
        break;
      default:
        nn(l);
    }
  }
  function Ni(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          $l = a, Bd(
            a,
            l
          );
        }
      qd(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          Ke(8, t, t.return), Ni(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, Ni(t));
          break;
        default:
          Ni(t);
      }
      l = l.sibling;
    }
  }
  function Bd(l, t) {
    for (; $l !== null; ) {
      var e = $l;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Ke(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Vu(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, $l = a;
      else
        l: for (e = l; $l !== null; ) {
          a = $l;
          var u = a.sibling, n = a.return;
          if (Nd(a), a === e) {
            $l = null;
            break l;
          }
          if (u !== null) {
            u.return = n, $l = u;
            break l;
          }
          $l = n;
        }
    }
  }
  var Jv = {
    getCacheForType: function(l) {
      var t = kl(Bl), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    },
    cacheSignal: function() {
      return kl(Bl).controller.signal;
    }
  }, Fv = typeof WeakMap == "function" ? WeakMap : Map, fl = 0, Tl = null, k = null, tl = 0, yl = 0, Ct = null, Fe = !1, iu = !1, Hs = !1, ze = 0, Rl = 0, $e = 0, Na = 0, zi = 0, Rt = 0, cu = 0, cn = null, jt = null, Bs = !1, Ai = 0, Yd = 0, Oi = 1 / 0, Di = null, We = null, Dl = 0, It = null, za = null, oe = 0, Ys = 0, Gs = null, Gd = null, su = null, fu = null, ru = null, sn = 0, Mi = null;
  function Ut() {
    return (fl & 2) !== 0 && tl !== 0 ? tl & -tl : A.T !== null ? $s() : Xf();
  }
  function Qd() {
    if (Rt === 0)
      if ((tl & 536870912) === 0 || W) {
        var l = En;
        En <<= 1, (En & 3932160) === 0 && (En = 262144), Rt = l;
      } else Rt = 536870912;
    return l = Il.current, l !== null && (l.flags |= 32), Rt;
  }
  function ou(l, t) {
    if (t != null) {
      var e = l.stateNode, a = e.ref;
      a === null && (a = e.ref = jm(
        ge(l.memoizedProps, e)
      )), fu === null && (fu = []), fu.push(t.bind(null, a));
    }
  }
  function xt(l, t, e) {
    (l === Tl && (yl === 2 || yl === 9) || l.cancelPendingCommit !== null) && (du(l, 0), ke(
      l,
      tl,
      Rt,
      !1
    )), Au(l, e), ((fl & 2) === 0 || l !== Tl) && (l === Tl && ((fl & 2) === 0 && (Na |= e), Rl === 4 && ke(
      l,
      tl,
      Rt,
      !1
    )), de(l));
  }
  function Xd(l, t, e) {
    if ((fl & 6) !== 0) throw Error(y(327));
    var a = !e && (t & 127) === 0 && (t & l.expiredLanes) === 0 || zu(l, t), u = a ? kv(l, t) : Xs(l, t, !0), n = a;
    do {
      if (u === 0) {
        iu && !a && ke(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, n && !$v(e)) {
          u = Xs(l, t, !1), n = !1;
          continue;
        }
        if (u === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var i = 0;
          else
            i = l.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
          if (i !== 0) {
            t = i;
            l: {
              var s = l;
              u = cn;
              var f = s.current.memoizedState.isDehydrated;
              if (f && (du(s, i).flags |= 256), i = Xs(
                s,
                i,
                !1
              ), i !== 2 && i !== 6) {
                if (Hs && !f) {
                  s.errorRecoveryDisabledLanes |= n, Na |= n, u = 4;
                  break l;
                }
                n = jt, jt = u, n !== null && (jt === null ? jt = n : jt.push.apply(
                  jt,
                  n
                ));
              }
              u = i;
            }
            if (n = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          du(l, 0), ke(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, n = u, n) {
            case 0:
            case 1:
              throw Error(y(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              ke(
                a,
                t,
                Rt,
                !Fe
              );
              break l;
            case 2:
              jt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(y(329));
          }
          if ((t & 62914560) === t && (u = Ai + 300 - Et(), 10 < u)) {
            if (ke(
              a,
              t,
              Rt,
              !Fe
            ), zn(a, 0, !0) !== 0) break l;
            oe = t, a.timeoutHandle = cf(
              Vd.bind(
                null,
                a,
                e,
                jt,
                Di,
                Bs,
                t,
                Rt,
                Na,
                cu,
                Fe,
                n,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break l;
          }
          Vd(
            a,
            e,
            jt,
            Di,
            Bs,
            t,
            Rt,
            Na,
            cu,
            Fe,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    de(l);
  }
  function Vd(l, t, e, a, u, n, i, s, f, v, b, T, m, S) {
    l.timeoutHandle = -1;
    var N = t.subtreeFlags, D = (n & 335544064) === n;
    if (T = null, (D || N & 8192 || (N & 16785408) === 16785408) && (T = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: ee
    }, Mt = null, Ud(
      t,
      n,
      T
    ), D && (N = T, D = l.containerInfo, D = (D.nodeType === 9 ? D : D.ownerDocument).__reactViewTransition, D != null && (N.count++, N.waitingForViewTransition = !0, N = yn.bind(N), D.finished.then(N, N))), N = (n & 62914560) === n ? Ai - Et() : (n & 4194048) === n ? Yd - Et() : 0, N = P0(
      T,
      N
    ), N !== null)) {
      oe = n, l.cancelPendingCommit = N(
        Wd.bind(
          null,
          l,
          t,
          n,
          e,
          a,
          u,
          i,
          s,
          f,
          v,
          b,
          T,
          null,
          m,
          S
        )
      ), ke(l, n, i, !v);
      return;
    }
    Wd(
      l,
      t,
      n,
      e,
      a,
      u,
      i,
      s,
      f,
      v,
      b,
      T
    );
  }
  function $v(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var a = 0; a < e.length; a++) {
          var u = e[a], n = u.getSnapshot;
          u = u.value;
          try {
            if (!Ot(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (e = t.child, t.subtreeFlags & 16384 && e !== null)
        e.return = t, t = e;
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function ke(l, t, e, a) {
    t = Hf(l, t), t &= ~zi, t &= ~Na, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var u = t; 0 < u; ) {
      var n = 31 - zt(u), i = 1 << n;
      a[n] = -1, u &= ~i;
    }
    e !== 0 && Yf(l, e, t);
  }
  function Ci() {
    return (fl & 6) === 0 ? (fn(0), !1) : !0;
  }
  function Qs() {
    if (k !== null) {
      if (yl === 0)
        var l = k.return;
      else
        l = k, xe = ha = null, Fc(l), Ia = null, wu = 0, l = k;
      for (; l !== null; )
        od(l.alternate, l), l = l.return;
      k = null;
    }
  }
  function du(l, t) {
    var e = l.timeoutHandle;
    return e !== -1 && (l.timeoutHandle = -1, b0(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), oe = 0, Qs(), Tl = l, k = e = be(l.current, null), tl = t, yl = 0, Ct = null, Fe = !1, iu = zu(l, t), Hs = !1, cu = Rt = zi = Na = $e = Rl = 0, jt = cn = null, Bs = !1, ze = Hf(l, t), Qn(), e;
  }
  function Ld(l, t) {
    w = null, A.H = oi, t === ka || t === kn ? (t = $r(), yl = 3) : t === qc ? (t = $r(), yl = 4) : yl = t === fs ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Ct = t, k === null && (Rl = 1, di(
      l,
      Qt(t, l.current)
    ));
  }
  function Zd() {
    var l = Il.current;
    return l === null ? !0 : (tl & 4194048) === tl ? st === null : (tl & 62914560) === tl || (tl & 536870912) !== 0 ? l === st : !1;
  }
  function wd() {
    var l = A.H;
    return A.H = oi, l === null ? oi : l;
  }
  function Kd() {
    var l = A.A;
    return A.A = Jv, l;
  }
  function Ri() {
    Rl = 4, Fe || (tl & 4194048) !== tl && Il.current !== null || (iu = !0), ($e & 134217727) === 0 && (Na & 134217727) === 0 || Tl === null || ke(
      Tl,
      tl,
      Rt,
      !1
    );
  }
  function Xs(l, t, e) {
    var a = fl;
    fl |= 2;
    var u = wd(), n = Kd();
    (Tl !== l || tl !== t) && (Di = null, du(l, t)), t = !1;
    var i = Rl;
    l: do
      try {
        if (yl !== 0 && k !== null) {
          var s = k, f = Ct;
          switch (yl) {
            case 8:
              Qs(), i = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              Il.current === null && (t = !0);
              var v = yl;
              if (yl = 0, Ct = null, mu(l, s, f, v), e && iu) {
                i = 0;
                break l;
              }
              break;
            default:
              v = yl, yl = 0, Ct = null, mu(l, s, f, v);
          }
        }
        Wv(), i = Rl;
        break;
      } catch (b) {
        Ld(l, b);
      }
    while (!0);
    return t && l.shellSuspendCounter++, xe = ha = null, fl = a, A.H = u, A.A = n, k === null && (Tl = null, tl = 0, Qn()), i;
  }
  function Wv() {
    for (; k !== null; ) Jd(k);
  }
  function kv(l, t) {
    var e = fl;
    fl |= 2;
    var a = wd(), u = Kd();
    Tl !== l || tl !== t ? (Di = null, Oi = Et() + 500, du(l, t)) : iu = zu(
      l,
      t
    );
    l: do
      try {
        if (yl !== 0 && k !== null) {
          t = k;
          var n = Ct;
          t: switch (yl) {
            case 1:
              yl = 0, Ct = null, mu(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Jr(n)) {
                yl = 0, Ct = null, Fd(t);
                break;
              }
              t = function() {
                yl !== 2 && yl !== 9 || Tl !== l || (yl = 7), de(l);
              }, n.then(t, t);
              break l;
            case 3:
              yl = 7;
              break l;
            case 4:
              yl = 5;
              break l;
            case 7:
              Jr(n) ? (yl = 0, Ct = null, Fd(t)) : (yl = 0, Ct = null, mu(l, t, n, 7));
              break;
            case 5:
              var i = null;
              switch (k.tag) {
                case 26:
                  i = k.memoizedState;
                case 5:
                case 27:
                  var s = k;
                  if (i ? Gm(i) : s.stateNode.complete) {
                    yl = 0, Ct = null;
                    var f = s.sibling;
                    if (f !== null) k = f;
                    else {
                      var v = s.return;
                      v !== null ? (k = v, Ui(v)) : k = null;
                    }
                    break t;
                  }
              }
              yl = 0, Ct = null, mu(l, t, n, 5);
              break;
            case 6:
              yl = 0, Ct = null, mu(l, t, n, 6);
              break;
            case 8:
              Qs(), Rl = 6;
              break l;
            default:
              throw Error(y(462));
          }
        }
        Iv();
        break;
      } catch (b) {
        Ld(l, b);
      }
    while (!0);
    return xe = ha = null, A.H = a, A.A = u, fl = e, k !== null ? 0 : (Tl = null, tl = 0, Qn(), Rl);
  }
  function Iv() {
    for (; k !== null && !vh(); )
      Jd(k);
  }
  function Jd(l) {
    var t = fd(l.alternate, l, ze);
    l.memoizedProps = l.pendingProps, t === null ? Ui(l) : k = t;
  }
  function Fd(l) {
    var t = l, e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = ed(
          e,
          t,
          t.pendingProps,
          t.type,
          void 0,
          tl
        );
        break;
      case 11:
        t = ed(
          e,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          tl
        );
        break;
      case 5:
        Fc(t);
        var a = t;
        a === Jl && (W ? (Kn(a), a.tag === 5 && a.stateNode != null && (pl = a.stateNode)) : (Kn(a), W = !0));
      default:
        od(e, t), t = k = Hr(t, ze), t = fd(e, t, ze);
    }
    l.memoizedProps = l.pendingProps, t === null ? Ui(l) : k = t;
  }
  function mu(l, t, e, a) {
    xe = ha = null, Fc(t), Ia = null, wu = 0;
    var u = t.return;
    try {
      if (Gv(
        l,
        u,
        t,
        e,
        tl
      )) {
        Rl = 1, di(
          l,
          Qt(e, l.current)
        ), k = null;
        return;
      }
    } catch (n) {
      if (u !== null) throw k = u, n;
      Rl = 1, di(
        l,
        Qt(e, l.current)
      ), k = null;
      return;
    }
    t.flags & 32768 ? (W || a === 1 ? l = !0 : iu || (tl & 536870912) !== 0 ? l = !1 : (Fe = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Il.current, a !== null && a.tag === 13 && (a.flags |= 16384))), $d(t, l)) : Ui(t);
  }
  function Ui(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        $d(
          t,
          Fe
        );
        return;
      }
      l = t.return;
      var e = Lv(
        t.alternate,
        t,
        ze
      );
      if (e !== null) {
        k = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        k = t;
        return;
      }
      k = t = l;
    } while (t !== null);
    Rl === 0 && (Rl = 5);
  }
  function $d(l, t) {
    do {
      var e = Zv(l.alternate, l);
      if (e !== null) {
        e.flags &= 32767, k = e;
        return;
      }
      if (e = l.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (l = l.sibling, l !== null)) {
        k = l;
        return;
      }
      k = l = e;
    } while (l !== null);
    Rl = 6, k = null;
  }
  function Wd(l, t, e, a, u, n, i, s, f, v, b, T) {
    l.cancelPendingCommit = null;
    do
      qi();
    while (Dl !== 0);
    if ((fl & 6) !== 0) throw Error(y(327));
    if (t !== null) {
      if (t === l.current) throw Error(y(177));
      l === Tl && (k = Tl = null, tl = 0), za = t, It = l, oe = e, Gs = u, Gd = a, Pv(
        l,
        t,
        e,
        i,
        s,
        f,
        T
      );
    }
  }
  function Pv(l, t, e, a, u, n, i) {
    var s = t.lanes | t.childLanes;
    if (Ys = s, s |= Tc, Eh(
      l,
      e,
      s,
      a,
      u,
      n
    ), fu = null, (e & 335544064) === e ? (ru = zv(l), a = 10262) : (ru = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, n0(_n, function() {
      return ws(), null;
    })) : (l.callbackNode = null, l.callbackPriority = 0), ji = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = A.T, A.T = null, u = X.p, X.p = 2, n = fl, fl |= 4;
      try {
        wv(l, t, e);
      } finally {
        fl = n, X.p = u, A.T = a;
      }
    }
    Dl = 1, ji ? su = E0(
      i,
      l.containerInfo,
      ru,
      Vs,
      Ls,
      t0,
      Zs,
      ws,
      l0
    ) : (Vs(), Ls(), Zs());
  }
  function l0(l) {
    if (Dl !== 0) {
      var t = It.onRecoverableError;
      t(l, { componentStack: null });
    }
  }
  function t0() {
    Dl === 3 && (Dl = 0, Cd(za, It), Dl = 4);
  }
  function Vs() {
    if (Dl === 1) {
      Dl = 0;
      var l = It, t = za, e = oe, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = A.T, A.T = null;
        var u = X.p;
        X.p = 2;
        var n = fl;
        fl |= 4;
        try {
          an = _i = !1, Dd(t, l, e), e = af;
          var i = Nr(l.containerInfo), s = e.focusedElem, f = e.selectionRange;
          if (i !== s && s && s.ownerDocument && Er(
            s.ownerDocument.documentElement,
            s
          )) {
            if (f !== null && gc(s)) {
              var v = f.start, b = f.end;
              if (b === void 0 && (b = v), "selectionStart" in s)
                s.selectionStart = v, s.selectionEnd = Math.min(
                  b,
                  s.value.length
                );
              else {
                var T = s.ownerDocument || document, m = T && T.defaultView || window;
                if (m.getSelection) {
                  var S = m.getSelection(), N = s.textContent.length, D = Math.min(f.start, N), K = f.end === void 0 ? D : Math.min(f.end, N);
                  !S.extend && D > K && (i = K, K = D, D = i);
                  var h = pr(
                    s,
                    D
                  ), o = pr(
                    s,
                    K
                  );
                  if (h && o && (S.rangeCount !== 1 || S.anchorNode !== h.node || S.anchorOffset !== h.offset || S.focusNode !== o.node || S.focusOffset !== o.offset)) {
                    var g = T.createRange();
                    g.setStart(h.node, h.offset), S.removeAllRanges(), D > K ? (S.addRange(g), S.extend(o.node, o.offset)) : (g.setEnd(o.node, o.offset), S.addRange(g));
                  }
                }
              }
            }
            for (T = [], S = s; S = S.parentNode; )
              S.nodeType === 1 && T.push({
                element: S,
                left: S.scrollLeft,
                top: S.scrollTop
              });
            for (typeof s.focus == "function" && s.focus(), s = 0; s < T.length; s++) {
              var x = T[s];
              x.element.scrollLeft = x.left, x.element.scrollTop = x.top;
            }
          }
          xu = !!ef, af = ef = null;
        } finally {
          fl = n, X.p = u, A.T = a;
        }
      }
      l.current = t, Dl = 2;
    }
  }
  function Ls() {
    if (Dl === 2) {
      Dl = 0;
      var l = It, t = za, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = A.T, A.T = null;
        var a = X.p;
        X.p = 2;
        var u = fl;
        fl |= 4;
        try {
          pd(l, t.alternate, t);
        } finally {
          fl = u, X.p = a, A.T = e;
        }
      }
      Dl = 3;
    }
  }
  function Zs() {
    if (Dl === 4 || Dl === 3) {
      Dl = 0;
      var l = su;
      su = null, yh();
      var t = It, e = za, a = oe, u = Gd, n = (a & 335544064) === a ? 10262 : 10256;
      if ((e.subtreeFlags & n) !== 0 || (e.flags & n) !== 0 ? Dl = 5 : (Dl = 0, za = It = null, kd(t, t.pendingLanes)), n = t.pendingLanes, n === 0 && (We = null), Pi(a), e = e.stateNode, Nt && typeof Nt.onCommitFiberRoot == "function")
        try {
          Nt.onCommitFiberRoot(
            Nu,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        e = A.T, n = X.p, X.p = 2, A.T = null;
        try {
          for (var i = t.onRecoverableError, s = 0; s < u.length; s++) {
            var f = u[s];
            i(f.value, {
              componentStack: f.stack
            });
          }
        } finally {
          A.T = e, X.p = n;
        }
      }
      if (u = fu, i = ru, ru = null, u !== null && (fu = null, i === null && (i = []), l !== null))
        for (f = 0; f < u.length; f++)
          e = (0, u[f])(
            i
          ), e !== void 0 && l.finished.finally(e);
      (oe & 3) !== 0 && qi(), de(t), n = t.pendingLanes, (a & 261930) !== 0 && (n & 42) !== 0 ? t === Mi ? sn++ : (sn = 0, Mi = t) : (sn = 0, Mi = null), fn(0);
    }
  }
  function kd(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Vu(t)));
  }
  function qi() {
    return su !== null && (su.skipTransition(), su = null), Vs(), Ls(), Zs(), ws();
  }
  function ws() {
    if (Dl !== 5) return !1;
    var l = It, t = Ys;
    Ys = 0;
    var e = Pi(oe), a = A.T, u = X.p;
    try {
      X.p = 32 > e ? 32 : e, A.T = null, e = Gs, Gs = null;
      var n = It, i = oe;
      if (Dl = 0, za = It = null, oe = 0, (fl & 6) !== 0) throw Error(y(331));
      var s = fl;
      if (fl |= 4, Hd(n.current), Rd(
        n,
        n.current,
        i,
        e
      ), fl = s, fn(0, !1), Nt && typeof Nt.onPostCommitFiberRoot == "function")
        try {
          Nt.onPostCommitFiberRoot(Nu, n);
        } catch {
        }
      return !0;
    } finally {
      X.p = u, A.T = a, kd(l, t);
    }
  }
  function Id(l, t, e) {
    t = Qt(e, t), t = ss(l.stateNode, t, 2), l = Ve(l, t, 2), l !== null && (Au(l, 2), de(l));
  }
  function gl(l, t, e) {
    if (l.tag === 3)
      Id(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Id(
            t,
            l,
            e
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (We === null || !We.has(a))) {
            l = Qt(e, l), e = Fo(2), a = Ve(t, e, 2), a !== null && ($o(
              e,
              a,
              t,
              l
            ), Au(a, 2), de(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Ks(l, t, e) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new Fv();
      var u = /* @__PURE__ */ new Set();
      a.set(t, u);
    } else
      u = a.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), a.set(t, u));
    u.has(e) || (Hs = !0, u.add(e), l = e0.bind(null, l, t, e), t.then(l, l));
  }
  function e0(l, t, e) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, Tl === l && (tl & e) === e && ((Rl === 4 || Rl === 3 && (tl & 62914560) === tl && 300 > Et() - Ai) && (fl & 2) === 0 ? du(l, 0) : zi |= e, cu === tl && (cu = 0)), de(l);
  }
  function Pd(l, t) {
    t === 0 && (t = Bf()), l = oa(l, t), l !== null && (Au(l, t), de(l));
  }
  function a0(l) {
    var t = l.memoizedState, e = 0;
    t !== null && (e = t.retryLane), Pd(l, e);
  }
  function u0(l, t) {
    var e = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var a = l.stateNode, u = l.memoizedState;
        u !== null && (e = u.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(y(314));
    }
    a !== null && a.delete(t), Pd(l, e);
  }
  function n0(l, t) {
    return Jt(l, t);
  }
  var hu = null, vu = null, Js = !1, Hi = !1, Fs = !1, Ie = 0;
  function de(l) {
    l !== vu && l.next === null && (vu === null ? hu = vu = l : vu = vu.next = l), Hi = !0, Js || (Js = !0, c0());
  }
  function fn(l, t) {
    if (!Fs && Hi) {
      Fs = !0;
      do
        for (var e = !1, a = hu; a !== null; ) {
          if (l !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes, s = a.pingedLanes;
              n = (1 << 31 - zt(42 | l) + 1) - 1, n &= u & ~(i & ~s), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (e = !0, am(a, n));
          } else
            n = tl, n = zn(
              a,
              a === Tl ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || zu(a, n) || (e = !0, am(a, n));
          a = a.next;
        }
      while (e);
      Fs = !1;
    }
  }
  function i0() {
    lm();
  }
  function lm() {
    Hi = Js = !1;
    var l = 0;
    Ie !== 0 && S0() && (l = Ie);
    for (var t = Et(), e = null, a = hu; a !== null; ) {
      var u = a.next, n = tm(a, t);
      n === 0 ? (a.next = null, e === null ? hu = u : e.next = u, u === null && (vu = e)) : (e = a, (l !== 0 || (n & 3) !== 0) && (Hi = !0)), a = u;
    }
    Dl !== 0 && Dl !== 5 || fn(l), Ie !== 0 && (Ie = 0);
  }
  function tm(l, t) {
    for (var e = l.suspendedLanes, a = l.pingedLanes, u = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - zt(n), s = 1 << i, f = u[i];
      f === -1 ? ((s & e) === 0 || (s & a) !== 0) && (u[i] = ph(s, t)) : f <= t && (l.expiredLanes |= s), n &= ~s;
    }
    if (t = Tl, e = tl, e = zn(
      l,
      l === t ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, e === 0 || l === t && (yl === 2 || yl === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Wi(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((e & 3) === 0 || zu(l, e)) {
      if (t = e & -e, t === l.callbackPriority) return t;
      switch (a !== null && Wi(a), Pi(e)) {
        case 2:
        case 8:
          e = Uf;
          break;
        case 32:
          e = _n;
          break;
        case 268435456:
          e = qf;
          break;
        default:
          e = _n;
      }
      return a = em.bind(null, l), e = Jt(e, a), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return a !== null && a !== null && Wi(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function em(l, t) {
    if (Dl !== 0 && Dl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (qi() && l.callbackNode !== e)
      return null;
    var a = tl;
    return a = zn(
      l,
      l === Tl ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (Xd(l, a, t), tm(l, Et()), l.callbackNode != null && l.callbackNode === e ? em.bind(null, l) : null);
  }
  function am(l, t) {
    if (qi()) return null;
    Xd(l, t, !0);
  }
  function c0() {
    j0(function() {
      (fl & 6) !== 0 ? Jt(
        Rf,
        i0
      ) : lm();
    });
  }
  function $s() {
    if (Ie === 0) {
      var l = ga;
      l === 0 && (l = pn, pn <<= 1, (pn & 261888) === 0 && (pn = 256)), Ie = l;
    }
    return Ie;
  }
  function um(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Cn(l);
  }
  function s0(l, t, e, a, u) {
    if (t === "submit" && e && e.stateNode === u) {
      var n = um(
        (u[yt] || null).action
      ), i = a.submitter;
      i && (t = (t = i[yt] || null) ? um(t.formAction) : i.getAttribute("formAction"), t !== null && (n = t, i = null));
      var s = new Hn(
        "action",
        "action",
        null,
        a,
        u
      );
      l.push({
        event: s,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ie !== 0) {
                  var f = new FormData(u, i);
                  as(
                    e,
                    {
                      pending: !0,
                      data: f,
                      method: u.method,
                      action: n
                    },
                    null,
                    f
                  );
                }
              } else
                typeof n == "function" && (s.preventDefault(), f = new FormData(u, i), as(
                  e,
                  {
                    pending: !0,
                    data: f,
                    method: u.method,
                    action: n
                  },
                  n,
                  f
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var Ws = 0; Ws < xc.length; Ws++) {
    var ks = xc[Ws], f0 = ks.toLowerCase(), r0 = ks[0].toUpperCase() + ks.slice(1);
    Ft(
      f0,
      "on" + r0
    );
  }
  Ft(Or, "onAnimationEnd"), Ft(Dr, "onAnimationIteration"), Ft(Mr, "onAnimationStart"), Ft("dblclick", "onDoubleClick"), Ft("focusin", "onFocus"), Ft("focusout", "onBlur"), Ft(bv, "onTransitionRun"), Ft(jv, "onTransitionStart"), Ft(xv, "onTransitionCancel"), Ft(Cr, "onTransitionEnd"), Ba("onMouseEnter", ["mouseout", "mouseover"]), Ba("onMouseLeave", ["mouseout", "mouseover"]), Ba("onPointerEnter", ["pointerout", "pointerover"]), Ba("onPointerLeave", ["pointerout", "pointerover"]), sa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), sa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), sa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), sa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), sa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), sa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var rn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), o0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(rn)
  );
  function nm(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var a = l[e], u = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var s = a[i], f = s.instance, v = s.currentTarget;
            if (s = s.listener, f !== n && u.isPropagationStopped())
              break l;
            n = s, u.currentTarget = v;
            try {
              n(u);
            } catch (b) {
              Gn(b);
            }
            u.currentTarget = null, n = f;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (s = a[i], f = s.instance, v = s.currentTarget, s = s.listener, f !== n && u.isPropagationStopped())
              break l;
            n = s, u.currentTarget = v;
            try {
              n(u);
            } catch (b) {
              Gn(b);
            }
            u.currentTarget = null, n = f;
          }
      }
    }
  }
  function I(l, t) {
    var e = t[Lf];
    e === void 0 && (e = t[Lf] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    e.has(a) || (im(t, l, 2, !1), e.add(a));
  }
  function Is(l, t, e) {
    var a = 0;
    t && (a |= 4), im(
      e,
      l,
      a,
      t
    );
  }
  var Bi = "_reactListening" + Math.random().toString(36).slice(2);
  function Ps(l) {
    if (!l[Bi]) {
      l[Bi] = !0, Kf.forEach(function(e) {
        e !== "selectionchange" && (o0.has(e) || Is(e, !1, l), Is(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[Bi] || (t[Bi] = !0, Is("selectionchange", !1, t));
    }
  }
  function im(l, t, e, a) {
    switch ($m(t)) {
      case 2:
        var u = ay;
        break;
      case 8:
        u = uy;
        break;
      default:
        u = jf;
    }
    e = u.bind(
      null,
      t,
      e,
      l
    ), u = void 0, !cc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = !0), a ? u !== void 0 ? l.addEventListener(t, e, {
      capture: !0,
      passive: u
    }) : l.addEventListener(t, e, !0) : u !== void 0 ? l.addEventListener(t, e, {
      passive: u
    }) : l.addEventListener(t, e, !1);
  }
  function lf(l, t, e, a, u) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var s = a.stateNode.containerInfo;
          if (s === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var f = i.tag;
              if ((f === 3 || f === 4) && i.stateNode.containerInfo === u)
                return;
              i = i.return;
            }
          for (; s !== null; ) {
            if (i = ca(s), i === null) return;
            if (f = i.tag, f === 5 || f === 6 || f === 26 || f === 27) {
              a = n = i;
              continue l;
            }
            s = s.parentNode;
          }
        }
        a = a.return;
      }
    nr(function() {
      var v = n, b = nc(e), T = [];
      l: {
        var m = Rr.get(l);
        if (m !== void 0) {
          var S = Hn, N = l;
          switch (l) {
            case "keypress":
              if (Un(e) === 0) break l;
            case "keydown":
            case "keyup":
              S = $h;
              break;
            case "focusin":
              N = "focus", S = oc;
              break;
            case "focusout":
              N = "blur", S = oc;
              break;
            case "beforeblur":
            case "afterblur":
              S = oc;
              break;
            case "click":
              if (e.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              S = sr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              S = Bh;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              S = lv;
              break;
            case Or:
            case Dr:
            case Mr:
              S = Qh;
              break;
            case Cr:
              S = ev;
              break;
            case "scroll":
            case "scrollend":
              S = qh;
              break;
            case "wheel":
              S = uv;
              break;
            case "copy":
            case "cut":
            case "paste":
              S = Vh;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              S = rr;
              break;
            case "submit":
              S = Ih;
              break;
            case "toggle":
            case "beforetoggle":
              S = iv;
          }
          var D = (t & 4) !== 0, K = !D && (l === "scroll" || l === "scrollend"), h = D ? m !== null ? m + "Capture" : null : m;
          D = [];
          for (var o = v, g; o !== null; ) {
            var x = o;
            if (g = x.stateNode, x = x.tag, x !== 5 && x !== 26 && x !== 27 || g === null || h === null || (x = Mu(o, h), x != null && D.push(
              on(o, x, g)
            )), K) break;
            o = o.return;
          }
          0 < D.length && (m = new S(
            m,
            N,
            null,
            e,
            b
          ), T.push({ event: m, listeners: D }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (S = l === "mouseover" || l === "pointerover", m = l === "mouseout" || l === "pointerout", S && e !== uc && (N = e.relatedTarget || e.fromElement) && (ca(N) || N[Ua]))
            break l;
          (m || S) && (N = b.window === b ? b : (S = b.ownerDocument) ? S.defaultView || S.parentWindow : window, m ? (S = e.relatedTarget || e.toElement, m = v, S = S ? ca(S) : null, S !== null && (K = J(S), D = S.tag, S !== K || D !== 5 && D !== 27 && D !== 6) && (S = null)) : (m = null, S = v), m !== S && (D = sr, x = "onMouseLeave", h = "onMouseEnter", o = "mouse", (l === "pointerout" || l === "pointerover") && (D = rr, x = "onPointerLeave", h = "onPointerEnter", o = "pointer"), K = m == null ? N : Du(m), g = S == null ? N : Du(S), N = new D(
            x,
            o + "leave",
            m,
            e,
            b
          ), N.target = K, N.relatedTarget = g, x = null, ca(b) === v && (D = new D(
            h,
            o + "enter",
            S,
            e,
            b
          ), D.target = g, D.relatedTarget = K, x = D), K = x, D = m && S ? rl(
            m,
            S,
            d0
          ) : null, m !== null && cm(
            T,
            N,
            m,
            D,
            !1
          ), S !== null && K !== null && cm(
            T,
            K,
            S,
            D,
            !0
          )));
        }
        l: {
          if (m = v ? Du(v) : window, S = m.nodeName && m.nodeName.toLowerCase(), S === "select" || S === "input" && m.type === "file")
            var O = Sr;
          else if (yr(m))
            if (br)
              O = yv;
            else {
              O = hv;
              var el = mv;
            }
          else
            S = m.nodeName, !S || S.toLowerCase() !== "input" || m.type !== "checkbox" && m.type !== "radio" ? v && ac(v.elementType) && (O = Sr) : O = vv;
          if (O && (O = O(l, v))) {
            gr(
              T,
              O,
              e,
              b
            );
            break l;
          }
          el && el(l, m, v);
        }
        switch (el = v ? Du(v) : window, l) {
          case "focusin":
            (yr(el) || el.contentEditable === "true") && (La = el, Sc = v, Gu = null);
            break;
          case "focusout":
            Gu = Sc = La = null;
            break;
          case "mousedown":
            bc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            bc = !1, zr(T, e, b);
            break;
          case "selectionchange":
            if (Sv) break;
          case "keydown":
          case "keyup":
            zr(T, e, b);
        }
        var H;
        if (mc)
          l: {
            switch (l) {
              case "compositionstart":
                var V = "onCompositionStart";
                break l;
              case "compositionend":
                V = "onCompositionEnd";
                break l;
              case "compositionupdate":
                V = "onCompositionUpdate";
                break l;
            }
            V = void 0;
          }
        else
          Va ? hr(l, e) && (V = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (V = "onCompositionStart");
        V && (or && e.locale !== "ko" && (Va || V !== "onCompositionStart" ? V === "onCompositionEnd" && Va && (H = ir()) : (Re = b, sc = "value" in Re ? Re.value : Re.textContent, Va = !0)), el = Yi(v, V), 0 < el.length && (V = new fr(
          V,
          l,
          null,
          e,
          b
        ), T.push({ event: V, listeners: el }), H ? V.data = H : (H = vr(e), H !== null && (V.data = H)))), (H = sv ? fv(l, e) : rv(l, e)) && (V = Yi(v, "onBeforeInput"), 0 < V.length && (el = new fr(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          b
        ), T.push({
          event: el,
          listeners: V
        }), el.data = H)), s0(
          T,
          l,
          v,
          e,
          b
        );
      }
      nm(T, t);
    });
  }
  function on(l, t, e) {
    return {
      instance: l,
      listener: t,
      currentTarget: e
    };
  }
  function Yi(l, t) {
    for (var e = t + "Capture", a = []; l !== null; ) {
      var u = l, n = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || n === null || (u = Mu(l, e), u != null && a.unshift(
        on(l, u, n)
      ), u = Mu(l, t), u != null && a.push(
        on(l, u, n)
      )), l.tag === 3) return a;
      l = l.return;
    }
    return [];
  }
  function d0(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function cm(l, t, e, a, u) {
    for (var n = t._reactName, i = []; e !== null && e !== a; ) {
      var s = e, f = s.alternate, v = s.stateNode;
      if (s = s.tag, f !== null && f === a) break;
      s !== 5 && s !== 26 && s !== 27 || v === null || (f = v, u ? (v = Mu(e, n), v != null && i.unshift(
        on(e, v, f)
      )) : u || (v = Mu(e, n), v != null && i.push(
        on(e, v, f)
      ))), e = e.return;
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var m0 = /\r\n?/g, h0 = /\u0000|\uFFFD/g;
  function sm(l) {
    return (typeof l == "string" ? l : "" + l).replace(m0, `
`).replace(h0, "");
  }
  function fm(l, t) {
    return t = sm(t), sm(l) === t;
  }
  function Sl(l, t, e, a, u, n) {
    switch (e) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || Ga(l, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && Ga(l, "" + a);
        else return;
        break;
      case "className":
        Mn(l, "class", a);
        break;
      case "tabIndex":
        Mn(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Mn(l, e, a);
        break;
      case "style":
        ar(l, a, n);
        return;
      case "data":
        if (t !== "object") {
          Mn(l, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || e !== "href")) {
          l.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = Cn(a), l.setAttribute(e, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          l.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (e === "formAction" ? (t !== "input" && Sl(l, t, "name", u.name, u, null), Sl(
            l,
            t,
            "formEncType",
            u.formEncType,
            u,
            null
          ), Sl(
            l,
            t,
            "formMethod",
            u.formMethod,
            u,
            null
          ), Sl(
            l,
            t,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (Sl(l, t, "encType", u.encType, u, null), Sl(l, t, "method", u.method, u, null), Sl(l, t, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = Cn(a), l.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (l.onclick = ee);
        return;
      case "onScroll":
        a != null && I("scroll", l);
        return;
      case "onScrollEnd":
        a != null && I("scrollend", l);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(y(61));
          if (e = a.__html, e != null) {
            if (u.children != null) throw Error(y(60));
            n?.__html !== e && (l.innerHTML = e);
          }
        }
        break;
      case "multiple":
        l.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        l.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        e = Cn(a), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          e
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, "") : l.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0 ? l.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? l.removeAttribute(e) : l.setAttribute(e, a);
        break;
      case "popover":
        I("beforetoggle", l), I("toggle", l), Dn(l, "popover", a);
        break;
      case "xlinkActuate":
        ve(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        ve(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        ve(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        ve(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        ve(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        ve(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        ve(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        ve(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        ve(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Dn(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N")
          e = Rh.get(e) || e, Dn(l, e, a);
        else return;
    }
    sl = !0;
  }
  function tf(l, t, e, a, u, n) {
    switch (e) {
      case "style":
        ar(l, a, n);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(y(61));
          if (e = a.__html, e != null) {
            if (u.children != null) throw Error(y(60));
            n?.__html !== e && (l.innerHTML = e);
          }
        }
        break;
      case "children":
        if (typeof a == "string") Ga(l, a);
        else if (typeof a == "number" || typeof a == "bigint")
          Ga(l, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && I("scroll", l);
        return;
      case "onScrollEnd":
        a != null && I("scrollend", l);
        return;
      case "onClick":
        a != null && (l.onclick = ee);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!Jf.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (u = e.endsWith("Capture"), n = e.slice(2, u ? e.length - 7 : void 0), t = l[yt] || null, t = t != null ? t[e] : null, typeof t == "function" && l.removeEventListener(n, t, u), typeof a == "function")) {
              typeof t != "function" && t !== null && (e in l ? l[e] = null : l.hasAttribute(e) && l.removeAttribute(e)), l.addEventListener(n, a, u);
              break l;
            }
            sl = !0, e in l ? l[e] = a : a === !0 ? l.setAttribute(e, "") : Dn(l, e, a);
          }
        return;
    }
    sl = !0;
  }
  function tt(l, t, e) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        I("error", l), I("load", l);
        var a = !1, u = !1, n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var i = e[n];
            if (i != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(y(137, t));
                default:
                  Sl(l, t, n, i, e, null);
              }
          }
        u && Sl(l, t, "srcSet", e.srcSet, e, null), a && Sl(l, t, "src", e.src, e, null);
        return;
      case "input":
        I("invalid", l);
        var s = n = i = u = null, f = null, v = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var b = e[a];
            if (b != null)
              switch (a) {
                case "name":
                  u = b;
                  break;
                case "type":
                  i = b;
                  break;
                case "checked":
                  f = b;
                  break;
                case "defaultChecked":
                  v = b;
                  break;
                case "value":
                  n = b;
                  break;
                case "defaultValue":
                  s = b;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (b != null)
                    throw Error(y(137, t));
                  break;
                default:
                  Sl(l, t, a, b, e, null);
              }
          }
        Pf(
          l,
          n,
          s,
          f,
          v,
          i,
          u,
          !1
        );
        return;
      case "select":
        I("invalid", l), a = i = n = null;
        for (u in e)
          if (e.hasOwnProperty(u) && (s = e[u], s != null))
            switch (u) {
              case "value":
                n = s;
                break;
              case "defaultValue":
                i = s;
                break;
              case "multiple":
                a = s;
              default:
                Sl(l, t, u, s, e, null);
            }
        t = n, e = i, l.multiple = !!a, t != null ? Ya(l, !!a, t, !1) : e != null && Ya(l, !!a, e, !0);
        return;
      case "textarea":
        I("invalid", l), n = u = a = null;
        for (i in e)
          if (e.hasOwnProperty(i) && (s = e[i], s != null))
            switch (i) {
              case "value":
                a = s;
                break;
              case "defaultValue":
                u = s;
                break;
              case "children":
                n = s;
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(y(91));
                break;
              default:
                Sl(l, t, i, s, e, null);
            }
        tr(l, a, u, n);
        return;
      case "option":
        for (f in e)
          e.hasOwnProperty(f) && (a = e[f], a != null) && (f === "selected" ? l.selected = a && typeof a != "function" && typeof a != "symbol" : Sl(l, t, f, a, e, null));
        return;
      case "dialog":
        I("beforetoggle", l), I("toggle", l), I("cancel", l), I("close", l);
        break;
      case "iframe":
      case "object":
        I("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < rn.length; a++)
          I(rn[a], l);
        break;
      case "image":
        I("error", l), I("load", l);
        break;
      case "details":
        I("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        I("error", l), I("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (v in e)
          if (e.hasOwnProperty(v) && (a = e[v], a != null))
            switch (v) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(y(137, t));
              default:
                Sl(l, t, v, a, e, null);
            }
        return;
      default:
        if (ac(t)) {
          for (b in e)
            e.hasOwnProperty(b) && (a = e[b], a !== void 0 && tf(
              l,
              t,
              b,
              a,
              e,
              void 0
            ));
          return;
        }
    }
    for (s in e)
      e.hasOwnProperty(s) && (a = e[s], a != null && Sl(l, t, s, a, e, null));
  }
  var v0 = {};
  function y0(l, t, e, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, n = null, i = null, s = null, f = null, v = null, b = null;
        for (S in e) {
          var T = e[S];
          if (e.hasOwnProperty(S) && T != null)
            switch (S) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                f = T;
              default:
                a.hasOwnProperty(S) || Sl(l, t, S, null, a, T);
            }
        }
        for (var m in a) {
          var S = a[m];
          if (T = e[m], a.hasOwnProperty(m) && (S != null || T != null))
            switch (m) {
              case "type":
                S !== T && (sl = !0), n = S;
                break;
              case "name":
                S !== T && (sl = !0), u = S;
                break;
              case "checked":
                S !== T && (sl = !0), v = S;
                break;
              case "defaultChecked":
                S !== T && (sl = !0), b = S;
                break;
              case "value":
                S !== T && (sl = !0), i = S;
                break;
              case "defaultValue":
                S !== T && (sl = !0), s = S;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null)
                  throw Error(y(137, t));
                break;
              default:
                S !== T && Sl(
                  l,
                  t,
                  m,
                  S,
                  a,
                  T
                );
            }
        }
        tc(
          l,
          i,
          s,
          f,
          v,
          b,
          n,
          u
        );
        return;
      case "select":
        S = i = s = m = null;
        for (n in e)
          if (f = e[n], e.hasOwnProperty(n) && f != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                S = f;
              default:
                a.hasOwnProperty(n) || Sl(
                  l,
                  t,
                  n,
                  null,
                  a,
                  f
                );
            }
        for (u in a)
          if (n = a[u], f = e[u], a.hasOwnProperty(u) && (n != null || f != null))
            switch (u) {
              case "value":
                n !== f && (sl = !0), m = n;
                break;
              case "defaultValue":
                n !== f && (sl = !0), s = n;
                break;
              case "multiple":
                n !== f && (sl = !0), i = n;
              default:
                n !== f && Sl(
                  l,
                  t,
                  u,
                  n,
                  a,
                  f
                );
            }
        t = s, e = i, a = S, m != null ? Ya(l, !!e, m, !1) : !!a != !!e && (t != null ? Ya(l, !!e, t, !0) : Ya(l, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        S = m = null;
        for (s in e)
          if (u = e[s], e.hasOwnProperty(s) && u != null && !a.hasOwnProperty(s))
            switch (s) {
              case "value":
                break;
              case "children":
                break;
              default:
                Sl(l, t, s, null, a, u);
            }
        for (i in a)
          if (u = a[i], n = e[i], a.hasOwnProperty(i) && (u != null || n != null))
            switch (i) {
              case "value":
                u !== n && (sl = !0), m = u;
                break;
              case "defaultValue":
                u !== n && (sl = !0), S = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(y(91));
                break;
              default:
                u !== n && Sl(l, t, i, u, a, n);
            }
        lr(l, m, S);
        return;
      case "option":
        for (var N in e)
          m = e[N], e.hasOwnProperty(N) && m != null && !a.hasOwnProperty(N) && (N === "selected" ? l.selected = !1 : Sl(
            l,
            t,
            N,
            null,
            a,
            m
          ));
        for (f in a)
          m = a[f], S = e[f], a.hasOwnProperty(f) && m !== S && (m != null || S != null) && (f === "selected" ? (m !== S && (sl = !0), l.selected = m && typeof m != "function" && typeof m != "symbol") : Sl(
            l,
            t,
            f,
            m,
            a,
            S
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var D in e)
          m = e[D], e.hasOwnProperty(D) && m != null && !a.hasOwnProperty(D) && Sl(l, t, D, null, a, m);
        for (v in a)
          if (m = a[v], S = e[v], a.hasOwnProperty(v) && m !== S && (m != null || S != null))
            switch (v) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (m != null)
                  throw Error(y(137, t));
                break;
              default:
                Sl(
                  l,
                  t,
                  v,
                  m,
                  a,
                  S
                );
            }
        return;
      default:
        if (ac(t)) {
          for (var K in e)
            m = e[K], e.hasOwnProperty(K) && m !== void 0 && !a.hasOwnProperty(K) && tf(
              l,
              t,
              K,
              void 0,
              a,
              m
            );
          for (b in a)
            m = a[b], S = e[b], !a.hasOwnProperty(b) || m === S || m === void 0 && S === void 0 || tf(
              l,
              t,
              b,
              m,
              a,
              S
            );
          return;
        }
    }
    for (var h in e)
      m = e[h], e.hasOwnProperty(h) && m != null && !a.hasOwnProperty(h) && Sl(l, t, h, null, a, m);
    for (T in a)
      m = a[T], S = e[T], !a.hasOwnProperty(T) || m === S || m == null && S == null || Sl(l, t, T, m, a, S);
  }
  function rm(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function g0() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
        var u = e[a], n = u.transferSize, i = u.initiatorType, s = u.duration;
        if (n && s && rm(i)) {
          for (i = 0, s = u.responseEnd, a += 1; a < e.length; a++) {
            var f = e[a], v = f.startTime;
            if (v > s) break;
            var b = f.transferSize, T = f.initiatorType;
            b && rm(T) && (f = f.responseEnd, i += b * (f < s ? 1 : (s - v) / (f - v)));
          }
          if (--a, t += 8 * (n + i) / (u.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var ef = null, af = null;
  function dn(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function om(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function dm(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function mm(l, t, e, a) {
    return e = dn(
      e
    ).createElement(l), e[Wl] = a, e[yt] = t, tt(e, l, t), Kl(e), e;
  }
  function uf(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var nf = null;
  function S0() {
    var l = window.event;
    return l && l.type === "popstate" ? l === nf ? !1 : (nf = l, !0) : (nf = null, !1);
  }
  var cf = typeof setTimeout == "function" ? setTimeout : void 0, b0 = typeof clearTimeout == "function" ? clearTimeout : void 0, hm = typeof Promise == "function" ? Promise : void 0, vm = typeof requestAnimationFrame == "function" ? requestAnimationFrame : cf, j0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof hm < "u" ? function(l) {
    return hm.resolve(null).then(l).catch(x0);
  } : cf;
  function x0(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Pe(l) {
    return l === "head";
  }
  function ym(l, t) {
    var e = t, a = 0;
    do {
      var u = e.nextSibling;
      if (l.removeChild(e), u && u.nodeType === 8)
        if (e = u.data, e === "/$" || e === "/&") {
          if (a === 0) {
            l.removeChild(u), Tu(t);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          vf(
            l.ownerDocument.documentElement
          );
        else if (e === "head") {
          e = l.ownerDocument.head, vf(e);
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling, s = n.nodeName;
            n[Ou] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && n.rel.toLowerCase() === "stylesheet" || e.removeChild(n), n = i;
          }
        } else
          e === "body" && vf(l.ownerDocument.body);
      e = u;
    } while (e);
    Tu(t);
  }
  function gm(l, t) {
    var e = l;
    l = 0;
    do {
      var a = e.nextSibling;
      if (e.nodeType === 1 ? t ? (e._stashedDisplay = e.style.display, e.style.display = "none") : (e.style.display = e._stashedDisplay || "", e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (t ? (e._stashedText = e.nodeValue, e.nodeValue = "") : e.nodeValue = e._stashedText || ""), a && a.nodeType === 8)
        if (e = a.data, e === "/$") {
          if (l === 0) break;
          l--;
        } else
          e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || l++;
      e = a;
    } while (e);
  }
  function Sm(l, t, e) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, l.style.viewTransitionName = t, e != null && (l.style.viewTransitionClass = e), e = getComputedStyle(l), e.display === "inline") {
      if (t = l.getClientRects(), t.length === 1) var a = 1;
      else
        for (var u = a = 0; u < t.length; u++) {
          var n = t[u];
          0 < n.width && 0 < n.height && a++;
        }
      a === 1 && (l = l.style, l.display = t.length === 1 ? "inline-block" : "block", l.marginTop = "-" + e.paddingTop, l.marginBottom = "-" + e.paddingBottom);
    }
  }
  function bm(l, t) {
    l = l.style, t = t.style;
    var e = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    l.viewTransitionName = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), e = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, l.viewTransitionClass = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), l.display === "inline-block" && (t == null ? l.display = l.margin = "" : (e = t.display, l.display = e == null || typeof e == "boolean" ? "" : e, e = t.margin, e != null ? l.margin = e : (e = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], l.marginTop = e == null || typeof e == "boolean" ? "" : e, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], l.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function T0(l, t, e) {
    return e = e.ownerDocument.defaultView, {
      rect: l,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= l.bottom && 0 <= l.right && l.top <= e.innerHeight && l.left <= e.innerWidth
    };
  }
  function sf(l) {
    var t = l.getBoundingClientRect(), e = getComputedStyle(l);
    return T0(t, e, l);
  }
  function _0(l) {
    return l.documentElement.clientHeight;
  }
  function p0(l) {
    this.addEventListener("load", l), this.addEventListener("error", l);
  }
  function E0(l, t, e, a, u, n, i, s, f) {
    var v = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var b = v.startViewTransition({
        update: function() {
          var m = v.defaultView, S = m.navigation && m.navigation.transition, N = v.fonts.status;
          a();
          var D = [];
          if (N === "loaded" && (_0(v), v.fonts.status === "loading" && D.push(v.fonts.ready)), N = D.length, l !== null)
            for (var K = l.suspenseyImages, h = 0, o = 0; o < K.length; o++) {
              var g = K[o];
              if (!g.complete) {
                var x = g.getBoundingClientRect();
                if (0 < x.bottom && 0 < x.right && x.top < m.innerHeight && x.left < m.innerWidth) {
                  if (h += Qm(g), h > Xi) {
                    D.length = N;
                    break;
                  }
                  g = new Promise(
                    p0.bind(g)
                  ), D.push(g);
                }
              }
            }
          if (0 < D.length)
            return m = Promise.race([
              Promise.all(D),
              new Promise(function(O) {
                return setTimeout(O, 500);
              })
            ]).then(u, u), (S ? Promise.allSettled([S.finished, m]) : m).then(n, n);
          if (u(), S)
            return S.finished.then(
              n,
              n
            );
          n();
        },
        types: e
      });
      v.__reactViewTransition = b;
      var T = [];
      return b.ready.then(
        function() {
          for (var m = v.documentElement.getAnimations({
            subtree: !0
          }), S = 0; S < m.length; S++) {
            var N = m[S], D = N.effect, K = D.pseudoElement;
            if (K != null && K.startsWith("::view-transition")) {
              T.push(N), N = D.getKeyframes();
              for (var h = K = void 0, o = !0, g = 0; g < N.length; g++) {
                var x = N[g], O = x.width;
                if (K === void 0) K = O;
                else if (K !== O) {
                  o = !1;
                  break;
                }
                if (O = x.height, h === void 0) h = O;
                else if (h !== O) {
                  o = !1;
                  break;
                }
                delete x.width, delete x.height, x.transform === "none" && delete x.transform;
              }
              o && K !== void 0 && h !== void 0 && (D.setKeyframes(N), o = getComputedStyle(
                D.target,
                D.pseudoElement
              ), o.width !== K || o.height !== h) && (o = N[0], o.width = K, o.height = h, o = N[N.length - 1], o.width = K, o.height = h, D.setKeyframes(N));
            }
          }
          i();
        },
        function(m) {
          v.__reactViewTransition === b && (v.__reactViewTransition = null);
          try {
            typeof m == "object" && m !== null && m.name === "InvalidStateError" && (m.message === "View transition was skipped because document visibility state is hidden." || m.message === "Skipping view transition because document visibility state has become hidden." || m.message === "Skipping view transition because viewport size changed." || m.message === "Transition was aborted because of invalid state") && (m = null), m !== null && f(m);
          } finally {
            a(), u(), i();
          }
        }
      ), b.finished.finally(function() {
        for (var m = 0; m < T.length; m++)
          T[m].cancel();
        v.__reactViewTransition === b && (v.__reactViewTransition = null), s();
      }), b;
    } catch {
      return a(), u(), i(), null;
    }
  }
  function Aa(l, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + l + "(" + t + ")";
  }
  Aa.prototype.animate = function(l, t) {
    return t = typeof t == "number" ? { duration: t } : F({}, t), t.pseudoElement = this._selector, this._scope.animate(l, t);
  }, Aa.prototype.getAnimations = function() {
    for (var l = this._scope, t = this._selector, e = l.getAnimations({ subtree: !0 }), a = [], u = 0; u < e.length; u++) {
      var n = e[u].effect;
      n !== null && n.target === l && n.pseudoElement === t && a.push(e[u]);
    }
    return a;
  }, Aa.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function jm(l) {
    return {
      name: l,
      group: new Aa("group", l),
      imagePair: new Aa("image-pair", l),
      old: new Aa("old", l),
      new: new Aa("new", l)
    };
  }
  function qt(l) {
    this._fragmentFiber = l, this._observers = this._eventListeners = null;
  }
  qt.prototype.addEventListener = function(l, t, e) {
    var a = null, u = null;
    if (!(e != null && typeof e != "boolean" && (a = e.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var n = this._eventListeners;
      if (Tm(n, l, t, e) === -1) {
        var i = this, s = t;
        e != null && typeof e != "boolean" && e.once === !0 && (s = function(f) {
          i.removeEventListener(
            l,
            t,
            e
          ), typeof t == "function" ? t.call(this, f) : t.handleEvent(f);
        }), a !== null && (u = i.removeEventListener.bind(
          i,
          l,
          t,
          e
        ), a.addEventListener("abort", u, { once: !0 }), u = a.removeEventListener.bind(a, "abort", u)), a = yu(e), n.push({
          type: l,
          listener: t,
          optionsOrUseCapture: e,
          attachedListener: s,
          cleanup: u
        }), j(
          this._fragmentFiber.child,
          !1,
          N0,
          l,
          s,
          a
        );
      }
      this._eventListeners = n;
    }
  };
  function N0(l, t, e, a) {
    return cl(l).addEventListener(
      t,
      e,
      a
    ), !1;
  }
  qt.prototype.removeEventListener = function(l, t, e) {
    var a = this._eventListeners;
    if (a !== null && (t = Tm(
      a,
      l,
      t,
      e
    ), t !== -1)) {
      var u = a[t];
      e = u.attachedListener;
      var n = u.cleanup;
      u = yu(u.optionsOrUseCapture), j(
        this._fragmentFiber.child,
        !1,
        z0,
        l,
        e,
        u
      ), a.splice(t, 1), n !== null && n();
    }
  };
  function z0(l, t, e, a) {
    return cl(l).removeEventListener(
      t,
      e,
      a
    ), !1;
  }
  function yu(l) {
    return l != null && typeof l != "boolean" && (l.once === !0 || l.signal instanceof AbortSignal) ? { capture: l.capture, passive: l.passive } : l;
  }
  function xm(l) {
    return l == null ? "c=0" : typeof l == "boolean" ? "c=" + (l ? "1" : "0") : "c=" + (l.capture ? "1" : "0");
  }
  function Tm(l, t, e, a) {
    if (l.length === 0) return -1;
    a = xm(a);
    for (var u = 0; u < l.length; u++) {
      var n = l[u];
      if (n.type === t && n.listener === e && xm(n.optionsOrUseCapture) === a)
        return u;
    }
    return -1;
  }
  qt.prototype.dispatchEvent = function(l) {
    var t = Y(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = cl(t);
    var e = this._eventListeners;
    if (e !== null && 0 < e.length || !l.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (e)
        for (var u = 0; u < e.length; u++) {
          var n = e[u];
          a.addEventListener(
            n.type,
            n.attachedListener,
            yu(n.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), l = a.dispatchEvent(l), e)
        for (u = 0; u < e.length; u++)
          n = e[u], a.removeEventListener(
            n.type,
            n.attachedListener,
            yu(n.optionsOrUseCapture)
          );
      return t.removeChild(a), l;
    }
    return t.dispatchEvent(l);
  }, qt.prototype.focus = function(l) {
    j(
      this._fragmentFiber.child,
      !0,
      _m,
      l,
      void 0,
      void 0
    );
  };
  function _m(l, t) {
    return l.tag === 6 ? !1 : (l = cl(l), G0(l, t));
  }
  qt.prototype.focusLast = function(l) {
    var t = [];
    j(
      this._fragmentFiber.child,
      !0,
      ff,
      t,
      void 0,
      void 0
    );
    for (var e = t.length - 1; 0 <= e && !_m(t[e], l); e--) ;
  };
  function ff(l, t) {
    return t.push(l), !1;
  }
  qt.prototype.blur = function() {
    var l = Y(
      this._fragmentFiber
    );
    l !== null && (l = cl(l), l = dn(l).activeElement, l !== null && j(
      this._fragmentFiber.child,
      !1,
      A0,
      l,
      void 0,
      void 0
    ));
  };
  function A0(l, t) {
    return l.tag === 6 ? !1 : (l = cl(l), l === t || l.contains(t) ? (t.blur(), !0) : !1);
  }
  qt.prototype.observeUsing = function(l) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(l), j(
      this._fragmentFiber.child,
      !1,
      O0,
      l,
      void 0,
      void 0
    );
  };
  function O0(l, t) {
    return l.tag === 6 || (l = cl(l), t.observe(l)), !1;
  }
  qt.prototype.unobserveUsing = function(l) {
    var t = this._observers;
    if (t !== null && t.has(l)) {
      t.delete(l), j(
        this._fragmentFiber.child,
        !1,
        D0,
        l,
        void 0,
        void 0
      );
      for (var e = t = 0; e < Pt.length; e++) {
        var a = Pt[e];
        a.fragmentInstance === this && a.observer === l ? l.unobserve(a.instance) : Pt[t++] = a;
      }
      Pt.length = t;
    }
  };
  function D0(l, t) {
    return l.tag === 6 || (l = cl(l), t.unobserve(l)), !1;
  }
  var Pt = [], rf = !1;
  function M0(l, t, e) {
    Pt.push({
      fragmentInstance: l,
      observer: t,
      instance: e
    }), rf || (rf = !0, Q0(function() {
      rf = !1;
      var a = Pt;
      Pt = [];
      for (var u = 0; u < a.length; u++) {
        var n = a[u];
        n.observer.unobserve(n.instance);
      }
    }));
  }
  qt.prototype.getClientRects = function() {
    var l = [];
    return j(
      this._fragmentFiber.child,
      !1,
      C0,
      l,
      void 0,
      void 0
    ), l;
  };
  function C0(l, t) {
    if (l.tag === 6) {
      l = l.stateNode;
      var e = l.ownerDocument.createRange();
      e.selectNodeContents(l), t.push.apply(t, e.getClientRects());
    } else
      l = cl(l), t.push.apply(t, l.getClientRects());
    return !1;
  }
  qt.prototype.getRootNode = function(l) {
    var t = Y(
      this._fragmentFiber
    );
    return t === null ? this : cl(t).getRootNode(l);
  }, qt.prototype.compareDocumentPosition = function(l) {
    var t = Y(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var e = [];
    j(
      this._fragmentFiber.child,
      !1,
      ff,
      e,
      void 0,
      void 0
    );
    var a = cl(t);
    if (e.length === 0) {
      if (e = a, Nl(this._fragmentFiber)) {
        l: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break l;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (e = t);
      }
      t = this._fragmentFiber;
      var u = a = e.compareDocumentPosition(l);
      return e === l ? u = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (e = Ml(t)[1], e === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (l = cl(e).compareDocumentPosition(
        l
      ), u = l === 0 || l & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = cl(e[0]), u = cl(e[e.length - 1]);
    var n = Nl(this._fragmentFiber) ? t.parentElement : a;
    if (n == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, n = n.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var i = t.compareDocumentPosition(l), s = u.compareDocumentPosition(l), f = i & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return s = a && n && i & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === l || n && u === l || f || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === l || !n && u === l ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : i, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || R0(
      t,
      this._fragmentFiber,
      e[0],
      e[e.length - 1],
      l
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function R0(l, t, e, a, u) {
    var n = ca(u);
    if (l & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (e = !!n)
        l: {
          for (; n !== null; ) {
            if (n.tag === 7 && (n === t || n.alternate === t)) {
              e = !0;
              break l;
            }
            n = n.return;
          }
          e = !1;
        }
      return e;
    }
    if (l & Node.DOCUMENT_POSITION_CONTAINS) {
      if (n === null)
        return n = u.ownerDocument, u === n || u === n.documentElement || u === n.body;
      l: {
        for (n = t, t = Y(t); n !== null; ) {
          if (!(n.tag !== 5 && n.tag !== 3 && n.tag !== 27 || n !== t && n.alternate !== t)) {
            n = !0;
            break l;
          }
          n = n.return;
        }
        n = !1;
      }
      return n;
    }
    return l & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!n) && !(t = n === e) && (t = rl(
      e,
      n,
      ut
    ), t === null ? t = !1 : (j(
      t,
      !0,
      me,
      n,
      e
    ), n = Vl, Vl = null, t = n !== null)), t) : l & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!n) && !(t = n === a) && (t = rl(
      a,
      n,
      ut
    ), t === null ? t = !1 : (j(
      t,
      !0,
      Hl,
      n,
      a
    ), n = Vl, xl = Vl = null, t = n !== null)), t) : !1;
  }
  function pm(l, t) {
    var e = l.ownerDocument.createRange();
    e.selectNodeContents(l), l = e.getBoundingClientRect(), window.scrollTo(
      window.scrollX + l.left,
      t ? window.scrollY + l.top : window.scrollY + l.bottom - window.innerHeight
    );
  }
  qt.prototype.scrollIntoView = function(l) {
    if (typeof l == "object") throw Error(y(566));
    var t = [];
    j(
      this._fragmentFiber.child,
      !1,
      ff,
      t,
      void 0,
      void 0
    );
    var e = l !== !1;
    if (t.length === 0) {
      var a = Ml(
        this._fragmentFiber
      );
      if (a = e ? a[1] || a[0] || Y(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        l = cl(a), pm(l, e);
        return;
      }
      if (a = cl(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          e = "host" in a ? a.host : null, e !== null && e.scrollIntoView(l);
          return;
        }
        a.scrollIntoView(l);
      }
    }
    for (a = e ? t.length - 1 : 0; a !== (e ? -1 : t.length); ) {
      var u = t[a];
      u.tag === 6 ? (u = cl(u), pm(u, e)) : cl(u).scrollIntoView(l), a += e ? -1 : 1;
    }
  };
  function U0(l, t) {
    return l = cl(l), Em(l, t), !1;
  }
  function Em(l, t) {
    l.reactFragments == null && (l.reactFragments = /* @__PURE__ */ new Set()), l.reactFragments.add(t);
  }
  function Nm(l, t) {
    var e = t._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a];
        l.addEventListener(
          u.type,
          u.attachedListener,
          yu(u.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (e = t._observers, e !== null && e.forEach(function(n) {
      for (var i = 0, s = 0; s < Pt.length; s++) {
        var f = Pt[s];
        (f.fragmentInstance !== t || f.observer !== n || f.instance !== l) && (Pt[i++] = f);
      }
      Pt.length = i, n.observe(l);
    }), Em(l, t));
  }
  function q0(l, t) {
    var e = t._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a];
        l.removeEventListener(
          u.type,
          u.attachedListener,
          yu(u.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (e = t._observers, e !== null && e.forEach(function(n) {
      typeof n.rootMargin == "string" ? M0(
        t,
        n,
        l
      ) : n.unobserve(l);
    }), l.reactFragments != null && l.reactFragments.delete(t));
  }
  function of(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          of(e), On(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(e);
    }
  }
  function H0(l, t, e, a) {
    for (; l.nodeType === 1; ) {
      var u = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (a) {
        if (!l[Ou])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== u.rel || l.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || l.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || l.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (u.src == null ? null : u.src) || l.getAttribute("type") !== (u.type == null ? null : u.type) || l.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = wt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function B0(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = wt(l.nextSibling), l === null)) return null;
    return l;
  }
  function zm(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = wt(l.nextSibling), l === null)) return null;
    return l;
  }
  function df(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function mf(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Y0(l, t) {
    var e = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || e.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), e.removeEventListener("DOMContentLoaded", a);
      };
      e.addEventListener("DOMContentLoaded", a), l._reactRetry = a;
    }
  }
  function wt(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = l.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return l;
  }
  var hf = null;
  function Am(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "/$" || e === "/&") {
          if (t === 0)
            return wt(l.nextSibling);
          t--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Om(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (t === 0) return l;
          t--;
        } else e !== "/$" && e !== "/&" || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function G0(l, t) {
    function e() {
      a = !0;
    }
    if (l.ownerDocument.activeElement === l) return !0;
    var a = !1;
    try {
      l.ownerDocument.addEventListener("focus", e, !0), (l.focus || HTMLElement.prototype.focus).call(l, t);
    } finally {
      l.ownerDocument.removeEventListener("focus", e, !0);
    }
    return a;
  }
  function Q0(l) {
    vm(function() {
      vm(function(t) {
        return l(t);
      });
    });
  }
  function Dm(l, t, e) {
    switch (t = dn(e), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(y(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(y(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(y(454));
        return l;
      default:
        throw Error(y(451));
    }
  }
  function Mm(l, t, e) {
    for (var a in e) {
      var u = e[a];
      e.hasOwnProperty(a) && u != null && Sl(l, t, a, null, v0, u);
    }
    e.dangerouslySetInnerHTML != null && (l.textContent = ""), l.onclick === ee && (l.onclick = null), On(l);
  }
  function vf(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    On(l);
  }
  var Kt = /* @__PURE__ */ new Map(), Cm = /* @__PURE__ */ new Set();
  function mn(l) {
    if (typeof l.getRootNode == "function") {
      var t = l.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Ae = X.d;
  X.d = {
    f: X0,
    r: V0,
    D: L0,
    C: Z0,
    L: w0,
    m: K0,
    X: F0,
    S: J0,
    M: $0
  };
  function X0() {
    var l = Ae.f(), t = Ci();
    return l || t;
  }
  function V0(l) {
    var t = qa(l);
    t !== null && t.tag === 5 && t.type === "form" ? Uo(t) : Ae.r(l);
  }
  var gu = typeof document > "u" ? null : document;
  function Rm(l, t, e) {
    var a = gu;
    if (a && typeof t == "string" && t) {
      var u = Yt(t);
      u = 'link[rel="' + l + '"][href="' + u + '"]', typeof e == "string" && (u += '[crossorigin="' + e + '"]'), Cm.has(u) || (Cm.add(u), l = { rel: l, crossOrigin: e, href: t }, a.querySelector(u) === null && (t = a.createElement("link"), tt(t, "link", l), Kl(t), a.head.appendChild(t)));
    }
  }
  function L0(l) {
    Ae.D(l), Rm("dns-prefetch", l, null);
  }
  function Z0(l, t) {
    Ae.C(l, t), Rm("preconnect", l, t);
  }
  function w0(l, t, e) {
    Ae.L(l, t, e);
    var a = gu;
    if (a && l && t) {
      var u = 'link[rel="preload"][as="' + Yt(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (u += '[imagesrcset="' + Yt(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (u += '[imagesizes="' + Yt(
        e.imageSizes
      ) + '"]')) : u += '[href="' + Yt(l) + '"]';
      var n = u;
      switch (t) {
        case "style":
          n = Su(l);
          break;
        case "script":
          n = bu(l);
      }
      if (!(Kt.has(n) || (l = F(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), Kt.set(n, l), a.querySelector(u) !== null || t === "style" && a.querySelector(hn(n)) || t === "script" && a.querySelector(vn(n))))) {
        var i = a.createElement("link");
        tt(i, "link", l), t === "style" && (i[An] = !0, i.onload = i.onerror = function() {
          wf(i);
        }), Kl(i), a.head.appendChild(i);
      }
    }
  }
  function K0(l, t) {
    Ae.m(l, t);
    var e = gu;
    if (e && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + Yt(a) + '"][href="' + Yt(l) + '"]', n = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = bu(l);
      }
      if (!Kt.has(n) && (l = F({ rel: "modulepreload", href: l }, t), Kt.set(n, l), e.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(vn(n)))
              return;
        }
        a = e.createElement("link"), tt(a, "link", l), Kl(a), e.head.appendChild(a);
      }
    }
  }
  function J0(l, t, e) {
    Ae.S(l, t, e);
    var a = gu;
    if (a && l) {
      var u = Ha(a).hoistableStyles, n = Su(l);
      t = t || "default";
      var i = u.get(n);
      if (!i) {
        var s = { loading: 0, preload: null };
        if (i = a.querySelector(
          hn(n)
        ))
          s.loading = 5;
        else {
          l = F(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = Kt.get(n)) && yf(l, e);
          var f = i = a.createElement("link");
          Kl(f), tt(f, "link", l), f._p = new Promise(function(v, b) {
            f.onload = v, f.onerror = b;
          }), f.addEventListener("load", function() {
            s.loading |= 1;
          }), f.addEventListener("error", function() {
            s.loading |= 2;
          }), s.loading |= 4, Gi(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: s
        }, u.set(n, i);
      }
    }
  }
  function F0(l, t) {
    Ae.X(l, t);
    var e = gu;
    if (e && l) {
      var a = Ha(e).hoistableScripts, u = bu(l), n = a.get(u);
      n || (n = e.querySelector(vn(u)), n || (l = F({ src: l, async: !0 }, t), (t = Kt.get(u)) && gf(l, t), n = e.createElement("script"), Kl(n), tt(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function $0(l, t) {
    Ae.M(l, t);
    var e = gu;
    if (e && l) {
      var a = Ha(e).hoistableScripts, u = bu(l), n = a.get(u);
      n || (n = e.querySelector(vn(u)), n || (l = F({ src: l, async: !0, type: "module" }, t), (t = Kt.get(u)) && gf(l, t), n = e.createElement("script"), Kl(n), tt(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function Um(l, t, e, a) {
    var u = (u = te.current) ? mn(u) : null;
    if (!u) throw Error(y(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (e = Su(e.href), t = Ha(
          u
        ).hoistableStyles, a = t.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          l = Su(e.href);
          var n = Ha(
            u
          ).hoistableStyles, i = n.get(l);
          if (i || (u = u.ownerDocument || u, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, i), (n = u.querySelector(
            hn(l)
          )) ? n._p || (i.instance = n, i.state.loading = 5) : (n = Kt.get(l), n || (n = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, Kt.set(l, n)), W0(
            u,
            l,
            n,
            i.state
          ))), t && a === null)
            throw Error(y(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(y(529, ""));
        return null;
      case "script":
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (e = bu(e), t = Ha(
          u
        ).hoistableScripts, a = t.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(y(444, l));
    }
  }
  function Su(l) {
    return 'href="' + Yt(l) + '"';
  }
  function hn(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function qm(l) {
    return F({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function W0(l, t, e, a) {
    if (t = l.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[An] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = l.createElement("link"), t[An] = !0, t.onload = t.onerror = wf.bind(null, t), tt(t, "link", e), Kl(t), l.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function bu(l) {
    return '[src="' + Yt(l) + '"]';
  }
  function vn(l) {
    return "script[async]" + l;
  }
  function Hm(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + Yt(e.href) + '"]'
          );
          if (a)
            return t.instance = a, Kl(a), a;
          var u = F({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), Kl(a), tt(a, "style", u), Gi(a, e.precedence, l), t.instance = a;
        case "stylesheet":
          u = Su(e.href);
          var n = l.querySelector(
            hn(u)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Kl(n), n;
          a = qm(e), (u = Kt.get(u)) && yf(a, u), n = (l.ownerDocument || l).createElement("link"), Kl(n);
          var i = n;
          return i._p = new Promise(function(s, f) {
            i.onload = s, i.onerror = f;
          }), tt(n, "link", a), t.state.loading |= 4, Gi(n, e.precedence, l), t.instance = n;
        case "script":
          return n = bu(e.src), (u = l.querySelector(
            vn(n)
          )) ? (t.instance = u, Kl(u), u) : (a = e, (u = Kt.get(n)) && (a = F({}, e), gf(a, u)), l = l.ownerDocument || l, u = l.createElement("script"), Kl(u), tt(u, "link", a), l.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(y(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Gi(a, e.precedence, l));
    return t.instance;
  }
  function Gi(l, t, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = a.length ? a[a.length - 1] : null, n = u, i = 0; i < a.length; i++) {
      var s = a[i];
      if (s.dataset.precedence === t) n = s;
      else if (n !== u) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(l, t.firstChild));
  }
  function yf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function gf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Qi = null;
  function Bm(l, t, e) {
    if (Qi === null) {
      var a = /* @__PURE__ */ new Map(), u = Qi = /* @__PURE__ */ new Map();
      u.set(e, a);
    } else
      u = Qi, a = u.get(e), a || (a = /* @__PURE__ */ new Map(), u.set(e, a));
    if (a.has(l)) return a;
    for (a.set(l, null), e = e.getElementsByTagName(l), u = 0; u < e.length; u++) {
      var n = e[u];
      if (!(n[Ou] || n[Wl] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = n.getAttribute(t) || "";
        i = l + i;
        var s = a.get(i);
        s ? s.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function Sf(l, t, e) {
    l = l.ownerDocument || l, l.head.insertBefore(
      e,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function k0(l, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (l = t.disabled, typeof t.precedence == "string" && l == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Ym(l, t) {
    return l === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function Gm(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function Qm(l) {
    return (l.width || 100) * (l.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Xm(l, t) {
    typeof t.decode == "function" && (l.imgCount++, t.complete || (l.imgBytes += Qm(t), l.suspenseyImages.push(t)), l = ly.bind(l), t.decode().then(l, l));
  }
  function I0(l, t, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var u = Su(a.href), n = t.querySelector(
          hn(u)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = yn.bind(l), t.then(l, l)), e.state.loading |= 4, e.instance = n, Kl(n);
          return;
        }
        n = t.ownerDocument || t, a = qm(a), (u = Kt.get(u)) && yf(a, u), n = n.createElement("link"), Kl(n);
        var i = n;
        i._p = new Promise(function(s, f) {
          i.onload = s, i.onerror = f;
        }), tt(n, "link", a), e.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (l.count++, e = yn.bind(l), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  var Xi = 0;
  function P0(l, t) {
    return l.stylesheets && l.count === 0 && Li(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (l.stylesheets && Li(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && Xi === 0 && (Xi = 62500 * g0());
      var u = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Li(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > Xi ? 50 : 800) + t
      );
      return l.unsuspend = e, function() {
        l.unsuspend = null, clearTimeout(a), clearTimeout(u);
      };
    } : null;
  }
  function Vm(l) {
    if (l.count === 0 && (l.imgCount === 0 || !l.waitingForImages)) {
      if (l.stylesheets) Li(l, l.stylesheets);
      else if (l.unsuspend) {
        var t = l.unsuspend;
        l.unsuspend = null, t();
      }
    }
  }
  function yn() {
    this.count--, Vm(this);
  }
  function ly() {
    this.imgCount--, Vm(this);
  }
  var Vi = null;
  function Li(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Vi = /* @__PURE__ */ new Map(), t.forEach(ty, l), Vi = null, yn.call(l));
  }
  function ty(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Vi.get(l);
      if (e) var a = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Vi.set(l, e);
        for (var u = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < u.length; n++) {
          var i = u[n];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (e.set(i.dataset.precedence, i), a = i);
        }
        a && e.set(null, a);
      }
      u = t.instance, i = u.getAttribute("data-precedence"), n = e.get(i) || a, n === a && e.set(null, u), e.set(i, u), this.count++, a = yn.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), n ? n.parentNode.insertBefore(u, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(u, l.firstChild)), t.state.loading |= 4;
    }
  }
  var ju = {
    $$typeof: hl,
    Provider: null,
    Consumer: null,
    _currentValue: pt,
    _currentValue2: pt,
    _threadCount: 0
  };
  function ey(l, t, e, a, u, n, i, s, f) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ki(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ki(0), this.hiddenUpdates = ki(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = n, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = f, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Lm(l, t, e, a, u, n, i, s, f, v, b, T) {
    return l = new ey(
      l,
      t,
      e,
      i,
      f,
      v,
      b,
      T,
      s
    ), t = 1, n === !0 && (t |= 24), n = gt(3, null, null, t), l.current = n, n.stateNode = l, t = Cc(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: t
    }, Hc(n), l;
  }
  function Zm(l) {
    return l ? (l = Ka, l) : Ka;
  }
  function wm(l, t, e, a, u, n) {
    u = Zm(u), a.context === null ? a.context = u : a.pendingContext = u, a = Xe(t), a.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (a.callback = n), e = Ve(l, a, t), e !== null && (xt(e, l, t), Ku(e, l, t));
  }
  function Km(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function bf(l, t) {
    Km(l, t), (l = l.alternate) && Km(l, t);
  }
  function Jm(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = oa(l, 67108864);
      t !== null && xt(t, l, 67108864), bf(l, 67108864);
    }
  }
  function Fm(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Ut();
      t = Ii(t);
      var e = oa(l, t);
      e !== null && xt(e, l, t), bf(l, t);
    }
  }
  var xu = !0;
  function ay(l, t, e, a) {
    var u = A.T;
    A.T = null;
    var n = X.p;
    try {
      X.p = 2, jf(l, t, e, a);
    } finally {
      X.p = n, A.T = u;
    }
  }
  function uy(l, t, e, a) {
    var u = A.T;
    A.T = null;
    var n = X.p;
    try {
      X.p = 8, jf(l, t, e, a);
    } finally {
      X.p = n, A.T = u;
    }
  }
  function jf(l, t, e, a) {
    if (xu) {
      var u = xf(a);
      if (u === null)
        lf(
          l,
          t,
          a,
          Zi,
          e
        ), Wm(l, a);
      else if (iy(
        u,
        l,
        t,
        e,
        a
      ))
        a.stopPropagation();
      else if (Wm(l, a), t & 4 && -1 < ny.indexOf(l)) {
        for (; u !== null; ) {
          var n = qa(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var i = ia(n.pendingLanes);
                  if (i !== 0) {
                    var s = n;
                    for (s.pendingLanes |= 2, s.entangledLanes |= 2; i; ) {
                      var f = 1 << 31 - zt(i);
                      s.entanglements[1] |= f, i &= ~f;
                    }
                    de(n), (fl & 6) === 0 && (Oi = Et() + 500, fn(0));
                  }
                }
                break;
              case 31:
              case 13:
                s = oa(n, 2), s !== null && xt(s, n, 2), Ci(), bf(n, 2);
            }
          if (n = xf(a), n === null && lf(
            l,
            t,
            a,
            Zi,
            e
          ), n === u) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else
        lf(
          l,
          t,
          a,
          null,
          e
        );
    }
  }
  function xf(l) {
    return l = nc(l), Tf(l);
  }
  var Zi = null;
  function Tf(l) {
    if (Zi = null, l = ca(l), l !== null) {
      var t = J(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = al(t), l !== null) return l;
          l = null;
        } else if (e === 31) {
          if (l = Al(t), l !== null) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Zi = l, null;
  }
  function $m(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (gh()) {
          case Rf:
            return 2;
          case Uf:
            return 8;
          case _n:
          case Sh:
            return 32;
          case qf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var _f = !1, la = null, ta = null, ea = null, gn = /* @__PURE__ */ new Map(), Sn = /* @__PURE__ */ new Map(), aa = [], ny = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Wm(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        la = null;
        break;
      case "dragenter":
      case "dragleave":
        ta = null;
        break;
      case "mouseover":
      case "mouseout":
        ea = null;
        break;
      case "pointerover":
      case "pointerout":
        gn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sn.delete(t.pointerId);
    }
  }
  function bn(l, t, e, a, u, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: n,
      targetContainers: [u]
    }, t !== null && (t = qa(t), t !== null && Jm(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), l);
  }
  function iy(l, t, e, a, u) {
    switch (t) {
      case "focusin":
        return la = bn(
          la,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "dragenter":
        return ta = bn(
          ta,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "mouseover":
        return ea = bn(
          ea,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "pointerover":
        var n = u.pointerId;
        return gn.set(
          n,
          bn(
            gn.get(n) || null,
            l,
            t,
            e,
            a,
            u
          )
        ), !0;
      case "gotpointercapture":
        return n = u.pointerId, Sn.set(
          n,
          bn(
            Sn.get(n) || null,
            l,
            t,
            e,
            a,
            u
          )
        ), !0;
    }
    return !1;
  }
  function km(l) {
    var t = ca(l.target);
    if (t !== null) {
      var e = J(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = al(e), t !== null) {
            l.blockedOn = t, Vf(l.priority, function() {
              Fm(e);
            });
            return;
          }
        } else if (t === 31) {
          if (t = Al(e), t !== null) {
            l.blockedOn = t, Vf(l.priority, function() {
              Fm(e);
            });
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function wi(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = xf(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        uc = a, e.target.dispatchEvent(a), uc = null;
      } else
        return t = qa(e), t !== null && Jm(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function Im(l, t, e) {
    wi(l) && e.delete(t);
  }
  function cy() {
    _f = !1, la !== null && wi(la) && (la = null), ta !== null && wi(ta) && (ta = null), ea !== null && wi(ea) && (ea = null), gn.forEach(Im), Sn.forEach(Im);
  }
  function Ki(l, t) {
    l.blockedOn === t && (l.blockedOn = null, _f || (_f = !0, p.unstable_scheduleCallback(
      p.unstable_NormalPriority,
      cy
    )));
  }
  var Ji = null;
  function Pm(l) {
    Ji !== l && (Ji = l, p.unstable_scheduleCallback(
      p.unstable_NormalPriority,
      function() {
        Ji === l && (Ji = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t], a = l[t + 1], u = l[t + 2];
          if (typeof a != "function") {
            if (Tf(a || e) === null)
              continue;
            break;
          }
          var n = qa(e);
          n !== null && (l.splice(t, 3), t -= 3, as(
            n,
            {
              pending: !0,
              data: u,
              method: e.method,
              action: a
            },
            a,
            u
          ));
        }
      }
    ));
  }
  function Tu(l) {
    function t(f) {
      return Ki(f, l);
    }
    la !== null && Ki(la, l), ta !== null && Ki(ta, l), ea !== null && Ki(ea, l), gn.forEach(t), Sn.forEach(t);
    for (var e = 0; e < aa.length; e++) {
      var a = aa[e];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < aa.length && (e = aa[0], e.blockedOn === null); )
      km(e), e.blockedOn === null && aa.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var u = e[a], n = e[a + 1], i = u[yt] || null;
        if (typeof n == "function")
          i || Pm(e);
        else if (i) {
          var s = null;
          if (n && n.hasAttribute("formAction")) {
            if (u = n, i = n[yt] || null)
              s = i.formAction;
            else if (Tf(u) !== null) continue;
          } else s = i.action;
          typeof s == "function" ? e[a + 1] = s : (e.splice(a, 3), a -= 3), Pm(e);
        }
      }
  }
  function lh() {
    function l(n) {
      n.canIntercept && n.info === "react-transition" && n.intercept({
        handler: function() {
          return new Promise(function(i) {
            return u = i;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      u !== null && (u(), u = null), a || setTimeout(e, 20);
    }
    function e() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n && n.url != null && navigation.navigate(n.url, {
          state: n.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, u = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(e, 100), function() {
        a = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
      };
    }
  }
  function pf(l) {
    this._internalRoot = l;
  }
  Fi.prototype.render = pf.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(y(409));
    var e = t.current, a = Ut();
    wm(e, a, l, t, null, null);
  }, Fi.prototype.unmount = pf.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      wm(l.current, 2, null, l, null, null), Ci(), t[Ua] = null;
    }
  };
  function Fi(l) {
    this._internalRoot = l;
  }
  Fi.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Xf();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < aa.length && t !== 0 && t < aa[e].priority; e++) ;
      aa.splice(e, 0, l), e === 0 && km(l);
    }
  };
  var th = G.version;
  if (th !== "19.3.1")
    throw Error(
      y(
        527,
        th,
        "19.3.1"
      )
    );
  X.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(y(188)) : (l = Object.keys(l).join(","), Error(y(268, l)));
    return l = _l(t), l = l !== null ? M(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var sy = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: A,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var $i = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!$i.isDisabled && $i.supportsFiber)
      try {
        Nu = $i.inject(
          sy
        ), Nt = $i;
      } catch {
      }
  }
  return xn.createRoot = function(l, t) {
    if (!B(l)) throw Error(y(299));
    var e = !1, a = "", u = Zo, n = wo, i = Ko;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = Lm(
      l,
      1,
      !1,
      null,
      null,
      e,
      a,
      null,
      u,
      n,
      i,
      lh
    ), l[Ua] = t.current, Ps(l), new pf(t);
  }, xn.hydrateRoot = function(l, t, e) {
    if (!B(l)) throw Error(y(299));
    var a = !1, u = "", n = Zo, i = wo, s = Ko, f = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (u = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (s = e.onRecoverableError), e.formState !== void 0 && (f = e.formState)), t = Lm(
      l,
      1,
      !0,
      t,
      e ?? null,
      a,
      u,
      f,
      n,
      i,
      s,
      lh
    ), t.context = Zm(null), e = t.current, a = Ut(), a = Ii(a), u = Xe(a), u.callback = null, Ve(e, u, a), e = a, t.current.lanes = e, Au(t, e), de(t), l[Ua] = t.current, Ps(l), new Fi(t);
  }, xn.version = "19.3.1", xn;
}
var oh;
function Sy() {
  if (oh) return zf.exports;
  oh = 1;
  function p() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(p);
      } catch (G) {
        console.error(G);
      }
  }
  return p(), zf.exports = gy(), zf.exports;
}
var by = Sy();
const jy = /^\s*(\d{1,2})\s*-\s*(\d{1,2})\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*$/;
function xy(p) {
  const G = {}, q = p.split(/\r?\n/).map((y) => y.trim()).filter(Boolean);
  if (q.length === 0)
    throw new Error("Saisis au moins une cote de score exact.");
  for (const [y, B] of q.entries()) {
    const J = B.match(jy);
    if (!J)
      throw new Error(`Format incorrect à la ligne ${y + 1}. Utilise « 0-0 = 7,50 ».`);
    const al = `${Number(J[1])}-${Number(J[2])}`, Al = Number(J[3].replace(",", "."));
    if (Object.hasOwn(G, al))
      throw new Error(`Le score ${al} apparaît plusieurs fois.`);
    if (!Number.isFinite(Al) || Al <= 0)
      throw new Error(`La cote du score ${al} doit être supérieure à zéro.`);
    G[al] = Al;
  }
  return G;
}
function Ty({
  homeScore: p,
  awayScore: G,
  oddsText: q,
  vitalityScore: y,
  oddsChangePercent: B,
  tendanceSource: J = "",
  tendanceSeuilStable: al = "",
  halftime: Al = !1,
  under25Odds: bl = ""
}) {
  const _l = Number(p), M = Number(G), j = y === "" ? null : Number(y), Y = B === "" ? null : Number(B), Nl = bl === "" ? null : Number(bl);
  if (!Number.isInteger(_l) || _l < 0 || !Number.isInteger(M) || M < 0)
    throw new Error("Les scores doivent être des nombres entiers positifs ou nuls.");
  if (j !== null && (!Number.isFinite(j) || j < 0 || j > 100))
    throw new Error("La vitalité doit être comprise entre 0 et 100.");
  if (Y !== null && !Number.isFinite(Y))
    throw new Error("La variation des cotes sur deux minutes doit être un nombre valide.");
  if (Nl !== null && (!Number.isFinite(Nl) || Nl <= 0))
    throw new Error("La cote Under 2.5 doit être supérieure à zéro.");
  const Ml = al === "" ? null : Number(al);
  if (J !== "" && J !== "cote_suggeree")
    throw new Error("La source de tendance doit être cote_suggeree ou rester non confirmée.");
  if (Ml !== null && (!Number.isFinite(Ml) || Ml < 0))
    throw new Error("Le seuil de tendance stable doit être un nombre positif ou nul.");
  const Xl = Al && q.trim() === "" ? {} : xy(q), Vl = (Al ? [] : [
    `${_l}-${M}`,
    `${_l + 1}-${M}`,
    `${_l}-${M + 1}`
  ]).find((xl) => !Object.hasOwn(Xl, xl));
  if (Vl)
    throw new Error(`La cote du score ${Vl} est nécessaire pour tester F121-C.`);
  return {
    home_score: _l,
    away_score: M,
    exact_score_odds: Xl,
    vitality_score: j,
    odds_change_percent: Y,
    tendance_source: J || null,
    tendance_seuil_stable: Ml,
    halftime: !!Al,
    under_2_5_odds: Nl
  };
}
async function Mf(p, G, { method: q = "GET", body: y } = {}) {
  const B = { Accept: "application/json" };
  y !== void 0 && (B["Content-Type"] = "application/json"), q !== "GET" && (B["X-CSRF-TOKEN"] = G);
  const J = await fetch(p, {
    method: q,
    credentials: "same-origin",
    headers: B,
    body: y === void 0 ? void 0 : JSON.stringify(y)
  });
  if (!J.headers.get("content-type")?.includes("application/json"))
    throw new Error(`Réponse admin inattendue (HTTP ${J.status}). Vérifiez la session administrateur.`);
  const al = await J.json();
  if (!J.ok) {
    const Al = al.errors ? Object.values(al.errors).flat().join(" ") : "";
    throw new Error(Al || al.message || "La requête admin a échoué.");
  }
  return al;
}
const _y = [
  ["shots", "Tirs"],
  ["shots_on_target", "Tirs cadrés"],
  ["corners", "Corners"],
  ["possession", "Possession"]
];
function py(p) {
  if (!p || typeof p != "object") return [];
  const G = (q, y) => typeof y != "number" || !Number.isFinite(y) ? "Non disponible" : q === "possession" ? `${y} %` : String(y);
  return _y.map(([q, y]) => ({
    key: q,
    label: y,
    home: G(q, p.home?.[q]),
    away: G(q, p.away?.[q])
  }));
}
const dh = [
  { id: "overview", label: "Vue d’ensemble", icon: "grid" },
  { id: "matches", label: "Matchs suivis", icon: "ball" },
  { id: "rules", label: "Moteur de règles", icon: "sliders" },
  { id: "tester", label: "Testeur manuel", icon: "flask" },
  { id: "journal", label: "Journal", icon: "list" },
  { id: "statistics", label: "Statistiques", icon: "chart" },
  { id: "settings", label: "Paramètres", icon: "settings" }
], mh = [
  { id: "F121-C", title: "Écart directionnel", status: "Disponible", detail: "Règle configurable selon les seuils validés du CDC." },
  { id: "F121-C.2", title: "Avantage de deux buts", status: "Disponible", detail: "Suit le leader lorsque son avantage atteint au moins deux buts." },
  { id: "F121-D", title: "Match ouvert", status: "Disponible", detail: "Cotes des scores suivants ≤ 8.00 : Over 4.5. Liste des scores concernés à confirmer (2-2 ajouté d’après la situation 9)." },
  { id: "F121-E1", title: "Écart négatif", status: "Disponible", detail: "Cote du prochain but inférieure à celle du score actuel : alerte critique." },
  { id: "F121-E2", title: "Signal mi-temps", status: "Partiel", detail: "Under 2.5 entre 1.15 et 1.40 à la mi-temps : Over 0.5 en 2e mi-temps. Cote réelle en attente de la capture bet 36." },
  { id: "F121-K · T · X", title: "Écarts et tendance", status: "Non défini", detail: "La formule exacte doit être fournie avant activation." },
  { id: "F122 · F124 · F126", title: "Règles complémentaires", status: "Non défini", detail: "Formules métier à confirmer par le client." }
], hh = {
  "scan.odds_interval_seconds": "Fréquence de lecture des cotes (secondes)",
  "scan.statistics_interval_seconds": "Fréquence des statistiques (secondes)",
  "scan.goal_interval_seconds": "Fréquence de détection de but (secondes)",
  "scan.goal_window_seconds": "Fenêtre de relance après un but (secondes)",
  "alerts.expiration_minutes": "Expiration des alertes (minutes)",
  "rules.maximum_directional_gap": "Écart directionnel maximal",
  "rules.zero_zero_odds_wait_threshold": "Seuil de cote du score 0–0",
  "rules.zero_zero_gap_threshold": "Seuil d’écart du score 0–0",
  "rules.upcoming_score_odds_limit": "Limite de cote des scores suivants",
  "rules.minimum_vitality": "Vitalité minimale",
  "rules.minimum_convergence_score": "Convergence minimale",
  tendance_source: "Source de tendance",
  tendance_seuil_stable: "Seuil de baisse de la tendance (%)",
  "rules.vitality_normalization_references": "Barème de la vitalité",
  "rules.halftime_under25_min": "F121-E2 : Under 2.5 minimal",
  "rules.halftime_under25_max": "F121-E2 : Under 2.5 maximal",
  "rules.open_match_scores": "F121-D : scores de match ouvert (à confirmer)",
  "alerts.level_negative_gap": "Niveau d’alerte : écart négatif",
  "alerts.level_positive_gap": "Niveau d’alerte : écart sous le seuil",
  "rules.decision_pipeline": "Ordre de décision (à confirmer)",
  "scan.quota_economy_percent": "Seuil d’alerte et mode économie du quota (%)",
  "scan.hot_interval_seconds": "Mode économie : fréquence des matchs chauds (secondes)",
  "scan.calm_interval_seconds": "Mode économie : fréquence des matchs calmes (secondes)",
  "scan.hot_gap_threshold": "Mode économie : écart d’un match chaud",
  "scan.no_scan_gap_threshold": "Mode économie : écart sans scan (à confirmer)",
  "scan.auto_mode": "Suivi automatique des championnats majeurs",
  "scan.auto_league_ids": "Ligues suivies automatiquement (identifiants API-Football)"
}, Ey = {
  "scan.odds_interval_seconds": "Fréquence de mise à jour des cotes.",
  "scan.statistics_interval_seconds": "Fréquence de mise à jour des statistiques.",
  "scan.goal_interval_seconds": "Fréquence de vérification après un but.",
  "scan.goal_window_seconds": "Durée de la vérification accélérée après un but.",
  "alerts.expiration_minutes": "Durée avant qu’une alerte expire.",
  "rules.maximum_directional_gap": "Écart maximal accepté pour la direction ciblée.",
  "rules.zero_zero_odds_wait_threshold": "Cote de référence pour le score de 0 à 0.",
  "rules.zero_zero_gap_threshold": "Écart maximal accepté pour le score de 0 à 0.",
  "rules.upcoming_score_odds_limit": "Limite de cote pour les scores suivants.",
  "rules.minimum_vitality": "Niveau minimal de vitalité requis.",
  "rules.minimum_convergence_score": "Niveau minimal de convergence requis.",
  tendance_source: "Valeur de cote utilisée pour calculer la tendance.",
  tendance_seuil_stable: "Baisse strictement supérieure : validée. Exactement égale : à confirmer (abstention).",
  "rules.vitality_normalization_references": "Paliers [minimum inclus, points] par statistique, totaux des deux équipes.",
  "rules.halftime_under25_min": "Borne basse incluse de la cote Under 2.5 à la mi-temps.",
  "rules.halftime_under25_max": "Borne haute incluse de la cote Under 2.5 à la mi-temps.",
  "rules.open_match_scores": "Scores pour lesquels F121-D s’applique.",
  "alerts.level_negative_gap": "Libellé d’une alerte F121-E1.",
  "alerts.level_positive_gap": "Libellé d’une alerte sur écart positif inférieur au seuil.",
  "rules.decision_pipeline": "Étapes : F121-E2, F121-D, designation, vitality, trend, gap, convergence (facultative).",
  "scan.quota_economy_percent": "Pourcentage du quota journalier restant qui déclenche l’alerte et le mode économie.",
  "scan.hot_interval_seconds": "Match chaud : écart sous le seuil ou cote en baisse.",
  "scan.calm_interval_seconds": "Match calme : écart entre le seuil chaud et le seuil sans scan.",
  "scan.hot_gap_threshold": "Écart sous lequel un match est chaud.",
  "scan.no_scan_gap_threshold": "Au-delà de cet écart, le match n’est pas scanné en mode économie.",
  "scan.auto_mode": "Suit tous les matchs des ligues listées ayant les cotes de score exact et les statistiques, en plus du Scan Ciblé.",
  "scan.auto_league_ids": "Par défaut : Premier League 39, Liga 140, Serie A 135, Bundesliga 78, Ligue 1 61, Ligue des champions 2, Europa League 3."
};
function at({ name: p, size: G = 20 }) {
  const q = { width: G, height: G, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0 }, y = {
    grid: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ c.jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ c.jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ c.jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" })
    ] }),
    ball: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ c.jsx("path", { d: "m12 8 2.5 1.8-.9 2.9h-3.2l-.9-2.9L12 8Z" }),
      /* @__PURE__ */ c.jsx("path", { d: "m12 3 0 5m8 1-5.5.8M18 18l-4.4-5.3M6 18l4.4-5.3M4 9l5.5.8" })
    ] }),
    sliders: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "M4 6h9m4 0h3M4 12h3m4 0h9M4 18h9m4 0h3" }),
      /* @__PURE__ */ c.jsx("circle", { cx: "15", cy: "6", r: "2" }),
      /* @__PURE__ */ c.jsx("circle", { cx: "9", cy: "12", r: "2" }),
      /* @__PURE__ */ c.jsx("circle", { cx: "15", cy: "18", r: "2" })
    ] }),
    flask: /* @__PURE__ */ c.jsx(c.Fragment, { children: /* @__PURE__ */ c.jsx("path", { d: "M9 3h6m-5 0v6l-5.3 8.1A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.1-3.9L14 9V3M8 15h8" }) }),
    list: /* @__PURE__ */ c.jsx(c.Fragment, { children: /* @__PURE__ */ c.jsx("path", { d: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" }) }),
    chart: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "M4 19V5m0 14h17" }),
      /* @__PURE__ */ c.jsx("path", { d: "m7 15 4-4 3 2 6-7" })
    ] }),
    settings: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "12", r: "3" }),
      /* @__PURE__ */ c.jsx("path", { d: "m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1-1.5.9-.2 1.9h-2.8l-.3-1.9-1.6-.9-.2-.1-1.7.7-1.4-2.4 1.5-1.1v-2l-1.5-1.1 1.4-2.4 1.7.7 1.8-1V6.4h2.8l.3 1.9 1.6.9.2.1 1.7-.7 1.4 2.4-1.5 1.1v2Z", transform: "translate(-1.2 -1)" })
    ] }),
    arrow: /* @__PURE__ */ c.jsx(c.Fragment, { children: /* @__PURE__ */ c.jsx("path", { d: "M5 12h14m-6-6 6 6-6 6" }) }),
    clock: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ c.jsx("path", { d: "M12 7v5l3 2" })
    ] }),
    shield: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "M12 3 20 6v5c0 5.1-3.4 8.3-8 10-4.6-1.7-8-4.9-8-10V6l8-3Z" }),
      /* @__PURE__ */ c.jsx("path", { d: "m9 12 2 2 4-4" })
    ] }),
    search: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("circle", { cx: "10.8", cy: "10.8", r: "6.8" }),
      /* @__PURE__ */ c.jsx("path", { d: "m16 16 5 5" })
    ] })
  };
  return /* @__PURE__ */ c.jsx("svg", { ...q, children: y[p] ?? y.grid });
}
function Oa({ eyebrow: p, title: G, description: q, action: y }) {
  return /* @__PURE__ */ c.jsxs("div", { className: "page-heading", children: [
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("p", { className: "eyebrow", children: p }),
      /* @__PURE__ */ c.jsx("h1", { children: G }),
      /* @__PURE__ */ c.jsx("p", { className: "page-description", children: q })
    ] }),
    y
  ] });
}
function Oe({ icon: p, title: G, message: q }) {
  return /* @__PURE__ */ c.jsxs("div", { className: "empty-state", children: [
    /* @__PURE__ */ c.jsx("span", { className: "empty-icon", children: /* @__PURE__ */ c.jsx(at, { name: p, size: 23 }) }),
    /* @__PURE__ */ c.jsx("h3", { children: G }),
    /* @__PURE__ */ c.jsx("p", { children: q })
  ] });
}
const Ny = {
  "F121-E2": "Signal mi-temps (F121-E2)",
  "F121-D": "Match ouvert (F121-D)",
  designation: "Désignation de l’équipe (F121-C / C.2)",
  vitality: "Vitalité",
  trend: "Tendance",
  gap: "Écart (F121-E1 / seuil)",
  convergence: "Convergence"
}, zy = {
  alert: "Alerte",
  proposal: "Alerte proposée",
  continue: "Validé",
  non_applicable: "Non applicable",
  abstention: "Abstention"
};
function Ay({ result: p }) {
  const G = p.decision, q = p.rules["F121-C"]?.details?.selectedTeam, y = q === "home" ? "Équipe à domicile" : q === "away" ? "Équipe à l’extérieur" : "Direction indéterminée";
  return /* @__PURE__ */ c.jsxs("div", { className: "simulation-result", children: [
    /* @__PURE__ */ c.jsxs("div", { className: `simulation-verdict ${G.shouldAlert ? "verdict-alert" : "verdict-neutral"}`, children: [
      /* @__PURE__ */ c.jsx("span", { className: "verdict-mark", children: G.shouldAlert ? "✓" : "—" }),
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("strong", { children: G.shouldAlert ? `Alerte ${G.level} théorique — ${G.rule}` : "Abstention" }),
        /* @__PURE__ */ c.jsxs("p", { children: [
          G.shouldAlert ? `${G.suggestedAction}${G.selection ? ` : ${G.selection === "home" ? "équipe à domicile" : "équipe à l’extérieur"}` : ""}. ` : "",
          G.reason
        ] })
      ] })
    ] }),
    G.steps?.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Ordre de décision (à confirmer)" }),
      G.steps.map((B) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ c.jsx("span", { children: Ny[B.step] ?? B.step }),
        /* @__PURE__ */ c.jsx("strong", { children: zy[B.outcome] ?? B.outcome })
      ] }, B.step))
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Règles évaluées" }),
      Object.values(p.rules).map((B) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ c.jsx("span", { children: B.ruleId }),
        /* @__PURE__ */ c.jsx("strong", { children: B.verdict === "candidate" ? B.suggestedAction || y : B.verdict === "not_defined" ? "Non définie" : B.verdict === "abstain" ? "Abstention" : "Aucun signal" })
      ] }, B.ruleId))
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Filtres de sécurité" }),
      Object.entries(p.filters).map(([B, J]) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ c.jsx("span", { children: J.label }),
        /* @__PURE__ */ c.jsx("strong", { className: J.passed ? "filter-passed" : "filter-failed", children: J.passed ? "Validé" : "Refusé" })
      ] }, B))
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "simulation-disclaimer", children: [
      /* @__PURE__ */ c.jsx(at, { name: "shield", size: 17 }),
      /* @__PURE__ */ c.jsx("span", { children: "Simulation uniquement : aucune alerte n’est transmise." })
    ] })
  ] });
}
function _u(p) {
  return p ? new Date(p).toLocaleString("fr-FR") : "—";
}
function Oy(p, G) {
  if (!p) return "Sans expiration";
  if (!G) return "Calcul…";
  const q = Math.max(0, Math.floor((Date.parse(p) - G) / 1e3));
  return `${Math.floor(q / 60)} min ${String(q % 60).padStart(2, "0")} s`;
}
function Dy() {
  const [p, G] = zl.useState("overview"), [q, y] = zl.useState(!1), [B, J] = zl.useState(null), [al, Al] = zl.useState(null), [bl, _l] = zl.useState([]), [M, j] = zl.useState({}), [Y, Nl] = zl.useState([]), [Ml, Xl] = zl.useState(null), [cl, Vl] = zl.useState({ activeRules: [], methodWeights: {} }), [xl, me] = zl.useState(null), [Hl, ut] = zl.useState({ date_from: "", date_to: "", match_id: "", rule_id: "", status: "" }), [rl, F] = zl.useState(null), [P, Tt] = zl.useState({ date_from: "", date_to: "" }), [ft, Ll] = zl.useState(""), [nt, rt] = zl.useState(""), [_t, hl] = zl.useState(!1), [z, Q] = zl.useState(0), [C, ol] = zl.useState({
    homeScore: "0",
    awayScore: "0",
    oddsText: `0-0 = 7,50
1-0 = 8,60
0-1 = 9,80`,
    vitalityScore: "61",
    oddsChangePercent: "-6",
    tendanceSource: "cote_suggeree",
    tendanceSeuilStable: "5",
    halftime: !1,
    under25Odds: ""
  }), [nl, it] = zl.useState(null), [Ht, Bt] = zl.useState(""), [d, _] = zl.useState(!1), [R, U] = zl.useState(""), $ = document.querySelector('meta[name="csrf-token"]')?.content ?? "", ll = document.querySelector("[data-admin-name]")?.dataset.adminName || "Administrateur", il = dh.find((r) => r.id === p)?.label ?? "Vue d’ensemble";
  zl.useEffect(() => {
    let r = !0;
    return Mf("/admin/api/dashboard", $).then((E) => {
      r && J(E);
    }).catch((E) => {
      r && Ll(E.message);
    }), () => {
      r = !1;
    };
  }, [$]), zl.useEffect(() => {
    const r = window.setInterval(() => Q(Date.now()), 1e3);
    return () => window.clearInterval(r);
  }, []);
  async function A(r, E = "GET", L) {
    Ll(""), Ll("");
    try {
      return await Mf(r, $, { method: E, body: L });
    } catch (dl) {
      return Ll(dl.message), null;
    }
  }
  async function X() {
    const r = await A("/admin/api/dashboard");
    r && J(r);
  }
  async function pt() {
    const r = await A("/admin/api/matches");
    r && Al(r);
  }
  async function Da() {
    const r = await A("/admin/api/rule-profile");
    r && (Xl(r), Vl({
      activeRules: r.profile?.activeRules ?? [],
      methodWeights: r.profile?.methodWeights ?? {}
    }));
  }
  async function le() {
    const r = await A("/admin/api/settings");
    if (!r) return;
    _l(r.settings), j(Object.fromEntries(r.settings.map((L) => [
      L.key,
      L.type === "json" && L.value !== null ? JSON.stringify(L.value, null, 2) : L.value ?? ""
    ])));
    const E = await A("/admin/api/settings/history");
    E && Nl(E.data);
  }
  async function ct(r = Hl) {
    const E = new URLSearchParams(Object.entries(r).filter(([, dl]) => dl !== "")), L = await A(`/admin/api/journal${E.size ? `?${E}` : ""}`);
    L && me(L);
  }
  async function Ul(r = P) {
    const E = new URLSearchParams(Object.entries(r).filter(([, dl]) => dl !== "")), L = await A(`/admin/api/statistics${E.size ? `?${E}` : ""}`);
    L && F(L);
  }
  function vl(r) {
    G(r), y(!1), rt(""), Ll(""), it(null), Bt(""), r === "overview" && X(), r === "matches" && pt(), r === "rules" && Da(), r === "settings" && le(), r === "journal" && ct(), r === "statistics" && Ul();
  }
  const Zl = (r) => (E) => {
    ol((L) => ({ ...L, [r]: E.target.value })), it(null), Bt("");
  };
  async function na(r) {
    r.preventDefault(), _(!0), Bt(""), it(null);
    try {
      const E = Ty(C), L = await Mf("/admin/rule-test", $, { method: "POST", body: E });
      it(L);
    } catch (E) {
      Bt(E.message);
    } finally {
      _(!1);
    }
  }
  async function te() {
    U("");
    try {
      if (!(await fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "X-CSRF-TOKEN": $, Accept: "application/json" }
      })).ok) throw new Error("La déconnexion a échoué. Réessaie.");
      window.location.assign("/login");
    } catch (r) {
      U(r.message);
    }
  }
  async function Ma(r) {
    hl(!0);
    const E = r.tracked ? await A(`/admin/api/matches/${r.trackedId}`, "DELETE") : await A("/admin/api/matches", "POST", { provider_match_id: r.providerMatchId });
    if (E) {
      const L = E.warnings?.length ? ` ${E.warnings.join(" ")}` : "";
      rt(r.tracked ? "Rencontre retirée du suivi." : `Rencontre ajoutée au suivi.${L}`), await pt(), await X();
    }
    hl(!1);
  }
  async function Ca(r) {
    r.preventDefault(), hl(!0);
    try {
      const E = Object.fromEntries(bl.map((dl) => {
        const Jt = M[dl.key];
        return dl.type === "boolean" ? [dl.key, Jt === !0] : Jt === "" ? [dl.key, null] : dl.type === "integer" || dl.type === "decimal" ? [dl.key, Number(Jt)] : dl.type === "json" ? [dl.key, JSON.parse(Jt)] : [dl.key, Jt];
      }));
      await A("/admin/api/settings", "PATCH", { settings: E }) && (rt("Paramètres enregistrés."), await le());
    } catch (E) {
      Ll(E.message);
    } finally {
      hl(!1);
    }
  }
  async function De() {
    hl(!0), await A("/admin/api/settings/reset", "POST") && (rt("Paramètres réinitialisés."), await le()), hl(!1);
  }
  async function pu(r) {
    r.preventDefault(), hl(!0);
    const E = Object.fromEntries(Object.entries(cl.methodWeights).filter(([, dl]) => dl !== "" && dl !== null).map(([dl, Jt]) => [dl, Number(Jt)]));
    await A("/admin/api/rule-profile", "PUT", {
      active_rules: cl.activeRules,
      method_weights: E
    }) && (rt("Profil de règles enregistré."), await Da()), hl(!1);
  }
  async function Ra() {
    hl(!0);
    const r = await A("/admin/notifications/test", "POST", {});
    r && rt(`${r.message} Canal : ${r.channel}${r.fallbackUsed ? " (repli utilisé)" : ""}${r.simulation ? " — simulation" : ""}`), hl(!1);
  }
  async function Eu(r, E) {
    await A(`/admin/api/journal/${r}/outcome`, "PATCH", { outcome: E || null }) && (await ct(), await Ul());
  }
  const Tn = B?.simulation || al?.simulation, ot = B?.trackedMatches ?? [], Me = B?.activeAlerts ?? [];
  return /* @__PURE__ */ c.jsxs("div", { className: "admin-shell", children: [
    /* @__PURE__ */ c.jsxs("aside", { className: `sidebar ${q ? "sidebar-open" : ""}`, children: [
      /* @__PURE__ */ c.jsxs("a", { className: "brand", href: "/admin", children: [
        /* @__PURE__ */ c.jsx("span", { className: "brand-mark", children: "P" }),
        /* @__PURE__ */ c.jsxs("span", { children: [
          /* @__PURE__ */ c.jsx("strong", { children: "PRONOFOOT" }),
          /* @__PURE__ */ c.jsx("small", { children: "ADMINISTRATION" })
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "sidebar-label", children: "ESPACE ADMIN" }),
      /* @__PURE__ */ c.jsx("nav", { className: "navigation", "aria-label": "Navigation principale", children: dh.map((r) => /* @__PURE__ */ c.jsxs("button", { className: `nav-item ${p === r.id ? "nav-item-active" : ""}`, onClick: () => vl(r.id), type: "button", children: [
        /* @__PURE__ */ c.jsx(at, { name: r.icon, size: 18 }),
        /* @__PURE__ */ c.jsx("span", { children: r.label }),
        r.id === "matches" && /* @__PURE__ */ c.jsx("span", { className: "nav-count", children: ot.length })
      ] }, r.id)) }),
      /* @__PURE__ */ c.jsx("div", { className: "sidebar-spacer" }),
      /* @__PURE__ */ c.jsxs("div", { className: "phase-card", children: [
        /* @__PURE__ */ c.jsx("span", { className: "phase-card-icon", children: /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }) }),
        /* @__PURE__ */ c.jsxs("div", { children: [
          /* @__PURE__ */ c.jsx("strong", { children: "Phase 1" }),
          /* @__PURE__ */ c.jsx("p", { children: "Détecteur live · aucun pari automatique" })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("button", { className: "profile-button", type: "button", onClick: te, children: [
        /* @__PURE__ */ c.jsx("span", { className: "avatar", children: ll.slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ c.jsxs("span", { className: "profile-copy", children: [
          /* @__PURE__ */ c.jsx("strong", { children: ll }),
          /* @__PURE__ */ c.jsx("small", { children: "Administrateur" })
        ] }),
        /* @__PURE__ */ c.jsx("span", { className: "profile-exit", children: "↗" })
      ] }),
      R && /* @__PURE__ */ c.jsx("p", { className: "sidebar-error", role: "alert", children: R })
    ] }),
    /* @__PURE__ */ c.jsxs("main", { className: "main-area", children: [
      /* @__PURE__ */ c.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ c.jsxs("button", { className: "mobile-menu-button", type: "button", "aria-label": "Ouvrir le menu", onClick: () => y((r) => !r), children: [
          /* @__PURE__ */ c.jsx("span", {}),
          /* @__PURE__ */ c.jsx("span", {}),
          /* @__PURE__ */ c.jsx("span", {})
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "breadcrumb", children: [
          /* @__PURE__ */ c.jsx("span", { children: "Administration" }),
          /* @__PURE__ */ c.jsx(at, { name: "arrow", size: 14 }),
          /* @__PURE__ */ c.jsx("strong", { children: il })
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "topbar-right", children: [
          /* @__PURE__ */ c.jsxs("span", { className: "secure-label", children: [
            /* @__PURE__ */ c.jsx("span", { className: "secure-dot" }),
            " Session sécurisée"
          ] }),
          /* @__PURE__ */ c.jsx("span", { className: "topbar-avatar", children: ll.slice(0, 1).toUpperCase() })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "content", children: [
        Tn && /* @__PURE__ */ c.jsxs("div", { className: "simulation-banner", role: "status", children: [
          /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }),
          /* @__PURE__ */ c.jsx("strong", { children: "Mode simulation :" }),
          " les données affichées proviennent d’au moins un pilote fictif."
        ] }),
        ft && /* @__PURE__ */ c.jsx("div", { className: "form-error api-error", role: "alert", children: ft }),
        nt && /* @__PURE__ */ c.jsx("div", { className: "success-message", role: "status", children: nt }),
        p === "overview" && /* @__PURE__ */ c.jsxs("div", { className: "overview-page", children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "TABLEAU DE BORD", title: "Vue d’ensemble", description: "État du détecteur et rencontres suivies.", action: /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
            X();
          }, children: "Actualiser" }) }),
          /* @__PURE__ */ c.jsxs("section", { className: "overview-highlights", "aria-label": "État du scan et alertes actives", children: [
            /* @__PURE__ */ c.jsxs("article", { className: "scan-status-panel", children: [
              /* @__PURE__ */ c.jsxs("div", { className: "scan-status-copy", children: [
                /* @__PURE__ */ c.jsx("p", { className: "overview-section-label", children: "STATUT DU SCAN" }),
                /* @__PURE__ */ c.jsx("h2", { children: "Détecteur de matchs" }),
                /* @__PURE__ */ c.jsxs("p", { children: [
                  "Dernier passage : ",
                  _u(B?.scan?.lastPassAt)
                ] })
              ] }),
              /* @__PURE__ */ c.jsxs("span", { className: `scan-status-badge ${B?.scan?.active ? "scan-active" : ""}`, children: [
                /* @__PURE__ */ c.jsx("span", {}),
                B?.scan?.active ? "Actif" : "En attente"
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("article", { className: "active-alerts-panel", children: [
              /* @__PURE__ */ c.jsx("p", { className: "overview-section-label", children: "ALERTES ACTIVES" }),
              /* @__PURE__ */ c.jsx("strong", { children: Me.length }),
              /* @__PURE__ */ c.jsx("p", { children: Me.length ? "Alertes non expirées" : "Aucune alerte en cours" })
            ] })
          ] }),
          B?.quotaMode === "exhausted" && /* @__PURE__ */ c.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ c.jsx("div", { children: /* @__PURE__ */ c.jsx("strong", { children: "Quota épuisé. Le live est arrêté. Rechargez le quota." }) })
          ] }),
          B?.quotaMode === "economy" && /* @__PURE__ */ c.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Mode économie du quota" }),
              /* @__PURE__ */ c.jsx("p", { children: "Seuls les matchs chauds sont scannés toutes les 30 secondes ; les matchs calmes toutes les 2 minutes." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Quotas fournisseurs" }),
              /* @__PURE__ */ c.jsx("p", { children: "État connu après la dernière consultation." })
            ] }) }),
            /* @__PURE__ */ c.jsx("div", { className: "quota-grid", children: ["football", "odds"].map((r) => /* @__PURE__ */ c.jsxs("div", { className: "quota-card", children: [
              /* @__PURE__ */ c.jsx("strong", { children: r === "football" ? "Football" : "Cotes" }),
              /* @__PURE__ */ c.jsx("span", { children: B?.quotas?.[r] ?? "Inconnu" }),
              /* @__PURE__ */ c.jsx("small", { children: B?.providerStatus?.[r]?.message ?? "Pas encore interrogé" })
            ] }, r)) })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "overview-matches content-panel", "aria-labelledby": "overview-matches-title", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "overview-matches-heading", children: [
              /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("p", { className: "overview-section-label", children: "SUIVI EN DIRECT" }),
                /* @__PURE__ */ c.jsx("h2", { id: "overview-matches-title", children: "Matchs suivis" })
              ] }),
              /* @__PURE__ */ c.jsxs("button", { className: "overview-primary-action", type: "button", onClick: () => vl("matches"), children: [
                "Gérer les matchs ",
                /* @__PURE__ */ c.jsx(at, { name: "arrow", size: 18 })
              ] })
            ] }),
            ot.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Rencontre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Score" }),
                /* @__PURE__ */ c.jsx("th", { children: "Minute" }),
                /* @__PURE__ */ c.jsx("th", { children: "Vitalité" }),
                /* @__PURE__ */ c.jsx("th", { children: "Actualisé" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: ot.map((r) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsxs("td", { children: [
                  r.homeTeam,
                  " – ",
                  r.awayTeam,
                  /* @__PURE__ */ c.jsxs("small", { children: [
                    r.competition,
                    r.trackingMode === "auto" ? " · suivi automatique" : ""
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("td", { children: [
                  r.homeScore ?? "—",
                  " – ",
                  r.awayScore ?? "—"
                ] }),
                /* @__PURE__ */ c.jsx("td", { children: r.minute ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: r.vitality ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: _u(r.capturedAt) })
              ] }, r.id)) })
            ] }) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "ball", title: "Aucun match suivi", message: "Ajoutez une rencontre depuis le pilote configuré." })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Alertes actives" }),
              /* @__PURE__ */ c.jsx("p", { children: "Le compte à rebours reflète l’expiration enregistrée." })
            ] }) }),
            Me.length ? /* @__PURE__ */ c.jsx("div", { className: "alert-list", children: Me.map((r) => /* @__PURE__ */ c.jsxs("article", { className: "alert-row", children: [
              /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: r.match ?? "Rencontre" }),
                /* @__PURE__ */ c.jsx("p", { children: r.message }),
                /* @__PURE__ */ c.jsxs("small", { children: [
                  r.channel,
                  " · ",
                  r.status,
                  r.fallbackUsed ? " · repli" : ""
                ] })
              ] }),
              /* @__PURE__ */ c.jsx("span", { className: "countdown", children: Oy(r.expiresAt, z) })
            ] }, r.id)) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "clock", title: "Aucune alerte active", message: "Les signaux restent soumis aux règles et aux paramètres confirmés." })
          ] })
        ] }),
        p === "matches" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "SUIVI EN DIRECT", title: "Matchs suivis", description: "Choisissez les rencontres à surveiller selon le flux disponible.", action: /* @__PURE__ */ c.jsxs("span", { className: "count-badge", children: [
            ot.length,
            " suivis"
          ] }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-neutral", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(at, { name: "clock", size: 18 }) }),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: al?.message ?? "Le flux sera consulté à l’ouverture de cette page." }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                "Quota restant : ",
                al?.quotaRemaining ?? "inconnu",
                ". Aucun match ne peut être suivi si le fournisseur indique un quota nul."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel matches-panel", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("h2", { children: "Rencontres disponibles" }),
                /* @__PURE__ */ c.jsx("p", { children: "Les données fictives sont identifiées en haut de page." })
              ] }),
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
                pt();
              }, children: "Actualiser" })
            ] }),
            al?.matches?.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Rencontre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Compétition" }),
                /* @__PURE__ */ c.jsx("th", { children: "État" }),
                /* @__PURE__ */ c.jsx("th", { children: "Score" }),
                /* @__PURE__ */ c.jsx("th", { children: "Cotes score exact" }),
                /* @__PURE__ */ c.jsx("th", { children: "Statistiques" }),
                /* @__PURE__ */ c.jsx("th", { children: "Suivi" }),
                /* @__PURE__ */ c.jsx("th", { children: "Action" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: al.matches.map((r) => {
                const E = r.exactScoreMarketAvailable && r.statisticsCoverage !== !1, L = r.statisticsCoverage === null ? "inconnu" : r.statisticsCoverage ? "oui" : "non", dl = r.statisticsCoverage === null ? "Statistiques non confirmées" : r.statisticsCoverageFallback ? `Saison courante utilisée (${r.statisticsCoverageSeason ?? "année inconnue"})` : null;
                return /* @__PURE__ */ c.jsxs("tr", { children: [
                  /* @__PURE__ */ c.jsxs("td", { children: [
                    r.homeTeam,
                    " – ",
                    r.awayTeam,
                    /* @__PURE__ */ c.jsx("small", { children: r.kickoffAt ? _u(r.kickoffAt) : "Horaire non disponible" })
                  ] }),
                  /* @__PURE__ */ c.jsx("td", { children: r.competition }),
                  /* @__PURE__ */ c.jsxs("td", { children: [
                    r.status,
                    r.minute === null ? "" : ` · ${r.minute}′`
                  ] }),
                  /* @__PURE__ */ c.jsxs("td", { children: [
                    r.homeScore ?? "—",
                    " – ",
                    r.awayScore ?? "—"
                  ] }),
                  /* @__PURE__ */ c.jsx("td", { children: r.exactScoreMarketAvailable ? "oui" : "non" }),
                  /* @__PURE__ */ c.jsxs("td", { children: [
                    L,
                    dl && /* @__PURE__ */ c.jsx("small", { children: dl })
                  ] }),
                  /* @__PURE__ */ c.jsx("td", { children: r.tracked ? "Suivi" : "Non suivi" }),
                  /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx("button", { className: "secondary-button compact-button", type: "button", disabled: _t || !r.tracked && (!E || al.quotaRemaining === 0), onClick: () => {
                    Ma(r);
                  }, children: r.tracked ? "Retirer" : E ? "Suivre" : "Indisponible" }) })
                ] }, r.providerMatchId);
              }) })
            ] }) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "search", title: "Aucune rencontre disponible", message: "Le fournisseur n’a retourné aucun match pour le moment." })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", "aria-labelledby": "tracked-statistics-title", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { id: "tracked-statistics-title", children: "Fiches des matchs suivis" }),
              /* @__PURE__ */ c.jsx("p", { children: "Statistiques brutes du dernier relevé, par équipe. Elles ne sont pas converties en vitalité." })
            ] }) }),
            ot.length ? ot.map((r) => {
              const E = py(r.teamStatistics);
              return /* @__PURE__ */ c.jsxs("article", { className: "match-sheet", children: [
                /* @__PURE__ */ c.jsxs("h3", { children: [
                  r.homeTeam,
                  " – ",
                  r.awayTeam
                ] }),
                /* @__PURE__ */ c.jsxs("p", { className: "field-help", children: [
                  "Statistiques relevées : ",
                  r.statisticsCapturedAt ? _u(r.statisticsCapturedAt) : "non disponible"
                ] }),
                E.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
                  /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                    /* @__PURE__ */ c.jsx("th", { children: "Statistique" }),
                    /* @__PURE__ */ c.jsx("th", { children: r.homeTeam }),
                    /* @__PURE__ */ c.jsx("th", { children: r.awayTeam })
                  ] }) }),
                  /* @__PURE__ */ c.jsx("tbody", { children: E.map((L) => /* @__PURE__ */ c.jsxs("tr", { children: [
                    /* @__PURE__ */ c.jsx("td", { children: L.label }),
                    /* @__PURE__ */ c.jsx("td", { children: L.home }),
                    /* @__PURE__ */ c.jsx("td", { children: L.away })
                  ] }, L.key)) })
                ] }) }) : /* @__PURE__ */ c.jsx("p", { children: "Statistiques par équipe non disponibles." }),
                /* @__PURE__ */ c.jsxs("p", { className: "simulation-line", children: [
                  /* @__PURE__ */ c.jsx("span", { children: "Vitalité" }),
                  /* @__PURE__ */ c.jsx("strong", { children: r.vitality ?? "Non calculable : normalisation non définie" })
                ] })
              ] }, r.id);
            }) : /* @__PURE__ */ c.jsx(Oe, { icon: "ball", title: "Aucun match suivi", message: "Suivez une rencontre pour afficher sa fiche." })
          ] })
        ] }),
        p === "rules" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "CONFIGURATION", title: "Moteur de règles", description: "Activez uniquement les règles documentées et configurez les poids validés.", action: /* @__PURE__ */ c.jsx("span", { className: "phase-badge phase-badge-muted", children: Ml?.profile?.name ?? "Profil à configurer" }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Les règles non définies ne déclenchent jamais de signal" }),
              /* @__PURE__ */ c.jsx("p", { children: "Les poids de convergence sont laissés vides jusqu’à validation par le client." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel rules-panel", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("h2", { children: "Règles Phase 1" }),
                /* @__PURE__ */ c.jsx("p", { children: "Activation limitée aux règles disponibles dans le moteur." })
              ] }),
              /* @__PURE__ */ c.jsxs("span", { className: "count-badge", children: [
                mh.length,
                " règles documentées"
              ] })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "rule-table", children: mh.map((r) => /* @__PURE__ */ c.jsxs("article", { className: "rule-row", children: [
              /* @__PURE__ */ c.jsx("span", { className: "rule-id", children: r.id }),
              /* @__PURE__ */ c.jsxs("div", { className: "rule-info", children: [
                /* @__PURE__ */ c.jsx("strong", { children: r.title }),
                /* @__PURE__ */ c.jsx("p", { children: r.detail })
              ] }),
              /* @__PURE__ */ c.jsx("span", { className: `status-pill ${r.status === "Disponible" ? "status-ready" : r.status === "Partiel" ? "status-partial" : "status-pending"}`, children: r.status })
            ] }, r.id)) })
          ] }),
          /* @__PURE__ */ c.jsxs("form", { className: "content-panel settings-form", onSubmit: pu, children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Profil actif" }),
              /* @__PURE__ */ c.jsx("p", { children: "Les poids laissés vides ne sont pas ajoutés au profil." })
            ] }) }),
            /* @__PURE__ */ c.jsxs("fieldset", { className: "rule-selection", children: [
              /* @__PURE__ */ c.jsx("legend", { children: "Règles activées" }),
              (Ml?.availableRules ?? []).map((r) => /* @__PURE__ */ c.jsxs("label", { className: "check-row", children: [
                /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: cl.activeRules.includes(r), onChange: (E) => Vl((L) => ({ ...L, activeRules: E.target.checked ? [...L.activeRules, r] : L.activeRules.filter((dl) => dl !== r) })) }),
                r
              ] }, r))
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "field-grid", children: (Ml?.availableRules ?? []).map((r) => /* @__PURE__ */ c.jsxs("label", { children: [
              "Poids méthode — ",
              r,
              /* @__PURE__ */ c.jsx("input", { min: "0", step: "0.01", type: "number", value: cl.methodWeights[r] ?? "", onChange: (E) => Vl((L) => ({ ...L, methodWeights: { ...L.methodWeights, [r]: E.target.value } })), placeholder: "À confirmer" })
            ] }, r)) }),
            /* @__PURE__ */ c.jsx("button", { className: "primary-button", type: "submit", disabled: _t, children: "Enregistrer le profil" })
          ] })
        ] }),
        p === "tester" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "VALIDATION", title: "Testeur manuel", description: "Évalue un jeu de cotes fourni, sans envoyer de signal ni placer de pari.", action: /* @__PURE__ */ c.jsxs("span", { className: "phase-badge phase-badge-muted", children: [
            /* @__PURE__ */ c.jsx(at, { name: "flask", size: 15 }),
            " Simulation uniquement"
          ] }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-neutral", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Les résultats affichés sont une simulation locale" }),
              /* @__PURE__ */ c.jsx("p", { children: "Aucun message n’est envoyé. La tendance reste abstentionniste tant que sa source et son seuil ne sont pas confirmés." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "tester-layout", children: [
            /* @__PURE__ */ c.jsxs("section", { className: "content-panel tester-panel", children: [
              /* @__PURE__ */ c.jsxs("div", { className: "panel-heading", children: [
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("h2", { children: "Situation du match" }),
                  /* @__PURE__ */ c.jsx("p", { children: "Saisissez les données du scénario à évaluer." })
                ] }),
                /* @__PURE__ */ c.jsx("span", { className: "manual-tag", children: "F125" })
              ] }),
              /* @__PURE__ */ c.jsxs("form", { className: "tester-form", onSubmit: na, children: [
                /* @__PURE__ */ c.jsxs("div", { className: "form-row", children: [
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Score à domicile",
                    /* @__PURE__ */ c.jsx("input", { min: "0", max: "20", type: "number", value: C.homeScore, onChange: Zl("homeScore"), required: !0 })
                  ] }),
                  /* @__PURE__ */ c.jsx("span", { className: "score-separator", children: "–" }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Score à l’extérieur",
                    /* @__PURE__ */ c.jsx("input", { min: "0", max: "20", type: "number", value: C.awayScore, onChange: Zl("awayScore"), required: !0 })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("label", { children: [
                  "Cotes des scores exacts ",
                  /* @__PURE__ */ c.jsx("span", { className: "label-note", children: "une ligne par score" }),
                  /* @__PURE__ */ c.jsx("textarea", { rows: "5", spellCheck: "false", value: C.oddsText, onChange: Zl("oddsText"), placeholder: `0-0 = 7,50
1-0 = 8,60
0-1 = 9,80`, required: !0 })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-row form-row-wide", children: [
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Vitalité (0–100)",
                    /* @__PURE__ */ c.jsx("input", { min: "0", max: "100", step: "0.1", type: "number", value: C.vitalityScore, onChange: Zl("vitalityScore") }),
                    /* @__PURE__ */ c.jsx("span", { className: "field-help", children: "Vide = non calculable." })
                  ] }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Variation des cotes sur 2 min (%)",
                    /* @__PURE__ */ c.jsx("input", { step: "0.01", type: "number", value: C.oddsChangePercent, onChange: Zl("oddsChangePercent") }),
                    /* @__PURE__ */ c.jsx("span", { className: "field-help", children: "Valeur négative = cotes en baisse. Vide = non calculable." })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-row form-row-wide", children: [
                  /* @__PURE__ */ c.jsxs("label", { className: "check-row", children: [
                    /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: C.halftime, onChange: (r) => ol((E) => ({ ...E, halftime: r.target.checked })) }),
                    "Match à la mi-temps"
                  ] }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Cote Under 2.5 (total du match)",
                    /* @__PURE__ */ c.jsx("input", { min: "0", step: "0.01", type: "number", value: C.under25Odds, onChange: Zl("under25Odds") })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "field-grid", children: [
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Source de tendance",
                    /* @__PURE__ */ c.jsx("select", { value: C.tendanceSource, onChange: Zl("tendanceSource"), children: /* @__PURE__ */ c.jsx("option", { value: "cote_suggeree", children: "Cote du score suggéré" }) })
                  ] }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Seuil de baisse (%)",
                    /* @__PURE__ */ c.jsx("input", { min: "0", step: "0.1", type: "number", value: C.tendanceSeuilStable, onChange: Zl("tendanceSeuilStable") })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("p", { className: "format-hint", children: [
                  "Format accepté : ",
                  /* @__PURE__ */ c.jsx("code", { children: "score = cote" }),
                  " ou ",
                  /* @__PURE__ */ c.jsx("code", { children: "score : cote" }),
                  ". Les paramètres de tendance ne s’appliquent qu’à cette simulation."
                ] }),
                Ht && /* @__PURE__ */ c.jsx("div", { className: "form-error", role: "alert", children: Ht }),
                /* @__PURE__ */ c.jsxs("button", { className: "primary-button", type: "submit", disabled: d, children: [
                  d ? "Évaluation…" : "Évaluer la situation",
                  " ",
                  /* @__PURE__ */ c.jsx(at, { name: "arrow", size: 17 })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("section", { className: "content-panel result-panel", "aria-live": "polite", children: [
              /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("h2", { children: "Résultat de la simulation" }),
                /* @__PURE__ */ c.jsx("p", { children: "Analyse des règles et des filtres" })
              ] }) }),
              nl ? /* @__PURE__ */ c.jsx(Ay, { result: nl }) : /* @__PURE__ */ c.jsx(Oe, { icon: "flask", title: "Prêt à tester", message: "Les résultats apparaîtront ici après l’évaluation des données saisies." })
            ] })
          ] })
        ] }),
        p === "journal" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "HISTORIQUE", title: "Journal des opportunités", description: "Consultez les évaluations, décisions, filtres et résultats associés." }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsxs("form", { className: "filter-toolbar", onSubmit: (r) => {
              r.preventDefault(), ct(Hl);
            }, children: [
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Du",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: Hl.date_from, onChange: (r) => ut((E) => ({ ...E, date_from: r.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Au",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: Hl.date_to, onChange: (r) => ut((E) => ({ ...E, date_to: r.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "ID du match",
                /* @__PURE__ */ c.jsx("input", { min: "1", type: "number", value: Hl.match_id, onChange: (r) => ut((E) => ({ ...E, match_id: r.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Règle",
                /* @__PURE__ */ c.jsx("input", { value: Hl.rule_id, onChange: (r) => ut((E) => ({ ...E, rule_id: r.target.value })), placeholder: "F121-C" })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "État",
                /* @__PURE__ */ c.jsxs("select", { value: Hl.status, onChange: (r) => ut((E) => ({ ...E, status: r.target.value })), children: [
                  /* @__PURE__ */ c.jsx("option", { value: "", children: "Tous" }),
                  /* @__PURE__ */ c.jsx("option", { value: "sans_alerte", children: "Sans alerte" }),
                  /* @__PURE__ */ c.jsx("option", { value: "queued", children: "En attente" }),
                  /* @__PURE__ */ c.jsx("option", { value: "sent", children: "Envoyée" }),
                  /* @__PURE__ */ c.jsx("option", { value: "failed", children: "Échec" }),
                  /* @__PURE__ */ c.jsx("option", { value: "expired", children: "Expirée" }),
                  /* @__PURE__ */ c.jsx("option", { value: "invalidated", children: "Invalidée" })
                ] })
              ] }),
              /* @__PURE__ */ c.jsxs("button", { className: "secondary-button", type: "submit", children: [
                /* @__PURE__ */ c.jsx(at, { name: "search", size: 16 }),
                " Filtrer"
              ] })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Événements récents" }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                xl?.pagination?.total ?? 0,
                " événement(s)"
              ] })
            ] }) }),
            xl?.data?.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Date" }),
                /* @__PURE__ */ c.jsx("th", { children: "Rencontre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Score / minute" }),
                /* @__PURE__ */ c.jsx("th", { children: "Règle" }),
                /* @__PURE__ */ c.jsx("th", { children: "Décision" }),
                /* @__PURE__ */ c.jsx("th", { children: "Justification" }),
                /* @__PURE__ */ c.jsx("th", { children: "Résultat" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: xl.data.map((r) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("td", { children: _u(r.evaluatedAt) }),
                /* @__PURE__ */ c.jsx("td", { children: r.match ?? "—" }),
                /* @__PURE__ */ c.jsxs("td", { children: [
                  r.score ?? "—",
                  r.minute === null ? "" : ` · ${r.minute}′`
                ] }),
                /* @__PURE__ */ c.jsx("td", { children: r.ruleId ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: r.decision }),
                /* @__PURE__ */ c.jsx("td", { children: r.reason }),
                /* @__PURE__ */ c.jsx("td", { children: r.alert ? /* @__PURE__ */ c.jsxs("select", { "aria-label": `Résultat de l’alerte ${r.id}`, value: r.outcome ?? "", onChange: (E) => {
                  Eu(r.id, E.target.value);
                }, children: [
                  /* @__PURE__ */ c.jsx("option", { value: "", children: "À renseigner" }),
                  /* @__PURE__ */ c.jsx("option", { value: "won", children: "Gagnée" }),
                  /* @__PURE__ */ c.jsx("option", { value: "lost", children: "Perdue" }),
                  /* @__PURE__ */ c.jsx("option", { value: "cancelled", children: "Annulée" })
                ] }) : "—" })
              ] }, r.id)) })
            ] }) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "list", title: "Aucun événement", message: "Aucune évaluation ne correspond aux critères choisis." }),
            xl?.pagination?.lastPage > 1 && /* @__PURE__ */ c.jsxs("div", { className: "pagination", children: [
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", disabled: xl.pagination.currentPage <= 1, onClick: () => {
                ct({ ...Hl, page: String(xl.pagination.currentPage - 1) });
              }, children: "Précédent" }),
              /* @__PURE__ */ c.jsxs("span", { children: [
                "Page ",
                xl.pagination.currentPage,
                " / ",
                xl.pagination.lastPage
              ] }),
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", disabled: xl.pagination.currentPage >= xl.pagination.lastPage, onClick: () => {
                ct({ ...Hl, page: String(xl.pagination.currentPage + 1) });
              }, children: "Suivant" })
            ] })
          ] })
        ] }),
        p === "statistics" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "ANALYSE", title: "Statistiques", description: "Indicateurs calculés à partir des alertes et résultats enregistrés." }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsxs("form", { className: "filter-toolbar", onSubmit: (r) => {
              r.preventDefault(), Ul(P);
            }, children: [
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Du",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: P.date_from, onChange: (r) => Tt((E) => ({ ...E, date_from: r.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Au",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: P.date_to, onChange: (r) => Tt((E) => ({ ...E, date_to: r.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("button", { className: "secondary-button", type: "submit", children: [
                /* @__PURE__ */ c.jsx(at, { name: "search", size: 16 }),
                " Appliquer"
              ] })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "stats-grid", children: [["Alertes", rl?.alerts?.total], ["Actives", rl?.alerts?.active], ["Gagnées", rl?.alerts?.won], ["Perdues", rl?.alerts?.lost], ["Annulées", rl?.alerts?.cancelled], ["Sans résultat", rl?.alerts?.unrated], ["Taux de réussite", rl?.alerts?.successRatePercent === null || rl?.alerts?.successRatePercent === void 0 ? "—" : `${rl.alerts.successRatePercent} %`]].map(([r, E]) => /* @__PURE__ */ c.jsxs("article", { className: "stat-card", children: [
              /* @__PURE__ */ c.jsx("span", { children: r }),
              /* @__PURE__ */ c.jsx("strong", { children: E ?? "—" })
            ] }, r)) }),
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsx("div", { children: /* @__PURE__ */ c.jsx("h2", { children: "Résultats par règle" }) }) }),
            rl?.byRule && Object.keys(rl.byRule).length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Règle" }),
                /* @__PURE__ */ c.jsx("th", { children: "Alertes" }),
                /* @__PURE__ */ c.jsx("th", { children: "Gagnées" }),
                /* @__PURE__ */ c.jsx("th", { children: "Perdues" }),
                /* @__PURE__ */ c.jsx("th", { children: "Annulées" }),
                /* @__PURE__ */ c.jsx("th", { children: "Taux" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: Object.entries(rl.byRule).map(([r, E]) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("td", { children: r }),
                /* @__PURE__ */ c.jsx("td", { children: E.alerts }),
                /* @__PURE__ */ c.jsx("td", { children: E.won }),
                /* @__PURE__ */ c.jsx("td", { children: E.lost }),
                /* @__PURE__ */ c.jsx("td", { children: E.cancelled }),
                /* @__PURE__ */ c.jsx("td", { children: E.successRatePercent === null ? "—" : `${E.successRatePercent} %` })
              ] }, r)) })
            ] }) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "chart", title: "Pas encore de résultats", message: "Les statistiques apparaîtront lorsque des alertes et leurs résultats seront consignés." }),
            rl?.refusalsByFilter && Object.keys(rl.refusalsByFilter).length > 0 && /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsx("div", { children: /* @__PURE__ */ c.jsx("h2", { children: "Refus par filtre" }) }) }),
            rl?.refusalsByFilter && Object.entries(rl.refusalsByFilter).map(([r, E]) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
              /* @__PURE__ */ c.jsx("span", { children: r }),
              /* @__PURE__ */ c.jsx("strong", { children: E })
            ] }, r))
          ] })
        ] }),
        p === "settings" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Oa, { eyebrow: "CONFIGURATION", title: "Paramètres", description: "Modifiez les paramètres enregistrés et consultez leur historique.", action: /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
            Ra();
          }, disabled: _t, children: "Tester les notifications" }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(at, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Les paramètres à confirmer sont laissés vides" }),
              /* @__PURE__ */ c.jsx("p", { children: "La tendance reste abstentionniste tant que les confirmations client ne sont pas renseignées. Aucun pari automatique n’est effectué." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("form", { className: "content-panel settings-form", onSubmit: Ca, children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Paramètres du détecteur" }),
              /* @__PURE__ */ c.jsx("p", { children: "Les champs sans valeur ne déclenchent pas de comportement supposé." })
            ] }) }),
            bl.length ? /* @__PURE__ */ c.jsx("div", { className: "settings-list", children: bl.map((r) => /* @__PURE__ */ c.jsxs("label", { className: "setting-row", children: [
              /* @__PURE__ */ c.jsxs("span", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: hh[r.key] ?? r.key }),
                /* @__PURE__ */ c.jsxs("small", { children: [
                  Ey[r.key] ?? "Paramètre utilisé par le détecteur.",
                  r.needsConfirmation ? " · À confirmer" : ""
                ] })
              ] }),
              r.type === "boolean" ? /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: M[r.key] === !0, onChange: (E) => j((L) => ({ ...L, [r.key]: E.target.checked })) }) : r.type === "json" ? /* @__PURE__ */ c.jsx("textarea", { rows: "3", value: M[r.key] ?? "", onChange: (E) => j((L) => ({ ...L, [r.key]: E.target.value })), placeholder: "À confirmer" }) : r.key === "tendance_source" ? /* @__PURE__ */ c.jsx("select", { value: M[r.key] ?? "", onChange: (E) => j((L) => ({ ...L, [r.key]: E.target.value })), children: /* @__PURE__ */ c.jsx("option", { value: "cote_suggeree", children: "Cote du score suggéré" }) }) : /* @__PURE__ */ c.jsx("input", { type: r.type === "integer" || r.type === "decimal" ? "number" : "text", min: r.type === "integer" || r.type === "decimal" ? "0" : void 0, step: r.type === "decimal" ? "0.01" : void 0, value: M[r.key] ?? "", onChange: (E) => j((L) => ({ ...L, [r.key]: E.target.value })), placeholder: r.needsConfirmation ? "À confirmer" : "" })
            ] }, r.key)) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "settings", title: "Paramètres indisponibles", message: "Aucun paramètre enregistré n’a été retourné." }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-actions", children: [
              /* @__PURE__ */ c.jsx("button", { className: "primary-button", type: "submit", disabled: _t || !bl.length, children: "Enregistrer" }),
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
                De();
              }, disabled: _t, children: "Réinitialiser" })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Historique des modifications" }),
              /* @__PURE__ */ c.jsx("p", { children: "Les dernières modifications de paramètres sont conservées." })
            ] }) }),
            Y.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Date" }),
                /* @__PURE__ */ c.jsx("th", { children: "Paramètre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Ancienne valeur" }),
                /* @__PURE__ */ c.jsx("th", { children: "Nouvelle valeur" }),
                /* @__PURE__ */ c.jsx("th", { children: "Administrateur" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: Y.map((r) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("td", { children: _u(r.changedAt) }),
                /* @__PURE__ */ c.jsx("td", { children: hh[r.settingKey] ?? r.settingKey }),
                /* @__PURE__ */ c.jsx("td", { children: r.oldValue ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: r.newValue ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: r.user })
              ] }, r.id)) })
            ] }) }) : /* @__PURE__ */ c.jsx(Oe, { icon: "list", title: "Aucun changement", message: "L’historique se remplira après la première modification." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("footer", { className: "footer", children: [
        /* @__PURE__ */ c.jsx("span", { children: "PRONOFOOT · Phase 1" }),
        /* @__PURE__ */ c.jsx("span", { children: "Détecteur live réservé à l’administration · aucun pari automatique" })
      ] })
    ] })
  ] });
}
by.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ c.jsx(zl.StrictMode, { children: /* @__PURE__ */ c.jsx(Dy, {}) })
);
