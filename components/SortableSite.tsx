'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Site } from '@/types';
import { useAuth } from '@/components/state/AuthContext';

interface SortableSiteProps {
  site: Site;
  children: React.ReactNode;
}

export function SortableSite({ site, children }: SortableSiteProps) {
  const { user } = useAuth();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: site.id,
    data: {
      type: 'site',
      site,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(user?.role !== 'viewer' ? listeners : {})}>
      {children}
    </div>
  );
}
