export const loops = [
  { value: "0", label: "No Loop" },
  { value: "1", label: "Loop 1 time" },
  { value: "2", label: "Loop 2 times" },
  { value: "3", label: "Loop 3 times" },
  { value: "5", label: "Loop 5 times" },
  { value: "7", label: "Loop 7 times" },
  { value: "10", label: "Loop 10 times" },
  { value: "-1", label: "Loop forever" },
];

export const loop = (value: string) => {
  return loops.find((loop) => loop.value === value);
};
