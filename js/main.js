// Dummy user data - ideally this would come from a backend or local storage
let users = [
    { id: 1, name: 'Alice', lastname: 'Smith', age: 28, email: 'alice@example.com', password: 'password123' },
    { id: 2, name: 'Bob', lastname: 'Johnson', age: 35, email: 'bob@example.com', password: 'password123' },
    { id: 3, name: 'Carlos', lastname: 'Pereira', age: 22, email: 'carlos@example.com', password: 'password123' }
];

let currentEditingUserId = null;
let currentDeletingUserId = null;

/**
 * Função para exibir uma tela específica e esconder as outras.
 * @param {string} screenId - O ID da tela a ser exibida (ex: 'welcome', 'new-user', 'manage-users').
 */
function showScreen(screenId) {
    // Esconde todas as telas de conteúdo
    document.getElementById('welcome-content').classList.add('hidden');
    document.getElementById('new-user-content').classList.add('hidden');
    document.getElementById('manage-users-content').classList.add('hidden');

    // Exibe a tela solicitada
    document.getElementById(screenId + '-content').classList.remove('hidden');

    // Se estiver gerenciando usuários, renderiza a tabela
    if (screenId === 'manage-users') {
        renderUsersTable();
    }
}

/**
 * Lida com a tentativa de login.
 * Realiza uma validação básica e verifica as credenciais fictícias.
 * Em um cenário real, isso faria uma chamada a uma API de autenticação.
 */
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');

    // Validação básica e verificação de login fictícia
    if (email === 'admin@example.com' && password === 'admin123') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        loginMessage.classList.add('hidden');
        showScreen('welcome'); // Exibe a tela de boas-vindas após o login

        // Rastrear evento de login bem-sucedido no Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track("Login Successful", { email: email });
        }
    } else {
        loginMessage.textContent = 'E-mail ou senha inválidos. Tente admin@example.com / admin123';
        loginMessage.classList.remove('hidden');

        // Rastrear evento de login falho no Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track("Login Failed", { email: email, reason: "Invalid credentials" });
        }
    }
}

/**
 * Lida com a ação de logout.
 * Retorna o usuário para a tela de login.
 */
function handleLogout() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-message').classList.add('hidden');

    // Rastrear evento de logout no Mixpanel
    if (typeof mixpanel !== 'undefined') {
        mixpanel.track("Logout");
    }
}

// O userManagement.js irá preencher as outras funções de CRUD.
// As funções `renderUsersTable`, `addNewUser`, `clearNewUserForm`,
// `editUser`, `closeEditModal`, `saveEditedUser`, `deleteUser`,
// `confirmDeletion`, `cancelDeletion` serão definidas em userManagement.js
// e estarão globalmente acessíveis devido à forma como os scripts são incluídos no HTML.
