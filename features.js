// features.js - Fixed version without duplication
console.log('=== FEATURES.JS LOADED ===');

// Check if features are already loaded
if (window.featuresLoaded) {
    console.log('Features already loaded, skipping...');
} else {
    window.featuresLoaded = true;
// Make key functions globally accessible
window.showUserManagement = showUserManagement;
window.showLeaveManagement = showLeaveManagement;
window.showAssetRegister = showAssetRegister;
window.showContractsTracker = showContractsTracker;
window.showDocumentsSection = showDocumentsSection;

// Leave management functions
window.addLeaveRecord = addLeaveRecord;
window.saveLeaveRecord = saveLeaveRecord;
window.closeLeaveForm = closeLeaveForm;
window.refreshLeaveData = refreshLeaveData;
window.clearAllLeaveRecords = clearAllLeaveRecords;
window.deleteLeaveRecord = deleteLeaveRecord;
window.editLeaveRecord = editLeaveRecord;

// Asset management functions
window.addAsset = addAsset;
window.closeAssetForm = closeAssetForm;
window.saveAsset = saveAsset;
window.editAsset = editAsset;
window.reassignAsset = reassignAsset;
window.deleteAsset = deleteAsset;
window.exportAssets = exportAssets;
window.clearAllAssets = clearAllAssets;
window.closeReassignModal = closeReassignModal;
window.confirmReassign = confirmReassign;
// User management functions
window.showAddUserForm = showAddUserForm;
window.closeUserForm = closeUserForm;
window.saveUser = saveUser;
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
// Other global diclarations
window.toggleAssetTypeInput = toggleAssetTypeInput;
window.updateDashboardStats = updateDashboardStats;
window.initDashboard = initDashboard

    // User database - initialize from localStorage or use defaults
let systemUsers = [];

// Load users from localStorage on page load
function loadSystemUsers() {
    const storedUsers = JSON.parse(localStorage.getItem('bmas_system_users'));
    
    if (storedUsers && storedUsers.length > 0) {
        systemUsers = storedUsers;
    } else {
        // Default users if none in localStorage
        systemUsers = [
            { 
                username: 'admin', 
                password: 'admin123', 
                role: 'Super Admin', 
                client: 'BMAS Admin Portal', 
                email: 'admin@bmas.com', 
                isActive: true,
                dateCreated: new Date().toISOString()
            },
            { 
                username: 'tech_admin', 
                password: 'password123', 
                role: 'HR Manager', 
                client: 'Zambia Tech Solutions', 
                email: 'tech@example.com', 
                isActive: true,
                dateCreated: new Date().toISOString()
            },
            { 
                username: 'mfg_admin', 
                password: 'password123', 
                role: 'HR Manager', 
                client: 'Copperbelt Manufacturing', 
                email: 'mfg@example.com', 
                isActive: true,
                dateCreated: new Date().toISOString()
            },
            { 
                username: 'retail_admin', 
                password: 'password123', 
                role: 'HR Manager', 
                client: 'Lusaka Retail Group', 
                email: 'retail@example.com', 
                isActive: true,
                dateCreated: new Date().toISOString()
            }
        ];
        
        // Save defaults to localStorage
        localStorage.setItem('bmas_system_users', JSON.stringify(systemUsers));
    }
}

// Call this function to initialize users
loadSystemUsers();

    // Data storage for features
    let leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    let assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    let contracts = JSON.parse(localStorage.getItem('bmas_contracts')) || [];

    // ===== ENHANCE LOGIN SYSTEM =====
    function enhanceLoginSystem() {
        console.log('Enhancing login system...');
        
        // Store original function
        const originalHandleLogin = window.handleLogin;
        
        if (typeof originalHandleLogin !== 'function') {
            console.error('Original handleLogin not found!');
            return false;
        }
        
        // Override with enhanced version
        window.handleLogin = function() {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const clientSelect = document.getElementById('clientSelect');
            
            if (!usernameInput || !passwordInput || !clientSelect) {
                alert('Login form elements not found');
                return;
            }
            
            const username = usernameInput.value;
            const password = passwordInput.value;
            const selectedOption = clientSelect.options[clientSelect.selectedIndex];
            const clientName = selectedOption.textContent;
            
            // Basic validation
            if (clientSelect.value === '' || clientName.includes('--')) {
                alert('Please select a client');
                return;
            }
            
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            // Validate user
            const user = systemUsers.find(u => 
                u.username === username && 
                u.password === password
            );
            
            if (!user) {
                alert('Invalid username or password');
                return;
            }
            
            // Check client access
            if (user.client !== clientName) {
                alert(`User "${username}" does not have access to "${clientName}"\n\nThis user has access to: ${user.client}`);
                return;
            }
            
            console.log('User authenticated:', user.username);
            window.currentUser = user;
            
            // Call original login function
            originalHandleLogin();
            
            // Enhance UI after login
            setTimeout(() => {
                const roleElement = document.getElementById('userRoleDisplay');
                const nameElement = document.getElementById('userName');
                const initialsElement = document.getElementById('userInitials');
                
                if (roleElement) roleElement.textContent = user.role;
                if (nameElement) nameElement.textContent = user.username;
                if (initialsElement) initialsElement.textContent = user.username.substring(0, 2).toUpperCase();
                
                console.log('UI enhanced for user:', user.username);
            }, 200);
        };
        
        console.log('Login system enhanced successfully');
        return true;
    }

    // ===== ADD ALL NAVIGATION ITEMS =====
    function addAllNavigationItems() {
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            // Find sidebar navigation
            const sidebarNav = document.querySelector('nav.flex-1');
            
            if (sidebarNav) {
                clearInterval(checkInterval);
                
                // Check if items already exist by looking for specific features
                if (document.querySelector('[data-feature="user-management"]')) {
                    console.log('Features already added, skipping...');
                    return;
                }
                
                // Find Reports section
                const reportsHeader = Array.from(sidebarNav.querySelectorAll('div'))
                    .find(el => el.textContent && el.textContent.includes('Reports'));
                
                if (reportsHeader) {
                    // Create all feature navigation items
                    const features = [
                        { id: 'user-management', name: 'User Management', icon: 'fa-user-shield', handler: showUserManagement },
                        { id: 'leave-management', name: 'Leave Management', icon: 'fa-calendar-alt', handler: showLeaveManagement },
                        { id: 'asset-register', name: 'Asset Register', icon: 'fa-laptop', handler: showAssetRegister },
                        { id: 'contracts-tracker', name: 'Contracts Tracker', icon: 'fa-file-contract', handler: showContractsTracker },
                        { id: 'employee-documents', name: 'Employee Documents', icon: 'fa-folder', handler: showDocumentsSection }
                    ];
                    
                    // Insert each feature after Reports header
                    features.forEach(feature => {
                        const navItem = document.createElement('a');
                        navItem.href = '#';
                        navItem.setAttribute('data-feature', feature.id);
                        navItem.className = 'nav-item block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150';
                        navItem.innerHTML = `<i class="fas ${feature.icon} mr-3"></i>${feature.name}`;
                        navItem.onclick = function(e) {
                            e.preventDefault();
                            
                            // Update active state
                            document.querySelectorAll('.nav-item').forEach(nav => {
                                nav.classList.remove('active-nav');
                                nav.classList.add('inactive-nav');
                            });
                            this.classList.remove('inactive-nav');
                            this.classList.add('active-nav');
                            
                            // Show the feature
                            feature.handler();
                        };
                        
                        reportsHeader.parentNode.insertBefore(navItem, reportsHeader.nextSibling);
                    });
                    
                    console.log('All 5 feature nav items added');
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('Sidebar nav not found after maximum attempts');
            }
        }, 500);
    }

   // ===== FEATURE 1: USER MANAGEMENT =====
function showUserManagement() {
    const mainContent = document.querySelector('main');
    
    // Hide other views
    document.querySelectorAll('main > div[id$="View"]').forEach(view => {
        if (view.id !== 'userManagementView') {
            view.classList.add('hidden');
        }
    });
    
    // Hide dashboard if it's showing
    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView) {
        dashboardView.classList.add('hidden');
    }
    
    // Create user management view
    let userView = document.getElementById('userManagementView');
    if (!userView) {
        userView = document.createElement('div');
        userView.id = 'userManagementView';
        userView.className = 'p-6';
        userView.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
                    <p class="text-sm text-gray-600">Manage system users and permissions</p>
                </div>
                <button onclick="showAddUserForm()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
                    <i class="fas fa-user-plus mr-2"></i>Add New User
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="overflow-x-auto">
                    <table class="employee-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="userTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
        mainContent.appendChild(userView);
        
        // Load user data
        loadUserData();
    }
    
    userView.classList.remove('hidden');
    updatePageTitle('User Management', 'Manage system users and permissions');
}

