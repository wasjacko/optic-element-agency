
const API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001/api";

export interface Booking {
    id: string;
    createdAt: string;
    start: string;
    end: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    name: string;
    email: string;
    phone: string;
    notes?: string;
}

export async function createBooking(data: any): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.status === 201) return { success: true };

        const json = await res.json();
        return { success: false, message: json.error || "Booking failed" };

    } catch (e) {
        console.error("Booking Client Error:", e);
        return { success: false, message: "Connection Error" };
    }
}

export async function getAdminBookings(): Promise<Booking[]> {
    try {
        const res = await fetch(`${API_URL}/admin/bookings`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return await res.json();
    } catch (e) {
        console.error("Booking Client Error:", e);
        return [];
    }
}

export async function updateBookingStatus(id: string, status: 'CONFIRMED' | 'CANCELLED'): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (res.ok) return { success: true };
        const data = await res.json();
        return { success: false, message: data.error || "Update failed" };

    } catch (e) {
        console.error("Booking Client Error:", e);
        return { success: false, message: "Connection Error" };
    }
}
