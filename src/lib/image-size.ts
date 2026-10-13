// Reads the width and height of a picture straight from the start of
// its file. Pictures recorded in credits.json have their size written
// there by hand; pictures uploaded through the editing desk do not, so
// their size is measured here while the site is being built. (A page
// needs each picture's size to hold the right space for it before it
// has loaded, so the text does not jump.)
//
// Understands JPEG, PNG, WebP, GIF and SVG, which covers everything a
// browser will show.
import fs from 'node:fs';

export function imageSize(path: string): { width: number; height: number } {
  const file = fs.readFileSync(path);
  const fail = (): never => {
    throw new Error(`Could not read the size of "${path}". Is it a JPEG, PNG, WebP, GIF or SVG?`);
  };

  // PNG: the size is at a fixed place near the start.
  if (file.subarray(1, 4).toString('latin1') === 'PNG') {
    return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
  }

  // GIF: likewise.
  if (file.subarray(0, 3).toString('latin1') === 'GIF') {
    return { width: file.readUInt16LE(6), height: file.readUInt16LE(8) };
  }

  // WebP: three variants, each keeping the size somewhere different.
  if (file.subarray(0, 4).toString('latin1') === 'RIFF' && file.subarray(8, 12).toString('latin1') === 'WEBP') {
    const kind = file.subarray(12, 16).toString('latin1');
    if (kind === 'VP8 ') return { width: file.readUInt16LE(26) & 0x3fff, height: file.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') {
      const bits = file.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === 'VP8X') return { width: file.readUIntLE(24, 3) + 1, height: file.readUIntLE(27, 3) + 1 };
    return fail();
  }

  // JPEG: a chain of labelled blocks; the size is in the "start of
  // frame" block, so walk the chain until it turns up.
  if (file[0] === 0xff && file[1] === 0xd8) {
    let at = 2;
    while (at + 9 < file.length) {
      if (file[at] !== 0xff) return fail();
      const marker = file[at + 1];
      const isFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isFrame) return { width: file.readUInt16BE(at + 7), height: file.readUInt16BE(at + 5) };
      at += 2 + file.readUInt16BE(at + 2);
    }
    return fail();
  }

  // SVG: text, so look for width/height, or failing that the viewBox.
  const text = file.subarray(0, 2000).toString('utf8');
  if (text.includes('<svg')) {
    const tag = text.slice(text.indexOf('<svg'), text.indexOf('>', text.indexOf('<svg')));
    const number = (name: string) => Number(tag.match(new RegExp(`\\s${name}="([\\d.]+)(?:px)?"`))?.[1]);
    const box = tag.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
    const width = number('width') || Number(box?.[1]);
    const height = number('height') || Number(box?.[2]);
    if (width && height) return { width, height };
  }

  return fail();
}
