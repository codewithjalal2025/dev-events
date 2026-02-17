import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";

import Image from "next/image";
import { notFound } from "next/navigation";


const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>

    <ul>
      {agendaItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

  </div>
);

const EventDetailsItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex flex-row gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, idx) => (
      <div className="pill" key={`${tag}-${idx}`}>{tag}</div>
    ))}
  </div>
);


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

function parseJsonSafely<T>(jsonString: string | undefined, fallback: T): T {
  try {
    if (!jsonString) return fallback;
    return JSON.parse(jsonString) as T;
  } catch (e) {
    return fallback;
  }
}

const NotFoundUI = ({ message = 'Event not found' }: { message?: string }) => (
  <section id="event">
    <div className="header">
      <h1>{message}</h1>
      <p>Please check the events list or try again later.</p>
    </div>
  </section>
);

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  if (!BASE_URL) {
    console.error('Missing NEXT_PUBLIC_BASE_URL');
    throw new Error('Missing NEXT_PUBLIC_BASE_URL');
  }

  let json: any;
  try {
   
    const request = await fetch(`${BASE_URL}/api/event/${slug}`);
  
    if (!request.ok) {
      // If the event isn't found, render a friendly not-found UI without throwing
      if (request.status === 404) return NotFoundUI({ message: 'Event not found' });
      // Log unexpected non-OK statuses for debugging and show fallback UI
      console.error('Failed to fetch event', request.status, request.statusText);
      return NotFoundUI({ message: 'Unable to load event' });
    }
    json = await request.json();
  } catch (err) {
    console.error('Error fetching event:', err);
    return notFound();
  }

  const event = json?.event;
  const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event || {};

  if (!description) return NotFoundUI({ message: 'Event data incomplete' });


  const bookings=10;

  const similarEvents:IEvent[]= await  getSimilarEventsBySlug(slug);




  
  return (
    
    <section id="event">
      <div className="header">

        <h1>Event Description</h1>
        <p className="">{description}</p>
      </div>

      <div className="details">

        {/* left side -Event content */}

        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner mt-2 rounded-lg"
          />

          <section className="flex-col-gap-2">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p>{overview}</p>
          </section>

          <section className=" flex-col-gap-2">
            <h2 className="text-2xl font-semibold">Event Details</h2>

            <EventDetailsItem icon="/icons/calendar.svg" alt="Calendar" label={date} />
            <EventDetailsItem icon="/icons/clock.svg" alt="Clock" label={time} />
            <EventDetailsItem icon="/icons/pin.svg" alt="Pin" label={location} />
            <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={audience} />
            
          </section>

             <EventAgenda agendaItems={parseJsonSafely<string[]>(agenda?.[0], [])} />

             <section className="flex-col-gap-2">

              <h2 className="text-2xl font-semibold">About the Organizer</h2>
              <p>{organizer}</p>
             </section>

             <EventTags tags={parseJsonSafely<string[]>(tags?.[0], [])} />

        </div>


        {/* Right side Booking form */}

        <aside className="booking">
          
          <div className="signup-card">
            <h2>Book your spot</h2>
            {
              bookings > 0 ? (
                <p className="text-sm">
                  Join {bookings} people who have already booked  their sport
                </p>
              ): (
                <p className="text-sm">
                  Be the first one to book your spot for this event
                </p>
              )
            }
         <BookEvent/>
          </div>


        </aside>


      </div>

      <div className="flex w-full flex-col gap-4 pt-20">

        <h2>Similar Events</h2>

        <div className="events">
          {
            similarEvents.length > 0 &&
              similarEvents.map((similarEvent: IEvent) => (
                <EventCard key={similarEvent.title || similarEvent.slug} {...similarEvent} />
              ))
            
          }

        </div>
      </div>


    </section>
  )
}

export default EventDetailsPage