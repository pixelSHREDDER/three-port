import { PerspectiveCamera, OrbitControls, OrbitControlsProps } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Vector3 } from 'three';

///////////////////////
///      UTILS      ///
///////////////////////

const distance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.sqrt((dx * dx) + (dy * dy));
};

const angle = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return degrees(Math.atan2(dy, dx));
};

const findCoord = (p, d, a) => {
    const b = {x: 0, y: 0};
    a = radians(a);
    b.x = p.x - d * Math.cos(a);
    b.y = p.y - d * Math.sin(a);
    return b;
};

const radians = (a) => {
    return a * (Math.PI / 180);
};

const degrees = (a) => {
    return a * (180 / Math.PI);
};

const isPressed = (evt) => {
    if (isNaN(evt.buttons)) {
        return evt.pressure !== 0;
    }
    return evt.buttons !== 0;
};

const timers = new Map();
const throttle = (cb) => {
    if (timers.has(cb)) {
        clearTimeout(timers.get(cb));
    }
    timers.set(cb, setTimeout(cb, 100));
};

const bindEvt = (el, arg, handler) => {
    const types = arg.split(/[ ,]+/g);
    let type;
    for (let i = 0; i < types.length; i += 1) {
        type = types[i];
        if (el.addEventListener) {
            el.addEventListener(type, handler, false);
        } else if (el.attachEvent) {
            el.attachEvent(type, handler);
        }
    }
};

const unbindEvt = (el, arg, handler) => {
    const types = arg.split(/[ ,]+/g);
    let type;
    for (let i = 0; i < types.length; i += 1) {
        type = types[i];
        if (el.removeEventListener) {
            el.removeEventListener(type, handler);
        } else if (el.detachEvent) {
            el.detachEvent(type, handler);
        }
    }
};

const prepareEvent = (evt) => {
    evt.preventDefault();
    return evt.type.match(/^touch/) ? evt.changedTouches : evt;
};

const getScroll = () => {  
  const x = (window.pageXOffset !== undefined) ?
        window.pageXOffset :
        (document.documentElement || document.body.parentNode || document.body)
        /* @ts-ignore */    
        .scrollLeft;

    const y = (window.pageYOffset !== undefined) ?
        window.pageYOffset :
        (document.documentElement || document.body.parentNode || document.body)
        /* @ts-ignore */    
        .scrollTop;
    return {
        x: x,
        y: y
    };
};

const applyPosition = (el, pos) => {
    if (pos.top || pos.right || pos.bottom || pos.left) {
        el.style.top = pos.top;
        el.style.right = pos.right;
        el.style.bottom = pos.bottom;
        el.style.left = pos.left;
    } else {
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
    }
};

const getTransitionStyle = (property, values, time) => {
    const obj = configStylePropertyObject(property);
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (typeof values === 'string') {
                obj[i] = values + ' ' + time;
            } else {
                let st = '';
                for (let j = 0, max = values.length; j < max; j += 1) {
                    st += values[j] + ' ' + time + ', ';
                }
                obj[i] = st.slice(0, -2);
            }
        }
    }
    return obj;
};

const getVendorStyle = (property, value) => {
    const obj = configStylePropertyObject(property);
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            obj[i] = value;
        }
    }
    return obj;
};

const configStylePropertyObject = (prop) => {
    const obj = {};
    obj[prop] = '';
    const vendors = ['webkit', 'Moz', 'o'];
    vendors.forEach(function (vendor) {
        obj[vendor + prop.charAt(0).toUpperCase() + prop.slice(1)] = '';
    });
    return obj;
};

const extend = (objA, objB) => {
    for (let i in objB) {
        if (objB.hasOwnProperty(i)) {
            objA[i] = objB[i];
        }
    }
    return objA;
};

// Overwrite only what's already present
const safeExtend = (objA, objB) => {
    const obj = {};
    for (let i in objA) {
        if (objA.hasOwnProperty(i) && objB.hasOwnProperty(i)) {
            obj[i] = objB[i];
        } else if (objA.hasOwnProperty(i)) {
            obj[i] = objA[i];
        }
    }
    return obj;
};

// Map for array or unique item.
const map = (ar, fn) => {
    if (ar.length) {
        for (let i = 0, max = ar.length; i < max; i += 1) {
            fn(ar[i]);
        }
    } else {
        fn(ar);
    }
};

// Clamp position within the range
const clamp = (pos, nipplePos, size) => ({
    //                          left-clamping        right-clamping
    x: Math.min(Math.max(pos.x, nipplePos.x - size), nipplePos.x + size),
    //                          top-clamping         bottom-clamping
    y: Math.min(Math.max(pos.y, nipplePos.y - size), nipplePos.y + size)
});

///////////////////////

// Constants
var isTouch = !!('ontouchstart' in window);
var isPointer = window.PointerEvent ? true : false;
/* @ts-ignore */
var isMSPointer = window.MSPointerEvent ? true : false;
var events = {
    touch: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend, touchcancel'
    },
    mouse: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    },
    pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        end: 'pointerup, pointercancel'
    },
    MSPointer: {
        start: 'MSPointerDown',
        move: 'MSPointerMove',
        end: 'MSPointerUp'
    }
};
var toBind;
var secondBind = {};
if (isPointer) {
    toBind = events.pointer;
} else if (isMSPointer) {
    toBind = events.MSPointer;
} else if (isTouch) {
    toBind = events.touch;
    secondBind = events.mouse;
} else {
    toBind = events.mouse;
}

function Super () {}

// Basic event system.
Super.prototype.on = function (arg, cb) {
    var self = this;
    var types = arg.split(/[ ,]+/g);
    var type;
    self._handlers_ = self._handlers_ || {};

    for (var i = 0; i < types.length; i += 1) {
        type = types[i];
        self._handlers_[type] = self._handlers_[type] || [];
        self._handlers_[type].push(cb);
    }
    return self;
};

