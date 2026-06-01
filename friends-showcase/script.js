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

  document.body.classList.add("is-ready");

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

  const setPointerVars = (event) => {
    const target = event.target.closest(".button, .contact-button");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };
  document.addEventListener("pointermove", setPointerVars, { passive: true });

  let parallaxFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const updateParallax = () => {
    parallaxFrame = 0;
    if (prefersReducedMotion) return;
    const x = pointerX / window.innerWidth - 0.5;
    const y = pointerY / window.innerHeight - 0.5;
    doc.style.setProperty("--pointer-x", x.toFixed(4));
    doc.style.setProperty("--pointer-y", y.toFixed(4));
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 0.03);
      item.style.transform = `translate3d(${x * depth * 180}px, ${y * depth * 180}px, 0)`;
    });
  };

  if (parallaxItems.length) {
    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
  }

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

    window.addEventListener("resize", () => {
      resizeCanvas();
      updateBars();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopCanvas();
      else startCanvas();
    });
  }

  const applyMotionPreference = () => {
    prefersReducedMotion = motionQuery.matches;
    if (prefersReducedMotion) {
      stopGraph();
      stopCanvas();
      terminals.forEach(playTerminal);
      counters.forEach(animateCounter);
    } else {
      startGraph();
      startCanvas();
    }
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", applyMotionPreference);
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(applyMotionPreference);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", setScrollState, { passive: true });
  setScrollState();
})();
