const urlParams = new URLSearchParams(window.location.search);
const auId = urlParams.get('auid');


document.addEventListener('DOMContentLoaded', function () {

    if (!auId) {
        console.error('No user ID found in URL');
        return;
    }

    const profilePic = document.getElementById('profile-pic');
    const imageUpload = document.getElementById('image-upload');
    const profileForm = document.getElementById('profile-form');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameDisplay = document.querySelector('.info-fields p:first-child');

    const userData = JSON.parse(sessionStorage.getItem(auId));

    if (!userData) {
        console.error('User data not found in sessionStorage');
        return;
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = `Username: ${auId}`;
    }

    const userImageKey = `profile_image_${auId}`;
    const savedImage = sessionStorage.getItem(userImageKey);
    if (savedImage) {
        profilePic.src = savedImage;
    }

    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                profilePic.src = event.target.result;
                sessionStorage.setItem(userImageKey, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentPassword = profileForm.elements.current_password.value;
        const newPassword = profileForm.elements.new_password.value;

        // Verify current password
        if (userData.password !== currentPassword) {
            alert('Current password is incorrect!');
            return;
        }

        // Update password in user data
        userData.password = newPassword;
        sessionStorage.setItem(auId, JSON.stringify(userData));

        alert('Password updated successfully!');
        profileForm.reset();
    });

    logoutBtn.addEventListener('click', function () {
        window.location.href = '/sign_in';
    });
});


function initializeTrainers() {
    if (!sessionStorage.getItem('trainer_1')) {
        const trainers = [
            {
                id: 'trainer_1',
                username: 'john_doe',
                name: 'John Doe',
                role: 'trainer',
                password: 'trainer123',
                specialty: 'Strength Training',
                experience: '5 years',
                bio: 'Certified personal trainer specializing in strength and conditioning.',
                icon: '💪' // Muscle emoji
            },
            {
                id: 'trainer_2',
                username: 'jane_smith',
                name: 'Jane Smith',
                role: 'trainer',
                password: 'trainer123',
                specialty: 'Yoga & Flexibility',
                experience: '7 years',
                bio: 'Yoga instructor with expertise in mobility and functional movement.',
                icon: '🧘' // Yoga emoji
            },
            {
                id: 'trainer_3',
                username: 'mike_johnson',
                name: 'Mike Johnson',
                role: 'trainer',
                password: 'trainer123',
                specialty: 'Weight Loss',
                experience: '4 years',
                bio: 'Nutrition coach and weight management specialist.',
                icon: '⚖️' // Scale emoji
            },
            {
                id: 'trainer_4',
                username: 'sarah_williams',
                name: 'Sarah Williams',
                role: 'trainer',
                password: 'trainer123',
                specialty: 'CrossFit',
                experience: '6 years',
                bio: 'CrossFit Level 2 trainer with competition experience.',
                icon: '🏋️' // Weightlifter emoji
            }
        ];

        trainers.forEach(trainer => {
            sessionStorage.setItem(trainer.id, JSON.stringify(trainer));
        });
    }
}

function displayTrainers(userId) {
    const trainersGrid = document.getElementById('trainers-grid');
    if (!trainersGrid) return;

    trainersGrid.innerHTML = '';

    const allKeys = Object.keys(sessionStorage);
    const trainers = [];


    allKeys.forEach(key => {
        if (key.startsWith('profile_image_') || key === 'debug') return;

        try {
            const user = JSON.parse(sessionStorage.getItem(key));

            if (user && (key.startsWith('trainer_') || user.role === 'trainer')) {
                console.log(user)
                const trainerName = user.name;

                trainers.push({
                    ...user,
                    name: trainerName,
                    id: user.id || key
                });
            }
        } catch (e) {
            console.warn(`Could not parse user data for key: ${key}`);
        }
    });

    const userData = JSON.parse(sessionStorage.getItem(userId));
    const selectedTrainerId = userData?.selectedTrainer;

    trainers.forEach(trainer => {
        const trainerCard = document.createElement('div');
        trainerCard.className = 'trainer-card';
        if (selectedTrainerId === trainer.id) {
            trainerCard.classList.add('selected');
        }

        trainerCard.innerHTML = `
        <div class="trainer-icon">${trainer.icon || '👤'}</div>
        <h3>${trainer.name}</h3>
        <p><strong>Specialty:</strong> ${trainer.specialty || 'General Fitness'}</p>
        <p><strong>Experience:</strong> ${trainer.experience || 'Not specified'}</p>
        <p class="trainer-bio">${trainer.bio || ''}</p>
        <button class="select-trainer-btn">
            ${selectedTrainerId === trainer.id ? '✔ Selected' : 'Select Trainer'}
        </button>
    `;

        const selectBtn = trainerCard.querySelector('.select-trainer-btn');
        selectBtn.addEventListener('click', () => selectTrainer(userId, trainer.id));

        trainersGrid.appendChild(trainerCard);
    });


}

