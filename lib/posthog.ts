import posthog from 'posthog-js';

// Only initialize in browser
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30', // recommended settings
    capture_pageview: false, // we track manually for App Router
    capture_pageleave: true,
  });
}

export default posthog;
