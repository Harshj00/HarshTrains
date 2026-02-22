const Calendar = {
    currentDate: new Date(),
    selectedDate: null,

    // ==========================================
    // RENDER CALENDAR
    // ==========================================
    render(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const workouts = this.getMonthWorkouts(year, month);

        const html = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-nav" id="prevMonth">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h3>${monthNames[month]} ${year}</h3>
                    <button class="calendar-nav" id="nextMonth">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="calendar-weekdays">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
                
                <div class="calendar-days">
                    ${this.renderDays(year, month, startDay, totalDays, workouts)}
                </div>
                
                <div class="calendar-selected" id="calendarSelected">
                    <div class="empty-state small">
                        <i class="fas fa-calendar-day"></i>
                        <p>Select a date</p>
                    </div>
                </div>
            </div>
        `;

        if (typeof container === 'string') {
            document.querySelector(container).innerHTML = html;
        } else {
            container.innerHTML = html;
        }

        this.addCalendarStyles();
        this.setupEventListeners();
    },

    renderDays(year, month, startDay, totalDays, workouts) {
        let html = '';
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // Empty cells for days before first of month
        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayWorkouts = workouts.filter(w => w.date.split('T')[0] === dateStr);
            const isToday = isCurrentMonth && today.getDate() === day;
            const hasWorkout = dayWorkouts.length > 0;

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''}"
                     data-date="${dateStr}"
                     data-count="${dayWorkouts.length}">
                    <span class="day-number">${day}</span>
                    ${hasWorkout ? `<span class="workout-dot"></span>` : ''}
                </div>
            `;
        }

        return html;
    },

    getMonthWorkouts(year, month) {
        const workouts = UserData.getWorkouts() || [];
        return workouts.filter(w => {
            if (!w.date) return false;
            const d = new Date(w.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
    },

    setupEventListeners() {
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render(document.querySelector('.calendar-container').parentElement);
        });

        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render(document.querySelector('.calendar-container').parentElement);
        });

        document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                this.selectDate(day.dataset.date);
            });
        });
    },

    selectDate(dateStr) {
        // Update UI
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        document.querySelector(`[data-date="${dateStr}"]`)?.classList.add('selected');

        this.selectedDate = dateStr;

        // Show workouts for this date
        const container = document.getElementById('calendarSelected');
        const workouts = UserData.getWorkouts()?.filter(w => 
            w.date && w.date.split('T')[0] === dateStr
        ) || [];

        if (workouts.length === 0) {
            container.innerHTML = `
                <div class="selected-date-header">
                    <h4>${new Date(dateStr).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</h4>
                </div>
                <div class="empty-state small">
                    <i class="fas fa-dumbbell"></i>
                    <p>No workouts</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="selected-date-header">
                    <h4>${new Date(dateStr).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</h4>
                    <span>${workouts.length} workout${workouts.length > 1 ? 's' : ''}</span>
                </div>
                <div class="selected-workouts">
                    ${workouts.map(w => `
                        <div class="calendar-workout-card">
                            <div class="workout-card-icon">
                                <i class="fas fa-dumbbell"></i>
                            </div>
                            <div class="workout-card-info">
                                <h5>${w.name || 'Workout'}</h5>
                                <p>${w.exercises?.length || 0} exercises · ${UserData.formatDuration(w.duration || 0)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    addCalendarStyles() {
        if (document.getElementById('calendar-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'calendar-styles';
        styles.textContent = `
            .calendar-container {
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
            }
            
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .calendar-header h3 {
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .calendar-nav {
                width: 36px;
                height: 36px;
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-md);
                color: var(--text-secondary);
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .calendar-nav:hover {
                background: var(--bg-card-hover);
                color: var(--text-primary);
            }
            
            .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                margin-bottom: var(--space-sm);
            }
            
            .calendar-weekdays span {
                text-align: center;
                font-size: 0.75rem;
                color: var(--text-tertiary);
                font-weight: 500;
            }
            
            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
            }
            
            .calendar-day {
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: var(--transition-fast);
                position: relative;
            }
            
            .calendar-day:hover:not(.empty) {
                background: var(--bg-tertiary);
            }
            
            .calendar-day.empty {
                cursor: default;
            }
            
            .calendar-day.today {
                background: var(--accent-primary);
            }
            
            .calendar-day.today .day-number {
                color: white;
            }
            
            .calendar-day.selected {
                background: var(--bg-tertiary);
                border: 2px solid var(--accent-primary);
            }
            
            .calendar-day.has-workout .workout-dot {
                position: absolute;
                bottom: 4px;
                width: 6px;
                height: 6px;
                background: var(--success);
                border-radius: 50%;
            }
            
            .calendar-day.today.has-workout .workout-dot {
                background: white;
            }
            
            .day-number {
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .calendar-selected {
                margin-top: var(--space-md);
                padding-top: var(--space-md);
                border-top: 1px solid var(--bg-tertiary);
            }
            
            .selected-date-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .selected-date-header h4 {
                font-size: 0.95rem;
                font-weight: 600;
            }
            
            .selected-date-header span {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            
            .selected-workouts {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            
            .calendar-workout-card {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-sm);
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
            }
            
            .calendar-workout-card .workout-card-icon {
                width: 40px;
                height: 40px;
                background: var(--accent-gradient);
                border-radius: var(--radius-sm);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .calendar-workout-card .workout-card-info h5 {
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .calendar-workout-card .workout-card-info p {
                font-size: 0.75rem;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(styles);
    }
};