function loadUserData() {
    const tableBody = document.getElementById('userTableBody');
    if (tableBody) {
        if (systemUsers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        <i class="fas fa-users text-3xl mb-2 block"></i>
                        <p>No users found</p>
                        <p class="text-sm mt-2">Click "Add New User" to add your first user</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = systemUsers.map(user => `
            <tr>
                <td class="font-medium">${user.username}</td>
                <td>${user.email}</td>
                <td><span class="px-2 py-1 rounded-full text-xs ${getRoleClass(user.role)}">${user.role}</span></td>
                <td>${user.client}</td>
                <td>
                    <span class="px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button onclick="editUser('${user.username}')" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="toggleUserStatus('${user.username}')" class="text-yellow-600 hover:text-yellow-800 mr-2" title="${user.isActive ? 'Deactivate' : 'Activate'}">
                        <i class="fas ${user.isActive ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button onclick="deleteUser('${user.username}')" class="text-red-600 hover:text-red-800" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function getRoleClass(role) {
    const classes = {
        'Super Admin': 'bg-purple-100 text-purple-800',
        'HR Manager': 'bg-blue-100 text-blue-800',
        'Payroll Officer': 'bg-green-100 text-green-800',
        'Viewer': 'bg-gray-100 text-gray-800'
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
}

function showAddUserForm(userToEdit = null) {
    let modal = document.getElementById('userFormModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'userFormModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 class="text-xl font-bold mb-4" id="userFormTitle">Add New User</h2>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Username</label>
                    <input type="text" id="userUsername" class="form-input w-full" required>
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Email</label>
                    <input type="email" id="userEmail" class="form-input w-full" required>
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Password</label>
                    <input type="password" id="userPassword" class="form-input w-full" ${userToEdit ? '' : 'required'}>
                    ${userToEdit ? '<p class="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>' : ''}
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Confirm Password</label>
                    <input type="password" id="userConfirmPassword" class="form-input w-full" ${userToEdit ? '' : 'required'}>
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Role</label>
                    <select id="userRole" class="form-input w-full">
                        <option value="HR Manager">HR Manager</option>
                        <option value="Payroll Officer">Payroll Officer</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Super Admin">Super Admin</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium">Client Access</label>
                    <select id="userClient" class="form-input w-full">
                        <option value="Zambia Tech Solutions">Zambia Tech Solutions</option>
                        <option value="Copperbelt Manufacturing">Copperbelt Manufacturing</option>
                        <option value="Lusaka Retail Group">Lusaka Retail Group</option>
                        <option value="BMAS Admin Portal">BMAS Admin Portal</option>
                    </select>
                </div>

                <div class="flex justify-end space-x-3">
                    <button onclick="closeUserForm()" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onclick="saveUser()" class="px-4 py-2 bg-green-600 text-white rounded" id="saveUserBtn">Save User</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Clear form if adding new user
    if (!userToEdit) {
        document.getElementById('userFormTitle').textContent = 'Add New User';
        document.getElementById('userUsername').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userPassword').value = '';
        document.getElementById('userConfirmPassword').value = '';
        document.getElementById('userRole').value = 'HR Manager';
        document.getElementById('userClient').value = 'Zambia Tech Solutions';
        document.getElementById('saveUserBtn').textContent = 'Save User';
        document.getElementById('saveUserBtn').onclick = saveUser;
    } else {
        // Fill form for editing
        document.getElementById('userFormTitle').textContent = 'Edit User';
        document.getElementById('userUsername').value = userToEdit.username;
        document.getElementById('userEmail').value = userToEdit.email;
        document.getElementById('userPassword').value = ''; // Don't show password
        document.getElementById('userConfirmPassword').value = '';
        document.getElementById('userRole').value = userToEdit.role;
        document.getElementById('userClient').value = userToEdit.client;
        document.getElementById('saveUserBtn').textContent = 'Update User';
        document.getElementById('saveUserBtn').setAttribute('data-old-username', userToEdit.username);
        document.getElementById('saveUserBtn').onclick = function() {
            updateUser(userToEdit.username);
        };
    }

    modal.classList.remove('hidden');
}

function closeUserForm() {
    const modal = document.getElementById('userFormModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function saveUser() {
    const username = document.getElementById('userUsername').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    const role = document.getElementById('userRole').value;
    const client = document.getElementById('userClient').value;

    // Validation
    if (!username || !email) {
        alert('Please fill in all required fields');
        return;
    }

    if (!password) {
        alert('Please enter a password');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Check if username already exists
    const existingUser = systemUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    // Check if email already exists
    const existingEmail = systemUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
        alert('Email already exists. Please use a different email.');
        return;
    }

    // Create new user
    const newUser = {
        username: username,
        email: email,
        password: password,
        role: role,
        client: client,
        isActive: true,
        dateCreated: new Date().toISOString()
    };

    // Add to systemUsers array
    systemUsers.push(newUser);
    
    // Save to localStorage for persistence
    localStorage.setItem('bmas_system_users', JSON.stringify(systemUsers));

    // Close form
    closeUserForm();
    
    // Reload user data
    loadUserData();
    
    alert(`User "${username}" added successfully!`);
}

function updateUser(oldUsername) {
    const username = document.getElementById('userUsername').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    const role = document.getElementById('userRole').value;
    const client = document.getElementById('userClient').value;

    // Find user index
    const userIndex = systemUsers.findIndex(u => u.username === oldUsername);
    if (userIndex === -1) {
        alert('User not found');
        return;
    }

    // Validation
    if (!username || !email) {
        alert('Please fill in required fields');
        return;
    }

    // Check if username changed and new username already exists (excluding current user)
    if (username !== oldUsername) {
        const usernameExists = systemUsers.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && u.username !== oldUsername
        );
        if (usernameExists) {
            alert('Username already exists. Please choose a different username.');
            return;
        }
    }

    // Check if email changed and new email already exists (excluding current user)
    const currentUser = systemUsers[userIndex];
    if (email !== currentUser.email) {
        const emailExists = systemUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && u.username !== oldUsername
        );
        if (emailExists) {
            alert('Email already exists. Please use a different email.');
            return;
        }
    }

    // Update user
    const updatedUser = {
        ...systemUsers[userIndex],
        username: username,
        email: email,
        role: role,
        client: client
    };

    // Update password only if provided
    if (password) {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        updatedUser.password = password;
    }

    systemUsers[userIndex] = updatedUser;
    
    // Save to localStorage
    localStorage.setItem('bmas_system_users', JSON.stringify(systemUsers));

    // Close form
    closeUserForm();
    
    // Reload user data
    loadUserData();
    
    alert(`User "${username}" updated successfully!`);
}

function editUser(username) {
    const user = systemUsers.find(u => u.username === username);
    if (user) {
        showAddUserForm(user);
    }
}

function toggleUserStatus(username) {
    const user = systemUsers.find(u => u.username === username);
    if (!user) return;
    
    const action = user.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} user "${username}"?`)) {
        user.isActive = !user.isActive;
        localStorage.setItem('bmas_system_users', JSON.stringify(systemUsers));
        loadUserData();
        alert(`User "${username}" has been ${user.isActive ? 'activated' : 'deactivated'}`);
    }
}

function deleteUser(username) {
    // Prevent deleting the last Super Admin
    const superAdmins = systemUsers.filter(u => u.role === 'Super Admin');
    const userToDelete = systemUsers.find(u => u.username === username);
    
    if (userToDelete && userToDelete.role === 'Super Admin' && superAdmins.length === 1) {
        alert('Cannot delete the last Super Admin user. Please create another Super Admin first.');
        return;
    }
    
    if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
        const userIndex = systemUsers.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            systemUsers.splice(userIndex, 1);
            localStorage.setItem('bmas_system_users', JSON.stringify(systemUsers));
            loadUserData();
            alert(`User "${username}" has been deleted`);
        }
    }
}
   // ===== FEATURE 2: LEAVE MANAGEMENT =====
