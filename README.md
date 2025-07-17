# Watson Creative Chatbot Addon

A sophisticated chatbot integration for Watson Creative that includes AnythingLLM chat widget with custom popup notifications, intake form, AI disclaimer functionality, and intelligent message display formatting.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Components](#components)
- [Customization](#customization)
- [API Reference](#api-reference)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Recent Updates](#recent-updates)

## Overview

This chatbot addon integrates the AnythingLLM chat widget into your website with enhanced features including:
- Custom intake form for lead capture
- Automated popup messages to engage visitors
- Typing animation effects
- AI disclaimer notices
- Intelligent message display formatting
- Session-based form management
- Customizable timing and behavior
- Cookie-based visitor tracking
- Responsive design

## Features

### 1. **AnythingLLM Chat Widget Integration**
- Embedded chat widget powered by AnythingLLM
- Custom branding with Watson Creative assets
- Configurable appearance and behavior
- Support email integration
- Thought process visibility

### 2. **Smart Popup Notifications**
- 20 pre-written engagement messages
- Randomized message selection
- Typing animation effect
- Auto-hide functionality
- Click-to-dismiss behavior
- Continuous mode with configurable intervals

### 3. **AI Disclaimer System**
- Automatic disclaimer addition to bot messages
- MutationObserver for real-time monitoring
- Timestamp-based disclaimer placement
- Prevents duplicate disclaimers

### 4. **Form-Based Initial Interaction**
- Custom intake form for first-time visitors
- Collects: First Name, Last Name, Email, Phone, Company, Message
- Automatically formats and sends data to chatbot
- Session-based tracking to show form only once
- Smooth transition to regular chat after submission
- Intelligent message display - shows only user message while preserving full data for LLM
- Automatic form state reset with "Reset Chat" button
- Robust form submission handling with multiple fallback methods

### 5. **Cookie Management**
- Optional cookie tracking to limit popup frequency
- Configurable cookie duration
- Session-based popup limits

## Installation

1. **Include the HTML structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watson Creative Chat</title>
</head>
<body>
    <!-- Your content here -->
</body>
</html>
```

2. **Add the chatbot code** between the `<!-- START CHAT BOT CODE -->` and `<!-- END CHAT BOT CODE -->` comments.

3. **Ensure the AnythingLLM widget script is properly configured** with your specific embed ID and API URL.

## Configuration

### Chat Widget Configuration

The AnythingLLM widget is configured through data attributes:

```javascript
data-embed-id="5e694110-e833-4fc9-abe8-61a063d47ba6"  // Your unique embed ID
data-base-api-url="https://ai.watsoncreative.com/api/embed"  // API endpoint
data-button-color="#00b795"  // Chat button color
data-user-bg-color="#f5fcfb"  // User message background
data-assistant-bg-color="#f4f2f1"  // Assistant message background
data-position="bottom-right"  // Widget position
data-window-height="90%"  // Chat window height
data-window-width="90%"  // Chat window width
```

### Popup Configuration

Modify the `CONFIG` object to customize popup behavior:

```javascript
const CONFIG = {
    // Timing settings (in milliseconds)
    POPUP_DELAY: 20000,              // Wait before first popup (20 seconds)
    WIDGET_CHECK_INTERVAL: 500,      // Check for widget load interval
    POPUP_APPEAR_DELAY: 50,          // Animation start delay
    TYPING_START_DELAY: 300,         // Delay before typing begins
    LETTER_TYPE_INTERVAL: 10,        // Time between each letter
    AUTO_HIDE_DELAY: 10000,          // Auto-hide after 10 seconds
    HIDE_ANIMATION_DURATION: 300,    // Hide animation duration
    NEXT_POPUP_DELAY: 20000,         // Time between popups
    
    // Behavior settings
    USE_COOKIE_LIMIT: false,         // Enable/disable cookie tracking
    COOKIE_DAYS: 1,                  // Cookie duration in days
    MAX_POPUPS_PER_SESSION: 8        // Maximum popups per session
};
```

### Popup Messages

Customize the engagement messages by modifying the `popupMessages` array:

```javascript
const popupMessages = [
    "Your custom message here",
    "Another engaging question",
    // Add more messages...
];
```

## Components

### 1. **CSS Styles**
- Global font smoothing and color settings
- Chat popup positioning and animations
- Z-index management for proper layering
- Responsive design considerations
- Form input styling and focus states

### 2. **Popup Functionality Script**
- **Cookie Management**: `setCookie()`, `getCookie()`
- **Popup Control**: `showChatPopup()`, `hidePopup()`, `stopPopups()`
- **Animation**: `typeText()` for letter-by-letter animation
- **Scheduling**: `scheduleNextPopup()`, `waitForChatWidget()`

### 3. **Disclaimer Script**
- **Message Processing**: `processAllMessages()`
- **Disclaimer Addition**: `addDisclaimer()`
- **DOM Monitoring**: MutationObserver setup
- **Fallback Timer**: 1-second interval check

### 4. **Form Interaction Script**
- **Form Creation**: `createIntakeForm()` generates the HTML form
- **Form Display**: `showIntakeForm()` manages form visibility
- **Form Submission**: `handleFormSubmit()` processes and formats data
- **Message Formatting**: Sends data as `<first_name>VALUE</first_name>|<last_name>VALUE</last_name>|<email>VALUE</email>|<phone>VALUE</phone>|<company>VALUE</company>|<message>VALUE</message>`
- **Session Management**: Uses sessionStorage to track form submission
- **Message Display**: `watchForFormMessages()` extracts and displays only message content
- **Reset Handling**: `handleResetClick()` clears form state when chat is reset
- **Initialization**: `initializeFormInteraction()` prevents duplicate initialization

## Customization

### Styling the Popup

The popup appearance can be customized by modifying the inline styles in `showChatPopup()`:

```javascript
popup.style.cssText = `
    background-color: white;           // Change popup background
    color: #333;                      // Change text color
    padding: 12px 16px;               // Adjust padding
    border-radius: 18px 18px 18px 0px; // Modify border radius
    font-family: Barlow, sans-serif;   // Change font
    font-size: 14px;                   // Adjust font size
    // Add more custom styles...
`;
```

### Modifying Animation Effects

Adjust the cubic-bezier values for different animation curves:
```javascript
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Changing Disclaimer Text

Update the `DISCLAIMER_TEXT` constant:
```javascript
const DISCLAIMER_TEXT = " - Your custom disclaimer here.";
```

### Customizing the Intake Form

The form fields can be modified in the `createIntakeForm()` function:

```javascript
// Add or remove fields as needed
<input type="text" id="custom-field" name="customField" placeholder="Custom Field"
    class="allm-w-full allm-px-3 allm-py-2 allm-border allm-border-gray-300 allm-rounded-lg allm-text-sm allm-bg-white focus:allm-outline-none focus:allm-border-[#00b795]">
```

Update the message format in `handleFormSubmit()`:
```javascript
const formattedMessage = `<first_name>${firstName}</first_name>|<last_name>${lastName}</last_name>|<email>${email}</email>|<phone>${phone}</phone>|<company>${company}</company>|<custom_field>${customField}</custom_field>|<message>${message}</message>`;
```

### Customizing Message Display

The form submission message display can be customized:

1. **Modify what's shown to users** - Edit the `watchForFormMessages()` function:
```javascript
// Extract different fields to display
const emailMatch = text.match(/<email>(.*?)<\/email>/);
const messageMatch = text.match(/<message>(.*?)<\/message>/);

// Display both email and message
visibleSpan.textContent = `${emailMatch[1]}: ${messageMatch[1]}`;
```

2. **Style the displayed message**:
```css
.watson-visible-message {
    font-weight: bold;
    color: #00b795;
    /* Add more styles */
}
```

## API Reference

### Public Functions

The addon exposes debugging functions through `window.watsonChatDebug`:

```javascript
// Show the intake form manually
watsonChatDebug.showForm();

// Reset form state and show it again
watsonChatDebug.resetForm();

// Check current status of the form system
watsonChatDebug.checkStatus();
// Returns object with:
// - formSubmitted: boolean
// - chatInitialized: boolean
// - sessionStorage: string
// - intakeFormExists: boolean
// - intakeFormVisible: string
// - contactFormExists: boolean
// - contactFormVisible: string
// - originalFormVisible: string
// - messageInputExists: boolean
// - sendButtonExists: boolean
```

### Internal Functions Reference

Key functions that developers may need to modify:

1. **`createIntakeForm()`** - Returns HTML string for the intake form
2. **`showIntakeForm()`** - Displays the form and hides regular chat input
3. **`handleFormSubmit(e)`** - Processes form submission and sends to LLM
4. **`sendFormattedMessage(message)`** - Handles the actual message sending with multiple fallback methods
5. **`watchForFormMessages()`** - Monitors chat for form submissions and modifies display
6. **`watchForResetButton()`** - Detects and handles chat reset button clicks
7. **`initializeFormInteraction()`** - Main initialization function with duplicate prevention

### Events

The addon listens for:
- `DOMContentLoaded` - Initialize when page loads
- Click events - Dismiss popups
- Chat button clicks - Stop popup sequence
- Form submission - Processes and sends intake data
- Reset button clicks - Clears form state
- DOM mutations - Monitors for chat messages and form display

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers with ES6 support

### Required Features
- ES6 (const, let, arrow functions, template literals)
- MutationObserver API
- CSS3 animations and transitions

## Troubleshooting

### Common Issues

1. **Popups not appearing**
   - Check if `POPUP_DELAY` has elapsed
   - Verify widget container exists: `anything-llm-embed-chat-button-container`
   - Check browser console for errors

2. **Disclaimer not showing**
   - Ensure chat messages have expected class structure
   - Verify MutationObserver is initialized
   - Check timestamp format matches regex: `/^\d{1,2}:\d{2}\s*(AM|PM)$/`

3. **Cookie functionality not working**
   - Set `USE_COOKIE_LIMIT: true` in CONFIG
   - Check browser cookie settings
   - Verify cookie name: `watson_chat_popup_shown`

4. **Intake form not appearing**
   - Clear sessionStorage: `sessionStorage.removeItem('watson_form_submitted')`
   - Or clear all Watson-related storage: `sessionStorage.clear()`
   - Verify chat widget is fully loaded
   - Check for JavaScript errors in console
   - Ensure greeting text element exists with correct classes
   - The form automatically reappears when clicking "Reset Chat" in the widget

5. **Form submission not working**
   - Check if message input (`#message-input`) exists
   - Verify send button (`#send-message-button`) is present
   - Check console for JavaScript errors
   - Ensure form validation passes (required fields)
   - Look for "Watson Chat:" prefixed console logs for debugging info
   - Verify the chat widget is fully loaded before form submission

6. **Form appears but disappears immediately**
   - Check for duplicate initialization (see console logs)
   - Ensure only one instance of the script is running
   - Verify the form container and form element are both visible
   - Check `watsonChatDebug.checkStatus()` for visibility states

7. **Message display showing full data instead of just message**
   - Ensure `watchForFormMessages()` is running
   - Check that the message format matches the expected pattern
   - Verify the CSS classes are properly applied
   - Look for "Watson Chat: Form message display updated" in console

### Debug Mode

The code includes extensive console logging with "Watson Chat:" prefix:

```javascript
// Check form system status
watsonChatDebug.checkStatus();

// Common debug logs to look for:
"Watson Chat: Starting to watch for chat window"
"Watson Chat: Chat window detected as open"
"Watson Chat: Initializing form interaction"
"Watson Chat: Showing intake form"
"Watson Chat: Form submitted"
"Watson Chat: Message sent successfully"
"Watson Chat: Form message display updated"

// Enable additional logging by modifying the code:
console.log('Watson Chat: Custom debug message', variableToInspect);
```

### Form Submission Flow

Understanding the submission process for debugging:

1. **Form Submit** → `handleFormSubmit()` called
2. **Data Collection** → Form data extracted and formatted
3. **UI Switch** → Original form shown, intake form hidden
4. **Wait for Input** → Polls for message input availability
5. **Send Message** → Multiple methods attempted:
   - Native value setter for React compatibility
   - Form submission event
   - Button click event
   - Enter key simulation
6. **Display Update** → `watchForFormMessages()` modifies display

### Performance Considerations

- MutationObserver runs on every DOM change
- Fallback interval runs every second
- Consider reducing `MAX_POPUPS_PER_SESSION` for better performance
- Optimize `popupMessages` array size

## License

This code is proprietary to Watson Creative. All rights reserved.

## Recent Updates

### Version 2.0 (Current)
- Added custom intake form for lead capture
- Implemented intelligent message display (shows only message content to users)
- Added session-based form management with reset functionality
- Improved form submission handling with React compatibility
- Added comprehensive debugging tools via `watsonChatDebug`
- Enhanced error handling and fallback mechanisms
- Updated message format to use XML-style tags for better parsing

### Key Technical Improvements
- Prevented duplicate form initialization
- Added MutationObserver for dynamic content monitoring
- Implemented multiple submission methods for compatibility
- Added proper event handling for React-based chat widget
- Improved CSS isolation with specific class targeting

## Support

For support, contact: hello@watsoncreative.com
