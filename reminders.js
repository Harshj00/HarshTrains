/* ========================================
   LYFTA CLONE - WORKOUT REMINDERS
   ======================================== */

const Reminders = {
    STORAGE_KEY: 'lyfta_reminders',

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.checkPermission();
        this.addReminderStyles();
    },

    // ==========================================
    // PERMISSION
    // ==========================================
    async checkPermission() {
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    async requestPermission() {
        const granted = await this.checkPermission();
        if (granted) {
            App.showToast('Notifications enabled!', 'success');
        } else {
            App.showToast('Notifications blocked', 'error');
        }
        return granted;
    },

    // ==========================================
    // GET/SET REMINDERS
    // ==========================================
    getReminders() {
        const reminders = localStorage.getItem(this.STORAGE_KEY);
        return reminders ? JSON.parse(reminders) : [];
    },

    saveReminders(reminders) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
    },

    addReminder(reminder) {
        const reminders = this.getReminders();
        reminder.id = Date.now();
        reminder.enabled = true;
        reminders.push(reminder);
        this.saveReminders(reminders);
        this.scheduleReminder(reminder);
        return reminder;
    },

    removeReminder(id) {
        let reminders = this.getReminders();
        reminders = reminders.filter(r => r.id !== id);
        this.saveReminders(reminders);
    },

    toggleReminder(id) {
        const reminders = this.getReminders();
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            reminder.enabled = !reminder.enabled;
            this.saveReminders(reminders);
        }
    },

    // ==========================================
    // SCHEDULING
    // ==========================================
    scheduleReminder(reminder) {
        if (!reminder.enabled) return;

        const now = new Date();
        const [hours, minutes] = reminder.time.split(':').map(Number);
        
        let nextReminder = new Date();
        nextReminder.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (nextReminder <= now) {
            nextReminder.setDate(nextReminder.getDate() + 1);
        }

        // Check if the day matches
        const days = reminder.days || [0, 1, 2, 3, 4, 5, 6];
        while (!days.includes(nextReminder.getDay())) {
            nextReminder.setDate(nextReminder.getDate() + 1);
        }

        const delay = nextReminder - now;

        setTimeout(() => {
            this.showNotification(reminder);
            // Reschedule for next occurrence
            this.scheduleReminder(reminder);
        }, delay);
    },

    scheduleAllReminders() {
        const reminders = this.getReminders();
        reminders.forEach(r => {
            if (r.enabled) {
                this.scheduleReminder(r);
            }
        });
    },

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    async showNotification(reminder) {
        if (Notification.permission !== 'granted') return;

        const notification = new Notification('🏋️ Workout Reminder', {
            body: reminder.message || 'Time for your workout!',
            icon: '/images/icon-192.png',
            badge: '/images/icon-192.png',
            vibrate: [100, 50, 100],
            tag: 'workout-reminder',
            renotify: true,
            actions: [
                { action: 'start', title: 'Start Workout' },
                { action: 'snooze', title: 'Snooze 10min' }
            ]
        });

        notification.onclick = () => {
            window.focus();
            App.startNewWorkout();
            notification.close();
        };
    },

    // ==========================================
    // UI
    // ==========================================
    renderRemindersUI(container) {
        const reminders = this.getReminders();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const html = `
            <div class="reminders-container">
                <div class="reminders-header">
                    <h3>Workout Reminders</h3>
                    <button class="add-reminder-btn" id="addReminderBtn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                ${reminders.length === 0 ? `
                    <div class="empty-state small">
                        <i class="fas fa-bell"></i>
                        <p>No reminders set</p>
                        <span>Add a reminder to stay consistent!</span>
                    </div>
                ` : `
                    <div class="reminders-list">
                        ${reminders.map(r => `
                            <div class="reminder-card ${r.enabled ? '' : 'disabled'}" data-id="${r.id}">
                                <div class="reminder-time">
                                    <span class="time">${r.time}</span>
                                    <span class="days">${(r.days || [0,1,2,3,4,5,6]).map(d => days[d]).join(', ')}</span>
                                </div>
                                <div class="reminder-actions">
                                    <label class="switch small">
                                        <input type="checkbox" ${r.enabled ? 'checked' : ''} data-id="${r.id}">
                                        <span class="slider"></span>
                                    </label>
                                    <button class="delete-reminder" data-id="${r.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        if (typeof container === 'string') {
            document.querySelector(container).innerHTML = html;
        } else {
            container.innerHTML = html;
        }

        this.setupReminderListeners();
    },

    setupReminderListeners() {
        document.getElementById('addReminderBtn')?.addEventListener('click', () => {
            this.showAddReminderModal();
        });

        document.querySelectorAll('.reminder-card input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.toggleReminder(parseInt(e.target.dataset.id));
                App.hapticFeedback('light');
            });
        });

        document.querySelectorAll('.delete-reminder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.delete-reminder').dataset.id);
                this.removeReminder(id);
                this.renderRemindersUI(document.querySelector('.reminders-container').parentElement);
                App.showToast('Reminder deleted', 'info');
            });
        });
    },

    showAddReminderModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-height: 80vh;">
                <div class="modal-header">
                    <h3>Add Reminder</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" id="reminderTime" value="09:00" class="form-input">
                    </div>
                    
                    <div class="form-group">
                        <label>Repeat</label>
                        <div class="day-selector">
                            <button class="day-btn" data-day="0">S</button>
                            <button class="day-btn selected" data-day="1">M</button>
                            <button class="day-btn selected" data-day="2">T</button>
                            <button class="day-btn selected" data-day="3">W</button>
                            <button class="day-btn selected" data-day="4">T</button>
                            <button class="day-btn selected" data-day="5">F</button>
                            <button class="day-btn" data-day="6">S</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Message (optional)</label>
                        <input type="text" id="reminderMessage" placeholder="Time for your workout!" class="form-input">
                    </div>
                    
                    <button class="save-reminder-btn" id="saveReminderBtn">
                        <i class="fas fa-bell"></i>
                        Save Reminder
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Day selection
        modal.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
            });
        });

        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Save reminder
        modal.querySelector('#saveReminderBtn').addEventListener('click', async () => {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                modal.remove();
                return;
            }

            const time = modal.querySelector('#reminderTime').value;
            const message = modal.querySelector('#reminderMessage').value;
            const days = Array.from(modal.querySelectorAll('.day-btn.selected'))
                .map(btn => parseInt(btn.dataset.day));

            if (days.length === 0) {
                App.showToast('Select at least one day', 'error');
                return;
            }

            this.addReminder({ time, message, days });
            this.renderRemindersUI(document.querySelector('.reminders-container').parentElement);
            App.showToast('Reminder added!', 'success');
            modal.remove();
        });
    },

    addReminderStyles() {
        if (document.getElementById('reminder-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'reminder-styles';
        styles.textContent = `
            .reminders-container {
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
            }
            
            .reminders-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .reminders-header h3 {
                font-size: 1rem;
                font-weight: 600;
            }
            
            .add-reminder-btn {
                width: 36px;
                height: 36px;
                background: var(--accent-primary);
                border: none;
                border-radius: var(--radius-md);
                color: white;
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .add-reminder-btn:hover {
                transform: scale(1.05);
            }
            
            .reminders-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            
            .reminder-card {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-md);
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
                transition: var(--transition-fast);
            }
            
            .reminder-card.disabled {
                opacity: 0.5;
            }
            
            .reminder-time .time {
                display: block;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .reminder-time .days {
                font-size: 0.75rem;
                color: var(--text-secondary);
            }
            
            .reminder-actions {
                display: flex;
                align-items: center;
                gap: var(--space-md);
            }
            
            .delete-reminder {
                background: none;
                border: none;
                color: var(--text-tertiary);
                cursor: pointer;
                padding: var(--space-xs);
                transition: var(--transition-fast);
            }
            
            .delete-reminder:hover {
                color: var(--error);
            }
            
            .switch.small {
                width: 40px;
                height: 22px;
            }
            
            .switch.small .slider:before {
                height: 16px;
                width: 16px;
                left: 3px;
                bottom: 3px;
            }
            
            .switch.small input:checked + .slider:before {
                transform: translateX(18px);
            }
            
            .form-group {
                margin-bottom: var(--space-lg);
            }
            
            .form-group label {
                display: block;
                font-size: 0.9rem;
                font-weight: 500;
                margin-bottom: var(--space-sm);
                color: var(--text-secondary);
            }
            
            .form-input {
                width: 100%;
                padding: var(--space-md);
                background: var(--bg-tertiary);
                border: 2px solid transparent;
                border-radius: var(--radius-md);
                color: var(--text-primary);
                font-size: 1rem;
                outline: none;
                transition: var(--transition-fast);
            }
            
            .form-input:focus {
                border-color: var(--accent-primary);
            }
            
            .day-selector {
                display: flex;
                gap: var(--space-xs);
            }
            
            .day-btn {
                width: 40px;
                height: 40px;
                background: var(--bg-tertiary);
                border: 2px solid transparent;
                border-radius: var(--radius-md);
                color: var(--text-secondary);
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .day-btn.selected {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }
            
            .save-reminder-btn {
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
            }
            
            .save-reminder-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
        `;
        document.head.appendChild(styles);
    }
};

// Initialize reminders
document.addEventListener('DOMContentLoaded', () => {
    Reminders.init();
    Reminders.scheduleAllReminders();
});