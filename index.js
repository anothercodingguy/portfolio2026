document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccordions();
  initVisitorCounter();
  initScrollSpy();
  initClock();
});

/**
 * Theme Toggle & System Preference Sync
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Apply theme
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    updateThemeIcon(theme);
  };

  // Get current active theme
  const getActiveTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Update button SVG based on active theme
  const updateThemeIcon = (theme) => {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      // Show sun icon
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      `;
    } else {
      // Show moon icon
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      `;
    }
  };

  // Initialize
  const initialTheme = getActiveTheme();
  applyTheme(initialTheme);

  // Toggle on click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Sync with OS settings changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Radix-Style Collapsible Accordions
 */
function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Collapse all items first (Single Accordion Behavior)
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

        // Toggle selected item
        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          // Set fluid height based on content scroll height
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
 * LocalStorage Visitor Counter Simulation
 */
function initVisitorCounter() {
  const visitorCountEl = document.getElementById('visitor-count');
  if (!visitorCountEl) return;

  let count = localStorage.getItem('portfolio_visitors');
  // Reset if not set, or if it has the old high seed (>1000)
  if (!count || parseInt(count, 10) > 1000) {
    // Generate a smaller seed count for the simulation
    count = Math.floor(Math.random() * 40) + 120;
  } else {
    count = parseInt(count, 10);
  }

  // Increment visitor count on page refresh
  count += 1;
  localStorage.setItem('portfolio_visitors', count);

  // Format count with local commas (e.g. 12,401)
  visitorCountEl.textContent = count.toLocaleString();
}

/**
 * Bottom Dock Scrollspy & Section Smooth Scroll
 */
function initScrollSpy() {
  const dockItems = document.querySelectorAll('.dock-nav-item');
  const sections = document.querySelectorAll('section, header');

  // Smooth scroll logic
  dockItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Scroll with offset for styling top mask
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Track active section on scroll
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
      dockItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === currentActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/**
 * Live Indian Standard Time (IST) Clock
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
      // Fallback in case Intl is not fully supported
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString();
    }
  };

  // Run immediately and then update every second
  updateClock();
  setInterval(updateClock, 1000);
}