Super.prototype.off = function (type, cb) {
    var self = this;
    self._handlers_ = self._handlers_ || {};

    if (type === undefined) {
        self._handlers_ = {};
    } else if (cb === undefined) {
        self._handlers_[type] = null;
    } else if (self._handlers_[type] &&
            self._handlers_[type].indexOf(cb) >= 0) {
        self._handlers_[type].splice(self._handlers_[type].indexOf(cb), 1);
    }

    return self;
};

Super.prototype.trigger = function (arg, data) {
    var self = this;
    var types = arg.split(/[ ,]+/g);
    var type;
    self._handlers_ = self._handlers_ || {};

    for (var i = 0; i < types.length; i += 1) {
        type = types[i];
        if (self._handlers_[type] && self._handlers_[type].length) {
            self._handlers_[type].forEach(function (handler) {
                handler.call(self, {
                    type: type,
                    target: self
                }, data);
            });
        }
    }
};

// Configuration
Super.prototype.config = function (options) {
    var self = this;
    self.options = self.defaults || {};
    if (options) {
        self.options = safeExtend(self.options, options);
    }
};

// Bind internal events.
Super.prototype.bindEvt = function (el, type) {
    var self = this;
    self._domHandlers_ = self._domHandlers_ || {};

    self._domHandlers_[type] = function () {
        if (typeof self['on' + type] === 'function') {
            self['on' + type].apply(self, arguments);
        } else {
            // eslint-disable-next-line no-console
            console.warn('[WARNING] : Missing "on' + type + '" handler.');
        }
    };

    bindEvt(el, toBind[type], self._domHandlers_[type]);

    if (secondBind[type]) {
        // Support for both touch and mouse at the same time.
        bindEvt(el, secondBind[type], self._domHandlers_[type]);
    }

    return self;
};

// Unbind dom events.
Super.prototype.unbindEvt = function (el, type) {
    var self = this;
    self._domHandlers_ = self._domHandlers_ || {};

    unbindEvt(el, toBind[type], self._domHandlers_[type]);

    if (secondBind[type]) {
        // Support for both touch and mouse at the same time.
        unbindEvt(el, secondBind[type], self._domHandlers_[type]);
    }

    delete self._domHandlers_[type];

    return this;
};

///////////////////////
///   THE NIPPLE    ///
///////////////////////

function Nipple (collection, options) {
    this.identifier = options.identifier;
    this.position = options.position;
    this.frontPosition = options.frontPosition;
    this.collection = collection;

    // Defaults
    this.defaults = {
        size: 100,
        threshold: 0.1,
        color: 'white',
        fadeTime: 250,
        dataOnly: false,
        restJoystick: true,
        restOpacity: 0.5,
        mode: 'dynamic',
        zone: document.body,
        lockX: false,
        lockY: false,
        shape: 'circle'
    };

    this.config(options);

    // Overwrites
    if (this.options.mode === 'dynamic') {
        this.options.restOpacity = 0;
    }

    this.id = Nipple.id;
    Nipple.id += 1;
    this.buildEl()
        .stylize();

    // Nipple's API.
    this.instance = {
        el: this.ui.el,
        on: this.on.bind(this),
        off: this.off.bind(this),
        show: this.show.bind(this),
        hide: this.hide.bind(this),
        add: this.addToDom.bind(this),
        remove: this.removeFromDom.bind(this),
        destroy: this.destroy.bind(this),
        setPosition:this.setPosition.bind(this),
        resetDirection: this.resetDirection.bind(this),
        computeDirection: this.computeDirection.bind(this),
        trigger: this.trigger.bind(this),
        position: this.position,
        frontPosition: this.frontPosition,
        ui: this.ui,
        identifier: this.identifier,
        id: this.id,
        options: this.options
    };

    return this.instance;
}

Nipple.prototype = new Super();
Nipple.constructor = Nipple;
Nipple.id = 0;

// Build the dom element of the Nipple instance.
Nipple.prototype.buildEl = function (options) {
    this.ui = {};

    if (this.options.dataOnly) {
        return this;
    }

    this.ui.el = document.createElement('div');
    this.ui.back = document.createElement('div');
    this.ui.front = document.createElement('div');

    this.ui.el.className = 'nipple collection_' + this.collection.id;
    this.ui.back.className = 'back';
    this.ui.front.className = 'front';

    this.ui.el.setAttribute('id', 'nipple_' + this.collection.id +
        '_' + this.id);

    this.ui.el.appendChild(this.ui.back);
    this.ui.el.appendChild(this.ui.front);

    return this;
};

// Apply CSS to the Nipple instance.
Nipple.prototype.stylize = function () {
    if (this.options.dataOnly) {
        return this;
    }
    var animTime = this.options.fadeTime + 'ms';
    var borderStyle = getVendorStyle('borderRadius', '50%');
    var transitStyle = getTransitionStyle('transition', 'opacity', animTime);
    var styles = {};
    styles['el'] = {
        position: 'absolute',
        opacity: this.options.restOpacity,
        display: 'block',
        'zIndex': 999
    };

    styles['back'] = {
        position: 'absolute',
        display: 'block',
        width: this.options.size + 'px',
        height: this.options.size + 'px',
        marginLeft: -this.options.size / 2 + 'px',
        marginTop: -this.options.size / 2 + 'px',
        background: this.options.color,
        'opacity': '.5'
    };

    styles['front'] = {
        width: this.options.size / 2 + 'px',
        height: this.options.size / 2 + 'px',
        position: 'absolute',
        display: 'block',
        marginLeft: -this.options.size / 4 + 'px',
        marginTop: -this.options.size / 4 + 'px',
        background: this.options.color,
        'opacity': '.5'
    };

    extend(styles['el'], transitStyle);
    if(this.options.shape === 'circle'){
        extend(styles['back'], borderStyle);
    }
    extend(styles['front'], borderStyle);

    this.applyStyles(styles);

    return this;
};

