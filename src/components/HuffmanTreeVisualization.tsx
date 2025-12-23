import { useEffect, useRef, useState } from 'react';
import type { HuffmanNode } from '@/lib/huffman';
import { getDisplayChar } from '@/lib/huffman';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

interface TreeVisualizationProps {
  tree: HuffmanNode | null;
}

interface NodePosition {
  x: number;
  y: number;
  node: HuffmanNode;
}

function calculatePositions(
  node: HuffmanNode | null,
  depth: number,
  xMin: number,
  xMax: number,
  positions: NodePosition[]
): void {
  if (!node) return;

  const x = (xMin + xMax) / 2;
  const y = depth * 80 + 50;

  positions.push({ x, y, node });

  if (node.left) {
    calculatePositions(node.left, depth + 1, xMin, x, positions);
  }
  if (node.right) {
    calculatePositions(node.right, depth + 1, x, xMax, positions);
  }
}

function getTreeDepth(node: HuffmanNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

export function HuffmanTreeVisualization({ tree }: TreeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const depth = getTreeDepth(tree);
  const baseWidth = Math.pow(2, depth) * 60;
  const width = Math.max(800, baseWidth);
  const height = depth * 80 + 100;

  const positions: NodePosition[] = [];
  if (tree) {
    calculatePositions(tree, 0, 0, width, positions);
  }

  useEffect(() => {
    // Reset zoom and offset when tree changes
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [tree]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!tree) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Upload a file to visualize its Huffman Tree</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-medium text-foreground">Huffman Tree</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Reset view"
          >
            <Move className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground ml-2 font-mono">
            {(zoom * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width={width}
          height={height}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          className="transition-transform duration-100"
        >
          {/* Draw edges first */}
          {positions.map(({ x, y, node }) => {
            const parentPos = positions.find(
              (p) => p.node.left === node || p.node.right === node
            );
            if (!parentPos) return null;

            const isLeft = parentPos.node.left === node;
            const midX = (parentPos.x + x) / 2;
            const midY = (parentPos.y + y) / 2;

            return (
              <g key={`edge-${node.id}`}>
                <line
                  x1={parentPos.x}
                  y1={parentPos.y + 20}
                  x2={x}
                  y2={y - 20}
                  className="stroke-muted-foreground/40"
                  strokeWidth={2}
                />
                <text
                  x={midX + (isLeft ? -10 : 10)}
                  y={midY}
                  className="fill-primary font-mono text-xs font-bold"
                  textAnchor="middle"
                >
                  {isLeft ? '0' : '1'}
                </text>
              </g>
            );
          })}

          {/* Draw nodes */}
          {positions.map(({ x, y, node }) => {
            const isLeaf = node.char !== null;
            return (
              <g key={node.id} className="animate-fade-in">
                <rect
                  x={x - 28}
                  y={y - 20}
                  width={56}
                  height={40}
                  rx={8}
                  className={
                    isLeaf
                      ? 'fill-primary/20 stroke-primary'
                      : 'fill-card stroke-border'
                  }
                  strokeWidth={1.5}
                />
                {isLeaf ? (
                  <>
                    <text
                      x={x}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-primary font-mono text-sm font-semibold"
                    >
                      {getDisplayChar(node.char!)}
                    </text>
                    <text
                      x={x}
                      y={y + 12}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono text-xs"
                    >
                      {node.freq}
                    </text>
                  </>
                ) : (
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    className="fill-foreground font-mono text-sm"
                  >
                    {node.freq}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Drag to pan • Use zoom controls • Leaf nodes show character and frequency
        </p>
      </div>
    </div>
  );
}
