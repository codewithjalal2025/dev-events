"use server";


import Booking from "@/database/booking.model";
import connectDB from "../mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    // Input validation
    if (!eventId || typeof eventId !== 'string' || !eventId.trim()) {
        return { success: false, message: 'Invalid event ID.' };
    }
    if (!slug || typeof slug !== 'string' || !slug.trim()) {
        return { success: false, message: 'Invalid event slug.' };
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return { success: false, message: 'Invalid email address.' };
    }
    try {
        await connectDB();
        await Booking.create({ eventId, slug, email });
        return { success: true };
    } catch (e) {
        console.error('Error creating booking:', e);
        return { success: false, message: 'Booking creation failed.' };
    }
}