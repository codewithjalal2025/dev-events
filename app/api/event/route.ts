import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Whitelist and validate expected fields to avoid mass-assignment
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const overview = String(formData.get('overview') ?? '').trim();
    const venue = String(formData.get('venue') ?? '').trim();
    const location = String(formData.get('location') ?? '').trim();
    const date = String(formData.get('date') ?? '').trim();
    const time = String(formData.get('time') ?? '').trim();
    const mode = String(formData.get('mode') ?? '').trim();
    const audience = String(formData.get('audience') ?? '').trim();
    const organizer = String(formData.get('organizer') ?? '').trim();

    // tags and agenda may be submitted as JSON strings or comma-separated lists
    const rawTags = formData.get('tags');
    const rawAgenda = formData.get('agenda');

    const parseList = (val: FormDataEntryValue | null) => {
      if (!val) return [] as string[];
      if (typeof val === 'string') {
        try {
          const p = JSON.parse(val);
          if (Array.isArray(p)) return p.map(String);
        } catch (_) {
          return val.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      return [] as string[];
    };

    // const tags = parseList(rawTags);
    // const agenda = parseList(rawAgenda);

    // Basic validation
    if (!title || !description || !overview) {
      return NextResponse.json({ message: 'Missing required fields (title, description, overview)' }, { status: 400 });
    }

    // Validate image file before streaming/uploading
    const file = formData.get('image') as File | null;
    if (!file) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const allowedMime = ['image/png', 'image/jpeg', 'image/webp'];
    if (!file.type || !allowedMime.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid image type' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ message: 'Image too large (max 5MB)' }, { status: 400 });
    }

    // Use the safe parseList helper for tags and agenda
    let tags = parseList(formData.get('tags'));
    let agenda = parseList(formData.get('agenda'));

    // Now allocate buffer and stream to cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Typed Promise for Cloudinary upload stream
    const uploadResult: UploadApiResponse | undefined = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'events' }, (error, results) => {
        if (error) {
          console.error('Cloudinary upload error', error);
          return reject(error);
        }
        // Cast to UploadApiResponse if available
        resolve(results as UploadApiResponse | undefined);
      }).end(buffer);
    }).catch((err) => {
      // Ensure we surface debug logs server-side, but return a generic error to clients
      console.error('Cloudinary upload promise rejected', err);
      return undefined;
    });

    const secureUrl = uploadResult?.secure_url;
    if (!secureUrl) {
      console.error('Cloudinary upload missing secure_url', uploadResult);
      return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
    }

    const image = secureUrl;

    const createObj = {
      title,
      description,
      overview,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      organizer,
      tags,
      agenda,
      image,
    } as any;

    // const createdEvent = await Event.create({
    //   ...event,
    //   tags:tags,
    //   agenda:agenda,

    // });

    const createdEvent = await Event.create(createObj);

    return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });

  } catch (e) {
    // Log full error server-side and respond with a generic message to avoid leaking internals
    console.error('Error in POST /api/event:', e);
    return NextResponse.json({ message: 'Event creation failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Diagnostic: check whether the MONGODB_URI env var is available (do not log the value)
    console.log('GET /api/event - MONGODB_URI present:', !!process.env.MONGODB_URI);

    const mongoose = await connectDB();
    // Log connection readyState: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    // Avoid logging sensitive info
    // @ts-ignore
    console.log('GET /api/event - mongoose connection state:', mongoose?.connection?.readyState);

    const events = await Event.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });

    // Log how many events returned (server-side) for debugging
    // console.log('GET /api/event - returned events count:', Array.isArray(events) ? events.length : 0);

  } catch (e) {
    // Normalize GET errors to match POST handler: log server-side, return generic message
    console.error('Error in GET /api/event:', e);
    return NextResponse.json({ message: 'Event fetch failed' }, { status: 500 });
  }
}

// a route that accepts a slug as input -> return the event details for that slug
