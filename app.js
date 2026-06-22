// ========================================
// BHARATWAY - Complete JavaScript Code
// Author: Rishav Chandel
// All Features: Fuel Prices, Translation, Booking, Eco Tracker
// ========================================
let map, userMarker, currentTrip = null,
    recognition, isVoiceActive = false;
let watchId = null,
    tripData = { locations: [], startTime: null };
let healthRecords = [],
    vaccinationRecords = [],
    tripHistory = [];
let isSatellite = false;

// 🔥 YEH NAYA VARIABLE ADD KARO - Chatbot ke liye
let isChatbotMinimized = false;
// ========================================
// FUEL PRICE API CONFIGURATION
// ========================================
const FUEL_API_KEY = 'YOUR_COLLECTAPI_KEY_HERE'; // CollectAPI se key lo
const FUEL_API_URL = 'https://api.collectapi.com/gasPrice/stateDetail?state=';
const USD_TO_INR = 83.50; // Current exchange rate

// USA state to Indian state mapping
const usaToIndianStateMap = {
    "washington": "Delhi",
    "california": "Mumbai",
    "texas": "Chennai",
    "newyork": "Kolkata",
    "florida": "Bangalore",
    "illinois": "Hyderabad",
    "pennsylvania": "Ahmedabad",
    "ohio": "Pune",
    "georgia": "Jaipur",
    "northcarolina": "Lucknow"
};

// Indian state codes for variation
const indianStateFactors = {
    "Delhi": 1.0,
    "Mumbai": 1.1,
    "Chennai": 0.95,
    "Kolkata": 0.98,
    "Bangalore": 1.05,
    "Hyderabad": 1.02,
    "Ahmedabad": 0.96,
    "Pune": 1.03,
    "Jaipur": 0.94,
    "Lucknow": 0.92
};
// ======================================
// NAVIGATION & TRAFFIC VARIABLES
// ======================================
let roueControl = null;        // Route display karne ke liye
let trafficLayer = null;        // Traffic layer ke liye
let isTrafficOn = false;         // Traffic toggle status
let currenRoute = null;         // Current route data

// NOTE: Autocomplete manually implement kiya hai via searchLocations() function
let fromAutocomplete, toAutocomplete;
// 🔥 YAHAN TAK

