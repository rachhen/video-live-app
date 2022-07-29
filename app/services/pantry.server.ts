import { Pantry } from "pantry-cloud";

declare global {
  var __pantry: Pantry | undefined;
}

let pantry: Pantry;

if (process.env.NODE_ENV === "production") {
  pantry = new Pantry("21c3a895-cb75-4e03-aa6b-7d91163b9dfe");
} else {
  if (!global.__pantry) {
    global.__pantry = new Pantry("21c3a895-cb75-4e03-aa6b-7d91163b9dfe");
  }
  pantry = global.__pantry;
}

export { pantry };
