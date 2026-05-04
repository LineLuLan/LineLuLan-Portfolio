// Re-export framer-motion's hook so all consumers go through one symbol.
// This makes it trivial to swap impl later (e.g. add custom logic).
export { useReducedMotion } from 'framer-motion';
