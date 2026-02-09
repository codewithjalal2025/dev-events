'use client';

import { PostHogProvider } from 'posthog-js/react';
import posthog from '../lib/posthog';
import PostHogPageView from './posthog-pageview';


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
}
