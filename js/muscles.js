const Muscles = {
    selectedMuscle: null,
    currentView: 'front',

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.setupEventListeners();
        this.updateMuscleActivity();
        this.updateActivityGrid();
    },

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // View toggle
        document.getElementById('frontViewBtn').addEventListener('click', () => {
            this.switchView('front');
        });

        document.getElementById('backViewBtn').addEventListener('click', () => {
            this.switchView('back');
        });

        // Muscle part clicks
        document.querySelectorAll('.muscle-part').forEach(part => {
            part.addEventListener('click', (e) => {
                const muscle = e.target.dataset.muscle;
                this.selectMuscle(muscle, e.target);
            });

            // Hover effects
            part.addEventListener('mouseenter', (e) => {
                e.target.style.cursor = 'pointer';
            });
        });

        // View exercises button
        document.getElementById('viewMuscleExercises').addEventListener('click', () => {
            if (this.selectedMuscle) {
                this.navigateToExercises(this.selectedMuscle);
            }
        });
    },

    // ==========================================
    // VIEW SWITCHING
    // ==========================================
    switchView(view) {
        this.currentView = view;

        // Update toggle buttons
        document.getElementById('frontViewBtn').classList.toggle('active', view === 'front');
        document.getElementById('backViewBtn').classList.toggle('active', view === 'back');

        // Update body views
        document.getElementById('frontView').classList.toggle('active', view === 'front');
        document.getElementById('backView').classList.toggle('active', view === 'back');

        // Clear selection
        this.clearSelection();
    },

    // ==========================================
    // MUSCLE SELECTION
    // ==========================================
    selectMuscle(muscle, element) {
        // Clear previous selection
        this.clearSelection();

        // Set new selection
        this.selectedMuscle = muscle;

        // Highlight all parts of this muscle group
        document.querySelectorAll(`[data-muscle="${muscle}"]`).forEach(part => {
            part.classList.add('selected');
        });

        // Update info card
        this.updateInfoCard(muscle);

        // Haptic feedback
        App.hapticFeedback('light');
    },

    clearSelection() {
        this.selectedMuscle = null;

        document.querySelectorAll('.muscle-part').forEach(part => {
            part.classList.remove('selected');
        });

        // Reset info card
        document.getElementById('selectedMuscleName').textContent = 'Select a muscle';
        document.getElementById('muscleExerciseCount').textContent = 'Tap on the body';
        document.getElementById('viewMuscleExercises').style.display = 'none';
    },

    updateInfoCard(muscle) {
        const exercises = ExerciseDatabase.getExercisesByMuscle(muscle);
        const muscleNames = {
            chest: 'Chest',
            back: 'Back',
            shoulders: 'Shoulders',
            biceps: 'Biceps',
            triceps: 'Triceps',
            legs: 'Legs',
            core: 'Core',
            forearms: 'Forearms',
            neck: 'Neck'
        };

        document.getElementById('selectedMuscleName').textContent = muscleNames[muscle] || muscle;
        document.getElementById('muscleExerciseCount').textContent = `${exercises.length} exercises available`;
        document.getElementById('viewMuscleExercises').style.display = 'flex';
    },

    navigateToExercises(muscle) {
        // Navigate to exercises screen with filter
        App.navigateTo('exercisesScreen');
        
        // Set filter
        setTimeout(() => {
            Exercises.setMuscleFilter(muscle);
        }, 100);
    },

    // ==========================================
    // MUSCLE ACTIVITY
    // ==========================================
    updateMuscleActivity() {
        const stats = UserData.getStats();
        
        if (!stats || !stats.muscleActivity) return;

        // Update body map colors based on activity
        ExerciseDatabase.getMuscleGroups().forEach(muscle => {
            const activityLevel = UserData.getMuscleActivityLevel(muscle);
            
            document.querySelectorAll(`[data-muscle="${muscle}"]`).forEach(part => {
                // Remove all activity classes
                part.classList.remove('activity-light', 'activity-medium', 'activity-heavy', 'activity-intense');
                
                // Add current activity class
                if (activityLevel !== 'inactive') {
                    part.classList.add(`activity-${activityLevel}`);
                }
            });
        });
    },

    updateActivityGrid() {
        const stats = UserData.getStats();
        
        if (!stats || !stats.muscleActivity) return;

        const grid = document.getElementById('muscleActivityGrid');
        const maxSets = Math.max(...Object.values(stats.muscleActivity), 1);

        grid.querySelectorAll('.activity-item').forEach(item => {
            const muscle = item.querySelector('.activity-fill').dataset.muscle;
            const sets = stats.muscleActivity[muscle] || 0;
            const percentage = (sets / maxSets) * 100;

            item.querySelector('.activity-fill').style.width = `${percentage}%`;
            item.querySelector('.activity-sets').textContent = `${Math.round(sets)} sets`;
        });
    },

    // ==========================================
    // GET MUSCLE COLOR
    // ==========================================
    getMuscleColor(muscle) {
        const colors = {
            chest: '#8b5cf6',
            back: '#3b82f6',
            shoulders: '#f97316',
            biceps: '#ec4899',
            triceps: '#06b6d4',
            legs: '#22c55e',
            core: '#facc15',
            forearms: '#a855f7'
        };
        return colors[muscle] || '#6c5ce7';
    }
};