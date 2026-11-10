/**
 * PHC CONNECT - Demo JavaScript System
 * Primary Health Centre Queue Management Prototype
 * Public-facing demo version: no real authentication or patient records
 */

const PHCApp = {
    appointments: [],
    doctors: [
        { id: 'doc1', name: 'Dr. Sharma', department: 'Medicine', prefix: 'MED', color: '#1e3c72' },
        { id: 'doc2', name: 'Dr. Patil', department: 'Pediatrics', prefix: 'PED', color: '#2a5298' },
        { id: 'doc3', name: 'Dr. Rao', department: 'General', prefix: 'GEN', color: '#ffd966' }
    ],

    tokenCounters: {
        MED: 8,
        PED: 5,
        GEN: 7
    },

    isAdminLoggedIn: false,
    currentDate: new Date().toISOString().split('T')[0],
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('PHC Connect demo initializing...');
    loadFromStorage();

    if (PHCApp.appointments.length === 0) {
        initializeDemoData();
    }

    setupEventListeners();
    initializeUI();
    startTVRefresh();
    console.log('PHC Connect demo ready.');
});

function saveToStorage() {
    try {
        const dataToSave = {
            appointments: PHCApp.appointments,
            tokenCounters: PHCApp.tokenCounters
        };
        localStorage.setItem('phcConnectData', JSON.stringify(dataToSave));
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
                MED: 8,
                PED: 5,
                GEN: 7
            };
        }
    } catch (error) {
        console.error('Error loading from storage:', error);
    }
}

function initializeDemoData() {
    PHCApp.appointments = [
        {
            id: 'MED001',
            patientName: 'Demo Patient 01',
            patientPhone: '+91 90000 00001',
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
            patientName: 'Demo Patient 02',
            patientPhone: '+91 90000 00002',
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
            patientName: 'Demo Patient 03',
            patientPhone: '+91 90000 00003',
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
            patientName: 'Demo Patient 04',
            patientPhone: '+91 90000 00004',
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
            patientName: 'Demo Patient 05',
            patientPhone: '+91 90000 00005',
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
            patientName: 'Demo Patient 06',
            patientPhone: '+91 90000 00006',
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
            patientName: 'Demo Patient 07',
            patientPhone: '+91 90000 00007',
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
            patientName: 'Demo Patient 08',
            patientPhone: '+91 90000 00008',
            doctor: 'Dr. Sharma',
            department: 'Medicine',
            timeSlot: '9:45 AM - 10:00 AM',
            date: PHCApp.currentDate,
            status: 'waiting',
            tokenPrefix: 'MED',
            createdAt: new Date().toISOString()
        }
    ];

    PHCApp.tokenCounters = {
        MED: 8,
        PED: 5,
        GEN: 7
    };

    saveToStorage();
}

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const viewName = this.textContent.trim().includes('Patient') ? 'patient' :
                this.textContent.trim().includes('Admin') ? 'admin' : 'tv';
            showView(viewName);
        });
    });

    const bookBtn = document.querySelector('.btn[onclick="bookAppointment()"]');
    if (bookBtn) bookBtn.addEventListener('click', bookAppointment);

    const trackBtn = document.querySelector('.btn[onclick="trackToken()"]');
    if (trackBtn) trackBtn.addEventListener('click', trackToken);

    const loginBtn = document.querySelector('.btn[onclick="adminLogin()"]');
    if (loginBtn) loginBtn.addEventListener('click', adminLogin);

    const passwordField = document.getElementById('adminPassword');
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }

    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = PHCApp.currentDate;
        dateInput.min = PHCApp.currentDate;
    }

    populateTimeSlots();
}

