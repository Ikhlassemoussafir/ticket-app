// Configuration globale
const config = {
  apiUrl: 'http://localhost:3000/api', // À adapter selon votre backend
  localStorageKey: 'ticketAppAuth'
};

// Fonctions utilitaires
const utils = {
  showLoading: (element) => {
    element.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Chargement...';
    element.disabled = true;
  },
  hideLoading: (element, originalText) => {
    element.innerHTML = originalText;
    element.disabled = false;
  },
  redirect: (url) => {
    window.location.href = url;
  },
  getUrlParam: (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
};

// Gestion de l'authentification
const auth = {
  isLoggedIn: () => {
    return !!localStorage.getItem(config.localStorageKey);
  },
  logout: () => {
    localStorage.removeItem(config.localStorageKey);
    utils.redirect('index.html');
  }
};

// Gestion des tickets
const tickets = {
  getAll: async () => {
    try {
      const response = await fetch(`${config.apiUrl}/tickets`);
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      return [];
    }
  },
  getById: async (id) => {
    try {
      const response = await fetch(`${config.apiUrl}/tickets/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  },
  create: async (ticketData) => {
    try {
      const response = await fetch(`${config.apiUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(config.localStorageKey)}`
        },
        body: JSON.stringify(ticketData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      return { error: true };
    }
  }
};

// Initialisation de la page
const initPage = () => {
  // Vérification d'authentification (sauf pour index.html)
  if (!window.location.pathname.includes('index.html') && !auth.isLoggedIn()) {
    utils.redirect('index.html');
    return;
  }

  // Gestion des événements communs
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Déconnexion ?')) auth.logout();
    });
  });

  // Initialisation spécifique à chaque page
  const pageId = document.body.id;
  switch(pageId) {
    case 'ticket-page':
      initTicketPage();
      break;
    case 'create-ticket-page':
      initCreateTicketPage();
      break;
    case 'detail-ticket-page':
      initDetailTicketPage();
      break;
    default:
      break;
  }
};

// Initialisation de la page des tickets
const initTicketPage = () => {
  const loadTickets = async () => {
    const ticketsList = await tickets.getAll();
    renderTickets(ticketsList);
  };

  const renderTickets = (tickets) => {
    const tbody = document.querySelector('#ticketsTableBody');
    if (!tbody) return;

    tbody.innerHTML = tickets.map(ticket => `
      <tr class="ticket-row" data-id="${ticket.id}">
        <td>#${ticket.id}</td>
        <td>${ticket.title}</td>
        <td><span class="badge-status badge-${ticket.status.replace('-', '')}">${getStatusText(ticket.status)}</span></td>
        <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
        <td><span class="badge bg-${getPriorityClass(ticket.priority)}">${getPriorityText(ticket.priority)}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" data-action="view">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning" data-action="edit">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Ajout des événements
    document.querySelectorAll('[data-action="view"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticketId = btn.closest('tr').getAttribute('data-id');
        utils.redirect(`detail-ticket.html?id=${ticketId}`);
      });
    });

    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticketId = btn.closest('tr').getAttribute('data-id');
        utils.redirect(`modifier-ticket.html?id=${ticketId}`);
      });
    });

    document.querySelectorAll('.ticket-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const ticketId = row.getAttribute('data-id');
          utils.redirect(`detail-ticket.html?id=${ticketId}`);
        }
      });
    });
  };

  // Fonctions utilitaires
  const getStatusText = (status) => {
    const statusMap = {
      'open': 'Ouvert',
      'in-progress': 'En cours',
      'resolved': 'Résolu',
      'closed': 'Fermé'
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'high': 'Haute',
      'medium': 'Moyenne',
      'low': 'Basse'
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityClass = (priority) => {
    const classMap = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'info'
    };
    return classMap[priority] || 'secondary';
  };

  // Chargement initial
  loadTickets();
};

// Initialisation de la page de création de ticket
const initCreateTicketPage = () => {
  const form = document.getElementById('ticketForm');
  if (!form) return;

  // Compteur de caractères
  const description = document.getElementById('ticketDescription');
  const charCount = document.getElementById('charCount');
  if (description && charCount) {
    description.addEventListener('input', () => {
      const remaining = 500 - description.value.length;
      charCount.textContent = remaining;
      charCount.className = remaining < 50 ? 'text-danger' : '';
    });
  }

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    utils.showLoading(submitBtn);

    const formData = {
      title: form.ticketTitle.value,
      description: form.ticketDescription.value,
      category: form.querySelector('input[name="category"]:checked')?.value,
      priority: form.querySelector('input[name="priority"]:checked')?.value
    };

    const result = await tickets.create(formData);
    utils.hideLoading(submitBtn, originalText);

    if (!result.error) {
      form.style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
    } else {
      alert('Erreur lors de la création du ticket');
    }
  });

  // Bouton Annuler
  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    if (confirm('Annuler la création de ce ticket ?')) {
      utils.redirect('ticket.html');
    }
  });
};

// Initialisation de la page de détail du ticket
const initDetailTicketPage = () => {
  const ticketId = utils.getUrlParam('id');
  if (!ticketId) {
    utils.redirect('ticket.html');
    return;
  }

  const loadTicket = async () => {
    const ticket = await tickets.getById(ticketId);
    if (!ticket) {
      alert('Ticket non trouvé');
      utils.redirect('ticket.html');
      return;
    }

    // Remplir les données du ticket
    document.getElementById('ticketTitle').textContent = `Ticket #${ticket.id}`;
    document.getElementById('ticketDescription').textContent = ticket.description;
    // ... (compléter avec les autres champs)
  };

  loadTicket();
};

// Démarrer l'application
document.addEventListener('DOMContentLoaded', initPage);