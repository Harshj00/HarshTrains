/* ========================================
   LYFTA CLONE - UTILITIES
   ======================================== */

const Utils = {
    // ==========================================
    // RIPPLE EFFECT
    // ==========================================
    addRipple(element, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    },

    // ==========================================
    // DEBOUNCE
    // ==========================================
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // ==========================================
    // THROTTLE
    // ==========================================
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // ==========================================
    // ANIMATE COUNTER
    // ==========================================
    animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + range * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    },

    // ==========================================
    // FORMAT HELPERS
    // ==========================================
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    },

    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    formatDate(date) {
        const d = new Date(date);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    },

    formatRelativeTime(date) {
        const now = new Date();
        const d = new Date(date);
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return this.formatDate(date);
    },

    // ==========================================
    // DOM HELPERS
    // ==========================================
    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return document.querySelectorAll(selector);
    },

    createElement(tag, className, innerHTML) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    },

    // ==========================================
    // STORAGE HELPERS
    // ==========================================
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    },

    // ==========================================
    // VALIDATION
    // ==========================================
    isValidNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // ==========================================
    // COLOR HELPERS
    // ==========================================
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    // ==========================================
    // RANDOM HELPERS
    // ==========================================
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // ==========================================
    // UUID GENERATOR
    // ==========================================
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // ==========================================
    // COPY TO CLIPBOARD
    // ==========================================
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    },

    // ==========================================
    // VIBRATION
    // ==========================================
    vibrate(pattern = [10]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },

    // ==========================================
    // INSTALL PROMPT
    // ==========================================
    deferredPrompt: null,

    initInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
    },

    showInstallButton() {
        // Can show an install button in UI
        console.log('📱 App can be installed');
    },

    async promptInstall() {
        if (!this.deferredPrompt) return false;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        this.deferredPrompt = null;
        
        return outcome === 'accepted';
    }
};

// Add ripple effect to interactive elements
document.addEventListener('click', (e) => {
    const target = e.target.closest('.nav-item, .filter-chip, .set-check, .template-card');
    if (target) {
        Utils.addRipple(target, e);
    }
});

// Initialize install prompt
Utils.initInstallPrompt();