"use client";

// This component is deprecated - header is now in the layout
// Kept for backwards compatibility but renders nothing

interface TopbarProps {
  user: { name: string; email: string; role: string };
}

export function Topbar(_props: TopbarProps) {
  return null;
}