Nipple.prototype.applyStyles = function (styles) {
    // Apply styles
    for (var i in this.ui) {
        if (this.ui.hasOwnProperty(i)) {
            for (var j in styles[i]) {
                this.ui[i].style[j] = styles[i][j];
            }
        }
    }

    return this;
};

// Inject the Nipple instance into DOM.
Nipple.prototype.addToDom = function () {
    // We're not adding it if we're dataOnly or already in dom.
    if (this.options.dataOnly || document.body.contains(this.ui.el)) {
        return this;
    }
    this.options.zone.appendChild(this.ui.el);
    return this;
};

// Remove the Nipple instance from DOM.
Nipple.prototype.removeFromDom = function () {
    if (this.options.dataOnly || !document.body.contains(this.ui.el)) {
        return this;
    }
    this.options.zone.removeChild(this.ui.el);
    return this;
};

// Entirely destroy this nipple
Nipple.prototype.destroy = function () {
    clearTimeout(this.removeTimeout);
    clearTimeout(this.showTimeout);
    clearTimeout(this.restTimeout);
    this.trigger('destroyed', this.instance);
    this.removeFromDom();
    this.off();
};

// Fade in the Nipple instance.
Nipple.prototype.show = function (cb) {
    var self = this;

    if (self.options.dataOnly) {
        return self;
    }

    clearTimeout(self.removeTimeout);
    clearTimeout(self.showTimeout);
    clearTimeout(self.restTimeout);

    self.addToDom();

    self.restCallback();

    setTimeout(function () {
        self.ui.el.style.opacity = 1;
    }, 0);

    self.showTimeout = setTimeout(function () {
        self.trigger('shown', self.instance);
        if (typeof cb === 'function') {
            cb.call(this);
        }
    }, self.options.fadeTime);

    return self;
};

// Fade out the Nipple instance.
Nipple.prototype.hide = function (cb) {
    var self = this;

    if (self.options.dataOnly) {
        return self;
    }

    self.ui.el.style.opacity = self.options.restOpacity;

    clearTimeout(self.removeTimeout);
    clearTimeout(self.showTimeout);
    clearTimeout(self.restTimeout);

    self.removeTimeout = setTimeout(
        function () {
            var display = self.options.mode === 'dynamic' ? 'none' : 'block';
            self.ui.el.style.display = display;
            if (typeof cb === 'function') {
                cb.call(self);
            }

            self.trigger('hidden', self.instance);
        },
        self.options.fadeTime
    );
    if (self.options.restJoystick) {
        self.setPosition(cb, { x: 0, y: 0 });
    }

    return self;
};

// Set the nipple to the specified position
Nipple.prototype.setPosition = function (cb, position) {
    var self = this;
    self.frontPosition = {
        x: position.x,
        y: position.y
    };
    var animTime = self.options.fadeTime + 'ms';

    var transitStyle = {};
    transitStyle['front'] = getTransitionStyle('transition',
        ['top', 'left'], animTime);

    var styles = {front: {}};
    styles.front = {
        left: self.frontPosition.x + 'px',
        top: self.frontPosition.y + 'px'
    };

    self.applyStyles(transitStyle);
    self.applyStyles(styles);

    self.restTimeout = setTimeout(
        function () {
            if (typeof cb === 'function') {
                cb.call(self);
            }
            self.restCallback();
        },
        self.options.fadeTime
    );
};

Nipple.prototype.restCallback = function () {
    var self = this;
    var transitStyle = {};
    transitStyle['front'] = getTransitionStyle('transition', 'none', '');
    self.applyStyles(transitStyle);
    self.trigger('rested', self.instance);
};

Nipple.prototype.resetDirection = function () {
    // Fully rebuild the object to let the iteration possible.
    this.direction = {
        x: false,
        y: false,
        angle: false
    };
};

Nipple.prototype.computeDirection = function (obj) {
    var rAngle = obj.angle.radian;
    var angle45 = Math.PI / 4;
    var angle90 = Math.PI / 2;
    var direction, directionX, directionY;

    // Angular direction
    //     \  UP /
    //      \   /
    // LEFT       RIGHT
    //      /   \
    //     /DOWN \
    //
    if (
        rAngle > angle45 &&
        rAngle < (angle45 * 3) &&
        !obj.lockX
    ) {
        direction = 'up';
    } else if (
        rAngle > -angle45 &&
        rAngle <= angle45 &&
        !obj.lockY
    ) {
        direction = 'left';
    } else if (
        rAngle > (-angle45 * 3) &&
        rAngle <= -angle45 &&
        !obj.lockX
    ) {
        direction = 'down';
    } else if (!obj.lockY) {
        direction = 'right';
    }

    // Plain direction
    //    UP                 |
    // _______               | RIGHT
    //                  LEFT |
    //   DOWN                |
    if (!obj.lockY) {
        if (rAngle > -angle90 && rAngle < angle90) {
            directionX = 'left';
        } else {
            directionX = 'right';
        }
    }

    if (!obj.lockX) {
        if (rAngle > 0) {
            directionY = 'up';
        } else {
            directionY = 'down';
        }
    }

    if (obj.force > this.options.threshold) {
        var oldDirection = {};
        var i;
        for (i in this.direction) {
            if (this.direction.hasOwnProperty(i)) {
                oldDirection[i] = this.direction[i];
            }
        }

        var same = {};

        this.direction = {
            x: directionX,
            y: directionY,
            angle: direction
        };

        obj.direction = this.direction;

        for (i in oldDirection) {
            if (oldDirection[i] === this.direction[i]) {
                same[i] = true;
            }
        }

        // If all 3 directions are the same, we don't trigger anything.
        if (same['x'] && same['y'] && same['angle']) {
            return obj;
        }

        if (!same['x'] || !same['y']) {
            this.trigger('plain', obj);
        }

        if (!same['x']) {
            this.trigger('plain:' + directionX, obj);
        }

        if (!same['y']) {
            this.trigger('plain:' + directionY, obj);
        }

        if (!same['angle']) {
            this.trigger('dir dir:' + direction, obj);
        }
    } else {
        this.resetDirection();
    }

    return obj;
};

