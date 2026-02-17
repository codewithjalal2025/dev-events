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
      {/* <PostHogPageView /> */}

      <Suspense>
        <PostHogIdentify user={null} />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
