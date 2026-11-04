export const spring = { type: "spring", stiffness: 300, damping: 25 } as const;
export const softSpring = { type: "spring", stiffness: 220, damping: 28 } as const;

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: softSpring },
};