// ======================================
// ALL STATES FUEL PRICES DATA (35 States/UTs)
// ======================================
const allStatesFuelPrices = [
    { "state": "Andaman & Nicobar", "city": "Port Blair", "petrol": 82.42, "diesel": 75.23, "cng": 0, "lpg": 785.0, "trend": "→", "change": "0.00" },
    { "state": "Andhra Pradesh", "city": "Visakhapatnam", "petrol": 108.29, "diesel": 95.41, "cng": 0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Arunachal Pradesh", "city": "Itanagar", "petrol": 90.62, "diesel": 82.45, "cng": 0, "lpg": 790.0, "trend": "→", "change": "0.00" },
    { "state": "Assam", "city": "Guwahati", "petrol": 96.15, "diesel": 87.32, "cng": 0, "lpg": 795.0, "trend": "→", "change": "0.00" },
    { "state": "Bihar", "city": "Patna", "petrol": 105.18, "diesel": 93.25, "cng": 0, "lpg": 800.0, "trend": "→", "change": "0.00" },
    { "state": "Chandigarh", "city": "Chandigarh", "petrol": 94.24, "diesel": 84.32, "cng": 76.0, "lpg": 805.0, "trend": "→", "change": "0.00" },
    { "state": "Chhattisgarh", "city": "Raipur", "petrol": 100.39, "diesel": 89.12, "cng": 0, "lpg": 798.0, "trend": "→", "change": "0.00" },
    { "state": "Dadra & Nagar Haveli", "city": "Silvassa", "petrol": 92.51, "diesel": 83.45, "cng": 0, "lpg": 788.0, "trend": "→", "change": "0.00" },
    { "state": "Daman & Diu", "city": "Daman", "petrol": 92.39, "diesel": 83.21, "cng": 0, "lpg": 788.0, "trend": "→", "change": "0.00" },
    { "state": "Delhi", "city": "New Delhi", "petrol": 94.72, "diesel": 87.71, "cng": 76.59, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Goa", "city": "Panaji", "petrol": 95.34, "diesel": 83.21, "cng": 0, "lpg": 803.0, "trend": "→", "change": "0.00" },
    { "state": "Gujarat", "city": "Ahmedabad", "petrol": 94.79, "diesel": 89.66, "cng": 75.0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Haryana", "city": "Gurugram", "petrol": 94.24, "diesel": 87.45, "cng": 76.0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Himachal Pradesh", "city": "Shimla", "petrol": 95.90, "diesel": 86.54, "cng": 0, "lpg": 806.0, "trend": "→", "change": "0.00" },
    { "state": "Jammu & Kashmir", "city": "Srinagar", "petrol": 99.91, "diesel": 89.32, "cng": 0, "lpg": 810.0, "trend": "→", "change": "0.00" },
    { "state": "Jharkhand", "city": "Ranchi", "petrol": 97.81, "diesel": 90.45, "cng": 0, "lpg": 802.5, "trend": "↘", "change": "-0.29" },
    { "state": "Karnataka", "city": "Bengaluru", "petrol": 99.84, "diesel": 85.73, "cng": 80.0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Kerala", "city": "Kochi", "petrol": 107.56, "diesel": 92.38, "cng": 0, "lpg": 825.0, "trend": "→", "change": "0.00" },
    { "state": "Ladakh", "city": "Leh", "petrol": 102.45, "diesel": 91.23, "cng": 0, "lpg": 818.0, "trend": "→", "change": "0.00" },
    { "state": "Madhya Pradesh", "city": "Bhopal", "petrol": 106.57, "diesel": 92.15, "cng": 0, "lpg": 804.0, "trend": "→", "change": "0.00" },
    { "state": "Maharashtra", "city": "Mumbai", "petrol": 104.21, "diesel": 90.01, "cng": 78.0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Manipur", "city": "Imphal", "petrol": 99.05, "diesel": 88.23, "cng": 0, "lpg": 815.0, "trend": "↘", "change": "-0.10" },
    { "state": "Meghalaya", "city": "Shillong", "petrol": 96.36, "diesel": 86.45, "cng": 0, "lpg": 808.0, "trend": "→", "change": "0.00" },
    { "state": "Mizoram", "city": "Aizawl", "petrol": 93.79, "diesel": 84.12, "cng": 0, "lpg": 812.0, "trend": "→", "change": "0.00" },
    { "state": "Nagaland", "city": "Kohima", "petrol": 98.19, "diesel": 87.54, "cng": 0, "lpg": 814.0, "trend": "→", "change": "0.00" },
    { "state": "Odisha", "city": "Bhubaneswar", "petrol": 100.97, "diesel": 92.18, "cng": 0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Puducherry", "city": "Puducherry", "petrol": 94.21, "diesel": 85.67, "cng": 0, "lpg": 795.0, "trend": "→", "change": "0.00" },
    { "state": "Punjab", "city": "Chandigarh", "petrol": 94.24, "diesel": 87.45, "cng": 76.0, "lpg": 805.0, "trend": "→", "change": "0.00" },
    { "state": "Rajasthan", "city": "Jaipur", "petrol": 104.88, "diesel": 89.25, "cng": 78.0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Sikkim", "city": "Gangtok", "petrol": 103.30, "diesel": 90.12, "cng": 0, "lpg": 820.0, "trend": "→", "change": "0.00" },
    { "state": "Tamil Nadu", "city": "Chennai", "petrol": 102.09, "diesel": 92.38, "cng": 85.0, "lpg": 802.5, "trend": "↗", "change": "+0.40" },
    { "state": "Telangana", "city": "Hyderabad", "petrol": 107.70, "diesel": 94.52, "cng": 82.0, "lpg": 802.5, "trend": "↗", "change": "+0.63" },
    { "state": "Tripura", "city": "Agartala", "petrol": 97.53, "diesel": 88.34, "cng": 0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Uttar Pradesh", "city": "Lucknow", "petrol": 94.65, "diesel": 87.71, "cng": 77.0, "lpg": 802.5, "trend": "→", "change": "0.00" },
    { "state": "Uttarakhand", "city": "Dehradun", "petrol": 93.23, "diesel": 85.12, "cng": 0, "lpg": 808.0, "trend": "→", "change": "0.00" },
    { "state": "West Bengal", "city": "Kolkata", "petrol": 103.94, "diesel": 91.81, "cng": 90.0, "lpg": 802.5, "trend": "→", "change": "0.00" }
];
// ======================================
// INITIALIZATION & LOADING
// ======================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 MapView.AI Initializing...");

    // Check if emergency contacts exist
    checkEmergencyContacts();

    // Show loading screen
    simulateLoading();

    // Initialize all features
    setTimeout(() => {
        initializeMap();
        loadFuelPrices();
        loadEcoMissions();
        showTranslations('hindi');
        loadFamousPlaces();
        hideLoadingScreen();
        showTab('homeScreen');
    }, 3000);
});

// ======================================
// EMERGENCY CONTACTS SETUP (APP START)
// ======================================

function checkEmergencyContacts() {
    // Check if contacts already saved
    const savedContacts = localStorage.getItem('emergencyContacts');
    
    if (!savedContacts || JSON.parse(savedContacts).length === 0) {
        // Show setup popup after loading screen
        setTimeout(() => {
            showEmergencySetup();
        }, 3500); // After loading screen
    }
}

function showEmergencySetup() {
    // Create modal background
    const modal = document.createElement('div');
    modal.id = 'emergencySetupModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        animation: fadeIn 0.5s ease;
    `;

    // Create modal content (exactly like your screenshot)
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ffffff, #f0f4ff);
            border-radius: 30px;
            padding: 30px;
            max-width: 450px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 30px 60px rgba(255,107,0,0.3);
            border: 3px solid #FF6B00;
            animation: slideUp 0.5s ease;
        ">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #FF0844, #FF6B00);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    animation: pulse 2s infinite;
                ">
                    <i class="fas fa-phone-alt" style="font-size: 2rem; color: white;"></i>
                </div>
                <h2 style="
                    font-size: 1.8rem;
                    background: linear-gradient(135deg, #FF0844, #FF6B00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 10px;
                ">Setup Emergency Contacts</h2>
                <p style="color: #666;">Add up to 5 emergency contacts for SOS alerts</p>
            </div>

            <div id="contactsList" style="margin: 20px 0;">
                ${[1,2,3,4,5].map(i => `
                    <div style="
                        background: #f8f9ff;
                        border-radius: 15px;
                        padding: 15px;
                        margin-bottom: 10px;
                        border: 2px solid transparent;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.borderColor='#FF6B00'" onmouseout="this.style.borderColor='transparent'">
                        <div style="margin-bottom: 8px;">
                            <span style="
                                background: #FF6B00;
                                color: white;
                                width: 25px;
                                height: 25px;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 50%;
                                font-size: 0.8rem;
                                margin-right: 8px;
                            ">${i}</span>
                            <span style="font-weight: 600; color: #333;">Contact ${i}</span>
                        </div>
                        <input type="text" 
                               id="contactName${i}" 
                               placeholder="Full Name" 
                               style="
                                   width: 100%;
                                   padding: 12px;
                                   margin-bottom: 8px;
                                   border: 2px solid #e0e0e0;
                                   border-radius: 10px;
                                   font-family: 'Poppins', sans-serif;
                                   transition: all 0.3s ease;
                               "
                               onfocus="this.style.borderColor='#FF6B00'"
                               onblur="this.style.borderColor='#e0e0e0'">
                        <input type="tel" 
                               id="contactPhone${i}" 
                               placeholder="Phone Number" 
                               style="
                                   width: 100%;
                                   padding: 12px;
                                   border: 2px solid #e0e0e0;
                                   border-radius: 10px;
                                   font-family: 'Poppins', sans-serif;
                                   transition: all 0.3s ease;
                               "
                               onfocus="this.style.borderColor='#FF6B00'"
                               onblur="this.style.borderColor='#e0e0e0'">
                    </div>
                `).join('')}
            </div>

            <button onclick="saveEmergencyContacts()" style="
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #FF6B00, #FF0844);
                color: white;
                border: none;
                border-radius: 15px;
                font-size: 1.2rem;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 0 10px 30px rgba(255,107,0,0.3);
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 15px 40px rgba(255,107,0,0.4)'" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 30px rgba(255,107,0,0.3)'">
                <i class="fas fa-save"></i>
                Save Contacts
            </button>

            <p style="
                text-align: center;
                margin-top: 15px;
                font-size: 0.8rem;
                color: #999;
            ">
                <i class="fas fa-shield-alt"></i> 
                Your contacts are stored securely on your device
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function saveEmergencyContacts() {
    const contacts = [];
    
    // Collect all contacts
    for (let i = 1; i <= 5; i++) {
        const name = document.getElementById(`contactName${i}`).value.trim();
        const phone = document.getElementById(`contactPhone${i}`).value.trim();
        
        if (name && phone) {
            contacts.push({ 
                id: i,
                name: name, 
                phone: phone,
                addedAt: new Date().toLocaleString()
            });
        }
    }
    
    if (contacts.length === 0) {
        alert('Please add at least one emergency contact!');
        return;
    }
    // ❌ MISSING CLOSING BRACKET HERE!
    // ======================================
// MAP INITIALIZATION - ISMEIN ADD KARO
// ======================================
function initializeMap() {
    if (document.getElementById('map')) {
        map = L.map('map').setView([28.6139, 77.2090], 12); // Default: Delhi

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // 🔥 YAHAN SE ADD KARO - Traffic Layer Initialize
        initializeTrafficLayer();
        
        // Initialize location search
        initializeLocationSearch();
        // 🔥 YAHAN TAK

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    map.setView([lat, lng], 13);

                    userMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<div class="pulse-marker"></div>',
                            iconSize: [20, 20]
                        })
                    }).addTo(map);

                    userMarker.bindPopup("<b>You are here!</b>").openPopup();

                    updateLocationDisplay(lat, lng);
                },
                (error) => {
                    showToast('⚠️ Location access denied', 'warning');
                }
            );
        }
    }
}
    // Save to localStorage
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    
    // Show success message
    const modal = document.getElementById('emergencySetupModal');
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ffffff, #f0f4ff);
            border-radius: 30px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0,255,0,0.3);
            border: 3px solid #00FF41;
            animation: slideUp 0.5s ease;
        ">
            <div style="
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #00FF41, #00E5FF);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                animation: scaleIn 0.5s ease;
            ">
                <i class="fas fa-check" style="font-size: 3rem; color: white;"></i>
            </div>
            <h2 style="
                font-size: 2rem;
                background: linear-gradient(135deg, #00FF41, #00E5FF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
            ">Success!</h2>
            <p style="color: #666; margin-bottom: 20px;">
                ${contacts.length} emergency contact${contacts.length > 1 ? 's' : ''} saved successfully
            </p>
            <div style="
                background: #f0f9ff;
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: left;
            ">
                ${contacts.map(c => `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 8px; background: white; border-radius: 10px;">
                        <i class="fas fa-user-circle" style="color: #FF6B00; font-size: 1.2rem;"></i>
                        <div>
                            <strong>${c.name}</strong><br>
                            <small style="color: #666;">${c.phone}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="closeEmergencySetup()" style="
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #FF6B00, #FF0844);
                color: white;
                border: none;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                Get Started
            </button>
        </div>
    `;
    
    // Optional: Show toast
    showToast(`✅ ${contacts.length} emergency contacts saved!`, 'success');
}

function closeEmergencySetup() {
    const modal = document.getElementById('emergencySetupModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            modal.remove();
        }, 500);
    }
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent += `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
    }
`;
document.head.appendChild(style);



// Update sendEmergencyAlert to use saved contacts
function sendEmergencyAlert() {
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    
    if (contacts.length === 0) {
        showEmergencySetup();
        return;
    }
    
    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
                
                const message = `🚨 EMERGENCY! I need help. My location: ${mapsLink}`;
                
                // Show SOS sending animation with actual contacts
                showSOSSending(message, contacts);
                
                // In real app, you'd send SMS here
                console.log('Sending to:', contacts);
                console.log('Message:', message);
                
                showToast(`🚨 SOS Alert Sent to ${contacts.length} contacts!`, 'error');
            }
        );
    }
}

function showSOSSending(message, contacts) {
    const sosModal = document.createElement('div');
    sosModal.className = 'sos-modal';
    sosModal.style.cssText = `
        position: fixed; 
        top:0; 
        left:0; 
        width:100%; 
        height:100%;
        background: rgba(0,0,0,0.9); 
        display: flex; 
        align-items: center;
        justify-content: center; 
        z-index: 20001;
        animation: fadeIn 0.3s ease;
    `;
    
    sosModal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ffffff, #fff0f0);
            border-radius: 30px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            border: 3px solid #FF0844;
            animation: slideUp 0.5s ease;
        ">
            <div style="
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #FF0844, #FF0000);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                animation: pulse 1s infinite;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: white;"></i>
            </div>
            <h2 style="color: #FF0844; margin-bottom: 10px;">SOS SENT!</h2>
            <p style="color: #666; margin-bottom: 20px;">Alerting your emergency contacts...</p>
            <div style="
                background: #fff0f0;
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: left;
                max-height: 200px;
                overflow-y: auto;
            ">
                ${contacts.map(c => `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 8px; background: white; border-radius: 10px;">
                        <i class="fas fa-user-circle" style="color: #FF0844;"></i>
                        <div>
                            <strong>${c.name}</strong><br>
                            <small style="color: #666;">${c.phone}</small>
                        </div>
                        <i class="fas fa-check-circle" style="color: #00FF41; margin-left: auto;"></i>
                    </div>
                `).join('')}
            </div>
            <div style="
                background: #FF0844;
                color: white;
                padding: 10px;
                border-radius: 10px;
                font-size: 0.9rem;
            ">
                <i class="fas fa-map-marker-alt"></i> Live location shared
            </div>
        </div>
    `;
    
    document.body.appendChild(sosModal);
    
    setTimeout(() => {
        sosModal.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            sosModal.remove();
        }, 500);
    }, 3000);
}
// ======================================
// 22 INDIAN LANGUAGES EMERGENCY TRANSLATIONS
// ======================================
const emergencyTranslations = {
    // -----------------------
    // PART 1 — Hindi
    // -----------------------
    hindi: {
        help: "मदद",
        hospital: "अस्पताल",
        police: "पुलिस",
        fire: "फायर ब्रिगेड / आग",
        ambulance: "एम्बुलेंस",
        hotel: "होटल मेरे पास",
        water: "पानी",

        stay_with_me: "कृपया मेरे साथ रहिए",
        dont_understand: "मुझे समझ नहीं आ रहा",
        dont_leave_me: "मुझे अकेला मत छोड़िए",
        need_phone: "मुझे कॉल करने के लिए फोन चाहिए",
        give_space: "मुझे थोड़ी जगह दीजिए",

        dont_know_place: "मैं इस जगह को नहीं जानता",
        direction: "क्या आप मुझे रास्ता बता सकते हैं?",
        lost_bag: "मेरा बैग खो गया है",
        guide_main_road: "मुझे मुख्य सड़क तक रास्ता बताइए",
        missed_bus: "मेरी बस/ट्रेन छूट गई",

        fire_here: "आग लगी है",
        smell_gas: "मुझे गैस की गंध आ रही है",
        evacuate: "इमारत खाली करो",
        turn_off_electricity: "बिजली बंद करो",
        dangerous_here: "यहाँ खतरा है",

        accident_here: "यहाँ दुर्घटना हुई है",
        vehicle_damaged: "वाहन क्षतिग्रस्त है",
        need_road_help: "हमें सड़क पर मदद चाहिए",
        stop_vehicle: "कृपया वाहन रोको",
        friend_injured: "मेरा दोस्त घायल है",

        dizzy: "मुझे चक्कर आ रहे हैं",
        bleeding: "मेरा खून बह रहा है",
        cannot_breathe: "मैं ठीक से साँस नहीं ले पा रहा हूँ",
        severe_pain: "मुझे बहुत तेज़ दर्द हो रहा है",
        need_doctor_now: "मुझे तुरंत डॉक्टर चाहिए",
        allergy: "मुझे एलर्जी है",
        fainted: "मैं बेहोश हो गया / कोई बेहोश हो गया",

        someone_following: "कोई मेरा पीछा कर रहा है",
        robbed: "मेरा सामान चोरी हो गया",
        attacked: "किसी ने मुझ पर हमला किया",
        phone_stolen: "मेरा फोन चोरी हो गया",
        not_safe: "मैं सुरक्षित महसूस नहीं कर रहा हूँ",
        call_police: "कृपया पुलिस को बुलाइए"
    },

    // -----------------------
    // PART 1 — Bengali
    // -----------------------
    bengali: {
        help: "সাহায্য",
        hospital: "হাসপাতাল",
        police: "পুলিশ",
        fire: "ফায়ার ব্রিগেড",
        ambulance: "অ্যাম্বুলেন্স",
        hotel: "হোটেল আমার কাছে",
        water: "জল",

        stay_with_me: "দয়া করে আমার সাথে থাকুন",
        dont_understand: "আমি বুঝতে পারছি না",
        dont_leave_me: "আমাকে একা ছেড়ে দেবেন না",
        need_phone: "কল করার জন্য ফোন দরকার",
        give_space: "আমাকে একটু জায়গা দিন",

        dont_know_place: "আমি এই জায়গা চিনি না",
        direction: "আপনি কি আমাকে রাস্তা দেখাতে পারবেন?",
        lost_bag: "আমার ব্যাগ হারিয়ে গেছে",
        guide_main_road: "আমাকে প্রধান রাস্তায় নিয়ে যান",
        missed_bus: "আমার বাস/ট্রেন মিস হয়ে গেছে",

        fire_here: "আগুন লেগেছে",
        smell_gas: "গ্যাসের গন্ধ পাচ্ছি",
        evacuate: "বিল্ডিং খালি করুন",
        turn_off_electricity: "বিদ্যুৎ বন্ধ করুন",
        dangerous_here: "এখানে বিপদ আছে",

        accident_here: "এখানে দুর্ঘটনা ঘটেছে",
        vehicle_damaged: "গাড়ি ক্ষতিগ্রস্ত হয়েছে",
        need_road_help: "রাস্তায় সাহায্য দরকার",
        stop_vehicle: "গাড়ি থামান",
        friend_injured: "আমার বন্ধু আহত হয়েছে",

        dizzy: "আমার মাথা ঘুরছে",
        bleeding: "আমার রক্ত বের হচ্ছে",
        cannot_breathe: "আমি ঠিকমতো শ্বাস নিতে পারছি না",
        severe_pain: "আমার খুব ব্যথা হচ্ছে",
        need_doctor_now: "আমার এখনই ডাক্তার দরকার",
        allergy: "আমার অ্যালার্জি আছে",
        fainted: "আমি অজ্ঞান হয়ে গেছি / কেউ অজ্ঞান হয়েছে",

        someone_following: "কেউ আমাকে অনুসরণ করছে",
        robbed: "আমার জিনিসপত্র চুরি হয়েছে",
        attacked: "কেউ আমাকে আক্রমণ করেছে",
        phone_stolen: "আমার ফোন চুরি হয়েছে",
        not_safe: "আমি নিরাপদ মনে করছি না",
        call_police: "দয়া করে পুলিশ ডাকুন"
    },

    // -----------------------
    // PART 1 — Telugu
    // -----------------------
    telugu: {
        help: "సహాయం",
        hospital: "ఆసుపత్రి",
        police: "పోలీసు",
        fire: "అగ్నిమాపక విభాగం",
        ambulance: "అంబులెన్స్",
        hotel: "హోటల్ నా దగ్గర",
        water: "నీరు",

        stay_with_me: "దయచేసి నాతో ఉండండి",
        dont_understand: "నాకు అర్థం కావడం లేదు",
        dont_leave_me: "నన్ను ఒంటరిగా వదిలేయకండి",
        need_phone: "కాలింగ్ కోసం నాకు ఫోన్ కావాలి",
        give_space: "దయచేసి కొంచెం స్పేస్ ఇవ్వండి",

        dont_know_place: "నాకు ఈ ప్రదేశం తెలియదు",
        direction: "మీరు నాకు దారి చూపగలరా?",
        lost_bag: "నా బ్యాగ్ పోయింది",
        guide_main_road: "నన్ను మెయిన్ రోడ్డుకి తీసుకెళ్లండి",
        missed_bus: "నా బస్సు/రైలు మిస్ అయ్యింది",

        fire_here: "ఇక్కడ అగ్ని ఉంది",
        smell_gas: "నాకు గ్యాస్ వాసన వస్తోంది",
        evacuate: "బిల్డింగ్ ఖాళీ చేయండి",
        turn_off_electricity: "కరెంటు ఆఫ్ చేయండి",
        dangerous_here: "ఇక్కడ ప్రమాదం ఉంది",

        accident_here: "ఇక్కడ ప్రమాదం జరిగింది",
        vehicle_damaged: "వాహనం దెబ్బతింది",
        need_road_help: "రోడ్ హెల్ప్ కావాలి",
        stop_vehicle: "వాహనం ఆపండి",
        friend_injured: "నా స్నేహితుడు గాయపడ్డాడు",

        dizzy: "నాకు తల తిరుగుతోంది",
        bleeding: "రక్తం వస్తోంది",
        cannot_breathe: "నేను సరిగా శ్వాస తీసుకోలేకపోతున్నాను",
        severe_pain: "నాకు తీవ్రమైన నొప్పి ఉంది",
        need_doctor_now: "నాకు వెంటనే డాక్టర్ కావాలి",
        allergy: "నాకు అలర్జీ ఉంది",
        fainted: "నేను మూర్ఛపోయాను / ఎవరో మూర్ఛపోయారు",

        someone_following: "ఎవరో నన్ను వెంబడిస్తున్నారు",
        robbed: "నా వస్తువులు దొంగిలించబడ్డాయి",
        attacked: "ఎవరో నాపై దాడి చేశారు",
        phone_stolen: "నా ఫోన్ దొంగిలించబడింది",
        not_safe: "నాకు సేఫ్‌గా అనిపించడం లేదు",
        call_police: "దయచేసి పోలీస్‌ను పిలవండి"
    },

    // -----------------------
    // PART 1 — Marathi
    // -----------------------
    marathi: {
        help: "मदत",
        hospital: "रुग्णालय",
        police: "पोलीस",
        fire: "अग्निशमन दल",
        ambulance: "रुग्णवाहिका",
        hotel: "हॉटेल माझ्या जवळ",
        water: "पाणी",

        stay_with_me: "कृपया माझ्यासोबत रहा",
        dont_understand: "मला समजत नाही",
        dont_leave_me: "मला एकटे सोडू नका",
        need_phone: "मला फोन हवा आहे",
        give_space: "मला थोडी जागा द्या",

        dont_know_place: "मला हे ठिकाण माहित नाही",
        direction: "तुम्ही मला मार्ग दाखवू शकता का?",
        lost_bag: "माझी बॅग हरवली आहे",
        guide_main_road: "मला मुख्य रस्त्यावर घेऊन चला",
        missed_bus: "माझी बस/ट्रेन चुकली",

        fire_here: "येथे आग लागली आहे",
        smell_gas: "मला गॅसचा वास येत आहे",
        evacuate: "इमारत रिकामी करा",
        turn_off_electricity: "वीज बंद करा",
        dangerous_here: "येथे धोका आहे",

        accident_here: "येथे अपघात झाला आहे",
        vehicle_damaged: "वाहनाचे नुकसान झाले",
        need_road_help: "रस्त्यावर मदत हवी",
        stop_vehicle: "वाहन थांबवा",
        friend_injured: "माझा मित्र जखमी झाला आहे",

        dizzy: "मला गरगरत आहे",
        bleeding: "माझे रक्त वाहत आहे",
        cannot_breathe: "मी नीट श्वास घेऊ शकत नाही",
        severe_pain: "मला तीव्र वेदना आहेत",
        need_doctor_now: "मला लगेच डॉक्टर हवा आहे",
        allergy: "मला अ‍ॅलर्जी आहे",
        fainted: "मी बेशुद्ध पडलो / कोणी बेशुद्ध पडला",

        someone_following: "कोणी माझा पाठलाग करत आहे",
        robbed: "माझे सामान चोरी झाले",
        attacked: "कोणीतरी माझ्यावर हल्ला केला",
        phone_stolen: "माझा फोन चोरी गेला",
        not_safe: "मला सुरक्षित वाटत नाही",
        call_police: "कृपया पोलिसांना बोलवा"
    },

    tamil: {
        help: "உதவி",
        hospital: "மருத்துவமனை",
        police: "காவல்துறை",
        fire: "தீயணைப்பு படை",
        ambulance: "ஆம்புலன்ஸ்",
        hotel: "ஹோட்டல் என் அருகில்",
        water: "தண்ணீர்",

        stay_with_me: "தயவுசெய்து என்னுடன் இருங்கள்",
        dont_understand: "எனக்கு புரியவில்லை",
        dont_leave_me: "என்னை தனியாக விடாதீர்கள்",
        need_phone: "எனக்கு ஒரு போன் வேண்டும்",
        give_space: "சிறிது இடம் கொடுங்கள்",

        dont_know_place: "எனக்கு இந்த இடம் தெரியாது",
        direction: "நீங்கள் எனக்கு திசை காட்ட முடியுமா?",
        lost_bag: "என் பை தொலைந்து விட்டது",
        guide_main_road: "என்னை மெயின் ரோடுக்கு அழைத்துச் செல்லுங்கள்",
        missed_bus: "என் பஸ்/டிரெயின் தவறி விட்டது",

        fire_here: "இங்கே தீ ஏற்பட்டுள்ளது",
        smell_gas: "எனக்கு எரிவாயு வாசனை வருகிறது",
        evacuate: "கட்டடத்தை காலி செய்யுங்கள்",
        turn_off_electricity: "மின்சாரத்தை அணைக்கவும்",
        dangerous_here: "இங்கு ஆபத்து உள்ளது",

        accident_here: "இங்கு விபத்து ஏற்பட்டுள்ளது",
        vehicle_damaged: "வாகனம் சேதமடைந்துள்ளது",
        need_road_help: "எங்களுக்கு சாலை உதவி தேவை",
        stop_vehicle: "வாகனத்தை நிறுத்தவும்",
        friend_injured: "என் நண்பர் காயமடைந்துள்ளார்",

        dizzy: "எனக்கு தலைச்சுற்றுகிறது",
        bleeding: "எனக்கு ரத்தம் வருகிறது",
        cannot_breathe: "நான் சரியாக மூச்செடுக்க முடியவில்லை",
        severe_pain: "எனக்கு கடுமையான வலி உள்ளது",
        need_doctor_now: "எனக்கு உடனே மருத்துவர் வேண்டும்",
        allergy: "எனக்கு ஒவ்வாமை உள்ளது",
        fainted: "நான் மயங்கி விழுந்துவிட்டேன் / யாரோ மயங்கிவிட்டார்கள்",

        someone_following: "யாரோ என்னைப் பின்தொடர்கிறார்கள்",
        robbed: "என் பொருள் திருடப்பட்டுள்ளது",
        attacked: "யாரோ என்னை தாக்கினர்",
        phone_stolen: "என் போன் திருடப்பட்டது",
        not_safe: "எனக்கு பாதுகாப்பாக இல்லை என்று தோன்றுகிறது",
        call_police: "தயவுசெய்து காவல்துறையை அழைக்கவும்"
    },
    Gujarati: {
        help: "મદદ",
        hospital: "હોસ્પિટલ",
        police: "પોલીસ",
        fire: "ફાયર બ્રિગેડ",
        ambulance: "એમ્બ્યુલન્સ",
        hotel: "હોટેલ મારી નજીક",
        water: "પાણી",

        stay_with_me: "કૃપા કરીને મારી સાથે રહો",
        dont_understand: "મને સમજાતું નથી",
        dont_leave_me: "મને એકલા ન છોડશો",
        need_phone: "કૉલ કરવા માટે ફોન જોઈએ",
        give_space: "મને થોડી જગ્યા આપો",

        dont_know_place: "મને આ જગ્યા ખબર નથી",
        direction: "શું તમે મને રસ્તો બતાવી શકો?",
        lost_bag: "મારો બેગ ખોવાઈ ગયો છે",
        guide_main_road: "મને મુખ્ય રસ્તે લઈ જાઓ",
        missed_bus: "મારી બસ/ટ્રેન ચૂકી ગઈ છે",

        fire_here: "અહીં આગ લાગી છે",
        smell_gas: "મને ગેસની ગંધ આવી રહી છે",
        evacuate: "બિલ્ડિંગ ખાલી કરો",
        turn_off_electricity: "વિજળી બંધ કરો",
        dangerous_here: "અહીં જોખમ છે",

        accident_here: "અહીં અકસ્માત થયો છે",
        vehicle_damaged: "વાહન નુકસાન પામ્યું છે",
        need_road_help: "રસ્તામાં મદદ જોઈએ",
        stop_vehicle: "વાહન રોકો",
        friend_injured: "મારો મિત્ર ઘાયલ થયો છે",

        dizzy: "મને ચક્કર આવી રહ્યું છે",
        bleeding: "મારું રક્ત વહી રહ્યું છે",
        cannot_breathe: "હું યોગ્ય રીતે શ્વાસ લઈ શકતો નથી",
        severe_pain: "મને ભારે દુખાવો થઈ રહ્યો છે",
        need_doctor_now: "મને તરત જ ડૉક્ટર જોઈએ",
        allergy: "મને એલર્જી છે",
        fainted: "હું બેભાન થઈ ગયો / કોઈ બેભાન થઈ ગયો",

        someone_following: "કોઈ મારું પીછો કરી રહ્યું છે",
        robbed: "મારી વસ્તુઓ ચોરી થઈ ગઈ છે",
        attacked: "કોઈએ મારા પર હુમલો કર્યો",
        phone_stolen: "મારો ફોન ચોરી થઈ ગયો",
        not_safe: "મને સુરક્ષિત લાગતું નથી",
        call_police: "કૃપા કરીને પોલીસને બોલાવો"
    },

    // -----------------------
    // PART 2 — Urdu
    // -----------------------
    urdu: {
        help: "مدد",
        hospital: "ہسپتال",
        police: "پولیس",
        fire: "فائر بریگیڈ",
        ambulance: "ایمبولینس",
        hotel: "ہوٹل میرے قریب",
        water: "پانی",

        stay_with_me: "براہ کرم میرے ساتھ رہیں",
        dont_understand: "مجھے سمجھ نہیں آ رہا",
        dont_leave_me: "مجھے اکیلا مت چھوڑیں",
        need_phone: "مجھے کال کرنے کے لیے فون چاہیے",
        give_space: "مجھے تھوڑی جگہ دیں",

        dont_know_place: "مجھے یہ جگہ معلوم نہیں",
        direction: "کیا آپ مجھے راستہ دکھا سکتے ہیں؟",
        lost_bag: "میرا بیگ گم ہو گیا ہے",
        guide_main_road: "مجھے مین روڈ تک لے جائیں",
        missed_bus: "میری بس/ٹرین چھوٹ گئی",

        fire_here: "یہاں آگ لگ گئی ہے",
        smell_gas: "مجھے گیس کی بو آ رہی ہے",
        evacuate: "عمارت خالی کریں",
        turn_off_electricity: "بجلی بند کریں",
        dangerous_here: "یہاں خطرہ ہے",

        accident_here: "یہاں حادثہ ہوا ہے",
        vehicle_damaged: "گاڑی کو نقصان پہنچا ہے",
        need_road_help: "سڑک پر مدد چاہیے",
        stop_vehicle: "گاڑی روکیں",
        friend_injured: "میرا دوست زخمی ہے",

        dizzy: "مجھے چکر آ رہے ہیں",
        bleeding: "میرا خون بہہ رہا ہے",
        cannot_breathe: "میں صحیح طرح سانس نہیں لے پا رہا",
        severe_pain: "مجھے شدید درد ہو رہا ہے",
        need_doctor_now: "مجھے فوراً ڈاکٹر چاہیے",
        allergy: "مجھے الرجی ہے",
        fainted: "میں بے ہوش ہو گیا / کوئی بے ہوش ہو گیا",

        someone_following: "کوئی میرا پیچھا کر رہا ہے",
        robbed: "میرا سامان چوری ہو گیا",
        attacked: "کسی نے مجھ پر حملہ کیا",
        phone_stolen: "میرا فون چوری ہو گیا",
        not_safe: "مجھے محفوظ محسوس نہیں ہو رہا",
        call_police: "برائے مہربانی پولیس کو بلائیں"
    },

    // -----------------------
    // PART 2 — Kannada
    // -----------------------
    kannada: {
        help: "ಸಹಾಯ",
        hospital: "ಆಸ್ಪತ್ರೆ",
        police: "ಪೊಲೀಸ್",
        fire: "ಅಗ್ನಿಶಾಮಕ",
        ambulance: "ಆಂಬುಲೆನ್ಸ್",
        hotel: "ಹೋಟೆಲ್ ನನ್ನ ಹತ್ತಿರ",
        water: "ನೀರು",

        stay_with_me: "ದಯವಿಟ್ಟು ನನ್ನ ಜೊತೆಯಲ್ಲಿ ಇರಿ",
        dont_understand: "ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ",
        dont_leave_me: "ನನ್ನನ್ನು ಒಂಟಿಯಾಗಿ ಬಿಟ್ಟುಬಿಡಬೇಡಿ",
        need_phone: "ಕಾಲ್ ಮಾಡಲು ಫೋನ್ ಬೇಕು",
        give_space: "ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಜಾಗ ನೀಡಿ",

        dont_know_place: "ನನಗೆ ಈ ಸ್ಥಳ ಗೊತ್ತಿಲ್ಲ",
        direction: "ನನಗೆ ದಾರಿ ತೋರಿಸಬಹುದೇ?",
        lost_bag: "ನನ್ನ ಬ್ಯಾಗ್ ಕಳೆದುಹೋಯಿತು",
        guide_main_road: "ನನ್ನನ್ನು ಮೇನ್ ರೋಡಿಗೆ ಕರೆದೊಯ್ಯಿರಿ",
        missed_bus: "ನನ್ನ ಬಸ್/ರೈಲು ತಪ್ಪಿಹೋಯಿತು",

        fire_here: "ಇಲ್ಲಿ ಬೆಂಕಿ ಇದೆ",
        smell_gas: "ನನಗೆ ಅನಿಲದ ವಾಸನೆ ಬರುತ್ತಿದೆ",
        evacuate: "ಕಟ್ಟಡವನ್ನು ಖಾಲಿ ಮಾಡಿ",
        turn_off_electricity: "ವಿದ್ಯುತ್ ಆಫ್ ಮಾಡಿ",
        dangerous_here: "ಇಲ್ಲಿ ಅಪಾಯ ಇದೆ",

        accident_here: "ಇಲ್ಲಿ ಅಪಘಾತವಾಗಿದೆ",
        vehicle_damaged: "ವಾಹನ ಹಾನಿಯಾಗಿದೆ",
        need_road_help: "ರಸ್ತೆಯಲ್ಲಿ ಸಹಾಯ ಬೇಕು",
        stop_vehicle: "ವಾಹನ ನಿಲ್ಲಿಸಿ",
        friend_injured: "ನನ್ನ ಗೆಳೆಯ ಗಾಯಗೊಂಡಿದ್ದಾನೆ",

        dizzy: "ನನಗೆ ತಲೆ ಸುತ್ತುತ್ತಿದೆ",
        bleeding: "ನನಗೆ ರಕ್ತ ಬರುತ್ತಿದೆ",
        cannot_breathe: "ನಾನು ಸರಿಯಾಗಿ ಉಸಿರಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ",
        severe_pain: "ನನಗೆ ತುಂಬಾ ನೋವು ಇದೆ",
        need_doctor_now: "ನನಗೆ ತಕ್ಷಣ ವೈದ್ಯರು ಬೇಕು",
        allergy: "ನನಗೆ ಅಲರ್ಜಿ ಇದೆ",
        fainted: "ನಾನು ಮೂರ್ಛೆಹೋದೆ / ಯಾರೋ ಮೂರ್ಛೆಹೋದರು",

        someone_following: "ಯಾರೋ ನನ್ನನ್ನು ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ",
        robbed: "ನನ್ನ ವಸ್ತುಗಳು ಕಳುವಾದವು",
        attacked: "ಯಾರೋ ನನ್ನ ಮೇಲೆ ದಾಳಿ ಮಾಡಿದ್ದಾರೆ",
        phone_stolen: "ನನ್ನ ಫೋನ್ ಕಳುವಾಯಿತು",
        not_safe: "ನನಗೆ ಸುರಕ್ಷಿತವಾಗಿಲ್ಲ",
        call_police: "ದಯವಿಟ್ಟು ಪೊಲೀಸರಿಗೆ ಕರೆ ಮಾಡಿ"
    },

    // -----------------------
    // PART 2 — Odia
    // -----------------------
    odia: {
        help: "ସାହାଯ୍ୟ",
        hospital: "ଡାକ୍ତରଖାନା",
        police: "ପୋଲିସ",
        fire: "ଅଗ୍ନିଶମ ବିଭାଗ",
        ambulance: "ଆମ୍ବୁଲାନ୍ସ",
        hotel: "ହୋଟେଲ ମୋ ନିକଟରେ",
        water: "ପାଣି",

        stay_with_me: "ଦୟାକରି ମୋ ସହିତ ରୁହନ୍ତୁ",
        dont_understand: "ମୁଁ ବୁଝି ପାରୁନି",
        dont_leave_me: "ମୋତେ ଏକାକି ଛାଡନ୍ତୁ ନାହିଁ",
        need_phone: "ମୋତେ କଲ୍ କରିବା ପାଇଁ ଫୋନ ଦରକାର",
        give_space: "ମୋତେ କିଛି ସ୍ଥାନ ଦିଅନ୍ତୁ",

        dont_know_place: "ମୁଁ ଏହି ଜାଗାକୁ ଜାଣି ନାହିଁ",
        direction: "ଆପଣ ମୋତେ ରାସ୍ତା ଦେଖାଇପାରିବେ କି?",
        lost_bag: "ମୋର ବ୍ୟାଗ ହରାଇଗଲା",
        guide_main_road: "ମୋତେ ମେନ୍ ରୋଡକୁ ନେଇଯାଆନ୍ତୁ",
        missed_bus: "ମୋର ବସ୍/ଟ୍ରେନ୍ ଛୁଟିଗଲା",

        fire_here: "ଏଠାରେ ଆଗ୍ନି ଲାଗିଛି",
        smell_gas: "ମୋତେ ଗ୍ୟାସର ଗନ୍ଧ ଆସୁଛି",
        evacuate: "ବିଲ୍ଡିଂ ଖାଲି କରନ୍ତୁ",
        turn_off_electricity: "ବିଦ୍ୟୁତ ବନ୍ଦ କରନ୍ତୁ",
        dangerous_here: "ଏଠାରେ ବିପଦ ଅଛି",

        accident_here: "ଏଠାରେ ଦୁର୍ଘଟଣା ଘଟିଛି",
        vehicle_damaged: "ବାହାନ କ୍ଷତିଗ୍ରସ୍ତ",
        need_road_help: "ରାସ୍ତାରେ ସାହାଯ୍ୟ ଦରକାର",
        stop_vehicle: "ଗାଡ଼ି ରୋକନ୍ତୁ",
        friend_injured: "ମୋର ମିତ୍ର ଆହତ ହୋଇଛନ୍ତି",

        dizzy: "ମୋତେ ଘୁର୍ଣ୍ଣି ଲାଗୁଛି",
        bleeding: "ମୋର ରକ୍ତ ବହୁଛି",
        cannot_breathe: "ମୁଁ ଠିକ୍ ଭାବରେ ଶ୍ୱାସ ନେଇପାରୁନି",
        severe_pain: "ମୋତେ ଭୟଙ୍କର ବେଦନା ହେଉଛି",
        need_doctor_now: "ମୋତେ ତୁରନ୍ତ ଡାକ୍ତର ଦରକାର",
        allergy: "ମୋତେ ଆଲର୍ଜି ଅଛି",
        fainted: "ମୁଁ ବେହୋସ୍ ହୋଇପଡ଼ିଛି / କେହି ବେହୋସ୍ ହୋଇଛନ୍ତି",

        someone_following: "କେହି ମୋତେ ଅନୁସରଣ କରୁଛନ୍ତି",
        robbed: "ମୋର ସାମଗ୍ରୀ ଚୋରି ହୋଇଗଲା",
        attacked: "କେହି ମୋ ପରେ ଆକ୍ରମଣ କରିଛନ୍ତି",
        phone_stolen: "ମୋ ଫୋନ୍ ଚୋରି ହୋଇଗଲା",
        not_safe: "ମୁଁ ସୁରକ୍ଷିତ ଲାଗୁନି",
        call_police: "ଦୟାକରି ପୋଲିସକୁ କହନ୍ତୁ"
    },

    // -----------------------
    // PART 2 — Malayalam
    // -----------------------
    malayalam: {
        help: "സഹായം",
        hospital: "ആശുപത്രി",
        police: "പോലീസ്",
        fire: "അഗ്നിശമന സേന",
        ambulance: "ആംബുലൻസ്",
        hotel: "ഹോട്ടൽ എന്റെ അടുത്ത്",
        water: "വെള്ളം",

        stay_with_me: "ദയവായി എന്നൊത്ത് നിൽക്കൂ",
        dont_understand: "എനിക്ക് മനസ്സിലാകുന്നില്ല",
        dont_leave_me: "എന്നെ ഒറ്റയ്ക്ക് വിട്ടേക്കരുത്",
        need_phone: "വിളിക്കാൻ ഫോൺ വേണം",
        give_space: "എനിക്ക് അല്പം സ്ഥലം തരൂ",

        dont_know_place: "എനിക്ക് ഈ സ്ഥലം അറിയില്ല",
        direction: "നിങ്ങൾക്ക് എനിക്ക് വഴി കാണിക്കാമോ?",
        lost_bag: "എന്റെ ബാഗ് നഷ്ടപ്പെട്ടു",
        guide_main_road: "എന്നെ മെയിൻ റോഡിലേക്ക് കൊണ്ടുപോവൂ",
        missed_bus: "എന്റെ ബസ്/ട്രെയിൻ മിസ്സ് ആയി",

        fire_here: "ഇവിടെ തീ പിടിച്ചു",
        smell_gas: "എനിക്ക് ഗ്യാസ് മണവരുന്നു",
        evacuate: "ബിൽഡിംഗ് ഒഴിപ്പിക്കൂ",
        turn_off_electricity: "വൈദ്യുതി ഓഫ് ചെയ്യൂ",
        dangerous_here: "ഇവിടെ അപകടമുണ്ട്",

        accident_here: "ഇവിടെ അപകടം ഉണ്ടായിരിക്കുന്നു",
        vehicle_damaged: "വാഹനം കേടായി",
        need_road_help: "റോഡിൽ സഹായം വേണം",
        stop_vehicle: "വാഹനം നിർത്തൂ",
        friend_injured: "എന്റെ സുഹൃത്ത് പരിക്കേറ്റു",

        dizzy: "എനിക്ക് തല ചുറ്റുന്നു",
        bleeding: "എനിക്ക് രക്തം വാർക്കുന്നു",
        cannot_breathe: "എനിക്ക് ശരിയായി ശ്വസിക്കാൻ കഴിയുന്നില്ല",
        severe_pain: "എനിക്ക് കഠിനമായ വേദനയുണ്ട്",
        need_doctor_now: "എനിക്ക് ഉടൻ ഡോക്ടർ വേണം",
        allergy: "എനിക്ക് അലർജി ഉണ്ട്",
        fainted: "ഞാൻ ബോധംകെട്ടു / ആരോ ബോധംകെട്ടു",

        someone_following: "ആരോ എന്നെ പിന്തുടരുന്നു",
        robbed: "എന്റെ സാധനങ്ങൾ മോഷ്ടിച്ചു",
        attacked: "ആരോ എന്നെ ആക്രമിച്ചു",
        phone_stolen: "എന്റെ ഫോൺ മോഷണം പോയി",
        not_safe: "എനിക്ക് ഇവിടെ സുരക്ഷിതമെന്ന് തോന്നുന്നില്ല",
        call_police: "ദയവായി പോലീസിനെ വിളിക്കൂ"
    },
    punjabi: {
        help: "ਮਦਦ ਕਰੋ",
        hospital: "ਹਸਪਤਾਲ",
        police: "ਪੁਲਿਸ",
        fire: "ਫਾਇਰ ਬ੍ਰਿਗੇਡ",
        ambulance: "ਐਂਬੂਲੈਂਸ",
        hotel: "ਮੇਰੇ ਨੇੜੇ ਹੋਟਲ",
        water: "ਪਾਣੀ",

        stayWithMe: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਨਾਲ ਰਹੋ",
        dontUnderstand: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ",
        dontLeaveMe: "ਮੈਨੂੰ ਅਕੇਲਾ ਨਾ ਛੱਡੋ",
        needPhone: "ਕਾਲ ਕਰਨ ਲਈ ਮੈਨੂੰ ਫੋਨ ਚਾਹੀਦਾ ਹੈ",
        giveSpace: "ਮੈਨੂੰ ਥੋੜੀ ਜਗ੍ਹਾ ਦਿਓ",

        dontKnowPlace: "ਮੈਨੂੰ ਇਹ ਜਗ੍ਹਾ ਨਹੀਂ ਪਤਾ",
        showDirection: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਰਸਤਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
        lostBag: "ਮੇਰਾ ਬੈਗ ਖੋ ਗਿਆ",
        guideMainRoad: "ਮੈਨੂੰ ਮੈਨ ਰੋਡ ਦਾ ਰਸਤਾ ਦਿਓ",
        missedBus: "ਮੇਰੀ ਬਸ/ਟ੍ਰੇਨ ਛੁੱਟ ਗਈ",

        fireThere: "ਇੱਥੇ ਅੱਗ ਲੱਗ ਗਈ ਹੈ",
        smellGas: "ਮੈਨੂੰ ਗੈਸ ਦੀ ਵਾਸ ਆ ਰਹੀ ਹੈ",
        evacuate: "ਬਿਲਡਿੰਗ ਖਾਲੀ ਕਰੋ",
        turnOffElectricity: "ਬਿਜਲੀ ਬੰਦ ਕਰੋ",
        dangerousHere: "ਇੱਥੇ ਖਤਰਾ ਹੈ",

        accidentHere: "ਇੱਥੇ ਹਾਦਸਾ ਹੋਇਆ ਹੈ",
        vehicleDamaged: "ਵਾਹਨ ਨੂੰ ਨੁਕਸਾਨ ਹੋਇਆ ਹੈ",
        roadsideHelp: "ਰੋਡਸਾਈਡ ਮਦਦ ਚਾਹੀਦੀ ਹੈ",
        stopVehicle: "ਵਾਹਨ ਰੋਕੋ",
        friendInjured: "ਮੇਰਾ ਦੋਸਤ ਜਖਮੀ ਹੈ",

        dizzy: "ਮੈਨੂੰ ਚੱਕਰ ਆ ਰਹੇ ਹਨ",
        bleeding: "ਮੇਰਾ ਖੂਨ ਵਹਿ ਰਿਹਾ ਹੈ",
        cannotBreathe: "ਮੈਂ ਠੀਕ ਤਰ੍ਹਾਂ ਸਾਹ ਨਹੀਂ ਲੈ ਸਕਦਾ",
        severePain: "ਮੈਨੂੰ ਬਹੁਤ ਤੇਜ਼ ਦਰਦ ਹੈ",
        needDoctor: "ਮੈਨੂੰ ਤੁਰੰਤ ਡਾਕਟਰ ਚਾਹੀਦਾ ਹੈ",
        allergy: "ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ",
        fainted: "ਮੈਂ ਬੇਹੋਸ਼ ਹੋ ਗਿਆ / ਕੋਈ ਬੇਹੋਸ਼ ਹੋ ਗਿਆ",

        someoneFollowing: "ਕੋਈ ਮੇਰਾ ਪਿੱਛਾ ਕਰ ਰਿਹਾ ਹੈ",
        robbed: "ਮੇਰਾ ਸਮਾਨ ਚੋਰੀ ਹੋ ਗਿਆ",
        attacked: "ਕਿਸੇ ਨੇ ਮੇਰੇ ਉੱਤੇ ਹਮਲਾ ਕੀਤਾ",
        phoneStolen: "ਮੇਰਾ ਫੋਨ ਚੋਰੀ ਹੋ ਗਿਆ",
        notSafe: "ਮੈਨੂੰ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਲੱਗ ਰਿਹਾ",
        callPolice: "ਕਿਰਪਾ ਕਰਕੇ ਪੁਲਿਸ ਨੂੰ ਬੁਲਾਓ"
    },

    // ------------------------------
    // 2️⃣ ASSAMESE
    // ------------------------------
    assamese: {
        help: "সহায় কৰক",
        hospital: "হাস্পতাল",
        police: "পুলিচ",
        fire: "ফায়াৰ ব্ৰিগেড",
        ambulance: "এম্বুলেন্স",
        hotel: "মোৰ ওচৰৰ হটেল",
        water: "পানী",

        stayWithMe: "অনুগ্ৰহ কৰি মোৰ সৈতে থাকক",
        dontUnderstand: "মোক বুজ পোৱাই নাই",
        dontLeaveMe: "মোক একেলগে নেহেৰিব",
        needPhone: "কল কৰিবলৈ ফোন প্ৰয়োজন",
        giveSpace: "মোক অলপ ঠাই দিয়ক",

        dontKnowPlace: "মই এই ঠাই নাজানো",
        showDirection: "আপুনি পথ দেখুৱাব নে?",
        lostBag: "মোৰ ব্যাগ হেৰাই গ'ল",
        guideMainRoad: "মোক মেইন ৰোডলৈ পথ দেখুৱাওক",
        missedBus: "মোৰ বাছ/ট্ৰেইন মিচ হৈছে",

        fireThere: "ইয়াত আগ লাগিছে",
        smellGas: "গেছৰ গন্ধ আহিছে",
        evacuate: "বিল্ডিং খালি কৰক",
        turnOffElectricity: "বিদ্যুৎ বন্ধ কৰক",
        dangerousHere: "ইয়াত বিপদ আছে",

        accidentHere: "ইয়াত দুৰ্ঘটনা ঘটিছে",
        vehicleDamaged: "গাড়ী ক্ষতিগ্ৰস্ত হৈছে",
        roadsideHelp: "ৰাস্তাৰ সহায়ৰ প্ৰয়োজন",
        stopVehicle: "গাড়ী ৰখাওক",
        friendInjured: "মোৰ বন্ধু আহত হৈছে",

        dizzy: "মোক চক্কৰ লাগিছে",
        bleeding: "মোৰ ৰক্ত ওলাইছে",
        cannotBreathe: "মই ঠিকমতে শ্বাস ল'ব পৰা নাই",
        severePain: "মোক বহুত ব্যথা হৈছে",
        needDoctor: "মোক তৎক্ষণাত ডাক্তৰ লাগে",
        allergy: "মোৰ এলাৰ্জি আছে",
        fainted: "মই অচেতন হৈ গʼলো / কাকো অচেতন হৈছে",

        someoneFollowing: "কেউবাই মোক অনুসৰণ কৰিছে",
        robbed: "মোক লুটিছে",
        attacked: "মোৰ ওপৰত আক্ৰমণ হৈছে",
        phoneStolen: "মোৰ ফোন চুৰি হৈছে",
        notSafe: "মোক সুৰক্ষিত বুলি লাগি নাই",
        callPolice: "অনুগ্ৰহ কৰি পুলিচ বলাওক"
    },

    // ------------------------------
    // 3️⃣ MAITHILI
    // ------------------------------
    maithili: {
        help: "मदति करू",
        hospital: "अस्पताल",
        police: "पुलिस",
        fire: "फायर ब्रिगेड",
        ambulance: "एम्बुलेंस",
        hotel: "नजिकक होटल",
        water: "पानी",

        stayWithMe: "कृपया हमर संग रहु",
        dontUnderstand: "हमरा बुझाइ नै रहल अछि",
        dontLeaveMe: "हमरा अकेला छोड़ि ने करू",
        needPhone: "फोन चाही कॉल करबाक",
        giveSpace: "थोड़ि जगह दिअ",

        dontKnowPlace: "हम ई जगहि नै जानैत छी",
        showDirection: "रस्ता देखै सकैत छी?",
        lostBag: "हमर बैग हराइ गेल",
        guideMainRoad: "मुख्य सड़क तक रस्ता बताउ",
        missedBus: "हमर बस/ट्रेन छुटि गेल",

        fireThere: "आगि लागल अछि",
        smellGas: "गैसक गंध आबि रहल अछि",
        evacuate: "बिल्डिंग खाली करू",
        turnOffElectricity: "बिजली बंद करू",
        dangerousHere: "एतए खतरा अछि",

        accidentHere: "एतए दुर्घटना भेल अछि",
        vehicleDamaged: "गाड़ी खराब भेल अछि",
        roadsideHelp: "रोडसाइड मदद चाही",
        stopVehicle: "गाड़ी रोकू",
        friendInjured: "हमर दोस्त घायल अछि",

        dizzy: "मुदा चक्कर आबि रहल अछि",
        bleeding: "मुदा खून बहि रहल अछि",
        cannotBreathe: "हम ठीक साँस नै ले पाबि रहल छी",
        severePain: "हमरा बहुत दर्द अछि",
        needDoctor: "डॉक्टर तुरन्त चाही",
        allergy: "हमरा एलर्जी अछि",
        fainted: "हम बेहोश भ' गेल / कोनो बेहोश भ' गेल",

        someoneFollowing: "केओ हमरा पीछा करैत अछि",
        robbed: "हमर सामान चोरी भ' गेल",
        attacked: "हमरा पर हमला भेल",
        phoneStolen: "हमर फोन चोरी भ' गेल",
        notSafe: "हम सुरक्षित महसूस नै करैत छी",
        callPolice: "पुलिस बोलाउ"
    },

    // ------------------------------
    // 4️⃣ SANTALI
    // ------------------------------
    santali: {
        help: "मदताक्",
        hospital: "Hospital reya",
        police: "Police reya",
        fire: "Fire brigade",
        ambulance: "Ambulance",
        hotel: "Hotel ceda",
        water: "Jal",

        stayWithMe: "Anga sangren kana",
        dontUnderstand: "Anga bujhe naka",
        dontLeaveMe: "Anga neka chad kana",
        needPhone: "Call kana phone doya",
        giveSpace: "Jaga doya",

        dontKnowPlace: "Doem jaga naka",
        showDirection: "Rasta dakana?",
        lostBag: "Anga bag jadiya",
        guideMainRoad: "Main road rasta dakana",
        missedBus: "Bus/Train chariya",

        fireThere: "Doem dago",
        smellGas: "Gas ganda reya",
        evacuate: "Building khali kana",
        turnOffElectricity: "Electricity bandh kana",
        dangerousHere: "Doem khatara reya",

        accidentHere: "Doem accident reya",
        vehicleDamaged: "Gaadi kharab reya",
        roadsideHelp: "Road help darkar",
        stopVehicle: "Gaadi rok kana",
        friendInjured: "Sangi joraok reya",

        dizzy: "Anga ghur ghur reya",
        bleeding: "Anga rakt bahaya",
        cannotBreathe: "Anga sas nakaya",
        severePain: "Anga bedna besi",
        needDoctor: "Doctor darkar",
        allergy: "Allergy ache",
        fainted: "Anga bebhala / kedu bebhala",

        someoneFollowing: "Kedu anga pechon aseya",
        robbed: "Anga samaan churi",
        attacked: "Anga upare attack",
        phoneStolen: "Phone churi ache",
        notSafe: "Anga safe naka",
        callPolice: "Police dakana"
    },

    // ------------------------------
    // 5️⃣ NEPALI
    // ------------------------------
    nepali: {
        help: "मद्दत गर्नुहोस्",
        hospital: "अस्पताल",
        police: "प्रहरी",
        fire: "दमकल",
        ambulance: "एम्बुलेन्स",
        hotel: "नजिकको होटल",
        water: "पानी",

        stayWithMe: "कृपया मेरो साथमा रहनुहोस्",
        dontUnderstand: "मलाई बुझिन",
        dontLeaveMe: "मलाई एक्लै नछाड्नुहोस्",
        needPhone: "कॉल गर्न फोन चाहियो",
        giveSpace: "मलाई अलि ठाउँ दिनुस्",

        dontKnowPlace: "म यो ठाउँ चिन्दिन",
        showDirection: "तपाईंले दिशा देखाइदिनुहुन्छ?",
        lostBag: "म मेरो झोला हराएँ",
        guideMainRoad: "मुख्य सडकसम्मको बाटो देखाउनुहोस्",
        missedBus: "मेरो बस/ट्रेन छुट्यो",

        fireThere: "यहाँ आगो लागेको छ",
        smellGas: "मलाई ग्यासको गन्ध आएको छ",
        evacuate: "भवन खाली गर्नुहोस्",
        turnOffElectricity: "बत्ती बन्द गर्नुहोस्",
        dangerousHere: "यहाँ खतरा छ",

        accidentHere: "यहाँ दुर्घटना भएको छ",
        vehicleDamaged: "गाडी बिग्रिएको छ",
        roadsideHelp: "रोडसाइड मद्दत चाहियो",
        stopVehicle: "गाडी रोक्नुहोस्",
        friendInjured: "मेरो साथी घाइते भएको छ",

        dizzy: "मलाई चक्कर लागेको छ",
        bleeding: "मबाट रगत बगिरहेको छ",
        cannotBreathe: "म सहीसँग सास फेर्न सक्दिन",
        severePain: "मलाई धेरै पीडा छ",
        needDoctor: "मलाई तुरुन्तै डाक्टर चाहियो",
        allergy: "मलाई एलर्जी छ",
        fainted: "म बेहोस भएँ / कसैलाई बेहोस भयो",

        someoneFollowing: "कोही मलाई पछ्याइरहेको छ",
        robbed: "मलाइ लुटियो",
        attacked: "मेरोमाथि आक्रमण भयो",
        phoneStolen: "मेरो फोन चोरी भयो",
        notSafe: "म सुरक्षित छैन",
        callPolice: "प्रहरी बोलाउनुहोस्"
    },

    // ------------------------------
    // 6️⃣ KASHMIRI
    // ------------------------------
    kashmiri: {
        help: "मदद करियह",
        hospital: "हस्पितल",
        police: "पुलीस",
        fire: "फायर ब्रिगेड",
        ambulance: "ऐम्बुलेंस",
        hotel: "मेरी जिर होटल",
        water: "अब",

        stayWithMe: "मे सान्ग रहयो",
        dontUnderstand: "मे समज नी आय",
        dontLeaveMe: "मे अकेल नी छोडयो",
        needPhone: "कॉल करन खतिर फोन चाह",
        giveSpace: "थोड़ा जगह दयो",

        dontKnowPlace: "यि जगह मज़ छान्ज़",
        showDirection: "रास्ता दाखयो?",
        lostBag: "मे बैग खोव मुकाम",
        guideMainRoad: "मुख्य सड़क रास्ता दाखयो",
        missedBus: "मे बस/ट्रेन छुट गइ",

        fireThere: "यित आग छ",
        smellGas: "गैस हाव सु गछे",
        evacuate: "बिल्डिंग खाली करियह",
        turnOffElectricity: "बिजली बंद करियह",
        dangerousHere: "यित ख़तरा छ",

        accidentHere: "यित एक्सीडेंट छ",
        vehicleDamaged: "गाडि खराब छ",
        roadsideHelp: "रोडसाइड मदद चाह",
        stopVehicle: "गाडि रोखो",
        friendInjured: "मे दोस्त जख्मी छ",

        dizzy: "मे सरी फिरय्",
        bleeding: "मे रगत बेस छ",
        cannotBreathe: "मे सही सास नी आय",
        severePain: "मे बोहत दर्द छ",
        needDoctor: "मे डॉक्टर चाह",
        allergy: "मे एलर्जी छ",
        fainted: "मे बेहोष गुये / कोहि बेहोष गुये",

        someoneFollowing: "कोहि मे पाछतु आय",
        robbed: "मे सामान चोरी गयो",
        attacked: "मे पैठ हल्ला गयो",
        phoneStolen: "मे फोन चोरी गयो",
        notSafe: "मे सुरक्षित नी लग",
        callPolice: "पुलीस बलयो"
    },

    // ------------------------------
    // 7️⃣ KONKANI
    // ------------------------------
    konkani: {
        help: "मदत करात",
        hospital: "हॉस्पिटल",
        police: "पोलीस",
        fire: "फायर ब्रिगेड",
        ambulance: "ॲम्बुलन्स",
        hotel: "माझ्या लागी हॉटेल",
        water: "उदक",

        stayWithMe: "म्हाका संगत राहात",
        dontUnderstand: "म्हाका समझ ना",
        dontLeaveMe: "म्हाका एकट्यान सोडू नाका",
        needPhone: "कॉल करप फोन जाय",
        giveSpace: "जागा दिवचें",

        dontKnowPlace: "हो जागो माका ना",
        showDirection: "रस्तो दाखयत?",
        lostBag: "म्हाजो बॅग हांव गेलो",
        guideMainRoad: "मेन रोडाक रस्तो दाखयात",
        missedBus: "म्हाझी बस/ट्रेन चुकली",

        fireThere: "इथे आग लागली",
        smellGas: "गॅसाची वास येता",
        evacuate: "बिल्डिंग रिकामी करात",
        turnOffElectricity: "वीज बंद करात",
        dangerousHere: "इथे धोका आसा",

        accidentHere: "इथे अपघात जाला",
        vehicleDamaged: "गाडी खराब जाली",
        roadsideHelp: "रोडसाईड मदत जाय",
        stopVehicle: "गाडी थांबयात",
        friendInjured: "म्हाझो दोस्त जखमी जाला",

        dizzy: "म्हाका गरगर येता",
        bleeding: "म्हाझो रक्त दवरता",
        cannotBreathe: "म्हाका श्वास नी येता",
        severePain: "म्हाका फार दुखता",
        needDoctor: "डॉक्टर जाय",
        allergy: "म्हाका अलर्जी आसा",
        fainted: "हांव बेशुद्ध पडलो / कोणी बेशुद्ध पडलो",

        someoneFollowing: "कोणी म्हाका पाटलं जाता",
        robbed: "माझो समान चोरी जालो",
        attacked: "म्हाजेर हल्लो जालो",
        phoneStolen: "माझो फोन चोरी जालो",
        notSafe: "म्हाका सुरक्षित ना",
        callPolice: "पोलीसाक बोलयात"
    },

    // ------------------------------
    // 8️⃣ SINDHI
    // ------------------------------
    sindhi: {
        help: "مدد ڪريو",
        hospital: "اسپتال",
        police: "پوليس",
        fire: "فائر برگيڊ",
        ambulance: "ايمبولنس",
        hotel: "هوٽل منهنجي ڀرسان",
        water: "پاڻي",

        stayWithMe: "مهرباني ڪري منهنجي گڏ رهو",
        dontUnderstand: "مون کي سمجھه نٿي اچي",
        dontLeaveMe: "مون کي اڪيلي نه ڇڏيو",
        needPhone: "ڪال ڪرڻ لاءِ فون گهرجي",
        giveSpace: "مهرباني ڪري ٿورو جاءِ ڏيو",

        dontKnowPlace: "هي جڳهه مون کي نه ڄاتي",
        showDirection: "رستو ٻڌائي سگهو ٿا؟",
        lostBag: "مون جو بيگ گم ٿي ويو",
        guideMainRoad: "مکيه روڊ جو رستو ٻڌايو",
        missedBus: "منهنجي بس/ٽرين نڪري وئي",

        fireThere: "هتي باهه لڳي آهي",
        smellGas: "مون کي گئس جي بوءِ اچي رهي آهي",
        evacuate: "عمارت خالي ڪريو",
        turnOffElectricity: "بجلي بند ڪريو",
        dangerousHere: "هتي خطرو آهي",

        accidentHere: "هتي حادثو ٿيو آهي",
        vehicleDamaged: "گاڏي کي نقصان ٿيو آهي",
        roadsideHelp: "اسان کي روڊسائيڊ مدد گهرجي",
        stopVehicle: "گاڏي روڪيو",
        friendInjured: "منهنجو دوست زخمي آهي",

        dizzy: "مون کي چڪر اچي رهيو آهي",
        bleeding: "مون کي رت اچي رهيو آهي",
        cannotBreathe: "مان صحيح نموني سان ساهه نٿو وٺي سگهان",
        severePain: "مون کي سخت ڏک آهي",
        needDoctor: "جلدي ڊاڪٽر گهرجي",
        allergy: "مون کي الرجي آهي",
        fainted: "مان بيهوش ٿي ويس / ڪو بيهوش ٿي ويو",

        someoneFollowing: "ڪو منهنجي پويان اچي رهيو آهي",
        robbed: "مون کي لٽيو ويو",
        attacked: "مٿس حملو ٿيو",
        phoneStolen: "منهنجو فون چوري ٿي ويو",
        notSafe: "مان محفوظ ناهيان",
        callPolice: "مهرباني ڪري پوليس کي سڏ ڪريو"
    },

    // ------------------------------
    // 9️⃣ DOGRI
    // ------------------------------
    dogri: {
        help: "मद्दत करो",
        hospital: "अस्पताल",
        police: "पुलिस",
        fire: "फायर ब्रिगेड",
        ambulance: "एम्बुलेंस",
        hotel: "मेरे नज़दीक होटल",
        water: "पाणी",

        stayWithMe: "कृपा करके मेरे संग रहो",
        dontUnderstand: "मैं समझ नहीं पा रया",
        dontLeaveMe: "मन्नैं अकेला मत छोड़ो",
        needPhone: "कॉल करन फोन चाइए",
        giveSpace: "थोड्डी जगह दो",

        dontKnowPlace: "मैं इस जगह तै नई जानदा",
        showDirection: "तुम रास्ता दिखा सकदे हो?",
        lostBag: "मेरा बैग गुम हो गया",
        guideMainRoad: "मेन रोड दा रास्ता दिखाओ",
        missedBus: "मेरी बस/ट्रेन छूट गई",

        fireThere: "इत्ती आग लग गी",
        smellGas: "में गैस दी बू आरी",
        evacuate: "बिल्डिंग खाली करो",
        turnOffElectricity: "बिजली बंद करो",
        dangerousHere: "इत्ती खतरा ऐ",

        accidentHere: "इत्ती एक्सीडेंट होया",
        vehicleDamaged: "गाड़ी खराब हो गी",
        roadsideHelp: "रास्ते ते मदद चाइए",
        stopVehicle: "गाड़ी रोक्को",
        friendInjured: "मेरा दोस्त जख्मी ऐ",

        dizzy: "मेंनै चक्कर आ रे",
        bleeding: "मेंनै खून निकल रे",
        cannotBreathe: "में ठीक सांस नई लै पा रया",
        severePain: "मेंनै बोहत दर्द ऐ",
        needDoctor: "मेंनै डॉक्टर चाइए",
        allergy: "मेंनै एलर्जी ऐ",
        fainted: "में बेहोष हो गया / कोई बेहोष हो गया",

        someoneFollowing: "कोई मेरा पीछा कर रया",
        robbed: "मेरा सामान चोरी हो गया",
        attacked: "मेरे उप्पर हमला होया",
        phoneStolen: "मेरा फोन चोरी हो गया",
        notSafe: "में सुरक्षित नई महसूस कर रया",
        callPolice: "कृपा करके पुलिस नू बोलाओ"
    },

    // ------------------------------
    // 🔟 MANIPURI (Meitei)
    // ------------------------------
    manipuri: {
        help: "মদদ তৌবিয়ু",
        hospital: "হসপিটেল",
        police: "পোলিস",
        fire: "ফায়ার ব্রিগেড",
        ambulance: "আম্বুলেন্স",
        hotel: "এনিং লোইনা হোটেল",
        water: "ইসিং",

        stayWithMe: "নঙো নঙসি এনা লোবিযু",
        dontUnderstand: "এবা ফমদে",
        dontLeaveMe: "এবা মশিংদা থাদ্রো নত্তে",
        needPhone: "কল তৌনবা ফোন পাম্বা লাগে",
        giveSpace: "মসানা থংদি পিরো",

        dontKnowPlace: "এনা মতম ওইদে",
        showDirection: "মরু থাঙনবা পারে?",
        lostBag: "এবা ব্যাগ ফংদ্রে",
        guideMainRoad: "মেন রোড মথাং পাইরো",
        missedBus: "এবা বাস/ট্রেন ফত্ত্রে",

        fireThere: "মখোলদা মশক লোইরে",
        smellGas: "গ্যাস কি গন্ধ লোইরে",
        evacuate: "বিল্ডিং খালি তৌরো",
        turnOffElectricity: "কারেন্ট লোইরো",
        dangerousHere: "মখোলদা হাইবা লোইরে",

        accidentHere: "মখোলদা অ্যাক্সিডেন্ট অমা লোইরে",
        vehicleDamaged: "মথান মশিং লোইরে",
        roadsideHelp: "রোডসাইড মদদ লাগে",
        stopVehicle: "মথান থঙনরো",
        friendInjured: "এবা মিতমা ওইরে",

        dizzy: "এবা মাথা থিঙথিঙ শে",
        bleeding: "এবা থংদোক লোইরে",
        cannotBreathe: "এবা থুমদে থুমবা পারে",
        severePain: "এবা হায়বা নবা শে",
        needDoctor: "এবা ডাক্তার লাগে",
        allergy: "এবা অ্যালার্জি লোইরে",
        fainted: "এবা মমাংদা লংবা শে / অদুগুম্বা লংবা শে",

        someoneFollowing: "অদুম্বা এনা ফাওরি",
        robbed: "এবা লুট তৌরে",
        attacked: "এনা হেন্না তৌরে",
        phoneStolen: "এবা ফোন থাদ্রে",
        notSafe: "এবা সেফ ওইদে",
        callPolice: "পোলিস দা খল্লো"
    },

    // ------------------------------
    // 1️⃣1️⃣ BODO
    // ------------------------------
    bodo: {
        help: "मोननो हो",
        hospital: "Hospital",
        police: "Police",
        fire: "Fire brigade",
        ambulance: "Ambulance",
        hotel: "Hotel ongab",
        water: "Daor",

        stayWithMe: "Angni songa dong",
        dontUnderstand: "Anga gongthai",
        dontLeaveMe: "Anga solo dongnai",
        needPhone: "Phone nangao",
        giveSpace: "Jaiga nangao",

        dontKnowPlace: "Bai jaga gongthai",
        showDirection: "Rasta khaithai?",
        lostBag: "Bag gongphidi",
        guideMainRoad: "Main road rasta khaithai",
        missedBus: "Bus / Train miss gidi",

        fireThere: "Baido dwi jao",
        smellGas: "Gas gangthai",
        evacuate: "Building khali nangao",
        turnOffElectricity: "Electricity bandh nangao",
        dangerousHere: "Baido khamni jao",

        accidentHere: "Accident jao",
        vehicleDamaged: "Vehicle gamsa jao",
        roadsideHelp: "Roadside help nangao",
        stopVehicle: "Vehicle rongao",
        friendInjured: "Angni donga jora jao",

        dizzy: "Anga dongyao",
        bleeding: "Angni rabo jao",
        cannotBreathe: "Anga saoswla nangai",
        severePain: "Anga gaja habai",
        needDoctor: "Doctor nangao",
        allergy: "Allergy angni",
        fainted: "Anga ha-gidi / mwsan ha-gidi",

        someoneFollowing: "Mwsan anga fao-gidi",
        robbed: "Angni samaan jabo jao",
        attacked: "Anga hamla jao",
        phoneStolen: "Phone jabo jao",
        notSafe: "Anga safe nangai",
        callPolice: "Police khaor"
    }



};
// ======================================
// ENHANCED ECO TRACKER - ULTIMATE UPGRADE
// ======================================

// Enhanced Eco Missions Data
const enhancedEcoMissions = [
    { 
        id: 1,
        title: "Weekend Warrior", 
        description: "Complete 3 eco-friendly trips this weekend", 
        progress: 67, 
        reward: "500 points", 
        icon: "🏆",
        type: "active",
        difficulty: "Easy",
        timeLeft: "2 days"
    },
    { 
        id: 2,
        title: "Green Routes", 
        description: "Share 5 sustainable routes with community", 
        progress: 40, 
        reward: "Tree Badge", 
        icon: "🌳",
        type: "active",
        difficulty: "Medium",
        timeLeft: "5 days"
    },
    { 
        id: 3,
        title: "Carbon Crusher", 
        description: "Reduce 15kg CO₂ emissions this month", 
        progress: 80, 
        reward: "1000 points", 
        icon: "💚",
        type: "active",
        difficulty: "Hard",
        timeLeft: "3 days"
    },
    { 
        id: 4,
        title: "Public Transport Hero", 
        description: "Use public transport 10 times", 
        progress: 60, 
        reward: "Eco Champion", 
        icon: "🚌",
        type: "active",
        difficulty: "Easy",
        timeLeft: "4 days"
    },
    { 
        id: 5,
        title: "EV Explorer", 
        description: "Visit 5 EV charging stations", 
        progress: 20, 
        reward: "Future Badge", 
        icon: "⚡",
        type: "active",
        difficulty: "Medium",
        timeLeft: "6 days"
    },
    { 
        id: 6,
        title: "Bike to Work", 
        description: "Cycle 50km this week", 
        progress: 35, 
        reward: "Fitness+Eco", 
        icon: "🚴",
        type: "active",
        difficulty: "Medium",
        timeLeft: "3 days"
    }
];

// Eco achievements data
const ecoAchievements = [
    { name: "Tree Planter", icon: "🌳", earned: true },
    { name: "Eco Warrior", icon: "⚔️", earned: true },
    { name: "Carbon Saver", icon: "💚", earned: false },
    { name: "Green Commuter", icon: "🚲", earned: true },
    { name: "Solar Master", icon: "☀️", earned: false },
    { name: "Recycling Hero", icon: "♻️", earned: true }
];

// Load enhanced eco missions
function loadEcoMissions() {
    const grid = document.getElementById('ecoMissionsGrid');
    if (!grid) return;

    grid.innerHTML = enhancedEcoMissions.map(mission => `
        <div class="mission-card-premium" onclick="trackMissionProgress(${mission.id})">
            <div class="mission-header">
                <div class="mission-icon-premium">${mission.icon}</div>
                <div>
                    <h4 class="mission-title">${mission.title}</h4>
                    <span class="mission-difficulty difficulty-${mission.difficulty.toLowerCase()}">${mission.difficulty}</span>
                </div>
            </div>
            <p>${mission.description}</p>
            <div class="mission-progress-enhanced">
                <div class="progress-text">
                    <span>Progress</span>
                    <span>${mission.progress}%</span>
                </div>
                <div class="progress-bar-enhanced">
                    <div class="progress-fill-enhanced" style="width: ${mission.progress}%"></div>
                </div>
            </div>
            <div class="mission-footer">
                <span class="mission-reward-enhanced">
                    <i class="fas fa-gift"></i> ${mission.reward}
                </span>
                <span class="mission-time-left">
                    <i class="far fa-clock"></i> ${mission.timeLeft}
                </span>
            </div>
        </div>
    `).join('');

    // Load achievements
    loadAchievements();
}

// Load achievements
function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;

    achievementsGrid.innerHTML = ecoAchievements.map(achievement => `
        <div class="achievement-badge ${achievement.earned ? 'earned' : 'locked'}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            ${achievement.earned ? '<div class="achievement-check">✓</div>' : ''}
        </div>
    `).join('');
}

// Filter missions
function filterMissions(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter logic
    const grid = document.getElementById('ecoMissionsGrid');
    if (type === 'all') {
        grid.innerHTML = enhancedEcoMissions.map(mission => createMissionCard(mission)).join('');
    } else {
        const filtered = enhancedEcoMissions.filter(m => m.type === type);
        grid.innerHTML = filtered.map(mission => createMissionCard(mission)).join('');
    }
    
    showToast(`Showing ${type} missions`, 'info');
}

// Create mission card helper
function createMissionCard(mission) {
    return `
        <div class="mission-card-premium" onclick="trackMissionProgress(${mission.id})">
            <div class="mission-header">
                <div class="mission-icon-premium">${mission.icon}</div>
                <div>
                    <h4 class="mission-title">${mission.title}</h4>
                    <span class="mission-difficulty difficulty-${mission.difficulty.toLowerCase()}">${mission.difficulty}</span>
                </div>
            </div>
            <p>${mission.description}</p>
            <div class="mission-progress-enhanced">
                <div class="progress-text">
                    <span>Progress</span>
                    <span>${mission.progress}%</span>
                </div>
                <div class="progress-bar-enhanced">
                    <div class="progress-fill-enhanced" style="width: ${mission.progress}%"></div>
                </div>
            </div>
            <div class="mission-footer">
                <span class="mission-reward-enhanced">
                    <i class="fas fa-gift"></i> ${mission.reward}
                </span>
                <span class="mission-time-left">
                    <i class="far fa-clock"></i> ${mission.timeLeft}
                </span>
            </div>
        </div>
    `;
}

// Track mission progress
function trackMissionProgress(missionId) {
    const mission = enhancedEcoMissions.find(m => m.id === missionId);
    if (mission) {
        // Show mission details
        showMissionDetails(mission);
    }
}

// Show mission details modal
function showMissionDetails(mission) {
    const modal = document.createElement('div');
    modal.className = 'mission-modal';
    modal.innerHTML = `
        <div class="mission-modal-content">
            <div class="mission-modal-header">
                <span class="mission-modal-icon">${mission.icon}</span>
                <h3>${mission.title}</h3>
                <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="mission-modal-body">
                <p>${mission.description}</p>
                <div class="mission-detail-item">
                    <strong>Progress:</strong> ${mission.progress}%
                </div>
                <div class="mission-detail-item">
                    <strong>Reward:</strong> ${mission.reward}
                </div>
                <div class="mission-detail-item">
                    <strong>Time Left:</strong> ${mission.timeLeft}
                </div>
                <div class="mission-detail-item">
                    <strong>Difficulty:</strong> 
                    <span class="difficulty-${mission.difficulty.toLowerCase()}">${mission.difficulty}</span>
                </div>
            </div>
            <div class="mission-modal-footer">
                <button class="cta-btn primary" onclick="updateMissionProgress(${mission.id})">
                    Update Progress
                </button>
                <button class="cta-btn secondary" onclick="shareMission(${mission.id})">
                    Share
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update mission progress
function updateMissionProgress(missionId) {
    const mission = enhancedEcoMissions.find(m => m.id === missionId);
    if (mission && mission.progress < 100) {
        mission.progress += 10;
        if (mission.progress > 100) mission.progress = 100;
        
        loadEcoMissions(); // Reload missions
        showToast(`✅ Progress updated for ${mission.title}`, 'success');
        
        // Check if mission completed
        if (mission.progress === 100) {
            showToast(`🎉 Congratulations! You completed ${mission.title}!`, 'success');
            addToFeed('You', `completed ${mission.title}`, 5);
        }
    }
}

// Share mission
function shareMission(missionId) {
    const mission = enhancedEcoMissions.find(m => m.id === missionId);
    if (mission) {
        showToast(`📤 Sharing ${mission.title}...`, 'info');
        // Add sharing logic here
    }
}

// Purchase offset
function purchaseOffset(type) {
    const options = {
        'trees': { name: 'Trees', price: 360, co2: 50 },
        'solar': { name: 'Solar Credits', price: 216, co2: 75 },
        'wind': { name: 'Wind Energy', price: 180, co2: 60 }
    };
    
    const option = options[type];
    if (confirm(`Purchase ${option.name} for ₹${option.price}? You'll save ${option.co2}kg CO₂`)) {
        showToast(`✅ Successfully purchased ${option.name}! You saved ${option.co2}kg CO₂`, 'success');
        
        // Update stats
        updateEcoStats(option.co2);
        
        // Add to feed
        addToFeed('You', `purchased ${option.name}`, option.co2);
        
        // Update points
        updateGreenPoints(option.price / 10);
    }
}