// ===== FEATURE 2: LEAVE MANAGEMENT =====
function showLeaveManagement() {
    const mainContent = document.querySelector('main');
    
    // Hide other views
    document.querySelectorAll('main > div[id$="View"]').forEach(view => {
        if (view.id !== 'leaveManagementView') {
            view.classList.add('hidden');
        }
    });
    
    // Hide dashboard if it's showing
    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView) {
        dashboardView.classList.add('hidden');
    }
    
    // Create leave management view
    let leaveView = document.getElementById('leaveManagementView');
    if (!leaveView) {
        leaveView = document.createElement('div');
        leaveView.id = 'leaveManagementView';
        leaveView.className = 'p-6';
        leaveView.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Leave Management</h1>
                    <p class="text-sm text-gray-600">Track employee leave days and balances</p>
                </div>
                <button id="addLeaveRecordBtn" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
                    <i class="fas fa-plus mr-2"></i>Add Leave Record
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold mb-4">Leave Summary</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="leaveSummary"></div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Leave Records</h3>
                    <div class="flex space-x-2">
                        <button id="refreshLeaveDataBtn" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                        <button id="clearAllLeaveBtn" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash-alt"></i> Clear All
                        </button>
                    </div>
                </div>
                <table class="employee-table">
                    <thead>
                        <tr>
                            <th>Employee</th><th>Leave Type</th><th>Start Date</th>
                            <th>End Date</th><th>Days Taken</th><th>Balance</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="leaveTableBody"></tbody>
                </table>
            </div>
        `;
        mainContent.appendChild(leaveView);
        
        // Add event listeners after creating the view
        setTimeout(() => {
            document.getElementById('addLeaveRecordBtn')?.addEventListener('click', addLeaveRecord);
            document.getElementById('refreshLeaveDataBtn')?.addEventListener('click', refreshLeaveData);
            document.getElementById('clearAllLeaveBtn')?.addEventListener('click', clearAllLeaveRecords);
        }, 100);
    }
    
    // Load actual data from localStorage
    loadLeaveData();
    
    leaveView.classList.remove('hidden');
    updatePageTitle('Leave Management', 'Track employee leave days and balances');
}
function loadEmployeeData() {
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    const tableBody = document.getElementById('employeeTableBody');
    
    if (!tableBody) return;
    
    if (employees.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-8 text-gray-500">
                    <i class="fas fa-users text-3xl mb-2 block"></i>
                    <p>No employees found</p>
                    <p class="text-sm mt-2">Click "Add Employee" to add your first employee</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = employees.map(emp => {
        // Calculate leave balances if they exist
        let leaveInfo = '';
        if (emp.entitlements && emp.used) {
            const annualRemaining = emp.entitlements.Annual - (emp.used.Annual || 0);
            leaveInfo = `<div class="text-xs text-blue-600">${annualRemaining} Annual leave days left</div>`;
        }
        
        return `
            <tr>
                <td class="font-medium">${emp.id}</td>
                <td>
                    <div class="font-medium">${emp.name}</div>
                    ${leaveInfo}
                </td>
                <td>${emp.nrc || 'N/A'}</td>
                <td>${emp.ssn || 'N/A'}</td>
                <td>${emp.position || 'N/A'}</td>
                <td>ZMW ${parseFloat(emp.salary || 0).toLocaleString()}</td>
                <td>
                    <button onclick="editEmployee('${emp.id}')" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteEmployee('${emp.id}')" class="text-red-600 hover:text-red-800" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
// ===== LEAVE ENTITLEMENT CALCULATION =====
function calculateEmployeeEntitlements(contractMonths) {
    // Ensure contractMonths is a number
    const months = parseInt(contractMonths) || 12;
    
    return {
        Annual: Math.floor(2 * months),      // 2 days per month
        Sick: 180,                           // after 6 months employee can be discharged on medical grounds
        Maternity: 98,                       // Fixed by law
        Paternity: 5,                        // Fixed by law
        Unpaid: 0                            // Unlimited
    };
}

// Make these functions globally accessible
window.addLeaveRecord = addLeaveRecord;
window.saveLeaveRecord = saveLeaveRecord;
window.closeLeaveForm = closeLeaveForm;
window.refreshLeaveData = refreshLeaveData;
window.clearAllLeaveRecords = clearAllLeaveRecords;
window.deleteLeaveRecord = deleteLeaveRecord;

function addLeaveRecord() {
    let modal = document.getElementById('leaveFormModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leaveFormModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
                <h2 class="text-xl font-bold mb-4">Add Leave Record</h2>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Employee</label>
                    <select id="leaveEmployee" class="form-input w-full" onchange="updateLeaveBalanceDisplay()">
                        <!-- Options will be populated by JavaScript -->
                    </select>
                </div>

                <div class="mb-3">
                    <label class="block text-sm font-medium">Leave Type</label>
                    <select id="leaveType" class="form-input w-full" onchange="updateLeaveBalanceDisplay()">
                        <option value="Annual">Annual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Maternity">Maternity Leave</option>
                        <option value="Paternity">Paternity Leave</option>
                        <option value="Unpaid">Unpaid Leave</option>
                    </select>
                </div>

                <!-- Available Balance Display -->
                <div class="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <div class="text-sm font-medium text-blue-800">Available Balance</div>
                    <div id="leaveBalanceDisplay" class="text-lg font-bold text-blue-600">
                        Select employee and leave type
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <label class="block text-sm font-medium">Start Date</label>
                        <input type="date" id="leaveStart" class="form-input w-full" onchange="calculateLeaveDays()">
                    </div>
                    <div>
                        <label class="block text-sm font-medium">End Date</label>
                        <input type="date" id="leaveEnd" class="form-input w-full" onchange="calculateLeaveDays()">
                    </div>
                </div>

                <!-- Days Count Display -->
                <div class="mb-3 p-2 bg-gray-50 rounded text-center">
                    <span class="text-sm text-gray-600">Total Days: </span>
                    <span id="leaveDaysCount" class="font-bold text-blue-600">0</span>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium">Notes</label>
                    <textarea id="leaveNotes" class="form-input w-full"></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <button onclick="closeLeaveForm()" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onclick="saveLeaveRecord()" class="px-4 py-2 bg-green-600 text-white rounded">Save Leave</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Populate employee dropdown
        populateEmployeeDropdown();
    }

    modal.classList.remove('hidden');
    // Update balance display when modal opens
    setTimeout(updateLeaveBalanceDisplay, 100);
}
function closeLeaveForm() {
    let modal = document.getElementById('leaveFormModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function loadLeaveData() {
    // Load actual data from localStorage instead of sample data
    const leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    
    console.log('Loading leave data from localStorage:', leaveRecords);
    
    // Update summary with actual data
    const summaryDiv = document.getElementById('leaveSummary');
    if (summaryDiv) {
        const totalLeave = leaveRecords.reduce((sum, record) => sum + (parseInt(record.days) || 0), 0);
        
        // Count employees currently on leave
        const today = new Date().toISOString().split('T')[0];
        const onLeave = leaveRecords.filter(record => {
            return today >= record.startDate && today <= record.endDate && record.status !== 'cancelled';
        }).length;
        
        // Count different leave types
        const leaveTypes = new Set(leaveRecords.map(r => r.type));
        
        summaryDiv.innerHTML = `
            <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-gray-500">Total Leave Days</p>
                <p class="text-2xl font-bold text-blue-600">${totalLeave}</p>
                <p class="text-xs text-gray-500">Across all records</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-gray-500">Employees on Leave</p>
                <p class="text-2xl font-bold text-green-600">${onLeave}</p>
                <p class="text-xs text-gray-500">As of today</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <p class="text-sm text-gray-500">Leave Types</p>
                <p class="text-2xl font-bold text-yellow-600">${leaveTypes.size}</p>
                <p class="text-xs text-gray-500">In use</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-sm text-gray-500">Active Records</p>
                <p class="text-2xl font-bold text-purple-600">${leaveRecords.length}</p>
                <p class="text-xs text-gray-500">Total records</p>
            </div>
        `;
    }
    
    // Update table with actual data
    const tableBody = document.getElementById('leaveTableBody');
    if (tableBody) {
        if (leaveRecords.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8 text-gray-500">
                        <i class="fas fa-calendar-times text-3xl mb-2 block"></i>
                        <p>No leave records found</p>
                        <p class="text-sm mt-2">Click "Add Leave Record" to add your first leave record</p>
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = leaveRecords.map(record => {
                // Determine status badge
                const today = new Date();
                const startDate = new Date(record.startDate);
                const endDate = new Date(record.endDate);
                
                let status = record.status || 'approved';
                let statusClass = 'bg-green-100 text-green-800';
                
                if (record.status === 'cancelled') {
                    statusClass = 'bg-red-100 text-red-800';
                } else if (record.status === 'pending') {
                    statusClass = 'bg-yellow-100 text-yellow-800';
                } else if (today < startDate) {
                    status = 'Upcoming';
                    statusClass = 'bg-blue-100 text-blue-800';
                } else if (today > endDate) {
                    status = 'Completed';
                    statusClass = 'bg-gray-100 text-gray-800';
                } else {
                    status = 'In Progress';
                    statusClass = 'bg-green-100 text-green-800';
                }
                
                return `
                    <tr>
                        <td>${record.employee}</td>
                        <td>${record.type}</td>
                        <td>${record.startDate}</td>
                        <td>${record.endDate}</td>
                        <td>${record.days}</td>
                        <td>${record.balance}</td>
                        <td><span class="px-2 py-1 rounded-full text-xs ${statusClass}">${status}</span></td>
                        <td>
                            <button onclick="deleteLeaveRecord('${record.id}')" class="text-red-600 hover:text-red-800 mr-2" title="Delete">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button onclick="editLeaveRecord('${record.id}')" class="text-blue-600 hover:text-blue-800" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
}

function saveLeaveRecord() {
    const empSelect = document.getElementById('leaveEmployee');
    const employeeId = empSelect.value;
    const employeeName = empSelect.options[empSelect.selectedIndex].text;

    const leaveType = document.getElementById('leaveType').value;
    const start = document.getElementById('leaveStart').value;
    const end = document.getElementById('leaveEnd').value;
    const notes = document.getElementById('leaveNotes').value;

    if (!start || !end || start > end) {
        alert('Invalid date range');
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const dayCount = Math.ceil((endDate - startDate) / 86400000) + 1;

    // Get employee data
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
        alert('Employee not found! Please add employee first.');
        return;
    }
    
    // Initialize if needed
    if (!employee.entitlements) {
        employee.entitlements = calculateEmployeeEntitlements(employee.contractMonths || 12);
    }
    if (!employee.used) {
        employee.used = { Annual: 0, Sick: 0, Maternity: 0, Paternity: 0, Unpaid: 0 };
    }
    
    // Check available balance
    const availableBalance = employee.entitlements[leaveType] - (employee.used[leaveType] || 0);
    
    if (dayCount > availableBalance && leaveType !== 'Unpaid') {
        alert(`Insufficient ${leaveType} balance!\nAvailable: ${availableBalance} days\nRequested: ${dayCount} days`);
        return;
    }
    
    // Update employee's used leave
    employee.used[leaveType] = (employee.used[leaveType] || 0) + dayCount;
    
    // Calculate remaining balance
    const remainingBalance = employee.entitlements[leaveType] - employee.used[leaveType];

    const newRecord = {
        id: `LEAVE-${Date.now()}`,
        employee: employeeName,
        employeeId: employeeId, // Store employee ID too
        type: leaveType,
        startDate: start,
        endDate: end,
        days: dayCount,
        balance: remainingBalance, // This is now employee-specific!
        notes,
        dateAdded: new Date().toISOString(),
        year: new Date().getFullYear(),
        status: 'approved'
    };

    // Get existing records, add new one
    const existingRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    existingRecords.push(newRecord);
    localStorage.setItem('bmas_leave_records', JSON.stringify(existingRecords));
    
    // Update employee data in storage
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex >= 0) {
        employees[employeeIndex] = employee;
        localStorage.setItem('bmas_employees', JSON.stringify(employees));
    }

    closeLeaveForm();
    
    // Reload the data to show the new record
    loadLeaveData();
    
    // Show success message with remaining balance
    setTimeout(() => {
        alert(`Leave record added for ${employeeName}\n${leaveType} Leave: ${start} to ${end} (${dayCount} days)\nRemaining balance: ${remainingBalance} days`);
    }, 300);
}
function updateLeaveRecord(recordId) {
    const empSelect = document.getElementById('leaveEmployee');
    const employeeId = empSelect.value;
    const employeeName = empSelect.options[empSelect.selectedIndex].text;

    const leaveType = document.getElementById('leaveType').value;
    const start = document.getElementById('leaveStart').value;
    const end = document.getElementById('leaveEnd').value;
    const notes = document.getElementById('leaveNotes').value;

    if (!start || !end || start > end) {
        alert('Invalid date range');
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const dayCount = Math.ceil((endDate - startDate) / 86400000) + 1;

    // Get employee and leave records
    let employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    let leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
        alert('Employee not found!');
        return;
    }
    
    // Initialize if needed
    if (!employee.entitlements) {
        employee.entitlements = calculateEmployeeEntitlements(employee.contractMonths || 12);
    }
    if (!employee.used) {
        employee.used = { Annual: 0, Sick: 0, Maternity: 0, Paternity: 0, Unpaid: 0 };
    }
    
    // Find old record
    const oldRecord = leaveRecords.find(record => record.id === recordId);
    
    // Update employee's used leave: FIRST subtract old, THEN add new
    if (oldRecord) {
        // Remove old days
        if (employee.used[oldRecord.type] !== undefined) {
            employee.used[oldRecord.type] = Math.max(0, employee.used[oldRecord.type] - oldRecord.days);
        }
    }
    
    // Check available balance for new request
    const availableBalance = employee.entitlements[leaveType] - (employee.used[leaveType] || 0);
    
    if (dayCount > availableBalance && leaveType !== 'Unpaid') {
        alert(`Insufficient ${leaveType} balance!\nAvailable: ${availableBalance} days\nRequested: ${dayCount} days`);
        return;
    }
    
    // Add new days
    employee.used[leaveType] = (employee.used[leaveType] || 0) + dayCount;
    
    // Calculate remaining balance
    const remainingBalance = employee.entitlements[leaveType] - employee.used[leaveType];

    // Update the leave record
    leaveRecords = leaveRecords.map(record => {
        if (record.id === recordId) {
            return {
                ...record,
                employee: employeeName,
                employeeId: employeeId,
                type: leaveType,
                startDate: start,
                endDate: end,
                days: dayCount,
                balance: remainingBalance, // Employee-specific balance
                notes: notes,
                lastUpdated: new Date().toISOString()
            };
        }
        return record;
    });

    // Save both
    localStorage.setItem('bmas_leave_records', JSON.stringify(leaveRecords));
    
    // Update employee data
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex >= 0) {
        employees[employeeIndex] = employee;
        localStorage.setItem('bmas_employees', JSON.stringify(employees));
    }

    closeLeaveForm();
    loadLeaveData();

    alert(`Leave record updated!\nRemaining ${leaveType} balance: ${remainingBalance} days`);
}


function deleteLeaveRecord(recordId) {
    if (confirm('Are you sure you want to delete this leave record?')) {
        const leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
        const updatedRecords = leaveRecords.filter(record => record.id !== recordId);
        localStorage.setItem('bmas_leave_records', JSON.stringify(updatedRecords));
        
        // Reload the data
        loadLeaveData();
        
        alert('Leave record deleted successfully');
    }
}

function editLeaveRecord(recordId) {
    const leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    const record = leaveRecords.find(r => r.id === recordId);

    if (!record) {
        alert("Record not found.");
        return;
    }

    // Open the form modal (same as Add)
    addLeaveRecord();

    // Fill form with existing values
    document.getElementById('leaveEmployee').value = record.employee;
    document.getElementById('leaveType').value = record.type;
    document.getElementById('leaveStart').value = record.startDate;
    document.getElementById('leaveEnd').value = record.endDate;
    document.getElementById('leaveNotes').value = record.notes || "";

    // Change Save button to "Update"
    const saveBtn = document.querySelector('#leaveFormModal button[onclick="saveLeaveRecord()"]');
    saveBtn.textContent = "Update Record";

    // Override save function temporarily
    saveBtn.onclick = function () {
        updateLeaveRecord(recordId);
    };
}


function refreshLeaveData() {
    loadLeaveData();
    alert('Leave data refreshed');
}

function clearAllLeaveRecords() {
    if (confirm('Are you sure you want to clear ALL leave records? This cannot be undone.')) {
        localStorage.removeItem('bmas_leave_records');
        loadLeaveData();
        alert('All leave records have been cleared');
    }
}
function saveEmployeeWithLeave(event) {
    if (event) event.preventDefault();
    
    // Get form values
    const empId = document.getElementById('empId').value;
    const empName = document.getElementById('empName').value;
    const contractMonths = parseInt(document.getElementById('empContractMonths').value) || 12;
    
    // Calculate entitlements
    const entitlements = calculateEmployeeEntitlements(contractMonths);
    
    // Get existing employees
    let employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    
    // Check if editing existing employee
    const existingIndex = employees.findIndex(emp => emp.id === empId);
    
    const employeeData = {
        id: empId,
        name: empName,
        contractMonths: contractMonths,
        entitlements: entitlements,
        used: { Annual: 0, Sick: 0, Maternity: 0, Study: 0, Unpaid: 0 },
        nrc: document.getElementById('empNrc').value,
        ssn: document.getElementById('empSsn').value,
        dob: document.getElementById('empDob').value,
        nhima: document.getElementById('empNhima').value,
        position: document.getElementById('empPosition').value,
        salary: parseFloat(document.getElementById('empSalary').value) || 0,
        allowances: parseFloat(document.getElementById('empAllowances').value) || 0,
        bank: document.getElementById('empBank').value,
        deductions: parseFloat(document.getElementById('empDeductions').value) || 0
    };
    
    if (existingIndex >= 0) {
        // Update existing employee - preserve used leave
        employeeData.used = employees[existingIndex].used || { Annual: 0, Sick: 0, Maternity: 0, Study: 0, Unpaid: 0 };
        employees[existingIndex] = employeeData;
    } else {
        // Add new employee
        employees.push(employeeData);
    }
    
    // Save to localStorage
    localStorage.setItem('bmas_employees', JSON.stringify(employees));
    
    alert('Employee saved successfully!');
    closeEmployeeForm();
    
    // If we're in employee management view, refresh it
    if (document.getElementById('employeeManagementView') && !document.getElementById('employeeManagementView').classList.contains('hidden')) {
 // Try to refresh if loadEmployeeData exists
        if (typeof loadEmployeeData === 'function') {
            loadEmployeeData();
    }
}
}
    // ===== FEATURE 3: ASSET REGISTER =====
function showAssetRegister() {
    const mainContent = document.querySelector('main');
    
    // Hide other views
    document.querySelectorAll('main > div[id$="View"]').forEach(view => {
        if (view.id !== 'assetRegisterView') {
            view.classList.add('hidden');
        }
    });
    
    // Hide dashboard if it's showing
    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView) {
        dashboardView.classList.add('hidden');
    }
    
    // Create asset register view
    let assetView = document.getElementById('assetRegisterView');
    if (!assetView) {
        assetView = document.createElement('div');
        assetView.id = 'assetRegisterView';
        assetView.className = 'p-6';
        assetView.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Asset Register</h1>
                    <p class="text-sm text-gray-600">Track company assets assigned to employees</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="exportAssets()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
                        <i class="fas fa-file-export mr-2"></i>Export Assets
                    </button>
                    <button onclick="addAsset()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
                        <i class="fas fa-plus mr-2"></i>Add Asset
                    </button>
                </div>
            </div>
            
            <!-- Asset Summary -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold mb-4">Asset Summary</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="assetSummary"></div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">All Assets</h3>
                    <div class="flex space-x-2">
                        <button onclick="loadAssetData()" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                        <button onclick="clearAllAssets()" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash-alt"></i> Clear All
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="employee-table">
                        <thead>
                            <tr>
                                <th>Asset ID</th>
                                <th>Asset Type</th>
                                <th>Description</th>
                                <th>Serial Number</th>
                                <th>Assigned To</th>
                                <th>Date Assigned</th>
                                <th>Condition</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="assetTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
        mainContent.appendChild(assetView);
        
        // Load asset data
        loadAssetData();
    }
    
    assetView.classList.remove('hidden');
    updatePageTitle('Asset Register', 'Track company assets assigned to employees');
}

function loadAssetData() {
    // Load from localStorage or use sample data
    let assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    
    // If no assets in storage, initialize with sample data
    if (assets.length === 0) {
        assets = [
            { 
                id: 'AST001', 
                type: 'Laptop', 
                description: 'Dell Latitude 5440', 
                serialNumber: 'DL5440-2024-001',
                assignedTo: 'John Mwila', 
                dateAssigned: '2024-01-15', 
                condition: 'Good',
                status: 'Assigned',
                dateAdded: '2024-01-10',
                purchaseValue: 15000,
                purchaseDate: '2024-01-05'
            },
            { 
                id: 'AST002', 
                type: 'Phone', 
                description: 'Samsung Galaxy A54', 
                serialNumber: 'SGA54-2024-002',
                assignedTo: 'Sarah Banda', 
                dateAssigned: '2024-02-01', 
                condition: 'Excellent',
                status: 'Assigned',
                dateAdded: '2024-01-20',
                purchaseValue: 8000,
                purchaseDate: '2024-01-15'
            },
            { 
                id: 'AST003', 
                type: 'Monitor', 
                description: 'Dell 24" HD Monitor', 
                serialNumber: 'DL24HD-2024-003',
                assignedTo: 'Peter Phiri', 
                dateAssigned: '2024-02-15', 
                condition: 'Good',
                status: 'Assigned',
                dateAdded: '2024-02-01',
                purchaseValue: 5000,
                purchaseDate: '2024-01-25'
            },
            { 
                id: 'AST004', 
                type: 'Tablet', 
                description: 'iPad Pro 11"', 
                serialNumber: 'IPAD11-2024-004',
                assignedTo: 'Mary Tembo', 
                dateAssigned: '2024-03-01', 
                condition: 'Excellent',
                status: 'Assigned',
                dateAdded: '2024-02-15',
                purchaseValue: 12000,
                purchaseDate: '2024-02-10'
            }
        ];
        localStorage.setItem('bmas_assets', JSON.stringify(assets));
    }
    
    // Update summary
    updateAssetSummary(assets);
    
    // Update table
    const tableBody = document.getElementById('assetTableBody');
    if (tableBody) {
        if (assets.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-8 text-gray-500">
                        <i class="fas fa-laptop text-3xl mb-2 block"></i>
                        <p>No assets found</p>
                        <p class="text-sm mt-2">Click "Add Asset" to add your first asset</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = assets.map(asset => `
            <tr>
                <td class="font-medium">${asset.id}</td>
                <td>${asset.type}</td>
                <td>${asset.description}</td>
                <td class="text-sm text-gray-500">${asset.serialNumber || 'N/A'}</td>
                <td>${asset.assignedTo || 'Unassigned'}</td>
                <td>${asset.dateAssigned || 'Not assigned'}</td>
                <td>
                    <span class="px-2 py-1 rounded-full text-xs ${getConditionClass(asset.condition)}">
                        ${asset.condition || 'Unknown'}
                    </span>
                </td>
                <td>
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(asset.status)}">
                        ${asset.status || 'Available'}
                    </span>
                </td>
                <td>
                    <button onclick="editAsset('${asset.id}')" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="reassignAsset('${asset.id}')" class="text-green-600 hover:text-green-800 mr-2" title="Reassign">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button onclick="deleteAsset('${asset.id}')" class="text-red-600 hover:text-red-800" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function updateAssetSummary(assets) {
    const summaryDiv = document.getElementById('assetSummary');
    if (!summaryDiv) return;
    
    const totalAssets = assets.length;
    const assignedAssets = assets.filter(a => a.status === 'Assigned').length;
    const availableAssets = assets.filter(a => a.status === 'Available').length;
    
    // Calculate total value
    const totalValue = assets.reduce((sum, asset) => sum + (parseFloat(asset.purchaseValue) || 0), 0);
    
    summaryDiv.innerHTML = `
        <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-500">Total Assets</p>
            <p class="text-2xl font-bold text-blue-600">${totalAssets}</p>
            <p class="text-xs text-gray-500">Tracked items</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-500">Assigned</p>
            <p class="text-2xl font-bold text-green-600">${assignedAssets}</p>
            <p class="text-xs text-gray-500">In use by employees</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-gray-500">Available</p>
            <p class="text-2xl font-bold text-yellow-600">${availableAssets}</p>
            <p class="text-xs text-gray-500">Ready for assignment</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-500">Total Value</p>
            <p class="text-2xl font-bold text-purple-600">ZMW ${totalValue.toLocaleString()}</p>
            <p class="text-xs text-gray-500">Purchase value</p>
        </div>
    `;
}

function getConditionClass(condition) {
    const classes = {
        'Excellent': 'bg-green-100 text-green-800',
        'Good': 'bg-blue-100 text-blue-800',
        'Fair': 'bg-yellow-100 text-yellow-800',
        'Poor': 'bg-red-100 text-red-800',
        'Damaged': 'bg-red-100 text-red-800',
        'Under Repair': 'bg-orange-100 text-orange-800'
    };
    return classes[condition] || 'bg-gray-100 text-gray-800';
}

function getStatusClass(status) {
    const classes = {
        'Assigned': 'bg-blue-100 text-blue-800',
        'Available': 'bg-green-100 text-green-800',
        'Under Repair': 'bg-yellow-100 text-yellow-800',
        'Retired': 'bg-gray-100 text-gray-800',
        'Lost': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function addAsset(assetToEdit = null) {
    let modal = document.getElementById('assetFormModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'assetFormModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                <h2 class="text-xl font-bold mb-4" id="assetFormTitle">Add New Asset</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Asset ID *</label>
                        <input type="text" id="assetId" class="form-input w-full" required>
                    </div>
                    <div>
                       <label class="block text-sm font-medium mb-1">Asset Type *</label>
                       <select id="assetType" class="form-input w-full mb-2" onchange="toggleAssetTypeInput()">
                        <option value="Laptop">Laptop</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Phone">Phone</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Printer">Printer</option>
                        <option value="Server">Server</option>
                        <option value="Other">Other</option>
                   </select>
                    <div id="otherAssetTypeContainer" class="hidden">
                    <input type="text" id="otherAssetType" class="form-input w-full" placeholder="Specify asset type...">
                  </div>
                </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Description *</label>
                        <input type="text" id="assetDescription" class="form-input w-full" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Serial Number</label>
                        <input type="text" id="assetSerial" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Purchase Value (ZMW)</label>
                        <input type="number" id="assetValue" class="form-input w-full" min="0" step="0.01">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Purchase Date</label>
                        <input type="date" id="assetPurchaseDate" class="form-input w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Condition *</label>
                        <select id="assetCondition" class="form-input w-full">
                            <option value="Excellent">Excellent</option>
                            <option value="Good" selected>Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Status *</label>
                        <select id="assetStatus" class="form-input w-full">
                            <option value="Available">Available</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Under Repair">Under Repair</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Assigned To</label>
                    <select id="assetAssignedTo" class="form-input w-full">
                        <option value="">Select Employee</option>
                    </select>
                </div>

                <div class="mb-4" id="assignmentDateSection">
                    <label class="block text-sm font-medium mb-1">Date Assigned</label>
                    <input type="date" id="assetDateAssigned" class="form-input w-full">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Notes</label>
                    <textarea id="assetNotes" class="form-input w-full" rows="3"></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <button onclick="closeAssetForm()" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onclick="saveAsset()" class="px-4 py-2 bg-green-600 text-white rounded" id="saveAssetBtn">Save Asset</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Populate employee dropdown
        populateEmployeeDropdownForAssets();
        
        // Show/hide assignment date based on status
        const statusSelect = document.getElementById('assetStatus');
        const dateSection = document.getElementById('assignmentDateSection');
        
        statusSelect.addEventListener('change', function() {
            dateSection.style.display = this.value === 'Assigned' ? 'block' : 'none';
        });
    }

    // Clear or fill form
    if (!assetToEdit) {
        document.getElementById('assetFormTitle').textContent = 'Add New Asset';
        document.getElementById('assetId').value = 'AST' + (new Date().getTime()).toString().slice(-5);
        document.getElementById('assetType').value = 'Laptop';
        document.getElementById('assetDescription').value = '';
        document.getElementById('assetSerial').value = '';
        document.getElementById('assetValue').value = '';
        document.getElementById('assetPurchaseDate').value = '';
        document.getElementById('assetCondition').value = 'Good';
        document.getElementById('assetStatus').value = 'Available';
        document.getElementById('assetAssignedTo').value = '';
        document.getElementById('assetDateAssigned').value = '';
        document.getElementById('assetNotes').value = '';
        document.getElementById('saveAssetBtn').textContent = 'Save Asset';
        document.getElementById('saveAssetBtn').onclick = saveAsset;
        
        // Hide assignment date by default
        document.getElementById('assignmentDateSection').style.display = 'none';
    } else {
        document.getElementById('assetFormTitle').textContent = 'Edit Asset';
        document.getElementById('assetId').value = assetToEdit.id;
        // Check if the asset type is in our predefined list
const predefinedTypes = ['Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Printer', 'Server'];
if (predefinedTypes.includes(assetToEdit.type)) {
    document.getElementById('assetType').value = assetToEdit.type || 'Laptop';
    document.getElementById('otherAssetTypeContainer').classList.add('hidden');
} else {
    // If it's a custom type, show "Other" and fill the custom field
    document.getElementById('assetType').value = 'Other';
    document.getElementById('otherAssetType').value = assetToEdit.type || '';
    document.getElementById('otherAssetTypeContainer').classList.remove('hidden');
}
        document.getElementById('assetDescription').value = assetToEdit.description || '';
        document.getElementById('assetSerial').value = assetToEdit.serialNumber || '';
        document.getElementById('assetValue').value = assetToEdit.purchaseValue || '';
        document.getElementById('assetPurchaseDate').value = assetToEdit.purchaseDate || '';
        document.getElementById('assetCondition').value = assetToEdit.condition || 'Good';
        document.getElementById('assetStatus').value = assetToEdit.status || 'Available';
        document.getElementById('assetAssignedTo').value = assetToEdit.assignedTo || '';
        document.getElementById('assetDateAssigned').value = assetToEdit.dateAssigned || '';
        document.getElementById('assetNotes').value = assetToEdit.notes || '';
        document.getElementById('saveAssetBtn').textContent = 'Update Asset';
        document.getElementById('saveAssetBtn').setAttribute('data-asset-id', assetToEdit.id);
        document.getElementById('saveAssetBtn').onclick = function() {
            updateAsset(assetToEdit.id);
        };
        
        // Show/hide assignment date based on status
        document.getElementById('assignmentDateSection').style.display = 
            (assetToEdit.status === 'Assigned') ? 'block' : 'none';
    }

    modal.classList.remove('hidden');
}

function closeAssetForm() {
    const modal = document.getElementById('assetFormModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function populateEmployeeDropdownForAssets() {
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    const select = document.getElementById('assetAssignedTo');
    
    if (select) {
        select.innerHTML = '<option value="">Select Employee</option>';
        
        if (employees.length > 0) {
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name;
                select.appendChild(option);
            });
        }
    }
}
function toggleAssetTypeInput() {
    const assetTypeSelect = document.getElementById('assetType');
    const otherContainer = document.getElementById('otherAssetTypeContainer');
    const otherInput = document.getElementById('otherAssetType');
    
    if (!assetTypeSelect || !otherContainer) return;
    
    if (assetTypeSelect.value === 'Other') {
        otherContainer.classList.remove('hidden');
        if (otherInput) otherInput.focus();
    } else {
        otherContainer.classList.add('hidden');
        if (otherInput) otherInput.value = '';
    }
}

function saveAsset() {
    const assetId = document.getElementById('assetId').value.trim();
    let assetType = document.getElementById('assetType').value;
// If "Other" is selected, use the manual input
if (assetType === 'Other') {
    const otherType = document.getElementById('otherAssetType').value.trim();
    if (otherType) {
        assetType = otherType;
    } else {
        alert('Please specify the asset type');
        return;
    }
}
    const description = document.getElementById('assetDescription').value.trim();
    const serialNumber = document.getElementById('assetSerial').value.trim();
    const purchaseValue = parseFloat(document.getElementById('assetValue').value) || 0;
    const purchaseDate = document.getElementById('assetPurchaseDate').value;
    const condition = document.getElementById('assetCondition').value;
    const status = document.getElementById('assetStatus').value;
    const assignedTo = document.getElementById('assetAssignedTo').value;
    const dateAssigned = document.getElementById('assetDateAssigned').value;
    const notes = document.getElementById('assetNotes').value.trim();

    // Validation
    if (!assetId || !description) {
        alert('Please fill in required fields (Asset ID and Description)');
        return;
    }

    // Check if asset ID already exists
    const assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    const existingAsset = assets.find(a => a.id === assetId);
    if (existingAsset) {
        alert('Asset ID already exists. Please use a different ID.');
        return;
    }

    // Create new asset
    const newAsset = {
        id: assetId,
        type: assetType,
        description: description,
        serialNumber: serialNumber || '',
        purchaseValue: purchaseValue,
        purchaseDate: purchaseDate || '',
        condition: condition,
        status: status,
        assignedTo: assignedTo || '',
        dateAssigned: dateAssigned || '',
        notes: notes,
        dateAdded: new Date().toISOString()
    };

    // Add to assets array
    assets.push(newAsset);
    
    // Save to localStorage
    localStorage.setItem('bmas_assets', JSON.stringify(assets));

    // Close form
    closeAssetForm();
    
    // Reload asset data
    loadAssetData();
    
    alert(`Asset "${assetId}" added successfully!`);
}

function updateAsset(oldAssetId) {
    const assetId = document.getElementById('assetId').value.trim();
    let assetType = document.getElementById('assetType').value;
// If "Other" is selected, use the manual input
if (assetType === 'Other') {
    const otherType = document.getElementById('otherAssetType').value.trim();
    if (otherType) {
        assetType = otherType;
    } else {
        alert('Please specify the asset type');
        return;
    }
}
    const description = document.getElementById('assetDescription').value.trim();
    const serialNumber = document.getElementById('assetSerial').value.trim();
    const purchaseValue = parseFloat(document.getElementById('assetValue').value) || 0;
    const purchaseDate = document.getElementById('assetPurchaseDate').value;
    const condition = document.getElementById('assetCondition').value;
    const status = document.getElementById('assetStatus').value;
    const assignedTo = document.getElementById('assetAssignedTo').value;
    const dateAssigned = document.getElementById('assetDateAssigned').value;
    const notes = document.getElementById('assetNotes').value.trim();

    // Get assets
    let assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    
    // Find asset index
    const assetIndex = assets.findIndex(a => a.id === oldAssetId);
    if (assetIndex === -1) {
        alert('Asset not found');
        return;
    }

    // Validation
    if (!assetId || !description) {
        alert('Please fill in required fields');
        return;
    }

    // Check if asset ID changed and new ID already exists (excluding current asset)
    if (assetId !== oldAssetId) {
        const idExists = assets.find(a => a.id === assetId && a.id !== oldAssetId);
        if (idExists) {
            alert('Asset ID already exists. Please use a different ID.');
            return;
        }
    }

    // Update asset
    const updatedAsset = {
        ...assets[assetIndex],
        id: assetId,
        type: assetType,
        description: description,
        serialNumber: serialNumber,
        purchaseValue: purchaseValue,
        purchaseDate: purchaseDate,
        condition: condition,
        status: status,
        assignedTo: assignedTo,
        dateAssigned: dateAssigned,
        notes: notes,
        lastUpdated: new Date().toISOString()
    };

    assets[assetIndex] = updatedAsset;
    
    // Save to localStorage
    localStorage.setItem('bmas_assets', JSON.stringify(assets));

    // Close form
    closeAssetForm();
    
    // Reload asset data
    loadAssetData();
    
    alert(`Asset "${assetId}" updated successfully!`);
}

function editAsset(assetId) {
    const assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    const asset = assets.find(a => a.id === assetId);
    
    if (asset) {
        addAsset(asset);
    }
}

function reassignAsset(assetId) {
    const assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    const asset = assets.find(a => a.id === assetId);
    
    if (!asset) {
        alert('Asset not found');
        return;
    }
    
    // Simple reassign modal
    let modal = document.getElementById('reassignModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reassignModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 class="text-xl font-bold mb-4">Reassign Asset: ${asset.id}</h2>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Assign to Employee</label>
                    <select id="reassignEmployee" class="form-input w-full">
                        <option value="">Unassign (Make Available)</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Assignment Date</label>
                    <input type="date" id="reassignDate" class="form-input w-full" value="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Notes (Optional)</label>
                    <textarea id="reassignNotes" class="form-input w-full" rows="2" placeholder="Reason for reassignment..."></textarea>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button onclick="closeReassignModal()" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onclick="confirmReassign('${assetId}')" class="px-4 py-2 bg-blue-600 text-white rounded">Reassign</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Populate employee dropdown
        const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
        const select = document.getElementById('reassignEmployee');
        
        if (select) {
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name;
                if (emp.name === asset.assignedTo) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    }
    
    modal.classList.remove('hidden');
}

function closeReassignModal() {
    const modal = document.getElementById('reassignModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function confirmReassign(assetId) {
    const newAssignee = document.getElementById('reassignEmployee').value;
    const reassignDate = document.getElementById('reassignDate').value;
    const notes = document.getElementById('reassignNotes').value.trim();
    
    let assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    const assetIndex = assets.findIndex(a => a.id === assetId);
    
    if (assetIndex === -1) {
        alert('Asset not found');
        return;
    }
    
    // Update asset
    assets[assetIndex].assignedTo = newAssignee;
    assets[assetIndex].dateAssigned = newAssignee ? reassignDate : '';
    assets[assetIndex].status = newAssignee ? 'Assigned' : 'Available';
    assets[assetIndex].lastUpdated = new Date().toISOString();
    
    // Add reassignment history
    if (!assets[assetIndex].assignmentHistory) {
        assets[assetIndex].assignmentHistory = [];
    }
    assets[assetIndex].assignmentHistory.push({
        from: assets[assetIndex].assignedTo, // Previous assignee
        to: newAssignee,
        date: reassignDate,
        notes: notes,
        changedAt: new Date().toISOString()
    });
    
    localStorage.setItem('bmas_assets', JSON.stringify(assets));
    
    closeReassignModal();
    loadAssetData();
    
    alert(`Asset "${assetId}" ${newAssignee ? 'reassigned to ' + newAssignee : 'made available'} successfully!`);
}

function deleteAsset(assetId) {
    if (confirm(`Are you sure you want to delete asset "${assetId}"? This action cannot be undone.`)) {
        let assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
        const assetIndex = assets.findIndex(a => a.id === assetId);
        
        if (assetIndex !== -1) {
            assets.splice(assetIndex, 1);
            localStorage.setItem('bmas_assets', JSON.stringify(assets));
            loadAssetData();
            alert(`Asset "${assetId}" has been deleted`);
        }
    }
}

function exportAssets() {
    const assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    
    if (assets.length === 0) {
        alert('No assets to export');
        return;
    }
    
    // Convert to CSV
    const headers = ['Asset ID', 'Type', 'Description', 'Serial Number', 'Status', 'Condition', 'Assigned To', 'Date Assigned', 'Purchase Value', 'Purchase Date'];
    const csvRows = [
        headers.join(','),
        ...assets.map(asset => [
            asset.id,
            asset.type,
            `"${asset.description.replace(/"/g, '""')}"`,
            asset.serialNumber || '',
            asset.status,
            asset.condition,
            asset.assignedTo || '',
            asset.dateAssigned || '',
            asset.purchaseValue || '0',
            asset.purchaseDate || ''
        ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Exported ${assets.length} assets to CSV file`);
}

function clearAllAssets() {
    if (confirm('Are you sure you want to clear ALL assets? This will delete all asset records and cannot be undone.')) {
        localStorage.removeItem('bmas_assets');
        loadAssetData();
        alert('All assets have been cleared');
    }
}

    // ===== FEATURE 4: CONTRACTS TRACKER =====
    function showContractsTracker() {
        const mainContent = document.querySelector('main');
        
        // Hide other views
        document.querySelectorAll('main > div[id$="View"]').forEach(view => {
            if (view.id !== 'contractsTrackerView') {
                view.classList.add('hidden');
            }
        });
        
        // Hide dashboard if it's showing
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        
        // Create contracts tracker view
        let contractView = document.getElementById('contractsTrackerView');
        if (!contractView) {
            contractView = document.createElement('div');
            contractView.id = 'contractsTrackerView';
            contractView.className = 'p-6';
            contractView.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">Contracts Tracker</h1>
                        <p class="text-sm text-gray-600">Monitor employee contract end dates</p>
                    </div>
                    <div class="flex space-x-3">
                        <select id="contractFilter" onchange="filterContracts()" class="form-input">
                            <option value="all">All Contracts</option>
                            <option value="expiring">Expiring Soon (30 days)</option>
                            <option value="expired">Expired</option>
                            <option value="active">Active</option>
                        </select>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <table class="employee-table">
                        <thead>
                            <tr>
                                <th>Employee</th><th>Position</th><th>Start Date</th>
                                <th>End Date</th><th>Days Remaining</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="contractTableBody"></tbody>
                    </table>
                </div>
            `;
            mainContent.appendChild(contractView);
            
            // Load sample data
            loadContractData();
        }
        
        contractView.classList.remove('hidden');
        updatePageTitle('Contracts Tracker', 'Monitor employee contract end dates');
    }

    function loadContractData() {
        // Sample data
        const sampleContracts = [
            { employee: 'John Mwila', position: 'Software Developer', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active' },
            { employee: 'Sarah Banda', position: 'HR Manager', startDate: '2024-02-01', endDate: '2025-01-31', status: 'Active' },
            { employee: 'Peter Phiri', position: 'Accountant', startDate: '2023-06-01', endDate: '2024-05-31', status: 'Expiring Soon' },
            { employee: 'Mary Tembo', position: 'Sales Executive', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Expired' }
        ];
        
        // Initialize contracts if not exists
        if (contracts.length === 0) {
            contracts = sampleContracts;
            localStorage.setItem('bmas_contracts', JSON.stringify(contracts));
        }
        
        filterContracts();
    }

    function filterContracts() {
        const filter = document.getElementById('contractFilter')?.value || 'all';
        const today = new Date();
        
        let filteredContracts = contracts;
        
        if (filter === 'expiring') {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            
            filteredContracts = contracts.filter(contract => {
                const endDate = new Date(contract.endDate);
                return endDate > today && endDate <= thirtyDaysFromNow;
            });
        } else if (filter === 'expired') {
            filteredContracts = contracts.filter(contract => {
                const endDate = new Date(contract.endDate);
                return endDate < today;
            });
        } else if (filter === 'active') {
            filteredContracts = contracts.filter(contract => {
                const endDate = new Date(contract.endDate);
                return endDate >= today;
            });
        }
        
        const tableBody = document.getElementById('contractTableBody');
        if (tableBody) {
            tableBody.innerHTML = filteredContracts.map(contract => {
                const endDate = new Date(contract.endDate);
                const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                const status = daysRemaining < 0 ? 'Expired' : daysRemaining <= 30 ? 'Expiring Soon' : 'Active';
                const statusClass = status === 'Expired' ? 'bg-red-100 text-red-800' : 
                                  status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-green-100 text-green-800';
                
                return `
                    <tr>
                        <td>${contract.employee}</td><td>${contract.position}</td><td>${contract.startDate}</td>
                        <td>${contract.endDate}</td><td>${daysRemaining > 0 ? daysRemaining : 'Expired'}</td>
                        <td><span class="px-2 py-1 rounded-full text-xs ${statusClass}">${status}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }

    // ===== FEATURE 5: EMPLOYEE DOCUMENTS =====
    function showDocumentsSection() {
        const mainContent = document.querySelector('main');
        
        // Hide other views
        document.querySelectorAll('main > div[id$="View"]').forEach(view => {
            if (view.id !== 'documentsView') {
                view.classList.add('hidden');
            }
        });
        
        // Hide dashboard if it's showing
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardView.classList.add('hidden');
        }
        
        // Create documents view
        let docsView = document.getElementById('documentsView');
        if (!docsView) {
            docsView = document.createElement('div');
            docsView.id = 'documentsView';
            docsView.className = 'p-6';
            docsView.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">Employee Documents</h1>
                        <p class="text-sm text-gray-600">Document management system</p>
                    </div>
                    <div class="flex space-x-3">
                        <input type="file" id="documentUpload" accept=".pdf,.doc,.docx" class="hidden" onchange="handleDocumentUpload(this.files[0])">
                        <button onclick="document.getElementById('documentUpload').click()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
                            <i class="fas fa-upload mr-2"></i>Upload Document
                        </button>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-folder-open text-4xl mb-3"></i>
                        <p>Document storage area</p>
                        <p class="text-sm mt-2">In a full implementation, this would connect to Google Drive</p>
                        <p class="text-sm">For now, use your organization's shared drive for sensitive documents</p>
                    </div>
                </div>
            `;
            mainContent.appendChild(docsView);
        }
        
        docsView.classList.remove('hidden');
        updatePageTitle('Employee Documents', 'Document management system');
    }

    function handleDocumentUpload(file) {
        if (file) {
            alert(`Document "${file.name}" would be saved to Google Drive in a full implementation.`);
        }
    }

    // ===== HELPER FUNCTIONS =====
    function updatePageTitle(title, subtitle) {
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        
        if (pageTitle) pageTitle.textContent = title;
        if (pageSubtitle) pageSubtitle.textContent = subtitle;
    }
    // ===== NEW HELPER FUNCTIONS FOR LEAVE MANAGEMENT =====

function populateEmployeeDropdown() {
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    const select = document.getElementById('leaveEmployee');
    
    if (select) {
        // Clear existing options
        select.innerHTML = '';
        
        // Add options from employees
        if (employees.length > 0) {
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.id;
                option.textContent = emp.name;
                select.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.textContent = 'No employees found - Add employees first';
            option.disabled = true;
            select.appendChild(option);
        }
    }
}

function updateLeaveBalanceDisplay() {
    const employeeSelect = document.getElementById('leaveEmployee');
    const leaveTypeSelect = document.getElementById('leaveType');
    const balanceDisplay = document.getElementById('leaveBalanceDisplay');
    
    if (!employeeSelect || !leaveTypeSelect || !balanceDisplay) return;
    
    const employeeId = employeeSelect.value;
    const leaveType = leaveTypeSelect.value;
    
    if (!employeeId || !leaveType) {
        balanceDisplay.innerHTML = 'Select employee and leave type';
        return;
    }
    
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
        balanceDisplay.innerHTML = 'Employee not found';
        return;
    }
    
    // Initialize if needed
    if (!employee.entitlements) {
        employee.entitlements = calculateEmployeeEntitlements(employee.contractMonths || 12);
    }
    if (!employee.used) {
        employee.used = { Annual: 0, Sick: 0, Maternity: 0, Paternity: 0, Unpaid: 0 };
    }
    
    const entitlement = employee.entitlements[leaveType] || 0;
    const used = employee.used[leaveType] || 0;
    const available = entitlement - used;
    
    balanceDisplay.innerHTML = `
        <div class="text-lg">${available} days available</div>
        <div class="text-sm text-gray-600">
            (${entitlement} total - ${used} used)
        </div>
    `;
    
    // Highlight if insufficient balance
    const daysCountElement = document.getElementById('leaveDaysCount');
    const daysRequested = parseInt(daysCountElement?.textContent || 0);
    
    if (daysRequested > available && available >= 0) {
        balanceDisplay.innerHTML += `
            <div class="text-sm text-red-600 mt-1">
                <i class="fas fa-exclamation-triangle"></i> 
                Insufficient balance for ${daysRequested} days
            </div>
        `;
    }
}

function calculateLeaveDays() {
    const startInput = document.getElementById('leaveStart');
    const endInput = document.getElementById('leaveEnd');
    const daysCountElement = document.getElementById('leaveDaysCount');
    
    if (!startInput || !endInput || !daysCountElement) return;
    
    const startDate = startInput.valueAsDate;
    const endDate = endInput.valueAsDate;
    
    if (!startDate || !endDate) {
        daysCountElement.textContent = 'Select dates';
        return;
    }
    
    if (startDate > endDate) {
        daysCountElement.textContent = 'Invalid dates';
        daysCountElement.className = 'font-bold text-red-600';
        return;
    }
    
    // Calculate days difference
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayCount = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
    
    daysCountElement.textContent = dayCount;
    daysCountElement.className = 'font-bold text-blue-600';
    
    updateLeaveBalanceDisplay();
}

function updateLeaveCalculations() {
    const contractMonths = parseInt(document.getElementById('empContractMonths')?.value) || 12;
    const entitlements = calculateEmployeeEntitlements(contractMonths);
    
    // Update the display
    document.getElementById('annualCalc').textContent = `${entitlements.Annual} days`;
    document.getElementById('sickCalc').textContent = `${entitlements.Sick} days`;
    document.getElementById('maternityCalc').textContent = `${entitlements.Maternity} days`;
    document.getElementById('paternityCalc').textContent = `${entitlements.Paternity} days`;
}

    // ===== INITIALIZE =====
    function initializeFeatures() {
        console.log('Initializing all features...');
        
        // Enhance login system
        if (!enhanceLoginSystem()) {
            console.warn('Failed to enhance login, retrying...');
            setTimeout(enhanceLoginSystem, 1000);
        }
        
        // Wait for app to load and add all nav items
        const checkAppLoaded = setInterval(() => {
            const mainApp = document.getElementById('mainApp');
            if (mainApp && !mainApp.classList.contains('hidden')) {
                clearInterval(checkAppLoaded);
                setTimeout(addAllNavigationItems, 800);
            }
        }, 300);
    }

    // ===== START INITIALIZATION =====
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFeatures);
    } else {
        // DOM already loaded
        setTimeout(initializeFeatures, 500);
    }
}
// ===== DASHBOARD INITIALIZATION =====

// Function to initialize dashboard
function initDashboard() {
    console.log('Dashboard initialized');
    updateDashboardStats();
    
    // Auto-refresh every 30 seconds
    setInterval(updateDashboardStats, 30000);
}

// Make it globally available
window.initDashboard = initDashboard;

// Call it when features.js loads (since it loads last)
console.log('Features.js loaded, initializing dashboard...');

// Small delay to ensure DOM is ready
setTimeout(function() {
    // Check if dashboard is visible
    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView && !dashboardView.classList.contains('hidden')) {
        initDashboard();
    }
}, 500);