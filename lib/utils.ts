import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(text: string) {
  // remove non ascii characters
  const asciiText = text.replace(/[^\x00-\x7F]/g, "");
  return asciiText;
}