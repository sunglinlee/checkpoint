const isDev = import.meta.env.DEV;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDev ? '/api' : 'https://checkpoint-backend-357565914560.asia-east1.run.app');

function buildHeaders(customHeaders = {}) {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
    if (token) {
        return { ...defaultHeaders, Authorization: `Bearer ${token}`, ...customHeaders };
    }
    return { ...defaultHeaders, ...customHeaders };
}

export async function apiRequest(path, options = {}) {
    const { method = 'GET', headers = {}, body } = options;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: buildHeaders(headers),
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
        credentials: 'omit'
    });

    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const errorMessage = (data && (data.message || data.error)) || `HTTP ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}


