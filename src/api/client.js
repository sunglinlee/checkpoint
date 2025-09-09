const isDev = import.meta.env.DEV;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDev ? '/api' : 'https://checkpoint-backend-357565914560.asia-east1.run.app');

function buildHeaders(customHeaders = {}, { includeJsonContentType } = { includeJsonContentType: true }) {
    const defaultHeaders = includeJsonContentType ? { 'Content-Type': 'application/json' } : {};
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
    if (token) {
        return { ...defaultHeaders, Authorization: `Bearer ${token}`, ...customHeaders };
    }
    return { ...defaultHeaders, ...customHeaders };
}

export async function apiRequest(path, options = {}) {
    const { method = 'GET', headers = {}, body } = options;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const computedHeaders = buildHeaders(headers, { includeJsonContentType: !isFormData });
    const finalBody = body
        ? (typeof body === 'string' || isFormData ? body : JSON.stringify(body))
        : undefined;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: computedHeaders,
        body: finalBody,
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


