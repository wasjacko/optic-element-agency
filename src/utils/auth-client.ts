const API_URL = "/api";

export async function requestAuthCode(email: string): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await fetch(`${API_URL}/auth/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        // Handle 429 (rate limit) and other server errors
        if (!res.ok && !data.success) {
            return { success: false, message: data.message || "Request failed." };
        }
        return data;
    } catch (e) {
        console.error("Auth Client Error:", e);
        return { success: false, message: "Connection error — server unreachable." };
    }
}

export async function verifyAuthCode(email: string, code: string): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
        const res = await fetch(`${API_URL}/auth/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        const data = await res.json();
        return data; // { success: true, token: "...", message: "..." }
    } catch (e) {
        console.error("Auth Client Error:", e);
        return { success: false, message: "Connection error — server unreachable." };
    }
}
