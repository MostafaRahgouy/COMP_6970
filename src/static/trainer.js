document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const auId = urlParams.get('auid');

    if (!auId) {
        console.error('No user ID found in URL');
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem(auId)) || {};
    if (userData.role !== 'trainer') {
        alert('Only trainers can access this page');
        window.location.href = '/';
        return;
    }

    document.querySelectorAll('.tab_icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const selectedTab = icon.getAttribute('data-tab');

            document.querySelectorAll('.tab_content').forEach(tab => {
                tab.style.display = 'none';
            });

            document.getElementById(selectedTab).style.display = 'block';

            document.querySelectorAll('.tab_icon').forEach(i => i.classList.remove('active'));
            icon.classList.add('active');

            // Load appropriate data when tab changes
            if (selectedTab === 'body') {
                loadTraineeBodyData();
            } else if (selectedTab === 'strength') {
                loadTraineeStrengthData();
            }
        });
    });

    function getMyTrainees() {
        const allTrainees = [];
        const allKeys = Object.keys(sessionStorage);

        allKeys.forEach(key => {
            if (key === auId || key === 'debug' || key.startsWith('profile_image_')) return;

            const user = JSON.parse(sessionStorage.getItem(key));
            if (user && user.role === 'trainee' && user.selectedTrainer === auId) {
                allTrainees.push({
                    id: key,
                    name: user.name || `Trainee ${key}`,
                    data: user
                });
            }
        });

        return allTrainees;
    }


    function loadTraineeBodyData() {
        const trainees = getMyTrainees();


        if (trainees.length > 0) {
            renderBodyGraph(trainees[0].id);
        } else {
            displayNoDataMessage('progress-graph', 'No trainees have selected you as their trainer yet');
        }


        document.getElementById('metric-select')?.addEventListener('change', function () {
            renderBodyGraph(trainees[0].id);
        });
    }

    function renderBodyGraph(traineeId) {
        const traineeData = JSON.parse(sessionStorage.getItem(traineeId));
        const measurements = traineeData.measurements || [];
        const metric = document.getElementById('metric-select').value;
        const ctx = document.getElementById('progress-graph').getContext('2d');

        if (window.bodyChart) {
            window.bodyChart.destroy();
        }

        if (measurements.length === 0) {
            displayNoDataMessage('progress-graph', 'No body measurements recorded yet');
            return;
        }

        measurements.sort((a, b) => new Date(a.date) - new Date(b.date));

        window.bodyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
                datasets: [{
                    label: metric === 'weight' ? 'Weight (kg)' : 'Body Fat (%)',
                    data: measurements.map(m => m[metric]),
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
                    title: {
                        display: true,
                        text: `${traineeData.name}'s Progress`,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }


    function renderStrengthGraph(traineeId) {
        const traineeData = JSON.parse(sessionStorage.getItem(traineeId));
        const workouts = traineeData.workouts || [];
        const exercise = document.getElementById('exercise-select').value;
        const ctx = document.getElementById('fitness-graph').getContext('2d');

        if (window.strengthChart) {
            window.strengthChart.destroy();
        }

        const validWorkouts = workouts.filter(w => w[exercise] !== undefined);

        if (validWorkouts.length === 0) {
            displayNoDataMessage('fitness-graph', `No ${getExerciseLabel(exercise)} data recorded yet`);
            return;
        }

        validWorkouts.sort((a, b) => new Date(a.date) - new Date(b.date));

        window.strengthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: validWorkouts.map(w => new Date(w.date).toLocaleDateString()),
                datasets: [{
                    label: getExerciseLabel(exercise),
                    data: validWorkouts.map(w => w[exercise]),
                    borderColor: '#006c9a',
                    backgroundColor: 'rgba(0, 108, 154, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${traineeData.name}'s Progress`,
                        font: {
                            size: 16
                        }
                    },
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


    function loadTraineeStrengthData() {
        const trainees = getMyTrainees();
        const container = document.getElementById('strength');

        // Clear previous content
        container.querySelector('.strength-container').innerHTML = `
            <div class="trainee-selector">
                <h3>Select Trainee</h3>
                <select id="trainee-select-strength">
                    ${trainees.length > 0
            ? trainees.map(t => `<option value="${t.id}">${t.name}</option>`).join('')
            : '<option disabled selected>No trainees assigned</option>'}
                </select>
            </div>
            <div class="exercise-controls">
                <select id="exercise-select">
                    <option value="pushups">Push-ups (count)</option>
                    <option value="pullups">Pull-ups (count)</option>
                    <option value="runtime">Run Time (min)</option>
                    <option value="sleep">Sleep (hours)</option>
                    <option value="plank">Plank (sec)</option>
                </select>
            </div>
            <div class="graph-container">
                <canvas id="fitness-graph"></canvas>
            </div>
        `;

        // Initial render if trainees exist
        if (trainees.length > 0) {
            renderStrengthGraph(trainees[0].id);
        } else {
            displayNoDataMessage('fitness-graph', 'No trainees have selected you as their trainer yet');
        }

        // Update when trainee or exercise changes
        document.getElementById('trainee-select-strength')?.addEventListener('change', function () {
            renderStrengthGraph(this.value);
        });

        document.getElementById('exercise-select')?.addEventListener('change', function () {
            renderStrengthGraph(document.getElementById('trainee-select-strength').value);
        });
    }


    function displayNoDataMessage(canvasId, message) {
        const canvas = document.getElementById(canvasId);
        canvas.parentNode.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-chart-line"></i>
                <p>${message}</p>
            </div>
        `;
    }

    function getExerciseLabel(value) {
        const labels = {
            pushups: 'Push-ups',
            pullups: 'Pull-ups',
            runtime: 'Run Time',
            sleep: 'Sleep',
            plank: 'Plank'
        };
        return labels[value];
    }

    document.querySelector('.tab_icon.active').click();
});


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
