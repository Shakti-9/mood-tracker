  
        document.addEventListener('DOMContentLoaded', function() {
            // Mood data storage
            let moodData = JSON.parse(localStorage.getItem('moodData')) || {};
            
            // Current date and calendar navigation
            let currentDate = new Date();
            let currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();
            
            // DOM elements
            const calendarDays = document.getElementById('calendar-days');
            const currentMonthEl = document.getElementById('current-month');
            const prevMonthBtn = document.getElementById('prev-month');
            const nextMonthBtn = document.getElementById('next-month');
            const emojiBtns = document.querySelectorAll('.emoji-btn');
            const statsGrid = document.getElementById('stats-grid');
            const emojiBackground = document.getElementById('emoji-background');
            
            // Initialize calendar and background emojis
            renderCalendar(currentMonth, currentYear);
            updateStats();
            createBackgroundEmojis();
            
            // Event listeners
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar(currentMonth, currentYear);
            });
            
            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar(currentMonth, currentYear);
            });
            
            emojiBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const mood = this.dataset.mood;
                    const color = this.dataset.color;
                    const today = formatDate(currentDate);
                    
                    // Save mood for today
                    moodData[today] = { mood, color, emoji: this.textContent };
                    localStorage.setItem('moodData', JSON.stringify(moodData));
                    
                    // Visual feedback
                    this.classList.add('pulse');
                    setTimeout(() => {
                        this.classList.remove('pulse');
                    }, 1500);
                    
                    // Create confetti effect
                    createConfetti(color);
                    
                    // Update calendar, stats, and background emojis
                    renderCalendar(currentMonth, currentYear);
                    updateStats();
                    createBackgroundEmojis();
                });
            });
            
            // Functions
            function renderCalendar(month, year) {
                // Clear previous days
                calendarDays.innerHTML = '';
                
                // Set current month title
                const monthNames = ["January", "February", "March", "April", "May", "June", 
                                  "July", "August", "September", "October", "November", "December"];
                currentMonthEl.textContent = `${monthNames[month]} ${year}`;
                
                // Get first day of month and total days
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                // Add empty cells for days before first day of month
                for (let i = 0; i < firstDay; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.classList.add('day', 'empty');
                    calendarDays.appendChild(emptyDay);
                }
                
                // Add days of month
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const dateStr = formatDate(date);
                    const dayEl = document.createElement('div');
                    dayEl.classList.add('day');
                    
                    // Check if mood was recorded for this day
                    if (moodData[dateStr]) {
                        dayEl.classList.add('has-mood');
                        dayEl.innerHTML = `
                            <span class="day-emoji">${moodData[dateStr].emoji}</span>
                            <div class="day-bg" style="background-color: ${moodData[dateStr].color}"></div>
                        `;
                        
                        // Add tooltip with mood and date
                        dayEl.title = `${moodData[dateStr].mood} - ${dateStr}`;
                        
                        // Click to see details
                        dayEl.addEventListener('click', () => {
                            alert(`On ${dateStr} you felt ${moodData[dateStr].mood}`);
                        });
                    } else {
                        dayEl.textContent = day;
                        
                        // Make today's cell stand out
                        if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                            dayEl.style.border = '2px solid var(--text)';
                        }
                    }
                    
                    calendarDays.appendChild(dayEl);
                }
            }
            
            function formatDate(date) {
                const d = new Date(date);
                let month = '' + (d.getMonth() + 1);
                let day = '' + d.getDate();
                const year = d.getFullYear();
                
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                
                return [year, month, day].join('-');
            }
            
            function updateStats() {
                // Count each mood type
                const moodCounts = {
                    happy: 0,
                    sad: 0,
                    angry: 0,
                    calm: 0,
                    excited: 0,
                    tired: 0,
                    neutral: 0
                };
                
                Object.values(moodData).forEach(entry => {
                    moodCounts[entry.mood]++;
                });
                
                // Update stats grid
                statsGrid.innerHTML = '';
                
                for (const [mood, count] of Object.entries(moodCounts)) {
                    const statItem = document.createElement('div');
                    statItem.classList.add('stat-item');
                    
                    let emoji = '';
                    switch(mood) {
                        case 'happy': emoji = '😊'; break;
                        case 'sad': emoji = '😢'; break;
                        case 'angry': emoji = '😠'; break;
                        case 'calm': emoji = '😌'; break;
                        case 'excited': emoji = '🤩'; break;
                        case 'tired': emoji = '😴'; break;
                        case 'neutral': emoji = '😐'; break;
                    }
                    
                    statItem.innerHTML = `
                        <div class="stat-emoji">${emoji}</div>
                        <div class="stat-count">${count}</div>
                        <div class="stat-label">${mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
                    `;
                    
                    statsGrid.appendChild(statItem);
                }
            }
            
            function createConfetti(color) {
                const colors = [color, '#ffffff', '#f0f0f0'];
                
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
                    confetti.classList.add('confetti');
                    
                    // Random properties
                    const size = Math.random() * 10 + 5;
                    const left = Math.random() * window.innerWidth;
                    const animationDuration = Math.random() * 3 + 2;
                    const colorIndex = Math.floor(Math.random() * colors.length);
                    
                    confetti.style.width = `${size}px`;
                    confetti.style.height = `${size}px`;
                    confetti.style.left = `${left}px`;
                    confetti.style.backgroundColor = colors[colorIndex];
                    confetti.style.animationDuration = `${animationDuration}s`;
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    
                    document.body.appendChild(confetti);
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove();
                    }, animationDuration * 1000);
                }
            }
            
            function createBackgroundEmojis() {
                // Clear existing emojis
                emojiBackground.innerHTML = '';
                
                // Create emojis based on mood history
                const emojiMap = {
                    happy: '😊',
                    sad: '😢',
                    angry: '😠',
                    calm: '😌',
                    excited: '🤩',
                    tired: '😴',
                    neutral: '😐'
                };
                
                // Count total moods logged
                const totalMoods = Object.keys(moodData).length;
                
                // If no moods logged yet, show a mix of all possible emojis
                if (totalMoods === 0) {
                    for (let i = 0; i < 15; i++) {
                        createFloatingEmoji(Object.values(emojiMap)[Math.floor(Math.random() * 7)]);
                    }
                    return;
                }
                
                // Create emojis weighted by frequency in mood history
                Object.entries(moodData).forEach(([date, moodInfo]) => {
                    // Create more emojis for more recent entries
                    const daysAgo = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
                    const weight = daysAgo < 7 ? 3 : daysAgo < 30 ? 2 : 1;
                    
                    for (let i = 0; i < weight; i++) {
                        createFloatingEmoji(moodInfo.emoji);
                    }
                });
            }
            
            function createFloatingEmoji(emoji) {
                const floatingEmoji = document.createElement('div');
                floatingEmoji.classList.add('floating-emoji');
                floatingEmoji.textContent = emoji;
                
                // Random properties
                const left = Math.random() * 100;
                const size = Math.random() * 1 + 0.5;
                const duration = Math.random() * 30 + 30;
                const delay = Math.random() * -30;
                const opacity = Math.random() * 0.1 + 0.05;
                
                floatingEmoji.style.left = `${left}%`;
                floatingEmoji.style.fontSize = `${size}rem`;
                floatingEmoji.style.animationDuration = `${duration}s`;
                floatingEmoji.style.animationDelay = `${delay}s`;
                floatingEmoji.style.opacity = opacity;
                floatingEmoji.style.top = `${Math.random() * 100 + 100}%`;
                
                emojiBackground.appendChild(floatingEmoji);
            }
        });