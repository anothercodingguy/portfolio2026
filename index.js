document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccordions();
  initWritingAbstract();
  initCopyEmail();
  initScrollSpy();
  initClock();
  initMobileMenu();
  initVisitorCounter();
  initGithubContributions();
});

/**
 * Toast Notification System
 */
let toastTimeout = null;
function showToast(message, duration = 2800) {
  let toastEl = document.getElementById('toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.className = 'toast font-mono';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }

  toastEl.textContent = message;
  toastEl.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

/**
 * Theme Toggle & System Preference Sync with Scoped Transitions
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const applyTheme = (theme, animate = false) => {
    if (animate) {
      document.body.classList.add('theme-transitioning');
    }
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    updateThemeIcon(theme);

    if (animate) {
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }
  };

  const getActiveTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const updateThemeIcon = (theme) => {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      `;
    }
  };

  const initialTheme = getActiveTheme();
  applyTheme(initialTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const newTheme = isCurrentlyDark ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });
}

/**
 * One-Click Copy Email
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const email = 'suyashs787@gmail.com';

  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          showToast(`✓ Email copied: ${email}`);
        })
        .catch(() => {
          // Fallback to mailto link
          window.location.href = `mailto:${email}`;
        });
    } else {
      window.location.href = `mailto:${email}`;
    }
  });
}

/**
 * Writing Research Abstract Dropdown & BibTeX Copy
 */
function initWritingAbstract() {
  const writingCard = document.querySelector('.writing-card');
  const toggleBtn = document.getElementById('writing-toggle');
  const content = document.getElementById('writing-details');
  const bibtexBtn = document.getElementById('copy-bibtex-btn');

  if (toggleBtn && content && writingCard) {
    const handleToggle = () => {
      const isExpanded = writingCard.classList.contains('expanded');
      if (isExpanded) {
        writingCard.classList.remove('expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        writingCard.classList.add('expanded');
        toggleBtn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    };

    toggleBtn.addEventListener('click', handleToggle);
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    });
  }

  if (bibtexBtn) {
    const bibtexCitation = `@inproceedings{singh2025senns,
  author={Singh, Suyash and others},
  booktitle={2025 International Conference on Distributed Computing and Data Science (ICDDS)},
  title={Self-Erasing Neural Networks (SENNs): GDPR-Compliant Unlearning Frameworks for Deep Architectures},
  year={2025},
  publisher={IEEE}
}`;

    bibtexBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bibtexCitation)
          .then(() => {
            showToast('✓ BibTeX citation copied to clipboard!');
          })
          .catch(() => {
            showToast('✓ BibTeX citation ready to copy.');
          });
      }
    });
  }
}

/**
 * Accordions
 */
function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        items.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
          const otherHeader = otherItem.querySelector('.accordion-header');
          if (otherHeader) {
            otherHeader.setAttribute('aria-expanded', 'false');
          }
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        }
      });
    }
  });
}

/**
 * Top Nav Scrollspy & Smooth Scroll
 */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section-block');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const offsetPosition = (elementRect - bodyRect) - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', () => {
    let currentActive = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        currentActive = section.id;
      }
    });

    if (currentActive) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.remove('active');
          if (href === `#${currentActive}`) {
            link.classList.add('active');
          }
        }
      });
      
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
      mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.remove('active');
          if (href === `#${currentActive}`) {
            link.classList.add('active');
          }
        }
      });
    }
  });
}

/**
 * Live IST Clock
 */
function initClock() {
  const timeEl = document.getElementById('local-time');
  if (!timeEl) return;

  const updateClock = () => {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    try {
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(new Date());
      
      let hour = '', minute = '', second = '', dayPeriod = '';
      for (const part of parts) {
        if (part.type === 'hour') hour = part.value;
        else if (part.type === 'minute') minute = part.value;
        else if (part.type === 'second') second = part.value;
        else if (part.type === 'dayPeriod') dayPeriod = part.value.toUpperCase();
      }
      
      timeEl.textContent = `${hour}:${minute}:${second} ${dayPeriod}`;
    } catch (e) {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString();
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen.toString());
  });

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      mobileNav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');

      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetSection.getBoundingClientRect().top;
          const offsetPosition = (elementRect - bodyRect) - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * Real-Time Visitor Counter
 */
