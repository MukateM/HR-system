// Client data with branding information
const clients = {
    client1: {
        name: "Zambia Tech Solutions",
        color: "#2563eb",
        user: "tech_admin",
        employerNapsa: "NP123456",
        employerNhima: "NH789012",
        stats: {
            employees: 47,
            payroll: "ZMW 324,500",
            requests: 3
        }
    },
    client2: {
        name: "Copperbelt Manufacturing",
        color: "#059669", 
        user: "mfg_admin",
        employerNapsa: "NP234567",
        employerNhima: "NH890123",
        stats: {
            employees: 128,
            payroll: "ZMW 892,750",
            requests: 7
        }
    },
    client3: {
        name: "Lusaka Retail Group",
        color: "#7c3aed",
        user: "retail_admin", 
        employerNapsa: "NP345678",
        employerNhima: "NH901234",
        stats: {
            employees: 84,
            payroll: "ZMW 521,300",
            requests: 2
        }
    },
    bmas: {
        name: "BMAS Admin Portal",
        color: "#dc2626",
        user: "bmas_admin",
        employerNapsa: "NPBMAS01",
        employerNhima: "NHBMAS01",
        stats: {
            employees: 0,
            payroll: "ZMW 0",
            requests: 12
        }
    }
};

// ===== LOGIN/LOGOUT FUNCTIONALITY =====
function handleLogin() {
    const selectedClient = document.getElementById('clientSelect').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!selectedClient) {
        alert('Please select a client');
        return;
    }
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    // Get client data - THIS MUST BE FIRST
    const client = clients[selectedClient];
    
    if (!client) {
        alert('Client configuration error');
        return;
    }
    
    // NOW we can use client
    console.log(`Welcome to ${client.name} HR System! Data is stored locally on this computer.`);
    
    // Apply client branding
    document.documentElement.style.setProperty('--primary-color', client.color);
    document.getElementById('clientName').textContent = client.name;
    
    // Set sidebar background color based on client
    const sidebarHeader = document.querySelector('.p-4.border-b.border-gray-200');
    if (sidebarHeader) {
        sidebarHeader.style.background = `linear-gradient(to right, ${client.color}, ${darkenColor(client.color, 20)})`;
    }
    
    // Set user info - FIXED: Use existing element IDs
    document.getElementById('userName').textContent = username;
    
    // Use userRoleDisplay instead of userRole
    const userRoleElement = document.getElementById('userRoleDisplay');
    if (userRoleElement) {
        userRoleElement.textContent = selectedClient === 'bmas' ? 'BMAS Administrator' : 'HR Manager';
    }
    
    document.getElementById('userInitials').textContent = username.substring(0, 2).toUpperCase();
    
    // Set stats
    document.getElementById('totalEmployees').textContent = client.stats.employees;
    document.getElementById('monthlyPayroll').textContent = client.stats.payroll;
    document.getElementById('pendingRequests').textContent = client.stats.requests;
    
    // Switch to main app
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Initialize navigation after login
    setupNavigation();
    updateDashboardStats();
}

function handleLogout() {
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('clientSelect').selectedIndex = 0;
}

// ===== EMPLOYEE MANAGEMENT FUNCTIONALITY =====
let employees = [];
let editingEmployeeId = null;

// ===== NAVIGATION FUNCTIONALITY =====
function setupNavigation() {
    console.log('Setting up navigation...');
    
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found nav items:', navItems.length);
    
    navItems.forEach(item => {
        // Remove any existing event listeners
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Add new event listener
        newItem.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.textContent);
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active-nav');
                nav.classList.add('inactive-nav');
            });
            
            // Add active class to clicked item
            this.classList.remove('inactive-nav');
            this.classList.add('active-nav');
            
            // Handle navigation
            handleNavigation(this.textContent.trim());
        });
    });
    
    // Set initial active state
    const dashboardNav = document.querySelector('.nav-item');
    if (dashboardNav) {
        dashboardNav.classList.add('active-nav');
        dashboardNav.classList.remove('inactive-nav');
    }
}

