const Charts = {
    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.createChartStyles();
    },

    createChartStyles() {
        if (document.getElementById('chart-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'chart-styles';
        styles.textContent = `
            .chart-container {
                background: var(--bg-card);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                margin-bottom: var(--space-md);
            }
            
            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .chart-header h3 {
                font-size: 1rem;
                font-weight: 600;
            }
            
            .chart-period {
                display: flex;
                gap: var(--space-xs);
            }
            
            .chart-period button {
                padding: var(--space-xs) var(--space-sm);
                background: var(--bg-tertiary);
                border: none;
                border-radius: var(--radius-sm);
                color: var(--text-secondary);
                font-size: 0.75rem;
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .chart-period button.active {
                background: var(--accent-primary);
                color: white;
            }
            
            .chart-body {
                position: relative;
                height: 200px;
            }
            
            .bar-chart {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                height: 100%;
                padding-top: var(--space-md);
            }
            
            .bar-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                height: 100%;
            }
            
            .bar-wrapper {
                flex: 1;
                width: 100%;
                display: flex;
                align-items: flex-end;
                justify-content: center;
            }
            
            .bar {
                width: 60%;
                max-width: 40px;
                background: var(--accent-gradient);
                border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                cursor: pointer;
            }
            
            .bar:hover {
                filter: brightness(1.1);
            }
            
            .bar-tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-primary);
                padding: var(--space-xs) var(--space-sm);
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: var(--transition-fast);
                z-index: 10;
                box-shadow: var(--shadow-md);
            }
            
            .bar:hover .bar-tooltip {
                opacity: 1;
                visibility: visible;
            }
            
            .bar-label {
                margin-top: var(--space-xs);
                font-size: 0.7rem;
                color: var(--text-tertiary);
            }
            
            .line-chart {
                position: relative;
                height: 100%;
            }
            
            .line-chart svg {
                width: 100%;
                height: 100%;
            }
            
            .line-path {
                fill: none;
                stroke: var(--accent-primary);
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            
            .line-area {
                fill: url(#lineGradient);
                opacity: 0.3;
            }
            
            .line-dot {
                fill: var(--accent-primary);
                stroke: var(--bg-card);
                stroke-width: 2;
                cursor: pointer;
                transition: var(--transition-fast);
            }
            
            .line-dot:hover {
                r: 6;
            }
            
            .chart-legend {
                display: flex;
                justify-content: center;
                gap: var(--space-lg);
                margin-top: var(--space-md);
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            
            .legend-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
            }
            
            .progress-ring {
                transform: rotate(-90deg);
            }
            
            .progress-ring-circle {
                transition: stroke-dashoffset 0.5s ease;
            }
            
            .donut-chart {
                position: relative;
                width: 150px;
                height: 150px;
                margin: 0 auto;
            }
            
            .donut-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            }
            
            .donut-value {
                font-size: 1.5rem;
                font-weight: 700;
            }
            
            .donut-label {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            
            .heatmap {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 3px;
            }
            
            .heatmap-cell {
                aspect-ratio: 1;
                border-radius: 3px;
                background: var(--bg-tertiary);
                transition: var(--transition-fast);
                cursor: pointer;
            }
            
            .heatmap-cell:hover {
                transform: scale(1.2);
                z-index: 1;
            }
            
            .heatmap-cell.level-1 { background: rgba(108, 92, 231, 0.2); }
            .heatmap-cell.level-2 { background: rgba(108, 92, 231, 0.4); }
            .heatmap-cell.level-3 { background: rgba(108, 92, 231, 0.6); }
            .heatmap-cell.level-4 { background: rgba(108, 92, 231, 0.8); }
            .heatmap-cell.level-5 { background: rgba(108, 92, 231, 1); }
            
            .heatmap-labels {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 3px;
                margin-bottom: var(--space-xs);
            }
            
            .heatmap-label {
                text-align: center;
                font-size: 0.65rem;
                color: var(--text-tertiary);
            }
        `;
        document.head.appendChild(styles);
    },

    // ==========================================
    // BAR CHART
    // ==========================================
    createBarChart(container, data, options = {}) {
        const {
            title = 'Chart',
            showPeriods = true,
            height = 200,
            color = 'var(--accent-primary)'
        } = options;

        const maxValue = Math.max(...data.map(d => d.value), 1);

        const html = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3>${title}</h3>
                    ${showPeriods ? `
                        <div class="chart-period">
                            <button class="active" data-period="week">Week</button>
                            <button data-period="month">Month</button>
                            <button data-period="year">Year</button>
                        </div>
                    ` : ''}
                </div>
                <div class="chart-body" style="height: ${height}px">
                    <div class="bar-chart">
                        ${data.map(d => `
                            <div class="bar-group">
                                <div class="bar-wrapper">
                                    <div class="bar" style="height: ${(d.value / maxValue) * 100}%">
                                        <div class="bar-tooltip">${d.tooltip || d.value}</div>
                                    </div>
                                </div>
                                <span class="bar-label">${d.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        if (typeof container === 'string') {
            document.querySelector(container).innerHTML = html;
        } else {
            container.innerHTML = html;
        }
    },

    // ==========================================
    // LINE CHART
    // ==========================================
    createLineChart(container, data, options = {}) {
        const {
            title = 'Progress',
            height = 200,
            showArea = true
        } = options;

        const maxValue = Math.max(...data.map(d => d.value), 1);
        const minValue = Math.min(...data.map(d => d.value), 0);
        const range = maxValue - minValue || 1;
        
        const width = 100;
        const chartHeight = 80;
        const padding = 10;
        
        const points = data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (width - padding * 2);
            const y = chartHeight - padding - ((d.value - minValue) / range) * (chartHeight - padding * 2);
            return { x, y, ...d };
        });

        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaD = pathD + ` L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

        const html = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3>${title}</h3>
                </div>
                <div class="chart-body" style="height: ${height}px">
                    <div class="line-chart">
                        <svg viewBox="0 0 ${width} ${chartHeight}" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color: var(--accent-primary); stop-opacity: 0.3"/>
                                    <stop offset="100%" style="stop-color: var(--accent-primary); stop-opacity: 0"/>
                                </linearGradient>
                            </defs>
                            ${showArea ? `<path class="line-area" d="${areaD}"/>` : ''}
                            <path class="line-path" d="${pathD}"/>
                            ${points.map(p => `
                                <circle class="line-dot" cx="${p.x}" cy="${p.y}" r="4">
                                    <title>${p.label}: ${p.value}</title>
                                </circle>
                            `).join('')}
                        </svg>
                    </div>
                </div>
            </div>
        `;

        if (typeof container === 'string') {
            document.querySelector(container).innerHTML = html;
        } else {
            container.innerHTML = html;
        }
    },

    // ==========================================
    // DONUT CHART
    // ==========================================
    createDonutChart(container, data, options = {}) {
        const {
            title = 'Distribution',
            size = 150,
            strokeWidth = 20
        } = options;

        const total = data.reduce((sum, d) => sum + d.value, 0);
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        
        let currentOffset = 0;
        const segments = data.map(d => {
            const percentage = d.value / total;
            const dashArray = `${percentage * circumference} ${circumference}`;
            const offset = -currentOffset * circumference;
            currentOffset += percentage;
            return { ...d, dashArray, offset };
        });

        const html = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3>${title}</h3>
                </div>
                <div class="donut-chart" style="width: ${size}px; height: ${size}px">
                    <svg viewBox="0 0 ${size} ${size}">
                        ${segments.map((s, i) => `
                            <circle
                                cx="${size / 2}"
                                cy="${size / 2}"
                                r="${radius}"
                                fill="none"
                                stroke="${s.color}"
                                stroke-width="${strokeWidth}"
                                stroke-dasharray="${s.dashArray}"
                                stroke-dashoffset="${s.offset}"
                                class="progress-ring-circle"
                                style="transform-origin: center; transform: rotate(${-90 + (s.offset / circumference) * 360}deg)"
                            />
                        `).join('')}
                    </svg>
                    <div class="donut-center">
                        <div class="donut-value">${total}</div>
                        <div class="donut-label">Total</div>
                    </div>
                </div>
                <div class="chart-legend">
                    ${data.map(d => `
                        <div class="legend-item">
                            <span class="legend-dot" style="background: ${d.color}"></span>
                            <span>${d.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (typeof container === 'string') {
            document.querySelector(container).innerHTML = html;
        } else {
            container.innerHTML = html;
        }
    },

    // ==========================================
    // ACTIVITY HEATMAP
    // ==========================================
    createHeatmap(container, data, options = {}) {
        const {
            title = 'Activity',
            weeks = 12
        } = options;

        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const totalDays = weeks * 7;
        
        // Generate cells
        const today = new Date();
        const cells = [];
        
        for (let i = totalDays - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = data.find(d => d.date === dateStr);
            const level = dayData ? Math.min(Math.ceil(dayData.value / 2), 5) : 0;
            cells.push({
                date: dateStr,
                level,
                value: dayData?.value || 0
            });
        }

        const html = `
            <div class="chart-container">
                <div class="chart-header">
                    <h3>${title}</h3>
                </div>
                <div class="heatmap-labels">
                    ${days.map(d => `<span class="heatmap-label">${d}</span>`).join('')}
                </div>
                <div class="heatmap">
                    ${cells.map(c => `
                        <div class="heatmap-cell level-${c.level}" 
                             title="${c.date}: ${c.value} workouts"
                             data-date="${c.date}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (typeof container === 'string') {
            document.querySelector(container).innerHTML = html;
        } else {
            container.innerHTML = html;
        }
    },

    // ==========================================
    // MUSCLE DISTRIBUTION CHART
    // ==========================================
    createMuscleChart(container) {
        const stats = UserData.getStats();
        const muscles = stats?.muscleActivity || {};
        
        const colors = {
            chest: '#8b5cf6',
            back: '#3b82f6',
            shoulders: '#f97316',
            biceps: '#ec4899',
            triceps: '#06b6d4',
            legs: '#22c55e',
            core: '#facc15'
        };

        const data = Object.entries(muscles)
            .filter(([key]) => key !== 'forearms')
            .map(([key, value]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: Math.round(value),
                color: colors[key] || '#6c5ce7'
            }))
            .sort((a, b) => b.value - a.value);

        this.createDonutChart(container, data, {
            title: 'Muscle Distribution'
        });
    },

    // ==========================================
    // WEEKLY VOLUME CHART
    // ==========================================
    createWeeklyVolumeChart(container) {
        const workouts = UserData.getWorkouts() || [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Get last 7 days
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayWorkouts = workouts.filter(w => 
                w.date && w.date.split('T')[0] === dateStr
            );
            
            const volume = dayWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
            
            data.push({
                label: days[date.getDay()],
                value: volume,
                tooltip: `${UserData.formatVolume(volume)} kg`
            });
        }

        this.createBarChart(container, data, {
            title: 'Weekly Volume',
            showPeriods: false
        });
    },

    // ==========================================
    // PROGRESS CHART
    // ==========================================
    createProgressChart(container, exerciseId) {
        const workouts = UserData.getWorkouts() || [];
        const data = [];

        // Get last 10 sessions of this exercise
        workouts.forEach(workout => {
            const exercise = workout.exercises?.find(e => e.exerciseId === exerciseId);
            if (exercise) {
                const maxWeight = Math.max(...exercise.sets
                    .filter(s => s.completed)
                    .map(s => parseFloat(s.weight) || 0)
                );
                if (maxWeight > 0) {
                    data.push({
                        label: UserData.formatDate(workout.date).split(',')[0],
                        value: maxWeight
                    });
                }
            }
        });

        if (data.length < 2) {
            if (typeof container === 'string') {
                document.querySelector(container).innerHTML = `
                    <div class="chart-container">
                        <div class="empty-state small">
                            <i class="fas fa-chart-line"></i>
                            <p>Not enough data</p>
                        </div>
                    </div>
                `;
            }
            return;
        }

        this.createLineChart(container, data.reverse().slice(-10), {
            title: 'Weight Progress (kg)'
        });
    }
};

// Initialize
Charts.init();