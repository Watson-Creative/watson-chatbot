# Watson Creative Chatbot Addon

A sophisticated chatbot integration for Watson Creative that includes AnythingLLM chat widget with custom popup notifications, intake form, AI disclaimer functionality, intelligent message display formatting, and a custom close button.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Chat Widget Configuration](#chat-widget-configuration)
  - [AnythingLLM Widget Reference](#anythingllm-widget-reference)
  - [Popup Configuration](#popup-configuration)
  - [Popup Messages](#popup-messages)
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
- Custom close button in chat window

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
- Collects: First Name*, Last Name*, Title, Email*, Phone, Company, Message (*Required fields)
- Progressive form enablement:
  - Message field is disabled with strikethrough until required fields are filled
  - Submit button is disabled with strikethrough until required fields are filled
  - Visual indicators for required fields (asterisks and note)
- Professional styling with bottom-border design and Roboto Serif font
- Responsive layout:
  - Desktop: Three inputs per row (Name fields on row 1, Contact info on row 2)
  - Mobile: Single column layout for better usability
- Custom "Start Conversation" button with animated underline and arrow icon
- Form container styling with centered layout and bottom margin
- Automatically formats and sends data to chatbot
- Session-based tracking to show form only once
- Smooth transition to regular chat after submission
- Intelligent message display - shows only user message while preserving full data for LLM
- Automatic form state reset with "Reset Chat" button
- Robust form submission handling with multiple fallback methods

### 5. **Custom Close Button**
- Circular close button positioned in top-right corner of chat window
- Dark green background (#022822) with white X icon
- Hover effect for better user experience
- Triggers native "Close Chat" functionality to ensure proper cleanup
- Automatically appears when chat window opens
- Maintains chat bubble visibility for easy reopening
- High z-index to ensure visibility above all chat content

### 6. **Cookie Management**
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

4. **IMPORTANT: CSS Organization**
   - All CSS styles MUST be placed in the `<style>` tag within the HTML
   - Do NOT use JavaScript to inject styles dynamically
   - This ensures styles load immediately and are easier to maintain
   - Keep all form styles, animations, and responsive rules in the single `<style>` section

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

### AnythingLLM Widget Reference

The AnythingLLM embedded chat widget is the core component of this integration. Here's the complete reference for all available configuration options:

#### Script Tag Implementation
```html
<!--
REQUIRED data attributes:
  data-embed-id        // The unique id of your embed with its default settings
  data-base-api-url    // The URL of your anythingLLM instance backend
-->
<script
  data-embed-id="5fc05aaf-2f2c-4c84-87a3-367a4692c1ee"
  data-base-api-url="http://localhost:3001/api/embed"
  src="http://localhost:3000/embed/anythingllm-chat-widget.min.js"
></script>
```

#### LLM Override Options
- **`data-prompt`** — Override the chat window with a custom system prompt. This is not visible to the user. If undefined it will use the embeds attached workspace system prompt.
- **`data-model`** — Override the chat model used for responses. This must be a valid model string for your AnythingLLM LLM provider. If unset it will use the embeds attached workspace model selection or the system setting.
- **`data-temperature`** — Override the chat model temperature. This must be a valid value for your AnythingLLM LLM provider. If unset it will use the embeds attached workspace model temperature or the system setting.

#### Language & Localization
- **`data-language`** — Set the language for the chat interface. If not specified, it will default to English (en). [Supported languages](https://github.com/Mintplex-Labs/anythingllm-embed/main/src/locales/resources.js):
  - Arabic (ar), Danish (da), German (de), English (en), Spanish (es), Persian (fa), French (fr), Hebrew (he), Italian (it), Japanese (ja), Korean (ko), Dutch (nl), Portuguese BR (pt_BR), Russian (ru), Turkish (tr), Vietnamese (vn), Chinese (zh), Chinese TW (zh_TW)

#### Style Override Options
- **`data-chat-icon`** — The chat bubble icon show when chat is closed. Options: `plus`, `chatBubble`, `support`, `search2`, `search`, `magic`
- **`data-button-color`** — The chat bubble background color shown when chat is closed. Value must be hex color code.
- **`data-user-bg-color`** — The background color of the user chat bubbles when chatting. Value must be hex color code.
- **`data-assistant-bg-color`** — The background color of the assistant response chat bubbles when chatting. Value must be hex color code.
- **`data-brand-image-url`** — URL to image that will be show at the top of the chat when chat is open.
- **`data-greeting`** — Default text message to be shown when chat is opened and no previous message history is found.
- **`data-no-sponsor`** — Setting this attribute to anything will hide the custom or default sponsor at the bottom of an open chat window.
- **`data-no-header`** — Setting this attribute hides the header above the chat window.
- **`data-sponsor-link`** — A clickable link in the sponsor section in the footer of an open chat window.
- **`data-sponsor-text`** — The text displays in sponsor text in the footer of an open chat window.
- **`data-position`** — Adjust the positioning of the embed chat widget and open chat button. Default `bottom-right`. Options: `bottom-right`, `bottom-left`, `top-right`, `top-left`
- **`data-assistant-name`** — Set the chat assistant name that appears above each chat message. Default `AnythingLLM Chat Assistant`
- **`data-assistant-icon`** — Set the icon of the chat assistant.
- **`data-window-height`** — Set the chat window height. **must include CSS suffix:** `px`,`%`,`rem`
- **`data-window-width`** — Set the chat window width. **must include CSS suffix:** `px`,`%`,`rem`
- **`data-text-size`** — Set the text size of the chats in pixels.
- **`data-username`** — A specific readable name or identifier for the client for your reference. Will be shown in AnythingLLM chat logs. If empty it will not be reported.
- **`data-default-messages`** — A string of comma-separated messages you want to display to the user when the chat widget has no history. Example: `"How are you?, What is so interesting about this project?, Tell me a joke."`
- **`data-send-message-text`** — Override the placeholder text in the message input field.
- **`data-reset-chat-text`** — Override the text shown on the reset chat button.

#### Behavior Override Options
- **`data-open-on-load`** — Once loaded, open the chat as default. It can still be closed by the user. To enable set this attribute to `on`. All other values will be ignored.
- **`data-show-thoughts`** — Allow users to see the AI's thought process, if applicable, in responses. If set to "false", users will only see a static "Thinking" indication without the explicit thought content. If "true" the user will see the full thought content as well as the real response. Defaults to "false".
- **`data-support-email`** — Shows a support email that the user can used to draft an email via the "three dot" menu in the top right. Option will not appear if it is not set.

#### Security Considerations
- Users will _not_ be able to view or read context snippets like they can in the core AnythingLLM application
- Users are assigned a random session ID that they use to persist a chat session
- **Recommended**: You can limit both the number of chats an embedding can process **and** per-session
- By using the AnythingLLM embedded chat widget you are responsible for securing and configuration of the embed as to not allow excessive chat model abuse of your instance

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
- All styles consolidated in a single `<style>` tag for better organization
- Global font smoothing and color settings
- Chat popup positioning and animations
- Z-index management for proper layering
- Responsive design with mobile-first considerations
- Form styling:
  - Custom `.watson-form-input` class with bottom-border design
  - Roboto Serif font at 1.125rem
  - Professional text shadow effect
  - Green (#00b795) focus state for valid required fields
  - Responsive `.watson-form-row` containers
  - Disabled state styling for message field and submit button
  - Strikethrough effect for disabled elements
- Button styling:
  - `.allm-start-conversation-button` with transparent background
  - Animated underline on hover (only when enabled)
  - Arrow icon that slides on hover
  - Left-aligned design with fixed 300px width
  - Disabled state with strikethrough and reduced opacity
- Form container:
  - Centered layout with auto margins
  - Bottom margin of 120px
  - 10% padding on sides with calculated width
- Close button styling:
  - `.watson-close-button` class with circular design
  - Dark green background (#022822) matching brand colors
  - White X created with CSS pseudo-elements
  - Positioned absolutely at top: 10px, right: 10px
  - Z-index of 100000001 to ensure visibility

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
- **Form Validation**: `checkRequiredFields()` monitors required fields and enables/disables elements
- **Form Submission**: `handleFormSubmit()` processes and formats data
- **Message Formatting**: Sends data as `<first_name>VALUE</first_name>|<last_name>VALUE</last_name>|<title>VALUE</title>|<email>VALUE</email>|<phone>VALUE</phone>|<company>VALUE</company>|<message>VALUE</message>`
- **Session Management**: Uses sessionStorage to track form submission
- **Message Display**: `watchForFormMessages()` extracts and displays only message content
- **Reset Handling**: `handleResetClick()` clears form state when chat is reset
- **Initialization**: `initializeFormInteraction()` prevents duplicate initialization

### 5. **Close Button Script**
- **Button Creation**: `createCloseButton()` generates the button element with accessibility attributes
- **Close Functionality**: `closeChat()` finds and clicks the native "Close Chat" button
- **Button Management**: `addCloseButton()` adds the button to the chat window
- **DOM Monitoring**: `watchForChatWindow()` uses MutationObserver to detect chat window
- **Automatic Addition**: Button appears automatically when chat opens
- **State Cleanup**: Resets button reference when chat window is removed

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

### Customizing the Chat Icon Color

The chat bubble icon color can be customized using CSS. Add the following to force a specific color:

```css
/* Force chat icon color */
#anything-llm-embed-chat-button svg,
#anything-llm-embed-chat-button svg path,
#anything-llm-embed-chat-button svg * {
    fill: #f5fcfb !important;
    stroke: #f5fcfb !important;
}
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

### Customizing the Close Button

The close button appearance can be modified by updating the CSS:

```css
.watson-close-button {
    background-color: #022822;  /* Change button color */
    width: 20px;               /* Adjust size */
    height: 20px;
    right: 10px;               /* Adjust position */
    top: 10px;
}

.watson-close-button::before,
.watson-close-button::after {
    background-color: #f5fcfb;  /* Change X color */
    width: 15px;               /* Adjust X size */
    height: 2px;               /* Adjust X thickness */
}
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
const formattedMessage = `<first_name>${firstName}</first_name>|<last_name>${lastName}</last_name>|<title>${title}</title>|<email>${email}</email>|<phone>${phone}</phone>|<company>${company}</company>|<custom_field>${customField}</custom_field>|<message>${message}</message>`;
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
3. **`checkRequiredFields()`** - Validates required fields and enables/disables form elements
4. **`handleFormSubmit(e)`** - Processes form submission and sends to LLM
5. **`sendFormattedMessage(message)`** - Handles the actual message sending with multiple fallback methods
6. **`watchForFormMessages()`** - Monitors chat for form submissions and modifies display
7. **`watchForResetButton()`** - Detects and handles chat reset button clicks
8. **`initializeFormInteraction()`** - Main initialization function with duplicate prevention

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

8. **Close button not appearing**
   - Check if chat window ID is `anything-llm-chat`
   - Verify the button is being created (check for "Watson Chat: Close button added" in console)
   - Ensure CSS z-index is high enough (should be 100000001)
   - Check if MutationObserver is detecting chat window

9. **Close button not functioning properly**
   - Verify the native "Close Chat" button selector hasn't changed
   - Check console for "Watson Chat: Triggered native close button" message
   - Ensure the button maintains chat bubble visibility (same as native close)
   - Test that chat can be reopened after using custom close button

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

## AnythingLLM Development Notes

### Local Development Setup
If you need to modify the AnythingLLM widget itself:

1. Clone the AnythingLLM embed repository
2. Navigate to the embed directory: `cd anythingllm-embed-main`
3. Install dependencies: `yarn`
4. Start development server: `yarn dev`
5. Build for production: `yarn build`

The built widget will be available at `anythingllm-chat-widget.min.js`.

### Widget File Structure
- `src/App.jsx` - Main application component
- `src/components/ChatWindow/` - Chat interface components
- `src/hooks/` - Custom React hooks for chat functionality
- `src/models/chatService.js` - API communication logic
- `src/locales/` - Internationalization files

### Important Files for Customization
- `src/components/ChatWindow/Header/index.jsx` - Chat header customization
- `src/components/ChatWindow/ChatContainer/PromptInput/index.jsx` - Input field behavior
- `src/components/OpenButton/index.jsx` - Chat bubble button
- `src/index.css` - Global styles

## License

This code is proprietary to Watson Creative. All rights reserved.

## Recent Updates

### Version 2.3 (Current)
- **Custom Close Button Addition**:
  - Added custom close button to top-right corner of chat window
  - Implemented circular design with dark green background (#022822)
  - Created white X icon using CSS pseudo-elements
  - Integrated with native "Close Chat" functionality for consistent behavior
  - Added automatic button appearance when chat opens
  - Implemented proper state management and cleanup
  - Ensured chat bubble remains visible after closing (matching native behavior)

### Version 2.2
- **Progressive Form Validation Updates**:
  - Implemented required field validation for First Name, Last Name, and Email
  - Added progressive form enablement - message field and submit button disabled until required fields are filled
  - Added strikethrough effect for disabled elements
  - Enhanced visual feedback with asterisks for required fields
  - Added explanatory note: "* Required fields must be filled before starting a conversation"
  - Updated form container styling with centered layout and proper spacing

### Version 2.1
- **Form Enhancement Updates**:
  - Added Title field to the intake form
  - Redesigned form layout with responsive rows
  - Implemented professional bottom-border input styling
  - Added custom "Start Conversation" button with animated underline
  - Integrated Watson Creative arrow icon with hover animation
  - **IMPORTANT**: Consolidated all CSS into single `<style>` tag (removed JavaScript style injection)

### Version 2.0
- Added custom intake form for lead capture
- Implemented intelligent message display (shows only message content to users)
- Added session-based form management with reset functionality
- Improved form submission handling with React compatibility
- Added comprehensive debugging tools via `watsonChatDebug`
- Enhanced error handling and fallback mechanisms
- Updated message format to use XML-style tags for better parsing

### Key Technical Improvements
- CSS organization: All styles now in single location for better maintainability
- Responsive design with mobile-first approach
- Professional form styling with Roboto Serif font
- Prevented duplicate form initialization
- Added MutationObserver for dynamic content monitoring
- Implemented multiple submission methods for compatibility
- Added proper event handling for React-based chat widget
- Improved CSS isolation with specific class targeting

## Support

For support, contact: hello@watsoncreative.com