function handleNavigation(navText) {
    console.log('Handling navigation for:', navText);
    
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const dashboardView = document.getElementById('dashboardView');
    const employeeView = document.getElementById('employeeManagementView');
    const payrollView = document.getElementById('payrollView');
    
    // Hide all views first
    dashboardView.classList.add('hidden');
    employeeView.classList.add('hidden');
    payrollView.classList.add('hidden');
    
    if (navText.includes('Employee Management')) {
        pageTitle.textContent = 'Employee Management';
        pageSubtitle.textContent = 'Manage your workforce';
        employeeView.classList.remove('hidden');
        loadEmployees();
    } else if (navText.includes('Payroll Calculator')) {
        pageTitle.textContent = 'Payroll Calculator';
        pageSubtitle.textContent = 'Calculate salaries and deductions';
        payrollView.classList.remove('hidden');
        calculatePayroll();
    } else {
        // Default to Dashboard
        pageTitle.textContent = 'Dashboard';
        pageSubtitle.textContent = 'Welcome to your HR portal';
        dashboardView.classList.remove('hidden');
        updateDashboardStats();
    }
}

// Load employees function
function loadEmployees() {
    const savedEmployees = localStorage.getItem('bmas_employees');
    employees = savedEmployees ? JSON.parse(savedEmployees) : [
        { 
            id: 'EMP001', 
            name: 'John Mwila', 
            nrc: '123456/78/9', 
            ssn: 'SSN001',
            dob: '1985-05-15',
            nhima: 'NHIMA001',
            position: 'Software Developer', 
            salary: 15000,
            allowances: 2000,
            bank: 'ZANACO, 123456789, Main Branch',
            deductions: 0
        }
    ];
    
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = '';
    
    employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-medium">${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.nrc}</td>
            <td>${emp.ssn || ''}</td>
            <td>${emp.position}</td>
            <td>ZMW ${(emp.salary + emp.allowances).toLocaleString()}</td>
            <td>
                <button onclick="editEmployee('${emp.id}')" class="text-blue-600 hover:text-blue-800 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteEmployee('${emp.id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    updateDashboardStats();
}

