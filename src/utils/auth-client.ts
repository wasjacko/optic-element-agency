
// Client for Auth (Simulated for Demo)

export async function requestAuthCode(email: string): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await fetch('/api/auth/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        return data; // { success: true/false, message: "..." }
    } catch (e) {
        return { success: false, message: "Network error" };
    }
}

export async function verifyAuthCode(email: string, code: string): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
        const res = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        const data = await res.json();
        return data; // { success: true, token: "...", message: "..." }
    } catch (e) {
        return { success: false, message: "Network error" };
    }
}