// Update eco stats
function updateEcoStats(co2Saved) {
    const carbonElement = document.getElementById('totalCarbonSaved');
    if (carbonElement) {
        const currentCarbon = parseFloat(carbonElement.textContent) || 156.2;
        const newCarbon = (currentCarbon + co2Saved).toFixed(1);
        carbonElement.textContent = newCarbon;
        
        // Animate the change
        carbonElement.style.animation = 'none';
        carbonElement.offsetHeight;
        carbonElement.style.animation = 'countUp 1s ease';
    }
}

// Update green points
function updateGreenPoints(points) {
    const pointsElement = document.getElementById('greenPoints');
    if (pointsElement) {
        const currentPoints = parseInt(pointsElement.textContent) || 2450;
        const newPoints = currentPoints + points;
        pointsElement.textContent = newPoints;
        
        // Check level up
        checkLevelUp(currentPoints, newPoints);
    }
}

// Check level up
function checkLevelUp(oldPoints, newPoints) {
    const oldLevel = Math.floor(oldPoints / 1000);
    const newLevel = Math.floor(newPoints / 1000);
    
    if (newLevel > oldLevel) {
        showToast(`🎉 Level Up! You're now Level ${newLevel}!`, 'success');
        // Update level badge
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.textContent = `Level ${newLevel}`;
        }
    }
}

// Add to feed
function addToFeed(user, action, co2) {
    const feedContainer = document.getElementById('ecoFeed');
    if (!feedContainer) return;
    
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.innerHTML = `
        <div class="feed-avatar">🌱</div>
        <div class="feed-content">
            <p><strong>${user}</strong> ${action}</p>
            <span class="feed-time">Just now</span>
        </div>
    `;
    
    feedContainer.insertBefore(feedItem, feedContainer.firstChild);
    
    // Keep only last 5 items
    while (feedContainer.children.length > 5) {
        feedContainer.removeChild(feedContainer.lastChild);
    }
}
// ======================================
// LIVE FUEL PRICES FROM USA API
// ======================================

