import React from 'react';
import Layout from '@/components/Layout';
import { AlertCircle } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description?: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-warning" />
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
          <p className="text-sm text-muted-foreground pt-4">
            This page is not yet implemented. Continue with additional prompts to build this feature.
          </p>
        </div>
      </div>
    </Layout>
  );
}