///////////////////////////
///   THE COLLECTION    ///
///////////////////////////

function Collection (manager, options) {
    var self = this;
    self.nipples = [];
    self.idles = [];
    self.actives = [];
    self.ids = [];
    self.pressureIntervals = {};
    self.manager = manager;
    self.id = Collection.id;
    Collection.id += 1;

    // Defaults
    self.defaults = {
        zone: document.body,
        multitouch: false,
        maxNumberOfNipples: 10,
        mode: 'dynamic',
        position: {top: 0, left: 0},
        catchDistance: 200,
        size: 100,
        threshold: 0.1,
        color: 'black',
        fadeTime: 250,
        dataOnly: false,
        restJoystick: true,
        restOpacity: 0.5,
        lockX: false,
        lockY: false,
        shape: 'circle',
        dynamicPage: false,
        follow: false
    };

    self.config(options);

    // Overwrites
    if (self.options.mode === 'static' || self.options.mode === 'semi') {
        self.options.multitouch = false;
    }

    if (!self.options.multitouch) {
        self.options.maxNumberOfNipples = 1;
    }

    self.updateBox();
    self.prepareNipples();
    self.bindings();
    self.begin();

    return self.nipples;
}

Collection.prototype = new Super();
Collection.constructor = Collection;
Collection.id = 0;

Collection.prototype.prepareNipples = function () {
    var self = this;
    var nips = self.nipples;

    // Public API Preparation.
    nips.on = self.on.bind(self);
    nips.off = self.off.bind(self);
    nips.options = self.options;
    nips.destroy = self.destroy.bind(self);
    nips.ids = self.ids;
    nips.id = self.id;
    nips.processOnMove = self.processOnMove.bind(self);
    nips.processOnEnd = self.processOnEnd.bind(self);
    nips.get = function (id) {
        if (id === undefined) {
            return nips[0];
        }
        for (var i = 0, max = nips.length; i < max; i += 1) {
            if (nips[i].identifier === id) {
                return nips[i];
            }
        }
        return false;
    };
};

Collection.prototype.bindings = function () {
    var self = this;
    // Touch start event.
    self.bindEvt(self.options.zone, 'start');
    // Avoid native touch actions (scroll, zoom etc...) on the zone.
    self.options.zone.style.touchAction = 'none';
    self.options.zone.style.msTouchAction = 'none';
};

Collection.prototype.begin = function () {
    var self = this;
    var opts = self.options;

    // We place our static nipple
    // if needed.
    if (opts.mode === 'static') {
        var nipple = self.createNipple(
            opts.position,
            self.manager.getIdentifier()
        );
        // Add it to the dom.
        nipple.add();
        // Store it in idles.
        self.idles.push(nipple);
    }
};

// Nipple Factory
Collection.prototype.createNipple = function (position, identifier) {
    var self = this;
    var scroll = self.manager.scroll;
    var toPutOn = {};
    var opts = self.options;

    if (position.x && position.y) {
        toPutOn = {
            x: position.x -
                (scroll.x + self.box.left),
            y: position.y -
                (scroll.y + self.box.top)
        };
    } else if (
        position.top ||
        position.right ||
        position.bottom ||
        position.left
    ) {

        // We need to compute the position X / Y of the joystick.
        var dumb = document.createElement('DIV');
        dumb.style.display = 'hidden';
        dumb.style.top = position.top;
        dumb.style.right = position.right;
        dumb.style.bottom = position.bottom;
        dumb.style.left = position.left;
        dumb.style.position = 'absolute';

        opts.zone.appendChild(dumb);
        var dumbBox = dumb.getBoundingClientRect();
        opts.zone.removeChild(dumb);

        toPutOn = position;
        position = {
            x: dumbBox.left + scroll.x,
            y: dumbBox.top + scroll.y
        };
    }

    /* @ts-ignore */
    var nipple = new Nipple(self, {
        color: opts.color,
        size: opts.size,
        threshold: opts.threshold,
        fadeTime: opts.fadeTime,
        dataOnly: opts.dataOnly,
        restJoystick: opts.restJoystick,
        restOpacity: opts.restOpacity,
        mode: opts.mode,
        identifier: identifier,
        position: position,
        zone: opts.zone,
        frontPosition: {
            x: 0,
            y: 0
        },
        shape: opts.shape
    });

    if (!opts.dataOnly) {
        applyPosition(nipple.ui.el, toPutOn);
        applyPosition(nipple.ui.front, nipple.frontPosition);
    }
    self.nipples.push(nipple);
    self.trigger('added ' + nipple.identifier + ':added', nipple);
    self.manager.trigger('added ' + nipple.identifier + ':added', nipple);

    self.bindNipple(nipple);

    return nipple;
};

Collection.prototype.updateBox = function () {
    var self = this;
    self.box = self.options.zone.getBoundingClientRect();
};

Collection.prototype.bindNipple = function (nipple) {
    var self = this;
    var type;
    // Bubble up identified events.
    var handler = function (evt, data) {
        // Identify the event type with the nipple's id.
        type = evt.type + ' ' + data.id + ':' + evt.type;
        self.trigger(type, data);
    };

    // When it gets destroyed.
    nipple.on('destroyed', self.onDestroyed.bind(self));

    // Other events that will get bubbled up.
    nipple.on('shown hidden rested dir plain', handler);
    nipple.on('dir:up dir:right dir:down dir:left', handler);
    nipple.on('plain:up plain:right plain:down plain:left', handler);
};