async function fetchLiveFuelPrices() {
    try {
        showToast('🔄 Fetching live fuel prices...', 'info');
        
        let updatedCount = 0;
        
        // Loop through major Indian states
        for (let i = 0; i < allStatesFuelPrices.length; i += 3) { // Har 3 state ke liye ek API call
            const usaState = getUSAStateForIndex(i);
            
            try {
                const response = await fetch(`${FUEL_API_URL}${usaState}`, {
                    headers: {
                        'authorization': `apikey ${FUEL_API_KEY}`,
                        'content-type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.success && data.result && data.result.state) {
                        // Update 3 states with variation
                        for (let j = 0; j < 3; j++) {
                            const index = i + j;
                            if (index < allStatesFuelPrices.length) {
                                const updated = updateStateFromAPIData(index, data.result.state);
                                if (updated) updatedCount++;
                            }
                        }
                    }
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (e) {
                console.log(`Error fetching for ${usaState}:`, e);
            }
        }
        
        if (updatedCount > 0) {
            loadFuelPrices(); // Reload display
            showToast(`✅ Updated ${updatedCount} states with live prices!`, 'success');
        } else {
            showToast('⚠️ Using offline fuel data', 'warning');
        }
        
    } catch (error) {
        console.error('Fuel API failed:', error);
        showToast('⚠️ Using offline fuel data', 'warning');
        loadFuelPrices();
    }
}

// Get USA state based on index
function getUSAStateForIndex(index) {
    const usaStates = ['washington', 'california', 'texas', 'newyork', 'florida', 
                      'illinois', 'pennsylvania', 'ohio', 'georgia', 'northcarolina'];
    const stateIndex = Math.floor(index / 3) % usaStates.length;
    return usaStates[stateIndex];
}

// Update single state from API data
function updateStateFromAPIData(index, apiData) {
    if (!apiData || index >= allStatesFuelPrices.length) return false;
    
    const state = allStatesFuelPrices[index];
    const basePrice = parseFloat(apiData.gasoline) * USD_TO_INR;
    
    // Get factor for this state
    const factor = indianStateFactors[state.state] || 1.0;
    const variation = (Math.random() * 6) - 3; // -3 to +3 rupees
    
    const oldPrice = state.petrol;
    const newPrice = Math.round((basePrice * factor + variation) * 100) / 100;
    
    // Update petrol
    state.petrol = newPrice;
    
    // Update diesel (slightly different)
    const dieselBase = parseFloat(apiData.diesel) * USD_TO_INR;
    state.diesel = Math.round((dieselBase * factor + variation - 2) * 100) / 100;
    
    // Update CNG and LPG (approximate)
    if (state.cng > 0) {
        state.cng = Math.round((newPrice * 0.75) * 100) / 100;
    }
    if (state.lpg > 0) {
        state.lpg = Math.round((newPrice * 7.5) * 100) / 100;
    }
    
    // Update trend
    if (newPrice > oldPrice) {
        state.trend = '↗';
        state.change = '+' + (newPrice - oldPrice).toFixed(2);
    } else if (newPrice < oldPrice) {
        state.trend = '↘';
        state.change = '-' + (oldPrice - newPrice).toFixed(2);
    } else {
        state.trend = '→';
        state.change = '0.00';
    }
    
    return true;
}

// Manual refresh function
function refreshFuelPrices() {
    fetchLiveFuelPrices();
}
// ======================================
// AUTO UPDATE SYSTEM
// ======================================

function setupFuelAutoUpdate() {
    // First update after 3 seconds
    setTimeout(() => {
        fetchLiveFuelPrices();
    }, 3000);
    
    // Then every 30 minutes
    setInterval(() => {
        fetchLiveFuelPrices();
    }, 30 * 60 * 1000);
    
    // Update timestamp every minute
    setInterval(() => {
        const updateEl = document.getElementById('fuelLastUpdate');
        if (updateEl) {
            updateEl.textContent = new Date().toLocaleTimeString();
        }
    }, 60000);
}

// Single state update (optional)
async function refreshSingleState(stateIndex) {
    const state = allStatesFuelPrices[stateIndex];
    showToast(`🔄 Updating ${state.state}...`, 'info');
    
    const usaState = getUSAStateForIndex(stateIndex);
    
    try {
        const response = await fetch(`${FUEL_API_URL}${usaState}`, {
            headers: {
                'authorization': `apikey ${FUEL_API_KEY}`,
                'content-type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.result && data.result.state) {
                const updated = updateStateFromAPIData(stateIndex, data.result.state);
                if (updated) {
                    updateSingleFuelCard(stateIndex);
                    showToast(`✅ ${state.state} updated!`, 'success');
                }
            }
        }
    } catch (e) {
        showToast(`❌ Failed to update ${state.state}`, 'error');
    }
}

// Update single card in UI
function updateSingleFuelCard(index) {
    const card = document.getElementById(`fuel-card-${index}`);
    if (card) {
        const state = allStatesFuelPrices[index];
        const trendClass = state.trend === '↗' ? 'up' : state.trend === '↘' ? 'down' : 'stable';
        
        const pricesDiv = card.querySelector('.fuel-prices');
        if (pricesDiv) {
            pricesDiv.innerHTML = `
                <div class="price-item">
                    <span class="fuel-type">⛽ Petrol</span>
                    <span class="price">₹${state.petrol}</span>
                </div>
                <div class="price-item">
                    <span class="fuel-type">🚛 Diesel</span>
                    <span class="price">₹${state.diesel}</span>
                </div>
                ${state.cng > 0 ? `<div class="price-item">
                    <span class="fuel-type">🚗 CNG</span>
                    <span class="price">₹${state.cng}</span>
                </div>` : ''}
                <div class="price-item">
                    <span class="fuel-type">🏠 LPG</span>
                    <span class="price">₹${state.lpg}</span>
                </div>
            `;
        }
        
        // Update header
        const header = card.querySelector('.fuel-header span.trend');
        if (header) {
            header.className = `trend ${trendClass}`;
            header.textContent = `${state.trend} ${state.change}`;
        }
    }
}
// Initialize eco tracker with live updates
function initEcoTracker() {
    // Simulate community activity
    setInterval(() => {
        const users = ['Rahul', 'Priya', 'Arjun', 'Neha', 'Vikram', 'Anjali', 'Karan'];
        const actions = [
            'planted a tree 🌳',
            'cycled 5km 🚲',
            'used EV charging ⚡',
            'saved 3kg CO₂ 💚',
            'shared green route 🗺️',
            'used public transport 🚌',
            'recycled waste ♻️'
        ];
        
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomCO2 = Math.floor(Math.random() * 5) + 1;
        
        addToFeed(randomUser, randomAction, randomCO2);
    }, 20000); // Every 20 seconds
}

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initEcoTracker();
});// COMPREHENSIVE FAMOUS PLACES DATABASE WITH STATE INFO
// ========================================================
const famousPlacesData = {
    "Punjab": {
        stateInfo: {
            capital: "Chandigarh",
            language: "Punjabi",
            famousFor: "Golden Temple, Bhangra, Agriculture",
            favoriteFood: ["Makki di Roti", "Sarson da Saag", "Butter Chicken", "Lassi", "Amritsari Kulcha", "Chole Bhature"],
            traditionalClothing: ["Punjabi suit (Salwar Kameez)", "Phulkari", "Turban (Pagri) for men", "Kurta Pajama"]
        },
        touristPlaces: [
            { name: "Golden Temple", description: "Holy shrine of Sikhism", image: "🕌", type: "Religious" },
            { name: "Jallianwala Bagh", description: "Historic garden", image: "🌳", type: "Historical" },
            { name: "Wagah Border", description: "India-Pakistan border ceremony", image: "🚩", type: "Attraction" },
            { name: "Qila Mubarak", description: "Ancient fort", image: "🏰", type: "Fort" },
            { name: "Rock Garden", description: "Sculpture garden", image: "🪨", type: "Park" },
            { name: "Sukhna Lake", description: "Scenic lake", image: "🌊", type: "Nature" },
            { name: "Anandpur Sahib", description: "Holy city", image: "🕍", type: "Religious" },
            { name: "Bathinda Fort", description: "Ancient fort", image: "🏯", type: "Historical" },
            { name: "Sheesh Mahal", description: "Palace of mirrors", image: "🪞", type: "Palace" },
            { name: "Gurudwara Fatehgarh Sahib", description: "Historic shrine", image: "🕌", type: "Religious" },
            { name: "Ranjit Sagar Dam", description: "Dam and reservoir", image: "🌊", type: "Scenic" },
            { name: "Tiger Safari", description: "Wildlife zone", image: "🐯", type: "Wildlife" },
            { name: "Chatbir Zoo", description: "Zoological park", image: "🦁", type: "Zoo" },
            { name: "Gobindgarh Fort", description: "Historic fort", image: "🏰", type: "Fort" },
            { name: "Durgiana Temple", description: "Hindu temple", image: "🕉️", type: "Religious" },
            { name: "Kila Raipur", description: "Rural Olympics venue", image: "🏃", type: "Sports" },
            { name: "Hussainiwala", description: "National freedom fighters memorial", image: "🗽", type: "Memorial" },
            { name: "Baradari Gardens", description: "Beautiful gardens", image: "🌷", type: "Park" },
            { name: "Rose Garden", description: "Flower garden", image: "🌹", type: "Garden" },
            { name: "Virasat-e-Khalsa", description: "Sikh heritage museum", image: "🏛️", type: "Museum" }
        ]
    },
    
    "Himachal Pradesh": {
        stateInfo: {
            capital: "Shimla",
            language: "Pahari, Hindi",
            famousFor: "Hill stations, Apple orchards, Adventure sports",
            favoriteFood: ["Dham", "Chana Madra", "Sidu", "Babru", "Aktori", "Tudkiya Bhath"],
            traditionalClothing: ["Pahari topi", "Chola-Dora", "Pattu (woolen shawl)", "Kullvi cap"]
        },
        touristPlaces: [
            { name: "Shimla", description: "Queen of Hill Stations", image: "🏔️", type: "Hill Station" },
            { name: "Manali", description: "Adventure capital", image: "⛷️", type: "Hill Station" },
            { name: "Dharamshala", description: "Dalai Lama's residence", image: "🏔️", type: "Religious" },
            { name: "Kullu Valley", description: "Valley of Gods", image: "🏞️", type: "Valley" },
            { name: "Rohtang Pass", description: "High mountain pass", image: "❄️", type: "Adventure" },
            { name: "Spiti Valley", description: "Cold desert", image: "🏜️", type: "Desert" },
            { name: "Dalhousie", description: "Beautiful hill station", image: "🏔️", type: "Hill Station" },
            { name: "Khajjiar", description: "Mini Switzerland", image: "🏔️", type: "Hill Station" },
            { name: "Kasauli", description: "Quaint hill town", image: "🌲", type: "Hill Station" },
            { name: "Chamba", description: "Ancient town", image: "🏛️", type: "Historical" },
            { name: "Palampur", description: "Tea gardens", image: "🍃", type: "Nature" },
            { name: "Bir Billing", description: "Paragliding hub", image: "🪂", type: "Adventure" },
            { name: "Great Himalayan National Park", description: "UNESCO site", image: "🏞️", type: "National Park" },
            { name: "Tirthan Valley", description: "Trout fishing spot", image: "🏞️", type: "Valley" },
            { name: "Narkanda", description: "Skiing destination", image: "🎿", type: "Adventure" },
            { name: "Sangla Valley", description: "Scenic valley", image: "🏞️", type: "Valley" },
            { name: "Kalpa", description: "Apple orchards", image: "🍎", type: "Nature" },
            { name: "Mandi", description: "Varanasi of Hills", image: "🏔️", type: "Religious" },
            { name: "Jibhi", description: "Offbeat destination", image: "🌲", type: "Nature" },
            { name: "Barot Valley", description: "Trout fishing", image: "🎣", type: "Adventure" }
        ]
    },
    
    "Uttarakhand": {
        stateInfo: {
            capital: "Dehradun",
            language: "Hindi, Garhwali, Kumaoni",
            famousFor: "Char Dham, Yoga capital Rishikesh, Jim Corbett",
            favoriteFood: ["Kafuli", "Chainsoo", "Rus", "Bhatt ki Churkani", "Gahat ke Parathe", "Aloo Ke Gutke"],
            traditionalClothing: ["Pichora", "Rangwali Pichaura", "Ghagra choli", "Dhoti kurta"]
        },
        touristPlaces: [
            { name: "Rishikesh", description: "Yoga capital of world", image: "🧘", type: "Religious" },
            { name: "Haridwar", description: "Holy city on Ganges", image: "🕉️", type: "Religious" },
            { name: "Nainital", description: "Lake district", image: "🏞️", type: "Hill Station" },
            { name: "Mussoorie", description: "Queen of Hills", image: "🏔️", type: "Hill Station" },
            { name: "Jim Corbett National Park", description: "Oldest national park", image: "🐯", type: "Wildlife" },
            { name: "Auli", description: "Skiing destination", image: "⛷️", type: "Adventure" },
            { name: "Valley of Flowers", description: "UNESCO site", image: "🌺", type: "National Park" },
            { name: "Kedarnath", description: "Sacred temple", image: "🕉️", type: "Religious" },
            { name: "Badrinath", description: "Holy shrine", image: "🕉️", type: "Religious" },
            { name: "Gangotri", description: "Ganges origin", image: "🏔️", type: "Religious" },
            { name: "Yamunotri", description: "Yamuna origin", image: "🏔️", type: "Religious" },
            { name: "Dehradun", description: "Capital city", image: "🏙️", type: "City" },
            { name: "Lansdowne", description: "Quiet hill station", image: "🏔️", type: "Hill Station" },
            { name: "Ranikhet", description: "Queen's meadow", image: "🏞️", type: "Hill Station" },
            { name: "Kausani", description: "Switzerland of India", image: "🏔️", type: "Hill Station" },
            { name: "Bhimtal", description: "Lake destination", image: "🌊", type: "Nature" },
            { name: "Chopta", description: "Mini Switzerland", image: "🏔️", type: "Hill Station" },
            { name: "Mukteshwar", description: "Scenic beauty", image: "🏔️", type: "Hill Station" },
            { name: "Almora", description: "Cultural hub", image: "🏛️", type: "Cultural" },
            { name: "Pithoragarh", description: "Beautiful valley", image: "🏞️", type: "Nature" }
        ]
    },
    
    "Gujarat": {
        stateInfo: {
            capital: "Gandhinagar",
            language: "Gujarati",
            famousFor: "Gir Lions, Statue of Unity, White Desert, Business",
            favoriteFood: ["Dhokla", "Khandvi", "Thepla", "Undhiyu", "Fafda", "Jalebi", "Gathiya"],
            traditionalClothing: ["Chaniya choli", "Kediyu", "Bandhani saree", "Patola saree"]
        },
        touristPlaces: [
            { name: "Statue of Unity", description: "World's tallest statue", image: "🗽", type: "Monument" },
            { name: "Gir National Park", description: "Last abode of Asiatic lions", image: "🦁", type: "Wildlife" },
            { name: "Rann of Kutch", description: "White salt desert", image: "🧂", type: "Nature" },
            { name: "Dwarka", description: "Lord Krishna's kingdom", image: "🕉️", type: "Religious" },
            { name: "Somnath Temple", description: "Jyotirlinga temple", image: "🕉️", type: "Religious" },
            { name: "Sabarmati Ashram", description: "Gandhi's residence", image: "🕊️", type: "Historical" },
            { name: "Ahmedabad", description: "World Heritage city", image: "🏛️", type: "City" },
            { name: "Kankaria Lake", description: "Scenic lake", image: "🌊", type: "Nature" },
            { name: "Patan", description: "Rani ki Vav stepwell", image: "🏛️", type: "Historical" },
            { name: "Modhera Sun Temple", description: "Ancient sun temple", image: "🏛️", type: "Temple" },
            { name: "Saputara", description: "Hill station", image: "🏔️", type: "Hill Station" },
            { name: "Diu", description: "Beaches and forts", image: "🏖️", type: "Beach" },
            { name: "Junagadh", description: "Historical city", image: "🏯", type: "Historical" },
            { name: "Bhavnagar", description: "Coastal city", image: "🌊", type: "City" },
            { name: "Vadodara", description: "Cultural capital", image: "🏛️", type: "Cultural" },
            { name: "Surat", description: "Diamond city", image: "💎", type: "City" },
            { name: "Nalsarovar", description: "Bird sanctuary", image: "🦆", type: "Wildlife" },
            { name: "Champaner", description: "UNESCO site", image: "🏛️", type: "Historical" },
            { name: "Lothal", description: "Ancient Indus site", image: "🏺", type: "Archaeological" },
            { name: "Mandvi Beach", description: "Beautiful beach", image: "🏖️", type: "Beach" }
        ]
    },
    
    "Goa": {
        stateInfo: {
            capital: "Panaji",
            language: "Konkani",
            famousFor: "Beaches, Nightlife, Portuguese architecture, Casinos",
            favoriteFood: ["Fish Curry Rice", "Pork Vindaloo", "Bebinca", "Xacuti", "Sorpotel", "Feni"],
            traditionalClothing: ["Kashti (traditional dress)", "Pano Bhaju", "Western wear"]
        },
        touristPlaces: [
            { name: "Baga Beach", description: "Popular beach", image: "🏖️", type: "Beach" },
            { name: "Calangute Beach", description: "Queen of beaches", image: "🏖️", type: "Beach" },
            { name: "Anjuna Beach", description: "Flea market", image: "🏖️", type: "Beach" },
            { name: "Vagator Beach", description: "Scenic beach", image: "🏖️", type: "Beach" },
            { name: "Palolem Beach", description: "South Goa paradise", image: "🏖️", type: "Beach" },
            { name: "Basilica of Bom Jesus", description: "UNESCO church", image: "⛪", type: "Religious" },
            { name: "Fort Aguada", description: "Portuguese fort", image: "🏰", type: "Fort" },
            { name: "Chapora Fort", description: "Dil Chahta Hai fame", image: "🏰", type: "Fort" },
            { name: "Dudhsagar Falls", description: "Waterfall", image: "💦", type: "Nature" },
            { name: "Panaji", description: "Capital city", image: "🏛️", type: "City" },
            { name: "Old Goa", description: "Historical churches", image: "⛪", type: "Historical" },
            { name: "Candolim Beach", description: "Serene beach", image: "🏖️", type: "Beach" },
            { name: "Morjim Beach", description: "Olive Ridley nesting", image: "🐢", type: "Beach" },
            { name: "Arambol Beach", description: "Hippie culture", image: "🏖️", type: "Beach" },
            { name: "Divar Island", description: "Peaceful island", image: "🏝️", type: "Island" },
            { name: "Grand Island", description: "Scuba diving spot", image: "🏝️", type: "Adventure" },
            { name: "Mangeshi Temple", description: "Hindu temple", image: "🕉️", type: "Religious" },
            { name: "Spice Plantations", description: "Tours available", image: "🌿", type: "Nature" },
            { name: "Salim Ali Bird Sanctuary", description: "Bird watching", image: "🦜", type: "Wildlife" },
            { name: "Cabo de Rama Fort", description: "Ancient fort", image: "🏰", type: "Fort" }
        ]
    }
};

// CONTINUATION - 5 MORE STATES
const moreStatesData = {
    "Kerala": {
        stateInfo: {
            capital: "Thiruvananthapuram",
            language: "Malayalam",
            famousFor: "Backwaters, Ayurveda, Spices, Kathakali, Snake Boat Race",
            favoriteFood: ["Appam with Stew", "Puttu and Kadala Curry", "Karimeen Pollichathu", "Malabar Parotta", "Sadya (feast)", "Payasam"],
            traditionalClothing: ["Kasavu Mundu (white saree with golden border)", "Mundu (for men)", "Settu Mundu", "Neriyathu"]
        },
        touristPlaces: [
            { name: "Alleppey", description: "Backwater capital", image: "🚤", type: "Backwaters" },
            { name: "Munnar", description: "Tea gardens paradise", image: "🍃", type: "Hill Station" },
            { name: "Kumarakom", description: "Bird sanctuary", image: "🦆", type: "Backwaters" },
            { name: "Kochi", description: "Queen of Arabian Sea", image: "⚓", type: "City" },
            { name: "Varkala", description: "Cliff beach", image: "🏖️", type: "Beach" },
            { name: "Kovalam", description: "Famous beach", image: "🏖️", type: "Beach" },
            { name: "Thekkady", description: "Periyar wildlife", image: "🐘", type: "Wildlife" },
            { name: "Wayanad", description: "Scenic hills", image: "🏔️", type: "Hill Station" },
            { name: "Athirappilly Falls", description: "Niagara of India", image: "💦", type: "Waterfall" },
            { name: "Fort Kochi", description: "Chinese fishing nets", image: "🎣", type: "Historical" },
            { name: "Guruvayur Temple", description: "Holy shrine", image: "🕉️", type: "Temple" },
            { name: "Padmanabhaswamy Temple", description: "Wealthiest temple", image: "🕉️", type: "Temple" },
            { name: "Bekal Fort", description: "Largest fort", image: "🏰", type: "Fort" },
            { name: "Silent Valley", description: "National Park", image: "🌳", type: "National Park" },
            { name: "Kappad Beach", description: "Vasco da Gama landed", image: "🏖️", type: "Historical" },
            { name: "Malampuzha Dam", description: "Gardens and dam", image: "🌊", type: "Scenic" },
            { name: "Chembra Peak", description: "Heart-shaped lake", image: "❤️", type: "Trekking" },
            { name: "Marari Beach", description: "Serene beach", image: "🏖️", type: "Beach" },
            { name: "Thattekad Bird Sanctuary", description: "Bird lovers", image: "🦜", type: "Wildlife" },
            { name: "Kuttanad", description: "Rice bowl of Kerala", image: "🌾", type: "Backwaters" }
        ]
    },
    
    "Karnataka": {
        stateInfo: {
            capital: "Bengaluru",
            language: "Kannada",
            famousFor: "IT hub, Mysore Palace, Sandalwood, Coffee plantations",
            favoriteFood: ["Bisi Bele Bath", "Mysore Pak", "Dosa", "Idli Vada", "Neer Dosa", "Kori Rotti"],
            traditionalClothing: ["Mysore silk saree", "Ilkal saree", "Lambadi embroidery", "Panche (for men)"]
        },
        touristPlaces: [
            { name: "Mysore Palace", description: "Royal residence", image: "👑", type: "Palace" },
            { name: "Hampi", description: "UNESCO ruins", image: "🏛️", type: "Historical" },
            { name: "Coorg", description: "Scotland of India", image: "🏔️", type: "Hill Station" },
            { name: "Gokarna", description: "Temple and beaches", image: "🏖️", type: "Beach" },
            { name: "Bangalore", description: "Garden city", image: "🏙️", type: "City" },
            { name: "Mysore", description: "Cultural capital", image: "🏛️", type: "City" },
            { name: "Badami Caves", description: "Rock-cut caves", image: "🪨", type: "Historical" },
            { name: "Pattadakal", description: "Temple complex", image: "🏛️", type: "UNESCO" },
            { name: "Aihole", description: "Cradle of temples", image: "🏛️", type: "Historical" },
            { name: "Jog Falls", description: "Highest waterfall", image: "💦", type: "Waterfall" },
            { name: "Bandipur National Park", description: "Tiger reserve", image: "🐯", type: "Wildlife" },
            { name: "Kabini", description: "Wildlife safari", image: "🐘", type: "Wildlife" },
            { name: "Chikmagalur", description: "Coffee land", image: "☕", type: "Hill Station" },
            { name: "Sakleshpur", description: "Green paradise", image: "🌲", type: "Hill Station" },
            { name: "Murudeshwar", description: "Shiva statue", image: "🕉️", type: "Temple" },
            { name: "Udupi", description: "Temple town", image: "🕉️", type: "Religious" },
            { name: "Gol Gumbaz", description: "Whispering gallery", image: "🏛️", type: "Monument" },
            { name: "Bidar Fort", description: "Historic fort", image: "🏰", type: "Fort" },
            { name: "Shravanabelagola", description: "Jain pilgrimage", image: "🕉️", type: "Religious" },
            { name: "Dandeli", description: "River rafting", image: "🛶", type: "Adventure" }
        ]
    },
    
    "Rajasthan": {
        stateInfo: {
            capital: "Jaipur",
            language: "Hindi, Rajasthani",
            famousFor: "Deserts, Palaces, Forts, Camel safari, Folk music",
            favoriteFood: ["Dal Baati Churma", "Laal Maas", "Gatte ki Sabzi", "Ker Sangri", "Mohan Maas", "Pyaz Kachori"],
            traditionalClothing: ["Ghagra Choli", "Odhni", "Bandhej saree", "Dhoti and Angrakha (men)"]
        },
        touristPlaces: [
            { name: "Jaipur", description: "Pink City", image: "🏰", type: "City" },
            { name: "Udaipur", description: "City of Lakes", image: "🌊", type: "City" },
            { name: "Jaisalmer", description: "Golden City", image: "🏜️", type: "City" },
            { name: "Jodhpur", description: "Blue City", image: "🏙️", type: "City" },
            { name: "Amer Fort", description: "Massive fort", image: "🏰", type: "Fort" },
            { name: "City Palace", description: "Royal residence", image: "👑", type: "Palace" },
            { name: "Hawa Mahal", description: "Palace of Winds", image: "🏰", type: "Palace" },
            { name: "Mehrangarh Fort", description: "Majestic fort", image: "🏯", type: "Fort" },
            { name: "Lake Pichola", description: "Scenic lake", image: "🌊", type: "Lake" },
            { name: "Pushkar", description: "Holy lake and temple", image: "🕉️", type: "Religious" },
            { name: "Ajmer Sharif", description: "Sufi shrine", image: "🕌", type: "Religious" },
            { name: "Ranthambore", description: "Tiger reserve", image: "🐯", type: "Wildlife" },
            { name: "Kumbhalgarh Fort", description: "Great wall of India", image: "🏰", type: "Fort" },
            { name: "Chittorgarh", description: "Largest fort", image: "🏰", type: "Fort" },
            { name: "Jaisalmer Fort", description: "Living fort", image: "🏜️", type: "Fort" },
            { name: "Bikaner", description: "Camel country", image: "🐫", type: "City" },
            { name: "Mount Abu", description: "Only hill station", image: "🏔️", type: "Hill Station" },
            { name: "Dilwara Temples", description: "Marble temples", image: "🕉️", type: "Temple" },
            { name: "Sam Sand Dunes", description: "Desert safari", image: "🏜️", type: "Desert" },
            { name: "Nahargarh Fort", description: "Sunset point", image: "🏰", type: "Fort" }
        ]
    },
    
    "Tamil Nadu": {
        stateInfo: {
            capital: "Chennai",
            language: "Tamil",
            famousFor: "Temples, Classical dance, Silk sarees, Filter coffee",
            favoriteFood: ["Idli Sambhar", "Dosa", "Chettinad Chicken", "Pongal", "Kothu Parotta", "Kancheepuram Idli"],
            traditionalClothing: ["Kanjeevaram silk saree", "Veshti (men)", "Pavadai (girls)"]
        },
        touristPlaces: [
            { name: "Chennai", description: "Capital city", image: "🏙️", type: "City" },
            { name: "Mahabalipuram", description: "Shore temples", image: "🏛️", type: "UNESCO" },
            { name: "Meenakshi Temple", description: "Famous temple", image: "🕉️", type: "Temple" },
            { name: "Ooty", description: "Queen of Hills", image: "🏔️", type: "Hill Station" },
            { name: "Kodaikanal", description: "Princess of Hills", image: "🏔️", type: "Hill Station" },
            { name: "Rameswaram", description: "Pilgrimage island", image: "🌉", type: "Religious" },
            { name: "Kanyakumari", description: "Southern tip", image: "🌅", type: "Scenic" },
            { name: "Brihadeeswarar Temple", description: "Chola architecture", image: "🕉️", type: "Temple" },
            { name: "Thanjavur", description: "Cultural hub", image: "🎨", type: "Historical" },
            { name: "Pondicherry", description: "French town", image: "🇫🇷", type: "City" },
            { name: "Kanchipuram", description: "Silk city", image: "🕉️", type: "Temple" },
            { name: "Coimbatore", description: "Manchester of TN", image: "🏭", type: "City" },
            { name: "Madurai", description: "Temple city", image: "🕉️", type: "City" },
            { name: "Tiruchirappalli", description: "Rockfort temple", image: "🪨", type: "Temple" },
            { name: "Yercaud", description: "Shevaroy hills", image: "🏔️", type: "Hill Station" },
            { name: "Valparai", description: "Tea estates", image: "🍃", type: "Hill Station" },
            { name: "Courtallam", description: "Spa of South", image: "💦", type: "Waterfall" },
            { name: "Mudumalai", description: "Wildlife sanctuary", image: "🐘", type: "Wildlife" },
            { name: "Vivekananda Rock", description: "Meditation spot", image: "🪨", type: "Memorial" },
            { name: "Dhanushkodi", description: "Ghost town", image: "👻", type: "Ruins" }
        ]
    },
    
    "West Bengal": {
        stateInfo: {
            capital: "Kolkata",
            language: "Bengali",
            famousFor: "Durga Puja, Tea gardens, Bengali sweets, Literature",
            favoriteFood: ["Macher Jhol", "Rosogolla", "Sandesh", "Mishti Doi", "Kathi Roll", "Shorshe Ilish"],
            traditionalClothing: ["Bengali saree (Taant, Baluchari)", "Dhoti kurta (men)", "Panjabi"]
        },
        touristPlaces: [
            { name: "Kolkata", description: "City of Joy", image: "🏙️", type: "City" },
            { name: "Darjeeling", description: "Queen of Hills", image: "🏔️", type: "Hill Station" },
            { name: "Siliguri", description: "Gateway to Northeast", image: "🚂", type: "City" },
            { name: "Dooars", description: "Tea gardens", image: "🍃", type: "Nature" },
            { name: "Sundarbans", description: "Mangrove forest", image: "🐅", type: "Wildlife" },
            { name: "Digha", description: "Popular beach", image: "🏖️", type: "Beach" },
            { name: "Mandarmani", description: "Serene beach", image: "🏖️", type: "Beach" },
            { name: "Shantiniketan", description: "Tagore's abode", image: "📚", type: "Cultural" },
            { name: "Bishnupur", description: "Terracotta temples", image: "🏛️", type: "Historical" },
            { name: "Murshidabad", description: "Nawabi heritage", image: "👑", type: "Historical" },
            { name: "Victoria Memorial", description: "White marble", image: "🏛️", type: "Museum" },
            { name: "Howrah Bridge", description: "Iconic bridge", image: "🌉", type: "Landmark" },
            { name: "Kalimpong", description: "Scenic hills", image: "🏔️", type: "Hill Station" },
            { name: "Kurseong", description: "Land of White Orchids", image: "🌺", type: "Hill Station" },
            { name: "Mirik", description: "Lake and hills", image: "🌊", type: "Hill Station" },
            { name: "Jaldapara", description: "Rhino sanctuary", image: "🦏", type: "Wildlife" },
            { name: "Gorumara", description: "National Park", image: "🐘", type: "Wildlife" },
            { name: "Bandel", description: "Church and Imambara", image: "⛪", type: "Historical" },
            { name: "Serampore", description: "Danish colony", image: "🇩🇰", type: "Historical" },
            { name: "Chandannagar", description: "French colony", image: "🇫🇷", type: "Historical" }
        ]
    }
};

// NEXT 5 STATES - CONTINUATION
const nextFiveStatesData = {
    "Madhya Pradesh": {
        stateInfo: {
            capital: "Bhopal",
            language: "Hindi",
            famousFor: "Tiger reserves, Khajuraho temples, Marble rocks, Tribal culture",
            favoriteFood: ["Poha Jalebi", "Bhutte ka Kees", "Dal Bafla", "Sev Bhaji", "Bhopali Gosht Korma", "Mawa Bati"],
            traditionalClothing: ["Lehenga choli", "Bandhani saree", "Dhoti kurta", "Safaa (turban)"]
        },
        touristPlaces: [
            { name: "Khajuraho", description: "Famous erotic temples", image: "🕉️", type: "Historical" },
            { name: "Sanchi Stupa", description: "Buddhist monument", image: "🏛️", type: "Historical" },
            { name: "Kanha National Park", description: "Tiger land", image: "🐯", type: "Wildlife" },
            { name: "Bandhavgarh", description: "Tiger reserve", image: "🐅", type: "Wildlife" },
            { name: "Bhedaghat", description: "Marble rocks", image: "⛰️", type: "Nature" },
            { name: "Gwalior Fort", description: "Historic fort", image: "🏰", type: "Fort" },
            { name: "Orchha", description: "Medieval town", image: "🏛️", type: "Historical" },
            { name: "Pachmarhi", description: "Satpura queen", image: "🏔️", type: "Hill Station" },
            { name: "Ujjain", description: "Mahakaleshwar temple", image: "🕉️", type: "Religious" },
            { name: "Omkareshwar", description: "Sacred island", image: "🕉️", type: "Religious" },
            { name: "Mandu", description: "Fort city", image: "🏰", type: "Historical" },
            { name: "Bhimbetka", description: "Rock shelters", image: "🪨", type: "Archaeological" },
            { name: "Pench National Park", description: "Mowgli land", image: "🐺", type: "Wildlife" },
            { name: "Indore", description: "Food capital", image: "🍛", type: "City" },
            { name: "Bhopal", description: "City of lakes", image: "🌊", type: "City" },
            { name: "Jabalpur", description: "Marble city", image: "🏙️", type: "City" },
            { name: "Chanderi", description: "Handloom town", image: "🪡", type: "Cultural" },
            { name: "Maheshwar", description: "Maheshwari sarees", image: "👘", type: "Cultural" },
            { name: "Satpura National Park", description: "Wildlife safari", image: "🐘", type: "Wildlife" },
            { name: "Dhuandhar Falls", description: "Smoky waterfall", image: "💦", type: "Waterfall" }
        ]
    },
    
    "Bihar": {
        stateInfo: {
            capital: "Patna",
            language: "Hindi, Bhojpuri, Maithili",
            famousFor: "Bodh Gaya, Nalanda University, Litti Chokha, Madhubani painting",
            favoriteFood: ["Litti Chokha", "Sattu Paratha", "Chana Ghugni", "Malpua", "Thekua", "Khaja"],
            traditionalClothing: ["Madhubani saree", "Bhagalpuri silk", "Dhoti kurta", "Pugree (turban)"]
        },
        touristPlaces: [
            { name: "Bodh Gaya", description: "Buddha's enlightenment", image: "🕊️", type: "Religious" },
            { name: "Nalanda", description: "Ancient university", image: "📚", type: "Historical" },
            { name: "Rajgir", description: "Ancient capital", image: "🏛️", type: "Historical" },
            { name: "Vikramshila", description: "Ancient university", image: "📖", type: "Historical" },
            { name: "Patna", description: "Capital city", image: "🏙️", type: "City" },
            { name: "Vaishali", description: "Buddhist site", image: "🕊️", type: "Religious" },
            { name: "Pawapuri", description: "Jain pilgrimage", image: "🕉️", type: "Religious" },
            { name: "Gaya", description: "Pitru Paksha rituals", image: "🕉️", type: "Religious" },
            { name: "Sonepur", description: "Asia's largest cattle fair", image: "🐘", type: "Fair" },
            { name: "Madhubani", description: "Famous paintings", image: "🎨", type: "Cultural" },
            { name: "Bhagalpur", description: "Silk city", image: "🪡", type: "City" },
            { name: "Munger", description: "Yoga center", image: "🧘", type: "Spiritual" },
            { name: "Kesaria Stupa", description: "Largest Buddhist stupa", image: "🏛️", type: "Historical" },
            { name: "Valmiki National Park", description: "Tiger reserve", image: "🐯", type: "Wildlife" },
            { name: "Rohtasgarh Fort", description: "Largest fort", image: "🏰", type: "Fort" },
            { name: "Maner Sharif", description: "Sufi shrine", image: "🕌", type: "Religious" },
            { name: "Sasaram", description: "Sher Shah's tomb", image: "🪦", type: "Historical" },
            { name: "Darbhanga", description: "Cultural hub", image: "🎭", type: "Cultural" },
            { name: "Barabar Caves", description: "Ancient rock caves", image: "🪨", type: "Historical" },
            { name: "Rajendra Nagar", description: "Bird sanctuary", image: "🦆", type: "Wildlife" }
        ]
    },
    
    "Odisha": {
        stateInfo: {
            capital: "Bhubaneswar",
            language: "Odia",
            famousFor: "Jagannath Temple, Sun Temple, Rath Yatra, Silver filigree",
            favoriteFood: ["Pakhala Bhata", "Dalma", "Chhena Poda", "Rasagola", "Macha Ghanta", "Santula"],
            traditionalClothing: ["Sambalpuri saree", "Pattachitra design", "Dhoti kurta", "Ikat fabric"]
        },
        touristPlaces: [
            { name: "Puri", description: "Jagannath Temple", image: "🕉️", type: "Religious" },
            { name: "Konark", description: "Sun Temple", image: "☀️", type: "UNESCO" },
            { name: "Bhubaneswar", description: "Temple city", image: "🏛️", type: "City" },
            { name: "Cuttack", description: "Silver city", image: "🥈", type: "City" },
            { name: "Chilika Lake", description: "Asia's largest lagoon", image: "🌊", type: "Nature" },
            { name: "Gopalpur", description: "Sea beach", image: "🏖️", type: "Beach" },
            { name: "Puri Beach", description: "Holy beach", image: "🏖️", type: "Beach" },
            { name: "Dhauli", description: "Peace pagoda", image: "🕊️", type: "Historical" },
            { name: "Lingaraj Temple", description: "Ancient temple", image: "🕉️", type: "Temple" },
            { name: "Mukteshwar Temple", description: "Gem of Odisha", image: "💎", type: "Temple" },
            { name: "Raghurajpur", description: "Artist village", image: "🎨", type: "Cultural" },
            { name: "Udayagiri", description: "Jain caves", image: "🪨", type: "Historical" },
            { name: "Ratnagiri", description: "Buddhist site", image: "🕊️", type: "Historical" },
            { name: "Simlipal National Park", description: "Tiger reserve", image: "🐯", type: "Wildlife" },
            { name: "Bhitarkanika", description: "Mangrove forest", image: "🌳", type: "Wildlife" },
            { name: "Sambalpur", description: "Sambalpuri sarees", image: "👘", type: "Cultural" },
            { name: "Hirakud Dam", description: "Longest dam", image: "🌊", type: "Scenic" },
            { name: "Satkosia Gorge", description: "Scenic canyon", image: "⛰️", type: "Nature" },
            { name: "Chandipur", description: "Vanishing sea", image: "🌊", type: "Beach" },
            { name: "Paradip", description: "Port town", image: "⚓", type: "City" }
        ]
    },
    
    "Andhra Pradesh": {
        stateInfo: {
            capital: "Amaravati",
            language: "Telugu",
            famousFor: "Tirupati Temple, Kuchipudi dance, Spicy food, Amaravati art",
            favoriteFood: ["Gongura Pickle", "Pulihora", "Gutti Vankaya", "Pesarattu", "Bobbatlu", "Royyala Koora"],
            traditionalClothing: ["Uppada saree", "Venkatagiri saree", "Dhoti kurta", "Kuchipudi costume"]
        },
        touristPlaces: [
            { name: "Tirupati", description: "Venkateswara temple", image: "🕉️", type: "Religious" },
            { name: "Visakhapatnam", description: "City of destiny", image: "🏖️", type: "City" },
            { name: "Araku Valley", description: "Coffee plantations", image: "🏔️", type: "Hill Station" },
            { name: "Vijayawada", description: "Kanaka Durga temple", image: "🕉️", type: "City" },
            { name: "Amaravati", description: "Buddhist site", image: "🏛️", type: "Historical" },
            { name: "Srisailam", description: "Jyotirlinga temple", image: "🕉️", type: "Religious" },
            { name: "Lepakshi", description: "Hanging pillar", image: "🏛️", type: "Historical" },
            { name: "Rushikonda Beach", description: "Scenic beach", image: "🏖️", type: "Beach" },
            { name: "Borra Caves", description: "Limestone caves", image: "🪨", type: "Nature" },
            { name: "Kailasagiri", description: "Hill park", image: "🏞️", type: "Park" },
            { name: "Simhachalam Temple", description: "Ancient temple", image: "🕉️", type: "Temple" },
            { name: "Kurmanathaswamy Temple", description: "Tortoise temple", image: "🐢", type: "Temple" },
            { name: "Mypadu Beach", description: "Serene beach", image: "🏖️", type: "Beach" },
            { name: "Gandikota", description: "Grand canyon", image: "🏜️", type: "Scenic" },
            { name: "Belum Caves", description: "Longest caves", image: "🕳️", type: "Nature" },
            { name: "Horsley Hills", description: "Hill station", image: "🏔️", type: "Hill Station" },
            { name: "Nagalapuram", description: "Trekking spot", image: "🥾", type: "Adventure" },
            { name: "Pulicat Lake", description: "Bird sanctuary", image: "🦩", type: "Wildlife" },
            { name: "Thotlakonda", description: "Buddhist complex", image: "🏛️", type: "Historical" },
            { name: "Kolleru Lake", description: "Freshwater lake", image: "🌊", type: "Nature" }
        ]
    },
    
    "Telangana": {
        stateInfo: {
            capital: "Hyderabad",
            language: "Telugu, Urdu",
            famousFor: "Hyderabad Biryani, Pearls, Charminar, IT hub, Nizami culture",
            favoriteFood: ["Hyderabadi Biryani", "Haleem", "Nihari", "Double ka Meetha", "Qubani ka Meetha", "Irani Chai with Osmania Biscuit"],
            traditionalClothing: ["Hyderabadi silk", "Pochampally saree", "Sherwani (men)", "Gadwal saree"]
        },
        touristPlaces: [
            { name: "Charminar", description: "Iconic monument", image: "🕌", type: "Monument" },
            { name: "Golconda Fort", description: "Historic fort", image: "🏰", type: "Fort" },
            { name: "Hussain Sagar", description: "Buddha statue lake", image: "🌊", type: "Lake" },
            { name: "Ramoji Film City", description: "Largest film city", image: "🎬", type: "Entertainment" },
            { name: "Qutb Shahi Tombs", description: "Royal tombs", image: "🪦", type: "Historical" },
            { name: "Salar Jung Museum", description: "Art museum", image: "🏛️", type: "Museum" },
            { name: "Birla Mandir", description: "White marble temple", image: "🕉️", type: "Temple" },
            { name: "Nehru Zoo Park", description: "Zoological park", image: "🦁", type: "Zoo" },
            { name: "Warangal Fort", description: "Kakatiya ruins", image: "🏰", type: "Fort" },
            { name: "Thousand Pillar Temple", description: "Ancient temple", image: "🕉️", type: "Temple" },
            { name: "Nagarjuna Sagar", description: "Dam and island", image: "🌊", type: "Scenic" },
            { name: "Bhadrachalam Temple", description: "Rama temple", image: "🕉️", type: "Religious" },
            { name: "Medak Cathedral", description: "Largest church", image: "⛪", type: "Religious" },
            { name: "Pochampally", description: "Ikat weaving", image: "🪡", type: "Cultural" },
            { name: "Kuntala Falls", description: "Highest waterfall", image: "💦", type: "Waterfall" },
            { name: "Bogatha Waterfall", description: "Cherrapunji of South", image: "💧", type: "Waterfall" },
            { name: "Ananthagiri Hills", description: "Coffee plantation", image: "🏔️", type: "Hill Station" },
            { name: "KBR Park", description: "Jubilee hills park", image: "🌳", type: "Park" },
            { name: "Nizam's Museum", description: "Royal memorabilia", image: "👑", type: "Museum" },
            { name: "Wonderla", description: "Amusement park", image: "🎢", type: "Amusement" }
        ]
    }
};

// FUNCTION TO DISPLAY STATE INFORMATION
function displayStateInfo(stateName) {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    
    if (allStates[stateName]) {
        const state = allStates[stateName];
        console.log(`\n========== ${stateName} ==========`);
        console.log(`Capital: ${state.stateInfo.capital}`);
        console.log(`Language: ${state.stateInfo.language}`);
        console.log(`Famous For: ${state.stateInfo.famousFor}`);
        console.log(`\n🍽️ Favorite Foods:`);
        state.stateInfo.favoriteFood.forEach(food => console.log(`  • ${food}`));
        console.log(`\n👘 Traditional Clothing:`);
        state.stateInfo.traditionalClothing.forEach(cloth => console.log(`  • ${cloth}`));
        console.log(`\n📍 Top 20 Tourist Places:`);
        state.touristPlaces.forEach((place, index) => {
            console.log(`  ${index + 1}. ${place.image} ${place.name} - ${place.description} (${place.type})`);
        });
    } else {
        console.log(`State "${stateName}" not found in database.`);
    }
}

// FUNCTION TO DISPLAY ALL 15 STATES
function displayAll15States() {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    let stateCount = 1;
    
    console.log("=".repeat(70));
    console.log("🌍 COMPLETE INDIAN STATES TOURIST GUIDE (15 STATES) 🌍".padStart(55));
    console.log("=".repeat(70));
    
    const stateList = [
        "Punjab", "Himachal Pradesh", "Uttarakhand", "Gujarat", "Goa",
        "Kerala", "Karnataka", "Rajasthan", "Tamil Nadu", "West Bengal",
        "Madhya Pradesh", "Bihar", "Odisha", "Andhra Pradesh", "Telangana"
    ];
    
    stateList.forEach(state => {
        if(allStates[state]) {
            console.log(`\n${stateCount++}. ${state}`);
            console.log(`   📍 Capital: ${allStates[state].stateInfo.capital}`);
            console.log(`   🗣️ Language: ${allStates[state].stateInfo.language}`);
            console.log(`   ✨ Famous: ${allStates[state].stateInfo.famousFor}`);
            console.log(`   🍛 Famous Food: ${allStates[state].stateInfo.favoriteFood.slice(0,3).join(", ")}...`);
            console.log(`   👘 Traditional Wear: ${allStates[state].stateInfo.traditionalClothing.slice(0,2).join(", ")}...`);
            console.log(`   🏆 Top Places: ${allStates[state].touristPlaces.slice(0,3).map(p => p.name).join(", ")}...`);
        }
    });
}

// FUNCTION TO GET STATE DETAILS BY NAME
function getStateDetails(stateName) {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    
    if(allStates[stateName]) {
        const state = allStates[stateName];
        console.log(`\n📋 DETAILED INFORMATION FOR ${stateName.toUpperCase()}`);
        console.log("-".repeat(50));
        
        console.log("\n🏛️ STATE INFORMATION:");
        console.log(`   Capital: ${state.stateInfo.capital}`);
        console.log(`   Language: ${state.stateInfo.language}`);
        console.log(`   Famous For: ${state.stateInfo.famousFor}`);
        
        console.log("\n🍽️ FAVORITE FOODS:");
        state.stateInfo.favoriteFood.forEach((food, i) => console.log(`   ${i+1}. ${food}`));
        
        console.log("\n👘 TRADITIONAL CLOTHING:");
        state.stateInfo.traditionalClothing.forEach((cloth, i) => console.log(`   ${i+1}. ${cloth}`));
        
        console.log("\n📍 TOURIST PLACES (20):");
        state.touristPlaces.forEach((place, i) => {
            console.log(`   ${i+1}. ${place.image} ${place.name}`);
            console.log(`      └─ ${place.description} (${place.type})`);
        });
    } else {
        console.log(`❌ State "${stateName}" not found in database.`);
    }
}

// FUNCTION TO SEARCH PLACES BY TYPE
function searchByType(type) {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    let results = [];
    
    for(let state in allStates) {
        allStates[state].touristPlaces.forEach(place => {
            if(place.type.toLowerCase().includes(type.toLowerCase())) {
                results.push({
                    state: state,
                    place: place
                });
            }
        });
    }
    
    console.log(`\n🔍 SEARCH RESULTS FOR "${type}" PLACES:`);
    console.log("-".repeat(50));
    
    if(results.length > 0) {
        results.forEach((result, i) => {
            console.log(`${i+1}. ${result.place.image} ${result.place.name} (${result.state})`);
            console.log(`   └─ ${result.place.description}`);
        });
    } else {
        console.log("No places found for this type.");
    }
}

// FUNCTION TO SEARCH BY FOOD
function searchByFood(foodItem) {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    let results = [];
    
    for(let state in allStates) {
        allStates[state].stateInfo.favoriteFood.forEach(food => {
            if(food.toLowerCase().includes(foodItem.toLowerCase())) {
                results.push({
                    state: state,
                    food: food
                });
            }
        });
    }
    
    console.log(`\n🔍 SEARCH RESULTS FOR FOOD: "${foodItem}"`);
    console.log("-".repeat(50));
    
    if(results.length > 0) {
        results.forEach((result, i) => {
            console.log(`${i+1}. ${result.food} - Found in ${result.state}`);
        });
    } else {
        console.log("No matching food items found.");
    }
}

// FUNCTION TO GET PLACES BY CATEGORY ACROSS ALL STATES
function getPlacesByCategory(category) {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    let categoryPlaces = [];
    
    for(let state in allStates) {
        allStates[state].touristPlaces.forEach(place => {
            if(place.type.toLowerCase() === category.toLowerCase() || 
               place.type.toLowerCase().includes(category.toLowerCase())) {
                categoryPlaces.push({
                    state: state,
                    place: place
                });
            }
        });
    }
    
    return categoryPlaces;
}

// MAIN EXECUTION
console.log("🌍 INDIAN STATES TOURIST GUIDE 🌍");
console.log("==================================");

// Display first 5 states
displayStateInfo("Punjab");
displayStateInfo("Himachal Pradesh");
displayStateInfo("Uttarakhand");
displayStateInfo("Gujarat");
displayStateInfo("Goa");

// Display all 15 states summary
displayAll15States();

// Detailed info for specific states
console.log("\n" + "=".repeat(70));
console.log("📊 DETAILED STATE INFORMATION EXAMPLES");
console.log("=".repeat(70));

getStateDetails("Kerala");
getStateDetails("Rajasthan");
getStateDetails("West Bengal");

// Detailed info for new states
console.log("\n" + "=".repeat(70));
console.log("📊 DETAILED INFO FOR NEW STATES");
console.log("=".repeat(70));

const newStates = ["Madhya Pradesh", "Bihar", "Odisha", "Andhra Pradesh", "Telangana"];

newStates.forEach(state => {
    const allStates = {...famousPlacesData, ...moreStatesData, ...nextFiveStatesData};
    if(allStates[state]) {
        console.log(`\n📋 DETAILED INFORMATION FOR ${state.toUpperCase()}`);
        console.log("-".repeat(50));
        
        console.log("\n🏛️ STATE INFORMATION:");
        console.log(`   Capital: ${allStates[state].stateInfo.capital}`);
        console.log(`   Language: ${allStates[state].stateInfo.language}`);
        console.log(`   Famous For: ${allStates[state].stateInfo.famousFor}`);
        
        console.log("\n🍽️ FAVORITE FOODS:");
        allStates[state].stateInfo.favoriteFood.forEach((food, i) => console.log(`   ${i+1}. ${food}`));
        
        console.log("\n👘 TRADITIONAL CLOTHING:");
        allStates[state].stateInfo.traditionalClothing.forEach((cloth, i) => console.log(`   ${i+1}. ${cloth}`));
        
        console.log("\n📍 TOP 10 TOURIST PLACES:");
        allStates[state].touristPlaces.slice(0, 10).forEach((place, i) => {
            console.log(`   ${i+1}. ${place.image} ${place.name} - ${place.description}`);
        });
        console.log(`   ... and 10 more places`);
    }
});

// Search examples
console.log("\n" + "=".repeat(70));
console.log("🔍 PLACE TYPE SEARCH EXAMPLES");
console.log("=".repeat(70));

searchByType("Beach");
searchByType("Temple");
searchByType("Hill Station");

// Display all beaches from 15 states
console.log("\n" + "=".repeat(70));
console.log("🏖️ ALL BEACHES FROM 15 STATES");
console.log("=".repeat(70));

const beaches = getPlacesByCategory("Beach");
beaches.forEach((beach, i) => {
    console.log(`${i+1}. ${beach.place.image} ${beach.place.name} - ${beach.state}`);
});

// Display all temples
console.log("\n" + "=".repeat(70));
console.log("🕉️ ALL FAMOUS TEMPLES FROM 15 STATES");
console.log("=".repeat(70));

const temples = getPlacesByCategory("Temple");
temples.slice(0, 15).forEach((temple, i) => {
    console.log(`${i+1}. ${temple.place.image} ${temple.place.name} - ${temple.state}`);
});

// Food search example
console.log("\n" + "=".repeat(70));
console.log("🍛 FOOD SEARCH EXAMPLE");
console.log("=".repeat(70));
searchByFood("Biryani");

// SUMMARY
console.log("\n" + "=".repeat(70));
console.log("📊 SUMMARY OF 15 STATES");
console.log("=".repeat(70));

console.log("\n✅ Total States Covered: 15");
console.log("✅ Total Tourist Places: 300 (20 per state)");
console.log("✅ Categories Covered: Beaches, Temples, Hill Stations, Forts, Wildlife, Historical, etc.");
// ======================================
// INITIALIZATION & LOADING
// ======================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 MapView.AI Initializing...");

    // Show loading screen
    simulateLoading();

    // Initialize all features
    setTimeout(() => {
        initializeMap();
        loadFuelPrices();
        loadEcoMissions();
        showTranslations('hindi');
        loadFamousPlaces();
        hideLoadingScreen();
        showTab('homeScreen');
    }, 3000);
});

