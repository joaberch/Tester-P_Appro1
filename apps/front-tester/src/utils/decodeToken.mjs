export const decodeToken = (token) => {
    const parts = token.split('.');
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
}