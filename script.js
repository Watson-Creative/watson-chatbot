/**
 * Watson Creative Chatbot Enhancement Scripts
 * 
 * This file contains three main functionalities:
 * 1. Chat bubble popup messages
 * 2. AI disclaimer for chatbot responses
 * 3. Form-based initial interaction system
 *
 * Modification Log:
 * - Combined three separate scripts into one file
 * - Added error handling for each module
 * - Removed HTML script tags to create proper JavaScript file
 * - Added phone number formatting with support for US and international formats
 * - Refactored form validation to dynamically check required attributes instead of hardcoded field IDs
 * - Scoped validation to Watson form only to prevent conflicts with AnythingLLM native fields
 * - Added automatic asterisk addition to required field placeholders via JavaScript
 * - Added close button functionality
 * - Added form message display functionality
 * - Added debug functions for form state tracking
 * - Added close button functionality
 * - Added form message display functionality
 */
(function() {
    'use strict';
    
    console.log('Watson Chat: Enhancement scripts loading...');
    
    // ========================================
    // GLOBAL CONFIGURATION
    // ========================================
    // Toggle the intake form functionality on/off
    // true  = Show the custom intake form when chat opens
    // false = Disable the form completely and use the standard chat interface
    const FORM_ACTIVE = true; // Currently ENABLED - set to false to disable
    
    // Form field configuration - toggle individual fields on/off
    const FORM_FIELDS = {
        firstName: false,    // First Name field
        lastName: false,     // Last Name field  
        title: false,        // Title field
        email: false,        // Email field (was required)
        phone: false,        // Phone field
        company: false,      // Company field
        message: true        // Message field (kept enabled)
    };
    // Note: Browser and location information is always collected in the background
    
    // ========================================
    // SCRIPT 1: Chat Bubble Popup Functionality
    // ========================================
    try {
        // Chat bubble popup functionality
        (function() {
            // ===== CONFIGURATION =====
            const CONFIG = {
                // Timing settings
                POPUP_DELAY: 2000,        		// Time to wait before showing first popup
                WIDGET_CHECK_INTERVAL: 500, 	// How often to check if widget loaded
                POPUP_APPEAR_DELAY: 50,     	// Delay before popup animation starts
                TYPING_START_DELAY: 300,    	// Delay before typing begins
                LETTER_TYPE_INTERVAL: 10,   	// Time between each letter
                AUTO_HIDE_DELAY: 10000,     	// Auto-hide after this time
                HIDE_ANIMATION_DURATION: 300, // Hide animation duration
                NEXT_POPUP_DELAY: 20000,     	// Time to wait before showing next popup
                // Popup behavior settings
                USE_COOKIE_LIMIT: false,				// Set to false to disable cookie tracking
                COOKIE_DAYS: 1,            		// How many days to remember popup was shown
                MAX_POPUPS_PER_SESSION: 8			// High number for continuous testing
            };

            // Array of popup messages
            const popupMessages = [
                "Looking for advice? We've got it.",
                "Got a brand challenge? Let's talk.",
                "Ready to break through the noise?",
                "What's your next big move?",
                "Strategy starts with a conversation.",
                "Tell us what's keeping you up at night.",
                "What change are you trying to create?",
                "Ready to move beyond ordinary?",
                "Let's figure this out together.",
                "What's your brand's untold story?",
                "What if your brand could do more?",
                "What's the real challenge?",
                "What do you do?",
                "Let's cut through the clutter.",
                "Let's talk about what matters.",
                "Every transformation starts here.",
                "Let’s spark your next big idea.",
                "What does success look like for you?",
                "Let’s reimagine what’s possible.",
                "Have a project in mind? We’re all ears.",
                "Let’s turn challenges into opportunities.",
                "Ready to level up your brand?",
                "Tell us about your goals—big or small.",
                "Great brands are built on bold questions.",
                "What's the story only you can tell?",
                "What’s standing between you and growth?",
                "Let’s build something extraordinary.",
                "Let’s turn ideas into action.",
                "How can we help you stand out?",
                "Ready to challenge the status quo?",
                "What's possible when we work together?",
                "Let’s bring your vision to life.",
                "Let’s create something remarkable.",
                "Got a wild idea? We love those.",
                "Let’s find clarity in the chaos.",
                "Big dreams? Let’s make them real."
            ];           

            // Session counter for tracking popups shown this session
            let popupsShownThisSession = 0;
            let continuousMode = false;

            // Cookie management
            function setCookie(name, value, days) {
                const expires = new Date();
                expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
                document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
            }

            function getCookie(name) {
                const nameEQ = name + "=";
                const ca = document.cookie.split(';');
                for(let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            }

            // Check if we should show popup based on configuration
            function shouldShowPopup() {
                // Check session limit
                if (popupsShownThisSession >= CONFIG.MAX_POPUPS_PER_SESSION) {
                    return false;
                }

                // Check cookie limit if enabled
                if (CONFIG.USE_COOKIE_LIMIT && getCookie('watson_chat_popup_shown')) {
                    return false;
                }

                return true;
            }

            // Function to stop popups when chat button is clicked
            function stopPopups() {
                continuousMode = false;
                if (CONFIG.USE_COOKIE_LIMIT) {
                    setCookie('watson_chat_popup_shown', 'true', CONFIG.COOKIE_DAYS);
                }
                // Hide any current popup
                const currentPopup = document.getElementById('watson-chat-popup');
                if (currentPopup) {
                    hidePopup(currentPopup);
                }
            }

            // Function to trigger next popup in sequence
            function scheduleNextPopup() {
                setTimeout(() => {
                    if (shouldShowPopup() && continuousMode) {
                        showChatPopup();
                        popupsShownThisSession++;
                        
                        // Set cookie if enabled
                        if (CONFIG.USE_COOKIE_LIMIT) {
                            setCookie('watson_chat_popup_shown', 'true', CONFIG.COOKIE_DAYS);
                        }
                    }
                }, CONFIG.NEXT_POPUP_DELAY);
            }

            // Wait for chat widget to load, then start timer
            function waitForChatWidget() {
                const chatContainer = document.getElementById('anything-llm-embed-chat-button-container');
                if (chatContainer) {
                    // Widget is loaded, start timer for first popup
                    setTimeout(() => {
                        if (shouldShowPopup()) {
                            continuousMode = true;
                            showChatPopup();
                            popupsShownThisSession++;
                            
                            // Set cookie if enabled
                            if (CONFIG.USE_COOKIE_LIMIT) {
                                setCookie('watson_chat_popup_shown', 'true', CONFIG.COOKIE_DAYS);
                            }
                        }
                    }, CONFIG.POPUP_DELAY);

                    // Add click listener to chat button to stop popups
                    const chatButton = document.getElementById('anything-llm-embed-chat-button');
                    if (chatButton) {
                        chatButton.addEventListener('click', stopPopups);
                    } else {
                        // If button not found immediately, check periodically
                        const checkForButton = setInterval(() => {
                            const button = document.getElementById('anything-llm-embed-chat-button');
                            if (button) {
                                button.addEventListener('click', stopPopups);
                                clearInterval(checkForButton);
                            }
                        }, CONFIG.WIDGET_CHECK_INTERVAL);
                    }
                } else {
                    // Widget not loaded yet, check again
                    setTimeout(waitForChatWidget, CONFIG.WIDGET_CHECK_INTERVAL);
                }
            }

            // Start checking for widget on page load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', waitForChatWidget);
            } else {
                waitForChatWidget();
            }

            function showChatPopup() {
                // Get random message
                const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
                
                // Find the chat button container
                const chatContainer = document.getElementById('anything-llm-embed-chat-button-container');
                if (!chatContainer) return;

                // Create popup bubble
                const popup = document.createElement('div');
                popup.id = 'watson-chat-popup';
                popup.style.cssText = `
                    position: absolute;
                    bottom: 40px;
                    left: 40px;
                    background-color: white;
                    color: #333;
                    padding: 12px 16px;
                    border-radius: 18px 18px 18px 0px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0);
                    width: auto;
                    font-family: Barlow, sans-serif, -apple-system;
                    font-size: 14px;
                    line-height: 1.4;
                    font-weight: 500;
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    pointer-events: none;
                    white-space: nowrap;
                    overflow: visible;
                    cursor: default !important;
                `;

                // Remove any potential conflicting styles/shadows and carrot
                popup.style.setProperty('box-shadow', '0 4px 12px rgba(0,0,0,0)', 'important');
                popup.style.setProperty('border', 'none', 'important');

                // Create text container
                const textContainer = document.createElement('div');
                textContainer.style.cssText = `
                    position: relative;
                    width: auto;
                    display: inline-block;
                    white-space: nowrap;
                `;
                popup.appendChild(textContainer);

                // Add popup to container
                chatContainer.appendChild(popup);

                // Remove any potential carrot/tail CSS
                const style = document.createElement('style');
                style.textContent = '#watson-chat-popup::before, #watson-chat-popup::after { display: none !important; }';
                document.head.appendChild(style);

                // Animate popup appearance
                setTimeout(() => {
                    popup.style.opacity = '1';
                    popup.style.transform = 'translateY(0) scale(1)';
                    popup.style.pointerEvents = 'auto';
                }, CONFIG.POPUP_APPEAR_DELAY);

                // Start typing animation after popup appears
                setTimeout(() => {
                    typeText(textContainer, randomMessage);
                }, CONFIG.TYPING_START_DELAY);

                // Auto-hide after delay
                setTimeout(() => {
                    hidePopup(popup);
                }, CONFIG.AUTO_HIDE_DELAY);

                // Hide on click anywhere (but don't stop continuous mode unless it's the chat button)
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('#anything-llm-embed-chat-button')) {
                        hidePopup(popup);
                    }
                }, { once: true });
            }

            function typeText(container, text) {
                const letters = text.split('');
                
                letters.forEach((letter, index) => {
                    const span = document.createElement('span');
                    span.textContent = letter;
                    span.style.cssText = `
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: all 0.2s ease-out;
                        display: inline-block;
                        ${letter === ' ' ? 'width: 0.25em;' : ''}
                    `;
                    container.appendChild(span);

                    // Animate each letter with delay
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    }, index * CONFIG.LETTER_TYPE_INTERVAL);
                });
            }

            function hidePopup(popup) {
                if (popup && popup.parentNode) {
                    popup.style.opacity = '0';
                    popup.style.transform = 'translateY(10px) scale(0.95)';
                    setTimeout(() => {
                        if (popup.parentNode) {
                            popup.parentNode.removeChild(popup);
                        }
                        
                        // Schedule next popup if in continuous mode
                        if (continuousMode) {
                            scheduleNextPopup();
                        }
                    }, CONFIG.HIDE_ANIMATION_DURATION);
                }
            }
        })();
        console.log('Watson Chat: Popup functionality loaded');
    } catch (error) {
        console.error('Watson Chat: Error loading popup functionality:', error);
    }
    
    // ========================================
    // SCRIPT 2: AI Disclaimer for Chatbot Messages
    // ========================================
    try {
        // Add disclaimer to chatbot messages
        (function() {
            // The disclaimer text to add
            const DISCLAIMER_TEXT = " - This chatbot is powered by AI. It's here to help, but it might not always get things right. For anything important, double-check with our team.";
            
            // Function to add disclaimer to timestamp
            function addDisclaimer(timestampElement) {
                // Check if disclaimer already added
                if (!timestampElement.textContent.includes(DISCLAIMER_TEXT)) {
                    timestampElement.textContent += DISCLAIMER_TEXT;
                }
            }
            
            // Function to process all messages
            function processAllMessages() {
                // Find all timestamp divs that belong to assistant messages
                // They have text-left class and contain time pattern
                const allTimestamps = document.querySelectorAll('.allm-font-sans.allm-text-\\[10px\\].allm-text-gray-400.allm-text-left');
                
                allTimestamps.forEach(timestamp => {
                    // Check if this is a valid timestamp
                    if (timestamp.textContent.match(/^\d{1,2}:\d{2}\s*(AM|PM)$/)) {
                        // Check if there's an assistant message above this timestamp
                        const parentBlock = timestamp.closest('.allm-py-\\[5px\\]');
                        if (parentBlock && parentBlock.querySelector('.allm-anything-llm-assistant-message')) {
                            addDisclaimer(timestamp);
                        }
                    }
                });
            }
            
            // Set up MutationObserver to watch for new messages
            const observer = new MutationObserver((mutations) => {
                // Process all messages whenever DOM changes
                processAllMessages();
            });
            
            // Start observing when chat widget loads
            function startObserving() {
                // Look for the chat history container
                const chatHistory = document.getElementById('chat-history');
                const chatContainer = document.getElementById('anything-llm-chat');
                const embedContainer = document.getElementById('anything-llm-embed-chat-container');
                
                const targetElement = chatHistory || chatContainer || embedContainer;
                
                if (targetElement) {
                    observer.observe(targetElement, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                    // Process any existing messages
                    processAllMessages();
                    console.log('Watson disclaimer script started monitoring chat messages');
                } else {
                    // Try again if chat container not found
                    setTimeout(startObserving, 500);
                }
            }
            
            // Also run periodically as a fallback
            setInterval(processAllMessages, 1000);
            
            // Start when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startObserving);
            } else {
                startObserving();
            }
        })();
        console.log('Watson Chat: Disclaimer functionality loaded');
    } catch (error) {
        console.error('Watson Chat: Error loading disclaimer functionality:', error);
    }
    
    // ========================================
    // SCRIPT 3: Form-Based Initial Interaction
    // ========================================
    try {
        // Form-based initial interaction for Watson Creative chatbot
        (function() {
            let formSubmitted = false;
            let chatInitialized = false;

            // Function to create the intake form
            function createIntakeForm() {
                // Build form rows dynamically based on configuration
                let nameRowFields = [];
                let contactRowFields = [];
                
                // Name row fields
                if (FORM_FIELDS.firstName) {
                    nameRowFields.push('<input type="text" id="first-name" name="firstName" placeholder="First Name" class="watson-form-input">');
                }
                if (FORM_FIELDS.lastName) {
                    nameRowFields.push('<input type="text" id="last-name" name="lastName" placeholder="Last Name" class="watson-form-input">');
                }
                if (FORM_FIELDS.title) {
                    nameRowFields.push('<input type="text" id="title" name="title" placeholder="Title" class="watson-form-input">');
                }
                
                // Contact row fields
                if (FORM_FIELDS.email) {
                    contactRowFields.push('<input type="email" id="email" name="email" placeholder="Email" class="watson-form-input" required>');
                }
                if (FORM_FIELDS.phone) {
                    contactRowFields.push('<input type="tel" id="phone" name="phone" placeholder="Phone (xxx) xxx-xxxx" class="watson-form-input">');
                }
                if (FORM_FIELDS.company) {
                    contactRowFields.push('<input type="text" id="company" name="company" placeholder="Company" class="watson-form-input">');
                }
                
                // Build the name row HTML (only if there are fields)
                let nameRowHTML = '';
                if (nameRowFields.length > 0) {
                    nameRowHTML = `
                            <div class="watson-form-row watson-name-row">
                                ${nameRowFields.join('\n                                ')}
                            </div>`;
                }
                
                // Build the contact row HTML (only if there are fields)
                let contactRowHTML = '';
                if (contactRowFields.length > 0) {
                    contactRowHTML = `
                            <div class="watson-form-row watson-contact-row">
                                ${contactRowFields.join('\n                                ')}
                            </div>`;
                }
                
                // Build message field HTML (only if enabled)
                let messageHTML = '';
                if (FORM_FIELDS.message) {
                    // Check if any other fields exist to determine if message should be disabled initially
                    const hasOtherFields = Object.keys(FORM_FIELDS).some(key => key !== 'message' && FORM_FIELDS[key]);
                    const disabled = hasOtherFields ? 'disabled' : '';
                    messageHTML = `
                            <textarea id="message" name="message" placeholder="Have a question? Want to know our process? Curious how we can help? Ask us anything." rows="3" class="watson-form-input watson-form-textarea" ${disabled}></textarea>`;
                }
                
                // Check if we need the required note
                const hasRequiredFields = FORM_FIELDS.email; // Only email was marked as required
                const requiredNote = hasRequiredFields ? 
                    '<p class="watson-required-note">* Required fields must be filled before starting a conversation.</p>' : '';
                
                // Check if button should be disabled (only if there are required fields that need to be filled)
                const buttonDisabled = hasRequiredFields ? 'disabled' : '';
                
                const formHTML = `
                    <div id="watson-intake-form" class="allm-flex">
                        <form id="watson-contact-form" class="allm-flex allm-flex-col allm-gap-y-3" onsubmit="return false;">
                            ${nameRowHTML}
                            ${contactRowHTML}
                            ${messageHTML}
                            <button type="submit" 
                                class="allm-start-conversation-button" ${buttonDisabled}>
                                Start Conversation
                            </button>
                            ${requiredNote}
                        </form>
                    </div>
                `;
                return formHTML;
            }

            // Function to check if required fields are filled
            function checkRequiredFields() {
                // Only check required fields within our custom form
                const watsonForm = document.getElementById('watson-contact-form');
                if (!watsonForm) {
                    console.log('Watson Chat: Watson form not found');
                    return;
                }
                
                const requiredInputs = watsonForm.querySelectorAll('input[required], textarea[required]');
                const messageField = document.getElementById('message');
                const submitButton = watsonForm.querySelector('.allm-start-conversation-button');
                
                console.log('Watson Chat: checkRequiredFields called', {
                    requiredInputsCount: requiredInputs.length,
                    messageFieldFound: !!messageField,
                    submitButtonFound: !!submitButton
                });
                
                if (messageField && submitButton) {
                    // If there are no required fields, enable everything
                    if (requiredInputs.length === 0) {
                        console.log('Watson Chat: No required fields found, enabling all');
                        messageField.disabled = false;
                        messageField.placeholder = "Have a question? Want to know our process? Curious how we can help? Ask us anything.";
                        submitButton.disabled = false;
                        return;
                    }
                    
                    // Check if all required fields are filled
                    const allFilled = Array.from(requiredInputs).every(input => {
                        const isFilled = input.value.trim() !== '' && input.validity.valid;
                        console.log(`Watson Chat: Checking ${input.name || input.id}: ${isFilled}`);
                        return isFilled;
                    });
                    
                    console.log('Watson Chat: All required fields filled:', allFilled);
                    
                    if (allFilled) {
                        messageField.disabled = false;
                        messageField.placeholder = "Tell us about your project...";
                        submitButton.disabled = false;
                    } else {
                        messageField.disabled = true;
                        messageField.placeholder = "Tell us about your project...";
                        submitButton.disabled = true;
                    }
                } else {
                    console.log('Watson Chat: Message field or submit button not found');
                }
            }

            // Function to collect browser information
            function getBrowserInfo() {
                return {
                    userAgent: navigator.userAgent || '',
                    platform: navigator.platform || '',
                    language: navigator.language || '',
                    languages: (navigator.languages || []).join(', '),
                    cookieEnabled: navigator.cookieEnabled || false,
                    deviceMemory: navigator.deviceMemory || '',
                    hardwareConcurrency: navigator.hardwareConcurrency || '',
                    screenWidth: window.screen.width || '',
                    screenHeight: window.screen.height || ''
                };
            }
            
            // Function to get IP-based location info
            async function getLocationInfo() {
                try {
                    // Using ipinfo.io free tier (no token needed for basic info)
                    const response = await fetch('https://ipinfo.io/json');
                    const data = await response.json();
                    return {
                        ip: data.ip || '',
                        city: data.city || '',
                        region: data.region || '',
                        country: data.country || '',
                        loc: data.loc || '' // latitude,longitude as string
                    };
                } catch (err) {
                    console.log('Watson Chat: Could not fetch location info:', err);
                    return {
                        ip: '',
                        city: '',
                        region: '',
                        country: '',
                        loc: ''
                    };
                }
            }
            
            // Function to format hidden data as XML-style tags
            function formatHiddenData(browserInfo, locationInfo) {
                return [
                    `<browser_user_agent>${browserInfo.userAgent}</browser_user_agent>`,
                    `<browser_platform>${browserInfo.platform}</browser_platform>`,
                    `<browser_language>${browserInfo.language}</browser_language>`,
                    `<browser_languages>${browserInfo.languages}</browser_languages>`,
                    `<browser_cookie_enabled>${browserInfo.cookieEnabled}</browser_cookie_enabled>`,
                    `<browser_device_memory>${browserInfo.deviceMemory}</browser_device_memory>`,
                    `<browser_hardware_concurrency>${browserInfo.hardwareConcurrency}</browser_hardware_concurrency>`,
                    `<browser_screen_width>${browserInfo.screenWidth}</browser_screen_width>`,
                    `<browser_screen_height>${browserInfo.screenHeight}</browser_screen_height>`,
                    `<location_ip>${locationInfo.ip}</location_ip>`,
                    `<location_city>${locationInfo.city}</location_city>`,
                    `<location_region>${locationInfo.region}</location_region>`,
                    `<location_country>${locationInfo.country}</location_country>`,
                    `<location_coords>${locationInfo.loc}</location_coords>`
                ].join('|');
            }

            // Function to format phone number as user types
            function formatPhoneNumber(e) {
                const input = e.target;
                let value = input.value.replace(/\D/g, ''); // Remove all non-digits
                
                // Check if it starts with a country code (assuming 1-3 digits)
                let formattedValue = '';
                let hasCountryCode = false;
                
                // Check for country code patterns
                if (value.length > 10) {
                    // Assume first 1-3 digits are country code if total length > 10
                    const possibleCountryCodeLength = value.length - 10;
                    if (possibleCountryCodeLength >= 1 && possibleCountryCodeLength <= 3) {
                        const countryCode = value.substring(0, possibleCountryCodeLength);
                        const phoneNumber = value.substring(possibleCountryCodeLength);
                        
                        // Format with country code
                        if (phoneNumber.length >= 6) {
                            formattedValue = `+${countryCode} (${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}`;
                            if (phoneNumber.length > 6) {
                                formattedValue += `-${phoneNumber.substring(6, 10)}`;
                            }
                        } else if (phoneNumber.length >= 3) {
                            formattedValue = `+${countryCode} (${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3)}`;
                        } else {
                            formattedValue = `+${countryCode} (${phoneNumber}`;
                        }
                        hasCountryCode = true;
                    }
                }
                
                // Format without country code
                if (!hasCountryCode) {
                    if (value.length >= 6) {
                        formattedValue = `(${value.substring(0, 3)}) ${value.substring(3, 6)}`;
                        if (value.length > 6) {
                            formattedValue += `-${value.substring(6, 10)}`;
                        }
                    } else if (value.length >= 3) {
                        formattedValue = `(${value.substring(0, 3)}) ${value.substring(3)}`;
                    } else if (value.length > 0) {
                        formattedValue = `(${value}`;
                    }
                }
                
                // Update the input value
                input.value = formattedValue;
                
                // Preserve cursor position
                const cursorPosition = input.selectionStart;
                setTimeout(() => {
                    input.setSelectionRange(cursorPosition, cursorPosition);
                }, 0);
            }
            
            // Function to handle paste events for phone numbers
            function handlePhonePaste(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const input = e.target;
                
                // Clean the pasted text and trigger formatting
                input.value = pastedText.replace(/\D/g, '');
                formatPhoneNumber({ target: input });
            }

            // Function to hide the message input area and show the form
            function showIntakeForm() {
                // Check if form is active
                if (!FORM_ACTIVE) {
                    console.log('Watson Chat: Form is disabled via FORM_ACTIVE flag');
                    return;
                }
                
                // Find the chat container
                const chatContainer = document.getElementById('anything-llm-chat');
                if (!chatContainer || formSubmitted) return;

                console.log('Watson Chat: Showing intake form');

                // Check if chat is fully loaded by looking for essential elements
                const messageInput = document.getElementById('message-input');
                const originalForm = chatContainer.querySelector('form');
                
                if (!messageInput || !originalForm) {
                    console.log('Watson Chat: Chat not fully loaded yet, retrying...');
                    setTimeout(() => showIntakeForm(), 500);
                    return;
                }

                // Hide the original message input form
                if (originalForm) {
                    originalForm.style.display = 'none';
                    console.log('Watson Chat: Original form hidden');
                }

                // Check if form already exists
                let intakeForm = document.getElementById('watson-intake-form');
                
                if (!intakeForm) {
                    // Find the greeting text container or chat history container
                    const greetingContainer = chatContainer.querySelector('.allm-text-slate-400.allm-text-sm.allm-font-sans.allm-py-4.allm-text-center')?.parentElement?.parentElement;
                    const chatHistory = document.getElementById('chat-history');
                    const targetContainer = greetingContainer || chatHistory?.parentElement;
                    
                    if (targetContainer) {
                        // Insert the form after the greeting or at the top of chat
                        const formDiv = document.createElement('div');
                        formDiv.innerHTML = createIntakeForm();
                        
                        if (greetingContainer) {
                            greetingContainer.appendChild(formDiv.firstElementChild);
                        } else {
                            // Insert before the chat history
                            targetContainer.insertBefore(formDiv.firstElementChild, chatHistory);
                        }
                        
                        intakeForm = document.getElementById('watson-intake-form');
                        console.log('Watson Chat: Intake form created');
                    } else {
                        console.log('Watson Chat: No suitable container found yet, retrying...');
                        setTimeout(() => showIntakeForm(), 500);
                        return;
                    }
                }
                
                // Show the intake form
                if (intakeForm) {
                    intakeForm.style.display = 'block';
                    console.log('Watson Chat: Intake form container displayed');
                    
                    // Make sure the actual form is visible too
                    const form = document.getElementById('watson-contact-form');
                    if (form) {
                        form.style.display = '';
                        console.log('Watson Chat: Form element made visible');
                        
                        // Add form submission handler if not already added
                        if (!form.hasAttribute('data-listener-added')) {
                            form.addEventListener('submit', function(e) {
                                e.preventDefault();
                                handleFormSubmit(e);
                            }, false);
                            form.setAttribute('data-listener-added', 'true');
                            console.log('Watson Chat: Form submission handler added');
                            
                            // Also add click handler to the submit button as backup
                            const submitButton = form.querySelector('button[type="submit"]');
                            if (submitButton) {
                                submitButton.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFormSubmit(e);
                                }, false);
                                console.log('Watson Chat: Button click handler added');
                            }
                            
                            // Add input listeners for all fields to handle dynamic requirements
                            const allInputs = form.querySelectorAll('input, textarea');
                            allInputs.forEach(field => {
                                field.addEventListener('input', checkRequiredFields);
                                field.addEventListener('blur', checkRequiredFields);
                            });
                            console.log('Watson Chat: Field listeners added for', allInputs.length, 'fields');
                            
                            // Add phone formatting listener (only if phone field is enabled)
                            if (FORM_FIELDS.phone) {
                                const phoneField = document.getElementById('phone');
                                if (phoneField) {
                                    phoneField.addEventListener('input', formatPhoneNumber);
                                    phoneField.addEventListener('paste', handlePhonePaste);
                                    console.log('Watson Chat: Phone formatting listener added');
                                }
                            }
                            
                            // Add asterisks to required field placeholders
                            const requiredFields = form.querySelectorAll('input[required], textarea[required]');
                            requiredFields.forEach(field => {
                                if (field.placeholder && !field.placeholder.includes('*')) {
                                    field.placeholder = field.placeholder + ' *';
                                }
                            });
                            console.log('Watson Chat: Added asterisks to required fields');
                            
                            // Initial check
                            checkRequiredFields();
                        }
                    }
                }
            }

            // Function to handle form submission
            async function handleFormSubmit(e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                console.log('Watson Chat: Form submitted');
                
                // Get the form element
                const form = document.getElementById('watson-contact-form');
                if (!form) {
                    console.error('Watson Chat: Form not found');
                    return false;
                }
                
                const formData = new FormData(form);
                // Get values only if fields exist (based on configuration)
                const firstName = FORM_FIELDS.firstName ? (formData.get('firstName') || '') : '';
                const lastName = FORM_FIELDS.lastName ? (formData.get('lastName') || '') : '';
                const title = FORM_FIELDS.title ? (formData.get('title') || '') : '';
                const email = FORM_FIELDS.email ? (formData.get('email') || '') : '';
                const phone = FORM_FIELDS.phone ? (formData.get('phone') || '') : '';
                const company = FORM_FIELDS.company ? (formData.get('company') || '') : '';
                const message = FORM_FIELDS.message ? (formData.get('message') || '') : '';

                console.log('Watson Chat: Form data collected:', {
                    firstName, lastName, title, email, phone, company, message
                });

                // ALWAYS collect browser information regardless of form fields shown (synchronous)
                const browserInfo = getBrowserInfo();
                console.log('Watson Chat: Browser info collected:', browserInfo);

                // ALWAYS collect location information regardless of form fields shown (asynchronous)
                const locationInfo = await getLocationInfo();
                console.log('Watson Chat: Location info collected:', locationInfo);

                // Format the main message
                const mainMessage = `<first_name>${firstName}</first_name>|<last_name>${lastName}</last_name>|<title>${title}</title>|<email>${email}</email>|<phone>${phone}</phone>|<company>${company}</company>|<message>${message}</message>`;
                
                // Format hidden data
                const hiddenData = formatHiddenData(browserInfo, locationInfo);
                
                // Combine both
                const formattedMessage = `${mainMessage}|${hiddenData}`;
                console.log('Watson Chat: Full formatted message with hidden data:', formattedMessage);

                // First, show the original message input (it needs to be visible to work)
                const originalForm = document.querySelector('#anything-llm-chat form:not(#watson-contact-form)');
                if (originalForm) {
                    originalForm.style.display = '';
                    console.log('Watson Chat: Original form shown');
                }

                // Hide the intake form
                const intakeForm = document.getElementById('watson-intake-form');
                if (intakeForm) {
                    intakeForm.style.display = 'none';
                    console.log('Watson Chat: Intake form hidden');
                }

                // Send the message with a slight delay to ensure DOM is ready
                setTimeout(() => {
                    console.log('Watson Chat: Waiting for message input to be available');
                    let attempts = 0;
                    
                    // Wait for the input to be available
                    const waitForInput = setInterval(() => {
                        attempts++;
                        const messageInput = document.getElementById('message-input');
                        const sendButton = document.getElementById('send-message-button');
                        
                        console.log(`Watson Chat: Attempt ${attempts} - Input found: ${!!messageInput}, Button found: ${!!sendButton}, Input visible: ${messageInput ? messageInput.offsetParent !== null : false}`);
                        
                        if (messageInput && sendButton && messageInput.offsetParent !== null) {
                            clearInterval(waitForInput);
                            console.log('Watson Chat: Input and button are ready, sending message');
                            sendFormattedMessage(formattedMessage);
                            
                            // Mark form as submitted after sending
                            formSubmitted = true;
                            
                            // Store form submission state
                            sessionStorage.setItem('watson_form_submitted', 'true');
                        }
                    }, 100);
                    
                    // Timeout after 5 seconds
                    setTimeout(() => {
                        clearInterval(waitForInput);
                        console.error('Watson Chat: Timeout waiting for message input');
                    }, 5000);
                }, 200);
                
                // Prevent default form submission
                return false;
            }

            // Function to send the formatted message
            function sendFormattedMessage(message) {
                console.log('Watson Chat: Attempting to send message:', message);
                
                // Find the message input and send button
                const messageInput = document.getElementById('message-input');
                const sendButton = document.getElementById('send-message-button');

                console.log('Watson Chat: Message input found:', !!messageInput);
                console.log('Watson Chat: Send button found:', !!sendButton);

                if (messageInput && sendButton) {
                    // Focus the input first
                    messageInput.focus();
                    
                    // For React controlled components, we need to simulate native input
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    nativeInputValueSetter.call(messageInput, message);
                    
                    // Create and dispatch input event for React
                    const inputEvent = new Event('input', { bubbles: true });
                    messageInput.dispatchEvent(inputEvent);
                    
                    console.log('Watson Chat: Message set in input:', messageInput.value);
                    
                    // Try multiple approaches to submit
                    setTimeout(() => {
                        // Method 1: Submit the form directly
                        const form = messageInput.closest('form');
                        if (form) {
                            console.log('Watson Chat: Submitting form directly');
                            // Create and dispatch a submit event
                            const submitEvent = new Event('submit', { 
                                bubbles: true, 
                                cancelable: true 
                            });
                            
                            // Prevent default to let React handle it
                            form.addEventListener('submit', function(e) {
                                console.log('Watson Chat: Form submit event triggered');
                            }, { once: true });
                            
                            form.dispatchEvent(submitEvent);
                        }
                        
                        // Method 2: Click the button with proper event
                        setTimeout(() => {
                            if (messageInput.value === message) {
                                console.log('Watson Chat: Trying button click');
                                const clickEvent = new MouseEvent('click', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true
                                });
                                sendButton.dispatchEvent(clickEvent);
                            }
                        }, 100);
                        
                        // Method 3: Trigger Enter key press
                        setTimeout(() => {
                            if (messageInput.value === message) {
                                console.log('Watson Chat: Trying Enter key press');
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    which: 13,
                                    bubbles: true,
                                    cancelable: true
                                });
                                messageInput.dispatchEvent(enterEvent);
                                
                                // Also try keypress
                                const keypressEvent = new KeyboardEvent('keypress', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    which: 13,
                                    bubbles: true,
                                    cancelable: true
                                });
                                messageInput.dispatchEvent(keypressEvent);
                            }
                        }, 200);
                        
                        // Check if message was sent after all attempts
                        setTimeout(() => {
                            if (messageInput.value === '') {
                                console.log('Watson Chat: Message sent successfully');
                            } else {
                                console.log('Watson Chat: Message may not have been sent, value still in input');
                            }
                        }, 500);
                    }, 100);
                } else {
                    console.error('Watson Chat: Could not find message input or send button');
                }
            }

            // Function to check if form was already submitted this session
            function checkFormStatus() {
                return sessionStorage.getItem('watson_form_submitted') === 'true';
            }

            // Initialize the form when chat opens
            function initializeFormInteraction() {
                // Check if form is active
                if (!FORM_ACTIVE) {
                    console.log('Watson Chat: Form functionality is disabled');
                    chatInitialized = true; // Mark as initialized to prevent repeated checks
                    return;
                }
                
                // Prevent duplicate initialization
                if (chatInitialized) {
                    console.log('Watson Chat: Already initialized, skipping');
                    return;
                }
                
                console.log('Watson Chat: Initializing form interaction');
                
                // Check if chat is fully loaded before marking as initialized
                const chatContainer = document.getElementById('anything-llm-chat');
                const messageInput = document.getElementById('message-input');
                const chatHistory = document.getElementById('chat-history');
                
                if (!chatContainer || !messageInput) {
                    console.log('Watson Chat: Chat not fully loaded, waiting...');
                    setTimeout(() => initializeFormInteraction(), 500);
                    return;
                }
                
                chatInitialized = true;
                
                // Always check current form status
                formSubmitted = checkFormStatus();
                console.log('Watson Chat: Form submitted status:', formSubmitted);
                
                // Show form if not submitted - this should happen every time chat opens unless form was actually submitted
                if (!formSubmitted) {
                    // Give the chat a moment to settle, then show form
                    setTimeout(() => {
                        showIntakeForm();
                        
                        // Also ensure the original form is hidden
                        const originalForm = document.querySelector('#anything-llm-chat form:not(#watson-contact-form)');
                        if (originalForm) {
                            originalForm.style.display = 'none';
                        }
                    }, 100);
                } else {
                    // If form was submitted, ensure regular chat input is visible
                    const originalForm = document.querySelector('#anything-llm-chat form:not(#watson-contact-form)');
                    if (originalForm) {
                        originalForm.style.display = '';
                    }
                }
            }

            // Watch for chat window to open
            function watchForChatOpen() {
                console.log('Watson Chat: Starting to watch for chat window');
                
                const observer = new MutationObserver((mutations) => {
                    // Check if chat window is visible and fully loaded
                    const chatWindow = document.getElementById('anything-llm-chat');
                    const messageInput = document.getElementById('message-input');
                    
                    if (chatWindow && messageInput) {
                        // Check if it's visible (not display: none and has dimensions)
                        const isVisible = chatWindow.offsetParent !== null || 
                                        window.getComputedStyle(chatWindow).display !== 'none';
                        
                        if (isVisible && !chatInitialized) {
                            console.log('Watson Chat: Chat window detected as open and loaded');
                            initializeFormInteraction();
                        }
                    } else if (chatWindow) {
                        // Check if chat was closed
                        const isVisible = chatWindow.offsetParent !== null || 
                                        window.getComputedStyle(chatWindow).display !== 'none';
                        
                        if (!isVisible && chatInitialized && !formSubmitted) {
                            console.log('Watson Chat: Chat window closed, resetting state');
                            chatInitialized = false;
                            // Remove any existing intake form
                            const intakeForm = document.getElementById('watson-intake-form');
                            if (intakeForm) {
                                intakeForm.remove();
                            }
                        }
                    }
                });

                // Start observing
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });

                // Also check periodically if chat is already open
                const checkInterval = setInterval(() => {
                    const chatWindow = document.getElementById('anything-llm-chat');
                    const messageInput = document.getElementById('message-input');
                    
                    if (chatWindow && messageInput) {
                        const isVisible = chatWindow.offsetParent !== null || 
                                        window.getComputedStyle(chatWindow).display !== 'none';
                        if (isVisible && !chatInitialized) {
                            console.log('Watson Chat: Chat window already open and loaded');
                            clearInterval(checkInterval);
                            initializeFormInteraction();
                        }
                    }
                }, 500);
                
                // Clear interval after 30 seconds to prevent memory leak
                setTimeout(() => clearInterval(checkInterval), 30000);
            }

            // Start watching when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', watchForChatOpen);
            } else {
                watchForChatOpen();
            }

            // Watch for reset button clicks
            function watchForResetButton() {
                const observer = new MutationObserver((mutations) => {
                    // Look for the reset button - it has specific classes and text
                    const buttons = document.querySelectorAll('button.allm-h-fit.allm-px-0.hover\\:allm-cursor-pointer.allm-border-none.allm-text-sm.allm-bg-transparent');
                    buttons.forEach(button => {
                        if (button.textContent.trim() === 'Reset Chat') {
                            // Remove existing listener to avoid duplicates
                            button.removeEventListener('click', handleResetClick);
                            // Add click listener
                            button.addEventListener('click', handleResetClick);
                        }
                    });
                });

                // Start observing
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // Also check immediately in case button already exists
                const buttons = document.querySelectorAll('button.allm-h-fit.allm-px-0.hover\\:allm-cursor-pointer.allm-border-none.allm-text-sm.allm-bg-transparent');
                buttons.forEach(button => {
                    if (button.textContent.trim() === 'Reset Chat') {
                        button.addEventListener('click', handleResetClick);
                    }
                });
            }

            // Handle reset button click
            function handleResetClick() {
                console.log('Watson Chat: Reset button clicked, clearing form state');
                // Clear the form submission state
                sessionStorage.removeItem('watson_form_submitted');
                // Reset our flags
                formSubmitted = false;
                chatInitialized = false;
                
                // Wait a bit for the chat to reset, then re-initialize
                setTimeout(() => {
                    // Check if chat is open and re-initialize
                    const chatWindow = document.getElementById('anything-llm-chat');
                    if (chatWindow && chatWindow.style.display !== 'none') {
                        initializeFormInteraction();
                    }
                }, 500);
            }

            // Start watching for reset button
            watchForResetButton();
            
            // ===== CUSTOM GREETING HTML FUNCTIONALITY =====
            // Function to check and replace greeting text
            function processGreetingContainer(container) {
                // Check if container has already been processed
                if (container.classList.contains('watson-greeting-processed')) {
                    return false;
                }
                
                // Check if this is a greeting container (any text content will do)
                // The widget will place whatever is in data-greeting here
                const hasContent = container.textContent.trim().length > 0;
                
                if (hasContent) {
                    // Mark as processed to avoid duplicate processing
                    container.classList.add('watson-greeting-processed');
                    
                    // Replace with HTML structure
                    container.innerHTML = '<div class="watson-greeting-header"><img src="https://cdn.prod.website-files.com/64c83832db063db353be392d/65a83d67a899b3f55c6982c0_watson-creative-mark-light-green.svg" alt="Watson Creative Logo" class="watson-greeting-logo"><h1 class="watson-greeting-h1">Start Exploring</h1></div><p class="watson-greeting-h2">This AI has all the intel on Watson—from case studies to trail recommendations.<br/><em>Yes, we have a Slack thread dedicated to the best backcountry snacks.</em></p>';
                    
                    console.log('Watson Chat: Greeting replaced with HTML formatting');
                    return true;
                }
                
                return false;
            }
            
            // Function to replace greeting text with HTML
            function replaceGreetingWithHTML() {
                // Check for greeting containers
                function checkForGreeting() {
                    const greetingContainers = document.querySelectorAll('.allm-text-slate-400.allm-text-sm.allm-font-sans.allm-py-4.allm-text-center');
                    greetingContainers.forEach(processGreetingContainer);
                }
                
                // Set up observer for dynamic content
                const observer = new MutationObserver((mutations) => {
                    checkForGreeting();
                });
                
                // Start observing
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                
                // Also check immediately in case greeting already exists
                setTimeout(checkForGreeting, 100);
            }
            
            // Start watching for greeting to replace
            replaceGreetingWithHTML();
            
            // ===== CUSTOM CLOSE BUTTON FUNCTIONALITY =====
            let closeButton = null;
            
            // Function to create the close button
            function createCloseButton() {
                const button = document.createElement('button');
                button.className = 'watson-close-button';
                button.setAttribute('aria-label', 'Close chat');
                button.setAttribute('title', 'Close chat');
                return button;
            }
            
            // Function to close the chat
            function closeChat() {
                // Reset chat state when closing (unless form was actually submitted)
                if (!formSubmitted) {
                    console.log('Watson Chat: Resetting chat state on close (form not submitted)');
                    chatInitialized = false;
                    // Remove the intake form if it exists
                    const intakeForm = document.getElementById('watson-intake-form');
                    if (intakeForm) {
                        intakeForm.remove();
                    }
                }
                
                // Find all buttons with the specific class combination
                const buttons = document.querySelectorAll('button.allm-h-fit.allm-px-0.hover\\:allm-cursor-pointer.allm-border-none.allm-text-sm.allm-bg-transparent.hover\\:allm-opacity-80.hover\\:allm-underline');
                
                // Look for the "Close Chat" button specifically
                let nativeCloseButton = null;
                buttons.forEach(button => {
                    if (button.textContent.trim() === 'Close Chat') {
                        nativeCloseButton = button;
                    }
                });
                
                if (nativeCloseButton) {
                    // Click the native close button to ensure proper cleanup
                    nativeCloseButton.click();
                    console.log('Watson Chat: Triggered native close button');
                } else {
                    // Fallback: Try to find and click any element that might close the chat
                    console.warn('Watson Chat: Could not find native close button, using fallback');
                    // Try alternative selector
                    const altCloseButton = Array.from(document.querySelectorAll('button')).find(
                        btn => btn.textContent.trim() === 'Close Chat'
                    );
                    if (altCloseButton) {
                        altCloseButton.click();
                    }
                }
            }
            
            // Function to add close button to chat window
            function addCloseButton() {
                // Check if chat window exists and button hasn't been added
                const chatWindow = document.getElementById('anything-llm-chat');
                if (!chatWindow || closeButton) return;
                
                // Create and add the close button
                closeButton = createCloseButton();
                closeButton.addEventListener('click', closeChat);
                
                // Add to the chat window container
                chatWindow.appendChild(closeButton);
                
                console.log('Watson Chat: Close button added');
            }
            
            // Watch for chat window to appear (for close button)
            function watchForChatWindowCloseButton() {
                const observer = new MutationObserver((mutations) => {
                    const chatWindow = document.getElementById('anything-llm-chat');
                    if (chatWindow && chatWindow.style.display !== 'none') {
                        // Add close button if not already present
                        if (!closeButton || !closeButton.parentNode) {
                            addCloseButton();
                        }
                    }
                    
                    // Also watch for chat window removal to clean up our button reference
                    if (closeButton && !closeButton.parentNode) {
                        closeButton = null;
                    }
                });
                
                // Start observing
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style']
                });
                
                // Initial check
                setTimeout(() => {
                    const chatWindow = document.getElementById('anything-llm-chat');
                    if (chatWindow && chatWindow.style.display !== 'none') {
                        addCloseButton();
                    }
                }, 1000);
            }
            
            // Start watching for close button functionality
            watchForChatWindowCloseButton();
            
            // Function to watch for and modify form submission messages
            function watchForFormMessages() {
                const observer = new MutationObserver((mutations) => {
                    // Look for user messages that contain our form data
                    const userMessages = document.querySelectorAll('.allm-anything-llm-user-message p');
                    
                    userMessages.forEach(p => {
                        const text = p.textContent;
                        // Check if this is a form submission message (contains both form data and possibly browser/location data)
                        if (text.includes('<first_name>') && text.includes('<message>') && !p.classList.contains('watson-processed')) {
                            // Extract the message content
                            const messageMatch = text.match(/<message>(.*?)<\/message>/);
                            if (messageMatch) {
                                const messageContent = messageMatch[1];
                                
                                // Add class to identify this message
                                p.classList.add('watson-form-submission-message', 'watson-processed');
                                
                                // Create a span for the visible message
                                const visibleSpan = document.createElement('span');
                                visibleSpan.className = 'watson-visible-message';
                                visibleSpan.textContent = messageContent;
                                
                                // Clear the paragraph and add only the visible message
                                p.innerHTML = '';
                                p.appendChild(visibleSpan);
                                
                                console.log('Watson Chat: Form message display updated, hidden data preserved for LLM');
                            }
                        }
                    });
                });
                
                // Start observing the chat container
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
            
            // Start watching for form messages
            watchForFormMessages();

            // Expose functions for debugging
            window.watsonChatDebug = {
                showForm: () => {
                    if (!FORM_ACTIVE) {
                        console.log('Watson Chat: Form is disabled via FORM_ACTIVE flag');
                        return;
                    }
                    showIntakeForm();
                },
                resetForm: () => {
                    if (!FORM_ACTIVE) {
                        console.log('Watson Chat: Form is disabled via FORM_ACTIVE flag');
                        return;
                    }
                    sessionStorage.removeItem('watson_form_submitted');
                    formSubmitted = false;
                    chatInitialized = false;
                    // Remove existing form
                    const intakeForm = document.getElementById('watson-intake-form');
                    if (intakeForm) {
                        intakeForm.remove();
                    }
                    console.log('Watson Chat: Form state reset');
                    // Re-initialize if chat is open
                    const chatWindow = document.getElementById('anything-llm-chat');
                    if (chatWindow && chatWindow.style.display !== 'none') {
                        setTimeout(() => initializeFormInteraction(), 100);
                    }
                },
                checkStatus: () => {
                    const intakeForm = document.getElementById('watson-intake-form');
                    const contactForm = document.getElementById('watson-contact-form');
                    const originalForm = document.querySelector('#anything-llm-chat form:not(#watson-contact-form)');
                    
                    console.log('Watson Chat Status:', {
                        formActive: FORM_ACTIVE,
                        formSubmitted,
                        chatInitialized,
                        sessionStorage: sessionStorage.getItem('watson_form_submitted'),
                        intakeFormExists: !!intakeForm,
                        intakeFormVisible: intakeForm?.style.display,
                        contactFormExists: !!contactForm,
                        contactFormVisible: contactForm?.style.display,
                        originalFormVisible: originalForm?.style.display,
                        messageInputExists: !!document.getElementById('message-input'),
                        sendButtonExists: !!document.getElementById('send-message-button')
                    });
                },
                isFormActive: () => FORM_ACTIVE
            };


        })();
        console.log('Watson Chat: Form functionality loaded');
    } catch (error) {
        console.error('Watson Chat: Error loading form functionality:', error);
    }
    
    console.log('Watson Chat: All enhancement scripts loaded');
    
})();