// Update dashboard stats
function updateDashboardStats() {
    // Total Employees
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    document.getElementById('totalEmployees').textContent = employees.length;
    
    // Monthly Payroll (sum of all employee salaries)
    const totalSalary = employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
    document.getElementById('monthlyPayroll').textContent = `ZMW ${totalSalary.toLocaleString()}`;
    
    // Pending Leave Requests
    const leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    const pendingLeaves = leaveRecords.filter(record => record.status === 'pending').length;
    
    // Assets due for maintenance
    const assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    const assetsNeedingMaintenance = assets.filter(asset => 
        asset.condition === 'Poor' || asset.condition === 'Fair'
    ).length;
    
    // Total pending requests (leaves + maintenance)
    const totalPending = pendingLeaves + assetsNeedingMaintenance;
    document.getElementById('pendingRequests').textContent = totalPending;
    
    // Update recent activity with REAL data
    function updateRecentActivity() {
    const activityContainer = document.querySelector('#dashboardView .space-y-4');
    if (!activityContainer) return;
    
    const activities = [];
    
    // Get employees (recently added)
    const employees = JSON.parse(localStorage.getItem('bmas_employees')) || [];
    if (employees.length > 0) {
        const latestEmployee = employees[employees.length - 1];
        const timeAgo = getTimeAgo(latestEmployee.dateAdded);
        activities.push({
            icon: 'fa-user-plus',
            color: 'blue',
            title: 'New employee added',
            description: `${latestEmployee.name} was added to the system`,
            time: timeAgo
        });
    }
    
    // Get recent leave requests
    const leaveRecords = JSON.parse(localStorage.getItem('bmas_leave_records')) || [];
    if (leaveRecords.length > 0) {
        const recentLeave = leaveRecords[leaveRecords.length - 1];
        const timeAgo = getTimeAgo(recentLeave.dateAdded);
        activities.push({
            icon: 'fa-calendar-alt',
            color: 'green',
            title: 'Leave request submitted',
            description: `${recentLeave.employee} applied for ${recentLeave.type} leave`,
            time: timeAgo
        });
    }
    
    // Get assets recently assigned
    const assets = JSON.parse(localStorage.getItem('bmas_assets')) || [];
    const recentlyAssigned = assets.filter(a => a.dateAssigned)
        .sort((a, b) => new Date(b.dateAssigned) - new Date(a.dateAssigned))[0];
    
    if (recentlyAssigned) {
        const timeAgo = getTimeAgo(recentlyAssigned.dateAssigned);
        activities.push({
            icon: 'fa-laptop',
            color: 'purple',
            title: 'Asset assigned',
            description: `${recentlyAssigned.id} assigned to ${recentlyAssigned.assignedTo}`,
            time: timeAgo
        });
    }
    
    // Get contracts expiring soon
    const contracts = JSON.parse(localStorage.getItem('bmas_contracts')) || [];
    const today = new Date();
    const expiringSoon = contracts.filter(contract => {
        const endDate = new Date(contract.endDate);
        const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        return daysRemaining > 0 && daysRemaining <= 30;
    });
    
    if (expiringSoon.length > 0) {
        activities.push({
            icon: 'fa-exclamation-triangle',
            color: 'yellow',
            title: 'Contracts expiring',
            description: `${expiringSoon.length} employee contracts expiring soon`,
            time: 'This month'
        });
    }
    
    // If no activities, show placeholder
    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-history text-3xl mb-2"></i>
                <p>No recent activity</p>
                <p class="text-sm mt-2">Activities will appear here as you use the system</p>
            </div>
        `;
        return;
    }
    
    // Display activities (show last 3)
    const recentActivities = activities.slice(-3);
    activityContainer.innerHTML = recentActivities.map(activity => `
        <div class="flex items-start">
            <div class="p-2 rounded-lg bg-${activity.color}-100 text-${activity.color}-600 mr-3 mt-1">
                <i class="fas ${activity.icon} text-sm"></i>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-800">${activity.title}</p>
                <p class="text-xs text-gray-500">${activity.description}</p>
                <p class="text-xs text-gray-400">${activity.time}</p>
            </div>
        </div>
    `).join('');
}
 // Employees currently on leave
    const today = new Date().toISOString().split('T')[0];
    const onLeave = leaveRecords.filter(record => {
        return today >= record.startDate && today <= record.endDate && record.status !== 'cancelled';
    }).length;
    document.getElementById('onLeaveCount').textContent = onLeave;
    
    // Assets needing attention
    const assetsNeedingAttention = assets.filter(asset => 
        asset.condition === 'Poor' || asset.status === 'Under Repair'
    ).length;
    document.getElementById('assetsNeedingAttention').textContent = assetsNeedingAttention;
    
    // Contracts expiring soon (within 30 days)
    const contracts = JSON.parse(localStorage.getItem('bmas_contracts')) || [];
    const contractsExpiring = contracts.filter(contract => {
        const endDate = new Date(contract.endDate);
        const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
        return daysRemaining > 0 && daysRemaining <= 30;
    }).length;
    document.getElementById('contractsExpiring').textContent = contractsExpiring;

function getTimeAgo(dateString) {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}
    
    // Update quick actions to be functional
    function updateQuickActions() {
    const quickActionsContainer = document.querySelector('#dashboardView .grid.grid-cols-2.gap-4');
    if (!quickActionsContainer) return;
    
    quickActionsContainer.innerHTML = `
        <button onclick="document.getElementById('addEmployeeBtn').click()" class="p-4 border border-gray-200 rounded-lg text-center hover:bg-blue-50 hover:border-blue-300 transition duration-150 cursor-pointer">
            <div class="p-3 rounded-lg bg-blue-100 text-blue-600 inline-block mb-2">
                <i class="fas fa-user-plus"></i>
            </div>
            <p class="text-sm font-medium text-gray-800">Add Employee</p>
        </button>
        
        <button onclick="showLeaveManagement()" class="p-4 border border-gray-200 rounded-lg text-center hover:bg-green-50 hover:border-green-300 transition duration-150 cursor-pointer">
            <div class="p-3 rounded-lg bg-green-100 text-green-600 inline-block mb-2">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <p class="text-sm font-medium text-gray-800">Manage Leave</p>
        </button>
        
        <button onclick="addAsset()" class="p-4 border border-gray-200 rounded-lg text-center hover:bg-purple-50 hover:border-purple-300 transition duration-150 cursor-pointer">
            <div class="p-3 rounded-lg bg-purple-100 text-purple-600 inline-block mb-2">
                <i class="fas fa-laptop"></i>
            </div>
            <p class="text-sm font-medium text-gray-800">Add Asset</p>
        </button>
        
        <button onclick="showUserManagement()" class="p-4 border border-gray-200 rounded-lg text-center hover:bg-red-50 hover:border-red-300 transition duration-150 cursor-pointer">
            <div class="p-3 rounded-lg bg-red-100 text-red-600 inline-block mb-2">
                <i class="fas fa-user-shield"></i>
            </div>
            <p class="text-sm font-medium text-gray-800">User Management</p>
        </button>
    `;
}
}

// Close employee form
function closeEmployeeForm() {
    document.getElementById('addEmployeeForm').classList.add('hidden');
    editingEmployeeId = null;
}

// Edit employee
function editEmployee(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        editingEmployeeId = employeeId;
        
        // Fill form with employee data
        document.getElementById('empId').value = employee.id;
        document.getElementById('empName').value = employee.name;
        document.getElementById('empNrc').value = employee.nrc;
        document.getElementById('empSsn').value = employee.ssn || '';
        document.getElementById('empDob').value = employee.dob;
        document.getElementById('empNhima').value = employee.nhima;
        document.getElementById('empPosition').value = employee.position;
        document.getElementById('empSalary').value = employee.salary;
        document.getElementById('empAllowances').value = employee.allowances;
        document.getElementById('empBank').value = employee.bank || '';
        document.getElementById('empDeductions').value = employee.deductions || 0;
        
        document.getElementById('addEmployeeForm').classList.remove('hidden');
        document.getElementById('formTitle').textContent = 'Edit Employee';
    }
}

// Save employee
function saveEmployee(event) {
    event.preventDefault();
    
    const employeeData = {
        id: document.getElementById('empId').value,
        name: document.getElementById('empName').value,
        nrc: document.getElementById('empNrc').value,
        ssn: document.getElementById('empSsn').value,
        dob: document.getElementById('empDob').value,
        nhima: document.getElementById('empNhima').value,
        position: document.getElementById('empPosition').value,
        salary: parseFloat(document.getElementById('empSalary').value),
        allowances: parseFloat(document.getElementById('empAllowances').value) || 0,
        bank: document.getElementById('empBank').value,
        deductions: parseFloat(document.getElementById('empDeductions').value) || 0
    };
    
    if (editingEmployeeId) {
        // Update existing employee
        const index = employees.findIndex(emp => emp.id === editingEmployeeId);
        if (index !== -1) {
            employees[index] = employeeData;
        }
    } else {
        // Add new employee
        employees.push(employeeData);
    }
    
    // Save to localStorage
    localStorage.setItem('bmas_employees', JSON.stringify(employees));
    
    // Refresh the table
    loadEmployees();
    closeEmployeeForm();
    
    alert(`Employee ${editingEmployeeId ? 'updated' : 'added'} successfully!`);
}

// Delete employee
function deleteEmployee(employeeId) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== employeeId);
        localStorage.setItem('bmas_employees', JSON.stringify(employees));
        loadEmployees();
        alert('Employee deleted successfully!');
    }
}

// ===== NAPSA EXPORT =====
function exportNAPSA() {
    if (employees.length === 0) {
        alert('No employees found. Please add employees first.');
        return;
    }

    const currentClient = document.getElementById('clientName').textContent;
    const client = Object.values(clients).find(c => c.name === currentClient);
    const employerNapsa = client ? client.employerNapsa : "NPUNKNOWN";
    
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    
    let napsaCSV = "Employer Number,Year,Month,SSN,National ID/Passport,Surname,First Name,Other Name,Date of Birth,Gross Pay,Employee Share (5%),Employer Share (5%)\n";
    
    employees.forEach(emp => {
        const grossSalary = emp.salary + emp.allowances;
        const employeeShare = grossSalary * 0.05;
        const employerShare = grossSalary * 0.05;
        
        const names = emp.name.split(' ');
        const surname = names[names.length - 1] || '';
        const firstName = names[0] || '';
        const otherName = names.slice(1, -1).join(' ') || '';
        
        napsaCSV += `${employerNapsa},${year},${month},${emp.ssn || ''},${emp.nrc},"${surname}","${firstName}","${otherName}",${emp.dob},${grossSalary},${employeeShare.toFixed(2)},${employerShare.toFixed(2)}\n`;
    });
    
    downloadCSV(napsaCSV, `NAPSA_${employerNapsa}_${year}_${month}.csv`);
    alert(`NAPSA export generated for ${employees.length} employees!\nEmployer: ${employerNapsa}`);
}

// ===== NHIMA EXPORT =====
function exportNHIMA() {
    if (employees.length === 0) {
        alert('No employees found. Please add employees first.');
        return;
    }

    const currentClient = document.getElementById('clientName').textContent;
    const client = Object.values(clients).find(c => c.name === currentClient);
    const employerNhima = client ? client.employerNhima : "NHUNKNOWN";
    
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    
    let nhimaCSV = "Employer Account Number,Year,Month(Period),NHIMA Member Identification Number,National ID / Passport Number,Surname,First Name,Other Name,Date of Birth,Basic Pay,Employer Share,Employee Share\n";
    
    employees.forEach(emp => {
        const employeeShare = emp.salary * 0.01;
        const employerShare = emp.salary * 0.01;
        
        const names = emp.name.split(' ');
        const surname = names[names.length - 1] || '';
        const firstName = names[0] || '';
        const otherName = names.slice(1, -1).join(' ') || '';
        
        nhimaCSV += `${employerNhima},${year},${month},${emp.nhima || 'PENDING'},${emp.nrc},"${surname}","${firstName}","${otherName}",${emp.dob},${emp.salary},${employerShare.toFixed(2)},${employeeShare.toFixed(2)}\n`;
    });
    
    downloadCSV(nhimaCSV, `NHIMA_${employerNhima}_${year}_${month}.csv`);
    alert(`NHIMA export generated for ${employees.length} employees!\nEmployer: ${employerNhima}`);
}

// ===== HELPER FUNCTION =====
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
// Helper function to darken colors
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// ===== PAYROLL CALCULATOR =====
function calculatePAYE(grossSalary) {
    if (grossSalary <= 5100) {
        return 0;
    } else if (grossSalary <= 7100) {
        return (grossSalary - 5100) * 0.20;
    } else if (grossSalary <= 9200) {
        return (2000 * 0.20) + ((grossSalary - 7100) * 0.30);
    } else {
        return (2000 * 0.20) + (2100 * 0.30) + ((grossSalary - 9200) * 0.375);
    }
}

function calculatePayroll() {
    const payrollResultsBody = document.getElementById('payrollResultsBody');
    payrollResultsBody.innerHTML = '';
    
    let totalGross = 0;
    let totalNapsa = 0;
    let totalPaye = 0;
    let totalNhima = 0;
    let totalNet = 0;
    
    employees.forEach(emp => {
        const housingAllowance = emp.allowances * 0.3;
        const transportAllowance = emp.allowances * 0.2;
        
        const grossSalary = emp.salary + emp.allowances;
        const napsa = grossSalary * 0.05;
        const paye = calculatePAYE(grossSalary);
        const nhima = emp.salary * 0.01;
        const netSalary = grossSalary - napsa - paye - nhima - (emp.deductions || 0);
        
        totalGross += grossSalary;
        totalNapsa += napsa;
        totalPaye += paye;
        totalNhima += nhima;
        totalNet += netSalary;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>ZMW ${grossSalary.toLocaleString()}</td>
            <td>ZMW ${emp.salary.toLocaleString()}</td>
            <td>ZMW ${housingAllowance.toLocaleString()}</td>
            <td>ZMW ${transportAllowance.toLocaleString()}</td>
            <td class="text-red-600">ZMW ${napsa.toFixed(2)}</td>
            <td class="text-red-600">ZMW ${paye.toFixed(2)}</td>
            <td class="text-red-600">ZMW ${nhima.toFixed(2)}</td>
            <td class="text-red-600">ZMW ${(emp.deductions || 0).toFixed(2)}</td>
            <td class="text-green-600 font-semibold">ZMW ${netSalary.toFixed(2)}</td>
        `;
        payrollResultsBody.appendChild(row);
    });
    
    document.getElementById('totalGross').textContent = `ZMW ${totalGross.toLocaleString()}`;
    document.getElementById('totalNapsa').textContent = `ZMW ${totalNapsa.toFixed(2)}`;
    document.getElementById('totalPaye').textContent = `ZMW ${totalPaye.toFixed(2)}`;
    document.getElementById('totalNhima').textContent = `ZMW ${totalNhima.toFixed(2)}`;
    document.getElementById('totalNet').textContent = `ZMW ${totalNet.toFixed(2)}`;
}

