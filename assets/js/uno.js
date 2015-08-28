/**
 * uno-zen - Minimalist and Elegant theme for Ghost
 * @version v2.3.0
 * @link    https://github.com/kikobeats/uno-zen
 * @author  Kiko Beats (https://github.com/kikobeats)
 * @license MIT
 */
!function() {
    "use strict";
    function FastClick(layer, options) {
        function bind(method, context) {
            return function() {
                return method.apply(context, arguments)
            }
        }
        var oldOnClick;
        if (options = options || {},
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        this.targetElement = null ,
        this.touchStartX = 0,
        this.touchStartY = 0,
        this.lastTouchIdentifier = 0,
        this.touchBoundary = options.touchBoundary || 10,
        this.layer = layer,
        this.tapDelay = options.tapDelay || 200,
        this.tapTimeout = options.tapTimeout || 700,
        !FastClick.notNeeded(layer)) {
            for (var methods = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], context = this, i = 0, l = methods.length; l > i; i++)
                context[methods[i]] = bind(context[methods[i]], context);
            deviceIsAndroid && (layer.addEventListener("mouseover", this.onMouse, !0),
            layer.addEventListener("mousedown", this.onMouse, !0),
            layer.addEventListener("mouseup", this.onMouse, !0)),
            layer.addEventListener("click", this.onClick, !0),
            layer.addEventListener("touchstart", this.onTouchStart, !1),
            layer.addEventListener("touchmove", this.onTouchMove, !1),
            layer.addEventListener("touchend", this.onTouchEnd, !1),
            layer.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                "click" === type ? rmv.call(layer, type, callback.hijacked || callback, capture) : rmv.call(layer, type, callback, capture)
            }
            ,
            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                "click" === type ? adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                    event.propagationStopped || callback(event)
                }
                ), capture) : adv.call(layer, type, callback, capture)
            }
            ),
            "function" == typeof layer.onclick && (oldOnClick = layer.onclick,
            layer.addEventListener("click", function(event) {
                oldOnClick(event)
            }
            , !1),
            layer.onclick = null )
        }
    }
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0
      , deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone
      , deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone
      , deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent)
      , deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent)
      , deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
    FastClick.prototype.needsClick = function(target) {
        switch (target.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (target.disabled)
                return !0;
            break;
        case "input":
            if (deviceIsIOS && "file" === target.type || target.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(target.className)
    }
    ,
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !deviceIsAndroid;
        case "input":
            switch (target.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !target.disabled && !target.readOnly;
        default:
            return /\bneedsfocus\b/.test(target.className)
        }
    }
    ,
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;
        document.activeElement && document.activeElement !== targetElement && document.activeElement.blur(),
        touch = event.changedTouches[0],
        clickEvent = document.createEvent("MouseEvents"),
        clickEvent.initMouseEvent(this.determineEventType(targetElement), !0, !0, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, !1, !1, !1, !1, 0, null ),
        clickEvent.forwardedTouchEvent = !0,
        targetElement.dispatchEvent(clickEvent)
    }
    ,
    FastClick.prototype.determineEventType = function(targetElement) {
        return deviceIsAndroid && "select" === targetElement.tagName.toLowerCase() ? "mousedown" : "click"
    }
    ,
    FastClick.prototype.focus = function(targetElement) {
        var length;
        deviceIsIOS && targetElement.setSelectionRange && 0 !== targetElement.type.indexOf("date") && "time" !== targetElement.type && "month" !== targetElement.type ? (length = targetElement.value.length,
        targetElement.setSelectionRange(length, length)) : targetElement.focus()
    }
    ,
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;
        if (scrollParent = targetElement.fastClickScrollParent,
        !scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement,
                    targetElement.fastClickScrollParent = parentElement;
                    break
                }
                parentElement = parentElement.parentElement
            } while (parentElement)
        }
        scrollParent && (scrollParent.fastClickLastScrollTop = scrollParent.scrollTop)
    }
    ,
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
        return eventTarget.nodeType === Node.TEXT_NODE ? eventTarget.parentNode : eventTarget
    }
    ,
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;
        if (event.targetTouches.length > 1)
            return !0;
        if (targetElement = this.getTargetElementFromEventTarget(event.target),
        touch = event.targetTouches[0],
        deviceIsIOS) {
            if (selection = window.getSelection(),
            selection.rangeCount && !selection.isCollapsed)
                return !0;
            if (!deviceIsIOS4) {
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier)
                    return event.preventDefault(),
                    !1;
                this.lastTouchIdentifier = touch.identifier,
                this.updateScrollParent(targetElement)
            }
        }
        return this.trackingClick = !0,
        this.trackingClickStart = event.timeStamp,
        this.targetElement = targetElement,
        this.touchStartX = touch.pageX,
        this.touchStartY = touch.pageY,
        event.timeStamp - this.lastClickTime < this.tapDelay && event.preventDefault(),
        !0
    }
    ,
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0]
          , boundary = this.touchBoundary;
        return Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary ? !0 : !1
    }
    ,
    FastClick.prototype.onTouchMove = function(event) {
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) && (this.trackingClick = !1,
        this.targetElement = null ),
        !0) : !0
    }
    ,
    FastClick.prototype.findControl = function(labelElement) {
        return void 0 !== labelElement.control ? labelElement.control : labelElement.htmlFor ? document.getElementById(labelElement.htmlFor) : labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }
    ,
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (event.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0,
            !0;
        if (event.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1,
        this.lastClickTime = event.timeStamp,
        trackingClickStart = this.trackingClickStart,
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        deviceIsIOSWithBadTarget && (touch = event.changedTouches[0],
        targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement,
        targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent),
        targetTagName = targetElement.tagName.toLowerCase(),
        "label" === targetTagName) {
            if (forElement = this.findControl(targetElement)) {
                if (this.focus(targetElement),
                deviceIsAndroid)
                    return !1;
                targetElement = forElement
            }
        } else if (this.needsFocus(targetElement))
            return event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && "input" === targetTagName ? (this.targetElement = null ,
            !1) : (this.focus(targetElement),
            this.sendClick(targetElement, event),
            deviceIsIOS && "select" === targetTagName || (this.targetElement = null ,
            event.preventDefault()),
            !1);
        return deviceIsIOS && !deviceIsIOS4 && (scrollParent = targetElement.fastClickScrollParent,
        scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) ? !0 : (this.needsClick(targetElement) || (event.preventDefault(),
        this.sendClick(targetElement, event)),
        !1)
    }
    ,
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = !1,
        this.targetElement = null 
    }
    ,
    FastClick.prototype.onMouse = function(event) {
        return this.targetElement ? event.forwardedTouchEvent ? !0 : event.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (event.stopImmediatePropagation ? event.stopImmediatePropagation() : event.propagationStopped = !0,
        event.stopPropagation(),
        event.preventDefault(),
        !1) : !0 : !0
    }
    ,
    FastClick.prototype.onClick = function(event) {
        var permitted;
        return this.trackingClick ? (this.targetElement = null ,
        this.trackingClick = !1,
        !0) : "submit" === event.target.type && 0 === event.detail ? !0 : (permitted = this.onMouse(event),
        permitted || (this.targetElement = null ),
        permitted)
    }
    ,
    FastClick.prototype.destroy = function() {
        var layer = this.layer;
        deviceIsAndroid && (layer.removeEventListener("mouseover", this.onMouse, !0),
        layer.removeEventListener("mousedown", this.onMouse, !0),
        layer.removeEventListener("mouseup", this.onMouse, !0)),
        layer.removeEventListener("click", this.onClick, !0),
        layer.removeEventListener("touchstart", this.onTouchStart, !1),
        layer.removeEventListener("touchmove", this.onTouchMove, !1),
        layer.removeEventListener("touchend", this.onTouchEnd, !1),
        layer.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }
    ,
    FastClick.notNeeded = function(layer) {
        var metaViewport, chromeVersion, blackberryVersion, firefoxVersion;
        if ("undefined" == typeof window.ontouchstart)
            return !0;
        if (chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!deviceIsAndroid)
                return !0;
            if (metaViewport = document.querySelector("meta[name=viewport]")) {
                if (-1 !== metaViewport.content.indexOf("user-scalable=no"))
                    return !0;
                if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (deviceIsBlackBerry10 && (blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),
        blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3 && (metaViewport = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== metaViewport.content.indexOf("user-scalable=no"))
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === layer.style.msTouchAction || "manipulation" === layer.style.touchAction ? !0 : (firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1],
        firefoxVersion >= 27 && (metaViewport = document.querySelector("meta[name=viewport]"),
        metaViewport && (-1 !== metaViewport.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === layer.style.touchAction || "manipulation" === layer.style.touchAction ? !0 : !1)
    }
    ,
    FastClick.attach = function(layer, options) {
        return new FastClick(layer,options)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return FastClick
    }
    ) : "undefined" != typeof module && module.exports ? (module.exports = FastClick.attach,
    module.exports.FastClick = FastClick) : window.FastClick = FastClick
}
(),
function() {
    "use strict";
    $(function() {
        var Uno;
        return window.Uno = Uno = {
            version: "2.3.0",
            search: {
                container: function() {
                    return $("#results")
                },
                form: function(action) {
                    return $("#search-container")[action]()
                }
            },
            loadingBar: function(action) {
                return $(".pace")[action]()
            },
            context: function() {
                var className;
                return className = document.body.className.split(" ")[0].split("-")[0],
                "" === className ? "error" : className
            },
            is: function(property, value) {
                return document.body.dataset[property] === value
            },
            readTime: function() {
                var DateInDays;
                return (DateInDays = function(selector, cb) {
                    return $(selector).each(function() {
                        var postDate, postDateInDays, postDateNow;
                        return postDate = $(this).html(),
                        postDateNow = new Date(Date.now()),
                        postDateInDays = Math.floor((postDateNow - new Date(postDate)) / 864e5),
                        0 === postDateInDays ? postDateInDays = "today" : 1 === postDateInDays ? postDateInDays = "yesterday" : postDateInDays += " days ago",
                        $(this).html(postDateInDays),
                        $(this).mouseover(function() {
                            return $(this).html(postDate)
                        }
                        ),
                        $(this).mouseout(function() {
                            return $(this).html(postDateInDays)
                        }
                        )
                    }
                    )
                }
                )(".post.meta > time")
            },
            device: function() {
                var h, w;
                return w = window.innerWidth,
                h = window.innerHeight,
                480 >= w ? "mobile" : 1024 >= w ? "tablet" : "desktop"
            }
        }
    }
    )
}
.call(this),
function($) {
    var lunr = function(t) {
        var e = new lunr.Index;
        return e.pipeline.add(lunr.stopWordFilter, lunr.stemmer),
        t && t.call(e, e),
        e
    }
    ;
    lunr.version = "0.4.3",
    "undefined" != typeof module && (module.exports = lunr),
    lunr.utils = {},
    lunr.utils.warn = function(t) {
        return function(e) {
            t.console && console.warn && console.warn(e)
        }
    }
    (this),
    lunr.utils.zeroFillArray = function() {
        var t = [0];
        return function(e) {
            for (; e > t.length; )
                t = t.concat(t);
            return t.slice(0, e)
        }
    }
    (),
    lunr.EventEmitter = function() {
        this.events = {}
    }
    ,
    lunr.EventEmitter.prototype.addListener = function() {
        var t = Array.prototype.slice.call(arguments)
          , e = t.pop()
          , n = t;
        if ("function" != typeof e)
            throw new TypeError("last argument must be a function");
        n.forEach(function(t) {
            this.hasHandler(t) || (this.events[t] = []),
            this.events[t].push(e)
        }
        , this)
    }
    ,
    lunr.EventEmitter.prototype.removeListener = function(t, e) {
        if (this.hasHandler(t)) {
            var n = this.events[t].indexOf(e);
            this.events[t].splice(n, 1),
            this.events[t].length || delete this.events[t]
        }
    }
    ,
    lunr.EventEmitter.prototype.emit = function(t) {
        if (this.hasHandler(t)) {
            var e = Array.prototype.slice.call(arguments, 1);
            this.events[t].forEach(function(t) {
                t.apply(void 0, e)
            }
            )
        }
    }
    ,
    lunr.EventEmitter.prototype.hasHandler = function(t) {
        return t in this.events
    }
    ,
    lunr.tokenizer = function(t) {
        if (!arguments.length || null  == t || void 0 == t)
            return [];
        if (Array.isArray(t))
            return t.map(function(t) {
                return t.toLowerCase()
            }
            );
        for (var e = ("" + t).replace(/^\s+/, ""), n = e.length - 1; n >= 0; n--)
            if (/\S/.test(e.charAt(n))) {
                e = e.substring(0, n + 1);
                break
            }
        return e.split(/\s+/).map(function(t) {
            return t.replace(/^\W+/, "").replace(/\W+$/, "").toLowerCase()
        }
        )
    }
    ,
    lunr.Pipeline = function() {
        this._stack = []
    }
    ,
    lunr.Pipeline.registeredFunctions = {},
    lunr.Pipeline.registerFunction = function(t, e) {
        e in this.registeredFunctions && lunr.utils.warn("Overwriting existing registered function: " + e),
        t.label = e,
        lunr.Pipeline.registeredFunctions[t.label] = t
    }
    ,
    lunr.Pipeline.warnIfFunctionNotRegistered = function(t) {
        var e = t.label && t.label in this.registeredFunctions;
        e || lunr.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n", t)
    }
    ,
    lunr.Pipeline.load = function(t) {
        var e = new lunr.Pipeline;
        return t.forEach(function(t) {
            var n = lunr.Pipeline.registeredFunctions[t];
            if (!n)
                throw Error("Cannot load un-registered function: " + t);
            e.add(n)
        }
        ),
        e
    }
    ,
    lunr.Pipeline.prototype.add = function() {
        var t = Array.prototype.slice.call(arguments);
        t.forEach(function(t) {
            lunr.Pipeline.warnIfFunctionNotRegistered(t),
            this._stack.push(t)
        }
        , this)
    }
    ,
    lunr.Pipeline.prototype.after = function(t, e) {
        lunr.Pipeline.warnIfFunctionNotRegistered(e);
        var n = this._stack.indexOf(t) + 1;
        this._stack.splice(n, 0, e)
    }
    ,
    lunr.Pipeline.prototype.before = function(t, e) {
        lunr.Pipeline.warnIfFunctionNotRegistered(e);
        var n = this._stack.indexOf(t);
        this._stack.splice(n, 0, e)
    }
    ,
    lunr.Pipeline.prototype.remove = function(t) {
        var e = this._stack.indexOf(t);
        this._stack.splice(e, 1)
    }
    ,
    lunr.Pipeline.prototype.run = function(t) {
        for (var e = [], n = t.length, r = this._stack.length, o = 0; n > o; o++) {
            for (var i = t[o], s = 0; r > s && (i = this._stack[s](i, o, t),
            void 0 !== i); s++)
                ;
            void 0 !== i && e.push(i)
        }
        return e
    }
    ,
    lunr.Pipeline.prototype.toJSON = function() {
        return this._stack.map(function(t) {
            return lunr.Pipeline.warnIfFunctionNotRegistered(t),
            t.label
        }
        )
    }
    ,
    lunr.Vector = function(t) {
        this.elements = t
    }
    ,
    lunr.Vector.prototype.magnitude = function() {
        if (this._magnitude)
            return this._magnitude;
        for (var t, e = 0, n = this.elements, r = n.length, o = 0; r > o; o++)
            t = n[o],
            e += t * t;
        return this._magnitude = Math.sqrt(e)
    }
    ,
    lunr.Vector.prototype.dot = function(t) {
        for (var e = this.elements, n = t.elements, r = e.length, o = 0, i = 0; r > i; i++)
            o += e[i] * n[i];
        return o
    }
    ,
    lunr.Vector.prototype.similarity = function(t) {
        return this.dot(t) / (this.magnitude() * t.magnitude())
    }
    ,
    lunr.Vector.prototype.toArray = function() {
        return this.elements
    }
    ,
    lunr.SortedSet = function() {
        this.length = 0,
        this.elements = []
    }
    ,
    lunr.SortedSet.load = function(t) {
        var e = new this;
        return e.elements = t,
        e.length = t.length,
        e
    }
    ,
    lunr.SortedSet.prototype.add = function() {
        Array.prototype.slice.call(arguments).forEach(function(t) {
            ~this.indexOf(t) || this.elements.splice(this.locationFor(t), 0, t)
        }
        , this),
        this.length = this.elements.length
    }
    ,
    lunr.SortedSet.prototype.toArray = function() {
        return this.elements.slice()
    }
    ,
    lunr.SortedSet.prototype.map = function(t, e) {
        return this.elements.map(t, e)
    }
    ,
    lunr.SortedSet.prototype.forEach = function(t, e) {
        return this.elements.forEach(t, e)
    }
    ,
    lunr.SortedSet.prototype.indexOf = function(t, e, n) {
        var e = e || 0
          , n = n || this.elements.length
          , r = n - e
          , o = e + Math.floor(r / 2)
          , i = this.elements[o];
        return 1 >= r ? i === t ? o : -1 : t > i ? this.indexOf(t, o, n) : i > t ? this.indexOf(t, e, o) : i === t ? o : void 0
    }
    ,
    lunr.SortedSet.prototype.locationFor = function(t, e, n) {
        var e = e || 0
          , n = n || this.elements.length
          , r = n - e
          , o = e + Math.floor(r / 2)
          , i = this.elements[o];
        if (1 >= r) {
            if (i > t)
                return o;
            if (t > i)
                return o + 1
        }
        return t > i ? this.locationFor(t, o, n) : i > t ? this.locationFor(t, e, o) : void 0
    }
    ,
    lunr.SortedSet.prototype.intersect = function(t) {
        for (var e = new lunr.SortedSet, n = 0, r = 0, o = this.length, i = t.length, s = this.elements, l = t.elements; !(n > o - 1 || r > i - 1); )
            s[n] !== l[r] ? s[n] < l[r] ? n++ : s[n] > l[r] && r++ : (e.add(s[n]),
            n++,
            r++);
        return e
    }
    ,
    lunr.SortedSet.prototype.clone = function() {
        var t = new lunr.SortedSet;
        return t.elements = this.toArray(),
        t.length = t.elements.length,
        t
    }
    ,
    lunr.SortedSet.prototype.union = function(t) {
        var e, n, r;
        return this.length >= t.length ? (e = this,
        n = t) : (e = t,
        n = this),
        r = e.clone(),
        r.add.apply(r, n.toArray()),
        r
    }
    ,
    lunr.SortedSet.prototype.toJSON = function() {
        return this.toArray()
    }
    ,
    lunr.Index = function() {
        this._fields = [],
        this._ref = "id",
        this.pipeline = new lunr.Pipeline,
        this.documentStore = new lunr.Store,
        this.tokenStore = new lunr.TokenStore,
        this.corpusTokens = new lunr.SortedSet,
        this.eventEmitter = new lunr.EventEmitter,
        this._idfCache = {},
        this.on("add", "remove", "update", function() {
            this._idfCache = {}
        }
        .bind(this))
    }
    ,
    lunr.Index.prototype.on = function() {
        var t = Array.prototype.slice.call(arguments);
        return this.eventEmitter.addListener.apply(this.eventEmitter, t)
    }
    ,
    lunr.Index.prototype.off = function(t, e) {
        return this.eventEmitter.removeListener(t, e)
    }
    ,
    lunr.Index.load = function(t) {
        t.version !== lunr.version && lunr.utils.warn("version mismatch: current " + lunr.version + " importing " + t.version);
        var e = new this;
        return e._fields = t.fields,
        e._ref = t.ref,
        e.documentStore = lunr.Store.load(t.documentStore),
        e.tokenStore = lunr.TokenStore.load(t.tokenStore),
        e.corpusTokens = lunr.SortedSet.load(t.corpusTokens),
        e.pipeline = lunr.Pipeline.load(t.pipeline),
        e
    }
    ,
    lunr.Index.prototype.field = function(t, e) {
        var e = e || {}
          , n = {
            name: t,
            boost: e.boost || 1
        };
        return this._fields.push(n),
        this
    }
    ,
    lunr.Index.prototype.ref = function(t) {
        return this._ref = t,
        this
    }
    ,
    lunr.Index.prototype.add = function(t, e) {
        var n = {}
          , r = new lunr.SortedSet
          , o = t[this._ref]
          , e = void 0 === e ? !0 : e;
        this._fields.forEach(function(e) {
            var o = this.pipeline.run(lunr.tokenizer(t[e.name]));
            n[e.name] = o,
            lunr.SortedSet.prototype.add.apply(r, o)
        }
        , this),
        this.documentStore.set(o, r),
        lunr.SortedSet.prototype.add.apply(this.corpusTokens, r.toArray());
        for (var i = 0; r.length > i; i++) {
            var s = r.elements[i]
              , l = this._fields.reduce(function(t, e) {
                var r = n[e.name].length;
                if (!r)
                    return t;
                var o = n[e.name].filter(function(t) {
                    return t === s
                }
                ).length;
                return t + o / r * e.boost
            }
            , 0);
            this.tokenStore.add(s, {
                ref: o,
                tf: l
            })
        }
        e && this.eventEmitter.emit("add", t, this)
    }
    ,
    lunr.Index.prototype.remove = function(t, e) {
        var n = t[this._ref]
          , e = void 0 === e ? !0 : e;
        if (this.documentStore.has(n)) {
            var r = this.documentStore.get(n);
            this.documentStore.remove(n),
            r.forEach(function(t) {
                this.tokenStore.remove(t, n)
            }
            , this),
            e && this.eventEmitter.emit("remove", t, this)
        }
    }
    ,
    lunr.Index.prototype.update = function(t, e) {
        var e = void 0 === e ? !0 : e;
        this.remove(t, !1),
        this.add(t, !1),
        e && this.eventEmitter.emit("update", t, this)
    }
    ,
    lunr.Index.prototype.idf = function(t) {
        if (this._idfCache[t])
            return this._idfCache[t];
        var e = this.tokenStore.count(t)
          , n = 1;
        return e > 0 && (n = 1 + Math.log(this.tokenStore.length / e)),
        this._idfCache[t] = n
    }
    ,
    lunr.Index.prototype.search = function(t) {
        var e = this.pipeline.run(lunr.tokenizer(t))
          , n = lunr.utils.zeroFillArray(this.corpusTokens.length)
          , r = []
          , o = this._fields.reduce(function(t, e) {
            return t + e.boost
        }
        , 0)
          , i = e.some(function(t) {
            return this.tokenStore.has(t)
        }
        , this);
        if (!i)
            return [];
        e.forEach(function(t, e, i) {
            var s = 1 / i.length * this._fields.length * o
              , l = this
              , u = this.tokenStore.expand(t).reduce(function(e, r) {
                var o = l.corpusTokens.indexOf(r)
                  , i = l.idf(r)
                  , u = 1
                  , a = new lunr.SortedSet;
                if (r !== t) {
                    var h = Math.max(3, r.length - t.length);
                    u = 1 / Math.log(h)
                }
                return o > -1 && (n[o] = s * i * u),
                Object.keys(l.tokenStore.get(r)).forEach(function(t) {
                    a.add(t)
                }
                ),
                e.union(a)
            }
            , new lunr.SortedSet);
            r.push(u)
        }
        , this);
        var s = r.reduce(function(t, e) {
            return t.intersect(e)
        }
        )
          , l = new lunr.Vector(n);
        return s.map(function(t) {
            return {
                ref: t,
                score: l.similarity(this.documentVector(t))
            }
        }
        , this).sort(function(t, e) {
            return e.score - t.score
        }
        )
    }
    ,
    lunr.Index.prototype.documentVector = function(t) {
        for (var e = this.documentStore.get(t), n = e.length, r = lunr.utils.zeroFillArray(this.corpusTokens.length), o = 0; n > o; o++) {
            var i = e.elements[o]
              , s = this.tokenStore.get(i)[t].tf
              , l = this.idf(i);
            r[this.corpusTokens.indexOf(i)] = s * l
        }
        return new lunr.Vector(r)
    }
    ,
    lunr.Index.prototype.toJSON = function() {
        return {
            version: lunr.version,
            fields: this._fields,
            ref: this._ref,
            documentStore: this.documentStore.toJSON(),
            tokenStore: this.tokenStore.toJSON(),
            corpusTokens: this.corpusTokens.toJSON(),
            pipeline: this.pipeline.toJSON()
        }
    }
    ,
    lunr.Store = function() {
        this.store = {},
        this.length = 0
    }
    ,
    lunr.Store.load = function(t) {
        var e = new this;
        return e.length = t.length,
        e.store = Object.keys(t.store).reduce(function(e, n) {
            return e[n] = lunr.SortedSet.load(t.store[n]),
            e
        }
        , {}),
        e
    }
    ,
    lunr.Store.prototype.set = function(t, e) {
        this.store[t] = e,
        this.length = Object.keys(this.store).length
    }
    ,
    lunr.Store.prototype.get = function(t) {
        return this.store[t]
    }
    ,
    lunr.Store.prototype.has = function(t) {
        return t in this.store
    }
    ,
    lunr.Store.prototype.remove = function(t) {
        this.has(t) && (delete this.store[t],
        this.length--)
    }
    ,
    lunr.Store.prototype.toJSON = function() {
        return {
            store: this.store,
            length: this.length
        }
    }
    ,
    lunr.stemmer = function() {
        var t = {
            ational: "ate",
            tional: "tion",
            enci: "ence",
            anci: "ance",
            izer: "ize",
            bli: "ble",
            alli: "al",
            entli: "ent",
            eli: "e",
            ousli: "ous",
            ization: "ize",
            ation: "ate",
            ator: "ate",
            alism: "al",
            iveness: "ive",
            fulness: "ful",
            ousness: "ous",
            aliti: "al",
            iviti: "ive",
            biliti: "ble",
            logi: "log"
        }
          , e = {
            icate: "ic",
            ative: "",
            alize: "al",
            iciti: "ic",
            ical: "ic",
            ful: "",
            ness: ""
        }
          , n = "[^aeiou]"
          , r = "[aeiouy]"
          , o = n + "[^aeiouy]*"
          , i = r + "[aeiou]*"
          , s = "^(" + o + ")?" + i + o
          , l = "^(" + o + ")?" + i + o + "(" + i + ")?$"
          , u = "^(" + o + ")?" + i + o + i + o
          , a = "^(" + o + ")?" + r;
        return function(n) {
            var i, h, c, p, f, d, v;
            if (3 > n.length)
                return n;
            if (c = n.substr(0, 1),
            "y" == c && (n = c.toUpperCase() + n.substr(1)),
            p = /^(.+?)(ss|i)es$/,
            f = /^(.+?)([^s])s$/,
            p.test(n) ? n = n.replace(p, "$1$2") : f.test(n) && (n = n.replace(f, "$1$2")),
            p = /^(.+?)eed$/,
            f = /^(.+?)(ed|ing)$/,
            p.test(n)) {
                var m = p.exec(n);
                p = RegExp(s),
                p.test(m[1]) && (p = /.$/,
                n = n.replace(p, ""))
            } else if (f.test(n)) {
                var m = f.exec(n);
                i = m[1],
                f = RegExp(a),
                f.test(i) && (n = i,
                f = /(at|bl|iz)$/,
                d = RegExp("([^aeiouylsz])\\1$"),
                v = RegExp("^" + o + r + "[^aeiouwxy]$"),
                f.test(n) ? n += "e" : d.test(n) ? (p = /.$/,
                n = n.replace(p, "")) : v.test(n) && (n += "e"))
            }
            if (p = /^(.+?)y$/,
            p.test(n)) {
                var m = p.exec(n);
                i = m[1],
                p = RegExp(a),
                p.test(i) && (n = i + "i")
            }
            if (p = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,
            p.test(n)) {
                var m = p.exec(n);
                i = m[1],
                h = m[2],
                p = RegExp(s),
                p.test(i) && (n = i + t[h])
            }
            if (p = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,
            p.test(n)) {
                var m = p.exec(n);
                i = m[1],
                h = m[2],
                p = RegExp(s),
                p.test(i) && (n = i + e[h])
            }
            if (p = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,
            f = /^(.+?)(s|t)(ion)$/,
            p.test(n)) {
                var m = p.exec(n);
                i = m[1],
                p = RegExp(u),
                p.test(i) && (n = i)
            } else if (f.test(n)) {
                var m = f.exec(n);
                i = m[1] + m[2],
                f = RegExp(u),
                f.test(i) && (n = i)
            }
            if (p = /^(.+?)e$/,
            p.test(n)) {
                var m = p.exec(n);
                i = m[1],
                p = RegExp(u),
                f = RegExp(l),
                d = RegExp("^" + o + r + "[^aeiouwxy]$"),
                (p.test(i) || f.test(i) && !d.test(i)) && (n = i)
            }
            return p = /ll$/,
            f = RegExp(u),
            p.test(n) && f.test(n) && (p = /.$/,
            n = n.replace(p, "")),
            "y" == c && (n = c.toLowerCase() + n.substr(1)),
            n
        }
    }
    (),
    lunr.Pipeline.registerFunction(lunr.stemmer, "stemmer"),
    lunr.stopWordFilter = function(t) {
        return -1 === lunr.stopWordFilter.stopWords.indexOf(t) ? t : void 0
    }
    ,
    lunr.stopWordFilter.stopWords = new lunr.SortedSet,
    lunr.stopWordFilter.stopWords.length = 119,
    lunr.stopWordFilter.stopWords.elements = ["", "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your"],
    lunr.Pipeline.registerFunction(lunr.stopWordFilter, "stopWordFilter"),
    lunr.TokenStore = function() {
        this.root = {
            docs: {}
        },
        this.length = 0
    }
    ,
    lunr.TokenStore.load = function(t) {
        var e = new this;
        return e.root = t.root,
        e.length = t.length,
        e
    }
    ,
    lunr.TokenStore.prototype.add = function(t, e, n) {
        var n = n || this.root
          , r = t[0]
          , o = t.slice(1);
        return r in n || (n[r] = {
            docs: {}
        }),
        0 === o.length ? (n[r].docs[e.ref] = e,
        void (this.length += 1)) : this.add(o, e, n[r])
    }
    ,
    lunr.TokenStore.prototype.has = function(t) {
        if (!t)
            return !1;
        for (var e = this.root, n = 0; t.length > n; n++) {
            if (!e[t[n]])
                return !1;
            e = e[t[n]]
        }
        return !0
    }
    ,
    lunr.TokenStore.prototype.getNode = function(t) {
        if (!t)
            return {};
        for (var e = this.root, n = 0; t.length > n; n++) {
            if (!e[t[n]])
                return {};
            e = e[t[n]]
        }
        return e
    }
    ,
    lunr.TokenStore.prototype.get = function(t, e) {
        return this.getNode(t, e).docs || {}
    }
    ,
    lunr.TokenStore.prototype.count = function(t, e) {
        return Object.keys(this.get(t, e)).length
    }
    ,
    lunr.TokenStore.prototype.remove = function(t, e) {
        if (t) {
            for (var n = this.root, r = 0; t.length > r; r++) {
                if (!(t[r] in n))
                    return;
                n = n[t[r]]
            }
            delete n.docs[e]
        }
    }
    ,
    lunr.TokenStore.prototype.expand = function(t, e) {
        var n = this.getNode(t)
          , r = n.docs || {}
          , e = e || [];
        return Object.keys(r).length && e.push(t),
        Object.keys(n).forEach(function(n) {
            "docs" !== n && e.concat(this.expand(t + n, e))
        }
        , this),
        e
    }
    ,
    lunr.TokenStore.prototype.toJSON = function() {
        return {
            root: this.root,
            length: this.length
        }
    }
    ,
    $.fn.ghostHunter = function(options) {
        var opts = $.extend({}, $.fn.ghostHunter.defaults, options);
        return opts.results ? (pluginMethods.init(this, opts),
        pluginMethods) : void 0
    }
    ,
    $.fn.ghostHunter.defaults = {
        results: !1,
        rss: "/rss",
        onKeyUp: !1,
        result_template: "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{pubDate}}</h4></p></a>",
        info_template: "<p>Number of posts found: {{amount}}</p>",
        displaySearchInfo: !0,
        zeroResultsInfo: !0,
        before: !1,
        onComplete: !1
    };
    var pluginMethods = {
        isInit: !1,
        init: function(target, opts) {
            var that = this;
            this.target = target,
            this.rss = opts.rss,
            this.results = opts.results,
            this.blogData = [],
            this.result_template = opts.result_template,
            this.info_template = opts.info_template,
            this.zeroResultsInfo = opts.zeroResultsInfo,
            this.displaySearchInfo = opts.displaySearchInfo,
            this.before = opts.before,
            this.onComplete = opts.onComplete,
            this.index = lunr(function() {
                this.field("title", {
                    boost: 10
                }),
                this.field("description"),
                this.field("link"),
                this.field("category"),
                this.field("pubDate"),
                this.ref("id")
            }
            ),
            target.focus(function() {
                that.loadRSS()
            }
            ),
            target.closest("form").submit(function(e) {
                e.preventDefault(),
                that.find(target.val())
            }
            ),
            opts.onKeyUp && (that.loadRSS(),
            target.keyup(function() {
                that.find(target.val())
            }
            ))
        },
        loadRSS: function() {
            if (this.isInit)
                return !1;
            var index = this.index
              , rssURL = this.rss
              , blogData = this.blogData;
            $.get(rssURL, function(data) {
                for (var posts = $(data).find("item"), i = 0; posts && i < posts.length; i++) {
                    var post = posts.eq(i)
                      , parsedData = {
                        id: i + 1,
                        title: post.find("title").text(),
                        description: post.find("description").text(),
                        category: post.find("category").text(),
                        pubDate: post.find("pubDate").text(),
                        link: post.find("link").text()
                    };
                    index.add(parsedData),
                    blogData.push(parsedData)
                }
            }
            ),
            this.isInit = !0
        },
        find: function(value) {
            var searchResult = this.index.search(value)
              , results = $(this.results)
              , resultsData = [];
            results.empty(),
            this.before && this.before(),
            (this.zeroResultsInfo || searchResult.length > 0) && this.displaySearchInfo && results.append(this.format(this.info_template, {
                amount: searchResult.length
            }));
            for (var i = 0; i < searchResult.length; i++) {
                var postData = this.blogData[searchResult[i].ref - 1];
                results.append(this.format(this.result_template, postData)),
                resultsData.push(postData)
            }
            this.onComplete && this.onComplete(resultsData)
        },
        clear: function() {
            $(this.results).empty(),
            this.target.val("")
        },
        format: function(t, d) {
            return t.replace(/{{([^{}]*)}}/g, function(a, b) {
                var r = d[b];
                return "string" == typeof r || "number" == typeof r ? r : a
            }
            )
        }
    }
}
(jQuery),
function() {
    "use strict";
    $(function() {
        var base, base1, el, postTitle, shareLink;
        return el = document.body,
        Uno.is("device", "desktop") && $(document.links).filter(function() {
            return this.hostname !== window.location.hostname
        }
        ).attr("target", "_blank"),
        null  == (base = el.dataset).page && (base.page = Uno.context()),
        null  == (base1 = el.dataset).device && (base1.device = Uno.device()),
        $(window).on("resize", Uno.device()),
        $(window).on("orientationchange", Uno.device()),
        Uno.readTime(),
        Uno.is("device", "desktop") || FastClick.attach(el),
        Uno.is("page", "post") && ($("main").readingTime({
            readingTimeTarget: ".post.reading-time > span"
        }),
        $(".content").fitVids(),
        postTitle = $("#post-title").text(),
        postTitle = postTitle.substring(0, postTitle.length - 1),
        shareLink = "http://twitter.com/share?url=" + encodeURIComponent(document.URL),
        shareLink += "&text=" + encodeURIComponent(postTitle + " »"),
        $("#share_twitter").attr("href", shareLink)),
        Uno.is("page", "error") ? $("#panic-button").click(function() {
            var s;
            return s = document.createElement("script"),
            s.setAttribute("src", "https://nthitz.github.io/turndownforwhatjs/tdfw.js"),
            document.body.appendChild(s)
        }
        ) : void 0
    }
    )
}
.call(this),
function() {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X = [].slice, Y = {}.hasOwnProperty, Z = function(a, b) {
        function c() {
            this.constructor = a
        }
        for (var d in b)
            Y.call(b, d) && (a[d] = b[d]);
        return c.prototype = b.prototype,
        a.prototype = new c,
        a.__super__ = b.prototype,
        a
    }
    , $ = [].indexOf || function(a) {
        for (var b = 0, c = this.length; c > b; b++)
            if (b in this && this[b] === a)
                return b;
        return -1
    }
    ;
    for (u = {
        catchupTime: 100,
        initialRate: .03,
        minTime: 250,
        ghostTime: 100,
        maxProgressPerFrame: 20,
        easeFactor: 1.25,
        startOnPageLoad: !0,
        restartOnPushState: !0,
        restartOnRequestAfter: 500,
        target: "body",
        elements: {
            checkInterval: 100,
            selectors: ["body"]
        },
        eventLag: {
            minSamples: 10,
            sampleCount: 3,
            lagThreshold: 3
        },
        ajax: {
            trackMethods: ["GET"],
            trackWebSockets: !0,
            ignoreURLs: []
        }
    },
    C = function() {
        var a;
        return null  != (a = "undefined" != typeof performance && null  !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? a : +new Date
    }
    ,
    E = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
    t = window.cancelAnimationFrame || window.mozCancelAnimationFrame,
    null  == E && (E = function(a) {
        return setTimeout(a, 50)
    }
    ,
    t = function(a) {
        return clearTimeout(a)
    }
    ),
    G = function(a) {
        var b, c;
        return b = C(),
        (c = function() {
            var d;
            return d = C() - b,
            d >= 33 ? (b = C(),
            a(d, function() {
                return E(c)
            }
            )) : setTimeout(c, 33 - d)
        }
        )()
    }
    ,
    F = function() {
        var a, b, c;
        return c = arguments[0],
        b = arguments[1],
        a = 3 <= arguments.length ? X.call(arguments, 2) : [],
        "function" == typeof c[b] ? c[b].apply(c, a) : c[b]
    }
    ,
    v = function() {
        var a, b, c, d, e, f, g;
        for (b = arguments[0],
        d = 2 <= arguments.length ? X.call(arguments, 1) : [],
        f = 0,
        g = d.length; g > f; f++)
            if (c = d[f])
                for (a in c)
                    Y.call(c, a) && (e = c[a],
                    null  != b[a] && "object" == typeof b[a] && null  != e && "object" == typeof e ? v(b[a], e) : b[a] = e);
        return b
    }
    ,
    q = function(a) {
        var b, c, d, e, f;
        for (c = b = 0,
        e = 0,
        f = a.length; f > e; e++)
            d = a[e],
            c += Math.abs(d),
            b++;
        return c / b
    }
    ,
    x = function(a, b) {
        var c, d, e;
        if (null  == a && (a = "options"),
        null  == b && (b = !0),
        e = document.querySelector("[data-pace-" + a + "]")) {
            if (c = e.getAttribute("data-pace-" + a),
            !b)
                return c;
            try {
                return JSON.parse(c)
            } catch (f) {
                return d = f,
                "undefined" != typeof console && null  !== console ? console.error("Error parsing inline pace options", d) : void 0
            }
        }
    }
    ,
    g = function() {
        function a() {}
        return a.prototype.on = function(a, b, c, d) {
            var e;
            return null  == d && (d = !1),
            null  == this.bindings && (this.bindings = {}),
            null  == (e = this.bindings)[a] && (e[a] = []),
            this.bindings[a].push({
                handler: b,
                ctx: c,
                once: d
            })
        }
        ,
        a.prototype.once = function(a, b, c) {
            return this.on(a, b, c, !0)
        }
        ,
        a.prototype.off = function(a, b) {
            var c, d, e;
            if (null  != (null  != (d = this.bindings) ? d[a] : void 0)) {
                if (null  == b)
                    return delete this.bindings[a];
                for (c = 0,
                e = []; c < this.bindings[a].length; )
                    e.push(this.bindings[a][c].handler === b ? this.bindings[a].splice(c, 1) : c++);
                return e
            }
        }
        ,
        a.prototype.trigger = function() {
            var a, b, c, d, e, f, g, h, i;
            if (c = arguments[0],
            a = 2 <= arguments.length ? X.call(arguments, 1) : [],
            null  != (g = this.bindings) ? g[c] : void 0) {
                for (e = 0,
                i = []; e < this.bindings[c].length; )
                    h = this.bindings[c][e],
                    d = h.handler,
                    b = h.ctx,
                    f = h.once,
                    d.apply(null  != b ? b : this, a),
                    i.push(f ? this.bindings[c].splice(e, 1) : e++);
                return i
            }
        }
        ,
        a
    }
    (),
    j = window.Pace || {},
    window.Pace = j,
    v(j, g.prototype),
    D = j.options = v({}, u, window.paceOptions, x()),
    U = ["ajax", "document", "eventLag", "elements"],
    Q = 0,
    S = U.length; S > Q; Q++)
        K = U[Q],
        D[K] === !0 && (D[K] = u[K]);
    i = function(a) {
        function b() {
            return V = b.__super__.constructor.apply(this, arguments)
        }
        return Z(b, a),
        b
    }
    (Error),
    b = function() {
        function a() {
            this.progress = 0
        }
        return a.prototype.getElement = function() {
            var a;
            if (null  == this.el) {
                if (a = document.querySelector(D.target),
                !a)
                    throw new i;
                this.el = document.createElement("div"),
                this.el.className = "pace pace-active",
                document.body.className = document.body.className.replace(/pace-done/g, ""),
                document.body.className += " pace-running",
                this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',
                null  != a.firstChild ? a.insertBefore(this.el, a.firstChild) : a.appendChild(this.el)
            }
            return this.el
        }
        ,
        a.prototype.finish = function() {
            var a;
            return a = this.getElement(),
            a.className = a.className.replace("pace-active", ""),
            a.className += " pace-inactive",
            document.body.className = document.body.className.replace("pace-running", ""),
            document.body.className += " pace-done"
        }
        ,
        a.prototype.update = function(a) {
            return this.progress = a,
            this.render()
        }
        ,
        a.prototype.destroy = function() {
            try {
                this.getElement().parentNode.removeChild(this.getElement())
            } catch (a) {
                i = a
            }
            return this.el = void 0
        }
        ,
        a.prototype.render = function() {
            var a, b, c, d, e, f, g;
            if (null  == document.querySelector(D.target))
                return !1;
            for (a = this.getElement(),
            d = "translate3d(" + this.progress + "%, 0, 0)",
            g = ["webkitTransform", "msTransform", "transform"],
            e = 0,
            f = g.length; f > e; e++)
                b = g[e],
                a.children[0].style[b] = d;
            return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (a.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"),
            this.progress >= 100 ? c = "99" : (c = this.progress < 10 ? "0" : "",
            c += 0 | this.progress),
            a.children[0].setAttribute("data-progress", "" + c)),
            this.lastRenderedProgress = this.progress
        }
        ,
        a.prototype.done = function() {
            return this.progress >= 100
        }
        ,
        a
    }
    (),
    h = function() {
        function a() {
            this.bindings = {}
        }
        return a.prototype.trigger = function(a, b) {
            var c, d, e, f, g;
            if (null  != this.bindings[a]) {
                for (f = this.bindings[a],
                g = [],
                d = 0,
                e = f.length; e > d; d++)
                    c = f[d],
                    g.push(c.call(this, b));
                return g
            }
        }
        ,
        a.prototype.on = function(a, b) {
            var c;
            return null  == (c = this.bindings)[a] && (c[a] = []),
            this.bindings[a].push(b)
        }
        ,
        a
    }
    (),
    P = window.XMLHttpRequest,
    O = window.XDomainRequest,
    N = window.WebSocket,
    w = function(a, b) {
        var c, d, e;
        e = [];
        for (d in b.prototype)
            try {
                e.push(null  == a[d] && "function" != typeof b[d] ? "function" == typeof Object.defineProperty ? Object.defineProperty(a, d, {
                    get: function() {
                        return b.prototype[d]
                    },
                    configurable: !0,
                    enumerable: !0
                }) : a[d] = b.prototype[d] : void 0)
            } catch (f) {
                c = f
            }
        return e
    }
    ,
    A = [],
    j.ignore = function() {
        var a, b, c;
        return b = arguments[0],
        a = 2 <= arguments.length ? X.call(arguments, 1) : [],
        A.unshift("ignore"),
        c = b.apply(null , a),
        A.shift(),
        c
    }
    ,
    j.track = function() {
        var a, b, c;
        return b = arguments[0],
        a = 2 <= arguments.length ? X.call(arguments, 1) : [],
        A.unshift("track"),
        c = b.apply(null , a),
        A.shift(),
        c
    }
    ,
    J = function(a) {
        var b;
        if (null  == a && (a = "GET"),
        "track" === A[0])
            return "force";
        if (!A.length && D.ajax) {
            if ("socket" === a && D.ajax.trackWebSockets)
                return !0;
            if (b = a.toUpperCase(),
            $.call(D.ajax.trackMethods, b) >= 0)
                return !0
        }
        return !1
    }
    ,
    k = function(a) {
        function b() {
            var a, c = this;
            b.__super__.constructor.apply(this, arguments),
            a = function(a) {
                var b;
                return b = a.open,
                a.open = function(d, e) {
                    return J(d) && c.trigger("request", {
                        type: d,
                        url: e,
                        request: a
                    }),
                    b.apply(a, arguments)
                }
            }
            ,
            window.XMLHttpRequest = function(b) {
                var c;
                return c = new P(b),
                a(c),
                c
            }
            ;
            try {
                w(window.XMLHttpRequest, P)
            } catch (d) {}
            if (null  != O) {
                window.XDomainRequest = function() {
                    var b;
                    return b = new O,
                    a(b),
                    b
                }
                ;
                try {
                    w(window.XDomainRequest, O)
                } catch (d) {}
            }
            if (null  != N && D.ajax.trackWebSockets) {
                window.WebSocket = function(a, b) {
                    var d;
                    return d = null  != b ? new N(a,b) : new N(a),
                    J("socket") && c.trigger("request", {
                        type: "socket",
                        url: a,
                        protocols: b,
                        request: d
                    }),
                    d
                }
                ;
                try {
                    w(window.WebSocket, N)
                } catch (d) {}
            }
        }
        return Z(b, a),
        b
    }
    (h),
    R = null ,
    y = function() {
        return null  == R && (R = new k),
        R
    }
    ,
    I = function(a) {
        var b, c, d, e;
        for (e = D.ajax.ignoreURLs,
        c = 0,
        d = e.length; d > c; c++)
            if (b = e[c],
            "string" == typeof b) {
                if (-1 !== a.indexOf(b))
                    return !0
            } else if (b.test(a))
                return !0;
        return !1
    }
    ,
    y().on("request", function(b) {
        var c, d, e, f, g;
        return f = b.type,
        e = b.request,
        g = b.url,
        I(g) ? void 0 : j.running || D.restartOnRequestAfter === !1 && "force" !== J(f) ? void 0 : (d = arguments,
        c = D.restartOnRequestAfter || 0,
        "boolean" == typeof c && (c = 0),
        setTimeout(function() {
            var b, c, g, h, i, k;
            if (b = "socket" === f ? e.readyState < 2 : 0 < (h = e.readyState) && 4 > h) {
                for (j.restart(),
                i = j.sources,
                k = [],
                c = 0,
                g = i.length; g > c; c++) {
                    if (K = i[c],
                    K instanceof a) {
                        K.watch.apply(K, d);
                        break
                    }
                    k.push(void 0)
                }
                return k
            }
        }
        , c))
    }
    ),
    a = function() {
        function a() {
            var a = this;
            this.elements = [],
            y().on("request", function() {
                return a.watch.apply(a, arguments)
            }
            )
        }
        return a.prototype.watch = function(a) {
            var b, c, d, e;
            return d = a.type,
            b = a.request,
            e = a.url,
            I(e) ? void 0 : (c = "socket" === d ? new n(b) : new o(b),
            this.elements.push(c))
        }
        ,
        a
    }
    (),
    o = function() {
        function a(a) {
            var b, c, d, e, f, g, h = this;
            if (this.progress = 0,
            null  != window.ProgressEvent)
                for (c = null ,
                a.addEventListener("progress", function(a) {
                    return h.progress = a.lengthComputable ? 100 * a.loaded / a.total : h.progress + (100 - h.progress) / 2
                }
                , !1),
                g = ["load", "abort", "timeout", "error"],
                d = 0,
                e = g.length; e > d; d++)
                    b = g[d],
                    a.addEventListener(b, function() {
                        return h.progress = 100
                    }
                    , !1);
            else
                f = a.onreadystatechange,
                a.onreadystatechange = function() {
                    var b;
                    return 0 === (b = a.readyState) || 4 === b ? h.progress = 100 : 3 === a.readyState && (h.progress = 50),
                    "function" == typeof f ? f.apply(null , arguments) : void 0
                }
        }
        return a
    }
    (),
    n = function() {
        function a(a) {
            var b, c, d, e, f = this;
            for (this.progress = 0,
            e = ["error", "open"],
            c = 0,
            d = e.length; d > c; c++)
                b = e[c],
                a.addEventListener(b, function() {
                    return f.progress = 100
                }
                , !1)
        }
        return a
    }
    (),
    d = function() {
        function a(a) {
            var b, c, d, f;
            for (null  == a && (a = {}),
            this.elements = [],
            null  == a.selectors && (a.selectors = []),
            f = a.selectors,
            c = 0,
            d = f.length; d > c; c++)
                b = f[c],
                this.elements.push(new e(b))
        }
        return a
    }
    (),
    e = function() {
        function a(a) {
            this.selector = a,
            this.progress = 0,
            this.check()
        }
        return a.prototype.check = function() {
            var a = this;
            return document.querySelector(this.selector) ? this.done() : setTimeout(function() {
                return a.check()
            }
            , D.elements.checkInterval)
        }
        ,
        a.prototype.done = function() {
            return this.progress = 100
        }
        ,
        a
    }
    (),
    c = function() {
        function a() {
            var a, b, c = this;
            this.progress = null  != (b = this.states[document.readyState]) ? b : 100,
            a = document.onreadystatechange,
            document.onreadystatechange = function() {
                return null  != c.states[document.readyState] && (c.progress = c.states[document.readyState]),
                "function" == typeof a ? a.apply(null , arguments) : void 0
            }
        }
        return a.prototype.states = {
            loading: 0,
            interactive: 50,
            complete: 100
        },
        a
    }
    (),
    f = function() {
        function a() {
            var a, b, c, d, e, f = this;
            this.progress = 0,
            a = 0,
            e = [],
            d = 0,
            c = C(),
            b = setInterval(function() {
                var g;
                return g = C() - c - 50,
                c = C(),
                e.push(g),
                e.length > D.eventLag.sampleCount && e.shift(),
                a = q(e),
                ++d >= D.eventLag.minSamples && a < D.eventLag.lagThreshold ? (f.progress = 100,
                clearInterval(b)) : f.progress = 100 * (3 / (a + 3))
            }
            , 50)
        }
        return a
    }
    (),
    m = function() {
        function a(a) {
            this.source = a,
            this.last = this.sinceLastUpdate = 0,
            this.rate = D.initialRate,
            this.catchup = 0,
            this.progress = this.lastProgress = 0,
            null  != this.source && (this.progress = F(this.source, "progress"))
        }
        return a.prototype.tick = function(a, b) {
            var c;
            return null  == b && (b = F(this.source, "progress")),
            b >= 100 && (this.done = !0),
            b === this.last ? this.sinceLastUpdate += a : (this.sinceLastUpdate && (this.rate = (b - this.last) / this.sinceLastUpdate),
            this.catchup = (b - this.progress) / D.catchupTime,
            this.sinceLastUpdate = 0,
            this.last = b),
            b > this.progress && (this.progress += this.catchup * a),
            c = 1 - Math.pow(this.progress / 100, D.easeFactor),
            this.progress += c * this.rate * a,
            this.progress = Math.min(this.lastProgress + D.maxProgressPerFrame, this.progress),
            this.progress = Math.max(0, this.progress),
            this.progress = Math.min(100, this.progress),
            this.lastProgress = this.progress,
            this.progress
        }
        ,
        a
    }
    (),
    L = null ,
    H = null ,
    r = null ,
    M = null ,
    p = null ,
    s = null ,
    j.running = !1,
    z = function() {
        return D.restartOnPushState ? j.restart() : void 0
    }
    ,
    null  != window.history.pushState && (T = window.history.pushState,
    window.history.pushState = function() {
        return z(),
        T.apply(window.history, arguments)
    }
    ),
    null  != window.history.replaceState && (W = window.history.replaceState,
    window.history.replaceState = function() {
        return z(),
        W.apply(window.history, arguments)
    }
    ),
    l = {
        ajax: a,
        elements: d,
        document: c,
        eventLag: f
    },
    (B = function() {
        var a, c, d, e, f, g, h, i;
        for (j.sources = L = [],
        g = ["ajax", "elements", "document", "eventLag"],
        c = 0,
        e = g.length; e > c; c++)
            a = g[c],
            D[a] !== !1 && L.push(new l[a](D[a]));
        for (i = null  != (h = D.extraSources) ? h : [],
        d = 0,
        f = i.length; f > d; d++)
            K = i[d],
            L.push(new K(D));
        return j.bar = r = new b,
        H = [],
        M = new m
    }
    )(),
    j.stop = function() {
        return j.trigger("stop"),
        j.running = !1,
        r.destroy(),
        s = !0,
        null  != p && ("function" == typeof t && t(p),
        p = null ),
        B()
    }
    ,
    j.restart = function() {
        return j.trigger("restart"),
        j.stop(),
        j.start()
    }
    ,
    j.go = function() {
        var a;
        return j.running = !0,
        r.render(),
        a = C(),
        s = !1,
        p = G(function(b, c) {
            var d, e, f, g, h, i, k, l, n, o, p, q, t, u, v, w;
            for (l = 100 - r.progress,
            e = p = 0,
            f = !0,
            i = q = 0,
            u = L.length; u > q; i = ++q)
                for (K = L[i],
                o = null  != H[i] ? H[i] : H[i] = [],
                h = null  != (w = K.elements) ? w : [K],
                k = t = 0,
                v = h.length; v > t; k = ++t)
                    g = h[k],
                    n = null  != o[k] ? o[k] : o[k] = new m(g),
                    f &= n.done,
                    n.done || (e++,
                    p += n.tick(b));
            return d = p / e,
            r.update(M.tick(b, d)),
            r.done() || f || s ? (r.update(100),
            j.trigger("done"),
            setTimeout(function() {
                return r.finish(),
                j.running = !1,
                j.trigger("hide")
            }
            , Math.max(D.ghostTime, Math.max(D.minTime - (C() - a), 0)))) : c()
        }
        )
    }
    ,
    j.start = function(a) {
        v(D, a),
        j.running = !0;
        try {
            r.render()
        } catch (b) {
            i = b
        }
        return document.querySelector(".pace") ? (j.trigger("start"),
        j.go()) : setTimeout(j.start, 50)
    }
    ,
    "function" == typeof define && define.amd ? define(["pace"], function() {
        return j
    }
    ) : "object" == typeof exports ? module.exports = j : D.startOnPageLoad && j.start()
}
.call(this),
function() {
    "use strict";
    $(function() {
        var _animate, _expand, el, isOpen;
        return el = document.body,
        isOpen = "#open" === location.hash,
        _animate = function() {
            return setTimeout(function() {
                return $(".cover").addClass("animated")
            }
            , 1e3)
        }
        ,
        _expand = function(options) {
            var method;
            return null  == options && (options = {}),
            method = "hide" === options.toggle ? "addClass" : "toggleClass",
            $(".cover")[method]("expanded"),
            $(".link-item")[method]("expanded"),
            null  != options.form ? Uno.search.form(options.form) : void 0
        }
        ,
        $("#blog-button, #avatar-link").click(function() {
            return Uno.is("device", "desktop") ? _expand({
                hide: "toggle",
                form: "toggle"
            }) : $(selector).trigger("click")
        }
        ),
        $("#menu-button").click(function() {
            return $(".cover").toggleClass("expanded"),
            $(".main").toggleClass("expanded"),
            $("#menu-button").toggleClass("expanded")
        }
        ),
        Uno.is("device", "desktop") && Uno.is("page", "home") && (_animate(),
        !isOpen) ? _expand({
            aside: "hide",
            form: "hide"
        }) : void 0
    }
    )
}
.call(this),
function($) {
    "use strict";
    $.fn.fitVids = function(options) {
        var settings = {
            customSelector: null 
        };
        if (!document.getElementById("fit-vids-style")) {
            var head = document.head || document.getElementsByTagName("head")[0]
              , css = ".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}"
              , div = document.createElement("div");
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + "</style>",
            head.appendChild(div.childNodes[1])
        }
        return options && $.extend(settings, options),
        this.each(function() {
            var selectors = ["iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed"];
            settings.customSelector && selectors.push(settings.customSelector);
            var $allVideos = $(this).find(selectors.join(","));
            $allVideos = $allVideos.not("object object"),
            $allVideos.each(function() {
                var $this = $(this);
                if (!("embed" === this.tagName.toLowerCase() && $this.parent("object").length || $this.parent(".fluid-width-video-wrapper").length)) {
                    var height = "object" === this.tagName.toLowerCase() || $this.attr("height") && !isNaN(parseInt($this.attr("height"), 10)) ? parseInt($this.attr("height"), 10) : $this.height()
                      , width = isNaN(parseInt($this.attr("width"), 10)) ? $this.width() : parseInt($this.attr("width"), 10)
                      , aspectRatio = height / width;
                    if (!$this.attr("id")) {
                        var videoID = "fitvid" + Math.floor(999999 * Math.random());
                        $this.attr("id", videoID)
                    }
                    $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * aspectRatio + "%"),
                    $this.removeAttr("height").removeAttr("width")
                }
            }
            )
        }
        )
    }
}
(window.jQuery || window.Zepto),
function() {
    "use strict";
    $(function() {
        var hideSearch, showSearch;
        return showSearch = function() {
            return $(".content").hide(),
            $("#search-results").addClass("active")
        }
        ,
        hideSearch = function() {
            return $(".content").show(),
            $("#search-results").removeClass("active")
        }
        ,
        $("#search-field").ghostHunter({
            results: "#search-results",
            zeroResultsInfo: !1,
            onKeyUp: !0,
            displaySearchInfo: !0,
            result_template: "<a class=\"result\" href='{{link}}'>\n  <h2>{{title}}</h2>\n  <h4>{{pubDate}}</h4>\n</a>",
            onComplete: function(query) {
                return query.length > 0 ? showSearch() : hideSearch()
            }
        })
    }
    )
}
.call(this),
function(a) {
    a.fn.readingTime = function(o) {
        if (!this.length)
            return this;
        var g = {
            readingTimeTarget: ".eta",
            wordCountTarget: null ,
            wordsPerMinute: 270,
            round: !0,
            lang: "en",
            remotePath: null ,
            remoteTarget: null 
        }
          , h = this
          , c = a(this);
        h.settings = a.extend({}, g, o);
        var e = h.settings.readingTimeTarget
          , d = h.settings.wordCountTarget
          , j = h.settings.wordsPerMinute
          , m = h.settings.round
          , b = h.settings.lang
          , f = h.settings.remotePath
          , l = h.settings.remoteTarget;
        if ("fr" == b)
            var k = "Moins d'une minute"
              , n = "min";
        else if ("de" == b)
            var k = "Weniger als eine Minute"
              , n = "min";
        else if ("es" == b)
            var k = "Menos de un minuto"
              , n = "min";
        else
            var k = "Less than a minute"
              , n = "min";
        var i = function(v) {
            var s = v.split(" ").length
              , r = j / 60
              , p = s / r
              , u = Math.round(p / 60)
              , t = Math.round(p - 60 * u);
            if (m === !0)
                c.find(e).text(u > 0 ? u + " " + n : k);
            else {
                var q = u + ":" + t;
                c.find(e).text(q)
            }
            "" !== d && void 0 !== d && c.find(d).text(s)
        }
        ;
        c.each(function() {
            null  != f && null  != l ? a.get(f, function(p) {
                i(a(p).children().text())
            }
            ) : i(c.text())
        }
        )
    }
}
(jQuery);
