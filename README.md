# Huffman File Compression Utility

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-4-brightgreen.svg)](https://vitejs.dev/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://huffman-compression-five.vercel.app/)

A **lossless file compression and decompression tool** implemented using the **Huffman Coding algorithm** in **TypeScript + React (Vite)**.

This project features:
- Huffman algorithm logic for compression/decompression  
- Web-based **drag & drop file interface**  
- Huffman tree visualization  
- Real-time compression metrics  

---

## 📌 Overview

**Huffman Coding** is a greedy algorithm that assigns shorter binary codes to frequent characters, ensuring **prefix-free encoding** and **lossless compression**.

This web app:
1. Uploads a text file
2. Builds a frequency map of characters
3. Constructs a Huffman tree
4. Compresses the file
5. Decompresses the file back to its **exact original form**
6. Shows compression ratio and tree visualization

---

## ⚙️ Features

- Lossless compression & decompression  
- Web-based interface (React + Vite)  
- Huffman Tree visualization (`src/components/ui/HuffmanTreeVisualization.tsx`)  
- Real-time compression metrics (`src/components/ui/CompressionMetrics.tsx`)  
- File I/O support via browser drag-drop  

---

## 🗂️ Project Structure

```
huffman-compression/
├── src/
│ ├── lib/
│ │ ├── huffman.ts  # Huffman algorithm logic
│ │ └── utils.ts    # File and binary helpers
│ ├── components/
│ │ └── ui/         # UI components (tree, metrics, table)
│ ├── hooks/        # React hooks
│ └── pages/        # App pages (Index, NotFound)
├── public/         # Static assets
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## ▶️ How to Run

### 1. Install dependencies
```
npm install
```
### 2. Run locally
```
npm run dev
```
Open browser at http://localhost:5173/ to access the web app.

### 3. Build for production
```
npm run build
npm run preview
```

## 📊 Compression Results

| File       | Original | Compressed | Ratio |
|------------|----------|------------|-------|
| `sample.txt` | 12 KB   | **6.2 KB** | **48%** |
| `lorem.txt`  | 25 KB   | **11 KB**  | **56%** |
| `code.js`    | 8 KB    | **4.1 KB** | **49%** |


## ⏱️ Complexity

| Operation       | Time       | Space |
|-----------------|------------|-------|
| **Tree Build**  | **O(n log n)** | O(n) |
| Encoding        | O(n)       | O(n) |
| Decoding        | O(n)       | O(n) |

*n = unique characters*

## 🎯 Try Live Demo
**[Compress files in browser → See magic happen](https://huffman-compression-five.vercel.app/)**

## 🚀 Future Enhancements

- 🌐 **Browser drag-drop** demo
- 📁 **Binary file support**
- ⚡ **Streaming compression**
- 📊 **Tree visualization**
- 🔄 **Multi-file batch**

## 📄 License
[MIT License](LICENSE)

---

**⭐ Star if helpful!**  
**⚡ Built with TypeScript + Huffman mastery**
