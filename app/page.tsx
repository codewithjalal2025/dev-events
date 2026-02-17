import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { IEvent } from '@/database/event.model.js';
import { cacheLife } from 'next/cache';





const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

const Page = async () => {

  'use cache';
  cacheLife('hours')

  if (!BASE_URL) {
    console.error('Environment variable NEXT_PUBLIC_BASE_URL is not defined');
    // Fail fast on server render with clear message
    throw new Error('Missing NEXT_PUBLIC_BASE_URL environment variable');
  }

  let events: IEvent[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/event`);
    if (!response.ok) {
      console.error('Failed to fetch events', response.status, response.statusText);
    } else {
      const data = await response.json();
      events = Array.isArray(data?.events) ? data.events : [];
    }
  } catch (err) {
    console.error('Network error fetching events', err);
    events = [];
  }


  return (
    <section>
     
      <h1 className='text-center'>The Hub Every Dev <br/> Event You Can't Miss </h1>
      <p className="text-center mt-5">Hackathons , Meetups , and Conferances , All In One Place</p>

      <ExploreBtn/>

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className='events list-none'>
          {
            events && events.length > 0 && events.map((event:IEvent)=>(
              <li key={event.title}>
              <EventCard {...event}/>
             </li>
            ))
          }

        </ul>
      </div>

    </section>
  )
}

export default Page