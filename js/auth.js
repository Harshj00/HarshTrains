const Auth = {
    currentUser: null,
    token: null,
    isOnline: true,

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.checkOnlineStatus();
        this.checkAuthStatus();
        this.addAuthStyles();
        this.setupNetworkListeners();
    },

    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
    },

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            App.showToast('Back online! Syncing data...', 'success');
            this.syncData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            App.showToast('You\'re offline. Data saved locally.', 'warning');
        });
    },

    // ==========================================
    // AUTH STATUS CHECK
    // ==========================================
    async checkAuthStatus() {
        const token = localStorage.getItem('lyfta_token');
        
        if (token) {
            this.token = token;
            
            try {
                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        this.currentUser = data.data;
                        this.updateUIForLoggedInUser();
                        return true;
                    }
                }
            } catch (error) {
                console.log('Auth check failed - using local mode');
            }
        }

        // Not logged in - show login prompt or continue with local mode
        this.showAuthPrompt();
        return false;
    },

    // ==========================================
    // REGISTER
    // ==========================================
    async register(name, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('lyfta_token', data.token);
                
                // Sync local data to new account
                await this.syncLocalDataToCloud();
                
                this.updateUIForLoggedInUser();
                this.closeAuthModal();
                App.showToast(`Welcome, ${data.user.name}!`, 'success');
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    // ==========================================
    // LOGIN
    // ==========================================
    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('lyfta_token', data.token);
                
                // Load user data from cloud
                await this.loadCloudData();
                
                this.updateUIForLoggedInUser();
                this.closeAuthModal();
                App.showToast(`Welcome back, ${data.user.name}!`, 'success');
                App.loadDashboard();
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    // ==========================================
    // LOGOUT
    // ==========================================
    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.log('Logout request failed');
        }

        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('lyfta_token');
        
        this.updateUIForLoggedOutUser();
        App.showToast('Logged out successfully', 'info');
        App.loadDashboard();
    },

    // ==========================================
    // SYNC DATA
    // ==========================================
    async syncLocalDataToCloud() {
        if (!this.token || !this.isOnline) return;

        try {
            const workouts = UserData.getWorkouts() || [];
            const templates = Templates.getCustomTemplates() || [];
            const settings = UserData.getSettings();
            const stats = UserData.getStats();

            await fetch('/api/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    workouts,
                    templates,
                    settings,
                    stats
                })
            });

            console.log('✅ Local data synced to cloud');
        } catch (error) {
            console.error('Sync failed:', error);
        }
    },

    async loadCloudData() {
        if (!this.token || !this.isOnline) return;

        try {
            // Load workouts
            const workoutsRes = await fetch('/api/workouts', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const workoutsData = await workoutsRes.json();
            if (workoutsData.success) {
                localStorage.setItem('lyfta_workouts', JSON.stringify(workoutsData.data));
            }

            // Load templates
            const templatesRes = await fetch('/api/templates', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const templatesData = await templatesRes.json();
            if (templatesData.success) {
                localStorage.setItem('lyfta_custom_templates', JSON.stringify(templatesData.data));
            }

            // Load settings and stats from user
            if (this.currentUser) {
                if (this.currentUser.settings) {
                    localStorage.setItem('lyfta_settings', JSON.stringify(this.currentUser.settings));
                }
                if (this.currentUser.stats) {
                    localStorage.setItem('lyfta_stats', JSON.stringify(this.currentUser.stats));
                }
            }

            console.log('✅ Cloud data loaded');
        } catch (error) {
            console.error('Load cloud data failed:', error);
        }
    },

    async syncData() {
        if (!this.token || !this.isOnline) return;
        await this.syncLocalDataToCloud();
    },

    // ==========================================
    // SAVE WORKOUT TO CLOUD
    // ==========================================
    async saveWorkoutToCloud(workout) {
        if (!this.token || !this.isOnline) return;

        try {
            await fetch('/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(workout)
            });
        } catch (error) {
            console.error('Save workout to cloud failed:', error);
        }
    },

    // ==========================================
    // SAVE TEMPLATE TO CLOUD
    // ==========================================
    async saveTemplateToCloud(template) {
        if (!this.token || !this.isOnline) return;

        try {
            await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(template)
            });
        } catch (error) {
            console.error('Save template to cloud failed:', error);
        }
    },

    // ==========================================
    // UI UPDATES
    // ==========================================
    updateUIForLoggedInUser() {
        // Update profile
        const userName = document.getElementById('userName');
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
        }

        // Update profile avatar area
        const profileHeader = document.querySelector('.profile-header');
        if (profileHeader && this.currentUser) {
            const avatar = profileHeader.querySelector('.profile-avatar');
            if (avatar) {
                avatar.innerHTML = `<span class="avatar-initial">${this.currentUser.name.charAt(0).toUpperCase()}</span>`;
            }
        }

        // Show logout button, hide login
        this.updateAuthButtons(true);

        // Add sync indicator
        this.addSyncIndicator();
    },

    updateUIForLoggedOutUser() {
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = 'Athlete';
        }

        this.updateAuthButtons(false);
        this.removeSyncIndicator();
    },

    updateAuthButtons(isLoggedIn) {
        const profileScreen = document.getElementById('profileScreen');
        if (!profileScreen) return;

        // Remove existing auth buttons
        const existingAuthSection = profileScreen.querySelector('.auth-section');
        if (existingAuthSection) {
            existingAuthSection.remove();
        }

        // Add auth section
        const settingsSection = profileScreen.querySelector('.settings-section');
        if (settingsSection) {
            const authHtml = isLoggedIn ? `
                <div class="auth-section">
                    <div class="logged-in-info">
                        <i class="fas fa-cloud-check"></i>
                        <div>
                            <span class="logged-in-email">${this.currentUser?.email || ''}</span>
                            <span class="logged-in-status">Synced to cloud</span>
                        </div>
                    </div>
                    <button class="logout-btn" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            ` : `
                <div class="auth-section">
                    <div class="auth-promo">
                        <i class="fas fa-cloud"></i>
                        <h3>Sync Your Data</h3>
                        <p>Create an account to save your workouts across devices</p>
                    </div>
                    <button class="login-btn" id="loginBtn">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Login / Sign Up</span>
                    </button>
                </div>
            `;

            settingsSection.insertAdjacentHTML('beforebegin', authHtml);

            // Add event listeners
            if (isLoggedIn) {
                document.getElementById('logoutBtn')?.addEventListener('click', () => {
                    App.showConfirmModal(
                        'Logout?',
                        'You will need to login again to sync your data.',
                        () => this.logout(),
                        'danger'
                    );
                });
            } else {
                document.getElementById('loginBtn')?.addEventListener('click', () => {
                    this.showAuthModal();
                });
            }
        }
    },

    addSyncIndicator() {
        if (document.getElementById('syncIndicator')) return;

        const header = document.querySelector('.app-header .header-right');
        if (header) {
            const indicator = document.createElement('div');
            indicator.id = 'syncIndicator';
            indicator.className = 'sync-indicator';
            indicator.innerHTML = '<i class="fas fa-cloud"></i>';
            indicator.title = 'Synced to cloud';
            header.insertBefore(indicator, header.firstChild);
        }
    },

    removeSyncIndicator() {
        const indicator = document.getElementById('syncIndicator');
        if (indicator) {
            indicator.remove();
        }
    },

    // ==========================================
    // AUTH MODALS
    // ==========================================
    showAuthPrompt() {
        // Don't show immediately - let user explore first
        setTimeout(() => {
            if (!this.currentUser && !sessionStorage.getItem('authPromptShown')) {
                this.showAuthBanner();
                sessionStorage.setItem('authPromptShown', 'true');
            }
        }, 30000); // Show after 30 seconds
    },

    showAuthBanner() {
        if (document.getElementById('authBanner')) return;

        const banner = document.createElement('div');
        banner.id = 'authBanner';
        banner.className = 'auth-banner';
        banner.innerHTML = `
            <div class="auth-banner-content">
                <i class="fas fa-cloud"></i>
                <span>Create an account to sync your data across devices</span>
                <button class="auth-banner-btn" id="authBannerBtn">Sign Up</button>
                <button class="auth-banner-close" id="authBannerClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('authBannerBtn').addEventListener('click', () => {
            banner.remove();
            this.showAuthModal('register');
        });

        document.getElementById('authBannerClose').addEventListener('click', () => {
            banner.remove();
        });

        // Auto hide after 10 seconds
        setTimeout(() => {
            if (banner.parentNode) {
                banner.classList.add('hiding');
                setTimeout(() => banner.remove(), 300);
            }
        }, 10000);
    },

    showAuthModal(mode = 'login') {
        const modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'auth-modal active';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <button class="auth-modal-close" id="closeAuthModal">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="auth-modal-header">
                    <div class="auth-logo">
                        <i class="fas fa-dumbbell"></i>
                    </div>
                    <h2 id="authModalTitle">${mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    <p id="authModalSubtitle">${mode === 'login' ? 'Login to sync your data' : 'Sign up to save your progress'}</p>
                </div>
                
                <div class="auth-modal-body">
                    <!-- Login Form -->
                    <form id="loginForm" class="${mode === 'login' ? 'active' : ''}">
                        <div class="auth-input-group">
                            <i class="fas fa-envelope"></i>
                            <input type="email" id="loginEmail" placeholder="Email" required>
                        </div>
                        <div class="auth-input-group">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="loginPassword" placeholder="Password" required>
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <span>Login</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                    
                    <!-- Register Form -->
                    <form id="registerForm" class="${mode === 'register' ? 'active' : ''}">
                        <div class="auth-input-group">
                            <i class="fas fa-user"></i>
                            <input type="text" id="registerName" placeholder="Your Name" required>
                        </div>
                        <div class="auth-input-group">
                            <i class="fas fa-envelope"></i>
                            <input type="email" id="registerEmail" placeholder="Email" required>
                        </div>
                        <div class="auth-input-group">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="registerPassword" placeholder="Password (min 6 characters)" required minlength="6">
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <span>Create Account</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                    
                    <div class="auth-error" id="authError"></div>
                    
                    <div class="auth-switch">
                        <span id="authSwitchText">${mode === 'login' ? "Don't have an account?" : "Already have an account?"}</span>
                        <button type="button" id="authSwitchBtn">${mode === 'login' ? 'Sign Up' : 'Login'}</button>
                    </div>
                </div>
                
                <div class="auth-modal-footer">
                    <p>Your data is securely stored and synced across devices</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        let currentMode = mode;

        // Close button
        document.getElementById('closeAuthModal').addEventListener('click', () => {
            this.closeAuthModal();
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAuthModal();
            }
        });

        // Switch between login and register
        document.getElementById('authSwitchBtn').addEventListener('click', () => {
            currentMode = currentMode === 'login' ? 'register' : 'login';
            
            document.getElementById('loginForm').classList.toggle('active', currentMode === 'login');
            document.getElementById('registerForm').classList.toggle('active', currentMode === 'register');
            document.getElementById('authModalTitle').textContent = currentMode === 'login' ? 'Welcome Back' : 'Create Account';
            document.getElementById('authModalSubtitle').textContent = currentMode === 'login' ? 'Login to sync your data' : 'Sign up to save your progress';
            document.getElementById('authSwitchText').textContent = currentMode === 'login' ? "Don't have an account?" : "Already have an account?";
            document.getElementById('authSwitchBtn').textContent = currentMode === 'login' ? 'Sign Up' : 'Login';
            document.getElementById('authError').textContent = '';
        });

        // Login form submit
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const submitBtn = e.target.querySelector('.auth-submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const result = await this.login(email, password);
            
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            if (!result.success) {
                document.getElementById('authError').textContent = result.error;
            }
        });

        // Register form submit
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            const submitBtn = e.target.querySelector('.auth-submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const result = await this.register(name, email, password);
            
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            if (!result.success) {
                document.getElementById('authError').textContent = result.error;
            }
        });
    },

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    },

    // ==========================================
    // STYLES
    // ==========================================
    addAuthStyles() {
        if (document.getElementById('auth-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'auth-styles';
        styles.textContent = `
            /* ==========================================
               SYNC INDICATOR
               ========================================== */
            .sync-indicator {
                width: 32px;
                height: 32px;
                background: rgba(34, 197, 94, 0.2);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--success);
                font-size: 0.9rem;
            }

            /* ==========================================
               AUTH SECTION IN PROFILE
               ========================================== */
            .auth-section {
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                margin-bottom: var(--space-xl);
            }

            .logged-in-info {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                margin-bottom: var(--space-md);
            }

            .logged-in-info i {
                font-size: 1.5rem;
                color: var(--success);
            }

            .logged-in-info div {
                display: flex;
                flex-direction: column;
            }

            .logged-in-email {
                font-size: 0.95rem;
                font-weight: 500;
            }

            .logged-in-status {
                font-size: 0.8rem;
                color: var(--success);
            }

            .logout-btn,
            .login-btn {
                width: 100%;
                padding: var(--space-md);
                border: none;
                border-radius: var(--radius-lg);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
                transition: var(--transition-fast);
            }

            .logout-btn {
                background: rgba(239, 68, 68, 0.1);
                color: var(--error);
            }

            .logout-btn:hover {
                background: rgba(239, 68, 68, 0.2);
            }

            .login-btn {
                background: var(--accent-gradient);
                color: white;
            }

            .login-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }

            .auth-promo {
                text-align: center;
                margin-bottom: var(--space-lg);
            }

            .auth-promo i {
                font-size: 2.5rem;
                color: var(--accent-primary);
                margin-bottom: var(--space-md);
            }

            .auth-promo h3 {
                font-size: 1.1rem;
                margin-bottom: var(--space-xs);
            }

            .auth-promo p {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }

            /* ==========================================
               AUTH BANNER
               ========================================== */
            .auth-banner {
                position: fixed;
                bottom: calc(var(--nav-height) + var(--space-md));
                left: 50%;
                transform: translateX(-50%);
                width: calc(100% - 32px);
                max-width: 448px;
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                z-index: 80;
                box-shadow: var(--shadow-lg);
                animation: slideUp 0.3s ease;
                border: 1px solid var(--bg-tertiary);
            }

            .auth-banner.hiding {
                animation: slideDown 0.3s ease forwards;
            }

            @keyframes slideDown {
                to {
                    transform: translateX(-50%) translateY(100px);
                    opacity: 0;
                }
            }

            .auth-banner-content {
                display: flex;
                align-items: center;
                gap: var(--space-md);
            }

            .auth-banner-content > i {
                font-size: 1.5rem;
                color: var(--accent-primary);
            }

            .auth-banner-content > span {
                flex: 1;
                font-size: 0.85rem;
                color: var(--text-secondary);
            }

            .auth-banner-btn {
                padding: var(--space-sm) var(--space-md);
                background: var(--accent-primary);
                border: none;
                border-radius: var(--radius-md);
                color: white;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
            }

            .auth-banner-close {
                background: none;
                border: none;
                color: var(--text-tertiary);
                cursor: pointer;
                padding: var(--space-xs);
            }

            /* ==========================================
               AUTH MODAL
               ========================================== */
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .auth-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .auth-modal-content {
                width: calc(100% - 32px);
                max-width: 400px;
                background: var(--bg-secondary);
                border-radius: var(--radius-xl);
                overflow: hidden;
                transform: scale(0.9) translateY(20px);
                transition: transform 0.3s ease;
                position: relative;
            }

            .auth-modal.active .auth-modal-content {
                transform: scale(1) translateY(0);
            }

            .auth-modal-close {
                position: absolute;
                top: var(--space-md);
                right: var(--space-md);
                width: 36px;
                height: 36px;
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-full);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
                transition: var(--transition-fast);
            }

            .auth-modal-close:hover {
                background: var(--bg-card-hover);
                color: var(--text-primary);
            }

            .auth-modal-header {
                text-align: center;
                padding: var(--space-xl) var(--space-lg) var(--space-lg);
                background: var(--accent-gradient);
            }

            .auth-logo {
                width: 70px;
                height: 70px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto var(--space-md);
            }

            .auth-logo i {
                font-size: 2rem;
                color: white;
            }

            .auth-modal-header h2 {
                font-size: 1.5rem;
                color: white;
                margin-bottom: var(--space-xs);
            }

            .auth-modal-header p {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);
            }

            .auth-modal-body {
                padding: var(--space-lg);
            }

            .auth-modal-body form {
                display: none;
            }

            .auth-modal-body form.active {
                display: block;
            }

            .auth-input-group {
                position: relative;
                margin-bottom: var(--space-md);
            }

            .auth-input-group i {
                position: absolute;
                left: var(--space-md);
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-tertiary);
            }

            .auth-input-group input {
                width: 100%;
                padding: var(--space-md);
                padding-left: 45px;
                background: var(--bg-tertiary);
                border: 2px solid transparent;
                border-radius: var(--radius-lg);
                color: var(--text-primary);
                font-size: 1rem;
                outline: none;
                transition: var(--transition-fast);
            }

            .auth-input-group input:focus {
                border-color: var(--accent-primary);
            }

            .auth-input-group input::placeholder {
                color: var(--text-tertiary);
            }

            .auth-submit-btn {
                width: 100%;
                padding: var(--space-md);
                background: var(--accent-gradient);
                border: none;
                border-radius: var(--radius-lg);
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
                transition: var(--transition-fast);
                margin-top: var(--space-md);
            }

            .auth-submit-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }

            .auth-submit-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .auth-submit-btn.loading span {
                display: none;
            }

            .auth-submit-btn.loading::after {
                content: '';
                width: 20px;
                height: 20px;
                border: 2px solid white;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .auth-error {
                color: var(--error);
                font-size: 0.85rem;
                text-align: center;
                margin-top: var(--space-md);
                min-height: 20px;
            }

            .auth-switch {
                text-align: center;
                margin-top: var(--space-lg);
                padding-top: var(--space-lg);
                border-top: 1px solid var(--bg-tertiary);
            }

            .auth-switch span {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .auth-switch button {
                background: none;
                border: none;
                color: var(--accent-primary);
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                margin-left: var(--space-xs);
            }

            .auth-modal-footer {
                text-align: center;
                padding: var(--space-md) var(--space-lg) var(--space-lg);
            }

            .auth-modal-footer p {
                font-size: 0.8rem;
                color: var(--text-tertiary);
            }

            /* Avatar Initial */
            .avatar-initial {
                font-size: 2rem;
                font-weight: 700;
                color: white;
            }
        `;

        document.head.appendChild(styles);
    }
};

// Initialize Auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});