function initVisitorCounter() {
  const counterEl = document.getElementById('visitor-count');
  if (!counterEl) return;

  const BASE_OFFSET = 184;
  const defaultCount = BASE_OFFSET + 3;
  const cached = localStorage.getItem('cached_visitor_count');
  let startValue = defaultCount;

  if (cached) {
    const parsed = parseInt(cached, 10);
    startValue = (parsed >= BASE_OFFSET) ? parsed : defaultCount;
    counterEl.textContent = startValue.toLocaleString();
  }

  const hasVisited = sessionStorage.getItem('portfolio_session_visited');
  const action = hasVisited ? 'view' : 'up';
  const url = `https://counterapi.com/api/suyash-singh-portfolio/${action}/visits`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data && typeof data.value === 'number') {
        const totalVisits = BASE_OFFSET + data.value;
        sessionStorage.setItem('portfolio_session_visited', 'true');
        localStorage.setItem('cached_visitor_count', totalVisits.toString());
        animateCount(counterEl, startValue, totalVisits);
      }
    })
    .catch(err => {
      console.warn('Could not fetch real-time visitor count:', err);
      if (!cached) {
        counterEl.textContent = defaultCount.toLocaleString();
      }
    });
}

function animateCount(element, start, end, duration = 800) {
  if (start === end) {
    element.textContent = end.toLocaleString();
    return;
  }
  const startTime = performance.now();
  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    element.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString();
    }
  };
  requestAnimationFrame(step);
}

/**
 * Real-Time GitHub Contributions Fetcher with Session Caching
 */
function initGithubContributions() {
  const svg = document.getElementById('github-heatmap-svg');
  if (!svg) return;

  const cachedHtml = sessionStorage.getItem('github_contrib_svg_html');
  const cachedTotal = sessionStorage.getItem('github_contrib_total');

  if (cachedHtml && cachedTotal) {
    svg.innerHTML = cachedHtml;
    const totalEl = document.getElementById('github-contrib-text');
    if (totalEl) totalEl.textContent = cachedTotal;
  }

  const url = 'https://github-contributions-api.jogruber.de/v4/anothercodingguy?y=last';

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
        const total = data.total && typeof data.total.lastYear === 'number' ? data.total.lastYear : 1056;
        const totalText = `${total} contributions in the last year`;
        const totalEl = document.getElementById('github-contrib-text');
        if (totalEl) {
          totalEl.textContent = totalText;
        }

        const days = data.contributions;
        const weeks = [];
        let currentWeek = [];
        for (const day of days) {
          currentWeek.push(day);
          if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
          }
        }
        if (currentWeek.length > 0) {
          while (currentWeek.length < 7) {
            currentWeek.push({ date: '', count: 0, level: 0 });
          }
          weeks.push(currentWeek);
        }

        const recentWeeks = weeks.slice(-53);
        const cellSize = 10;
        const gap = 3;
        let rectsHtml = '';

        recentWeeks.forEach((week, wIdx) => {
          const x = wIdx * (cellSize + gap);
          week.forEach((day, dIdx) => {
            const y = dIdx * (cellSize + gap);
            const lvl = day.level || 0;
            const cnt = day.count || 0;
            const dt = day.date || '';
            const tip = dt ? `${cnt} contributions on ${dt}` : 'No contributions';
            rectsHtml += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" class="contrib-cell lvl-${lvl}" data-date="${dt}" data-count="${cnt}"><title>${tip}</title></rect>`;
          });
        });

        svg.innerHTML = rectsHtml;
        sessionStorage.setItem('github_contrib_svg_html', rectsHtml);
        sessionStorage.setItem('github_contrib_total', totalText);
      }
    })
    .catch(err => {
      console.warn('Live GitHub contribution fetch:', err);
    });
}
