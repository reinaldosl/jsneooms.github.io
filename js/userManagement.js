/**
 * Renderiza a tabela de usuários com base nos dados atuais.
 * Assegura que a tabela seja atualizada dinamicamente.
 */
function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = ''; // Limpa as linhas existentes

    users.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-50');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.lastname}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.age}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Adiciona um novo usuário à lista de usuários.
 * Realiza validação básica dos campos do formulário.
 */
function addNewUser() {
    const name = document.getElementById('new-name').value;
    const lastname = document.getElementById('new-lastname').value;
    const age = parseInt(document.getElementById('new-age').value);
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const messageDiv = document.getElementById('new-user-message');

    if (name && lastname && !isNaN(age) && age > 0 && email && password) {
        // Verifica se o e-mail já existe
        if (users.some(u => u.email === email)) {
            messageDiv.textContent = 'E-mail já cadastrado. Por favor, use um e-mail diferente.';
            messageDiv.classList.remove('hidden', 'text-green-600');
            messageDiv.classList.add('text-red-500');
            return;
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // Gera um ID único
            name,
            lastname,
            age,
            email,
            password
        };
        users.push(newUser);
        clearNewUserForm();
        messageDiv.textContent = 'Usuário cadastrado com sucesso!';
        messageDiv.classList.remove('hidden', 'text-red-500');
        messageDiv.classList.add('text-green-600');
        setTimeout(() => { messageDiv.classList.add('hidden'); }, 3000); // Esconde a mensagem após 3 segundos

        // Rastrear evento de usuário adicionado no Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track("User Added", { userEmail: newUser.email, userName: newUser.name });
        }
    } else {
        messageDiv.textContent = 'Por favor, preencha todos os campos corretamente (Idade deve ser um número válido).';
        messageDiv.classList.remove('hidden', 'text-green-600');
        messageDiv.classList.add('text-red-500');
    }
}

/**
 * Limpa os campos do formulário de cadastro de novo usuário.
 */
function clearNewUserForm() {
    document.getElementById('new-name').value = '';
    document.getElementById('new-lastname').value = '';
    document.getElementById('new-age').value = '';
    document.getElementById('new-email').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('new-user-message').classList.add('hidden');
    document.getElementById('new-user-message').classList.remove('text-red-500');
    document.getElementById('new-user-message').classList.add('text-green-600');
}

/**
 * Prepara o modal de edição de usuário com os dados do usuário selecionado.
 * @param {number} id - O ID do usuário a ser editado.
 */
function editUser(id) {
    currentEditingUserId = id;
    const user = users.find(u => u.id === id);
    if (user) {
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-lastname').value = user.lastname;
        document.getElementById('edit-age').value = user.age;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-password').value = ''; // Limpa o campo de senha por segurança
        document.getElementById('edit-user-modal').classList.remove('hidden');
    }
}

/**
 * Fecha o modal de edição de usuário.
 */
function closeEditModal() {
    document.getElementById('edit-user-modal').classList.add('hidden');
    currentEditingUserId = null;
}

/**
 * Salva as alterações de um usuário editado.
 * Atualiza os dados do usuário na lista.
 */
function saveEditedUser() {
    const userIndex = users.findIndex(u => u.id === currentEditingUserId);
    if (userIndex !== -1) {
        const user = users[userIndex];
        user.name = document.getElementById('edit-name').value;
        user.lastname = document.getElementById('edit-lastname').value;
        user.age = parseInt(document.getElementById('edit-age').value);
        // Email está desabilitado, então não é alterado
        const newPassword = document.getElementById('edit-password').value;
        if (newPassword) {
            user.password = newPassword; // Atualiza a senha apenas se uma nova for fornecida
        }
        closeEditModal();
        renderUsersTable(); // Re-renderiza a tabela para mostrar os dados atualizados

        // Rastrear evento de usuário editado no Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track("User Edited", { userId: user.id, userEmail: user.email, userName: user.name });
        }
    }
}

/**
 * Exibe o modal de confirmação de exclusão para um usuário.
 * @param {number} id - O ID do usuário a ser excluído.
 */
function deleteUser(id) {
    currentDeletingUserId = id;
    document.getElementById('confirmation-modal').classList.remove('hidden');
}

/**
 * Confirma a exclusão de um usuário após a confirmação.
 * Remove o usuário da lista e re-renderiza a tabela.
 */
function confirmDeletion() {
    const deletedUser = users.find(u => u.id === currentDeletingUserId);
    users = users.filter(u => u.id !== currentDeletingUserId);
    cancelDeletion(); // Fecha o modal de confirmação
    renderUsersTable(); // Re-renderiza a tabela

    // Rastrear evento de usuário excluído no Mixpanel
    if (typeof mixpanel !== 'undefined' && deletedUser) {
        mixpanel.track("User Deleted", { userId: deletedUser.id, userEmail: deletedUser.email, userName: deletedUser.name });
    }
}

/**
 * Cancela a exclusão de um usuário, fechando o modal de confirmação.
 */
function cancelDeletion() {
    document.getElementById('confirmation-modal').classList.add('hidden');
    currentDeletingUserId = null;
}