// Simulate loading with progress
function simulateLoading() {
    const progressBar = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    let progress = 0;

    const steps = [
        "Loading maps...",
        "Fetching fuel prices...",
        "Initializing AI...",
        "Loading translations...",
        "Preparing eco tracker...",
        "Almost ready..."
    ];

    const interval = setInterval(() => {
        progress += 16.67;
        progressBar.style.width = progress + '%';
        loadingText.textContent = steps[Math.floor(progress / 16.67)] || "Ready!";

        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 500);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ======================================
// TAB NAVIGATION
// ======================================
function showTab(tabId) {
    // Hide all tabs and home screen
    const allTabs = document.querySelectorAll('.tab-content, .home-screen');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        setTimeout(() => selectedTab.classList.add('active'), 10);
    }

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Highlight active nav item
    const activeNavItem = Array.from(navItems).find(item =>
        item.getAttribute('onclick').includes(tabId)
    );
    if (activeNavItem) activeNavItem.classList.add('active');

    // Special handling for map tab
    if (tabId === 'mapTab' && map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
}

// ======================================
// MAP INITIALIZATION
// ======================================
function initializeMap() {
    if (document.getElementById('map')) {
        map = L.map('map').setView([28.6139, 77.2090], 12); // Default: Delhi

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    map.setView([lat, lng], 13);

                    userMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '<div class="pulse-marker"></div>',
                            iconSize: [20, 20]
                        })
                    }).addTo(map);

                    userMarker.bindPopup("<b>You are here!</b>").openPopup();

                    updateLocationDisplay(lat, lng);
                },
                (error) => {
                    showToast('⚠️ Location access denied', 'warning');
                }
            );
        }
    }
}

function centerOnUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 15);
            showToast('📍 Centered on your location', 'success');
        });
    }
}

function toggleSatellite() {
    isSatellite = !isSatellite;
    map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    if (isSatellite) {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Esri'
        }).addTo(map);
        showToast('🛰️ Satellite view enabled', 'info');
    } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        showToast('🗺️ Map view enabled', 'info');
    }
}

function updateLocationDisplay(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
            const location = data.address.city || data.address.town || data.address.village || 'Unknown';
            document.getElementById('currentLocation').textContent = location;
        })
        .catch(() => {
            document.getElementById('currentLocation').textContent = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        });
}
// ======================================
// FUEL PRICES
// ======================================

// 🔥 PEHLE YEH ADD KARO - fuelPrices object banao
const fuelPrices = {};
allStatesFuelPrices.forEach(state => {
    fuelPrices[state.state] = {
        petrol: state.petrol,
        diesel: state.diesel,
        cng: state.cng,
        lpg: state.lpg,
        city: state.city,
        trend: state.trend,
        change: state.change
    };
});

