(function () {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedMotion = motionQuery.matches;
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let isPaused = document.hidden;
  let lastScrollY = window.scrollY;

  const setScrollDirection = () => {
    const currentY = window.scrollY;
    const direction = currentY >= lastScrollY ? "down" : "up";
    document.body.classList.toggle("scrolling-down", direction === "down");
    document.body.classList.toggle("scrolling-up", direction === "up");
    lastScrollY = currentY;
  };
  setScrollDirection();
  window.addEventListener("scroll", setScrollDirection, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.18 || entry.boundingClientRect.bottom < -window.innerHeight * 0.18) {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { rootMargin: "-8% 0px -12% 0px", threshold: [0, 0.16, 0.42] }
    );
    revealItems.forEach((item, index) => {
      item.style.setProperty("--stagger", `${Math.min(index % 8, 7) * 70}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  const typeTarget = document.querySelector("[data-typing]");
  if (typeTarget) {
    const fullText = typeTarget.dataset.typing || "";
    let index = 0;
    const typeNext = () => {
      typeTarget.textContent = fullText.slice(0, index);
      index += 1;
      if (index <= fullText.length && !reducedMotion) {
        window.setTimeout(typeNext, 24);
      } else {
        typeTarget.textContent = fullText;
      }
    };
    typeNext();
  }

  const latency = document.getElementById("latency");
  let latencyTimer = null;
  if (latency && !reducedMotion) {
    latencyTimer = window.setInterval(() => {
      if (!isPaused) latency.textContent = String(24 + Math.floor(Math.random() * 15));
    }, 1150);
  }

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || counter.textContent || 0);
    if (reducedMotion) {
      counter.textContent = target.toFixed(1);
      return;
    }
    let value = Math.max(0, target - 4.2);
    const step = () => {
      if (isPaused) return;
      value += (target - value) * 0.1;
      counter.textContent = value.toFixed(1);
      if (target - value > 0.035) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = target.toFixed(1);
      }
    };
    step();
  };
  document.querySelectorAll(".counter").forEach(animateCounter);

  const graph = document.getElementById("pulse-graph");
  let graphTimer = null;
  if (graph) {
    const bars = Array.from({ length: mobileQuery.matches ? 24 : 34 }, () => {
      const bar = document.createElement("span");
      bar.className = "pulse-bar";
      graph.appendChild(bar);
      return bar;
    });

    const updateBars = () => {
      if (isPaused) return;
      bars.forEach((bar, barIndex) => {
        const wave = Math.sin(Date.now() / 500 + barIndex * 0.64);
        const lift = reducedMotion ? 16 : Math.random() * 28;
        const height = 18 + (wave + 1) * 30 + lift;
        bar.style.height = `${Math.round(height)}px`;
        bar.style.opacity = String(0.5 + (reducedMotion ? 0.22 : Math.random() * 0.44));
      });
    };

    updateBars();
    if (!reducedMotion) graphTimer = window.setInterval(updateBars, 620);
  }

  const terminal = document.getElementById("terminal-lines");
  const terminalLines = terminal ? Array.from(terminal.querySelectorAll("[data-line]")) : [];
  let terminalRun = 0;
  const clearTerminal = () => {
    terminalLines.forEach((line) => {
      line.textContent = "";
      line.classList.remove("active");
    });
  };
  const playTerminal = async () => {
    const runId = ++terminalRun;
    clearTerminal();
    for (const line of terminalLines) {
      if (runId !== terminalRun) return;
      const text = line.dataset.line || "";
      line.classList.add("active");
      if (reducedMotion) {
        line.textContent = text;
        line.classList.remove("active");
        continue;
      }
      for (let charIndex = 0; charIndex <= text.length; charIndex += 1) {
        if (runId !== terminalRun || isPaused) return;
        line.textContent = text.slice(0, charIndex);
        await new Promise((resolve) => window.setTimeout(resolve, 17));
      }
      line.classList.remove("active");
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
  };

  const terminalBlock = document.querySelector(".terminal");
  if (terminalBlock && "IntersectionObserver" in window) {
    const terminalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playTerminal();
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.2 || entry.boundingClientRect.bottom < -window.innerHeight * 0.2) {
            terminalRun += 1;
            clearTerminal();
          }
        });
      },
      { rootMargin: "-6% 0px -18% 0px", threshold: 0.22 }
    );
    terminalObserver.observe(terminalBlock);
  } else {
    playTerminal();
  }

  const tiltCards = document.querySelectorAll(".tilt-card");
  if (tiltCards.length && !reducedMotion && !mobileQuery.matches) {
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  const spotlight = document.querySelector(".spotlight");
  const parallaxItems = document.querySelectorAll("[data-depth]");
  if (!reducedMotion && !mobileQuery.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        if (spotlight) {
          spotlight.style.setProperty("--mx", `${event.clientX}px`);
          spotlight.style.setProperty("--my", `${event.clientY}px`);
        }
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        parallaxItems.forEach((item) => {
          const depth = Number(item.dataset.depth || 0.03);
          item.style.translate = `${x * depth * 170}px ${y * depth * 170}px`;
        });
      },
      { passive: true }
    );
  }

  const canvas = document.getElementById("mesh-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  if (!canvas || !ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let frameId = 0;
  const particleCount = reducedMotion ? 22 : mobileQuery.matches ? 32 : 82;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1.1 + Math.random() * 2,
      hue: Math.random() > 0.45 ? 188 : 258
    }));
  };

  const draw = () => {
    if (isPaused) {
      frameId = 0;
      return;
    }
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      if (!reducedMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;
      }

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 72%, 0.66)`;
      ctx.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const dx = particle.x - next.x;
        const dy = particle.y - next.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 124) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(69, 231, 255, ${0.16 * (1 - distance / 124)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    isPaused = document.hidden;
    if (!isPaused && !frameId && !reducedMotion) draw();
  });

  window.addEventListener("pagehide", () => {
    if (frameId) window.cancelAnimationFrame(frameId);
    if (latencyTimer) window.clearInterval(latencyTimer);
    if (graphTimer) window.clearInterval(graphTimer);
  });
})();
