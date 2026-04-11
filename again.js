/**
 * PHC CONNECT - Complete JavaScript System
 * Primary Health Centre Queue Management
 * Version: 1.0.0
 */

// ========== APP STATE MANAGEMENT ==========
const PHCApp = {
    // Data storage
    appointments: [],
    doctors: [
        { id: 'doc1', name: 'Dr. Sharma', department: 'Medicine', prefix: 'MED', color: '#1e3c72' },
        { id: 'doc2', name: 'Dr. Patil', department: 'Pediatrics', prefix: 'PED', color: '#2a5298' },
        { id: 'doc3', name: 'Dr. Rao', department: 'General', prefix: 'GEN', color: '#ffd966' }
    ],
    
    // Token counters per doctor prefix
    tokenCounters: {
        MED: 8,
        PED: 5,
        GEN: 7
    },
    
    // Admin authentication state
    isAdminLoggedIn: false,
    
    // Current date for appointments
    currentDate: new Date().toISOString().split('T')[0],
    
    // Time slots available
    timeSlots: [
        '9:00 AM - 9:15 AM',
        '9:15 AM - 9:30 AM',
        '9:30 AM - 9:45 AM',
        '9:45 AM - 10:00 AM',
        '10:00 AM - 10:15 AM',
        '10:15 AM - 10:30 AM',
        '10:30 AM - 10:45 AM',
        '10:45 AM - 11:00 AM'
    ]
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('PHC Connect Initializing...');
    
    // Load data from localStorage
    loadFromStorage();
    
    // If no data exists, initialize with demo data
    if (PHCApp.appointments.length === 0) {
        initializeDemoData();
    }
    
    // Set up all event listeners
    setupEventListeners();
    
    // Initialize UI
    initializeUI();
    
    // Start auto-refresh for TV display
    startTVRefresh();
    
    console.log('PHC Connect Ready!');
});

// ========== DATA PERSISTENCE ==========
function saveToStorage() {
    try {
        const dataToSave = {
            appointments: PHCApp.appointments,
            tokenCounters: PHCApp.tokenCounters
        };
        localStorage.setItem('phcConnectData', JSON.stringify(dataToSave));
        console.log('Data saved to storage');
    } catch (error) {
        console.error('Error saving to storage:', error);
        showNotification('⚠️ Error saving data', 'error');
    }
}

function loadFromStorage() {
    try {
        const savedData = localStorage.getItem('phcConnectData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            PHCApp.appointments = parsed.appointments || [];
            PHCApp.tokenCounters = parsed.tokenCounters || {
                MED: 8, PED: 5, GEN: 7
            };
            console.log('Data loaded from storage');
        }
    } catch (error) {
        console.error('Error loading from storage:', error);
    }
}

// ========== DEMO DATA INITIALIZATION ==========
function initializeDemoData() {
    PHCApp.appointments = [
        { 
            id: 'MED001', 
            patientName: 'Sarah Johnson', 
            patientPhone: '9876543210',
            doctor: 'Dr. Sharma', 
            department: 'Medicine', 
            timeSlot: '9:00 AM - 9:15 AM',
            date: PHCApp.currentDate,
            status: 'with-doctor',
            tokenPrefix: 'MED',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'MED002', 
            patientName: 'Mike Chen', 
            patientPhone: '8765432109',
            doctor: 'Dr. Sharma', 
            department: 'Medicine', 
            timeSlot: '9:15 AM - 9:30 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'MED',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'MED003', 
            patientName: 'Priya Patel', 
            patientPhone: '7654321098',
            doctor: 'Dr. Sharma', 
            department: 'Medicine', 
            timeSlot: '9:30 AM - 9:45 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'MED',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'PED004', 
            patientName: 'Raj Kumar', 
            patientPhone: '6543210987',
            doctor: 'Dr. Patil', 
            department: 'Pediatrics', 
            timeSlot: '9:00 AM - 9:15 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'PED',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'PED005', 
            patientName: 'Lakshmi Devi', 
            patientPhone: '5432109876',
            doctor: 'Dr. Patil', 
            department: 'Pediatrics', 
            timeSlot: '9:15 AM - 9:30 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'PED',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'GEN006', 
            patientName: 'Arun Singh', 
            patientPhone: '4321098765',
            doctor: 'Dr. Rao', 
            department: 'General', 
            timeSlot: '9:00 AM - 9:15 AM',
            date: PHCApp.currentDate,
            status: 'completed',
            tokenPrefix: 'GEN',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'GEN007', 
            patientName: 'Meera Nair', 
            patientPhone: '3210987654',
            doctor: 'Dr. Rao', 
            department: 'General', 
            timeSlot: '9:15 AM - 9:30 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'GEN',
            createdAt: new Date().toISOString()
        },
        { 
            id: 'MED008', 
            patientName: 'Karthik G', 
            patientPhone: '2109876543',
            doctor: 'Dr. Sharma', 
            department: 'Medicine', 
            timeSlot: '9:45 AM - 10:00 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'MED',
            createdAt: new Date().toISOString()
        }
    ];
    
    // Update token counters based on demo data
    PHCApp.tokenCounters = {
        MED: 8,
        PED: 5,
        GEN: 7
    };
    
    saveToStorage();
    console.log('Demo data initialized');
}