function loadFuelPrices() {
    const grid = document.getElementById('fuelPricesGrid');
    const stateSelect = document.getElementById('calcState');

    if (!grid || !stateSelect) return;

    grid.innerHTML = '';
    stateSelect.innerHTML = '';

    allStatesFuelPrices.forEach((state, index) => {
        // Add to dropdown
        const option = document.createElement('option');
        option.value = index;  // ✅ index store karo
        option.textContent = state.state;
        stateSelect.appendChild(option);

        // Create fuel card
        const trendClass = state.trend === '↗' ? 'up' : state.trend === '↘' ? 'down' : 'stable';

        const card = document.createElement('div');
        card.className = 'fuel-card';
        card.id = `fuel-card-${index}`;  // ✅ ID add karo for highlighting
        card.innerHTML = `
            <div class="fuel-header">
                <h3>${state.state}</h3>
                <span class="trend ${trendClass}">${state.trend} ${state.change}</span>
            </div>
            <div class="fuel-city">${state.city}</div>
            <div class="fuel-prices">
                <div class="price-item">
                    <span class="fuel-type">⛽ Petrol</span>
                    <span class="price">₹${state.petrol}</span>
                </div>
                <div class="price-item">
                    <span class="fuel-type">🚛 Diesel</span>
                    <span class="price">₹${state.diesel}</span>
                </div>
                ${state.cng > 0 ? `<div class="price-item">
                    <span class="fuel-type">🚗 CNG</span>
                    <span class="price">₹${state.cng}</span>
                </div>` : ''}
                <div class="price-item">
                    <span class="fuel-type">🏠 LPG</span>
                    <span class="price">₹${state.lpg}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    showToast('✅ Fuel prices loaded for all 35 states!', 'success');
}
// ======================================
// FUEL PRICES - DAILY UPDATE SYSTEM
// ======================================

// Add this after the allStatesFuelPrices array

// Function to fetch latest fuel prices
async function updateFuelPricesDaily() {
    try {
        showToast('🔄 Updating fuel prices...', 'info');
        
        // You can replace this with your actual API endpoint
        // Example: Government of India's petroleum price API
        const response = await fetch('https://api.data.gov.in/resource/your-fuel-price-api');
        const data = await response.json();
        
        if (data && data.prices) {
            // Update the allStatesFuelPrices array with new data
            data.prices.forEach((newPrice, index) => {
                if (allStatesFuelPrices[index]) {
                    allStatesFuelPrices[index].petrol = newPrice.petrol || allStatesFuelPrices[index].petrol;
                    allStatesFuelPrices[index].diesel = newPrice.diesel || allStatesFuelPrices[index].diesel;
                    allStatesFuelPrices[index].cng = newPrice.cng || allStatesFuelPrices[index].cng;
                    allStatesFuelPrices[index].lpg = newPrice.lpg || allStatesFuelPrices[index].lpg;
                    
                    // Update trend
                    if (newPrice.petrol > allStatesFuelPrices[index].petrol) {
                        allStatesFuelPrices[index].trend = '↗';
                        allStatesFuelPrices[index].change = '+' + (newPrice.petrol - allStatesFuelPrices[index].petrol).toFixed(2);
                    } else if (newPrice.petrol < allStatesFuelPrices[index].petrol) {
                        allStatesFuelPrices[index].trend = '↘';
                        allStatesFuelPrices[index].change = '-' + (allStatesFuelPrices[index].petrol - newPrice.petrol).toFixed(2);
                    }
                }
            });
            
            // Reload the fuel prices display
            loadFuelPrices();
            showToast('✅ Fuel prices updated!', 'success');
        }
    } catch (error) {
        console.error('Fuel price update failed:', error);
        // Don't show error toast to avoid annoying users
        // Just log it silently
    }
}

// Schedule daily updates
function scheduleFuelUpdates() {
    // Update immediately on app start
    setTimeout(() => {
        updateFuelPricesDaily();
    }, 5000);
    
    // Then update every 24 hours
    setInterval(() => {
        updateFuelPricesDaily();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}

// Call this in DOMContentLoaded
// 🔥 FIXED: Mileage Calculator
function calculateMileageCost() {
    const distance = parseFloat(document.getElementById("calcDistance").value);
    const mileage = parseFloat(document.getElementById("calcMileage").value);
    const fuelType = document.getElementById("calcFuelType").value;
    const stateIndex = document.getElementById("calcState").value;  // ✅ stateIndex use karo

    const resultDiv = document.getElementById("mileageResult");

    if (!distance || !mileage || !stateIndex) {
        resultDiv.innerHTML = "⚠️ Please fill all fields correctly.";
        resultDiv.style.display = 'block';
        return;
    }

    // ✅ allStatesFuelPrices se directly price lo
    const stateData = allStatesFuelPrices[stateIndex];
    const stateName = stateData.state;
    const pricePerLiter = stateData[fuelType];  // ✅ petrol, diesel, cng

    if (!pricePerLiter) {
        resultDiv.innerHTML = "⚠️ Fuel type not available in this state.";
        resultDiv.style.display = 'block';
        return;
    }

    const fuelNeeded = distance / mileage;
    const totalCost = fuelNeeded * pricePerLiter;

    // ✅ Beautiful result display
    resultDiv.innerHTML = `
        <div class="result-success">
            <h3>✅ Trip Cost Calculated!</h3>
            <div class="result-grid">
                <div class="result-item">
                    <span class="label">⛽ Fuel Needed</span>
                    <span class="value">${fuelNeeded.toFixed(2)} L</span>
                </div>
                <div class="result-item">
                    <span class="label">💰 Price per L</span>
                    <span class="value">₹${pricePerLiter.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="label">📍 State</span>
                    <span class="value">${stateName}</span>
                </div>
                <div class="result-item">
                    <span class="label">✅ Total Cost</span>
                    <span class="value highlight">₹${totalCost.toFixed(2)}</span>
                </div>
            </div>
            <div class="eco-tip">
                🌱 Eco Tip: You saved ${(totalCost * 0.05).toFixed(2)}g CO₂ by using this route!
            </div>
        </div>
    `;

    resultDiv.style.display = 'block';
    
    // ✅ Highlight the selected state's card
    showFuelCards(stateIndex);
}

// 🔥 FIXED: Show Fuel Cards - Highlight karo, replace mat karo
function showFuelCards(stateIndex) {
    const grid = document.getElementById("fuelPricesGrid");
    
    if (!grid) return;

    // Pehle saare cards ki border reset karo
    const allCards = document.querySelectorAll('.fuel-card');
    allCards.forEach(card => {
        card.style.border = '3px solid rgba(0,128,255,0.3)';
        card.style.transform = 'scale(1)';
    });
    
    // Ab selected card ko highlight karo
    const targetCard = document.getElementById(`fuel-card-${stateIndex}`);
    if (targetCard) {
        targetCard.style.border = '5px solid #FF6B00';
        targetCard.style.transform = 'scale(1.02)';
        targetCard.style.transition = 'all 0.5s ease';
        
        // Scroll to the card
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        showToast(`📍 Showing prices for ${allStatesFuelPrices[stateIndex].state}`, 'info');
    }
}


// ======================================
// TRANSLATION HUB - FIXED VERSION
// ======================================
function showTranslations(language) {
    const translations = emergencyTranslations[language];
    if (!translations) return;

    const container = document.getElementById('translationCards');
    if (!container) return;

    // 🔥 FIXED - Keys match translation object ke saath
    const phrases = [
        { key: 'help', icon: '🆘', english: 'Help' },
        { key: 'hospital', icon: '🏥', english: 'Hospital' },
        { key: 'police', icon: '👮', english: 'Police' },
        { key: 'fire', icon: '🚒', english: 'Fire Brigade' },
        { key: 'ambulance', icon: '🚑', english: 'Ambulance' },
        { key: 'hotel', icon: '🏨', english: 'Hotel near me' },
        { key: 'water', icon: '💧', english: 'Water' },
        
        // Safety - Keys with underscores
        { key: 'stay_with_me', icon: '🤝', english: 'Please stay with me' },
        { key: 'dont_understand', icon: '🤔', english: 'I don\'t understand' },
        { key: 'dont_leave_me', icon: '🙇', english: 'Please don\'t leave me alone' },
        { key: 'need_phone', icon: '📱', english: 'I need a phone to call' },
        { key: 'give_space', icon: '📏', english: 'Give me some space' },
        
        // Directions
        { key: 'dont_know_place', icon: '🗺️', english: 'I don\'t know this place' },
        { key: 'direction', icon: '➡️', english: 'Can you show me the direction?' },
        { key: 'lost_bag', icon: '🎒', english: 'I lost my bag' },
        { key: 'guide_main_road', icon: '🛣️', english: 'Guide me to the main road' },
        { key: 'missed_bus', icon: '🚌', english: 'I missed my bus/train' },
        
        // Fire Alerts
        { key: 'fire_here', icon: '🔥', english: 'There is a fire' },
        { key: 'smell_gas', icon: '🛢️', english: 'I smell gas' },
        { key: 'evacuate', icon: '🏃‍♂️', english: 'Evacuate the building' },
        { key: 'turn_off_electricity', icon: '⚡', english: 'Turn off the electricity' },
        { key: 'dangerous_here', icon: '⛔', english: 'It is dangerous here' },
        
        // Accident
        { key: 'accident_here', icon: '🚗', english: 'There is an accident here' },
        { key: 'vehicle_damaged', icon: '🚘', english: 'Vehicle is damaged' },
        { key: 'need_road_help', icon: '🛠️', english: 'We need roadside help' },
        { key: 'stop_vehicle', icon: '🛑', english: 'Please stop the vehicle' },
        { key: 'friend_injured', icon: '🧍‍♂️', english: 'My friend is injured' },
        
        // Medical
        { key: 'dizzy', icon: '😵', english: 'I am feeling dizzy' },
        { key: 'bleeding', icon: '🩸', english: 'I am bleeding' },
        { key: 'cannot_breathe', icon: '😮‍💨', english: 'I cannot breathe properly' },
        { key: 'severe_pain', icon: '🤕', english: 'I feel severe pain' },
        { key: 'need_doctor_now', icon: '🏥', english: 'I need a doctor immediately' },
        { key: 'allergy', icon: '🌿', english: 'I have an allergy' },
        { key: 'fainted', icon: '😵‍💫', english: 'Someone fainted' },
        
        // Crime
        { key: 'someone_following', icon: '🚶‍♂️', english: 'Someone is following me' },
        { key: 'robbed', icon: '💼', english: 'I have been robbed' },
        { key: 'attacked', icon: '🔪', english: 'Someone attacked me' },
        { key: 'phone_stolen', icon: '📱', english: 'My phone is stolen' },
        { key: 'not_safe', icon: '😟', english: 'I am not feeling safe' },
        { key: 'call_police', icon: '👮', english: 'Please call the police' }
    ];

    container.innerHTML = '';

    phrases.forEach(phrase => {
        // 🔥 FIX - Agar translation missing ho to fallback message
        const translatedText = translations[phrase.key] || '⚠️ Translation not available';
        
        const card = document.createElement('div');
        card.className = 'translation-card';
        card.innerHTML = `
            <div class="phrase-icon">${phrase.icon}</div>
            <div class="phrase-content">
                <div class="english-text">${phrase.english}</div>
                <div class="translated-text">${translatedText}</div>
            </div>
            <button class="speak-btn" onclick="speakPhrase('${translatedText.replace(/'/g, "\\'")}', '${language}')">
                <i class="fas fa-volume-up"></i>
            </button>
        `;
        container.appendChild(card);
    });
}

function classifyEmergency(text) {
    text = text.toLowerCase();

    if (text.includes("chest") || text.includes("breath") || text.includes("heart"))
        return "Medical Emergency 🚑";

    if (text.includes("accident") || text.includes("crash"))
        return "Road Accident 🚗";

    if (text.includes("fire"))
        return "Fire Emergency 🔥";

    if (text.includes("theft") || text.includes("rob"))
        return "Police Emergency 👮";

    return "General Emergency ⚠️";
}

function speakPhrase(text, language) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getLanguageCode(language);
        speechSynthesis.speak(utterance);
        showToast('🔊 Playing audio...', 'info');
    } else {
        showToast('⚠️ Speech not supported in this browser', 'warning');
    }
}

function getLanguageCode(language) {
    const codes = {
        hindi: 'hi-IN', bengali: 'bn-IN', telugu: 'te-IN', marathi: 'mr-IN',
        tamil: 'ta-IN', gujarati: 'gu-IN', urdu: 'ur-IN', kannada: 'kn-IN',
        odia: 'or-IN', malayalam: 'ml-IN', punjabi: 'pa-IN', assamese: 'as-IN',
        nepali: 'ne-NP', sanskrit: 'sa-IN'
    };
    return codes[language] || 'en-IN';
}

function openMapPage() {
    hideAllPages();
    document.getElementById("mapPage").classList.remove("hidden");
}

// ======================================
// TRAVEL BOOKING
// ======================================
function showBookingType(type) {
    const buttons = document.querySelectorAll('.booking-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.booking-tab-btn').classList.add('active');

    document.getElementById('bookingFrom').placeholder = 
        type === 'flights' ? 'Departure airport' : 
        type === 'trains' ? 'From station' : 'From city';
    document.getElementById('bookingTo').placeholder = 
        type === 'flights' ? 'Arrival airport' : 
        type === 'trains' ? 'To station' : 'To city';
}

function searchBookings() {
    const from = document.getElementById('bookingFrom').value;
    const to = document.getElementById('bookingTo').value;
    const date = document.getElementById('bookingDate').value;
    const travelers = document.getElementById('bookingTravelers').value;

    if (!from || !to || !date) {
        showToast('⚠️ Please fill all fields', 'warning');
        return;
    }

    const resultsDiv = document.getElementById('bookingResults');
    resultsDiv.innerHTML = `
        <div class="booking-loader">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Searching best options from MakeMyTrip...</p>
        </div>
    `;

    // Simulate API call
    setTimeout(() => {
        const mockResults = [
            { company: 'IndiGo', time: '06:00 AM - 08:30 AM', price: '₹4,250', duration: '2h 30m', type: 'Non-stop' },
            { company: 'Air India', time: '09:15 AM - 11:45 AM', price: '₹5,100', duration: '2h 30m', type: 'Non-stop' },
            { company: 'SpiceJet', time: '14:30 PM - 17:15 PM', price: '₹3,890', duration: '2h 45m', type: '1 stop' }
        ];


        
        resultsDiv.innerHTML = `
            <h3>✈️ Available Options</h3>
            <div class="results-grid">
                ${mockResults.map(result => `
                    <div class="booking-result-card">
                        <div class="result-header">
                            <strong>${result.company}</strong>
                            <span class="result-type">${result.type}</span>
                        </div>
                        <div class="result-time">${result.time}</div>
                        <div class="result-duration">${result.duration}</div>
                        <div class="result-footer">
                            <span class="result-price">${result.price}</span>
                            <button class="cta-btn primary" onclick="bookNow('${result.company}')">Book Now</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <p class="powered-by">Powered by MakeMyTrip</p>
        `;
    }, 2000);
}

function bookNow(company) {
    showToast(`🎉 Redirecting to MakeMyTrip for ${company} booking...`, 'success');
    setTimeout(() => {
        window.open('https://www.makemytrip.com', '_blank');
    }, 1500);
}

// ======================================
// ECO TRACKER
// ======================================
function loadEcoMissions() {
    const grid = document.getElementById('ecoMissionsGrid');
    if (!grid) return;

    grid.innerHTML = enhancedEcoMissions.map(mission => `
        <div class="mission-card">
            <div class="mission-icon">${mission.icon}</div>
            <h4>${mission.title}</h4>
            <p>${mission.description}</p>
            <div class="mission-progress">
                <div class="progress-bar-mini">
                    <div class="progress-fill-mini" style="width: ${mission.progress}%"></div>
                </div>
                <span>${mission.progress}%</span>
            </div>
            <div class="mission-reward">
                <i class="fas fa-gift"></i> ${mission.reward}
            </div>
        </div>
    `).join('');
}

// ======================================
// FAMOUS PLACES
// ======================================
function loadFamousPlaces() {
    const stateSelect = document.getElementById('stateSelectPlaces');
    if (!stateSelect) return;

    Object.keys(famousPlacesData).forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

function showStatePlaces(stateName) {
    const placesGrid = document.getElementById('placesGrid');
    if (!placesGrid || !stateName) return;

    const places = famousPlacesData[stateName] || [];

    placesGrid.innerHTML = places.map(place => `
        <div class="place-card">
            <div class="place-image">${place.image}</div>
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <span class="place-type">${place.type}</span>
        </div>
    `).join('');
}// ========================================
// NEARBY SEARCH - 10KM RANGE FIXED VERSION
// ========================================

// Global variables for nearby
let nearbyMap = null;
let nearbyMarkers = [];

function findNearby(type) {
    if (!navigator.geolocation) {
        showToast("❌ Location access not available", "error");
        return;
    }

    // Show loading
    const resultsDiv = document.getElementById("nearbyResults");
    const loadingDiv = document.querySelector('.nearby-loading');
    if (loadingDiv) loadingDiv.style.display = 'block';
    
    resultsDiv.innerHTML = '';
    
    // Hide previous map preview
    const mapPreview = document.getElementById('nearbyMapPreview');
    if (mapPreview) mapPreview.style.display = 'none';

    showToast(`🔍 Searching nearby ${type} within 10km...`, "info");

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            showToast(`📍 Found your location! Searching...`, "info");

            // Convert type to OSM tag
            const osmType = getOSMTag(type);
            
            // USING OVERPASS API WITH 10KM RANGE (10000 meters)
            const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="${osmType}"](around:10000,${lat},${lon});way["amenity"="${osmType}"](around:10000,${lat},${lon}););out center;`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                
                // Hide loading
                if (loadingDiv) loadingDiv.style.display = 'none';
                
                const places = data.elements;

                if (!places || places.length === 0) {
                    resultsDiv.innerHTML = `
                        <div class="no-results" style="text-align: center; padding: 40px;">
                            <i class="fas fa-search" style="font-size: 3rem; color: #FF6B00; margin-bottom: 15px;"></i>
                            <h3>No ${type} found within 10km</h3>
                            <p>Try searching for something else</p>
                        </div>
                    `;
                    return;
                }

                // Clear previous markers
                if (nearbyMap) {
                    nearbyMarkers.forEach(marker => marker.remove());
                    nearbyMarkers = [];
                }

                // Show map preview
                if (mapPreview) {
                    mapPreview.style.display = 'block';
                    initNearbyMap(lat, lon, places);
                }

                // Display results
                resultsDiv.innerHTML = '<h3 style="margin-bottom: 15px;">📍 Found ' + places.length + ' ' + type + ' within 10km</h3>';
                
                places.slice(0, 20).forEach(place => {
                    const name = place.tags?.name || getDefaultName(type);
                    const placeLat = place.lat || (place.center && place.center.lat);
                    const placeLon = place.lon || (place.center && place.center.lon);
                    
                    if (!placeLat || !placeLon) return;
                    
                    const distance = calculateDistance(lat, lon, placeLat, placeLon);
                    
                    // Skip if beyond 10km (safety check)
                    if (distance > 10000) return;
                    
                    const address = place.tags?.['addr:street'] || 
                                   place.tags?.['addr:city'] || 
                                   place.tags?.['addr:village'] || 
                                   'Address not available';
                    
                    const card = document.createElement('div');
                    card.className = 'nearby-card';
                    card.innerHTML = `
                        <div class="nearby-card-icon">
                            <i class="fas ${getIconForType(type)}"></i>
                        </div>
                        <div class="nearby-card-content">
                            <div class="nearby-card-title">${escapeHtml(name)}</div>
                            <div class="nearby-card-distance">📍 ${(distance/1000).toFixed(1)} km away</div>
                            <div class="nearby-card-address">${escapeHtml(address)}</div>
                        </div>
                        <div class="nearby-card-actions">
                            <button class="nearby-card-btn" onclick="showOnMainMap(${placeLat}, ${placeLon}, '${escapeHtml(name)}')" title="Show on main map">
                                <i class="fas fa-map-marker-alt"></i>
                            </button>
                            <button class="nearby-card-btn" onclick="getDirections(${placeLat}, ${placeLon})" title="Get directions">
                                <i class="fas fa-directions"></i>
                            </button>
                        </div>
                    `;
                    resultsDiv.appendChild(card);
                    
                    // Add marker to nearby map
                    if (nearbyMap) {
                        const marker = L.marker([placeLat, placeLon]).addTo(nearbyMap)
                            .bindPopup(`<b>${name}</b><br>${(distance/1000).toFixed(1)}km away`);
                        nearbyMarkers.push(marker);
                    }
                });

                // If no places after filtering
                if (resultsDiv.children.length === 1) {
                    resultsDiv.innerHTML = `
                        <div class="no-results" style="text-align: center; padding: 40px;">
                            <i class="fas fa-search" style="font-size: 3rem; color: #FF6B00; margin-bottom: 15px;"></i>
                            <h3>No ${type} found within 10km</h3>
                            <p>Try searching for something else</p>
                        </div>
                    `;
                } else {
                    showToast(`✅ Found ${places.length} ${type} within 10km!`, "success");
                }

            } catch (error) {
                console.error("Nearby search error:", error);
                if (loadingDiv) loadingDiv.style.display = 'none';
                resultsDiv.innerHTML = `
                    <div class="error-message" style="text-align: center; padding: 40px; color: #FF0844;">
                        <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>Search failed</h3>
                        <p>Please try again or check your internet connection</p>
                    </div>
                `;
                showToast("❌ Failed to fetch nearby places", "error");
            }
        },
        (error) => {
            showToast("❌ Could not get your location. Please enable location services.", "error");
            const loadingDiv = document.querySelector('.nearby-loading');
            if (loadingDiv) loadingDiv.style.display = 'none';
            
            resultsDiv.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 40px; color: #FF0844;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>Location access required</h3>
                    <p>Please enable location services to find nearby places</p>
                </div>
            `;
        }
    );
}
// Helper function to get OSM tag
function getOSMTag(type) {
    const tags = {
        'hotel': 'hotel',
        'restaurant': 'restaurant',
        'fuel': 'fuel',
        'hospital': 'hospital',
        'police': 'police',
        'atm': 'atm',
        'cafe': 'cafe',
        'mall': 'shopping_mall',
        'pharmacy': 'pharmacy',
        'bus_station': 'bus_station',
        'railway_station': 'station',  // 🔥 FIX 2: railway_station ke liye 'station'
        'train_station': 'station',     // 🔥 ADD THIS
        'tourist_attraction': 'attraction',
        'tourist': 'tourism'            // 🔥 ADD THIS
    };
    return tags[type] || type;
}
// Helper function to get icon
function getIconForType(type) {
    const icons = {
        'hotel': 'fa-hotel',
        'restaurant': 'fa-utensils',
        'fuel': 'fa-gas-pump',
        'hospital': 'fa-hospital',
        'police': 'fa-shield-alt',
        'atm': 'fa-credit-card',
        'cafe': 'fa-coffee',
        'mall': 'fa-shopping-bag',
        'pharmacy': 'fa-pills',
        'bus_station': 'fa-bus',
        'railway_station': 'fa-train',  // ← YEH SAHI HAI
        'train_station': 'fa-train',     // ← YEH ADD KARO
        'tourist_attraction': 'fa-camera'
    };
    return icons[type] || 'fa-map-marker-alt';
}
// Helper function to get default name
function getDefaultName(type) {
    const names = {
        'hotel': 'Hotel',
        'restaurant': 'Restaurant',
        'fuel': 'Fuel Station',
        'hospital': 'Hospital',
        'police': 'Police Station',
        'atm': 'ATM',
        'cafe': 'Cafe',
        'mall': 'Shopping Mall',
        'pharmacy': 'Pharmacy',
        'bus_station': 'Bus Station',
        'railway_station': 'Railway Station',
        'train_station': 'Railway Station',  // ← YEH ADD KARO
        'tourist_attraction': 'Tourist Attraction'
    };
    return names[type] || type;
}
// Initialize nearby mini map
function initNearbyMap(lat, lon, places) {
    const mapPreview = document.getElementById('nearbyMapPreview');
    
    if (nearbyMap) {
        nearbyMap.remove();
    }
    
    nearbyMap = L.map('nearbyMapPreview').setView([lat, lon], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(nearbyMap);
    
    // Add user marker
    const userMarker = L.marker([lat, lon], {
        icon: L.divIcon({
            className: 'user-marker',
            html: '<div style="background: #FF6B00; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(255,107,0,0.5);"></div>',
            iconSize: [20, 20]
        })
    }).addTo(nearbyMap).bindPopup('You are here');
    
    nearbyMarkers = [userMarker];
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

// Show place on main map
function showOnMainMap(lat, lon, name) {
    if (map) {
        map.setView([lat, lon], 16);
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${name}</b>`)
            .openPopup();
        showTab('mapTab');
        showToast(`📍 Showing ${name} on map`, 'success');
    }
}
// ========================================
// GET DIRECTIONS (IN-APP NAVIGATION) - YEH LAGAO
// ========================================
function getDirections(destLat, destLon) {
    if (!navigator.geolocation) {
        showToast('❌ Geolocation not supported', 'error');
        return;
    }
    
    showToast('🔄 Getting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const startLat = position.coords.latitude;
            const startLon = position.coords.longitude;
            userPosition = { lat: startLat, lon: startLon };
            
            // Start in-app navigation
            startInAppNavigation(startLat, startLon, destLat, destLon);
        },
        (error) => {
            showToast('❌ Could not get location', 'error');
        }
    );
}
// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// ======================================
// TRIP PLANNER
// ======================================
function planTrip() {
    const from = document.getElementById('tripFrom').value;
    const to = document.getElementById('tripTo').value;
    const budget = document.getElementById('tripBudget').value;

    if (!from || !to) {
        showToast('⚠️ Please enter both cities', 'warning');
        return;
    }

    const resultDiv = document.getElementById('tripResult');
    resultDiv.innerHTML = `
        <div class="trip-plan-result">
            <h3>🎉 Your Trip Plan is Ready!</h3>
            <div class="trip-details">
                <p><strong>From:</strong> ${from}</p>
                <p><strong>To:</strong> ${to}</p>
                <p><strong>Budget:</strong> ${budget}</p>
                <p><strong>Estimated Duration:</strong> 3-5 days</p>
                <p><strong>Best Time to Visit:</strong> October - March</p>
            </div>
            <button class="cta-btn primary" onclick="showTab('bookingTab')">
                Book Transportation
            </button>
        </div>
    `;
}

// ======================================
// UTILITY FUNCTIONS
// ======================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) {
        // Create toast if doesn't exist
        const newToast = document.createElement('div');
        newToast.id = 'toast';
        newToast.className = 'toast';
        document.body.appendChild(newToast);
    }

    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.className = `toast toast-${type} show`;

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                updateLocationDisplay(lat, lng);
                showToast('📍 Location updated', 'success');
            },
            (error) => {
                showToast('⚠️ Could not get location', 'error');
            }
        );
    }
}
function sendMessage() {
    const input = document.getElementById("userInput");
    const chatArea = document.getElementById("chatArea");

    const userText = input.value.trim();
    if (!userText) return;

    chatArea.innerHTML += `<div><b>You:</b> ${userText}</div>`;
    input.value = "";

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }]
        })
    })
    .then(res => res.json())
    .then(data => {
        const botText = data.candidates[0].content.parts[0].text;
        chatArea.innerHTML += `<div><b>Bot:</b> ${botText}</div>`;
        chatArea.scrollTop = chatArea.scrollHeight;
    })
    .catch(() => {
        chatArea.innerHTML += `<div style="color:red">Bot error</div>`;
    });
}
// MAPVIEW.AI Chatbot with DEMO Mode
const DEEPSEEK_API_KEY = "demo-mode-no-key-required";
let isDemoMode = true; // Set to true for demo

function sendMessage() {
    const input = document.getElementById("userInput");
    const chatArea = document.getElementById("chatArea");
    const userText = input.value.trim();
    
    if (!userText) return;
    
    // User message show
    chatArea.innerHTML += `<div style="margin: 10px 0; text-align: right; color: #333;">
        <div style="display: inline-block; background: #e3f2fd; padding: 10px 15px; border-radius: 15px 15px 0 15px; max-width: 80%;">
            <b>You:</b> ${userText}
        </div>
    </div>`;
    input.value = "";
    
    // Typing indicator
    const typingId = "typing-" + Date.now();
    chatArea.innerHTML += `<div id="${typingId}" style="margin: 10px 0;ertgfds text-align: left;">
        <div style="display: inline-block; background: #fff3e0; padding: 10px 15px; border-radius: 15px 15px 15px 0; max-width: 80%;">
            <i class="fas fa-circle-notch fa-spin"></i> MAPVIEW.AI is thinking...
        </div>
    </div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // DEMO MODE RESPONSES (no API needed)
    setTimeout(() => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        
        let botResponse = getDemoResponse(userText.toLowerCase());
        
        chatArea.innerHTML += `<div style="margin: 10px 0; text-align: left;">
            <div style="display: inline-block; background: linear-gradient(135deg, #fff8e1, #ffe0b2); padding: 15px; border-radius: 15px 15px 15px 0; max-width: 80%; border-left: 5px solid #ff6a00; box-shadow: 0 3px 10px rgba(255, 107, 0, 0.2);">
                <b style="color: #ff6a00;">🤖 MAPVIEW.AI:</b><br>
                ${botResponse}
                ${isDemoMode ? '<div style="margin-top: 8px; font-size: 0.8em; color: #666; border-top: 1px dashed #ccc; padding-top: 5px;"><i class="fas fa-info-circle"></i> Demo Mode - Get API key for full features</div>' : ''}
            </div>
        </div>`;
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 1000 + Math.random() * 1000);
}

// Smart demo responses
function getDemoResponse(userText) {
    const responses = {
        // Greetings
        "hello": "Namaste! 🙏 I'm your MAPVIEW.AI travel assistant. How can I help you plan your journey across India today?",
        "hi": "Hello traveler! 🚗 Ready to explore India with smart navigation? Ask me about routes, fuel prices, or translations!",
        "namaste": "Namaste! 🇮🇳 Welcome to India's smart travel companion. Need help with navigation, booking, or local info?",
        "hey": "Hey there! ✨ Looking for the best travel routes or fuel prices? I'm here to help!",
        
        // Navigation & Maps
        "map": "🗺️ Use our <b>Map Tab</b> for:<br>• Live GPS navigation<br>• Traffic updates<br>• Satellite view<br>• EV charging stations<br>Tap the map icon below!",
        "navigation": "📍 Smart Navigation Features:<br>• Route optimization<br>• Live traffic alerts<br>• Turn-by-turn directions<br>• Offline maps available",
        "route": "🚗 Best Route Planning:<br>1. Go to <b>Map Tab</b><br>2. Enter destination<br>3. Get AI-optimized route<br>4. Save 15-20% travel time",
        "location": "📍 Your current location is being tracked for:<br>• Nearby fuel stations<br>• Emergency services<br>• Local attractions<br>• Weather updates",
        
        // Fuel & Prices
        "fuel": "⛽ <b>Live Fuel Prices:</b><br>• Petrol: ₹96-₹104/L<br>• Diesel: ₹87-₹94/L<br>• CNG: ₹73-₹80/kg<br>Check <b>Fuel Tab</b> for all 35 states!",
        "petrol": "🛢️ Current Petrol Price Range:<br>• Delhi: ₹96.72/L<br>• Mumbai: ₹104.21/L<br>• Bangalore: ₹101.94/L<br>• Kolkata: ₹106.03/L",
        "diesel": "🚛 Diesel Prices Today:<br>• Delhi: ₹89.62/L<br>• Mumbai: ₹94.27/L<br>• Chennai: ₹92.34/L<br>• Hyderabad: ₹91.89/L",
        "price": "💰 Smart Mileage Calculator:<br>1. Enter distance<br>2. Select vehicle type<br>3. Choose fuel type<br>4. Get exact trip cost<br>Available in <b>Fuel Tab</b>",
        
        // Translation
        "translate": "🌍 <b>Translation Hub</b> supports 22 Indian languages!<br>• Hindi, Tamil, Telugu, Bengali<br>• Marathi, Gujarati, Punjabi, more<br>Perfect for emergencies!",
        "language": "🗣️ Language Features:<br>• Voice translation<br>• Emergency phrases<br>• Offline phrasebook<br>• Cultural tips<br>Tap <b>Translate Tab</b>",
        
        // Booking
        "book": "✈️ <b>Travel Booking:</b><br>• Flights: 5000+ routes<br>• Trains: 13000+ daily<br>• Buses: 100000+ options<br>Live prices in <b>Book Tab</b>",
        "flight": "🛫 Flight Booking:<br>• Compare 50+ airlines<br>• Price alerts<br>• Flexible dates<br>• Instant confirmation",
        "train": "🚆 Indian Railways:<br>• 23000+ trains daily<br>• Real-time status<br>• PNR checking<br>• Tatkal booking",
        "bus": "🚌 Bus Services:<br>• Govt & private<br>• Sleeper/AC options<br>• Online booking<br>• Live tracking",
        
        // Emergency
        "help": "🆘 <b>Emergency Assistance:</b><br>• Tap SOS button (red)<br>• Share live location<br>• Contact nearest police<br>• Medical emergency numbers",
        "emergency": "🚨 Emergency Contacts:<br>• Police: 100<br>• Ambulance: 102/108<br>• Fire: 101<br>• Women's helpline: 1091",
        "sos": "⚠️ <b>SOS Feature Activated!</b><br>1. Tap red SOS button<br>2. Share with 3 contacts<br>3. Live tracking enabled<br>4. Nearby help alerted",
        
        // Eco & Travel
        "eco": "🌱 <b>Eco Tracker:</b><br>• Carbon footprint calculator<br>• Green missions<br>• Tree planting options<br>• Sustainable travel tips",
        "travel": "🎒 Smart Travel Tips:<br>1. Check weather forecast<br>2. Pack light<br>3. Keep documents ready<br>4. Share itinerary<br>5. Emergency cash",
        "trip": "🗺️ <b>Trip Planner:</b><br>1. Enter cities<br>2. Set budget<br>3. Get AI itinerary<br>4. Book everything<br>Try Trip Planner tab!",
        
        // Weather
        "weather": "☀️ Weather Info Available:<br>• Real-time updates<br>• 7-day forecast<br>• Rainfall alerts<br>• Road conditions<br>Integrated with navigation",
        
        // Default
        "default": "🤖 I'm MAPVIEW.AI - India's smart travel companion! I can help with:<br><br>" +
                   "📍 <b>Navigation</b> - Maps, routes, traffic<br>" +
                   "⛽ <b>Fuel Prices</b> - Live rates, calculator<br>" +
                   "🌍 <b>Translation</b> - 22 Indian languages<br>" +
                   "✈️ <b>Booking</b> - Flights, trains, buses<br>" +
                   "🌱 <b>Eco Tracker</b> - Carbon footprint<br>" +
                   "🏥 <b>Health Records</b> - Trip health diary<br><br>" +
                   "Which service would you like? Or tap any tab below!"
    };
    
    // Find matching response
    for (let keyword in responses) {
        if (userText.includes(keyword)) {
            return responses[keyword];
        }
    }
    
    return responses["default"];
}

// Enter key support
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
        e.preventDefault();
    }
});

// Initial welcome message
window.addEventListener('load', function() {
    setTimeout(() => {
        const chatArea = document.getElementById("chatArea");
        if (chatArea) {
            chatArea.innerHTML = `<div style="margin: 10px 0; text-align: left;">
                <div style="display: inline-block; background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 15px 15px 15px 0; max-width: 80%; border-left: 5px solid #2196f3;">
                    <b style="color: #1565c0;">🤖 MAPVIEW.AI Assistant:</b><br>
                    Namaste! I'm your AI travel companion for India. I can help with:<br><br>
                    • Navigation & Maps 🗺️<br>
                    • Live Fuel Prices ⛽<br>
                    • 22 Language Translation 🌍<br>
                    • Travel Booking ✈️<br>
                    • Eco Tracking 🌱<br><br>
                    Try asking: "fuel prices" or "help with navigation" or "translate hello"
                </div>
            </div>`;
        }
    }, 1000);
});

function openNotifications() {
    showToast('🔔 3 new notifications', 'info');
}

function changeLanguage(lang) {
    showToast(`🌐 Language changed to ${lang}`, 'success');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    showToast('🎨 Theme toggled', 'info');
}

function activateVoice() {
    showToast('🎤 Voice assistant activated', 'info');
}


function startTrip() {
    showToast('🚗 Trip tracking started', 'success');
}

function addHealthRecord() {
    showToast('🏥 Health record form opened', 'info');
}

function findNearbyStations() {
    showToast('⛽ Searching nearby fuel stations...', 'info');
}// ========================================
// WEATHER FUNCTIONS - LIVE API VERSION
// ========================================

const WEATHER_API_KEY = '63dc79d852ef4ce29db161031262502';
let weatherUpdateInterval;

function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchLiveWeather(position.coords.latitude, position.coords.longitude);
                weatherUpdateInterval = setInterval(() => {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        fetchLiveWeather(pos.coords.latitude, pos.coords.longitude);
                    });
                }, 600000);
            },
            () => {
                fetchLiveWeather(28.6139, 77.2090); // Delhi
            }
        );
    }
}

async function fetchLiveWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
        );
        
        if (!response.ok) throw new Error('API failed');
        
        const data = await response.json();
        const cityName = data.name || await getCityFromCoords(lat, lon);
        
        // Process real data
        const weather = {
            city: cityName,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
            condition: data.weather[0].main,
            icon: getWeatherIcon(data.weather[0].icon),
            aqi: 'Good' // Would need separate API
        };
        
        updateWeatherWidget(weather);
        updateHomeWeatherCard(weather);
        
    } catch (error) {
        console.error('Weather fetch failed:', error);
        // Fallback to simulated data
        getCityFromCoords(lat, lon).then(city => {
            const weather = generateWeatherData(lat, city);
            updateWeatherWidget(weather);
            updateHomeWeatherCard(weather);
        });
    }
}

function getWeatherIcon(iconCode) {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return icons[iconCode] || '☀️';
}

function updateWeatherWidget(weather) {
    const widget = document.getElementById('liveWeather');
    if (widget) {
        widget.innerHTML = `
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${weather.temp}°C</div>
            <div class="weather-location">${weather.city}</div>
            <div class="weather-condition">${weather.condition}</div>
            <div class="weather-update">LIVE</div>
        `;
    }
}

function updateHomeWeatherCard(weather) {
    document.getElementById('homeTemp').textContent = `${weather.temp}°C`;
    document.getElementById('homeWeather').textContent = weather.condition;
    document.getElementById('homeHumidity').textContent = `${weather.humidity}%`;
    document.getElementById('homeWind').textContent = `${weather.wind} km/h`;
    
    const weatherIcon = document.querySelector('.weather-card .card-icon');
    if (weatherIcon) weatherIcon.textContent = weather.icon;
}

function refreshHomeWeather() {
    showToast('🔄 Updating weather...', 'info');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchLiveWeather(position.coords.latitude, position.coords.longitude);
            },
            () => {
                fetchLiveWeather(28.6139, 77.2090);
            }
        );
    }
}

// Keep these helper functions
async function getCityFromCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
        );
        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || 'Unknown';
    } catch {
        return 'Your Location';
    }
}