function initializeUI() {
    const currentDateSpan = document.getElementById('currentDate');
    if (currentDateSpan) {
        currentDateSpan.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateAllViews();
}

function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const selectedView = document.getElementById(viewName + 'View');
    if (selectedView) {
        selectedView.classList.add('active');
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    const viewIndex = { patient: 0, admin: 1, tv: 2 }[viewName] || 0;
    if (navButtons[viewIndex]) {
        navButtons[viewIndex].classList.add('active');
    }

    if (viewName === 'tv') updateTVDisplay();
    else if (viewName === 'admin') checkAdminAuth();
}

function bookAppointment() {
    const patientName = document.getElementById('patientName')?.value.trim();
    const patientPhone = document.getElementById('patientPhone')?.value.trim();
    const doctorSelect = document.getElementById('doctorSelect')?.value;
    const appointmentDate = document.getElementById('appointmentDate')?.value;
    const timeSlot = document.getElementById('timeSlot')?.value;

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

    const [doctorName, department] = doctorSelect.split(' - ');

    let prefix = 'MED';
    if (doctorName.includes('Patil')) prefix = 'PED';
    if (doctorName.includes('Rao')) prefix = 'GEN';

    PHCApp.tokenCounters[prefix]++;
    const tokenNumber = prefix + String(PHCApp.tokenCounters[prefix]).padStart(3, '0');

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

    PHCApp.appointments.push(newAppointment);
    saveToStorage();
    updateAllViews();
    displayConfirmation(newAppointment);
    showNotification(`✅ Token ${tokenNumber} generated successfully!`, 'success');

    document.getElementById('patientName').value = '';
    document.getElementById('patientPhone').value = '';
}

function displayConfirmation(appointment) {
    const tokenDisplay = document.getElementById('tokenDisplay');
    const appointmentDetails = document.getElementById('appointmentDetails');

    if (tokenDisplay) tokenDisplay.textContent = appointment.id;

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

    const sameDoctorWaiting = PHCApp.appointments.filter(a =>
        a.doctor === appointment.doctor &&
        a.status === 'waiting' &&
        new Date(a.createdAt) < new Date(appointment.createdAt)
    ).length;

    const queuePosition = appointment.status === 'waiting' ? sameDoctorWaiting + 1 : 0;
    const waitTime = queuePosition * 15;

    const statusEmoji = {
        waiting: '⏳',
        'with-doctor': '👨‍⚕️',
        completed: '✅'
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
                    <div style="background: #1e3c72; height: 10px; border-radius: 5px; width: ${Math.max(0, 100 - (queuePosition - 1) * 20)}%"></div>
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

function adminLogin() {
    const password = document.getElementById('adminPassword')?.value;

    if (password && password.trim().length > 0) {
        PHCApp.isAdminLoggedIn = true;

        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');

        updateAdminQueue();
        showNotification('✅ Demo admin access enabled for this public prototype.', 'success');
    } else {
        showNotification('⚠️ Public demo mode: enter any non-empty value to simulate admin access.', 'info');
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
        updateTVDisplay();

        const doctors = {
            'Dr. Sharma': 'sharmaQueue',
            'Dr. Patil': 'patilQueue',
            'Dr. Rao': 'raoQueue'
        };

        for (let [doctor, elementId] of Object.entries(doctors)) {
            const doctorAppointments = PHCApp.appointments.filter(a => a.doctor === doctor && a.date === PHCApp.currentDate);
            const withDoctor = doctorAppointments.find(a => a.status === 'with-doctor');
            const waiting = doctorAppointments.filter(a => a.status === 'waiting').sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            let html = '';

            if (withDoctor) {
                html += `
                    <div class="token-card with-doctor" style="border-left-color: #28a745; background: #f0fff0;">
                        <div>
                            <strong>🔴 ${withDoctor.id}</strong> - ${withDoctor.patientName}
                            <div style="font-size: 0.9em; color: #666;">${withDoctor.timeSlot}</div>
                        </div>
                        <div class="token-actions">
                            <button class="btn-complete" onclick="updateAppointmentStatus('${withDoctor.id}', 'completed')" style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                                ✓ Complete
                            </button>
                        </div>
                    </div>
                `;
            }

            waiting.forEach((apt, index) => {
                html += `
                    <div class="token-card waiting" style="border-left-color: #ffc107; background: #fff9e6;">
                        <div>
                            <strong>${apt.id}</strong> - ${apt.patientName}
                            <div style="font-size: 0.9em; color: #666;">${apt.timeSlot}</div>
                            <div style="font-size: 0.8em; color: #999;">Position: ${index + 1}</div>
                        </div>
                        <div class="token-actions">
                            <button class="btn-call" onclick="updateAppointmentStatus('${apt.id}', 'with-doctor')" style="background: #1e3c72; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                                📞 Call
                            </button>
                            <button class="btn-cancel" onclick="updateAppointmentStatus('${apt.id}', 'completed')" style="background: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
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
            if (queueElement) queueElement.innerHTML = html;
        }

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

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Token number ${tokenId}, please proceed to ${appointment.doctor}`);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

function callNextPatient(doctorName) {
    const waitingPatients = PHCApp.appointments.filter(a => a.doctor === doctorName && a.status === 'waiting')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (waitingPatients.length > 0) {
        updateAppointmentStatus(waitingPatients[0].id, 'with-doctor');
    } else {
        showNotification(`No waiting patients for ${doctorName}`, 'info');
    }
}

function updateAdminQueue() {
    if (!PHCApp.isAdminLoggedIn) return;

    const doctors = {
        'Dr. Sharma': 'sharmaQueue',
        'Dr. Patil': 'patilQueue',
        'Dr. Rao': 'raoQueue'
    };

    const totalToday = PHCApp.appointments.length;
    const totalWaiting = PHCApp.appointments.filter(a => a.status === 'waiting').length;
    const totalWithDoctor = PHCApp.appointments.filter(a => a.status === 'with-doctor').length;
    const totalCompleted = PHCApp.appointments.filter(a => a.status === 'completed').length;

    document.getElementById('totalToday').textContent = totalToday;
    document.getElementById('totalWaiting').textContent = totalWaiting;
    document.getElementById('totalWithDoctor').textContent = totalWithDoctor;
    document.getElementById('totalCompleted').textContent = totalCompleted;

    for (let [doctor, elementId] of Object.entries(doctors)) {
        const doctorAppointments = PHCApp.appointments.filter(a => a.doctor === doctor && a.date === PHCApp.currentDate);
        const withDoctor = doctorAppointments.find(a => a.status === 'with-doctor');
        const waiting = doctorAppointments.filter(a => a.status === 'waiting').sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        let html = '';

        if (withDoctor) {
            html += `
                <div class="token-card with-doctor" style="border-left-color: #28a745; background: #f0fff0;">
                    <div>
                        <strong>🔴 ${withDoctor.id}</strong> - ${withDoctor.patientName}
                        <div style="font-size: 0.9em; color: #666;">${withDoctor.timeSlot}</div>
                    </div>
                    <div class="token-actions">
                        <button class="btn-complete" onclick="updateAppointmentStatus('${withDoctor.id}', 'completed')" style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                            ✓ Complete
                        </button>
                    </div>
                </div>
            `;
        }

        waiting.forEach((apt, index) => {
            html += `
                <div class="token-card waiting" style="border-left-color: #ffc107; background: #fff9e6;">
                    <div>
                        <strong>${apt.id}</strong> - ${apt.patientName}
                        <div style="font-size: 0.9em; color: #666;">${apt.timeSlot}</div>
                        <div style="font-size: 0.8em; color: #999;">Position: ${index + 1}</div>
                    </div>
                    <div class="token-actions">
                        <button class="btn-call" onclick="updateAppointmentStatus('${apt.id}', 'with-doctor')" style="background: #1e3c72; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                            📞 Call
                        </button>
                        <button class="btn-cancel" onclick="updateAppointmentStatus('${apt.id}', 'completed')" style="background: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
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
        if (queueElement) queueElement.innerHTML = html;
    }
}

function updateTVDisplay() {
    const todayAppointments = PHCApp.appointments.filter(a => a.date === PHCApp.currentDate);
    const withDoctor = todayAppointments.find(a => a.status === 'with-doctor');
    const waiting = todayAppointments.filter(a => a.status === 'waiting').sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const currentTokenDisplay = document.getElementById('currentTokenDisplay');
    const currentDoctorDisplay = document.getElementById('currentDoctorDisplay');

    if (withDoctor) {
        currentTokenDisplay.textContent = withDoctor.id;
        currentDoctorDisplay.textContent = `${withDoctor.doctor} - ${withDoctor.department}`;
    } else {
        currentTokenDisplay.textContent = '---';
        currentDoctorDisplay.textContent = 'No patient currently';
    }

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

    document.getElementById('tvQueueCount').textContent = waiting.length;
    document.getElementById('tvTimestamp').textContent = new Date().toLocaleTimeString();

    const avgWait = waiting.length > 0 ? Math.round(waiting.length * 15 / 2) : 0;
    document.getElementById('tvAvgWait').textContent = avgWait + ' min';
}

function startTVRefresh() {
    setInterval(() => {
        if (document.getElementById('tvView').classList.contains('active')) {
            updateTVDisplay();
        }
    }, 5000);
}

function showNotification(message, type = 'success') {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
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

    setTimeout(() => notification.remove(), 3000);
}

function populateTimeSlots() {
    const timeSlotSelect = document.getElementById('timeSlot');
    if (timeSlotSelect) {
        timeSlotSelect.innerHTML = PHCApp.timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
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
    const waiting = appointments.filter(a => a.status === 'waiting').length;
    return waiting * 15;
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

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
