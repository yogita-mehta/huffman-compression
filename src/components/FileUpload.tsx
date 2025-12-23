import { useCallback, useState } from 'react';
import { Upload, FileText, FileArchive, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  onCompressedFileSelect?: (data: ArrayBuffer, fileName: string) => void;
  acceptCompressed?: boolean;
  currentFile?: string | null;
  onClear?: () => void;
}

export function FileUpload({
  onFileSelect,
  onCompressedFileSelect,
  acceptCompressed = false,
  currentFile,
  onClear,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (acceptCompressed && file.name.endsWith('.huff')) {
        const buffer = await file.arrayBuffer();
        onCompressedFileSelect?.(buffer, file.name);
        return;
      }

      if (!file.name.endsWith('.txt') && !file.type.startsWith('text/')) {
        setError('Please upload a .txt file or .huff compressed file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileSelect(content, file.name);
      };
      reader.onerror = () => setError('Failed to read file');
      reader.readAsText(file);
    },
    [onFileSelect, onCompressedFileSelect, acceptCompressed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (currentFile) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              {currentFile.endsWith('.huff') ? (
                <FileArchive className="w-6 h-6 text-primary" />
              ) : (
                <FileText className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{currentFile}</p>
              <p className="text-sm text-muted-foreground">File loaded successfully</p>
            </div>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn('upload-zone cursor-pointer', isDragging && 'upload-zone-active')}
    >
      <input
        type="file"
        accept={acceptCompressed ? '.txt,.huff,text/*' : '.txt,text/*'}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'p-4 rounded-full transition-all duration-300',
            isDragging ? 'bg-primary/20 scale-110' : 'bg-muted'
          )}
        >
          <Upload
            className={cn(
              'w-8 h-8 transition-colors',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">
            Drop your file here, or{' '}
            <span className="text-primary">browse</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {acceptCompressed
              ? 'Supports .txt files for compression and .huff files for decompression'
              : 'Supports .txt and plain text files'}
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-4 text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
