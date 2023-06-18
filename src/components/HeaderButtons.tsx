import { BrainCog, Cog, Download } from 'lucide-react';
import IconButton from './IconButton';

export default function HeaderButtons() {
  return (
    <div className="fixed right-4 top-4 flex gap-2">
      <IconButton tooltip="Export document (.md)">
        <Download size={18} />
      </IconButton>

      <IconButton tooltip="Settings">
        <Cog size={18} />
      </IconButton>
    </div>
  );
}
