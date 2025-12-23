import { FileText, FileArchive, TrendingDown, Zap } from 'lucide-react';
import type { CompressionResult } from '@/lib/huffman';

interface CompressionMetricsProps {
  result: CompressionResult;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function CompressionMetrics({ result }: CompressionMetricsProps) {
  const isExpanded = result.compressionRatio < 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {/* Original Size */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-muted">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <p className="metric-value text-foreground">{formatBytes(result.originalSize)}</p>
        <p className="metric-label mt-2">Original Size</p>
      </div>

      {/* Compressed Size */}
      <div className="glass-card-success p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-success/10">
            <FileArchive className="w-5 h-5 text-success" />
          </div>
        </div>
        <p className="metric-value text-success">{formatBytes(result.compressedSize)}</p>
        <p className="metric-label mt-2">Compressed Size</p>
      </div>

      {/* Compression Ratio */}
      <div className={isExpanded ? 'glass-card p-6' : 'glass-card-success p-6'}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${isExpanded ? 'bg-warning/10' : 'bg-success/10'}`}>
            <TrendingDown className={`w-5 h-5 ${isExpanded ? 'text-warning' : 'text-success'}`} />
          </div>
        </div>
        <p className={`metric-value ${isExpanded ? 'text-warning' : 'text-success'}`}>
          {result.compressionRatio.toFixed(1)}%
        </p>
        <p className="metric-label mt-2">{isExpanded ? 'Size Increase' : 'Space Saved'}</p>
      </div>

      {/* Unique Characters */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="metric-value text-primary">{Object.keys(result.frequencyMap).length}</p>
        <p className="metric-label mt-2">Unique Chars</p>
      </div>
    </div>
  );
}
