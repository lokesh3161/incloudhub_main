/**
 * MEDHAS — THE LIVING KNOWLEDGE INTERFACE & RAY TARGETING SYSTEM
 * ------------------------------------------------------------------------
 * A full-screen living digital knowledge ecosystem where the entire ray system
 * dynamically redirects, bends, and targets the active form fields in real-time.
 *
 * Core Capabilities:
 * - Normal/Idle State: Living knowledge rays originate at Medhas Core and flow through space.
 * - Form Field Focus: The EXISTING RAYS smoothly curve and redirect directly toward the active field.
 * - Field Transition (Tab/Shift+Tab): Rays smoothly retarget and sweep continuously across to the new field.
 * - Multi-Point Field Targeting: Rays terminate across the field's perimeter/width.
 * - Department Selection: Network reconfiguration and core harmonic pulse.
 * - Button Hover & Submission: Grand convergence into button & glyph.
 * ------------------------------------------------------------------------
 */
(function (global) {
  "use strict";

  const DEFAULTS = {
    container: null,
    streamCount: 14,
    maxDPR: 2,
    accentColor: "#F78C25",
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function cubicBezierPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    return {
      x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
      y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
    };
  }

  class MedhasInteractiveEngine {
    constructor(options) {
      this.opts = Object.assign({}, DEFAULTS, options);
      this.container = this.opts.container || document.body;

      this._destroyed = false;
      this._rafId = null;
      this._resizeObserver = null;
      this._lastTime = performance.now();
      this._time = 0;

      // Interaction & Ray Target State Model
      this.state = {
        activeField: null,
        previousField: null,
        department: null,
        phase: "idle", // 'idle' | 'name-active' | 'regno-active' | 'branch-active' | 'dept-selected' | 'ready' | 'submitting' | 'error'
        isReady: false,
      };

      // Active Target Descriptor
      this._currentTarget = null; // { element, type, rect, arrivalTimer: 0 }
      this._previousTarget = null;
      this._targetInfluence = 0.0; // 0.0 (fully idle) -> 1.0 (fully targeted)

      // Visual & Interactive Elements
      this._fieldRadiations = [];
      this._typingPackets = [];
      this._buttonConduit = null;
      this._errorWaves = [];
      this._isTransitioning = false;
      this._reconfigEnergy = 0;

      // Pointer tracking
      this._pointer = { x: -9999, y: -9999, active: false };

      this._prefersReducedMotion =
        global.matchMedia &&
        global.matchMedia("(prefers-reduced-motion: reduce)").matches;

      this._buildDom();
      this._initKnowledgeStreams();
      this._initAmbientDust();
      this._bindEvents();

      if (this._prefersReducedMotion) {
        this._renderStatic();
      } else {
        this._rafId = requestAnimationFrame(this._tick.bind(this));
      }
    }

    /* ---------------------------------------------------------------- */
    /* DOM & Full-Screen Canvas Setup                                   */
    /* ---------------------------------------------------------------- */

    _buildDom() {
      let canvas = this.container.querySelector(".medhas-knowledge-canvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.className = "medhas-knowledge-canvas";
        canvas.setAttribute("aria-hidden", "true");
        this.container.prepend(canvas);
      }

      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");

      this._resize();
      if (typeof ResizeObserver !== "undefined") {
        this._resizeObserver = new ResizeObserver(() => this._resize());
        this._resizeObserver.observe(document.body);
      } else {
        this._onResize = () => this._resize();
        global.addEventListener("resize", this._onResize);
      }
    }

    _resize() {
      this.width = Math.max(300, window.innerWidth);
      this.height = Math.max(400, window.innerHeight);

      const dpr = Math.min(global.devicePixelRatio || 1, this.opts.maxDPR);
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = this.width < 768;
      this.isMobile = isMobile;

      if (isMobile) {
        this.glyphX = this.width * 0.5;
        this.glyphY = Math.min(220, this.height * 0.19);
        this.glyphSize = 34;
      } else if (this.width < 1024) {
        this.glyphX = this.width * 0.65;
        this.glyphY = this.height * 0.44;
        this.glyphSize = 44;
      } else {
        this.glyphX = this.width * 0.68;
        this.glyphY = this.height * 0.46;
        this.glyphSize = 54;
      }

      this._initKnowledgeStreams();
    }

    /* ---------------------------------------------------------------- */
    /* Living Knowledge Rays Initializer                                */
    /* ---------------------------------------------------------------- */

    _initKnowledgeStreams() {
      this.streams = [];
      const isMobile = this.isMobile;
      const count = isMobile ? 8 : this.opts.streamCount;
      const gx = this.glyphX;
      const gy = this.glyphY;

      for (let i = 0; i < count; i++) {
        const baseAngle = (i / count) * Math.PI * 2 + 0.15;
        const dist = Math.max(this.width, this.height) * (0.75 + 0.35 * (i % 3));

        // Idle endpoints radiating outward naturally
        let idleEndX, idleEndY;
        if (i < 4 && !isMobile) {
          idleEndX = -60 + (i * 45);
          idleEndY = (this.height * (i + 1)) / 5 + (Math.random() - 0.5) * 60;
        } else {
          idleEndX = gx + Math.cos(baseAngle) * dist;
          idleEndY = gy + Math.sin(baseAngle) * dist;
        }

        const ctrl1Angle = baseAngle + (i % 2 === 0 ? 0.6 : -0.6);
        const ctrl1Dist = dist * 0.38;
        const idleCtrl1X = lerp(gx, idleEndX, 0.35) + Math.cos(ctrl1Angle) * 70;
        const idleCtrl1Y = lerp(gy, idleEndY, 0.35) + Math.sin(ctrl1Angle) * 70;

        const ctrl2Angle = baseAngle + (i % 2 === 0 ? -0.35 : 0.35);
        const idleCtrl2X = lerp(gx, idleEndX, 0.72) + Math.cos(ctrl2Angle) * 45;
        const idleCtrl2Y = lerp(gy, idleEndY, 0.72) + Math.sin(ctrl2Angle) * 45;

        const stream = {
          id: i,
          baseAngle,
          p0: { x: gx, y: gy },
          p1: { x: idleCtrl1X, y: idleCtrl1Y },
          p2: { x: idleCtrl2X, y: idleCtrl2Y },
          p3: { x: idleEndX, y: idleEndY },
          idleP1: { x: idleCtrl1X, y: idleCtrl1Y, baseX: idleCtrl1X, baseY: idleCtrl1Y },
          idleP2: { x: idleCtrl2X, y: idleCtrl2Y, baseX: idleCtrl2X, baseY: idleCtrl2Y },
          idleP3: { x: idleEndX, y: idleEndY, baseX: idleEndX, baseY: idleEndY },
          targetRatio: i / (count - 1),
          speed: 0.12 + (i % 4) * 0.035,
          lineWidth: 1.0 + (i % 3) * 0.4,
          isPrimary: i < 4,
          arrivalFlash: 0,
          packets: [],
        };

        const packetCount = isMobile ? 2 : (i < 4 ? 4 : 3);
        for (let j = 0; j < packetCount; j++) {
          stream.packets.push({
            u: j / packetCount + Math.random() * 0.15,
            speed: 0.75 + Math.random() * 0.45,
            size: 2.2 + (i % 2 === 0 ? 0.8 : 0),
            trail: [],
          });
        }

        this.streams.push(stream);
      }
    }

    _initAmbientDust() {
      this.ambientNodes = [];
      const count = this.isMobile ? 14 : 28;
      for (let i = 0; i < count; i++) {
        this.ambientNodes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: 1.0 + Math.random() * 1.4,
          alpha: 0.12 + Math.random() * 0.35,
        });
      }
    }

    /* ---------------------------------------------------------------- */
    /* Event Bindings                                                   */
    /* ---------------------------------------------------------------- */

    _bindEvents() {
      this._onMouseMove = (e) => {
        this._pointer.x = e.clientX;
        this._pointer.y = e.clientY;
        this._pointer.active = true;
      };

      this._onMouseLeave = () => {
        this._pointer.active = false;
      };

      global.addEventListener("mousemove", this._onMouseMove, { passive: true });
      document.addEventListener("mouseleave", this._onMouseLeave, { passive: true });

      this._onVisibility = () => {
        if (document.hidden) {
          this._paused = true;
        } else {
          this._paused = false;
          this._lastTime = performance.now();
          if (!this._prefersReducedMotion && this._rafId == null) {
            this._rafId = requestAnimationFrame(this._tick.bind(this));
          }
        }
      };
      document.addEventListener("visibilitychange", this._onVisibility);
    }

    /* ---------------------------------------------------------------- */
    /* PUBLIC RAY TARGETING & INTERACTION API                           */
    /* ---------------------------------------------------------------- */

    /**
     * Primary Ray Targeting Method:
     * Focuses the living ray system directly onto any DOM element.
     * The rays dynamically bend, re-route, and smoothly converge across the element's perimeter.
     */
    setTarget(elementOrOptions, typeName) {
      let el = null;
      let type = typeName || 'field';

      if (elementOrOptions && elementOrOptions.nodeType) {
        el = elementOrOptions;
      } else if (elementOrOptions && typeof elementOrOptions === 'object') {
        el = elementOrOptions.element || null;
        type = elementOrOptions.type || typeName || 'field';
      } else if (typeof elementOrOptions === 'string') {
        type = elementOrOptions;
        el = document.getElementById(elementOrOptions) || document.querySelector(elementOrOptions);
      }

      if (!el) {
        this.clearTarget();
        return;
      }

      const rect = el.getBoundingClientRect();
      const prev = this._currentTarget;
      this._previousTarget = prev ? Object.assign({}, prev) : null;

      this._currentTarget = {
        element: el,
        type: type,
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        arrivalTimer: 0.0,
      };

      this.state.previousField = this.state.activeField;
      this.state.activeField = type;
      this.state.phase = `${type}-active`;

      // Trigger field arrival radiation wave & boost ray packets
      this._fieldRadiations.push({
        x: rect.left + rect.width * 0.5,
        y: rect.top + rect.height * 0.5,
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        r: 6,
        maxR: Math.max(rect.width * 0.65, 80),
        alpha: 0.9,
        speed: 2.4,
        duration: 0.75,
        elapsed: 0,
      });

      if (this.streams) {
        this.streams.forEach((s) => {
          s.arrivalFlash = 1.0;
          s.packets.forEach((p) => (p.speed = 1.6));
        });
      }
    }

    setInteractionTarget(element) {
      this.setTarget(element);
    }

    transitionTo(element, type) {
      this.setTarget(element, type);
    }

    /**
     * Releases active ray targeting, letting rays smoothly return to their natural idle flow
     */
    clearTarget() {
      this._previousTarget = this._currentTarget;
      this._currentTarget = null;
      this.state.previousField = this.state.activeField;
      this.state.activeField = null;
      this.state.phase = "idle";
    }

    activateField(fieldName, elementRect) {
      const el = document.getElementById(fieldName);
      if (el) {
        this.setTarget(el, fieldName);
      } else if (elementRect) {
        this._currentTarget = {
          element: null,
          type: fieldName,
          rect: {
            left: elementRect.left,
            top: elementRect.top,
            width: elementRect.width,
            height: elementRect.height,
          },
          arrivalTimer: 0.0,
        };
        this.state.previousField = this.state.activeField;
        this.state.activeField = fieldName;
        this.state.phase = `${fieldName}-active`;

        this._fieldRadiations.push({
          x: elementRect.left + elementRect.width * 0.5,
          y: elementRect.top + elementRect.height * 0.5,
          rect: elementRect,
          r: 6,
          maxR: Math.max(elementRect.width * 0.65, 80),
          alpha: 0.9,
          speed: 2.4,
          duration: 0.75,
          elapsed: 0,
        });
      }
    }

    navigateField(fromField, toField, fromRect, toRect, direction = "forward") {
      const el = document.getElementById(toField);
      if (el) {
        this.setTarget(el, toField);
      } else {
        this.activateField(toField, toRect);
      }
    }

    onFieldTyping(fieldName, elementRect) {
      if (!elementRect && this._currentTarget) {
        elementRect = this._currentTarget.rect;
      }
      if (!elementRect) return;
      if (this._typingPackets.length > 5) return;

      const startX = elementRect.right - 20;
      const startY = elementRect.top + elementRect.height * 0.5 + (Math.random() - 0.5) * 10;
      const targetX = this.glyphX;
      const targetY = this.glyphY;

      this._typingPackets.push({
        p0: { x: startX, y: startY },
        p1: { x: startX + 60, y: startY - 20 },
        p2: { x: lerp(startX, targetX, 0.6), y: targetY + 30 },
        p3: { x: targetX, y: targetY },
        progress: 0,
        speed: 2.0 + Math.random() * 0.6,
        size: 2.0,
      });
    }

    setDepartment(branchValue, elementRect) {
      this.state.department = branchValue;
      this.state.phase = "dept-selected";
      this._reconfigEnergy = 1.0;

      if (this.streams) {
        this.streams.forEach((s, idx) => {
          s.speed = 0.16 + ((idx + 1) % 3) * 0.05;
          s.arrivalFlash = 1.0;
          s.packets.forEach((p) => (p.speed = 2.2));
        });
      }

      const branchEl = document.getElementById('branch');
      if (branchEl) {
        this.setTarget(branchEl, 'branch');
      } else if (elementRect) {
        this.activateField('branch', elementRect);
      }
    }

    setReady(isReady) {
      this.state.isReady = isReady;
      if (isReady && this.state.phase !== "submitting" && this.state.phase !== "success") {
        this.state.phase = "ready";
      }
    }

    triggerButtonHover(btnRect) {
      const btn = document.getElementById('loginBtn');
      if (btn) {
        this.setTarget(btn, 'button');
      } else if (btnRect) {
        this.activateField('button', btnRect);
      }
    }

    triggerError(fieldName, elementRect) {
      this.state.phase = "error";
      const targetRect = elementRect || (this._currentTarget ? this._currentTarget.rect : null);
      if (targetRect) {
        const cx = targetRect.left + targetRect.width * 0.5;
        const cy = targetRect.top + targetRect.height * 0.5;

        this._errorWaves.push({
          x: cx,
          y: cy,
          r: 6,
          maxR: targetRect.width * 0.7,
          alpha: 0.95,
          speed: 3.6,
        });
      }
    }

    triggerLoginTransition(onComplete) {
      this._isTransitioning = true;
      this.state.phase = "success";

      if (this.streams) {
        this.streams.forEach((s) => {
          s.speed *= 3.2;
          s.packets.forEach((p) => (p.speed *= 2.6));
        });
      }

      setTimeout(() => {
        if (typeof onComplete === "function") {
          onComplete();
        }
      }, 850);
    }

    /* ---------------------------------------------------------------- */
    /* Render & Animation Loop (60 FPS)                                 */
    /* ---------------------------------------------------------------- */

    _tick(now) {
      if (this._destroyed) return;
      if (this._paused) {
        this._rafId = null;
        return;
      }

      const dt = Math.min((now - this._lastTime) / 1000, 0.1);
      this._lastTime = now;
      this._time += dt;

      this._update(dt);
      this._draw();

      this._rafId = requestAnimationFrame(this._tick.bind(this));
    }

    _update(dt) {
      const t = this._time;

      // Harmonic Reconfiguration decay
      if (this._reconfigEnergy > 0) {
        this._reconfigEnergy = Math.max(0, this._reconfigEnergy - dt * 1.2);
      }

      // Smooth target influence lerp (0 when idle, 1 when field is focused)
      const desiredInfluence = this._currentTarget ? 1.0 : 0.0;
      this._targetInfluence = lerp(this._targetInfluence, desiredInfluence, dt * 5.0);

      // Refresh dynamic target rect from active DOM element if available
      if (this._currentTarget && this._currentTarget.element) {
        const r = this._currentTarget.element.getBoundingClientRect();
        this._currentTarget.rect = {
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        };
        this._currentTarget.arrivalTimer += dt;
      }

      // 22-second natural breathing convergence cycle
      const cyclePeriod = 22.0;
      this._cyclePhase = (t % cyclePeriod) / cyclePeriod;

      let eventWeight = 0;
      if (this._cyclePhase >= 0.45 && this._cyclePhase <= 0.82) {
        const sub = (this._cyclePhase - 0.45) / 0.37;
        eventWeight = Math.sin(sub * Math.PI);
      }
      this._eventWeight = eventWeight;

      // Update ambient nodes
      for (const node of this.ambientNodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = this.width;
        if (node.x > this.width) node.x = 0;
        if (node.y < 0) node.y = this.height;
        if (node.y > this.height) node.y = 0;
      }

      // ================================================================
      // RAY TARGETING PHYSICS & DYNAMIC BEZIER INTERPOLATION
      // ================================================================
      const gx = this.glyphX;
      const gy = this.glyphY;
      const count = this.streams.length;
      const globalSpeedBoost =
        1.0 +
        eventWeight * 0.8 +
        this._reconfigEnergy * 1.2 +
        (this._isTransitioning ? 3.0 : 0);

      for (let i = 0; i < count; i++) {
        const stream = this.streams[i];

        // Decay arrival flash
        if (stream.arrivalFlash > 0) {
          stream.arrivalFlash = Math.max(0, stream.arrivalFlash - dt * 2.2);
        }

        // 1. Natural idle floating endpoints and control points
        const sway1 = Math.sin(t * 0.45 + stream.id * 1.1) * 24;
        const sway2 = Math.cos(t * 0.38 + stream.id * 0.9) * 24;
        const naturalP1X = stream.idleP1.baseX + sway1;
        const naturalP1Y = stream.idleP1.baseY + sway2;
        const naturalP2X = stream.idleP2.baseX - sway2 * 0.7;
        const naturalP2Y = stream.idleP2.baseY + sway1 * 0.7;
        const naturalP3X = stream.idleP3.baseX + Math.sin(t * 0.3 + stream.id) * 15;
        const naturalP3Y = stream.idleP3.baseY + Math.cos(t * 0.3 + stream.id) * 15;

        let desiredP0 = { x: gx, y: gy };
        let desiredP1 = { x: naturalP1X, y: naturalP1Y };
        let desiredP2 = { x: naturalP2X, y: naturalP2Y };
        let desiredP3 = { x: naturalP3X, y: naturalP3Y };

        // 2. Compute Target Convergence if target is active
        if (this._currentTarget && this._currentTarget.rect) {
          const rect = this._currentTarget.rect;
          const ratio = stream.targetRatio;

          // Target point distributed across element's perimeter / width
          const targetX = rect.left + (0.04 + 0.92 * ratio) * rect.width;
          const targetY = rect.top + rect.height * (0.2 + 0.6 * ((i % 3) / 2));

          const dx = targetX - gx;
          const dy = targetY - gy;
          const dist = Math.hypot(dx, dy);
          const baseRayAngle = Math.atan2(dy, dx);

          // Organic Bézier arc & fan-out so rays bend naturally instead of straight lines
          const bowFactor = ((i - count * 0.5) / (count * 0.5)) * 0.48;
          const arcAngle1 = baseRayAngle + bowFactor;
          const arcDist1 = dist * (0.34 + (i % 3) * 0.05);

          const targetedP1X = gx + Math.cos(arcAngle1) * arcDist1 + Math.sin(t * 0.5 + i) * 16;
          const targetedP1Y = gy + Math.sin(arcAngle1) * arcDist1 + Math.cos(t * 0.4 + i) * 16;

          const arcDist2 = dist * (0.72 + (i % 2) * 0.04);
          const targetedP2X = gx + Math.cos(baseRayAngle + bowFactor * 0.4) * arcDist2 + Math.cos(t * 0.6 + i) * 12;
          const targetedP2Y = gy + Math.sin(baseRayAngle + bowFactor * 0.4) * arcDist2 + Math.sin(t * 0.5 + i) * 12;

          // Blend natural idle with targeted endpoints
          const infl = this._targetInfluence;
          desiredP0 = { x: gx, y: gy };
          desiredP1 = { x: lerp(naturalP1X, targetedP1X, infl), y: lerp(naturalP1Y, targetedP1Y, infl) };
          desiredP2 = { x: lerp(naturalP2X, targetedP2X, infl), y: lerp(naturalP2Y, targetedP2Y, infl) };
          desiredP3 = { x: lerp(naturalP3X, targetX, infl), y: lerp(naturalP3Y, targetY, infl) };
        }

        // 3. Smooth Physical Interpolation (Staggered per-ray easing for natural fluid motion)
        const lerpSpeed = dt * (4.2 + (i % 4) * 0.8);
        stream.p0.x = lerp(stream.p0.x, desiredP0.x, lerpSpeed);
        stream.p0.y = lerp(stream.p0.y, desiredP0.y, lerpSpeed);

        stream.p1.x = lerp(stream.p1.x, desiredP1.x, lerpSpeed);
        stream.p1.y = lerp(stream.p1.y, desiredP1.y, lerpSpeed);

        stream.p2.x = lerp(stream.p2.x, desiredP2.x, lerpSpeed);
        stream.p2.y = lerp(stream.p2.y, desiredP2.y, lerpSpeed);

        stream.p3.x = lerp(stream.p3.x, desiredP3.x, lerpSpeed);
        stream.p3.y = lerp(stream.p3.y, desiredP3.y, lerpSpeed);

        // 4. Update Photons / Packets Flowing Along the Ray
        for (const pkt of stream.packets) {
          const step =
            dt *
            stream.speed *
            pkt.speed *
            globalSpeedBoost *
            0.18;
          pkt.u += step;

          if (pkt.u > 1.0) pkt.u = 0.0;
          if (pkt.u < 0.0) pkt.u = 1.0;

          const pt = cubicBezierPoint(stream.p0, stream.p1, stream.p2, stream.p3, pkt.u);
          pkt.trail.unshift(pt);
          if (pkt.trail.length > 5) pkt.trail.pop();
        }
      }

      // Update Field Radiations
      for (let i = this._fieldRadiations.length - 1; i >= 0; i--) {
        const rad = this._fieldRadiations[i];
        rad.r += rad.speed;
        rad.elapsed += dt;
        rad.alpha = Math.max(0, 0.9 * (1 - rad.elapsed / rad.duration));
        if (rad.elapsed >= rad.duration || rad.r >= rad.maxR) {
          this._fieldRadiations.splice(i, 1);
        }
      }

      // Update Typing Micro-Packets
      for (let i = this._typingPackets.length - 1; i >= 0; i--) {
        const tp = this._typingPackets[i];
        tp.progress += dt * tp.speed;
        if (tp.progress >= 1.0) {
          this._typingPackets.splice(i, 1);
        }
      }

      // Update Error Waves
      for (let i = this._errorWaves.length - 1; i >= 0; i--) {
        const ew = this._errorWaves[i];
        ew.r += ew.speed;
        ew.alpha -= dt * 1.8;
        if (ew.alpha <= 0 || ew.r >= ew.maxR) {
          this._errorWaves.splice(i, 1);
        }
      }
    }

    _draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // 1. Atmospheric depth & ambient lighting
      this._drawAtmosphere(ctx);

      // 2. Ambient background dust
      this._drawAmbientDust(ctx);

      // 3. The Target-Aware Knowledge Rays & Flowing Photons
      this._drawTargetedRays(ctx);

      // 4. Field Arrival Radiations & Active Borders
      this._drawFieldRadiations(ctx);

      // 5. Typing micro-packets
      this._drawTypingPackets(ctx);

      // 6. Error turbulence waves (if any)
      this._drawErrorWaves(ctx);

      // 7. Central Transformative MEDHAS Glyph & Branding
      this._drawMedhasGlyph(ctx);
    }

    /* ---------------------------------------------------------------- */
    /* Layer 1: Atmospheric Depth & Ambient Fields                      */
    /* ---------------------------------------------------------------- */

    _drawAtmosphere(ctx) {
      const t = this._time;
      const gx = this.glyphX;
      const gy = this.glyphY;
      const breathe = Math.sin(t * 0.25) * 0.04;
      const eventGlow =
        this._eventWeight * 0.18 +
        this._reconfigEnergy * 0.22 +
        (this._isTransitioning ? 0.35 : 0);

      const rad1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, this.width * 0.55);
      const alphaGlow = 0.14 + breathe + eventGlow + (this.state.isReady ? 0.08 : 0);
      rad1.addColorStop(0, `rgba(247, 140, 37, ${alphaGlow})`);
      rad1.addColorStop(0.38, `rgba(247, 140, 37, ${alphaGlow * 0.28})`);
      rad1.addColorStop(0.8, "rgba(11, 13, 17, 0.02)");
      rad1.addColorStop(1, "rgba(11, 13, 17, 0)");

      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, this.width, this.height);

      const rad2 = ctx.createRadialGradient(
        this.width * 0.15,
        this.height * 0.5,
        0,
        this.width * 0.15,
        this.height * 0.5,
        this.width * 0.45
      );
      rad2.addColorStop(0, "rgba(70, 95, 140, 0.06)");
      rad2.addColorStop(1, "rgba(11, 13, 17, 0)");
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    _drawAmbientDust(ctx) {
      for (const node of this.ambientNodes) {
        ctx.fillStyle = `rgba(220, 230, 245, ${node.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* ---------------------------------------------------------------- */
    /* Layer 2: Living Rays with Dynamic Target Convergence             */
    /* ---------------------------------------------------------------- */

    _drawTargetedRays(ctx) {
      const isTargeted = this._targetInfluence > 0.05;

      for (const stream of this.streams) {
        ctx.beginPath();
        ctx.moveTo(stream.p0.x, stream.p0.y);
        ctx.bezierCurveTo(
          stream.p1.x,
          stream.p1.y,
          stream.p2.x,
          stream.p2.y,
          stream.p3.x,
          stream.p3.y
        );

        const grad = ctx.createLinearGradient(
          stream.p0.x,
          stream.p0.y,
          stream.p3.x,
          stream.p3.y
        );

        const baseAlpha = stream.isPrimary ? 0.32 : 0.18;
        const targetGlow = this._targetInfluence * 0.35 + stream.arrivalFlash * 0.4;
        
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.45 + targetGlow * 0.4})`);
        grad.addColorStop(0.35, `rgba(247, 140, 37, ${baseAlpha + targetGlow * 0.5})`);
        grad.addColorStop(0.75, `rgba(247, 140, 37, ${0.4 + targetGlow * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${0.7 + targetGlow * 0.3})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = stream.lineWidth + (isTargeted ? 0.6 : 0) + stream.arrivalFlash * 1.2;
        ctx.stroke();

        // Flowing Ray Energy Photons
        for (const pkt of stream.packets) {
          const pt = cubicBezierPoint(
            stream.p0,
            stream.p1,
            stream.p2,
            stream.p3,
            pkt.u
          );

          if (pkt.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(pkt.trail[0].x, pkt.trail[0].y);
            for (let k = 1; k < pkt.trail.length; k++) {
              ctx.lineTo(pkt.trail[k].x, pkt.trail[k].y);
            }
            ctx.strokeStyle = `rgba(247, 140, 37, ${0.4 + targetGlow * 0.35})`;
            ctx.lineWidth = pkt.size * 0.8;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pkt.size + (isTargeted ? 0.8 : 0) + stream.arrivalFlash * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = pkt.u > 0.85 ? "#FFFFFF" : "#F78C25";
          ctx.shadowColor = "#F78C25";
          ctx.shadowBlur = 9;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Endpoint illumination node
        if (isTargeted && this._targetInfluence > 0.6) {
          ctx.beginPath();
          ctx.arc(stream.p3.x, stream.p3.y, 2.4 + stream.arrivalFlash * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(247, 140, 37, ${0.65 + stream.arrivalFlash * 0.35})`;
          ctx.shadowColor = "#F78C25";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    /* ---------------------------------------------------------------- */
    /* Interactive Field Radiations                                     */
    /* ---------------------------------------------------------------- */

    _drawFieldRadiations(ctx) {
      for (const rad of this._fieldRadiations) {
        ctx.beginPath();
        ctx.arc(rad.x, rad.y, rad.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247, 140, 37, ${rad.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        if (rad.rect) {
          const pad = 4 + (rad.r / rad.maxR) * 8;
          ctx.beginPath();
          ctx.roundRect(
            rad.rect.left - pad,
            rad.rect.top - pad,
            rad.rect.width + pad * 2,
            rad.rect.height + pad * 2,
            12
          );
          ctx.strokeStyle = `rgba(247, 140, 37, ${rad.alpha * 0.5})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }

    /* ---------------------------------------------------------------- */
    /* Typing Micro-Packets                                             */
    /* ---------------------------------------------------------------- */

    _drawTypingPackets(ctx) {
      for (const tp of this._typingPackets) {
        const pt = cubicBezierPoint(tp.p0, tp.p1, tp.p2, tp.p3, tp.progress);
        const alpha = Math.sin(tp.progress * Math.PI);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, tp.size * (1 + (1 - tp.progress)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.shadowColor = "#F78C25";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    /* ---------------------------------------------------------------- */
    /* Error Turbulence Waves                                           */
    /* ---------------------------------------------------------------- */

    _drawErrorWaves(ctx) {
      for (const ew of this._errorWaves) {
        ctx.beginPath();
        ctx.arc(ew.x, ew.y, ew.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${ew.alpha})`;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = "#EF4444";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    /* ---------------------------------------------------------------- */
    /* Central Living MEDHAS Glyph & Identity                           */
    /* ---------------------------------------------------------------- */

    _drawMedhasGlyph(ctx) {
      const t = this._time;
      const gx = this.glyphX;
      const gy = this.glyphY;
      const s = this.glyphSize;
      const eventW = Math.max(this._eventWeight, this._reconfigEnergy);
      const isTargeted = this._targetInfluence > 0.1;

      ctx.save();
      ctx.translate(gx, gy);

      // Core Ambient Pulsing Orb
      const coreR = (s * 0.28) + Math.sin(t * 1.8) * 2.5 + (isTargeted ? 2.0 : 0) + eventW * 5;
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR * 2.6);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      coreGrad.addColorStop(0.3, "rgba(247, 140, 37, 0.95)");
      coreGrad.addColorStop(0.7, `rgba(247, 140, 37, ${0.4 + eventW * 0.3})`);
      coreGrad.addColorStop(1, "rgba(247, 140, 37, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coreR * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Solid Core Dot
      ctx.beginPath();
      ctx.arc(0, 0, coreR * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#F78C25";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outer Rotating Morphic Diamond / Geometric Lattice
      const rot1 = t * 0.22 + (isTargeted ? 0.3 : 0) + (this._reconfigEnergy * 1.5);
      ctx.save();
      ctx.rotate(rot1);

      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.9, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.9, 0);
      ctx.closePath();
      ctx.strokeStyle = `rgba(247, 140, 37, ${0.55 + eventW * 0.35 + (isTargeted ? 0.2 : 0)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.restore();

      // Inner Counter-Rotating Hex Lattice
      const rot2 = -t * 0.16;
      ctx.save();
      ctx.rotate(rot2);

      const inS = s * 0.62;
      ctx.beginPath();
      ctx.rect(-inS * 0.5, -inS * 0.5, inS, inS);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + eventW * 0.3})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();

      // Subtle MEDHAS Wordmark below glyph (Desktop only)
      if (!this.isMobile && this.width > 900) {
        ctx.textAlign = "center";
        ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = "4px";
        ctx.fillStyle = `rgba(238, 240, 244, ${0.85 + eventW * 0.15})`;
        ctx.fillText("MEDHAS", 0, s + 38);

        ctx.font = '400 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = `rgba(148, 163, 184, ${0.65 + eventW * 0.35})`;
        ctx.fillText("KNOWLEDGE • CONNECTION • INTELLIGENCE", 0, s + 54);
      }

      ctx.restore();
    }

    _renderStatic() {
      this._update(0.016);
      this._draw();
    }

    /* ---------------------------------------------------------------- */
    /* Public Lifecycle                                                 */
    /* ---------------------------------------------------------------- */

    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;

      if (this._rafId != null) cancelAnimationFrame(this._rafId);
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._onResize) global.removeEventListener("resize", this._onResize);

      global.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseleave", this._onMouseLeave);
      document.removeEventListener("visibilitychange", this._onVisibility);

      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  const MedhasAnimation = {
    init(options) {
      return new MedhasInteractiveEngine(options || {});
    },
  };

  global.MedhasAnimation = MedhasAnimation;
  if (typeof window !== "undefined") {
    window.MedhasAnimation = MedhasAnimation;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MedhasAnimation;
  }
})(typeof window !== "undefined" ? window : this);
