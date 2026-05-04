'use client';

import { useTypewriter } from '@/lib/hooks/useTypewriter';
import { cn } from '@/lib/cn';

type Props = {
  command: string;
  output?: React.ReactNode;
  showCursor?: boolean;
  typed?: boolean;
  className?: string;
  promptChar?: string;
  speed?: number;
  startDelay?: number;
};

export function TerminalPrompt({
  command,
  output,
  showCursor = false,
  typed = false,
  className,
  promptChar = '$',
  speed = 30,
  startDelay = 0,
}: Props) {
  const { displayed, done } = useTypewriter({
    text: command,
    speed,
    startDelay,
    enabled: typed,
  });
  return (
    <div className={cn('font-mono text-sm', className)}>
      <div className="text-accent-pink">
        <span className="text-text-tertiary mr-2">{promptChar}</span>
        <span>{displayed}</span>
        {showCursor && done && <span className="ml-1 inline-block animate-cursor-blink">_</span>}
      </div>
      {output && <div className="mt-2 text-text-secondary">{output}</div>}
    </div>
  );
}
