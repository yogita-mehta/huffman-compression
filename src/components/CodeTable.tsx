import type { CodeMap, FrequencyMap } from '@/lib/huffman';
import { getDisplayChar } from '@/lib/huffman';

interface CodeTableProps {
  codeMap: CodeMap;
  frequencyMap: FrequencyMap;
}

export function CodeTable({ codeMap, frequencyMap }: CodeTableProps) {
  const entries = Object.entries(codeMap).sort(
    (a, b) => (frequencyMap[b[0]] || 0) - (frequencyMap[a[0]] || 0)
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground">Huffman Codes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Prefix-free binary codes for each character
        </p>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Char
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Bits
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map(([char, code]) => (
              <tr key={char} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary font-mono font-semibold">
                    {getDisplayChar(char)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  {frequencyMap[char]}
                </td>
                <td className="px-4 py-3 font-mono text-foreground">
                  <span className="inline-flex gap-px">
                    {code.split('').map((bit, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                          bit === '0'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {bit}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  {code.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
