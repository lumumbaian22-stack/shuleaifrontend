// js/auth.js (partial)
import * as api from './api.js';

window.handleLogin = async function(e, role) {
    e.preventDefault();

    let credentials = {};
    if (role === 'admin') {
        credentials = {
            schoolCode: document.getElementById('admin-school').value,
            adminId: document.getElementById('admin-id').value,
            password: document.getElementById('admin-pass').value
        };
    } else if (role === 'teacher') {
        credentials = {
            schoolCode: document.getElementById('teacher-school').value,
            teacherId: document.getElementById('teacher-id').value,
            password: document.getElementById('teacher-pass').value,
            subject: document.getElementById('teacher-subject').value
        };
    } else if (role === 'parent') {
        credentials = {
            parentId: document.getElementById('parent-id').value,
            password: document.getElementById('parent-pass').value
        };
    } else if (role === 'student') {
        credentials = {
            schoolCode: document.getElementById('student-school').value,
            elimuid: document.getElementById('student-id').value,
            password: document.getElementById('student-pass').value
        };
    } else if (role === 'super') {
        credentials = {
            secretKey: document.getElementById('super-key').value
        };
    }

    try {
        const user = await api.login(role, credentials);
        // Store user globally (you may also want to store in session)
        window.currentUser = user;
        // For admin/teacher/parent, you may need to fetch additional data (school, children)
        if (role === 'admin' || role === 'teacher') {
            // Assuming school info is included in user object or fetch it
            window.currentSchool = user.school; // adjust based on actual response
        } else if (role === 'parent') {
            const children = await api.getChildren(user.id);
            window.currentChildren = children;
            window.activeChildId = children[0]?.id;
            window.currentSchool = children[0]?.school; // might need separate school fetch
        } else if (role === 'student') {
            window.currentSchool = user.school;
        }

        showToast('Login successful!', 'success');
        hideAll();
        document.getElementById(`${role}-dashboard`).style.display = 'block';
        window.loadDashboard(role);
        // ... rest of your logic
    } catch (err) {
        // Error already shown by api.js
    }
};

window.logout = function() {
    api.logout();
    showToast('Logged out');
    showLanding();
    // ... cleanup
};