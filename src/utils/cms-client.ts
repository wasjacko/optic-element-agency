const API_URL = "/api";

export async function getCMSContent(): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/cms/content?t=${Date.now()}`);
        if (!res.ok) throw new Error("Failed to fetch content");
        return await res.json();
    } catch (e) {
        console.warn("CMS unavailable, using local content fallback");
        return null;
    }
}

export async function saveCMSContent(content: any): Promise<{ success: boolean; message?: string }> {
    try {
        const token = sessionStorage.getItem('oe_admin_session');
        const res = await fetch(`${API_URL}/cms/content`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(content)
        });

        if (res.ok) return { success: true, message: "Content Saved" };
        else return { success: false, message: "Failed to save" };

    } catch (e) {
        console.error("CMS Client Error:", e);
        return { success: false, message: "Connection Error" };
    }
}
