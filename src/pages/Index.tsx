import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { CompressionMetrics } from '@/components/CompressionMetrics';
import { HuffmanTreeVisualization } from '@/components/HuffmanTreeVisualization';
import { CodeTable } from '@/components/CodeTable';
import {
  compress,
  decompress,
  buildHuffmanTree,
  createCompressedFile,
  parseCompressedFile,
  type CompressionResult,
} from '@/lib/huffman';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, Binary, Cpu, TreeDeciduous, FileCode } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [decompressedText, setDecompressedText] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'compressed' | 'decompressed'>('idle');

  const handleFileSelect = useCallback((content: string, name: string) => {
    setOriginalText(content);
    setFileName(name);
    setDecompressedText(null);

    if (content.length === 0) {
      toast.error('File is empty');
      return;
    }

    const result = compress(content);
    setCompressionResult(result);
    setMode('compressed');
    toast.success('File compressed successfully!');
  }, []);

  const handleCompressedFileSelect = useCallback(
    (data: ArrayBuffer, name: string) => {
      const parsed = parseCompressedFile(data);
      if (!parsed) {
        toast.error('Invalid compressed file format');
        return;
      }

      setFileName(name);
      setOriginalText(null);

      const tree = buildHuffmanTree(parsed.frequencyMap);
      const result = decompress(parsed.compressedData, tree, parsed.paddingBits);

      if (result.success) {
        setDecompressedText(result.decompressedText);
        setCompressionResult({
          compressedData: parsed.compressedData,
          codeMap: parsed.codeMap,
          originalSize: new TextEncoder().encode(result.decompressedText).length,
          compressedSize: parsed.compressedData.length,
          compressionRatio:
            ((new TextEncoder().encode(result.decompressedText).length -
              parsed.compressedData.length) /
              new TextEncoder().encode(result.decompressedText).length) *
            100,
          tree,
          frequencyMap: parsed.frequencyMap,
          paddingBits: parsed.paddingBits,
        });
        setMode('decompressed');
        toast.success('File decompressed successfully!');
      } else {
        toast.error('Decompression failed');
      }
    },
    []
  );

  const handleDownload = useCallback(() => {
    if (!compressionResult) return;

    const blob = createCompressedFile(compressionResult);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName?.replace('.txt', '.huff') || 'compressed.huff';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Compressed file downloaded!');
  }, [compressionResult, fileName]);

  const handleDownloadDecompressed = useCallback(() => {
    if (!decompressedText) return;

    const blob = new Blob([decompressedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName?.replace('.huff', '_decompressed.txt') || 'decompressed.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Decompressed file downloaded!');
  }, [decompressedText, fileName]);

  const handleReset = useCallback(() => {
    setFileName(null);
    setOriginalText(null);
    setCompressionResult(null);
    setDecompressedText(null);
    setMode('idle');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Binary className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Huffman Compressor</h1>
                <p className="text-sm text-muted-foreground">Lossless File Compression</p>
              </div>
            </div>
            {mode !== 'idle' && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {mode === 'idle' ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl font-bold gradient-text">
                Huffman Coding Algorithm
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A greedy algorithm that constructs an optimal prefix-free binary code
                based on character frequencies. Demonstrates trees, heaps, and bit manipulation.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Min-Heap Priority Queue</h3>
                <p className="text-sm text-muted-foreground">
                  Efficient O(n log n) tree construction
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-success/10 mb-4">
                  <TreeDeciduous className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Binary Tree Visualization</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive Huffman tree explorer
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-warning/10 mb-4">
                  <FileCode className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Bit-Packed Output</h3>
                <p className="text-sm text-muted-foreground">
                  Realistic byte-level compression
                </p>
              </div>
            </div>

            {/* Upload Zone */}
            <FileUpload
              onFileSelect={handleFileSelect}
              onCompressedFileSelect={handleCompressedFileSelect}
              acceptCompressed
              currentFile={fileName}
              onClear={handleReset}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* File Info & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                onCompressedFileSelect={handleCompressedFileSelect}
                acceptCompressed
                currentFile={fileName}
                onClear={handleReset}
              />
              <div className="flex gap-3">
                {mode === 'compressed' && (
                  <Button variant="success" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Download .huff
                  </Button>
                )}
                {mode === 'decompressed' && (
                  <Button variant="success" onClick={handleDownloadDecompressed}>
                    <Download className="w-4 h-4" />
                    Download .txt
                  </Button>
                )}
              </div>
            </div>

            {/* Metrics */}
            {compressionResult && <CompressionMetrics result={compressionResult} />}

            {/* Tree & Code Table */}
            <div className="grid lg:grid-cols-2 gap-8">
              <HuffmanTreeVisualization tree={compressionResult?.tree || null} />
              {compressionResult && (
                <CodeTable
                  codeMap={compressionResult.codeMap}
                  frequencyMap={compressionResult.frequencyMap}
                />
              )}
            </div>

            {/* Preview */}
            {(originalText || decompressedText) && (
              <div className="glass-card overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-foreground">
                    {mode === 'decompressed' ? 'Decompressed Content' : 'Original Content'}
                  </h3>
                </div>
                <div className="p-4 max-h-64 overflow-auto">
                  <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap break-all">
                    {(decompressedText || originalText)?.slice(0, 2000)}
                    {(decompressedText || originalText)?.length! > 2000 && (
                      <span className="text-primary">
                        {'\n\n'}... ({(decompressedText || originalText)?.length! - 2000} more
                        characters)
                      </span>
                    )}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with React & TypeScript • Huffman Coding Algorithm Implementation
          </p>
        </div>
      </footer>
    </div>
  );
}