function selectTrainer(userId, trainerId) {
    // Update user data with selected trainer
    const userData = JSON.parse(sessionStorage.getItem(userId));
    userData.selectedTrainer = trainerId;
    sessionStorage.setItem(userId, JSON.stringify(userData));

    // Refresh the display
    displayTrainers(userId);

    // Show notification without alert
    const notification = document.createElement('div');
    notification.className = 'trainer-notification';
    notification.textContent = `You have selected ${JSON.parse(sessionStorage.getItem(trainerId)).name} as your trainer!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const auId = urlParams.get('auid');

    if (!auId) {
        console.error('No user ID found in URL');
        return;
    }

    // Initialize sample trainers
    initializeTrainers();

    // Rest of your existing DOMContentLoaded code...
    const profilePic = document.getElementById('profile-pic');
    const imageUpload = document.getElementById('image-upload');
    const profileForm = document.getElementById('profile-form');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameDisplay = document.querySelector('.info-fields p:first-child');

    const userData = JSON.parse(sessionStorage.getItem(auId));

    if (!userData) {
        console.error('User data not found in sessionStorage');
        return;
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = `Username: ${auId}`;
    }

    const userImageKey = `profile_image_${auId}`;
    const savedImage = sessionStorage.getItem(userImageKey);
    if (savedImage) {
        profilePic.src = savedImage;
    }

    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                profilePic.src = event.target.result;
                sessionStorage.setItem(userImageKey, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentPassword = profileForm.elements.current_password.value;
        const newPassword = profileForm.elements.new_password.value;

        if (userData.password !== currentPassword) {
            alert('Current password is incorrect!');
            return;
        }

        userData.password = newPassword;
        sessionStorage.setItem(auId, JSON.stringify(userData));

        alert('Password updated successfully!');
        profileForm.reset();
    });

    logoutBtn.addEventListener('click', function () {
        window.location.href = '/sign_in';
    });
});


document.querySelectorAll('.tab_icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const selectedTab = icon.getAttribute('data-tab');

        document.querySelectorAll('.tab_content').forEach(tab => {
            tab.style.display = 'none';
        });

        document.getElementById(selectedTab).style.display = 'block';

        document.querySelectorAll('.tab_icon').forEach(i => i.classList.remove('active'));
        icon.classList.add('active');

        // When trainer tab is clicked, display trainers
        if (selectedTab === 'trainer') {
            displayTrainers(auId);
        }


        if (selectedTab === 'body') {
            loadMeasurements(auId);
        }


    });
});


document.getElementById('measure-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const measurement = {
        date: document.getElementById('record-date').value,
        weight: parseFloat(document.getElementById('record-weight').value),
        height: parseInt(document.getElementById('record-height').value),
        fat: parseFloat(document.getElementById('record-fat').value)
    };

    saveMeasurement(measurement);
    loadMeasurements();

    // Reset form (keep current date)
    this.reset();
    document.getElementById('record-date').valueAsDate = new Date();
});

function saveMeasurement(measurement) {
    const userId = new URLSearchParams(window.location.search).get('auid');
    const userData = JSON.parse(sessionStorage.getItem(userId)) || {};

    if (!userData.measurements) {
        userData.measurements = [];
    }

    userData.measurements.push(measurement);
    sessionStorage.setItem(userId, JSON.stringify(userData));
}

function loadMeasurements() {
    const userId = new URLSearchParams(window.location.search).get('auid');
    const userData = JSON.parse(sessionStorage.getItem(userId)) || {};
    const measurements = userData.measurements || [];

    renderGraph(measurements);
}

function renderGraph(measurements) {
    const ctx = document.getElementById('progress-graph').getContext('2d');
    const metricSelect = document.getElementById('metric-select');

    // Destroy old chart if exists
    if (window.bodyChart) {
        window.bodyChart.destroy();
    }

    // Sort by date
    measurements.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Create chart
    window.bodyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
            datasets: [{
                label: metricSelect.value === 'weight' ? 'Weight (kg)' : 'Body Fat (%)',
                data: measurements.map(m => m[metricSelect.value]),
                borderColor: '#E87722',
                backgroundColor: 'rgba(232, 119, 34, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Update chart when metric changes
    metricSelect.addEventListener('change', () => renderGraph(measurements));
}

document.getElementById('record-date').valueAsDate = new Date();


document.querySelector('[data-tab="strength"]').addEventListener('click', function () {
    loadFitnessData();
    updateExerciseFields();
});

let selectedExercises = ['pushups'];

document.querySelectorAll('input[name="exercise"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        selectedExercises = Array.from(document.querySelectorAll('input[name="exercise"]:checked'))
            .map(el => el.value);
        updateExerciseFields();
        updateGraphSelector();
    });
});

function updateExerciseFields() {
    const container = document.getElementById('exercise-fields');
    container.innerHTML = '';

    selectedExercises.forEach(exercise => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = getExerciseLabel(exercise);

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `exercise-${exercise}`;
        input.required = true;
        input.min = '0';

        if (exercise === 'runtime' || exercise === 'sleep') {
            input.step = '0.1';
        }
        if (exercise === 'sleep') {
            input.max = '24';
        }

        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    });
}

function updateGraphSelector() {
    const select = document.getElementById('exercise-select');
    select.innerHTML = '';

    selectedExercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise;
        option.textContent = getExerciseLabel(exercise);
        select.appendChild(option);
    });

    // Refresh graph if data exists
    const userId = new URLSearchParams(window.location.search).get('auid');
    const userData = JSON.parse(sessionStorage.getItem(userId)) || {};
    if (userData.workouts) {
        renderFitnessGraph(userData.workouts);
    }
}

document.getElementById('strength-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const workout = {
        date: document.getElementById('workout-date').value
    };

    // Only add selected exercises
    selectedExercises.forEach(exercise => {
        workout[exercise] = parseFloat(document.getElementById(`exercise-${exercise}`).value);
    });

    saveWorkout(workout);
    loadFitnessData();

    // Reset form (keep current date and selections)
    this.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    document.getElementById('workout-date').valueAsDate = new Date();
});

function saveWorkout(workout) {
    const userId = new URLSearchParams(window.location.search).get('auid');
    const userData = JSON.parse(sessionStorage.getItem(userId)) || {};

    if (!userData.workouts) {
        userData.workouts = [];
    }

    userData.workouts.push(workout);
    sessionStorage.setItem(userId, JSON.stringify(userData));
}

function loadFitnessData() {
    const userId = new URLSearchParams(window.location.search).get('auid');
    const userData = JSON.parse(sessionStorage.getItem(userId)) || {};
    const workouts = userData.workouts || [];

    renderFitnessGraph(workouts);
}

function renderFitnessGraph(workouts) {
    const ctx = document.getElementById('fitness-graph').getContext('2d');
    const exerciseSelect = document.getElementById('exercise-select');
    const selectedExercise = exerciseSelect.value;

    // Destroy old chart if exists
    if (window.fitnessChart) {
        window.fitnessChart.destroy();
    }

    // Sort by date
    workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter workouts that have the selected exercise
    const validWorkouts = workouts.filter(w => w[selectedExercise] !== undefined);

    // Create chart
    window.fitnessChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: validWorkouts.map(w => new Date(w.date).toLocaleDateString()),
            datasets: [{
                label: getExerciseLabel(selectedExercise),
                data: validWorkouts.map(w => w[selectedExercise]),
                borderColor: '#E87722',
                backgroundColor: 'rgba(232, 119, 34, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getExerciseLabel(value) {
    const labels = {
        pushups: 'Push-ups (count)',
        pullups: 'Pull-ups (count)',
        runtime: 'Run Time (minutes)',
        sleep: 'Sleep (hours)',
        plank: 'Plank (seconds)'
    };
    return labels[value];
}

document.getElementById('workout-date').valueAsDate = new Date();
updateGraphSelector();