Collection.prototype.pressureFn = function (touch, nipple, identifier) {
    var self = this;
    var previousPressure = 0;
    clearInterval(self.pressureIntervals[identifier]);
    // Create an interval that will read the pressure every 100ms
    self.pressureIntervals[identifier] = setInterval(function () {
        var pressure = touch.force || touch.pressure ||
            touch.webkitForce || 0;
        if (pressure !== previousPressure) {
            nipple.trigger('pressure', pressure);
            self.trigger('pressure ' +
                nipple.identifier + ':pressure', pressure);
            previousPressure = pressure;
        }
    }.bind(self), 100);
};

Collection.prototype.onstart = function (evt) {
    var self = this;
    var opts = self.options;
    var origEvt = evt;
    evt = prepareEvent(evt);

    // Update the box position
    self.updateBox();

    var process = function (touch) {
        // If we can create new nipples
        // meaning we don't have more active nipples than we should.
        if (self.actives.length < opts.maxNumberOfNipples) {
            self.processOnStart(touch);
        }
        else if(origEvt.type.match(/^touch/)){
            // zombies occur when end event is not received on Safari
            // first touch removed before second touch, we need to catch up...
            // so remove where touches in manager that no longer exist
            Object.keys(self.manager.ids).forEach(function(k){
                if(Object.values(origEvt.touches).findIndex(function(t){ return t['identifier'] === k; }) < 0){
                    // manager has id that doesn't exist in touches
                    var e = [evt[0]];
                    e['identifier'] = k;
                    self.processOnEnd(e);
                }
            });
            if(self.actives.length < opts.maxNumberOfNipples){
                self.processOnStart(touch);
            }
        }
    };

    map(evt, process);

    // We ask upstream to bind the document
    // on 'move' and 'end'
    self.manager.bindDocument();
    return false;
};

Collection.prototype.processOnStart = function (evt) {
    var self = this;
    var opts = self.options;
    var indexInIdles;
    var identifier = self.manager.getIdentifier(evt);
    var pressure = evt.force || evt.pressure || evt.webkitForce || 0;
    var position = {
        x: evt.pageX,
        y: evt.pageY
    };

    var nipple = self.getOrCreate(identifier, position);

    // Update its touch identifier
    if (nipple.identifier !== identifier) {
        self.manager.removeIdentifier(nipple.identifier);
    }
    nipple.identifier = identifier;

    var process = function (nip) {
        // Trigger the start.
        nip.trigger('start', nip);
        self.trigger('start ' + nip.id + ':start', nip);

        nip.show();
        if (pressure > 0) {
            self.pressureFn(evt, nip, nip.identifier);
        }
        // Trigger the first move event.
        self.processOnMove(evt);
    };

    // Transfer it from idles to actives.
    if ((indexInIdles = self.idles.indexOf(nipple)) >= 0) {
        self.idles.splice(indexInIdles, 1);
    }

    // Store the nipple in the actives array
    self.actives.push(nipple);
    self.ids.push(nipple.identifier);

    if (opts.mode !== 'semi') {
        process(nipple);
    } else {
        // In semi we check the distance of the touch
        // to decide if we have to reset the nipple
        var distance$1 = distance(position, nipple.position);
        if (distance$1 <= opts.catchDistance) {
            process(nipple);
        } else {
            nipple.destroy();
            self.processOnStart(evt);
            return;
        }
    }

    return nipple;
};

Collection.prototype.getOrCreate = function (identifier, position) {
    var self = this;
    var opts = self.options;
    var nipple;

    // If we're in static or semi, we might already have an active.
    if (/(semi|static)/.test(opts.mode)) {
        // Get the active one.
        // TODO: Multi-touche for semi and static will start here.
        // Return the nearest one.
        nipple = self.idles[0];
        if (nipple) {
            self.idles.splice(0, 1);
            return nipple;
        }

        if (opts.mode === 'semi') {
            // If we're in semi mode, we need to create one.
            return self.createNipple(position, identifier);
        }

        // eslint-disable-next-line no-console
        console.warn('Coudln\'t find the needed nipple.');
        return false;
    }
    // In dynamic, we create a new one.
    nipple = self.createNipple(position, identifier);
    return nipple;
};

Collection.prototype.processOnMove = function (evt) {
    var self = this;
    var opts = self.options;
    var identifier = self.manager.getIdentifier(evt);
    var nipple = self.nipples.get(identifier);
    var scroll = self.manager.scroll;

    // If we're moving without pressing
    // it's that we went out the active zone
    if (!isPressed(evt)) {
        this.processOnEnd(evt);
        return;
    }

    if (!nipple) {
        // This is here just for safety.
        // It shouldn't happen.
        // eslint-disable-next-line no-console
        console.error('Found zombie joystick with ID ' + identifier);
        self.manager.removeIdentifier(identifier);
        return;
    }

    if (opts.dynamicPage) {
        var elBox = nipple.el.getBoundingClientRect();
        nipple.position = {
            x: scroll.x + elBox.left,
            y: scroll.y + elBox.top
        };
    }

    nipple.identifier = identifier;

    var size = nipple.options.size / 2;
    var pos = {
        x: evt.pageX,
        y: evt.pageY
    };

    if (opts.lockX){
        pos.y = nipple.position.y;
    }
    if (opts.lockY) {
        pos.x = nipple.position.x;
    }

    var dist = distance(pos, nipple.position);
    var angle$1 = angle(pos, nipple.position);
    var rAngle = radians(angle$1);
    var force = dist / size;

    var raw = {
        distance: dist,
        position: pos
    };

    // Clamp the position
    var clamped_dist;
    var clamped_pos;
    if (nipple.options.shape === 'circle') {
        // Clamp to a circle
        clamped_dist = Math.min(dist, size);
        clamped_pos = findCoord(nipple.position, clamped_dist, angle$1);
    } else {
        // Clamp to a square
        clamped_pos = clamp(pos, nipple.position, size);
        clamped_dist = distance(clamped_pos, nipple.position);
    }

    if (opts.follow) {
        // follow behaviour
        if (dist > size) {
            let delta_x = pos.x - clamped_pos.x;
            let delta_y = pos.y - clamped_pos.y;
            nipple.position.x += delta_x;
            nipple.position.y += delta_y;
            nipple.el.style.top = (nipple.position.y - (self.box.top + scroll.y)) + 'px';
            nipple.el.style.left = (nipple.position.x - (self.box.left + scroll.x)) + 'px';

            dist = distance(pos, nipple.position);
        }
    } else {
        // clamp behaviour
        pos = clamped_pos;
        dist = clamped_dist;
    }

    var xPosition = pos.x - nipple.position.x;
    var yPosition = pos.y - nipple.position.y;

    nipple.frontPosition = {
        x: xPosition,
        y: yPosition
    };

    if (!opts.dataOnly) {
        applyPosition(nipple.ui.front, nipple.frontPosition);
    }

    // Prepare event's datas.
    var toSend = {
        identifier: nipple.identifier,
        position: pos,
        force: force,
        pressure: evt.force || evt.pressure || evt.webkitForce || 0,
        distance: dist,
        angle: {
            radian: rAngle,
            degree: angle$1
        },
        vector: {
            x: xPosition / size,
            y: - yPosition / size
        },
        raw: raw,
        instance: nipple,
        lockX: opts.lockX,
        lockY: opts.lockY
    };

    // Compute the direction's datas.
    toSend = nipple.computeDirection(toSend);

    // Offset angles to follow units circle.
    toSend.angle = {
        radian: radians(180 - angle$1),
        degree: 180 - angle$1
    };

    // Send everything to everyone.
    nipple.trigger('move', toSend);
    self.trigger('move ' + nipple.id + ':move', toSend);
};

