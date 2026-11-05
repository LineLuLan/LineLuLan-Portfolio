// Intent: keep chronological order, path endpoints and responsive node positions in agreement.
// Status: implemented. Next: maintain geometry checks when adding milestones. Blockers: none. Confidence: boundary tests.
import type { ChronicleEvent } from '@/types';

export function careerLayout(events: ChronicleEvent[], today: string) {
  const nodes = [...events].sort((a, b) => a.date.localeCompare(b.date)).map((event, index) => {
    const row = Math.floor(index / 5);
    const column = row % 2 ? 4 - index % 5 : index % 5;
    return { event, index, row, column, x: 100 + column * 200, y: 115 + row * 135,
      mx: index % 2 ? 170 : 130, my: 70 + index * 140, future: event.date > today };
  });
  const firstFuture = nodes.findIndex((node) => node.future);
  const lastPast = firstFuture < 0 ? nodes.length - 1 : firstFuture - 1;
  function paths(mobile: boolean) {
    const point = (i: number) => mobile ? `${nodes[i]!.mx} ${nodes[i]!.my}` : `${nodes[i]!.x} ${nodes[i]!.y}`;
    const segments = nodes.slice(1).map((node, offset) => {
      const previous = nodes[offset]!;
      if (mobile) return ` C ${previous.mx} ${previous.my + 70} ${node.mx} ${node.my - 70} ${point(offset + 1)}`;
      return node.row === previous.row ? ` L ${point(offset + 1)}` : ` A 67.5 67.5 0 0 ${node.row % 2 ? 1 : 0} ${point(offset + 1)}`;
    });
    const full = nodes.length ? `M ${point(0)}${segments.join('')}` : '';
    return {
      full,
      travelled: lastPast >= 0 ? `M ${point(0)}${segments.slice(0, lastPast).join('')}` : '',
      future: lastPast === nodes.length - 1 ? '' : lastPast < 0 ? full : `M ${point(lastPast)}${segments.slice(lastPast).join('')}`,
    };
  }
  return { nodes, desktop: paths(false), mobile: paths(true), mobileHeight: Math.max(140, nodes.length * 140) };
}