// ========== EVENT LISTENERS SETUP ==========
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const viewName = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (viewName) {
                showView(viewName);
            }
        });
    });
    
    // Patient booking form
    const bookBtn = document.querySelector('.btn[onclick="bookAppointment()"]');
    if (bookBtn) {
        bookBtn.addEventListener('click', bookAppointment);
    }
    
    // Token tracking
    const trackBtn = document.querySelector('.btn[onclick="trackToken()"]');
    if (trackBtn) {
        trackBtn.addEventListener('click', trackToken);
    }
    
    // Admin login
    const loginBtn = document.querySelector('.btn[onclick="adminLogin()"]');
    if (loginBtn) {
        loginBtn.addEventListener('click', adminLogin);
    }
    
    // Enter key for admin password
    const passwordField = document.getElementById('adminPassword');
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }
    
    // Date input set to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = PHCApp.currentDate;
        dateInput.min = PHCApp.currentDate;
    }
    
    // Populate time slots
    populateTimeSlots();
}

// ========== UI INITIALIZATION ==========
function initializeUI() {
    // Set current date in admin panel
    const currentDateSpan = document.getElementById('currentDate');
    if (currentDateSpan) {
        currentDateSpan.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Update all views
    updateAllViews();
}

// ========== VIEW NAVIGATION ==========
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected view
    const selectedView = document.getElementById(viewName + 'View');
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Activate corresponding nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewIndex = { 'patient': 0, 'admin': 1, 'tv': 2 }[viewName] || 0;
    if (navButtons[viewIndex]) {
        navButtons[viewIndex].classList.add('active');
    }
    
    // Update view-specific content
    if (viewName === 'tv') {
        updateTVDisplay();
    } else if (viewName === 'admin') {
        checkAdminAuth();
    }
}

// ========== PATIENT FUNCTIONS ==========
function bookAppointment() {
    // Get form values
    const patientName = document.getElementById('patientName')?.value.trim();
    const patientPhone = document.getElementById('patientPhone')?.value.trim();
    const doctorSelect = document.getElementById('doctorSelect')?.value;
    const appointmentDate = document.getElementById('appointmentDate')?.value;
    const timeSlot = document.getElementById('timeSlot')?.value;
    
    // Validate required fields
    if (!patientName) {
        showNotification('❌ Please enter patient name', 'error');
        return;
    }
    
    if (!doctorSelect) {
        showNotification('❌ Please select a doctor', 'error');
        return;
    }
    
    if (!timeSlot) {
        showNotification('❌ Please select a time slot', 'error');
        return;
    }
    
    // Parse doctor selection
    const [doctorName, department] = doctorSelect.split(' - ');
    
    // Determine token prefix
    let prefix = 'MED';
    if (doctorName.includes('Patil')) prefix = 'PED';
    if (doctorName.includes('Rao')) prefix = 'GEN';
    
    // Generate token number
    PHCApp.tokenCounters[prefix]++;
    const tokenNumber = prefix + String(PHCApp.tokenCounters[prefix]).padStart(3, '0');
    
    // Create new appointment
    const newAppointment = {
        id: tokenNumber,
        patientName: patientName,
        patientPhone: patientPhone || 'Not provided',
        doctor: doctorName,
        department: department,
        timeSlot: timeSlot,
        date: appointmentDate,
        status: 'waiting',
        tokenPrefix: prefix,
        createdAt: new Date().toISOString()
    };
    
    // Add to appointments
    PHCApp.appointments.push(newAppointment);
    
    // Save to storage
    saveToStorage();
    
    // Update UI
    updateAllViews();
    
    // Show confirmation
    displayConfirmation(newAppointment);
    
    // Show success notification
    showNotification(`✅ Token ${tokenNumber} generated successfully!`, 'success');
    
    // Clear form
    document.getElementById('patientName').value = '';
    document.getElementById('patientPhone').value = '';
}

