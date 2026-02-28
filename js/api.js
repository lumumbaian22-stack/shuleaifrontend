// js/api.js
const API_BASE = 'https://shuleaibackend-32h1.onrender.com/api';

// Store the JWT token after login
let authToken = localStorage.getItem('shuleai_token') || null;

// Helper to include auth header
function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
}

// Generic request function
async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        ...options,
        headers: getHeaders(),
    };
    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        showToast(err.message, 'error');
        throw err;
    }
}

// Auth
export async function login(role, credentials) {
    const endpoint = `/auth/login`; // POST /api/auth/login
    const response = await request(endpoint, {
        method: 'POST',
        body: JSON.stringify({ role, ...credentials })
    });
    if (response.token) {
        authToken = response.token;
        localStorage.setItem('shuleai_token', authToken);
    }
    return response.user; // assume backend returns user object
}

export function logout() {
    authToken = null;
    localStorage.removeItem('shuleai_token');
}

// Academics
export async function getGrades(studentId) {
    return request(`/academics/grades?studentId=${studentId}`);
}
export async function getSubjects() {
    return request(`/academics/subjects`);
}
export async function getAnalytics(type, id) {
    // type can be 'school', 'class', 'student', 'teacher'
    return request(`/analytics/${type}/${id}`);
}
export async function postMarks(data) {
    return request(`/academics/marks`, { method: 'POST', body: JSON.stringify(data) });
}

// Attendance
export async function getAttendance(studentId) {
    const url = studentId ? `/attendance/${studentId}` : '/attendance';
    return request(url);
}
export async function postAttendance(data) {
    return request(`/attendance`, { method: 'POST', body: JSON.stringify(data) });
}
export async function putAttendance(id, data) {
    return request(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

// Fees
export async function getFees(studentId) {
    const url = studentId ? `/fees/${studentId}` : '/fees';
    return request(url);
}
export async function postPayment(data) {
    return request(`/fees/payments`, { method: 'POST', body: JSON.stringify(data) });
}
export async function getStatements() {
    return request(`/fees/statements`);
}

// Messages
export async function getMessages() {
    return request(`/messages`);
}
export async function getMessage(id) {
    return request(`/messages/${id}`);
}
export async function postMessage(data) {
    return request(`/messages`, { method: 'POST', body: JSON.stringify(data) });
}
export async function putMessage(id, data) {
    return request(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

// Parents
export async function getParent(id) {
    return request(`/parents/${id}`);
}
export async function getChildren(parentId) {
    return request(`/parents/${parentId}/children`);
}
export async function getChildReport(parentId, childId) {
    return request(`/parents/${parentId}/children/${childId}/reports`);
}

// Students
export async function getStudents() {
    return request(`/students`);
}
export async function getStudent(id) {
    return request(`/students/${id}`);
}
export async function getStudentGrades(id) {
    return request(`/students/${id}/grades`);
}
export async function getStudentAttendance(id) {
    return request(`/students/${id}/attendance`);
}
export async function getStudentFees(id) {
    return request(`/students/${id}/fees`);
}

// Teachers
export async function getTeachers() {
    return request(`/teachers`);
}
export async function getTeacher(id) {
    return request(`/teachers/${id}`);
}
export async function getTeacherClasses(id) {
    return request(`/teachers/${id}/classes`);
}
export async function postTeacherMarks(id, data) {
    return request(`/teachers/${id}/marks`, { method: 'POST', body: JSON.stringify(data) });
}
export async function postTeacherAttendance(id, data) {
    return request(`/teachers/${id}/attendance`, { method: 'POST', body: JSON.stringify(data) });
}

// Users
export async function getUser(id) {
    return request(`/users/${id}`);
}
export async function updateUser(id, data) {
    return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function getUsersByRole(role) {
    // role: 'teachers', 'parents', 'students'
    return request(`/users/${role}`);
}