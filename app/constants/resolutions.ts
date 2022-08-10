import type { Resolution } from "~/schemas/streaming";

export const resolutions = [
  { label: "1080p", value: "1080p" },
  { label: "720p", value: "720p" },
  { label: "480p", value: "480p" },
  { label: "360p", value: "360p" },
];

type ResolutionsMap = {
  [key in Resolution]: {
    size: string;
    videoBitrate: number;
    maxrate: string;
  };
};

export const resolutionsMap: ResolutionsMap = {
  "1080p": {
    size: "1920x1080",
    videoBitrate: 6000,
    maxrate: "9000k",
  },
  "720p": {
    size: "1280x720",
    videoBitrate: 4000,
    maxrate: "6000k",
  },
  "480p": {
    size: "854x480",
    videoBitrate: 2000,
    maxrate: "3000k",
  },
  "360p": {
    size: "640x360",
    videoBitrate: 1000,
    maxrate: "1500k",
  },
};
