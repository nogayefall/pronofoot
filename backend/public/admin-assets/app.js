var _s = { exports: {} }, bn = {};
var eh;
function ry() {
  if (eh) return bn;
  eh = 1;
  var N = /* @__PURE__ */ Symbol.for("react.transitional.element"), Z = /* @__PURE__ */ Symbol.for("react.fragment");
  function X(g, Q, w) {
    var al = null;
    if (w !== void 0 && (al = "" + w), Q.key !== void 0 && (al = "" + Q.key), "key" in Q) {
      w = {};
      for (var Tl in Q)
        Tl !== "key" && (w[Tl] = Q[Tl]);
    } else w = Q;
    return Q = w.ref, {
      $$typeof: N,
      type: g,
      key: al,
      ref: Q !== void 0 ? Q : null,
      props: w
    };
  }
  return bn.Fragment = Z, bn.jsx = X, bn.jsxs = X, bn;
}
var ah;
function oy() {
  return ah || (ah = 1, _s.exports = ry()), _s.exports;
}
var c = oy(), zs = { exports: {} }, V = {};
var uh;
function dy() {
  if (uh) return V;
  uh = 1;
  var N = /* @__PURE__ */ Symbol.for("react.transitional.element"), Z = /* @__PURE__ */ Symbol.for("react.portal"), X = /* @__PURE__ */ Symbol.for("react.fragment"), g = /* @__PURE__ */ Symbol.for("react.strict_mode"), Q = /* @__PURE__ */ Symbol.for("react.profiler"), w = /* @__PURE__ */ Symbol.for("react.consumer"), al = /* @__PURE__ */ Symbol.for("react.context"), Tl = /* @__PURE__ */ Symbol.for("react.forward_ref"), cl = /* @__PURE__ */ Symbol.for("react.suspense"), pl = /* @__PURE__ */ Symbol.for("react.memo"), R = /* @__PURE__ */ Symbol.for("react.lazy"), T = /* @__PURE__ */ Symbol.for("react.activity"), q = /* @__PURE__ */ Symbol.for("react.view_transition"), Cl = Symbol.iterator;
  function Hl(d) {
    return d === null || typeof d != "object" ? null : (d = Cl && d[Cl] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var Zl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, sl = Object.assign, et = {};
  function _l(d, E, M) {
    this.props = d, this.context = E, this.refs = et, this.updater = M || Zl;
  }
  _l.prototype.isReactComponent = {}, _l.prototype.setState = function(d, E) {
    if (typeof d != "object" && typeof d != "function" && d != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, d, E, "setState");
  }, _l.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function me() {
  }
  me.prototype = _l.prototype;
  function ql(d, E, M) {
    this.props = d, this.context = E, this.refs = et, this.updater = M || Zl;
  }
  var at = ql.prototype = new me();
  at.constructor = ql, sl(at, _l.prototype), at.isPureReactComponent = !0;
  var ol = Array.isArray;
  function J() {
  }
  var P = { H: null, A: null, T: null, S: null }, jt = Object.prototype.hasOwnProperty;
  function ft(d, E, M) {
    var C = M.ref;
    return {
      $$typeof: N,
      type: d,
      key: E,
      ref: C !== void 0 ? C : null,
      props: M
    };
  }
  function Ql(d, E) {
    return ft(d.type, E, d.props);
  }
  function ut(d) {
    return typeof d == "object" && d !== null && d.$$typeof === N;
  }
  function st(d) {
    var E = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(M) {
      return E[M];
    });
  }
  var xt = /\/+/g;
  function ml(d, E) {
    return typeof d == "object" && d !== null && d.key != null ? st("" + d.key) : E.toString(36);
  }
  function z(d) {
    switch (d.status) {
      case "fulfilled":
        return d.value;
      case "rejected":
        throw d.reason;
      default:
        switch (typeof d.status == "string" ? d.then(J, J) : (d.status = "pending", d.then(
          function(E) {
            d.status === "pending" && (d.status = "fulfilled", d.value = E);
          },
          function(E) {
            d.status === "pending" && (d.status = "rejected", d.reason = E);
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
  function Y(d, E, M, C, F) {
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
            case N:
            case Z:
              il = !0;
              break;
            case R:
              return il = d._init, Y(
                il(d._payload),
                E,
                M,
                C,
                F
              );
          }
      }
    if (il)
      return F = F(d), il = C === "" ? "." + ml(d, 0) : C, ol(F) ? (M = "", il != null && (M = il.replace(xt, "$&/") + "/"), Y(F, E, M, "", function(Et) {
        return Et;
      })) : F != null && (ut(F) && (F = Ql(
        F,
        M + (F.key == null || d && d.key === F.key ? "" : ("" + F.key).replace(
          xt,
          "$&/"
        ) + "/") + il
      )), E.push(F)), 1;
    il = 0;
    var p = C === "" ? "." : C + ":";
    if (ol(d))
      for (var B = 0; B < d.length; B++)
        C = d[B], ll = p + ml(C, B), il += Y(
          C,
          E,
          M,
          ll,
          F
        );
    else if (B = Hl(d), typeof B == "function")
      for (d = B.call(d), B = 0; !(C = d.next()).done; )
        C = C.value, ll = p + ml(C, B++), il += Y(
          C,
          E,
          M,
          ll,
          F
        );
    else if (ll === "object") {
      if (typeof d.then == "function")
        return Y(
          z(d),
          E,
          M,
          C,
          F
        );
      throw E = String(d), Error(
        "Objects are not valid as a React child (found: " + (E === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : E) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return il;
  }
  function H(d, E, M) {
    if (d == null) return d;
    var C = [], F = 0;
    return Y(d, C, "", "", function(ll) {
      return E.call(M, ll, F++);
    }), C;
  }
  function hl(d) {
    if (d._status === -1) {
      var E = d._result, M = E();
      M.then(
        function(C) {
          (d._status === 0 || d._status === -1) && (d._status = 1, d._result = C, M.status === void 0 && (M.status = "fulfilled", M.value = C));
        },
        function(C) {
          (d._status === 0 || d._status === -1) && (d._status = 2, d._result = C, M.status === void 0 && (M.status = "rejected", M.reason = C));
        }
      ), d._status === -1 && (d._status = 0, d._result = M);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var nl = typeof reportError == "function" ? reportError : function(d) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var E = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof d == "object" && d !== null && typeof d.message == "string" ? String(d.message) : String(d),
        error: d
      });
      if (!window.dispatchEvent(E)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", d);
      return;
    }
    console.error(d);
  };
  function nt(d) {
    var E = P.T, M = {};
    M.types = E !== null ? E.types : null, P.T = M;
    try {
      var C = d(), F = P.S;
      F !== null && F(M, C), typeof C == "object" && C !== null && typeof C.then == "function" && C.then(J, nl);
    } catch (ll) {
      nl(ll);
    } finally {
      E !== null && M.types !== null && (E.types = M.types), P.T = E;
    }
  }
  function qt(d) {
    var E = P.T;
    if (E !== null) {
      var M = E.types;
      M === null ? E.types = [d] : M.indexOf(d) === -1 && M.push(d);
    } else nt(qt.bind(null, d));
  }
  var Yt = {
    map: H,
    forEach: function(d, E, M) {
      H(
        d,
        function() {
          E.apply(this, arguments);
        },
        M
      );
    },
    count: function(d) {
      var E = 0;
      return H(d, function() {
        E++;
      }), E;
    },
    toArray: function(d) {
      return H(d, function(E) {
        return E;
      }) || [];
    },
    only: function(d) {
      if (!ut(d))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return d;
    }
  };
  return V.Activity = T, V.Children = Yt, V.Component = _l, V.Fragment = X, V.Profiler = Q, V.PureComponent = ql, V.StrictMode = g, V.Suspense = cl, V.ViewTransition = q, V.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P, V.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(d) {
      return P.H.useMemoCache(d);
    }
  }, V.addTransitionType = qt, V.cache = function(d) {
    return function() {
      return d.apply(null, arguments);
    };
  }, V.cacheSignal = function() {
    return null;
  }, V.cloneElement = function(d, E, M) {
    if (d == null)
      throw Error(
        "The argument must be a React element, but you passed " + d + "."
      );
    var C = sl({}, d.props), F = d.key;
    if (E != null)
      for (ll in E.key !== void 0 && (F = "" + E.key), E)
        !jt.call(E, ll) || ll === "key" || ll === "__self" || ll === "__source" || ll === "ref" && E.ref === void 0 || (C[ll] = E[ll]);
    var ll = arguments.length - 2;
    if (ll === 1) C.children = M;
    else if (1 < ll) {
      for (var il = Array(ll), p = 0; p < ll; p++)
        il[p] = arguments[p + 2];
      C.children = il;
    }
    return ft(d.type, F, C);
  }, V.createContext = function(d) {
    return d = {
      $$typeof: al,
      _currentValue: d,
      _currentValue2: d,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, d.Provider = d, d.Consumer = {
      $$typeof: w,
      _context: d
    }, d;
  }, V.createElement = function(d, E, M) {
    var C, F = {}, ll = null;
    if (E != null)
      for (C in E.key !== void 0 && (ll = "" + E.key), E)
        jt.call(E, C) && C !== "key" && C !== "__self" && C !== "__source" && (F[C] = E[C]);
    var il = arguments.length - 2;
    if (il === 1) F.children = M;
    else if (1 < il) {
      for (var p = Array(il), B = 0; B < il; B++)
        p[B] = arguments[B + 2];
      F.children = p;
    }
    if (d && d.defaultProps)
      for (C in il = d.defaultProps, il)
        F[C] === void 0 && (F[C] = il[C]);
    return ft(d, ll, F);
  }, V.createRef = function() {
    return { current: null };
  }, V.forwardRef = function(d) {
    return { $$typeof: Tl, render: d };
  }, V.isValidElement = ut, V.lazy = function(d) {
    return {
      $$typeof: R,
      _payload: { _status: -1, _result: d },
      _init: hl
    };
  }, V.memo = function(d, E) {
    return {
      $$typeof: pl,
      type: d,
      compare: E === void 0 ? null : E
    };
  }, V.startTransition = nt, V.unstable_useCacheRefresh = function() {
    return P.H.useCacheRefresh();
  }, V.use = function(d) {
    return P.H.use(d);
  }, V.useActionState = function(d, E, M) {
    return P.H.useActionState(d, E, M);
  }, V.useCallback = function(d, E) {
    return P.H.useCallback(d, E);
  }, V.useContext = function(d) {
    return P.H.useContext(d);
  }, V.useDebugValue = function() {
  }, V.useDeferredValue = function(d, E) {
    return P.H.useDeferredValue(d, E);
  }, V.useEffect = function(d, E) {
    return P.H.useEffect(d, E);
  }, V.useEffectEvent = function(d) {
    return P.H.useEffectEvent(d);
  }, V.useId = function() {
    return P.H.useId();
  }, V.useImperativeHandle = function(d, E, M) {
    return P.H.useImperativeHandle(d, E, M);
  }, V.useInsertionEffect = function(d, E) {
    return P.H.useInsertionEffect(d, E);
  }, V.useLayoutEffect = function(d, E) {
    return P.H.useLayoutEffect(d, E);
  }, V.useMemo = function(d, E) {
    return P.H.useMemo(d, E);
  }, V.useOptimistic = function(d, E) {
    return P.H.useOptimistic(d, E);
  }, V.useReducer = function(d, E, M) {
    return P.H.useReducer(d, E, M);
  }, V.useRef = function(d) {
    return P.H.useRef(d);
  }, V.useState = function(d) {
    return P.H.useState(d);
  }, V.useSyncExternalStore = function(d, E, M) {
    return P.H.useSyncExternalStore(
      d,
      E,
      M
    );
  }, V.useTransition = function() {
    return P.H.useTransition();
  }, V.version = "19.3.1", V;
}
var nh;
function Cs() {
  return nh || (nh = 1, zs.exports = dy()), zs.exports;
}
var zl = Cs(), ps = { exports: {} }, Tn = {}, Os = { exports: {} }, As = {};
var ih;
function my() {
  return ih || (ih = 1, (function(N) {
    function Z(z, Y) {
      var H = z.length;
      z.push(Y);
      l: for (; 0 < H; ) {
        var hl = H - 1 >>> 1, nl = z[hl];
        if (0 < Q(nl, Y))
          z[hl] = Y, z[H] = nl, H = hl;
        else break l;
      }
    }
    function X(z) {
      return z.length === 0 ? null : z[0];
    }
    function g(z) {
      if (z.length === 0) return null;
      var Y = z[0], H = z.pop();
      if (H !== Y) {
        z[0] = H;
        l: for (var hl = 0, nl = z.length, nt = nl >>> 1; hl < nt; ) {
          var qt = 2 * (hl + 1) - 1, Yt = z[qt], d = qt + 1, E = z[d];
          if (0 > Q(Yt, H))
            d < nl && 0 > Q(E, Yt) ? (z[hl] = E, z[d] = H, hl = d) : (z[hl] = Yt, z[qt] = H, hl = qt);
          else if (d < nl && 0 > Q(E, H))
            z[hl] = E, z[d] = H, hl = d;
          else break l;
        }
      }
      return Y;
    }
    function Q(z, Y) {
      var H = z.sortIndex - Y.sortIndex;
      return H !== 0 ? H : z.id - Y.id;
    }
    if (N.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var w = performance;
      N.unstable_now = function() {
        return w.now();
      };
    } else {
      var al = Date, Tl = al.now();
      N.unstable_now = function() {
        return al.now() - Tl;
      };
    }
    var cl = [], pl = [], R = 1, T = null, q = 3, Cl = !1, Hl = !1, Zl = !1, sl = !1, et = typeof setTimeout == "function" ? setTimeout : null, _l = typeof clearTimeout == "function" ? clearTimeout : null, me = typeof setImmediate < "u" ? setImmediate : null;
    function ql(z) {
      for (var Y = X(pl); Y !== null; ) {
        if (Y.callback === null) g(pl);
        else if (Y.startTime <= z)
          g(pl), Y.sortIndex = Y.expirationTime, Z(cl, Y);
        else break;
        Y = X(pl);
      }
    }
    function at(z) {
      if (Zl = !1, ql(z), !Hl)
        if (X(cl) !== null)
          Hl = !0, ol || (ol = !0, ut());
        else {
          var Y = X(pl);
          Y !== null && ml(at, Y.startTime - z);
        }
    }
    var ol = !1, J = -1, P = 5, jt = -1;
    function ft() {
      return sl ? !0 : !(N.unstable_now() - jt < P);
    }
    function Ql() {
      if (sl = !1, ol) {
        var z = N.unstable_now();
        jt = z;
        var Y = !0;
        try {
          l: {
            Hl = !1, Zl && (Zl = !1, _l(J), J = -1), Cl = !0;
            var H = q;
            try {
              t: {
                for (ql(z), T = X(cl); T !== null && !(T.expirationTime > z && ft()); ) {
                  var hl = T.callback;
                  if (typeof hl == "function") {
                    T.callback = null, q = T.priorityLevel;
                    var nl = hl(
                      T.expirationTime <= z
                    );
                    if (z = N.unstable_now(), typeof nl == "function") {
                      T.callback = nl, ql(z), Y = !0;
                      break t;
                    }
                    T === X(cl) && g(cl), ql(z);
                  } else g(cl);
                  T = X(cl);
                }
                if (T !== null) Y = !0;
                else {
                  var nt = X(pl);
                  nt !== null && ml(
                    at,
                    nt.startTime - z
                  ), Y = !1;
                }
              }
              break l;
            } finally {
              T = null, q = H, Cl = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? ut() : ol = !1;
        }
      }
    }
    var ut;
    if (typeof me == "function")
      ut = function() {
        me(Ql);
      };
    else if (typeof MessageChannel < "u") {
      var st = new MessageChannel(), xt = st.port2;
      st.port1.onmessage = Ql, ut = function() {
        xt.postMessage(null);
      };
    } else
      ut = function() {
        et(Ql, 0);
      };
    function ml(z, Y) {
      J = et(function() {
        z(N.unstable_now());
      }, Y);
    }
    N.unstable_IdlePriority = 5, N.unstable_ImmediatePriority = 1, N.unstable_LowPriority = 4, N.unstable_NormalPriority = 3, N.unstable_Profiling = null, N.unstable_UserBlockingPriority = 2, N.unstable_cancelCallback = function(z) {
      z.callback = null;
    }, N.unstable_forceFrameRate = function(z) {
      0 > z || 125 < z ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : P = 0 < z ? Math.floor(1e3 / z) : 5;
    }, N.unstable_getCurrentPriorityLevel = function() {
      return q;
    }, N.unstable_next = function(z) {
      switch (q) {
        case 1:
        case 2:
        case 3:
          var Y = 3;
          break;
        default:
          Y = q;
      }
      var H = q;
      q = Y;
      try {
        return z();
      } finally {
        q = H;
      }
    }, N.unstable_requestPaint = function() {
      sl = !0;
    }, N.unstable_runWithPriority = function(z, Y) {
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
      var H = q;
      q = z;
      try {
        return Y();
      } finally {
        q = H;
      }
    }, N.unstable_scheduleCallback = function(z, Y, H) {
      var hl = N.unstable_now();
      switch (typeof H == "object" && H !== null ? (H = H.delay, H = typeof H == "number" && 0 < H ? hl + H : hl) : H = hl, z) {
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
      return nl = H + nl, z = {
        id: R++,
        callback: Y,
        priorityLevel: z,
        startTime: H,
        expirationTime: nl,
        sortIndex: -1
      }, H > hl ? (z.sortIndex = H, Z(pl, z), X(cl) === null && z === X(pl) && (Zl ? (_l(J), J = -1) : Zl = !0, ml(at, H - hl))) : (z.sortIndex = nl, Z(cl, z), Hl || Cl || (Hl = !0, ol || (ol = !0, ut()))), z;
    }, N.unstable_shouldYield = ft, N.unstable_wrapCallback = function(z) {
      var Y = q;
      return function() {
        var H = q;
        q = Y;
        try {
          return z.apply(this, arguments);
        } finally {
          q = H;
        }
      };
    };
  })(As)), As;
}
var ch;
function hy() {
  return ch || (ch = 1, Os.exports = my()), Os.exports;
}
var Ds = { exports: {} }, tt = {};
var fh;
function vy() {
  if (fh) return tt;
  fh = 1;
  var N = Cs();
  function Z(R) {
    var T = "https://react.dev/errors/" + R;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var q = 2; q < arguments.length; q++)
        T += "&args[]=" + encodeURIComponent(arguments[q]);
    }
    return "Minified React error #" + R + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function X() {
  }
  var g = {
    d: {
      f: X,
      r: function() {
        throw Error(Z(522));
      },
      D: X,
      C: X,
      L: X,
      m: X,
      X,
      S: X,
      M: X
    },
    p: 0,
    findDOMNode: null
  }, Q = /* @__PURE__ */ Symbol.for("react.portal"), w = /* @__PURE__ */ Symbol.for("react.recoverable"), al = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function Tl(R, T, q) {
    var Cl = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Q,
      key: Cl == null ? null : Cl === al ? al : "" + Cl,
      children: R,
      containerInfo: T,
      implementation: q
    };
  }
  var cl = N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function pl(R, T) {
    if (R === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return tt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = g, tt.browser = function(R) {
    return { $$typeof: w, _reason: R };
  }, tt.createPortal = function(R, T) {
    var q = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(Z(299));
    return Tl(R, T, null, q);
  }, tt.flushSync = function(R) {
    var T = cl.T, q = g.p;
    try {
      if (cl.T = null, g.p = 2, R) return R();
    } finally {
      cl.T = T, g.p = q, g.d.f();
    }
  }, tt.preconnect = function(R, T) {
    typeof R == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, g.d.C(R, T));
  }, tt.prefetchDNS = function(R) {
    typeof R == "string" && g.d.D(R);
  }, tt.preinit = function(R, T) {
    if (typeof R == "string" && T && typeof T.as == "string") {
      var q = T.as, Cl = pl(q, T.crossOrigin), Hl = typeof T.integrity == "string" ? T.integrity : void 0, Zl = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      q === "style" ? g.d.S(
        R,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: Cl,
          integrity: Hl,
          fetchPriority: Zl
        }
      ) : q === "script" && g.d.X(R, {
        crossOrigin: Cl,
        integrity: Hl,
        fetchPriority: Zl,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, tt.preinitModule = function(R, T) {
    if (typeof R == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var q = pl(
            T.as,
            T.crossOrigin
          );
          g.d.M(R, {
            crossOrigin: q,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0,
            fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0
          });
        }
      } else T == null && g.d.M(R);
  }, tt.preload = function(R, T) {
    if (typeof R == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var q = T.as, Cl = pl(q, T.crossOrigin);
      g.d.L(R, q, {
        crossOrigin: Cl,
        integrity: typeof T.integrity == "string" ? T.integrity : void 0,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0,
        type: typeof T.type == "string" ? T.type : void 0,
        fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0,
        referrerPolicy: typeof T.referrerPolicy == "string" ? T.referrerPolicy : void 0,
        imageSrcSet: typeof T.imageSrcSet == "string" ? T.imageSrcSet : void 0,
        imageSizes: typeof T.imageSizes == "string" ? T.imageSizes : void 0,
        media: typeof T.media == "string" ? T.media : void 0
      });
    }
  }, tt.preloadModule = function(R, T) {
    if (typeof R == "string")
      if (T) {
        var q = pl(T.as, T.crossOrigin);
        g.d.m(R, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: q,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0,
          nonce: typeof T.nonce == "string" ? T.nonce : void 0,
          fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0
        });
      } else g.d.m(R);
  }, tt.requestFormReset = function(R) {
    g.d.r(R);
  }, tt.unstable_batchedUpdates = function(R, T) {
    return R(T);
  }, tt.useFormState = function(R, T, q) {
    return cl.H.useFormState(R, T, q);
  }, tt.useFormStatus = function() {
    return cl.H.useHostTransitionStatus();
  }, tt.version = "19.3.1", tt;
}
var sh;
function yy() {
  if (sh) return Ds.exports;
  sh = 1;
  function N() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(N);
      } catch (Z) {
        console.error(Z);
      }
  }
  return N(), Ds.exports = vy(), Ds.exports;
}
var rh;
function gy() {
  if (rh) return Tn;
  rh = 1;
  var N = hy(), Z = Cs(), X = yy();
  function g(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Q(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function w(l) {
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
  function Tl(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function cl(l) {
    if (w(l) !== l)
      throw Error(g(188));
  }
  function pl(l) {
    var t = l.alternate;
    if (!t) {
      if (t = w(l), t === null) throw Error(g(188));
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
          if (n === e) return cl(u), l;
          if (n === a) return cl(u), t;
          n = n.sibling;
        }
        throw Error(g(188));
      }
      if (e.return !== a.return) e = u, a = n;
      else {
        for (var i = !1, f = u.child; f; ) {
          if (f === e) {
            i = !0, e = u, a = n;
            break;
          }
          if (f === a) {
            i = !0, a = u, e = n;
            break;
          }
          f = f.sibling;
        }
        if (!i) {
          for (f = n.child; f; ) {
            if (f === e) {
              i = !0, e = n, a = u;
              break;
            }
            if (f === a) {
              i = !0, a = n, e = u;
              break;
            }
            f = f.sibling;
          }
          if (!i) throw Error(g(189));
        }
      }
      if (e.alternate !== a) throw Error(g(190));
    }
    if (e.tag !== 3) throw Error(g(188));
    return e.stateNode.current === e ? l : t;
  }
  function R(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = R(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  function T(l, t, e, a, u, n) {
    for (; l !== null; ) {
      if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && e(l, a, u, n) || (l.tag !== 22 || l.memoizedState === null) && (t || l.tag !== 5 && l.tag !== 27) && T(
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
  function q(l) {
    for (l = l.return; l !== null; ) {
      if (l.tag === 3 || l.tag === 5 || l.tag === 27) return l;
      l = l.return;
    }
    return null;
  }
  function Cl(l) {
    var t = !1;
    for (l = l.return; l !== null && (l.tag === 4 && (t = !0), !(l.tag === 3 || l.tag === 5 || l.tag === 27)); )
      l = l.return;
    return t;
  }
  function Hl(l) {
    var t = [null, null], e = q(l);
    return e === null || Zl(
      t,
      l,
      e.child,
      { foundSelf: !1 }
    ), t;
  }
  function Zl(l, t, e, a) {
    for (; e !== null; ) {
      if (e === t) a.foundSelf = !0;
      else if (e.tag === 5 || e.tag === 27 || e.tag === 6) {
        if (a.foundSelf) return l[1] = e, !0;
        l[0] = e;
      } else if ((e.tag !== 22 || e.memoizedState === null) && Zl(
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
  function sl(l) {
    switch (l.tag) {
      case 5:
      case 27:
      case 6:
        return l.stateNode;
      case 3:
        return l.stateNode.containerInfo;
      default:
        throw Error(g(559));
    }
  }
  var et = null, _l = null;
  function me(l, t, e) {
    return l === e ? !0 : l === t ? (et = l, !0) : !1;
  }
  function ql(l, t, e) {
    return l === e ? (_l = l, !1) : l === t ? (_l !== null && (et = l), !0) : !1;
  }
  function at(l) {
    if (l === null) return null;
    do
      l = l === null ? null : l.return;
    while (l && l.tag !== 5 && l.tag !== 27 && l.tag !== 3);
    return l || null;
  }
  function ol(l, t, e) {
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
  var J = Object.assign, P = /* @__PURE__ */ Symbol.for("react.element"), jt = /* @__PURE__ */ Symbol.for("react.transitional.element"), ft = /* @__PURE__ */ Symbol.for("react.portal"), Ql = /* @__PURE__ */ Symbol.for("react.fragment"), ut = /* @__PURE__ */ Symbol.for("react.strict_mode"), st = /* @__PURE__ */ Symbol.for("react.profiler"), xt = /* @__PURE__ */ Symbol.for("react.consumer"), ml = /* @__PURE__ */ Symbol.for("react.context"), z = /* @__PURE__ */ Symbol.for("react.forward_ref"), Y = /* @__PURE__ */ Symbol.for("react.suspense"), H = /* @__PURE__ */ Symbol.for("react.suspense_list"), hl = /* @__PURE__ */ Symbol.for("react.memo"), nl = /* @__PURE__ */ Symbol.for("react.lazy"), nt = /* @__PURE__ */ Symbol.for("react.activity"), qt = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), Yt = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), d = /* @__PURE__ */ Symbol.for("react.view_transition"), E = /* @__PURE__ */ Symbol.for("react.recoverable"), M = Symbol.iterator;
  function C(l) {
    return l === null || typeof l != "object" ? null : (l = M && l[M] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var F = /* @__PURE__ */ Symbol.for("react.client.reference");
  function ll(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === F ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Ql:
        return "Fragment";
      case st:
        return "Profiler";
      case ut:
        return "StrictMode";
      case Y:
        return "Suspense";
      case H:
        return "SuspenseList";
      case nt:
        return "Activity";
      case d:
        return "ViewTransition";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case ft:
          return "Portal";
        case ml:
          return l.displayName || "Context";
        case xt:
          return (l._context.displayName || "Context") + ".Consumer";
        case z:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case hl:
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
  var il = Array.isArray, p = Z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = X.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Et = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Da = [], le = -1;
  function it(l) {
    return { current: l };
  }
  function Rl(l) {
    0 > le || (l.current = Da[le], Da[le] = null, le--);
  }
  function vl(l, t) {
    le++, Da[le] = l.current, l.current = t;
  }
  var Ll = it(null), na = it(null), te = it(null), Ma = it(null);
  function Ca(l, t) {
    switch (vl(te, t), vl(na, l), vl(Ll, null), t.nodeType) {
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
    Rl(Ll), vl(Ll, l);
  }
  function Ae() {
    Rl(Ll), Rl(na), Rl(te);
  }
  function Eu(l) {
    var t = l.memoizedState;
    t !== null && (Tu._currentValue = t.memoizedState, vl(Ma, l)), t = Ll.current;
    var e = dm(t, l.type);
    t !== e && (vl(na, l), vl(Ll, e));
  }
  function Ra(l) {
    na.current === l && (Rl(Ll), Rl(na)), Ma.current === l && (Rl(Ma), Tu._currentValue = Et);
  }
  var Nu, xn;
  function Nt(l) {
    if (Nu === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        Nu = t && t[1] || "", xn = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Nu + l + xn;
  }
  var De = !1;
  function o(l, t) {
    if (!l || De) return "";
    De = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var x = function() {
                throw Error();
              };
              if (Object.defineProperty(x.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(x, []);
                } catch (_) {
                  var m = _;
                }
                Reflect.construct(l, [], x);
              } else {
                try {
                  x.call();
                } catch (_) {
                  m = _;
                }
                x = !1;
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
                  }), x = !0, new l();
                } finally {
                  x && (S !== void 0 ? Object.defineProperty(l.prototype, "props", S) : delete l.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (_) {
                m = _;
              }
              (x = l()) && typeof x.catch == "function" && x.catch(function() {
              });
            }
          } catch (_) {
            if (_ && m && typeof _.stack == "string")
              return [_.stack, m.stack];
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
      var n = a.DetermineComponentFrameRoot(), i = n[0], f = n[1];
      if (i && f) {
        var s = i.split(`
`), v = f.split(`
`);
        for (u = a = 0; a < s.length && !s[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; u < v.length && !v[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (a === s.length || u === v.length)
          for (a = s.length - 1, u = v.length - 1; 1 <= a && 0 <= u && s[a] !== v[u]; )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (s[a] !== v[u]) {
            if (a !== 1 || u !== 1)
              do
                if (a--, u--, 0 > u || s[a] !== v[u]) {
                  var b = `
` + s[a].replace(" at new ", " at ");
                  return l.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", l.displayName)), b;
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      De = !1, Error.prepareStackTrace = e;
    }
    return (e = l ? l.displayName || l.name : "") ? Nt(e) : "";
  }
  function O(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Nt(l.type);
      case 16:
        return Nt("Lazy");
      case 13:
        return l.child !== t && t !== null ? Nt("Suspense Fallback") : Nt("Suspense");
      case 19:
        return Nt("SuspenseList");
      case 0:
      case 15:
        return o(l.type, !1);
      case 11:
        return o(l.type.render, !1);
      case 1:
        return o(l.type, !0);
      case 31:
        return Nt("Activity");
      case 30:
        return Nt("ViewTransition");
      default:
        return "";
    }
  }
  function W(l) {
    try {
      var t = "", e = null;
      do
        t += O(l, e), e = l, l = l.return;
      while (l);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var jl = Object.prototype.hasOwnProperty, Jt = N.unstable_scheduleCallback, Wi = N.unstable_cancelCallback, vh = N.unstable_shouldYield, yh = N.unstable_requestPaint, _t = N.unstable_now, gh = N.unstable_getCurrentPriorityLevel, Rs = N.unstable_ImmediatePriority, Us = N.unstable_UserBlockingPriority, En = N.unstable_NormalPriority, Sh = N.unstable_LowPriority, Hs = N.unstable_IdlePriority, bh = N.log, Th = N.unstable_setDisableYieldValue, _u = null, zt = null;
  function Me(l) {
    if (typeof bh == "function" && Th(l), zt && typeof zt.setStrictMode == "function")
      try {
        zt.setStrictMode(_u, l);
      } catch {
      }
  }
  var pt = Math.clz32 ? Math.clz32 : Eh, jh = Math.log, xh = Math.LN2;
  function Eh(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (jh(l) / xh | 0) | 0;
  }
  var Nn = 256, _n = 262144, zn = 4194304;
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
  function pn(l, t, e) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var u = 0, n = l.suspendedLanes, i = l.pingedLanes;
    l = l.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~n, a !== 0 ? u = ia(a) : (i &= f, i !== 0 ? u = ia(i) : e || (e = f & ~l, e !== 0 && (u = ia(e))))) : (f = a & ~n, f !== 0 ? u = ia(f) : i !== 0 ? u = ia(i) : e || (e = a & ~l, e !== 0 && (u = ia(e)))), u === 0 ? 0 : t !== 0 && t !== u && (t & n) === 0 && (n = u & -u, e = t & -t, n >= e || n === 32 && (e & 4194048) !== 0) ? t : u;
  }
  function zu(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function qs(l, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var e = l.entangledLanes;
    if (e !== 0)
      for (l = l.entanglements, e &= t; 0 < e; ) {
        var a = 31 - pt(e), u = 1 << a;
        t |= l[a], e &= ~u;
      }
    return t;
  }
  function Nh(l, t) {
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
  function Ys() {
    var l = zn;
    return zn <<= 1, (zn & 62914560) === 0 && (zn = 4194304), l;
  }
  function ki(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function pu(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function _h(l, t, e, a, u, n) {
    var i = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var f = l.entanglements, s = l.expirationTimes, v = l.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var b = 31 - pt(e), x = 1 << b;
      f[b] = 0, s[b] = -1;
      var m = v[b];
      if (m !== null)
        for (v[b] = null, b = 0; b < m.length; b++) {
          var S = m[b];
          S !== null && (S.lane &= -536870913);
        }
      e &= ~x;
    }
    a !== 0 && Bs(l, a, 0), n !== 0 && u === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t));
  }
  function Bs(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - pt(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | e & 261930;
  }
  function Gs(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var a = 31 - pt(e), u = 1 << a;
      u & t | l[a] & t && (l[a] |= t), e &= ~u;
    }
  }
  function Xs(l, t) {
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
  function Qs() {
    var l = B.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : $m(l.type));
  }
  function Vs(l, t) {
    var e = B.p;
    try {
      return B.p = l, t();
    } finally {
      B.p = e;
    }
  }
  var he = Math.random().toString(36).slice(2), $l = "__reactFiber$" + he, vt = "__reactProps$" + he, Ua = "__reactContainer$" + he, Zs = "__reactEvents$" + he, zh = "__reactListeners$" + he, ph = "__reactHandles$" + he, Ls = "__reactResources$" + he, Ou = "__reactMarker$" + he, On = "__reactLoad$" + he;
  function An(l) {
    delete l[$l], delete l[vt], delete l[zh], delete l[ph];
  }
  function ca(l) {
    var t;
    if (t = l[$l]) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[Ua] || e[$l]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = Am(l); l !== null; ) {
            if (e = l[$l]) return e;
            l = Am(l);
          }
        return t;
      }
      l = e, e = l.parentNode;
    }
    return null;
  }
  function Ha(l) {
    if (l = l[$l] || l[Ua]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Au(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(g(33));
  }
  function qa(l) {
    var t = l[Ls];
    return t || (t = l[Ls] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Kl(l) {
    l[Ou] = !0;
  }
  function Ks(l) {
    l[On] = void 0;
  }
  var ws = /* @__PURE__ */ new Set(), Js = {};
  function fa(l, t) {
    Ya(l, t), Ya(l + "Capture", t);
  }
  function Ya(l, t) {
    for (Js[l] = t, l = 0; l < t.length; l++)
      ws.add(t[l]);
  }
  var Oh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Fs = {}, $s = {};
  function Ah(l) {
    return jl.call($s, l) ? !0 : jl.call(Fs, l) ? !1 : Oh.test(l) ? $s[l] = !0 : (Fs[l] = !0, !1);
  }
  var fl = !1;
  function Ws() {
    var l = fl;
    return fl = !1, l;
  }
  function Dn(l, t, e) {
    if (Ah(t))
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
  function Ot(l) {
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
  function ks(l) {
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
      var t = ks(l) ? "checked" : "value";
      l._valueTracker = Dh(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function Is(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), a = "";
    return l && (a = ks(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== e ? (t.setValue(l), !0) : !1;
  }
  var Mh = /[\n"\\]/g;
  function Bt(l) {
    return l.replace(
      Mh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function tc(l, t, e, a, u, n, i, f) {
    l.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.type = i : l.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + Ot(t)) : l.value !== "" + Ot(t) && (l.value = "" + Ot(t)) : i !== "submit" && i !== "reset" || l.removeAttribute("value"), t != null ? i === "number" && l.value == t ? ec(l, Ot(l.value)) : ec(l, Ot(t)) : e != null ? ec(l, Ot(e)) : a != null && l.removeAttribute("value"), u == null && n != null && (l.defaultChecked = !!n), u != null && (l.checked = u && typeof u != "function" && typeof u != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.name = "" + Ot(f) : l.removeAttribute("name");
  }
  function Ps(l, t, e, a, u, n, i, f) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || e != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        lc(l);
        return;
      }
      e = e != null ? "" + Ot(e) : "", t = t != null ? "" + Ot(t) : e, f || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = f ? l.checked : !!a, l.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (l.name = i), lc(l);
  }
  function ec(l, t) {
    l.defaultValue !== "" + t && (l.defaultValue = "" + t);
  }
  function Ba(l, t, e, a) {
    if (l = l.options, t) {
      t = {};
      for (var u = 0; u < e.length; u++)
        t["$" + e[u]] = !0;
      for (e = 0; e < l.length; e++)
        u = t.hasOwnProperty("$" + l[e].value), l[e].selected !== u && (l[e].selected = u), u && a && (l[e].defaultSelected = !0);
    } else {
      for (e = "" + Ot(e), t = null, u = 0; u < l.length; u++) {
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
    if (t != null && (t = "" + Ot(t), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + Ot(e) : "";
  }
  function tr(l, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(g(92));
        if (il(a)) {
          if (1 < a.length) throw Error(g(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), t = e;
    }
    e = Ot(t), l.defaultValue = e, a = l.textContent, a === e && a !== "" && a !== null && (l.value = a), lc(l);
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
      throw Error(g(62));
    if (l = l.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "", fl = !0);
      for (var u in t)
        a = t[u], t.hasOwnProperty(u) && e[u] !== a && (er(l, u, a), fl = !0);
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
  var Xa = null, Qa = null;
  function ur(l) {
    var t = Ha(l);
    if (t && (l = t.stateNode)) {
      var e = l[vt] || null;
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
              'input[name="' + Bt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var a = e[t];
              if (a !== l && a.form === l.form) {
                var u = a[vt] || null;
                if (!u) throw Error(g(90));
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
              a = e[t], a.form === l.form && Is(a);
          }
          break l;
        case "textarea":
          lr(l, e.value, e.defaultValue);
          break l;
        case "select":
          t = e.value, t != null && Ba(l, !!e.multiple, t, !1);
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
      if (ic = !1, (Xa !== null || Qa !== null) && (Ci(), Xa && (t = Xa, l = Qa, Qa = Xa = null, ur(t), l)))
        for (t = 0; t < l.length; t++) ur(l[t]);
    }
  }
  function Du(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var a = e[vt] || null;
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
        g(231, t, typeof e)
      );
    return e;
  }
  var ye = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), cc = !1;
  if (ye)
    try {
      var Mu = {};
      Object.defineProperty(Mu, "passive", {
        get: function() {
          cc = !0;
        }
      }), window.addEventListener("test", Mu, Mu), window.removeEventListener("test", Mu, Mu);
    } catch {
      cc = !1;
    }
  var Ce = null, fc = null, Rn = null;
  function ir() {
    if (Rn) return Rn;
    var l, t = fc, e = t.length, a, u = "value" in Ce ? Ce.value : Ce.textContent, n = u.length;
    for (l = 0; l < e && t[l] === u[l]; l++) ;
    var i = e - l;
    for (a = 1; a <= i && t[e - a] === u[n - a]; a++) ;
    return Rn = u.slice(l, 1 < a ? 1 - a : void 0);
  }
  function Un(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Hn() {
    return !0;
  }
  function cr() {
    return !1;
  }
  function rt(l) {
    function t(e, a, u, n, i) {
      this._reactName = e, this._targetInst = u, this.type = a, this.nativeEvent = n, this.target = i, this.currentTarget = null;
      for (var f in l)
        l.hasOwnProperty(f) && (e = l[f], this[f] = e ? e(n) : n[f]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Hn : cr, this.isPropagationStopped = cr, this;
    }
    return J(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Hn);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Hn);
      },
      persist: function() {
      },
      isPersistent: Hn
    }), t;
  }
  var Re = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, qn = rt(Re), Cu = J({}, Re, { view: 0, detail: 0 }), Hh = rt(Cu), sc, rc, Ru, Yn = J({}, Cu, {
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
      return "movementX" in l ? l.movementX : (l !== Ru && (Ru && l.type === "mousemove" ? (sc = l.screenX - Ru.screenX, rc = l.screenY - Ru.screenY) : rc = sc = 0, Ru = l), sc);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : rc;
    }
  }), fr = rt(Yn), qh = J({}, Yn, { dataTransfer: 0 }), Yh = rt(qh), Bh = J({}, Cu, { relatedTarget: 0 }), oc = rt(Bh), Gh = J({}, Re, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Xh = rt(Gh), Qh = J({}, Re, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Vh = rt(Qh), Zh = J({}, Re, { data: 0 }), sr = rt(Zh), Lh = {
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
  }, Kh = {
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
  }, wh = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Jh(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = wh[l]) ? !!t[l] : !1;
  }
  function dc() {
    return Jh;
  }
  var Fh = J({}, Cu, {
    key: function(l) {
      if (l.key) {
        var t = Lh[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Un(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? Kh[l.keyCode] || "Unidentified" : "";
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
  }), $h = rt(Fh), Wh = J({}, Yn, {
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
  }), rr = rt(Wh), kh = J({}, Re, { submitter: 0 }), Ih = rt(kh), Ph = J({}, Cu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: dc
  }), lv = rt(Ph), tv = J({}, Re, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ev = rt(tv), av = J({}, Yn, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), uv = rt(av), nv = J({}, Re, {
    newState: 0,
    oldState: 0,
    source: 0
  }), iv = rt(nv), cv = [9, 13, 27, 32], mc = ye && "CompositionEvent" in window, Uu = null;
  ye && "documentMode" in document && (Uu = document.documentMode);
  var fv = ye && "TextEvent" in window && !Uu, or = ye && (!mc || Uu && 8 < Uu && 11 >= Uu), dr = " ", mr = !1;
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
  function sv(l, t) {
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
      return l === "compositionend" || !mc && hr(l, t) ? (l = ir(), Rn = fc = Ce = null, Va = !1, l) : null;
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
    Xa ? Qa ? Qa.push(a) : Qa = [a] : Xa = a, t = Bi(t, "onChange"), 0 < t.length && (e = new qn(
      "onChange",
      "change",
      null,
      e,
      a
    ), l.push({ event: e, listeners: t }));
  }
  var Hu = null, qu = null;
  function dv(l) {
    nm(l, 0);
  }
  function Bn(l) {
    var t = Au(l);
    if (Is(t)) return l;
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
        var Tr = document.createElement("div");
        Tr.setAttribute("oninput", "return;"), vc = typeof Tr.oninput == "function";
      }
      hc = vc;
    } else hc = !1;
    br = hc && (!document.documentMode || 9 < document.documentMode);
  }
  function jr() {
    Hu && (Hu.detachEvent("onpropertychange", xr), qu = Hu = null);
  }
  function xr(l) {
    if (l.propertyName === "value" && Bn(qu)) {
      var t = [];
      gr(
        t,
        qu,
        l,
        nc(l)
      ), nr(dv, t);
    }
  }
  function mv(l, t, e) {
    l === "focusin" ? (jr(), Hu = t, qu = e, Hu.attachEvent("onpropertychange", xr)) : l === "focusout" && jr();
  }
  function hv(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Bn(qu);
  }
  function vv(l, t) {
    if (l === "click") return Bn(t);
  }
  function yv(l, t) {
    if (l === "input" || l === "change")
      return Bn(t);
  }
  function gv(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var At = typeof Object.is == "function" ? Object.is : gv;
  function Yu(l, t) {
    if (At(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!jl.call(t, u) || !At(l[u], t[u]))
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
  function Er(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function Nr(l, t) {
    var e = Er(l);
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
      e = Er(e);
    }
  }
  function _r(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? _r(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function zr(l) {
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
  var Sv = ye && "documentMode" in document && 11 >= document.documentMode, Za = null, Sc = null, Bu = null, bc = !1;
  function pr(l, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    bc || Za == null || Za !== yc(a) || (a = Za, "selectionStart" in a && gc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Bu && Yu(Bu, a) || (Bu = a, a = Bi(Sc, "onSelect"), 0 < a.length && (t = new qn(
      "onSelect",
      "select",
      null,
      t,
      e
    ), l.push({ event: t, listeners: a }), t.target = Za)));
  }
  function sa(l, t) {
    var e = {};
    return e[l.toLowerCase()] = t.toLowerCase(), e["Webkit" + l] = "webkit" + t, e["Moz" + l] = "moz" + t, e;
  }
  var La = {
    animationend: sa("Animation", "AnimationEnd"),
    animationiteration: sa("Animation", "AnimationIteration"),
    animationstart: sa("Animation", "AnimationStart"),
    transitionrun: sa("Transition", "TransitionRun"),
    transitionstart: sa("Transition", "TransitionStart"),
    transitioncancel: sa("Transition", "TransitionCancel"),
    transitionend: sa("Transition", "TransitionEnd")
  }, Tc = {}, Or = {};
  ye && (Or = document.createElement("div").style, "AnimationEvent" in window || (delete La.animationend.animation, delete La.animationiteration.animation, delete La.animationstart.animation), "TransitionEvent" in window || delete La.transitionend.transition);
  function ra(l) {
    if (Tc[l]) return Tc[l];
    if (!La[l]) return l;
    var t = La[l], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in Or)
        return Tc[l] = t[e];
    return l;
  }
  var Ar = ra("animationend"), Dr = ra("animationiteration"), Mr = ra("animationstart"), bv = ra("transitionrun"), Tv = ra("transitionstart"), jv = ra("transitioncancel"), Cr = ra("transitionend"), Rr = /* @__PURE__ */ new Map(), jc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  jc.push("scrollEnd");
  function Ft(l, t) {
    Rr.set(l, t), fa(t, [l]);
  }
  var xv = 0;
  function ge(l, t) {
    if (l.name != null && l.name !== "auto") return l.name;
    if (t.autoName !== null) return t.autoName;
    l = It.identifierPrefix;
    var e = xv++;
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
  }, Gt = [], Ka = 0, xc = 0;
  function Xn() {
    for (var l = Ka, t = xc = Ka = 0; t < l; ) {
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
      n !== 0 && Hr(e, u, n);
    }
  }
  function Qn(l, t, e, a) {
    Gt[Ka++] = l, Gt[Ka++] = t, Gt[Ka++] = e, Gt[Ka++] = a, xc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function Ec(l, t, e, a) {
    return Qn(l, t, e, a), Vn(l);
  }
  function oa(l, t) {
    return Qn(l, null, null, t), Vn(l);
  }
  function Hr(l, t, e) {
    l.lanes |= e;
    var a = l.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = l.return; n !== null; )
      n.childLanes |= e, a = n.alternate, a !== null && (a.childLanes |= e), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (u = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, u && t !== null && (u = 31 - pt(e), l = n.hiddenUpdates, a = l[u], a === null ? l[u] = [t] : a.push(t), t.lane = e | 536870912), n) : null;
  }
  function Vn(l) {
    if (50 < cn)
      throw cn = 0, Mi = null, Error(g(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var wa = {};
  function Ev(l, t, e, a) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function yt(l, t, e, a) {
    return new Ev(l, t, e, a);
  }
  function Nc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function be(l, t) {
    var e = l.alternate;
    return e === null ? (e = yt(
      l.tag,
      t,
      l.key,
      l.mode
    ), e.elementType = l.elementType, e.type = l.type, e.stateNode = l.stateNode, e.alternate = l, l.alternate = e) : (e.pendingProps = t, e.type = l.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = l.flags & 1206910976, e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, t = l.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = l.sibling, e.index = l.index, e.ref = l.ref, e.refCleanup = l.refCleanup, e;
  }
  function qr(l, t) {
    l.flags &= 1206910978;
    var e = l.alternate;
    return e === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.type = e.type, t = e.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Zn(l, t, e, a, u, n) {
    var i = 0;
    if (a = l, typeof a == "function") Nc(a) && (i = 1);
    else if (typeof a == "string")
      i = k0(
        l,
        e,
        Ll.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (a) {
        case nt:
          return l = yt(31, e, t, u), l.elementType = nt, l.lanes = n, l;
        case Ql:
          return da(e.children, u, n, t);
        case ut:
          i = 8, u |= 24;
          break;
        case st:
          return l = yt(12, e, t, u | 2), l.elementType = st, l.lanes = n, l;
        case Y:
          return l = yt(13, e, t, u), l.elementType = Y, l.lanes = n, l;
        case H:
          return l = yt(19, e, t, u), l.elementType = H, l.lanes = n, l;
        case qt:
        case d:
          return l = u | 32, l = yt(30, e, t, l), l.elementType = d, l.lanes = n, l.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, l;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case ml:
                i = 10;
                break l;
              case xt:
                i = 9;
                break l;
              case z:
                i = 11;
                break l;
              case hl:
                i = 14;
                break l;
              case nl:
                i = 16, a = null;
                break l;
            }
          i = 29, e = Error(
            g(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = yt(i, e, t, u), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function da(l, t, e, a) {
    return l = yt(7, l, a, t), l.lanes = e, l;
  }
  function _c(l, t, e) {
    return l = yt(6, l, null, t), l.lanes = e, l;
  }
  function Yr(l) {
    var t = yt(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function zc(l, t, e) {
    return t = yt(
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
  var Br = /* @__PURE__ */ new WeakMap();
  function Xt(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = Br.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: W(t)
      }, Br.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: W(t)
    };
  }
  var Ja = [], Fa = 0, Ln = null, Gu = 0, Qt = [], Vt = 0, Ue = null, ae = 1, ue = "";
  function Te(l, t) {
    Ja[Fa++] = Gu, Ja[Fa++] = Ln, Ln = l, Gu = t;
  }
  function Gr(l, t, e) {
    Qt[Vt++] = ae, Qt[Vt++] = ue, Qt[Vt++] = Ue, Ue = l;
    var a = ae;
    l = ue;
    var u = 32 - pt(a) - 1;
    a &= ~(1 << u), e += 1;
    var n = 32 - pt(t) + u;
    if (30 < n) {
      var i = u - u % 5;
      n = (a & (1 << i) - 1).toString(32), a >>= i, u -= i, ae = 1 << 32 - pt(t) + u | e << u | a, ue = n + l;
    } else
      ae = 1 << n | e << u | a, ue = l;
  }
  function Kn(l) {
    l.return !== null && (Te(l, 1), Gr(l, 1, 0));
  }
  function pc(l) {
    for (; l === Ln; )
      Ln = Ja[--Fa], Ja[Fa] = null, Gu = Ja[--Fa], Ja[Fa] = null;
    for (; l === Ue; )
      Ue = Qt[--Vt], Qt[Vt] = null, ue = Qt[--Vt], Qt[Vt] = null, ae = Qt[--Vt], Qt[Vt] = null;
  }
  function Xr(l, t) {
    Qt[Vt++] = ae, Qt[Vt++] = ue, Qt[Vt++] = Ue, ae = t.id, ue = t.overflow, Ue = l;
  }
  var wl = null, El = null, $ = !1, He = null, Zt = !1, Oc = Error(g(519));
  function qe(l) {
    var t = Error(
      g(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Xu(Xt(t, l)), Oc;
  }
  function Qr(l) {
    var t = l.stateNode, e = l.type, a = l.memoizedProps;
    switch (t[$l] = l, t[vt] = a, e) {
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
        for (e = 0; e < sn.length; e++)
          I(sn[e], t);
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
        I("invalid", t), Ps(
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
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || a.suppressHydrationWarning === !0 || sm(t.textContent, e) ? (a.popover != null && (I("beforetoggle", t), I("toggle", t)), a.onScroll != null && I("scroll", t), a.onScrollEnd != null && I("scrollend", t), a.onClick != null && (t.onclick = ee), t = !0) : t = !1, t || qe(l, !0);
  }
  function wn(l) {
    for (wl = l.return; wl; )
      switch (wl.tag) {
        case 5:
        case 31:
        case 13:
          Zt = !1;
          return;
        case 27:
        case 3:
          Zt = !0;
          return;
        default:
          wl = wl.return;
      }
  }
  function $a(l) {
    if (l !== wl) return !1;
    if (!$) return wn(l), $ = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || ns(l.type, l.memoizedProps)), e = !e), e && El && qe(l), wn(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(g(317));
      El = Om(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(g(317));
      El = Om(l);
    } else
      t === 27 ? (t = El, Ie(l.type) ? (l = hs, hs = null, El = l) : El = t) : El = wl ? Kt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function ma() {
    El = wl = null, $ = !1;
  }
  function Ac() {
    var l = He;
    return l !== null && (bt === null ? bt = l : bt.push.apply(
      bt,
      l
    ), He = null), l;
  }
  function Xu(l) {
    He === null ? He = [l] : He.push(l);
  }
  var Dc = it(null), ha = null, je = null;
  function Ye(l, t, e) {
    vl(Dc, t._currentValue), t._currentValue = e;
  }
  function xe(l) {
    l._currentValue = Dc.current, Rl(Dc);
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
          var f = n;
          n = u;
          for (var s = 0; s < t.length; s++)
            if (f.context === t[s]) {
              n.lanes |= e, f = n.alternate, f !== null && (f.lanes |= e), Jn(
                n.return,
                e,
                l
              ), a || (i = null);
              break l;
            }
          n = f.next;
        }
      } else if (u.tag === 18) {
        if (i = u.return, i === null) throw Error(g(341));
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
        if (i === null) throw Error(g(387));
        if (i = i.memoizedProps, i !== null) {
          var f = u.type;
          At(u.pendingProps.value, i.value) || (l !== null ? l.push(f) : l = [f]);
        }
      } else if (u === Ma.current) {
        if (i = u.alternate, i === null) throw Error(g(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (l !== null ? l.push(Tu) : l = [Tu]);
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
      if (!At(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function ya(l) {
    ha = l, je = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Wl(l) {
    return Vr(ha, l);
  }
  function $n(l, t) {
    return ha === null && ya(l), Vr(l, t);
  }
  function Vr(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, je === null) {
      if (l === null) throw Error(g(308));
      je = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else je = je.next = t;
    return e;
  }
  var Nv = typeof AbortController < "u" ? AbortController : function() {
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
  }, _v = N.unstable_scheduleCallback, zv = N.unstable_NormalPriority, Yl = {
    $$typeof: ml,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Cc() {
    return {
      controller: new Nv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Qu(l) {
    l.refCount--, l.refCount === 0 && _v(zv, function() {
      l.controller.abort();
    });
  }
  function Zr(l, t) {
    if ((l.pendingLanes & 4194048) !== 0) {
      var e = l.transitionTypes;
      for (e === null && (e = l.transitionTypes = []), l = 0; l < t.length; l++) {
        var a = t[l];
        e.indexOf(a) === -1 && e.push(a);
      }
    }
  }
  var Vu = null;
  function pv(l) {
    var t = l.transitionTypes;
    return l.transitionTypes = null, t;
  }
  var Zu = null, Rc = 0, ga = 0, Wa = null;
  function Ov(l, t) {
    if (Zu === null) {
      var e = Zu = [];
      Rc = 0, ga = Wf(), Wa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return Rc++, t.then(Lr, Lr), t;
  }
  function Lr() {
    if (--Rc === 0 && (Vu = null, Zu !== null)) {
      Wa !== null && (Wa.status = "fulfilled");
      var l = Zu;
      Zu = null, ga = 0, Wa = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Av(l, t) {
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
  var Kr = p.S;
  p.S = function(l, t) {
    if (Bd = _t(), typeof t == "object" && t !== null && typeof t.then == "function" && Ov(l, t), Vu !== null)
      for (var e = hu; e !== null; )
        Zr(e, Vu), e = e.next;
    if (e = l.types, e !== null) {
      for (var a = hu; a !== null; )
        Zr(a, e), a = a.next;
      if (ga !== 0) {
        a = Vu, a === null && (a = Vu = []);
        for (var u = 0; u < e.length; u++) {
          var n = e[u];
          a.indexOf(n) === -1 && a.push(n);
        }
      }
    }
    Kr !== null && Kr(l, t);
  };
  var Sa = it(null);
  function Uc() {
    var l = Sa.current;
    return l !== null ? l : xl.pooledCache;
  }
  function Wn(l, t) {
    t === null ? vl(Sa, Sa.current) : vl(Sa, t.pool);
  }
  function wr() {
    var l = Uc();
    return l === null ? null : { parent: Yl._currentValue, pool: l };
  }
  var ka = Error(g(460)), Hc = Error(g(474)), kn = Error(g(542)), In = { then: function() {
  } };
  function Jr(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Fr(l, t, e) {
    switch (e = l[e], e === void 0 ? l.push(t) : e !== t && (t.then(ee, ee), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Wr(l), l === void 0 && !("reason" in t) ? Error(g(600)) : l;
      default:
        if (typeof t.status == "string") t.then(ee, ee);
        else {
          if (l = xl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(g(482));
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
        throw Ta = t, ka;
    }
  }
  function ba(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (Ta = e, ka) : e;
    }
  }
  var Ta = null;
  function $r() {
    if (Ta === null) throw Error(g(459));
    var l = Ta;
    return Ta = null, l;
  }
  function Wr(l) {
    if (l === ka || l === kn)
      throw Error(g(483));
  }
  var Ia = null, Lu = 0;
  function Pn(l) {
    var t = Lu;
    return Lu += 1, Ia === null && (Ia = []), Fr(Ia, l, t);
  }
  function Be(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function li(l, t) {
    throw t.$$typeof === P ? Error(g(525)) : (l = Object.prototype.toString.call(t), Error(
      g(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function kr(l) {
    function t(h, r) {
      if (l) {
        var y = h.deletions;
        y === null ? (h.deletions = [r], h.flags |= 16) : y.push(r);
      }
    }
    function e(h, r) {
      if (!l) return null;
      for (; r !== null; )
        t(h, r), r = r.sibling;
      return null;
    }
    function a(h) {
      for (var r = /* @__PURE__ */ new Map(); h !== null; )
        h.key === null ? r.set(h.index, h) : r.set(h.key, h), h = h.sibling;
      return r;
    }
    function u(h, r) {
      return h = be(h, r), h.index = 0, h.sibling = null, h;
    }
    function n(h, r, y) {
      return h.index = y, l ? (y = h.alternate, y !== null ? (y = y.index, y < r ? (h.flags |= 2, r) : y) : (h.flags |= 134217730, r)) : (h.flags |= 1048576, r);
    }
    function i(h) {
      return l && h.alternate === null && (h.flags |= 134217730), h;
    }
    function f(h, r, y, j) {
      return r === null || r.tag !== 6 ? (r = _c(y, h.mode, j), r.return = h, r) : (r = u(r, y), r.return = h, r);
    }
    function s(h, r, y, j) {
      var A = y.type;
      return A === Ql ? (h = b(
        h,
        r,
        y.props.children,
        j,
        y.key
      ), Be(h, y), h) : r !== null && (r.elementType === A || typeof A == "object" && A !== null && A.$$typeof === nl && ba(A) === r.type) ? (r = u(r, y.props), Be(r, y), r.return = h, r) : (r = Zn(
        y.type,
        y.key,
        y.props,
        null,
        h.mode,
        j
      ), Be(r, y), r.return = h, r);
    }
    function v(h, r, y, j) {
      return r === null || r.tag !== 4 || r.stateNode.containerInfo !== y.containerInfo || r.stateNode.implementation !== y.implementation ? (r = zc(y, h.mode, j), r.return = h, r) : (r = u(r, y.children || []), r.return = h, r);
    }
    function b(h, r, y, j, A) {
      return r === null || r.tag !== 7 ? (r = da(
        y,
        h.mode,
        j,
        A
      ), r.return = h, r) : (r = u(r, y), r.return = h, r);
    }
    function x(h, r, y) {
      if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint")
        return r = _c(
          "" + r,
          h.mode,
          y
        ), r.return = h, r;
      if (typeof r == "object" && r !== null) {
        switch (r.$$typeof) {
          case jt:
            return y = Zn(
              r.type,
              r.key,
              r.props,
              null,
              h.mode,
              y
            ), Be(y, r), y.return = h, y;
          case ft:
            return r = zc(
              r,
              h.mode,
              y
            ), r.return = h, r;
          case nl:
            return r = ba(r), x(h, r, y);
        }
        if (il(r) || C(r))
          return r = da(
            r,
            h.mode,
            y,
            null
          ), r.return = h, r;
        if (typeof r.then == "function")
          return x(h, Pn(r), y);
        if (r.$$typeof === ml)
          return x(
            h,
            $n(h, r),
            y
          );
        li(h, r);
      }
      return null;
    }
    function m(h, r, y, j) {
      var A = r !== null ? r.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint")
        return A !== null ? null : f(h, r, "" + y, j);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case jt:
            return y.key === A ? s(h, r, y, j) : null;
          case ft:
            return y.key === A ? v(h, r, y, j) : null;
          case nl:
            return y = ba(y), m(h, r, y, j);
        }
        if (il(y) || C(y))
          return A !== null ? null : b(h, r, y, j, null);
        if (typeof y.then == "function")
          return m(
            h,
            r,
            Pn(y),
            j
          );
        if (y.$$typeof === ml)
          return m(
            h,
            r,
            $n(h, y),
            j
          );
        li(h, y);
      }
      return null;
    }
    function S(h, r, y, j, A) {
      if (typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint")
        return h = h.get(y) || null, f(r, h, "" + j, A);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case jt:
            return h = h.get(
              j.key === null ? y : j.key
            ) || null, s(r, h, j, A);
          case ft:
            return h = h.get(
              j.key === null ? y : j.key
            ) || null, v(r, h, j, A);
          case nl:
            return j = ba(j), S(
              h,
              r,
              y,
              j,
              A
            );
        }
        if (il(j) || C(j))
          return h = h.get(y) || null, b(r, h, j, A, null);
        if (typeof j.then == "function")
          return S(
            h,
            r,
            y,
            Pn(j),
            A
          );
        if (j.$$typeof === ml)
          return S(
            h,
            r,
            y,
            $n(r, j),
            A
          );
        li(r, j);
      }
      return null;
    }
    function _(h, r, y, j) {
      for (var A = null, el = null, U = r, G = r = 0, Xl = null; U !== null && G < y.length; G++) {
        U.index > G ? (Xl = U, U = null) : Xl = U.sibling;
        var ul = m(
          h,
          U,
          y[G],
          j
        );
        if (ul === null) {
          U === null && (U = Xl);
          break;
        }
        l && U && ul.alternate === null && t(h, U), r = n(ul, r, G), el === null ? A = ul : el.sibling = ul, el = ul, U = Xl;
      }
      if (G === y.length)
        return e(h, U), $ && Te(h, G), A;
      if (U === null) {
        for (; G < y.length; G++)
          U = x(h, y[G], j), U !== null && (r = n(
            U,
            r,
            G
          ), el === null ? A = U : el.sibling = U, el = U);
        return $ && Te(h, G), A;
      }
      for (U = a(U); G < y.length; G++)
        Xl = S(
          U,
          h,
          G,
          y[G],
          j
        ), Xl !== null && (l && (ul = Xl.alternate, ul !== null && U.delete(ul.key === null ? G : ul.key)), r = n(
          Xl,
          r,
          G
        ), el === null ? A = Xl : el.sibling = Xl, el = Xl);
      return l && U.forEach(function(aa) {
        return t(h, aa);
      }), $ && Te(h, G), A;
    }
    function D(h, r, y, j) {
      if (y == null) throw Error(g(151));
      for (var A = null, el = null, U = r, G = r = 0, Xl = null, ul = y.next(); U !== null && !ul.done; G++, ul = y.next()) {
        U.index > G ? (Xl = U, U = null) : Xl = U.sibling;
        var aa = m(h, U, ul.value, j);
        if (aa === null) {
          U === null && (U = Xl);
          break;
        }
        l && U && aa.alternate === null && t(h, U), r = n(aa, r, G), el === null ? A = aa : el.sibling = aa, el = aa, U = Xl;
      }
      if (ul.done)
        return e(h, U), $ && Te(h, G), A;
      if (U === null) {
        for (; !ul.done; G++, ul = y.next())
          ul = x(h, ul.value, j), ul !== null && (r = n(ul, r, G), el === null ? A = ul : el.sibling = ul, el = ul);
        return $ && Te(h, G), A;
      }
      for (U = a(U); !ul.done; G++, ul = y.next())
        ul = S(U, h, G, ul.value, j), ul !== null && (l && (Xl = ul.alternate, Xl !== null && U.delete(
          Xl.key === null ? G : Xl.key
        )), r = n(ul, r, G), el === null ? A = ul : el.sibling = ul, el = ul);
      return l && U.forEach(function(sy) {
        return t(h, sy);
      }), $ && Te(h, G), A;
    }
    function K(h, r, y, j) {
      if (typeof y == "object" && y !== null && y.type === Ql && y.key === null && y.props.ref === void 0 && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case jt:
            l: {
              for (var A = y.key; r !== null; ) {
                if (r.key === A) {
                  if (A = y.type, A === Ql) {
                    if (r.tag === 7) {
                      e(
                        h,
                        r.sibling
                      ), j = u(
                        r,
                        y.props.children
                      ), Be(j, y), j.return = h, h = j;
                      break l;
                    }
                  } else if (r.elementType === A || typeof A == "object" && A !== null && A.$$typeof === nl && ba(A) === r.type) {
                    e(
                      h,
                      r.sibling
                    ), j = u(r, y.props), Be(j, y), j.return = h, h = j;
                    break l;
                  }
                  e(h, r);
                  break;
                } else t(h, r);
                r = r.sibling;
              }
              y.type === Ql ? (j = da(
                y.props.children,
                h.mode,
                j,
                y.key
              ), Be(j, y), j.return = h, h = j) : (j = Zn(
                y.type,
                y.key,
                y.props,
                null,
                h.mode,
                j
              ), Be(j, y), j.return = h, h = j);
            }
            return i(h);
          case ft:
            l: {
              for (A = y.key; r !== null; ) {
                if (r.key === A)
                  if (r.tag === 4 && r.stateNode.containerInfo === y.containerInfo && r.stateNode.implementation === y.implementation) {
                    e(
                      h,
                      r.sibling
                    ), j = u(r, y.children || []), j.return = h, h = j;
                    break l;
                  } else {
                    e(h, r);
                    break;
                  }
                else t(h, r);
                r = r.sibling;
              }
              j = zc(y, h.mode, j), j.return = h, h = j;
            }
            return i(h);
          case nl:
            return y = ba(y), K(
              h,
              r,
              y,
              j
            );
        }
        if (il(y))
          return _(
            h,
            r,
            y,
            j
          );
        if (C(y)) {
          if (A = C(y), typeof A != "function") throw Error(g(150));
          return y = A.call(y), D(
            h,
            r,
            y,
            j
          );
        }
        if (typeof y.then == "function")
          return K(
            h,
            r,
            Pn(y),
            j
          );
        if (y.$$typeof === ml)
          return K(
            h,
            r,
            $n(h, y),
            j
          );
        li(h, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" || typeof y == "bigint" ? (y = "" + y, r !== null && r.tag === 6 ? (e(h, r.sibling), j = u(r, y), j.return = h, h = j) : (e(h, r), j = _c(y, h.mode, j), j.return = h, h = j), i(h)) : e(h, r);
    }
    return function(h, r, y, j) {
      try {
        Lu = 0;
        var A = K(
          h,
          r,
          y,
          j
        );
        return Ia = null, A;
      } catch (U) {
        if (U === ka || U === kn) throw U;
        var el = yt(29, U, null, h.mode);
        return el.lanes = j, el.return = h, el;
      }
    };
  }
  var ja = kr(!0), Ir = kr(!1), Ge = !1;
  function qc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Yc(l, t) {
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
  function Qe(l, t, e) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (rl & 2) !== 0) {
      var u = a.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), a.pending = t, t = Vn(l), Hr(l, null, e), t;
    }
    return Qn(l, a, t, e), Vn(l);
  }
  function Ku(l, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, Gs(l, e);
    }
  }
  function Bc(l, t) {
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
  function wu() {
    if (Gc) {
      var l = Wa;
      if (l !== null) throw l;
    }
  }
  function Ju(l, t, e, a) {
    Gc = !1;
    var u = l.updateQueue;
    Ge = !1;
    var n = u.firstBaseUpdate, i = u.lastBaseUpdate, f = u.shared.pending;
    if (f !== null) {
      u.shared.pending = null;
      var s = f, v = s.next;
      s.next = null, i === null ? n = v : i.next = v, i = s;
      var b = l.alternate;
      b !== null && (b = b.updateQueue, f = b.lastBaseUpdate, f !== i && (f === null ? b.firstBaseUpdate = v : f.next = v, b.lastBaseUpdate = s));
    }
    if (n !== null) {
      var x = u.baseState;
      i = 0, b = v = s = null, f = n;
      do {
        var m = f.lane & -536870913, S = m !== f.lane;
        if (S ? (tl & m) === m : (a & m) === m) {
          m !== 0 && m === ga && (Gc = !0), b !== null && (b = b.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          l: {
            var _ = l, D = f;
            m = t;
            var K = e;
            switch (D.tag) {
              case 1:
                if (_ = D.payload, typeof _ == "function") {
                  x = _.call(K, x, m);
                  break l;
                }
                x = _;
                break l;
              case 3:
                _.flags = _.flags & -65537 | 128;
              case 0:
                if (_ = D.payload, m = typeof _ == "function" ? _.call(K, x, m) : _, m == null) break l;
                x = J({}, x, m);
                break l;
              case 2:
                Ge = !0;
            }
          }
          m = f.callback, m !== null && (l.flags |= 64, S && (l.flags |= 8192), S = u.callbacks, S === null ? u.callbacks = [m] : S.push(m));
        } else
          S = {
            lane: m,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, b === null ? (v = b = S, s = x) : b = b.next = S, i |= m;
        if (f = f.next, f === null) {
          if (f = u.shared.pending, f === null)
            break;
          S = f, f = S.next, S.next = null, u.lastBaseUpdate = S, u.shared.pending = null;
        }
      } while (!0);
      b === null && (s = x), u.baseState = s, u.firstBaseUpdate = v, u.lastBaseUpdate = b, n === null && (u.shared.lanes = 0), Fe |= i, l.lanes = i, l.memoizedState = x;
    }
  }
  function Pr(l, t) {
    if (typeof l != "function")
      throw Error(g(191, l));
    l.call(t);
  }
  function lo(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++)
        Pr(e[l], t);
  }
  var Ve = it(null), ti = it(0);
  function to(l, t) {
    l = pe, vl(ti, l), vl(Ve, t), pe = l | t.baseLanes;
  }
  function Xc() {
    vl(ti, pe), vl(Ve, Ve.current);
  }
  function Qc() {
    pe = ti.current, Rl(Ve), Rl(ti);
  }
  var kl = it(null), ct = null;
  function Ze(l) {
    var t = l.alternate;
    vl(Il, Il.current & 1), vl(kl, l), ct === null && (t === null || Ve.current !== null || t.memoizedState !== null) && (ct = l);
  }
  function Vc(l) {
    vl(Il, Il.current), vl(kl, l), ct === null && (ct = l);
  }
  function eo(l) {
    l.tag === 22 ? (vl(Il, Il.current), vl(kl, l), ct === null && (ct = l)) : Le();
  }
  function Le() {
    vl(Il, Il.current), vl(kl, kl.current);
  }
  function Dt(l) {
    Rl(kl), ct === l && (ct = null), Rl(Il);
  }
  var Il = it(0);
  function Fu(l, t) {
    vl(kl, kl.current), vl(Il, t);
  }
  function Zc(l) {
    Rl(Il), Rl(kl), ct === l && (ct = null);
  }
  function ei(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || ds(e) || ms(e)))
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
  var Ee = 0, L = null, bl = null, Bl = null, ai = !1, Pa = !1, xa = !1, ui = 0, $u = 0, lu = null, Dv = 0;
  function Dl() {
    throw Error(g(321));
  }
  function Lc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!At(l[e], t[e])) return !1;
    return !0;
  }
  function Kc(l, t, e, a, u, n) {
    return Ee = n, L = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, p.H = l === null || l.memoizedState === null ? Xo : Qo, xa = !1, n = e(a, u), xa = !1, Pa && (n = uo(
      t,
      e,
      a,
      u
    )), ao(l), n;
  }
  function ao(l) {
    p.H = oi;
    var t = bl !== null && bl.next !== null;
    if (Ee = 0, Bl = bl = L = null, ai = !1, $u = 0, lu = null, t) throw Error(g(300));
    l === null || Gl || (l = l.dependencies, l !== null && Fn(l) && (Gl = !0));
  }
  function uo(l, t, e, a) {
    L = l;
    var u = 0;
    do {
      if (Pa && (lu = null), $u = 0, Pa = !1, 25 <= u) throw Error(g(301));
      if (u += 1, Bl = bl = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      p.H = Bv, n = t(e, a);
    } while (Pa);
    return n;
  }
  function Mv() {
    var l = p.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Wu(t) : t, l = l.useState()[0], (bl !== null ? bl.memoizedState : null) !== l && (L.flags |= 1024), t;
  }
  function wc() {
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
    Ee = 0, Bl = bl = L = null, Pa = !1, $u = ui = 0, lu = null;
  }
  function ot() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Bl === null ? L.memoizedState = Bl = l : Bl = Bl.next = l, Bl;
  }
  function Ul() {
    if (bl === null) {
      var l = L.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = bl.next;
    var t = Bl === null ? L.memoizedState : Bl.next;
    if (t !== null)
      Bl = t, bl = l;
    else {
      if (l === null)
        throw L.alternate === null ? Error(g(467)) : Error(g(310));
      bl = l, l = {
        memoizedState: bl.memoizedState,
        baseState: bl.baseState,
        baseQueue: bl.baseQueue,
        queue: bl.queue,
        next: null
      }, Bl === null ? L.memoizedState = Bl = l : Bl = Bl.next = l;
    }
    return Bl;
  }
  function ni() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Wu(l) {
    var t = $u;
    return $u += 1, lu === null && (lu = []), l = Fr(lu, l, t), t = L, (Bl === null ? t.memoizedState : Bl.next) === null && (t = t.alternate, p.H = t === null || t.memoizedState === null ? Xo : Qo), l;
  }
  function ii(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Wu(l);
      if (l.$$typeof === E) return;
      if (l.$$typeof === ml) return Wl(l);
    }
    throw Error(g(438, String(l)));
  }
  function $c(l) {
    var t = null, e = L.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var a = L.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = ni(), L.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), a = 0; a < l; a++)
        e[a] = Yt;
    return t.index++, e;
  }
  function Ne(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function ci(l) {
    var t = Ul();
    return Wc(t, bl, l);
  }
  function Wc(l, t, e) {
    var a = l.queue;
    if (a === null) throw Error(g(311));
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
      var f = i = null, s = null, v = t, b = !1;
      do {
        var x = v.lane & -536870913;
        if (x !== v.lane ? (tl & x) === x : (Ee & x) === x) {
          var m = v.revertLane;
          if (m === 0)
            s !== null && (s = s.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: v.action,
              hasEagerState: v.hasEagerState,
              eagerState: v.eagerState,
              next: null
            }), x === ga && (b = !0);
          else if ((Ee & m) === m) {
            v = v.next, m === ga && (b = !0);
            continue;
          } else
            x = {
              lane: 0,
              revertLane: v.revertLane,
              gesture: null,
              action: v.action,
              hasEagerState: v.hasEagerState,
              eagerState: v.eagerState,
              next: null
            }, s === null ? (f = s = x, i = n) : s = s.next = x, L.lanes |= m, Fe |= m;
          x = v.action, xa && e(n, x), n = v.hasEagerState ? v.eagerState : e(n, x);
        } else
          m = {
            lane: x,
            revertLane: v.revertLane,
            gesture: v.gesture,
            action: v.action,
            hasEagerState: v.hasEagerState,
            eagerState: v.eagerState,
            next: null
          }, s === null ? (f = s = m, i = n) : s = s.next = m, L.lanes |= x, Fe |= x;
        v = v.next;
      } while (v !== null && v !== t);
      if (s === null ? i = n : s.next = f, !At(n, l.memoizedState) && (Gl = !0, b && (e = Wa, e !== null)))
        throw e;
      l.memoizedState = n, l.baseState = i, l.baseQueue = s, a.lastRenderedState = n;
    }
    return u === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function kc(l) {
    var t = Ul(), e = t.queue;
    if (e === null) throw Error(g(311));
    e.lastRenderedReducer = l;
    var a = e.dispatch, u = e.pending, n = t.memoizedState;
    if (u !== null) {
      e.pending = null;
      var i = u = u.next;
      do
        n = l(n, i.action), i = i.next;
      while (i !== u);
      At(n, t.memoizedState) || (Gl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), e.lastRenderedState = n;
    }
    return [n, a];
  }
  function no(l, t, e) {
    var a = L, u = Ul(), n = $;
    if (n) {
      if (e === void 0) throw Error(g(407));
      e = e();
    } else e = t();
    var i = !At(
      (bl || u).memoizedState,
      e
    );
    if (i && (u.memoizedState = e, Gl = !0), u = u.queue, lf(fo.bind(null, a, u, l), [
      l
    ]), l = u.getSnapshot !== t || i || Bl !== null && (Bl.memoizedState.tag & 1) !== 0, tu(
      l ? 9 : 8,
      { destroy: void 0 },
      co.bind(null, a, u, e, t),
      null
    ), l) {
      if (a.flags |= 2048, xl === null) throw Error(g(349));
      n || (Ee & 127) !== 0 || io(a, t, e);
    }
    return e;
  }
  function io(l, t, e) {
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = L.updateQueue, t === null ? (t = ni(), L.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
  }
  function co(l, t, e, a) {
    t.value = e, t.getSnapshot = a, so(t) && ro(l);
  }
  function fo(l, t, e) {
    return e(function() {
      so(t) && ro(l);
    });
  }
  function so(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !At(l, e);
    } catch {
      return !0;
    }
  }
  function ro(l) {
    var t = oa(l, 2);
    t !== null && Tt(t, l, 2);
  }
  function Ic(l) {
    var t = ot();
    if (typeof l == "function") {
      var e = l;
      if (l = e(), xa) {
        Me(!0);
        try {
          e();
        } finally {
          Me(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ne,
      lastRenderedState: l
    }, t;
  }
  function oo(l, t, e, a) {
    return l.baseState = e, Wc(
      l,
      bl,
      typeof a == "function" ? a : Ne
    );
  }
  function Cv(l, t, e, a, u) {
    if (ri(l)) throw Error(g(485));
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
      p.T !== null ? e(!0) : n.isTransition = !1, a(n), e = t.pending, e === null ? (n.next = t.pending = n, mo(t, n)) : (n.next = e.next, t.pending = e.next = n);
    }
  }
  function mo(l, t) {
    var e = t.action, a = t.payload, u = l.state;
    if (t.isTransition) {
      var n = p.T, i = {};
      i.types = n !== null ? n.types : null, p.T = i;
      try {
        var f = e(u, a), s = p.S;
        s !== null && s(i, f), ho(l, t, f);
      } catch (v) {
        Pc(l, t, v);
      } finally {
        n !== null && i.types !== null && (n.types = i.types), p.T = n;
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
    if ($) {
      var e = xl.formState;
      if (e !== null) {
        l: {
          var a = L;
          if ($) {
            if (El) {
              t: {
                for (var u = El, n = Zt; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break t;
                  }
                  if (u = Kt(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break t;
                  }
                }
                n = u.data, u = n === "F!" || n === "F" ? u : null;
              }
              if (u) {
                El = Kt(
                  u.nextSibling
                ), a = u.data === "F!";
                break l;
              }
            }
            qe(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return e = ot(), e.memoizedState = e.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: go,
      lastRenderedState: t
    }, e.queue = a, e = Yo.bind(
      null,
      L,
      a
    ), a.dispatch = e, a = Ic(!1), n = nf.bind(
      null,
      L,
      !1,
      a.queue
    ), a = ot(), u = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = u, e = Cv.bind(
      null,
      L,
      u,
      n,
      e
    ), u.dispatch = e, a.memoizedState = l, [t, e, !1];
  }
  function bo(l) {
    var t = Ul();
    return To(t, bl, l);
  }
  function To(l, t, e) {
    if (t = Wc(
      l,
      t,
      go
    )[0], l = ci(Ne)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Wu(t);
      } catch (i) {
        throw i === ka ? kn : i;
      }
    else a = t;
    t = Ul();
    var u = t.queue, n = u.dispatch;
    return e !== t.memoizedState && (L.flags |= 2048, tu(
      9,
      { destroy: void 0 },
      Rv.bind(null, u, e),
      null
    )), [a, n, l];
  }
  function Rv(l, t) {
    l.action = t;
  }
  function jo(l) {
    var t = Ul(), e = bl;
    if (e !== null)
      return To(t, e, l);
    Ul(), t = t.memoizedState, e = Ul();
    var a = e.queue.dispatch;
    return e.memoizedState = l, [t, a, !1];
  }
  function tu(l, t, e, a) {
    return l = { tag: l, create: e, deps: a, inst: t, next: null }, t = L.updateQueue, t === null && (t = ni(), L.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (a = e.next, e.next = l, l.next = a, t.lastEffect = l), l;
  }
  function xo() {
    return Ul().memoizedState;
  }
  function fi(l, t, e, a) {
    var u = ot();
    L.flags |= l, u.memoizedState = tu(
      1 | t,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function si(l, t, e, a) {
    var u = Ul();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    bl !== null && a !== null && Lc(a, bl.memoizedState.deps) ? u.memoizedState = tu(t, n, e, a) : (L.flags |= l, u.memoizedState = tu(
      1 | t,
      n,
      e,
      a
    ));
  }
  function Eo(l, t) {
    fi(8390656, 8, l, t);
  }
  function lf(l, t) {
    si(2048, 8, l, t);
  }
  function Uv(l) {
    L.flags |= 4;
    var t = L.updateQueue;
    if (t === null)
      t = ni(), L.updateQueue = t, t.events = [l];
    else {
      var e = t.events;
      e === null ? t.events = [l] : e.push(l);
    }
  }
  function No(l) {
    var t = Ul().memoizedState;
    return Uv({ ref: t, nextImpl: l }), function() {
      if ((rl & 2) !== 0) throw Error(g(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function _o(l, t) {
    return si(4, 2, l, t);
  }
  function zo(l, t) {
    return si(4, 4, l, t);
  }
  function po(l, t) {
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
  function Oo(l, t, e) {
    e = e != null ? e.concat([l]) : null, si(4, 4, po.bind(null, t, l), e);
  }
  function tf() {
  }
  function Ao(l, t) {
    var e = Ul();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && Lc(t, a[1]) ? a[0] : (e.memoizedState = [l, t], l);
  }
  function Do(l, t) {
    var e = Ul();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && Lc(t, a[1]))
      return a[0];
    if (a = l(), xa) {
      Me(!0);
      try {
        l();
      } finally {
        Me(!1);
      }
    }
    return e.memoizedState = [a, t], a;
  }
  function ef(l, t, e) {
    return e === void 0 || (Ee & 1073741824) !== 0 && (tl & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = e, l = Xd(), L.lanes |= l, Fe |= l, e);
  }
  function Mo(l, t, e, a) {
    return At(e, t) ? e : Ve.current !== null ? (l = ef(l, e, a), At(l, t) || (Gl = !0), l) : (Ee & 106) === 0 || (Ee & 1073741824) !== 0 && (tl & 261930) === 0 ? (Gl = !0, l.memoizedState = e) : (l = Xd(), L.lanes |= l, Fe |= l, t);
  }
  function Co(l, t, e, a, u) {
    var n = B.p;
    B.p = n !== 0 && 8 > n ? n : 8;
    var i = p.T, f = {};
    f.types = i !== null ? i.types : null, p.T = f, nf(l, !1, t, e);
    try {
      var s = u(), v = p.S;
      if (v !== null && v(f, s), s !== null && typeof s == "object" && typeof s.then == "function") {
        var b = Av(
          s,
          a
        );
        ku(
          l,
          t,
          b,
          Ut(l)
        );
      } else
        ku(
          l,
          t,
          a,
          Ut(l)
        );
    } catch (x) {
      ku(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: x },
        Ut()
      );
    } finally {
      B.p = n, i !== null && f.types !== null && (i.types = f.types), p.T = i;
    }
  }
  function Hv() {
  }
  function af(l, t, e, a) {
    if (l.tag !== 5) throw Error(g(476));
    var u = Ro(l).queue;
    Co(
      l,
      u,
      t,
      Et,
      e === null ? Hv : function() {
        return Uo(l), e(a);
      }
    );
  }
  function Ro(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Et,
      baseState: Et,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ne,
        lastRenderedState: Et
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
        lastRenderedReducer: Ne,
        lastRenderedState: e
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function Uo(l) {
    var t = Ro(l);
    t.next === null && (t = l.alternate.memoizedState), ku(
      l,
      t.next.queue,
      {},
      Ut()
    );
  }
  function uf() {
    return Wl(Tu);
  }
  function Ho() {
    return Ul().memoizedState;
  }
  function qo() {
    return Ul().memoizedState;
  }
  function qv(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = Ut();
          l = Xe(e);
          var a = Qe(t, l, e);
          a !== null && (Tt(a, t, e), Ku(a, t, e)), t = { cache: Cc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Yv(l, t, e) {
    var a = Ut();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ri(l) ? Bo(t, e) : (e = Ec(l, t, e, a), e !== null && (Tt(e, l, a), Go(e, t, a)));
  }
  function Yo(l, t, e) {
    var a = Ut();
    ku(l, t, e, a);
  }
  function ku(l, t, e, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ri(l)) Bo(t, u);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var i = t.lastRenderedState, f = n(i, e);
          if (u.hasEagerState = !0, u.eagerState = f, At(f, i))
            return Qn(l, t, u, 0), xl === null && Xn(), !1;
        } catch {
        }
      if (e = Ec(l, t, u, a), e !== null)
        return Tt(e, l, a), Go(e, t, a), !0;
    }
    return !1;
  }
  function nf(l, t, e, a) {
    if (a = {
      lane: 2,
      revertLane: Wf(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ri(l)) {
      if (t) throw Error(g(479));
    } else
      t = Ec(
        l,
        e,
        a,
        2
      ), t !== null && Tt(t, l, 2);
  }
  function ri(l) {
    var t = l.alternate;
    return l === L || t !== null && t === L;
  }
  function Bo(l, t) {
    Pa = ai = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function Go(l, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, Gs(l, e);
    }
  }
  var oi = {
    readContext: Wl,
    use: ii,
    useCallback: Dl,
    useContext: Dl,
    useEffect: Dl,
    useImperativeHandle: Dl,
    useLayoutEffect: Dl,
    useInsertionEffect: Dl,
    useMemo: Dl,
    useReducer: Dl,
    useRef: Dl,
    useState: Dl,
    useDebugValue: Dl,
    useDeferredValue: Dl,
    useTransition: Dl,
    useSyncExternalStore: Dl,
    useId: Dl,
    useHostTransitionStatus: Dl,
    useFormState: Dl,
    useActionState: Dl,
    useOptimistic: Dl,
    useMemoCache: Dl,
    useCacheRefresh: Dl,
    useEffectEvent: Dl
  }, Xo = {
    readContext: Wl,
    use: ii,
    useCallback: function(l, t) {
      return ot().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Wl,
    useEffect: Eo,
    useImperativeHandle: function(l, t, e) {
      e = e != null ? e.concat([l]) : null, fi(
        4194308,
        4,
        po.bind(null, t, l),
        e
      );
    },
    useLayoutEffect: function(l, t) {
      return fi(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      fi(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var e = ot();
      t = t === void 0 ? null : t;
      var a = l();
      if (xa) {
        Me(!0);
        try {
          l();
        } finally {
          Me(!1);
        }
      }
      return e.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, e) {
      var a = ot();
      if (e !== void 0) {
        var u = e(t);
        if (xa) {
          Me(!0);
          try {
            e(t);
          } finally {
            Me(!1);
          }
        }
      } else u = t;
      return a.memoizedState = a.baseState = u, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: u
      }, a.queue = l, l = l.dispatch = Yv.bind(
        null,
        L,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = ot();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = Ic(l);
      var t = l.queue, e = Yo.bind(null, L, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: tf,
    useDeferredValue: function(l, t) {
      var e = ot();
      return ef(e, l, t);
    },
    useTransition: function() {
      var l = Ic(!1);
      return l = Co.bind(
        null,
        L,
        l.queue,
        !0,
        !1
      ), ot().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var a = L, u = ot();
      if ($) {
        if (e === void 0)
          throw Error(g(407));
        e = e();
      } else {
        if (e = t(), xl === null)
          throw Error(g(349));
        (tl & 127) !== 0 || io(a, t, e);
      }
      u.memoizedState = e;
      var n = { value: e, getSnapshot: t };
      return u.queue = n, Eo(fo.bind(null, a, n, l), [
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
      var l = ot(), t = xl.identifierPrefix;
      if ($) {
        var e = ue, a = ae;
        e = (a & ~(1 << 32 - pt(a) - 1)).toString(32) + e, t = "_" + t + "R_" + e, e = ui++, 0 < e && (t += "H" + e.toString(32)), t += "_";
      } else
        e = Dv++, t = "_" + t + "r_" + e.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: uf,
    useFormState: So,
    useActionState: So,
    useOptimistic: function(l) {
      var t = ot();
      t.memoizedState = t.baseState = l;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = nf.bind(
        null,
        L,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: $c,
    useCacheRefresh: function() {
      return ot().memoizedState = qv.bind(
        null,
        L
      );
    },
    useEffectEvent: function(l) {
      var t = ot(), e = { impl: l };
      return t.memoizedState = e, function() {
        if ((rl & 2) !== 0)
          throw Error(g(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, Qo = {
    readContext: Wl,
    use: ii,
    useCallback: Ao,
    useContext: Wl,
    useEffect: lf,
    useImperativeHandle: Oo,
    useInsertionEffect: _o,
    useLayoutEffect: zo,
    useMemo: Do,
    useReducer: ci,
    useRef: xo,
    useState: function() {
      return ci(Ne);
    },
    useDebugValue: tf,
    useDeferredValue: function(l, t) {
      var e = Ul();
      return Mo(
        e,
        bl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = ci(Ne)[0], t = Ul().memoizedState;
      return [
        typeof l == "boolean" ? l : Wu(l),
        t
      ];
    },
    useSyncExternalStore: no,
    useId: Ho,
    useHostTransitionStatus: uf,
    useFormState: bo,
    useActionState: bo,
    useOptimistic: function(l, t) {
      var e = Ul();
      return oo(e, bl, l, t);
    },
    useMemoCache: $c,
    useCacheRefresh: qo,
    useEffectEvent: No
  }, Bv = {
    readContext: Wl,
    use: ii,
    useCallback: Ao,
    useContext: Wl,
    useEffect: lf,
    useImperativeHandle: Oo,
    useInsertionEffect: _o,
    useLayoutEffect: zo,
    useMemo: Do,
    useReducer: kc,
    useRef: xo,
    useState: function() {
      return kc(Ne);
    },
    useDebugValue: tf,
    useDeferredValue: function(l, t) {
      var e = Ul();
      return bl === null ? ef(e, l, t) : Mo(
        e,
        bl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = kc(Ne)[0], t = Ul().memoizedState;
      return [
        typeof l == "boolean" ? l : Wu(l),
        t
      ];
    },
    useSyncExternalStore: no,
    useId: Ho,
    useHostTransitionStatus: uf,
    useFormState: jo,
    useActionState: jo,
    useOptimistic: function(l, t) {
      var e = Ul();
      return bl !== null ? oo(e, bl, l, t) : (e.baseState = l, [l, e.queue.dispatch]);
    },
    useMemoCache: $c,
    useCacheRefresh: qo,
    useEffectEvent: No
  };
  function cf(l, t, e, a) {
    t = l.memoizedState, e = e(a, t), e = e == null ? t : J({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var ff = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var a = Ut(), u = Xe(a);
      u.payload = t, e != null && (u.callback = e), t = Qe(l, u, a), t !== null && (Tt(t, l, a), Ku(t, l, a));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var a = Ut(), u = Xe(a);
      u.tag = 1, u.payload = t, e != null && (u.callback = e), t = Qe(l, u, a), t !== null && (Tt(t, l, a), Ku(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = Ut(), a = Xe(e);
      a.tag = 2, t != null && (a.callback = t), t = Qe(l, a, e), t !== null && (Tt(t, l, e), Ku(t, l, e));
    }
  };
  function Vo(l, t, e, a, u, n, i) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, i) : t.prototype && t.prototype.isPureReactComponent ? !Yu(e, a) || !Yu(u, n) : !0;
  }
  function Zo(l, t, e, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, a), t.state !== l && ff.enqueueReplaceState(t, t.state, null);
  }
  function Ea(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var a in t)
        a !== "ref" && (e[a] = t[a]);
    }
    if (l = l.defaultProps) {
      e === t && (e = J({}, e));
      for (var u in l)
        e[u] === void 0 && (e[u] = l[u]);
    }
    return e;
  }
  function Lo(l) {
    Gn(l);
  }
  function Ko(l) {
    console.error(l);
  }
  function wo(l) {
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
  function sf(l, t, e) {
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
      Jo(t, e, a), typeof u != "function" && ($e === null ? $e = /* @__PURE__ */ new Set([this]) : $e.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
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
      ), e = kl.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
          case 19:
            return ct === null ? Ri() : e.alternate === null && Ml === 0 && (Ml = 3), e.flags &= -257, e.flags |= 65536, e.lanes = u, a === In ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Jf(l, a, u)), !1;
          case 22:
            return e.flags |= 65536, a === In ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), Jf(l, a, u)), !1;
        }
        throw Error(g(435, e.tag));
      }
      return Jf(l, a, u), Ri(), !1;
    }
    if ($)
      return t = kl.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, a !== Oc && (l = Error(g(422), { cause: a }), Xu(Xt(l, e)))) : (a !== Oc && (t = Error(g(423), {
        cause: a
      }), Xu(
        Xt(t, e)
      )), l = l.current.alternate, l.flags |= 65536, u &= -u, l.lanes |= u, a = Xt(a, e), u = sf(
        l.stateNode,
        a,
        u
      ), Bc(l, u), Ml !== 4 && (Ml = 2)), !1;
    var n = Error(g(520), { cause: a });
    if (n = Xt(n, e), nn === null ? nn = [n] : nn.push(n), Ml !== 4 && (Ml = 2), t === null) return !0;
    a = Xt(a, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, l = u & -u, e.lanes |= l, l = sf(e.stateNode, a, l), Bc(e, l), !1;
        case 1:
          if (t = e.type, n = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && ($e === null || !$e.has(n))))
            return e.flags |= 65536, u &= -u, e.lanes |= u, u = Fo(u), $o(
              u,
              l,
              e,
              a
            ), Bc(e, u), !1;
          break;
        case 22:
          if (e.memoizedState !== null)
            return e.flags |= 65536, !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var rf = Error(g(461)), Gl = !1;
  function Vl(l, t, e, a) {
    t.child = l === null ? Ir(t, null, e, a) : ja(
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
      for (var f in a)
        f !== "ref" && (i[f] = a[f]);
    } else i = a;
    return ya(t), a = Kc(
      l,
      t,
      e,
      i,
      n,
      u
    ), f = wc(), l !== null && !Gl ? (Jc(l, t, u), _e(l, t, u)) : ($ && f && Kn(t), t.flags |= 1, Vl(l, t, a, u), t.child);
  }
  function ko(l, t, e, a, u) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" && !Nc(n) && n.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = n, Io(
        l,
        t,
        n,
        a,
        u
      )) : (l = Zn(
        e.type,
        null,
        a,
        t,
        t.mode,
        u
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !Sf(l, u)) {
      var i = n.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Yu, e(i, a) && l.ref === t.ref)
        return _e(l, t, u);
    }
    return t.flags |= 1, l = be(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Io(l, t, e, a, u) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Yu(n, a) && l.ref === t.ref)
        if (Gl = !1, t.pendingProps = a = n, Sf(l, u))
          (l.flags & 131072) !== 0 && (Gl = !0);
        else
          return t.lanes = l.lanes, _e(l, t, u);
    }
    return of(
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
        ), n !== null ? to(t, n) : Xc(), eo(t);
      else
        return a = t.lanes = 536870912, ld(
          l,
          t,
          n !== null ? n.baseLanes | e : e,
          e,
          a
        );
    } else
      n !== null ? (Wn(t, n.cachePool), to(t, n), Le(), t.memoizedState = null) : (l !== null && Wn(t, null), Xc(), Le());
    return Vl(l, t, u, e), t.child;
  }
  function Iu(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function ld(l, t, e, a, u) {
    var n = Uc();
    return n = n === null ? null : { parent: Yl._currentValue, pool: n }, t.memoizedState = {
      baseLanes: e,
      cachePool: n
    }, l !== null && Wn(t, null), Xc(), eo(t), l !== null && va(l, t, a, !0), t.childLanes = u, null;
  }
  function mi(l, t) {
    return t = hi(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function td(l, t, e) {
    return ja(t, l.child, null, e), l = mi(t, t.pendingProps), l.flags |= 2, Dt(t), t.memoizedState = null, l;
  }
  function Xv(l, t, e) {
    var a = t.pendingProps, u = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if ($) {
        if (a.mode === "hidden")
          return l = mi(t, a), t.lanes = 536870912, l.memoizedState = { baseLanes: 0, cachePool: null }, Iu(null, l);
        if (Vc(t), (l = El) ? (l = pm(
          l,
          Zt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: Ue !== null ? { id: ae, overflow: ue } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Yr(l), e.return = t, t.child = e, wl = t, El = null)) : l = null, l === null) throw qe(t);
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
        else throw Error(g(558));
      else if (Gl || va(l, t, e, !1), u = (e & l.childLanes) !== 0, Gl || u) {
        if (Ve.current === null) {
          if (a = xl, a !== null && (i = Xs(a, e), i !== 0 && i !== n.retryLane))
            throw n.retryLane = i, oa(l, i), Tt(a, l, i), rf;
          Ri();
        }
        t = td(
          l,
          t,
          e
        );
      } else
        l = n.treeContext, El = Kt(i.nextSibling), wl = t, $ = !0, He = null, Zt = !1, l !== null && Xr(t, l), t = mi(t, a), t.flags |= 134221824;
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
        throw Error(g(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function of(l, t, e, a, u) {
    return ya(t), e = Kc(
      l,
      t,
      e,
      a,
      void 0,
      u
    ), a = wc(), l !== null && !Gl ? (Jc(l, t, u), _e(l, t, u)) : ($ && a && Kn(t), t.flags |= 1, Vl(l, t, e, u), t.child);
  }
  function ed(l, t, e, a, u, n) {
    return ya(t), t.updateQueue = null, e = uo(
      t,
      a,
      e,
      u
    ), ao(l), a = wc(), l !== null && !Gl ? (Jc(l, t, n), _e(l, t, n)) : ($ && a && Kn(t), t.flags |= 1, Vl(l, t, e, n), t.child);
  }
  function ad(l, t, e, a, u) {
    if (ya(t), t.stateNode === null) {
      var n = wa, i = e.contextType;
      typeof i == "object" && i !== null && (n = Wl(i)), n = new e(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = ff, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, qc(t), i = e.contextType, n.context = typeof i == "object" && i !== null ? Wl(i) : wa, n.state = t.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (cf(
        t,
        e,
        i,
        a
      ), n.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (i = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), i !== n.state && ff.enqueueReplaceState(n, n.state, null), Ju(t, a, n, u), wu(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var f = t.memoizedProps, s = Ea(e, f);
      n.props = s;
      var v = n.context, b = e.contextType;
      i = wa, typeof b == "object" && b !== null && (i = Wl(b));
      var x = e.getDerivedStateFromProps;
      b = typeof x == "function" || typeof n.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, b || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f || v !== i) && Zo(
        t,
        n,
        a,
        i
      ), Ge = !1;
      var m = t.memoizedState;
      n.state = m, Ju(t, a, n, u), wu(), v = t.memoizedState, f || m !== v || Ge ? (typeof x == "function" && (cf(
        t,
        e,
        x,
        a
      ), v = t.memoizedState), (s = Ge || Vo(
        t,
        e,
        s,
        a,
        m,
        v,
        i
      )) ? (b || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = v), n.props = a, n.state = v, n.context = i, a = s) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, Yc(l, t), i = t.memoizedProps, b = Ea(e, i), n.props = b, x = t.pendingProps, m = n.context, v = e.contextType, s = wa, typeof v == "object" && v !== null && (s = Wl(v)), f = e.getDerivedStateFromProps, (v = typeof f == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i !== x || m !== s) && Zo(
        t,
        n,
        a,
        s
      ), Ge = !1, m = t.memoizedState, n.state = m, Ju(t, a, n, u), wu();
      var S = t.memoizedState;
      i !== x || m !== S || Ge || l !== null && l.dependencies !== null && Fn(l.dependencies) ? (typeof f == "function" && (cf(
        t,
        e,
        f,
        a
      ), S = t.memoizedState), (b = Ge || Vo(
        t,
        e,
        b,
        a,
        m,
        S,
        s
      ) || l !== null && l.dependencies !== null && Fn(l.dependencies)) ? (v || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, S, s), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        S,
        s
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = S), n.props = a, n.state = S, n.context = s, a = b) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, eu(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = ja(
      t,
      l.child,
      null,
      u
    ), t.child = ja(
      t,
      null,
      e,
      u
    )) : Vl(l, t, e, u), t.memoizedState = n.state, l = t.child) : l = _e(
      l,
      t,
      u
    ), l;
  }
  function ud(l, t, e, a) {
    return ma(), t.flags |= 256, Vl(l, t, e, a), t.child;
  }
  var df = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function mf(l) {
    return { baseLanes: l, cachePool: wr() };
  }
  function hf(l, t, e) {
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= Rt), l;
  }
  function nd(l, t, e) {
    var a = t.pendingProps, u = !1, n = (t.flags & 128) !== 0, i;
    if ((i = n) || (i = l !== null && l.memoizedState === null ? !1 : (Il.current & 2) !== 0), i && (u = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if ($) {
        if (u ? Ze(t) : Le(), (l = El) ? (l = pm(
          l,
          Zt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: Ue !== null ? { id: ae, overflow: ue } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Yr(l), e.return = t, t.child = e, wl = t, El = null)) : l = null, l === null) throw qe(t);
        return ms(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return n = a.children, a = a.fallback, u ? (Le(), u = t.mode, n = hi(
        { mode: "hidden", children: n },
        u
      ), a = da(
        a,
        u,
        e,
        null
      ), n.return = t, a.return = t, n.sibling = a, t.child = n, a = t.child, a.memoizedState = mf(e), a.childLanes = hf(
        l,
        i,
        e
      ), t.memoizedState = df, Iu(null, a)) : (Ze(t), vf(t, n));
    }
    var f = l.memoizedState;
    if (f !== null) {
      var s = f.dehydrated;
      if (s !== null)
        return Qv(
          l,
          t,
          n,
          i,
          a,
          s,
          f,
          e
        );
    }
    return u ? (Le(), u = a.fallback, n = t.mode, f = l.child, s = f.sibling, a = be(f, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = f.subtreeFlags & 1206910976, s !== null ? u = be(s, u) : (u = da(
      u,
      n,
      e,
      null
    ), u.flags |= 2), u.return = t, a.return = t, a.sibling = u, t.child = a, Iu(null, a), a = t.child, u = l.child.memoizedState, u === null ? u = mf(e) : (n = u.cachePool, n !== null ? (f = Yl._currentValue, n = n.parent !== f ? { parent: f, pool: f } : n) : n = wr(), u = {
      baseLanes: u.baseLanes | e,
      cachePool: n
    }), a.memoizedState = u, a.childLanes = hf(
      l,
      i,
      e
    ), t.memoizedState = df, Iu(l.child, a)) : (Ze(t), e = l.child, l = e.sibling, e = be(e, {
      mode: "visible",
      children: a.children
    }), e.return = t, e.sibling = null, l !== null && (i = t.deletions, i === null ? (t.deletions = [l], t.flags |= 16) : i.push(l)), t.child = e, t.memoizedState = null, e);
  }
  function vf(l, t) {
    return t = hi(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function hi(l, t) {
    return l = yt(22, l, null, t), l.lanes = 0, l;
  }
  function vi(l, t, e) {
    return ja(t, l.child, null, e), l = vf(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function Qv(l, t, e, a, u, n, i, f) {
    if (e)
      return t.flags & 256 ? (Ze(t), t.flags &= -257, vi(
        l,
        t,
        f
      )) : t.memoizedState !== null ? (Le(), t.child = l.child, t.flags |= 128, null) : (Le(), n = u.fallback, i = t.mode, u = hi(
        { mode: "visible", children: u.children },
        i
      ), n = da(
        n,
        i,
        f,
        null
      ), n.flags |= 2, u.return = t, n.return = t, u.sibling = n, t.child = u, ja(t, l.child, null, f), u = t.child, u.memoizedState = mf(f), u.childLanes = hf(
        l,
        a,
        f
      ), t.memoizedState = df, Iu(null, u));
    if (Ze(t), ms(n)) {
      if (a = n.nextSibling && n.nextSibling.dataset, a) var s = a.dgst;
      return a = s, a !== "" && (u = Error(g(419)), u.stack = "", u.digest = a, Xu({ value: u, source: null, stack: null })), vi(
        l,
        t,
        f
      );
    }
    if (Gl || va(l, t, f, !1), a = (f & l.childLanes) !== 0, Gl || a) {
      if (Ve.current !== null)
        return vi(
          l,
          t,
          f
        );
      if (a = xl, a !== null && (u = Xs(
        a,
        f
      ), u !== 0 && u !== i.retryLane))
        throw i.retryLane = u, oa(l, u), Tt(a, l, u), rf;
      return ds(n) || Ri(), vi(
        l,
        t,
        f
      );
    }
    return ds(n) ? (t.flags |= 192, t.child = l.child, null) : (l = i.treeContext, El = Kt(n.nextSibling), wl = t, $ = !0, He = null, Zt = !1, l !== null && Xr(t, l), t = vf(
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
  function yf(l) {
    var t = l.child;
    for (l.child = null; t !== null; ) {
      var e = t.sibling;
      t.sibling = l.child, l.child = t, t = e;
    }
  }
  function gf(l, t, e) {
    var a = t.pendingProps, u = a.revealOrder, n = a.tail;
    a = a.children;
    var i = Il.current;
    if (t.flags & 128)
      return Fu(t, i), null;
    var f = (i & 2) !== 0;
    if (f ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, Fu(t, i), u === "backwards" && l !== null ? (yf(l), Vl(l, t, a, e), yf(l)) : Vl(l, t, a, e), a = $ ? Gu : 0, !f && l !== null && (l.flags & 128) !== 0)
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
        e = cd(t.child), e === null ? (u = t.child, t.child = null) : (u = e.sibling, e.sibling = null, yf(t)), yi(
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
  function fd(l, t, e) {
    var a = t.pendingProps;
    return Ye(t, t.type, a.value), Vl(l, t, a.children, e), t.child;
  }
  function _e(l, t, e) {
    if (l !== null && (t.dependencies = l.dependencies), Fe |= t.lanes, (e & t.childLanes) === 0)
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
      throw Error(g(153));
    if (t.child !== null) {
      for (l = t.child, e = be(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        l = l.sibling, e = e.sibling = be(l, l.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function Sf(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Fn(l)));
  }
  function Vv(l, t, e) {
    switch (t.tag) {
      case 3:
        Ca(t, t.stateNode.containerInfo), Ye(t, Yl, l.memoizedState.cache), ma();
        break;
      case 27:
      case 5:
        Eu(t);
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
          return a || (e & u) !== 0 ? nd(l, t, e) : (Ze(t), l = _e(
            l,
            t,
            e
          ), l !== null ? l.sibling : null);
        }
        Ze(t);
        break;
      case 19:
        if (t.flags & 128)
          return gf(
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
            return gf(
              l,
              t,
              e
            );
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Fu(t, Il.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Po(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        Ye(t, Yl, l.memoizedState.cache);
    }
    return _e(l, t, e);
  }
  function sd(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Gl = !0;
      else {
        if (!Sf(l, e) && (t.flags & 128) === 0)
          return Gl = !1, Vv(
            l,
            t,
            e
          );
        Gl = (l.flags & 131072) !== 0;
      }
    else
      Gl = !1, $ && (t.flags & 1048576) !== 0 && Gr(t, Gu, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (l = ba(t.elementType), t.type = l, typeof l == "function")
            Nc(l) ? (a = Ea(l, a), t.tag = 1, t = ad(
              null,
              t,
              l,
              a,
              e
            )) : (t.tag = 0, t = of(
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
              } else if (u === hl) {
                t.tag = 14, t = ko(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (u === ml) {
                t.tag = 10, t.type = l, t = fd(
                  null,
                  t,
                  e
                );
                break l;
              }
            }
            throw t = ll(l) || l, Error(g(306, t, ""));
          }
        }
        return t;
      case 0:
        return of(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return a = t.type, u = Ea(
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
          ), l === null) throw Error(g(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          u = n.element, Yc(l, t), Ju(t, a, null, e);
          var i = t.memoizedState;
          if (a = i.cache, Ye(t, Yl, a), a !== n.cache && Mc(
            t,
            [Yl],
            e,
            !0
          ), wu(), a = i.element, n.isDehydrated)
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
              u = Xt(
                Error(g(424)),
                t
              ), Xu(u), t = ud(
                l,
                t,
                a,
                e
              );
              break l;
            } else
              for (l = t.stateNode.containerInfo, l.nodeType === 9 ? l = l.body : l = l.nodeName === "HTML" ? l.ownerDocument.body : l, El = Kt(l.firstChild), wl = t, $ = !0, He = null, Zt = !0, e = Ir(
                t,
                null,
                a,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 134221824, e = e.sibling;
          else {
            if (ma(), a === u) {
              t = _e(
                l,
                t,
                e
              );
              break l;
            }
            Vl(l, t, a, e);
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
        )) ? t.memoizedState = e : $ || (t.stateNode = mm(
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
        return Eu(t), l === null && $ && (a = t.stateNode = Dm(
          t.type,
          t.pendingProps,
          te.current
        ), wl = t, Zt = !0, u = El, Ie(t.type) ? (hs = u, El = Kt(a.firstChild)) : El = u), Vl(
          l,
          t,
          t.pendingProps.children,
          e
        ), eu(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && $ && ((u = a = El) && (a = q0(
          a,
          t.type,
          t.pendingProps,
          Zt
        ), a !== null ? (t.stateNode = a, wl = t, El = Kt(a.firstChild), Zt = !1, u = !0) : u = !1), u || qe(t)), Eu(t), u = t.type, n = t.pendingProps, i = l !== null ? l.memoizedProps : null, a = n.children, ns(u, n) ? a = null : i !== null && ns(u, i) && (t.flags |= 32), t.memoizedState !== null && (u = Kc(
          l,
          t,
          Mv,
          null,
          null,
          e
        ), Tu._currentValue = u), eu(l, t), Vl(l, t, a, e), t.child;
      case 6:
        return l === null && $ && ((l = e = El) && (e = Y0(
          e,
          t.pendingProps,
          Zt
        ), e !== null ? (t.stateNode = e, wl = t, El = null, l = !0) : l = !1), l || qe(t)), null;
      case 13:
        return nd(l, t, e);
      case 4:
        return Ca(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = ja(
          t,
          null,
          a,
          e
        ) : Vl(l, t, a, e), t.child;
      case 11:
        return Wo(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return a = t.pendingProps, eu(l, t), Vl(l, t, a, e), t.child;
      case 8:
        return Vl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return Vl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return fd(l, t, e);
      case 9:
        return u = t.type._context, a = t.pendingProps.children, ya(t), u = Wl(u), a = a(u), t.flags |= 1, Vl(l, t, a, e), t.child;
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
        return gf(l, t, e);
      case 31:
        return Xv(l, t, e);
      case 22:
        return Po(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        return ya(t), a = Wl(Yl), l === null ? (u = Uc(), u === null && (u = xl, n = Cc(), u.pooledCache = n, n.refCount++, n !== null && (u.pooledCacheLanes |= e), u = n), t.memoizedState = { parent: a, cache: u }, qc(t), Ye(t, Yl, u)) : ((l.lanes & e) !== 0 && (Yc(l, t), Ju(t, null, null, e), wu()), u = l.memoizedState, n = t.memoizedState, u.parent !== a ? (u = { parent: a, cache: a }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), Ye(t, Yl, a)) : (a = n.cache, Ye(t, Yl, a), a !== u.cache && Mc(
          t,
          [Yl],
          e,
          !0
        ))), Vl(
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
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= l === null ? 18882560 : 18874368 : $ && Kn(t), l !== null && l.memoizedProps.name !== a.name ? t.flags |= 4194816 : eu(l, t), Vl(l, t, a.children, e), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(g(156, t.tag));
  }
  function ze(l) {
    l.flags |= 4;
  }
  function bf(l, t, e, a, u) {
    var n;
    if ((n = (l.mode & 32) !== 0) && (n = e === null ? Bm(t, a) : Bm(t, a) && (a.src !== e.src || a.srcSet !== e.srcSet)), n) {
      if (l.flags |= 16777216, (u & 335544128) === u)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (Ld()) l.flags |= 8192;
        else
          throw Ta = In, Hc;
    } else l.flags &= -16777217;
  }
  function rd(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Gm(t))
      if (Ld()) l.flags |= 8192;
      else
        throw Ta = In, Hc;
  }
  function gi(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Ys() : 536870912, l.lanes |= t, cu |= t);
  }
  function Pu(l, t) {
    if (!$)
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
  function Nl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, a = 0;
    if (t)
      for (var u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags & 1206910976, a |= u.flags & 1206910976, u.return = l, u = u.sibling;
    else
      for (u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = l, u = u.sibling;
    return l.subtreeFlags |= a, l.childLanes = e, t;
  }
  function Zv(l, t, e) {
    var a = t.pendingProps;
    switch (pc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Nl(t), null;
      case 1:
        return Nl(t), null;
      case 3:
        return e = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), xe(Yl), Ae(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && ($a(t) ? ze(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ac())), Nl(t), null;
      case 26:
        var u = t.type, n = t.memoizedState;
        return l === null ? (ze(t), n !== null ? (Nl(t), rd(t, n)) : (Nl(t), bf(
          t,
          u,
          null,
          a,
          e
        ))) : n ? n !== l.memoizedState ? (ze(t), Nl(t), rd(t, n)) : (Nl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && ze(t), Nl(t), bf(
          t,
          u,
          l,
          a,
          e
        )), null;
      case 27:
        if (Ra(t), e = te.current, u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && ze(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(g(166));
            return Nl(t), t.subtreeFlags &= -33554433, null;
          }
          l = Ll.current, $a(t) ? Qr(t) : (l = Dm(u, a, e), t.stateNode = l, ze(t));
        }
        return Nl(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (Ra(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && ze(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(g(166));
            return Nl(t), t.subtreeFlags &= -33554433, null;
          }
          if (n = Ll.current, $a(t))
            Qr(t);
          else {
            var i = on(
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
            n[$l] = t, n[vt] = a;
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
            l: switch (lt(n, u, a), u) {
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
            a && ze(t);
          }
        }
        return Nl(t), t.subtreeFlags &= -33554433, bf(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          e
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && ze(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(g(166));
          if (l = te.current, $a(t)) {
            if (l = t.stateNode, e = t.memoizedProps, a = null, u = wl, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            l[$l] = t, l = !!(l.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || sm(l.nodeValue, e)), l || qe(t, !0);
          } else
            l = on(l).createTextNode(
              a
            ), l[$l] = t, t.stateNode = l;
        }
        return Nl(t), null;
      case 31:
        if (e = t.memoizedState, l === null || l.memoizedState !== null) {
          if (a = $a(t), e !== null) {
            if (l === null) {
              if (!a) throw Error(g(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(g(557));
              l[$l] = t;
            } else
              ma(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Nl(t), l = !1;
          } else
            e = Ac(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), l = !0;
          if (!l)
            return t.flags & 256 ? (Dt(t), t) : (Dt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(g(558));
        }
        return Nl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (u = $a(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!u) throw Error(g(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(g(317));
              u[$l] = t;
            } else
              ma(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Nl(t), u = !1;
          } else
            u = Ac(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return t.flags & 256 ? (Dt(t), t) : (Dt(t), null);
        }
        return Dt(t), (t.flags & 128) !== 0 ? (t.lanes = e, t) : (e = a !== null, l = l !== null && l.memoizedState !== null, e && (a = t.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), n = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== u && (a.flags |= 2048)), e !== l && e && (t.child.flags |= 8192), gi(t, t.updateQueue), Nl(t), null);
      case 4:
        return Ae(), l === null && ls(t.stateNode.containerInfo), t.flags |= 67108864, Nl(t), null;
      case 10:
        return xe(t.type), Nl(t), null;
      case 19:
        if (Zc(t), a = t.memoizedState, a === null) return Nl(t), null;
        if (u = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (u) Pu(a, !1);
          else {
            if (Ml !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = ei(l), n !== null) {
                  for (t.flags |= 128, Pu(a, !1), l = n.updateQueue, t.updateQueue = l, gi(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    qr(e, l), e = e.sibling;
                  return Fu(
                    t,
                    Il.current & 1 | 2
                  ), $ && Te(t, a.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && _t() > Ai && (t.flags |= 128, u = !0, Pu(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = ei(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, gi(t, l), Pu(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !n.alternate && !$)
                return Nl(t), null;
            } else
              2 * _t() - a.renderingStartTime > Ai && e !== 536870912 && (t.flags |= 128, u = !0, Pu(a, !1), t.lanes = 4194304);
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
          return a.rendering = l, a.tail = l.sibling, a.renderingStartTime = _t(), l.sibling = null, n = Il.current, n = u ? n & 1 | 2 : n & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !e || $ ? Fu(t, n) : (e = n, vl(kl, t), vl(Il, e), ct === null && (ct = t)), $ && Te(t, a.treeForkCount), l;
        }
        return Nl(t), null;
      case 22:
      case 23:
        return Dt(t), Qc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (Nl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Nl(t), e = t.updateQueue, e !== null && gi(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== e && (t.flags |= 2048), l !== null && Rl(Sa), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), xe(Yl), Nl(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, Nl(t), null;
    }
    throw Error(g(156, t.tag));
  }
  function Lv(l, t) {
    switch (pc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return xe(Yl), Ae(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ra(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Dt(t), t.alternate === null)
            throw Error(g(340));
          ma();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (Dt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(g(340));
          ma();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return Zc(t), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Ae(), null;
      case 10:
        return xe(t.type), null;
      case 22:
      case 23:
        return Dt(t), Qc(), l !== null && Rl(Sa), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return xe(Yl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function od(l, t) {
    switch (pc(t), t.tag) {
      case 3:
        xe(Yl), Ae();
        break;
      case 26:
      case 27:
      case 5:
        Ra(t);
        break;
      case 4:
        Ae();
        break;
      case 31:
        t.memoizedState !== null && Dt(t);
        break;
      case 13:
        Dt(t);
        break;
      case 19:
        Zc(t);
        break;
      case 10:
        xe(t.type);
        break;
      case 22:
      case 23:
        Dt(t), Qc(), l !== null && Rl(Sa);
        break;
      case 24:
        xe(Yl);
    }
  }
  function ln(l, t) {
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
    } catch (f) {
      gl(t, t.return, f);
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
            var i = a.inst, f = i.destroy;
            if (f !== void 0) {
              i.destroy = void 0, u = t;
              var s = e, v = f;
              try {
                v();
              } catch (b) {
                gl(
                  u,
                  s,
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
    e.props = Ea(
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
            (u.ref === null || u.ref.name !== n) && (u.ref = Tm(n)), a = u.ref;
            break;
          case 7:
            if (l.stateNode === null) {
              var i = new Ht(l);
              T(
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
    } catch (f) {
      gl(l, t, f);
    }
  }
  function Pl(l, t) {
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
        zm(
          l.stateNode,
          t[e]
        );
  }
  function hd(l) {
    for (var t = l.return; t !== null && (jf(t) && zm(l.stateNode, t.stateNode), !Tf(t)); )
      t = t.return;
  }
  function tn(l) {
    for (var t = l.return; t !== null && (jf(t) && H0(l.stateNode, t.stateNode), !Tf(t)); )
      t = t.return;
  }
  function Tf(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 27;
  }
  function jf(l) {
    return l && l.tag === 7 && l.stateNode !== null;
  }
  function xf(l) {
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
  function Ef(l, t, e) {
    try {
      var a = l.stateNode;
      y0(a, l.type, e, t), a[vt] = t;
    } catch (u) {
      gl(l, l.return, u);
    }
  }
  function vd(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Ie(l.type) || l.tag === 4;
  }
  function Nf(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || vd(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Ie(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function _f(l, t, e, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      u = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(u, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(u), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = ee)), Si(l, a), fl = !0;
    else if (u !== 4 && (u === 27 && (Si(l, a), a = null, Ie(l.type) && (e = l.stateNode, t = null)), l = l.child, l !== null))
      for (_f(
        l,
        t,
        e,
        a
      ), l = l.sibling; l !== null; )
        _f(
          l,
          t,
          e,
          a
        ), l = l.sibling;
  }
  function bi(l, t, e, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      u = l.stateNode, t ? e.insertBefore(u, t) : e.appendChild(u), Si(l, a), fl = !0;
    else if (u !== 4 && (u === 27 && (Si(l, a), a = null, Ie(l.type) && (e = l.stateNode)), l = l.child, l !== null))
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
      lt(t, a, e), t[$l] = l, t[vt] = e;
    } catch (n) {
      gl(l, l.return, n);
    }
  }
  var Ti = !1, Mt = null;
  function gd(l) {
    (l.tag === 30 || (l.subtreeFlags & 33554432) !== 0) && (Ti = !0);
  }
  var ie = null;
  function Sd() {
    var l = ie;
    return ie = null, l;
  }
  var gt = 0;
  function au(l, t, e, a, u) {
    return gt = 0, bd(
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
          var f = fs(i);
          a.push(f), f.view && (n = !0);
        } else
          n || fs(i).view && (n = !0);
        Ti = !0, Sm(
          i,
          gt === 0 ? t : t + "_" + gt,
          e
        ), gt++;
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
  function ji(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if ((l.tag !== 22 || l.memoizedState === null) && (ji(l), l.tag === 30 && (l.flags & 18874368) !== 0 && l.stateNode.paired)) {
          var t = l.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(g(544));
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
  function zf(l, t) {
    if (l.tag === 30) {
      var e = l.stateNode, a = l.memoizedProps, u = ge(a, e), n = Se(
        a.default,
        e.paired ? a.share : a.enter
      );
      n !== "none" ? au(l, u, n, null, !1) ? (ji(l), e.paired || t || ou(l, a.onEnter)) : ce(l.child, !1) : ji(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        zf(l, t), l = l.sibling;
    else ji(l);
  }
  function pf(l) {
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
            pf(l);
          }
          l = l.sibling;
        }
    }
  }
  function Of(l) {
    if (l.tag === 30) {
      var t = l.memoizedProps, e = ge(t, l.stateNode), a = Mt !== null ? Mt.get(e) : void 0, u = Se(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      u !== "none" && (au(l, e, u, null, !1) ? a !== void 0 ? (u = l.stateNode, a.paired = u, u.paired = a, Mt.delete(e), ou(l, t.onShare)) : ou(l, t.onExit) : ce(l.child, !1)), Mt !== null && pf(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        Of(l), l = l.sibling;
    else
      Mt !== null && pf(l);
  }
  function Td(l) {
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
        (l.subtreeFlags & 33554432) !== 0 && Td(l);
      l = l.sibling;
    }
  }
  function Af(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if (l.tag !== 22 || l.memoizedState === null) {
          if (l.tag === 30 && (l.flags & 18874368) !== 0) {
            var t = l.stateNode;
            t.paired !== null && (t.paired = null, ce(l.child, !1));
          }
          Af(l);
        }
        l = l.sibling;
      }
  }
  function xi(l) {
    if (l.tag === 30)
      l.stateNode.paired = null, ce(l.child, !1), Af(l);
    else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        xi(l), l = l.sibling;
    else Af(l);
  }
  function jd(l) {
    for (l = l.child; l !== null; )
      l.tag === 30 ? ce(l.child, !1) : (l.subtreeFlags & 33554432) !== 0 && jd(l), l = l.sibling;
  }
  function Df(l, t, e, a, u, n, i) {
    for (var f = !1; t !== null; ) {
      if (t.tag === 5) {
        var s = t.stateNode;
        if (n !== null && gt < n.length) {
          var v = n[gt], b = fs(s);
          (v.view || b.view) && (f = !0);
          var x;
          if (x = (l.flags & 4) === 0)
            if (b.clip) x = !0;
            else {
              x = v.rect;
              var m = b.rect;
              x = x.y !== m.y || x.x !== m.x || x.height !== m.height || x.width !== m.width;
            }
          x && (l.flags |= 4), b.abs ? b = !v.abs : (v = v.rect, b = b.rect, b = v.height !== b.height || v.width !== b.width), b && (l.flags |= 32);
        } else l.flags |= 32;
        (l.flags & 4) !== 0 && Sm(
          s,
          gt === 0 ? e : e + "_" + gt,
          u
        ), f && (l.flags & 4) !== 0 || (ie === null && (ie = []), ie.push(
          s,
          gt === 0 ? a : a + "_" + gt,
          t.memoizedProps
        )), gt++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && i ? l.flags |= t.flags & 32 : Df(
        l,
        t.child,
        e,
        a,
        u,
        n,
        i
      ) && (f = !0));
      t = t.sibling;
    }
    return f;
  }
  function xd(l, t) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var e = l.memoizedProps, a = l.stateNode, u = ge(e, a), n = Se(e.default, e.update), i;
        i = l.memoizedState, l.memoizedState = null, a = l;
        var f = l.child;
        gt = 0, u = Df(
          a,
          f,
          u,
          u,
          n,
          i,
          !1
        ), (l.flags & 4) !== 0 && u && ou(l, e.onUpdate);
      } else
        (l.subtreeFlags & 33554432) !== 0 && xd(l);
      l = l.sibling;
    }
  }
  var Jl = !1, dl = !1, fe = !1, Mf = !1, Ed = typeof WeakSet == "function" ? WeakSet : Set, Fl = null, se = !1, en = !1, Ei = !1, Cf = !1;
  function Kv(l, t, e) {
    if (l = l.containerInfo, as = ju, l = zr(l), gc(l)) {
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
            var f = 0, s = -1, v = -1, b = 0, x = 0, m = l, S = null;
            t: for (; ; ) {
              for (var _; m !== a || n !== 0 && m.nodeType !== 3 || (s = f + n), m !== i || u !== 0 && m.nodeType !== 3 || (v = f + u), m.nodeType === 3 && (f += m.nodeValue.length), (_ = m.firstChild) !== null; )
                S = m, m = _;
              for (; ; ) {
                if (m === l) break t;
                if (S === a && ++b === n && (s = f), S === i && ++x === u && (v = f), (_ = m.nextSibling) !== null) break;
                m = S, S = m.parentNode;
              }
              m = _;
            }
            a = s === -1 || v === -1 ? null : { start: s, end: v };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (us = { focusedElem: l, selectionRange: a }, ju = !1, e = (e & 335544064) === e, Fl = t, t = e ? 9270 : 1024; Fl !== null; ) {
      if (l = Fl, e && (a = l.deletions, a !== null))
        for (n = 0; n < a.length; n++)
          e && Of(a[n]);
      if (l.alternate === null && (l.flags & 2) !== 0)
        e && gd(l), Ni(e);
      else {
        if (l.tag === 22) {
          if (a = l.alternate, l.memoizedState !== null) {
            a !== null && a.memoizedState === null && e && Of(a), Ni(e);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            e && gd(l), Ni(e);
            continue;
          }
        }
        a = l.child, (l.subtreeFlags & t) !== 0 && a !== null ? (a.return = l, Fl = a) : (e && Td(l), Ni(e));
      }
    }
    Mt = null;
  }
  function Ni(l) {
    for (; Fl !== null; ) {
      var t = Fl, e = l, a = t.alternate, u = t.flags;
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
              var i = Ea(
                t.type,
                u
              );
              e = n.getSnapshotBeforeUpdate(
                i,
                a
              ), n.__reactInternalSnapshotBeforeUpdate = e;
            } catch (f) {
              gl(t, t.return, f);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, e = a.nodeType, e === 9)
              os(a);
            else if (e === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  os(a);
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
          if ((u & 1024) !== 0) throw Error(g(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, Fl = a;
        break;
      }
      Fl = t.return;
    }
  }
  function Nd(l, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        re(l, e), a & 4 && ln(5, e);
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
            var u = Ea(
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
        re(l, e), t === null && a & 4 && xf(e), a & 512 && ne(e, e.return);
        break;
      case 12:
        re(l, e);
        break;
      case 31:
        re(l, e), a & 4 && Od(l, e);
        break;
      case 13:
        re(l, e), a & 4 && Ad(l, e), a & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = a0.bind(
          null,
          e
        ), B0(l, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || Jl, !a) {
          var n = t !== null && t.memoizedState !== null || dl;
          t = Jl, u = dl, Jl = a, (dl = n) && !u ? (a = 2, (e.subtreeFlags & 8772) !== 0 && (a |= 1), kt(
            l,
            e,
            a
          )) : re(l, e), Jl = t, dl = u;
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
  function Rf(l, t) {
    for (l = l.child; l !== null; )
      _d(l, t), l = l.sibling;
  }
  function _d(l, t) {
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
        } catch (s) {
          gl(l, l.return, s);
        }
        Uf(l, t);
        break;
      case 6:
        try {
          l.stateNode.nodeValue = t ? "" : l.memoizedProps, fl = !0;
        } catch (s) {
          gl(l, l.return, s);
        }
        break;
      case 18:
        try {
          var f = l.stateNode;
          t ? gm(f, !0) : gm(l.stateNode, !1);
        } catch (s) {
          gl(l, l.return, s);
        }
        break;
      case 22:
      case 23:
        l.memoizedState === null && Rf(l, t);
        break;
      default:
        Rf(l, t);
    }
  }
  function Uf(l, t) {
    if (l.subtreeFlags & 67108864)
      for (l = l.child; l !== null; ) {
        l: {
          var e = l, a = t;
          switch (e.tag) {
            case 4:
              _d(e, a);
              break l;
            case 22:
              e.memoizedState === null && Uf(e, a);
              break l;
            default:
              Uf(e, a);
          }
        }
        l = l.sibling;
      }
  }
  function zd(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, zd(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && An(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var Ol = null, St = !1;
  function $t(l, t, e) {
    for (e = e.child; e !== null; )
      pd(l, t, e), e = e.sibling;
  }
  function pd(l, t, e) {
    if (zt && typeof zt.onCommitFiberUnmount == "function")
      try {
        zt.onCommitFiberUnmount(_u, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        dl || Pl(e, t), $t(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && !dl && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        dl || Pl(e, t), tn(e);
        var a = Ol, u = St;
        Ie(e.type) && (Ol = e.stateNode, St = !1), $t(
          l,
          t,
          e
        ), Mm(
          e.stateNode,
          e.type,
          e.memoizedProps
        ), Ol = a, St = u;
        break;
      case 5:
        dl || Pl(e, t), tn(e);
      case 6:
        if (e.tag === 6 && tn(e), a = Ol, u = St, Ol = null, $t(
          l,
          t,
          e
        ), Ol = a, St = u, Ol !== null)
          if (St)
            try {
              (Ol.nodeType === 9 ? Ol.body : Ol.nodeName === "HTML" ? Ol.ownerDocument.body : Ol).removeChild(e.stateNode), fl = !0;
            } catch (n) {
              gl(
                e,
                t,
                n
              );
            }
          else
            try {
              Ol.removeChild(e.stateNode), fl = !0;
            } catch (n) {
              gl(
                e,
                t,
                n
              );
            }
        break;
      case 18:
        Ol !== null && (St ? (l = Ol, ym(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), xu(l)) : ym(Ol, e.stateNode));
        break;
      case 4:
        a = Ol, u = St, Ol = e.stateNode.containerInfo, St = !0, $t(
          l,
          t,
          e
        ), Ol = a, St = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ke(2, e, t), dl || Ke(4, e, t), $t(
          l,
          t,
          e
        );
        break;
      case 1:
        dl || (Pl(e, t), a = e.stateNode, typeof a.componentWillUnmount == "function" && md(
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
        dl = (a = dl) || e.memoizedState !== null, $t(
          l,
          t,
          e
        ), dl = a;
        break;
      case 30:
        Pl(e, t), $t(
          l,
          t,
          e
        );
        break;
      case 7:
        dl || Pl(e, t), $t(
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
  function Od(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        xu(l);
      } catch (e) {
        gl(t, t.return, e);
      }
    }
  }
  function Ad(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        xu(l);
      } catch (e) {
        gl(t, t.return, e);
      }
  }
  function wv(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new Ed()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new Ed()), t;
      default:
        throw Error(g(435, l.tag));
    }
  }
  function _i(l, t) {
    var e = wv(l);
    t.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var u = u0.bind(null, l, a);
        a.then(u, u);
      }
    });
  }
  function dt(l, t, e) {
    var a = t.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var n = a[u], i = l, f = t, s = f;
        l: for (; s !== null; ) {
          switch (s.tag) {
            case 27:
              if (Ie(s.type)) {
                Ol = s.stateNode, St = !1;
                break l;
              }
              break;
            case 5:
              Ol = s.stateNode, St = !1;
              break l;
            case 3:
            case 4:
              Ol = s.stateNode.containerInfo, St = !0;
              break l;
          }
          s = s.return;
        }
        if (Ol === null) throw Error(g(160));
        pd(i, f, n), Ol = null, St = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
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
        dt(t, l, e), mt(l), u & 4 && (Ke(3, l, l.return), ln(3, l), Ke(5, l, l.return));
        break;
      case 1:
        dt(t, l, e), mt(l), u & 512 && (dl || a === null || Pl(a, a.return)), u & 64 && Jl && (l = l.updateQueue, l !== null && (t = l.callbacks, t !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? t : e.concat(t))));
        break;
      case 26:
        if (n = Wt, dt(t, l, e), mt(l), u & 512 && (dl || a === null || Pl(a, a.return)), u & 4)
          if (u = a !== null ? a.memoizedState : null, e = l.memoizedState, a === null)
            if (e === null)
              if (l.stateNode === null)
                if (Jl)
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
                        a = u.getElementsByTagName("title")[0], (!a || a[Ou] || a[$l] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = u.createElement(t), u.head.insertBefore(
                          a,
                          u.querySelector("head > title")
                        )), lt(a, t, e), a[$l] = l, Kl(a), t = a;
                        break l;
                      case "link":
                        if (n = Ym(
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
                        a = u.createElement(t), lt(a, t, e), u.head.appendChild(a);
                        break;
                      case "meta":
                        if (n = Ym(
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
                        a = u.createElement(t), lt(a, t, e), u.head.appendChild(a);
                        break;
                      default:
                        throw Error(g(468, t));
                    }
                    a[$l] = l, Kl(a), t = a;
                  }
                  l.stateNode = t;
                }
              else
                Jl || Ss(n, l.type, l.stateNode);
            else
              l.stateNode = qm(
                n,
                e,
                l.memoizedProps
              );
          else
            u !== e ? (u === null ? (t = a.stateNode, t === null || dl || t.parentNode.removeChild(t)) : u.count--, e === null ? Jl || Ss(n, l.type, l.stateNode) : qm(n, e, l.memoizedProps)) : e === null && l.stateNode !== null && Ef(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        dt(t, l, e), mt(l), u & 512 && (dl || a === null || Pl(a, a.return)), a !== null && u & 4 && Ef(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (n = fe, fe = !1, dt(t, l, e), fe = n, mt(l), u & 512 && (dl || a === null || Pl(a, a.return)), l.flags & 32) {
          t = l.stateNode;
          try {
            Ga(t, ""), fl = !0;
          } catch (b) {
            gl(l, l.return, b);
          }
        }
        u & 4 && l.stateNode != null && (t = l.memoizedProps, Ef(
          l,
          t,
          a !== null ? a.memoizedProps : t
        )), u & 1024 && (Mf = !0);
        break;
      case 6:
        if (dt(t, l, e), mt(l), u & 4) {
          if (l.stateNode === null)
            throw Error(g(162));
          t = l.memoizedProps, e = l.stateNode;
          try {
            e.nodeValue = t, fl = !0;
          } catch (b) {
            gl(l, l.return, b);
          }
        }
        break;
      case 3:
        if (fl = !1, Xi = null, n = Wt, Wt = dn(t.containerInfo), dt(t, l, e), Wt = n, mt(l), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            xu(t.containerInfo);
          } catch (b) {
            gl(l, l.return, b);
          }
        Mf && (Mf = !1, Md(l)), fl = !1;
        break;
      case 4:
        u = fe, fe = Jl, a = Ws(), n = Wt, Wt = dn(
          l.stateNode.containerInfo
        ), dt(t, l, e), mt(l), Wt = n, fl && en && (Ei = !0), fl = a, fe = u;
        break;
      case 12:
        dt(t, l, e), mt(l);
        break;
      case 31:
        dt(t, l, e), mt(l), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, _i(l, t)));
        break;
      case 13:
        dt(t, l, e), mt(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Oi = _t()), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, _i(l, t)));
        break;
      case 22:
        n = l.memoizedState !== null, i = a !== null && a.memoizedState !== null;
        var f = Jl, s = dl, v = fe;
        Jl = f || n, fe = v || n, dl = s || i, dt(t, l, e), dl = s, fe = v, Jl = f, mt(l), u & 8192 && (t = l.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, !n || a === null || i || Jl || dl || (t = i || dl, e = Jl, a = dl, Jl = n || Jl, dl = t, we(l, 2), Jl = e, dl = a), !n && fe || Rf(l, n)), u & 4 && (t = l.updateQueue, t !== null && (e = t.retryQueue, e !== null && (t.retryQueue = null, _i(l, e))));
        break;
      case 19:
        dt(t, l, e), mt(l), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, _i(l, t)));
        break;
      case 30:
        u & 512 && (dl || a === null || Pl(a, a.return)), u = Ws(), n = en, i = (e & 335544064) === e, f = l.memoizedProps, en = i && Se(
          f.default,
          f.update
        ) !== "none", dt(t, l, e), mt(l), i && a !== null && fl && (l.flags |= 4), en = n, fl = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (dl || a === null || Pl(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = l);
      default:
        dt(t, l, e), mt(l);
    }
  }
  function mt(l) {
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
          if (jf(u)) {
            var n = u.stateNode;
            a === null ? a = [n] : a.push(n);
          }
          if (Tf(u)) break;
          u = u.return;
        }
        var i = a;
        if (e == null) throw Error(g(160));
        switch (e.tag) {
          case 27:
            var f = e.stateNode, s = Nf(l);
            bi(
              l,
              s,
              f,
              i
            );
            break;
          case 5:
            var v = e.stateNode;
            e.flags & 32 && (Ga(v, ""), e.flags &= -33);
            var b = Nf(l);
            bi(
              l,
              b,
              v,
              i
            );
            break;
          case 3:
          case 4:
            var x = e.stateNode.containerInfo, m = Nf(l);
            _f(
              l,
              m,
              x,
              i
            );
            break;
          default:
            throw Error(g(161));
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
        Md(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, ju = !0, t.reset(), ju = !1), l = l.sibling;
      }
  }
  function uu(l, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Cd(t, l), t = t.sibling;
    else xd(t);
  }
  function Cd(l, t) {
    var e = l.alternate;
    if (e === null) zf(l, !1);
    else
      switch (l.tag) {
        case 3:
          if (Cf = se = !1, Sd(), uu(t, l), !se && !Ei) {
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
            )), Cf = !0;
          }
          ie = null;
          break;
        case 5:
          uu(t, l);
          break;
        case 4:
          a = se, se = !1, uu(t, l), se && (Ei = !0), se = a;
          break;
        case 22:
          l.memoizedState === null && (e.memoizedState !== null ? zf(l, !1) : uu(t, l));
          break;
        case 30:
          a = se, u = Sd(), se = !1, uu(t, l), se && (l.flags |= 4);
          var n = l.memoizedProps, i = l.stateNode;
          t = ge(n, i), i = ge(e.memoizedProps, i);
          var f = Se(n.default, n.update);
          f === "none" ? t = !1 : (n = e.memoizedState, e.memoizedState = null, e = l.child, gt = 0, t = Df(
            l,
            e,
            t,
            i,
            f,
            n,
            !0
          ), gt !== (n === null ? 0 : n.length) && (l.flags |= 32)), (l.flags & 4) !== 0 && t ? (ou(
            l,
            l.memoizedProps.onUpdate
          ), ie = u) : u !== null && (u.push.apply(u, ie), ie = u), se = (l.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          uu(t, l);
      }
  }
  function re(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Nd(l, t.alternate, t), t = t.sibling;
  }
  function we(l, t) {
    for (l = l.child; l !== null; ) {
      var e = l, a = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ke(4, e, e.return), we(
            e,
            a
          );
          break;
        case 1:
          Pl(e, e.return);
          var u = e.stateNode;
          typeof u.componentWillUnmount == "function" && md(
            e,
            e.return,
            u
          ), we(
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
          Pl(e, e.return), e.tag !== 5 && e.tag !== 27 || tn(e), we(
            e,
            a
          );
          break;
        case 6:
          tn(e);
          break;
        case 26:
          Pl(e, e.return), u = e.stateNode, e.memoizedState !== null || u === null || dl || u.parentNode.removeChild(u), we(
            e,
            a
          );
          break;
        case 22:
          e.memoizedState === null && we(
            e,
            a
          );
          break;
        case 30:
          Pl(e, e.return), we(
            e,
            a
          );
          break;
        case 7:
          Pl(e, e.return);
        default:
          we(
            e,
            a
          );
      }
      l = l.sibling;
    }
  }
  function kt(l, t, e) {
    for (e = (t.subtreeFlags & 8772) !== 0 ? e : e & -2, t = t.child; t !== null; ) {
      var a = t.alternate, u = l, n = t, i = n.flags, f = (e & 1) !== 0;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          kt(
            u,
            n,
            e
          ), ln(4, n);
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
            var s = a.stateNode;
            try {
              var v = u.shared.hiddenCallbacks;
              if (v !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < v.length; u++)
                  Pr(v[u], s);
            } catch (b) {
              gl(a, a.return, b);
            }
          }
          f && i & 64 && dd(n), ne(n, n.return);
          break;
        case 27:
          (e & 2) !== 0 && yd(n);
        case 5:
          n.tag !== 5 && n.tag !== 27 || hd(n), kt(
            u,
            n,
            e
          ), f && a === null && i & 4 && xf(n), ne(n, n.return);
          break;
        case 6:
          hd(n);
          break;
        case 26:
          s = n.stateNode, n.memoizedState !== null || s === null || Jl || Ss(
            dn(s.ownerDocument),
            n.type,
            s
          ), kt(
            u,
            n,
            e
          ), f && a === null && i & 4 && xf(n), ne(n, n.return);
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
          ), f && i & 4 && Od(u, n);
          break;
        case 13:
          kt(
            u,
            n,
            e
          ), f && i & 4 && Ad(u, n);
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
  function Hf(l, t) {
    var e = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== e && (l != null && l.refCount++, e != null && Qu(e));
  }
  function qf(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Qu(l));
  }
  function Lt(l, t, e, a) {
    var u = (e & 335544064) === e;
    if (t.subtreeFlags & (u ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Rd(
          l,
          t,
          e,
          a
        ), t = t.sibling;
    else u && jd(t);
  }
  function Rd(l, t, e, a) {
    var u = (e & 335544064) === e;
    u && t.alternate === null && t.return !== null && t.return.alternate !== null && xi(t);
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Lt(
          l,
          t,
          e,
          a
        ), n & 2048 && ln(9, t);
        break;
      case 1:
        Lt(
          l,
          t,
          e,
          a
        );
        break;
      case 3:
        Lt(
          l,
          t,
          e,
          a
        ), u && Cf && (l = l.containerInfo, l = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, l.style.viewTransitionName === "root" && (l.style.viewTransitionName = ""), l = l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "none" && (l.style.viewTransitionName = "")), n & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== n && (t.refCount++, n != null && Qu(n)));
        break;
      case 12:
        if (n & 2048) {
          Lt(
            l,
            t,
            e,
            a
          ), n = t.stateNode;
          try {
            var i = t.memoizedProps, f = i.id, s = i.onPostCommit;
            typeof s == "function" && s(
              f,
              t.alternate === null ? "mount" : "update",
              n.passiveEffectDuration,
              -0
            );
          } catch (v) {
            gl(t, t.return, v);
          }
        } else
          Lt(
            l,
            t,
            e,
            a
          );
        break;
      case 31:
        Lt(
          l,
          t,
          e,
          a
        );
        break;
      case 13:
        Lt(
          l,
          t,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, f = t.alternate, t.memoizedState !== null ? (u && f !== null && f.memoizedState === null && xi(f), i._visibility & 2 ? Lt(
          l,
          t,
          e,
          a
        ) : an(
          l,
          t
        )) : (u && f !== null && f.memoizedState !== null && xi(t), i._visibility & 2 ? Lt(
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
        ))), n & 2048 && Hf(f, t);
        break;
      case 24:
        Lt(
          l,
          t,
          e,
          a
        ), n & 2048 && qf(t.alternate, t);
        break;
      case 30:
        u && (n = t.alternate, n !== null && (ce(n.child, !0), ce(t.child, !0))), Lt(
          l,
          t,
          e,
          a
        );
        break;
      default:
        Lt(
          l,
          t,
          e,
          a
        );
    }
  }
  function nu(l, t, e, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, i = t, f = e, s = a, v = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          nu(
            n,
            i,
            f,
            s,
            u
          ), ln(8, i);
          break;
        case 23:
          break;
        case 22:
          var b = i.stateNode;
          i.memoizedState !== null ? b._visibility & 2 ? nu(
            n,
            i,
            f,
            s,
            u
          ) : an(
            n,
            i
          ) : (b._visibility |= 2, nu(
            n,
            i,
            f,
            s,
            u
          )), u && v & 2048 && Hf(
            i.alternate,
            i
          );
          break;
        case 24:
          nu(
            n,
            i,
            f,
            s,
            u
          ), u && v & 2048 && qf(i.alternate, i);
          break;
        default:
          nu(
            n,
            i,
            f,
            s,
            u
          );
      }
      t = t.sibling;
    }
  }
  function an(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l, a = t, u = a.flags;
        switch (a.tag) {
          case 22:
            an(e, a), u & 2048 && Hf(
              a.alternate,
              a
            );
            break;
          case 24:
            an(e, a), u & 2048 && qf(a.alternate, a);
            break;
          default:
            an(e, a);
        }
        t = t.sibling;
      }
  }
  var Na = 8192;
  function _a(l, t, e) {
    if (l.subtreeFlags & Na)
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
        _a(
          l,
          t,
          e
        ), l.flags & Na && (l.memoizedState !== null ? I0(
          e,
          Wt,
          l.memoizedState,
          l.memoizedProps
        ) : (l = l.stateNode, (t & 335544128) === t && Qm(e, l)));
        break;
      case 5:
        _a(
          l,
          t,
          e
        ), l.flags & Na && (l = l.stateNode, (t & 335544128) === t && Qm(e, l));
        break;
      case 3:
      case 4:
        var a = Wt;
        Wt = dn(l.stateNode.containerInfo), _a(
          l,
          t,
          e
        ), Wt = a;
        break;
      case 22:
        l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = Na, Na = 16777216, _a(
          l,
          t,
          e
        ), Na = a) : _a(
          l,
          t,
          e
        ));
        break;
      case 30:
        if ((l.flags & Na) !== 0 && (a = l.memoizedProps.name, a != null && a !== "auto")) {
          var u = l.stateNode;
          u.paired = null, Mt === null && (Mt = /* @__PURE__ */ new Map()), Mt.set(a, u);
        }
        _a(
          l,
          t,
          e
        );
        break;
      default:
        _a(
          l,
          t,
          e
        );
    }
  }
  function Hd(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function un(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Fl = a, Yd(
            a,
            l
          );
        }
      Hd(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        qd(l), l = l.sibling;
  }
  function qd(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        un(l), l.flags & 2048 && Ke(9, l, l.return);
        break;
      case 3:
        un(l);
        break;
      case 12:
        un(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, zi(l)) : un(l);
        break;
      default:
        un(l);
    }
  }
  function zi(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Fl = a, Yd(
            a,
            l
          );
        }
      Hd(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          Ke(8, t, t.return), zi(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, zi(t));
          break;
        default:
          zi(t);
      }
      l = l.sibling;
    }
  }
  function Yd(l, t) {
    for (; Fl !== null; ) {
      var e = Fl;
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
          Qu(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, Fl = a;
      else
        l: for (e = l; Fl !== null; ) {
          a = Fl;
          var u = a.sibling, n = a.return;
          if (zd(a), a === e) {
            Fl = null;
            break l;
          }
          if (u !== null) {
            u.return = n, Fl = u;
            break l;
          }
          Fl = n;
        }
    }
  }
  var Jv = {
    getCacheForType: function(l) {
      var t = Wl(Yl), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    },
    cacheSignal: function() {
      return Wl(Yl).controller.signal;
    }
  }, Fv = typeof WeakMap == "function" ? WeakMap : Map, rl = 0, xl = null, k = null, tl = 0, yl = 0, Ct = null, Je = !1, iu = !1, Yf = !1, pe = 0, Ml = 0, Fe = 0, za = 0, pi = 0, Rt = 0, cu = 0, nn = null, bt = null, Bf = !1, Oi = 0, Bd = 0, Ai = 1 / 0, Di = null, $e = null, Al = 0, It = null, pa = null, oe = 0, Gf = 0, Xf = null, Gd = null, fu = null, su = null, ru = null, cn = 0, Mi = null;
  function Ut() {
    return (rl & 2) !== 0 && tl !== 0 ? tl & -tl : p.T !== null ? Wf() : Qs();
  }
  function Xd() {
    if (Rt === 0)
      if ((tl & 536870912) === 0 || $) {
        var l = _n;
        _n <<= 1, (_n & 3932160) === 0 && (_n = 262144), Rt = l;
      } else Rt = 536870912;
    return l = kl.current, l !== null && (l.flags |= 32), Rt;
  }
  function ou(l, t) {
    if (t != null) {
      var e = l.stateNode, a = e.ref;
      a === null && (a = e.ref = Tm(
        ge(l.memoizedProps, e)
      )), su === null && (su = []), su.push(t.bind(null, a));
    }
  }
  function Tt(l, t, e) {
    (l === xl && (yl === 2 || yl === 9) || l.cancelPendingCommit !== null) && (du(l, 0), We(
      l,
      tl,
      Rt,
      !1
    )), pu(l, e), ((rl & 2) === 0 || l !== xl) && (l === xl && ((rl & 2) === 0 && (za |= e), Ml === 4 && We(
      l,
      tl,
      Rt,
      !1
    )), de(l));
  }
  function Qd(l, t, e) {
    if ((rl & 6) !== 0) throw Error(g(327));
    var a = !e && (t & 127) === 0 && (t & l.expiredLanes) === 0 || zu(l, t), u = a ? kv(l, t) : Vf(l, t, !0), n = a;
    do {
      if (u === 0) {
        iu && !a && We(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, n && !$v(e)) {
          u = Vf(l, t, !1), n = !1;
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
              var f = l;
              u = nn;
              var s = f.current.memoizedState.isDehydrated;
              if (s && (du(f, i).flags |= 256), i = Vf(
                f,
                i,
                !1
              ), i !== 2 && i !== 6) {
                if (Yf && !s) {
                  f.errorRecoveryDisabledLanes |= n, za |= n, u = 4;
                  break l;
                }
                n = bt, bt = u, n !== null && (bt === null ? bt = n : bt.push.apply(
                  bt,
                  n
                ));
              }
              u = i;
            }
            if (n = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          du(l, 0), We(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, n = u, n) {
            case 0:
            case 1:
              throw Error(g(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              We(
                a,
                t,
                Rt,
                !Je
              );
              break l;
            case 2:
              bt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(g(329));
          }
          if ((t & 62914560) === t && (u = Oi + 300 - _t(), 10 < u)) {
            if (We(
              a,
              t,
              Rt,
              !Je
            ), pn(a, 0, !0) !== 0) break l;
            oe = t, a.timeoutHandle = cs(
              Vd.bind(
                null,
                a,
                e,
                bt,
                Di,
                Bf,
                t,
                Rt,
                za,
                cu,
                Je,
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
            bt,
            Di,
            Bf,
            t,
            Rt,
            za,
            cu,
            Je,
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
  function Vd(l, t, e, a, u, n, i, f, s, v, b, x, m, S) {
    l.timeoutHandle = -1;
    var _ = t.subtreeFlags, D = (n & 335544064) === n;
    if (x = null, (D || _ & 8192 || (_ & 16785408) === 16785408) && (x = {
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
      x
    ), D && (_ = x, D = l.containerInfo, D = (D.nodeType === 9 ? D : D.ownerDocument).__reactViewTransition, D != null && (_.count++, _.waitingForViewTransition = !0, _ = vn.bind(_), D.finished.then(_, _))), _ = (n & 62914560) === n ? Oi - _t() : (n & 4194048) === n ? Bd - _t() : 0, _ = P0(
      x,
      _
    ), _ !== null)) {
      oe = n, l.cancelPendingCommit = _(
        Wd.bind(
          null,
          l,
          t,
          n,
          e,
          a,
          u,
          i,
          f,
          s,
          v,
          b,
          x,
          null,
          m,
          S
        )
      ), We(l, n, i, !v);
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
      f,
      s,
      v,
      b,
      x
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
            if (!At(n(), u)) return !1;
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
  function We(l, t, e, a) {
    t = qs(l, t), t &= ~pi, t &= ~za, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var u = t; 0 < u; ) {
      var n = 31 - pt(u), i = 1 << n;
      a[n] = -1, u &= ~i;
    }
    e !== 0 && Bs(l, e, t);
  }
  function Ci() {
    return (rl & 6) === 0 ? (fn(0), !1) : !0;
  }
  function Qf() {
    if (k !== null) {
      if (yl === 0)
        var l = k.return;
      else
        l = k, je = ha = null, Fc(l), Ia = null, Lu = 0, l = k;
      for (; l !== null; )
        od(l.alternate, l), l = l.return;
      k = null;
    }
  }
  function du(l, t) {
    var e = l.timeoutHandle;
    return e !== -1 && (l.timeoutHandle = -1, b0(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), oe = 0, Qf(), xl = l, k = e = be(l.current, null), tl = t, yl = 0, Ct = null, Je = !1, iu = zu(l, t), Yf = !1, cu = Rt = pi = za = Fe = Ml = 0, bt = nn = null, Bf = !1, pe = qs(l, t), Xn(), e;
  }
  function Zd(l, t) {
    L = null, p.H = oi, t === ka || t === kn ? (t = $r(), yl = 3) : t === Hc ? (t = $r(), yl = 4) : yl = t === rf ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Ct = t, k === null && (Ml = 1, di(
      l,
      Xt(t, l.current)
    ));
  }
  function Ld() {
    var l = kl.current;
    return l === null ? !0 : (tl & 4194048) === tl ? ct === null : (tl & 62914560) === tl || (tl & 536870912) !== 0 ? l === ct : !1;
  }
  function Kd() {
    var l = p.H;
    return p.H = oi, l === null ? oi : l;
  }
  function wd() {
    var l = p.A;
    return p.A = Jv, l;
  }
  function Ri() {
    Ml = 4, Je || (tl & 4194048) !== tl && kl.current !== null || (iu = !0), (Fe & 134217727) === 0 && (za & 134217727) === 0 || xl === null || We(
      xl,
      tl,
      Rt,
      !1
    );
  }
  function Vf(l, t, e) {
    var a = rl;
    rl |= 2;
    var u = Kd(), n = wd();
    (xl !== l || tl !== t) && (Di = null, du(l, t)), t = !1;
    var i = Ml;
    l: do
      try {
        if (yl !== 0 && k !== null) {
          var f = k, s = Ct;
          switch (yl) {
            case 8:
              Qf(), i = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              kl.current === null && (t = !0);
              var v = yl;
              if (yl = 0, Ct = null, mu(l, f, s, v), e && iu) {
                i = 0;
                break l;
              }
              break;
            default:
              v = yl, yl = 0, Ct = null, mu(l, f, s, v);
          }
        }
        Wv(), i = Ml;
        break;
      } catch (b) {
        Zd(l, b);
      }
    while (!0);
    return t && l.shellSuspendCounter++, je = ha = null, rl = a, p.H = u, p.A = n, k === null && (xl = null, tl = 0, Xn()), i;
  }
  function Wv() {
    for (; k !== null; ) Jd(k);
  }
  function kv(l, t) {
    var e = rl;
    rl |= 2;
    var a = Kd(), u = wd();
    xl !== l || tl !== t ? (Di = null, Ai = _t() + 500, du(l, t)) : iu = zu(
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
                yl !== 2 && yl !== 9 || xl !== l || (yl = 7), de(l);
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
                  var f = k;
                  if (i ? Gm(i) : f.stateNode.complete) {
                    yl = 0, Ct = null;
                    var s = f.sibling;
                    if (s !== null) k = s;
                    else {
                      var v = f.return;
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
              Qf(), Ml = 6;
              break l;
            default:
              throw Error(g(462));
          }
        }
        Iv();
        break;
      } catch (b) {
        Zd(l, b);
      }
    while (!0);
    return je = ha = null, p.H = a, p.A = u, rl = e, k !== null ? 0 : (xl = null, tl = 0, Xn(), Ml);
  }
  function Iv() {
    for (; k !== null && !vh(); )
      Jd(k);
  }
  function Jd(l) {
    var t = sd(l.alternate, l, pe);
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
        a === wl && ($ ? (wn(a), a.tag === 5 && a.stateNode != null && (El = a.stateNode)) : (wn(a), $ = !0));
      default:
        od(e, t), t = k = qr(t, pe), t = sd(e, t, pe);
    }
    l.memoizedProps = l.pendingProps, t === null ? Ui(l) : k = t;
  }
  function mu(l, t, e, a) {
    je = ha = null, Fc(t), Ia = null, Lu = 0;
    var u = t.return;
    try {
      if (Gv(
        l,
        u,
        t,
        e,
        tl
      )) {
        Ml = 1, di(
          l,
          Xt(e, l.current)
        ), k = null;
        return;
      }
    } catch (n) {
      if (u !== null) throw k = u, n;
      Ml = 1, di(
        l,
        Xt(e, l.current)
      ), k = null;
      return;
    }
    t.flags & 32768 ? ($ || a === 1 ? l = !0 : iu || (tl & 536870912) !== 0 ? l = !1 : (Je = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = kl.current, a !== null && a.tag === 13 && (a.flags |= 16384))), $d(t, l)) : Ui(t);
  }
  function Ui(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        $d(
          t,
          Je
        );
        return;
      }
      l = t.return;
      var e = Zv(
        t.alternate,
        t,
        pe
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
    Ml === 0 && (Ml = 5);
  }
  function $d(l, t) {
    do {
      var e = Lv(l.alternate, l);
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
    Ml = 6, k = null;
  }
  function Wd(l, t, e, a, u, n, i, f, s, v, b, x) {
    l.cancelPendingCommit = null;
    do
      Hi();
    while (Al !== 0);
    if ((rl & 6) !== 0) throw Error(g(327));
    if (t !== null) {
      if (t === l.current) throw Error(g(177));
      l === xl && (k = xl = null, tl = 0), pa = t, It = l, oe = e, Xf = u, Gd = a, Pv(
        l,
        t,
        e,
        i,
        f,
        s,
        x
      );
    }
  }
  function Pv(l, t, e, a, u, n, i) {
    var f = t.lanes | t.childLanes;
    if (Gf = f, f |= xc, _h(
      l,
      e,
      f,
      a,
      u,
      n
    ), su = null, (e & 335544064) === e ? (ru = pv(l), a = 10262) : (ru = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, n0(En, function() {
      return wf(), null;
    })) : (l.callbackNode = null, l.callbackPriority = 0), Ti = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = p.T, p.T = null, u = B.p, B.p = 2, n = rl, rl |= 4;
      try {
        Kv(l, t, e);
      } finally {
        rl = n, B.p = u, p.T = a;
      }
    }
    Al = 1, Ti ? fu = _0(
      i,
      l.containerInfo,
      ru,
      Zf,
      Lf,
      t0,
      Kf,
      wf,
      l0
    ) : (Zf(), Lf(), Kf());
  }
  function l0(l) {
    if (Al !== 0) {
      var t = It.onRecoverableError;
      t(l, { componentStack: null });
    }
  }
  function t0() {
    Al === 3 && (Al = 0, Cd(pa, It), Al = 4);
  }
  function Zf() {
    if (Al === 1) {
      Al = 0;
      var l = It, t = pa, e = oe, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = p.T, p.T = null;
        var u = B.p;
        B.p = 2;
        var n = rl;
        rl |= 4;
        try {
          en = Ei = !1, Dd(t, l, e), e = us;
          var i = zr(l.containerInfo), f = e.focusedElem, s = e.selectionRange;
          if (i !== f && f && f.ownerDocument && _r(
            f.ownerDocument.documentElement,
            f
          )) {
            if (s !== null && gc(f)) {
              var v = s.start, b = s.end;
              if (b === void 0 && (b = v), "selectionStart" in f)
                f.selectionStart = v, f.selectionEnd = Math.min(
                  b,
                  f.value.length
                );
              else {
                var x = f.ownerDocument || document, m = x && x.defaultView || window;
                if (m.getSelection) {
                  var S = m.getSelection(), _ = f.textContent.length, D = Math.min(s.start, _), K = s.end === void 0 ? D : Math.min(s.end, _);
                  !S.extend && D > K && (i = K, K = D, D = i);
                  var h = Nr(
                    f,
                    D
                  ), r = Nr(
                    f,
                    K
                  );
                  if (h && r && (S.rangeCount !== 1 || S.anchorNode !== h.node || S.anchorOffset !== h.offset || S.focusNode !== r.node || S.focusOffset !== r.offset)) {
                    var y = x.createRange();
                    y.setStart(h.node, h.offset), S.removeAllRanges(), D > K ? (S.addRange(y), S.extend(r.node, r.offset)) : (y.setEnd(r.node, r.offset), S.addRange(y));
                  }
                }
              }
            }
            for (x = [], S = f; S = S.parentNode; )
              S.nodeType === 1 && x.push({
                element: S,
                left: S.scrollLeft,
                top: S.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < x.length; f++) {
              var j = x[f];
              j.element.scrollLeft = j.left, j.element.scrollTop = j.top;
            }
          }
          ju = !!as, us = as = null;
        } finally {
          rl = n, B.p = u, p.T = a;
        }
      }
      l.current = t, Al = 2;
    }
  }
  function Lf() {
    if (Al === 2) {
      Al = 0;
      var l = It, t = pa, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = p.T, p.T = null;
        var a = B.p;
        B.p = 2;
        var u = rl;
        rl |= 4;
        try {
          Nd(l, t.alternate, t);
        } finally {
          rl = u, B.p = a, p.T = e;
        }
      }
      Al = 3;
    }
  }
  function Kf() {
    if (Al === 4 || Al === 3) {
      Al = 0;
      var l = fu;
      fu = null, yh();
      var t = It, e = pa, a = oe, u = Gd, n = (a & 335544064) === a ? 10262 : 10256;
      if ((e.subtreeFlags & n) !== 0 || (e.flags & n) !== 0 ? Al = 5 : (Al = 0, pa = It = null, kd(t, t.pendingLanes)), n = t.pendingLanes, n === 0 && ($e = null), Pi(a), e = e.stateNode, zt && typeof zt.onCommitFiberRoot == "function")
        try {
          zt.onCommitFiberRoot(
            _u,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        e = p.T, n = B.p, B.p = 2, p.T = null;
        try {
          for (var i = t.onRecoverableError, f = 0; f < u.length; f++) {
            var s = u[f];
            i(s.value, {
              componentStack: s.stack
            });
          }
        } finally {
          p.T = e, B.p = n;
        }
      }
      if (u = su, i = ru, ru = null, u !== null && (su = null, i === null && (i = []), l !== null))
        for (s = 0; s < u.length; s++)
          e = (0, u[s])(
            i
          ), e !== void 0 && l.finished.finally(e);
      (oe & 3) !== 0 && Hi(), de(t), n = t.pendingLanes, (a & 261930) !== 0 && (n & 42) !== 0 ? t === Mi ? cn++ : (cn = 0, Mi = t) : (cn = 0, Mi = null), fn(0);
    }
  }
  function kd(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Qu(t)));
  }
  function Hi() {
    return fu !== null && (fu.skipTransition(), fu = null), Zf(), Lf(), Kf(), wf();
  }
  function wf() {
    if (Al !== 5) return !1;
    var l = It, t = Gf;
    Gf = 0;
    var e = Pi(oe), a = p.T, u = B.p;
    try {
      B.p = 32 > e ? 32 : e, p.T = null, e = Xf, Xf = null;
      var n = It, i = oe;
      if (Al = 0, pa = It = null, oe = 0, (rl & 6) !== 0) throw Error(g(331));
      var f = rl;
      if (rl |= 4, qd(n.current), Rd(
        n,
        n.current,
        i,
        e
      ), rl = f, fn(0, !1), zt && typeof zt.onPostCommitFiberRoot == "function")
        try {
          zt.onPostCommitFiberRoot(_u, n);
        } catch {
        }
      return !0;
    } finally {
      B.p = u, p.T = a, kd(l, t);
    }
  }
  function Id(l, t, e) {
    t = Xt(e, t), t = sf(l.stateNode, t, 2), l = Qe(l, t, 2), l !== null && (pu(l, 2), de(l));
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
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && ($e === null || !$e.has(a))) {
            l = Xt(e, l), e = Fo(2), a = Qe(t, e, 2), a !== null && ($o(
              e,
              a,
              t,
              l
            ), pu(a, 2), de(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Jf(l, t, e) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new Fv();
      var u = /* @__PURE__ */ new Set();
      a.set(t, u);
    } else
      u = a.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), a.set(t, u));
    u.has(e) || (Yf = !0, u.add(e), l = e0.bind(null, l, t, e), t.then(l, l));
  }
  function e0(l, t, e) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, xl === l && (tl & e) === e && ((Ml === 4 || Ml === 3 && (tl & 62914560) === tl && 300 > _t() - Oi) && (rl & 2) === 0 ? du(l, 0) : pi |= e, cu === tl && (cu = 0)), de(l);
  }
  function Pd(l, t) {
    t === 0 && (t = Ys()), l = oa(l, t), l !== null && (pu(l, t), de(l));
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
        throw Error(g(314));
    }
    a !== null && a.delete(t), Pd(l, e);
  }
  function n0(l, t) {
    return Jt(l, t);
  }
  var hu = null, vu = null, Ff = !1, qi = !1, $f = !1, ke = 0;
  function de(l) {
    l !== vu && l.next === null && (vu === null ? hu = vu = l : vu = vu.next = l), qi = !0, Ff || (Ff = !0, c0());
  }
  function fn(l, t) {
    if (!$f && qi) {
      $f = !0;
      do
        for (var e = !1, a = hu; a !== null; ) {
          if (l !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes, f = a.pingedLanes;
              n = (1 << 31 - pt(42 | l) + 1) - 1, n &= u & ~(i & ~f), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (e = !0, am(a, n));
          } else
            n = tl, n = pn(
              a,
              a === xl ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || zu(a, n) || (e = !0, am(a, n));
          a = a.next;
        }
      while (e);
      $f = !1;
    }
  }
  function i0() {
    lm();
  }
  function lm() {
    qi = Ff = !1;
    var l = 0;
    ke !== 0 && S0() && (l = ke);
    for (var t = _t(), e = null, a = hu; a !== null; ) {
      var u = a.next, n = tm(a, t);
      n === 0 ? (a.next = null, e === null ? hu = u : e.next = u, u === null && (vu = e)) : (e = a, (l !== 0 || (n & 3) !== 0) && (qi = !0)), a = u;
    }
    Al !== 0 && Al !== 5 || fn(l), ke !== 0 && (ke = 0);
  }
  function tm(l, t) {
    for (var e = l.suspendedLanes, a = l.pingedLanes, u = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - pt(n), f = 1 << i, s = u[i];
      s === -1 ? ((f & e) === 0 || (f & a) !== 0) && (u[i] = Nh(f, t)) : s <= t && (l.expiredLanes |= f), n &= ~f;
    }
    if (t = xl, e = tl, e = pn(
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
          e = Us;
          break;
        case 32:
          e = En;
          break;
        case 268435456:
          e = Hs;
          break;
        default:
          e = En;
      }
      return a = em.bind(null, l), e = Jt(e, a), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return a !== null && a !== null && Wi(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function em(l, t) {
    if (Al !== 0 && Al !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (Hi() && l.callbackNode !== e)
      return null;
    var a = tl;
    return a = pn(
      l,
      l === xl ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (Qd(l, a, t), tm(l, _t()), l.callbackNode != null && l.callbackNode === e ? em.bind(null, l) : null);
  }
  function am(l, t) {
    if (Hi()) return null;
    Qd(l, t, !0);
  }
  function c0() {
    T0(function() {
      (rl & 6) !== 0 ? Jt(
        Rs,
        i0
      ) : lm();
    });
  }
  function Wf() {
    if (ke === 0) {
      var l = ga;
      l === 0 && (l = Nn, Nn <<= 1, (Nn & 261888) === 0 && (Nn = 256)), ke = l;
    }
    return ke;
  }
  function um(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Cn(l);
  }
  function f0(l, t, e, a, u) {
    if (t === "submit" && e && e.stateNode === u) {
      var n = um(
        (u[vt] || null).action
      ), i = a.submitter;
      i && (t = (t = i[vt] || null) ? um(t.formAction) : i.getAttribute("formAction"), t !== null && (n = t, i = null));
      var f = new qn(
        "action",
        "action",
        null,
        a,
        u
      );
      l.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (ke !== 0) {
                  var s = new FormData(u, i);
                  af(
                    e,
                    {
                      pending: !0,
                      data: s,
                      method: u.method,
                      action: n
                    },
                    null,
                    s
                  );
                }
              } else
                typeof n == "function" && (f.preventDefault(), s = new FormData(u, i), af(
                  e,
                  {
                    pending: !0,
                    data: s,
                    method: u.method,
                    action: n
                  },
                  n,
                  s
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var kf = 0; kf < jc.length; kf++) {
    var If = jc[kf], s0 = If.toLowerCase(), r0 = If[0].toUpperCase() + If.slice(1);
    Ft(
      s0,
      "on" + r0
    );
  }
  Ft(Ar, "onAnimationEnd"), Ft(Dr, "onAnimationIteration"), Ft(Mr, "onAnimationStart"), Ft("dblclick", "onDoubleClick"), Ft("focusin", "onFocus"), Ft("focusout", "onBlur"), Ft(bv, "onTransitionRun"), Ft(Tv, "onTransitionStart"), Ft(jv, "onTransitionCancel"), Ft(Cr, "onTransitionEnd"), Ya("onMouseEnter", ["mouseout", "mouseover"]), Ya("onMouseLeave", ["mouseout", "mouseover"]), Ya("onPointerEnter", ["pointerout", "pointerover"]), Ya("onPointerLeave", ["pointerout", "pointerover"]), fa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), fa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), fa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), fa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), fa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), fa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var sn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), o0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(sn)
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
            var f = a[i], s = f.instance, v = f.currentTarget;
            if (f = f.listener, s !== n && u.isPropagationStopped())
              break l;
            n = f, u.currentTarget = v;
            try {
              n(u);
            } catch (b) {
              Gn(b);
            }
            u.currentTarget = null, n = s;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (f = a[i], s = f.instance, v = f.currentTarget, f = f.listener, s !== n && u.isPropagationStopped())
              break l;
            n = f, u.currentTarget = v;
            try {
              n(u);
            } catch (b) {
              Gn(b);
            }
            u.currentTarget = null, n = s;
          }
      }
    }
  }
  function I(l, t) {
    var e = t[Zs];
    e === void 0 && (e = t[Zs] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    e.has(a) || (im(t, l, 2, !1), e.add(a));
  }
  function Pf(l, t, e) {
    var a = 0;
    t && (a |= 4), im(
      e,
      l,
      a,
      t
    );
  }
  var Yi = "_reactListening" + Math.random().toString(36).slice(2);
  function ls(l) {
    if (!l[Yi]) {
      l[Yi] = !0, ws.forEach(function(e) {
        e !== "selectionchange" && (o0.has(e) || Pf(e, !1, l), Pf(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[Yi] || (t[Yi] = !0, Pf("selectionchange", !1, t));
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
        u = Ts;
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
  function ts(l, t, e, a, u) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var f = a.stateNode.containerInfo;
          if (f === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var s = i.tag;
              if ((s === 3 || s === 4) && i.stateNode.containerInfo === u)
                return;
              i = i.return;
            }
          for (; f !== null; ) {
            if (i = ca(f), i === null) return;
            if (s = i.tag, s === 5 || s === 6 || s === 26 || s === 27) {
              a = n = i;
              continue l;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    nr(function() {
      var v = n, b = nc(e), x = [];
      l: {
        var m = Rr.get(l);
        if (m !== void 0) {
          var S = qn, _ = l;
          switch (l) {
            case "keypress":
              if (Un(e) === 0) break l;
            case "keydown":
            case "keyup":
              S = $h;
              break;
            case "focusin":
              _ = "focus", S = oc;
              break;
            case "focusout":
              _ = "blur", S = oc;
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
              S = fr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              S = Yh;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              S = lv;
              break;
            case Ar:
            case Dr:
            case Mr:
              S = Xh;
              break;
            case Cr:
              S = ev;
              break;
            case "scroll":
            case "scrollend":
              S = Hh;
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
          for (var r = v, y; r !== null; ) {
            var j = r;
            if (y = j.stateNode, j = j.tag, j !== 5 && j !== 26 && j !== 27 || y === null || h === null || (j = Du(r, h), j != null && D.push(
              rn(r, j, y)
            )), K) break;
            r = r.return;
          }
          0 < D.length && (m = new S(
            m,
            _,
            null,
            e,
            b
          ), x.push({ event: m, listeners: D }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (S = l === "mouseover" || l === "pointerover", m = l === "mouseout" || l === "pointerout", S && e !== uc && (_ = e.relatedTarget || e.fromElement) && (ca(_) || _[Ua]))
            break l;
          (m || S) && (_ = b.window === b ? b : (S = b.ownerDocument) ? S.defaultView || S.parentWindow : window, m ? (S = e.relatedTarget || e.toElement, m = v, S = S ? ca(S) : null, S !== null && (K = w(S), D = S.tag, S !== K || D !== 5 && D !== 27 && D !== 6) && (S = null)) : (m = null, S = v), m !== S && (D = fr, j = "onMouseLeave", h = "onMouseEnter", r = "mouse", (l === "pointerout" || l === "pointerover") && (D = rr, j = "onPointerLeave", h = "onPointerEnter", r = "pointer"), K = m == null ? _ : Au(m), y = S == null ? _ : Au(S), _ = new D(
            j,
            r + "leave",
            m,
            e,
            b
          ), _.target = K, _.relatedTarget = y, j = null, ca(b) === v && (D = new D(
            h,
            r + "enter",
            S,
            e,
            b
          ), D.target = y, D.relatedTarget = K, j = D), K = j, D = m && S ? ol(
            m,
            S,
            d0
          ) : null, m !== null && cm(
            x,
            _,
            m,
            D,
            !1
          ), S !== null && K !== null && cm(
            x,
            K,
            S,
            D,
            !0
          )));
        }
        l: {
          if (m = v ? Au(v) : window, S = m.nodeName && m.nodeName.toLowerCase(), S === "select" || S === "input" && m.type === "file")
            var A = Sr;
          else if (yr(m))
            if (br)
              A = yv;
            else {
              A = hv;
              var el = mv;
            }
          else
            S = m.nodeName, !S || S.toLowerCase() !== "input" || m.type !== "checkbox" && m.type !== "radio" ? v && ac(v.elementType) && (A = Sr) : A = vv;
          if (A && (A = A(l, v))) {
            gr(
              x,
              A,
              e,
              b
            );
            break l;
          }
          el && el(l, m, v);
        }
        switch (el = v ? Au(v) : window, l) {
          case "focusin":
            (yr(el) || el.contentEditable === "true") && (Za = el, Sc = v, Bu = null);
            break;
          case "focusout":
            Bu = Sc = Za = null;
            break;
          case "mousedown":
            bc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            bc = !1, pr(x, e, b);
            break;
          case "selectionchange":
            if (Sv) break;
          case "keydown":
          case "keyup":
            pr(x, e, b);
        }
        var U;
        if (mc)
          l: {
            switch (l) {
              case "compositionstart":
                var G = "onCompositionStart";
                break l;
              case "compositionend":
                G = "onCompositionEnd";
                break l;
              case "compositionupdate":
                G = "onCompositionUpdate";
                break l;
            }
            G = void 0;
          }
        else
          Va ? hr(l, e) && (G = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (G = "onCompositionStart");
        G && (or && e.locale !== "ko" && (Va || G !== "onCompositionStart" ? G === "onCompositionEnd" && Va && (U = ir()) : (Ce = b, fc = "value" in Ce ? Ce.value : Ce.textContent, Va = !0)), el = Bi(v, G), 0 < el.length && (G = new sr(
          G,
          l,
          null,
          e,
          b
        ), x.push({ event: G, listeners: el }), U ? G.data = U : (U = vr(e), U !== null && (G.data = U)))), (U = fv ? sv(l, e) : rv(l, e)) && (G = Bi(v, "onBeforeInput"), 0 < G.length && (el = new sr(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          b
        ), x.push({
          event: el,
          listeners: G
        }), el.data = U)), f0(
          x,
          l,
          v,
          e,
          b
        );
      }
      nm(x, t);
    });
  }
  function rn(l, t, e) {
    return {
      instance: l,
      listener: t,
      currentTarget: e
    };
  }
  function Bi(l, t) {
    for (var e = t + "Capture", a = []; l !== null; ) {
      var u = l, n = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || n === null || (u = Du(l, e), u != null && a.unshift(
        rn(l, u, n)
      ), u = Du(l, t), u != null && a.push(
        rn(l, u, n)
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
      var f = e, s = f.alternate, v = f.stateNode;
      if (f = f.tag, s !== null && s === a) break;
      f !== 5 && f !== 26 && f !== 27 || v === null || (s = v, u ? (v = Du(e, n), v != null && i.unshift(
        rn(e, v, s)
      )) : u || (v = Du(e, n), v != null && i.push(
        rn(e, v, s)
      ))), e = e.return;
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var m0 = /\r\n?/g, h0 = /\u0000|\uFFFD/g;
  function fm(l) {
    return (typeof l == "string" ? l : "" + l).replace(m0, `
`).replace(h0, "");
  }
  function sm(l, t) {
    return t = fm(t), fm(l) === t;
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
            throw Error(g(61));
          if (e = a.__html, e != null) {
            if (u.children != null) throw Error(g(60));
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
    fl = !0;
  }
  function es(l, t, e, a, u, n) {
    switch (e) {
      case "style":
        ar(l, a, n);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(g(61));
          if (e = a.__html, e != null) {
            if (u.children != null) throw Error(g(60));
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
        if (!Js.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (u = e.endsWith("Capture"), n = e.slice(2, u ? e.length - 7 : void 0), t = l[vt] || null, t = t != null ? t[e] : null, typeof t == "function" && l.removeEventListener(n, t, u), typeof a == "function")) {
              typeof t != "function" && t !== null && (e in l ? l[e] = null : l.hasAttribute(e) && l.removeAttribute(e)), l.addEventListener(n, a, u);
              break l;
            }
            fl = !0, e in l ? l[e] = a : a === !0 ? l.setAttribute(e, "") : Dn(l, e, a);
          }
        return;
    }
    fl = !0;
  }
  function lt(l, t, e) {
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
                  throw Error(g(137, t));
                default:
                  Sl(l, t, n, i, e, null);
              }
          }
        u && Sl(l, t, "srcSet", e.srcSet, e, null), a && Sl(l, t, "src", e.src, e, null);
        return;
      case "input":
        I("invalid", l);
        var f = n = i = u = null, s = null, v = null;
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
                  s = b;
                  break;
                case "defaultChecked":
                  v = b;
                  break;
                case "value":
                  n = b;
                  break;
                case "defaultValue":
                  f = b;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (b != null)
                    throw Error(g(137, t));
                  break;
                default:
                  Sl(l, t, a, b, e, null);
              }
          }
        Ps(
          l,
          n,
          f,
          s,
          v,
          i,
          u,
          !1
        );
        return;
      case "select":
        I("invalid", l), a = i = n = null;
        for (u in e)
          if (e.hasOwnProperty(u) && (f = e[u], f != null))
            switch (u) {
              case "value":
                n = f;
                break;
              case "defaultValue":
                i = f;
                break;
              case "multiple":
                a = f;
              default:
                Sl(l, t, u, f, e, null);
            }
        t = n, e = i, l.multiple = !!a, t != null ? Ba(l, !!a, t, !1) : e != null && Ba(l, !!a, e, !0);
        return;
      case "textarea":
        I("invalid", l), n = u = a = null;
        for (i in e)
          if (e.hasOwnProperty(i) && (f = e[i], f != null))
            switch (i) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                u = f;
                break;
              case "children":
                n = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(g(91));
                break;
              default:
                Sl(l, t, i, f, e, null);
            }
        tr(l, a, u, n);
        return;
      case "option":
        for (s in e)
          e.hasOwnProperty(s) && (a = e[s], a != null) && (s === "selected" ? l.selected = a && typeof a != "function" && typeof a != "symbol" : Sl(l, t, s, a, e, null));
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
        for (a = 0; a < sn.length; a++)
          I(sn[a], l);
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
                throw Error(g(137, t));
              default:
                Sl(l, t, v, a, e, null);
            }
        return;
      default:
        if (ac(t)) {
          for (b in e)
            e.hasOwnProperty(b) && (a = e[b], a !== void 0 && es(
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
    for (f in e)
      e.hasOwnProperty(f) && (a = e[f], a != null && Sl(l, t, f, a, e, null));
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
        var u = null, n = null, i = null, f = null, s = null, v = null, b = null;
        for (S in e) {
          var x = e[S];
          if (e.hasOwnProperty(S) && x != null)
            switch (S) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                s = x;
              default:
                a.hasOwnProperty(S) || Sl(l, t, S, null, a, x);
            }
        }
        for (var m in a) {
          var S = a[m];
          if (x = e[m], a.hasOwnProperty(m) && (S != null || x != null))
            switch (m) {
              case "type":
                S !== x && (fl = !0), n = S;
                break;
              case "name":
                S !== x && (fl = !0), u = S;
                break;
              case "checked":
                S !== x && (fl = !0), v = S;
                break;
              case "defaultChecked":
                S !== x && (fl = !0), b = S;
                break;
              case "value":
                S !== x && (fl = !0), i = S;
                break;
              case "defaultValue":
                S !== x && (fl = !0), f = S;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null)
                  throw Error(g(137, t));
                break;
              default:
                S !== x && Sl(
                  l,
                  t,
                  m,
                  S,
                  a,
                  x
                );
            }
        }
        tc(
          l,
          i,
          f,
          s,
          v,
          b,
          n,
          u
        );
        return;
      case "select":
        S = i = f = m = null;
        for (n in e)
          if (s = e[n], e.hasOwnProperty(n) && s != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                S = s;
              default:
                a.hasOwnProperty(n) || Sl(
                  l,
                  t,
                  n,
                  null,
                  a,
                  s
                );
            }
        for (u in a)
          if (n = a[u], s = e[u], a.hasOwnProperty(u) && (n != null || s != null))
            switch (u) {
              case "value":
                n !== s && (fl = !0), m = n;
                break;
              case "defaultValue":
                n !== s && (fl = !0), f = n;
                break;
              case "multiple":
                n !== s && (fl = !0), i = n;
              default:
                n !== s && Sl(
                  l,
                  t,
                  u,
                  n,
                  a,
                  s
                );
            }
        t = f, e = i, a = S, m != null ? Ba(l, !!e, m, !1) : !!a != !!e && (t != null ? Ba(l, !!e, t, !0) : Ba(l, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        S = m = null;
        for (f in e)
          if (u = e[f], e.hasOwnProperty(f) && u != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                Sl(l, t, f, null, a, u);
            }
        for (i in a)
          if (u = a[i], n = e[i], a.hasOwnProperty(i) && (u != null || n != null))
            switch (i) {
              case "value":
                u !== n && (fl = !0), m = u;
                break;
              case "defaultValue":
                u !== n && (fl = !0), S = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(g(91));
                break;
              default:
                u !== n && Sl(l, t, i, u, a, n);
            }
        lr(l, m, S);
        return;
      case "option":
        for (var _ in e)
          m = e[_], e.hasOwnProperty(_) && m != null && !a.hasOwnProperty(_) && (_ === "selected" ? l.selected = !1 : Sl(
            l,
            t,
            _,
            null,
            a,
            m
          ));
        for (s in a)
          m = a[s], S = e[s], a.hasOwnProperty(s) && m !== S && (m != null || S != null) && (s === "selected" ? (m !== S && (fl = !0), l.selected = m && typeof m != "function" && typeof m != "symbol") : Sl(
            l,
            t,
            s,
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
                  throw Error(g(137, t));
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
            m = e[K], e.hasOwnProperty(K) && m !== void 0 && !a.hasOwnProperty(K) && es(
              l,
              t,
              K,
              void 0,
              a,
              m
            );
          for (b in a)
            m = a[b], S = e[b], !a.hasOwnProperty(b) || m === S || m === void 0 && S === void 0 || es(
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
    for (x in a)
      m = a[x], S = e[x], !a.hasOwnProperty(x) || m === S || m == null && S == null || Sl(l, t, x, m, a, S);
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
        var u = e[a], n = u.transferSize, i = u.initiatorType, f = u.duration;
        if (n && f && rm(i)) {
          for (i = 0, f = u.responseEnd, a += 1; a < e.length; a++) {
            var s = e[a], v = s.startTime;
            if (v > f) break;
            var b = s.transferSize, x = s.initiatorType;
            b && rm(x) && (s = s.responseEnd, i += b * (s < f ? 1 : (f - v) / (s - v)));
          }
          if (--a, t += 8 * (n + i) / (u.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var as = null, us = null;
  function on(l) {
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
    return e = on(
      e
    ).createElement(l), e[$l] = a, e[vt] = t, lt(e, l, t), Kl(e), e;
  }
  function ns(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var is = null;
  function S0() {
    var l = window.event;
    return l && l.type === "popstate" ? l === is ? !1 : (is = l, !0) : (is = null, !1);
  }
  var cs = typeof setTimeout == "function" ? setTimeout : void 0, b0 = typeof clearTimeout == "function" ? clearTimeout : void 0, hm = typeof Promise == "function" ? Promise : void 0, vm = typeof requestAnimationFrame == "function" ? requestAnimationFrame : cs, T0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof hm < "u" ? function(l) {
    return hm.resolve(null).then(l).catch(j0);
  } : cs;
  function j0(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Ie(l) {
    return l === "head";
  }
  function ym(l, t) {
    var e = t, a = 0;
    do {
      var u = e.nextSibling;
      if (l.removeChild(e), u && u.nodeType === 8)
        if (e = u.data, e === "/$" || e === "/&") {
          if (a === 0) {
            l.removeChild(u), xu(t);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          vs(
            l.ownerDocument.documentElement
          );
        else if (e === "head") {
          e = l.ownerDocument.head, vs(e);
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling, f = n.nodeName;
            n[Ou] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && n.rel.toLowerCase() === "stylesheet" || e.removeChild(n), n = i;
          }
        } else
          e === "body" && vs(l.ownerDocument.body);
      e = u;
    } while (e);
    xu(t);
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
  function x0(l, t, e) {
    return e = e.ownerDocument.defaultView, {
      rect: l,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= l.bottom && 0 <= l.right && l.top <= e.innerHeight && l.left <= e.innerWidth
    };
  }
  function fs(l) {
    var t = l.getBoundingClientRect(), e = getComputedStyle(l);
    return x0(t, e, l);
  }
  function E0(l) {
    return l.documentElement.clientHeight;
  }
  function N0(l) {
    this.addEventListener("load", l), this.addEventListener("error", l);
  }
  function _0(l, t, e, a, u, n, i, f, s) {
    var v = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var b = v.startViewTransition({
        update: function() {
          var m = v.defaultView, S = m.navigation && m.navigation.transition, _ = v.fonts.status;
          a();
          var D = [];
          if (_ === "loaded" && (E0(v), v.fonts.status === "loading" && D.push(v.fonts.ready)), _ = D.length, l !== null)
            for (var K = l.suspenseyImages, h = 0, r = 0; r < K.length; r++) {
              var y = K[r];
              if (!y.complete) {
                var j = y.getBoundingClientRect();
                if (0 < j.bottom && 0 < j.right && j.top < m.innerHeight && j.left < m.innerWidth) {
                  if (h += Xm(y), h > Qi) {
                    D.length = _;
                    break;
                  }
                  y = new Promise(
                    N0.bind(y)
                  ), D.push(y);
                }
              }
            }
          if (0 < D.length)
            return m = Promise.race([
              Promise.all(D),
              new Promise(function(A) {
                return setTimeout(A, 500);
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
      var x = [];
      return b.ready.then(
        function() {
          for (var m = v.documentElement.getAnimations({
            subtree: !0
          }), S = 0; S < m.length; S++) {
            var _ = m[S], D = _.effect, K = D.pseudoElement;
            if (K != null && K.startsWith("::view-transition")) {
              x.push(_), _ = D.getKeyframes();
              for (var h = K = void 0, r = !0, y = 0; y < _.length; y++) {
                var j = _[y], A = j.width;
                if (K === void 0) K = A;
                else if (K !== A) {
                  r = !1;
                  break;
                }
                if (A = j.height, h === void 0) h = A;
                else if (h !== A) {
                  r = !1;
                  break;
                }
                delete j.width, delete j.height, j.transform === "none" && delete j.transform;
              }
              r && K !== void 0 && h !== void 0 && (D.setKeyframes(_), r = getComputedStyle(
                D.target,
                D.pseudoElement
              ), r.width !== K || r.height !== h) && (r = _[0], r.width = K, r.height = h, r = _[_.length - 1], r.width = K, r.height = h, D.setKeyframes(_));
            }
          }
          i();
        },
        function(m) {
          v.__reactViewTransition === b && (v.__reactViewTransition = null);
          try {
            typeof m == "object" && m !== null && m.name === "InvalidStateError" && (m.message === "View transition was skipped because document visibility state is hidden." || m.message === "Skipping view transition because document visibility state has become hidden." || m.message === "Skipping view transition because viewport size changed." || m.message === "Transition was aborted because of invalid state") && (m = null), m !== null && s(m);
          } finally {
            a(), u(), i();
          }
        }
      ), b.finished.finally(function() {
        for (var m = 0; m < x.length; m++)
          x[m].cancel();
        v.__reactViewTransition === b && (v.__reactViewTransition = null), f();
      }), b;
    } catch {
      return a(), u(), i(), null;
    }
  }
  function Oa(l, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + l + "(" + t + ")";
  }
  Oa.prototype.animate = function(l, t) {
    return t = typeof t == "number" ? { duration: t } : J({}, t), t.pseudoElement = this._selector, this._scope.animate(l, t);
  }, Oa.prototype.getAnimations = function() {
    for (var l = this._scope, t = this._selector, e = l.getAnimations({ subtree: !0 }), a = [], u = 0; u < e.length; u++) {
      var n = e[u].effect;
      n !== null && n.target === l && n.pseudoElement === t && a.push(e[u]);
    }
    return a;
  }, Oa.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Tm(l) {
    return {
      name: l,
      group: new Oa("group", l),
      imagePair: new Oa("image-pair", l),
      old: new Oa("old", l),
      new: new Oa("new", l)
    };
  }
  function Ht(l) {
    this._fragmentFiber = l, this._observers = this._eventListeners = null;
  }
  Ht.prototype.addEventListener = function(l, t, e) {
    var a = null, u = null;
    if (!(e != null && typeof e != "boolean" && (a = e.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var n = this._eventListeners;
      if (xm(n, l, t, e) === -1) {
        var i = this, f = t;
        e != null && typeof e != "boolean" && e.once === !0 && (f = function(s) {
          i.removeEventListener(
            l,
            t,
            e
          ), typeof t == "function" ? t.call(this, s) : t.handleEvent(s);
        }), a !== null && (u = i.removeEventListener.bind(
          i,
          l,
          t,
          e
        ), a.addEventListener("abort", u, { once: !0 }), u = a.removeEventListener.bind(a, "abort", u)), a = yu(e), n.push({
          type: l,
          listener: t,
          optionsOrUseCapture: e,
          attachedListener: f,
          cleanup: u
        }), T(
          this._fragmentFiber.child,
          !1,
          z0,
          l,
          f,
          a
        );
      }
      this._eventListeners = n;
    }
  };
  function z0(l, t, e, a) {
    return sl(l).addEventListener(
      t,
      e,
      a
    ), !1;
  }
  Ht.prototype.removeEventListener = function(l, t, e) {
    var a = this._eventListeners;
    if (a !== null && (t = xm(
      a,
      l,
      t,
      e
    ), t !== -1)) {
      var u = a[t];
      e = u.attachedListener;
      var n = u.cleanup;
      u = yu(u.optionsOrUseCapture), T(
        this._fragmentFiber.child,
        !1,
        p0,
        l,
        e,
        u
      ), a.splice(t, 1), n !== null && n();
    }
  };
  function p0(l, t, e, a) {
    return sl(l).removeEventListener(
      t,
      e,
      a
    ), !1;
  }
  function yu(l) {
    return l != null && typeof l != "boolean" && (l.once === !0 || l.signal instanceof AbortSignal) ? { capture: l.capture, passive: l.passive } : l;
  }
  function jm(l) {
    return l == null ? "c=0" : typeof l == "boolean" ? "c=" + (l ? "1" : "0") : "c=" + (l.capture ? "1" : "0");
  }
  function xm(l, t, e, a) {
    if (l.length === 0) return -1;
    a = jm(a);
    for (var u = 0; u < l.length; u++) {
      var n = l[u];
      if (n.type === t && n.listener === e && jm(n.optionsOrUseCapture) === a)
        return u;
    }
    return -1;
  }
  Ht.prototype.dispatchEvent = function(l) {
    var t = q(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = sl(t);
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
  }, Ht.prototype.focus = function(l) {
    T(
      this._fragmentFiber.child,
      !0,
      Em,
      l,
      void 0,
      void 0
    );
  };
  function Em(l, t) {
    return l.tag === 6 ? !1 : (l = sl(l), G0(l, t));
  }
  Ht.prototype.focusLast = function(l) {
    var t = [];
    T(
      this._fragmentFiber.child,
      !0,
      ss,
      t,
      void 0,
      void 0
    );
    for (var e = t.length - 1; 0 <= e && !Em(t[e], l); e--) ;
  };
  function ss(l, t) {
    return t.push(l), !1;
  }
  Ht.prototype.blur = function() {
    var l = q(
      this._fragmentFiber
    );
    l !== null && (l = sl(l), l = on(l).activeElement, l !== null && T(
      this._fragmentFiber.child,
      !1,
      O0,
      l,
      void 0,
      void 0
    ));
  };
  function O0(l, t) {
    return l.tag === 6 ? !1 : (l = sl(l), l === t || l.contains(t) ? (t.blur(), !0) : !1);
  }
  Ht.prototype.observeUsing = function(l) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(l), T(
      this._fragmentFiber.child,
      !1,
      A0,
      l,
      void 0,
      void 0
    );
  };
  function A0(l, t) {
    return l.tag === 6 || (l = sl(l), t.observe(l)), !1;
  }
  Ht.prototype.unobserveUsing = function(l) {
    var t = this._observers;
    if (t !== null && t.has(l)) {
      t.delete(l), T(
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
    return l.tag === 6 || (l = sl(l), t.unobserve(l)), !1;
  }
  var Pt = [], rs = !1;
  function M0(l, t, e) {
    Pt.push({
      fragmentInstance: l,
      observer: t,
      instance: e
    }), rs || (rs = !0, X0(function() {
      rs = !1;
      var a = Pt;
      Pt = [];
      for (var u = 0; u < a.length; u++) {
        var n = a[u];
        n.observer.unobserve(n.instance);
      }
    }));
  }
  Ht.prototype.getClientRects = function() {
    var l = [];
    return T(
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
      l = sl(l), t.push.apply(t, l.getClientRects());
    return !1;
  }
  Ht.prototype.getRootNode = function(l) {
    var t = q(
      this._fragmentFiber
    );
    return t === null ? this : sl(t).getRootNode(l);
  }, Ht.prototype.compareDocumentPosition = function(l) {
    var t = q(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var e = [];
    T(
      this._fragmentFiber.child,
      !1,
      ss,
      e,
      void 0,
      void 0
    );
    var a = sl(t);
    if (e.length === 0) {
      if (e = a, Cl(this._fragmentFiber)) {
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
      return e === l ? u = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (e = Hl(t)[1], e === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (l = sl(e).compareDocumentPosition(
        l
      ), u = l === 0 || l & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = sl(e[0]), u = sl(e[e.length - 1]);
    var n = Cl(this._fragmentFiber) ? t.parentElement : a;
    if (n == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, n = n.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var i = t.compareDocumentPosition(l), f = u.compareDocumentPosition(l), s = i & Node.DOCUMENT_POSITION_CONTAINED_BY || f & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return f = a && n && i & Node.DOCUMENT_POSITION_FOLLOWING && f & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === l || n && u === l || s || f ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === l || !n && u === l ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : i, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || R0(
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
        for (n = t, t = q(t); n !== null; ) {
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
    return l & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!n) && !(t = n === e) && (t = ol(
      e,
      n,
      at
    ), t === null ? t = !1 : (T(
      t,
      !0,
      me,
      n,
      e
    ), n = et, et = null, t = n !== null)), t) : l & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!n) && !(t = n === a) && (t = ol(
      a,
      n,
      at
    ), t === null ? t = !1 : (T(
      t,
      !0,
      ql,
      n,
      a
    ), n = et, _l = et = null, t = n !== null)), t) : !1;
  }
  function Nm(l, t) {
    var e = l.ownerDocument.createRange();
    e.selectNodeContents(l), l = e.getBoundingClientRect(), window.scrollTo(
      window.scrollX + l.left,
      t ? window.scrollY + l.top : window.scrollY + l.bottom - window.innerHeight
    );
  }
  Ht.prototype.scrollIntoView = function(l) {
    if (typeof l == "object") throw Error(g(566));
    var t = [];
    T(
      this._fragmentFiber.child,
      !1,
      ss,
      t,
      void 0,
      void 0
    );
    var e = l !== !1;
    if (t.length === 0) {
      var a = Hl(
        this._fragmentFiber
      );
      if (a = e ? a[1] || a[0] || q(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        l = sl(a), Nm(l, e);
        return;
      }
      if (a = sl(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          e = "host" in a ? a.host : null, e !== null && e.scrollIntoView(l);
          return;
        }
        a.scrollIntoView(l);
      }
    }
    for (a = e ? t.length - 1 : 0; a !== (e ? -1 : t.length); ) {
      var u = t[a];
      u.tag === 6 ? (u = sl(u), Nm(u, e)) : sl(u).scrollIntoView(l), a += e ? -1 : 1;
    }
  };
  function U0(l, t) {
    return l = sl(l), _m(l, t), !1;
  }
  function _m(l, t) {
    l.reactFragments == null && (l.reactFragments = /* @__PURE__ */ new Set()), l.reactFragments.add(t);
  }
  function zm(l, t) {
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
      for (var i = 0, f = 0; f < Pt.length; f++) {
        var s = Pt[f];
        (s.fragmentInstance !== t || s.observer !== n || s.instance !== l) && (Pt[i++] = s);
      }
      Pt.length = i, n.observe(l);
    }), _m(l, t));
  }
  function H0(l, t) {
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
  function os(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          os(e), An(e);
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
  function q0(l, t, e, a) {
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
      if (l = Kt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Y0(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = Kt(l.nextSibling), l === null)) return null;
    return l;
  }
  function pm(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = Kt(l.nextSibling), l === null)) return null;
    return l;
  }
  function ds(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function ms(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function B0(l, t) {
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
  function Kt(l) {
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
  var hs = null;
  function Om(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "/$" || e === "/&") {
          if (t === 0)
            return Kt(l.nextSibling);
          t--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Am(l) {
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
  function X0(l) {
    vm(function() {
      vm(function(t) {
        return l(t);
      });
    });
  }
  function Dm(l, t, e) {
    switch (t = on(e), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(g(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(g(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(g(454));
        return l;
      default:
        throw Error(g(451));
    }
  }
  function Mm(l, t, e) {
    for (var a in e) {
      var u = e[a];
      e.hasOwnProperty(a) && u != null && Sl(l, t, a, null, v0, u);
    }
    e.dangerouslySetInnerHTML != null && (l.textContent = ""), l.onclick === ee && (l.onclick = null), An(l);
  }
  function vs(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    An(l);
  }
  var wt = /* @__PURE__ */ new Map(), Cm = /* @__PURE__ */ new Set();
  function dn(l) {
    if (typeof l.getRootNode == "function") {
      var t = l.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Oe = B.d;
  B.d = {
    f: Q0,
    r: V0,
    D: Z0,
    C: L0,
    L: K0,
    m: w0,
    X: F0,
    S: J0,
    M: $0
  };
  function Q0() {
    var l = Oe.f(), t = Ci();
    return l || t;
  }
  function V0(l) {
    var t = Ha(l);
    t !== null && t.tag === 5 && t.type === "form" ? Uo(t) : Oe.r(l);
  }
  var gu = typeof document > "u" ? null : document;
  function Rm(l, t, e) {
    var a = gu;
    if (a && typeof t == "string" && t) {
      var u = Bt(t);
      u = 'link[rel="' + l + '"][href="' + u + '"]', typeof e == "string" && (u += '[crossorigin="' + e + '"]'), Cm.has(u) || (Cm.add(u), l = { rel: l, crossOrigin: e, href: t }, a.querySelector(u) === null && (t = a.createElement("link"), lt(t, "link", l), Kl(t), a.head.appendChild(t)));
    }
  }
  function Z0(l) {
    Oe.D(l), Rm("dns-prefetch", l, null);
  }
  function L0(l, t) {
    Oe.C(l, t), Rm("preconnect", l, t);
  }
  function K0(l, t, e) {
    Oe.L(l, t, e);
    var a = gu;
    if (a && l && t) {
      var u = 'link[rel="preload"][as="' + Bt(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (u += '[imagesrcset="' + Bt(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (u += '[imagesizes="' + Bt(
        e.imageSizes
      ) + '"]')) : u += '[href="' + Bt(l) + '"]';
      var n = u;
      switch (t) {
        case "style":
          n = Su(l);
          break;
        case "script":
          n = bu(l);
      }
      if (!(wt.has(n) || (l = J(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), wt.set(n, l), a.querySelector(u) !== null || t === "style" && a.querySelector(mn(n)) || t === "script" && a.querySelector(hn(n))))) {
        var i = a.createElement("link");
        lt(i, "link", l), t === "style" && (i[On] = !0, i.onload = i.onerror = function() {
          Ks(i);
        }), Kl(i), a.head.appendChild(i);
      }
    }
  }
  function w0(l, t) {
    Oe.m(l, t);
    var e = gu;
    if (e && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + Bt(a) + '"][href="' + Bt(l) + '"]', n = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = bu(l);
      }
      if (!wt.has(n) && (l = J({ rel: "modulepreload", href: l }, t), wt.set(n, l), e.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(hn(n)))
              return;
        }
        a = e.createElement("link"), lt(a, "link", l), Kl(a), e.head.appendChild(a);
      }
    }
  }
  function J0(l, t, e) {
    Oe.S(l, t, e);
    var a = gu;
    if (a && l) {
      var u = qa(a).hoistableStyles, n = Su(l);
      t = t || "default";
      var i = u.get(n);
      if (!i) {
        var f = { loading: 0, preload: null };
        if (i = a.querySelector(
          mn(n)
        ))
          f.loading = 5;
        else {
          l = J(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = wt.get(n)) && ys(l, e);
          var s = i = a.createElement("link");
          Kl(s), lt(s, "link", l), s._p = new Promise(function(v, b) {
            s.onload = v, s.onerror = b;
          }), s.addEventListener("load", function() {
            f.loading |= 1;
          }), s.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Gi(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: f
        }, u.set(n, i);
      }
    }
  }
  function F0(l, t) {
    Oe.X(l, t);
    var e = gu;
    if (e && l) {
      var a = qa(e).hoistableScripts, u = bu(l), n = a.get(u);
      n || (n = e.querySelector(hn(u)), n || (l = J({ src: l, async: !0 }, t), (t = wt.get(u)) && gs(l, t), n = e.createElement("script"), Kl(n), lt(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function $0(l, t) {
    Oe.M(l, t);
    var e = gu;
    if (e && l) {
      var a = qa(e).hoistableScripts, u = bu(l), n = a.get(u);
      n || (n = e.querySelector(hn(u)), n || (l = J({ src: l, async: !0, type: "module" }, t), (t = wt.get(u)) && gs(l, t), n = e.createElement("script"), Kl(n), lt(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function Um(l, t, e, a) {
    var u = (u = te.current) ? dn(u) : null;
    if (!u) throw Error(g(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (e = Su(e.href), t = qa(
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
          var n = qa(
            u
          ).hoistableStyles, i = n.get(l);
          if (i || (u = u.ownerDocument || u, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, i), (n = u.querySelector(
            mn(l)
          )) ? n._p || (i.instance = n, i.state.loading = 5) : (n = wt.get(l), n || (n = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, wt.set(l, n)), W0(
            u,
            l,
            n,
            i.state
          ))), t && a === null)
            throw Error(g(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(g(529, ""));
        return null;
      case "script":
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (e = bu(e), t = qa(
          u
        ).hoistableScripts, a = t.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(g(444, l));
    }
  }
  function Su(l) {
    return 'href="' + Bt(l) + '"';
  }
  function mn(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function Hm(l) {
    return J({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function W0(l, t, e, a) {
    if (t = l.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[On] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = l.createElement("link"), t[On] = !0, t.onload = t.onerror = Ks.bind(null, t), lt(t, "link", e), Kl(t), l.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function bu(l) {
    return '[src="' + Bt(l) + '"]';
  }
  function hn(l) {
    return "script[async]" + l;
  }
  function qm(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + Bt(e.href) + '"]'
          );
          if (a)
            return t.instance = a, Kl(a), a;
          var u = J({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), Kl(a), lt(a, "style", u), Gi(a, e.precedence, l), t.instance = a;
        case "stylesheet":
          u = Su(e.href);
          var n = l.querySelector(
            mn(u)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Kl(n), n;
          a = Hm(e), (u = wt.get(u)) && ys(a, u), n = (l.ownerDocument || l).createElement("link"), Kl(n);
          var i = n;
          return i._p = new Promise(function(f, s) {
            i.onload = f, i.onerror = s;
          }), lt(n, "link", a), t.state.loading |= 4, Gi(n, e.precedence, l), t.instance = n;
        case "script":
          return n = bu(e.src), (u = l.querySelector(
            hn(n)
          )) ? (t.instance = u, Kl(u), u) : (a = e, (u = wt.get(n)) && (a = J({}, e), gs(a, u)), l = l.ownerDocument || l, u = l.createElement("script"), Kl(u), lt(u, "link", a), l.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(g(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Gi(a, e.precedence, l));
    return t.instance;
  }
  function Gi(l, t, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = a.length ? a[a.length - 1] : null, n = u, i = 0; i < a.length; i++) {
      var f = a[i];
      if (f.dataset.precedence === t) n = f;
      else if (n !== u) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(l, t.firstChild));
  }
  function ys(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function gs(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Xi = null;
  function Ym(l, t, e) {
    if (Xi === null) {
      var a = /* @__PURE__ */ new Map(), u = Xi = /* @__PURE__ */ new Map();
      u.set(e, a);
    } else
      u = Xi, a = u.get(e), a || (a = /* @__PURE__ */ new Map(), u.set(e, a));
    if (a.has(l)) return a;
    for (a.set(l, null), e = e.getElementsByTagName(l), u = 0; u < e.length; u++) {
      var n = e[u];
      if (!(n[Ou] || n[$l] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = n.getAttribute(t) || "";
        i = l + i;
        var f = a.get(i);
        f ? f.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function Ss(l, t, e) {
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
  function Bm(l, t) {
    return l === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function Gm(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function Xm(l) {
    return (l.width || 100) * (l.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Qm(l, t) {
    typeof t.decode == "function" && (l.imgCount++, t.complete || (l.imgBytes += Xm(t), l.suspenseyImages.push(t)), l = ly.bind(l), t.decode().then(l, l));
  }
  function I0(l, t, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var u = Su(a.href), n = t.querySelector(
          mn(u)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = vn.bind(l), t.then(l, l)), e.state.loading |= 4, e.instance = n, Kl(n);
          return;
        }
        n = t.ownerDocument || t, a = Hm(a), (u = wt.get(u)) && ys(a, u), n = n.createElement("link"), Kl(n);
        var i = n;
        i._p = new Promise(function(f, s) {
          i.onload = f, i.onerror = s;
        }), lt(n, "link", a), e.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (l.count++, e = vn.bind(l), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  var Qi = 0;
  function P0(l, t) {
    return l.stylesheets && l.count === 0 && Zi(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (l.stylesheets && Zi(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && Qi === 0 && (Qi = 62500 * g0());
      var u = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Zi(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > Qi ? 50 : 800) + t
      );
      return l.unsuspend = e, function() {
        l.unsuspend = null, clearTimeout(a), clearTimeout(u);
      };
    } : null;
  }
  function Vm(l) {
    if (l.count === 0 && (l.imgCount === 0 || !l.waitingForImages)) {
      if (l.stylesheets) Zi(l, l.stylesheets);
      else if (l.unsuspend) {
        var t = l.unsuspend;
        l.unsuspend = null, t();
      }
    }
  }
  function vn() {
    this.count--, Vm(this);
  }
  function ly() {
    this.imgCount--, Vm(this);
  }
  var Vi = null;
  function Zi(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Vi = /* @__PURE__ */ new Map(), t.forEach(ty, l), Vi = null, vn.call(l));
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
      u = t.instance, i = u.getAttribute("data-precedence"), n = e.get(i) || a, n === a && e.set(null, u), e.set(i, u), this.count++, a = vn.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), n ? n.parentNode.insertBefore(u, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(u, l.firstChild)), t.state.loading |= 4;
    }
  }
  var Tu = {
    $$typeof: ml,
    Provider: null,
    Consumer: null,
    _currentValue: Et,
    _currentValue2: Et,
    _threadCount: 0
  };
  function ey(l, t, e, a, u, n, i, f, s) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ki(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ki(0), this.hiddenUpdates = ki(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = n, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = s, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Zm(l, t, e, a, u, n, i, f, s, v, b, x) {
    return l = new ey(
      l,
      t,
      e,
      i,
      s,
      v,
      b,
      x,
      f
    ), t = 1, n === !0 && (t |= 24), n = yt(3, null, null, t), l.current = n, n.stateNode = l, t = Cc(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: t
    }, qc(n), l;
  }
  function Lm(l) {
    return l ? (l = wa, l) : wa;
  }
  function Km(l, t, e, a, u, n) {
    u = Lm(u), a.context === null ? a.context = u : a.pendingContext = u, a = Xe(t), a.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (a.callback = n), e = Qe(l, a, t), e !== null && (Tt(e, l, t), Ku(e, l, t));
  }
  function wm(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function bs(l, t) {
    wm(l, t), (l = l.alternate) && wm(l, t);
  }
  function Jm(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = oa(l, 67108864);
      t !== null && Tt(t, l, 67108864), bs(l, 67108864);
    }
  }
  function Fm(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Ut();
      t = Ii(t);
      var e = oa(l, t);
      e !== null && Tt(e, l, t), bs(l, t);
    }
  }
  var ju = !0;
  function ay(l, t, e, a) {
    var u = p.T;
    p.T = null;
    var n = B.p;
    try {
      B.p = 2, Ts(l, t, e, a);
    } finally {
      B.p = n, p.T = u;
    }
  }
  function uy(l, t, e, a) {
    var u = p.T;
    p.T = null;
    var n = B.p;
    try {
      B.p = 8, Ts(l, t, e, a);
    } finally {
      B.p = n, p.T = u;
    }
  }
  function Ts(l, t, e, a) {
    if (ju) {
      var u = js(a);
      if (u === null)
        ts(
          l,
          t,
          a,
          Li,
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
          var n = Ha(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var i = ia(n.pendingLanes);
                  if (i !== 0) {
                    var f = n;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; i; ) {
                      var s = 1 << 31 - pt(i);
                      f.entanglements[1] |= s, i &= ~s;
                    }
                    de(n), (rl & 6) === 0 && (Ai = _t() + 500, fn(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = oa(n, 2), f !== null && Tt(f, n, 2), Ci(), bs(n, 2);
            }
          if (n = js(a), n === null && ts(
            l,
            t,
            a,
            Li,
            e
          ), n === u) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else
        ts(
          l,
          t,
          a,
          null,
          e
        );
    }
  }
  function js(l) {
    return l = nc(l), xs(l);
  }
  var Li = null;
  function xs(l) {
    if (Li = null, l = ca(l), l !== null) {
      var t = w(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = al(t), l !== null) return l;
          l = null;
        } else if (e === 31) {
          if (l = Tl(t), l !== null) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Li = l, null;
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
          case Rs:
            return 2;
          case Us:
            return 8;
          case En:
          case Sh:
            return 32;
          case Hs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Es = !1, Pe = null, la = null, ta = null, yn = /* @__PURE__ */ new Map(), gn = /* @__PURE__ */ new Map(), ea = [], ny = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Wm(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        Pe = null;
        break;
      case "dragenter":
      case "dragleave":
        la = null;
        break;
      case "mouseover":
      case "mouseout":
        ta = null;
        break;
      case "pointerover":
      case "pointerout":
        yn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        gn.delete(t.pointerId);
    }
  }
  function Sn(l, t, e, a, u, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: n,
      targetContainers: [u]
    }, t !== null && (t = Ha(t), t !== null && Jm(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), l);
  }
  function iy(l, t, e, a, u) {
    switch (t) {
      case "focusin":
        return Pe = Sn(
          Pe,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "dragenter":
        return la = Sn(
          la,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "mouseover":
        return ta = Sn(
          ta,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "pointerover":
        var n = u.pointerId;
        return yn.set(
          n,
          Sn(
            yn.get(n) || null,
            l,
            t,
            e,
            a,
            u
          )
        ), !0;
      case "gotpointercapture":
        return n = u.pointerId, gn.set(
          n,
          Sn(
            gn.get(n) || null,
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
      var e = w(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = al(e), t !== null) {
            l.blockedOn = t, Vs(l.priority, function() {
              Fm(e);
            });
            return;
          }
        } else if (t === 31) {
          if (t = Tl(e), t !== null) {
            l.blockedOn = t, Vs(l.priority, function() {
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
  function Ki(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = js(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        uc = a, e.target.dispatchEvent(a), uc = null;
      } else
        return t = Ha(e), t !== null && Jm(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function Im(l, t, e) {
    Ki(l) && e.delete(t);
  }
  function cy() {
    Es = !1, Pe !== null && Ki(Pe) && (Pe = null), la !== null && Ki(la) && (la = null), ta !== null && Ki(ta) && (ta = null), yn.forEach(Im), gn.forEach(Im);
  }
  function wi(l, t) {
    l.blockedOn === t && (l.blockedOn = null, Es || (Es = !0, N.unstable_scheduleCallback(
      N.unstable_NormalPriority,
      cy
    )));
  }
  var Ji = null;
  function Pm(l) {
    Ji !== l && (Ji = l, N.unstable_scheduleCallback(
      N.unstable_NormalPriority,
      function() {
        Ji === l && (Ji = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t], a = l[t + 1], u = l[t + 2];
          if (typeof a != "function") {
            if (xs(a || e) === null)
              continue;
            break;
          }
          var n = Ha(e);
          n !== null && (l.splice(t, 3), t -= 3, af(
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
  function xu(l) {
    function t(s) {
      return wi(s, l);
    }
    Pe !== null && wi(Pe, l), la !== null && wi(la, l), ta !== null && wi(ta, l), yn.forEach(t), gn.forEach(t);
    for (var e = 0; e < ea.length; e++) {
      var a = ea[e];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < ea.length && (e = ea[0], e.blockedOn === null); )
      km(e), e.blockedOn === null && ea.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var u = e[a], n = e[a + 1], i = u[vt] || null;
        if (typeof n == "function")
          i || Pm(e);
        else if (i) {
          var f = null;
          if (n && n.hasAttribute("formAction")) {
            if (u = n, i = n[vt] || null)
              f = i.formAction;
            else if (xs(u) !== null) continue;
          } else f = i.action;
          typeof f == "function" ? e[a + 1] = f : (e.splice(a, 3), a -= 3), Pm(e);
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
  function Ns(l) {
    this._internalRoot = l;
  }
  Fi.prototype.render = Ns.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(g(409));
    var e = t.current, a = Ut();
    Km(e, a, l, t, null, null);
  }, Fi.prototype.unmount = Ns.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      Km(l.current, 2, null, l, null, null), Ci(), t[Ua] = null;
    }
  };
  function Fi(l) {
    this._internalRoot = l;
  }
  Fi.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Qs();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < ea.length && t !== 0 && t < ea[e].priority; e++) ;
      ea.splice(e, 0, l), e === 0 && km(l);
    }
  };
  var th = Z.version;
  if (th !== "19.3.1")
    throw Error(
      g(
        527,
        th,
        "19.3.1"
      )
    );
  B.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(g(188)) : (l = Object.keys(l).join(","), Error(g(268, l)));
    return l = pl(t), l = l !== null ? R(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var fy = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: p,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var $i = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!$i.isDisabled && $i.supportsFiber)
      try {
        _u = $i.inject(
          fy
        ), zt = $i;
      } catch {
      }
  }
  return Tn.createRoot = function(l, t) {
    if (!Q(l)) throw Error(g(299));
    var e = !1, a = "", u = Lo, n = Ko, i = wo;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = Zm(
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
    ), l[Ua] = t.current, ls(l), new Ns(t);
  }, Tn.hydrateRoot = function(l, t, e) {
    if (!Q(l)) throw Error(g(299));
    var a = !1, u = "", n = Lo, i = Ko, f = wo, s = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (u = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError), e.formState !== void 0 && (s = e.formState)), t = Zm(
      l,
      1,
      !0,
      t,
      e ?? null,
      a,
      u,
      s,
      n,
      i,
      f,
      lh
    ), t.context = Lm(null), e = t.current, a = Ut(), a = Ii(a), u = Xe(a), u.callback = null, Qe(e, u, a), e = a, t.current.lanes = e, pu(t, e), de(t), l[Ua] = t.current, ls(l), new Fi(t);
  }, Tn.version = "19.3.1", Tn;
}
var oh;
function Sy() {
  if (oh) return ps.exports;
  oh = 1;
  function N() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(N);
      } catch (Z) {
        console.error(Z);
      }
  }
  return N(), ps.exports = gy(), ps.exports;
}
var by = Sy();
const Ty = /^\s*(\d{1,2})\s*-\s*(\d{1,2})\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*$/;
function jy(N) {
  const Z = {}, X = N.split(/\r?\n/).map((g) => g.trim()).filter(Boolean);
  if (X.length === 0)
    throw new Error("Saisis au moins une cote de score exact.");
  for (const [g, Q] of X.entries()) {
    const w = Q.match(Ty);
    if (!w)
      throw new Error(`Format incorrect à la ligne ${g + 1}. Utilise « 0-0 = 7,50 ».`);
    const al = `${Number(w[1])}-${Number(w[2])}`, Tl = Number(w[3].replace(",", "."));
    if (Object.hasOwn(Z, al))
      throw new Error(`Le score ${al} apparaît plusieurs fois.`);
    if (!Number.isFinite(Tl) || Tl <= 0)
      throw new Error(`La cote du score ${al} doit être supérieure à zéro.`);
    Z[al] = Tl;
  }
  return Z;
}
function xy({
  homeScore: N,
  awayScore: Z,
  oddsText: X,
  vitalityScore: g,
  oddsChangePercent: Q,
  tendanceSource: w = "",
  tendanceSeuilStable: al = ""
}) {
  const Tl = Number(N), cl = Number(Z), pl = Number(g), R = Number(Q);
  if (!Number.isInteger(Tl) || Tl < 0 || !Number.isInteger(cl) || cl < 0)
    throw new Error("Les scores doivent être des nombres entiers positifs ou nuls.");
  if (!Number.isFinite(pl) || pl < 0 || pl > 100)
    throw new Error("La vitalité doit être comprise entre 0 et 100.");
  if (!Number.isFinite(R))
    throw new Error("La variation des cotes sur deux minutes doit être un nombre valide.");
  const T = al === "" ? null : Number(al);
  if (w !== "" && w !== "cote_suggeree")
    throw new Error("La source de tendance doit être cote_suggeree ou rester non confirmée.");
  if (T !== null && (!Number.isFinite(T) || T < 0))
    throw new Error("Le seuil de tendance stable doit être un nombre positif ou nul.");
  const q = jy(X), Hl = [
    `${Tl}-${cl}`,
    `${Tl + 1}-${cl}`,
    `${Tl}-${cl + 1}`
  ].find((Zl) => !Object.hasOwn(q, Zl));
  if (Hl)
    throw new Error(`La cote du score ${Hl} est nécessaire pour tester F121-C.`);
  return {
    home_score: Tl,
    away_score: cl,
    exact_score_odds: q,
    vitality_score: pl,
    odds_change_percent: R,
    tendance_source: w || null,
    tendance_seuil_stable: T
  };
}
async function Ms(N, Z, { method: X = "GET", body: g } = {}) {
  const Q = { Accept: "application/json" };
  g !== void 0 && (Q["Content-Type"] = "application/json"), X !== "GET" && (Q["X-CSRF-TOKEN"] = Z);
  const w = await fetch(N, {
    method: X,
    credentials: "same-origin",
    headers: Q,
    body: g === void 0 ? void 0 : JSON.stringify(g)
  });
  if (!w.headers.get("content-type")?.includes("application/json"))
    throw new Error(`Réponse admin inattendue (HTTP ${w.status}). Vérifiez la session administrateur.`);
  const al = await w.json();
  if (!w.ok) {
    const Tl = al.errors ? Object.values(al.errors).flat().join(" ") : "";
    throw new Error(Tl || al.message || "La requête admin a échoué.");
  }
  return al;
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
  { id: "F121-D", title: "Score élevé", status: "Partiel", detail: "Les situations hors cas documentés restent à confirmer." },
  { id: "F121-E", title: "Règle de mi-temps / écart", status: "À confirmer", detail: "Les documents donnent deux définitions contradictoires." },
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
  tendance_source: "Source de tendance (à confirmer)",
  tendance_seuil_stable: "Seuil de tendance stable (à confirmer)",
  "rules.vitality_normalization_references": "Références de normalisation de la vitalité (à confirmer)"
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
  tendance_seuil_stable: "Variation maximale considérée comme stable.",
  "rules.vitality_normalization_references": "Valeurs de référence utilisées pour calculer la vitalité."
};
function ht({ name: N, size: Z = 20 }) {
  const X = { width: Z, height: Z, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0 }, g = {
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
  return /* @__PURE__ */ c.jsx("svg", { ...X, children: g[N] ?? g.grid });
}
function Aa({ eyebrow: N, title: Z, description: X, action: g }) {
  return /* @__PURE__ */ c.jsxs("div", { className: "page-heading", children: [
    /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("p", { className: "eyebrow", children: N }),
      /* @__PURE__ */ c.jsx("h1", { children: Z }),
      /* @__PURE__ */ c.jsx("p", { className: "page-description", children: X })
    ] }),
    g
  ] });
}
function ua({ icon: N, title: Z, message: X }) {
  return /* @__PURE__ */ c.jsxs("div", { className: "empty-state", children: [
    /* @__PURE__ */ c.jsx("span", { className: "empty-icon", children: /* @__PURE__ */ c.jsx(ht, { name: N, size: 23 }) }),
    /* @__PURE__ */ c.jsx("h3", { children: Z }),
    /* @__PURE__ */ c.jsx("p", { children: X })
  ] });
}
function Ny({ result: N }) {
  const Z = N.decision, X = N.rules["F121-C"]?.details?.selectedTeam, g = X === "home" ? "Équipe à domicile" : X === "away" ? "Équipe à l’extérieur" : "Direction indéterminée";
  return /* @__PURE__ */ c.jsxs("div", { className: "simulation-result", children: [
    /* @__PURE__ */ c.jsxs("div", { className: `simulation-verdict ${Z.shouldAlert ? "verdict-alert" : "verdict-neutral"}`, children: [
      /* @__PURE__ */ c.jsx("span", { className: "verdict-mark", children: Z.shouldAlert ? "✓" : "—" }),
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("strong", { children: Z.shouldAlert ? "Signal théorique détecté" : "Aucun signal" }),
        /* @__PURE__ */ c.jsx("p", { children: Z.reason })
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Règles évaluées" }),
      Object.values(N.rules).map((Q) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ c.jsx("span", { children: Q.ruleId }),
        /* @__PURE__ */ c.jsx("strong", { children: Q.verdict === "candidate" ? Q.suggestedAction || g : Q.verdict === "not_defined" ? "Non définie" : Q.verdict === "abstain" ? "Abstention" : "Aucun signal" })
      ] }, Q.ruleId))
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Filtres de sécurité" }),
      Object.entries(N.filters).map(([Q, w]) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ c.jsx("span", { children: w.label }),
        /* @__PURE__ */ c.jsx("strong", { className: w.passed ? "filter-passed" : "filter-failed", children: w.passed ? "Validé" : "Refusé" })
      ] }, Q))
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "simulation-disclaimer", children: [
      /* @__PURE__ */ c.jsx(ht, { name: "shield", size: 17 }),
      /* @__PURE__ */ c.jsx("span", { children: Z.convergenceScore === null ? "Convergence non calculée : aucun score de méthode n’est fourni. Simulation sans alerte transmissible." : `Convergence ${Z.convergenceScore} % — simulation uniquement.` })
    ] })
  ] });
}
function jn(N) {
  return N ? new Date(N).toLocaleString("fr-FR") : "—";
}
function _y(N, Z) {
  if (!N) return "Sans expiration";
  if (!Z) return "Calcul…";
  const X = Math.max(0, Math.floor((Date.parse(N) - Z) / 1e3));
  return `${Math.floor(X / 60)} min ${String(X % 60).padStart(2, "0")} s`;
}
function zy() {
  const [N, Z] = zl.useState("overview"), [X, g] = zl.useState(!1), [Q, w] = zl.useState(null), [al, Tl] = zl.useState(null), [cl, pl] = zl.useState([]), [R, T] = zl.useState({}), [q, Cl] = zl.useState([]), [Hl, Zl] = zl.useState(null), [sl, et] = zl.useState({ activeRules: [], methodWeights: {} }), [_l, me] = zl.useState(null), [ql, at] = zl.useState({ date_from: "", date_to: "", match_id: "", rule_id: "", status: "" }), [ol, J] = zl.useState(null), [P, jt] = zl.useState({ date_from: "", date_to: "" }), [ft, Ql] = zl.useState(""), [ut, st] = zl.useState(""), [xt, ml] = zl.useState(!1), [z, Y] = zl.useState(0), [H, hl] = zl.useState({
    homeScore: "0",
    awayScore: "0",
    oddsText: `0-0 = 7,50
1-0 = 8,60
0-1 = 9,80`,
    vitalityScore: "61",
    oddsChangePercent: "0",
    tendanceSource: "",
    tendanceSeuilStable: ""
  }), [nl, nt] = zl.useState(null), [qt, Yt] = zl.useState(""), [d, E] = zl.useState(!1), [M, C] = zl.useState(""), F = document.querySelector('meta[name="csrf-token"]')?.content ?? "", ll = document.querySelector("[data-admin-name]")?.dataset.adminName || "Administrateur", il = dh.find((o) => o.id === N)?.label ?? "Vue d’ensemble";
  zl.useEffect(() => {
    let o = !0;
    return Ms("/admin/api/dashboard", F).then((O) => {
      o && w(O);
    }).catch((O) => {
      o && Ql(O.message);
    }), () => {
      o = !1;
    };
  }, [F]), zl.useEffect(() => {
    const o = window.setInterval(() => Y(Date.now()), 1e3);
    return () => window.clearInterval(o);
  }, []);
  async function p(o, O = "GET", W) {
    Ql(""), Ql("");
    try {
      return await Ms(o, F, { method: O, body: W });
    } catch (jl) {
      return Ql(jl.message), null;
    }
  }
  async function B() {
    const o = await p("/admin/api/dashboard");
    o && w(o);
  }
  async function Et() {
    const o = await p("/admin/api/matches");
    o && Tl(o);
  }
  async function Da() {
    const o = await p("/admin/api/rule-profile");
    o && (Zl(o), et({
      activeRules: o.profile?.activeRules ?? [],
      methodWeights: o.profile?.methodWeights ?? {}
    }));
  }
  async function le() {
    const o = await p("/admin/api/settings");
    if (!o) return;
    pl(o.settings), T(Object.fromEntries(o.settings.map((W) => [
      W.key,
      W.type === "json" && W.value !== null ? JSON.stringify(W.value, null, 2) : W.value ?? ""
    ])));
    const O = await p("/admin/api/settings/history");
    O && Cl(O.data);
  }
  async function it(o = ql) {
    const O = new URLSearchParams(Object.entries(o).filter(([, jl]) => jl !== "")), W = await p(`/admin/api/journal${O.size ? `?${O}` : ""}`);
    W && me(W);
  }
  async function Rl(o = P) {
    const O = new URLSearchParams(Object.entries(o).filter(([, jl]) => jl !== "")), W = await p(`/admin/api/statistics${O.size ? `?${O}` : ""}`);
    W && J(W);
  }
  function vl(o) {
    Z(o), g(!1), st(""), Ql(""), nt(null), Yt(""), o === "overview" && B(), o === "matches" && Et(), o === "rules" && Da(), o === "settings" && le(), o === "journal" && it(), o === "statistics" && Rl();
  }
  const Ll = (o) => (O) => {
    hl((W) => ({ ...W, [o]: O.target.value })), nt(null), Yt("");
  };
  async function na(o) {
    o.preventDefault(), E(!0), Yt(""), nt(null);
    try {
      const O = xy(H), W = await Ms("/admin/rule-test", F, { method: "POST", body: O });
      nt(W);
    } catch (O) {
      Yt(O.message);
    } finally {
      E(!1);
    }
  }
  async function te() {
    C("");
    try {
      if (!(await fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "X-CSRF-TOKEN": F, Accept: "application/json" }
      })).ok) throw new Error("La déconnexion a échoué. Réessaie.");
      window.location.assign("/login");
    } catch (o) {
      C(o.message);
    }
  }
  async function Ma(o) {
    ml(!0), (o.tracked ? await p(`/admin/api/matches/${o.trackedId}`, "DELETE") : await p("/admin/api/matches", "POST", { provider_match_id: o.providerMatchId })) && (st(o.tracked ? "Rencontre retirée du suivi." : "Rencontre ajoutée au suivi."), await Et(), await B()), ml(!1);
  }
  async function Ca(o) {
    o.preventDefault(), ml(!0);
    try {
      const O = Object.fromEntries(cl.map((jl) => {
        const Jt = R[jl.key];
        return jl.type === "boolean" ? [jl.key, Jt === !0] : Jt === "" ? [jl.key, null] : jl.type === "integer" || jl.type === "decimal" ? [jl.key, Number(Jt)] : jl.type === "json" ? [jl.key, JSON.parse(Jt)] : [jl.key, Jt];
      }));
      await p("/admin/api/settings", "PATCH", { settings: O }) && (st("Paramètres enregistrés."), await le());
    } catch (O) {
      Ql(O.message);
    } finally {
      ml(!1);
    }
  }
  async function Ae() {
    ml(!0), await p("/admin/api/settings/reset", "POST") && (st("Paramètres réinitialisés."), await le()), ml(!1);
  }
  async function Eu(o) {
    o.preventDefault(), ml(!0);
    const O = Object.fromEntries(Object.entries(sl.methodWeights).filter(([, jl]) => jl !== "" && jl !== null).map(([jl, Jt]) => [jl, Number(Jt)]));
    await p("/admin/api/rule-profile", "PUT", {
      active_rules: sl.activeRules,
      method_weights: O
    }) && (st("Profil de règles enregistré."), await Da()), ml(!1);
  }
  async function Ra() {
    ml(!0);
    const o = await p("/admin/notifications/test", "POST", {});
    o && st(`${o.message} Canal : ${o.channel}${o.fallbackUsed ? " (repli utilisé)" : ""}${o.simulation ? " — simulation" : ""}`), ml(!1);
  }
  async function Nu(o, O) {
    await p(`/admin/api/journal/${o}/outcome`, "PATCH", { outcome: O || null }) && (await it(), await Rl());
  }
  const xn = Q?.simulation || al?.simulation, Nt = Q?.trackedMatches ?? [], De = Q?.activeAlerts ?? [];
  return /* @__PURE__ */ c.jsxs("div", { className: "admin-shell", children: [
    /* @__PURE__ */ c.jsxs("aside", { className: `sidebar ${X ? "sidebar-open" : ""}`, children: [
      /* @__PURE__ */ c.jsxs("a", { className: "brand", href: "/admin", children: [
        /* @__PURE__ */ c.jsx("span", { className: "brand-mark", children: "P" }),
        /* @__PURE__ */ c.jsxs("span", { children: [
          /* @__PURE__ */ c.jsx("strong", { children: "PRONOFOOT" }),
          /* @__PURE__ */ c.jsx("small", { children: "ADMINISTRATION" })
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "sidebar-label", children: "ESPACE ADMIN" }),
      /* @__PURE__ */ c.jsx("nav", { className: "navigation", "aria-label": "Navigation principale", children: dh.map((o) => /* @__PURE__ */ c.jsxs("button", { className: `nav-item ${N === o.id ? "nav-item-active" : ""}`, onClick: () => vl(o.id), type: "button", children: [
        /* @__PURE__ */ c.jsx(ht, { name: o.icon, size: 18 }),
        /* @__PURE__ */ c.jsx("span", { children: o.label }),
        o.id === "matches" && /* @__PURE__ */ c.jsx("span", { className: "nav-count", children: Nt.length })
      ] }, o.id)) }),
      /* @__PURE__ */ c.jsx("div", { className: "sidebar-spacer" }),
      /* @__PURE__ */ c.jsxs("div", { className: "phase-card", children: [
        /* @__PURE__ */ c.jsx("span", { className: "phase-card-icon", children: /* @__PURE__ */ c.jsx(ht, { name: "shield", size: 18 }) }),
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
      M && /* @__PURE__ */ c.jsx("p", { className: "sidebar-error", role: "alert", children: M })
    ] }),
    /* @__PURE__ */ c.jsxs("main", { className: "main-area", children: [
      /* @__PURE__ */ c.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ c.jsxs("button", { className: "mobile-menu-button", type: "button", "aria-label": "Ouvrir le menu", onClick: () => g((o) => !o), children: [
          /* @__PURE__ */ c.jsx("span", {}),
          /* @__PURE__ */ c.jsx("span", {}),
          /* @__PURE__ */ c.jsx("span", {})
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "breadcrumb", children: [
          /* @__PURE__ */ c.jsx("span", { children: "Administration" }),
          /* @__PURE__ */ c.jsx(ht, { name: "arrow", size: 14 }),
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
        xn && /* @__PURE__ */ c.jsxs("div", { className: "simulation-banner", role: "status", children: [
          /* @__PURE__ */ c.jsx(ht, { name: "shield", size: 18 }),
          /* @__PURE__ */ c.jsx("strong", { children: "Mode simulation :" }),
          " les données affichées proviennent d’au moins un pilote fictif."
        ] }),
        ft && /* @__PURE__ */ c.jsx("div", { className: "form-error api-error", role: "alert", children: ft }),
        ut && /* @__PURE__ */ c.jsx("div", { className: "success-message", role: "status", children: ut }),
        N === "overview" && /* @__PURE__ */ c.jsxs("div", { className: "overview-page", children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "TABLEAU DE BORD", title: "Vue d’ensemble", description: "État du détecteur et rencontres suivies.", action: /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
            B();
          }, children: "Actualiser" }) }),
          /* @__PURE__ */ c.jsxs("section", { className: "overview-highlights", "aria-label": "État du scan et alertes actives", children: [
            /* @__PURE__ */ c.jsxs("article", { className: "scan-status-panel", children: [
              /* @__PURE__ */ c.jsxs("div", { className: "scan-status-copy", children: [
                /* @__PURE__ */ c.jsx("p", { className: "overview-section-label", children: "STATUT DU SCAN" }),
                /* @__PURE__ */ c.jsx("h2", { children: "Détecteur de matchs" }),
                /* @__PURE__ */ c.jsxs("p", { children: [
                  "Dernier passage : ",
                  jn(Q?.scan?.lastPassAt)
                ] })
              ] }),
              /* @__PURE__ */ c.jsxs("span", { className: `scan-status-badge ${Q?.scan?.active ? "scan-active" : ""}`, children: [
                /* @__PURE__ */ c.jsx("span", {}),
                Q?.scan?.active ? "Actif" : "En attente"
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("article", { className: "active-alerts-panel", children: [
              /* @__PURE__ */ c.jsx("p", { className: "overview-section-label", children: "ALERTES ACTIVES" }),
              /* @__PURE__ */ c.jsx("strong", { children: De.length }),
              /* @__PURE__ */ c.jsx("p", { children: De.length ? "Alertes non expirées" : "Aucune alerte en cours" })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Quotas fournisseurs" }),
              /* @__PURE__ */ c.jsx("p", { children: "État connu après la dernière consultation." })
            ] }) }),
            /* @__PURE__ */ c.jsx("div", { className: "quota-grid", children: ["football", "odds"].map((o) => /* @__PURE__ */ c.jsxs("div", { className: "quota-card", children: [
              /* @__PURE__ */ c.jsx("strong", { children: o === "football" ? "Football" : "Cotes" }),
              /* @__PURE__ */ c.jsx("span", { children: Q?.quotas?.[o] ?? "Inconnu" }),
              /* @__PURE__ */ c.jsx("small", { children: Q?.providerStatus?.[o]?.message ?? "Pas encore interrogé" })
            ] }, o)) })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "overview-matches content-panel", "aria-labelledby": "overview-matches-title", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "overview-matches-heading", children: [
              /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("p", { className: "overview-section-label", children: "SUIVI EN DIRECT" }),
                /* @__PURE__ */ c.jsx("h2", { id: "overview-matches-title", children: "Matchs suivis" })
              ] }),
              /* @__PURE__ */ c.jsxs("button", { className: "overview-primary-action", type: "button", onClick: () => vl("matches"), children: [
                "Gérer les matchs ",
                /* @__PURE__ */ c.jsx(ht, { name: "arrow", size: 18 })
              ] })
            ] }),
            Nt.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Rencontre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Score" }),
                /* @__PURE__ */ c.jsx("th", { children: "Minute" }),
                /* @__PURE__ */ c.jsx("th", { children: "Vitalité" }),
                /* @__PURE__ */ c.jsx("th", { children: "Actualisé" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: Nt.map((o) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsxs("td", { children: [
                  o.homeTeam,
                  " – ",
                  o.awayTeam,
                  /* @__PURE__ */ c.jsx("small", { children: o.competition })
                ] }),
                /* @__PURE__ */ c.jsxs("td", { children: [
                  o.homeScore ?? "—",
                  " – ",
                  o.awayScore ?? "—"
                ] }),
                /* @__PURE__ */ c.jsx("td", { children: o.minute ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: o.vitality ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: jn(o.capturedAt) })
              ] }, o.id)) })
            ] }) }) : /* @__PURE__ */ c.jsx(ua, { icon: "ball", title: "Aucun match suivi", message: "Ajoutez une rencontre depuis le pilote configuré." })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Alertes actives" }),
              /* @__PURE__ */ c.jsx("p", { children: "Le compte à rebours reflète l’expiration enregistrée." })
            ] }) }),
            De.length ? /* @__PURE__ */ c.jsx("div", { className: "alert-list", children: De.map((o) => /* @__PURE__ */ c.jsxs("article", { className: "alert-row", children: [
              /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: o.match ?? "Rencontre" }),
                /* @__PURE__ */ c.jsx("p", { children: o.message }),
                /* @__PURE__ */ c.jsxs("small", { children: [
                  o.channel,
                  " · ",
                  o.status,
                  o.fallbackUsed ? " · repli" : ""
                ] })
              ] }),
              /* @__PURE__ */ c.jsx("span", { className: "countdown", children: _y(o.expiresAt, z) })
            ] }, o.id)) }) : /* @__PURE__ */ c.jsx(ua, { icon: "clock", title: "Aucune alerte active", message: "Les signaux restent soumis aux règles et aux paramètres confirmés." })
          ] })
        ] }),
        N === "matches" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "SUIVI EN DIRECT", title: "Matchs suivis", description: "Choisissez les rencontres à surveiller selon le flux disponible.", action: /* @__PURE__ */ c.jsxs("span", { className: "count-badge", children: [
            Nt.length,
            " suivis"
          ] }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-neutral", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(ht, { name: "clock", size: 18 }) }),
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
                Et();
              }, children: "Actualiser" })
            ] }),
            al?.matches?.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Rencontre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Compétition" }),
                /* @__PURE__ */ c.jsx("th", { children: "État" }),
                /* @__PURE__ */ c.jsx("th", { children: "Score" }),
                /* @__PURE__ */ c.jsx("th", { children: "Suivi" }),
                /* @__PURE__ */ c.jsx("th", { children: "Action" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: al.matches.map((o) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsxs("td", { children: [
                  o.homeTeam,
                  " – ",
                  o.awayTeam,
                  /* @__PURE__ */ c.jsx("small", { children: o.kickoffAt ? jn(o.kickoffAt) : "Horaire non disponible" })
                ] }),
                /* @__PURE__ */ c.jsx("td", { children: o.competition }),
                /* @__PURE__ */ c.jsxs("td", { children: [
                  o.status,
                  o.minute === null ? "" : ` · ${o.minute}′`
                ] }),
                /* @__PURE__ */ c.jsxs("td", { children: [
                  o.homeScore ?? "—",
                  " – ",
                  o.awayScore ?? "—"
                ] }),
                /* @__PURE__ */ c.jsx("td", { children: o.tracked ? "Suivi" : "Non suivi" }),
                /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx("button", { className: "secondary-button compact-button", type: "button", disabled: xt || !o.tracked && al.quotaRemaining === 0, onClick: () => {
                  Ma(o);
                }, children: o.tracked ? "Retirer" : "Suivre" }) })
              ] }, o.providerMatchId)) })
            ] }) }) : /* @__PURE__ */ c.jsx(ua, { icon: "search", title: "Aucune rencontre disponible", message: "Le fournisseur n’a retourné aucun match pour le moment." })
          ] })
        ] }),
        N === "rules" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "CONFIGURATION", title: "Moteur de règles", description: "Activez uniquement les règles documentées et configurez les poids validés.", action: /* @__PURE__ */ c.jsx("span", { className: "phase-badge phase-badge-muted", children: Hl?.profile?.name ?? "Profil à configurer" }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(ht, { name: "shield", size: 18 }) }),
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
            /* @__PURE__ */ c.jsx("div", { className: "rule-table", children: mh.map((o) => /* @__PURE__ */ c.jsxs("article", { className: "rule-row", children: [
              /* @__PURE__ */ c.jsx("span", { className: "rule-id", children: o.id }),
              /* @__PURE__ */ c.jsxs("div", { className: "rule-info", children: [
                /* @__PURE__ */ c.jsx("strong", { children: o.title }),
                /* @__PURE__ */ c.jsx("p", { children: o.detail })
              ] }),
              /* @__PURE__ */ c.jsx("span", { className: `status-pill ${o.status === "Disponible" ? "status-ready" : o.status === "Partiel" ? "status-partial" : "status-pending"}`, children: o.status })
            ] }, o.id)) })
          ] }),
          /* @__PURE__ */ c.jsxs("form", { className: "content-panel settings-form", onSubmit: Eu, children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Profil actif" }),
              /* @__PURE__ */ c.jsx("p", { children: "Les poids laissés vides ne sont pas ajoutés au profil." })
            ] }) }),
            /* @__PURE__ */ c.jsxs("fieldset", { className: "rule-selection", children: [
              /* @__PURE__ */ c.jsx("legend", { children: "Règles activées" }),
              (Hl?.availableRules ?? []).map((o) => /* @__PURE__ */ c.jsxs("label", { className: "check-row", children: [
                /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: sl.activeRules.includes(o), onChange: (O) => et((W) => ({ ...W, activeRules: O.target.checked ? [...W.activeRules, o] : W.activeRules.filter((jl) => jl !== o) })) }),
                o
              ] }, o))
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "field-grid", children: (Hl?.availableRules ?? []).map((o) => /* @__PURE__ */ c.jsxs("label", { children: [
              "Poids méthode — ",
              o,
              /* @__PURE__ */ c.jsx("input", { min: "0", step: "0.01", type: "number", value: sl.methodWeights[o] ?? "", onChange: (O) => et((W) => ({ ...W, methodWeights: { ...W.methodWeights, [o]: O.target.value } })), placeholder: "À confirmer" })
            ] }, o)) }),
            /* @__PURE__ */ c.jsx("button", { className: "primary-button", type: "submit", disabled: xt, children: "Enregistrer le profil" })
          ] })
        ] }),
        N === "tester" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "VALIDATION", title: "Testeur manuel", description: "Évalue un jeu de cotes fourni, sans envoyer de signal ni placer de pari.", action: /* @__PURE__ */ c.jsxs("span", { className: "phase-badge phase-badge-muted", children: [
            /* @__PURE__ */ c.jsx(ht, { name: "flask", size: 15 }),
            " Simulation uniquement"
          ] }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-neutral", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(ht, { name: "shield", size: 18 }) }),
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
                    /* @__PURE__ */ c.jsx("input", { min: "0", max: "20", type: "number", value: H.homeScore, onChange: Ll("homeScore"), required: !0 })
                  ] }),
                  /* @__PURE__ */ c.jsx("span", { className: "score-separator", children: "–" }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Score à l’extérieur",
                    /* @__PURE__ */ c.jsx("input", { min: "0", max: "20", type: "number", value: H.awayScore, onChange: Ll("awayScore"), required: !0 })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("label", { children: [
                  "Cotes des scores exacts ",
                  /* @__PURE__ */ c.jsx("span", { className: "label-note", children: "une ligne par score" }),
                  /* @__PURE__ */ c.jsx("textarea", { rows: "5", spellCheck: "false", value: H.oddsText, onChange: Ll("oddsText"), placeholder: `0-0 = 7,50
1-0 = 8,60
0-1 = 9,80`, required: !0 })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-row form-row-wide", children: [
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Vitalité (0–100)",
                    /* @__PURE__ */ c.jsx("input", { min: "0", max: "100", step: "0.1", type: "number", value: H.vitalityScore, onChange: Ll("vitalityScore"), required: !0 })
                  ] }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Variation des cotes sur 2 min (%)",
                    /* @__PURE__ */ c.jsx("input", { step: "0.1", type: "number", value: H.oddsChangePercent, onChange: Ll("oddsChangePercent"), required: !0 }),
                    /* @__PURE__ */ c.jsx("span", { className: "field-help", children: "Valeur négative = cotes en baisse." })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "field-grid", children: [
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Source de tendance",
                    /* @__PURE__ */ c.jsxs("select", { value: H.tendanceSource, onChange: Ll("tendanceSource"), children: [
                      /* @__PURE__ */ c.jsx("option", { value: "", children: "Non confirmée" }),
                      /* @__PURE__ */ c.jsx("option", { value: "cote_suggeree", children: "Cote suggérée (hypothèse)" })
                    ] })
                  ] }),
                  /* @__PURE__ */ c.jsxs("label", { children: [
                    "Seuil stable (%)",
                    /* @__PURE__ */ c.jsx("input", { min: "0", step: "0.1", type: "number", value: H.tendanceSeuilStable, onChange: Ll("tendanceSeuilStable"), placeholder: "À confirmer" })
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("p", { className: "format-hint", children: [
                  "Format accepté : ",
                  /* @__PURE__ */ c.jsx("code", { children: "score = cote" }),
                  " ou ",
                  /* @__PURE__ */ c.jsx("code", { children: "score : cote" }),
                  ". Les paramètres de tendance ne s’appliquent qu’à cette simulation."
                ] }),
                qt && /* @__PURE__ */ c.jsx("div", { className: "form-error", role: "alert", children: qt }),
                /* @__PURE__ */ c.jsxs("button", { className: "primary-button", type: "submit", disabled: d, children: [
                  d ? "Évaluation…" : "Évaluer la situation",
                  " ",
                  /* @__PURE__ */ c.jsx(ht, { name: "arrow", size: 17 })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("section", { className: "content-panel result-panel", "aria-live": "polite", children: [
              /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
                /* @__PURE__ */ c.jsx("h2", { children: "Résultat de la simulation" }),
                /* @__PURE__ */ c.jsx("p", { children: "Analyse des règles et des filtres" })
              ] }) }),
              nl ? /* @__PURE__ */ c.jsx(Ny, { result: nl }) : /* @__PURE__ */ c.jsx(ua, { icon: "flask", title: "Prêt à tester", message: "Les résultats apparaîtront ici après l’évaluation des données saisies." })
            ] })
          ] })
        ] }),
        N === "journal" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "HISTORIQUE", title: "Journal des opportunités", description: "Consultez les évaluations, décisions, filtres et résultats associés." }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsxs("form", { className: "filter-toolbar", onSubmit: (o) => {
              o.preventDefault(), it(ql);
            }, children: [
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Du",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: ql.date_from, onChange: (o) => at((O) => ({ ...O, date_from: o.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Au",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: ql.date_to, onChange: (o) => at((O) => ({ ...O, date_to: o.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "ID du match",
                /* @__PURE__ */ c.jsx("input", { min: "1", type: "number", value: ql.match_id, onChange: (o) => at((O) => ({ ...O, match_id: o.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Règle",
                /* @__PURE__ */ c.jsx("input", { value: ql.rule_id, onChange: (o) => at((O) => ({ ...O, rule_id: o.target.value })), placeholder: "F121-C" })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "État",
                /* @__PURE__ */ c.jsxs("select", { value: ql.status, onChange: (o) => at((O) => ({ ...O, status: o.target.value })), children: [
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
                /* @__PURE__ */ c.jsx(ht, { name: "search", size: 16 }),
                " Filtrer"
              ] })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Événements récents" }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                _l?.pagination?.total ?? 0,
                " événement(s)"
              ] })
            ] }) }),
            _l?.data?.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Date" }),
                /* @__PURE__ */ c.jsx("th", { children: "Rencontre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Score / minute" }),
                /* @__PURE__ */ c.jsx("th", { children: "Règle" }),
                /* @__PURE__ */ c.jsx("th", { children: "Décision" }),
                /* @__PURE__ */ c.jsx("th", { children: "Justification" }),
                /* @__PURE__ */ c.jsx("th", { children: "Résultat" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: _l.data.map((o) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("td", { children: jn(o.evaluatedAt) }),
                /* @__PURE__ */ c.jsx("td", { children: o.match ?? "—" }),
                /* @__PURE__ */ c.jsxs("td", { children: [
                  o.score ?? "—",
                  o.minute === null ? "" : ` · ${o.minute}′`
                ] }),
                /* @__PURE__ */ c.jsx("td", { children: o.ruleId ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: o.decision }),
                /* @__PURE__ */ c.jsx("td", { children: o.reason }),
                /* @__PURE__ */ c.jsx("td", { children: o.alert ? /* @__PURE__ */ c.jsxs("select", { "aria-label": `Résultat de l’alerte ${o.id}`, value: o.outcome ?? "", onChange: (O) => {
                  Nu(o.id, O.target.value);
                }, children: [
                  /* @__PURE__ */ c.jsx("option", { value: "", children: "À renseigner" }),
                  /* @__PURE__ */ c.jsx("option", { value: "won", children: "Gagnée" }),
                  /* @__PURE__ */ c.jsx("option", { value: "lost", children: "Perdue" }),
                  /* @__PURE__ */ c.jsx("option", { value: "cancelled", children: "Annulée" })
                ] }) : "—" })
              ] }, o.id)) })
            ] }) }) : /* @__PURE__ */ c.jsx(ua, { icon: "list", title: "Aucun événement", message: "Aucune évaluation ne correspond aux critères choisis." }),
            _l?.pagination?.lastPage > 1 && /* @__PURE__ */ c.jsxs("div", { className: "pagination", children: [
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", disabled: _l.pagination.currentPage <= 1, onClick: () => {
                it({ ...ql, page: String(_l.pagination.currentPage - 1) });
              }, children: "Précédent" }),
              /* @__PURE__ */ c.jsxs("span", { children: [
                "Page ",
                _l.pagination.currentPage,
                " / ",
                _l.pagination.lastPage
              ] }),
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", disabled: _l.pagination.currentPage >= _l.pagination.lastPage, onClick: () => {
                it({ ...ql, page: String(_l.pagination.currentPage + 1) });
              }, children: "Suivant" })
            ] })
          ] })
        ] }),
        N === "statistics" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "ANALYSE", title: "Statistiques", description: "Indicateurs calculés à partir des alertes et résultats enregistrés." }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsxs("form", { className: "filter-toolbar", onSubmit: (o) => {
              o.preventDefault(), Rl(P);
            }, children: [
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Du",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: P.date_from, onChange: (o) => jt((O) => ({ ...O, date_from: o.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Au",
                /* @__PURE__ */ c.jsx("input", { type: "date", value: P.date_to, onChange: (o) => jt((O) => ({ ...O, date_to: o.target.value })) })
              ] }),
              /* @__PURE__ */ c.jsxs("button", { className: "secondary-button", type: "submit", children: [
                /* @__PURE__ */ c.jsx(ht, { name: "search", size: 16 }),
                " Appliquer"
              ] })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "stats-grid", children: [["Alertes", ol?.alerts?.total], ["Actives", ol?.alerts?.active], ["Gagnées", ol?.alerts?.won], ["Perdues", ol?.alerts?.lost], ["Annulées", ol?.alerts?.cancelled], ["Sans résultat", ol?.alerts?.unrated], ["Taux de réussite", ol?.alerts?.successRatePercent === null || ol?.alerts?.successRatePercent === void 0 ? "—" : `${ol.alerts.successRatePercent} %`]].map(([o, O]) => /* @__PURE__ */ c.jsxs("article", { className: "stat-card", children: [
              /* @__PURE__ */ c.jsx("span", { children: o }),
              /* @__PURE__ */ c.jsx("strong", { children: O ?? "—" })
            ] }, o)) }),
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsx("div", { children: /* @__PURE__ */ c.jsx("h2", { children: "Résultats par règle" }) }) }),
            ol?.byRule && Object.keys(ol.byRule).length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Règle" }),
                /* @__PURE__ */ c.jsx("th", { children: "Alertes" }),
                /* @__PURE__ */ c.jsx("th", { children: "Gagnées" }),
                /* @__PURE__ */ c.jsx("th", { children: "Perdues" }),
                /* @__PURE__ */ c.jsx("th", { children: "Annulées" }),
                /* @__PURE__ */ c.jsx("th", { children: "Taux" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: Object.entries(ol.byRule).map(([o, O]) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("td", { children: o }),
                /* @__PURE__ */ c.jsx("td", { children: O.alerts }),
                /* @__PURE__ */ c.jsx("td", { children: O.won }),
                /* @__PURE__ */ c.jsx("td", { children: O.lost }),
                /* @__PURE__ */ c.jsx("td", { children: O.cancelled }),
                /* @__PURE__ */ c.jsx("td", { children: O.successRatePercent === null ? "—" : `${O.successRatePercent} %` })
              ] }, o)) })
            ] }) }) : /* @__PURE__ */ c.jsx(ua, { icon: "chart", title: "Pas encore de résultats", message: "Les statistiques apparaîtront lorsque des alertes et leurs résultats seront consignés." }),
            ol?.refusalsByFilter && Object.keys(ol.refusalsByFilter).length > 0 && /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsx("div", { children: /* @__PURE__ */ c.jsx("h2", { children: "Refus par filtre" }) }) }),
            ol?.refusalsByFilter && Object.entries(ol.refusalsByFilter).map(([o, O]) => /* @__PURE__ */ c.jsxs("div", { className: "simulation-line", children: [
              /* @__PURE__ */ c.jsx("span", { children: o }),
              /* @__PURE__ */ c.jsx("strong", { children: O })
            ] }, o))
          ] })
        ] }),
        N === "settings" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Aa, { eyebrow: "CONFIGURATION", title: "Paramètres", description: "Modifiez les paramètres enregistrés et consultez leur historique.", action: /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
            Ra();
          }, disabled: xt, children: "Tester les notifications" }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ c.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ c.jsx(ht, { name: "shield", size: 18 }) }),
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
            cl.length ? /* @__PURE__ */ c.jsx("div", { className: "settings-list", children: cl.map((o) => /* @__PURE__ */ c.jsxs("label", { className: "setting-row", children: [
              /* @__PURE__ */ c.jsxs("span", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: hh[o.key] ?? o.key }),
                /* @__PURE__ */ c.jsxs("small", { children: [
                  Ey[o.key] ?? "Paramètre utilisé par le détecteur.",
                  o.needsConfirmation ? " · À confirmer" : ""
                ] })
              ] }),
              o.type === "boolean" ? /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: R[o.key] === !0, onChange: (O) => T((W) => ({ ...W, [o.key]: O.target.checked })) }) : o.type === "json" ? /* @__PURE__ */ c.jsx("textarea", { rows: "3", value: R[o.key] ?? "", onChange: (O) => T((W) => ({ ...W, [o.key]: O.target.value })), placeholder: "À confirmer" }) : o.key === "tendance_source" ? /* @__PURE__ */ c.jsxs("select", { value: R[o.key] ?? "", onChange: (O) => T((W) => ({ ...W, [o.key]: O.target.value })), children: [
                /* @__PURE__ */ c.jsx("option", { value: "", children: "À confirmer" }),
                /* @__PURE__ */ c.jsx("option", { value: "cote_suggeree", children: "Cote suggérée (hypothèse)" })
              ] }) : /* @__PURE__ */ c.jsx("input", { type: o.type === "integer" || o.type === "decimal" ? "number" : "text", min: o.type === "integer" || o.type === "decimal" ? "0" : void 0, step: o.type === "decimal" ? "0.01" : void 0, value: R[o.key] ?? "", onChange: (O) => T((W) => ({ ...W, [o.key]: O.target.value })), placeholder: o.needsConfirmation ? "À confirmer" : "" })
            ] }, o.key)) }) : /* @__PURE__ */ c.jsx(ua, { icon: "settings", title: "Paramètres indisponibles", message: "Aucun paramètre enregistré n’a été retourné." }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-actions", children: [
              /* @__PURE__ */ c.jsx("button", { className: "primary-button", type: "submit", disabled: xt || !cl.length, children: "Enregistrer" }),
              /* @__PURE__ */ c.jsx("button", { className: "secondary-button", type: "button", onClick: () => {
                Ae();
              }, disabled: xt, children: "Réinitialiser" })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "content-panel", children: [
            /* @__PURE__ */ c.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { children: "Historique des modifications" }),
              /* @__PURE__ */ c.jsx("p", { children: "Les dernières modifications de paramètres sont conservées." })
            ] }) }),
            q.length ? /* @__PURE__ */ c.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
              /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("th", { children: "Date" }),
                /* @__PURE__ */ c.jsx("th", { children: "Paramètre" }),
                /* @__PURE__ */ c.jsx("th", { children: "Ancienne valeur" }),
                /* @__PURE__ */ c.jsx("th", { children: "Nouvelle valeur" }),
                /* @__PURE__ */ c.jsx("th", { children: "Administrateur" })
              ] }) }),
              /* @__PURE__ */ c.jsx("tbody", { children: q.map((o) => /* @__PURE__ */ c.jsxs("tr", { children: [
                /* @__PURE__ */ c.jsx("td", { children: jn(o.changedAt) }),
                /* @__PURE__ */ c.jsx("td", { children: hh[o.settingKey] ?? o.settingKey }),
                /* @__PURE__ */ c.jsx("td", { children: o.oldValue ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: o.newValue ?? "—" }),
                /* @__PURE__ */ c.jsx("td", { children: o.user })
              ] }, o.id)) })
            ] }) }) : /* @__PURE__ */ c.jsx(ua, { icon: "list", title: "Aucun changement", message: "L’historique se remplira après la première modification." })
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
  /* @__PURE__ */ c.jsx(zl.StrictMode, { children: /* @__PURE__ */ c.jsx(zy, {}) })
);