function displayConfirmation(appointment) {
    const tokenDisplay = document.getElementById('tokenDisplay');
    const appointmentDetails = document.getElementById('appointmentDetails');
    
    if (tokenDisplay) {
        tokenDisplay.textContent = appointment.id;
    }
    
    if (appointmentDetails) {
        appointmentDetails.innerHTML = `
            <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin-top: 15px;">
                <p style="font-size: 1.2em; margin: 10px 0;"><strong>👨‍⚕️ Doctor:</strong> ${appointment.doctor} (${appointment.department})</p>
                <p style="font-size: 1.2em; margin: 10px 0;"><strong>⏰ Time:</strong> ${appointment.timeSlot}</p>
                <p style="font-size: 1.2em; margin: 10px 0;"><strong>📅 Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-IN')}</p>
                <p style="font-size: 1.2em; margin: 10px 0;"><strong>🏥 PHC:</strong> Primary Health Centre, Bengaluru Rural</p>
                <p style="font-size: 1.2em; margin: 10px 0;"><strong>📞 Contact:</strong> 080-1234-5678</p>
                <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    ⏰ Please arrive 15 minutes before your slot
                </div>
                <button onclick="printToken('${appointment.id}')" style="margin-top: 15px; padding: 10px; background: #1e3c72; color: white; border: none; border-radius: 5px; width: 100%;">
                    🖨️ Print Token
                </button>
            </div>
        `;
    }
}

