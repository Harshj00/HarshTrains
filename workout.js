const Workout = {
    currentWorkout: null,
    timerInterval: null,
    restTimerInterval: null,
    restTimeRemaining: 0,

    // ==========================================
    // START NEW WORKOUT
    // ==========================================
    startNewWorkout() {
        this.currentWorkout = {
            id: Date.now(),
            name: 'New Workout',
            startTime: new Date().toISOString(),
            exercises: [],
            notes: ''
        };

        App.isWorkoutActive = true;
        App.workoutStartTime = new Date();

        UserData.saveActiveWorkout(this.currentWorkout);
        
        this.startTimer();
        this.renderActiveWorkout();
        App.showFloatingWorkout();
        
        document.getElementById('activeWorkoutScreen').classList.add('active');
        
        App.showToast('Workout started!', 'success');
        App.hapticFeedback('success');
    },

    startFromTemplate(template) {
        this.currentWorkout = {
            id: Date.now(),
            name: template.name,
            startTime: new Date().toISOString(),
            exercises: template.exercises.map(ex => ({
                exerciseId: ex.id,
                sets: Array(ex.sets).fill().map((_, i) => ({
                    setNumber: i + 1,
                    weight: '',
                    reps: ex.reps,
                    completed: false
                }))
            })),
            notes: ''
        };

        App.isWorkoutActive = true;
        App.workoutStartTime = new Date();

        UserData.saveActiveWorkout(this.currentWorkout);
        
        this.startTimer();
        this.renderActiveWorkout();
        App.showFloatingWorkout();
        
        document.getElementById('activeWorkoutScreen').classList.add('active');
        
        App.showToast(`Started ${template.name}!`, 'success');
        App.hapticFeedback('success');
    },

    // ==========================================
    // TIMER
    // ==========================================
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        const updateTimer = () => {
            const elapsed = Math.floor((new Date() - App.workoutStartTime) / 1000);
            const display = UserData.formatDuration(elapsed);
            
            document.getElementById('workoutTimer').textContent = display;
            document.getElementById('floatingTimer').textContent = display;
        };

        updateTimer();
        this.timerInterval = setInterval(updateTimer, 1000);
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    // ==========================================
    // RENDER ACTIVE WORKOUT
    // ==========================================
    renderActiveWorkout() {
        const container = document.getElementById('activeExercises');
        const titleInput = document.getElementById('workoutTitleInput');
        
        titleInput.value = this.currentWorkout.name;
        
        // Title change listener
        titleInput.removeEventListener('change', this.handleTitleChange);
        titleInput.addEventListener('change', this.handleTitleChange.bind(this));

        if (this.currentWorkout.exercises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <p>No exercises yet</p>
                    <span>Tap "Add Exercise" to get started</span>
                </div>
            `;
        } else {
            container.innerHTML = this.currentWorkout.exercises
                .map((ex, index) => this.renderExerciseBlock(ex, index))
                .join('');

            this.setupExerciseListeners();
        }

        // Add exercise button listener
        this.setupAddExerciseButton();

        // Finish workout button listener
        this.setupFinishButton();

        // Minimize button
        this.setupMinimizeButton();
    },

    handleTitleChange(e) {
        this.currentWorkout.name = e.target.value || 'New Workout';
        UserData.saveActiveWorkout(this.currentWorkout);
    },

    renderExerciseBlock(exerciseData, index) {
        const exercise = ExerciseDatabase.getExerciseById(exerciseData.exerciseId);
        
        if (!exercise) return '';

        const setsHtml = exerciseData.sets.map((set, setIndex) => `
            <div class="set-row ${set.completed ? 'completed' : ''}" data-exercise="${index}" data-set="${setIndex}">
                <div class="set-number">${set.setNumber}</div>
                <input type="number" class="set-input weight-input" placeholder="-" value="${set.weight}" data-field="weight">
                <input type="number" class="set-input reps-input" placeholder="${typeof set.reps === 'string' ? set.reps : '-'}" value="${typeof set.reps === 'number' ? set.reps : ''}" data-field="reps">
                <button class="set-check ${set.completed ? 'checked' : ''}">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `).join('');

        return `
            <div class="exercise-block" data-index="${index}">
                <div class="exercise-block-header">
                    <div class="exercise-block-icon">
                        <i class="fas ${ExerciseDatabase.getMuscleIcon(exercise.muscle)}"></i>
                    </div>
                    <div class="exercise-block-info">
                        <h4>${exercise.name}</h4>
                        <p>${exercise.muscle} · ${exercise.equipment}</p>
                    </div>
                    <button class="exercise-block-menu" data-index="${index}">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                <div class="sets-table">
                    <div class="sets-header">
                        <span>SET</span>
                        <span>KG</span>
                        <span>REPS</span>
                        <span></span>
                    </div>
                    ${setsHtml}
                </div>
                <button class="add-set-btn" data-index="${index}">
                    <i class="fas fa-plus"></i> Add Set
                </button>
            </div>
        `;
    },

    setupExerciseListeners() {
        // Set inputs
        document.querySelectorAll('.set-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const row = e.target.closest('.set-row');
                const exerciseIndex = parseInt(row.dataset.exercise);
                const setIndex = parseInt(row.dataset.set);
                const field = e.target.dataset.field;
                
                this.updateSet(exerciseIndex, setIndex, field, e.target.value);
            });
        });

        // Set check buttons
        document.querySelectorAll('.set-check').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('.set-row');
                const exerciseIndex = parseInt(row.dataset.exercise);
                const setIndex = parseInt(row.dataset.set);
                
                this.toggleSetComplete(exerciseIndex, setIndex);
            });
        });

        // Add set buttons
        document.querySelectorAll('.add-set-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.addSet(index);
            });
        });

        // Exercise menu buttons
        document.querySelectorAll('.exercise-block-menu').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.exercise-block-menu').dataset.index);
                this.showExerciseMenu(index, e);
            });
        });
    },

    setupAddExerciseButton() {
        const btn = document.getElementById('addExerciseBtn');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            Exercises.showExercisePicker((selectedIds) => {
                selectedIds.forEach(id => {
                    this.addExercise(id);
                });
            });
        });
    },

    setupFinishButton() {
        const btn = document.getElementById('finishWorkout');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            this.finishWorkout();
        });
    },

    setupMinimizeButton() {
        const btn = document.getElementById('minimizeWorkout');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            document.getElementById('activeWorkoutScreen').classList.remove('active');
        });
    },

    // ==========================================
    // EXERCISE MANAGEMENT
    // ==========================================
    addExercise(exerciseId) {
        const newExercise = {
            exerciseId: exerciseId,
            sets: [{
                setNumber: 1,
                weight: '',
                reps: '',
                completed: false
            }]
        };

        this.currentWorkout.exercises.push(newExercise);
        UserData.saveActiveWorkout(this.currentWorkout);
        this.renderActiveWorkout();
        
        App.showToast('Exercise added!', 'success');
        App.hapticFeedback('light');
    },

    removeExercise(index) {
        this.currentWorkout.exercises.splice(index, 1);
        UserData.saveActiveWorkout(this.currentWorkout);
        this.renderActiveWorkout();
        
        App.showToast('Exercise removed', 'info');
    },

    showExerciseMenu(index, event) {
        App.showConfirmModal(
            'Remove Exercise?',
            'This will remove the exercise and all its sets from this workout.',
            () => {
                this.removeExercise(index);
            },
            'danger'
        );
    },

    // ==========================================
    // SET MANAGEMENT
    // ==========================================
    addSet(exerciseIndex) {
        const exercise = this.currentWorkout.exercises[exerciseIndex];
        const lastSet = exercise.sets[exercise.sets.length - 1];
        
        exercise.sets.push({
            setNumber: exercise.sets.length + 1,
            weight: lastSet ? lastSet.weight : '',
            reps: lastSet ? lastSet.reps : '',
            completed: false
        });

        UserData.saveActiveWorkout(this.currentWorkout);
        this.renderActiveWorkout();
        
        App.hapticFeedback('light');
    },

    updateSet(exerciseIndex, setIndex, field, value) {
        const set = this.currentWorkout.exercises[exerciseIndex].sets[setIndex];
        
        if (field === 'weight') {
            set.weight = value;
        } else if (field === 'reps') {
            set.reps = value;
        }

        UserData.saveActiveWorkout(this.currentWorkout);
    },

    toggleSetComplete(exerciseIndex, setIndex) {
        const set = this.currentWorkout.exercises[exerciseIndex].sets[setIndex];
        set.completed = !set.completed;

        UserData.saveActiveWorkout(this.currentWorkout);
        this.renderActiveWorkout();

        if (set.completed) {
            App.hapticFeedback('success');
            this.startRestTimer();
        }
    },

    // ==========================================
    // REST TIMER
    // ==========================================
    startRestTimer() {
        const settings = UserData.getSettings();
        this.restTimeRemaining = settings.restTimer || 90;

        const modal = document.getElementById('restTimerModal');
        const display = document.getElementById('timerDisplay');
        const progress = document.getElementById('timerProgress');
        
        const totalTime = this.restTimeRemaining;
        const circumference = 2 * Math.PI * 45;
        
        progress.style.strokeDasharray = circumference;

        const updateDisplay = () => {
            const mins = Math.floor(this.restTimeRemaining / 60);
            const secs = this.restTimeRemaining % 60;
            display.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            const offset = circumference * (1 - this.restTimeRemaining / totalTime);
            progress.style.strokeDashoffset = offset;
        };

        updateDisplay();
        modal.classList.add('active');

        this.restTimerInterval = setInterval(() => {
            this.restTimeRemaining--;
            updateDisplay();

            if (this.restTimeRemaining <= 0) {
                this.stopRestTimer();
                App.hapticFeedback('success');
                App.showToast('Rest complete!', 'success');
            }
        }, 1000);

        // Timer controls
        document.getElementById('timerMinus').onclick = () => {
            this.restTimeRemaining = Math.max(0, this.restTimeRemaining - 15);
            updateDisplay();
        };

        document.getElementById('timerPlus').onclick = () => {
            this.restTimeRemaining += 15;
            updateDisplay();
        };

        document.getElementById('timerSkip').onclick = () => {
            this.stopRestTimer();
        };
    },

    stopRestTimer() {
        if (this.restTimerInterval) {
            clearInterval(this.restTimerInterval);
            this.restTimerInterval = null;
        }
        document.getElementById('restTimerModal').classList.remove('active');
    },

    // ==========================================
    // FINISH WORKOUT
    // ==========================================
    finishWorkout() {
        // Check if any sets were completed
        const completedSets = this.currentWorkout.exercises.reduce((total, ex) => {
            return total + ex.sets.filter(s => s.completed).length;
        }, 0);

        if (completedSets === 0) {
            App.showConfirmModal(
                'No sets completed',
                'You haven\'t completed any sets. Do you want to discard this workout?',
                () => {
                    this.discardWorkout();
                },
                'danger'
            );
            return;
        }

        // Calculate workout stats
        const duration = Math.floor((new Date() - App.workoutStartTime) / 1000);
        let totalVolume = 0;
        let totalSets = 0;

        this.currentWorkout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (set.completed) {
                    totalSets++;
                    const weight = parseFloat(set.weight) || 0;
                    const reps = parseInt(set.reps) || 0;
                    totalVolume += weight * reps;
                }
            });
        });

        // Create final workout object
        const workout = {
            ...this.currentWorkout,
            endTime: new Date().toISOString(),
            duration: duration,
            totalSets: totalSets,
            totalVolume: totalVolume
        };

        // Save workout
        UserData.addWorkout(workout);
        UserData.clearActiveWorkout();

        // Check for personal records
        let newRecords = [];
        if (typeof Records !== 'undefined' && Records.checkRecords) {
            newRecords = Records.checkRecords(workout);
        }

        // Reset state
        this.stopTimer();
        App.isWorkoutActive = false;
        App.hideFloatingWorkout();
        this.currentWorkout = null;

        // Close workout screen
        document.getElementById('activeWorkoutScreen').classList.remove('active');

        // Navigate to dashboard
        App.navigateTo('dashboardScreen');

        // Show success message
        App.showToast(`Workout complete! ${totalSets} sets, ${UserData.formatVolume(totalVolume)}kg`, 'success');
        App.hapticFeedback('success');

        // Celebrate new records
        if (newRecords.length > 0) {
            setTimeout(() => {
                newRecords.forEach((record, index) => {
                    setTimeout(() => {
                        Records.celebrateRecord(record);
                    }, index * 3500);
                });
            }, 1000);
        }
    },

    // ==========================================
    // DISCARD WORKOUT
    // ==========================================
    discardWorkout() {
        App.showConfirmModal(
            'Discard Workout?',
            'All progress will be lost. This cannot be undone.',
            () => {
                this.stopTimer();
                UserData.clearActiveWorkout();
                App.isWorkoutActive = false;
                App.hideFloatingWorkout();
                this.currentWorkout = null;
                
                document.getElementById('activeWorkoutScreen').classList.remove('active');
                
                App.showToast('Workout discarded', 'info');
            },
            'danger'
        );
    }

};