function exportPayroll() {
    const month = document.getElementById('payrollMonth').value;
    const year = document.getElementById('payrollYear').value;
    
    let csvContent = "NAME,Position,NRC No,DATE OF BIRTH,GROSS SALARY,BASIC PAY,HOUSING ALOWANCE,TRANSPORT ALLOWANCE,ALLOWANCE,CHARGEABLE INCOME,OTHER DEDUCTIONS,ADVANCE PAY,NAPSA,PAYE,NHIMA,NET SALARY\n";
    
    employees.forEach(emp => {
        const housingAllowance = emp.allowances * 0.3;
        const transportAllowance = emp.allowances * 0.2;
        const otherAllowance = emp.allowances * 0.5;
        
        const grossSalary = emp.salary + emp.allowances;
        const napsa = grossSalary * 0.05;
        const paye = calculatePAYE(grossSalary);
        const nhima = emp.salary * 0.01;
        const netSalary = grossSalary - napsa - paye - nhima - (emp.deductions || 0);
        
        csvContent += `"${emp.name}",${emp.position},${emp.nrc},${emp.dob},${grossSalary},${emp.salary},${housingAllowance},${transportAllowance},${otherAllowance},0,${emp.deductions || 0},0,${napsa},${paye},${nhima},${netSalary}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PAYROLL_${getMonthName(month)}_${year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert(`Payroll exported for ${getMonthName(month)} ${year}!`);
}

function getMonthName(monthNumber) {
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                   'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return months[monthNumber - 1];
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    
    // Set current date for payroll
    const now = new Date();
    document.getElementById('payrollYear').value = now.getFullYear();
    document.getElementById('payrollMonth').value = now.getMonth() + 1;
    document.getElementById('payrollDate').valueAsDate = now;
    
    // Add event listener to Add Employee button
    document.getElementById('addEmployeeBtn').addEventListener('click', function() {
        editingEmployeeId = null;
        document.getElementById('employeeForm').reset();
        document.getElementById('addEmployeeForm').classList.remove('hidden');
        document.getElementById('formTitle').textContent = 'Add New Employee';
    });
    
    // Setup payroll buttons
    document.getElementById('calculatePayrollBtn').addEventListener('click', calculatePayroll);
    document.getElementById('exportPayrollBtn').addEventListener('click', exportPayroll);
    
    console.log('App initialized successfully');
});