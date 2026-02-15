_// Application State
const AppState = {
  donations: [],
  organizations: [
    {
      id: 1,
      name: "Global Food Bank Network",
      location: "New York, USA",
      description: "International organization distributing food to communities in need across 50+ countries.",
      contact: "contact@globalfoodbank.org",
      phone: "+1-555-0100"
    },
    {
      id: 2,
      name: "Community Food Share",
      location: "London, UK",
      description: "Local food distribution center serving families in need throughout the greater London area.",
      contact: "info@communityfoodshare.uk",
      phone: "+44-20-5555-0100"
    },
    {
      id: 3,
      name: "Hope Kitchen",
      location: "Nairobi, Kenya",
      description: "Providing daily meals and food assistance to vulnerable communities in East Africa.",
      contact: "help@hopekitchen.ke",
      phone: "+254-20-555-0100"
    },
    {
      id: 4,
      name: "Food for All Foundation",
      location: "Mumbai, India",
      description: "Large-scale food distribution network serving millions across India and South Asia.",
      contact: "support@foodforall.in",
      phone: "+91-22-5555-0100"
    },
    {
      id: 5,
      name: "Emergency Food Relief",
      location: "São Paulo, Brazil",
      description: "Rapid response food distribution for emergency situations and ongoing community support.",
      contact: "relief@emergencyfood.br",
      phone: "+55-11-5555-0100"
    }
  ],
  distributions: []
};

// Initialize App
function initApp() {
  loadData();
  setupEventListeners();
  renderAll();
}

// Load data from localStorage
function loadData() {
  const savedDonations = localStorage.getItem('hungerApp_donations');
  const savedDistributions = localStorage.getItem('hungerApp_distributions');
  
  if (savedDonations) {
    AppState.donations = JSON.parse(savedDonations);
  }
  
  if (savedDistributions) {
    AppState.distributions = JSON.parse(savedDistributions);
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('hungerApp_donations', JSON.stringify(AppState.donations));
  localStorage.setItem('hungerApp_distributions', JSON.stringify(AppState.distributions));
}

// Setup Event Listeners
function setupEventListeners() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Donation form
  const donationForm = document.getElementById('donation-form');
  if (donationForm) {
    donationForm.addEventListener('submit', handleDonationSubmit);
  }

  // Organization search
  const searchBtn = document.getElementById('search-btn');
  const orgSearch = document.getElementById('org-search');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', handleOrgSearch);
  }
  
  if (orgSearch) {
    orgSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleOrgSearch();
      }
    });
  }
}

// Tab Switching
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const activeTab = document.getElementById(`${tabName}-tab`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Render specific content
  if (tabName === 'organizations') {
    renderOrganizations();
  } else if (tabName === 'track') {
    renderTracking();
  } else if (tabName === 'map') {
    renderMap();
  }
}

// Handle Donation Form Submit
function handleDonationSubmit(e) {
  e.preventDefault();

  const donation = {
    id: Date.now(),
    donorName: document.getElementById('donor-name').value,
    type: document.getElementById('donation-type').value,
    quantity: document.getElementById('quantity').value,
    location: document.getElementById('location').value,
    contact: document.getElementById('contact').value,
    urgency: document.getElementById('urgency').value,
    notes: document.getElementById('notes').value,
    date: new Date().toISOString(),
    status: 'pending'
  };

  AppState.donations.unshift(donation);
  saveData();

  // Create distribution record
  const distribution = {
    id: Date.now(),
    donationId: donation.id,
    type: 'new_donation',
    description: `${donation.quantity} of ${donation.type} from ${donation.donorName}`,
    location: donation.location,
    date: new Date().toISOString()
  };

  AppState.distributions.unshift(distribution);
  saveData();

  // Show success message
  showMessage('Thank you for your donation! Your contribution will help feed those in need.', 'success');

  // Reset form
  document.getElementById('donation-form').reset();

  // Re-render
  renderDonations();
  renderStats();
  renderTracking();
}

