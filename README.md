# Huffman File Compression Utility

A lossless file compression and decompression utility implemented using the **Huffman Coding** algorithm in **TypeScript**.

This project demonstrates how classical data-structure algorithms can be applied in modern programming languages to efficiently reduce file size.

## 📌 Overview

**Huffman Coding** is a greedy compression algorithm that assigns shorter binary codes to more frequent characters and longer codes to less frequent ones.

This implementation:
- Reads a text file
- Compresses it using Huffman Encoding
- Stores encoded binary data
- Decompresses it back to the original file **without any data loss**

## ⚙️ Features

- Lossless compression and decompression
- File-based input and output
- Huffman Tree construction using priority queue
- Binary encoding and decoding
- Visualization of Huffman Tree for better understanding and debugging

## 🧠 Algorithm Explanation (Brief)

1. Count frequency of each character in the input file
2. Build a **min-heap (priority queue)** using character frequencies
3. Construct a **Huffman Tree** by merging lowest-frequency nodes
4. Generate **prefix-free binary codes** for each character
5. Encode the input file using generated codes
6. Decode the compressed file using the same Huffman Tree

## 🗂️ Project Structure
```
src/
├── huffman.ts # Huffman tree construction and logic
├── compress.ts # File compression logic
├── decompress.ts # File decompression logic
├── utils.ts # Helper functions
sample.txt # Example input file
```
## ▶️ How to Run

### 1. Install dependencies
npm install

### 2. Compress a file
npm run compress sample.txt


### 3. Decompress the file
npm run decompress sample.huff


## 📊 Example

| File | Original Size | Compressed Size | Compression Ratio |
|------|---------------|-----------------|-------------------|
| `sample.txt` | 12 KB | ~6–7 KB | ~45–55% |

**Decompressed output exactly matches the original file.**

## ⏱️ Time & Space Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Building Huffman Tree | O(n log n) | O(n) |
| Encoding | O(n) | O(n) |
| Decoding | O(n) | O(n) |

*where `n` is the number of unique characters*

## 🚀 Future Improvements

- Support for **binary and non-text files**
- Better compression for **large datasets**
- **Streaming compression support**

---

