import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import path from 'path';
import { writeFile } from 'fs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const writeImages = async (image: File) => {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const pathToSave = path.resolve(`assets/products`, image.name);
  writeFile(pathToSave, buffer, (err) => {
    if (err) throw err;
    console.log('[REWORKED PRODUCTS_POST] IMG SAVE: SUCCESS');
  });

  return pathToSave;
};
