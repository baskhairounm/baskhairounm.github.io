class BudgetTracker {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentMonth = new Date();
        this.transactions = this.loadFromStorage('transactions') || [];
        this.budgets = this.loadFromStorage('budgets') || {};
        this.accounts = this.loadFromStorage('accounts') || [];
        this.categorizationRules = this.loadFromStorage('categorizationRules') || [];
        this.categories = {
            expense: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'],
            income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Other Income']
        };
        
        this.trendChart = null;
        this.categoryChart = null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.setupModals();
        this.initializeDefaultAccount();
        this.updateCurrentMonth();
        this.showPage('dashboard');
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        
        // Show selected page
        document.getElementById(`${page}-page`).classList.remove('hidden');
        
        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
        
        this.currentPage = page;
        
        // Load page content
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'transactions':
                this.loadTransactions();
                break;
            case 'budgets':
                this.loadBudgets();
                break;
            case 'accounts':
                this.loadAccounts();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.updateCurrentMonth();
            this.loadDashboard();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.updateCurrentMonth();
            this.loadDashboard();
        });

        // Budget month navigation
        document.getElementById('budgetPrevMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.updateBudgetMonth();
            this.loadBudgets();
        });

        document.getElementById('budgetNextMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.updateBudgetMonth();
            this.loadBudgets();
        });

        // Transaction filters
        document.getElementById('searchTransactions').addEventListener('input', () => this.filterTransactions());
        document.getElementById('filterCategory').addEventListener('change', () => this.filterTransactions());
        document.getElementById('filterAccount').addEventListener('change', () => this.filterTransactions());
        document.getElementById('dateFrom').addEventListener('change', () => this.filterTransactions());
        document.getElementById('dateTo').addEventListener('change', () => this.filterTransactions());

        // Add buttons
        document.getElementById('addTransactionBtn').addEventListener('click', () => this.showTransactionModal());
        document.getElementById('addAccountBtn').addEventListener('click', () => this.showAccountModal());
        document.getElementById('addRuleBtn').addEventListener('click', () => this.showRuleModal());

        // Settings buttons
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e.target.files[0]));
        document.getElementById('sampleDataBtn').addEventListener('click', () => this.loadSampleData());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAllData());
    }

    // Modal Setup
    setupModals() {
        // Transaction Modal
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        document.getElementById('cancelTransaction').addEventListener('click', () => {
            this.hideModal('transactionModal');
        });

        // Account Modal
        document.getElementById('accountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAccount();
        });

        document.getElementById('cancelAccount').addEventListener('click', () => {
            this.hideModal('accountModal');
        });

        // Rule Modal
        document.getElementById('ruleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRule();
        });

        document.getElementById('cancelRule').addEventListener('click', () => {
            this.hideModal('ruleModal');
        });

        // Close modals on click outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });
    }

    // Dashboard
    loadDashboard() {
        const monthTransactions = this.getTransactionsForMonth(this.currentMonth);
        const monthBudgets = this.getBudgetsForMonth(this.currentMonth);
        
        const totalIncome = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalBudget = Object.values(monthBudgets).reduce((sum, budget) => sum + budget, 0);
        const netBalance = totalIncome - totalExpenses;
        const budgetProgress = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

        // Update summary cards
        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('netBalance').textContent = this.formatCurrency(netBalance);
        document.getElementById('netBalance').className = `amount ${netBalance >= 0 ? 'income' : 'spent'}`;
        
        // Update budget progress
        const progressFill = document.getElementById('budgetProgress');
        const progressPercentage = document.getElementById('budgetPercentage');
        progressFill.style.width = `${Math.min(budgetProgress, 100)}%`;
        progressFill.className = `progress-fill ${budgetProgress > 100 ? 'over-budget' : ''}`;
        progressPercentage.textContent = `${Math.round(budgetProgress)}%`;

        this.createTrendChart();
        this.createCategoryChart();
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        if (this.trendChart) {
            this.trendChart.destroy();
        }

        // Get last 12 months of data
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date(this.currentMonth);
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleDateString('en-CA', { month: 'short', year: 'numeric' }));
            
            const monthTransactions = this.getTransactionsForMonth(date);
            const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            
            incomeData.push(income);
            expenseData.push(expenses);
        }

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => this.formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`
                        }
                    }
                }
            }
        });
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        const monthTransactions = this.getTransactionsForMonth(this.currentMonth);
        const expensesByCategory = {};
        
        monthTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });

        const categories = Object.keys(expensesByCategory);
        const amounts = Object.values(expensesByCategory);

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const total = amounts.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(context.parsed)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Transactions
    loadTransactions() {
        this.populateFilterDropdowns();
        this.renderTransactionsTable();
    }

    populateFilterDropdowns() {
        const categoryFilter = document.getElementById('filterCategory');
        const accountFilter = document.getElementById('filterAccount');

        // Clear existing options
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        accountFilter.innerHTML = '<option value="">All Accounts</option>';

        // Add categories
        [...this.categories.expense, ...this.categories.income]
            .forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            });

        // Add accounts
        this.accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.name;
            option.textContent = account.name;
            accountFilter.appendChild(option);
        });
    }

    renderTransactionsTable() {
        const tbody = document.querySelector('#transactionsTable tbody');
        tbody.innerHTML = '';

        const filteredTransactions = this.getFilteredTransactions();

        filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.account}</td>
                    <td class="${transaction.type === 'income' ? 'income' : 'spent'}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    </td>
                    <td>
                        <button class="edit-btn" onclick="budgetTracker.editTransaction(${transaction.id})">Edit</button>
                        <button class="delete-btn" onclick="budgetTracker.deleteTransaction(${transaction.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
    }

    getFilteredTransactions() {
        const search = document.getElementById('searchTransactions').value.toLowerCase();
        const categoryFilter = document.getElementById('filterCategory').value;
        const accountFilter = document.getElementById('filterAccount').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        return this.transactions.filter(transaction => {
            if (search && !transaction.description.toLowerCase().includes(search)) return false;
            if (categoryFilter && transaction.category !== categoryFilter) return false;
            if (accountFilter && transaction.account !== accountFilter) return false;
            if (dateFrom && new Date(transaction.date) < new Date(dateFrom)) return false;
            if (dateTo && new Date(transaction.date) > new Date(dateTo)) return false;
            return true;
        });
    }

    filterTransactions() {
        this.renderTransactionsTable();
    }

    // Budgets
    loadBudgets() {
        this.updateBudgetMonth();
        this.renderBudgetEnvelopes();
    }

    updateBudgetMonth() {
        document.getElementById('budgetCurrentMonth').textContent = 
            this.currentMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
    }

    renderBudgetEnvelopes() {
        const container = document.getElementById('budgetEnvelopes');
        container.innerHTML = '';

        const monthKey = this.getMonthKey(this.currentMonth);
        const monthBudgets = this.budgets[monthKey] || {};
        const monthTransactions = this.getTransactionsForMonth(this.currentMonth);
        
        // Get expense categories that have transactions or budgets
        const expenseCategories = new Set([
            ...this.categories.expense,
            ...Object.keys(monthBudgets),
            ...monthTransactions.filter(t => t.type === 'expense').map(t => t.category)
        ]);

        expenseCategories.forEach(category => {
            const budgetAmount = monthBudgets[category] || 0;
            const spentAmount = monthTransactions
                .filter(t => t.type === 'expense' && t.category === category)
                .reduce((sum, t) => sum + t.amount, 0);
            
            const remaining = budgetAmount - spentAmount;
            const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

            const envelope = document.createElement('div');
            envelope.className = 'envelope';
            envelope.innerHTML = `
                <div class="envelope-header">
                    <span class="envelope-category">${category}</span>
                    <span class="envelope-amount">${this.formatCurrency(budgetAmount)}</span>
                </div>
                <div class="envelope-progress">
                    <div class="progress-bar">
                        <div class="progress-fill ${percentage > 100 ? 'over-budget' : ''}" 
                             style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
                <div class="envelope-stats">
                    <span>Spent: ${this.formatCurrency(spentAmount)}</span>
                    <span class="${remaining >= 0 ? '' : 'over-budget'}">
                        Remaining: ${this.formatCurrency(remaining)}
                    </span>
                </div>
                <input type="number" class="envelope-input" value="${budgetAmount}" 
                       step="0.01" min="0" placeholder="Set budget amount"
                       onchange="budgetTracker.updateBudget('${category}', this.value)">
            `;
            container.appendChild(envelope);
        });
    }

    updateBudget(category, amount) {
        const monthKey = this.getMonthKey(this.currentMonth);
        if (!this.budgets[monthKey]) {
            this.budgets[monthKey] = {};
        }
        this.budgets[monthKey][category] = parseFloat(amount) || 0;
        this.saveToStorage('budgets', this.budgets);
        this.renderBudgetEnvelopes();
        this.showNotification(`Budget updated for ${category}`);
    }

    // Accounts
    loadAccounts() {
        this.renderAccountsGrid();
    }

    renderAccountsGrid() {
        const container = document.getElementById('accountsGrid');
        container.innerHTML = '';

        this.accounts.forEach(account => {
            const balance = this.calculateAccountBalance(account.name);
            
            const card = document.createElement('div');
            card.className = 'account-card';
            card.innerHTML = `
                <div class="account-header">
                    <span class="account-name">${account.name}</span>
                    <span class="account-type">${account.type}</span>
                </div>
                <div class="account-balance ${balance < 0 ? 'negative' : ''}">
                    ${this.formatCurrency(balance)}
                </div>
                <button class="btn-danger" onclick="budgetTracker.deleteAccount('${account.name}')">
                    Delete Account
                </button>
            `;
            container.appendChild(card);
        });
    }

    calculateAccountBalance(accountName) {
        const account = this.accounts.find(a => a.name === accountName);
        if (!account) return 0;

        let balance = account.initialBalance || 0;
        
        this.transactions
            .filter(t => t.account === accountName)
            .forEach(t => {
                if (t.type === 'income') {
                    balance += t.amount;
                } else {
                    balance -= t.amount;
                }
            });

        return balance;
    }

    // Settings
    loadSettings() {
        this.renderRulesList();
        this.populateRuleCategories();
    }

    renderRulesList() {
        const container = document.getElementById('rulesList');
        container.innerHTML = '';

        this.categorizationRules.forEach((rule, index) => {
            const item = document.createElement('div');
            item.className = 'rule-item';
            item.innerHTML = `
                <div class="rule-info">
                    <div class="rule-keyword">"${rule.keyword}"</div>
                    <div class="rule-category">→ ${rule.category}</div>
                </div>
                <button class="delete-btn" onclick="budgetTracker.deleteRule(${index})">Delete</button>
            `;
            container.appendChild(item);
        });
    }

    populateRuleCategories() {
        const select = document.getElementById('ruleCategory');
        select.innerHTML = '<option value="">Select Category</option>';
        
        [...this.categories.expense, ...this.categories.income]
            .forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.appendChild(option);
            });
    }

    // Modal Management
    showTransactionModal(transaction = null) {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        const title = document.getElementById('modalTitle');

        // Populate categories and accounts
        const categorySelect = document.getElementById('transactionCategory');
        const accountSelect = document.getElementById('transactionAccount');

        categorySelect.innerHTML = '<option value="">Select Category</option>';
        accountSelect.innerHTML = '<option value="">Select Account</option>';

        // Add appropriate categories based on type
        const typeSelect = document.getElementById('transactionType');
        const updateCategories = () => {
            const type = typeSelect.value;
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            this.categories[type].forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });
        };

        typeSelect.addEventListener('change', updateCategories);
        updateCategories();

        // Add accounts
        this.accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.name;
            option.textContent = account.name;
            accountSelect.appendChild(option);
        });

        if (transaction) {
            title.textContent = 'Edit Transaction';
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionAccount').value = transaction.account;
            document.getElementById('transactionAmount').value = transaction.amount;
            document.getElementById('transactionDate').value = new Date(transaction.date).toISOString().split('T')[0];
            form.dataset.editId = transaction.id;
        } else {
            title.textContent = 'Add Transaction';
            form.reset();
            delete form.dataset.editId;
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        }

        modal.style.display = 'block';
    }

    showAccountModal() {
        const modal = document.getElementById('accountModal');
        document.getElementById('accountForm').reset();
        modal.style.display = 'block';
    }

    showRuleModal() {
        const modal = document.getElementById('ruleModal');
        document.getElementById('ruleForm').reset();
        this.populateRuleCategories();
        modal.style.display = 'block';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Save Functions
    saveTransaction() {
        const form = document.getElementById('transactionForm');
        const data = {
            type: document.getElementById('transactionType').value,
            description: document.getElementById('transactionDescription').value,
            category: document.getElementById('transactionCategory').value,
            account: document.getElementById('transactionAccount').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            date: new Date(document.getElementById('transactionDate').value)
        };

        // Apply auto-categorization if no category selected
        if (!data.category) {
            data.category = this.applyCategorization(data.description, data.type);
        }

        if (form.dataset.editId) {
            // Edit existing transaction
            const index = this.transactions.findIndex(t => t.id == form.dataset.editId);
            this.transactions[index] = { ...this.transactions[index], ...data };
        } else {
            // Add new transaction
            data.id = Date.now();
            this.transactions.push(data);
        }

        this.saveToStorage('transactions', this.transactions);
        this.hideModal('transactionModal');
        this.showNotification('Transaction saved successfully');
        
        // Refresh current page
        if (this.currentPage === 'transactions') {
            this.loadTransactions();
        } else if (this.currentPage === 'dashboard') {
            this.loadDashboard();
        }
    }

    saveAccount() {
        const data = {
            name: document.getElementById('accountName').value,
            type: document.getElementById('accountType').value,
            initialBalance: parseFloat(document.getElementById('initialBalance').value) || 0
        };

        // Check if account name already exists
        if (this.accounts.some(a => a.name === data.name)) {
            alert('Account name already exists. Please choose a different name.');
            return;
        }

        this.accounts.push(data);
        this.saveToStorage('accounts', this.accounts);
        this.hideModal('accountModal');
        this.showNotification('Account added successfully');
        this.loadAccounts();
    }

    saveRule() {
        const data = {
            keyword: document.getElementById('ruleKeyword').value.toLowerCase(),
            category: document.getElementById('ruleCategory').value
        };

        this.categorizationRules.push(data);
        this.saveToStorage('categorizationRules', this.categorizationRules);
        this.hideModal('ruleModal');
        this.showNotification('Categorization rule added');
        this.loadSettings();
    }

    // Delete Functions
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToStorage('transactions', this.transactions);
            this.showNotification('Transaction deleted');
            this.renderTransactionsTable();
        }
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.showTransactionModal(transaction);
        }
    }

    deleteAccount(name) {
        if (confirm(`Are you sure you want to delete the account "${name}"? This will also delete all associated transactions.`)) {
            this.accounts = this.accounts.filter(a => a.name !== name);
            this.transactions = this.transactions.filter(t => t.account !== name);
            this.saveToStorage('accounts', this.accounts);
            this.saveToStorage('transactions', this.transactions);
            this.showNotification('Account and associated transactions deleted');
            this.loadAccounts();
        }
    }

    deleteRule(index) {
        this.categorizationRules.splice(index, 1);
        this.saveToStorage('categorizationRules', this.categorizationRules);
        this.showNotification('Rule deleted');
        this.loadSettings();
    }

    // Utility Functions
    applyCategorization(description, type) {
        const desc = description.toLowerCase();
        const rule = this.categorizationRules.find(r => desc.includes(r.keyword));
        
        if (rule) {
            return rule.category;
        }
        
        // Return default category for the type
        return type === 'income' ? 'Other Income' : 'Other';
    }

    getMonthKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    getTransactionsForMonth(date) {
        const monthKey = this.getMonthKey(date);
        return this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const transactionKey = this.getMonthKey(transactionDate);
            return transactionKey === monthKey;
        });
    }

    getBudgetsForMonth(date) {
        const monthKey = this.getMonthKey(date);
        return this.budgets[monthKey] || {};
    }

    updateCurrentMonth() {
        document.getElementById('currentMonth').textContent = 
            this.currentMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    }

    initializeDefaultAccount() {
        if (this.accounts.length === 0) {
            this.accounts.push({
                name: 'Main Account',
                type: 'checking',
                initialBalance: 0
            });
            this.saveToStorage('accounts', this.accounts);
        }
    }

    // Data Management
    exportData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            accounts: this.accounts,
            categorizationRules: this.categorizationRules,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully');
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (file.name.endsWith('.csv')) {
                    this.importCSV(e.target.result);
                } else {
                    const data = JSON.parse(e.target.result);
                    this.importJSON(data);
                }
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    importJSON(data) {
        if (confirm('This will replace all existing data. Are you sure?')) {
            if (data.transactions) {
                this.transactions = data.transactions.map(t => ({
                    ...t,
                    date: new Date(t.date)
                }));
            }
            if (data.budgets) this.budgets = data.budgets;
            if (data.accounts) this.accounts = data.accounts;
            if (data.categorizationRules) this.categorizationRules = data.categorizationRules;

            this.saveAllData();
            this.showNotification('Data imported successfully');
            this.loadDashboard();
        }
    }

    importCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const requiredFields = ['date', 'description', 'amount'];
        if (!requiredFields.every(field => headers.includes(field))) {
            alert('CSV must contain at least: date, description, amount columns');
            return;
        }

        const newTransactions = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 3) {
                const transaction = {
                    id: Date.now() + i,
                    date: new Date(values[headers.indexOf('date')]),
                    description: values[headers.indexOf('description')].trim(),
                    amount: Math.abs(parseFloat(values[headers.indexOf('amount')])),
                    type: parseFloat(values[headers.indexOf('amount')]) >= 0 ? 'income' : 'expense',
                    category: this.applyCategorization(values[headers.indexOf('description')], 'expense'),
                    account: this.accounts[0]?.name || 'Main Account'
                };
                newTransactions.push(transaction);
            }
        }

        this.transactions.push(...newTransactions);
        this.saveToStorage('transactions', this.transactions);
        this.showNotification(`Imported ${newTransactions.length} transactions from CSV`);
        this.loadTransactions();
    }

    loadSampleData() {
        if (confirm('This will add sample data to your budget tracker. Continue?')) {
            // Sample accounts
            const sampleAccounts = [
                { name: 'Checking Account', type: 'checking', initialBalance: 5000 },
                { name: 'Savings Account', type: 'savings', initialBalance: 15000 },
                { name: 'Credit Card', type: 'credit', initialBalance: 0 }
            ];

            // Sample transactions for the last 3 months
            const sampleTransactions = [];
            for (let month = 0; month < 3; month++) {
                const date = new Date();
                date.setMonth(date.getMonth() - month);
                
                // Income transactions
                sampleTransactions.push({
                    id: Date.now() + month * 1000 + 1,
                    type: 'income',
                    description: 'Salary',
                    category: 'Salary',
                    account: 'Checking Account',
                    amount: 4500,
                    date: new Date(date.getFullYear(), date.getMonth(), 15)
                });

                // Expense transactions
                const expenses = [
                    { desc: 'Groceries at Metro', cat: 'Food', amount: 120, day: 5 },
                    { desc: 'Gas Station', cat: 'Transportation', amount: 65, day: 7 },
                    { desc: 'Netflix Subscription', cat: 'Entertainment', amount: 16.99, day: 10 },
                    { desc: 'Electricity Bill', cat: 'Bills', amount: 135, day: 12 },
                    { desc: 'Restaurant Dinner', cat: 'Food', amount: 85, day: 14 },
                    { desc: 'Pharmacy', cat: 'Healthcare', amount: 45, day: 18 },
                    { desc: 'Online Shopping', cat: 'Shopping', amount: 200, day: 20 },
                    { desc: 'Internet Bill', cat: 'Bills', amount: 75, day: 25 }
                ];

                expenses.forEach((exp, idx) => {
                    sampleTransactions.push({
                        id: Date.now() + month * 1000 + idx + 10,
                        type: 'expense',
                        description: exp.desc,
                        category: exp.cat,
                        account: month % 2 === 0 ? 'Checking Account' : 'Credit Card',
                        amount: exp.amount,
                        date: new Date(date.getFullYear(), date.getMonth(), exp.day)
                    });
                });
            }

            // Sample budgets for current month
            const currentMonthKey = this.getMonthKey(new Date());
            const sampleBudgets = {
                [currentMonthKey]: {
                    'Food': 800,
                    'Transportation': 300,
                    'Entertainment': 200,
                    'Bills': 500,
                    'Healthcare': 200,
                    'Shopping': 400,
                    'Other': 300
                }
            };

            // Sample categorization rules
            const sampleRules = [
                { keyword: 'metro', category: 'Food' },
                { keyword: 'walmart', category: 'Food' },
                { keyword: 'gas', category: 'Transportation' },
                { keyword: 'netflix', category: 'Entertainment' },
                { keyword: 'spotify', category: 'Entertainment' },
                { keyword: 'pharmacy', category: 'Healthcare' }
            ];

            // Merge with existing data
            this.accounts = [...this.accounts.filter(a => !sampleAccounts.find(s => s.name === a.name)), ...sampleAccounts];
            this.transactions = [...this.transactions, ...sampleTransactions];
            this.budgets = { ...this.budgets, ...sampleBudgets };
            this.categorizationRules = [...this.categorizationRules, ...sampleRules];

            this.saveAllData();
            this.showNotification('Sample data loaded successfully');
            this.showPage('dashboard');
        }
    }

    resetAllData() {
        if (confirm('This will permanently delete ALL your data. Are you sure?')) {
            if (confirm('This action cannot be undone. Really delete everything?')) {
                localStorage.clear();
                this.transactions = [];
                this.budgets = {};
                this.accounts = [];
                this.categorizationRules = [];
                this.initializeDefaultAccount();
                this.showNotification('All data has been reset');
                this.showPage('dashboard');
            }
        }
    }

    saveAllData() {
        this.saveToStorage('transactions', this.transactions);
        this.saveToStorage('budgets', this.budgets);
        this.saveToStorage('accounts', this.accounts);
        this.saveToStorage('categorizationRules', this.categorizationRules);
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadFromStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app
const budgetTracker = new BudgetTracker();