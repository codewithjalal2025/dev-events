'use client';

import { PostHogProvider } from 'posthog-js/react';
import posthog from '../lib/posthog';
import PostHogPageView from './posthog-pageview';
import { Suspense } from 'react';
import PostHogIdentify from '@/lib/posthog-identify';
// import PostHogIdentify from '@/lib/posthog-identify';


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      {/*
        If you want to anonymize users, keep user={null} below.
        Otherwise, replace null with the authenticated user from your auth/session provider, e.g.:
        <PostHogIdentify user={user} />
        where user is obtained from your auth context or session hook.
      */}
      <Suspense>
        <PostHogIdentify user={null} /> {/* Pass real user here if available */}
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