// Show Message
function showMessage(text, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = text;

  const form = document.getElementById('donation-form');
  if (form) {
    form.parentElement.insertBefore(messageDiv, form);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Render All
function renderAll() {
  renderStats();
  renderDonations();
  renderOrganizations();
  renderTracking();
  renderMap();
}

// Render Stats
function renderStats() {
  const totalDonations = AppState.donations.length;
  const activeOrgs = AppState.organizations.length;
  
  // Calculate total meals (estimate based on donations)
  let totalMeals = 0;
  AppState.donations.forEach(donation => {
    const quantity = parseInt(donation.quantity) || 0;
    if (donation.type === 'prepared-meals') {
      totalMeals += quantity;
    } else if (donation.type === 'fresh-food' || donation.type === 'non-perishable') {
      totalMeals += Math.floor(quantity / 0.5); // Estimate 0.5kg per meal
    } else if (donation.type === 'funds') {
      totalMeals += Math.floor(quantity / 3); // Estimate $3 per meal
    }
  });

  const peopleHelped = Math.floor(totalMeals / 3); // Estimate 3 meals per person per day

  document.getElementById('total-donations').textContent = totalMeals.toLocaleString();
  document.getElementById('active-organizations').textContent = activeOrgs;
  document.getElementById('people-helped').textContent = peopleHelped.toLocaleString();
}

// Render Donations
function renderDonations() {
  const donationsList = document.getElementById('donations-list');
  if (!donationsList) return;

  if (AppState.donations.length === 0) {
    donationsList.innerHTML = '<p class="empty-state">No donations yet. Be the first to help!</p>';
    return;
  }

  donationsList.innerHTML = AppState.donations.slice(0, 10).map(donation => {
    const date = new Date(donation.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    return `
      <div class="donation-item">
        <div class="donation-header">
          <div>
            <span class="donation-title">${escapeHtml(donation.donorName)}</span>
            <span class="donation-type">${donation.type.replace('-', ' ')}</span>
          </div>
          <span class="urgency-badge urgency-${donation.urgency}">${donation.urgency}</span>
        </div>
        <div class="donation-details">
          <div class="donation-detail">
            <strong>Quantity:</strong> ${escapeHtml(donation.quantity)}
          </div>
          <div class="donation-detail">
            <strong>Location:</strong> ${escapeHtml(donation.location)}
          </div>
          <div class="donation-detail">
            <strong>Date:</strong> ${formattedDate}
          </div>
          ${donation.notes ? `
            <div class="donation-detail">
              <strong>Notes:</strong> ${escapeHtml(donation.notes)}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Render Organizations
function renderOrganizations(searchTerm = '') {
  const orgsList = document.getElementById('organizations-list');
  if (!orgsList) return;

  let filteredOrgs = AppState.organizations;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredOrgs = AppState.organizations.filter(org => 
      org.name.toLowerCase().includes(term) ||
      org.location.toLowerCase().includes(term) ||
      org.description.toLowerCase().includes(term)
    );
  }

  if (filteredOrgs.length === 0) {
    orgsList.innerHTML = '<p class="empty-state">No organizations found matching your search.</p>';
    return;
  }

  orgsList.innerHTML = filteredOrgs.map(org => `
    <div class="org-item">
      <div class="org-name">${escapeHtml(org.name)}</div>
      <div class="org-location">📍 ${escapeHtml(org.location)}</div>
      <div class="org-description">${escapeHtml(org.description)}</div>
      <div class="org-contact">
        <span>📧 ${escapeHtml(org.contact)}</span>
        <span>📞 ${escapeHtml(org.phone)}</span>
      </div>
    </div>
  `).join('');
}

// Handle Organization Search
function handleOrgSearch() {
  const searchInput = document.getElementById('org-search');
  if (searchInput) {
    renderOrganizations(searchInput.value);
  }
}

// Render Tracking Dashboard
function renderTracking() {
  // Calculate inventory
  let freshFood = 0;
  let nonPerishable = 0;
  let meals = 0;

  AppState.donations.forEach(donation => {
    const quantity = parseInt(donation.quantity) || 0;
    if (donation.type === 'fresh-food') {
      freshFood += quantity;
    } else if (donation.type === 'non-perishable') {
      nonPerishable += quantity;
    } else if (donation.type === 'prepared-meals') {
      meals += quantity;
    }
  });

  document.getElementById('inventory-fresh').textContent = `${freshFood} kg`;
  document.getElementById('inventory-nonperishable').textContent = `${nonPerishable} items`;
  document.getElementById('inventory-meals').textContent = `${meals} meals`;

  // Calculate distribution status
  const pending = AppState.donations.filter(d => d.status === 'pending').length;
  const inTransit = AppState.donations.filter(d => d.status === 'in-transit').length;
  const delivered = AppState.donations.filter(d => d.status === 'delivered').length;

  document.getElementById('status-pending').textContent = pending;
  document.getElementById('status-transit').textContent = inTransit;
  document.getElementById('status-delivered').textContent = delivered;

  // Calculate impact metrics
  let totalMeals = 0;
  AppState.donations.forEach(donation => {
    const quantity = parseInt(donation.quantity) || 0;
    if (donation.type === 'prepared-meals') {
      totalMeals += quantity;
    } else if (donation.type === 'fresh-food' || donation.type === 'non-perishable') {
      totalMeals += Math.floor(quantity / 0.5);
    } else if (donation.type === 'funds') {
      totalMeals += Math.floor(quantity / 3);
    }
  });

  const familiesServed = Math.floor(totalMeals / 15); // Estimate 15 meals per family
  const countries = new Set(AppState.donations.map(d => d.location.split(',')[1]?.trim() || 'Unknown')).size;

  document.getElementById('metric-meals').textContent = totalMeals.toLocaleString();
  document.getElementById('metric-families').textContent = familiesServed.toLocaleString();
  document.getElementById('metric-countries').textContent = countries;

  // Render timeline
  renderTimeline();
}

// Render Timeline
function renderTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  if (AppState.distributions.length === 0) {
    timeline.innerHTML = '<p class="empty-state">No distribution activities yet.</p>';
    return;
  }

  timeline.innerHTML = AppState.distributions.slice(0, 20).map(dist => {
    const date = new Date(dist.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="timeline-item">
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">${escapeHtml(dist.description)} - ${escapeHtml(dist.location)}</div>
      </div>
    `;
  }).join('');
}

// Render Map
function renderMap() {
  const mapMarkers = document.getElementById('map-markers');
  if (!mapMarkers) return;

  // Get unique locations from donations and organizations
  const locations = new Map();
  
  AppState.donations.forEach(donation => {
    const loc = donation.location;
    if (!locations.has(loc)) {
      locations.set(loc, { type: 'donation', count: 0 });
    }
    locations.get(loc).count++;
  });

  AppState.organizations.forEach(org => {
    const loc = org.location;
    if (!locations.has(loc)) {
      locations.set(loc, { type: 'organization', count: 0 });
    }
    locations.get(loc).type = 'organization';
  });

  if (locations.size === 0) {
    mapMarkers.innerHTML = '<p class="empty-state">No locations to display yet.</p>';
    return;
  }

  mapMarkers.innerHTML = Array.from(locations.entries()).map(([location, data]) => {
    const dotClass = data.type === 'donation' ? 'dot-donation' : 'dot-organization';
    return `
      <div class="map-marker">
        <span class="legend-dot ${dotClass}"></span>
        ${escapeHtml(location)} ${data.count > 1 ? `(${data.count})` : ''}
      </div>
    `;
  }).join('');
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
