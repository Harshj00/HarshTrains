const Templates = {
    STORAGE_KEY: 'lyfta_custom_templates',

    // ==========================================
    // GET/SET TEMPLATES
    // ==========================================
    getCustomTemplates() {
        const templates = localStorage.getItem(this.STORAGE_KEY);
        return templates ? JSON.parse(templates) : [];
    },

    saveCustomTemplates(templates) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    },

    getTemplateById(id) {
        const templates = this.getCustomTemplates();
        return templates.find(t => t.id === id);
    },

    // ==========================================
    // CREATE TEMPLATE
    // ==========================================
    createTemplate(templateData) {
        const templates = this.getCustomTemplates();
        
        const newTemplate = {
            id: Date.now(),
            name: templateData.name || 'My Workout',
            description: templateData.description || '',
            icon: templateData.icon || 'fa-dumbbell',
            color: templateData.color || 'purple',
            exercises: templateData.exercises || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timesUsed: 0
        };

        templates.push(newTemplate);
        this.saveCustomTemplates(templates);
        
        App.showToast('Template created!', 'success');
        return newTemplate;
    },

    // ==========================================
    // UPDATE TEMPLATE
    // ==========================================
    updateTemplate(id, updates) {
        const templates = this.getCustomTemplates();
        const index = templates.findIndex(t => t.id === id);
        
        if (index !== -1) {
            templates[index] = {
                ...templates[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveCustomTemplates(templates);
            App.showToast('Template updated!', 'success');
            return templates[index];
        }
        return null;
    },

    // ==========================================
    // DELETE TEMPLATE
    // ==========================================
    deleteTemplate(id) {
        let templates = this.getCustomTemplates();
        templates = templates.filter(t => t.id !== id);
        this.saveCustomTemplates(templates);
        App.showToast('Template deleted', 'info');
    },

    // ==========================================
    // DUPLICATE TEMPLATE
    // ==========================================
    duplicateTemplate(id) {
        const template = this.getTemplateById(id);
        if (template) {
            const duplicate = {
                ...template,
                id: Date.now(),
                name: `${template.name} (Copy)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                timesUsed: 0
            };
            
            const templates = this.getCustomTemplates();
            templates.push(duplicate);
            this.saveCustomTemplates(templates);
            
            App.showToast('Template duplicated!', 'success');
            return duplicate;
        }
        return null;
    },

    // ==========================================
    // INCREMENT USAGE COUNT
    // ==========================================
    incrementUsage(id) {
        const templates = this.getCustomTemplates();
        const template = templates.find(t => t.id === id);
        if (template) {
            template.timesUsed = (template.timesUsed || 0) + 1;
            this.saveCustomTemplates(templates);
        }
    },

    // ==========================================
    // GET ALL TEMPLATES (Default + Custom)
    // ==========================================
    getAllTemplates() {
        const defaultTemplates = [
            {
                id: 'push',
                name: 'Push Day',
                description: 'Chest, Shoulders, Triceps',
                icon: 'fa-hand-fist',
                color: 'purple',
                isDefault: true,
                exercises: ExerciseDatabase.templates.push.exercises
            },
            {
                id: 'pull',
                name: 'Pull Day',
                description: 'Back, Biceps, Rear Delts',
                icon: 'fa-arrows-to-dot',
                color: 'blue',
                isDefault: true,
                exercises: ExerciseDatabase.templates.pull.exercises
            },
            {
                id: 'legs',
                name: 'Leg Day',
                description: 'Quads, Hamstrings, Calves',
                icon: 'fa-person-walking',
                color: 'green',
                isDefault: true,
                exercises: ExerciseDatabase.templates.legs.exercises
            },
            {
                id: 'upperBody',
                name: 'Upper Body',
                description: 'Full upper body workout',
                icon: 'fa-child-reaching',
                color: 'orange',
                isDefault: true,
                exercises: ExerciseDatabase.templates.upperBody.exercises
            },
            {
                id: 'lowerBody',
                name: 'Lower Body',
                description: 'Full lower body workout',
                icon: 'fa-shoe-prints',
                color: 'cyan',
                isDefault: true,
                exercises: ExerciseDatabase.templates.lowerBody.exercises
            },
            {
                id: 'fullBody',
                name: 'Full Body',
                description: 'Complete full body workout',
                icon: 'fa-person',
                color: 'pink',
                isDefault: true,
                exercises: ExerciseDatabase.templates.fullBody.exercises
            }
        ];

        const customTemplates = this.getCustomTemplates().map(t => ({
            ...t,
            isDefault: false
        }));

        return [...defaultTemplates, ...customTemplates];
    },

    // ==========================================
    // SHOW CREATE TEMPLATE MODAL
    // ==========================================
    showCreateModal(editTemplate = null) {
        const isEditing = !!editTemplate;
        
        const modal = document.createElement('div');
        modal.className = 'template-modal active';
        modal.id = 'templateModal';
        modal.innerHTML = `
            <div class="template-modal-content">
                <div class="template-modal-header">
                    <h2>${isEditing ? 'Edit Template' : 'Create Template'}</h2>
                    <button class="modal-close-btn" id="closeTemplateModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="template-modal-body">
                    <!-- Template Name -->
                    <div class="form-group">
                        <label>Template Name</label>
                        <input type="text" 
                               id="templateName" 
                               class="form-input" 
                               placeholder="e.g., Monday Push"
                               value="${isEditing ? editTemplate.name : ''}"
                               maxlength="30">
                    </div>
                    
                    <!-- Template Description -->
                    <div class="form-group">
                        <label>Description (optional)</label>
                        <input type="text" 
                               id="templateDescription" 
                               class="form-input" 
                               placeholder="e.g., Chest and Triceps focus"
                               value="${isEditing ? editTemplate.description : ''}"
                               maxlength="50">
                    </div>
                    
                    <!-- Icon Selection -->
                    <div class="form-group">
                        <label>Icon</label>
                        <div class="icon-selector" id="iconSelector">
                            <button class="icon-option ${(!isEditing || editTemplate.icon === 'fa-dumbbell') ? 'selected' : ''}" data-icon="fa-dumbbell">
                                <i class="fas fa-dumbbell"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-hand-fist' ? 'selected' : ''}" data-icon="fa-hand-fist">
                                <i class="fas fa-hand-fist"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-fire' ? 'selected' : ''}" data-icon="fa-fire">
                                <i class="fas fa-fire"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-bolt' ? 'selected' : ''}" data-icon="fa-bolt">
                                <i class="fas fa-bolt"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-heart-pulse' ? 'selected' : ''}" data-icon="fa-heart-pulse">
                                <i class="fas fa-heart-pulse"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-person-running' ? 'selected' : ''}" data-icon="fa-person-running">
                                <i class="fas fa-person-running"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-star' ? 'selected' : ''}" data-icon="fa-star">
                                <i class="fas fa-star"></i>
                            </button>
                            <button class="icon-option ${isEditing && editTemplate.icon === 'fa-trophy' ? 'selected' : ''}" data-icon="fa-trophy">
                                <i class="fas fa-trophy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Color Selection -->
                    <div class="form-group">
                        <label>Color</label>
                        <div class="color-selector" id="colorSelector">
                            <button class="color-option purple ${(!isEditing || editTemplate.color === 'purple') ? 'selected' : ''}" data-color="purple"></button>
                            <button class="color-option blue ${isEditing && editTemplate.color === 'blue' ? 'selected' : ''}" data-color="blue"></button>
                            <button class="color-option green ${isEditing && editTemplate.color === 'green' ? 'selected' : ''}" data-color="green"></button>
                            <button class="color-option orange ${isEditing && editTemplate.color === 'orange' ? 'selected' : ''}" data-color="orange"></button>
                            <button class="color-option pink ${isEditing && editTemplate.color === 'pink' ? 'selected' : ''}" data-color="pink"></button>
                            <button class="color-option cyan ${isEditing && editTemplate.color === 'cyan' ? 'selected' : ''}" data-color="cyan"></button>
                            <button class="color-option red ${isEditing && editTemplate.color === 'red' ? 'selected' : ''}" data-color="red"></button>
                            <button class="color-option yellow ${isEditing && editTemplate.color === 'yellow' ? 'selected' : ''}" data-color="yellow"></button>
                        </div>
                    </div>
                    
                    <!-- Exercises Section -->
                    <div class="form-group">
                        <div class="exercises-header">
                            <label>Exercises</label>
                            <button class="add-exercise-to-template-btn" id="addExerciseToTemplate">
                                <i class="fas fa-plus"></i> Add
                            </button>
                        </div>
                        <div class="template-exercises-list" id="templateExercisesList">
                            ${isEditing && editTemplate.exercises.length > 0 ? '' : `
                                <div class="empty-exercises">
                                    <i class="fas fa-list"></i>
                                    <p>No exercises added</p>
                                    <span>Tap "Add" to add exercises</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="template-modal-footer">
                    <button class="cancel-btn" id="cancelTemplate">Cancel</button>
                    <button class="save-template-btn" id="saveTemplate">
                        <i class="fas fa-check"></i>
                        ${isEditing ? 'Update Template' : 'Create Template'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addTemplateModalStyles();

        // State
        let selectedIcon = isEditing ? editTemplate.icon : 'fa-dumbbell';
        let selectedColor = isEditing ? editTemplate.color : 'purple';
        let templateExercises = isEditing ? [...editTemplate.exercises] : [];

        // Render existing exercises if editing
        if (isEditing && editTemplate.exercises.length > 0) {
            this.renderTemplateExercises(templateExercises);
        }

        // Icon selection
        modal.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.icon-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedIcon = btn.dataset.icon;
            });
        });

        // Color selection
        modal.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedColor = btn.dataset.color;
            });
        });

        // Add exercise button
        modal.querySelector('#addExerciseToTemplate').addEventListener('click', () => {
            this.showExercisePickerForTemplate((selectedIds) => {
                selectedIds.forEach(id => {
                    // Check if already added
                    if (!templateExercises.find(e => e.id === id)) {
                        templateExercises.push({
                            id: id,
                            sets: 3,
                            reps: '8-12'
                        });
                    }
                });
                this.renderTemplateExercises(templateExercises);
            });
        });

        // Close button
        modal.querySelector('#closeTemplateModal').addEventListener('click', () => {
            modal.remove();
        });

        // Cancel button
        modal.querySelector('#cancelTemplate').addEventListener('click', () => {
            modal.remove();
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Save button
        modal.querySelector('#saveTemplate').addEventListener('click', () => {
            const name = modal.querySelector('#templateName').value.trim();
            const description = modal.querySelector('#templateDescription').value.trim();

            if (!name) {
                App.showToast('Please enter a template name', 'error');
                modal.querySelector('#templateName').focus();
                return;
            }

            if (templateExercises.length === 0) {
                App.showToast('Please add at least one exercise', 'error');
                return;
            }

            const templateData = {
                name,
                description,
                icon: selectedIcon,
                color: selectedColor,
                exercises: templateExercises
            };

            if (isEditing) {
                this.updateTemplate(editTemplate.id, templateData);
            } else {
                this.createTemplate(templateData);
            }

            modal.remove();
            
            // Refresh the workout screen if we're on it
            if (App.currentScreen === 'workoutScreen') {
                this.renderTemplatesList();
            }
        });

        // Focus on name input
        setTimeout(() => {
            modal.querySelector('#templateName').focus();
        }, 100);
    },

    // ==========================================
    // RENDER EXERCISES IN TEMPLATE MODAL
    // ==========================================
    renderTemplateExercises(exercises) {
        const container = document.getElementById('templateExercisesList');
        
        if (exercises.length === 0) {
            container.innerHTML = `
                <div class="empty-exercises">
                    <i class="fas fa-list"></i>
                    <p>No exercises added</p>
                    <span>Tap "Add" to add exercises</span>
                </div>
            `;
            return;
        }

        container.innerHTML = exercises.map((ex, index) => {
            const exercise = ExerciseDatabase.getExerciseById(ex.id);
            if (!exercise) return '';

            return `
                <div class="template-exercise-item" data-index="${index}">
                    <div class="template-exercise-drag">
                        <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="template-exercise-info">
                        <div class="template-exercise-icon ${exercise.muscle}">
                            <i class="fas ${ExerciseDatabase.getMuscleIcon(exercise.muscle)}"></i>
                        </div>
                        <div class="template-exercise-details">
                            <h4>${exercise.name}</h4>
                            <p>${exercise.muscle} · ${exercise.equipment}</p>
                        </div>
                    </div>
                    <div class="template-exercise-config">
                        <div class="config-field">
                            <label>Sets</label>
                            <input type="number" 
                                   class="config-input sets-input" 
                                   value="${ex.sets}" 
                                   min="1" 
                                   max="10"
                                   data-index="${index}">
                        </div>
                        <div class="config-field">
                            <label>Reps</label>
                            <input type="text" 
                                   class="config-input reps-input" 
                                   value="${ex.reps}" 
                                   placeholder="8-12"
                                   data-index="${index}">
                        </div>
                    </div>
                    <button class="remove-exercise-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        // Add event listeners for config inputs
        container.querySelectorAll('.sets-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                exercises[index].sets = parseInt(e.target.value) || 3;
            });
        });

        container.querySelectorAll('.reps-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                exercises[index].reps = e.target.value || '8-12';
            });
        });

        // Remove exercise buttons
        container.querySelectorAll('.remove-exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-exercise-btn').dataset.index);
                exercises.splice(index, 1);
                this.renderTemplateExercises(exercises);
            });
        });
    },

    // ==========================================
    // EXERCISE PICKER FOR TEMPLATES
    // ==========================================
    showExercisePickerForTemplate(callback) {
        const picker = document.createElement('div');
        picker.className = 'exercise-picker-overlay active';
        picker.innerHTML = `
            <div class="exercise-picker-content">
                <div class="picker-header">
                    <h3>Select Exercises</h3>
                    <button class="picker-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="picker-search">
                    <i class="fas fa-search"></i>
                    <input type="text" id="templatePickerSearch" placeholder="Search exercises...">
                </div>
                
                <div class="picker-filters">
                    <button class="picker-filter active" data-muscle="all">All</button>
                    <button class="picker-filter" data-muscle="chest">Chest</button>
                    <button class="picker-filter" data-muscle="back">Back</button>
                    <button class="picker-filter" data-muscle="shoulders">Shoulders</button>
                    <button class="picker-filter" data-muscle="biceps">Biceps</button>
                    <button class="picker-filter" data-muscle="triceps">Triceps</button>
                    <button class="picker-filter" data-muscle="legs">Legs</button>
                    <button class="picker-filter" data-muscle="core">Core</button>
                </div>
                
                <div class="picker-exercises" id="templatePickerExercises">
                    <!-- Exercises will be rendered here -->
                </div>
                
                <div class="picker-footer">
                    <span class="selected-count">0 selected</span>
                    <button class="add-selected-btn" id="addSelectedExercises" disabled>
                        Add Selected
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(picker);

        let selectedExercises = [];
        let currentFilter = 'all';
        let searchQuery = '';

        const renderExercises = () => {
            let exercises = currentFilter === 'all' 
                ? ExerciseDatabase.exercises 
                : ExerciseDatabase.getExercisesByMuscle(currentFilter);

            if (searchQuery) {
                exercises = exercises.filter(ex => 
                    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            const container = document.getElementById('templatePickerExercises');
            container.innerHTML = exercises.map(ex => `
                <div class="picker-exercise-item ${selectedExercises.includes(ex.id) ? 'selected' : ''}" 
                     data-id="${ex.id}">
                    <div class="picker-exercise-icon ${ex.muscle}">
                        <i class="fas ${ExerciseDatabase.getMuscleIcon(ex.muscle)}"></i>
                    </div>
                    <div class="picker-exercise-info">
                        <h4>${ex.name}</h4>
                        <p>${ex.muscle} · ${ex.equipment}</p>
                    </div>
                    <div class="picker-exercise-check">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            `).join('');

            // Click to select
            container.querySelectorAll('.picker-exercise-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = parseInt(item.dataset.id);
                    
                    if (selectedExercises.includes(id)) {
                        selectedExercises = selectedExercises.filter(i => i !== id);
                        item.classList.remove('selected');
                    } else {
                        selectedExercises.push(id);
                        item.classList.add('selected');
                    }

                    updateFooter();
                });
            });
        };

        const updateFooter = () => {
            const countEl = picker.querySelector('.selected-count');
            const addBtn = picker.querySelector('#addSelectedExercises');
            
            countEl.textContent = `${selectedExercises.length} selected`;
            addBtn.disabled = selectedExercises.length === 0;
        };

        // Initial render
        renderExercises();

        // Search
        picker.querySelector('#templatePickerSearch').addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderExercises();
        });

        // Filters
        picker.querySelectorAll('.picker-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                picker.querySelectorAll('.picker-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.muscle;
                renderExercises();
            });
        });

        // Close
        picker.querySelector('.picker-close-btn').addEventListener('click', () => {
            picker.remove();
        });

        picker.addEventListener('click', (e) => {
            if (e.target === picker) {
                picker.remove();
            }
        });

        // Add selected
        picker.querySelector('#addSelectedExercises').addEventListener('click', () => {
            if (callback && selectedExercises.length > 0) {
                callback(selectedExercises);
            }
            picker.remove();
        });
    },

    // ==========================================
    // RENDER TEMPLATES LIST
    // ==========================================
    renderTemplatesList() {
        const container = document.getElementById('templateList');
        if (!container) return;

        const allTemplates = this.getAllTemplates();
        const customTemplates = allTemplates.filter(t => !t.isDefault);
        const defaultTemplates = allTemplates.filter(t => t.isDefault);

        let html = '';

        // Custom Templates Section
        if (customTemplates.length > 0) {
            html += `
                <div class="templates-section">
                    <h3 class="templates-section-title">My Templates</h3>
                    ${customTemplates.map(template => this.renderTemplateCard(template)).join('')}
                </div>
            `;
        }

        // Default Templates Section
        html += `
            <div class="templates-section">
                <h3 class="templates-section-title">Default Templates</h3>
                ${defaultTemplates.map(template => this.renderTemplateCard(template)).join('')}
            </div>
        `;

        container.innerHTML = html;

        // Add event listeners
        this.setupTemplateCardListeners();
    },

    renderTemplateCard(template) {
        const exerciseCount = template.exercises?.length || 0;
        const colorClass = template.color || 'purple';

        return `
            <div class="template-card-new ${template.isDefault ? 'default' : 'custom'}" 
                 data-id="${template.id}"
                 data-is-default="${template.isDefault}">
                <div class="template-card-icon ${colorClass}">
                    <i class="fas ${template.icon || 'fa-dumbbell'}"></i>
                </div>
                <div class="template-card-info">
                    <h3>${template.name}</h3>
                    <p>${template.description || `${exerciseCount} exercises`}</p>
                    ${!template.isDefault && template.timesUsed ? `
                        <span class="template-usage">Used ${template.timesUsed} times</span>
                    ` : ''}
                </div>
                <div class="template-card-actions">
                    ${!template.isDefault ? `
                        <button class="template-action-btn edit-template" data-id="${template.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="template-action-btn delete-template" data-id="${template.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                    <button class="template-action-btn start-template" data-id="${template.id}" data-is-default="${template.isDefault}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        `;
    },

    setupTemplateCardListeners() {
        // Start template
        document.querySelectorAll('.start-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const isDefault = btn.dataset.isDefault === 'true';
                this.startTemplate(id, isDefault);
            });
        });

        // Edit template
        document.querySelectorAll('.edit-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const template = this.getTemplateById(id);
                if (template) {
                    this.showCreateModal(template);
                }
            });
        });

        // Delete template
        document.querySelectorAll('.delete-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                App.showConfirmModal(
                    'Delete Template?',
                    'This template will be permanently deleted.',
                    () => {
                        this.deleteTemplate(id);
                        this.renderTemplatesList();
                    },
                    'danger'
                );
            });
        });

        // Click on card to show details
        document.querySelectorAll('.template-card-new').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const isDefault = card.dataset.isDefault === 'true';
                this.showTemplateDetails(id, isDefault);
            });
        });
    },

    // ==========================================
    // START TEMPLATE WORKOUT
    // ==========================================
    startTemplate(id, isDefault) {
        let template;

        if (isDefault) {
            // Get from default templates
            const defaults = this.getAllTemplates().filter(t => t.isDefault);
            template = defaults.find(t => t.id === id);
        } else {
            // Get from custom templates
            template = this.getTemplateById(parseInt(id));
            if (template) {
                this.incrementUsage(parseInt(id));
            }
        }

        if (!template) {
            App.showToast('Template not found', 'error');
            return;
        }

        // Convert to workout format
        const workoutTemplate = {
            name: template.name,
            exercises: template.exercises.map(ex => ({
                id: ex.id,
                sets: ex.sets || 3,
                reps: ex.reps || '8-12'
            }))
        };

        if (App.isWorkoutActive) {
            App.showConfirmModal(
                'Workout in Progress',
                'You have an active workout. Do you want to discard it and start from template?',
                () => {
                    Workout.discardWorkout();
                    Workout.startFromTemplate(workoutTemplate);
                },
                'danger'
            );
        } else {
            Workout.startFromTemplate(workoutTemplate);
        }
    },

    // ==========================================
    // SHOW TEMPLATE DETAILS
    // ==========================================
    showTemplateDetails(id, isDefault) {
        let template;

        if (isDefault) {
            const defaults = this.getAllTemplates().filter(t => t.isDefault);
            template = defaults.find(t => t.id === id);
        } else {
            template = this.getTemplateById(parseInt(id));
        }

        if (!template) return;

        const modal = document.createElement('div');
        modal.className = 'template-detail-modal active';
        modal.innerHTML = `
            <div class="template-detail-content">
                <div class="template-detail-header ${template.color || 'purple'}">
                    <button class="detail-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="template-detail-icon">
                        <i class="fas ${template.icon || 'fa-dumbbell'}"></i>
                    </div>
                    <h2>${template.name}</h2>
                    <p>${template.description || `${template.exercises.length} exercises`}</p>
                </div>
                
                <div class="template-detail-body">
                    <h3>Exercises (${template.exercises.length})</h3>
                    <div class="template-detail-exercises">
                        ${template.exercises.map((ex, index) => {
                            const exercise = ExerciseDatabase.getExerciseById(ex.id);
                            if (!exercise) return '';
                            return `
                                <div class="detail-exercise-item">
                                    <span class="detail-exercise-number">${index + 1}</span>
                                    <div class="detail-exercise-icon ${exercise.muscle}">
                                        <i class="fas ${ExerciseDatabase.getMuscleIcon(exercise.muscle)}"></i>
                                    </div>
                                    <div class="detail-exercise-info">
                                        <h4>${exercise.name}</h4>
                                        <p>${ex.sets} sets × ${ex.reps} reps</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="template-detail-footer">
                    ${!template.isDefault ? `
                        <button class="detail-edit-btn" data-id="${template.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    ` : ''}
                    <button class="detail-start-btn" data-id="${template.id}" data-is-default="${isDefault}">
                        <i class="fas fa-play"></i> Start Workout
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close
        modal.querySelector('.detail-close-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Edit
        const editBtn = modal.querySelector('.detail-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                modal.remove();
                const tmpl = this.getTemplateById(parseInt(editBtn.dataset.id));
                if (tmpl) {
                    this.showCreateModal(tmpl);
                }
            });
        }

        // Start
        modal.querySelector('.detail-start-btn').addEventListener('click', () => {
            modal.remove();
            const startId = modal.querySelector('.detail-start-btn').dataset.id;
            const startIsDefault = modal.querySelector('.detail-start-btn').dataset.isDefault === 'true';
            this.startTemplate(startId, startIsDefault);
        });
    },

    // ==========================================
    // ADD STYLES
    // ==========================================
    addTemplateModalStyles() {
        if (document.getElementById('template-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'template-modal-styles';
        styles.textContent = `
            /* ==========================================
               TEMPLATE MODAL
               ========================================== */
            .template-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 1000;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .template-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .template-modal-content {
                width: 100%;
                max-width: 480px;
                max-height: 90vh;
                background: var(--bg-secondary);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                display: flex;
                flex-direction: column;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }

            .template-modal.active .template-modal-content {
                transform: translateY(0);
            }

            .template-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-lg);
                border-bottom: 1px solid var(--bg-tertiary);
            }

            .template-modal-header h2 {
                font-size: 1.3rem;
                font-weight: 700;
            }

            .modal-close-btn {
                width: 40px;
                height: 40px;
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-full);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition-fast);
            }

            .modal-close-btn:hover {
                background: var(--bg-card-hover);
                color: var(--text-primary);
            }

            .template-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: var(--space-lg);
            }

            .template-modal-footer {
                display: flex;
                gap: var(--space-md);
                padding: var(--space-lg);
                border-top: 1px solid var(--bg-tertiary);
            }

            .cancel-btn {
                flex: 1;
                padding: var(--space-md);
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-lg);
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .cancel-btn:hover {
                background: var(--bg-card-hover);
            }

            .save-template-btn {
                flex: 2;
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
            }

            .save-template-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }

            /* Form Groups */
            .form-group {
                margin-bottom: var(--space-lg);
            }

            .form-group label {
                display: block;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-secondary);
                margin-bottom: var(--space-sm);
            }

            .form-input {
                width: 100%;
                padding: var(--space-md);
                background: var(--bg-tertiary);
                border: 2px solid transparent;
                border-radius: var(--radius-lg);
                color: var(--text-primary);
                font-size: 1rem;
                outline: none;
                transition: var(--transition-fast);
            }

            .form-input:focus {
                border-color: var(--accent-primary);
            }

            .form-input::placeholder {
                color: var(--text-tertiary);
            }

            /* Icon Selector */
            .icon-selector {
                display: flex;
                gap: var(--space-sm);
                flex-wrap: wrap;
            }

            .icon-option {
                width: 48px;
                height: 48px;
                background: var(--bg-tertiary);
                border: 2px solid transparent;
                border-radius: var(--radius-md);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                transition: var(--transition-fast);
            }

            .icon-option:hover {
                background: var(--bg-card-hover);
                color: var(--text-primary);
            }

            .icon-option.selected {
                background: var(--accent-primary);
                border-color: var(--accent-primary);
                color: white;
            }

            /* Color Selector */
            .color-selector {
                display: flex;
                gap: var(--space-sm);
                flex-wrap: wrap;
            }

            .color-option {
                width: 40px;
                height: 40px;
                border: 3px solid transparent;
                border-radius: var(--radius-full);
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .color-option:hover {
                transform: scale(1.1);
            }

            .color-option.selected {
                border-color: white;
                box-shadow: 0 0 0 2px var(--bg-secondary);
            }

            .color-option.purple { background: linear-gradient(135deg, #6c5ce7, #a29bfe); }
            .color-option.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
            .color-option.green { background: linear-gradient(135deg, #22c55e, #4ade80); }
            .color-option.orange { background: linear-gradient(135deg, #f97316, #fb923c); }
            .color-option.pink { background: linear-gradient(135deg, #ec4899, #f472b6); }
            .color-option.cyan { background: linear-gradient(135deg, #06b6d4, #22d3ee); }
            .color-option.red { background: linear-gradient(135deg, #ef4444, #f87171); }
            .color-option.yellow { background: linear-gradient(135deg, #eab308, #facc15); }

            /* Exercises Header */
            .exercises-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .add-exercise-to-template-btn {
                padding: var(--space-sm) var(--space-md);
                background: var(--accent-primary);
                border: none;
                border-radius: var(--radius-md);
                color: white;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                transition: var(--transition-fast);
            }

            .add-exercise-to-template-btn:hover {
                transform: translateY(-2px);
            }

            /* Template Exercises List */
            .template-exercises-list {
                margin-top: var(--space-md);
                max-height: 300px;
                overflow-y: auto;
            }

            .empty-exercises {
                text-align: center;
                padding: var(--space-xl);
                color: var(--text-tertiary);
            }

            .empty-exercises i {
                font-size: 2rem;
                margin-bottom: var(--space-md);
            }

            .empty-exercises p {
                font-size: 1rem;
                color: var(--text-secondary);
            }

            .empty-exercises span {
                font-size: 0.85rem;
            }

            .template-exercise-item {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-md);
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-sm);
            }

            .template-exercise-drag {
                color: var(--text-tertiary);
                cursor: grab;
            }

            .template-exercise-info {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                flex: 1;
                min-width: 0;
            }

            .template-exercise-icon {
                width: 36px;
                height: 36px;
                border-radius: var(--radius-sm);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .template-exercise-icon.chest { background: rgba(139, 92, 246, 0.2); color: var(--purple); }
            .template-exercise-icon.back { background: rgba(59, 130, 246, 0.2); color: var(--blue); }
            .template-exercise-icon.shoulders { background: rgba(249, 115, 22, 0.2); color: var(--orange); }
            .template-exercise-icon.biceps { background: rgba(236, 72, 153, 0.2); color: var(--pink); }
            .template-exercise-icon.triceps { background: rgba(6, 182, 212, 0.2); color: var(--cyan); }
            .template-exercise-icon.legs { background: rgba(34, 197, 94, 0.2); color: var(--green); }
            .template-exercise-icon.core { background: rgba(250, 204, 21, 0.2); color: var(--warning); }

            .template-exercise-details {
                min-width: 0;
            }

            .template-exercise-details h4 {
                font-size: 0.9rem;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .template-exercise-details p {
                font-size: 0.75rem;
                color: var(--text-tertiary);
            }

            .template-exercise-config {
                display: flex;
                gap: var(--space-xs);
            }

            .config-field {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .config-field label {
                font-size: 0.65rem;
                color: var(--text-tertiary);
                margin-bottom: 2px;
            }

            .config-input {
                width: 50px;
                padding: var(--space-xs);
                background: var(--bg-card);
                border: 1px solid var(--bg-tertiary);
                border-radius: var(--radius-sm);
                color: var(--text-primary);
                font-size: 0.85rem;
                text-align: center;
                outline: none;
            }

            .config-input:focus {
                border-color: var(--accent-primary);
            }

            .remove-exercise-btn {
                width: 32px;
                height: 32px;
                background: none;
                border: none;
                color: var(--text-tertiary);
                cursor: pointer;
                border-radius: var(--radius-sm);
                transition: var(--transition-fast);
            }

            .remove-exercise-btn:hover {
                background: rgba(239, 68, 68, 0.2);
                color: var(--error);
            }

            /* ==========================================
               EXERCISE PICKER OVERLAY
               ========================================== */
            .exercise-picker-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                z-index: 1100;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .exercise-picker-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .exercise-picker-content {
                width: 100%;
                max-width: 480px;
                margin: 0 auto;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .picker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-lg);
                border-bottom: 1px solid var(--bg-tertiary);
            }

            .picker-header h3 {
                font-size: 1.2rem;
                font-weight: 600;
            }

            .picker-close-btn {
                width: 40px;
                height: 40px;
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-full);
                color: var(--text-secondary);
                cursor: pointer;
            }

            .picker-search {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-md) var(--space-lg);
                background: var(--bg-secondary);
            }

            .picker-search i {
                color: var(--text-tertiary);
            }

            .picker-search input {
                flex: 1;
                background: none;
                border: none;
                outline: none;
                color: var(--text-primary);
                font-size: 1rem;
            }

            .picker-filters {
                display: flex;
                gap: var(--space-xs);
                padding: var(--space-md) var(--space-lg);
                overflow-x: auto;
                scrollbar-width: none;
            }

            .picker-filters::-webkit-scrollbar {
                display: none;
            }

            .picker-filter {
                padding: var(--space-sm) var(--space-md);
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-full);
                color: var(--text-secondary);
                font-size: 0.85rem;
                white-space: nowrap;
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .picker-filter.active {
                background: var(--accent-primary);
                color: white;
            }

            .picker-exercises {
                flex: 1;
                overflow-y: auto;
                padding: var(--space-md) var(--space-lg);
            }

            .picker-exercise-item {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-md);
                background: var(--bg-card);
                border: 2px solid transparent;
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-sm);
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .picker-exercise-item:hover {
                background: var(--bg-card-hover);
            }

            .picker-exercise-item.selected {
                border-color: var(--accent-primary);
                background: rgba(108, 92, 231, 0.1);
            }

            .picker-exercise-icon {
                width: 44px;
                height: 44px;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .picker-exercise-info {
                flex: 1;
            }

            .picker-exercise-info h4 {
                font-size: 0.95rem;
                font-weight: 500;
            }

            .picker-exercise-info p {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }

            .picker-exercise-check {
                width: 28px;
                height: 28px;
                background: var(--bg-tertiary);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                color: transparent;
                transition: var(--transition-fast);
            }

            .picker-exercise-item.selected .picker-exercise-check {
                background: var(--accent-primary);
                color: white;
            }

            .picker-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-lg);
                border-top: 1px solid var(--bg-tertiary);
                background: var(--bg-secondary);
            }

            .selected-count {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }

            .add-selected-btn {
                padding: var(--space-md) var(--space-xl);
                background: var(--accent-gradient);
                border: none;
                border-radius: var(--radius-lg);
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .add-selected-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .add-selected-btn:not(:disabled):hover {
                transform: translateY(-2px);
            }

            /* ==========================================
               TEMPLATE CARDS (NEW DESIGN)
               ========================================== */
            .templates-section {
                margin-bottom: var(--space-lg);
            }

            .templates-section-title {
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--text-tertiary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: var(--space-md);
            }

            .template-card-new {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-md);
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-sm);
                cursor: pointer;
                transition: var(--transition-fast);
                border: 1px solid transparent;
            }

            .template-card-new:hover {
                background: var(--bg-card-hover);
                border-color: var(--bg-tertiary);
            }

            .template-card-new.custom {
                border-left: 3px solid var(--accent-primary);
            }

            .template-card-icon {
                width: 50px;
                height: 50px;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.3rem;
                flex-shrink: 0;
            }

            .template-card-icon.purple { background: linear-gradient(135deg, #6c5ce7, #a29bfe); }
            .template-card-icon.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
            .template-card-icon.green { background: linear-gradient(135deg, #22c55e, #4ade80); }
            .template-card-icon.orange { background: linear-gradient(135deg, #f97316, #fb923c); }
            .template-card-icon.pink { background: linear-gradient(135deg, #ec4899, #f472b6); }
            .template-card-icon.cyan { background: linear-gradient(135deg, #06b6d4, #22d3ee); }
            .template-card-icon.red { background: linear-gradient(135deg, #ef4444, #f87171); }
            .template-card-icon.yellow { background: linear-gradient(135deg, #eab308, #facc15); }

            .template-card-info {
                flex: 1;
                min-width: 0;
            }

            .template-card-info h3 {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 2px;
            }

            .template-card-info p {
                font-size: 0.85rem;
                color: var(--text-secondary);
            }

            .template-usage {
                font-size: 0.75rem;
                color: var(--text-tertiary);
            }

            .template-card-actions {
                display: flex;
                gap: var(--space-xs);
            }

            .template-action-btn {
                width: 36px;
                height: 36px;
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-md);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition-fast);
            }

            .template-action-btn:hover {
                background: var(--bg-card-hover);
                color: var(--text-primary);
            }

            .template-action-btn.start-template {
                background: var(--accent-primary);
                color: white;
            }

            .template-action-btn.start-template:hover {
                background: var(--accent-secondary);
            }

            .template-action-btn.delete-template:hover {
                background: rgba(239, 68, 68, 0.2);
                color: var(--error);
            }

            /* ==========================================
               TEMPLATE DETAIL MODAL
               ========================================== */
            .template-detail-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 1000;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .template-detail-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .template-detail-content {
                width: 100%;
                max-width: 480px;
                max-height: 85vh;
                background: var(--bg-secondary);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .template-detail-header {
                padding: var(--space-xl);
                text-align: center;
                position: relative;
            }

            .template-detail-header.purple { background: linear-gradient(135deg, #6c5ce7, #a29bfe); }
            .template-detail-header.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
            .template-detail-header.green { background: linear-gradient(135deg, #22c55e, #4ade80); }
            .template-detail-header.orange { background: linear-gradient(135deg, #f97316, #fb923c); }
            .template-detail-header.pink { background: linear-gradient(135deg, #ec4899, #f472b6); }
            .template-detail-header.cyan { background: linear-gradient(135deg, #06b6d4, #22d3ee); }
            .template-detail-header.red { background: linear-gradient(135deg, #ef4444, #f87171); }
            .template-detail-header.yellow { background: linear-gradient(135deg, #eab308, #facc15); }

            .detail-close-btn {
                position: absolute;
                top: var(--space-md);
                right: var(--space-md);
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: var(--radius-full);
                color: white;
                cursor: pointer;
            }

            .template-detail-icon {
                width: 70px;
                height: 70px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto var(--space-md);
                font-size: 2rem;
                color: white;
            }

            .template-detail-header h2 {
                font-size: 1.5rem;
                font-weight: 700;
                color: white;
                margin-bottom: var(--space-xs);
            }

            .template-detail-header p {
                font-size: 0.95rem;
                color: rgba(255, 255, 255, 0.8);
            }

            .template-detail-body {
                flex: 1;
                overflow-y: auto;
                padding: var(--space-lg);
            }

            .template-detail-body h3 {
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-secondary);
                margin-bottom: var(--space-md);
            }

            .template-detail-exercises {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }

            .detail-exercise-item {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-md);
                background: var(--bg-card);
                border-radius: var(--radius-md);
            }

            .detail-exercise-number {
                width: 28px;
                height: 28px;
                background: var(--bg-tertiary);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--text-secondary);
            }

            .detail-exercise-icon {
                width: 40px;
                height: 40px;
                border-radius: var(--radius-sm);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .detail-exercise-info {
                flex: 1;
            }

            .detail-exercise-info h4 {
                font-size: 0.95rem;
                font-weight: 500;
            }

            .detail-exercise-info p {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }

            .template-detail-footer {
                display: flex;
                gap: var(--space-md);
                padding: var(--space-lg);
                border-top: 1px solid var(--bg-tertiary);
            }

            .detail-edit-btn {
                flex: 1;
                padding: var(--space-md);
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-lg);
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
            }

            .detail-start-btn {
                flex: 2;
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
            }

            .detail-start-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
        `;

        document.head.appendChild(styles);
    }
};

// Initialize Templates styles
Templates.addTemplateModalStyles();