Collection.prototype.processOnEnd = function (evt) {
    var self = this;
    var opts = self.options;
    var identifier = self.manager.getIdentifier(evt);
    var nipple = self.nipples.get(identifier);
    var removedIdentifier = self.manager.removeIdentifier(nipple.identifier);

    if (!nipple) {
        return;
    }

    if (!opts.dataOnly) {
        nipple.hide(function () {
            if (opts.mode === 'dynamic') {
                nipple.trigger('removed', nipple);
                self.trigger('removed ' + nipple.id + ':removed', nipple);
                self.manager
                    .trigger('removed ' + nipple.id + ':removed', nipple);
                nipple.destroy();
            }
        });
    }

    // Clear the pressure interval reader
    clearInterval(self.pressureIntervals[nipple.identifier]);

    // Reset the direciton of the nipple, to be able to trigger a new direction
    // on start.
    nipple.resetDirection();

    nipple.trigger('end', nipple);
    self.trigger('end ' + nipple.id + ':end', nipple);

    // Remove identifier from our bank.
    if (self.ids.indexOf(nipple.identifier) >= 0) {
        self.ids.splice(self.ids.indexOf(nipple.identifier), 1);
    }

    // Clean our actives array.
    if (self.actives.indexOf(nipple) >= 0) {
        self.actives.splice(self.actives.indexOf(nipple), 1);
    }

    if (/(semi|static)/.test(opts.mode)) {
        // Transfer nipple from actives to idles
        // if we're in semi or static mode.
        self.idles.push(nipple);
    } else if (self.nipples.indexOf(nipple) >= 0) {
        // Only if we're not in semi or static mode
        // we can remove the instance.
        self.nipples.splice(self.nipples.indexOf(nipple), 1);
    }

    // We unbind move and end.
    self.manager.unbindDocument();

    // We add back the identifier of the idle nipple;
    if (/(semi|static)/.test(opts.mode)) {
        self.manager.ids[removedIdentifier.id] = removedIdentifier.identifier;
    }
};

// Remove destroyed nipple from the lists
Collection.prototype.onDestroyed = function(evt, nipple) {
    var self = this;
    if (self.nipples.indexOf(nipple) >= 0) {
        self.nipples.splice(self.nipples.indexOf(nipple), 1);
    }
    if (self.actives.indexOf(nipple) >= 0) {
        self.actives.splice(self.actives.indexOf(nipple), 1);
    }
    if (self.idles.indexOf(nipple) >= 0) {
        self.idles.splice(self.idles.indexOf(nipple), 1);
    }
    if (self.ids.indexOf(nipple.identifier) >= 0) {
        self.ids.splice(self.ids.indexOf(nipple.identifier), 1);
    }

    // Remove the identifier from our bank
    self.manager.removeIdentifier(nipple.identifier);

    // We unbind move and end.
    self.manager.unbindDocument();
};

// Cleanly destroy the manager
Collection.prototype.destroy = function () {
    var self = this;
    self.unbindEvt(self.options.zone, 'start');

    // Destroy nipples.
    self.nipples.forEach(function(nipple) {
        nipple.destroy();
    });

    // Clean 3DTouch intervals.
    for (var i in self.pressureIntervals) {
        if (self.pressureIntervals.hasOwnProperty(i)) {
            clearInterval(self.pressureIntervals[i]);
        }
    }

    // Notify the manager passing the instance
    self.trigger('destroyed', self.nipples);
    // We unbind move and end.
    self.manager.unbindDocument();
    // Unbind everything.
    self.off();
};

///////////////////////
///     MANAGER     ///
///////////////////////

function Manager (options) {
    var self = this;
    self.ids = {};
    self.index = 0;
    self.collections = [];
    self.scroll = getScroll();

    self.config(options);
    self.prepareCollections();

    // Listen for resize, to reposition every joysticks
    var resizeHandler = function () {
        var pos;
        self.collections.forEach(function (collection) {
            collection.forEach(function (nipple) {
                pos = nipple.el.getBoundingClientRect();
                nipple.position = {
                    x: self.scroll.x + pos.left,
                    y: self.scroll.y + pos.top
                };
            });
        });
    };
    bindEvt(window, 'resize', function () {
        throttle(resizeHandler);
    });

    // Listen for scrolls, so we have a global scroll value
    // without having to request it all the time.
    var scrollHandler = function () {
        self.scroll = getScroll();
    };
    bindEvt(window, 'scroll', function () {
        throttle(scrollHandler);
    });

    return self.collections;
}

