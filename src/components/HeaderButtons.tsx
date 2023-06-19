'use client';

import { Cog, Download } from 'lucide-react';
import Button from './Button';

interface Props {
  complete: () => void;
  exportMD: () => void;
  isMobile: boolean;
  isLoading: boolean;
}

export default function HeaderButtons({ isMobile, complete, isLoading, exportMD }: Props) {
  return (
    <div className="fixed right-4 top-4 flex gap-2">
      {isMobile && (
        <Button variant="primary" disabled={isLoading} className="px-2.5 py-0.5" onClick={() => complete()}>
          <span className="text-sm font-medium">Generate text</span>
        </Button>
      )}

      <Button variant="subtle" tooltip="Export document (.md)" onClick={() => exportMD()}>
        <Download size={18} />
      </Button>

      <Button variant="subtle" tooltip="Settings" disabled>
        <Cog size={18} />
      </Button>
    </div>
  );
}
