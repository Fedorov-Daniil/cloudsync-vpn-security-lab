(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const typeTarget = document.querySelector("[data-typing]");
  if (typeTarget) {
    const fullText = typeTarget.dataset.typing || "";
    let index = 0;
    const typeNext = () => {
      typeTarget.textContent = fullText.slice(0, index);
      index += 1;
      if (index <= fullText.length && !reducedMotion) {
        window.setTimeout(typeNext, 27);
      } else {
        typeTarget.textContent = fullText;
      }
    };
    typeNext();
  }

  const latency = document.getElementById("latency");
  if (latency && !reducedMotion) {
    window.setInterval(() => {
      latency.textContent = String(24 + Math.floor(Math.random() * 15));
    }, 1200);
  }

  document.querySelectorAll(".counter").forEach((counter) => {
    const target = Number(counter.dataset.target || counter.textContent || 0);
    if (reducedMotion) {
      counter.textContent = target.toFixed(1);
      return;
    }
    let value = Math.max(0, target - 3.4);
    const step = () => {
      value += (target - value) * 0.09;
      counter.textContent = value.toFixed(1);
      if (target - value > 0.04) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = target.toFixed(1);
      }
    };
    step();
  });

  const graph = document.getElementById("pulse-graph");
  if (graph) {
    const bars = Array.from({ length: 34 }, () => {
      const bar = document.createElement("span");
      bar.className = "pulse-bar";
      graph.appendChild(bar);
      return bar;
    });

    const updateBars = () => {
      bars.forEach((bar, barIndex) => {
        const wave = Math.sin(Date.now() / 520 + barIndex * 0.62);
        const lift = reducedMotion ? 18 : Math.random() * 30;
        const height = 20 + (wave + 1) * 30 + lift;
        bar.style.height = `${Math.round(height)}px`;
        bar.style.opacity = String(0.52 + (reducedMotion ? 0.2 : Math.random() * 0.42));
      });
    };

    updateBars();
    if (!reducedMotion) {
      window.setInterval(updateBars, 620);
    }
  }

  const terminalLines = Array.from(document.querySelectorAll("#terminal-lines [data-line]"));
  const playTerminal = async () => {
    for (const line of terminalLines) {
      const text = line.dataset.line || "";
      line.classList.add("active");
      if (reducedMotion) {
        line.textContent = text;
        line.classList.remove("active");
        continue;
      }
      for (let charIndex = 0; charIndex <= text.length; charIndex += 1) {
        line.textContent = text.slice(0, charIndex);
        await new Promise((resolve) => window.setTimeout(resolve, 18));
      }
      line.classList.remove("active");
      await new Promise((resolve) => window.setTimeout(resolve, 130));
    }
  };
  playTerminal();

  const tiltCards = document.querySelectorAll(".tilt-card");
  if (tiltCards.length && !reducedMotion) {
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

  const parallaxItems = document.querySelectorAll("[data-depth]");
  if (parallaxItems.length && !reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 0.03);
        item.style.translate = `${x * depth * 170}px ${y * depth * 170}px`;
      });
    });
  }

  const canvas = document.getElementById("mesh-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  if (!canvas || !ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const particleCount = reducedMotion ? 26 : isMobile ? 42 : 76;

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
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      size: 1.2 + Math.random() * 2.1,
      hue: Math.random() > 0.45 ? 188 : 258
    }));
  };

  const draw = () => {
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
        if (distance < 122) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(69, 231, 255, ${0.16 * (1 - distance / 122)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    if (!reducedMotion) {
      window.requestAnimationFrame(draw);
    }
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
})();
