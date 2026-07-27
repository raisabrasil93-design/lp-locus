/* ==========================================================================
   CURSO LOCUS — interações (vanilla JS, leve e sem dependências)
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal (múltiplas direções) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Linhas / divisores desenhados no scroll ---------- */
  var drawEls = document.querySelectorAll("[data-draw]");
  if (drawEls.length) {
    if (!reduceMotion && "IntersectionObserver" in window) {
      var ioLine = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-drawn");
              ioLine.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      drawEls.forEach(function (el) { ioLine.observe(el); });
    } else {
      drawEls.forEach(function (el) { el.classList.add("is-drawn"); });
    }
  }

  /* ---------- Parallax sutil nas fotos de fundo ---------- */
  var isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
  if (!reduceMotion && !isMobileViewport) {
    var parallaxTargets = document.querySelectorAll(".hero__media img, .closing__media img");
    var contentParallaxTargets = document.querySelectorAll(".sec--parallax__media img");
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        parallaxTargets.forEach(function (img) {
          var rect = img.closest("section, header").getBoundingClientRect();
          var offset = rect.top * 0.06;
          img.style.transform = "translateY(" + offset * -1 + "px) scale(1.08)";
        });
        /* Movimento mais perceptível: a foto desliza dentro da seção enquanto
           o texto (que não recebe transform) permanece parado. */
        contentParallaxTargets.forEach(function (img) {
          var rect = img.closest("section").getBoundingClientRect();
          var offset = rect.top * 0.22;
          img.style.transform = "translateY(" + offset * -1 + "px) scale(1.18)";
        });
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Diagrama Locus: interações do círculo ---------- */
  var diagram = document.querySelector(".locus-diagram");
  if (diagram) {
    var diagModules = diagram.querySelectorAll(".locus-diagram__module");

    function clearDiagram() {
      diagram.classList.remove("is-focused");
      diagModules.forEach(function (m) {
        m.classList.remove("is-hover");
        var i = m.getAttribute("data-mod");
        var l = diagram.querySelector('[data-line="' + i + '"]');
        var d = diagram.querySelector('[data-dot="' + i + '"]');
        if (l) l.classList.remove("is-active");
        if (d) d.classList.remove("is-active");
      });
    }

    function focusModule(mod) {
      var idx = mod.getAttribute("data-mod");
      var line = diagram.querySelector('[data-line="' + idx + '"]');
      var dot = diagram.querySelector('[data-dot="' + idx + '"]');
      diagram.classList.add("is-focused");
      mod.classList.add("is-hover");
      if (line) line.classList.add("is-active");
      if (dot) dot.classList.add("is-active");
    }

    diagModules.forEach(function (mod) {
      mod.addEventListener("mouseenter", function () { focusModule(mod); });
      mod.addEventListener("mouseleave", clearDiagram);
      mod.addEventListener("focus", function () { focusModule(mod); });
      mod.addEventListener("blur", clearDiagram);
      mod.addEventListener("touchstart", function () {
        var wasActive = mod.classList.contains("is-hover");
        clearDiagram();
        if (!wasActive) focusModule(mod);
      }, { passive: true });
    });
  }

  /* ---------- FAQ acordeão ---------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var button = item.querySelector(".faq__question");
    var answer = item.querySelector(".faq__answer");

    button.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq__item.is-open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq__answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Smooth scroll para âncoras internas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      }
    });
  });

})();
