(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = motionQuery.matches;

  const doc = document.documentElement;
  const topbar = document.querySelector(".topbar");
  const progress = document.querySelector(".scroll-progress");
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  const terminals = Array.from(document.querySelectorAll("[data-terminal]"));
  const counters = Array.from(document.querySelectorAll("[data-count-to]"));
  const graph = document.getElementById("traffic-graph");
  const parallaxItems = Array.from(document.querySelectorAll("[data-depth]"));
  const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const scrollButtons = Array.from(document.querySelectorAll("[data-scroll-target]"));
  const motionToggle = document.querySelector("[data-motion-toggle]");
  const magneticSelector = ".button, .contact-button";
  const cardSelector = ".metric, .signal-card, .cockpit-side article, .feature-card, .flow-node, .timeline-item, .safe-list p, .contact-card, .terminal";

  document.body.classList.add("is-ready");

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;

  const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      const targetId = href.slice(1);
      if (document.getElementById(targetId)) {
        event.preventDefault();
        scrollToSection(targetId);
      }
    });
  });

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      scrollToSection(button.dataset.scrollTarget || "");
    });
  });

  const setScrollState = () => {
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    const percent = ratio * 100;
    doc.style.setProperty("--scroll-ratio", ratio.toFixed(4));
    if (progress) progress.style.setProperty("--scroll", `${percent}%`);
    if (topbar) topbar.dataset.elevated = String(window.scrollY > 18);
  };

  let lastScrollY = window.scrollY;
  let tickingScroll = false;
  const onScroll = () => {
    if (tickingScroll) return;
    tickingScroll = true;
    window.requestAnimationFrame(() => {
      setScrollState();
      lastScrollY = window.scrollY;
      tickingScroll = false;
    });
  };

  const counterFrames = new WeakMap();
  const resetCounter = (element) => {
    const frameId = counterFrames.get(element);
    if (frameId) window.cancelAnimationFrame(frameId);
    counterFrames.delete(element);
    element.textContent = "0";
  };

  const animateCounter = (element) => {
    const target = Number(element.dataset.countTo || "0");
    if (!Number.isFinite(target)) return;
    resetCounter(element);
    if (prefersReducedMotion) {
      element.textContent = target.toFixed(target % 1 ? 1 : 0);
      return;
    }

    const startedAt = performance.now();
    const duration = 920;
    const decimals = target % 1 ? 1 : 0;

    const frame = (now) => {
      const progressAmount = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progressAmount, 3);
      element.textContent = (target * eased).toFixed(decimals);
      if (progressAmount < 1) {
        counterFrames.set(element, window.requestAnimationFrame(frame));
      } else {
        counterFrames.delete(element);
      }
    };

    counterFrames.set(element, window.requestAnimationFrame(frame));
  };

  const terminalTimers = new WeakMap();
  const clearTerminal = (terminal) => {
    const timer = terminalTimers.get(terminal);
    if (timer) window.clearTimeout(timer);
    terminalTimers.delete(terminal);
  };

  const playTerminal = (terminal) => {
    const output = terminal.querySelector("[data-terminal-output]");
    if (!output) return;

    const text = terminal.dataset.terminalText || "";
    clearTerminal(terminal);

    if (prefersReducedMotion) {
      output.textContent = text;
      return;
    }

    output.textContent = "";
    let index = 0;
    const type = () => {
      output.textContent = text.slice(0, index);
      index += 1;
      if (index <= text.length) {
        terminalTimers.set(terminal, window.setTimeout(type, 26));
      }
    };
    type();
  };

  const resetTerminal = (terminal) => {
    const output = terminal.querySelector("[data-terminal-output]");
    clearTerminal(terminal);
    if (output) output.textContent = "";
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const direction = window.scrollY >= lastScrollY ? "down" : "up";
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view", "visible");
            entry.target.classList.remove("out-view", "is-exiting-up");
          } else {
            entry.target.classList.remove("in-view", "visible");
            entry.target.classList.add("out-view");
            entry.target.classList.toggle("is-exiting-up", direction === "up");
          }
        });
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.14 }
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
      revealObserver.observe(item);
    });

    const terminalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playTerminal(entry.target);
          } else {
            resetTerminal(entry.target);
          }
        });
      },
      { threshold: 0.55 }
    );
    terminals.forEach((terminal) => terminalObserver.observe(terminal));

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
          } else {
            resetCounter(entry.target);
          }
        });
      },
      { threshold: 0.65 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view", "visible"));
    terminals.forEach(playTerminal);
    counters.forEach(animateCounter);
  }

  const bars = [];
  let graphActive = false;
  let graphTimer = 0;

  const updateBars = () => {
    if (!graph || !bars.length) return;
    const now = performance.now();
    bars.forEach((bar, index) => {
      const wave = Math.sin(now / 480 + index * 0.62);
      const secondary = Math.cos(now / 760 + index * 0.34);
      const scale = 0.18 + ((wave + 1) / 2) * 0.56 + ((secondary + 1) / 2) * 0.18;
      bar.style.setProperty("--bar-scale", scale.toFixed(3));
      bar.style.opacity = String(0.46 + ((wave + 1) / 2) * 0.44);
    });
  };

  const startGraph = () => {
    if (!graph || graphActive || prefersReducedMotion) return;
    graphActive = true;
    updateBars();
    graphTimer = window.setInterval(updateBars, 640);
  };

  const stopGraph = () => {
    graphActive = false;
    if (graphTimer) window.clearInterval(graphTimer);
    graphTimer = 0;
  };

  if (graph) {
    for (let index = 0; index < 32; index += 1) {
      const bar = document.createElement("span");
      bar.className = "traffic-bar";
      graph.appendChild(bar);
      bars.push(bar);
    }
    updateBars();

    if ("IntersectionObserver" in window) {
      const graphObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) startGraph();
            else stopGraph();
          });
        },
        { threshold: 0.24 }
      );
      graphObserver.observe(graph);
    } else {
      startGraph();
    }
  }

  const parallax = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    frame: 0
  };

  const setParallaxVars = (x, y) => {
    doc.style.setProperty("--parallax-x", x.toFixed(4));
    doc.style.setProperty("--parallax-y", y.toFixed(4));
    doc.style.setProperty("--parallax-x-px", `${(x * 46).toFixed(2)}px`);
    doc.style.setProperty("--parallax-y-px", `${(y * 34).toFixed(2)}px`);
    doc.style.setProperty("--parallax-aura-x", `${(x * 38).toFixed(2)}px`);
    doc.style.setProperty("--parallax-aura-y", `${(y * 32).toFixed(2)}px`);
    doc.style.setProperty("--parallax-ribbon-x", `${(x * 30).toFixed(2)}px`);
    doc.style.setProperty("--parallax-ribbon-y", `${(y * 18).toFixed(2)}px`);
  };

  const resetParallax = () => {
    if (parallax.frame) window.cancelAnimationFrame(parallax.frame);
    parallax.currentX = 0;
    parallax.currentY = 0;
    parallax.targetX = 0;
    parallax.targetY = 0;
    parallax.frame = 0;
    setParallaxVars(0, 0);
    doc.style.setProperty("--pointer-x", "0");
    doc.style.setProperty("--pointer-y", "0");
    doc.style.setProperty("--tilt-x", "0");
    doc.style.setProperty("--tilt-y", "0");
    parallaxItems.forEach((item) => {
      item.style.transform = "";
    });
  };

  const renderParallax = () => {
    parallax.frame = 0;
    if (prefersReducedMotion) {
      resetParallax();
      return;
    }

    parallax.currentX = lerp(parallax.currentX, parallax.targetX, 0.12);
    parallax.currentY = lerp(parallax.currentY, parallax.targetY, 0.12);
    setParallaxVars(parallax.currentX, parallax.currentY);

    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 0.03);
      item.style.transform = `translate3d(${(parallax.currentX * depth * 260).toFixed(2)}px, ${(parallax.currentY * depth * 220).toFixed(2)}px, 0)`;
    });

    const settled =
      Math.abs(parallax.currentX - parallax.targetX) < 0.001 &&
      Math.abs(parallax.currentY - parallax.targetY) < 0.001;
    if (!settled) parallax.frame = window.requestAnimationFrame(renderParallax);
  };

  const scheduleParallax = (x, y) => {
    if (prefersReducedMotion) return;
    parallax.targetX = clamp(x, -0.5, 0.5);
    parallax.targetY = clamp(y, -0.5, 0.5);
    if (!parallax.frame) parallax.frame = window.requestAnimationFrame(renderParallax);
  };

  let activeCard = null;
  let cardPointerEvent = null;
  let cardFrame = 0;

  const resetCardTilt = (card) => {
    if (!card) return;
    card.style.setProperty("--card-tilt-x", "0deg");
    card.style.setProperty("--card-tilt-y", "0deg");
    card.style.setProperty("--card-glow-x", "50%");
    card.style.setProperty("--card-glow-y", "50%");
  };

  const updateCardTilt = () => {
    cardFrame = 0;
    if (!activeCard || !cardPointerEvent || prefersReducedMotion) return;
    const rect = activeCard.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = clamp((cardPointerEvent.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    const y = clamp((cardPointerEvent.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
    activeCard.style.setProperty("--card-tilt-x", `${(x * 6).toFixed(2)}deg`);
    activeCard.style.setProperty("--card-tilt-y", `${(-y * 5).toFixed(2)}deg`);
    activeCard.style.setProperty("--card-glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    activeCard.style.setProperty("--card-glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const setPointerMotion = (event) => {
    const magneticTarget = event.target.closest(magneticSelector);
    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      magneticTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
      magneticTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
    }

    if (event.pointerType !== "touch") {
      const pointerX = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      const pointerY = event.clientY / Math.max(1, window.innerHeight) - 0.5;
      doc.style.setProperty("--pointer-x", pointerX.toFixed(4));
      doc.style.setProperty("--pointer-y", pointerY.toFixed(4));
      scheduleParallax(pointerX, pointerY);
    }

    const card = event.target.closest(cardSelector);
    if (card && event.pointerType !== "touch") {
      activeCard = card;
      cardPointerEvent = event;
      if (!cardFrame) cardFrame = window.requestAnimationFrame(updateCardTilt);
    }
  };

  const resetPointerMotion = (event) => {
    const card = event.target.closest(cardSelector);
    if (!card || (event.relatedTarget && card.contains(event.relatedTarget))) return;
    resetCardTilt(card);
    if (activeCard === card) {
      activeCard = null;
      cardPointerEvent = null;
    }
  };

  document.addEventListener("pointermove", setPointerMotion, { passive: true });
  document.addEventListener("pointerout", resetPointerMotion, { passive: true });

  let orientationActive = false;
  let motionToggleReady = false;

  const stopOrientation = () => {
    if (!orientationActive) return;
    window.removeEventListener("deviceorientation", handleOrientation);
    orientationActive = false;
    doc.classList.remove("motion-enabled");
  };

  function handleOrientation(event) {
    if (prefersReducedMotion) return;
    const tiltX = clamp(Number(event.gamma || 0) / 34, -0.5, 0.5);
    const tiltY = clamp(Number(event.beta || 0) / 46, -0.5, 0.5);
    doc.style.setProperty("--tilt-x", tiltX.toFixed(4));
    doc.style.setProperty("--tilt-y", tiltY.toFixed(4));
    scheduleParallax(tiltX, tiltY);
  }

  const startOrientation = () => {
    if (orientationActive || prefersReducedMotion || !("DeviceOrientationEvent" in window)) return;
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    orientationActive = true;
    doc.classList.add("motion-enabled");
    if (motionToggle) {
      motionToggle.hidden = true;
      motionToggle.setAttribute("aria-pressed", "true");
    }
  };

  const setupOrientationEnhancement = () => {
    if (!motionToggle || motionToggleReady || prefersReducedMotion || !("DeviceOrientationEvent" in window)) return;
    motionToggleReady = true;

    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      motionToggle.hidden = false;
      motionToggle.setAttribute("aria-pressed", "false");
      motionToggle.addEventListener("click", async () => {
        motionToggle.classList.add("is-pending");
        try {
          const result = await DeviceOrientationEvent.requestPermission();
          if (result === "granted") {
            startOrientation();
          } else {
            motionToggle.querySelector("span").textContent = "Motion effects недоступны";
          }
        } catch (error) {
          motionToggle.querySelector("span").textContent = "Motion effects недоступны";
        } finally {
          motionToggle.classList.remove("is-pending");
          if (!orientationActive) {
            window.setTimeout(() => {
              motionToggle.hidden = true;
            }, 1400);
          }
        }
      });
      return;
    }

    if (window.matchMedia("(pointer: coarse)").matches) {
      startOrientation();
    }
  };

  const canvas = document.getElementById("network-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let width = 0;
  let height = 0;
  let particles = [];
  let canvasFrame = 0;

  const particleCount = () => {
    if (prefersReducedMotion) return 20;
    if (window.innerWidth < 560) return 34;
    if (window.innerWidth < 980) return 46;
    return 64;
  };

  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: particleCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: 1 + Math.random() * 2.1,
      hue: Math.random() > 0.58 ? 153 : 190
    }));
  };

  const drawCanvas = () => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      if (!prefersReducedMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;
      }

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 72%, 0.62)`;
      ctx.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const dx = particle.x - next.x;
        const dy = particle.y - next.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 126) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(70, 229, 255, ${0.13 * (1 - distance / 126)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    if (!prefersReducedMotion && !document.hidden) {
      canvasFrame = window.requestAnimationFrame(drawCanvas);
    }
  };

  const startCanvas = () => {
    if (!canvas || !ctx || prefersReducedMotion || canvasFrame) return;
    canvasFrame = window.requestAnimationFrame(drawCanvas);
  };

  const stopCanvas = () => {
    if (canvasFrame) window.cancelAnimationFrame(canvasFrame);
    canvasFrame = 0;
  };

  if (canvas && ctx) {
    resizeCanvas();
    drawCanvas();
    if (!prefersReducedMotion) startCanvas();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopCanvas();
      else startCanvas();
    });
  }

  const applyMotionPreference = () => {
    prefersReducedMotion = motionQuery.matches;
    if (prefersReducedMotion) {
      stopOrientation();
      resetParallax();
      if (motionToggle) motionToggle.hidden = true;
      stopGraph();
      stopCanvas();
      terminals.forEach(playTerminal);
      counters.forEach(animateCounter);
    } else {
      setupOrientationEnhancement();
      startGraph();
      startCanvas();
    }
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", applyMotionPreference);
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(applyMotionPreference);
  }

  let resizeFrame = 0;
  const onResize = () => {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      resizeCanvas();
      updateBars();
      setScrollState();
    });
  };

  setupOrientationEnhancement();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });
  window.addEventListener("pageshow", setScrollState, { passive: true });
  setScrollState();
})();
