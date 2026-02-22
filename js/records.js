const Records = {
    STORAGE_KEY: 'lyfta_records',

    // ==========================================
    // GET/SET RECORDS
    // ==========================================
    getRecords() {
        const records = localStorage.getItem(this.STORAGE_KEY);
        return records ? JSON.parse(records) : {};
    },

    saveRecords(records) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    },

    // ==========================================
    // CHECK FOR NEW RECORDS
    // ==========================================
    checkRecords(workout) {
        const records = this.getRecords();
        const newRecords = [];

        workout.exercises.forEach(exercise => {
            const exerciseData = ExerciseDatabase.getExerciseById(exercise.exerciseId);
            if (!exerciseData) return;

            exercise.sets.forEach(set => {
                if (!set.completed) return;

                const weight = parseFloat(set.weight) || 0;
                const reps = parseInt(set.reps) || 0;
                
                if (weight <= 0 || reps <= 0) return;

                const key = `${exercise.exerciseId}`;
                const currentRecord = records[key] || {};

                // Check weight PR
                if (!currentRecord.maxWeight || weight > currentRecord.maxWeight.value) {
                    const isNew = !!currentRecord.maxWeight;
                    currentRecord.maxWeight = {
                        value: weight,
                        reps: reps,
                        date: new Date().toISOString()
                    };
                    
                    if (isNew) {
                        newRecords.push({
                            exercise: exerciseData.name,
                            type: 'weight',
                            value: weight,
                            unit: 'kg'
                        });
                    }
                }

                // Check volume PR (weight * reps)
                const volume = weight * reps;
                if (!currentRecord.maxVolume || volume > currentRecord.maxVolume.value) {
                    const isNew = !!currentRecord.maxVolume;
                    currentRecord.maxVolume = {
                        value: volume,
                        weight: weight,
                        reps: reps,
                        date: new Date().toISOString()
                    };
                    
                    if (isNew) {
                        newRecords.push({
                            exercise: exerciseData.name,
                            type: 'volume',
                            value: volume,
                            unit: 'kg'
                        });
                    }
                }

                // Check max reps at this weight
                const weightKey = `reps_${weight}`;
                if (!currentRecord[weightKey] || reps > currentRecord[weightKey].value) {
                    currentRecord[weightKey] = {
                        value: reps,
                        date: new Date().toISOString()
                    };
                }

                records[key] = currentRecord;
            });
        });

        this.saveRecords(records);
        return newRecords;
    },

    // ==========================================
    // GET EXERCISE RECORDS
    // ==========================================
    getExerciseRecords(exerciseId) {
        const records = this.getRecords();
        return records[exerciseId] || null;
    },

    // ==========================================
    // GET ALL TIME RECORDS
    // ==========================================
    getAllRecords() {
        const records = this.getRecords();
        const allRecords = [];

        Object.entries(records).forEach(([exerciseId, data]) => {
            const exercise = ExerciseDatabase.getExerciseById(parseInt(exerciseId));
            if (!exercise || !data.maxWeight) return;

            allRecords.push({
                exerciseId: parseInt(exerciseId),
                exerciseName: exercise.name,
                muscle: exercise.muscle,
                maxWeight: data.maxWeight.value,
                maxWeightReps: data.maxWeight.reps,
                maxWeightDate: data.maxWeight.date,
                maxVolume: data.maxVolume?.value || 0
            });
        });

        return allRecords.sort((a, b) => new Date(b.maxWeightDate) - new Date(a.maxWeightDate));
    },

    // ==========================================
    // SHOW NEW RECORD CELEBRATION
    // ==========================================
    celebrateRecord(record) {
        // Create celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'record-celebration';
        overlay.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h2>NEW PERSONAL RECORD!</h2>
                <p class="celebration-exercise">${record.exercise}</p>
                <div class="celebration-value">
                    <span class="value">${record.value}</span>
                    <span class="unit">${record.unit}</span>
                </div>
                <p class="celebration-type">${record.type === 'weight' ? 'Max Weight' : 'Max Volume'}</p>
                <button class="celebration-btn">Awesome!</button>
            </div>
            <div class="confetti-container"></div>
        `;

        document.body.appendChild(overlay);

        // Add celebration styles
        this.addCelebrationStyles();

        // Create confetti
        this.createConfetti(overlay.querySelector('.confetti-container'));

        // Haptic feedback
        App.hapticFeedback('success');

        // Close button
        overlay.querySelector('.celebration-btn').addEventListener('click', () => {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 300);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.classList.add('closing');
                setTimeout(() => overlay.remove(), 300);
            }
        }, 5000);
    },

    addCelebrationStyles() {
        if (document.getElementById('celebration-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'celebration-styles';
        styles.textContent = `
            .record-celebration {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: celebrationFadeIn 0.3s ease;
            }
            
            .record-celebration.closing {
                animation: celebrationFadeOut 0.3s ease forwards;
            }
            
            @keyframes celebrationFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes celebrationFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .celebration-content {
                text-align: center;
                z-index: 1;
                animation: celebrationPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            @keyframes celebrationPop {
                0% { transform: scale(0); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .celebration-icon {
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #ffd700, #ffaa00);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto var(--space-lg);
                animation: trophyBounce 1s ease infinite;
            }
            
            @keyframes trophyBounce {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(-5deg); }
                75% { transform: translateY(-10px) rotate(5deg); }
            }
            
            .celebration-icon i {
                font-size: 3rem;
                color: white;
            }
            
            .celebration-content h2 {
                font-size: 1.5rem;
                color: #ffd700;
                margin-bottom: var(--space-sm);
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .celebration-exercise {
                font-size: 1.1rem;
                color: var(--text-secondary);
                margin-bottom: var(--space-lg);
            }
            
            .celebration-value {
                margin-bottom: var(--space-sm);
            }
            
            .celebration-value .value {
                font-size: 4rem;
                font-weight: 800;
                background: linear-gradient(135deg, #ffd700, #ffaa00);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .celebration-value .unit {
                font-size: 1.5rem;
                color: var(--text-secondary);
                margin-left: var(--space-xs);
            }
            
            .celebration-type {
                font-size: 0.9rem;
                color: var(--text-tertiary);
                margin-bottom: var(--space-xl);
            }
            
            .celebration-btn {
                padding: var(--space-md) var(--space-xl);
                background: linear-gradient(135deg, #ffd700, #ffaa00);
                border: none;
                border-radius: var(--radius-lg);
                color: #000;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .celebration-btn:hover {
                transform: scale(1.05);
            }
            
            .confetti-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                animation: confettiFall 3s ease-in-out forwards;
            }
            
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100%) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    },

    createConfetti(container) {
        const colors = ['#ffd700', '#ffaa00', '#6c5ce7', '#a29bfe', '#4ade80', '#f97316'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
    },

    // ==========================================
    // RENDER RECORDS LIST
    // ==========================================
    renderRecordsList(container) {
        const records = this.getAllRecords();

        if (records.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>No personal records yet</p>
                    <span>Complete workouts to set records!</span>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="records-list">
                ${records.slice(0, 10).map(record => `
                    <div class="record-card" data-exercise="${record.exerciseId}">
                        <div class="record-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <div class="record-info">
                            <h4>${record.exerciseName}</h4>
                            <p>${record.muscle}</p>
                        </div>
                        <div class="record-value">
                            <span class="weight">${record.maxWeight}kg</span>
                            <span class="reps">× ${record.maxWeightReps}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add record card styles
        this.addRecordCardStyles();
    },

    addRecordCardStyles() {
        if (document.getElementById('record-card-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'record-card-styles';
        styles.textContent = `
            .records-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            
            .record-card {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                background: var(--bg-card);
                padding: var(--space-md);
                border-radius: var(--radius-lg);
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .record-card:hover {
                background: var(--bg-card-hover);
                transform: translateX(4px);
            }
            
            .record-icon {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #ffd700, #ffaa00);
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .record-info {
                flex: 1;
            }
            
            .record-info h4 {
                font-size: 0.95rem;
                font-weight: 600;
            }
            
            .record-info p {
                font-size: 0.8rem;
                color: var(--text-secondary);
                text-transform: capitalize;
            }
            
            .record-value {
                text-align: right;
            }
            
            .record-value .weight {
                display: block;
                font-size: 1.1rem;
                font-weight: 700;
                color: #ffd700;
            }
            
            .record-value .reps {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(styles);
    }
};