Manager.prototype = new Super();
Manager.constructor = Manager;

Manager.prototype.prepareCollections = function () {
    var self = this;
    // Public API Preparation.
    self.collections.create = self.create.bind(self);
    // Listen to anything
    self.collections.on = self.on.bind(self);
    // Unbind general events
    self.collections.off = self.off.bind(self);
    // Destroy everything
    self.collections.destroy = self.destroy.bind(self);
    // Get any nipple
    self.collections.get = function (id) {
        var nipple;
        // Use .every() to break the loop as soon as found.
        self.collections.every(function (collection) {
            nipple = collection.get(id);
            return nipple ? false : true;
        });
        return nipple;
    };
};

Manager.prototype.create = function (options) {
    return this.createCollection(options);
};

// Collection Factory
Manager.prototype.createCollection = function (options) {
    var self = this;
    /* @ts-ignore */
    var collection = new Collection(self, options);

    self.bindCollection(collection);
    self.collections.push(collection);

    return collection;
};

Manager.prototype.bindCollection = function (collection) {
    var self = this;
    var type;
    // Bubble up identified events.
    var handler = function (evt, data) {
        // Identify the event type with the nipple's identifier.
        type = evt.type + ' ' + data.id + ':' + evt.type;
        self.trigger(type, data);
    };

    // When it gets destroyed we clean.
    collection.on('destroyed', self.onDestroyed.bind(self));

    // Other events that will get bubbled up.
    collection.on('shown hidden rested dir plain', handler);
    collection.on('dir:up dir:right dir:down dir:left', handler);
    collection.on('plain:up plain:right plain:down plain:left', handler);
};

Manager.prototype.bindDocument = function () {
    var self = this;
    // Bind only if not already binded
    if (!self.binded) {
        self.bindEvt(document, 'move')
            .bindEvt(document, 'end');
        self.binded = true;
    }
};

Manager.prototype.unbindDocument = function (force) {
    var self = this;
    // If there are no touch left
    // unbind the document.
    if (!Object.keys(self.ids).length || force === true) {
        self.unbindEvt(document, 'move')
            .unbindEvt(document, 'end');
        self.binded = false;
    }
};

Manager.prototype.getIdentifier = function (evt) {
    var id;
    // If no event, simple increment
    if (!evt) {
        id = this.index;
    } else {
        // Extract identifier from event object.
        // Unavailable in mouse events so replaced by latest increment.
        id = evt.identifier === undefined ? evt.pointerId : evt.identifier;
        if (id === undefined) {
            id = this.latest || 0;
        }
    }

    if (this.ids[id] === undefined) {
        this.ids[id] = this.index;
        this.index += 1;
    }

    // Keep the latest id used in case we're using an unidentified mouseEvent
    this.latest = id;
    return this.ids[id];
};

Manager.prototype.removeIdentifier = function (identifier) {
    var removed = {};
    for (var id in this.ids) {
        if (this.ids[id] === identifier) {
            removed['id'] = id;
            removed['identifier'] = this.ids[id];
            delete this.ids[id];
            break;
        }
    }
    return removed;
};

Manager.prototype.onmove = function (evt) {
    var self = this;
    self.onAny('move', evt);
    return false;
};

Manager.prototype.onend = function (evt) {
    var self = this;
    self.onAny('end', evt);
    return false;
};

Manager.prototype.oncancel = function (evt) {
    var self = this;
    self.onAny('end', evt);
    return false;
};

Manager.prototype.onAny = function (which, evt) {
    var self = this;
    var id;
    var processFn = 'processOn' + which.charAt(0).toUpperCase() +
        which.slice(1);
    evt = prepareEvent(evt);
    var processColl = function (e, id, coll) {
        if (coll.ids.indexOf(id) >= 0) {
            coll[processFn](e);
            // Mark the event to avoid cleaning it later.
            e._found_ = true;
        }
    };
    var processEvt = function (e) {
        id = self.getIdentifier(e);
        map(self.collections, processColl.bind(null, e, id));
        // If the event isn't handled by any collection,
        // we need to clean its identifier.
        if (!e._found_) {
            self.removeIdentifier(id);
        }
    };

    map(evt, processEvt);

    return false;
};

// Cleanly destroy the manager
Manager.prototype.destroy = function () {
    var self = this;
    self.unbindDocument(true);
    self.ids = {};
    self.index = 0;
    self.collections.forEach(function(collection) {
        collection.destroy();
    });
    self.off();
};

// When a collection gets destroyed
// we clean behind.
Manager.prototype.onDestroyed = function (evt, coll) {
    var self = this;
    if (self.collections.indexOf(coll) < 0) {
        return false;
    }
    self.collections.splice(self.collections.indexOf(coll), 1);
};

/* @ts-ignore */
const factory = new Manager();
var nipplejs = {
    create: function (options) {
        return factory.create(options);
    },
    factory: factory
};

let joyManagers = [];
const NIPPLEJS_LEFT_OPTIONS = {
    zone: document.getElementById("joystickWrapper1"),
    size: 120,
    multitouch: true,
    maxNumberOfNipples: 2,
    mode: "static",
    restJoystick: true,
    shape: "circle",
    position: {
        top: "60px",
        left: "60px"
    },
    dynamicPage: true,
};
const NIPPLEJS_RIGHT_OPTIONS = {
  ...NIPPLEJS_LEFT_OPTIONS,
  zone: document.getElementById("joystickWrapper2"),
  position: {
      top: "60px",
      right: "60px"
  },
};

export interface ITouchControlsProps {
  enableJoysticks?: boolean,
  enableKeyboard?: boolean,
  orbitProps?: OrbitControlsProps,
  camProps?: any,
  mult?: number,
};

