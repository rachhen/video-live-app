export const dateFormat = (date: string) => {
  return new Intl.DateTimeFormat("km", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};