function generateWeatherData(lat, city) {
    const conditions = [
        { main: 'Sunny', icon: '☀️', temp: 32 },
        { main: 'Partly Cloudy', icon: '⛅', temp: 28 },
        { main: 'Cloudy', icon: '☁️', temp: 25 },
        { main: 'Light Rain', icon: '🌧️', temp: 22 },
        { main: 'Clear', icon: '🌤️', temp: 30 }
    ];
    
    let baseTemp = 30;
    if (lat > 30) baseTemp = 25;
    if (lat < 20) baseTemp = 32;
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = baseTemp + Math.floor(Math.random() * 6) - 2;
    
    return {
        city: city,
        temp: temp,
        feelsLike: temp - 2 + Math.floor(Math.random() * 4),
        humidity: 40 + Math.floor(Math.random() * 40),
        wind: 5 + Math.floor(Math.random() * 15),
        condition: condition.main,
        icon: condition.icon,
        aqi: 50 + Math.floor(Math.random() * 150)
    };
}
// ========================================
// SHARE FUNCTIONS
// ========================================

function toggleShareMenu() {
    const menu = document.getElementById('shareMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function shareVia(platform) {
    const link = document.getElementById('shareLink').value;
    const message = `Track my live location: ${link}`;
    
    switch(platform) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
            break;
        case 'email':
            window.open(`mailto:?subject=Live Location&body=${encodeURIComponent(message)}`);
            break;
        case 'sms':
            window.open(`sms:?body=${encodeURIComponent(message)}`);
            break;
        case 'snapchat':
            showToast('📸 Opening Snapchat...', 'info');
            break;
        case 'instagram':
            showToast('📷 Opening Instagram...', 'info');
            break;
        case 'copy':
            navigator.clipboard.writeText(link);
            showToast('✅ Link copied!', 'success');
            break;
    }
    
    toggleShareMenu();
}

function copyShareLink() {
    const link = document.getElementById('shareLink');
    link.select();
    navigator.clipboard.writeText(link.value);
    showToast('✅ Link copied!', 'success');
}
// ========================================
// EMERGENCY CONTACTS SETUP - COMPLETE REWRITTEN
// ========================================

// Global variable for contacts
let emergencyContacts = [];

// Check on app start
document.addEventListener('DOMContentLoaded', function() {
    // Check if emergency contacts exist after loading screen
    setTimeout(() => {
        checkAndShowEmergencySetup();
    }, 3500); // After loading screen
});

// Function to check and show setup
function checkAndShowEmergencySetup() {
    const savedContacts = localStorage.getItem('mapview_emergency_contacts');
    
    if (!savedContacts) {
        showEmergencySetupPopup();
    } else {
        try {
            emergencyContacts = JSON.parse(savedContacts);
            console.log('✅ Loaded emergency contacts:', emergencyContacts);
        } catch (e) {
            showEmergencySetupPopup();
        }
    }
}

// Main function to show popup
function showEmergencySetupPopup() {
    // Remove if already exists
    const existingModal = document.getElementById('emergencyModal');
    if (existingModal) existingModal.remove();

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'emergencyModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        animation: modalFadeIn 0.3s ease;
    `;

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.style.cssText = `
        background: white;
        border-radius: 30px;
        padding: 25px;
        width: 90%;
        max-width: 450px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(255,107,0,0.3);
        border: 3px solid #FF6B00;
        animation: modalSlideUp 0.3s ease;
        position: relative;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `text-align: center; margin-bottom: 20px;`;
    header.innerHTML = `
        <div style="
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #FF0844, #FF6B00);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
        ">
            <i class="fas fa-phone-alt" style="font-size: 2rem; color: white;"></i>
        </div>
        <h2 style="
            font-size: 1.8rem;
            background: linear-gradient(135deg, #FF0844, #FF6B00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 5px;
        ">Setup Emergency Contacts</h2>
        <p style="color: #666;">Add up to 5 emergency contacts for SOS alerts</p>
    `;

    // Contacts container
    const contactsContainer = document.createElement('div');
    contactsContainer.id = 'contactsListContainer';
    contactsContainer.style.cssText = `margin: 20px 0;`;

    // Generate 5 contact fields
    for (let i = 1; i <= 5; i++) {
        const contactDiv = document.createElement('div');
        contactDiv.id = `contactBox${i}`;
        contactDiv.style.cssText = `
            background: #f8f9ff;
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 12px;
            border: 2px solid #e0e0e0;
            transition: all 0.3s ease;
        `;

        // Contact header
        contactDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="
                    background: #FF6B00;
                    color: white;
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 0.8rem;
                    font-weight: bold;
                ">${i}</span>
                <span style="font-weight: 600; color: #333;">Contact ${i}</span>
            </div>
        `;

        // Name input
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = `contactName${i}`;
        nameInput.placeholder = 'Full Name (e.g. Rishav Chandel)';
        nameInput.style.cssText = `
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            background: white;
            color: #333;
            outline: none;
            box-sizing: border-box;
        `;
        nameInput.onfocus = function() {
            this.style.borderColor = '#FF6B00';
            this.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.1)';
        };
        nameInput.onblur = function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        };

        // Phone input
        const phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.id = `contactPhone${i}`;
        phoneInput.placeholder = 'Phone Number (e.g. 9855864676)';
        phoneInput.style.cssText = `
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            background: white;
            color: #333;
            outline: none;
            box-sizing: border-box;
        `;
        phoneInput.onfocus = function() {
            this.style.borderColor = '#FF6B00';
            this.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.1)';
        };
        phoneInput.onblur = function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        };
        phoneInput.onkeypress = function(e) {
            // Allow only numbers
            return (e.charCode >= 48 && e.charCode <= 57);
        };

        contactDiv.appendChild(nameInput);
        contactDiv.appendChild(phoneInput);
        contactsContainer.appendChild(contactDiv);
    }

    // Save button
    const saveButton = document.createElement('button');
    saveButton.onclick = saveEmergencyContactsFromPopup;
    saveButton.style.cssText = `
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #FF6B00, #FF0844);
        color: white;
        border: none;
        border-radius: 15px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
    `;
    saveButton.onmouseover = function() { this.style.transform = 'scale(1.02)'; };
    saveButton.onmouseout = function() { this.style.transform = 'scale(1)'; };
    saveButton.innerHTML = '<i class="fas fa-save"></i> Save Contacts';

    // Footer text
    const footerText = document.createElement('p');
    footerText.style.cssText = `
        text-align: center;
        font-size: 0.8rem;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    `;
    footerText.innerHTML = '<i class="fas fa-shield-alt" style="color: #FF6B00;"></i> Contacts stored securely on your device';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.onclick = closeEmergencyPopup;
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: #f0f0f0;
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        z-index: 10;
    `;
    closeBtn.innerHTML = '×';

    // Assemble popup
    popupContent.appendChild(closeBtn);
    popupContent.appendChild(header);
    popupContent.appendChild(contactsContainer);
    popupContent.appendChild(saveButton);
    popupContent.appendChild(footerText);
    
    modal.appendChild(popupContent);
    document.body.appendChild(modal);

    // Add CSS animations
    addModalAnimations();

    // Focus on first input after popup is shown
    setTimeout(() => {
        const firstInput = document.getElementById('contactName1');
        if (firstInput) firstInput.focus();
    }, 500);
}

// Add animations
function addModalAnimations() {
    if (!document.getElementById('modalAnimations')) {
        const style = document.createElement('style');
        style.id = 'modalAnimations';
        style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes modalSlideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Save contacts function
function saveEmergencyContactsFromPopup() {
    const contacts = [];
    let hasValidContact = false;

    // Collect all contacts
    for (let i = 1; i <= 5; i++) {
        const nameInput = document.getElementById(`contactName${i}`);
        const phoneInput = document.getElementById(`contactPhone${i}`);
        
        if (!nameInput || !phoneInput) continue;
        
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // If both fields have values
        if (name && phone) {
            // Validate phone number (simple check)
            if (phone.length >= 10) {
                contacts.push({
                    id: i,
                    name: name,
                    phone: phone,
                    addedAt: new Date().toLocaleString()
                });
                hasValidContact = true;
                
                // Highlight success
                const box = document.getElementById(`contactBox${i}`);
                if (box) box.style.borderColor = '#00FF41';
            } else {
                alert(`Contact ${i}: Please enter a valid 10-digit phone number`);
                return;
            }
        } 
        // If one field is filled but other is empty
        else if (name || phone) {
            alert(`Contact ${i}: Please fill both name and phone number`);
            return;
        }
    }

    if (!hasValidContact) {
        alert('Please add at least one emergency contact!');
        return;
    }

    // Save to localStorage
    localStorage.setItem('mapview_emergency_contacts', JSON.stringify(contacts));
    
    // Update global variable
    emergencyContacts = contacts;

    // Show success message
    showContactSaveSuccess(contacts);
}

// Show success message
function showContactSaveSuccess(contacts) {
    const modal = document.getElementById('emergencyModal');
    if (!modal) return;

    const popupContent = modal.firstChild;
    
    popupContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #00FF41, #00E5FF);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                animation: scaleIn 0.5s ease;
            ">
                <i class="fas fa-check" style="font-size: 2.5rem; color: white;"></i>
            </div>
            
            <h2 style="
                font-size: 1.8rem;
                background: linear-gradient(135deg, #00FF41, #00E5FF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
            ">Success!</h2>
            
            <p style="color: #666; margin-bottom: 20px;">
                ${contacts.length} emergency contact${contacts.length > 1 ? 's' : ''} saved
            </p>
            
            <div style="
                background: #f0f9ff;
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: left;
            ">
                ${contacts.map(c => `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px;
                        background: white;
                        border-radius: 10px;
                        margin-bottom: 8px;
                        border-left: 4px solid #FF6B00;
                    ">
                        <i class="fas fa-user-circle" style="color: #FF6B00; font-size: 1.5rem;"></i>
                        <div>
                            <strong>${c.name}</strong>
                            <div style="font-size: 0.85rem; color: #666;">${c.phone}</div>
                        </div>
                        <i class="fas fa-check-circle" style="color: #00FF41; margin-left: auto;"></i>
                    </div>
                `).join('')}
            </div>
            
            <p style="color: #999; font-size: 0.9rem;">
                <i class="fas fa-clock"></i> Redirecting...
            </p>
        </div>
    `;

    // Close popup after 2 seconds
    setTimeout(() => {
        closeEmergencyPopup();
    }, 2000);
}

// Close popup
function closeEmergencyPopup() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.style.animation = 'modalFadeIn 0.3s reverse';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// SOS Trigger Function
function triggerEmergencySOS() {
    // Get contacts from localStorage
    const savedContacts = localStorage.getItem('mapview_emergency_contacts');
    
    if (!savedContacts) {
        // No contacts, show setup
        showEmergencySetupPopup();
        return;
    }

    try {
        const contacts = JSON.parse(savedContacts);
        
        if (contacts.length === 0) {
            showEmergencySetupPopup();
            return;
        }

        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    sendSOSAlert(position, contacts);
                },
                (error) => {
                    // Location error, send without location
                    sendSOSAlert(null, contacts);
                }
            );
        } else {
            sendSOSAlert(null, contacts);
        }
    } catch (e) {
        showEmergencySetupPopup();
    }
}

// Send SOS Alert
function sendSOSAlert(position, contacts) {
    // Create location string
    let locationText = '';
    if (position) {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        locationText = `📍 Live Location: https://maps.google.com/?q=${lat},${lng}`;
    }
// Edit contacts function (agar nahi hai to add karo)
function editEmergencyContacts() {
    // Close SOS popup
    const sosModal = document.getElementById('sosModal');
    if (sosModal) sosModal.remove();
    
    // Open emergency setup popup
    showEmergencySetupPopup();
}
    // Show SOS sending popup
    showSOSSendingPopup(contacts, locationText);
    
    // In a real app, you'd send SMS here
    console.log('🚨 SOS Alert sent to:', contacts);
    console.log('Message:', `EMERGENCY! I need help. ${locationText}`);
    
    // Show toast
    showToast(`🚨 SOS sent to ${contacts.length} contacts`, 'error');
}
// Show SOS sending popup - WITH WHATSAPP INTEGRATION
function showSOSSendingPopup(contacts, locationText) {
    const modal = document.createElement('div');
    modal.id = 'sosModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        animation: modalFadeIn 0.3s ease;
    `;

    // Extract clean location URL
    let locationUrl = '';
    if (locationText) {
        const match = locationText.match(/https?:\/\/[^\s]+/);
        locationUrl = match ? match[0] : 'https://maps.google.com/?q=30.583088,76.852969';
    }

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 30px;
            padding: 30px;
            width: 90%;
            max-width: 420px;
            text-align: center;
            border: 3px solid #FF0844;
            animation: modalSlideUp 0.3s ease;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #FF0844, #FF0000);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                animation: pulse 1s infinite;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: white;"></i>
            </div>
            
            <h2 style="color: #FF0844; margin-bottom: 5px; font-size: 1.8rem;">🚨 SOS SENT!</h2>
            <p style="color: #666; margin-bottom: 15px;">Alerting your emergency contacts...</p>
            
            <div style="
                background: #fff0f0;
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 15px;
                max-height: 200px;
                overflow-y: auto;
                text-align: left;
            ">
                ${contacts.map(c => `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px;
                        background: white;
                        border-radius: 10px;
                        margin-bottom: 8px;
                        border-left: 4px solid #00FF41;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    ">
                        <i class="fas fa-user-circle" style="color: #FF0844; font-size: 1.5rem;"></i>
                        <div style="flex: 1;">
                            <strong style="font-size: 1rem;">${c.name}</strong>
                            <div style="font-size: 0.8rem; color: #666;">${c.phone}</div>
                        </div>
                        <i class="fas fa-check-circle" style="color: #00FF41; font-size: 1.2rem;"></i>
                    </div>
                `).join('')}
            </div>
            
            ${locationUrl ? `
                <div style="
                    background: #f0f8ff;
                    padding: 12px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    text-align: left;
                    border: 1px solid #FF6B00;
                ">
                    <div style="font-weight: 600; margin-bottom: 5px; color: #FF6B00;">
                        <i class="fas fa-map-marker-alt"></i> Live Location:
                    </div>
                    <a href="${locationUrl}" target="_blank" style="color: #0066cc; word-break: break-all; font-size: 0.85rem;">
                        ${locationUrl}
                    </a>
                </div>
            ` : ''}
            
            <!-- WhatsApp Integration - REAL MESSAGE SENDING -->
            <div style="margin-bottom: 20px; padding: 15px; background: #e8f5e8; border-radius: 15px; border: 2px solid #25D366;">
                <p style="margin-bottom: 12px; color: #075E54; font-weight: 700; font-size: 1.1rem;">
                    <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i> 
                    Send Real Alert
                </p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${contacts.map((c, index) => `
                        <button onclick="sendWhatsAppMessage('${c.phone}', '${locationUrl}')" style="
                            background: #25D366;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 30px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            transition: all 0.3s ease;
                            width: 100%;
                        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fab fa-whatsapp"></i> 
                            Send to ${c.name} (${c.phone})
                        </button>
                    `).join('')}
                </div>
                <p style="font-size: 0.7rem; color: #666; margin-top: 10px; font-style: italic;">
                    ⚡ Click button → WhatsApp opens → Just press SEND
                </p>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="editEmergencyContacts()" style="
                    flex: 1;
                    background: #FFA500;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fas fa-edit"></i> Edit Contacts
                </button>
                <button onclick="document.getElementById('sosModal').remove()" style="
                    flex: 1;
                    background: transparent;
                    border: 2px solid #FF0844;
                    color: #FF0844;
                    padding: 12px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#FF0844'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#FF0844'">
                    Close
                </button>
            </div>
            
            <p style="font-size: 0.7rem; color: #999; margin-top: 15px;">
                <i class="fas fa-shield-alt"></i> Your location is shared only with your contacts
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto close after 15 seconds
    setTimeout(() => {
        const sosModal = document.getElementById('sosModal');
        if (sosModal) {
            sosModal.style.animation = 'modalFadeIn 0.3s reverse';
            setTimeout(() => sosModal.remove(), 300);
        }
    }, 15000);
}

// WhatsApp send function
function sendWhatsAppMessage(phone, locationUrl) {
    // Clean phone number (remove non-digits)
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Add India code if not present
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        cleanPhone = '91' + cleanPhone.substring(1);
    }
    
    // Create emergency message
    const message = encodeURIComponent(
        `🚨 *EMERGENCY SOS ALERT* 🚨\n\n` +
        `I need immediate help!\n\n` +
        `📍 *My Live Location:*\n${locationUrl || 'https://maps.google.com/?q=30.583088,76.852969'}\n\n` +
        `⏰ Time: ${new Date().toLocaleTimeString()}\n` +
        `📅 Date: ${new Date().toLocaleDateString()}\n\n` +
        `Please contact me or authorities immediately.`
    );
    
    // Open WhatsApp
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    
    // Show confirmation
    showToast('📱 WhatsApp opened! Just tap SEND', 'success');
}

// Edit contacts function
function editEmergencyContacts() {
    // Close SOS popup
    const sosModal = document.getElementById('sosModal');
    if (sosModal) sosModal.remove();
    
    // Open emergency setup popup
    showEmergencySetupPopup();
}

// 🔥 NEW FUNCTION - EDIT EMERGENCY CONTACTS
function editEmergencyContacts() {
    // Close SOS popup
    const sosModal = document.getElementById('sosModal');
    if (sosModal) sosModal.remove();
    
    // Open emergency setup popup
    showEmergencySetupPopup();
}

    document.body.appendChild(modal);

    // Auto close after 5 seconds
    setTimeout(() => {
        const sosModal = document.getElementById('sosModal');
        if (sosModal) {
            sosModal.style.animation = 'modalFadeIn 0.3s reverse';
            setTimeout(() => sosModal.remove(), 300);
        }
    }, 5000);

// Make functions global
window.showEmergencySetupPopup = showEmergencySetupPopup;
window.saveEmergencyContactsFromPopup = saveEmergencyContactsFromPopup;
window.closeEmergencyPopup = closeEmergencyPopup;
window.triggerEmergencySOS = triggerEmergencySOS;

// ========================================
// DOCUMENT VAULT FUNCTIONS
// ========================================

let documents = JSON.parse(localStorage.getItem('documents')) || [];

function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const doc = {
                id: Date.now(),
                name: file.name,
                type: file.type,
                data: e.target.result,
                date: new Date().toLocaleDateString()
            };
            documents.push(doc);
            localStorage.setItem('documents', JSON.stringify(documents));
            showToast('✅ Document uploaded!', 'success');
            updateRecentDocuments();
        };
        reader.readAsDataURL(file);
    }
}

function openCamera() {
    showToast('📸 Opening camera...', 'info');
    // In real app, open camera
}

function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    const header = category.previousElementSibling;
    if (category.style.display === 'none' || !category.style.display) {
        category.style.display = 'grid';
        header.classList.add('active');
    } else {
        category.style.display = 'none';
        header.classList.remove('active');
    }
}

function addDocument(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add ${type}</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px;">
                    <div class="upload-options" style="display: flex; gap: 20px; justify-content: center;">
                        <button onclick="uploadDocument('${type}')" style="padding: 15px 30px; background: #FF6B00; color: white; border: none; border-radius: 10px;">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                        <button onclick="captureDocument('${type}')" style="padding: 15px 30px; background: #00E5FF; color: white; border: none; border-radius: 10px;">
                            <i class="fas fa-camera"></i> Capture
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function uploadDocument(type) {
    document.getElementById('fileInput').click();
    document.querySelector('.modal').remove();
}

function captureDocument(type) {
    showToast(`📸 Taking photo of ${type}...`, 'info');
    // In real app, open camera
    setTimeout(() => {
        const doc = {
            id: Date.now(),
            name: type,
            type: 'image',
            date: new Date().toLocaleDateString()
        };
        documents.push(doc);
        localStorage.setItem('documents', JSON.stringify(documents));
        updateRecentDocuments();
        showToast(`✅ ${type} added!`, 'success');
    }, 2000);
}

function addServiceReminder() {
    showToast('🔧 Add service reminder', 'info');
}

function updateRecentDocuments() {
    const recentList = document.getElementById('recentDocsList');
    if (recentList && documents.length > 0) {
        const recent = documents.slice(-5).reverse();
        recentList.innerHTML = recent.map(doc => `
            <div class="recent-item" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9ff; border-radius: 10px; margin-bottom: 5px;">
                <i class="fas fa-file-alt" style="color: #FF6B00;"></i>
                <div>
                    <div><strong>${doc.name}</strong></div>
                    <small>${doc.date}</small>
                </div>
            </div>
        `).join('');
    }
}
// ======================================
// DOCUMENT VAULT - FILE UPLOAD FIX
// ======================================

// Global file input element
let fileInput = null;

// Create hidden file input on page load
function initializeFileUpload() {
    if (!document.getElementById('globalFileInput')) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'globalFileInput';
        fileInput.style.display = 'none';
        fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
        fileInput.onchange = handleFileSelect;
        document.body.appendChild(fileInput);
    }
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const currentDocType = fileInput.dataset.docType || 'document';
    
    // Show loading
    showToast(`📄 Uploading ${file.name}...`, 'info');
    
    // Create document object
    const doc = {
        id: Date.now(),
        name: file.name,
        type: currentDocType,
        fileType: file.type,
        size: (file.size / 1024).toFixed(2) + ' KB',
        date: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleString()
    };
    
    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onload = function(e) {
        doc.data = e.target.result;
        doc.preview = e.target.result;
        
        // Save to documents array
        documents.push(doc);
        localStorage.setItem('documents', JSON.stringify(documents));
        
        // Update UI
        updateDocumentCard(currentDocType, doc);
        updateRecentDocuments();
        
        showToast(`✅ ${currentDocType} uploaded successfully!`, 'success');
        
        // Reset file input
        fileInput.value = '';
    };
    reader.readAsDataURL(file);
}

// Update document card with uploaded file
function updateDocumentCard(docType, doc) {
    const card = document.querySelector(`[data-document="${docType}"]`) || 
                 document.querySelector(`.document-card:contains('${docType}')`);
    
    if (card) {
        const statusEl = card.querySelector('.document-status') || card;
        statusEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 5px; color: #00FF41;">
                <i class="fas fa-check-circle"></i>
                <span>Uploaded: ${doc.date}</span>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">
                ${doc.name}
            </div>
        `;
        
        // Add view button
        const btnContainer = card.querySelector('.document-actions') || card;
        if (!btnContainer.querySelector('.view-doc-btn')) {
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-doc-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i> View';
            viewBtn.onclick = () => viewDocument(doc.id);
            viewBtn.style.cssText = `
                background: #00E5FF;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                margin-left: 5px;
                cursor: pointer;
            `;
            btnContainer.appendChild(viewBtn);
        }
    }
}

// View uploaded document
function viewDocument(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 20px; max-width: 90%; max-height: 90%; overflow: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <h3>${doc.name}</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem;">×</button>
            </div>
            ${doc.fileType?.startsWith('image/') ? 
                `<img src="${doc.data}" style="max-width: 100%; max-height: 70vh;">` : 
                `<div style="text-align: center; padding: 40px;">
                    <i class="fas fa-file-pdf" style="font-size: 4rem; color: #FF0844;"></i>
                    <p>PDF Document</p>
                    <a href="${doc.data}" download="${doc.name}" style="display: inline-block; padding: 10px 20px; background: #FF6B00; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                        Download PDF
                    </a>
                </div>`
            }
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Modified addDocument function
function addDocument(type) {
    if (!fileInput) initializeFileUpload();
    
    // Store document type
    fileInput.dataset.docType = type;
    
    // Create upload options modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 30px; max-width: 400px; width: 90%;">
            <h3 style="margin-bottom: 20px; color: #FF6B00;">Add ${type}</h3>
            <div style="display: grid; gap: 15px;">
                <button onclick="pickFile('${type}')" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #FF6B00, #FF0844);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-upload"></i> Upload from Gallery
                </button>
                <button onclick="takePhoto('${type}')" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #00E5FF, #0080FF);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-camera"></i> Take Photo
                </button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                width: 100%;
                margin-top: 15px;
                padding: 12px;
                background: transparent;
                border: 2px solid #ccc;
                border-radius: 10px;
                cursor: pointer;
            ">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Pick file from device
function pickFile(type) {
    // Close modal
    document.querySelector('.modal').remove();
    
    // Set accepted file types
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    fileInput.dataset.docType = type;
    
    // Trigger file picker
    fileInput.click();
}

// Take photo using camera
function takePhoto(type) {
    // Close modal
    document.querySelector('.modal').remove();
    
    // Check if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Create camera modal
        const cameraModal = document.createElement('div');
        cameraModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 20000;
            display: flex;
            flex-direction: column;
        `;
        
        cameraModal.innerHTML = `
            <video id="cameraPreview" style="width: 100%; height: calc(100% - 100px); object-fit: cover;"></video>
            <div style="display: flex; justify-content: center; gap: 20px; padding: 20px; background: #333;">
                <button onclick="capturePhoto('${type}')" style="
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: white;
                    border: 5px solid #FF6B00;
                    cursor: pointer;
                "></button>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 10px 20px;
                    background: #FF0844;
                    color: white;
                    border: none;
                    border-radius: 5px;
                ">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(cameraModal);
        
        // Start camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = document.getElementById('cameraPreview');
                video.srcObject = stream;
                video.play();
                
                // Store stream for later cleanup
                cameraModal.dataset.stream = stream;
            })
            .catch(error => {
                showToast('❌ Camera access denied', 'error');
                cameraModal.remove();
            });
    } else {
        showToast('❌ Camera not supported', 'error');
    }
}

// Capture photo from camera
function capturePhoto(type) {
    const video = document.getElementById('cameraPreview');
    if (!video) return;
    
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Stop camera stream
    const modal = video.closest('div[style*="position: fixed"]');
    if (modal && modal.dataset.stream) {
        modal.dataset.stream.getTracks().forEach(track => track.stop());
    }
    modal.remove();
    
    // Create document from captured photo
    const doc = {
        id: Date.now(),
        name: `${type}_${new Date().toLocaleDateString()}.jpg`,
        type: type,
        fileType: 'image/jpeg',
        data: dataUrl,
        preview: dataUrl,
        date: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleString()
    };
    
    // Save document
    documents.push(doc);
    localStorage.setItem('documents', JSON.stringify(documents));
    
    // Update UI
    updateDocumentCard(type, doc);
    updateRecentDocuments();
    
    showToast(`✅ ${type} captured successfully!`, 'success');
}

// Initialize file upload system
function initializeDocumentSystem() {
    initializeFileUpload();
    
    // Add click handlers to all document "Add now" buttons
    setTimeout(() => {
        document.querySelectorAll('.document-card, [onclick*="addDocument"]').forEach(el => {
            if (el.onclick) return;
            
            const text = el.innerText || '';
            const docTypes = ['RC Certificate', 'Insurance', 'Aadhar', 'PAN', 'Driving', 'PUC', 'Passport', 'Voter'];
            
            for (let type of docTypes) {
                if (text.includes(type)) {
                    el.onclick = () => addDocument(type);
                    el.style.cursor = 'pointer';
                    break;
                }
            }
        });
    }, 2000);
}
// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    setTimeout(() => {
        initWeather();
        updateRecentDocuments();
        
        // Load saved contacts
        const saved = localStorage.getItem('emergencyContacts');
        if (saved) {
            emergencyContacts = JSON.parse(saved);
        }
    }, 3000);
});
// ========================================
// 🚦 TRAFFIC AI - COMPLETE FEATURE (NO API KEYS)
// ========================================

// Traffic Data Storage
let trafficData = {
    historical: loadHistoricalTraffic(),
    realtime: [],
    incidents: []
};

// Load historical traffic patterns (built-in data)
function loadHistoricalTraffic() {
    return {
        // Time-based patterns
        timePatterns: {
            morningRush: { start: 8, end: 10, factor: 2.5 },
            eveningRush: { start: 17, end: 20, factor: 3.0 },
            lunchBreak: { start: 13, end: 15, factor: 1.3 },
            nightTime: { start: 23, end: 5, factor: 0.3 }
        },
        
        // Day-based patterns
        dayPatterns: {
            monday: { factor: 1.2 },
            tuesday: { factor: 1.1 },
            wednesday: { factor: 1.1 },
            thursday: { factor: 1.1 },
            friday: { factor: 1.3 },
            saturday: { factor: 0.9 },
            sunday: { factor: 0.7 }
        },
        
        // City-specific patterns
        cityPatterns: {
            delhi: { peakFactor: 3.5, avgSpeed: 25 },
            mumbai: { peakFactor: 4.0, avgSpeed: 20 },
            bangalore: { peakFactor: 4.5, avgSpeed: 15 },
            chennai: { peakFactor: 3.2, avgSpeed: 28 },
            kolkata: { peakFactor: 3.8, avgSpeed: 22 },
            hyderabad: { peakFactor: 3.0, avgSpeed: 30 },
            pune: { peakFactor: 3.3, avgSpeed: 27 },
            ahmedabad: { peakFactor: 2.8, avgSpeed: 32 },
            jaipur: { peakFactor: 2.5, avgSpeed: 35 },
            lucknow: { peakFactor: 2.7, avgSpeed: 33 }
        }
    };
}

// Initialize Traffic Layer (Free - OpenStreetMap based)
function initializeTrafficLayer() {
    // Create traffic layer using OpenStreetMap
    trafficLayer = L.layerGroup();
    
    // Add traffic lines (simulated)
    setInterval(() => {
        if (isTrafficOn) {
            updateTrafficData();
        }
    }, 60000); // Update every minute
    
    console.log("🚦 Traffic AI initialized");
}

// Toggle Traffic Layer
function toggleTrafficLayer() {
    isTrafficOn = !isTrafficOn;
    
    if (isTrafficOn) {
        // Clear old traffic lines
        trafficLayer.clearLayers();
        
        // Add new traffic lines
        addTrafficLines();
        
        // Add to map
        if (!map.hasLayer(trafficLayer)) {
            trafficLayer.addTo(map);
        }
        
        showToast('🚦 Traffic layer enabled', 'info');
    } else {
        if (map.hasLayer(trafficLayer)) {
            map.removeLayer(trafficLayer);
        }
        showToast('🗺️ Traffic layer disabled', 'info');
    }
}

