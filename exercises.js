/* ========================================
   LYFTA CLONE - EXERCISES LOGIC
   ======================================== */

const Exercises = {
    currentMuscleFilter: 'all',
    currentEquipmentFilter: 'all',
    exercises: [],

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.setupEventListeners();
        this.loadExercises();
    },

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Muscle filter chips
        document.querySelectorAll('#muscleFilters .filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setMuscleFilter(filter);
            });
        });

        // Equipment filter chips
        document.querySelectorAll('#equipmentFilters .filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filter = e.target.dataset.equipment;
                this.setEquipmentFilter(filter);
            });
        });
    },

    // ==========================================
    // FILTERS
    // ==========================================
    setMuscleFilter(filter) {
        this.currentMuscleFilter = filter;

        // Update UI
        document.querySelectorAll('#muscleFilters .filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.filter === filter);
        });

        this.loadExercises();
    },

    setEquipmentFilter(filter) {
        this.currentEquipmentFilter = filter;

        // Update UI
        document.querySelectorAll('#equipmentFilters .filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.equipment === filter);
        });

        this.loadExercises();
    },

    // ==========================================
    // LOAD EXERCISES
    // ==========================================
    loadExercises() {
        const container = document.getElementById('exerciseList');
        
        // Get filtered exercises
        this.exercises = ExerciseDatabase.getFilteredExercises(
            this.currentMuscleFilter,
            this.currentEquipmentFilter
        );

        if (this.exercises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No exercises found</p>
                    <span>Try adjusting your filters</span>
                </div>
            `;
            return;
        }

        container.innerHTML = this.exercises.map(exercise => this.renderExerciseCard(exercise)).join('');

        // Add click listeners
        container.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', () => {
                const exerciseId = parseInt(card.dataset.id);
                App.showExerciseDetail(exerciseId);
            });
        });
    },

    renderExerciseCard(exercise) {
        return `
            <div class="exercise-card" data-id="${exercise.id}">
                <div class="exercise-icon ${exercise.muscle}">
                    <i class="fas ${ExerciseDatabase.getMuscleIcon(exercise.muscle)}"></i>
                </div>
                <div class="exercise-info">
                    <h3>${exercise.name}</h3>
                    <div class="exercise-tags">
                        <span class="exercise-tag muscle">${exercise.muscle}</span>
                        <span class="exercise-tag">${exercise.equipment}</span>
                    </div>
                </div>
                <i class="fas fa-chevron-right exercise-arrow"></i>
            </div>
        `;
    },

    // ==========================================
    // EXERCISE PICKER (for adding to workout)
    // ==========================================
    showExercisePicker(callback) {
        // Create picker modal
        let picker = document.querySelector('.exercise-picker');
        
        if (!picker) {
            picker = document.createElement('div');
            picker.className = 'exercise-picker';
            picker.innerHTML = `
                <div class="picker-header">
                    <h2>Add Exercise</h2>
                    <button class="picker-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="picker-search">
                    <input type="text" placeholder="Search exercises..." id="pickerSearchInput">
                </div>
                <div class="picker-filters">
                    <div class="filter-chips" id="pickerMuscleFilters">
                        <button class="filter-chip active" data-filter="all">All</button>
                        <button class="filter-chip" data-filter="chest">Chest</button>
                        <button class="filter-chip" data-filter="back">Back</button>
                        <button class="filter-chip" data-filter="shoulders">Shoulders</button>
                        <button class="filter-chip" data-filter="biceps">Biceps</button>
                        <button class="filter-chip" data-filter="triceps">Triceps</button>
                        <button class="filter-chip" data-filter="legs">Legs</button>
                        <button class="filter-chip" data-filter="core">Core</button>
                    </div>
                </div>
                <div class="picker-list" id="pickerList"></div>
                <div class="picker-add-btn">
                    <button disabled id="pickerAddBtn">Add Selected (0)</button>
                </div>
            `;
            document.body.appendChild(picker);
        }

        // State
        let selectedExercises = [];
        let pickerFilter = 'all';

        // Render exercises
        const renderPickerExercises = (filter = 'all', search = '') => {
            let exercises = filter === 'all' 
                ? ExerciseDatabase.exercises 
                : ExerciseDatabase.getExercisesByMuscle(filter);

            if (search) {
                exercises = exercises.filter(ex => 
                    ex.name.toLowerCase().includes(search.toLowerCase())
                );
            }

            const list = document.getElementById('pickerList');
            list.innerHTML = exercises.map(ex => `
                <div class="picker-exercise ${selectedExercises.includes(ex.id) ? 'selected' : ''}" data-id="${ex.id}">
                    <div class="picker-exercise-icon">
                        <i class="fas ${ExerciseDatabase.getMuscleIcon(ex.muscle)}"></i>
                    </div>
                    <div class="picker-exercise-info">
                        <h4>${ex.name}</h4>
                        <p>${ex.muscle} · ${ex.equipment}</p>
                    </div>
                </div>
            `).join('');

            // Click listeners
            list.querySelectorAll('.picker-exercise').forEach(item => {
                item.addEventListener('click', () => {
                    const id = parseInt(item.dataset.id);
                    
                    if (selectedExercises.includes(id)) {
                        selectedExercises = selectedExercises.filter(i => i !== id);
                        item.classList.remove('selected');
                    } else {
                        selectedExercises.push(id);
                        item.classList.add('selected');
                    }

                    updateAddButton();
                });
            });
        };

        const updateAddButton = () => {
            const btn = document.getElementById('pickerAddBtn');
            btn.disabled = selectedExercises.length === 0;
            btn.textContent = `Add Selected (${selectedExercises.length})`;
        };

        // Initial render
        renderPickerExercises();

        // Event listeners
        picker.querySelector('.picker-close').addEventListener('click', () => {
            picker.classList.remove('active');
        });

        document.getElementById('pickerSearchInput').addEventListener('input', (e) => {
            renderPickerExercises(pickerFilter, e.target.value);
        });

        document.querySelectorAll('#pickerMuscleFilters .filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                pickerFilter = e.target.dataset.filter;
                
                document.querySelectorAll('#pickerMuscleFilters .filter-chip').forEach(c => {
                    c.classList.toggle('active', c.dataset.filter === pickerFilter);
                });

                renderPickerExercises(pickerFilter, document.getElementById('pickerSearchInput').value);
            });
        });

        document.getElementById('pickerAddBtn').addEventListener('click', () => {
            if (callback && selectedExercises.length > 0) {
                callback(selectedExercises);
            }
            picker.classList.remove('active');
        });

        // Show picker
        picker.classList.add('active');
        document.getElementById('pickerSearchInput').value = '';
        selectedExercises = [];
        renderPickerExercises();
        updateAddButton();
    }
};

// Initialize when exercises screen is first loaded
document.addEventListener('DOMContentLoaded', () => {
    Exercises.setupEventListeners();
});