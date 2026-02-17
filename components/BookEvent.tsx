'use client';
import { createBooking } from "@/lib/actions/booking.actions";
import posthog, { PostHog } from "posthog-js";
import { useState } from "react";



const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      try {
        const result = await createBooking({ eventId, slug, email });
        if (result.success) {
          setSubmitted(true);
          posthog.capture('event_booked', { eventId, slug }); // Remove email from analytics
        } else {
          setError(result?.message || 'Booking failed. Please try again.');
          console.error('Booking failed', result || 'Unknown error');
          posthog.captureException(new Error("booking creation failed"));
        }
      } catch (err) {
        setError('Booking failed. Please try again.');
        console.error('Booking failed', err);
        posthog.captureException(err instanceof Error ? err : new Error('booking creation failed'));
      }
    }

    return (
      <div id="book-event">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {
          submitted? (
            <p className="text-sm">Thank you for signing up!</p>
          ):(
           <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email Address</label>
              <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               id="email"
               placeholder="Enter your email address" 
               />
            </div>
            <button type="submit" className="button-submit">Submit</button>
               </form>
          )
        }
      </div>
    )
}

export default BookEvent