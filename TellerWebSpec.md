# Teller Web Application - Technical Specification

## Project Overview
Teller Web is a secure banking operations portal built for bank tellers and administrators. It facilitates account management, transaction processing (deposits/withdrawals), and financial reporting.

### Tech Stack
- **Frontend**: React 19+, TypeScript
- **Build Tool**: Vite 6+
- **UI Framework**: Ant Design (antd)
- **State Management**: React Hooks
- **API Client**: Axios
- **Security Utilities**: DOMPurify, jwt-decode

---

## Core Architecture

### Directory Structure
- `/src/api`: Axios instance configuration and interceptors.
- `/src/services`: Data fetching and business logic layer.
- `/src/hooks`: Custom hooks for state management and API integration.
- `/src/components`: Reusable UI components (e.g., `SafeHtml`, `ProtectedRoute`).
- `/src/pages`: Application views (Login, Dashboard, Accounts, Transactions, Reports).
- `/src/types`: TypeScript interfaces and types.

### Design Pattern
The application follows a **Hooks-Service-Page** pattern:
1. **Services** handle the raw API calls.
2. **Hooks** manage loading states, error handling, and data transformation.
3. **Pages** focus on presentation and user interaction.

---

## Security Architecture

### 1. Token Management & Persistence
- **Storage Strategy**: 
    - **Access Token**: Stored in a private memory variable (`_accessToken`) within `authService.ts` to prevent XSS theft.
    - **Session Persistence**: A secure cookie (`teller_auth_token`) with attributes `SameSite=Strict` and `Secure` is used to maintain the session across page reloads.
- **Silent Refresh**:
    - The application calls `/auth/refresh` on initial load (`App.tsx`) to restore the in-memory token from the cookie.
    - Automatic logout occurs on 401 Unauthorized responses via Axios interceptors.

### 2. XSS (Cross-Site Scripting) Prevention
- **DOMPurify**: All dynamic/user-provided content (API error messages, transaction descriptions) is sanitized using `DOMPurify`.
- **SafeHtml Component**: A reusable component (`src/components/SafeHtml.tsx`) ensures consistent sanitization across the UI.
- **Strict Content Policy**: Avoids use of `dangerouslySetInnerHTML` without proper sanitization.

### 3. Clickjacking Protection
Implemented via HTTP Security Headers in `vite.config.ts` (and recommended for the Production Web Server):
- `Content-Security-Policy: frame-ancestors 'none';`
- `X-Frame-Options: DENY`

### 4. Session Security
- **Idle Timeout**: Automatically logs out users after a period of inactivity.
    - Configurable via `VITE_IDLE_TIMEOUT` (default: 15 mins).
    - Warning modal appears before logout via `VITE_WARNING_TIMEOUT` (default: 1 min).

---

## API Integration Detail

### Axios AxiosInstance
Located in `src/api/axiosInstance.ts`, it provides:
- **Request Interceptor**: Automatically attaches the Bearer token to all outgoing requests.
- **Response Interceptor**: Handles global error states (401, 403, 500) and displays user-friendly Modals for critical failures.

---

## Environment Configuration
The application uses `.env` files for environment-specific settings:
- `VITE_API_URL`: Backend API base URL.
- `VITE_IDLE_TIMEOUT`: Inactivity duration in milliseconds.
- `VITE_WARNING_TIMEOUT`: Warning duration in milliseconds.

---

## Future Recommendations
1. **HttpOnly Cookies**: Transition the refresh token/session cookie to `HttpOnly` (backend change) to remove all JavaScript access to authentication credentials.
2. **CSP Hardening**: Implement a more restrictive `script-src` and `connect-src` in the production environment.
3. **MFA Support**: Integrate Multi-Factor Authentication for high-privilege operations.
