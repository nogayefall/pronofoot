var bs = { exports: {} }, nn = {};
var P0;
function c1() {
  if (P0) return nn;
  P0 = 1;
  var z = /* @__PURE__ */ Symbol.for("react.transitional.element"), K = /* @__PURE__ */ Symbol.for("react.fragment");
  function G(g, Z, w) {
    var cl = null;
    if (w !== void 0 && (cl = "" + w), Z.key !== void 0 && (cl = "" + Z.key), "key" in Z) {
      w = {};
      for (var hl in Z)
        hl !== "key" && (w[hl] = Z[hl]);
    } else w = Z;
    return Z = w.ref, {
      $$typeof: z,
      type: g,
      key: cl,
      ref: Z !== void 0 ? Z : null,
      props: w
    };
  }
  return nn.Fragment = K, nn.jsx = G, nn.jsxs = G, nn;
}
var lv;
function f1() {
  return lv || (lv = 1, bs.exports = c1()), bs.exports;
}
var f = f1(), Es = { exports: {} }, B = {};
var tv;
function s1() {
  if (tv) return B;
  tv = 1;
  var z = /* @__PURE__ */ Symbol.for("react.transitional.element"), K = /* @__PURE__ */ Symbol.for("react.portal"), G = /* @__PURE__ */ Symbol.for("react.fragment"), g = /* @__PURE__ */ Symbol.for("react.strict_mode"), Z = /* @__PURE__ */ Symbol.for("react.profiler"), w = /* @__PURE__ */ Symbol.for("react.consumer"), cl = /* @__PURE__ */ Symbol.for("react.context"), hl = /* @__PURE__ */ Symbol.for("react.forward_ref"), yl = /* @__PURE__ */ Symbol.for("react.suspense"), bl = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), T = /* @__PURE__ */ Symbol.for("react.activity"), C = /* @__PURE__ */ Symbol.for("react.view_transition"), _l = Symbol.iterator;
  function Fl(d) {
    return d === null || typeof d != "object" ? null : (d = _l && d[_l] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var Ul = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, dl = Object.assign, Rl = {};
  function Wl(d, N, M) {
    this.props = d, this.context = N, this.refs = Rl, this.updater = M || Ul;
  }
  Wl.prototype.isReactComponent = {}, Wl.prototype.setState = function(d, N) {
    if (typeof d != "object" && typeof d != "function" && d != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, d, N, "setState");
  }, Wl.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function Pt() {
  }
  Pt.prototype = Wl.prototype;
  function tt(d, N, M) {
    this.props = d, this.context = N, this.refs = Rl, this.updater = M || Ul;
  }
  var L = tt.prototype = new Pt();
  L.constructor = tt, dl(L, Wl.prototype), L.isPureReactComponent = !0;
  var pl = Array.isArray;
  function X() {
  }
  var k = { H: null, A: null, T: null, S: null }, Gt = Object.prototype.hasOwnProperty;
  function Et(d, N, M) {
    var p = M.ref;
    return {
      $$typeof: z,
      type: d,
      key: N,
      ref: p !== void 0 ? p : null,
      props: M
    };
  }
  function Nt(d, N) {
    return Et(d.type, N, d.props);
  }
  function ft(d) {
    return typeof d == "object" && d !== null && d.$$typeof === z;
  }
  function ge(d) {
    var N = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(M) {
      return N[M];
    });
  }
  var Fe = /\/+/g;
  function Hl(d, N) {
    return typeof d == "object" && d !== null && d.key != null ? ge("" + d.key) : N.toString(36);
  }
  function _(d) {
    switch (d.status) {
      case "fulfilled":
        return d.value;
      case "rejected":
        throw d.reason;
      default:
        switch (typeof d.status == "string" ? d.then(X, X) : (d.status = "pending", d.then(
          function(N) {
            d.status === "pending" && (d.status = "fulfilled", d.value = N);
          },
          function(N) {
            d.status === "pending" && (d.status = "rejected", d.reason = N);
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
  function H(d, N, M, p, ll) {
    var tl = typeof d;
    (tl === "undefined" || tl === "boolean") && (d = null);
    var al = !1;
    if (d === null) al = !0;
    else
      switch (tl) {
        case "bigint":
        case "string":
        case "number":
          al = !0;
          break;
        case "object":
          switch (d.$$typeof) {
            case z:
            case K:
              al = !0;
              break;
            case U:
              return al = d._init, H(
                al(d._payload),
                N,
                M,
                p,
                ll
              );
          }
      }
    if (al)
      return ll = ll(d), al = p === "" ? "." + Hl(d, 0) : p, pl(ll) ? (M = "", al != null && (M = al.replace(Fe, "$&/") + "/"), H(ll, N, M, "", function(te) {
        return te;
      })) : ll != null && (ft(ll) && (ll = Nt(
        ll,
        M + (ll.key == null || d && d.key === ll.key ? "" : ("" + ll.key).replace(
          Fe,
          "$&/"
        ) + "/") + al
      )), N.push(ll)), 1;
    al = 0;
    var x = p === "" ? "." : p + ":";
    if (pl(d))
      for (var Y = 0; Y < d.length; Y++)
        p = d[Y], tl = x + Hl(p, Y), al += H(
          p,
          N,
          M,
          tl,
          ll
        );
    else if (Y = Fl(d), typeof Y == "function")
      for (d = Y.call(d), Y = 0; !(p = d.next()).done; )
        p = p.value, tl = x + Hl(p, Y++), al += H(
          p,
          N,
          M,
          tl,
          ll
        );
    else if (tl === "object") {
      if (typeof d.then == "function")
        return H(
          _(d),
          N,
          M,
          p,
          ll
        );
      throw N = String(d), Error(
        "Objects are not valid as a React child (found: " + (N === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : N) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return al;
  }
  function q(d, N, M) {
    if (d == null) return d;
    var p = [], ll = 0;
    return H(d, p, "", "", function(tl) {
      return N.call(M, tl, ll++);
    }), p;
  }
  function vl(d) {
    if (d._status === -1) {
      var N = d._result, M = N();
      M.then(
        function(p) {
          (d._status === 0 || d._status === -1) && (d._status = 1, d._result = p, M.status === void 0 && (M.status = "fulfilled", M.value = p));
        },
        function(p) {
          (d._status === 0 || d._status === -1) && (d._status = 2, d._result = p, M.status === void 0 && (M.status = "rejected", M.reason = p));
        }
      ), d._status === -1 && (d._status = 0, d._result = M);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var nl = typeof reportError == "function" ? reportError : function(d) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var N = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof d == "object" && d !== null && typeof d.message == "string" ? String(d.message) : String(d),
        error: d
      });
      if (!window.dispatchEvent(N)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", d);
      return;
    }
    console.error(d);
  };
  function Ct(d) {
    var N = k.T, M = {};
    M.types = N !== null ? N.types : null, k.T = M;
    try {
      var p = d(), ll = k.S;
      ll !== null && ll(M, p), typeof p == "object" && p !== null && typeof p.then == "function" && p.then(X, nl);
    } catch (tl) {
      nl(tl);
    } finally {
      N !== null && M.types !== null && (N.types = M.types), k.T = N;
    }
  }
  function le(d) {
    var N = k.T;
    if (N !== null) {
      var M = N.types;
      M === null ? N.types = [d] : M.indexOf(d) === -1 && M.push(d);
    } else Ct(le.bind(null, d));
  }
  var $e = {
    map: q,
    forEach: function(d, N, M) {
      q(
        d,
        function() {
          N.apply(this, arguments);
        },
        M
      );
    },
    count: function(d) {
      var N = 0;
      return q(d, function() {
        N++;
      }), N;
    },
    toArray: function(d) {
      return q(d, function(N) {
        return N;
      }) || [];
    },
    only: function(d) {
      if (!ft(d))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return d;
    }
  };
  return B.Activity = T, B.Children = $e, B.Component = Wl, B.Fragment = G, B.Profiler = Z, B.PureComponent = tt, B.StrictMode = g, B.Suspense = yl, B.ViewTransition = C, B.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, B.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(d) {
      return k.H.useMemoCache(d);
    }
  }, B.addTransitionType = le, B.cache = function(d) {
    return function() {
      return d.apply(null, arguments);
    };
  }, B.cacheSignal = function() {
    return null;
  }, B.cloneElement = function(d, N, M) {
    if (d == null)
      throw Error(
        "The argument must be a React element, but you passed " + d + "."
      );
    var p = dl({}, d.props), ll = d.key;
    if (N != null)
      for (tl in N.key !== void 0 && (ll = "" + N.key), N)
        !Gt.call(N, tl) || tl === "key" || tl === "__self" || tl === "__source" || tl === "ref" && N.ref === void 0 || (p[tl] = N[tl]);
    var tl = arguments.length - 2;
    if (tl === 1) p.children = M;
    else if (1 < tl) {
      for (var al = Array(tl), x = 0; x < tl; x++)
        al[x] = arguments[x + 2];
      p.children = al;
    }
    return Et(d.type, ll, p);
  }, B.createContext = function(d) {
    return d = {
      $$typeof: cl,
      _currentValue: d,
      _currentValue2: d,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, d.Provider = d, d.Consumer = {
      $$typeof: w,
      _context: d
    }, d;
  }, B.createElement = function(d, N, M) {
    var p, ll = {}, tl = null;
    if (N != null)
      for (p in N.key !== void 0 && (tl = "" + N.key), N)
        Gt.call(N, p) && p !== "key" && p !== "__self" && p !== "__source" && (ll[p] = N[p]);
    var al = arguments.length - 2;
    if (al === 1) ll.children = M;
    else if (1 < al) {
      for (var x = Array(al), Y = 0; Y < al; Y++)
        x[Y] = arguments[Y + 2];
      ll.children = x;
    }
    if (d && d.defaultProps)
      for (p in al = d.defaultProps, al)
        ll[p] === void 0 && (ll[p] = al[p]);
    return Et(d, tl, ll);
  }, B.createRef = function() {
    return { current: null };
  }, B.forwardRef = function(d) {
    return { $$typeof: hl, render: d };
  }, B.isValidElement = ft, B.lazy = function(d) {
    return {
      $$typeof: U,
      _payload: { _status: -1, _result: d },
      _init: vl
    };
  }, B.memo = function(d, N) {
    return {
      $$typeof: bl,
      type: d,
      compare: N === void 0 ? null : N
    };
  }, B.startTransition = Ct, B.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, B.use = function(d) {
    return k.H.use(d);
  }, B.useActionState = function(d, N, M) {
    return k.H.useActionState(d, N, M);
  }, B.useCallback = function(d, N) {
    return k.H.useCallback(d, N);
  }, B.useContext = function(d) {
    return k.H.useContext(d);
  }, B.useDebugValue = function() {
  }, B.useDeferredValue = function(d, N) {
    return k.H.useDeferredValue(d, N);
  }, B.useEffect = function(d, N) {
    return k.H.useEffect(d, N);
  }, B.useEffectEvent = function(d) {
    return k.H.useEffectEvent(d);
  }, B.useId = function() {
    return k.H.useId();
  }, B.useImperativeHandle = function(d, N, M) {
    return k.H.useImperativeHandle(d, N, M);
  }, B.useInsertionEffect = function(d, N) {
    return k.H.useInsertionEffect(d, N);
  }, B.useLayoutEffect = function(d, N) {
    return k.H.useLayoutEffect(d, N);
  }, B.useMemo = function(d, N) {
    return k.H.useMemo(d, N);
  }, B.useOptimistic = function(d, N) {
    return k.H.useOptimistic(d, N);
  }, B.useReducer = function(d, N, M) {
    return k.H.useReducer(d, N, M);
  }, B.useRef = function(d) {
    return k.H.useRef(d);
  }, B.useState = function(d) {
    return k.H.useState(d);
  }, B.useSyncExternalStore = function(d, N, M) {
    return k.H.useSyncExternalStore(
      d,
      N,
      M
    );
  }, B.useTransition = function() {
    return k.H.useTransition();
  }, B.version = "19.3.1", B;
}
var ev;
function As() {
  return ev || (ev = 1, Es.exports = s1()), Es.exports;
}
var we = As(), Ns = { exports: {} }, cn = {}, zs = { exports: {} }, Os = {};
var av;
function o1() {
  return av || (av = 1, (function(z) {
    function K(_, H) {
      var q = _.length;
      _.push(H);
      l: for (; 0 < q; ) {
        var vl = q - 1 >>> 1, nl = _[vl];
        if (0 < Z(nl, H))
          _[vl] = H, _[q] = nl, q = vl;
        else break l;
      }
    }
    function G(_) {
      return _.length === 0 ? null : _[0];
    }
    function g(_) {
      if (_.length === 0) return null;
      var H = _[0], q = _.pop();
      if (q !== H) {
        _[0] = q;
        l: for (var vl = 0, nl = _.length, Ct = nl >>> 1; vl < Ct; ) {
          var le = 2 * (vl + 1) - 1, $e = _[le], d = le + 1, N = _[d];
          if (0 > Z($e, q))
            d < nl && 0 > Z(N, $e) ? (_[vl] = N, _[d] = q, vl = d) : (_[vl] = $e, _[le] = q, vl = le);
          else if (d < nl && 0 > Z(N, q))
            _[vl] = N, _[d] = q, vl = d;
          else break l;
        }
      }
      return H;
    }
    function Z(_, H) {
      var q = _.sortIndex - H.sortIndex;
      return q !== 0 ? q : _.id - H.id;
    }
    if (z.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var w = performance;
      z.unstable_now = function() {
        return w.now();
      };
    } else {
      var cl = Date, hl = cl.now();
      z.unstable_now = function() {
        return cl.now() - hl;
      };
    }
    var yl = [], bl = [], U = 1, T = null, C = 3, _l = !1, Fl = !1, Ul = !1, dl = !1, Rl = typeof setTimeout == "function" ? setTimeout : null, Wl = typeof clearTimeout == "function" ? clearTimeout : null, Pt = typeof setImmediate < "u" ? setImmediate : null;
    function tt(_) {
      for (var H = G(bl); H !== null; ) {
        if (H.callback === null) g(bl);
        else if (H.startTime <= _)
          g(bl), H.sortIndex = H.expirationTime, K(yl, H);
        else break;
        H = G(bl);
      }
    }
    function L(_) {
      if (Ul = !1, tt(_), !Fl)
        if (G(yl) !== null)
          Fl = !0, pl || (pl = !0, ft());
        else {
          var H = G(bl);
          H !== null && Hl(L, H.startTime - _);
        }
    }
    var pl = !1, X = -1, k = 5, Gt = -1;
    function Et() {
      return dl ? !0 : !(z.unstable_now() - Gt < k);
    }
    function Nt() {
      if (dl = !1, pl) {
        var _ = z.unstable_now();
        Gt = _;
        var H = !0;
        try {
          l: {
            Fl = !1, Ul && (Ul = !1, Wl(X), X = -1), _l = !0;
            var q = C;
            try {
              t: {
                for (tt(_), T = G(yl); T !== null && !(T.expirationTime > _ && Et()); ) {
                  var vl = T.callback;
                  if (typeof vl == "function") {
                    T.callback = null, C = T.priorityLevel;
                    var nl = vl(
                      T.expirationTime <= _
                    );
                    if (_ = z.unstable_now(), typeof nl == "function") {
                      T.callback = nl, tt(_), H = !0;
                      break t;
                    }
                    T === G(yl) && g(yl), tt(_);
                  } else g(yl);
                  T = G(yl);
                }
                if (T !== null) H = !0;
                else {
                  var Ct = G(bl);
                  Ct !== null && Hl(
                    L,
                    Ct.startTime - _
                  ), H = !1;
                }
              }
              break l;
            } finally {
              T = null, C = q, _l = !1;
            }
            H = void 0;
          }
        } finally {
          H ? ft() : pl = !1;
        }
      }
    }
    var ft;
    if (typeof Pt == "function")
      ft = function() {
        Pt(Nt);
      };
    else if (typeof MessageChannel < "u") {
      var ge = new MessageChannel(), Fe = ge.port2;
      ge.port1.onmessage = Nt, ft = function() {
        Fe.postMessage(null);
      };
    } else
      ft = function() {
        Rl(Nt, 0);
      };
    function Hl(_, H) {
      X = Rl(function() {
        _(z.unstable_now());
      }, H);
    }
    z.unstable_IdlePriority = 5, z.unstable_ImmediatePriority = 1, z.unstable_LowPriority = 4, z.unstable_NormalPriority = 3, z.unstable_Profiling = null, z.unstable_UserBlockingPriority = 2, z.unstable_cancelCallback = function(_) {
      _.callback = null;
    }, z.unstable_forceFrameRate = function(_) {
      0 > _ || 125 < _ ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : k = 0 < _ ? Math.floor(1e3 / _) : 5;
    }, z.unstable_getCurrentPriorityLevel = function() {
      return C;
    }, z.unstable_next = function(_) {
      switch (C) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = C;
      }
      var q = C;
      C = H;
      try {
        return _();
      } finally {
        C = q;
      }
    }, z.unstable_requestPaint = function() {
      dl = !0;
    }, z.unstable_runWithPriority = function(_, H) {
      switch (_) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          _ = 3;
      }
      var q = C;
      C = _;
      try {
        return H();
      } finally {
        C = q;
      }
    }, z.unstable_scheduleCallback = function(_, H, q) {
      var vl = z.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? vl + q : vl) : q = vl, _) {
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
      return nl = q + nl, _ = {
        id: U++,
        callback: H,
        priorityLevel: _,
        startTime: q,
        expirationTime: nl,
        sortIndex: -1
      }, q > vl ? (_.sortIndex = q, K(bl, _), G(yl) === null && _ === G(bl) && (Ul ? (Wl(X), X = -1) : Ul = !0, Hl(L, q - vl))) : (_.sortIndex = nl, K(yl, _), Fl || _l || (Fl = !0, pl || (pl = !0, ft()))), _;
    }, z.unstable_shouldYield = Et, z.unstable_wrapCallback = function(_) {
      var H = C;
      return function() {
        var q = C;
        C = H;
        try {
          return _.apply(this, arguments);
        } finally {
          C = q;
        }
      };
    };
  })(Os)), Os;
}
var uv;
function d1() {
  return uv || (uv = 1, zs.exports = o1()), zs.exports;
}
var _s = { exports: {} }, wl = {};
var nv;
function r1() {
  if (nv) return wl;
  nv = 1;
  var z = As();
  function K(U) {
    var T = "https://react.dev/errors/" + U;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var C = 2; C < arguments.length; C++)
        T += "&args[]=" + encodeURIComponent(arguments[C]);
    }
    return "Minified React error #" + U + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function G() {
  }
  var g = {
    d: {
      f: G,
      r: function() {
        throw Error(K(522));
      },
      D: G,
      C: G,
      L: G,
      m: G,
      X: G,
      S: G,
      M: G
    },
    p: 0,
    findDOMNode: null
  }, Z = /* @__PURE__ */ Symbol.for("react.portal"), w = /* @__PURE__ */ Symbol.for("react.recoverable"), cl = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function hl(U, T, C) {
    var _l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Z,
      key: _l == null ? null : _l === cl ? cl : "" + _l,
      children: U,
      containerInfo: T,
      implementation: C
    };
  }
  var yl = z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function bl(U, T) {
    if (U === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return wl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = g, wl.browser = function(U) {
    return { $$typeof: w, _reason: U };
  }, wl.createPortal = function(U, T) {
    var C = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(K(299));
    return hl(U, T, null, C);
  }, wl.flushSync = function(U) {
    var T = yl.T, C = g.p;
    try {
      if (yl.T = null, g.p = 2, U) return U();
    } finally {
      yl.T = T, g.p = C, g.d.f();
    }
  }, wl.preconnect = function(U, T) {
    typeof U == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, g.d.C(U, T));
  }, wl.prefetchDNS = function(U) {
    typeof U == "string" && g.d.D(U);
  }, wl.preinit = function(U, T) {
    if (typeof U == "string" && T && typeof T.as == "string") {
      var C = T.as, _l = bl(C, T.crossOrigin), Fl = typeof T.integrity == "string" ? T.integrity : void 0, Ul = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      C === "style" ? g.d.S(
        U,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: _l,
          integrity: Fl,
          fetchPriority: Ul
        }
      ) : C === "script" && g.d.X(U, {
        crossOrigin: _l,
        integrity: Fl,
        fetchPriority: Ul,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, wl.preinitModule = function(U, T) {
    if (typeof U == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var C = bl(
            T.as,
            T.crossOrigin
          );
          g.d.M(U, {
            crossOrigin: C,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0,
            fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0
          });
        }
      } else T == null && g.d.M(U);
  }, wl.preload = function(U, T) {
    if (typeof U == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var C = T.as, _l = bl(C, T.crossOrigin);
      g.d.L(U, C, {
        crossOrigin: _l,
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
  }, wl.preloadModule = function(U, T) {
    if (typeof U == "string")
      if (T) {
        var C = bl(T.as, T.crossOrigin);
        g.d.m(U, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: C,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0,
          nonce: typeof T.nonce == "string" ? T.nonce : void 0,
          fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0
        });
      } else g.d.m(U);
  }, wl.requestFormReset = function(U) {
    g.d.r(U);
  }, wl.unstable_batchedUpdates = function(U, T) {
    return U(T);
  }, wl.useFormState = function(U, T, C) {
    return yl.H.useFormState(U, T, C);
  }, wl.useFormStatus = function() {
    return yl.H.useHostTransitionStatus();
  }, wl.version = "19.3.1", wl;
}
var iv;
function v1() {
  if (iv) return _s.exports;
  iv = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (K) {
        console.error(K);
      }
  }
  return z(), _s.exports = r1(), _s.exports;
}
var cv;
function m1() {
  if (cv) return cn;
  cv = 1;
  var z = d1(), K = As(), G = v1();
  function g(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Z(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function w(l) {
    for (var t = l, e = t; e && !e.alternate; )
      t = e, (t.flags & 4098) !== 0 && (l = t.return), e = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? l : null;
  }
  function cl(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function hl(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function yl(l) {
    if (w(l) !== l)
      throw Error(g(188));
  }
  function bl(l) {
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
          if (n === e) return yl(u), l;
          if (n === a) return yl(u), t;
          n = n.sibling;
        }
        throw Error(g(188));
      }
      if (e.return !== a.return) e = u, a = n;
      else {
        for (var i = !1, c = u.child; c; ) {
          if (c === e) {
            i = !0, e = u, a = n;
            break;
          }
          if (c === a) {
            i = !0, a = u, e = n;
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = n.child; c; ) {
            if (c === e) {
              i = !0, e = n, a = u;
              break;
            }
            if (c === a) {
              i = !0, a = n, e = u;
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(g(189));
        }
      }
      if (e.alternate !== a) throw Error(g(190));
    }
    if (e.tag !== 3) throw Error(g(188));
    return e.stateNode.current === e ? l : t;
  }
  function U(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = U(l), t !== null) return t;
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
  function C(l) {
    for (l = l.return; l !== null; ) {
      if (l.tag === 3 || l.tag === 5 || l.tag === 27) return l;
      l = l.return;
    }
    return null;
  }
  function _l(l) {
    var t = !1;
    for (l = l.return; l !== null && (l.tag === 4 && (t = !0), !(l.tag === 3 || l.tag === 5 || l.tag === 27)); )
      l = l.return;
    return t;
  }
  function Fl(l) {
    var t = [null, null], e = C(l);
    return e === null || Ul(
      t,
      l,
      e.child,
      { foundSelf: !1 }
    ), t;
  }
  function Ul(l, t, e, a) {
    for (; e !== null; ) {
      if (e === t) a.foundSelf = !0;
      else if (e.tag === 5 || e.tag === 27 || e.tag === 6) {
        if (a.foundSelf) return l[1] = e, !0;
        l[0] = e;
      } else if ((e.tag !== 22 || e.memoizedState === null) && Ul(
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
  function dl(l) {
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
  var Rl = null, Wl = null;
  function Pt(l, t, e) {
    return l === e ? !0 : l === t ? (Rl = l, !0) : !1;
  }
  function tt(l, t, e) {
    return l === e ? (Wl = l, !1) : l === t ? (Wl !== null && (Rl = l), !0) : !1;
  }
  function L(l) {
    if (l === null) return null;
    do
      l = l === null ? null : l.return;
    while (l && l.tag !== 5 && l.tag !== 27 && l.tag !== 3);
    return l || null;
  }
  function pl(l, t, e) {
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
  var X = Object.assign, k = /* @__PURE__ */ Symbol.for("react.element"), Gt = /* @__PURE__ */ Symbol.for("react.transitional.element"), Et = /* @__PURE__ */ Symbol.for("react.portal"), Nt = /* @__PURE__ */ Symbol.for("react.fragment"), ft = /* @__PURE__ */ Symbol.for("react.strict_mode"), ge = /* @__PURE__ */ Symbol.for("react.profiler"), Fe = /* @__PURE__ */ Symbol.for("react.consumer"), Hl = /* @__PURE__ */ Symbol.for("react.context"), _ = /* @__PURE__ */ Symbol.for("react.forward_ref"), H = /* @__PURE__ */ Symbol.for("react.suspense"), q = /* @__PURE__ */ Symbol.for("react.suspense_list"), vl = /* @__PURE__ */ Symbol.for("react.memo"), nl = /* @__PURE__ */ Symbol.for("react.lazy"), Ct = /* @__PURE__ */ Symbol.for("react.activity"), le = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), $e = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), d = /* @__PURE__ */ Symbol.for("react.view_transition"), N = /* @__PURE__ */ Symbol.for("react.recoverable"), M = Symbol.iterator;
  function p(l) {
    return l === null || typeof l != "object" ? null : (l = M && l[M] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var ll = /* @__PURE__ */ Symbol.for("react.client.reference");
  function tl(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === ll ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Nt:
        return "Fragment";
      case ge:
        return "Profiler";
      case ft:
        return "StrictMode";
      case H:
        return "Suspense";
      case q:
        return "SuspenseList";
      case Ct:
        return "Activity";
      case d:
        return "ViewTransition";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Et:
          return "Portal";
        case Hl:
          return l.displayName || "Context";
        case Fe:
          return (l._context.displayName || "Context") + ".Consumer";
        case _:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case vl:
          return t = l.displayName || null, t !== null ? t : tl(l.type) || "Memo";
        case nl:
          t = l._payload, l = l._init;
          try {
            return tl(l(t));
          } catch {
          }
      }
    return null;
  }
  var al = Array.isArray, x = K.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = G.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, te = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Bi = [], Ta = -1;
  function Xt(l) {
    return { current: l };
  }
  function Xl(l) {
    0 > Ta || (l.current = Bi[Ta], Bi[Ta] = null, Ta--);
  }
  function gl(l, t) {
    Ta++, Bi[Ta] = l.current, l.current = t;
  }
  var Qt = Xt(null), du = Xt(null), Se = Xt(null), fn = Xt(null);
  function sn(l, t) {
    switch (gl(Se, t), gl(du, l), gl(Qt, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? f0(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = f0(t), l = s0(t, l);
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
    Xl(Qt), gl(Qt, l);
  }
  function ba() {
    Xl(Qt), Xl(du), Xl(Se);
  }
  function Gi(l) {
    var t = l.memoizedState;
    t !== null && (cu._currentValue = t.memoizedState, gl(fn, l)), t = Qt.current;
    var e = s0(t, l.type);
    t !== e && (gl(du, l), gl(Qt, e));
  }
  function on(l) {
    du.current === l && (Xl(Qt), Xl(du)), fn.current === l && (Xl(fn), cu._currentValue = te);
  }
  var Xi, xs;
  function Te(l) {
    if (Xi === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        Xi = t && t[1] || "", xs = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Xi + l + xs;
  }
  var Qi = !1;
  function Vi(l, t) {
    if (!l || Qi) return "";
    Qi = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var E = function() {
                throw Error();
              };
              if (Object.defineProperty(E.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(E, []);
                } catch (O) {
                  var r = O;
                }
                Reflect.construct(l, [], E);
              } else {
                try {
                  E.call();
                } catch (O) {
                  r = O;
                }
                E = !1;
                try {
                  var y = Object.getOwnPropertyDescriptor(
                    l.prototype,
                    "props"
                  );
                  Object.defineProperty(l.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), E = !0, new l();
                } finally {
                  E && (y !== void 0 ? Object.defineProperty(l.prototype, "props", y) : delete l.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                r = O;
              }
              (E = l()) && typeof E.catch == "function" && E.catch(function() {
              });
            }
          } catch (O) {
            if (O && r && typeof O.stack == "string")
              return [O.stack, r.stack];
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
      var n = a.DetermineComponentFrameRoot(), i = n[0], c = n[1];
      if (i && c) {
        var s = i.split(`
`), m = c.split(`
`);
        for (u = a = 0; a < s.length && !s[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; u < m.length && !m[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (a === s.length || u === m.length)
          for (a = s.length - 1, u = m.length - 1; 1 <= a && 0 <= u && s[a] !== m[u]; )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (s[a] !== m[u]) {
            if (a !== 1 || u !== 1)
              do
                if (a--, u--, 0 > u || s[a] !== m[u]) {
                  var S = `
` + s[a].replace(" at new ", " at ");
                  return l.displayName && S.includes("<anonymous>") && (S = S.replace("<anonymous>", l.displayName)), S;
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      Qi = !1, Error.prepareStackTrace = e;
    }
    return (e = l ? l.displayName || l.name : "") ? Te(e) : "";
  }
  function dv(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Te(l.type);
      case 16:
        return Te("Lazy");
      case 13:
        return l.child !== t && t !== null ? Te("Suspense Fallback") : Te("Suspense");
      case 19:
        return Te("SuspenseList");
      case 0:
      case 15:
        return Vi(l.type, !1);
      case 11:
        return Vi(l.type.render, !1);
      case 1:
        return Vi(l.type, !0);
      case 31:
        return Te("Activity");
      case 30:
        return Te("ViewTransition");
      default:
        return "";
    }
  }
  function Ds(l) {
    try {
      var t = "", e = null;
      do
        t += dv(l, e), e = l, l = l.return;
      while (l);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Zi = Object.prototype.hasOwnProperty, Li = z.unstable_scheduleCallback, Ki = z.unstable_cancelCallback, rv = z.unstable_shouldYield, vv = z.unstable_requestPaint, st = z.unstable_now, mv = z.unstable_getCurrentPriorityLevel, Ms = z.unstable_ImmediatePriority, ps = z.unstable_UserBlockingPriority, dn = z.unstable_NormalPriority, hv = z.unstable_LowPriority, Cs = z.unstable_IdlePriority, yv = z.log, gv = z.unstable_setDisableYieldValue, ru = null, ot = null;
  function be(l) {
    if (typeof yv == "function" && gv(l), ot && typeof ot.setStrictMode == "function")
      try {
        ot.setStrictMode(ru, l);
      } catch {
      }
  }
  var dt = Math.clz32 ? Math.clz32 : bv, Sv = Math.log, Tv = Math.LN2;
  function bv(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Sv(l) / Tv | 0) | 0;
  }
  var rn = 256, vn = 262144, mn = 4194304;
  function We(l) {
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
  function hn(l, t, e) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var u = 0, n = l.suspendedLanes, i = l.pingedLanes;
    l = l.warmLanes;
    var c = a & 134217727;
    return c !== 0 ? (a = c & ~n, a !== 0 ? u = We(a) : (i &= c, i !== 0 ? u = We(i) : e || (e = c & ~l, e !== 0 && (u = We(e))))) : (c = a & ~n, c !== 0 ? u = We(c) : i !== 0 ? u = We(i) : e || (e = a & ~l, e !== 0 && (u = We(e)))), u === 0 ? 0 : t !== 0 && t !== u && (t & n) === 0 && (n = u & -u, e = t & -t, n >= e || n === 32 && (e & 4194048) !== 0) ? t : u;
  }
  function vu(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Us(l, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var e = l.entangledLanes;
    if (e !== 0)
      for (l = l.entanglements, e &= t; 0 < e; ) {
        var a = 31 - dt(e), u = 1 << a;
        t |= l[a], e &= ~u;
      }
    return t;
  }
  function Ev(l, t) {
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
  function Rs() {
    var l = mn;
    return mn <<= 1, (mn & 62914560) === 0 && (mn = 4194304), l;
  }
  function Ji(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function mu(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Nv(l, t, e, a, u, n) {
    var i = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var c = l.entanglements, s = l.expirationTimes, m = l.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var S = 31 - dt(e), E = 1 << S;
      c[S] = 0, s[S] = -1;
      var r = m[S];
      if (r !== null)
        for (m[S] = null, S = 0; S < r.length; S++) {
          var y = r[S];
          y !== null && (y.lane &= -536870913);
        }
      e &= ~E;
    }
    a !== 0 && Hs(l, a, 0), n !== 0 && u === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t));
  }
  function Hs(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - dt(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | e & 261930;
  }
  function qs(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var a = 31 - dt(e), u = 1 << a;
      u & t | l[a] & t && (l[a] |= t), e &= ~u;
    }
  }
  function Ys(l, t) {
    var e = t & -t;
    return e = (e & 42) !== 0 ? 1 : wi(e), (e & (l.suspendedLanes | t)) !== 0 ? 0 : e;
  }
  function wi(l) {
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
  function Fi(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Bs() {
    var l = Y.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : J0(l.type));
  }
  function Gs(l, t) {
    var e = Y.p;
    try {
      return Y.p = l, t();
    } finally {
      Y.p = e;
    }
  }
  var ee = Math.random().toString(36).slice(2), Ql = "__reactFiber$" + ee, et = "__reactProps$" + ee, Ea = "__reactContainer$" + ee, Xs = "__reactEvents$" + ee, zv = "__reactListeners$" + ee, Ov = "__reactHandles$" + ee, Qs = "__reactResources$" + ee, hu = "__reactMarker$" + ee, yn = "__reactLoad$" + ee;
  function gn(l) {
    delete l[Ql], delete l[et], delete l[zv], delete l[Ov];
  }
  function Ie(l) {
    var t;
    if (t = l[Ql]) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[Ea] || e[Ql]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = j0(l); l !== null; ) {
            if (e = l[Ql]) return e;
            l = j0(l);
          }
        return t;
      }
      l = e, e = l.parentNode;
    }
    return null;
  }
  function Na(l) {
    if (l = l[Ql] || l[Ea]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function yu(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(g(33));
  }
  function za(l) {
    var t = l[Qs];
    return t || (t = l[Qs] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function ql(l) {
    l[hu] = !0;
  }
  function Vs(l) {
    l[yn] = void 0;
  }
  var Zs = /* @__PURE__ */ new Set(), Ls = {};
  function ke(l, t) {
    Oa(l, t), Oa(l + "Capture", t);
  }
  function Oa(l, t) {
    for (Ls[l] = t, l = 0; l < t.length; l++)
      Zs.add(t[l]);
  }
  var _v = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ks = {}, Js = {};
  function jv(l) {
    return Zi.call(Js, l) ? !0 : Zi.call(Ks, l) ? !1 : _v.test(l) ? Js[l] = !0 : (Ks[l] = !0, !1);
  }
  var el = !1;
  function ws() {
    var l = el;
    return el = !1, l;
  }
  function Sn(l, t, e) {
    if (jv(t))
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
  function Tn(l, t, e) {
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
  function ae(l, t, e, a) {
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
  function rt(l) {
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
  function Fs(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Av(l, t, e) {
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
  function $i(l) {
    if (!l._valueTracker) {
      var t = Fs(l) ? "checked" : "value";
      l._valueTracker = Av(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function $s(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), a = "";
    return l && (a = Fs(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== e ? (t.setValue(l), !0) : !1;
  }
  var xv = /[\n"\\]/g;
  function zt(l) {
    return l.replace(
      xv,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Wi(l, t, e, a, u, n, i, c) {
    l.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? l.type = i : l.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + rt(t)) : l.value !== "" + rt(t) && (l.value = "" + rt(t)) : i !== "submit" && i !== "reset" || l.removeAttribute("value"), t != null ? i === "number" && l.value == t ? Ii(l, rt(l.value)) : Ii(l, rt(t)) : e != null ? Ii(l, rt(e)) : a != null && l.removeAttribute("value"), u == null && n != null && (l.defaultChecked = !!n), u != null && (l.checked = u && typeof u != "function" && typeof u != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.name = "" + rt(c) : l.removeAttribute("name");
  }
  function Ws(l, t, e, a, u, n, i, c) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || e != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        $i(l);
        return;
      }
      e = e != null ? "" + rt(e) : "", t = t != null ? "" + rt(t) : e, c || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = c ? l.checked : !!a, l.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (l.name = i), $i(l);
  }
  function Ii(l, t) {
    l.defaultValue !== "" + t && (l.defaultValue = "" + t);
  }
  function _a(l, t, e, a) {
    if (l = l.options, t) {
      t = {};
      for (var u = 0; u < e.length; u++)
        t["$" + e[u]] = !0;
      for (e = 0; e < l.length; e++)
        u = t.hasOwnProperty("$" + l[e].value), l[e].selected !== u && (l[e].selected = u), u && a && (l[e].defaultSelected = !0);
    } else {
      for (e = "" + rt(e), t = null, u = 0; u < l.length; u++) {
        if (l[u].value === e) {
          l[u].selected = !0, a && (l[u].defaultSelected = !0);
          return;
        }
        t !== null || l[u].disabled || (t = l[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Is(l, t, e) {
    if (t != null && (t = "" + rt(t), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + rt(e) : "";
  }
  function ks(l, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(g(92));
        if (al(a)) {
          if (1 < a.length) throw Error(g(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), t = e;
    }
    e = rt(t), l.defaultValue = e, a = l.textContent, a === e && a !== "" && a !== null && (l.value = a), $i(l);
  }
  function ja(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Dv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ps(l, t, e) {
    var a = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, e) : typeof e != "number" || e === 0 || Dv.has(t) ? t === "float" ? l.cssFloat = e : l[t] = ("" + e).trim() : l[t] = e + "px";
  }
  function lo(l, t, e) {
    if (t != null && typeof t != "object")
      throw Error(g(62));
    if (l = l.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "", el = !0);
      for (var u in t)
        a = t[u], t.hasOwnProperty(u) && e[u] !== a && (Ps(l, u, a), el = !0);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && Ps(l, n, t[n]);
  }
  function ki(l) {
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
  var Mv = /* @__PURE__ */ new Map([
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
  ]), pv = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function bn(l) {
    return pv.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Vt() {
  }
  var Pi = null;
  function lc(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Aa = null, xa = null;
  function to(l) {
    var t = Na(l);
    if (t && (l = t.stateNode)) {
      var e = l[et] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (Wi(
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
              'input[name="' + zt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var a = e[t];
              if (a !== l && a.form === l.form) {
                var u = a[et] || null;
                if (!u) throw Error(g(90));
                Wi(
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
              a = e[t], a.form === l.form && $s(a);
          }
          break l;
        case "textarea":
          Is(l, e.value, e.defaultValue);
          break l;
        case "select":
          t = e.value, t != null && _a(l, !!e.multiple, t, !1);
      }
    }
  }
  var tc = !1;
  function eo(l, t, e) {
    if (tc) return l(t, e);
    tc = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (tc = !1, (Aa !== null || xa !== null) && (bi(), Aa && (t = Aa, l = xa, xa = Aa = null, to(t), l)))
        for (t = 0; t < l.length; t++) to(l[t]);
    }
  }
  function gu(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var a = e[et] || null;
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
  var ue = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ec = !1;
  if (ue)
    try {
      var Su = {};
      Object.defineProperty(Su, "passive", {
        get: function() {
          ec = !0;
        }
      }), window.addEventListener("test", Su, Su), window.removeEventListener("test", Su, Su);
    } catch {
      ec = !1;
    }
  var Ee = null, ac = null, En = null;
  function ao() {
    if (En) return En;
    var l, t = ac, e = t.length, a, u = "value" in Ee ? Ee.value : Ee.textContent, n = u.length;
    for (l = 0; l < e && t[l] === u[l]; l++) ;
    var i = e - l;
    for (a = 1; a <= i && t[e - a] === u[n - a]; a++) ;
    return En = u.slice(l, 1 < a ? 1 - a : void 0);
  }
  function Nn(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function zn() {
    return !0;
  }
  function uo() {
    return !1;
  }
  function Il(l) {
    function t(e, a, u, n, i) {
      this._reactName = e, this._targetInst = u, this.type = a, this.nativeEvent = n, this.target = i, this.currentTarget = null;
      for (var c in l)
        l.hasOwnProperty(c) && (e = l[c], this[c] = e ? e(n) : n[c]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? zn : uo, this.isPropagationStopped = uo, this;
    }
    return X(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = zn);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = zn);
      },
      persist: function() {
      },
      isPersistent: zn
    }), t;
  }
  var Ne = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, On = Il(Ne), Tu = X({}, Ne, { view: 0, detail: 0 }), Cv = Il(Tu), uc, nc, bu, _n = X({}, Tu, {
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
    getModifierState: cc,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== bu && (bu && l.type === "mousemove" ? (uc = l.screenX - bu.screenX, nc = l.screenY - bu.screenY) : nc = uc = 0, bu = l), uc);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : nc;
    }
  }), no = Il(_n), Uv = X({}, _n, { dataTransfer: 0 }), Rv = Il(Uv), Hv = X({}, Tu, { relatedTarget: 0 }), ic = Il(Hv), qv = X({}, Ne, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Yv = Il(qv), Bv = X({}, Ne, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Gv = Il(Bv), Xv = X({}, Ne, { data: 0 }), io = Il(Xv), Qv = {
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
  }, Vv = {
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
  }, Zv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Lv(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = Zv[l]) ? !!t[l] : !1;
  }
  function cc() {
    return Lv;
  }
  var Kv = X({}, Tu, {
    key: function(l) {
      if (l.key) {
        var t = Qv[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Nn(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? Vv[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: cc,
    charCode: function(l) {
      return l.type === "keypress" ? Nn(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? Nn(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), Jv = Il(Kv), wv = X({}, _n, {
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
  }), co = Il(wv), Fv = X({}, Ne, { submitter: 0 }), $v = Il(Fv), Wv = X({}, Tu, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: cc
  }), Iv = Il(Wv), kv = X({}, Ne, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Pv = Il(kv), lm = X({}, _n, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), tm = Il(lm), em = X({}, Ne, {
    newState: 0,
    oldState: 0,
    source: 0
  }), am = Il(em), um = [9, 13, 27, 32], fc = ue && "CompositionEvent" in window, Eu = null;
  ue && "documentMode" in document && (Eu = document.documentMode);
  var nm = ue && "TextEvent" in window && !Eu, fo = ue && (!fc || Eu && 8 < Eu && 11 >= Eu), so = " ", oo = !1;
  function ro(l, t) {
    switch (l) {
      case "keyup":
        return um.indexOf(t.keyCode) !== -1;
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
  function vo(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Da = !1;
  function im(l, t) {
    switch (l) {
      case "compositionend":
        return vo(t);
      case "keypress":
        return t.which !== 32 ? null : (oo = !0, so);
      case "textInput":
        return l = t.data, l === so && oo ? null : l;
      default:
        return null;
    }
  }
  function cm(l, t) {
    if (Da)
      return l === "compositionend" || !fc && ro(l, t) ? (l = ao(), En = ac = Ee = null, Da = !1, l) : null;
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
        return fo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var fm = {
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
  function mo(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!fm[l.type] : t === "textarea";
  }
  function ho(l, t, e, a) {
    Aa ? xa ? xa.push(a) : xa = [a] : Aa = a, t = ji(t, "onChange"), 0 < t.length && (e = new On(
      "onChange",
      "change",
      null,
      e,
      a
    ), l.push({ event: e, listeners: t }));
  }
  var Nu = null, zu = null;
  function sm(l) {
    e0(l, 0);
  }
  function jn(l) {
    var t = yu(l);
    if ($s(t)) return l;
  }
  function yo(l, t) {
    if (l === "change") return t;
  }
  var go = !1;
  if (ue) {
    var sc;
    if (ue) {
      var oc = "oninput" in document;
      if (!oc) {
        var So = document.createElement("div");
        So.setAttribute("oninput", "return;"), oc = typeof So.oninput == "function";
      }
      sc = oc;
    } else sc = !1;
    go = sc && (!document.documentMode || 9 < document.documentMode);
  }
  function To() {
    Nu && (Nu.detachEvent("onpropertychange", bo), zu = Nu = null);
  }
  function bo(l) {
    if (l.propertyName === "value" && jn(zu)) {
      var t = [];
      ho(
        t,
        zu,
        l,
        lc(l)
      ), eo(sm, t);
    }
  }
  function om(l, t, e) {
    l === "focusin" ? (To(), Nu = t, zu = e, Nu.attachEvent("onpropertychange", bo)) : l === "focusout" && To();
  }
  function dm(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return jn(zu);
  }
  function rm(l, t) {
    if (l === "click") return jn(t);
  }
  function vm(l, t) {
    if (l === "input" || l === "change")
      return jn(t);
  }
  function mm(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var vt = typeof Object.is == "function" ? Object.is : mm;
  function Ou(l, t) {
    if (vt(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!Zi.call(t, u) || !vt(l[u], t[u]))
        return !1;
    }
    return !0;
  }
  function dc(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  function Eo(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function No(l, t) {
    var e = Eo(l);
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
      e = Eo(e);
    }
  }
  function zo(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? zo(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Oo(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = dc(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = dc(l.document);
    }
    return t;
  }
  function rc(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var hm = ue && "documentMode" in document && 11 >= document.documentMode, Ma = null, vc = null, _u = null, mc = !1;
  function _o(l, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    mc || Ma == null || Ma !== dc(a) || (a = Ma, "selectionStart" in a && rc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), _u && Ou(_u, a) || (_u = a, a = ji(vc, "onSelect"), 0 < a.length && (t = new On(
      "onSelect",
      "select",
      null,
      t,
      e
    ), l.push({ event: t, listeners: a }), t.target = Ma)));
  }
  function Pe(l, t) {
    var e = {};
    return e[l.toLowerCase()] = t.toLowerCase(), e["Webkit" + l] = "webkit" + t, e["Moz" + l] = "moz" + t, e;
  }
  var pa = {
    animationend: Pe("Animation", "AnimationEnd"),
    animationiteration: Pe("Animation", "AnimationIteration"),
    animationstart: Pe("Animation", "AnimationStart"),
    transitionrun: Pe("Transition", "TransitionRun"),
    transitionstart: Pe("Transition", "TransitionStart"),
    transitioncancel: Pe("Transition", "TransitionCancel"),
    transitionend: Pe("Transition", "TransitionEnd")
  }, hc = {}, jo = {};
  ue && (jo = document.createElement("div").style, "AnimationEvent" in window || (delete pa.animationend.animation, delete pa.animationiteration.animation, delete pa.animationstart.animation), "TransitionEvent" in window || delete pa.transitionend.transition);
  function la(l) {
    if (hc[l]) return hc[l];
    if (!pa[l]) return l;
    var t = pa[l], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in jo)
        return hc[l] = t[e];
    return l;
  }
  var Ao = la("animationend"), xo = la("animationiteration"), Do = la("animationstart"), ym = la("transitionrun"), gm = la("transitionstart"), Sm = la("transitioncancel"), Mo = la("transitionend"), po = /* @__PURE__ */ new Map(), yc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  yc.push("scrollEnd");
  function Ut(l, t) {
    po.set(l, t), ke(t, [l]);
  }
  var Tm = 0;
  function ne(l, t) {
    if (l.name != null && l.name !== "auto") return l.name;
    if (t.autoName !== null) return t.autoName;
    l = Yt.identifierPrefix;
    var e = Tm++;
    return l = "_" + l + "t_" + e.toString(32) + "_", t.autoName = l;
  }
  function Co(l) {
    if (l == null || typeof l == "string")
      return l;
    var t = null, e = Ia;
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
  function ie(l, t) {
    return l = Co(l), t = Co(t), t == null ? l === "auto" ? null : l : t === "auto" ? null : t;
  }
  var An = typeof reportError == "function" ? reportError : function(l) {
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
  }, Ot = [], Ca = 0, gc = 0;
  function xn() {
    for (var l = Ca, t = gc = Ca = 0; t < l; ) {
      var e = Ot[t];
      Ot[t++] = null;
      var a = Ot[t];
      Ot[t++] = null;
      var u = Ot[t];
      Ot[t++] = null;
      var n = Ot[t];
      if (Ot[t++] = null, a !== null && u !== null) {
        var i = a.pending;
        i === null ? u.next = u : (u.next = i.next, i.next = u), a.pending = u;
      }
      n !== 0 && Uo(e, u, n);
    }
  }
  function Dn(l, t, e, a) {
    Ot[Ca++] = l, Ot[Ca++] = t, Ot[Ca++] = e, Ot[Ca++] = a, gc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function Sc(l, t, e, a) {
    return Dn(l, t, e, a), Mn(l);
  }
  function ta(l, t) {
    return Dn(l, null, null, t), Mn(l);
  }
  function Uo(l, t, e) {
    l.lanes |= e;
    var a = l.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = l.return; n !== null; )
      n.childLanes |= e, a = n.alternate, a !== null && (a.childLanes |= e), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (u = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, u && t !== null && (u = 31 - dt(e), l = n.hiddenUpdates, a = l[u], a === null ? l[u] = [t] : a.push(t), t.lane = e | 536870912), n) : null;
  }
  function Mn(l) {
    if (50 < wu)
      throw wu = 0, Ti = null, Error(g(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Ua = {};
  function bm(l, t, e, a) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function at(l, t, e, a) {
    return new bm(l, t, e, a);
  }
  function Tc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function ce(l, t) {
    var e = l.alternate;
    return e === null ? (e = at(
      l.tag,
      t,
      l.key,
      l.mode
    ), e.elementType = l.elementType, e.type = l.type, e.stateNode = l.stateNode, e.alternate = l, l.alternate = e) : (e.pendingProps = t, e.type = l.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = l.flags & 1206910976, e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, t = l.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = l.sibling, e.index = l.index, e.ref = l.ref, e.refCleanup = l.refCleanup, e;
  }
  function Ro(l, t) {
    l.flags &= 1206910978;
    var e = l.alternate;
    return e === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.type = e.type, t = e.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function pn(l, t, e, a, u, n) {
    var i = 0;
    if (a = l, typeof a == "function") Tc(a) && (i = 1);
    else if (typeof a == "string")
      i = Fh(
        l,
        e,
        Qt.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (a) {
        case Ct:
          return l = at(31, e, t, u), l.elementType = Ct, l.lanes = n, l;
        case Nt:
          return ea(e.children, u, n, t);
        case ft:
          i = 8, u |= 24;
          break;
        case ge:
          return l = at(12, e, t, u | 2), l.elementType = ge, l.lanes = n, l;
        case H:
          return l = at(13, e, t, u), l.elementType = H, l.lanes = n, l;
        case q:
          return l = at(19, e, t, u), l.elementType = q, l.lanes = n, l;
        case le:
        case d:
          return l = u | 32, l = at(30, e, t, l), l.elementType = d, l.lanes = n, l.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, l;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case Hl:
                i = 10;
                break l;
              case Fe:
                i = 9;
                break l;
              case _:
                i = 11;
                break l;
              case vl:
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
    return t = at(i, e, t, u), t.elementType = l, t.type = a, t.lanes = n, t;
  }
  function ea(l, t, e, a) {
    return l = at(7, l, a, t), l.lanes = e, l;
  }
  function bc(l, t, e) {
    return l = at(6, l, null, t), l.lanes = e, l;
  }
  function Ho(l) {
    var t = at(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function Ec(l, t, e) {
    return t = at(
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
  var qo = /* @__PURE__ */ new WeakMap();
  function _t(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = qo.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: Ds(t)
      }, qo.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: Ds(t)
    };
  }
  var Ra = [], Ha = 0, Cn = null, ju = 0, jt = [], At = 0, ze = null, Zt = 1, Lt = "";
  function fe(l, t) {
    Ra[Ha++] = ju, Ra[Ha++] = Cn, Cn = l, ju = t;
  }
  function Yo(l, t, e) {
    jt[At++] = Zt, jt[At++] = Lt, jt[At++] = ze, ze = l;
    var a = Zt;
    l = Lt;
    var u = 32 - dt(a) - 1;
    a &= ~(1 << u), e += 1;
    var n = 32 - dt(t) + u;
    if (30 < n) {
      var i = u - u % 5;
      n = (a & (1 << i) - 1).toString(32), a >>= i, u -= i, Zt = 1 << 32 - dt(t) + u | e << u | a, Lt = n + l;
    } else
      Zt = 1 << n | e << u | a, Lt = l;
  }
  function Un(l) {
    l.return !== null && (fe(l, 1), Yo(l, 1, 0));
  }
  function Nc(l) {
    for (; l === Cn; )
      Cn = Ra[--Ha], Ra[Ha] = null, ju = Ra[--Ha], Ra[Ha] = null;
    for (; l === ze; )
      ze = jt[--At], jt[At] = null, Lt = jt[--At], jt[At] = null, Zt = jt[--At], jt[At] = null;
  }
  function Bo(l, t) {
    jt[At++] = Zt, jt[At++] = Lt, jt[At++] = ze, Zt = t.id, Lt = t.overflow, ze = l;
  }
  var Yl = null, Sl = null, J = !1, Oe = null, xt = !1, zc = Error(g(519));
  function _e(l) {
    var t = Error(
      g(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Au(_t(t, l)), zc;
  }
  function Go(l) {
    var t = l.stateNode, e = l.type, a = l.memoizedProps;
    switch (t[Ql] = l, t[et] = a, e) {
      case "dialog":
        $("cancel", t), $("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        $("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < $u.length; e++)
          $($u[e], t);
        break;
      case "source":
        $("error", t);
        break;
      case "img":
      case "image":
      case "link":
        $("error", t), $("load", t);
        break;
      case "details":
        $("toggle", t);
        break;
      case "input":
        $("invalid", t), Ws(
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
        $("invalid", t);
        break;
      case "textarea":
        $("invalid", t), ks(t, a.value, a.defaultValue, a.children);
    }
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || a.suppressHydrationWarning === !0 || i0(t.textContent, e) ? (a.popover != null && ($("beforetoggle", t), $("toggle", t)), a.onScroll != null && $("scroll", t), a.onScrollEnd != null && $("scrollend", t), a.onClick != null && (t.onclick = Vt), t = !0) : t = !1, t || _e(l, !0);
  }
  function Rn(l) {
    for (Yl = l.return; Yl; )
      switch (Yl.tag) {
        case 5:
        case 31:
        case 13:
          xt = !1;
          return;
        case 27:
        case 3:
          xt = !0;
          return;
        default:
          Yl = Yl.return;
      }
  }
  function qa(l) {
    if (l !== Yl) return !1;
    if (!J) return Rn(l), J = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || ls(l.type, l.memoizedProps)), e = !e), e && Sl && _e(l), Rn(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(g(317));
      Sl = _0(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(g(317));
      Sl = _0(l);
    } else
      t === 27 ? (t = Sl, Qe(l.type) ? (l = ss, ss = null, Sl = l) : Sl = t) : Sl = Yl ? Mt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function aa() {
    Sl = Yl = null, J = !1;
  }
  function Oc() {
    var l = Oe;
    return l !== null && (it === null ? it = l : it.push.apply(
      it,
      l
    ), Oe = null), l;
  }
  function Au(l) {
    Oe === null ? Oe = [l] : Oe.push(l);
  }
  var _c = Xt(null), ua = null, se = null;
  function je(l, t, e) {
    gl(_c, t._currentValue), t._currentValue = e;
  }
  function oe(l) {
    l._currentValue = _c.current, Xl(_c);
  }
  function Hn(l, t, e) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === e) break;
      l = l.return;
    }
  }
  function jc(l, t, e, a) {
    var u = l.child;
    for (u !== null && (u.return = l); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = u;
          for (var s = 0; s < t.length; s++)
            if (c.context === t[s]) {
              n.lanes |= e, c = n.alternate, c !== null && (c.lanes |= e), Hn(
                n.return,
                e,
                l
              ), a || (i = null);
              break l;
            }
          n = c.next;
        }
      } else if (u.tag === 18) {
        if (i = u.return, i === null) throw Error(g(341));
        i.lanes |= e, n = i.alternate, n !== null && (n.lanes |= e), Hn(i, e, l), i = null;
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null ? (u.lanes |= e, i = u.alternate, i !== null && (i.lanes |= e), Hn(
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
  function na(l, t, e, a) {
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
          var c = u.type;
          vt(u.pendingProps.value, i.value) || (l !== null ? l.push(c) : l = [c]);
        }
      } else if (u === fn.current) {
        if (i = u.alternate, i === null) throw Error(g(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (l !== null ? l.push(cu) : l = [cu]);
      }
      u = u.return;
    }
    return l !== null && jc(
      t,
      l,
      e,
      a
    ), t.flags |= 262144, l !== null;
  }
  function qn(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!vt(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function ia(l) {
    ua = l, se = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Vl(l) {
    return Xo(ua, l);
  }
  function Yn(l, t) {
    return ua === null && ia(l), Xo(l, t);
  }
  function Xo(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, se === null) {
      if (l === null) throw Error(g(308));
      se = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else se = se.next = t;
    return e;
  }
  var Em = typeof AbortController < "u" ? AbortController : function() {
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
  }, Nm = z.unstable_scheduleCallback, zm = z.unstable_NormalPriority, Al = {
    $$typeof: Hl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ac() {
    return {
      controller: new Em(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function xu(l) {
    l.refCount--, l.refCount === 0 && Nm(zm, function() {
      l.controller.abort();
    });
  }
  function Qo(l, t) {
    if ((l.pendingLanes & 4194048) !== 0) {
      var e = l.transitionTypes;
      for (e === null && (e = l.transitionTypes = []), l = 0; l < t.length; l++) {
        var a = t[l];
        e.indexOf(a) === -1 && e.push(a);
      }
    }
  }
  var Du = null;
  function Om(l) {
    var t = l.transitionTypes;
    return l.transitionTypes = null, t;
  }
  var Mu = null, xc = 0, ca = 0, Ya = null;
  function _m(l, t) {
    if (Mu === null) {
      var e = Mu = [];
      xc = 0, ca = Kf(), Ya = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return xc++, t.then(Vo, Vo), t;
  }
  function Vo() {
    if (--xc === 0 && (Du = null, Mu !== null)) {
      Ya !== null && (Ya.status = "fulfilled");
      var l = Mu;
      Mu = null, ca = 0, Ya = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function jm(l, t) {
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
  var Zo = x.S;
  x.S = function(l, t) {
    if (Hr = st(), typeof t == "object" && t !== null && typeof t.then == "function" && _m(l, t), Du !== null)
      for (var e = tu; e !== null; )
        Qo(e, Du), e = e.next;
    if (e = l.types, e !== null) {
      for (var a = tu; a !== null; )
        Qo(a, e), a = a.next;
      if (ca !== 0) {
        a = Du, a === null && (a = Du = []);
        for (var u = 0; u < e.length; u++) {
          var n = e[u];
          a.indexOf(n) === -1 && a.push(n);
        }
      }
    }
    Zo !== null && Zo(l, t);
  };
  var fa = Xt(null);
  function Dc() {
    var l = fa.current;
    return l !== null ? l : ml.pooledCache;
  }
  function Bn(l, t) {
    t === null ? gl(fa, fa.current) : gl(fa, t.pool);
  }
  function Lo() {
    var l = Dc();
    return l === null ? null : { parent: Al._currentValue, pool: l };
  }
  var Ba = Error(g(460)), Mc = Error(g(474)), Gn = Error(g(542)), Xn = { then: function() {
  } };
  function Ko(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Jo(l, t, e) {
    switch (e = l[e], e === void 0 ? l.push(t) : e !== t && (t.then(Vt, Vt), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Fo(l), l === void 0 && !("reason" in t) ? Error(g(600)) : l;
      default:
        if (typeof t.status == "string") t.then(Vt, Vt);
        else {
          if (l = ml, l !== null && 100 < l.shellSuspendCounter)
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
            throw l = t.reason, Fo(l), l;
        }
        throw oa = t, Ba;
    }
  }
  function sa(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (oa = e, Ba) : e;
    }
  }
  var oa = null;
  function wo() {
    if (oa === null) throw Error(g(459));
    var l = oa;
    return oa = null, l;
  }
  function Fo(l) {
    if (l === Ba || l === Gn)
      throw Error(g(483));
  }
  var Ga = null, pu = 0;
  function Qn(l) {
    var t = pu;
    return pu += 1, Ga === null && (Ga = []), Jo(Ga, l, t);
  }
  function Ae(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function Vn(l, t) {
    throw t.$$typeof === k ? Error(g(525)) : (l = Object.prototype.toString.call(t), Error(
      g(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function $o(l) {
    function t(v, o) {
      if (l) {
        var h = v.deletions;
        h === null ? (v.deletions = [o], v.flags |= 16) : h.push(o);
      }
    }
    function e(v, o) {
      if (!l) return null;
      for (; o !== null; )
        t(v, o), o = o.sibling;
      return null;
    }
    function a(v) {
      for (var o = /* @__PURE__ */ new Map(); v !== null; )
        v.key === null ? o.set(v.index, v) : o.set(v.key, v), v = v.sibling;
      return o;
    }
    function u(v, o) {
      return v = ce(v, o), v.index = 0, v.sibling = null, v;
    }
    function n(v, o, h) {
      return v.index = h, l ? (h = v.alternate, h !== null ? (h = h.index, h < o ? (v.flags |= 2, o) : h) : (v.flags |= 134217730, o)) : (v.flags |= 1048576, o);
    }
    function i(v) {
      return l && v.alternate === null && (v.flags |= 134217730), v;
    }
    function c(v, o, h, b) {
      return o === null || o.tag !== 6 ? (o = bc(h, v.mode, b), o.return = v, o) : (o = u(o, h), o.return = v, o);
    }
    function s(v, o, h, b) {
      var j = h.type;
      return j === Nt ? (v = S(
        v,
        o,
        h.props.children,
        b,
        h.key
      ), Ae(v, h), v) : o !== null && (o.elementType === j || typeof j == "object" && j !== null && j.$$typeof === nl && sa(j) === o.type) ? (o = u(o, h.props), Ae(o, h), o.return = v, o) : (o = pn(
        h.type,
        h.key,
        h.props,
        null,
        v.mode,
        b
      ), Ae(o, h), o.return = v, o);
    }
    function m(v, o, h, b) {
      return o === null || o.tag !== 4 || o.stateNode.containerInfo !== h.containerInfo || o.stateNode.implementation !== h.implementation ? (o = Ec(h, v.mode, b), o.return = v, o) : (o = u(o, h.children || []), o.return = v, o);
    }
    function S(v, o, h, b, j) {
      return o === null || o.tag !== 7 ? (o = ea(
        h,
        v.mode,
        b,
        j
      ), o.return = v, o) : (o = u(o, h), o.return = v, o);
    }
    function E(v, o, h) {
      if (typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint")
        return o = bc(
          "" + o,
          v.mode,
          h
        ), o.return = v, o;
      if (typeof o == "object" && o !== null) {
        switch (o.$$typeof) {
          case Gt:
            return h = pn(
              o.type,
              o.key,
              o.props,
              null,
              v.mode,
              h
            ), Ae(h, o), h.return = v, h;
          case Et:
            return o = Ec(
              o,
              v.mode,
              h
            ), o.return = v, o;
          case nl:
            return o = sa(o), E(v, o, h);
        }
        if (al(o) || p(o))
          return o = ea(
            o,
            v.mode,
            h,
            null
          ), o.return = v, o;
        if (typeof o.then == "function")
          return E(v, Qn(o), h);
        if (o.$$typeof === Hl)
          return E(
            v,
            Yn(v, o),
            h
          );
        Vn(v, o);
      }
      return null;
    }
    function r(v, o, h, b) {
      var j = o !== null ? o.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint")
        return j !== null ? null : c(v, o, "" + h, b);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Gt:
            return h.key === j ? s(v, o, h, b) : null;
          case Et:
            return h.key === j ? m(v, o, h, b) : null;
          case nl:
            return h = sa(h), r(v, o, h, b);
        }
        if (al(h) || p(h))
          return j !== null ? null : S(v, o, h, b, null);
        if (typeof h.then == "function")
          return r(
            v,
            o,
            Qn(h),
            b
          );
        if (h.$$typeof === Hl)
          return r(
            v,
            o,
            Yn(v, h),
            b
          );
        Vn(v, h);
      }
      return null;
    }
    function y(v, o, h, b, j) {
      if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint")
        return v = v.get(h) || null, c(o, v, "" + b, j);
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case Gt:
            return v = v.get(
              b.key === null ? h : b.key
            ) || null, s(o, v, b, j);
          case Et:
            return v = v.get(
              b.key === null ? h : b.key
            ) || null, m(o, v, b, j);
          case nl:
            return b = sa(b), y(
              v,
              o,
              h,
              b,
              j
            );
        }
        if (al(b) || p(b))
          return v = v.get(h) || null, S(o, v, b, j, null);
        if (typeof b.then == "function")
          return y(
            v,
            o,
            h,
            Qn(b),
            j
          );
        if (b.$$typeof === Hl)
          return y(
            v,
            o,
            h,
            Yn(o, b),
            j
          );
        Vn(o, b);
      }
      return null;
    }
    function O(v, o, h, b) {
      for (var j = null, I = null, D = o, R = o = 0, Ml = null; D !== null && R < h.length; R++) {
        D.index > R ? (Ml = D, D = null) : Ml = D.sibling;
        var P = r(
          v,
          D,
          h[R],
          b
        );
        if (P === null) {
          D === null && (D = Ml);
          break;
        }
        l && D && P.alternate === null && t(v, D), o = n(P, o, R), I === null ? j = P : I.sibling = P, I = P, D = Ml;
      }
      if (R === h.length)
        return e(v, D), J && fe(v, R), j;
      if (D === null) {
        for (; R < h.length; R++)
          D = E(v, h[R], b), D !== null && (o = n(
            D,
            o,
            R
          ), I === null ? j = D : I.sibling = D, I = D);
        return J && fe(v, R), j;
      }
      for (D = a(D); R < h.length; R++)
        Ml = y(
          D,
          v,
          R,
          h[R],
          b
        ), Ml !== null && (l && (P = Ml.alternate, P !== null && D.delete(P.key === null ? R : P.key)), o = n(
          Ml,
          o,
          R
        ), I === null ? j = Ml : I.sibling = Ml, I = Ml);
      return l && D.forEach(function(Je) {
        return t(v, Je);
      }), J && fe(v, R), j;
    }
    function A(v, o, h, b) {
      if (h == null) throw Error(g(151));
      for (var j = null, I = null, D = o, R = o = 0, Ml = null, P = h.next(); D !== null && !P.done; R++, P = h.next()) {
        D.index > R ? (Ml = D, D = null) : Ml = D.sibling;
        var Je = r(v, D, P.value, b);
        if (Je === null) {
          D === null && (D = Ml);
          break;
        }
        l && D && Je.alternate === null && t(v, D), o = n(Je, o, R), I === null ? j = Je : I.sibling = Je, I = Je, D = Ml;
      }
      if (P.done)
        return e(v, D), J && fe(v, R), j;
      if (D === null) {
        for (; !P.done; R++, P = h.next())
          P = E(v, P.value, b), P !== null && (o = n(P, o, R), I === null ? j = P : I.sibling = P, I = P);
        return J && fe(v, R), j;
      }
      for (D = a(D); !P.done; R++, P = h.next())
        P = y(D, v, R, P.value, b), P !== null && (l && (Ml = P.alternate, Ml !== null && D.delete(
          Ml.key === null ? R : Ml.key
        )), o = n(P, o, R), I === null ? j = P : I.sibling = P, I = P);
      return l && D.forEach(function(i1) {
        return t(v, i1);
      }), J && fe(v, R), j;
    }
    function V(v, o, h, b) {
      if (typeof h == "object" && h !== null && h.type === Nt && h.key === null && h.props.ref === void 0 && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Gt:
            l: {
              for (var j = h.key; o !== null; ) {
                if (o.key === j) {
                  if (j = h.type, j === Nt) {
                    if (o.tag === 7) {
                      e(
                        v,
                        o.sibling
                      ), b = u(
                        o,
                        h.props.children
                      ), Ae(b, h), b.return = v, v = b;
                      break l;
                    }
                  } else if (o.elementType === j || typeof j == "object" && j !== null && j.$$typeof === nl && sa(j) === o.type) {
                    e(
                      v,
                      o.sibling
                    ), b = u(o, h.props), Ae(b, h), b.return = v, v = b;
                    break l;
                  }
                  e(v, o);
                  break;
                } else t(v, o);
                o = o.sibling;
              }
              h.type === Nt ? (b = ea(
                h.props.children,
                v.mode,
                b,
                h.key
              ), Ae(b, h), b.return = v, v = b) : (b = pn(
                h.type,
                h.key,
                h.props,
                null,
                v.mode,
                b
              ), Ae(b, h), b.return = v, v = b);
            }
            return i(v);
          case Et:
            l: {
              for (j = h.key; o !== null; ) {
                if (o.key === j)
                  if (o.tag === 4 && o.stateNode.containerInfo === h.containerInfo && o.stateNode.implementation === h.implementation) {
                    e(
                      v,
                      o.sibling
                    ), b = u(o, h.children || []), b.return = v, v = b;
                    break l;
                  } else {
                    e(v, o);
                    break;
                  }
                else t(v, o);
                o = o.sibling;
              }
              b = Ec(h, v.mode, b), b.return = v, v = b;
            }
            return i(v);
          case nl:
            return h = sa(h), V(
              v,
              o,
              h,
              b
            );
        }
        if (al(h))
          return O(
            v,
            o,
            h,
            b
          );
        if (p(h)) {
          if (j = p(h), typeof j != "function") throw Error(g(150));
          return h = j.call(h), A(
            v,
            o,
            h,
            b
          );
        }
        if (typeof h.then == "function")
          return V(
            v,
            o,
            Qn(h),
            b
          );
        if (h.$$typeof === Hl)
          return V(
            v,
            o,
            Yn(v, h),
            b
          );
        Vn(v, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint" ? (h = "" + h, o !== null && o.tag === 6 ? (e(v, o.sibling), b = u(o, h), b.return = v, v = b) : (e(v, o), b = bc(h, v.mode, b), b.return = v, v = b), i(v)) : e(v, o);
    }
    return function(v, o, h, b) {
      try {
        pu = 0;
        var j = V(
          v,
          o,
          h,
          b
        );
        return Ga = null, j;
      } catch (D) {
        if (D === Ba || D === Gn) throw D;
        var I = at(29, D, null, v.mode);
        return I.lanes = b, I.return = v, I;
      }
    };
  }
  var da = $o(!0), Wo = $o(!1), xe = !1;
  function pc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Cc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function De(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Me(l, t, e) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ul & 2) !== 0) {
      var u = a.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), a.pending = t, t = Mn(l), Uo(l, null, e), t;
    }
    return Dn(l, a, t, e), Mn(l);
  }
  function Cu(l, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, qs(l, e);
    }
  }
  function Uc(l, t) {
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
  var Rc = !1;
  function Uu() {
    if (Rc) {
      var l = Ya;
      if (l !== null) throw l;
    }
  }
  function Ru(l, t, e, a) {
    Rc = !1;
    var u = l.updateQueue;
    xe = !1;
    var n = u.firstBaseUpdate, i = u.lastBaseUpdate, c = u.shared.pending;
    if (c !== null) {
      u.shared.pending = null;
      var s = c, m = s.next;
      s.next = null, i === null ? n = m : i.next = m, i = s;
      var S = l.alternate;
      S !== null && (S = S.updateQueue, c = S.lastBaseUpdate, c !== i && (c === null ? S.firstBaseUpdate = m : c.next = m, S.lastBaseUpdate = s));
    }
    if (n !== null) {
      var E = u.baseState;
      i = 0, S = m = s = null, c = n;
      do {
        var r = c.lane & -536870913, y = r !== c.lane;
        if (y ? (W & r) === r : (a & r) === r) {
          r !== 0 && r === ca && (Rc = !0), S !== null && (S = S.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          l: {
            var O = l, A = c;
            r = t;
            var V = e;
            switch (A.tag) {
              case 1:
                if (O = A.payload, typeof O == "function") {
                  E = O.call(V, E, r);
                  break l;
                }
                E = O;
                break l;
              case 3:
                O.flags = O.flags & -65537 | 128;
              case 0:
                if (O = A.payload, r = typeof O == "function" ? O.call(V, E, r) : O, r == null) break l;
                E = X({}, E, r);
                break l;
              case 2:
                xe = !0;
            }
          }
          r = c.callback, r !== null && (l.flags |= 64, y && (l.flags |= 8192), y = u.callbacks, y === null ? u.callbacks = [r] : y.push(r));
        } else
          y = {
            lane: r,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          }, S === null ? (m = S = y, s = E) : S = S.next = y, i |= r;
        if (c = c.next, c === null) {
          if (c = u.shared.pending, c === null)
            break;
          y = c, c = y.next, y.next = null, u.lastBaseUpdate = y, u.shared.pending = null;
        }
      } while (!0);
      S === null && (s = E), u.baseState = s, u.firstBaseUpdate = m, u.lastBaseUpdate = S, n === null && (u.shared.lanes = 0), Ye |= i, l.lanes = i, l.memoizedState = E;
    }
  }
  function Io(l, t) {
    if (typeof l != "function")
      throw Error(g(191, l));
    l.call(t);
  }
  function ko(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++)
        Io(e[l], t);
  }
  var pe = Xt(null), Zn = Xt(0);
  function Po(l, t) {
    l = he, gl(Zn, l), gl(pe, t), he = l | t.baseLanes;
  }
  function Hc() {
    gl(Zn, he), gl(pe, pe.current);
  }
  function qc() {
    he = Zn.current, Xl(pe), Xl(Zn);
  }
  var Zl = Xt(null), $l = null;
  function Ce(l) {
    var t = l.alternate;
    gl(Ll, Ll.current & 1), gl(Zl, l), $l === null && (t === null || pe.current !== null || t.memoizedState !== null) && ($l = l);
  }
  function Yc(l) {
    gl(Ll, Ll.current), gl(Zl, l), $l === null && ($l = l);
  }
  function ld(l) {
    l.tag === 22 ? (gl(Ll, Ll.current), gl(Zl, l), $l === null && ($l = l)) : Ue();
  }
  function Ue() {
    gl(Ll, Ll.current), gl(Zl, Zl.current);
  }
  function mt(l) {
    Xl(Zl), $l === l && ($l = null), Xl(Ll);
  }
  var Ll = Xt(0);
  function Hu(l, t) {
    gl(Zl, Zl.current), gl(Ll, t);
  }
  function Bc(l) {
    Xl(Ll), Xl(Zl), $l === l && ($l = null);
  }
  function Ln(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || cs(e) || fs(e)))
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
  var de = 0, Q = null, rl = null, xl = null, Kn = !1, Xa = !1, ra = !1, Jn = 0, qu = 0, Qa = null, Am = 0;
  function zl() {
    throw Error(g(321));
  }
  function Gc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!vt(l[e], t[e])) return !1;
    return !0;
  }
  function Xc(l, t, e, a, u, n) {
    return de = n, Q = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, x.H = l === null || l.memoizedState === null ? Yd : Bd, ra = !1, n = e(a, u), ra = !1, Xa && (n = ed(
      t,
      e,
      a,
      u
    )), td(l), n;
  }
  function td(l) {
    x.H = Pn;
    var t = rl !== null && rl.next !== null;
    if (de = 0, xl = rl = Q = null, Kn = !1, qu = 0, Qa = null, t) throw Error(g(300));
    l === null || Dl || (l = l.dependencies, l !== null && qn(l) && (Dl = !0));
  }
  function ed(l, t, e, a) {
    Q = l;
    var u = 0;
    do {
      if (Xa && (Qa = null), qu = 0, Xa = !1, 25 <= u) throw Error(g(301));
      if (u += 1, xl = rl = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      x.H = Hm, n = t(e, a);
    } while (Xa);
    return n;
  }
  function xm() {
    var l = x.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Yu(t) : t, l = l.useState()[0], (rl !== null ? rl.memoizedState : null) !== l && (Q.flags |= 1024), t;
  }
  function Qc() {
    var l = Jn !== 0;
    return Jn = 0, l;
  }
  function Vc(l, t, e) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~e;
  }
  function Zc(l) {
    if (Kn) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      Kn = !1;
    }
    de = 0, xl = rl = Q = null, Xa = !1, qu = Jn = 0, Qa = null;
  }
  function kl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return xl === null ? Q.memoizedState = xl = l : xl = xl.next = l, xl;
  }
  function jl() {
    if (rl === null) {
      var l = Q.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = rl.next;
    var t = xl === null ? Q.memoizedState : xl.next;
    if (t !== null)
      xl = t, rl = l;
    else {
      if (l === null)
        throw Q.alternate === null ? Error(g(467)) : Error(g(310));
      rl = l, l = {
        memoizedState: rl.memoizedState,
        baseState: rl.baseState,
        baseQueue: rl.baseQueue,
        queue: rl.queue,
        next: null
      }, xl === null ? Q.memoizedState = xl = l : xl = xl.next = l;
    }
    return xl;
  }
  function wn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Yu(l) {
    var t = qu;
    return qu += 1, Qa === null && (Qa = []), l = Jo(Qa, l, t), t = Q, (xl === null ? t.memoizedState : xl.next) === null && (t = t.alternate, x.H = t === null || t.memoizedState === null ? Yd : Bd), l;
  }
  function Fn(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Yu(l);
      if (l.$$typeof === N) return;
      if (l.$$typeof === Hl) return Vl(l);
    }
    throw Error(g(438, String(l)));
  }
  function Lc(l) {
    var t = null, e = Q.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var a = Q.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = wn(), Q.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), a = 0; a < l; a++)
        e[a] = $e;
    return t.index++, e;
  }
  function re(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function $n(l) {
    var t = jl();
    return Kc(t, rl, l);
  }
  function Kc(l, t, e) {
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
      var c = i = null, s = null, m = t, S = !1;
      do {
        var E = m.lane & -536870913;
        if (E !== m.lane ? (W & E) === E : (de & E) === E) {
          var r = m.revertLane;
          if (r === 0)
            s !== null && (s = s.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }), E === ca && (S = !0);
          else if ((de & r) === r) {
            m = m.next, r === ca && (S = !0);
            continue;
          } else
            E = {
              lane: 0,
              revertLane: m.revertLane,
              gesture: null,
              action: m.action,
              hasEagerState: m.hasEagerState,
              eagerState: m.eagerState,
              next: null
            }, s === null ? (c = s = E, i = n) : s = s.next = E, Q.lanes |= r, Ye |= r;
          E = m.action, ra && e(n, E), n = m.hasEagerState ? m.eagerState : e(n, E);
        } else
          r = {
            lane: E,
            revertLane: m.revertLane,
            gesture: m.gesture,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          }, s === null ? (c = s = r, i = n) : s = s.next = r, Q.lanes |= E, Ye |= E;
        m = m.next;
      } while (m !== null && m !== t);
      if (s === null ? i = n : s.next = c, !vt(n, l.memoizedState) && (Dl = !0, S && (e = Ya, e !== null)))
        throw e;
      l.memoizedState = n, l.baseState = i, l.baseQueue = s, a.lastRenderedState = n;
    }
    return u === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function Jc(l) {
    var t = jl(), e = t.queue;
    if (e === null) throw Error(g(311));
    e.lastRenderedReducer = l;
    var a = e.dispatch, u = e.pending, n = t.memoizedState;
    if (u !== null) {
      e.pending = null;
      var i = u = u.next;
      do
        n = l(n, i.action), i = i.next;
      while (i !== u);
      vt(n, t.memoizedState) || (Dl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), e.lastRenderedState = n;
    }
    return [n, a];
  }
  function ad(l, t, e) {
    var a = Q, u = jl(), n = J;
    if (n) {
      if (e === void 0) throw Error(g(407));
      e = e();
    } else e = t();
    var i = !vt(
      (rl || u).memoizedState,
      e
    );
    if (i && (u.memoizedState = e, Dl = !0), u = u.queue, $c(id.bind(null, a, u, l), [
      l
    ]), l = u.getSnapshot !== t || i || xl !== null && (xl.memoizedState.tag & 1) !== 0, Va(
      l ? 9 : 8,
      { destroy: void 0 },
      nd.bind(null, a, u, e, t),
      null
    ), l) {
      if (a.flags |= 2048, ml === null) throw Error(g(349));
      n || (de & 127) !== 0 || ud(a, t, e);
    }
    return e;
  }
  function ud(l, t, e) {
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = Q.updateQueue, t === null ? (t = wn(), Q.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
  }
  function nd(l, t, e, a) {
    t.value = e, t.getSnapshot = a, cd(t) && fd(l);
  }
  function id(l, t, e) {
    return e(function() {
      cd(t) && fd(l);
    });
  }
  function cd(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !vt(l, e);
    } catch {
      return !0;
    }
  }
  function fd(l) {
    var t = ta(l, 2);
    t !== null && ct(t, l, 2);
  }
  function wc(l) {
    var t = kl();
    if (typeof l == "function") {
      var e = l;
      if (l = e(), ra) {
        be(!0);
        try {
          e();
        } finally {
          be(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: re,
      lastRenderedState: l
    }, t;
  }
  function sd(l, t, e, a) {
    return l.baseState = e, Kc(
      l,
      rl,
      typeof a == "function" ? a : re
    );
  }
  function Dm(l, t, e, a, u) {
    if (kn(l)) throw Error(g(485));
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
      x.T !== null ? e(!0) : n.isTransition = !1, a(n), e = t.pending, e === null ? (n.next = t.pending = n, od(t, n)) : (n.next = e.next, t.pending = e.next = n);
    }
  }
  function od(l, t) {
    var e = t.action, a = t.payload, u = l.state;
    if (t.isTransition) {
      var n = x.T, i = {};
      i.types = n !== null ? n.types : null, x.T = i;
      try {
        var c = e(u, a), s = x.S;
        s !== null && s(i, c), dd(l, t, c);
      } catch (m) {
        Fc(l, t, m);
      } finally {
        n !== null && i.types !== null && (n.types = i.types), x.T = n;
      }
    } else
      try {
        n = e(u, a), dd(l, t, n);
      } catch (m) {
        Fc(l, t, m);
      }
  }
  function dd(l, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(a) {
        rd(l, t, a);
      },
      function(a) {
        return Fc(l, t, a);
      }
    ) : rd(l, t, e);
  }
  function rd(l, t, e) {
    t.status = "fulfilled", t.value = e, vd(t), l.state = e, t = l.pending, t !== null && (e = t.next, e === t ? l.pending = null : (e = e.next, t.next = e, od(l, e)));
  }
  function Fc(l, t, e) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = e, vd(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function vd(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function md(l, t) {
    return t;
  }
  function hd(l, t) {
    if (J) {
      var e = ml.formState;
      if (e !== null) {
        l: {
          var a = Q;
          if (J) {
            if (Sl) {
              t: {
                for (var u = Sl, n = xt; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break t;
                  }
                  if (u = Mt(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break t;
                  }
                }
                n = u.data, u = n === "F!" || n === "F" ? u : null;
              }
              if (u) {
                Sl = Mt(
                  u.nextSibling
                ), a = u.data === "F!";
                break l;
              }
            }
            _e(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return e = kl(), e.memoizedState = e.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: md,
      lastRenderedState: t
    }, e.queue = a, e = Rd.bind(
      null,
      Q,
      a
    ), a.dispatch = e, a = wc(!1), n = lf.bind(
      null,
      Q,
      !1,
      a.queue
    ), a = kl(), u = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = u, e = Dm.bind(
      null,
      Q,
      u,
      n,
      e
    ), u.dispatch = e, a.memoizedState = l, [t, e, !1];
  }
  function yd(l) {
    var t = jl();
    return gd(t, rl, l);
  }
  function gd(l, t, e) {
    if (t = Kc(
      l,
      t,
      md
    )[0], l = $n(re)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Yu(t);
      } catch (i) {
        throw i === Ba ? Gn : i;
      }
    else a = t;
    t = jl();
    var u = t.queue, n = u.dispatch;
    return e !== t.memoizedState && (Q.flags |= 2048, Va(
      9,
      { destroy: void 0 },
      Mm.bind(null, u, e),
      null
    )), [a, n, l];
  }
  function Mm(l, t) {
    l.action = t;
  }
  function Sd(l) {
    var t = jl(), e = rl;
    if (e !== null)
      return gd(t, e, l);
    jl(), t = t.memoizedState, e = jl();
    var a = e.queue.dispatch;
    return e.memoizedState = l, [t, a, !1];
  }
  function Va(l, t, e, a) {
    return l = { tag: l, create: e, deps: a, inst: t, next: null }, t = Q.updateQueue, t === null && (t = wn(), Q.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (a = e.next, e.next = l, l.next = a, t.lastEffect = l), l;
  }
  function Td() {
    return jl().memoizedState;
  }
  function Wn(l, t, e, a) {
    var u = kl();
    Q.flags |= l, u.memoizedState = Va(
      1 | t,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function In(l, t, e, a) {
    var u = jl();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    rl !== null && a !== null && Gc(a, rl.memoizedState.deps) ? u.memoizedState = Va(t, n, e, a) : (Q.flags |= l, u.memoizedState = Va(
      1 | t,
      n,
      e,
      a
    ));
  }
  function bd(l, t) {
    Wn(8390656, 8, l, t);
  }
  function $c(l, t) {
    In(2048, 8, l, t);
  }
  function pm(l) {
    Q.flags |= 4;
    var t = Q.updateQueue;
    if (t === null)
      t = wn(), Q.updateQueue = t, t.events = [l];
    else {
      var e = t.events;
      e === null ? t.events = [l] : e.push(l);
    }
  }
  function Ed(l) {
    var t = jl().memoizedState;
    return pm({ ref: t, nextImpl: l }), function() {
      if ((ul & 2) !== 0) throw Error(g(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Nd(l, t) {
    return In(4, 2, l, t);
  }
  function zd(l, t) {
    return In(4, 4, l, t);
  }
  function Od(l, t) {
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
  function _d(l, t, e) {
    e = e != null ? e.concat([l]) : null, In(4, 4, Od.bind(null, t, l), e);
  }
  function Wc() {
  }
  function jd(l, t) {
    var e = jl();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && Gc(t, a[1]) ? a[0] : (e.memoizedState = [l, t], l);
  }
  function Ad(l, t) {
    var e = jl();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && Gc(t, a[1]))
      return a[0];
    if (a = l(), ra) {
      be(!0);
      try {
        l();
      } finally {
        be(!1);
      }
    }
    return e.memoizedState = [a, t], a;
  }
  function Ic(l, t, e) {
    return e === void 0 || (de & 1073741824) !== 0 && (W & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = e, l = Yr(), Q.lanes |= l, Ye |= l, e);
  }
  function xd(l, t, e, a) {
    return vt(e, t) ? e : pe.current !== null ? (l = Ic(l, e, a), vt(l, t) || (Dl = !0), l) : (de & 106) === 0 || (de & 1073741824) !== 0 && (W & 261930) === 0 ? (Dl = !0, l.memoizedState = e) : (l = Yr(), Q.lanes |= l, Ye |= l, t);
  }
  function Dd(l, t, e, a, u) {
    var n = Y.p;
    Y.p = n !== 0 && 8 > n ? n : 8;
    var i = x.T, c = {};
    c.types = i !== null ? i.types : null, x.T = c, lf(l, !1, t, e);
    try {
      var s = u(), m = x.S;
      if (m !== null && m(c, s), s !== null && typeof s == "object" && typeof s.then == "function") {
        var S = jm(
          s,
          a
        );
        Bu(
          l,
          t,
          S,
          St(l)
        );
      } else
        Bu(
          l,
          t,
          a,
          St(l)
        );
    } catch (E) {
      Bu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: E },
        St()
      );
    } finally {
      Y.p = n, i !== null && c.types !== null && (i.types = c.types), x.T = i;
    }
  }
  function Cm() {
  }
  function kc(l, t, e, a) {
    if (l.tag !== 5) throw Error(g(476));
    var u = Md(l).queue;
    Dd(
      l,
      u,
      t,
      te,
      e === null ? Cm : function() {
        return pd(l), e(a);
      }
    );
  }
  function Md(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: te,
      baseState: te,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: re,
        lastRenderedState: te
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
        lastRenderedReducer: re,
        lastRenderedState: e
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function pd(l) {
    var t = Md(l);
    t.next === null && (t = l.alternate.memoizedState), Bu(
      l,
      t.next.queue,
      {},
      St()
    );
  }
  function Pc() {
    return Vl(cu);
  }
  function Cd() {
    return jl().memoizedState;
  }
  function Ud() {
    return jl().memoizedState;
  }
  function Um(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = St();
          l = De(e);
          var a = Me(t, l, e);
          a !== null && (ct(a, t, e), Cu(a, t, e)), t = { cache: Ac() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Rm(l, t, e) {
    var a = St();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, kn(l) ? Hd(t, e) : (e = Sc(l, t, e, a), e !== null && (ct(e, l, a), qd(e, t, a)));
  }
  function Rd(l, t, e) {
    var a = St();
    Bu(l, t, e, a);
  }
  function Bu(l, t, e, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (kn(l)) Hd(t, u);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var i = t.lastRenderedState, c = n(i, e);
          if (u.hasEagerState = !0, u.eagerState = c, vt(c, i))
            return Dn(l, t, u, 0), ml === null && xn(), !1;
        } catch {
        }
      if (e = Sc(l, t, u, a), e !== null)
        return ct(e, l, a), qd(e, t, a), !0;
    }
    return !1;
  }
  function lf(l, t, e, a) {
    if (a = {
      lane: 2,
      revertLane: Kf(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, kn(l)) {
      if (t) throw Error(g(479));
    } else
      t = Sc(
        l,
        e,
        a,
        2
      ), t !== null && ct(t, l, 2);
  }
  function kn(l) {
    var t = l.alternate;
    return l === Q || t !== null && t === Q;
  }
  function Hd(l, t) {
    Xa = Kn = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function qd(l, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, qs(l, e);
    }
  }
  var Pn = {
    readContext: Vl,
    use: Fn,
    useCallback: zl,
    useContext: zl,
    useEffect: zl,
    useImperativeHandle: zl,
    useLayoutEffect: zl,
    useInsertionEffect: zl,
    useMemo: zl,
    useReducer: zl,
    useRef: zl,
    useState: zl,
    useDebugValue: zl,
    useDeferredValue: zl,
    useTransition: zl,
    useSyncExternalStore: zl,
    useId: zl,
    useHostTransitionStatus: zl,
    useFormState: zl,
    useActionState: zl,
    useOptimistic: zl,
    useMemoCache: zl,
    useCacheRefresh: zl,
    useEffectEvent: zl
  }, Yd = {
    readContext: Vl,
    use: Fn,
    useCallback: function(l, t) {
      return kl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Vl,
    useEffect: bd,
    useImperativeHandle: function(l, t, e) {
      e = e != null ? e.concat([l]) : null, Wn(
        4194308,
        4,
        Od.bind(null, t, l),
        e
      );
    },
    useLayoutEffect: function(l, t) {
      return Wn(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      Wn(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var e = kl();
      t = t === void 0 ? null : t;
      var a = l();
      if (ra) {
        be(!0);
        try {
          l();
        } finally {
          be(!1);
        }
      }
      return e.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, e) {
      var a = kl();
      if (e !== void 0) {
        var u = e(t);
        if (ra) {
          be(!0);
          try {
            e(t);
          } finally {
            be(!1);
          }
        }
      } else u = t;
      return a.memoizedState = a.baseState = u, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: u
      }, a.queue = l, l = l.dispatch = Rm.bind(
        null,
        Q,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = kl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = wc(l);
      var t = l.queue, e = Rd.bind(null, Q, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: Wc,
    useDeferredValue: function(l, t) {
      var e = kl();
      return Ic(e, l, t);
    },
    useTransition: function() {
      var l = wc(!1);
      return l = Dd.bind(
        null,
        Q,
        l.queue,
        !0,
        !1
      ), kl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var a = Q, u = kl();
      if (J) {
        if (e === void 0)
          throw Error(g(407));
        e = e();
      } else {
        if (e = t(), ml === null)
          throw Error(g(349));
        (W & 127) !== 0 || ud(a, t, e);
      }
      u.memoizedState = e;
      var n = { value: e, getSnapshot: t };
      return u.queue = n, bd(id.bind(null, a, n, l), [
        l
      ]), a.flags |= 2048, Va(
        9,
        { destroy: void 0 },
        nd.bind(
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
      var l = kl(), t = ml.identifierPrefix;
      if (J) {
        var e = Lt, a = Zt;
        e = (a & ~(1 << 32 - dt(a) - 1)).toString(32) + e, t = "_" + t + "R_" + e, e = Jn++, 0 < e && (t += "H" + e.toString(32)), t += "_";
      } else
        e = Am++, t = "_" + t + "r_" + e.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: Pc,
    useFormState: hd,
    useActionState: hd,
    useOptimistic: function(l) {
      var t = kl();
      t.memoizedState = t.baseState = l;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = lf.bind(
        null,
        Q,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: Lc,
    useCacheRefresh: function() {
      return kl().memoizedState = Um.bind(
        null,
        Q
      );
    },
    useEffectEvent: function(l) {
      var t = kl(), e = { impl: l };
      return t.memoizedState = e, function() {
        if ((ul & 2) !== 0)
          throw Error(g(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, Bd = {
    readContext: Vl,
    use: Fn,
    useCallback: jd,
    useContext: Vl,
    useEffect: $c,
    useImperativeHandle: _d,
    useInsertionEffect: Nd,
    useLayoutEffect: zd,
    useMemo: Ad,
    useReducer: $n,
    useRef: Td,
    useState: function() {
      return $n(re);
    },
    useDebugValue: Wc,
    useDeferredValue: function(l, t) {
      var e = jl();
      return xd(
        e,
        rl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = $n(re)[0], t = jl().memoizedState;
      return [
        typeof l == "boolean" ? l : Yu(l),
        t
      ];
    },
    useSyncExternalStore: ad,
    useId: Cd,
    useHostTransitionStatus: Pc,
    useFormState: yd,
    useActionState: yd,
    useOptimistic: function(l, t) {
      var e = jl();
      return sd(e, rl, l, t);
    },
    useMemoCache: Lc,
    useCacheRefresh: Ud,
    useEffectEvent: Ed
  }, Hm = {
    readContext: Vl,
    use: Fn,
    useCallback: jd,
    useContext: Vl,
    useEffect: $c,
    useImperativeHandle: _d,
    useInsertionEffect: Nd,
    useLayoutEffect: zd,
    useMemo: Ad,
    useReducer: Jc,
    useRef: Td,
    useState: function() {
      return Jc(re);
    },
    useDebugValue: Wc,
    useDeferredValue: function(l, t) {
      var e = jl();
      return rl === null ? Ic(e, l, t) : xd(
        e,
        rl.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = Jc(re)[0], t = jl().memoizedState;
      return [
        typeof l == "boolean" ? l : Yu(l),
        t
      ];
    },
    useSyncExternalStore: ad,
    useId: Cd,
    useHostTransitionStatus: Pc,
    useFormState: Sd,
    useActionState: Sd,
    useOptimistic: function(l, t) {
      var e = jl();
      return rl !== null ? sd(e, rl, l, t) : (e.baseState = l, [l, e.queue.dispatch]);
    },
    useMemoCache: Lc,
    useCacheRefresh: Ud,
    useEffectEvent: Ed
  };
  function tf(l, t, e, a) {
    t = l.memoizedState, e = e(a, t), e = e == null ? t : X({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var ef = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var a = St(), u = De(a);
      u.payload = t, e != null && (u.callback = e), t = Me(l, u, a), t !== null && (ct(t, l, a), Cu(t, l, a));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var a = St(), u = De(a);
      u.tag = 1, u.payload = t, e != null && (u.callback = e), t = Me(l, u, a), t !== null && (ct(t, l, a), Cu(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = St(), a = De(e);
      a.tag = 2, t != null && (a.callback = t), t = Me(l, a, e), t !== null && (ct(t, l, e), Cu(t, l, e));
    }
  };
  function Gd(l, t, e, a, u, n, i) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, n, i) : t.prototype && t.prototype.isPureReactComponent ? !Ou(e, a) || !Ou(u, n) : !0;
  }
  function Xd(l, t, e, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, a), t.state !== l && ef.enqueueReplaceState(t, t.state, null);
  }
  function va(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var a in t)
        a !== "ref" && (e[a] = t[a]);
    }
    if (l = l.defaultProps) {
      e === t && (e = X({}, e));
      for (var u in l)
        e[u] === void 0 && (e[u] = l[u]);
    }
    return e;
  }
  function Qd(l) {
    An(l);
  }
  function Vd(l) {
    console.error(l);
  }
  function Zd(l) {
    An(l);
  }
  function li(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Ld(l, t, e) {
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
  function af(l, t, e) {
    return e = De(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      li(l, t);
    }, e;
  }
  function Kd(l) {
    return l = De(l), l.tag = 3, l;
  }
  function Jd(l, t, e, a) {
    var u = e.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var n = a.value;
      l.payload = function() {
        return u(n);
      }, l.callback = function() {
        Ld(t, e, a);
      };
    }
    var i = e.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (l.callback = function() {
      Ld(t, e, a), typeof u != "function" && (Be === null ? Be = /* @__PURE__ */ new Set([this]) : Be.add(this));
      var c = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: c !== null ? c : ""
      });
    });
  }
  function qm(l, t, e, a, u) {
    if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = e.alternate, t !== null && na(
        t,
        e,
        u,
        !0
      ), e = Zl.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
          case 19:
            return $l === null ? Ei() : e.alternate === null && Ol === 0 && (Ol = 3), e.flags &= -257, e.flags |= 65536, e.lanes = u, a === Xn ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Vf(l, a, u)), !1;
          case 22:
            return e.flags |= 65536, a === Xn ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), Vf(l, a, u)), !1;
        }
        throw Error(g(435, e.tag));
      }
      return Vf(l, a, u), Ei(), !1;
    }
    if (J)
      return t = Zl.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, a !== zc && (l = Error(g(422), { cause: a }), Au(_t(l, e)))) : (a !== zc && (t = Error(g(423), {
        cause: a
      }), Au(
        _t(t, e)
      )), l = l.current.alternate, l.flags |= 65536, u &= -u, l.lanes |= u, a = _t(a, e), u = af(
        l.stateNode,
        a,
        u
      ), Uc(l, u), Ol !== 4 && (Ol = 2)), !1;
    var n = Error(g(520), { cause: a });
    if (n = _t(n, e), Ju === null ? Ju = [n] : Ju.push(n), Ol !== 4 && (Ol = 2), t === null) return !0;
    a = _t(a, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, l = u & -u, e.lanes |= l, l = af(e.stateNode, a, l), Uc(e, l), !1;
        case 1:
          if (t = e.type, n = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (Be === null || !Be.has(n))))
            return e.flags |= 65536, u &= -u, e.lanes |= u, u = Kd(u), Jd(
              u,
              l,
              e,
              a
            ), Uc(e, u), !1;
          break;
        case 22:
          if (e.memoizedState !== null)
            return e.flags |= 65536, !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var uf = Error(g(461)), Dl = !1;
  function Cl(l, t, e, a) {
    t.child = l === null ? Wo(t, null, e, a) : da(
      t,
      l.child,
      e,
      a
    );
  }
  function wd(l, t, e, a, u) {
    e = e.render;
    var n = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var c in a)
        c !== "ref" && (i[c] = a[c]);
    } else i = a;
    return ia(t), a = Xc(
      l,
      t,
      e,
      i,
      n,
      u
    ), c = Qc(), l !== null && !Dl ? (Vc(l, t, u), ve(l, t, u)) : (J && c && Un(t), t.flags |= 1, Cl(l, t, a, u), t.child);
  }
  function Fd(l, t, e, a, u) {
    if (l === null) {
      var n = e.type;
      return typeof n == "function" && !Tc(n) && n.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = n, $d(
        l,
        t,
        n,
        a,
        u
      )) : (l = pn(
        e.type,
        null,
        a,
        t,
        t.mode,
        u
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !vf(l, u)) {
      var i = n.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Ou, e(i, a) && l.ref === t.ref)
        return ve(l, t, u);
    }
    return t.flags |= 1, l = ce(n, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function $d(l, t, e, a, u) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Ou(n, a) && l.ref === t.ref)
        if (Dl = !1, t.pendingProps = a = n, vf(l, u))
          (l.flags & 131072) !== 0 && (Dl = !0);
        else
          return t.lanes = l.lanes, ve(l, t, u);
    }
    return nf(
      l,
      t,
      e,
      a,
      u
    );
  }
  function Wd(l, t, e, a) {
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
        return Id(
          l,
          t,
          n,
          e,
          a
        );
      }
      if ((e & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Bn(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? Po(t, n) : Hc(), ld(t);
      else
        return a = t.lanes = 536870912, Id(
          l,
          t,
          n !== null ? n.baseLanes | e : e,
          e,
          a
        );
    } else
      n !== null ? (Bn(t, n.cachePool), Po(t, n), Ue(), t.memoizedState = null) : (l !== null && Bn(t, null), Hc(), Ue());
    return Cl(l, t, u, e), t.child;
  }
  function Gu(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Id(l, t, e, a, u) {
    var n = Dc();
    return n = n === null ? null : { parent: Al._currentValue, pool: n }, t.memoizedState = {
      baseLanes: e,
      cachePool: n
    }, l !== null && Bn(t, null), Hc(), ld(t), l !== null && na(l, t, a, !0), t.childLanes = u, null;
  }
  function ti(l, t) {
    return t = ei(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function kd(l, t, e) {
    return da(t, l.child, null, e), l = ti(t, t.pendingProps), l.flags |= 2, mt(t), t.memoizedState = null, l;
  }
  function Ym(l, t, e) {
    var a = t.pendingProps, u = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (J) {
        if (a.mode === "hidden")
          return l = ti(t, a), t.lanes = 536870912, l.memoizedState = { baseLanes: 0, cachePool: null }, Gu(null, l);
        if (Yc(t), (l = Sl) ? (l = O0(
          l,
          xt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: ze !== null ? { id: Zt, overflow: Lt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Ho(l), e.return = t, t.child = e, Yl = t, Sl = null)) : l = null, l === null) throw _e(t);
        return t.lanes = 536870912, null;
      }
      return ti(t, a);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if (Yc(t), u)
        if (t.flags & 256)
          t.flags &= -257, t = kd(
            l,
            t,
            e
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(g(558));
      else if (Dl || na(l, t, e, !1), u = (e & l.childLanes) !== 0, Dl || u) {
        if (pe.current === null) {
          if (a = ml, a !== null && (i = Ys(a, e), i !== 0 && i !== n.retryLane))
            throw n.retryLane = i, ta(l, i), ct(a, l, i), uf;
          Ei();
        }
        t = kd(
          l,
          t,
          e
        );
      } else
        l = n.treeContext, Sl = Mt(i.nextSibling), Yl = t, J = !0, Oe = null, xt = !1, l !== null && Bo(t, l), t = ti(t, a), t.flags |= 134221824;
      return t;
    }
    return l = ce(l.child, {
      mode: a.mode,
      children: a.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function Za(l, t) {
    var e = t.ref;
    if (e === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(g(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function nf(l, t, e, a, u) {
    return ia(t), e = Xc(
      l,
      t,
      e,
      a,
      void 0,
      u
    ), a = Qc(), l !== null && !Dl ? (Vc(l, t, u), ve(l, t, u)) : (J && a && Un(t), t.flags |= 1, Cl(l, t, e, u), t.child);
  }
  function Pd(l, t, e, a, u, n) {
    return ia(t), t.updateQueue = null, e = ed(
      t,
      a,
      e,
      u
    ), td(l), a = Qc(), l !== null && !Dl ? (Vc(l, t, n), ve(l, t, n)) : (J && a && Un(t), t.flags |= 1, Cl(l, t, e, n), t.child);
  }
  function lr(l, t, e, a, u) {
    if (ia(t), t.stateNode === null) {
      var n = Ua, i = e.contextType;
      typeof i == "object" && i !== null && (n = Vl(i)), n = new e(a, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = ef, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = a, n.state = t.memoizedState, n.refs = {}, pc(t), i = e.contextType, n.context = typeof i == "object" && i !== null ? Vl(i) : Ua, n.state = t.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (tf(
        t,
        e,
        i,
        a
      ), n.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (i = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), i !== n.state && ef.enqueueReplaceState(n, n.state, null), Ru(t, a, n, u), Uu(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps, s = va(e, c);
      n.props = s;
      var m = n.context, S = e.contextType;
      i = Ua, typeof S == "object" && S !== null && (i = Vl(S));
      var E = e.getDerivedStateFromProps;
      S = typeof E == "function" || typeof n.getSnapshotBeforeUpdate == "function", c = t.pendingProps !== c, S || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c || m !== i) && Xd(
        t,
        n,
        a,
        i
      ), xe = !1;
      var r = t.memoizedState;
      n.state = r, Ru(t, a, n, u), Uu(), m = t.memoizedState, c || r !== m || xe ? (typeof E == "function" && (tf(
        t,
        e,
        E,
        a
      ), m = t.memoizedState), (s = xe || Gd(
        t,
        e,
        s,
        a,
        r,
        m,
        i
      )) ? (S || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = m), n.props = a, n.state = m, n.context = i, a = s) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      n = t.stateNode, Cc(l, t), i = t.memoizedProps, S = va(e, i), n.props = S, E = t.pendingProps, r = n.context, m = e.contextType, s = Ua, typeof m == "object" && m !== null && (s = Vl(m)), c = e.getDerivedStateFromProps, (m = typeof c == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (i !== E || r !== s) && Xd(
        t,
        n,
        a,
        s
      ), xe = !1, r = t.memoizedState, n.state = r, Ru(t, a, n, u), Uu();
      var y = t.memoizedState;
      i !== E || r !== y || xe || l !== null && l.dependencies !== null && qn(l.dependencies) ? (typeof c == "function" && (tf(
        t,
        e,
        c,
        a
      ), y = t.memoizedState), (S = xe || Gd(
        t,
        e,
        S,
        a,
        r,
        y,
        s
      ) || l !== null && l.dependencies !== null && qn(l.dependencies)) ? (m || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, y, s), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        a,
        y,
        s
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && r === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && r === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = y), n.props = a, n.state = y, n.context = s, a = S) : (typeof n.componentDidUpdate != "function" || i === l.memoizedProps && r === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || i === l.memoizedProps && r === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return n = a, Za(l, t), a = (t.flags & 128) !== 0, n || a ? (n = t.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && a ? (t.child = da(
      t,
      l.child,
      null,
      u
    ), t.child = da(
      t,
      null,
      e,
      u
    )) : Cl(l, t, e, u), t.memoizedState = n.state, l = t.child) : l = ve(
      l,
      t,
      u
    ), l;
  }
  function tr(l, t, e, a) {
    return aa(), t.flags |= 256, Cl(l, t, e, a), t.child;
  }
  var cf = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ff(l) {
    return { baseLanes: l, cachePool: Lo() };
  }
  function sf(l, t, e) {
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= gt), l;
  }
  function er(l, t, e) {
    var a = t.pendingProps, u = !1, n = (t.flags & 128) !== 0, i;
    if ((i = n) || (i = l !== null && l.memoizedState === null ? !1 : (Ll.current & 2) !== 0), i && (u = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (J) {
        if (u ? Ce(t) : Ue(), (l = Sl) ? (l = O0(
          l,
          xt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: ze !== null ? { id: Zt, overflow: Lt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Ho(l), e.return = t, t.child = e, Yl = t, Sl = null)) : l = null, l === null) throw _e(t);
        return fs(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return n = a.children, a = a.fallback, u ? (Ue(), u = t.mode, n = ei(
        { mode: "hidden", children: n },
        u
      ), a = ea(
        a,
        u,
        e,
        null
      ), n.return = t, a.return = t, n.sibling = a, t.child = n, a = t.child, a.memoizedState = ff(e), a.childLanes = sf(
        l,
        i,
        e
      ), t.memoizedState = cf, Gu(null, a)) : (Ce(t), of(t, n));
    }
    var c = l.memoizedState;
    if (c !== null) {
      var s = c.dehydrated;
      if (s !== null)
        return Bm(
          l,
          t,
          n,
          i,
          a,
          s,
          c,
          e
        );
    }
    return u ? (Ue(), u = a.fallback, n = t.mode, c = l.child, s = c.sibling, a = ce(c, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = c.subtreeFlags & 1206910976, s !== null ? u = ce(s, u) : (u = ea(
      u,
      n,
      e,
      null
    ), u.flags |= 2), u.return = t, a.return = t, a.sibling = u, t.child = a, Gu(null, a), a = t.child, u = l.child.memoizedState, u === null ? u = ff(e) : (n = u.cachePool, n !== null ? (c = Al._currentValue, n = n.parent !== c ? { parent: c, pool: c } : n) : n = Lo(), u = {
      baseLanes: u.baseLanes | e,
      cachePool: n
    }), a.memoizedState = u, a.childLanes = sf(
      l,
      i,
      e
    ), t.memoizedState = cf, Gu(l.child, a)) : (Ce(t), e = l.child, l = e.sibling, e = ce(e, {
      mode: "visible",
      children: a.children
    }), e.return = t, e.sibling = null, l !== null && (i = t.deletions, i === null ? (t.deletions = [l], t.flags |= 16) : i.push(l)), t.child = e, t.memoizedState = null, e);
  }
  function of(l, t) {
    return t = ei(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function ei(l, t) {
    return l = at(22, l, null, t), l.lanes = 0, l;
  }
  function ai(l, t, e) {
    return da(t, l.child, null, e), l = of(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function Bm(l, t, e, a, u, n, i, c) {
    if (e)
      return t.flags & 256 ? (Ce(t), t.flags &= -257, ai(
        l,
        t,
        c
      )) : t.memoizedState !== null ? (Ue(), t.child = l.child, t.flags |= 128, null) : (Ue(), n = u.fallback, i = t.mode, u = ei(
        { mode: "visible", children: u.children },
        i
      ), n = ea(
        n,
        i,
        c,
        null
      ), n.flags |= 2, u.return = t, n.return = t, u.sibling = n, t.child = u, da(t, l.child, null, c), u = t.child, u.memoizedState = ff(c), u.childLanes = sf(
        l,
        a,
        c
      ), t.memoizedState = cf, Gu(null, u));
    if (Ce(t), fs(n)) {
      if (a = n.nextSibling && n.nextSibling.dataset, a) var s = a.dgst;
      return a = s, a !== "" && (u = Error(g(419)), u.stack = "", u.digest = a, Au({ value: u, source: null, stack: null })), ai(
        l,
        t,
        c
      );
    }
    if (Dl || na(l, t, c, !1), a = (c & l.childLanes) !== 0, Dl || a) {
      if (pe.current !== null)
        return ai(
          l,
          t,
          c
        );
      if (a = ml, a !== null && (u = Ys(
        a,
        c
      ), u !== 0 && u !== i.retryLane))
        throw i.retryLane = u, ta(l, u), ct(a, l, u), uf;
      return cs(n) || Ei(), ai(
        l,
        t,
        c
      );
    }
    return cs(n) ? (t.flags |= 192, t.child = l.child, null) : (l = i.treeContext, Sl = Mt(n.nextSibling), Yl = t, J = !0, Oe = null, xt = !1, l !== null && Bo(t, l), t = of(
      t,
      u.children
    ), t.flags |= 134221824, t);
  }
  function ar(l, t, e) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), Hn(l.return, t, e);
  }
  function ur(l) {
    for (var t = null; l !== null; ) {
      var e = l.alternate;
      e !== null && Ln(e) === null && (t = l), l = l.sibling;
    }
    return t;
  }
  function ui(l, t, e, a, u, n) {
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
  function df(l) {
    var t = l.child;
    for (l.child = null; t !== null; ) {
      var e = t.sibling;
      t.sibling = l.child, l.child = t, t = e;
    }
  }
  function rf(l, t, e) {
    var a = t.pendingProps, u = a.revealOrder, n = a.tail;
    a = a.children;
    var i = Ll.current;
    if (t.flags & 128)
      return Hu(t, i), null;
    var c = (i & 2) !== 0;
    if (c ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, Hu(t, i), u === "backwards" && l !== null ? (df(l), Cl(l, t, a, e), df(l)) : Cl(l, t, a, e), a = J ? ju : 0, !c && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && ar(l, e, t);
        else if (l.tag === 19)
          ar(l, e, t);
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
        e = ur(t.child), e === null ? (u = t.child, t.child = null) : (u = e.sibling, e.sibling = null, df(t)), ui(
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
          if (l = u.alternate, l !== null && Ln(l) === null) {
            t.child = u;
            break;
          }
          l = u.sibling, u.sibling = e, e = u, u = l;
        }
        ui(
          t,
          !0,
          e,
          null,
          n,
          a
        );
        break;
      case "together":
        ui(
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
        e = ur(t.child), e === null ? (u = t.child, t.child = null) : (u = e.sibling, e.sibling = null), ui(
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
  function nr(l, t, e) {
    var a = t.pendingProps;
    return je(t, t.type, a.value), Cl(l, t, a.children, e), t.child;
  }
  function ve(l, t, e) {
    if (l !== null && (t.dependencies = l.dependencies), Ye |= t.lanes, (e & t.childLanes) === 0)
      if (l !== null) {
        if (na(
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
      for (l = t.child, e = ce(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        l = l.sibling, e = e.sibling = ce(l, l.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function vf(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && qn(l)));
  }
  function Gm(l, t, e) {
    switch (t.tag) {
      case 3:
        sn(t, t.stateNode.containerInfo), je(t, Al, l.memoizedState.cache), aa();
        break;
      case 27:
      case 5:
        Gi(t);
        break;
      case 4:
        sn(t, t.stateNode.containerInfo);
        break;
      case 10:
        je(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Yc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return Ce(t), t.flags |= 128, null;
          a = na(
            l,
            t,
            e,
            !1
          );
          var u = t.child.childLanes;
          return a || (e & u) !== 0 ? er(l, t, e) : (Ce(t), l = ve(
            l,
            t,
            e
          ), l !== null ? l.sibling : null);
        }
        Ce(t);
        break;
      case 19:
        if (t.flags & 128)
          return rf(
            l,
            t,
            e
          );
        if (u = (l.flags & 128) !== 0, a = (e & t.childLanes) !== 0, a || (na(
          l,
          t,
          e,
          !1
        ), a = (e & t.childLanes) !== 0), u) {
          if (a)
            return rf(
              l,
              t,
              e
            );
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Hu(t, Ll.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Wd(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        je(t, Al, l.memoizedState.cache);
    }
    return ve(l, t, e);
  }
  function ir(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        Dl = !0;
      else {
        if (!vf(l, e) && (t.flags & 128) === 0)
          return Dl = !1, Gm(
            l,
            t,
            e
          );
        Dl = (l.flags & 131072) !== 0;
      }
    else
      Dl = !1, J && (t.flags & 1048576) !== 0 && Yo(t, ju, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (l = sa(t.elementType), t.type = l, typeof l == "function")
            Tc(l) ? (a = va(l, a), t.tag = 1, t = lr(
              null,
              t,
              l,
              a,
              e
            )) : (t.tag = 0, t = nf(
              null,
              t,
              l,
              a,
              e
            ));
          else {
            if (l != null) {
              var u = l.$$typeof;
              if (u === _) {
                t.tag = 11, t = wd(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (u === vl) {
                t.tag = 14, t = Fd(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (u === Hl) {
                t.tag = 10, t.type = l, t = nr(
                  null,
                  t,
                  e
                );
                break l;
              }
            }
            throw t = tl(l) || l, Error(g(306, t, ""));
          }
        }
        return t;
      case 0:
        return nf(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return a = t.type, u = va(
          a,
          t.pendingProps
        ), lr(
          l,
          t,
          a,
          u,
          e
        );
      case 3:
        l: {
          if (sn(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(g(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          u = n.element, Cc(l, t), Ru(t, a, null, e);
          var i = t.memoizedState;
          if (a = i.cache, je(t, Al, a), a !== n.cache && jc(
            t,
            [Al],
            e,
            !0
          ), Uu(), a = i.element, n.isDehydrated)
            if (n = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = tr(
                l,
                t,
                a,
                e
              );
              break l;
            } else if (a !== u) {
              u = _t(
                Error(g(424)),
                t
              ), Au(u), t = tr(
                l,
                t,
                a,
                e
              );
              break l;
            } else
              for (l = t.stateNode.containerInfo, l.nodeType === 9 ? l = l.body : l = l.nodeName === "HTML" ? l.ownerDocument.body : l, Sl = Mt(l.firstChild), Yl = t, J = !0, Oe = null, xt = !0, e = Wo(
                t,
                null,
                a,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 134221824, e = e.sibling;
          else {
            if (aa(), a === u) {
              t = ve(
                l,
                t,
                e
              );
              break l;
            }
            Cl(l, t, a, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Za(l, t), l === null ? (e = p0(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : J || (t.stateNode = o0(
          t.type,
          t.pendingProps,
          Se.current,
          t
        )) : t.memoizedState = p0(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Gi(t), l === null && J && (a = t.stateNode = A0(
          t.type,
          t.pendingProps,
          Se.current
        ), Yl = t, xt = !0, u = Sl, Qe(t.type) ? (ss = u, Sl = Mt(a.firstChild)) : Sl = u), Cl(
          l,
          t,
          t.pendingProps.children,
          e
        ), Za(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && J && ((u = a = Sl) && (a = Uh(
          a,
          t.type,
          t.pendingProps,
          xt
        ), a !== null ? (t.stateNode = a, Yl = t, Sl = Mt(a.firstChild), xt = !1, u = !0) : u = !1), u || _e(t)), Gi(t), u = t.type, n = t.pendingProps, i = l !== null ? l.memoizedProps : null, a = n.children, ls(u, n) ? a = null : i !== null && ls(u, i) && (t.flags |= 32), t.memoizedState !== null && (u = Xc(
          l,
          t,
          xm,
          null,
          null,
          e
        ), cu._currentValue = u), Za(l, t), Cl(l, t, a, e), t.child;
      case 6:
        return l === null && J && ((l = e = Sl) && (e = Rh(
          e,
          t.pendingProps,
          xt
        ), e !== null ? (t.stateNode = e, Yl = t, Sl = null, l = !0) : l = !1), l || _e(t)), null;
      case 13:
        return er(l, t, e);
      case 4:
        return sn(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = da(
          t,
          null,
          a,
          e
        ) : Cl(l, t, a, e), t.child;
      case 11:
        return wd(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return a = t.pendingProps, Za(l, t), Cl(l, t, a, e), t.child;
      case 8:
        return Cl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return Cl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return nr(l, t, e);
      case 9:
        return u = t.type._context, a = t.pendingProps.children, ia(t), u = Vl(u), a = a(u), t.flags |= 1, Cl(l, t, a, e), t.child;
      case 14:
        return Fd(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 15:
        return $d(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 19:
        return rf(l, t, e);
      case 31:
        return Ym(l, t, e);
      case 22:
        return Wd(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        return ia(t), a = Vl(Al), l === null ? (u = Dc(), u === null && (u = ml, n = Ac(), u.pooledCache = n, n.refCount++, n !== null && (u.pooledCacheLanes |= e), u = n), t.memoizedState = { parent: a, cache: u }, pc(t), je(t, Al, u)) : ((l.lanes & e) !== 0 && (Cc(l, t), Ru(t, null, null, e), Uu()), u = l.memoizedState, n = t.memoizedState, u.parent !== a ? (u = { parent: a, cache: a }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), je(t, Al, a)) : (a = n.cache, je(t, Al, a), a !== u.cache && jc(
          t,
          [Al],
          e,
          !0
        ))), Cl(
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
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= l === null ? 18882560 : 18874368 : J && Un(t), l !== null && l.memoizedProps.name !== a.name ? t.flags |= 4194816 : Za(l, t), Cl(l, t, a.children, e), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(g(156, t.tag));
  }
  function me(l) {
    l.flags |= 4;
  }
  function mf(l, t, e, a, u) {
    var n;
    if ((n = (l.mode & 32) !== 0) && (n = e === null ? H0(t, a) : H0(t, a) && (a.src !== e.src || a.srcSet !== e.srcSet)), n) {
      if (l.flags |= 16777216, (u & 335544128) === u)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (Qr()) l.flags |= 8192;
        else
          throw oa = Xn, Mc;
    } else l.flags &= -16777217;
  }
  function cr(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !q0(t))
      if (Qr()) l.flags |= 8192;
      else
        throw oa = Xn, Mc;
  }
  function ni(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Rs() : 536870912, l.lanes |= t, Fa |= t);
  }
  function Xu(l, t) {
    if (!J)
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
  function Tl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, a = 0;
    if (t)
      for (var u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags & 1206910976, a |= u.flags & 1206910976, u.return = l, u = u.sibling;
    else
      for (u = l.child; u !== null; )
        e |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = l, u = u.sibling;
    return l.subtreeFlags |= a, l.childLanes = e, t;
  }
  function Xm(l, t, e) {
    var a = t.pendingProps;
    switch (Nc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Tl(t), null;
      case 1:
        return Tl(t), null;
      case 3:
        return e = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), oe(Al), ba(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && (qa(t) ? me(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Oc())), Tl(t), null;
      case 26:
        var u = t.type, n = t.memoizedState;
        return l === null ? (me(t), n !== null ? (Tl(t), cr(t, n)) : (Tl(t), mf(
          t,
          u,
          null,
          a,
          e
        ))) : n ? n !== l.memoizedState ? (me(t), Tl(t), cr(t, n)) : (Tl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && me(t), Tl(t), mf(
          t,
          u,
          l,
          a,
          e
        )), null;
      case 27:
        if (on(t), e = Se.current, u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && me(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(g(166));
            return Tl(t), t.subtreeFlags &= -33554433, null;
          }
          l = Qt.current, qa(t) ? Go(t) : (l = A0(u, a, e), t.stateNode = l, me(t));
        }
        return Tl(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (on(t), u = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && me(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(g(166));
            return Tl(t), t.subtreeFlags &= -33554433, null;
          }
          if (n = Qt.current, qa(t))
            Go(t);
          else {
            var i = Iu(
              Se.current
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
            n[Ql] = t, n[et] = a;
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
            l: switch (Jl(n, u, a), u) {
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
            a && me(t);
          }
        }
        return Tl(t), t.subtreeFlags &= -33554433, mf(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          e
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && me(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(g(166));
          if (l = Se.current, qa(t)) {
            if (l = t.stateNode, e = t.memoizedProps, a = null, u = Yl, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            l[Ql] = t, l = !!(l.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || i0(l.nodeValue, e)), l || _e(t, !0);
          } else
            l = Iu(l).createTextNode(
              a
            ), l[Ql] = t, t.stateNode = l;
        }
        return Tl(t), null;
      case 31:
        if (e = t.memoizedState, l === null || l.memoizedState !== null) {
          if (a = qa(t), e !== null) {
            if (l === null) {
              if (!a) throw Error(g(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(g(557));
              l[Ql] = t;
            } else
              aa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Tl(t), l = !1;
          } else
            e = Oc(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), l = !0;
          if (!l)
            return t.flags & 256 ? (mt(t), t) : (mt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(g(558));
        }
        return Tl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (u = qa(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!u) throw Error(g(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(g(317));
              u[Ql] = t;
            } else
              aa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Tl(t), u = !1;
          } else
            u = Oc(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return t.flags & 256 ? (mt(t), t) : (mt(t), null);
        }
        return mt(t), (t.flags & 128) !== 0 ? (t.lanes = e, t) : (e = a !== null, l = l !== null && l.memoizedState !== null, e && (a = t.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), n = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool), n !== u && (a.flags |= 2048)), e !== l && e && (t.child.flags |= 8192), ni(t, t.updateQueue), Tl(t), null);
      case 4:
        return ba(), l === null && $f(t.stateNode.containerInfo), t.flags |= 67108864, Tl(t), null;
      case 10:
        return oe(t.type), Tl(t), null;
      case 19:
        if (Bc(t), a = t.memoizedState, a === null) return Tl(t), null;
        if (u = (t.flags & 128) !== 0, n = a.rendering, n === null)
          if (u) Xu(a, !1);
          else {
            if (Ol !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = Ln(l), n !== null) {
                  for (t.flags |= 128, Xu(a, !1), l = n.updateQueue, t.updateQueue = l, ni(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    Ro(e, l), e = e.sibling;
                  return Hu(
                    t,
                    Ll.current & 1 | 2
                  ), J && fe(t, a.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && st() > gi && (t.flags |= 128, u = !0, Xu(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (l = Ln(n), l !== null) {
              if (t.flags |= 128, u = !0, l = l.updateQueue, t.updateQueue = l, ni(t, l), Xu(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !n.alternate && !J)
                return Tl(t), null;
            } else
              2 * st() - a.renderingStartTime > gi && e !== 536870912 && (t.flags |= 128, u = !0, Xu(a, !1), t.lanes = 4194304);
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
          return a.rendering = l, a.tail = l.sibling, a.renderingStartTime = st(), l.sibling = null, n = Ll.current, n = u ? n & 1 | 2 : n & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !e || J ? Hu(t, n) : (e = n, gl(Zl, t), gl(Ll, e), $l === null && ($l = t)), J && fe(t, a.treeForkCount), l;
        }
        return Tl(t), null;
      case 22:
      case 23:
        return mt(t), qc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (Tl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Tl(t), e = t.updateQueue, e !== null && ni(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== e && (t.flags |= 2048), l !== null && Xl(fa), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), oe(Al), Tl(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, Tl(t), null;
    }
    throw Error(g(156, t.tag));
  }
  function Qm(l, t) {
    switch (Nc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return oe(Al), ba(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return on(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (mt(t), t.alternate === null)
            throw Error(g(340));
          aa();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (mt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(g(340));
          aa();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return Bc(t), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null), t.flags |= 4, t) : null;
      case 4:
        return ba(), null;
      case 10:
        return oe(t.type), null;
      case 22:
      case 23:
        return mt(t), qc(), l !== null && Xl(fa), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return oe(Al), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function fr(l, t) {
    switch (Nc(t), t.tag) {
      case 3:
        oe(Al), ba();
        break;
      case 26:
      case 27:
      case 5:
        on(t);
        break;
      case 4:
        ba();
        break;
      case 31:
        t.memoizedState !== null && mt(t);
        break;
      case 13:
        mt(t);
        break;
      case 19:
        Bc(t);
        break;
      case 10:
        oe(t.type);
        break;
      case 22:
      case 23:
        mt(t), qc(), l !== null && Xl(fa);
        break;
      case 24:
        oe(Al);
    }
  }
  function Qu(l, t) {
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
    } catch (c) {
      sl(t, t.return, c);
    }
  }
  function Re(l, t, e) {
    try {
      var a = t.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var i = a.inst, c = i.destroy;
            if (c !== void 0) {
              i.destroy = void 0, u = t;
              var s = e, m = c;
              try {
                m();
              } catch (S) {
                sl(
                  u,
                  s,
                  S
                );
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (S) {
      sl(t, t.return, S);
    }
  }
  function sr(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        ko(t, e);
      } catch (a) {
        sl(l, l.return, a);
      }
    }
  }
  function or(l, t, e) {
    e.props = va(
      l.type,
      l.memoizedProps
    ), e.state = l.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (a) {
      sl(l, t, a);
    }
  }
  function Kt(l, t) {
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
            var u = l.stateNode, n = ne(l.memoizedProps, u);
            (u.ref === null || u.ref.name !== n) && (u.ref = g0(n)), a = u.ref;
            break;
          case 7:
            if (l.stateNode === null) {
              var i = new Tt(l);
              T(
                l.child,
                !1,
                ph,
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
    } catch (c) {
      sl(l, t, c);
    }
  }
  function Kl(l, t) {
    var e = l.ref, a = l.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          sl(l, t, u);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (u) {
          sl(l, t, u);
        }
      else e.current = null;
  }
  function ii(l, t) {
    if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && l.alternate === null && t !== null)
      for (var e = 0; e < t.length; e++)
        z0(
          l.stateNode,
          t[e]
        );
  }
  function dr(l) {
    for (var t = l.return; t !== null && (yf(t) && z0(l.stateNode, t.stateNode), !hf(t)); )
      t = t.return;
  }
  function Vu(l) {
    for (var t = l.return; t !== null && (yf(t) && Ch(l.stateNode, t.stateNode), !hf(t)); )
      t = t.return;
  }
  function hf(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 27;
  }
  function yf(l) {
    return l && l.tag === 7 && l.stateNode !== null;
  }
  function gf(l) {
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
      sl(l, l.return, u);
    }
  }
  function Sf(l, t, e) {
    try {
      var a = l.stateNode;
      vh(a, l.type, e, t), a[et] = t;
    } catch (u) {
      sl(l, l.return, u);
    }
  }
  function rr(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Qe(l.type) || l.tag === 4;
  }
  function Tf(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || rr(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Qe(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function bf(l, t, e, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      u = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(u, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(u), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = Vt)), ii(l, a), el = !0;
    else if (u !== 4 && (u === 27 && (ii(l, a), a = null, Qe(l.type) && (e = l.stateNode, t = null)), l = l.child, l !== null))
      for (bf(
        l,
        t,
        e,
        a
      ), l = l.sibling; l !== null; )
        bf(
          l,
          t,
          e,
          a
        ), l = l.sibling;
  }
  function ci(l, t, e, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      u = l.stateNode, t ? e.insertBefore(u, t) : e.appendChild(u), ii(l, a), el = !0;
    else if (u !== 4 && (u === 27 && (ii(l, a), a = null, Qe(l.type) && (e = l.stateNode)), l = l.child, l !== null))
      for (ci(
        l,
        t,
        e,
        a
      ), l = l.sibling; l !== null; )
        ci(
          l,
          t,
          e,
          a
        ), l = l.sibling;
  }
  function vr(l) {
    var t = l.stateNode, e = l.memoizedProps;
    try {
      for (var a = l.type, u = t.attributes; u.length; )
        t.removeAttributeNode(u[0]);
      Jl(t, a, e), t[Ql] = l, t[et] = e;
    } catch (n) {
      sl(l, l.return, n);
    }
  }
  var fi = !1, ht = null;
  function mr(l) {
    (l.tag === 30 || (l.subtreeFlags & 33554432) !== 0) && (fi = !0);
  }
  var Jt = null;
  function hr() {
    var l = Jt;
    return Jt = null, l;
  }
  var ut = 0;
  function La(l, t, e, a, u) {
    return ut = 0, yr(
      l.child,
      t,
      e,
      a,
      u
    );
  }
  function yr(l, t, e, a, u) {
    for (var n = !1; l !== null; ) {
      if (l.tag === 5) {
        var i = l.stateNode;
        if (a !== null) {
          var c = as(i);
          a.push(c), c.view && (n = !0);
        } else
          n || as(i).view && (n = !0);
        fi = !0, h0(
          i,
          ut === 0 ? t : t + "_" + ut,
          e
        ), ut++;
      } else (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && u || yr(
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
  function wt(l, t) {
    for (; l !== null; )
      l.tag === 5 ? y0(l.stateNode, l.memoizedProps) : (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && t || wt(
        l.child,
        t
      )), l = l.sibling;
  }
  function si(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if ((l.tag !== 22 || l.memoizedState === null) && (si(l), l.tag === 30 && (l.flags & 18874368) !== 0 && l.stateNode.paired)) {
          var t = l.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(g(544));
          var e = t.name;
          t = ie(t.default, t.share), t !== "none" && (La(
            l,
            e,
            t,
            null,
            !1
          ) || wt(l.child, !1));
        }
        l = l.sibling;
      }
  }
  function Ef(l, t) {
    if (l.tag === 30) {
      var e = l.stateNode, a = l.memoizedProps, u = ne(a, e), n = ie(
        a.default,
        e.paired ? a.share : a.enter
      );
      n !== "none" ? La(l, u, n, null, !1) ? (si(l), e.paired || t || ka(l, a.onEnter)) : wt(l.child, !1) : si(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        Ef(l, t), l = l.sibling;
    else si(l);
  }
  function Nf(l) {
    if (ht !== null && ht.size !== 0) {
      var t = ht;
      if ((l.subtreeFlags & 18874368) !== 0)
        for (l = l.child; l !== null; ) {
          if (l.tag !== 22 || l.memoizedState === null) {
            if (l.tag === 30 && (l.flags & 18874368) !== 0) {
              var e = l.memoizedProps, a = e.name;
              if (a != null && a !== "auto") {
                var u = t.get(a);
                if (u !== void 0) {
                  var n = ie(
                    e.default,
                    e.share
                  );
                  if (n !== "none" && (La(
                    l,
                    a,
                    n,
                    null,
                    !1
                  ) ? (n = l.stateNode, u.paired = n, n.paired = u, ka(l, e.onShare)) : wt(l.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Nf(l);
          }
          l = l.sibling;
        }
    }
  }
  function zf(l) {
    if (l.tag === 30) {
      var t = l.memoizedProps, e = ne(t, l.stateNode), a = ht !== null ? ht.get(e) : void 0, u = ie(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      u !== "none" && (La(l, e, u, null, !1) ? a !== void 0 ? (u = l.stateNode, a.paired = u, u.paired = a, ht.delete(e), ka(l, t.onShare)) : ka(l, t.onExit) : wt(l.child, !1)), ht !== null && Nf(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        zf(l), l = l.sibling;
    else
      ht !== null && Nf(l);
  }
  function gr(l) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var t = l.memoizedProps, e = ne(t, l.stateNode);
        t = ie(t.default, t.update), l.flags &= -5, t !== "none" && La(
          l,
          e,
          t,
          l.memoizedState = [],
          !1
        );
      } else
        (l.subtreeFlags & 33554432) !== 0 && gr(l);
      l = l.sibling;
    }
  }
  function Of(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if (l.tag !== 22 || l.memoizedState === null) {
          if (l.tag === 30 && (l.flags & 18874368) !== 0) {
            var t = l.stateNode;
            t.paired !== null && (t.paired = null, wt(l.child, !1));
          }
          Of(l);
        }
        l = l.sibling;
      }
  }
  function oi(l) {
    if (l.tag === 30)
      l.stateNode.paired = null, wt(l.child, !1), Of(l);
    else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        oi(l), l = l.sibling;
    else Of(l);
  }
  function Sr(l) {
    for (l = l.child; l !== null; )
      l.tag === 30 ? wt(l.child, !1) : (l.subtreeFlags & 33554432) !== 0 && Sr(l), l = l.sibling;
  }
  function _f(l, t, e, a, u, n, i) {
    for (var c = !1; t !== null; ) {
      if (t.tag === 5) {
        var s = t.stateNode;
        if (n !== null && ut < n.length) {
          var m = n[ut], S = as(s);
          (m.view || S.view) && (c = !0);
          var E;
          if (E = (l.flags & 4) === 0)
            if (S.clip) E = !0;
            else {
              E = m.rect;
              var r = S.rect;
              E = E.y !== r.y || E.x !== r.x || E.height !== r.height || E.width !== r.width;
            }
          E && (l.flags |= 4), S.abs ? S = !m.abs : (m = m.rect, S = S.rect, S = m.height !== S.height || m.width !== S.width), S && (l.flags |= 32);
        } else l.flags |= 32;
        (l.flags & 4) !== 0 && h0(
          s,
          ut === 0 ? e : e + "_" + ut,
          u
        ), c && (l.flags & 4) !== 0 || (Jt === null && (Jt = []), Jt.push(
          s,
          ut === 0 ? a : a + "_" + ut,
          t.memoizedProps
        )), ut++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && i ? l.flags |= t.flags & 32 : _f(
        l,
        t.child,
        e,
        a,
        u,
        n,
        i
      ) && (c = !0));
      t = t.sibling;
    }
    return c;
  }
  function Tr(l, t) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var e = l.memoizedProps, a = l.stateNode, u = ne(e, a), n = ie(e.default, e.update), i;
        i = l.memoizedState, l.memoizedState = null, a = l;
        var c = l.child;
        ut = 0, u = _f(
          a,
          c,
          u,
          u,
          n,
          i,
          !1
        ), (l.flags & 4) !== 0 && u && ka(l, e.onUpdate);
      } else
        (l.subtreeFlags & 33554432) !== 0 && Tr(l);
      l = l.sibling;
    }
  }
  var Bl = !1, il = !1, Ft = !1, jf = !1, br = typeof WeakSet == "function" ? WeakSet : Set, Gl = null, $t = !1, Zu = !1, di = !1, Af = !1;
  function Vm(l, t, e) {
    if (l = l.containerInfo, kf = fu, l = Oo(l), rc(l)) {
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
            var c = 0, s = -1, m = -1, S = 0, E = 0, r = l, y = null;
            t: for (; ; ) {
              for (var O; r !== a || n !== 0 && r.nodeType !== 3 || (s = c + n), r !== i || u !== 0 && r.nodeType !== 3 || (m = c + u), r.nodeType === 3 && (c += r.nodeValue.length), (O = r.firstChild) !== null; )
                y = r, r = O;
              for (; ; ) {
                if (r === l) break t;
                if (y === a && ++S === n && (s = c), y === i && ++E === u && (m = c), (O = r.nextSibling) !== null) break;
                r = y, y = r.parentNode;
              }
              r = O;
            }
            a = s === -1 || m === -1 ? null : { start: s, end: m };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Pf = { focusedElem: l, selectionRange: a }, fu = !1, e = (e & 335544064) === e, Gl = t, t = e ? 9270 : 1024; Gl !== null; ) {
      if (l = Gl, e && (a = l.deletions, a !== null))
        for (n = 0; n < a.length; n++)
          e && zf(a[n]);
      if (l.alternate === null && (l.flags & 2) !== 0)
        e && mr(l), ri(e);
      else {
        if (l.tag === 22) {
          if (a = l.alternate, l.memoizedState !== null) {
            a !== null && a.memoizedState === null && e && zf(a), ri(e);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            e && mr(l), ri(e);
            continue;
          }
        }
        a = l.child, (l.subtreeFlags & t) !== 0 && a !== null ? (a.return = l, Gl = a) : (e && gr(l), ri(e));
      }
    }
    ht = null;
  }
  function ri(l) {
    for (; Gl !== null; ) {
      var t = Gl, e = l, a = t.alternate, u = t.flags;
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
              var i = va(
                t.type,
                u
              );
              e = n.getSnapshotBeforeUpdate(
                i,
                a
              ), n.__reactInternalSnapshotBeforeUpdate = e;
            } catch (c) {
              sl(t, t.return, c);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, e = a.nodeType, e === 9)
              is(a);
            else if (e === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  is(a);
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
          e && a !== null && (e = ne(
            a.memoizedProps,
            a.stateNode
          ), u = t.memoizedProps, u = ie(u.default, u.update), u !== "none" && La(
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
        a.return = t.return, Gl = a;
        break;
      }
      Gl = t.return;
    }
  }
  function Er(l, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Wt(l, e), a & 4 && Qu(5, e);
        break;
      case 1:
        if (Wt(l, e), a & 4)
          if (l = e.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (i) {
              sl(e, e.return, i);
            }
          else {
            var u = va(
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
              sl(
                e,
                e.return,
                i
              );
            }
          }
        a & 64 && sr(e), a & 512 && Kt(e, e.return);
        break;
      case 3:
        if (Wt(l, e), a & 64 && (l = e.updateQueue, l !== null)) {
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
            ko(l, t);
          } catch (i) {
            sl(e, e.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && vr(e);
      case 26:
      case 5:
        Wt(l, e), t === null && a & 4 && gf(e), a & 512 && Kt(e, e.return);
        break;
      case 12:
        Wt(l, e);
        break;
      case 31:
        Wt(l, e), a & 4 && _r(l, e);
        break;
      case 13:
        Wt(l, e), a & 4 && jr(l, e), a & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = lh.bind(
          null,
          e
        ), Hh(l, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || Bl, !a) {
          var n = t !== null && t.memoizedState !== null || il;
          t = Bl, u = il, Bl = a, (il = n) && !u ? (a = 2, (e.subtreeFlags & 8772) !== 0 && (a |= 1), qt(
            l,
            e,
            a
          )) : Wt(l, e), Bl = t, il = u;
        }
        break;
      case 30:
        Wt(l, e), a & 512 && Kt(e, e.return);
        break;
      case 7:
        a & 512 && Kt(e, e.return);
      default:
        Wt(l, e);
    }
  }
  function xf(l, t) {
    for (l = l.child; l !== null; )
      Nr(l, t), l = l.sibling;
  }
  function Nr(l, t) {
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
          sl(l, l.return, s);
        }
        Df(l, t);
        break;
      case 6:
        try {
          l.stateNode.nodeValue = t ? "" : l.memoizedProps, el = !0;
        } catch (s) {
          sl(l, l.return, s);
        }
        break;
      case 18:
        try {
          var c = l.stateNode;
          t ? m0(c, !0) : m0(l.stateNode, !1);
        } catch (s) {
          sl(l, l.return, s);
        }
        break;
      case 22:
      case 23:
        l.memoizedState === null && xf(l, t);
        break;
      default:
        xf(l, t);
    }
  }
  function Df(l, t) {
    if (l.subtreeFlags & 67108864)
      for (l = l.child; l !== null; ) {
        l: {
          var e = l, a = t;
          switch (e.tag) {
            case 4:
              Nr(e, a);
              break l;
            case 22:
              e.memoizedState === null && Df(e, a);
              break l;
            default:
              Df(e, a);
          }
        }
        l = l.sibling;
      }
  }
  function zr(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, zr(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && gn(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var El = null, nt = !1;
  function Rt(l, t, e) {
    for (e = e.child; e !== null; )
      Or(l, t, e), e = e.sibling;
  }
  function Or(l, t, e) {
    if (ot && typeof ot.onCommitFiberUnmount == "function")
      try {
        ot.onCommitFiberUnmount(ru, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        il || Kl(e, t), Rt(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && !il && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        il || Kl(e, t), Vu(e);
        var a = El, u = nt;
        Qe(e.type) && (El = e.stateNode, nt = !1), Rt(
          l,
          t,
          e
        ), x0(
          e.stateNode,
          e.type,
          e.memoizedProps
        ), El = a, nt = u;
        break;
      case 5:
        il || Kl(e, t), Vu(e);
      case 6:
        if (e.tag === 6 && Vu(e), a = El, u = nt, El = null, Rt(
          l,
          t,
          e
        ), El = a, nt = u, El !== null)
          if (nt)
            try {
              (El.nodeType === 9 ? El.body : El.nodeName === "HTML" ? El.ownerDocument.body : El).removeChild(e.stateNode), el = !0;
            } catch (n) {
              sl(
                e,
                t,
                n
              );
            }
          else
            try {
              El.removeChild(e.stateNode), el = !0;
            } catch (n) {
              sl(
                e,
                t,
                n
              );
            }
        break;
      case 18:
        El !== null && (nt ? (l = El, v0(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), su(l)) : v0(El, e.stateNode));
        break;
      case 4:
        a = El, u = nt, El = e.stateNode.containerInfo, nt = !0, Rt(
          l,
          t,
          e
        ), El = a, nt = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Re(2, e, t), il || Re(4, e, t), Rt(
          l,
          t,
          e
        );
        break;
      case 1:
        il || (Kl(e, t), a = e.stateNode, typeof a.componentWillUnmount == "function" && or(
          e,
          t,
          a
        )), Rt(
          l,
          t,
          e
        );
        break;
      case 21:
        Rt(
          l,
          t,
          e
        );
        break;
      case 22:
        il = (a = il) || e.memoizedState !== null, Rt(
          l,
          t,
          e
        ), il = a;
        break;
      case 30:
        Kl(e, t), Rt(
          l,
          t,
          e
        );
        break;
      case 7:
        il || Kl(e, t), Rt(
          l,
          t,
          e
        );
        break;
      default:
        Rt(
          l,
          t,
          e
        );
    }
  }
  function _r(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        su(l);
      } catch (e) {
        sl(t, t.return, e);
      }
    }
  }
  function jr(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        su(l);
      } catch (e) {
        sl(t, t.return, e);
      }
  }
  function Zm(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new br()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new br()), t;
      default:
        throw Error(g(435, l.tag));
    }
  }
  function vi(l, t) {
    var e = Zm(l);
    t.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var u = th.bind(null, l, a);
        a.then(u, u);
      }
    });
  }
  function Pl(l, t, e) {
    var a = t.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var n = a[u], i = l, c = t, s = c;
        l: for (; s !== null; ) {
          switch (s.tag) {
            case 27:
              if (Qe(s.type)) {
                El = s.stateNode, nt = !1;
                break l;
              }
              break;
            case 5:
              El = s.stateNode, nt = !1;
              break l;
            case 3:
            case 4:
              El = s.stateNode.containerInfo, nt = !0;
              break l;
          }
          s = s.return;
        }
        if (El === null) throw Error(g(160));
        Or(i, c, n), El = null, nt = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Ar(t, l, e), t = t.sibling;
  }
  var Ht = null;
  function Ar(l, t, e) {
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
        Pl(t, l, e), lt(l), u & 4 && (Re(3, l, l.return), Qu(3, l), Re(5, l, l.return));
        break;
      case 1:
        Pl(t, l, e), lt(l), u & 512 && (il || a === null || Kl(a, a.return)), u & 64 && Bl && (l = l.updateQueue, l !== null && (t = l.callbacks, t !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? t : e.concat(t))));
        break;
      case 26:
        if (n = Ht, Pl(t, l, e), lt(l), u & 512 && (il || a === null || Kl(a, a.return)), u & 4)
          if (u = a !== null ? a.memoizedState : null, e = l.memoizedState, a === null)
            if (e === null)
              if (l.stateNode === null)
                if (Bl)
                  l.stateNode = o0(
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
                        a = u.getElementsByTagName("title")[0], (!a || a[hu] || a[Ql] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = u.createElement(t), u.head.insertBefore(
                          a,
                          u.querySelector("head > title")
                        )), Jl(a, t, e), a[Ql] = l, ql(a), t = a;
                        break l;
                      case "link":
                        if (n = R0(
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
                        a = u.createElement(t), Jl(a, t, e), u.head.appendChild(a);
                        break;
                      case "meta":
                        if (n = R0(
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
                        a = u.createElement(t), Jl(a, t, e), u.head.appendChild(a);
                        break;
                      default:
                        throw Error(g(468, t));
                    }
                    a[Ql] = l, ql(a), t = a;
                  }
                  l.stateNode = t;
                }
              else
                Bl || vs(n, l.type, l.stateNode);
            else
              l.stateNode = U0(
                n,
                e,
                l.memoizedProps
              );
          else
            u !== e ? (u === null ? (t = a.stateNode, t === null || il || t.parentNode.removeChild(t)) : u.count--, e === null ? Bl || vs(n, l.type, l.stateNode) : U0(n, e, l.memoizedProps)) : e === null && l.stateNode !== null && Sf(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        Pl(t, l, e), lt(l), u & 512 && (il || a === null || Kl(a, a.return)), a !== null && u & 4 && Sf(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (n = Ft, Ft = !1, Pl(t, l, e), Ft = n, lt(l), u & 512 && (il || a === null || Kl(a, a.return)), l.flags & 32) {
          t = l.stateNode;
          try {
            ja(t, ""), el = !0;
          } catch (S) {
            sl(l, l.return, S);
          }
        }
        u & 4 && l.stateNode != null && (t = l.memoizedProps, Sf(
          l,
          t,
          a !== null ? a.memoizedProps : t
        )), u & 1024 && (jf = !0);
        break;
      case 6:
        if (Pl(t, l, e), lt(l), u & 4) {
          if (l.stateNode === null)
            throw Error(g(162));
          t = l.memoizedProps, e = l.stateNode;
          try {
            e.nodeValue = t, el = !0;
          } catch (S) {
            sl(l, l.return, S);
          }
        }
        break;
      case 3:
        if (el = !1, xi = null, n = Ht, Ht = ku(t.containerInfo), Pl(t, l, e), Ht = n, lt(l), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            su(t.containerInfo);
          } catch (S) {
            sl(l, l.return, S);
          }
        jf && (jf = !1, xr(l)), el = !1;
        break;
      case 4:
        u = Ft, Ft = Bl, a = ws(), n = Ht, Ht = ku(
          l.stateNode.containerInfo
        ), Pl(t, l, e), lt(l), Ht = n, el && Zu && (di = !0), el = a, Ft = u;
        break;
      case 12:
        Pl(t, l, e), lt(l);
        break;
      case 31:
        Pl(t, l, e), lt(l), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, vi(l, t)));
        break;
      case 13:
        Pl(t, l, e), lt(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (yi = st()), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, vi(l, t)));
        break;
      case 22:
        n = l.memoizedState !== null, i = a !== null && a.memoizedState !== null;
        var c = Bl, s = il, m = Ft;
        Bl = c || n, Ft = m || n, il = s || i, Pl(t, l, e), il = s, Ft = m, Bl = c, lt(l), u & 8192 && (t = l.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, !n || a === null || i || Bl || il || (t = i || il, e = Bl, a = il, Bl = n || Bl, il = t, He(l, 2), Bl = e, il = a), !n && Ft || xf(l, n)), u & 4 && (t = l.updateQueue, t !== null && (e = t.retryQueue, e !== null && (t.retryQueue = null, vi(l, e))));
        break;
      case 19:
        Pl(t, l, e), lt(l), u & 4 && (t = l.updateQueue, t !== null && (l.updateQueue = null, vi(l, t)));
        break;
      case 30:
        u & 512 && (il || a === null || Kl(a, a.return)), u = ws(), n = Zu, i = (e & 335544064) === e, c = l.memoizedProps, Zu = i && ie(
          c.default,
          c.update
        ) !== "none", Pl(t, l, e), lt(l), i && a !== null && el && (l.flags |= 4), Zu = n, el = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (il || a === null || Kl(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = l);
      default:
        Pl(t, l, e), lt(l);
    }
  }
  function lt(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, a = l.return; a !== null; ) {
          if (rr(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var u = l.return; u !== null; ) {
          if (yf(u)) {
            var n = u.stateNode;
            a === null ? a = [n] : a.push(n);
          }
          if (hf(u)) break;
          u = u.return;
        }
        var i = a;
        if (e == null) throw Error(g(160));
        switch (e.tag) {
          case 27:
            var c = e.stateNode, s = Tf(l);
            ci(
              l,
              s,
              c,
              i
            );
            break;
          case 5:
            var m = e.stateNode;
            e.flags & 32 && (ja(m, ""), e.flags &= -33);
            var S = Tf(l);
            ci(
              l,
              S,
              m,
              i
            );
            break;
          case 3:
          case 4:
            var E = e.stateNode.containerInfo, r = Tf(l);
            bf(
              l,
              r,
              E,
              i
            );
            break;
          default:
            throw Error(g(161));
        }
      } catch (y) {
        sl(l, l.return, y);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function xr(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        xr(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, fu = !0, t.reset(), fu = !1), l = l.sibling;
      }
  }
  function Ka(l, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Dr(t, l), t = t.sibling;
    else Tr(t);
  }
  function Dr(l, t) {
    var e = l.alternate;
    if (e === null) Ef(l, !1);
    else
      switch (l.tag) {
        case 3:
          if (Af = $t = !1, hr(), Ka(t, l), !$t && !di) {
            if (l = Jt, l !== null)
              for (var a = 0; a < l.length; a += 3) {
                e = l[a];
                var u = l[a + 1];
                y0(e, l[a + 2]), e = e.ownerDocument.documentElement, e !== null && e.animate(
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
            )), Af = !0;
          }
          Jt = null;
          break;
        case 5:
          Ka(t, l);
          break;
        case 4:
          a = $t, $t = !1, Ka(t, l), $t && (di = !0), $t = a;
          break;
        case 22:
          l.memoizedState === null && (e.memoizedState !== null ? Ef(l, !1) : Ka(t, l));
          break;
        case 30:
          a = $t, u = hr(), $t = !1, Ka(t, l), $t && (l.flags |= 4);
          var n = l.memoizedProps, i = l.stateNode;
          t = ne(n, i), i = ne(e.memoizedProps, i);
          var c = ie(n.default, n.update);
          c === "none" ? t = !1 : (n = e.memoizedState, e.memoizedState = null, e = l.child, ut = 0, t = _f(
            l,
            e,
            t,
            i,
            c,
            n,
            !0
          ), ut !== (n === null ? 0 : n.length) && (l.flags |= 32)), (l.flags & 4) !== 0 && t ? (ka(
            l,
            l.memoizedProps.onUpdate
          ), Jt = u) : u !== null && (u.push.apply(u, Jt), Jt = u), $t = (l.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          Ka(t, l);
      }
  }
  function Wt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Er(l, t.alternate, t), t = t.sibling;
  }
  function He(l, t) {
    for (l = l.child; l !== null; ) {
      var e = l, a = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Re(4, e, e.return), He(
            e,
            a
          );
          break;
        case 1:
          Kl(e, e.return);
          var u = e.stateNode;
          typeof u.componentWillUnmount == "function" && or(
            e,
            e.return,
            u
          ), He(
            e,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && x0(
            e.stateNode,
            e.type,
            e.memoizedProps
          );
        case 5:
          Kl(e, e.return), e.tag !== 5 && e.tag !== 27 || Vu(e), He(
            e,
            a
          );
          break;
        case 6:
          Vu(e);
          break;
        case 26:
          Kl(e, e.return), u = e.stateNode, e.memoizedState !== null || u === null || il || u.parentNode.removeChild(u), He(
            e,
            a
          );
          break;
        case 22:
          e.memoizedState === null && He(
            e,
            a
          );
          break;
        case 30:
          Kl(e, e.return), He(
            e,
            a
          );
          break;
        case 7:
          Kl(e, e.return);
        default:
          He(
            e,
            a
          );
      }
      l = l.sibling;
    }
  }
  function qt(l, t, e) {
    for (e = (t.subtreeFlags & 8772) !== 0 ? e : e & -2, t = t.child; t !== null; ) {
      var a = t.alternate, u = l, n = t, i = n.flags, c = (e & 1) !== 0;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          qt(
            u,
            n,
            e
          ), Qu(4, n);
          break;
        case 1:
          if (qt(
            u,
            n,
            e
          ), a = n, u = a.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (S) {
              sl(a, a.return, S);
            }
          if (a = n, u = a.updateQueue, u !== null) {
            var s = a.stateNode;
            try {
              var m = u.shared.hiddenCallbacks;
              if (m !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < m.length; u++)
                  Io(m[u], s);
            } catch (S) {
              sl(a, a.return, S);
            }
          }
          c && i & 64 && sr(n), Kt(n, n.return);
          break;
        case 27:
          (e & 2) !== 0 && vr(n);
        case 5:
          n.tag !== 5 && n.tag !== 27 || dr(n), qt(
            u,
            n,
            e
          ), c && a === null && i & 4 && gf(n), Kt(n, n.return);
          break;
        case 6:
          dr(n);
          break;
        case 26:
          s = n.stateNode, n.memoizedState !== null || s === null || Bl || vs(
            ku(s.ownerDocument),
            n.type,
            s
          ), qt(
            u,
            n,
            e
          ), c && a === null && i & 4 && gf(n), Kt(n, n.return);
          break;
        case 12:
          qt(
            u,
            n,
            e
          );
          break;
        case 31:
          qt(
            u,
            n,
            e
          ), c && i & 4 && _r(u, n);
          break;
        case 13:
          qt(
            u,
            n,
            e
          ), c && i & 4 && jr(u, n);
          break;
        case 22:
          n.memoizedState === null && qt(
            u,
            n,
            e
          ), Kt(n, n.return);
          break;
        case 30:
          qt(
            u,
            n,
            e
          ), Kt(n, n.return);
          break;
        case 7:
          Kt(n, n.return);
        default:
          qt(
            u,
            n,
            e
          );
      }
      t = t.sibling;
    }
  }
  function Mf(l, t) {
    var e = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== e && (l != null && l.refCount++, e != null && xu(e));
  }
  function pf(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && xu(l));
  }
  function Dt(l, t, e, a) {
    var u = (e & 335544064) === e;
    if (t.subtreeFlags & (u ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Mr(
          l,
          t,
          e,
          a
        ), t = t.sibling;
    else u && Sr(t);
  }
  function Mr(l, t, e, a) {
    var u = (e & 335544064) === e;
    u && t.alternate === null && t.return !== null && t.return.alternate !== null && oi(t);
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Dt(
          l,
          t,
          e,
          a
        ), n & 2048 && Qu(9, t);
        break;
      case 1:
        Dt(
          l,
          t,
          e,
          a
        );
        break;
      case 3:
        Dt(
          l,
          t,
          e,
          a
        ), u && Af && (l = l.containerInfo, l = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, l.style.viewTransitionName === "root" && (l.style.viewTransitionName = ""), l = l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "none" && (l.style.viewTransitionName = "")), n & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== n && (t.refCount++, n != null && xu(n)));
        break;
      case 12:
        if (n & 2048) {
          Dt(
            l,
            t,
            e,
            a
          ), n = t.stateNode;
          try {
            var i = t.memoizedProps, c = i.id, s = i.onPostCommit;
            typeof s == "function" && s(
              c,
              t.alternate === null ? "mount" : "update",
              n.passiveEffectDuration,
              -0
            );
          } catch (m) {
            sl(t, t.return, m);
          }
        } else
          Dt(
            l,
            t,
            e,
            a
          );
        break;
      case 31:
        Dt(
          l,
          t,
          e,
          a
        );
        break;
      case 13:
        Dt(
          l,
          t,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, c = t.alternate, t.memoizedState !== null ? (u && c !== null && c.memoizedState === null && oi(c), i._visibility & 2 ? Dt(
          l,
          t,
          e,
          a
        ) : Lu(
          l,
          t
        )) : (u && c !== null && c.memoizedState !== null && oi(t), i._visibility & 2 ? Dt(
          l,
          t,
          e,
          a
        ) : (i._visibility |= 2, Ja(
          l,
          t,
          e,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), n & 2048 && Mf(c, t);
        break;
      case 24:
        Dt(
          l,
          t,
          e,
          a
        ), n & 2048 && pf(t.alternate, t);
        break;
      case 30:
        u && (n = t.alternate, n !== null && (wt(n.child, !0), wt(t.child, !0))), Dt(
          l,
          t,
          e,
          a
        );
        break;
      default:
        Dt(
          l,
          t,
          e,
          a
        );
    }
  }
  function Ja(l, t, e, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, i = t, c = e, s = a, m = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          Ja(
            n,
            i,
            c,
            s,
            u
          ), Qu(8, i);
          break;
        case 23:
          break;
        case 22:
          var S = i.stateNode;
          i.memoizedState !== null ? S._visibility & 2 ? Ja(
            n,
            i,
            c,
            s,
            u
          ) : Lu(
            n,
            i
          ) : (S._visibility |= 2, Ja(
            n,
            i,
            c,
            s,
            u
          )), u && m & 2048 && Mf(
            i.alternate,
            i
          );
          break;
        case 24:
          Ja(
            n,
            i,
            c,
            s,
            u
          ), u && m & 2048 && pf(i.alternate, i);
          break;
        default:
          Ja(
            n,
            i,
            c,
            s,
            u
          );
      }
      t = t.sibling;
    }
  }
  function Lu(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l, a = t, u = a.flags;
        switch (a.tag) {
          case 22:
            Lu(e, a), u & 2048 && Mf(
              a.alternate,
              a
            );
            break;
          case 24:
            Lu(e, a), u & 2048 && pf(a.alternate, a);
            break;
          default:
            Lu(e, a);
        }
        t = t.sibling;
      }
  }
  var ma = 8192;
  function ha(l, t, e) {
    if (l.subtreeFlags & ma)
      for (l = l.child; l !== null; )
        pr(
          l,
          t,
          e
        ), l = l.sibling;
  }
  function pr(l, t, e) {
    switch (l.tag) {
      case 26:
        ha(
          l,
          t,
          e
        ), l.flags & ma && (l.memoizedState !== null ? $h(
          e,
          Ht,
          l.memoizedState,
          l.memoizedProps
        ) : (l = l.stateNode, (t & 335544128) === t && B0(e, l)));
        break;
      case 5:
        ha(
          l,
          t,
          e
        ), l.flags & ma && (l = l.stateNode, (t & 335544128) === t && B0(e, l));
        break;
      case 3:
      case 4:
        var a = Ht;
        Ht = ku(l.stateNode.containerInfo), ha(
          l,
          t,
          e
        ), Ht = a;
        break;
      case 22:
        l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = ma, ma = 16777216, ha(
          l,
          t,
          e
        ), ma = a) : ha(
          l,
          t,
          e
        ));
        break;
      case 30:
        if ((l.flags & ma) !== 0 && (a = l.memoizedProps.name, a != null && a !== "auto")) {
          var u = l.stateNode;
          u.paired = null, ht === null && (ht = /* @__PURE__ */ new Map()), ht.set(a, u);
        }
        ha(
          l,
          t,
          e
        );
        break;
      default:
        ha(
          l,
          t,
          e
        );
    }
  }
  function Cr(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function Ku(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Gl = a, Rr(
            a,
            l
          );
        }
      Cr(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        Ur(l), l = l.sibling;
  }
  function Ur(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        Ku(l), l.flags & 2048 && Re(9, l, l.return);
        break;
      case 3:
        Ku(l);
        break;
      case 12:
        Ku(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, mi(l)) : Ku(l);
        break;
      default:
        Ku(l);
    }
  }
  function mi(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Gl = a, Rr(
            a,
            l
          );
        }
      Cr(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          Re(8, t, t.return), mi(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, mi(t));
          break;
        default:
          mi(t);
      }
      l = l.sibling;
    }
  }
  function Rr(l, t) {
    for (; Gl !== null; ) {
      var e = Gl;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Re(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          xu(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, Gl = a;
      else
        l: for (e = l; Gl !== null; ) {
          a = Gl;
          var u = a.sibling, n = a.return;
          if (zr(a), a === e) {
            Gl = null;
            break l;
          }
          if (u !== null) {
            u.return = n, Gl = u;
            break l;
          }
          Gl = n;
        }
    }
  }
  var Lm = {
    getCacheForType: function(l) {
      var t = Vl(Al), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    },
    cacheSignal: function() {
      return Vl(Al).controller.signal;
    }
  }, Km = typeof WeakMap == "function" ? WeakMap : Map, ul = 0, ml = null, F = null, W = 0, fl = 0, yt = null, qe = !1, wa = !1, Cf = !1, he = 0, Ol = 0, Ye = 0, ya = 0, hi = 0, gt = 0, Fa = 0, Ju = null, it = null, Uf = !1, yi = 0, Hr = 0, gi = 1 / 0, Si = null, Be = null, Nl = 0, Yt = null, ga = null, It = 0, Rf = 0, Hf = null, qr = null, $a = null, Wa = null, Ia = null, wu = 0, Ti = null;
  function St() {
    return (ul & 2) !== 0 && W !== 0 ? W & -W : x.T !== null ? Kf() : Bs();
  }
  function Yr() {
    if (gt === 0)
      if ((W & 536870912) === 0 || J) {
        var l = vn;
        vn <<= 1, (vn & 3932160) === 0 && (vn = 262144), gt = l;
      } else gt = 536870912;
    return l = Zl.current, l !== null && (l.flags |= 32), gt;
  }
  function ka(l, t) {
    if (t != null) {
      var e = l.stateNode, a = e.ref;
      a === null && (a = e.ref = g0(
        ne(l.memoizedProps, e)
      )), Wa === null && (Wa = []), Wa.push(t.bind(null, a));
    }
  }
  function ct(l, t, e) {
    (l === ml && (fl === 2 || fl === 9) || l.cancelPendingCommit !== null) && (Pa(l, 0), Ge(
      l,
      W,
      gt,
      !1
    )), mu(l, e), ((ul & 2) === 0 || l !== ml) && (l === ml && ((ul & 2) === 0 && (ya |= e), Ol === 4 && Ge(
      l,
      W,
      gt,
      !1
    )), kt(l));
  }
  function Br(l, t, e) {
    if ((ul & 6) !== 0) throw Error(g(327));
    var a = !e && (t & 127) === 0 && (t & l.expiredLanes) === 0 || vu(l, t), u = a ? Fm(l, t) : Yf(l, t, !0), n = a;
    do {
      if (u === 0) {
        wa && !a && Ge(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, n && !Jm(e)) {
          u = Yf(l, t, !1), n = !1;
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
              var c = l;
              u = Ju;
              var s = c.current.memoizedState.isDehydrated;
              if (s && (Pa(c, i).flags |= 256), i = Yf(
                c,
                i,
                !1
              ), i !== 2 && i !== 6) {
                if (Cf && !s) {
                  c.errorRecoveryDisabledLanes |= n, ya |= n, u = 4;
                  break l;
                }
                n = it, it = u, n !== null && (it === null ? it = n : it.push.apply(
                  it,
                  n
                ));
              }
              u = i;
            }
            if (n = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Pa(l, 0), Ge(l, t, 0, !0);
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
              Ge(
                a,
                t,
                gt,
                !qe
              );
              break l;
            case 2:
              it = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(g(329));
          }
          if ((t & 62914560) === t && (u = yi + 300 - st(), 10 < u)) {
            if (Ge(
              a,
              t,
              gt,
              !qe
            ), hn(a, 0, !0) !== 0) break l;
            It = t, a.timeoutHandle = es(
              Gr.bind(
                null,
                a,
                e,
                it,
                Si,
                Uf,
                t,
                gt,
                ya,
                Fa,
                qe,
                n,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break l;
          }
          Gr(
            a,
            e,
            it,
            Si,
            Uf,
            t,
            gt,
            ya,
            Fa,
            qe,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    kt(l);
  }
  function Gr(l, t, e, a, u, n, i, c, s, m, S, E, r, y) {
    l.timeoutHandle = -1;
    var O = t.subtreeFlags, A = (n & 335544064) === n;
    if (E = null, (A || O & 8192 || (O & 16785408) === 16785408) && (E = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Vt
    }, ht = null, pr(
      t,
      n,
      E
    ), A && (O = E, A = l.containerInfo, A = (A.nodeType === 9 ? A : A.ownerDocument).__reactViewTransition, A != null && (O.count++, O.waitingForViewTransition = !0, O = tn.bind(O), A.finished.then(O, O))), O = (n & 62914560) === n ? yi - st() : (n & 4194048) === n ? Hr - st() : 0, O = Wh(
      E,
      O
    ), O !== null)) {
      It = n, l.cancelPendingCommit = O(
        wr.bind(
          null,
          l,
          t,
          n,
          e,
          a,
          u,
          i,
          c,
          s,
          m,
          S,
          E,
          null,
          r,
          y
        )
      ), Ge(l, n, i, !m);
      return;
    }
    wr(
      l,
      t,
      n,
      e,
      a,
      u,
      i,
      c,
      s,
      m,
      S,
      E
    );
  }
  function Jm(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var a = 0; a < e.length; a++) {
          var u = e[a], n = u.getSnapshot;
          u = u.value;
          try {
            if (!vt(n(), u)) return !1;
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
  function Ge(l, t, e, a) {
    t = Us(l, t), t &= ~hi, t &= ~ya, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var u = t; 0 < u; ) {
      var n = 31 - dt(u), i = 1 << n;
      a[n] = -1, u &= ~i;
    }
    e !== 0 && Hs(l, e, t);
  }
  function bi() {
    return (ul & 6) === 0 ? (Fu(0), !1) : !0;
  }
  function qf() {
    if (F !== null) {
      if (fl === 0)
        var l = F.return;
      else
        l = F, se = ua = null, Zc(l), Ga = null, pu = 0, l = F;
      for (; l !== null; )
        fr(l.alternate, l), l = l.return;
      F = null;
    }
  }
  function Pa(l, t) {
    var e = l.timeoutHandle;
    return e !== -1 && (l.timeoutHandle = -1, yh(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), It = 0, qf(), ml = l, F = e = ce(l.current, null), W = t, fl = 0, yt = null, qe = !1, wa = vu(l, t), Cf = !1, Fa = gt = hi = ya = Ye = Ol = 0, it = Ju = null, Uf = !1, he = Us(l, t), xn(), e;
  }
  function Xr(l, t) {
    Q = null, x.H = Pn, t === Ba || t === Gn ? (t = wo(), fl = 3) : t === Mc ? (t = wo(), fl = 4) : fl = t === uf ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, yt = t, F === null && (Ol = 1, li(
      l,
      _t(t, l.current)
    ));
  }
  function Qr() {
    var l = Zl.current;
    return l === null ? !0 : (W & 4194048) === W ? $l === null : (W & 62914560) === W || (W & 536870912) !== 0 ? l === $l : !1;
  }
  function Vr() {
    var l = x.H;
    return x.H = Pn, l === null ? Pn : l;
  }
  function Zr() {
    var l = x.A;
    return x.A = Lm, l;
  }
  function Ei() {
    Ol = 4, qe || (W & 4194048) !== W && Zl.current !== null || (wa = !0), (Ye & 134217727) === 0 && (ya & 134217727) === 0 || ml === null || Ge(
      ml,
      W,
      gt,
      !1
    );
  }
  function Yf(l, t, e) {
    var a = ul;
    ul |= 2;
    var u = Vr(), n = Zr();
    (ml !== l || W !== t) && (Si = null, Pa(l, t)), t = !1;
    var i = Ol;
    l: do
      try {
        if (fl !== 0 && F !== null) {
          var c = F, s = yt;
          switch (fl) {
            case 8:
              qf(), i = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              Zl.current === null && (t = !0);
              var m = fl;
              if (fl = 0, yt = null, lu(l, c, s, m), e && wa) {
                i = 0;
                break l;
              }
              break;
            default:
              m = fl, fl = 0, yt = null, lu(l, c, s, m);
          }
        }
        wm(), i = Ol;
        break;
      } catch (S) {
        Xr(l, S);
      }
    while (!0);
    return t && l.shellSuspendCounter++, se = ua = null, ul = a, x.H = u, x.A = n, F === null && (ml = null, W = 0, xn()), i;
  }
  function wm() {
    for (; F !== null; ) Lr(F);
  }
  function Fm(l, t) {
    var e = ul;
    ul |= 2;
    var a = Vr(), u = Zr();
    ml !== l || W !== t ? (Si = null, gi = st() + 500, Pa(l, t)) : wa = vu(
      l,
      t
    );
    l: do
      try {
        if (fl !== 0 && F !== null) {
          t = F;
          var n = yt;
          t: switch (fl) {
            case 1:
              fl = 0, yt = null, lu(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (Ko(n)) {
                fl = 0, yt = null, Kr(t);
                break;
              }
              t = function() {
                fl !== 2 && fl !== 9 || ml !== l || (fl = 7), kt(l);
              }, n.then(t, t);
              break l;
            case 3:
              fl = 7;
              break l;
            case 4:
              fl = 5;
              break l;
            case 7:
              Ko(n) ? (fl = 0, yt = null, Kr(t)) : (fl = 0, yt = null, lu(l, t, n, 7));
              break;
            case 5:
              var i = null;
              switch (F.tag) {
                case 26:
                  i = F.memoizedState;
                case 5:
                case 27:
                  var c = F;
                  if (i ? q0(i) : c.stateNode.complete) {
                    fl = 0, yt = null;
                    var s = c.sibling;
                    if (s !== null) F = s;
                    else {
                      var m = c.return;
                      m !== null ? (F = m, Ni(m)) : F = null;
                    }
                    break t;
                  }
              }
              fl = 0, yt = null, lu(l, t, n, 5);
              break;
            case 6:
              fl = 0, yt = null, lu(l, t, n, 6);
              break;
            case 8:
              qf(), Ol = 6;
              break l;
            default:
              throw Error(g(462));
          }
        }
        $m();
        break;
      } catch (S) {
        Xr(l, S);
      }
    while (!0);
    return se = ua = null, x.H = a, x.A = u, ul = e, F !== null ? 0 : (ml = null, W = 0, xn(), Ol);
  }
  function $m() {
    for (; F !== null && !rv(); )
      Lr(F);
  }
  function Lr(l) {
    var t = ir(l.alternate, l, he);
    l.memoizedProps = l.pendingProps, t === null ? Ni(l) : F = t;
  }
  function Kr(l) {
    var t = l, e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Pd(
          e,
          t,
          t.pendingProps,
          t.type,
          void 0,
          W
        );
        break;
      case 11:
        t = Pd(
          e,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          W
        );
        break;
      case 5:
        Zc(t);
        var a = t;
        a === Yl && (J ? (Rn(a), a.tag === 5 && a.stateNode != null && (Sl = a.stateNode)) : (Rn(a), J = !0));
      default:
        fr(e, t), t = F = Ro(t, he), t = ir(e, t, he);
    }
    l.memoizedProps = l.pendingProps, t === null ? Ni(l) : F = t;
  }
  function lu(l, t, e, a) {
    se = ua = null, Zc(t), Ga = null, pu = 0;
    var u = t.return;
    try {
      if (qm(
        l,
        u,
        t,
        e,
        W
      )) {
        Ol = 1, li(
          l,
          _t(e, l.current)
        ), F = null;
        return;
      }
    } catch (n) {
      if (u !== null) throw F = u, n;
      Ol = 1, li(
        l,
        _t(e, l.current)
      ), F = null;
      return;
    }
    t.flags & 32768 ? (J || a === 1 ? l = !0 : wa || (W & 536870912) !== 0 ? l = !1 : (qe = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Zl.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Jr(t, l)) : Ni(t);
  }
  function Ni(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        Jr(
          t,
          qe
        );
        return;
      }
      l = t.return;
      var e = Xm(
        t.alternate,
        t,
        he
      );
      if (e !== null) {
        F = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        F = t;
        return;
      }
      F = t = l;
    } while (t !== null);
    Ol === 0 && (Ol = 5);
  }
  function Jr(l, t) {
    do {
      var e = Qm(l.alternate, l);
      if (e !== null) {
        e.flags &= 32767, F = e;
        return;
      }
      if (e = l.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (l = l.sibling, l !== null)) {
        F = l;
        return;
      }
      F = l = e;
    } while (l !== null);
    Ol = 6, F = null;
  }
  function wr(l, t, e, a, u, n, i, c, s, m, S, E) {
    l.cancelPendingCommit = null;
    do
      zi();
    while (Nl !== 0);
    if ((ul & 6) !== 0) throw Error(g(327));
    if (t !== null) {
      if (t === l.current) throw Error(g(177));
      l === ml && (F = ml = null, W = 0), ga = t, Yt = l, It = e, Hf = u, qr = a, Wm(
        l,
        t,
        e,
        i,
        c,
        s,
        E
      );
    }
  }
  function Wm(l, t, e, a, u, n, i) {
    var c = t.lanes | t.childLanes;
    if (Rf = c, c |= gc, Nv(
      l,
      e,
      c,
      a,
      u,
      n
    ), Wa = null, (e & 335544064) === e ? (Ia = Om(l), a = 10262) : (Ia = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, eh(dn, function() {
      return Qf(), null;
    })) : (l.callbackNode = null, l.callbackPriority = 0), fi = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = x.T, x.T = null, u = Y.p, Y.p = 2, n = ul, ul |= 4;
      try {
        Vm(l, t, e);
      } finally {
        ul = n, Y.p = u, x.T = a;
      }
    }
    Nl = 1, fi ? $a = Nh(
      i,
      l.containerInfo,
      Ia,
      Bf,
      Gf,
      km,
      Xf,
      Qf,
      Im
    ) : (Bf(), Gf(), Xf());
  }
  function Im(l) {
    if (Nl !== 0) {
      var t = Yt.onRecoverableError;
      t(l, { componentStack: null });
    }
  }
  function km() {
    Nl === 3 && (Nl = 0, Dr(ga, Yt), Nl = 4);
  }
  function Bf() {
    if (Nl === 1) {
      Nl = 0;
      var l = Yt, t = ga, e = It, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = x.T, x.T = null;
        var u = Y.p;
        Y.p = 2;
        var n = ul;
        ul |= 4;
        try {
          Zu = di = !1, Ar(t, l, e), e = Pf;
          var i = Oo(l.containerInfo), c = e.focusedElem, s = e.selectionRange;
          if (i !== c && c && c.ownerDocument && zo(
            c.ownerDocument.documentElement,
            c
          )) {
            if (s !== null && rc(c)) {
              var m = s.start, S = s.end;
              if (S === void 0 && (S = m), "selectionStart" in c)
                c.selectionStart = m, c.selectionEnd = Math.min(
                  S,
                  c.value.length
                );
              else {
                var E = c.ownerDocument || document, r = E && E.defaultView || window;
                if (r.getSelection) {
                  var y = r.getSelection(), O = c.textContent.length, A = Math.min(s.start, O), V = s.end === void 0 ? A : Math.min(s.end, O);
                  !y.extend && A > V && (i = V, V = A, A = i);
                  var v = No(
                    c,
                    A
                  ), o = No(
                    c,
                    V
                  );
                  if (v && o && (y.rangeCount !== 1 || y.anchorNode !== v.node || y.anchorOffset !== v.offset || y.focusNode !== o.node || y.focusOffset !== o.offset)) {
                    var h = E.createRange();
                    h.setStart(v.node, v.offset), y.removeAllRanges(), A > V ? (y.addRange(h), y.extend(o.node, o.offset)) : (h.setEnd(o.node, o.offset), y.addRange(h));
                  }
                }
              }
            }
            for (E = [], y = c; y = y.parentNode; )
              y.nodeType === 1 && E.push({
                element: y,
                left: y.scrollLeft,
                top: y.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < E.length; c++) {
              var b = E[c];
              b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
            }
          }
          fu = !!kf, Pf = kf = null;
        } finally {
          ul = n, Y.p = u, x.T = a;
        }
      }
      l.current = t, Nl = 2;
    }
  }
  function Gf() {
    if (Nl === 2) {
      Nl = 0;
      var l = Yt, t = ga, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = x.T, x.T = null;
        var a = Y.p;
        Y.p = 2;
        var u = ul;
        ul |= 4;
        try {
          Er(l, t.alternate, t);
        } finally {
          ul = u, Y.p = a, x.T = e;
        }
      }
      Nl = 3;
    }
  }
  function Xf() {
    if (Nl === 4 || Nl === 3) {
      Nl = 0;
      var l = $a;
      $a = null, vv();
      var t = Yt, e = ga, a = It, u = qr, n = (a & 335544064) === a ? 10262 : 10256;
      if ((e.subtreeFlags & n) !== 0 || (e.flags & n) !== 0 ? Nl = 5 : (Nl = 0, ga = Yt = null, Fr(t, t.pendingLanes)), n = t.pendingLanes, n === 0 && (Be = null), Fi(a), e = e.stateNode, ot && typeof ot.onCommitFiberRoot == "function")
        try {
          ot.onCommitFiberRoot(
            ru,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        e = x.T, n = Y.p, Y.p = 2, x.T = null;
        try {
          for (var i = t.onRecoverableError, c = 0; c < u.length; c++) {
            var s = u[c];
            i(s.value, {
              componentStack: s.stack
            });
          }
        } finally {
          x.T = e, Y.p = n;
        }
      }
      if (u = Wa, i = Ia, Ia = null, u !== null && (Wa = null, i === null && (i = []), l !== null))
        for (s = 0; s < u.length; s++)
          e = (0, u[s])(
            i
          ), e !== void 0 && l.finished.finally(e);
      (It & 3) !== 0 && zi(), kt(t), n = t.pendingLanes, (a & 261930) !== 0 && (n & 42) !== 0 ? t === Ti ? wu++ : (wu = 0, Ti = t) : (wu = 0, Ti = null), Fu(0);
    }
  }
  function Fr(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, xu(t)));
  }
  function zi() {
    return $a !== null && ($a.skipTransition(), $a = null), Bf(), Gf(), Xf(), Qf();
  }
  function Qf() {
    if (Nl !== 5) return !1;
    var l = Yt, t = Rf;
    Rf = 0;
    var e = Fi(It), a = x.T, u = Y.p;
    try {
      Y.p = 32 > e ? 32 : e, x.T = null, e = Hf, Hf = null;
      var n = Yt, i = It;
      if (Nl = 0, ga = Yt = null, It = 0, (ul & 6) !== 0) throw Error(g(331));
      var c = ul;
      if (ul |= 4, Ur(n.current), Mr(
        n,
        n.current,
        i,
        e
      ), ul = c, Fu(0, !1), ot && typeof ot.onPostCommitFiberRoot == "function")
        try {
          ot.onPostCommitFiberRoot(ru, n);
        } catch {
        }
      return !0;
    } finally {
      Y.p = u, x.T = a, Fr(l, t);
    }
  }
  function $r(l, t, e) {
    t = _t(e, t), t = af(l.stateNode, t, 2), l = Me(l, t, 2), l !== null && (mu(l, 2), kt(l));
  }
  function sl(l, t, e) {
    if (l.tag === 3)
      $r(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          $r(
            t,
            l,
            e
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Be === null || !Be.has(a))) {
            l = _t(e, l), e = Kd(2), a = Me(t, e, 2), a !== null && (Jd(
              e,
              a,
              t,
              l
            ), mu(a, 2), kt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Vf(l, t, e) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new Km();
      var u = /* @__PURE__ */ new Set();
      a.set(t, u);
    } else
      u = a.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), a.set(t, u));
    u.has(e) || (Cf = !0, u.add(e), l = Pm.bind(null, l, t, e), t.then(l, l));
  }
  function Pm(l, t, e) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, ml === l && (W & e) === e && ((Ol === 4 || Ol === 3 && (W & 62914560) === W && 300 > st() - yi) && (ul & 2) === 0 ? Pa(l, 0) : hi |= e, Fa === W && (Fa = 0)), kt(l);
  }
  function Wr(l, t) {
    t === 0 && (t = Rs()), l = ta(l, t), l !== null && (mu(l, t), kt(l));
  }
  function lh(l) {
    var t = l.memoizedState, e = 0;
    t !== null && (e = t.retryLane), Wr(l, e);
  }
  function th(l, t) {
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
    a !== null && a.delete(t), Wr(l, e);
  }
  function eh(l, t) {
    return Li(l, t);
  }
  var tu = null, eu = null, Zf = !1, Oi = !1, Lf = !1, Xe = 0;
  function kt(l) {
    l !== eu && l.next === null && (eu === null ? tu = eu = l : eu = eu.next = l), Oi = !0, Zf || (Zf = !0, uh());
  }
  function Fu(l, t) {
    if (!Lf && Oi) {
      Lf = !0;
      do
        for (var e = !1, a = tu; a !== null; ) {
          if (l !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes, c = a.pingedLanes;
              n = (1 << 31 - dt(42 | l) + 1) - 1, n &= u & ~(i & ~c), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (e = !0, l0(a, n));
          } else
            n = W, n = hn(
              a,
              a === ml ? n : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (n & 3) === 0 || vu(a, n) || (e = !0, l0(a, n));
          a = a.next;
        }
      while (e);
      Lf = !1;
    }
  }
  function ah() {
    Ir();
  }
  function Ir() {
    Oi = Zf = !1;
    var l = 0;
    Xe !== 0 && hh() && (l = Xe);
    for (var t = st(), e = null, a = tu; a !== null; ) {
      var u = a.next, n = kr(a, t);
      n === 0 ? (a.next = null, e === null ? tu = u : e.next = u, u === null && (eu = e)) : (e = a, (l !== 0 || (n & 3) !== 0) && (Oi = !0)), a = u;
    }
    Nl !== 0 && Nl !== 5 || Fu(l), Xe !== 0 && (Xe = 0);
  }
  function kr(l, t) {
    for (var e = l.suspendedLanes, a = l.pingedLanes, u = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - dt(n), c = 1 << i, s = u[i];
      s === -1 ? ((c & e) === 0 || (c & a) !== 0) && (u[i] = Ev(c, t)) : s <= t && (l.expiredLanes |= c), n &= ~c;
    }
    if (t = ml, e = W, e = hn(
      l,
      l === t ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, e === 0 || l === t && (fl === 2 || fl === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Ki(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((e & 3) === 0 || vu(l, e)) {
      if (t = e & -e, t === l.callbackPriority) return t;
      switch (a !== null && Ki(a), Fi(e)) {
        case 2:
        case 8:
          e = ps;
          break;
        case 32:
          e = dn;
          break;
        case 268435456:
          e = Cs;
          break;
        default:
          e = dn;
      }
      return a = Pr.bind(null, l), e = Li(e, a), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return a !== null && a !== null && Ki(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function Pr(l, t) {
    if (Nl !== 0 && Nl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (zi() && l.callbackNode !== e)
      return null;
    var a = W;
    return a = hn(
      l,
      l === ml ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (Br(l, a, t), kr(l, st()), l.callbackNode != null && l.callbackNode === e ? Pr.bind(null, l) : null);
  }
  function l0(l, t) {
    if (zi()) return null;
    Br(l, t, !0);
  }
  function uh() {
    gh(function() {
      (ul & 6) !== 0 ? Li(
        Ms,
        ah
      ) : Ir();
    });
  }
  function Kf() {
    if (Xe === 0) {
      var l = ca;
      l === 0 && (l = rn, rn <<= 1, (rn & 261888) === 0 && (rn = 256)), Xe = l;
    }
    return Xe;
  }
  function t0(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : bn(l);
  }
  function nh(l, t, e, a, u) {
    if (t === "submit" && e && e.stateNode === u) {
      var n = t0(
        (u[et] || null).action
      ), i = a.submitter;
      i && (t = (t = i[et] || null) ? t0(t.formAction) : i.getAttribute("formAction"), t !== null && (n = t, i = null));
      var c = new On(
        "action",
        "action",
        null,
        a,
        u
      );
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Xe !== 0) {
                  var s = new FormData(u, i);
                  kc(
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
                typeof n == "function" && (c.preventDefault(), s = new FormData(u, i), kc(
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
  for (var Jf = 0; Jf < yc.length; Jf++) {
    var wf = yc[Jf], ih = wf.toLowerCase(), ch = wf[0].toUpperCase() + wf.slice(1);
    Ut(
      ih,
      "on" + ch
    );
  }
  Ut(Ao, "onAnimationEnd"), Ut(xo, "onAnimationIteration"), Ut(Do, "onAnimationStart"), Ut("dblclick", "onDoubleClick"), Ut("focusin", "onFocus"), Ut("focusout", "onBlur"), Ut(ym, "onTransitionRun"), Ut(gm, "onTransitionStart"), Ut(Sm, "onTransitionCancel"), Ut(Mo, "onTransitionEnd"), Oa("onMouseEnter", ["mouseout", "mouseover"]), Oa("onMouseLeave", ["mouseout", "mouseover"]), Oa("onPointerEnter", ["pointerout", "pointerover"]), Oa("onPointerLeave", ["pointerout", "pointerover"]), ke(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), ke(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), ke("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), ke(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), ke(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), ke(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var $u = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), fh = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($u)
  );
  function e0(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var a = l[e], u = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var c = a[i], s = c.instance, m = c.currentTarget;
            if (c = c.listener, s !== n && u.isPropagationStopped())
              break l;
            n = c, u.currentTarget = m;
            try {
              n(u);
            } catch (S) {
              An(S);
            }
            u.currentTarget = null, n = s;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (c = a[i], s = c.instance, m = c.currentTarget, c = c.listener, s !== n && u.isPropagationStopped())
              break l;
            n = c, u.currentTarget = m;
            try {
              n(u);
            } catch (S) {
              An(S);
            }
            u.currentTarget = null, n = s;
          }
      }
    }
  }
  function $(l, t) {
    var e = t[Xs];
    e === void 0 && (e = t[Xs] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    e.has(a) || (a0(t, l, 2, !1), e.add(a));
  }
  function Ff(l, t, e) {
    var a = 0;
    t && (a |= 4), a0(
      e,
      l,
      a,
      t
    );
  }
  var _i = "_reactListening" + Math.random().toString(36).slice(2);
  function $f(l) {
    if (!l[_i]) {
      l[_i] = !0, Zs.forEach(function(e) {
        e !== "selectionchange" && (fh.has(e) || Ff(e, !1, l), Ff(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[_i] || (t[_i] = !0, Ff("selectionchange", !1, t));
    }
  }
  function a0(l, t, e, a) {
    switch (J0(t)) {
      case 2:
        var u = l1;
        break;
      case 8:
        u = t1;
        break;
      default:
        u = hs;
    }
    e = u.bind(
      null,
      t,
      e,
      l
    ), u = void 0, !ec || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = !0), a ? u !== void 0 ? l.addEventListener(t, e, {
      capture: !0,
      passive: u
    }) : l.addEventListener(t, e, !0) : u !== void 0 ? l.addEventListener(t, e, {
      passive: u
    }) : l.addEventListener(t, e, !1);
  }
  function Wf(l, t, e, a, u) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var c = a.stateNode.containerInfo;
          if (c === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var s = i.tag;
              if ((s === 3 || s === 4) && i.stateNode.containerInfo === u)
                return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (i = Ie(c), i === null) return;
            if (s = i.tag, s === 5 || s === 6 || s === 26 || s === 27) {
              a = n = i;
              continue l;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    eo(function() {
      var m = n, S = lc(e), E = [];
      l: {
        var r = po.get(l);
        if (r !== void 0) {
          var y = On, O = l;
          switch (l) {
            case "keypress":
              if (Nn(e) === 0) break l;
            case "keydown":
            case "keyup":
              y = Jv;
              break;
            case "focusin":
              O = "focus", y = ic;
              break;
            case "focusout":
              O = "blur", y = ic;
              break;
            case "beforeblur":
            case "afterblur":
              y = ic;
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
              y = no;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              y = Rv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              y = Iv;
              break;
            case Ao:
            case xo:
            case Do:
              y = Yv;
              break;
            case Mo:
              y = Pv;
              break;
            case "scroll":
            case "scrollend":
              y = Cv;
              break;
            case "wheel":
              y = tm;
              break;
            case "copy":
            case "cut":
            case "paste":
              y = Gv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              y = co;
              break;
            case "submit":
              y = $v;
              break;
            case "toggle":
            case "beforetoggle":
              y = am;
          }
          var A = (t & 4) !== 0, V = !A && (l === "scroll" || l === "scrollend"), v = A ? r !== null ? r + "Capture" : null : r;
          A = [];
          for (var o = m, h; o !== null; ) {
            var b = o;
            if (h = b.stateNode, b = b.tag, b !== 5 && b !== 26 && b !== 27 || h === null || v === null || (b = gu(o, v), b != null && A.push(
              Wu(o, b, h)
            )), V) break;
            o = o.return;
          }
          0 < A.length && (r = new y(
            r,
            O,
            null,
            e,
            S
          ), E.push({ event: r, listeners: A }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (y = l === "mouseover" || l === "pointerover", r = l === "mouseout" || l === "pointerout", y && e !== Pi && (O = e.relatedTarget || e.fromElement) && (Ie(O) || O[Ea]))
            break l;
          (r || y) && (O = S.window === S ? S : (y = S.ownerDocument) ? y.defaultView || y.parentWindow : window, r ? (y = e.relatedTarget || e.toElement, r = m, y = y ? Ie(y) : null, y !== null && (V = w(y), A = y.tag, y !== V || A !== 5 && A !== 27 && A !== 6) && (y = null)) : (r = null, y = m), r !== y && (A = no, b = "onMouseLeave", v = "onMouseEnter", o = "mouse", (l === "pointerout" || l === "pointerover") && (A = co, b = "onPointerLeave", v = "onPointerEnter", o = "pointer"), V = r == null ? O : yu(r), h = y == null ? O : yu(y), O = new A(
            b,
            o + "leave",
            r,
            e,
            S
          ), O.target = V, O.relatedTarget = h, b = null, Ie(S) === m && (A = new A(
            v,
            o + "enter",
            y,
            e,
            S
          ), A.target = h, A.relatedTarget = V, b = A), V = b, A = r && y ? pl(
            r,
            y,
            sh
          ) : null, r !== null && u0(
            E,
            O,
            r,
            A,
            !1
          ), y !== null && V !== null && u0(
            E,
            V,
            y,
            A,
            !0
          )));
        }
        l: {
          if (r = m ? yu(m) : window, y = r.nodeName && r.nodeName.toLowerCase(), y === "select" || y === "input" && r.type === "file")
            var j = yo;
          else if (mo(r))
            if (go)
              j = vm;
            else {
              j = dm;
              var I = om;
            }
          else
            y = r.nodeName, !y || y.toLowerCase() !== "input" || r.type !== "checkbox" && r.type !== "radio" ? m && ki(m.elementType) && (j = yo) : j = rm;
          if (j && (j = j(l, m))) {
            ho(
              E,
              j,
              e,
              S
            );
            break l;
          }
          I && I(l, r, m);
        }
        switch (I = m ? yu(m) : window, l) {
          case "focusin":
            (mo(I) || I.contentEditable === "true") && (Ma = I, vc = m, _u = null);
            break;
          case "focusout":
            _u = vc = Ma = null;
            break;
          case "mousedown":
            mc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            mc = !1, _o(E, e, S);
            break;
          case "selectionchange":
            if (hm) break;
          case "keydown":
          case "keyup":
            _o(E, e, S);
        }
        var D;
        if (fc)
          l: {
            switch (l) {
              case "compositionstart":
                var R = "onCompositionStart";
                break l;
              case "compositionend":
                R = "onCompositionEnd";
                break l;
              case "compositionupdate":
                R = "onCompositionUpdate";
                break l;
            }
            R = void 0;
          }
        else
          Da ? ro(l, e) && (R = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (R = "onCompositionStart");
        R && (fo && e.locale !== "ko" && (Da || R !== "onCompositionStart" ? R === "onCompositionEnd" && Da && (D = ao()) : (Ee = S, ac = "value" in Ee ? Ee.value : Ee.textContent, Da = !0)), I = ji(m, R), 0 < I.length && (R = new io(
          R,
          l,
          null,
          e,
          S
        ), E.push({ event: R, listeners: I }), D ? R.data = D : (D = vo(e), D !== null && (R.data = D)))), (D = nm ? im(l, e) : cm(l, e)) && (R = ji(m, "onBeforeInput"), 0 < R.length && (I = new io(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          S
        ), E.push({
          event: I,
          listeners: R
        }), I.data = D)), nh(
          E,
          l,
          m,
          e,
          S
        );
      }
      e0(E, t);
    });
  }
  function Wu(l, t, e) {
    return {
      instance: l,
      listener: t,
      currentTarget: e
    };
  }
  function ji(l, t) {
    for (var e = t + "Capture", a = []; l !== null; ) {
      var u = l, n = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || n === null || (u = gu(l, e), u != null && a.unshift(
        Wu(l, u, n)
      ), u = gu(l, t), u != null && a.push(
        Wu(l, u, n)
      )), l.tag === 3) return a;
      l = l.return;
    }
    return [];
  }
  function sh(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function u0(l, t, e, a, u) {
    for (var n = t._reactName, i = []; e !== null && e !== a; ) {
      var c = e, s = c.alternate, m = c.stateNode;
      if (c = c.tag, s !== null && s === a) break;
      c !== 5 && c !== 26 && c !== 27 || m === null || (s = m, u ? (m = gu(e, n), m != null && i.unshift(
        Wu(e, m, s)
      )) : u || (m = gu(e, n), m != null && i.push(
        Wu(e, m, s)
      ))), e = e.return;
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var oh = /\r\n?/g, dh = /\u0000|\uFFFD/g;
  function n0(l) {
    return (typeof l == "string" ? l : "" + l).replace(oh, `
`).replace(dh, "");
  }
  function i0(l, t) {
    return t = n0(t), n0(l) === t;
  }
  function ol(l, t, e, a, u, n) {
    switch (e) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || ja(l, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && ja(l, "" + a);
        else return;
        break;
      case "className":
        Tn(l, "class", a);
        break;
      case "tabIndex":
        Tn(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Tn(l, e, a);
        break;
      case "style":
        lo(l, a, n);
        return;
      case "data":
        if (t !== "object") {
          Tn(l, "data", a);
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
        a = bn(a), l.setAttribute(e, a);
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
          typeof n == "function" && (e === "formAction" ? (t !== "input" && ol(l, t, "name", u.name, u, null), ol(
            l,
            t,
            "formEncType",
            u.formEncType,
            u,
            null
          ), ol(
            l,
            t,
            "formMethod",
            u.formMethod,
            u,
            null
          ), ol(
            l,
            t,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (ol(l, t, "encType", u.encType, u, null), ol(l, t, "method", u.method, u, null), ol(l, t, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = bn(a), l.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (l.onclick = Vt);
        return;
      case "onScroll":
        a != null && $("scroll", l);
        return;
      case "onScrollEnd":
        a != null && $("scrollend", l);
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
        e = bn(a), l.setAttributeNS(
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
        $("beforetoggle", l), $("toggle", l), Sn(l, "popover", a);
        break;
      case "xlinkActuate":
        ae(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        ae(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        ae(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        ae(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        ae(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        ae(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        ae(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        ae(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        ae(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Sn(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N")
          e = Mv.get(e) || e, Sn(l, e, a);
        else return;
    }
    el = !0;
  }
  function If(l, t, e, a, u, n) {
    switch (e) {
      case "style":
        lo(l, a, n);
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
        if (typeof a == "string") ja(l, a);
        else if (typeof a == "number" || typeof a == "bigint")
          ja(l, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && $("scroll", l);
        return;
      case "onScrollEnd":
        a != null && $("scrollend", l);
        return;
      case "onClick":
        a != null && (l.onclick = Vt);
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
        if (!Ls.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (u = e.endsWith("Capture"), n = e.slice(2, u ? e.length - 7 : void 0), t = l[et] || null, t = t != null ? t[e] : null, typeof t == "function" && l.removeEventListener(n, t, u), typeof a == "function")) {
              typeof t != "function" && t !== null && (e in l ? l[e] = null : l.hasAttribute(e) && l.removeAttribute(e)), l.addEventListener(n, a, u);
              break l;
            }
            el = !0, e in l ? l[e] = a : a === !0 ? l.setAttribute(e, "") : Sn(l, e, a);
          }
        return;
    }
    el = !0;
  }
  function Jl(l, t, e) {
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
        $("error", l), $("load", l);
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
                  ol(l, t, n, i, e, null);
              }
          }
        u && ol(l, t, "srcSet", e.srcSet, e, null), a && ol(l, t, "src", e.src, e, null);
        return;
      case "input":
        $("invalid", l);
        var c = n = i = u = null, s = null, m = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var S = e[a];
            if (S != null)
              switch (a) {
                case "name":
                  u = S;
                  break;
                case "type":
                  i = S;
                  break;
                case "checked":
                  s = S;
                  break;
                case "defaultChecked":
                  m = S;
                  break;
                case "value":
                  n = S;
                  break;
                case "defaultValue":
                  c = S;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (S != null)
                    throw Error(g(137, t));
                  break;
                default:
                  ol(l, t, a, S, e, null);
              }
          }
        Ws(
          l,
          n,
          c,
          s,
          m,
          i,
          u,
          !1
        );
        return;
      case "select":
        $("invalid", l), a = i = n = null;
        for (u in e)
          if (e.hasOwnProperty(u) && (c = e[u], c != null))
            switch (u) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                i = c;
                break;
              case "multiple":
                a = c;
              default:
                ol(l, t, u, c, e, null);
            }
        t = n, e = i, l.multiple = !!a, t != null ? _a(l, !!a, t, !1) : e != null && _a(l, !!a, e, !0);
        return;
      case "textarea":
        $("invalid", l), n = u = a = null;
        for (i in e)
          if (e.hasOwnProperty(i) && (c = e[i], c != null))
            switch (i) {
              case "value":
                a = c;
                break;
              case "defaultValue":
                u = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(g(91));
                break;
              default:
                ol(l, t, i, c, e, null);
            }
        ks(l, a, u, n);
        return;
      case "option":
        for (s in e)
          e.hasOwnProperty(s) && (a = e[s], a != null) && (s === "selected" ? l.selected = a && typeof a != "function" && typeof a != "symbol" : ol(l, t, s, a, e, null));
        return;
      case "dialog":
        $("beforetoggle", l), $("toggle", l), $("cancel", l), $("close", l);
        break;
      case "iframe":
      case "object":
        $("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < $u.length; a++)
          $($u[a], l);
        break;
      case "image":
        $("error", l), $("load", l);
        break;
      case "details":
        $("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        $("error", l), $("load", l);
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
        for (m in e)
          if (e.hasOwnProperty(m) && (a = e[m], a != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(g(137, t));
              default:
                ol(l, t, m, a, e, null);
            }
        return;
      default:
        if (ki(t)) {
          for (S in e)
            e.hasOwnProperty(S) && (a = e[S], a !== void 0 && If(
              l,
              t,
              S,
              a,
              e,
              void 0
            ));
          return;
        }
    }
    for (c in e)
      e.hasOwnProperty(c) && (a = e[c], a != null && ol(l, t, c, a, e, null));
  }
  var rh = {};
  function vh(l, t, e, a) {
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
        var u = null, n = null, i = null, c = null, s = null, m = null, S = null;
        for (y in e) {
          var E = e[y];
          if (e.hasOwnProperty(y) && E != null)
            switch (y) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                s = E;
              default:
                a.hasOwnProperty(y) || ol(l, t, y, null, a, E);
            }
        }
        for (var r in a) {
          var y = a[r];
          if (E = e[r], a.hasOwnProperty(r) && (y != null || E != null))
            switch (r) {
              case "type":
                y !== E && (el = !0), n = y;
                break;
              case "name":
                y !== E && (el = !0), u = y;
                break;
              case "checked":
                y !== E && (el = !0), m = y;
                break;
              case "defaultChecked":
                y !== E && (el = !0), S = y;
                break;
              case "value":
                y !== E && (el = !0), i = y;
                break;
              case "defaultValue":
                y !== E && (el = !0), c = y;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (y != null)
                  throw Error(g(137, t));
                break;
              default:
                y !== E && ol(
                  l,
                  t,
                  r,
                  y,
                  a,
                  E
                );
            }
        }
        Wi(
          l,
          i,
          c,
          s,
          m,
          S,
          n,
          u
        );
        return;
      case "select":
        y = i = c = r = null;
        for (n in e)
          if (s = e[n], e.hasOwnProperty(n) && s != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                y = s;
              default:
                a.hasOwnProperty(n) || ol(
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
                n !== s && (el = !0), r = n;
                break;
              case "defaultValue":
                n !== s && (el = !0), c = n;
                break;
              case "multiple":
                n !== s && (el = !0), i = n;
              default:
                n !== s && ol(
                  l,
                  t,
                  u,
                  n,
                  a,
                  s
                );
            }
        t = c, e = i, a = y, r != null ? _a(l, !!e, r, !1) : !!a != !!e && (t != null ? _a(l, !!e, t, !0) : _a(l, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        y = r = null;
        for (c in e)
          if (u = e[c], e.hasOwnProperty(c) && u != null && !a.hasOwnProperty(c))
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                ol(l, t, c, null, a, u);
            }
        for (i in a)
          if (u = a[i], n = e[i], a.hasOwnProperty(i) && (u != null || n != null))
            switch (i) {
              case "value":
                u !== n && (el = !0), r = u;
                break;
              case "defaultValue":
                u !== n && (el = !0), y = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(g(91));
                break;
              default:
                u !== n && ol(l, t, i, u, a, n);
            }
        Is(l, r, y);
        return;
      case "option":
        for (var O in e)
          r = e[O], e.hasOwnProperty(O) && r != null && !a.hasOwnProperty(O) && (O === "selected" ? l.selected = !1 : ol(
            l,
            t,
            O,
            null,
            a,
            r
          ));
        for (s in a)
          r = a[s], y = e[s], a.hasOwnProperty(s) && r !== y && (r != null || y != null) && (s === "selected" ? (r !== y && (el = !0), l.selected = r && typeof r != "function" && typeof r != "symbol") : ol(
            l,
            t,
            s,
            r,
            a,
            y
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
        for (var A in e)
          r = e[A], e.hasOwnProperty(A) && r != null && !a.hasOwnProperty(A) && ol(l, t, A, null, a, r);
        for (m in a)
          if (r = a[m], y = e[m], a.hasOwnProperty(m) && r !== y && (r != null || y != null))
            switch (m) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (r != null)
                  throw Error(g(137, t));
                break;
              default:
                ol(
                  l,
                  t,
                  m,
                  r,
                  a,
                  y
                );
            }
        return;
      default:
        if (ki(t)) {
          for (var V in e)
            r = e[V], e.hasOwnProperty(V) && r !== void 0 && !a.hasOwnProperty(V) && If(
              l,
              t,
              V,
              void 0,
              a,
              r
            );
          for (S in a)
            r = a[S], y = e[S], !a.hasOwnProperty(S) || r === y || r === void 0 && y === void 0 || If(
              l,
              t,
              S,
              r,
              a,
              y
            );
          return;
        }
    }
    for (var v in e)
      r = e[v], e.hasOwnProperty(v) && r != null && !a.hasOwnProperty(v) && ol(l, t, v, null, a, r);
    for (E in a)
      r = a[E], y = e[E], !a.hasOwnProperty(E) || r === y || r == null && y == null || ol(l, t, E, r, a, y);
  }
  function c0(l) {
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
  function mh() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
        var u = e[a], n = u.transferSize, i = u.initiatorType, c = u.duration;
        if (n && c && c0(i)) {
          for (i = 0, c = u.responseEnd, a += 1; a < e.length; a++) {
            var s = e[a], m = s.startTime;
            if (m > c) break;
            var S = s.transferSize, E = s.initiatorType;
            S && c0(E) && (s = s.responseEnd, i += S * (s < c ? 1 : (c - m) / (s - m)));
          }
          if (--a, t += 8 * (n + i) / (u.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var kf = null, Pf = null;
  function Iu(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function f0(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function s0(l, t) {
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
  function o0(l, t, e, a) {
    return e = Iu(
      e
    ).createElement(l), e[Ql] = a, e[et] = t, Jl(e, l, t), ql(e), e;
  }
  function ls(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ts = null;
  function hh() {
    var l = window.event;
    return l && l.type === "popstate" ? l === ts ? !1 : (ts = l, !0) : (ts = null, !1);
  }
  var es = typeof setTimeout == "function" ? setTimeout : void 0, yh = typeof clearTimeout == "function" ? clearTimeout : void 0, d0 = typeof Promise == "function" ? Promise : void 0, r0 = typeof requestAnimationFrame == "function" ? requestAnimationFrame : es, gh = typeof queueMicrotask == "function" ? queueMicrotask : typeof d0 < "u" ? function(l) {
    return d0.resolve(null).then(l).catch(Sh);
  } : es;
  function Sh(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Qe(l) {
    return l === "head";
  }
  function v0(l, t) {
    var e = t, a = 0;
    do {
      var u = e.nextSibling;
      if (l.removeChild(e), u && u.nodeType === 8)
        if (e = u.data, e === "/$" || e === "/&") {
          if (a === 0) {
            l.removeChild(u), su(t);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          os(
            l.ownerDocument.documentElement
          );
        else if (e === "head") {
          e = l.ownerDocument.head, os(e);
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling, c = n.nodeName;
            n[hu] || c === "SCRIPT" || c === "STYLE" || c === "LINK" && n.rel.toLowerCase() === "stylesheet" || e.removeChild(n), n = i;
          }
        } else
          e === "body" && os(l.ownerDocument.body);
      e = u;
    } while (e);
    su(t);
  }
  function m0(l, t) {
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
  function h0(l, t, e) {
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
  function y0(l, t) {
    l = l.style, t = t.style;
    var e = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    l.viewTransitionName = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), e = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, l.viewTransitionClass = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), l.display === "inline-block" && (t == null ? l.display = l.margin = "" : (e = t.display, l.display = e == null || typeof e == "boolean" ? "" : e, e = t.margin, e != null ? l.margin = e : (e = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], l.marginTop = e == null || typeof e == "boolean" ? "" : e, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], l.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function Th(l, t, e) {
    return e = e.ownerDocument.defaultView, {
      rect: l,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= l.bottom && 0 <= l.right && l.top <= e.innerHeight && l.left <= e.innerWidth
    };
  }
  function as(l) {
    var t = l.getBoundingClientRect(), e = getComputedStyle(l);
    return Th(t, e, l);
  }
  function bh(l) {
    return l.documentElement.clientHeight;
  }
  function Eh(l) {
    this.addEventListener("load", l), this.addEventListener("error", l);
  }
  function Nh(l, t, e, a, u, n, i, c, s) {
    var m = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var S = m.startViewTransition({
        update: function() {
          var r = m.defaultView, y = r.navigation && r.navigation.transition, O = m.fonts.status;
          a();
          var A = [];
          if (O === "loaded" && (bh(m), m.fonts.status === "loading" && A.push(m.fonts.ready)), O = A.length, l !== null)
            for (var V = l.suspenseyImages, v = 0, o = 0; o < V.length; o++) {
              var h = V[o];
              if (!h.complete) {
                var b = h.getBoundingClientRect();
                if (0 < b.bottom && 0 < b.right && b.top < r.innerHeight && b.left < r.innerWidth) {
                  if (v += Y0(h), v > Di) {
                    A.length = O;
                    break;
                  }
                  h = new Promise(
                    Eh.bind(h)
                  ), A.push(h);
                }
              }
            }
          if (0 < A.length)
            return r = Promise.race([
              Promise.all(A),
              new Promise(function(j) {
                return setTimeout(j, 500);
              })
            ]).then(u, u), (y ? Promise.allSettled([y.finished, r]) : r).then(n, n);
          if (u(), y)
            return y.finished.then(
              n,
              n
            );
          n();
        },
        types: e
      });
      m.__reactViewTransition = S;
      var E = [];
      return S.ready.then(
        function() {
          for (var r = m.documentElement.getAnimations({
            subtree: !0
          }), y = 0; y < r.length; y++) {
            var O = r[y], A = O.effect, V = A.pseudoElement;
            if (V != null && V.startsWith("::view-transition")) {
              E.push(O), O = A.getKeyframes();
              for (var v = V = void 0, o = !0, h = 0; h < O.length; h++) {
                var b = O[h], j = b.width;
                if (V === void 0) V = j;
                else if (V !== j) {
                  o = !1;
                  break;
                }
                if (j = b.height, v === void 0) v = j;
                else if (v !== j) {
                  o = !1;
                  break;
                }
                delete b.width, delete b.height, b.transform === "none" && delete b.transform;
              }
              o && V !== void 0 && v !== void 0 && (A.setKeyframes(O), o = getComputedStyle(
                A.target,
                A.pseudoElement
              ), o.width !== V || o.height !== v) && (o = O[0], o.width = V, o.height = v, o = O[O.length - 1], o.width = V, o.height = v, A.setKeyframes(O));
            }
          }
          i();
        },
        function(r) {
          m.__reactViewTransition === S && (m.__reactViewTransition = null);
          try {
            typeof r == "object" && r !== null && r.name === "InvalidStateError" && (r.message === "View transition was skipped because document visibility state is hidden." || r.message === "Skipping view transition because document visibility state has become hidden." || r.message === "Skipping view transition because viewport size changed." || r.message === "Transition was aborted because of invalid state") && (r = null), r !== null && s(r);
          } finally {
            a(), u(), i();
          }
        }
      ), S.finished.finally(function() {
        for (var r = 0; r < E.length; r++)
          E[r].cancel();
        m.__reactViewTransition === S && (m.__reactViewTransition = null), c();
      }), S;
    } catch {
      return a(), u(), i(), null;
    }
  }
  function Sa(l, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + l + "(" + t + ")";
  }
  Sa.prototype.animate = function(l, t) {
    return t = typeof t == "number" ? { duration: t } : X({}, t), t.pseudoElement = this._selector, this._scope.animate(l, t);
  }, Sa.prototype.getAnimations = function() {
    for (var l = this._scope, t = this._selector, e = l.getAnimations({ subtree: !0 }), a = [], u = 0; u < e.length; u++) {
      var n = e[u].effect;
      n !== null && n.target === l && n.pseudoElement === t && a.push(e[u]);
    }
    return a;
  }, Sa.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function g0(l) {
    return {
      name: l,
      group: new Sa("group", l),
      imagePair: new Sa("image-pair", l),
      old: new Sa("old", l),
      new: new Sa("new", l)
    };
  }
  function Tt(l) {
    this._fragmentFiber = l, this._observers = this._eventListeners = null;
  }
  Tt.prototype.addEventListener = function(l, t, e) {
    var a = null, u = null;
    if (!(e != null && typeof e != "boolean" && (a = e.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var n = this._eventListeners;
      if (T0(n, l, t, e) === -1) {
        var i = this, c = t;
        e != null && typeof e != "boolean" && e.once === !0 && (c = function(s) {
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
        ), a.addEventListener("abort", u, { once: !0 }), u = a.removeEventListener.bind(a, "abort", u)), a = au(e), n.push({
          type: l,
          listener: t,
          optionsOrUseCapture: e,
          attachedListener: c,
          cleanup: u
        }), T(
          this._fragmentFiber.child,
          !1,
          zh,
          l,
          c,
          a
        );
      }
      this._eventListeners = n;
    }
  };
  function zh(l, t, e, a) {
    return dl(l).addEventListener(
      t,
      e,
      a
    ), !1;
  }
  Tt.prototype.removeEventListener = function(l, t, e) {
    var a = this._eventListeners;
    if (a !== null && (t = T0(
      a,
      l,
      t,
      e
    ), t !== -1)) {
      var u = a[t];
      e = u.attachedListener;
      var n = u.cleanup;
      u = au(u.optionsOrUseCapture), T(
        this._fragmentFiber.child,
        !1,
        Oh,
        l,
        e,
        u
      ), a.splice(t, 1), n !== null && n();
    }
  };
  function Oh(l, t, e, a) {
    return dl(l).removeEventListener(
      t,
      e,
      a
    ), !1;
  }
  function au(l) {
    return l != null && typeof l != "boolean" && (l.once === !0 || l.signal instanceof AbortSignal) ? { capture: l.capture, passive: l.passive } : l;
  }
  function S0(l) {
    return l == null ? "c=0" : typeof l == "boolean" ? "c=" + (l ? "1" : "0") : "c=" + (l.capture ? "1" : "0");
  }
  function T0(l, t, e, a) {
    if (l.length === 0) return -1;
    a = S0(a);
    for (var u = 0; u < l.length; u++) {
      var n = l[u];
      if (n.type === t && n.listener === e && S0(n.optionsOrUseCapture) === a)
        return u;
    }
    return -1;
  }
  Tt.prototype.dispatchEvent = function(l) {
    var t = C(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = dl(t);
    var e = this._eventListeners;
    if (e !== null && 0 < e.length || !l.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (e)
        for (var u = 0; u < e.length; u++) {
          var n = e[u];
          a.addEventListener(
            n.type,
            n.attachedListener,
            au(n.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), l = a.dispatchEvent(l), e)
        for (u = 0; u < e.length; u++)
          n = e[u], a.removeEventListener(
            n.type,
            n.attachedListener,
            au(n.optionsOrUseCapture)
          );
      return t.removeChild(a), l;
    }
    return t.dispatchEvent(l);
  }, Tt.prototype.focus = function(l) {
    T(
      this._fragmentFiber.child,
      !0,
      b0,
      l,
      void 0,
      void 0
    );
  };
  function b0(l, t) {
    return l.tag === 6 ? !1 : (l = dl(l), qh(l, t));
  }
  Tt.prototype.focusLast = function(l) {
    var t = [];
    T(
      this._fragmentFiber.child,
      !0,
      us,
      t,
      void 0,
      void 0
    );
    for (var e = t.length - 1; 0 <= e && !b0(t[e], l); e--) ;
  };
  function us(l, t) {
    return t.push(l), !1;
  }
  Tt.prototype.blur = function() {
    var l = C(
      this._fragmentFiber
    );
    l !== null && (l = dl(l), l = Iu(l).activeElement, l !== null && T(
      this._fragmentFiber.child,
      !1,
      _h,
      l,
      void 0,
      void 0
    ));
  };
  function _h(l, t) {
    return l.tag === 6 ? !1 : (l = dl(l), l === t || l.contains(t) ? (t.blur(), !0) : !1);
  }
  Tt.prototype.observeUsing = function(l) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(l), T(
      this._fragmentFiber.child,
      !1,
      jh,
      l,
      void 0,
      void 0
    );
  };
  function jh(l, t) {
    return l.tag === 6 || (l = dl(l), t.observe(l)), !1;
  }
  Tt.prototype.unobserveUsing = function(l) {
    var t = this._observers;
    if (t !== null && t.has(l)) {
      t.delete(l), T(
        this._fragmentFiber.child,
        !1,
        Ah,
        l,
        void 0,
        void 0
      );
      for (var e = t = 0; e < Bt.length; e++) {
        var a = Bt[e];
        a.fragmentInstance === this && a.observer === l ? l.unobserve(a.instance) : Bt[t++] = a;
      }
      Bt.length = t;
    }
  };
  function Ah(l, t) {
    return l.tag === 6 || (l = dl(l), t.unobserve(l)), !1;
  }
  var Bt = [], ns = !1;
  function xh(l, t, e) {
    Bt.push({
      fragmentInstance: l,
      observer: t,
      instance: e
    }), ns || (ns = !0, Yh(function() {
      ns = !1;
      var a = Bt;
      Bt = [];
      for (var u = 0; u < a.length; u++) {
        var n = a[u];
        n.observer.unobserve(n.instance);
      }
    }));
  }
  Tt.prototype.getClientRects = function() {
    var l = [];
    return T(
      this._fragmentFiber.child,
      !1,
      Dh,
      l,
      void 0,
      void 0
    ), l;
  };
  function Dh(l, t) {
    if (l.tag === 6) {
      l = l.stateNode;
      var e = l.ownerDocument.createRange();
      e.selectNodeContents(l), t.push.apply(t, e.getClientRects());
    } else
      l = dl(l), t.push.apply(t, l.getClientRects());
    return !1;
  }
  Tt.prototype.getRootNode = function(l) {
    var t = C(
      this._fragmentFiber
    );
    return t === null ? this : dl(t).getRootNode(l);
  }, Tt.prototype.compareDocumentPosition = function(l) {
    var t = C(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var e = [];
    T(
      this._fragmentFiber.child,
      !1,
      us,
      e,
      void 0,
      void 0
    );
    var a = dl(t);
    if (e.length === 0) {
      if (e = a, _l(this._fragmentFiber)) {
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
      return e === l ? u = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (e = Fl(t)[1], e === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (l = dl(e).compareDocumentPosition(
        l
      ), u = l === 0 || l & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = dl(e[0]), u = dl(e[e.length - 1]);
    var n = _l(this._fragmentFiber) ? t.parentElement : a;
    if (n == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, n = n.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var i = t.compareDocumentPosition(l), c = u.compareDocumentPosition(l), s = i & Node.DOCUMENT_POSITION_CONTAINED_BY || c & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return c = a && n && i & Node.DOCUMENT_POSITION_FOLLOWING && c & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === l || n && u === l || s || c ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === l || !n && u === l ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : i, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Mh(
      t,
      this._fragmentFiber,
      e[0],
      e[e.length - 1],
      l
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function Mh(l, t, e, a, u) {
    var n = Ie(u);
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
        for (n = t, t = C(t); n !== null; ) {
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
    return l & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!n) && !(t = n === e) && (t = pl(
      e,
      n,
      L
    ), t === null ? t = !1 : (T(
      t,
      !0,
      Pt,
      n,
      e
    ), n = Rl, Rl = null, t = n !== null)), t) : l & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!n) && !(t = n === a) && (t = pl(
      a,
      n,
      L
    ), t === null ? t = !1 : (T(
      t,
      !0,
      tt,
      n,
      a
    ), n = Rl, Wl = Rl = null, t = n !== null)), t) : !1;
  }
  function E0(l, t) {
    var e = l.ownerDocument.createRange();
    e.selectNodeContents(l), l = e.getBoundingClientRect(), window.scrollTo(
      window.scrollX + l.left,
      t ? window.scrollY + l.top : window.scrollY + l.bottom - window.innerHeight
    );
  }
  Tt.prototype.scrollIntoView = function(l) {
    if (typeof l == "object") throw Error(g(566));
    var t = [];
    T(
      this._fragmentFiber.child,
      !1,
      us,
      t,
      void 0,
      void 0
    );
    var e = l !== !1;
    if (t.length === 0) {
      var a = Fl(
        this._fragmentFiber
      );
      if (a = e ? a[1] || a[0] || C(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        l = dl(a), E0(l, e);
        return;
      }
      if (a = dl(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          e = "host" in a ? a.host : null, e !== null && e.scrollIntoView(l);
          return;
        }
        a.scrollIntoView(l);
      }
    }
    for (a = e ? t.length - 1 : 0; a !== (e ? -1 : t.length); ) {
      var u = t[a];
      u.tag === 6 ? (u = dl(u), E0(u, e)) : dl(u).scrollIntoView(l), a += e ? -1 : 1;
    }
  };
  function ph(l, t) {
    return l = dl(l), N0(l, t), !1;
  }
  function N0(l, t) {
    l.reactFragments == null && (l.reactFragments = /* @__PURE__ */ new Set()), l.reactFragments.add(t);
  }
  function z0(l, t) {
    var e = t._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a];
        l.addEventListener(
          u.type,
          u.attachedListener,
          au(u.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (e = t._observers, e !== null && e.forEach(function(n) {
      for (var i = 0, c = 0; c < Bt.length; c++) {
        var s = Bt[c];
        (s.fragmentInstance !== t || s.observer !== n || s.instance !== l) && (Bt[i++] = s);
      }
      Bt.length = i, n.observe(l);
    }), N0(l, t));
  }
  function Ch(l, t) {
    var e = t._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a];
        l.removeEventListener(
          u.type,
          u.attachedListener,
          au(u.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (e = t._observers, e !== null && e.forEach(function(n) {
      typeof n.rootMargin == "string" ? xh(
        t,
        n,
        l
      ) : n.unobserve(l);
    }), l.reactFragments != null && l.reactFragments.delete(t));
  }
  function is(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          is(e), gn(e);
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
  function Uh(l, t, e, a) {
    for (; l.nodeType === 1; ) {
      var u = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (a) {
        if (!l[hu])
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
      if (l = Mt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Rh(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = Mt(l.nextSibling), l === null)) return null;
    return l;
  }
  function O0(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = Mt(l.nextSibling), l === null)) return null;
    return l;
  }
  function cs(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function fs(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Hh(l, t) {
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
  function Mt(l) {
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
  var ss = null;
  function _0(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "/$" || e === "/&") {
          if (t === 0)
            return Mt(l.nextSibling);
          t--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function j0(l) {
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
  function qh(l, t) {
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
  function Yh(l) {
    r0(function() {
      r0(function(t) {
        return l(t);
      });
    });
  }
  function A0(l, t, e) {
    switch (t = Iu(e), l) {
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
  function x0(l, t, e) {
    for (var a in e) {
      var u = e[a];
      e.hasOwnProperty(a) && u != null && ol(l, t, a, null, rh, u);
    }
    e.dangerouslySetInnerHTML != null && (l.textContent = ""), l.onclick === Vt && (l.onclick = null), gn(l);
  }
  function os(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    gn(l);
  }
  var pt = /* @__PURE__ */ new Map(), D0 = /* @__PURE__ */ new Set();
  function ku(l) {
    if (typeof l.getRootNode == "function") {
      var t = l.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  var ye = Y.d;
  Y.d = {
    f: Bh,
    r: Gh,
    D: Xh,
    C: Qh,
    L: Vh,
    m: Zh,
    X: Kh,
    S: Lh,
    M: Jh
  };
  function Bh() {
    var l = ye.f(), t = bi();
    return l || t;
  }
  function Gh(l) {
    var t = Na(l);
    t !== null && t.tag === 5 && t.type === "form" ? pd(t) : ye.r(l);
  }
  var uu = typeof document > "u" ? null : document;
  function M0(l, t, e) {
    var a = uu;
    if (a && typeof t == "string" && t) {
      var u = zt(t);
      u = 'link[rel="' + l + '"][href="' + u + '"]', typeof e == "string" && (u += '[crossorigin="' + e + '"]'), D0.has(u) || (D0.add(u), l = { rel: l, crossOrigin: e, href: t }, a.querySelector(u) === null && (t = a.createElement("link"), Jl(t, "link", l), ql(t), a.head.appendChild(t)));
    }
  }
  function Xh(l) {
    ye.D(l), M0("dns-prefetch", l, null);
  }
  function Qh(l, t) {
    ye.C(l, t), M0("preconnect", l, t);
  }
  function Vh(l, t, e) {
    ye.L(l, t, e);
    var a = uu;
    if (a && l && t) {
      var u = 'link[rel="preload"][as="' + zt(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (u += '[imagesrcset="' + zt(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (u += '[imagesizes="' + zt(
        e.imageSizes
      ) + '"]')) : u += '[href="' + zt(l) + '"]';
      var n = u;
      switch (t) {
        case "style":
          n = nu(l);
          break;
        case "script":
          n = iu(l);
      }
      if (!(pt.has(n) || (l = X(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), pt.set(n, l), a.querySelector(u) !== null || t === "style" && a.querySelector(Pu(n)) || t === "script" && a.querySelector(ln(n))))) {
        var i = a.createElement("link");
        Jl(i, "link", l), t === "style" && (i[yn] = !0, i.onload = i.onerror = function() {
          Vs(i);
        }), ql(i), a.head.appendChild(i);
      }
    }
  }
  function Zh(l, t) {
    ye.m(l, t);
    var e = uu;
    if (e && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + zt(a) + '"][href="' + zt(l) + '"]', n = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = iu(l);
      }
      if (!pt.has(n) && (l = X({ rel: "modulepreload", href: l }, t), pt.set(n, l), e.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(ln(n)))
              return;
        }
        a = e.createElement("link"), Jl(a, "link", l), ql(a), e.head.appendChild(a);
      }
    }
  }
  function Lh(l, t, e) {
    ye.S(l, t, e);
    var a = uu;
    if (a && l) {
      var u = za(a).hoistableStyles, n = nu(l);
      t = t || "default";
      var i = u.get(n);
      if (!i) {
        var c = { loading: 0, preload: null };
        if (i = a.querySelector(
          Pu(n)
        ))
          c.loading = 5;
        else {
          l = X(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = pt.get(n)) && ds(l, e);
          var s = i = a.createElement("link");
          ql(s), Jl(s, "link", l), s._p = new Promise(function(m, S) {
            s.onload = m, s.onerror = S;
          }), s.addEventListener("load", function() {
            c.loading |= 1;
          }), s.addEventListener("error", function() {
            c.loading |= 2;
          }), c.loading |= 4, Ai(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: c
        }, u.set(n, i);
      }
    }
  }
  function Kh(l, t) {
    ye.X(l, t);
    var e = uu;
    if (e && l) {
      var a = za(e).hoistableScripts, u = iu(l), n = a.get(u);
      n || (n = e.querySelector(ln(u)), n || (l = X({ src: l, async: !0 }, t), (t = pt.get(u)) && rs(l, t), n = e.createElement("script"), ql(n), Jl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function Jh(l, t) {
    ye.M(l, t);
    var e = uu;
    if (e && l) {
      var a = za(e).hoistableScripts, u = iu(l), n = a.get(u);
      n || (n = e.querySelector(ln(u)), n || (l = X({ src: l, async: !0, type: "module" }, t), (t = pt.get(u)) && rs(l, t), n = e.createElement("script"), ql(n), Jl(n, "link", l), e.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, a.set(u, n));
    }
  }
  function p0(l, t, e, a) {
    var u = (u = Se.current) ? ku(u) : null;
    if (!u) throw Error(g(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (e = nu(e.href), t = za(
          u
        ).hoistableStyles, a = t.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          l = nu(e.href);
          var n = za(
            u
          ).hoistableStyles, i = n.get(l);
          if (i || (u = u.ownerDocument || u, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, i), (n = u.querySelector(
            Pu(l)
          )) ? n._p || (i.instance = n, i.state.loading = 5) : (n = pt.get(l), n || (n = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, pt.set(l, n)), wh(
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
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (e = iu(e), t = za(
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
  function nu(l) {
    return 'href="' + zt(l) + '"';
  }
  function Pu(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function C0(l) {
    return X({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function wh(l, t, e, a) {
    if (t = l.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[yn] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = l.createElement("link"), t[yn] = !0, t.onload = t.onerror = Vs.bind(null, t), Jl(t, "link", e), ql(t), l.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function iu(l) {
    return '[src="' + zt(l) + '"]';
  }
  function ln(l) {
    return "script[async]" + l;
  }
  function U0(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + zt(e.href) + '"]'
          );
          if (a)
            return t.instance = a, ql(a), a;
          var u = X({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), ql(a), Jl(a, "style", u), Ai(a, e.precedence, l), t.instance = a;
        case "stylesheet":
          u = nu(e.href);
          var n = l.querySelector(
            Pu(u)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, ql(n), n;
          a = C0(e), (u = pt.get(u)) && ds(a, u), n = (l.ownerDocument || l).createElement("link"), ql(n);
          var i = n;
          return i._p = new Promise(function(c, s) {
            i.onload = c, i.onerror = s;
          }), Jl(n, "link", a), t.state.loading |= 4, Ai(n, e.precedence, l), t.instance = n;
        case "script":
          return n = iu(e.src), (u = l.querySelector(
            ln(n)
          )) ? (t.instance = u, ql(u), u) : (a = e, (u = pt.get(n)) && (a = X({}, e), rs(a, u)), l = l.ownerDocument || l, u = l.createElement("script"), ql(u), Jl(u, "link", a), l.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(g(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Ai(a, e.precedence, l));
    return t.instance;
  }
  function Ai(l, t, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = a.length ? a[a.length - 1] : null, n = u, i = 0; i < a.length; i++) {
      var c = a[i];
      if (c.dataset.precedence === t) n = c;
      else if (n !== u) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(l, t.firstChild));
  }
  function ds(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function rs(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var xi = null;
  function R0(l, t, e) {
    if (xi === null) {
      var a = /* @__PURE__ */ new Map(), u = xi = /* @__PURE__ */ new Map();
      u.set(e, a);
    } else
      u = xi, a = u.get(e), a || (a = /* @__PURE__ */ new Map(), u.set(e, a));
    if (a.has(l)) return a;
    for (a.set(l, null), e = e.getElementsByTagName(l), u = 0; u < e.length; u++) {
      var n = e[u];
      if (!(n[hu] || n[Ql] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = n.getAttribute(t) || "";
        i = l + i;
        var c = a.get(i);
        c ? c.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function vs(l, t, e) {
    l = l.ownerDocument || l, l.head.insertBefore(
      e,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Fh(l, t, e) {
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
  function H0(l, t) {
    return l === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function q0(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function Y0(l) {
    return (l.width || 100) * (l.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function B0(l, t) {
    typeof t.decode == "function" && (l.imgCount++, t.complete || (l.imgBytes += Y0(t), l.suspenseyImages.push(t)), l = Ih.bind(l), t.decode().then(l, l));
  }
  function $h(l, t, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var u = nu(a.href), n = t.querySelector(
          Pu(u)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = tn.bind(l), t.then(l, l)), e.state.loading |= 4, e.instance = n, ql(n);
          return;
        }
        n = t.ownerDocument || t, a = C0(a), (u = pt.get(u)) && ds(a, u), n = n.createElement("link"), ql(n);
        var i = n;
        i._p = new Promise(function(c, s) {
          i.onload = c, i.onerror = s;
        }), Jl(n, "link", a), e.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (l.count++, e = tn.bind(l), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  var Di = 0;
  function Wh(l, t) {
    return l.stylesheets && l.count === 0 && pi(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (l.stylesheets && pi(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && Di === 0 && (Di = 62500 * mh());
      var u = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && pi(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > Di ? 50 : 800) + t
      );
      return l.unsuspend = e, function() {
        l.unsuspend = null, clearTimeout(a), clearTimeout(u);
      };
    } : null;
  }
  function G0(l) {
    if (l.count === 0 && (l.imgCount === 0 || !l.waitingForImages)) {
      if (l.stylesheets) pi(l, l.stylesheets);
      else if (l.unsuspend) {
        var t = l.unsuspend;
        l.unsuspend = null, t();
      }
    }
  }
  function tn() {
    this.count--, G0(this);
  }
  function Ih() {
    this.imgCount--, G0(this);
  }
  var Mi = null;
  function pi(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Mi = /* @__PURE__ */ new Map(), t.forEach(kh, l), Mi = null, tn.call(l));
  }
  function kh(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Mi.get(l);
      if (e) var a = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Mi.set(l, e);
        for (var u = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < u.length; n++) {
          var i = u[n];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (e.set(i.dataset.precedence, i), a = i);
        }
        a && e.set(null, a);
      }
      u = t.instance, i = u.getAttribute("data-precedence"), n = e.get(i) || a, n === a && e.set(null, u), e.set(i, u), this.count++, a = tn.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), n ? n.parentNode.insertBefore(u, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(u, l.firstChild)), t.state.loading |= 4;
    }
  }
  var cu = {
    $$typeof: Hl,
    Provider: null,
    Consumer: null,
    _currentValue: te,
    _currentValue2: te,
    _threadCount: 0
  };
  function Ph(l, t, e, a, u, n, i, c, s) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ji(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ji(0), this.hiddenUpdates = Ji(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = n, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = s, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function X0(l, t, e, a, u, n, i, c, s, m, S, E) {
    return l = new Ph(
      l,
      t,
      e,
      i,
      s,
      m,
      S,
      E,
      c
    ), t = 1, n === !0 && (t |= 24), n = at(3, null, null, t), l.current = n, n.stateNode = l, t = Ac(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: t
    }, pc(n), l;
  }
  function Q0(l) {
    return l ? (l = Ua, l) : Ua;
  }
  function V0(l, t, e, a, u, n) {
    u = Q0(u), a.context === null ? a.context = u : a.pendingContext = u, a = De(t), a.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (a.callback = n), e = Me(l, a, t), e !== null && (ct(e, l, t), Cu(e, l, t));
  }
  function Z0(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function ms(l, t) {
    Z0(l, t), (l = l.alternate) && Z0(l, t);
  }
  function L0(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = ta(l, 67108864);
      t !== null && ct(t, l, 67108864), ms(l, 67108864);
    }
  }
  function K0(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = St();
      t = wi(t);
      var e = ta(l, t);
      e !== null && ct(e, l, t), ms(l, t);
    }
  }
  var fu = !0;
  function l1(l, t, e, a) {
    var u = x.T;
    x.T = null;
    var n = Y.p;
    try {
      Y.p = 2, hs(l, t, e, a);
    } finally {
      Y.p = n, x.T = u;
    }
  }
  function t1(l, t, e, a) {
    var u = x.T;
    x.T = null;
    var n = Y.p;
    try {
      Y.p = 8, hs(l, t, e, a);
    } finally {
      Y.p = n, x.T = u;
    }
  }
  function hs(l, t, e, a) {
    if (fu) {
      var u = ys(a);
      if (u === null)
        Wf(
          l,
          t,
          a,
          Ci,
          e
        ), w0(l, a);
      else if (a1(
        u,
        l,
        t,
        e,
        a
      ))
        a.stopPropagation();
      else if (w0(l, a), t & 4 && -1 < e1.indexOf(l)) {
        for (; u !== null; ) {
          var n = Na(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var i = We(n.pendingLanes);
                  if (i !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var s = 1 << 31 - dt(i);
                      c.entanglements[1] |= s, i &= ~s;
                    }
                    kt(n), (ul & 6) === 0 && (gi = st() + 500, Fu(0));
                  }
                }
                break;
              case 31:
              case 13:
                c = ta(n, 2), c !== null && ct(c, n, 2), bi(), ms(n, 2);
            }
          if (n = ys(a), n === null && Wf(
            l,
            t,
            a,
            Ci,
            e
          ), n === u) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else
        Wf(
          l,
          t,
          a,
          null,
          e
        );
    }
  }
  function ys(l) {
    return l = lc(l), gs(l);
  }
  var Ci = null;
  function gs(l) {
    if (Ci = null, l = Ie(l), l !== null) {
      var t = w(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = cl(t), l !== null) return l;
          l = null;
        } else if (e === 31) {
          if (l = hl(t), l !== null) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Ci = l, null;
  }
  function J0(l) {
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
        switch (mv()) {
          case Ms:
            return 2;
          case ps:
            return 8;
          case dn:
          case hv:
            return 32;
          case Cs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ss = !1, Ve = null, Ze = null, Le = null, en = /* @__PURE__ */ new Map(), an = /* @__PURE__ */ new Map(), Ke = [], e1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function w0(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        Ve = null;
        break;
      case "dragenter":
      case "dragleave":
        Ze = null;
        break;
      case "mouseover":
      case "mouseout":
        Le = null;
        break;
      case "pointerover":
      case "pointerout":
        en.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        an.delete(t.pointerId);
    }
  }
  function un(l, t, e, a, u, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: n,
      targetContainers: [u]
    }, t !== null && (t = Na(t), t !== null && L0(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), l);
  }
  function a1(l, t, e, a, u) {
    switch (t) {
      case "focusin":
        return Ve = un(
          Ve,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "dragenter":
        return Ze = un(
          Ze,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "mouseover":
        return Le = un(
          Le,
          l,
          t,
          e,
          a,
          u
        ), !0;
      case "pointerover":
        var n = u.pointerId;
        return en.set(
          n,
          un(
            en.get(n) || null,
            l,
            t,
            e,
            a,
            u
          )
        ), !0;
      case "gotpointercapture":
        return n = u.pointerId, an.set(
          n,
          un(
            an.get(n) || null,
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
  function F0(l) {
    var t = Ie(l.target);
    if (t !== null) {
      var e = w(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = cl(e), t !== null) {
            l.blockedOn = t, Gs(l.priority, function() {
              K0(e);
            });
            return;
          }
        } else if (t === 31) {
          if (t = hl(e), t !== null) {
            l.blockedOn = t, Gs(l.priority, function() {
              K0(e);
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
  function Ui(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = ys(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        Pi = a, e.target.dispatchEvent(a), Pi = null;
      } else
        return t = Na(e), t !== null && L0(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function $0(l, t, e) {
    Ui(l) && e.delete(t);
  }
  function u1() {
    Ss = !1, Ve !== null && Ui(Ve) && (Ve = null), Ze !== null && Ui(Ze) && (Ze = null), Le !== null && Ui(Le) && (Le = null), en.forEach($0), an.forEach($0);
  }
  function Ri(l, t) {
    l.blockedOn === t && (l.blockedOn = null, Ss || (Ss = !0, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      u1
    )));
  }
  var Hi = null;
  function W0(l) {
    Hi !== l && (Hi = l, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      function() {
        Hi === l && (Hi = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t], a = l[t + 1], u = l[t + 2];
          if (typeof a != "function") {
            if (gs(a || e) === null)
              continue;
            break;
          }
          var n = Na(e);
          n !== null && (l.splice(t, 3), t -= 3, kc(
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
  function su(l) {
    function t(s) {
      return Ri(s, l);
    }
    Ve !== null && Ri(Ve, l), Ze !== null && Ri(Ze, l), Le !== null && Ri(Le, l), en.forEach(t), an.forEach(t);
    for (var e = 0; e < Ke.length; e++) {
      var a = Ke[e];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < Ke.length && (e = Ke[0], e.blockedOn === null); )
      F0(e), e.blockedOn === null && Ke.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var u = e[a], n = e[a + 1], i = u[et] || null;
        if (typeof n == "function")
          i || W0(e);
        else if (i) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (u = n, i = n[et] || null)
              c = i.formAction;
            else if (gs(u) !== null) continue;
          } else c = i.action;
          typeof c == "function" ? e[a + 1] = c : (e.splice(a, 3), a -= 3), W0(e);
        }
      }
  }
  function I0() {
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
  function Ts(l) {
    this._internalRoot = l;
  }
  qi.prototype.render = Ts.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(g(409));
    var e = t.current, a = St();
    V0(e, a, l, t, null, null);
  }, qi.prototype.unmount = Ts.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      V0(l.current, 2, null, l, null, null), bi(), t[Ea] = null;
    }
  };
  function qi(l) {
    this._internalRoot = l;
  }
  qi.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Bs();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < Ke.length && t !== 0 && t < Ke[e].priority; e++) ;
      Ke.splice(e, 0, l), e === 0 && F0(l);
    }
  };
  var k0 = K.version;
  if (k0 !== "19.3.1")
    throw Error(
      g(
        527,
        k0,
        "19.3.1"
      )
    );
  Y.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(g(188)) : (l = Object.keys(l).join(","), Error(g(268, l)));
    return l = bl(t), l = l !== null ? U(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var n1 = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: x,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yi.isDisabled && Yi.supportsFiber)
      try {
        ru = Yi.inject(
          n1
        ), ot = Yi;
      } catch {
      }
  }
  return cn.createRoot = function(l, t) {
    if (!Z(l)) throw Error(g(299));
    var e = !1, a = "", u = Qd, n = Vd, i = Zd;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = X0(
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
      I0
    ), l[Ea] = t.current, $f(l), new Ts(t);
  }, cn.hydrateRoot = function(l, t, e) {
    if (!Z(l)) throw Error(g(299));
    var a = !1, u = "", n = Qd, i = Vd, c = Zd, s = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (u = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError), e.formState !== void 0 && (s = e.formState)), t = X0(
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
      c,
      I0
    ), t.context = Q0(null), e = t.current, a = St(), a = wi(a), u = De(a), u.callback = null, Me(e, u, a), e = a, t.current.lanes = e, mu(t, e), kt(t), l[Ea] = t.current, $f(l), new qi(t);
  }, cn.version = "19.3.1", cn;
}
var fv;
function h1() {
  if (fv) return Ns.exports;
  fv = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (K) {
        console.error(K);
      }
  }
  return z(), Ns.exports = m1(), Ns.exports;
}
var y1 = h1();
const g1 = /^\s*(\d{1,2})\s*-\s*(\d{1,2})\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*$/;
function S1(z) {
  const K = {}, G = z.split(/\r?\n/).map((g) => g.trim()).filter(Boolean);
  if (G.length === 0)
    throw new Error("Saisis au moins une cote de score exact.");
  for (const [g, Z] of G.entries()) {
    const w = Z.match(g1);
    if (!w)
      throw new Error(`Format incorrect à la ligne ${g + 1}. Utilise « 0-0 = 7,50 ».`);
    const cl = `${Number(w[1])}-${Number(w[2])}`, hl = Number(w[3].replace(",", "."));
    if (Object.hasOwn(K, cl))
      throw new Error(`Le score ${cl} apparaît plusieurs fois.`);
    if (!Number.isFinite(hl) || hl <= 0)
      throw new Error(`La cote du score ${cl} doit être supérieure à zéro.`);
    K[cl] = hl;
  }
  return K;
}
function T1({ homeScore: z, awayScore: K, oddsText: G, vitalityScore: g, oddsChangePercent: Z }) {
  const w = Number(z), cl = Number(K), hl = Number(g), yl = Number(Z);
  if (!Number.isInteger(w) || w < 0 || !Number.isInteger(cl) || cl < 0)
    throw new Error("Les scores doivent être des nombres entiers positifs ou nuls.");
  if (!Number.isFinite(hl) || hl < 0 || hl > 100)
    throw new Error("La vitalité doit être comprise entre 0 et 100.");
  if (!Number.isFinite(yl))
    throw new Error("La variation des cotes sur deux minutes doit être un nombre valide.");
  const bl = S1(G), T = [
    `${w}-${cl}`,
    `${w + 1}-${cl}`,
    `${w}-${cl + 1}`
  ].find((C) => !Object.hasOwn(bl, C));
  if (T)
    throw new Error(`La cote du score ${T} est nécessaire pour tester F121-C.`);
  return {
    home_score: w,
    away_score: cl,
    exact_score_odds: bl,
    vitality_score: hl,
    odds_change_percent: yl
  };
}
const sv = [
  { id: "overview", label: "Vue d’ensemble", icon: "grid" },
  { id: "matches", label: "Matchs suivis", icon: "ball" },
  { id: "rules", label: "Moteur de règles", icon: "sliders" },
  { id: "tester", label: "Testeur manuel", icon: "flask" },
  { id: "journal", label: "Journal", icon: "list" },
  { id: "settings", label: "Paramètres", icon: "settings" }
], ov = [
  { id: "F121-C", title: "Écart directionnel", status: "Disponible", detail: "Compare les cotes du score actuel et des deux scores suivants." },
  { id: "F121-C.2", title: "Avantage de deux buts", status: "Disponible", detail: "Suit le leader lorsque son avantage atteint au moins deux buts." },
  { id: "F121-D", title: "Score élevé", status: "Partiel", detail: "Seuil de cote documenté ; les situations hors exemples restent à confirmer." },
  { id: "F121-E", title: "Règle de mi-temps / écart", status: "À confirmer", detail: "Les documents donnent deux définitions contradictoires." },
  { id: "F121-K · T · X", title: "Écarts et tendance", status: "Non défini", detail: "La formule exacte doit être fournie avant activation." },
  { id: "F122 · F124 · F126", title: "Règles complémentaires", status: "Non défini", detail: "Formules métier à confirmer par le client." }
];
function bt({ name: z, size: K = 20 }) {
  const G = { width: K, height: K, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0 }, g = {
    grid: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ f.jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ f.jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }),
      /* @__PURE__ */ f.jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" })
    ] }),
    ball: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ f.jsx("path", { d: "m12 8 2.5 1.8-.9 2.9h-3.2l-.9-2.9L12 8Z" }),
      /* @__PURE__ */ f.jsx("path", { d: "m12 3 0 5m8 1-5.5.8M18 18l-4.4-5.3M6 18l4.4-5.3M4 9l5.5.8" })
    ] }),
    sliders: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("path", { d: "M4 6h9m4 0h3M4 12h3m4 0h9M4 18h9m4 0h3" }),
      /* @__PURE__ */ f.jsx("circle", { cx: "15", cy: "6", r: "2" }),
      /* @__PURE__ */ f.jsx("circle", { cx: "9", cy: "12", r: "2" }),
      /* @__PURE__ */ f.jsx("circle", { cx: "15", cy: "18", r: "2" })
    ] }),
    flask: /* @__PURE__ */ f.jsx(f.Fragment, { children: /* @__PURE__ */ f.jsx("path", { d: "M9 3h6m-5 0v6l-5.3 8.1A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.1-3.9L14 9V3M8 15h8" }) }),
    list: /* @__PURE__ */ f.jsx(f.Fragment, { children: /* @__PURE__ */ f.jsx("path", { d: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" }) }),
    settings: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("circle", { cx: "12", cy: "12", r: "3" }),
      /* @__PURE__ */ f.jsx("path", { d: "m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1-1.5.9-.2 1.9h-2.8l-.3-1.9-1.6-.9-.2-.1-1.7.7-1.4-2.4 1.5-1.1v-2l-1.5-1.1 1.4-2.4 1.7.7 1.8-1V6.4h2.8l.3 1.9 1.6.9.2.1 1.7-.7 1.4 2.4-1.5 1.1v2Z", transform: "translate(-1.2 -1)" })
    ] }),
    arrow: /* @__PURE__ */ f.jsx(f.Fragment, { children: /* @__PURE__ */ f.jsx("path", { d: "M5 12h14m-6-6 6 6-6 6" }) }),
    clock: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ f.jsx("path", { d: "M12 7v5l3 2" })
    ] }),
    shield: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("path", { d: "M12 3 20 6v5c0 5.1-3.4 8.3-8 10-4.6-1.7-8-4.9-8-10V6l8-3Z" }),
      /* @__PURE__ */ f.jsx("path", { d: "m9 12 2 2 4-4" })
    ] }),
    search: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("circle", { cx: "10.8", cy: "10.8", r: "6.8" }),
      /* @__PURE__ */ f.jsx("path", { d: "m16 16 5 5" })
    ] })
  };
  return /* @__PURE__ */ f.jsx("svg", { ...G, children: g[z] ?? g.grid });
}
function ou({ eyebrow: z, title: K, description: G, action: g }) {
  return /* @__PURE__ */ f.jsxs("div", { className: "page-heading", children: [
    /* @__PURE__ */ f.jsxs("div", { children: [
      /* @__PURE__ */ f.jsx("p", { className: "eyebrow", children: z }),
      /* @__PURE__ */ f.jsx("h1", { children: K }),
      /* @__PURE__ */ f.jsx("p", { className: "page-description", children: G })
    ] }),
    g
  ] });
}
function js({ icon: z, title: K, message: G }) {
  return /* @__PURE__ */ f.jsxs("div", { className: "empty-state", children: [
    /* @__PURE__ */ f.jsx("span", { className: "empty-icon", children: /* @__PURE__ */ f.jsx(bt, { name: z, size: 23 }) }),
    /* @__PURE__ */ f.jsx("h3", { children: K }),
    /* @__PURE__ */ f.jsx("p", { children: G })
  ] });
}
function b1({ result: z }) {
  const K = z.decision, G = z.rules["F121-C"]?.details?.selectedTeam, g = G === "home" ? "Équipe à domicile" : G === "away" ? "Équipe à l’extérieur" : "Direction indéterminée";
  return /* @__PURE__ */ f.jsxs("div", { className: "simulation-result", children: [
    /* @__PURE__ */ f.jsxs("div", { className: `simulation-verdict ${K.shouldAlert ? "verdict-alert" : "verdict-neutral"}`, children: [
      /* @__PURE__ */ f.jsx("span", { className: "verdict-mark", children: K.shouldAlert ? "✓" : "—" }),
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("strong", { children: K.shouldAlert ? "Signal théorique détecté" : "Aucun signal" }),
        /* @__PURE__ */ f.jsx("p", { children: K.reason })
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ f.jsx("h3", { children: "Règles évaluées" }),
      Object.values(z.rules).map((Z) => /* @__PURE__ */ f.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ f.jsx("span", { children: Z.ruleId }),
        /* @__PURE__ */ f.jsx("strong", { children: Z.verdict === "candidate" ? Z.suggestedAction || g : Z.verdict === "not_defined" ? "Non définie" : Z.verdict === "abstain" ? "Abstention" : "Aucun signal" })
      ] }, Z.ruleId))
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "simulation-section", children: [
      /* @__PURE__ */ f.jsx("h3", { children: "Filtres de sécurité" }),
      Object.entries(z.filters).map(([Z, w]) => /* @__PURE__ */ f.jsxs("div", { className: "simulation-line", children: [
        /* @__PURE__ */ f.jsx("span", { children: w.label }),
        /* @__PURE__ */ f.jsx("strong", { className: w.passed ? "filter-passed" : "filter-failed", children: w.passed ? "Validé" : "Refusé" })
      ] }, Z))
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "simulation-disclaimer", children: [
      /* @__PURE__ */ f.jsx(bt, { name: "shield", size: 17 }),
      /* @__PURE__ */ f.jsx("span", { children: K.convergenceScore === null ? "Convergence non calculée : aucun score de méthode n’est fourni. Simulation sans alerte transmissible." : `Convergence ${K.convergenceScore} % — simulation uniquement.` })
    ] })
  ] });
}
function E1() {
  const [z, K] = we.useState("overview"), [G, g] = we.useState(!1), [Z, w] = we.useState({
    homeScore: "0",
    awayScore: "0",
    oddsText: `0-0 = 7,50
1-0 = 8,60
0-1 = 9,80`,
    vitalityScore: "61",
    oddsChangePercent: "0"
  }), [cl, hl] = we.useState(null), [yl, bl] = we.useState(""), [U, T] = we.useState(!1), [C, _l] = we.useState(""), Fl = document.querySelector('meta[name="csrf-token"]')?.content ?? "", Ul = document.querySelector("[data-admin-name]")?.dataset.adminName || "Administrateur", dl = sv.find((L) => L.id === z)?.label ?? "Vue d’ensemble", Rl = (L) => (pl) => {
    w((X) => ({ ...X, [L]: pl.target.value })), hl(null), bl("");
  };
  async function Wl(L) {
    L.preventDefault(), T(!0), bl(""), hl(null);
    try {
      const pl = T1(Z), X = await fetch("/admin/rule-test", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": Fl
        },
        body: JSON.stringify(pl)
      }), k = await X.json();
      if (!X.ok)
        throw new Error(k.message || "Le test n’a pas pu être exécuté.");
      hl(k);
    } catch (pl) {
      bl(pl.message || "Une erreur empêche le test.");
    } finally {
      T(!1);
    }
  }
  async function Pt() {
    _l("");
    try {
      if (!(await fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "X-CSRF-TOKEN": Fl, Accept: "application/json" }
      })).ok)
        throw new Error("La déconnexion a échoué. Réessaie.");
      window.location.assign("/login");
    } catch (L) {
      _l(L.message || "La déconnexion a échoué.");
    }
  }
  function tt(L) {
    K(L), g(!1), hl(null), bl("");
  }
  return /* @__PURE__ */ f.jsxs("div", { className: "admin-shell", children: [
    /* @__PURE__ */ f.jsxs("aside", { className: `sidebar ${G ? "sidebar-open" : ""}`, children: [
      /* @__PURE__ */ f.jsxs("a", { className: "brand", href: "/admin", onClick: (L) => {
        L.preventDefault(), tt("overview");
      }, children: [
        /* @__PURE__ */ f.jsx("span", { className: "brand-mark", children: "P" }),
        /* @__PURE__ */ f.jsxs("span", { children: [
          /* @__PURE__ */ f.jsx("strong", { children: "PRONOFOOT" }),
          /* @__PURE__ */ f.jsx("small", { children: "ADMIN · PHASE 1" })
        ] })
      ] }),
      /* @__PURE__ */ f.jsx("div", { className: "sidebar-label", children: "ESPACE ADMIN" }),
      /* @__PURE__ */ f.jsx("nav", { className: "navigation", "aria-label": "Navigation principale", children: sv.map((L) => /* @__PURE__ */ f.jsxs(
        "button",
        {
          className: `nav-item ${z === L.id ? "nav-item-active" : ""}`,
          onClick: () => tt(L.id),
          type: "button",
          children: [
            /* @__PURE__ */ f.jsx(bt, { name: L.icon, size: 18 }),
            /* @__PURE__ */ f.jsx("span", { children: L.label }),
            L.id === "matches" && /* @__PURE__ */ f.jsx("span", { className: "nav-count", children: "0" })
          ]
        },
        L.id
      )) }),
      /* @__PURE__ */ f.jsx("div", { className: "sidebar-spacer" }),
      /* @__PURE__ */ f.jsxs("div", { className: "phase-card", children: [
        /* @__PURE__ */ f.jsx("span", { className: "phase-card-icon", children: /* @__PURE__ */ f.jsx(bt, { name: "shield", size: 18 }) }),
        /* @__PURE__ */ f.jsxs("div", { children: [
          /* @__PURE__ */ f.jsx("strong", { children: "Phase 1" }),
          /* @__PURE__ */ f.jsx("p", { children: "Détecteur live · aucun pari automatique" })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("button", { className: "profile-button", type: "button", onClick: Pt, children: [
        /* @__PURE__ */ f.jsx("span", { className: "avatar", children: Ul.slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ f.jsxs("span", { className: "profile-copy", children: [
          /* @__PURE__ */ f.jsx("strong", { children: Ul }),
          /* @__PURE__ */ f.jsx("small", { children: "Administrateur" })
        ] }),
        /* @__PURE__ */ f.jsx("span", { className: "profile-exit", children: "↗" })
      ] }),
      C && /* @__PURE__ */ f.jsx("p", { className: "sidebar-error", role: "alert", children: C })
    ] }),
    /* @__PURE__ */ f.jsxs("main", { className: "main-area", children: [
      /* @__PURE__ */ f.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ f.jsxs("button", { className: "mobile-menu-button", type: "button", "aria-label": "Ouvrir le menu", onClick: () => g((L) => !L), children: [
          /* @__PURE__ */ f.jsx("span", {}),
          /* @__PURE__ */ f.jsx("span", {}),
          /* @__PURE__ */ f.jsx("span", {})
        ] }),
        /* @__PURE__ */ f.jsxs("div", { className: "breadcrumb", children: [
          /* @__PURE__ */ f.jsx("span", { children: "Administration" }),
          /* @__PURE__ */ f.jsx(bt, { name: "arrow", size: 14 }),
          /* @__PURE__ */ f.jsx("strong", { children: dl })
        ] }),
        /* @__PURE__ */ f.jsxs("div", { className: "topbar-right", children: [
          /* @__PURE__ */ f.jsxs("span", { className: "secure-label", children: [
            /* @__PURE__ */ f.jsx("span", { className: "secure-dot" }),
            " Session sécurisée"
          ] }),
          /* @__PURE__ */ f.jsx("span", { className: "topbar-avatar", children: Ul.slice(0, 1).toUpperCase() })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "content", children: [
        z === "overview" && /* @__PURE__ */ f.jsxs("div", { className: "overview-page", children: [
          /* @__PURE__ */ f.jsx(ou, { eyebrow: "TABLEAU DE BORD", title: "Vue d’ensemble", description: "État du détecteur et rencontres suivies en direct." }),
          /* @__PURE__ */ f.jsxs("section", { className: "overview-highlights", "aria-label": "État du scan et alertes actives", children: [
            /* @__PURE__ */ f.jsxs("article", { className: "scan-status-panel", children: [
              /* @__PURE__ */ f.jsxs("div", { className: "scan-status-copy", children: [
                /* @__PURE__ */ f.jsx("p", { className: "overview-section-label", children: "STATUT DU SCAN" }),
                /* @__PURE__ */ f.jsx("h2", { children: "Détecteur de matchs" }),
                /* @__PURE__ */ f.jsx("p", { children: "Le scan démarrera après la configuration des connexions API." })
              ] }),
              /* @__PURE__ */ f.jsxs("span", { className: "scan-status-badge", children: [
                /* @__PURE__ */ f.jsx("span", {}),
                " Inactif"
              ] })
            ] }),
            /* @__PURE__ */ f.jsxs("article", { className: "active-alerts-panel", children: [
              /* @__PURE__ */ f.jsx("p", { className: "overview-section-label", children: "ALERTES ACTIVES" }),
              /* @__PURE__ */ f.jsx("strong", { children: "0" }),
              /* @__PURE__ */ f.jsx("p", { children: "Aucune alerte en cours" })
            ] })
          ] }),
          /* @__PURE__ */ f.jsxs("section", { className: "overview-matches", "aria-labelledby": "overview-matches-title", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "overview-matches-heading", children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("p", { className: "overview-section-label", children: "SUIVI EN DIRECT" }),
                /* @__PURE__ */ f.jsx("h2", { id: "overview-matches-title", children: "Matchs suivis" })
              ] }),
              /* @__PURE__ */ f.jsxs("button", { className: "overview-primary-action", type: "button", onClick: () => tt("matches"), children: [
                "Gérer les matchs ",
                /* @__PURE__ */ f.jsx(bt, { name: "arrow", size: 18 })
              ] })
            ] }),
            /* @__PURE__ */ f.jsx("div", { className: "overview-table-scroll", children: /* @__PURE__ */ f.jsxs("table", { className: "overview-match-table", children: [
              /* @__PURE__ */ f.jsx("thead", { children: /* @__PURE__ */ f.jsxs("tr", { children: [
                /* @__PURE__ */ f.jsx("th", { scope: "col", children: "Équipes" }),
                /* @__PURE__ */ f.jsx("th", { scope: "col", children: "Score" }),
                /* @__PURE__ */ f.jsx("th", { scope: "col", children: "Minute" }),
                /* @__PURE__ */ f.jsx("th", { scope: "col", children: "Vitalité" }),
                /* @__PURE__ */ f.jsx("th", { scope: "col", children: "État" })
              ] }) }),
              /* @__PURE__ */ f.jsx("tbody", { children: /* @__PURE__ */ f.jsx("tr", { children: /* @__PURE__ */ f.jsxs("td", { colSpan: "5", children: [
                /* @__PURE__ */ f.jsx("strong", { children: "Aucun match suivi pour le moment" }),
                /* @__PURE__ */ f.jsx("span", { children: "Les rencontres apparaîtront ici lorsque les sources de données seront configurées." })
              ] }) }) })
            ] }) })
          ] })
        ] }),
        z === "matches" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
          /* @__PURE__ */ f.jsx(ou, { eyebrow: "SUIVI EN DIRECT", title: "Matchs suivis", description: "Choisissez les rencontres à surveiller dès que les sources de données seront configurées.", action: /* @__PURE__ */ f.jsx("span", { className: "count-badge", children: "0 match" }) }),
          /* @__PURE__ */ f.jsxs("div", { className: "notice notice-neutral", children: [
            /* @__PURE__ */ f.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ f.jsx(bt, { name: "clock", size: 18 }) }),
            /* @__PURE__ */ f.jsxs("div", { children: [
              /* @__PURE__ */ f.jsx("strong", { children: "La sélection des matchs sera disponible après le branchement des API" }),
              /* @__PURE__ */ f.jsx("p", { children: "Les fournisseurs, les quotas et les marchés en direct doivent d’abord être validés à l’étape de faisabilité." })
            ] })
          ] }),
          /* @__PURE__ */ f.jsxs("section", { className: "content-panel matches-panel", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("h2", { children: "Rencontres sélectionnées" }),
                /* @__PURE__ */ f.jsx("p", { children: "Le CDC Phase 1 prévoit une sélection administrateur, dans la limite des quotas API." })
              ] }),
              /* @__PURE__ */ f.jsx("span", { className: "count-badge", children: "0 / —" })
            ] }),
            /* @__PURE__ */ f.jsx(js, { icon: "search", title: "La liste est vide", message: "Aucun faux match n’est affiché. Les matchs réels ou du pilote fictif seront ajoutés lorsque le flux sera prêt." })
          ] })
        ] }),
        z === "rules" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
          /* @__PURE__ */ f.jsx(ou, { eyebrow: "CONFIGURATION", title: "Moteur de règles", description: "Consultez les règles documentées et identifiez clairement celles qui nécessitent encore une décision.", action: /* @__PURE__ */ f.jsx("span", { className: "phase-badge phase-badge-muted", children: "Paramètres par défaut" }) }),
          /* @__PURE__ */ f.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ f.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ f.jsx(bt, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ f.jsxs("div", { children: [
              /* @__PURE__ */ f.jsx("strong", { children: "Les règles non définies ne déclenchent jamais de signal" }),
              /* @__PURE__ */ f.jsx("p", { children: "Les formules métier manquantes doivent être confirmées avant toute activation." })
            ] })
          ] }),
          /* @__PURE__ */ f.jsxs("section", { className: "content-panel rules-panel", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("h2", { children: "Règles Phase 1" }),
                /* @__PURE__ */ f.jsx("p", { children: "Disponibilité selon les documents client" })
              ] }),
              /* @__PURE__ */ f.jsxs("span", { className: "count-badge", children: [
                ov.length,
                " règles"
              ] })
            ] }),
            /* @__PURE__ */ f.jsx("div", { className: "rule-table", children: ov.map((L) => /* @__PURE__ */ f.jsxs("article", { className: "rule-row", children: [
              /* @__PURE__ */ f.jsx("span", { className: "rule-id", children: L.id }),
              /* @__PURE__ */ f.jsxs("div", { className: "rule-info", children: [
                /* @__PURE__ */ f.jsx("strong", { children: L.title }),
                /* @__PURE__ */ f.jsx("p", { children: L.detail })
              ] }),
              /* @__PURE__ */ f.jsx("span", { className: `status-pill ${L.status === "Disponible" ? "status-ready" : L.status === "Partiel" ? "status-partial" : "status-pending"}`, children: L.status })
            ] }, L.id)) })
          ] }),
          /* @__PURE__ */ f.jsxs("section", { className: "content-panel settings-preview", children: [
            /* @__PURE__ */ f.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ f.jsxs("div", { children: [
              /* @__PURE__ */ f.jsx("h2", { children: "Seuils mentionnés dans le CDC" }),
              /* @__PURE__ */ f.jsx("p", { children: "Valeurs de référence, à rendre configurables par l’administrateur." })
            ] }) }),
            /* @__PURE__ */ f.jsxs("div", { className: "threshold-grid", children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Écart directionnel" }),
                /* @__PURE__ */ f.jsx("strong", { children: "< 1,50" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Vitalité minimale" }),
                /* @__PURE__ */ f.jsx("strong", { children: "40 / 100" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Cotes scores suivants" }),
                /* @__PURE__ */ f.jsx("strong", { children: "< 7,00" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Convergence" }),
                /* @__PURE__ */ f.jsx("strong", { children: "> 75 %" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Signal Over 0,5 MT" }),
                /* @__PURE__ */ f.jsx("strong", { children: "< 1,25" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Tendance stable" }),
                /* @__PURE__ */ f.jsx("strong", { children: "À confirmer" })
              ] })
            ] })
          ] })
        ] }),
        z === "tester" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
          /* @__PURE__ */ f.jsx(ou, { eyebrow: "VALIDATION", title: "Testeur manuel", description: "Évalue un jeu de cotes fourni, sans envoyer de signal ni placer de pari.", action: /* @__PURE__ */ f.jsxs("span", { className: "phase-badge phase-badge-muted", children: [
            /* @__PURE__ */ f.jsx(bt, { name: "flask", size: 15 }),
            " Simulation uniquement"
          ] }) }),
          /* @__PURE__ */ f.jsxs("div", { className: "notice notice-neutral", children: [
            /* @__PURE__ */ f.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ f.jsx(bt, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ f.jsxs("div", { children: [
              /* @__PURE__ */ f.jsx("strong", { children: "Les résultats affichés sont une simulation locale" }),
              /* @__PURE__ */ f.jsx("p", { children: "Aucun message n’est envoyé. Les notes de convergence ne sont pas inventées et ne seront disponibles qu’avec des scores de méthode définis." })
            ] })
          ] }),
          /* @__PURE__ */ f.jsxs("div", { className: "tester-layout", children: [
            /* @__PURE__ */ f.jsxs("section", { className: "content-panel tester-panel", children: [
              /* @__PURE__ */ f.jsxs("div", { className: "panel-heading", children: [
                /* @__PURE__ */ f.jsxs("div", { children: [
                  /* @__PURE__ */ f.jsx("h2", { children: "Situation du match" }),
                  /* @__PURE__ */ f.jsx("p", { children: "Saisis les données réelles ou les cas de test fournis." })
                ] }),
                /* @__PURE__ */ f.jsx("span", { className: "manual-tag", children: "F125" })
              ] }),
              /* @__PURE__ */ f.jsxs("form", { className: "tester-form", onSubmit: Wl, children: [
                /* @__PURE__ */ f.jsxs("div", { className: "form-row", children: [
                  /* @__PURE__ */ f.jsxs("label", { children: [
                    "Score à domicile",
                    /* @__PURE__ */ f.jsx("input", { min: "0", max: "20", type: "number", value: Z.homeScore, onChange: Rl("homeScore"), required: !0 })
                  ] }),
                  /* @__PURE__ */ f.jsx("span", { className: "score-separator", children: "–" }),
                  /* @__PURE__ */ f.jsxs("label", { children: [
                    "Score à l’extérieur",
                    /* @__PURE__ */ f.jsx("input", { min: "0", max: "20", type: "number", value: Z.awayScore, onChange: Rl("awayScore"), required: !0 })
                  ] })
                ] }),
                /* @__PURE__ */ f.jsxs("label", { children: [
                  "Cotes des scores exacts ",
                  /* @__PURE__ */ f.jsx("span", { className: "label-note", children: "une ligne par score" }),
                  /* @__PURE__ */ f.jsx("textarea", { rows: "5", spellCheck: "false", value: Z.oddsText, onChange: Rl("oddsText"), placeholder: `0-0 = 7,50
1-0 = 8,60
0-1 = 9,80`, required: !0 })
                ] }),
                /* @__PURE__ */ f.jsxs("div", { className: "form-row form-row-wide", children: [
                  /* @__PURE__ */ f.jsxs("label", { children: [
                    "Vitalité (0–100)",
                    /* @__PURE__ */ f.jsx("input", { min: "0", max: "100", step: "0.1", type: "number", value: Z.vitalityScore, onChange: Rl("vitalityScore"), required: !0 })
                  ] }),
                  /* @__PURE__ */ f.jsxs("label", { children: [
                    "Variation des cotes sur 2 min (%)",
                    /* @__PURE__ */ f.jsx("input", { step: "0.1", type: "number", value: Z.oddsChangePercent, onChange: Rl("oddsChangePercent"), required: !0 }),
                    /* @__PURE__ */ f.jsx("span", { className: "field-help", children: "Valeur négative = cotes en baisse." })
                  ] })
                ] }),
                /* @__PURE__ */ f.jsxs("p", { className: "format-hint", children: [
                  "Format accepté : ",
                  /* @__PURE__ */ f.jsx("code", { children: "score = cote" }),
                  " ou ",
                  /* @__PURE__ */ f.jsx("code", { children: "score : cote" }),
                  ". La tendance stable reste à confirmer."
                ] }),
                yl && /* @__PURE__ */ f.jsx("div", { className: "form-error", role: "alert", children: yl }),
                /* @__PURE__ */ f.jsxs("button", { className: "primary-button", type: "submit", disabled: U, children: [
                  U ? "Évaluation…" : "Évaluer la situation",
                  " ",
                  /* @__PURE__ */ f.jsx(bt, { name: "arrow", size: 17 })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ f.jsxs("section", { className: "content-panel result-panel", "aria-live": "polite", children: [
              /* @__PURE__ */ f.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("h2", { children: "Résultat de la simulation" }),
                /* @__PURE__ */ f.jsx("p", { children: "Analyse des règles et des filtres" })
              ] }) }),
              cl ? /* @__PURE__ */ f.jsx(b1, { result: cl }) : /* @__PURE__ */ f.jsx(js, { icon: "flask", title: "Prêt à tester", message: "Les résultats apparaîtront ici après l’évaluation des données saisies." })
            ] })
          ] })
        ] }),
        z === "journal" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
          /* @__PURE__ */ f.jsx(ou, { eyebrow: "HISTORIQUE", title: "Journal des opportunités", description: "Les détections, refus de filtres et résultats seront consignés ici.", action: /* @__PURE__ */ f.jsxs("button", { className: "secondary-button", type: "button", disabled: !0, children: [
            /* @__PURE__ */ f.jsx(bt, { name: "search", size: 16 }),
            " Filtrer"
          ] }) }),
          /* @__PURE__ */ f.jsxs("section", { className: "content-panel journal-panel", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "panel-heading", children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("h2", { children: "Événements récents" }),
                /* @__PURE__ */ f.jsx("p", { children: "Chaque évaluation doit conserver la décision et sa justification." })
              ] }),
              /* @__PURE__ */ f.jsx("span", { className: "count-badge", children: "0 événement" })
            ] }),
            /* @__PURE__ */ f.jsx(js, { icon: "list", title: "Le journal est vide", message: "L’enregistrement des détections et statistiques sera relié à la base aux prochaines étapes." })
          ] })
        ] }),
        z === "settings" && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
          /* @__PURE__ */ f.jsx(ou, { eyebrow: "CONFIGURATION", title: "Paramètres", description: "Les valeurs ci-dessous viennent du cahier des charges. Leur sauvegarde et leur application au scan seront reliées plus tard." }),
          /* @__PURE__ */ f.jsxs("div", { className: "notice notice-warning", children: [
            /* @__PURE__ */ f.jsx("span", { className: "notice-icon", children: /* @__PURE__ */ f.jsx(bt, { name: "shield", size: 18 }) }),
            /* @__PURE__ */ f.jsxs("div", { children: [
              /* @__PURE__ */ f.jsx("strong", { children: "La configuration serveur n’est pas encore branchée" }),
              /* @__PURE__ */ f.jsx("p", { children: "Cette page présente les références. Aucun réglage n’est enregistré ou appliqué au scan pour l’instant." })
            ] })
          ] }),
          /* @__PURE__ */ f.jsxs("section", { className: "content-panel settings-preview", children: [
            /* @__PURE__ */ f.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ f.jsxs("div", { children: [
              /* @__PURE__ */ f.jsx("h2", { children: "Valeurs de référence" }),
              /* @__PURE__ */ f.jsx("p", { children: "Seuils explicitement cités dans les documents de Phase 1." })
            ] }) }),
            /* @__PURE__ */ f.jsxs("div", { className: "threshold-grid", children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Écart domicile / extérieur" }),
                /* @__PURE__ */ f.jsx("strong", { children: "1,50" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Cas particulier 0–0" }),
                /* @__PURE__ */ f.jsx("strong", { children: "2,50 / 1,00" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Vitalité minimale" }),
                /* @__PURE__ */ f.jsx("strong", { children: "40 / 100" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Seuil F121-D" }),
                /* @__PURE__ */ f.jsx("strong", { children: "7,00" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Over 0,5 — seconde mi-temps" }),
                /* @__PURE__ */ f.jsx("strong", { children: "1,25" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Seuil de convergence" }),
                /* @__PURE__ */ f.jsx("strong", { children: "75 %" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Expiration de l’alerte" }),
                /* @__PURE__ */ f.jsx("strong", { children: "15 min" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Intervalle du scan" }),
                /* @__PURE__ */ f.jsx("strong", { children: "30 s" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Tendance stable" }),
                /* @__PURE__ */ f.jsx("strong", { children: "À confirmer" })
              ] }),
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("span", { children: "Normalisation vitalité" }),
                /* @__PURE__ */ f.jsx("strong", { children: "À confirmer" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("footer", { className: "footer", children: [
        /* @__PURE__ */ f.jsx("span", { children: "PRONOFOOT · Phase 1" }),
        /* @__PURE__ */ f.jsx("span", { children: "Détecteur live réservé à l’administration · aucun pari automatique" })
      ] })
    ] })
  ] });
}
y1.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ f.jsx(we.StrictMode, { children: /* @__PURE__ */ f.jsx(E1, {}) })
);
