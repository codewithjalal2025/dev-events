'use client';

import { useEffect } from 'react';
import posthog from './posthog';

type User = {
  id: string;
  email?: string;
  name?: string;
};

export default function PostHogIdentify({ user }: { user: User | null }) {
  useEffect(() => {
    if (!user) {
      posthog.reset();
      return;
    }

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
    });
  }, [user]);

  return null;
}
