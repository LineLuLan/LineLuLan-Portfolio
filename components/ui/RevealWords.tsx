import { Fragment, type CSSProperties } from 'react';

export function RevealWords({ text, offset = 0, accentPeriod = false }: { text: string; offset?: number; accentPeriod?: boolean }) {
  return <>{text.split(' ').map((word, index) => (
    <Fragment key={`${index}-${word}`}>
      {index > 0 && ' '}
      <span className="word-clip"><span className="reveal-word" style={{ '--word-index': index + offset } as CSSProperties}>
        {accentPeriod && word.endsWith('.') ? <>{word.slice(0, -1)}<span className="text-accent">.</span></> : word}
      </span></span>
    </Fragment>
  ))}</>;
}
