// Huffman Coding Algorithm Implementation
// Demonstrates: Trees, Min-Heaps, Greedy Algorithms, Bit Manipulation

export interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  id: string;
}

export interface FrequencyMap {
  [key: string]: number;
}

export interface CodeMap {
  [key: string]: string;
}

export interface CompressionResult {
  compressedData: Uint8Array;
  codeMap: CodeMap;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  tree: HuffmanNode | null;
  frequencyMap: FrequencyMap;
  paddingBits: number;
}

export interface DecompressionResult {
  decompressedText: string;
  success: boolean;
  error?: string;
}

// Min-Heap (Priority Queue) Implementation
class MinHeap {
  private heap: HuffmanNode[] = [];

  insert(node: HuffmanNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): HuffmanNode | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].freq <= this.heap[index].freq) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < length && this.heap[leftChild].freq < this.heap[smallest].freq) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild].freq < this.heap[smallest].freq) {
        smallest = rightChild;
      }
      if (smallest === index) break;

      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}

// Generate unique IDs for tree nodes (for visualization)
let nodeIdCounter = 0;
function generateNodeId(): string {
  return `node_${nodeIdCounter++}`;
}

// Step 1: Calculate character frequencies
export function calculateFrequencies(text: string): FrequencyMap {
  const frequencies: FrequencyMap = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  return frequencies;
}

// Step 2: Build Huffman Tree using Min-Heap
export function buildHuffmanTree(frequencies: FrequencyMap): HuffmanNode | null {
  nodeIdCounter = 0;
  const chars = Object.keys(frequencies);
  
  if (chars.length === 0) return null;

  const heap = new MinHeap();

  // Create leaf nodes for each character
  for (const char of chars) {
    heap.insert({
      char,
      freq: frequencies[char],
      left: null,
      right: null,
      id: generateNodeId(),
    });
  }

  // Handle single character case
  if (heap.size() === 1) {
    const node = heap.extractMin()!;
    return {
      char: null,
      freq: node.freq,
      left: node,
      right: null,
      id: generateNodeId(),
    };
  }

  // Build tree by combining two smallest nodes
  while (heap.size() > 1) {
    const left = heap.extractMin()!;
    const right = heap.extractMin()!;

    const parent: HuffmanNode = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
      id: generateNodeId(),
    };

    heap.insert(parent);
  }

  return heap.extractMin();
}

// Step 3: Generate Huffman codes via tree traversal
export function generateCodes(tree: HuffmanNode | null): CodeMap {
  const codes: CodeMap = {};
  
  if (!tree) return codes;

  function traverse(node: HuffmanNode, code: string): void {
    if (node.char !== null) {
      // Leaf node - assign code (empty string for single char)
      codes[node.char] = code || '0';
      return;
    }
    if (node.left) traverse(node.left, code + '0');
    if (node.right) traverse(node.right, code + '1');
  }

  traverse(tree, '');
  return codes;
}

// Step 4: Compress text using bit-packing
export function compress(text: string): CompressionResult {
  if (!text || text.length === 0) {
    return {
      compressedData: new Uint8Array(0),
      codeMap: {},
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      tree: null,
      frequencyMap: {},
      paddingBits: 0,
    };
  }

  const originalSize = new TextEncoder().encode(text).length;
  const frequencyMap = calculateFrequencies(text);
  const tree = buildHuffmanTree(frequencyMap);
  const codeMap = generateCodes(tree);

  // Encode text to binary string
  let binaryString = '';
  for (const char of text) {
    binaryString += codeMap[char];
  }

  // Pack binary string into bytes
  const paddingBits = (8 - (binaryString.length % 8)) % 8;
  binaryString = binaryString.padEnd(binaryString.length + paddingBits, '0');

  const byteArray = new Uint8Array(binaryString.length / 8);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(binaryString.slice(i * 8, (i + 1) * 8), 2);
  }

  const compressedSize = byteArray.length;
  const compressionRatio = originalSize > 0 
    ? ((originalSize - compressedSize) / originalSize) * 100 
    : 0;

  return {
    compressedData: byteArray,
    codeMap,
    originalSize,
    compressedSize,
    compressionRatio,
    tree,
    frequencyMap,
    paddingBits,
  };
}

// Step 5: Decompress using Huffman tree
export function decompress(
  compressedData: Uint8Array,
  tree: HuffmanNode | null,
  paddingBits: number
): DecompressionResult {
  if (!tree || compressedData.length === 0) {
    return { decompressedText: '', success: true };
  }

  // Convert bytes back to binary string
  let binaryString = '';
  for (const byte of compressedData) {
    binaryString += byte.toString(2).padStart(8, '0');
  }

  // Remove padding bits
  if (paddingBits > 0) {
    binaryString = binaryString.slice(0, -paddingBits);
  }

  // Decode using tree traversal
  let result = '';
  let currentNode = tree;

  for (const bit of binaryString) {
    // Handle single character case
    if (currentNode.left && !currentNode.right && currentNode.left.char !== null) {
      result += currentNode.left.char;
      continue;
    }

    currentNode = bit === '0' ? currentNode.left! : currentNode.right!;

    if (currentNode.char !== null) {
      result += currentNode.char;
      currentNode = tree;
    }
  }

  return { decompressedText: result, success: true };
}

// Create downloadable compressed file (includes metadata for decompression)
export function createCompressedFile(result: CompressionResult): Blob {
  const metadata = {
    codeMap: result.codeMap,
    paddingBits: result.paddingBits,
    frequencyMap: result.frequencyMap,
  };

  const metadataString = JSON.stringify(metadata);
  const metadataBytes = new TextEncoder().encode(metadataString);
  
  // Format: [4 bytes metadata length][metadata][compressed data]
  const metadataLength = new Uint32Array([metadataBytes.length]);
  const totalLength = 4 + metadataBytes.length + result.compressedData.length;
  const output = new Uint8Array(totalLength);
  
  output.set(new Uint8Array(metadataLength.buffer), 0);
  output.set(metadataBytes, 4);
  output.set(result.compressedData, 4 + metadataBytes.length);

  return new Blob([output], { type: 'application/octet-stream' });
}

// Parse compressed file for decompression
export function parseCompressedFile(data: ArrayBuffer): {
  compressedData: Uint8Array;
  codeMap: CodeMap;
  paddingBits: number;
  frequencyMap: FrequencyMap;
} | null {
  try {
    const view = new DataView(data);
    const metadataLength = view.getUint32(0, true);
    
    const metadataBytes = new Uint8Array(data, 4, metadataLength);
    const metadataString = new TextDecoder().decode(metadataBytes);
    const metadata = JSON.parse(metadataString);
    
    const compressedData = new Uint8Array(data, 4 + metadataLength);
    
    return {
      compressedData,
      codeMap: metadata.codeMap,
      paddingBits: metadata.paddingBits,
      frequencyMap: metadata.frequencyMap,
    };
  } catch {
    return null;
  }
}

// Get display-safe character representation
export function getDisplayChar(char: string): string {
  if (char === ' ') return '␣';
  if (char === '\n') return '↵';
  if (char === '\t') return '→';
  if (char === '\r') return '⏎';
  if (char.charCodeAt(0) < 32) return `\\x${char.charCodeAt(0).toString(16).padStart(2, '0')}`;
  return char;
}
