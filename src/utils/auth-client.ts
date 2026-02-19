
// Client for Auth (Simulated for Demo)

export async function requestAuthCode(email: string): Promise<{ success: boolean; message?: string }> {
    // SIMULATION: Always success, no backend call needed for this specific request
    console.log(`[Mock Auth] Code requested for ${email}. Use code: 123456`);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));

    return { success: true, message: "Code sent to email." };
}

export async function verifyAuthCode(email: string, code: string): Promise<{ success: boolean; token?: string; message?: string }> {
    // SIMULATION: Check hardcoded code
    await new Promise(r => setTimeout(r, 1000)); // Fake network delay

    if (code === '123456') {
        return { success: true, token: "simulated_admin_token_" + Date.now() };
    }

    return { success: false, message: "Invalid Code" };
}
