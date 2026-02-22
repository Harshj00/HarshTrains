const App = {
    // Current state
    currentScreen: 'dashboardScreen',
    isWorkoutActive: false,
    workoutStartTime: null,
    workoutTimerInterval: null,
    selectedExercise: null,

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.updateGreeting();
        this.checkActiveWorkout();
        this.setupSearch();
        console.log('🏋️ Lyfta Clone initialized!');
    },

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.navigateTo(screen);
            });
        });

        // Header buttons
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.openSearch();
        });

        document.getElementById('profileBtn').addEventListener('click', () => {
            this.navigateTo('profileScreen');
        });

        // Search
        document.getElementById('closeSearch').addEventListener('click', () => {
            this.closeSearch();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Start workout button
        document.getElementById('startWorkoutBtn').addEventListener('click', () => {
            this.startNewWorkout();
        });

        // Muscle map preview
        document.getElementById('musclePreviewCard').addEventListener('click', () => {
            this.navigateTo('muscleScreen');
        });

        document.getElementById('viewMuscleMap').addEventListener('click', () => {
            this.navigateTo('muscleScreen');
        });

        // Profile settings
        this.setupProfileListeners();

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Exercise detail modal close
        document.getElementById('closeExerciseModal').addEventListener('click', () => {
            this.closeModal('exerciseDetailModal');
        });

        // Floating workout
        document.getElementById('expandWorkout').addEventListener('click', () => {
            this.expandActiveWorkout();
        });
    },

    setupProfileListeners() {
        // Weight unit toggle
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                UserData.updateSetting('weightUnit', e.target.dataset.unit);
            });
        });

        // Rest timer select
        document.getElementById('restTimerSelect').addEventListener('change', (e) => {
            UserData.updateSetting('restTimer', parseInt(e.target.value));
        });

        // Notification toggle
        document.getElementById('notificationToggle').addEventListener('change', (e) => {
            UserData.updateSetting('notifications', e.target.checked);
        });

        // Haptic toggle
        document.getElementById('hapticToggle').addEventListener('change', (e) => {
            UserData.updateSetting('hapticFeedback', e.target.checked);
        });

        // Export data
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Clear data
        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.confirmClearData();
        });
    },

    // ==========================================
    // NAVIGATION
    // ==========================================
    navigateTo(screenId) {
        // Update screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenId) {
                item.classList.add('active');
            }
        });

        this.currentScreen = screenId;

        // Load screen specific content
        switch(screenId) {
            case 'dashboardScreen':
                this.loadDashboard();
                break;
            case 'exercisesScreen':
                Exercises.loadExercises();
                break;
            case 'muscleScreen':
                Muscles.init();
                break;
            case 'workoutScreen':
                this.loadWorkoutScreen();
                break;
            case 'profileScreen':
                this.loadProfile();
                break;
        }

        // Haptic feedback
        this.hapticFeedback();
    },

    // ==========================================
    // DASHBOARD
    // ==========================================
    loadDashboard() {
        const stats = UserData.getStats();
        
        // Update stats
        document.getElementById('weeklyWorkouts').textContent = stats.weeklyWorkouts || 0;
        document.getElementById('totalWorkouts').textContent = stats.totalWorkouts || 0;
        document.getElementById('currentStreak').textContent = stats.currentStreak || 0;
        document.getElementById('totalVolume').textContent = UserData.formatVolume(stats.totalVolume || 0);

        // Update muscle preview
        this.updateMusclePreview();

        // Load recent workouts
        this.loadRecentWorkouts();
        
        // Load analytics section
        this.loadDashboardAnalytics();
    },

    loadDashboardAnalytics() {
        // Check if analytics section exists, if not create it
        let analyticsSection = document.getElementById('dashboardAnalytics');
        
        if (!analyticsSection) {
            const screenContent = document.querySelector('#dashboardScreen .screen-content');
            
            const analyticsHtml = `
                <div class="section-header">
                    <h2>Analytics</h2>
                </div>
                <div id="dashboardAnalytics">
                    <div id="weeklyVolumeChart"></div>
                    <div id="activityHeatmap"></div>
                </div>
                
                <div class="section-header">
                    <h2>Personal Records</h2>
                    <button class="see-all-btn" id="viewAllRecords">See All</button>
                </div>
                <div id="recentRecords"></div>
                
                <div class="section-header">
                    <h2>Reminders</h2>
                </div>
                <div id="reminderSection"></div>
            `;
            
            screenContent.insertAdjacentHTML('beforeend', analyticsHtml);
            
            // Setup view all records
            document.getElementById('viewAllRecords')?.addEventListener('click', () => {
                this.showRecordsModal();
            });
        }

        // Render charts (with safety checks)
        if (typeof Charts !== 'undefined') {
            Charts.createWeeklyVolumeChart('#weeklyVolumeChart');
            
            // Render heatmap
            const workouts = UserData.getWorkouts() || [];
            const heatmapData = workouts.map(w => ({
                date: w.date?.split('T')[0],
                value: 1
            }));
            Charts.createHeatmap('#activityHeatmap', heatmapData, {
                title: 'Workout Activity',
                weeks: 8
            });
        }

        // Render records (with safety check)
        if (typeof Records !== 'undefined') {
            Records.renderRecordsList(document.getElementById('recentRecords'));
        }
        
        // Render reminders (with safety check)
        if (typeof Reminders !== 'undefined') {
            Reminders.renderRemindersUI(document.getElementById('reminderSection'));
        }
    },

    showRecordsModal() {
        // Safety check
        if (typeof Records === 'undefined') {
            this.showToast('Records feature not available', 'error');
            return;
        }

        const records = Records.getAllRecords();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Personal Records</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" id="allRecordsList">
                    ${records.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-trophy"></i>
                            <p>No records yet</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        if (records.length > 0) {
            Records.renderRecordsList(document.getElementById('allRecordsList'));
        }
        
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good Evening';
        
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 17) greeting = 'Good Afternoon';
        
        document.getElementById('greeting').textContent = greeting;
    },

    updateMusclePreview() {
        const stats = UserData.getStats();
        const muscleBars = document.querySelectorAll('.muscle-preview-card .muscle-fill');
        const muscles = ['chest', 'back', 'legs'];
        
        muscleBars.forEach((bar, index) => {
            const percentage = UserData.getMuscleActivityPercentage(muscles[index]);
            bar.style.width = `${percentage}%`;
        });
    },

    loadRecentWorkouts() {
        const container = document.getElementById('recentWorkouts');
        const workouts = UserData.getRecentWorkouts(5);

        if (workouts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>No workouts yet</p>
                    <span>Start your first workout!</span>
                </div>
            `;
            return;
        }

        container.innerHTML = workouts.map(workout => `
            <div class="workout-card" data-id="${workout.id}">
                <div class="workout-card-icon">
                    <i class="fas fa-dumbbell"></i>
                </div>
                <div class="workout-card-info">
                    <h3>${workout.name || 'Workout'}</h3>
                    <p>${workout.exercises.length} exercises · ${workout.totalSets || 0} sets</p>
                </div>
                <div class="workout-card-meta">
                    <span class="date">${UserData.formatDate(workout.date)}</span>
                    <span class="duration">${UserData.formatDuration(workout.duration || 0)}</span>
                </div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.workout-card').forEach(card => {
            card.addEventListener('click', () => {
                this.viewWorkoutDetails(card.dataset.id);
            });
        });
    },

    // ==========================================
    // WORKOUT SCREEN
    // ==========================================
        loadWorkoutScreen() {
        this.loadWorkoutHistory();
        this.setupTemplateListeners();
        
        // Render templates using Templates module
        if (typeof Templates !== 'undefined') {
            Templates.renderTemplatesList();
        }
    },

    setupTemplateListeners() {
        // Create template button
        const createBtn = document.getElementById('createTemplateBtn');
        if (createBtn) {
            // Remove old listener by cloning
            const newBtn = createBtn.cloneNode(true);
            createBtn.parentNode.replaceChild(newBtn, createBtn);
            
            newBtn.addEventListener('click', () => {
                if (typeof Templates !== 'undefined') {
                    Templates.showCreateModal();
                } else {
                    this.showToast('Templates feature not available', 'error');
                }
            });
        }
    },

    loadWorkoutHistory() {
        const container = document.getElementById('historyList');
        const workouts = UserData.getWorkouts();

        if (workouts.length === 0) {
            container.innerHTML = `
                <div class="empty-state small">
                    <i class="fas fa-history"></i>
                    <p>No workout history</p>
                </div>
            `;
            return;
        }

        container.innerHTML = workouts.slice(0, 10).map(workout => `
            <div class="history-card" data-id="${workout.id}">
                <div class="history-header">
                    <h3>${workout.name || 'Workout'}</h3>
                    <span class="history-date">${UserData.formatDate(workout.date)}</span>
                </div>
                <div class="history-stats">
                    <div class="history-stat">
                        <i class="fas fa-dumbbell"></i>
                        <span>${workout.exercises.length} exercises</span>
                    </div>
                    <div class="history-stat">
                        <i class="fas fa-clock"></i>
                        <span>${UserData.formatDuration(workout.duration || 0)}</span>
                    </div>
                    <div class="history-stat">
                        <i class="fas fa-weight-hanging"></i>
                        <span>${UserData.formatVolume(workout.totalVolume || 0)} kg</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.history-card').forEach(card => {
            card.addEventListener('click', () => {
                this.viewWorkoutDetails(card.dataset.id);
            });
        });
    },

    viewWorkoutDetails(workoutId) {
        const workout = UserData.getWorkoutById(parseInt(workoutId));
        if (workout) {
            this.showToast(`Viewing ${workout.name}`, 'info');
            // TODO: Implement workout detail view
        }
    },

    // ==========================================
    // PROFILE
    // ==========================================
    loadProfile() {
        const settings = UserData.getSettings();
        const stats = UserData.getStats();

        // Update profile stats
        document.getElementById('profileTotalWorkouts').textContent = stats.totalWorkouts || 0;
        document.getElementById('profileTotalExercises').textContent = stats.totalExercises || 0;
        document.getElementById('profileTotalVolume').textContent = 
            UserData.formatVolume(stats.totalVolume || 0) + 'kg';

        // Update member since
        if (settings.memberSince) {
            const date = new Date(settings.memberSince);
            document.getElementById('memberSince').textContent = 
                date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }

        // Update settings UI
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.unit === settings.weightUnit);
        });

        document.getElementById('restTimerSelect').value = settings.restTimer || 90;
        document.getElementById('notificationToggle').checked = settings.notifications !== false;
        document.getElementById('hapticToggle').checked = settings.hapticFeedback !== false;
    },

    exportData() {
        const data = UserData.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lyfta-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
    },

    confirmClearData() {
        this.showConfirmModal(
            'Clear All Data?',
            'This will delete all your workouts, stats, and settings. This action cannot be undone.',
            () => {
                UserData.clearAllData();
                this.loadDashboard();
                this.loadProfile();
                this.showToast('All data cleared', 'success');
            },
            'danger'
        );
    },

    // ==========================================
    // SEARCH
    // ==========================================
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchOverlay = document.getElementById('searchOverlay');

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                this.closeSearch();
            }
        });
    },

    openSearch() {
        const overlay = document.getElementById('searchOverlay');
        overlay.classList.add('active');
        document.getElementById('searchInput').focus();
        document.getElementById('searchResults').innerHTML = '';
    },

    closeSearch() {
        const overlay = document.getElementById('searchOverlay');
        overlay.classList.remove('active');
        document.getElementById('searchInput').value = '';
    },

    handleSearch(query) {
        const container = document.getElementById('searchResults');

        if (query.length < 2) {
            container.innerHTML = '';
            return;
        }

        const results = ExerciseDatabase.searchExercises(query);

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No exercises found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.slice(0, 10).map(exercise => `
            <div class="search-result-item" data-id="${exercise.id}">
                <div class="search-result-icon">
                    <i class="fas ${ExerciseDatabase.getMuscleIcon(exercise.muscle)}"></i>
                </div>
                <div class="search-result-info">
                    <h4>${exercise.name}</h4>
                    <p>${exercise.muscle} · ${exercise.equipment}</p>
                </div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const exerciseId = parseInt(item.dataset.id);
                this.closeSearch();
                this.showExerciseDetail(exerciseId);
            });
        });
    },

    // ==========================================
    // EXERCISE DETAIL
    // ==========================================
    showExerciseDetail(exerciseId) {
        const exercise = ExerciseDatabase.getExerciseById(exerciseId);
        if (!exercise) return;

        this.selectedExercise = exercise;

        // Update modal content
        document.getElementById('exerciseDetailName').textContent = exercise.name;
        document.getElementById('exerciseDetailMuscle').textContent = exercise.muscle;
        document.getElementById('exerciseDetailEquipment').textContent = exercise.equipment;

        // Update instructions
        const instructionsList = document.getElementById('exerciseInstructions');
        instructionsList.innerHTML = exercise.instructions
            .map(step => `<li>${step}</li>`)
            .join('');

        // Update mini body diagram
        this.updateMiniBodyDiagram(exercise);

        // Update add button state
        const addBtn = document.getElementById('addToWorkoutBtn');
        addBtn.style.display = this.isWorkoutActive ? 'flex' : 'none';

        // Remove old listener and add new one
        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);
        newAddBtn.addEventListener('click', () => {
            Workout.addExercise(exercise.id);
            this.closeModal('exerciseDetailModal');
        });

        // Show modal
        this.openModal('exerciseDetailModal');
    },

    updateMiniBodyDiagram(exercise) {
        const container = document.getElementById('miniBodyContainer');
        
        // Create mini front and back views
        container.innerHTML = `
            <svg viewBox="0 0 200 400" class="body-svg mini-front">
                ${this.getMiniBodySvg('front', exercise.muscleHighlights.front)}
            </svg>
            <svg viewBox="0 0 200 400" class="body-svg mini-back">
                ${this.getMiniBodySvg('back', exercise.muscleHighlights.back)}
            </svg>
        `;
    },

    getMiniBodySvg(view, highlightedMuscles) {
        // Simplified body SVG for detail modal
        const isHighlighted = (id) => highlightedMuscles.includes(id) ? 'highlighted' : '';
        
        if (view === 'front') {
            return `
                <ellipse cx="100" cy="30" rx="25" ry="28" class="body-part head"/>
                <ellipse cx="55" cy="85" rx="18" ry="12" class="muscle-part ${isHighlighted('front-left-shoulder')}"/>
                <ellipse cx="145" cy="85" rx="18" ry="12" class="muscle-part ${isHighlighted('front-right-shoulder')}"/>
                <path d="M65 80 Q75 75 100 78 Q125 75 135 80 L135 115 Q100 125 65 115 Z" class="muscle-part ${isHighlighted('front-chest')}"/>
                <path d="M75 120 L75 180 Q100 185 125 180 L125 120 Q100 125 75 120" class="muscle-part ${isHighlighted('front-abs')}"/>
                <path d="M40 95 Q32 120 35 150 Q45 155 50 150 Q55 120 50 95 Z" class="muscle-part ${isHighlighted('front-left-bicep')}"/>
                <path d="M160 95 Q168 120 165 150 Q155 155 150 150 Q145 120 150 95 Z" class="muscle-part ${isHighlighted('front-right-bicep')}"/>
                <path d="M70 185 L65 260 Q80 270 95 260 L95 185 Q82 190 70 185" class="muscle-part ${isHighlighted('front-left-quad')}"/>
                <path d="M130 185 L135 260 Q120 270 105 260 L105 185 Q118 190 130 185" class="muscle-part ${isHighlighted('front-right-quad')}"/>
            `;
        } else {
            return `
                <ellipse cx="100" cy="30" rx="25" ry="28" class="body-part head"/>
                <path d="M75 55 L65 80 L135 80 L125 55 Z" class="muscle-part ${isHighlighted('back-traps')}"/>
                <ellipse cx="55" cy="90" rx="18" ry="14" class="muscle-part ${isHighlighted('back-left-delt')}"/>
                <ellipse cx="145" cy="90" rx="18" ry="14" class="muscle-part ${isHighlighted('back-right-delt')}"/>
                <path d="M60 100 L55 160 Q75 170 95 165 L95 115 Q75 120 60 100" class="muscle-part ${isHighlighted('back-left-lat')}"/>
                <path d="M140 100 L145 160 Q125 170 105 165 L105 115 Q125 120 140 100" class="muscle-part ${isHighlighted('back-right-lat')}"/>
                <path d="M38 95 Q30 125 33 155 Q43 160 52 155 Q58 125 52 95 Z" class="muscle-part ${isHighlighted('back-left-tricep')}"/>
                <path d="M162 95 Q170 125 167 155 Q157 160 148 155 Q142 125 148 95 Z" class="muscle-part ${isHighlighted('back-right-tricep')}"/>
                <ellipse cx="82" cy="200" rx="20" ry="18" class="muscle-part ${isHighlighted('back-left-glute')}"/>
                <ellipse cx="118" cy="200" rx="20" ry="18" class="muscle-part ${isHighlighted('back-right-glute')}"/>
                <path d="M65 220 L62 275 Q80 285 95 275 L95 220 Q80 225 65 220" class="muscle-part ${isHighlighted('back-left-hamstring')}"/>
                <path d="M135 220 L138 275 Q120 285 105 275 L105 220 Q120 225 135 220" class="muscle-part ${isHighlighted('back-right-hamstring')}"/>
            `;
        }
    },

    // ==========================================
    // ACTIVE WORKOUT CHECK
    // ==========================================
    checkActiveWorkout() {
        const activeWorkout = UserData.getActiveWorkout();
        
        if (activeWorkout) {
            this.isWorkoutActive = true;
            this.workoutStartTime = new Date(activeWorkout.startTime);
            Workout.currentWorkout = activeWorkout;
            Workout.startTimer();
            this.showFloatingWorkout();
        }
    },

    // ==========================================
    // START WORKOUT
    // ==========================================
    startNewWorkout() {
        if (this.isWorkoutActive) {
            this.showConfirmModal(
                'Workout in Progress',
                'You have an active workout. Do you want to discard it and start a new one?',
                () => {
                    Workout.discardWorkout();
                    Workout.startNewWorkout();
                },
                'danger'
            );
        } else {
            Workout.startNewWorkout();
        }
    },

    startWorkoutFromTemplate(templateId) {
        const template = ExerciseDatabase.templates[templateId];
        
        if (!template) {
            this.showToast('Template not found', 'error');
            return;
        }

        if (this.isWorkoutActive) {
            this.showConfirmModal(
                'Workout in Progress',
                'You have an active workout. Do you want to discard it and start from template?',
                () => {
                    Workout.discardWorkout();
                    Workout.startFromTemplate(template);
                },
                'danger'
            );
        } else {
            Workout.startFromTemplate(template);
        }
    },

    // ==========================================
    // FLOATING WORKOUT
    // ==========================================
    showFloatingWorkout() {
        document.getElementById('floatingWorkout').style.display = 'flex';
    },

    hideFloatingWorkout() {
        document.getElementById('floatingWorkout').style.display = 'none';
    },

    expandActiveWorkout() {
        document.getElementById('activeWorkoutScreen').classList.add('active');
    },

    // ==========================================
    // MODALS
    // ==========================================
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    showConfirmModal(title, message, onConfirm, type = 'danger') {
        // Create modal dynamically
        const modal = document.createElement('div');
        modal.className = 'confirm-modal active';
        modal.innerHTML = `
            <div class="confirm-content">
                <div class="confirm-icon">
                    <i class="fas ${type === 'danger' ? 'fa-exclamation-triangle' : 'fa-question-circle'}"></i>
                </div>
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn cancel">Cancel</button>
                    <button class="confirm-btn ${type}">${type === 'danger' ? 'Delete' : 'Confirm'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector(`.${type}`).addEventListener('click', () => {
            onConfirm();
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // ==========================================
    // TOASTS
    // ==========================================
    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);

        this.hapticFeedback();
    },

    // ==========================================
    // HAPTIC FEEDBACK
    // ==========================================
    hapticFeedback(type = 'light') {
        const settings = UserData.getSettings();
        
        if (settings.hapticFeedback && 'vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 20],
                error: [30, 50, 30]
            };
            navigator.vibrate(patterns[type] || patterns.light);
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});