const defaultTouchControlsProps = {
  enableJoysticks: true,
  enableKeyboard: true,
  orbitProps: {},
  camProps: {},
  mult: 0.1,
};

const TouchControls = (props: ITouchControlsProps) => {
  const orbitRef = useRef(undefined);
  const camRef = useRef(undefined);
  const meshRef = useRef(undefined);

  const [fwdValue, setFwdValue] = useState(0);
  const [bkdValue, setBkdValue] = useState(0);
  const [rgtValue, setRgtValue] = useState(0);
  const [lftValue, setLftValue] = useState(0);
  const [lookXValue, setLookXValue] = useState(0);
  const [lookYValue, setLookYValue] = useState(0);

  const tempVector = useMemo(() => new Vector3(), []);
  const upVector = useMemo(() => new Vector3(0, 1, 0), []);
  const lookVector = useMemo(() => new Vector3(0, 1, 0), []);

  const handleMove = (evt, data) => {
    let forward = data.vector.y;
    let turn = data.vector.x;
    if (forward > 0) {
      setFwdValue(Math.abs(forward));
      setBkdValue(0);
    } else if (forward < 0) {
      setFwdValue(0);
      setBkdValue(Math.abs(forward));
    }
    if (turn > 0) {
      setLftValue(0);
      setRgtValue(Math.abs(turn));
    } else if (turn < 0) {
      setLftValue(Math.abs(turn));
      setRgtValue(0);
    }
  };
  
  const handleLook = (evt, data) => {
    setLookXValue(lookXValue + data.vector.x);
    setLookYValue(data.vector.y);
  };

  const useKeyboard = () => {
    const onKeyDown = (event) => {
      switch(event.code) {
        case "ArrowUp":
        case "KeyW":
          handleMove({}, { vector: { y: 1 } });
          break;
        case "ArrowLeft":
        case "KeyA":
          handleMove({}, { vector: { x: -1 } });
          break;
        case "ArrowDown":
        case "KeyS":
          handleMove({}, { vector: { y: -1 } });
          break;
        case "ArrowRight":
        case "KeyD":
          handleMove({}, { vector: { x: 1 } });
          break;
      }
    };
  
    const onKeyUp = (event) => {
      switch(event.code) {
        case "ArrowUp":
        case "KeyW":
          setFwdValue(0);
          break;
        case "ArrowLeft":
        case "KeyA":
          setLftValue(0);
          break;
        case "ArrowDown":
        case "KeyS":
          setBkdValue(0);
          break;
        case "ArrowRight":
        case "KeyD":
          setRgtValue(0);
          break;
      }
    };
  
    useEffect(() => {
      if (props.enableKeyboard) {
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
      }
      
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }, []);
  };

  const useJoystick = () => {
    const handleMoveEnd = () => {
      setBkdValue(0);
      setFwdValue(0);
      setLftValue(0);
      setRgtValue(0);
    };
      
    const handleLookEnd = () => {
      setLookXValue(0);
      setLookYValue(0);
    };

    useEffect(() => {
      if (!joyManagers.length && props.enableJoysticks) {
        // @ts-ignore
        joyManagers.push(nipplejs.create(NIPPLEJS_LEFT_OPTIONS));
        joyManagers[0].on("move", handleMove);
        joyManagers[0].on("end", handleMoveEnd);
        joyManagers.push(nipplejs.create(NIPPLEJS_RIGHT_OPTIONS));
        joyManagers[1].on("move", handleLook);
        joyManagers[1].on("end", handleLookEnd);
      }
      
      return () => {
        if (joyManagers.length) {
          joyManagers[0].off("move", handleMove);
          joyManagers[0].off("end", handleMoveEnd);
          joyManagers[1].off("move", handleLook);
          joyManagers[1].off("end", handleLookEnd);
        }
      };
    }, []);
  };

  const updatePlayer = useCallback(() => {
    let mesh = meshRef.current;
    let controls = orbitRef.current;
    let camera = camRef.current;
    // move the player
    let angle = controls.getAzimuthalAngle();
    
    if (fwdValue > 0) {
      tempVector.set(0, 0, -fwdValue).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    if (bkdValue > 0) {
      tempVector.set(0, 0, bkdValue).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    if (lftValue > 0) {
      tempVector.set(-lftValue, 0, 0).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    if (rgtValue > 0) {
      tempVector.set(rgtValue, 0, 0).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    mesh.updateMatrixWorld();
    // reposition camera
    camera.position.sub(controls.target);
    controls.target.copy(mesh.position);
    camera.position.add(mesh.position);

    /*if (camera.rotation.x >= 1 && -lookYValue > 0) {
      camera.rotation.x = 1;
    } else if (camera.rotation.x <= -1 && -lookYValue < 0) {
      camera.rotation.x = -1;
    } else {*/
      camera.rotateX(lookYValue);
    //}
    camera.rotateOnWorldAxis(lookVector, -lookXValue);
  }, [fwdValue, bkdValue, lftValue, rgtValue, lookYValue, lookVector, lookXValue, tempVector, upVector, props.mult]);
  
  useFrame(() => updatePlayer());
    
  useJoystick();
  useKeyboard();

  return (
    <React.Fragment>
      <PerspectiveCamera rotationOrder="YXZ" {...props.camProps} ref={camRef} />
      <OrbitControls
        autoRotate={false}
        enableDamping={false}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotateSpeed={0}
        rotateSpeed={0}
        dampingFactor={0}
        {...props.orbitProps}
        ref={orbitRef} />
      <mesh position={props.orbitProps.target || [0,0,0]} visible={false} ref={meshRef}>
        <boxGeometry args={[1,1,1]}>
          <meshStandardMaterial color="white" />
        </boxGeometry>
      </mesh>
    </React.Fragment>
  );
};

TouchControls.defaultProps = defaultTouchControlsProps;

export default TouchControls;