function printToken(tokenId) {
    const appointment = PHCApp.appointments.find(a => a.id === tokenId);
    if (!appointment) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Token #${appointment.id}</title>
            <style>
                body { font-family: Arial; padding: 40px; text-align: center; }
                .token { font-size: 48px; color: #1e3c72; margin: 30px; }
                .details { font-size: 18px; margin: 10px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <h1>🏥 PHC Connect</h1>
            <div class="token">${appointment.id}</div>
            <div class="details">${appointment.doctor} - ${appointment.department}</div>
            <div class="details">${appointment.timeSlot}</div>
            <div class="details">${new Date(appointment.date).toLocaleDateString()}</div>
            <div class="details">Patient: ${appointment.patientName}</div>
            <hr>
            <p>Please arrive 15 minutes before your slot</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function trackToken() {
    const tokenId = document.getElementById('trackTokenId')?.value.toUpperCase().trim();
    const resultDiv = document.getElementById('trackingResult');
    
    if (!tokenId) {
        resultDiv.innerHTML = '<p style="color: #dc3545;">❌ Please enter a token number</p>';
        return;
    }
    
    const appointment = PHCApp.appointments.find(a => a.id === tokenId);
    
    if (!appointment) {
        resultDiv.innerHTML = '<p style="color: #dc3545;">❌ Token not found</p>';
        return;
    }
    
    // Calculate queue position
    const sameDoctorWaiting = PHCApp.appointments.filter(a => 
        a.doctor === appointment.doctor && 
        a.status === 'waiting' &&
        new Date(a.createdAt) < new Date(appointment.createdAt)
    ).length;
    
    const queuePosition = appointment.status === 'waiting' ? sameDoctorWaiting + 1 : 0;
    const waitTime = queuePosition * 15; // 15 minutes per patient
    
    let statusEmoji = {
        'waiting': '⏳',
        'with-doctor': '👨‍⚕️',
        'completed': '✅'
    }[appointment.status] || '❓';
    
    resultDiv.innerHTML = `
        <div class="tracking-result" style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin-top: 15px;">
            <p style="font-size: 1.5em; font-weight: bold; color: #1e3c72;">${statusEmoji} ${appointment.id}</p>
            <p><strong>Patient:</strong> ${appointment.patientName}</p>
            <p><strong>Doctor:</strong> ${appointment.doctor}</p>
            <p><strong>Status:</strong> 
                <span style="color: ${appointment.status === 'waiting' ? '#ffc107' : appointment.status === 'with-doctor' ? '#28a745' : '#666'};">
                    ${appointment.status.toUpperCase()}
                </span>
            </p>
            ${appointment.status === 'waiting' ? `
                <p><strong>Position in queue:</strong> ${queuePosition}</p>
                <p><strong>Estimated wait:</strong> ${waitTime} minutes</p>
                <div class="progress-bar" style="background: #ddd; height: 10px; border-radius: 5px; margin: 15px 0;">
                    <div style="background: #1e3c72; height: 10px; border-radius: 5px; width: ${Math.max(0, 100 - (queuePosition-1)*20)}%"></div>
                </div>
            ` : appointment.status === 'with-doctor' ? `
                <p><strong>Currently with doctor</strong></p>
            ` : `
                <p><strong>Appointment completed</strong></p>
            `}
            <p><small>Token generated: ${new Date(appointment.createdAt).toLocaleString()}</small></p>
        </div>
    `;
}

// ========== ADMIN FUNCTIONS ==========
function adminLogin() {
    const password = document.getElementById('adminPassword')?.value;
    
    // Hardcoded password for demo
    if (password === 'phc123') {
        PHCApp.isAdminLoggedIn = true;
        
        // Hide login, show dashboard
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        
        // Update admin queue
        updateAdminQueue();
        
        showNotification('✅ Admin login successful', 'success');
    } else {
        showNotification('❌ Incorrect password', 'error');
    }
}

function logoutAdmin() {
    PHCApp.isAdminLoggedIn = false;
    
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('adminPassword').value = '';
    
    showNotification('👋 Logged out successfully', 'info');
}

function updateAppointmentStatus(tokenId, newStatus) {
    const appointment = PHCApp.appointments.find(a => a.id === tokenId);
    
    if (appointment) {
        const oldStatus = appointment.status;
        appointment.status = newStatus;
        
        saveToStorage();
        
        // DIRECT DOM UPDATE - Replace updateAllViews() with this:
        // Update TV display (always works)
        updateTVDisplay();
        
        // Directly update admin queue without checking login
        const doctors = {
            'Dr. Sharma': 'sharmaQueue',
            'Dr. Patil': 'patilQueue',
            'Dr. Rao': 'raoQueue'
        };
        
        // Update each doctor's queue directly
        for (let [doctor, elementId] of Object.entries(doctors)) {
            const doctorAppointments = PHCApp.appointments.filter(a => 
                a.doctor === doctor && 
                a.date === PHCApp.currentDate
            );
            
            const withDoctor = doctorAppointments.find(a => a.status === 'with-doctor');
            const waiting = doctorAppointments.filter(a => a.status === 'waiting')
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
            let html = '';
            
            // Current patient
            if (withDoctor) {
                html += `
                    <div class="token-card with-doctor" style="border-left-color: #28a745; background: #f0fff0;">
                        <div>
                            <strong>🔴 ${withDoctor.id}</strong> - ${withDoctor.patientName}
                            <div style="font-size: 0.9em; color: #666;">${withDoctor.timeSlot}</div>
                        </div>
                        <div class="token-actions">
                            <button class="btn-complete" onclick="updateAppointmentStatus('${withDoctor.id}', 'completed')" 
                                    style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                                ✓ Complete
                            </button>
                        </div>
                    </div>
                `;
            }
            
            // Waiting patients
            waiting.forEach((apt, index) => {
                html += `
                    <div class="token-card waiting" style="border-left-color: #ffc107; background: #fff9e6;">
                        <div>
                            <strong>${apt.id}</strong> - ${apt.patientName}
                            <div style="font-size: 0.9em; color: #666;">${apt.timeSlot}</div>
                            <div style="font-size: 0.8em; color: #999;">Position: ${index + 1}</div>
                        </div>
                        <div class="token-actions">
                            <button class="btn-call" onclick="updateAppointmentStatus('${apt.id}', 'with-doctor')" 
                                    style="background: #1e3c72; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                                📞 Call
                            </button>
                            <button class="btn-cancel" onclick="updateAppointmentStatus('${apt.id}', 'completed')" 
                                    style="background: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                                ✗ Skip
                            </button>
                        </div>
                    </div>
                `;
            });
            
            if (!withDoctor && waiting.length === 0) {
                html = '<p style="color: #666; padding: 20px; text-align: center;">No patients in queue</p>';
            }
            
            const queueElement = document.getElementById(elementId);
            if (queueElement) {
                queueElement.innerHTML = html;
            }
        }
        
        // Update stats
        document.getElementById('totalToday').textContent = PHCApp.appointments.length;
        document.getElementById('totalWaiting').textContent = PHCApp.appointments.filter(a => a.status === 'waiting').length;
        document.getElementById('totalWithDoctor').textContent = PHCApp.appointments.filter(a => a.status === 'with-doctor').length;
        document.getElementById('totalCompleted').textContent = PHCApp.appointments.filter(a => a.status === 'completed').length;
        
        showNotification(`✅ Token ${tokenId} marked as ${newStatus}`, 'success');
        
        if (newStatus === 'with-doctor' && oldStatus === 'waiting') {
            announceToken(tokenId);
        }
    }
}

function announceToken(tokenId) {
    const appointment = PHCApp.appointments.find(a => a.id === tokenId);
    if (!appointment) return;
    
    // Use browser's speech synthesis if available
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
            `Token number ${tokenId}, please proceed to ${appointment.doctor}`
        );
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

function callNextPatient(doctorName) {
    const waitingPatients = PHCApp.appointments.filter(a => 
        a.doctor === doctorName && 
        a.status === 'waiting'
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    if (waitingPatients.length > 0) {
        updateAppointmentStatus(waitingPatients[0].id, 'with-doctor');
    } else {
        showNotification(`No waiting patients for ${doctorName}`, 'info');
    }
}

// ========== ADMIN QUEUE DISPLAY ==========
function updateAdminQueue() {
    if (!PHCApp.isAdminLoggedIn) return;
    
    const doctors = {
        'Dr. Sharma': 'sharmaQueue',
        'Dr. Patil': 'patilQueue',
        'Dr. Rao': 'raoQueue'
    };
    
    // Update statistics
    const totalToday = PHCApp.appointments.length;
    const totalWaiting = PHCApp.appointments.filter(a => a.status === 'waiting').length;
    const totalWithDoctor = PHCApp.appointments.filter(a => a.status === 'with-doctor').length;
    const totalCompleted = PHCApp.appointments.filter(a => a.status === 'completed').length;
    
    document.getElementById('totalToday').textContent = totalToday;
    document.getElementById('totalWaiting').textContent = totalWaiting;
    document.getElementById('totalWithDoctor').textContent = totalWithDoctor;
    document.getElementById('totalCompleted').textContent = totalCompleted;
    
    // Update each doctor's queue
    for (let [doctor, elementId] of Object.entries(doctors)) {
        const doctorAppointments = PHCApp.appointments.filter(a => 
            a.doctor === doctor && 
            a.date === PHCApp.currentDate
        );
        
        const withDoctor = doctorAppointments.find(a => a.status === 'with-doctor');
        const waiting = doctorAppointments.filter(a => a.status === 'waiting')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const completed = doctorAppointments.filter(a => a.status === 'completed');
        
        let html = '';
        
        // Current patient
        if (withDoctor) {
            html += `
                <div class="token-card with-doctor" style="border-left-color: #28a745; background: #f0fff0;">
                    <div>
                        <strong>🔴 ${withDoctor.id}</strong> - ${withDoctor.patientName}
                        <div style="font-size: 0.9em; color: #666;">${withDoctor.timeSlot}</div>
                    </div>
                    <div class="token-actions">
                        <button class="btn-complete" onclick="updateAppointmentStatus('${withDoctor.id}', 'completed')" 
                                style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                            ✓ Complete
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Waiting patients
        waiting.forEach((apt, index) => {
            html += `
                <div class="token-card waiting" style="border-left-color: #ffc107; background: #fff9e6;">
                    <div>
                        <strong>${apt.id}</strong> - ${apt.patientName}
                        <div style="font-size: 0.9em; color: #666;">${apt.timeSlot}</div>
                        <div style="font-size: 0.8em; color: #999;">Position: ${index + 1}</div>
                    </div>
                    <div class="token-actions">
                        <button class="btn-call" onclick="updateAppointmentStatus('${apt.id}', 'with-doctor')" 
                                style="background: #1e3c72; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                            📞 Call
                        </button>
                        <button class="btn-cancel" onclick="updateAppointmentStatus('${apt.id}', 'completed')" 
                                style="background: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                            ✗ Skip
                        </button>
                    </div>
                </div>
            `;
        });
        
        // Show message if no patients
        if (!withDoctor && waiting.length === 0) {
            html = '<p style="color: #666; padding: 20px; text-align: center;">No patients in queue</p>';
        }
        
        const queueElement = document.getElementById(elementId);
        if (queueElement) {
            queueElement.innerHTML = html;
        }
    }
}

// ========== TV DISPLAY FUNCTIONS ==========
function updateTVDisplay() {
    const todayAppointments = PHCApp.appointments.filter(a => a.date === PHCApp.currentDate);
    
    // Current serving (with doctor)
    const withDoctor = todayAppointments.find(a => a.status === 'with-doctor');
    
    // Waiting queue
    const waiting = todayAppointments.filter(a => a.status === 'waiting')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Update now serving
    const currentTokenDisplay = document.getElementById('currentTokenDisplay');
    const currentDoctorDisplay = document.getElementById('currentDoctorDisplay');
    
    if (withDoctor) {
        currentTokenDisplay.textContent = withDoctor.id;
        currentDoctorDisplay.textContent = `${withDoctor.doctor} - ${withDoctor.department}`;
    } else {
        currentTokenDisplay.textContent = '---';
        currentDoctorDisplay.textContent = 'No patient currently';
    }
    
    // Update next 3
    const nextTokens = ['next1Token', 'next2Token', 'next3Token'];
    const nextDoctors = ['next1Doctor', 'next2Doctor', 'next3Doctor'];
    
    for (let i = 0; i < 3; i++) {
        if (waiting[i]) {
            document.getElementById(nextTokens[i]).textContent = waiting[i].id;
            document.getElementById(nextDoctors[i]).textContent = waiting[i].doctor;
        } else {
            document.getElementById(nextTokens[i]).textContent = '---';
            document.getElementById(nextDoctors[i]).textContent = '';
        }
    }
    
    // Update stats
    document.getElementById('tvQueueCount').textContent = waiting.length;
    document.getElementById('tvTimestamp').textContent = new Date().toLocaleTimeString();
    
    // Calculate average wait time
    const avgWait = waiting.length > 0 ? Math.round(waiting.length * 15 / 2) : 0;
    document.getElementById('tvAvgWait').textContent = avgWait + ' min';
}

function startTVRefresh() {
    // Update TV display every 5 seconds
    setInterval(() => {
        if (document.getElementById('tvView').classList.contains('active')) {
            updateTVDisplay();
        }
    }, 5000);
}

// ========== HELPER FUNCTIONS ==========
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Style based on type
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#17a2b8',
        'warning': '#ffc107'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || '#28a745'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
        font-weight: 600;
        font-size: 1.1em;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function populateTimeSlots() {
    const timeSlotSelect = document.getElementById('timeSlot');
    if (timeSlotSelect) {
        timeSlotSelect.innerHTML = PHCApp.timeSlots.map(slot => 
            `<option value="${slot}">${slot}</option>`
        ).join('');
    }
}

function updateAllViews() {
    updateAdminQueue();
    updateTVDisplay();
}

function checkAdminAuth() {
    if (PHCApp.isAdminLoggedIn) {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        updateAdminQueue();
    } else {
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
    }
}

// ========== SEARCH AND FILTER FUNCTIONS ==========
function searchAppointments(searchTerm) {
    if (!searchTerm) return PHCApp.appointments;
    
    searchTerm = searchTerm.toLowerCase();
    return PHCApp.appointments.filter(apt => 
        apt.id.toLowerCase().includes(searchTerm) ||
        apt.patientName.toLowerCase().includes(searchTerm) ||
        apt.doctor.toLowerCase().includes(searchTerm)
    );
}

function getAppointmentsByDate(date) {
    return PHCApp.appointments.filter(a => a.date === date);
}

function getAppointmentsByDoctor(doctorName) {
    return PHCApp.appointments.filter(a => a.doctor === doctorName);
}

function getAppointmentsByStatus(status) {
    return PHCApp.appointments.filter(a => a.status === status);
}

// ========== STATISTICS FUNCTIONS ==========
function getTodayStats() {
    const today = PHCApp.appointments.filter(a => a.date === PHCApp.currentDate);
    
    return {
        total: today.length,
        waiting: today.filter(a => a.status === 'waiting').length,
        withDoctor: today.filter(a => a.status === 'with-doctor').length,
        completed: today.filter(a => a.status === 'completed').length,
        averageWaitTime: calculateAverageWaitTime(today)
    };
}

function calculateAverageWaitTime(appointments) {
    // This is a simplified calculation
    // In reality, you'd track actual wait times
    const waiting = appointments.filter(a => a.status === 'waiting').length;
    return waiting * 15; // 15 minutes per patient
}

function getDoctorWorkload() {
    const today = PHCApp.appointments.filter(a => a.date === PHCApp.currentDate);
    const doctors = {};
    
    today.forEach(apt => {
        if (!doctors[apt.doctor]) {
            doctors[apt.doctor] = {
                total: 0,
                waiting: 0,
                completed: 0
            };
        }
        doctors[apt.doctor].total++;
        if (apt.status === 'waiting') doctors[apt.doctor].waiting++;
        if (apt.status === 'completed') doctors[apt.doctor].completed++;
    });
    
    return doctors;
}

// ========== EXPORT FUNCTIONS ==========
function exportToCSV() {
    const headers = ['Token ID', 'Patient Name', 'Doctor', 'Department', 'Time Slot', 'Date', 'Status', 'Created At'];
    const csvData = PHCApp.appointments.map(apt => [
        apt.id,
        apt.patientName,
        apt.doctor,
        apt.department,
        apt.timeSlot,
        apt.date,
        apt.status,
        apt.createdAt
    ]);
    
    const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phc-connect-${PHCApp.currentDate}.csv`;
    a.click();
    
    showNotification('📊 Data exported to CSV', 'success');
}

// ========== RESET FUNCTIONS ==========
function resetDailyData() {
    if (confirm('⚠️ This will clear all appointments for today. Are you sure?')) {
        PHCApp.appointments = PHCApp.appointments.filter(a => a.date !== PHCApp.currentDate);
        PHCApp.tokenCounters = { MED: 0, PED: 0, GEN: 0 };
        saveToStorage();
        updateAllViews();
        showNotification('🔄 Daily data reset', 'info');
    }
}

function resetAllData() {
    if (confirm('⚠️ This will delete ALL data. Are you absolutely sure?')) {
        localStorage.removeItem('phcConnectData');
        PHCApp.appointments = [];
        PHCApp.tokenCounters = { MED: 0, PED: 0, GEN: 0 };
        initializeDemoData();
        showNotification('🔄 All data reset to demo', 'info');
    }
}

// ========== EXPOSE GLOBALLY ==========
// Make functions available to HTML onclick handlers
window.showView = showView;
window.bookAppointment = bookAppointment;
window.trackToken = trackToken;
window.adminLogin = adminLogin;
window.logoutAdmin = logoutAdmin;
window.updateAppointmentStatus = updateAppointmentStatus;
window.callNextPatient = callNextPatient;
window.printToken = printToken;
window.exportToCSV = exportToCSV;
window.resetDailyData = resetDailyData;
window.resetAllData = resetAllData;