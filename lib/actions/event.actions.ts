"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {

    try {
        await connectDB();

        const event = await Event.findOne({ slug });
        if (!event || !event._id || !Array.isArray(event.tags) || event.tags.length === 0) {
            return [];
        }
        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();

       
        
    } catch  {
        return [];
    }

}