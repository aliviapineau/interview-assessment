/**
 * CTM (CallTrackingMetrics) — Home Services Paid Campaign Landing Page
 * Interactive behaviors:
 *  1. Smooth scroll + form card highlight & auto-focus for Primary Demo CTAs
 *  2. Accessible client-side validation + US phone formatting + confirmation state
 *  3. Fullscreen Interactive Storylane Demo modal controller
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     1. Smooth Scroll & Focus for "Request a Demo" CTAs
     ======================================================================== */
  const scrollToFormLinks = document.querySelectorAll(".js-scroll-to-form");
  const formSection = document.getElementById("demo-form-section");
  const formCard = document.getElementById("demo-form-card");
  const firstNameInput = document.getElementById("firstName");

  scrollToFormLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (!formSection) return;
      e.preventDefault();

      formSection.scrollIntoView({ behavior: "smooth", block: "start" });

      if (formCard) {
        formCard.classList.add("form-card-highlight");
        setTimeout(() => {
          formCard.classList.remove("form-card-highlight");
        }, 1800);
      }

      setTimeout(() => {
        if (firstNameInput && !firstNameInput.closest("[hidden]")) {
          firstNameInput.focus({ preventScroll: true });
        }
      }, 650);
    });
  });

  /* ========================================================================
     2. Phone Formatting & Demo Form Validation
     ======================================================================== */
  const demoForm = document.getElementById("ctm-demo-form");
  const phoneInput = document.getElementById("phone");
  const successState = document.getElementById("form-success-state");
  const successPersonalMsg = document.getElementById("success-personal-msg");
  const resetFormBtn = document.getElementById("reset-form-btn");

  // Auto-format US phone number as (XXX) XXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      let formatted = "";

      if (digits.length > 0) {
        formatted = "(" + digits.substring(0, 3);
      }
      if (digits.length >= 4) {
        formatted += ") " + digits.substring(3, 6);
      }
      if (digits.length >= 7) {
        formatted += "-" + digits.substring(6, 10);
      }

      e.target.value = formatted;
    });
  }

  const validators = {
    firstName: (val) => (val.trim().length >= 2 ? "" : "Please enter your first name."),
    lastName: (val) => (val.trim().length >= 2 ? "" : "Please enter your last name."),
    company: (val) => (val.trim().length >= 2 ? "" : "Please enter your company name."),
    email: (val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim()) ? "" : "Please enter a valid work email address.";
    },
    phone: (val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length === 10 ? "" : "Please enter a valid 10-digit phone number.";
    },
  };

  function validateField(field) {
    const name = field.name;
    const errorEl = document.getElementById(`${name}-error`);
    if (!validators[name]) return true;

    const errorMessage = validators[name](field.value);
    if (errorMessage) {
      field.classList.add("input-invalid");
      field.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = errorMessage;
      return false;
    } else {
      field.classList.remove("input-invalid");
      field.setAttribute("aria-invalid", "false");
      if (errorEl) errorEl.textContent = "";
      return true;
    }
  }

  if (demoForm) {
    const inputs = demoForm.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("input-invalid")) {
          validateField(input);
        }
      });
    });

    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isFormValid = true;
      let firstInvalidField = null;

      inputs.forEach((input) => {
        const valid = validateField(input);
        if (!valid && !firstInvalidField) {
          isFormValid = false;
          firstInvalidField = input;
        } else if (!valid) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      // Personalized confirmation message
      const firstName = document.getElementById("firstName").value.trim();
      const company = document.getElementById("company").value.trim();
      const email = document.getElementById("email").value.trim();

      if (successPersonalMsg) {
        successPersonalMsg.textContent = `Thanks, ${firstName}! We've received the request for ${company} and sent a confirmation to ${email}. A CTM Home Services specialist will reach out shortly.`;
      }

      demoForm.hidden = true;
      if (successState) {
        successState.hidden = false;
      }
    });
  }

  if (resetFormBtn && demoForm && successState) {
    resetFormBtn.addEventListener("click", () => {
      demoForm.reset();
      successState.hidden = true;
      demoForm.hidden = false;
      if (firstNameInput) firstNameInput.focus();
    });
  }

  /* ========================================================================
     3. Fullscreen Storylane Interactive Demo Modal
     ======================================================================== */
  const openModalBtn = document.getElementById("open-Storylane-Modal");
  const closeModalBtn = document.getElementById("close-storylane-modal");
  const modal = document.getElementById("storylane-modal");
  const modalIframe = document.getElementById("storylane-modal-iframe");
  const modalToFormBtns = document.querySelectorAll(".js-modal-to-form");

  function openStorylaneModal() {
    if (!modal) return;
    if (modalIframe && !modalIframe.getAttribute("src")) {
      modalIframe.setAttribute("src", modalIframe.getAttribute("data-src"));
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      syncStorylaneViewport();
    });
    if (closeModalBtn) closeModalBtn.focus();
  }

  function closeStorylaneModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (openModalBtn) openModalBtn.focus();
  }

  if (openModalBtn) {
    openModalBtn.addEventListener("click", openStorylaneModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeStorylaneModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeStorylaneModal();
      }
    });
  }

  modalToFormBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeStorylaneModal();
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeStorylaneModal();
    }
  });

  /* ========================================================================
     4. Responsive Virtual-Desktop Scaling for Storylane on Mobile/Tablet
        Prevents Storylane's internal <800px breakpoint from blocking the tour
        or redirecting mobile paid traffic off the landing page.
     ======================================================================== */
  const inlineWrapper = document.querySelector(".storylane-iframe-wrapper");
  const inlineIframe = document.getElementById("storylane-iframe");
  const modalBody = document.querySelector(".modal-body");

  const VIRTUAL_DESKTOP_WIDTH = 1200;
  const VIRTUAL_DESKTOP_HEIGHT = 690;
  const BREAKPOINT_PX = 1024;

  function scaleIframeInContainer(wrapperEl, iframeEl, isModal) {
    if (!wrapperEl || !iframeEl) return;
    const containerWidth = wrapperEl.clientWidth;
    if (containerWidth <= 0) return;

    if (containerWidth < BREAKPOINT_PX) {
      const scale = containerWidth / VIRTUAL_DESKTOP_WIDTH;
      const scaledHeight = Math.round(VIRTUAL_DESKTOP_HEIGHT * scale);

      iframeEl.style.width = `${VIRTUAL_DESKTOP_WIDTH}px`;
      iframeEl.style.height = `${VIRTUAL_DESKTOP_HEIGHT}px`;
      iframeEl.style.transform = `scale(${scale})`;
      iframeEl.style.transformOrigin = "0 0";

      wrapperEl.style.height = `${scaledHeight}px`;
      wrapperEl.style.minHeight = "0px";
      wrapperEl.style.aspectRatio = "unset";

      if (isModal) {
        wrapperEl.style.flex = "none";
        iframeEl.style.position = "absolute";
        iframeEl.style.left = "0";
        iframeEl.style.top = "0";
      }
    } else {
      iframeEl.style.width = "100%";
      iframeEl.style.height = "100%";
      iframeEl.style.transform = "none";
      iframeEl.style.position = "";
      iframeEl.style.left = "";
      iframeEl.style.top = "";

      wrapperEl.style.height = "";
      wrapperEl.style.minHeight = "";
      wrapperEl.style.aspectRatio = "";
      wrapperEl.style.flex = "";
    }
  }

  function syncStorylaneViewport() {
    scaleIframeInContainer(inlineWrapper, inlineIframe, false);
    if (modal && !modal.hidden) {
      scaleIframeInContainer(modalBody, modalIframe, true);
    }
  }

  syncStorylaneViewport();
  window.addEventListener("resize", syncStorylaneViewport);

  if ("ResizeObserver" in window && inlineWrapper) {
    const ro = new ResizeObserver(() => syncStorylaneViewport());
    ro.observe(inlineWrapper);
  }

  /* ========================================================================
     5. Load Choreography, Scroll-Reveal Animations & 89% Stat Counter
     ======================================================================== */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Trigger Hero entrance animations immediately on load
  requestAnimationFrame(() => {
    document.body.classList.add("is-loaded");
  });

  // Sticky Header elevation on scroll
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const onScrollHeader = () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add("header-scrolled");
      } else {
        siteHeader.classList.remove("header-scrolled");
      }
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    // Configure scroll-reveal targets and directions
    const revealConfigs = [
      { selector: ".benefit-row:not(.benefit-row-reverse) .benefit-copy", variant: "reveal-left" },
      { selector: ".benefit-row:not(.benefit-row-reverse) .benefit-visual", variant: "reveal-right" },
      { selector: ".benefit-row-reverse .benefit-copy", variant: "reveal-right" },
      { selector: ".benefit-row-reverse .benefit-visual", variant: "reveal-left" },
      { selector: ".insight-banner", variant: "reveal-scale" },
      { selector: ".demo-tour-section .section-header", variant: "reveal-up" },
      { selector: ".tour-callout-card", variant: "reveal-up" },
      { selector: ".storylane-browser-frame", variant: "reveal-up" },
      { selector: ".conversion-copy-col", variant: "reveal-left" },
      { selector: ".conversion-form-col", variant: "reveal-right" },
      { selector: ".faq-section .section-header", variant: "reveal-up" },
      { selector: ".faq-item", variant: "reveal-up", stagger: 100 },
    ];

    const elementsToObserve = [];

    revealConfigs.forEach(({ selector, variant, stagger }) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((node, index) => {
        node.classList.add("scroll-reveal", variant);
        if (stagger) {
          node.style.transitionDelay = `${index * stagger}ms`;
        }
        elementsToObserve.push(node);
      });
    });

    // Stagger checklist items within each benefit card
    document.querySelectorAll(".benefit-checklist").forEach((list) => {
      list.querySelectorAll("li").forEach((item, idx) => {
        item.classList.add("scroll-reveal", "reveal-up");
        item.style.transitionDelay = `${120 + idx * 85}ms`;
        elementsToObserve.push(item);
      });
    });

    // Stagger credential badges in the conversion section
    document.querySelectorAll(".conversion-credentials img").forEach((badge, idx) => {
      badge.classList.add("scroll-reveal", "reveal-pop");
      badge.style.transitionDelay = `${80 + idx * 55}ms`;
      elementsToObserve.push(badge);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    elementsToObserve.forEach((el) => revealObserver.observe(el));

    // Animated 89% Dynata Consumer Survey Stat Counter
    const statValueEl = document.querySelector(".stat-value[data-count-target]");
    const statRingEl = document.querySelector(".stat-ring");
    if (statValueEl) {
      const targetNum = parseInt(statValueEl.getAttribute("data-count-target"), 10) || 89;
      statValueEl.textContent = "0";

      const statObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);

            if (statRingEl) {
              statRingEl.classList.add("stat-ring-animate");
            }

            const durationMs = 1400;
            const startTime = performance.now();

            function tick(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / durationMs, 1);
              // easeOutQuart easing curve
              const eased = 1 - Math.pow(1 - progress, 4);
              const current = Math.round(eased * targetNum);
              statValueEl.textContent = String(current);

              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                statValueEl.textContent = String(targetNum);
              }
            }

            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.35 }
      );

      statObserver.observe(statValueEl);
    }
  }

  /* ========================================================================
     6. Exclusive FAQ Accordion (Opening one question collapses any open one)
     ======================================================================== */
  const faqItems = document.querySelectorAll(".faq-accordion .faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      }
    });
  });
});