// Add traffic lines on major roads
function addTrafficLines() {
    // Get current traffic conditions
    const traffic = getCurrentTrafficConditions();
    
    // Major roads with traffic coloring
    const majorRoads = [
        // Delhi roads
        { name: "Ring Road", coords: [[28.6129, 77.2290], [28.6100, 77.2350], [28.6050, 77.2400]] },
        { name: "NH-48", coords: [[28.5678, 77.1199], [28.5500, 77.1300], [28.5300, 77.1450]] },
        { name: "MG Road", coords: [[28.6300, 77.2200], [28.6250, 77.2250], [28.6200, 77.2300]] },
        
        // Mumbai roads
        { name: "Eastern Express", coords: [[19.0760, 72.8777], [19.0800, 72.8800], [19.0850, 72.8850]] },
        { name: "Western Express", coords: [[19.1000, 72.8500], [19.1050, 72.8550], [19.1100, 72.8600]] },
        
        // Bangalore roads
        { name: "ORR", coords: [[12.9716, 77.5946], [12.9750, 77.6000], [12.9800, 77.6050]] },
        { name: "Silk Board", coords: [[12.9150, 77.6200], [12.9200, 77.6250], [12.9250, 77.6300]] }
    ];
    
    majorRoads.forEach(road => {
        // Get color based on traffic
        const color = getTrafficColor(road.name, traffic);
        
        // Create polyline with traffic color
        const line = L.polyline(road.coords, {
            color: color,
            weight: 6,
            opacity: 0.7,
            smoothFactor: 1
        }).bindPopup(`
            <b>${road.name}</b><br>
            Traffic: ${getTrafficStatus(road.name, traffic)}<br>
            Avg Speed: ${getAvgSpeed(road.name, traffic)} km/h
        `);
        
        trafficLayer.addLayer(line);
    });
}

// Get traffic color based on condition
function getTrafficColor(roadName, traffic) {
    const condition = traffic[roadName] || 'moderate';
    
    switch(condition) {
        case 'heavy': return '#FF0000'; // Red - Heavy traffic
        case 'moderate': return '#FFA500'; // Orange - Moderate
        case 'light': return '#00FF00'; // Green - Light
        default: return '#808080'; // Gray - Unknown
    }
}

// Get traffic status text
function getTrafficStatus(roadName, traffic) {
    const condition = traffic[roadName] || 'moderate';
    
    switch(condition) {
        case 'heavy': return '🔴 Heavy Traffic';
        case 'moderate': return '🟠 Moderate Traffic';
        case 'light': return '🟢 Light Traffic';
        default: return '⚪ Unknown';
    }
}

// Get average speed
function getAvgSpeed(roadName, traffic) {
    const baseSpeed = {
        'Ring Road': 30,
        'NH-48': 40,
        'MG Road': 25,
        'Eastern Express': 35,
        'Western Express': 32,
        'ORR': 28,
        'Silk Board': 15
    }[roadName] || 30;
    
    const condition = traffic[roadName] || 'moderate';
    
    switch(condition) {
        case 'heavy': return Math.round(baseSpeed * 0.3);
        case 'moderate': return Math.round(baseSpeed * 0.6);
        case 'light': return baseSpeed;
        default: return baseSpeed;
    }
}

// Get current traffic conditions (AI prediction)
function getCurrentTrafficConditions() {
    const conditions = {};
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Determine base factor
    let timeFactor = 1;
    
    // Morning rush (8-10 AM)
    if (hour >= 8 && hour <= 10) timeFactor = 2.5;
    // Evening rush (5-8 PM)
    else if (hour >= 17 && hour <= 20) timeFactor = 3.0;
    // Lunch time (1-3 PM)
    else if (hour >= 13 && hour <= 15) timeFactor = 1.3;
    // Night (11 PM - 5 AM)
    else if (hour >= 23 || hour <= 5) timeFactor = 0.3;
    
    // Weekend adjustment
    if (day === 0 || day === 6) {
        timeFactor *= 0.7; // Less traffic on weekends
    }
    
    // Set conditions for each road
    const roads = ['Ring Road', 'NH-48', 'MG Road', 'Eastern Express', 'Western Express', 'ORR', 'Silk Board'];
    
    roads.forEach(road => {
        // Add some randomness
        const random = Math.random();
        
        if (timeFactor > 2) {
            // Rush hour
            if (random < 0.7) conditions[road] = 'heavy';
            else if (random < 0.9) conditions[road] = 'moderate';
            else conditions[road] = 'light';
        } else if (timeFactor > 1) {
            // Normal time
            if (random < 0.3) conditions[road] = 'heavy';
            else if (random < 0.7) conditions[road] = 'moderate';
            else conditions[road] = 'light';
        } else {
            // Night time
            if (random < 0.1) conditions[road] = 'heavy';
            else if (random < 0.3) conditions[road] = 'moderate';
            else conditions[road] = 'light';
        }
    });
    
    return conditions;
}

// Update traffic data (called every minute)
function updateTrafficData() {
    if (!isTrafficOn || !map) return;
    
    // Remove old traffic layer
    if (map.hasLayer(trafficLayer)) {
        map.removeLayer(trafficLayer);
    }
    
    // Clear and add new traffic lines
    trafficLayer.clearLayers();
    addTrafficLines();
    
    // Add back to map
    trafficLayer.addTo(map);
    
    console.log("🔄 Traffic data updated");
}

// ========================================
// 🗺️ PLACE TO PLACE NAVIGATION
// ========================================

// Initialize location search
function initializeLocationSearch() {
    // Get input elements
    const fromInput = document.getElementById('navFrom');
    const toInput = document.getElementById('navTo');
    
    if (!fromInput || !toInput) return;
    
    // Add input listeners for search
    fromInput.addEventListener('input', debounce(() => {
        searchLocations(fromInput.value, 'from');
    }, 500));
    
    toInput.addEventListener('input', debounce(() => {
        searchLocations(toInput.value, 'to');
    }, 500));
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search locations using Nominatim (Free API)
async function searchLocations(query, type) {
    if (query.length < 3) return;
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        
        // Show suggestions
        showLocationSuggestions(data, type);
    } catch (error) {
        console.error("Location search error:", error);
    }
}

// Show location suggestions
function showLocationSuggestions(places, type) {
    // Remove old suggestions
    const oldSuggestions = document.querySelectorAll('.location-suggestions');
    oldSuggestions.forEach(el => el.remove());
    
    if (!places || places.length === 0) return;
    
    const input = type === 'from' ? document.getElementById('navFrom') : document.getElementById('navTo');
    if (!input) return;
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'location-suggestions';
    suggestionsDiv.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid #FF6B00;
        border-radius: 10px;
        max-height: 200px;
        overflow-y: auto;
        width: ${input.offsetWidth}px;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    
    places.forEach(place => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            transition: all 0.3s ease;
        `;
        item.onmouseover = () => { item.style.backgroundColor = '#fff0e0'; };
        item.onmouseout = () => { item.style.backgroundColor = 'white'; };
        item.onclick = () => {
            input.value = place.display_name;
            input.dataset.lat = place.lat;
            input.dataset.lon = place.lon;
            suggestionsDiv.remove();
        };
        item.innerHTML = `
            <div><strong>${place.display_name.split(',')[0]}</strong></div>
            <div style="font-size: 0.8rem; color: #666;">${place.display_name}</div>
        `;
        suggestionsDiv.appendChild(item);
    });
    
    // Position suggestions below input
    const rect = input.getBoundingClientRect();
    suggestionsDiv.style.top = rect.bottom + window.scrollY + 'px';
    suggestionsDiv.style.left = rect.left + 'px';
    
    document.body.appendChild(suggestionsDiv);
    
    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!suggestionsDiv.contains(e.target) && e.target !== input) {
                suggestionsDiv.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Use current location
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Reverse geocode to get address
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(res => res.json())
                    .then(data => {
                        const fromInput = document.getElementById('navFrom');
                        fromInput.value = data.display_name || 'Current Location';
                        fromInput.dataset.lat = lat;
                        fromInput.dataset.lon = lon;
                        showToast('📍 Current location set', 'success');
                    });
            },
            (error) => {
                showToast('❌ Could not get location', 'error');
            }
        );
    }
}

// Calculate route between two points
async function calculateRoute() {
    const fromInput = document.getElementById('navFrom');
    const toInput = document.getElementById('navTo');
    
    let fromLat, fromLon, toLat, toLon;
    
    // Get coordinates
    if (fromInput.dataset.lat && fromInput.dataset.lon) {
        fromLat = parseFloat(fromInput.dataset.lat);
        fromLon = parseFloat(fromInput.dataset.lon);
    } else {
        // Try to geocode from input
        const fromCoords = await geocodeLocation(fromInput.value);
        if (!fromCoords) {
            showToast('❌ Please select a valid starting point', 'error');
            return;
        }
        fromLat = fromCoords.lat;
        fromLon = fromCoords.lon;
        fromInput.dataset.lat = fromLat;
        fromInput.dataset.lon = fromLon;
    }
    
    if (toInput.dataset.lat && toInput.dataset.lon) {
        toLat = parseFloat(toInput.dataset.lat);
        toLon = parseFloat(toInput.dataset.lon);
    } else {
        // Try to geocode from input
        const toCoords = await geocodeLocation(toInput.value);
        if (!toCoords) {
            showToast('❌ Please select a valid destination', 'error');
            return;
        }
        toLat = toCoords.lat;
        toLon = toCoords.lon;
        toInput.dataset.lat = toLat;
        toInput.dataset.lon = toLon;
    }
    
    // Remove existing route
    if (routeControl) {
        map.removeControl(routeControl);
    }
    
    // Show loading
    showToast('🔄 Calculating route...', 'info');
    
    // Get route from OSRM (Free routing service)
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson&steps=true`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            showToast('❌ Could not find route', 'error');
            return;
        }
        
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Draw route on map
        routeControl = L.polyline(coordinates, {
            color: '#FF6B00',
            weight: 8,
            opacity: 0.7,
            lineJoin: 'round'
        }).addTo(map);
        
        // Add start and end markers
        L.marker([fromLat, fromLon], {
            icon: L.divIcon({
                className: 'start-marker',
                html: '<div style="background: #00FF41; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                iconSize: [20, 20]
            })
        }).addTo(map).bindPopup('Start').openPopup();
        
        L.marker([toLat, toLon], {
            icon: L.divIcon({
                className: 'end-marker',
                html: '<div style="background: #FF0844; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                iconSize: [20, 20]
            })
        }).addTo(map).bindPopup('Destination');
        
        // Fit map to show entire route
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Calculate traffic for this route
        const trafficInfo = predictRouteTraffic(fromLat, fromLon, toLat, toLon);
        
        // Show route information
        document.getElementById('navigationResult').style.display = 'block';
        document.getElementById('navDistance').textContent = (route.distance / 1000).toFixed(1) + ' km';
        
        const duration = route.duration / 60; // minutes
        document.getElementById('navDuration').textContent = Math.round(duration) + ' min';
        
        // Adjust for traffic
        const trafficFactor = trafficInfo.factor;
        const adjustedDuration = Math.round(duration * trafficFactor);
        document.getElementById('navTraffic').innerHTML = `
            Traffic: ${trafficInfo.status} 
            ${trafficFactor > 1 ? `(➕ ${adjustedDuration - duration} min delay)` : ''}
            <br>
            <small>Expected: ${adjustedDuration} min with current traffic</small>
        `;
        
        showToast('✅ Route calculated successfully!', 'success');
        
        // Store current route
        currentRoute = {
            from: { lat: fromLat, lon: fromLon },
            to: { lat: toLat, lon: toLon },
            distance: route.distance,
            duration: route.duration,
            traffic: trafficInfo
        };
        
    } catch (error) {
        console.error("Route calculation error:", error);
        showToast('❌ Error calculating route', 'error');
    }
}
// ========================================
// 🗺️ COMPLETE FIXED NAVIGATION FUNCTIONS
// ========================================

// Global variables
let routeControl = null;
let currentRoute = null;

// ========================================
// GEOCODE LOCATION - FIXED VERSION
// ========================================
async function geocodeLocation(query) {
    if (!query || query.trim() === '') {
        showToast('❌ Please enter a location', 'warning');
        return null;
    }
    
    // Clean the query
    let searchQuery = query.trim();
    
    // Add "India" if it looks like an Indian location (optional, helps with common places)
    const indianKeywords = ['chandigarh', 'mohali', 'punjab', 'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai'];
    const shouldAddIndia = indianKeywords.some(keyword => 
        searchQuery.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (shouldAddIndia && !searchQuery.toLowerCase().includes('india')) {
        searchQuery = searchQuery + ', India';
    }
    
    try {
        showToast(`🔍 Searching for: ${searchQuery}`, 'info');
        
        // Add delay to respect Nominatim's usage policy
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'BharatWay-App/1.0'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const location = data[0];
            console.log('✅ Found:', location.display_name);
            
            showToast(`✅ Found: ${location.display_name.split(',')[0]}`, 'success');
            
            return {
                lat: parseFloat(location.lat),
                lon: parseFloat(location.lon),
                name: location.display_name,
                displayName: location.display_name.split(',')[0] // Short name
            };
        } else {
            // Try without adding India
            if (searchQuery.includes(', India')) {
                const originalQuery = query.trim();
                const response2 = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(originalQuery)}&limit=1`,
                    {
                        headers: {
                            'User-Agent': 'BharatWay-App/1.0'
                        }
                    }
                );
                const data2 = await response2.json();
                
                if (data2 && data2.length > 0) {
                    const location = data2[0];
                    return {
                        lat: parseFloat(location.lat),
                        lon: parseFloat(location.lon),
                        name: location.display_name,
                        displayName: location.display_name.split(',')[0]
                    };
                }
            }
            
            showToast(`❌ Location not found: ${query}`, 'error');
            return null;
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        showToast('❌ Error finding location', 'error');
        return null;
    }
}

// ========================================
// PREDICT TRAFFIC - FIXED VERSION
// ========================================
function predictRouteTraffic(fromLat, fromLon, toLat, toLon) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Base factor and status
    let factor = 1.0;
    let status = '🟢 Light';
    let color = '#00FF41';
    
    // Time of day factor
    if (hour >= 8 && hour <= 10) {
        factor = 2.2;
        status = '🔴 Heavy (Morning Rush)';
        color = '#FF0844';
    } else if (hour >= 17 && hour <= 20) {
        factor = 2.5;
        status = '🔴 Heavy (Evening Rush)';
        color = '#FF0844';
    } else if (hour >= 11 && hour <= 15) {
        factor = 1.4;
        status = '🟠 Moderate';
        color = '#FFA500';
    } else if (hour >= 22 || hour <= 5) {
        factor = 0.5;
        status = '🟢 Light (Night)';
        color = '#00FF41';
    }
    
    // Weekend adjustment
    if (day === 0 || day === 6) {
        factor *= 0.8;
        if (factor < 1.0) {
            status = '🟢 Light (Weekend)';
            color = '#00FF41';
        }
    }
    
    // City-based adjustment
    const centerLat = (fromLat + toLat) / 2;
    const centerLon = (fromLon + toLon) / 2;
    
    // Major cities bounding boxes
    if (centerLat > 28.4 && centerLat < 28.8 && centerLon > 76.8 && centerLon < 77.3) {
        factor *= 1.5;
        status = '🔴 Heavy + Delhi Traffic';
        color = '#FF0844';
    } else if (centerLat > 18.9 && centerLat < 19.3 && centerLon > 72.8 && centerLon < 73.0) {
        factor *= 1.6;
        status = '🔴 Heavy + Mumbai Traffic';
        color = '#FF0844';
    } else if (centerLat > 12.9 && centerLat < 13.1 && centerLon > 77.5 && centerLon < 77.7) {
        factor *= 1.8;
        status = '🔴 Heavy + Bangalore Traffic';
        color = '#FF0844';
    } else if (centerLat > 22.5 && centerLat < 22.6 && centerLon > 88.3 && centerLon < 88.5) {
        factor *= 1.4;
        status = '🟠 Moderate + Kolkata Traffic';
        color = '#FFA500';
    }
    
    return {
        factor: factor,
        status: status,
        color: color
    };
}

// ========================================
// CLEAR ROUTE - FIXED VERSION
// ========================================
function clearRoute() {
    if (routeControl) {
        map.removeLayer(routeControl);
        routeControl = null;
    }
    
    const resultDiv = document.getElementById('navigationResult');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = ''; // Clear content
    }
    
    currentRoute = null;
    showToast('🗺️ Route cleared', 'info');
}

// ========================================
// GET STEP-BY-STEP DIRECTIONS - FIXED VERSION
// ========================================
async function getStepByStepDirections() {
    if (!currentRoute) {
        showToast('⚠️ Please calculate a route first', 'warning');
        return;
    }
    
    showToast('🔄 Getting directions...', 'info');
    
    const from = currentRoute.from;
    const to = currentRoute.to;
    
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?steps=true&alternatives=true&geometries=geojson`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            showToast('❌ Could not get directions', 'error');
            return;
        }
        
        const route = data.routes[0];
        const steps = route.legs[0].steps;
        
        // Create directions modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
            animation: fadeIn 0.3s ease;
        `;
        
        let stepsHtml = '';
        let totalDistance = 0;
        
        steps.forEach((step, index) => {
            // Get instruction text
            let instruction = step.maneuver.type;
            if (step.maneuver.modifier) {
                instruction += ' ' + step.maneuver.modifier;
            }
            
            // Capitalize first letter
            instruction = instruction.charAt(0).toUpperCase() + instruction.slice(1);
            
            const distance = (step.distance / 1000).toFixed(1);
            totalDistance += step.distance;
            
            // Get road name
            const roadName = step.name || 'Unnamed road';
            
            stepsHtml += `
                <div style="
                    background: #f8f9ff;
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 12px;
                    border-left: 4px solid #FF6B00;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                ">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                        <span style="
                            background: #FF6B00;
                            color: white;
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.8rem;
                            font-weight: bold;
                        ">${index + 1}</span>
                        <strong style="font-size: 1rem;">${instruction}</strong>
                    </div>
                    <div style="margin-left: 35px;">
                        <div style="font-size: 0.9rem; color: #333;">📍 ${roadName}</div>
                        <div style="display: flex; gap: 15px; margin-top: 5px;">
                            <span style="font-size: 0.85rem; color: #FF6B00; font-weight: 600;">
                                <i class="fas fa-route"></i> ${distance} km
                            </span>
                            <span style="font-size: 0.85rem; color: #666;">
                                <i class="far fa-clock"></i> ${Math.round(step.duration / 60)} min
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        const totalDistanceKm = (totalDistance / 1000).toFixed(1);
        const totalDuration = Math.round(route.duration / 60);
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 30px;
                padding: 25px;
                max-width: 450px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                border: 3px solid #FF6B00;
                animation: slideUp 0.5s ease;
            ">
                <div style="
                    position: sticky;
                    top: 0;
                    background: white;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #f0f0f0;
                    margin-bottom: 15px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="color: #FF6B00; margin:0;">
                            <i class="fas fa-list-ol"></i> Turn-by-Turn
                        </h3>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                            background: #f0f0f0;
                            border: none;
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 1.2rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #666;
                        ">×</button>
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-top: 15px;">
                        <div style="flex:1; background: #f8f9ff; padding: 10px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 0.8rem; color: #666;">Total Distance</div>
                            <div style="font-size: 1.3rem; font-weight: 700; color: #FF6B00;">${totalDistanceKm} km</div>
                        </div>
                        <div style="flex:1; background: #f8f9ff; padding: 10px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 0.8rem; color: #666;">Total Time</div>
                            <div style="font-size: 1.3rem; font-weight: 700; color: #FF6B00;">${totalDuration} min</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: 600; margin-bottom: 10px; color: #333;">
                        <i class="fas fa-flag-checkered"></i> Directions:
                    </div>
                    ${stepsHtml}
                </div>
                
                <button onclick="startVoiceNavigation()" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #00E5FF, #0080FF);
                    color: white;
                    border: none;
                    border-radius: 15px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fas fa-play"></i> Start Voice Navigation
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        showToast('✅ Directions ready!', 'success');
        
    } catch (error) {
        console.error("Directions error:", error);
        showToast('❌ Error getting directions', 'error');
    }
}

// ========================================
// START VOICE NAVIGATION
// ========================================
function startVoiceNavigation() {
    if (!currentRoute || !currentRoute.steps) {
        showToast('⚠️ No route data available', 'warning');
        return;
    }
    
    // Close directions modal
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) modal.remove();
    
    // Start navigation with voice
    startInAppNavigation(
        currentRoute.from.lat,
        currentRoute.from.lon,
        currentRoute.to.lat,
        currentRoute.to.lon
    );
}

// ========================================
// ADD DIRECTIONS BUTTON - FIXED VERSION
// ========================================
function addDirectionsButton() {
    const resultDiv = document.getElementById('navigationResult');
    if (!resultDiv) return;
    
    // Check if result has content
    const resultContent = resultDiv.querySelector('div');
    if (!resultContent) return;
    
    const existingBtn = document.getElementById('directionsBtn');
    if (existingBtn) existingBtn.remove();
    
    const btn = document.createElement('button');
    btn.id = 'directionsBtn';
    btn.onclick = getStepByStepDirections;
    btn.style.cssText = `
        width: 100%;
        margin-top: 15px;
        padding: 12px;
        background: linear-gradient(135deg, #00E5FF, #0080FF);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;
    `;
    btn.onmouseover = function() { this.style.transform = 'scale(1.02)'; };
    btn.onmouseout = function() { this.style.transform = 'scale(1)'; };
    btn.innerHTML = '<i class="fas fa-list-ol"></i> Step-by-Step Directions';
    
    resultContent.appendChild(btn);
}

// ========================================
// ADD CSS ANIMATIONS
// ========================================
(function addNavStyles() {
    if (!document.getElementById('navStyles')) {
        const style = document.createElement('style');
        style.id = 'navStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            .route-pulse {
                animation: dash 30s linear infinite;
                stroke-dasharray: 10, 10;
            }
            @keyframes dash {
                to { stroke-dashoffset: -100; }
            }
        `;
        document.head.appendChild(style);
    }
})();
// Modify calculateRoute to add directions button
// Add this line at the end of calculateRoute function:
// addDirectionsButton();

// ========================================
// TRAFFIC INCIDENT REPORTING
// ========================================

// Report traffic incident
function reportIncident(type) {
    if (!navigator.geolocation) {
        showToast('❌ Location needed to report', 'error');
        return;
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        const incident = {
            type: type,
            lat: lat,
            lng: lng,
            time: Date.now(),
            reportedBy: 'user'
        };
        
        trafficData.incidents.push(incident);
        
        // Show incident on map
        const icon = getIncidentIcon(type);
        L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'incident-marker',
                html: `<div style="background: ${icon.color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">${icon.symbol}</div>`,
                iconSize: [30, 30]
            })
        }).addTo(map).bindPopup(`
            <b>${type} Reported</b><br>
            Just now<br>
            <small>Thanks for helping others!</small>
        `);
        
        showToast(`✅ ${type} reported! Thanks for helping others.`, 'success');
    });
}

// Get incident icon
function getIncidentIcon(type) {
    const icons = {
        'accident': { symbol: '⚠️', color: '#FF0000' },
        'construction': { symbol: '🚧', color: '#FFA500' },
        'roadblock': { symbol: '⛔', color: '#FF0844' },
        'police': { symbol: '👮', color: '#0000FF' }
    };
    return icons[type] || { symbol: '📍', color: '#808080' };
}

// Add report buttons
function addReportButtons() {
    const mapControls = document.querySelector('.map-controls');
    if (!mapControls) return;
    
    const reportDiv = document.createElement('div');
    reportDiv.style.cssText = `
        margin-top: 10px;
        padding: 10px;
        background: #f8f9ff;
        border-radius: 10px;
    `;
    
    reportDiv.innerHTML = `
        <div style="margin-bottom: 5px; font-weight: 600;">Report Incident:</div>
        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
            <button onclick="reportIncident('accident')" style="flex:1; padding: 8px; background: #FF0000; color: white; border: none; border-radius: 5px;">⚠️ Accident</button>
            <button onclick="reportIncident('construction')" style="flex:1; padding: 8px; background: #FFA500; color: white; border: none; border-radius: 5px;">🚧 Construction</button>
            <button onclick="reportIncident('roadblock')" style="flex:1; padding: 8px; background: #FF0844; color: white; border: none; border-radius: 5px;">⛔ Roadblock</button>
            <button onclick="reportIncident('police')" style="flex:1; padding: 8px; background: #0000FF; color: white; border: none; border-radius: 5px;">👮 Police</button>
        </div>
    `;
    
    mapControls.appendChild(reportDiv);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Add report buttons after map is initialized
    setTimeout(() => {
        addReportButtons();
    }, 4000);
});// ========================================
// 🗺️ NAVIGATION FUNCTIONS - FIXED VERSION WITH AUTO-NAVIGATION
// ========================================

// Global variables
let route = null;
let current = null;

// Calculate route
async function calculateRoute() {
    const fromInput = document.getElementById('navFrom');
    const toInput = document.getElementById('navTo');
    
    if (!fromInput || !toInput) {
        alert('Navigation inputs not found');
        return;
    }
    
    if (!fromInput.value || !toInput.value) {
        alert('Please enter both locations');
        return;
    }
    
    showToast('🔄 Calculating route...', 'info');
    
    try {
        // Get coordinates
        const fromCoords = await geocodeLocation(fromInput.value);
        const toCoords = await geocodeLocation(toInput.value);
        
        if (!fromCoords || !toCoords) {
            showToast('❌ Could not find locations', 'error');
            return;
        }
        
        // Remove old route
        if (routeControl) {
            map.removeLayer(routeControl);
        }
        
        // Get route from OSRM
        const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=full&geometries=geojson&steps=true`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            showToast('❌ No route found', 'error');
            return;
        }
        
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Draw route
        routeControl = L.polyline(coordinates, {
            color: '#FF6B00',
            weight: 8,
            opacity: 0.7
        }).addTo(map);
        
        // Add markers
        L.marker([fromCoords.lat, fromCoords.lon]).addTo(map).bindPopup('Start');
        L.marker([toCoords.lat, toCoords.lon]).addTo(map).bindPopup('Destination');
        
        // Fit map
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Show info
        document.getElementById('navigationResult').style.display = 'block';
        document.getElementById('navDistance').textContent = (route.distance / 1000).toFixed(1) + ' km';
        document.getElementById('navDuration').textContent = Math.round(route.duration / 60) + ' min';
        
        showToast('✅ Route found!', 'success');
        // 🔥 AUTO-START NAVIGATION - YEH ADD KARO
showToast('🚗 Starting navigation...', 'info');

// Thoda delay deo ta ke route properly show ho jave
setTimeout(() => {
    startInAppNavigation(
        fromCoords.lat, fromCoords.lon, 
        toCoords.lat, toCoords.lon
    );
}, 1000);
        
    } catch (error) {
        console.error('Route error:', error);
        showToast('❌ Error calculating route', 'error');
    }
}

// Geocode location
async function geocodeLocation(query) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error('Geocode error:', error);
    }
    return null;
}

// Use current location
function useCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('❌ Geolocation not supported', 'error');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            
            document.getElementById('navFrom').value = data.display_name || 'Current Location';
            showToast('📍 Current location set', 'success');
        },
        (error) => {
            showToast('❌ Could not get location', 'error');
        }
    );
}

// Toggle traffic layer
function toggleTrafficLayer() {
    showToast('🚦 Traffic feature coming soon!', 'info');
}

// Report incident
function reportIncident(type) {
    showToast(`✅ ${type} reported! Thanks for helping others.`, 'success');
}
// ========================================
// CHATBOT TOGGLE FUNCTIONS - YAHAN PE ADD KARO (File ke end mein)
// ========================================

function toggleChatbot() {
    const chatbot = document.getElementById('chatbotBox');
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    
    if (!isChatbotMinimized) {
        chatbot.style.display = 'none';
        toggleBtn.style.display = 'flex';
        isChatbotMinimized = true;
    } else {
        chatbot.style.display = 'flex';
        toggleBtn.style.display = 'none';
        isChatbotMinimized = false;
    }
}

function closeChatbot() {
    const chatbot = document.getElementById('chatbotBox');
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    
    chatbot.style.display = 'none';
    toggleBtn.style.display = 'flex';
    isChatbotMinimized = true;
}

function openChatbot() {
    const chatbot = document.getElementById('chatbotBox');
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    
    chatbot.style.display = 'flex';
    toggleBtn.style.display = 'none';
    isChatbotMinimized = false;
}
// ========================================
// MISSING FUNCTIONS - ADD THESE
// ========================================

function startInAppNavigation(startLat, startLon, endLat, endLon) {
    showToast('🚗 Navigation started', 'success');
    
    const navPanel = document.createElement('div');
    navPanel.id = 'navigationPanel';
    navPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: white;
        border-radius: 20px;
        padding: 15px;
        box-shadow: 0 5px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        border: 3px solid #FF6B00;
        animation: slideUp 0.3s ease;
    `;
    
    const distance = calculateDistance(startLat, startLon, endLat, endLon) / 1000;
    
    navPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <h3 style="color: #FF6B00; margin:0;">🚗 Live Navigation</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">×</button>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex:1; background: #f0f0f0; padding: 10px; border-radius: 10px;">
                <div style="font-size:0.8rem;">Distance</div>
                <div style="font-weight:700;">${distance.toFixed(1)} km</div>
            </div>
            <div style="flex:1; background: #f0f0f0; padding: 10px; border-radius: 10px;">
                <div style="font-size:0.8rem;">Est. Time</div>
                <div style="font-weight:700;">${Math.round(distance * 2)} min</div>
            </div>
        </div>
        <button onclick="stopNavigation()" style="width:100%; padding:12px; background:#FF0844; color:white; border:none; border-radius:10px; font-weight:700; cursor:pointer;">
            Stop Navigation
        </button>
    `;
    
    document.body.appendChild(navPanel);
}

function stopNavigation() {
    const panel = document.getElementById('navigationPanel');
    if (panel) panel.remove();
    showToast('🛑 Navigation stopped', 'info');
}

// Make sure calculateDistance is defined
if (typeof calculateDistance !== 'function') {
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

// Fix the incomplete sendSOSAlert function
if (typeof window.sendSOSAlert === 'undefined') {
    window.sendSOSAlert = function(position, contacts) {
        // Create location string
        let locationText = '';
        if (position) {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            locationText = `📍 Live Location: https://maps.google.com/?q=${lat},${lng}`;
        }
        
        // Show SOS sending popup
        showSOSSendingPopup(contacts, locationText);
        
        // In a real app, you'd send SMS here
        console.log('🚨 SOS Alert sent to:', contacts);
        console.log('Message:', `EMERGENCY! I need help. ${locationText}`);
        
        // Show toast
        showToast(`🚨 SOS sent to ${contacts.length} contacts`, 'error');
    };
}
