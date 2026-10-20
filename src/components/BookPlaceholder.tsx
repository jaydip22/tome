'use client';

import React from 'react';

interface BookPlaceholderProps {
  title: string;
  author: string;
  className?: string;
}

// Modern, light aesthetic palettes (sage, sand, dusty rose, slate, sky, clay)
const LIGHT_PALETTES = [
  { bg: 'bg-[#f4efe8]', text: 'text-[#4a3f35]', sub: 'text-[#8c7b6d]', spine: 'bg-[#e2d8cb]', line: 'bg-[#d1c2b0]' },
  { bg: 'bg-[#eef3f0]', text: 'text-[#2d4237]', sub: 'text-[#6a8475]', spine: 'bg-[#d8e3dc]', line: 'bg-[#bfd1c5]' },
  { bg: 'bg-[#f0eff5]', text: 'text-[#38334a]', sub: 'text-[#776f92]', spine: 'bg-[#dedce8]', line: 'bg-[#c8c5d6]' },
  { bg: 'bg-[#f7edf0]', text: 'text-[#4c2d36]', sub: 'text-[#926573]', spine: 'bg-[#ebd4dc]', line: 'bg-[#dbbac6]' },
  { bg: 'bg-[#edf3f7]', text: 'text-[#2a3c4a]', sub: 'text-[#647f94]', spine: 'bg-[#d5e3ed]', line: 'bg-[#b8cdda]' },
  { bg: 'bg-[#f5f1eb]', text: 'text-[#3d3832]', sub: 'text-[#82786d]', spine: 'bg-[#e3dcd1]', line: 'bg-[#cdc2b3]' },
];

function getPalette(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % LIGHT_PALETTES.length;
  return LIGHT_PALETTES[index];
}

export function BookPlaceholder({ title, author, className = '' }: BookPlaceholderProps) {
  const p = getPalette(title || 'Book');

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 ${p.bg} shadow-inner select-none overflow-hidden rounded-lg border border-black/5 ${className}`}
      style={{ aspectRatio: '2 / 3' }}
    >
      {/* Sleek book spine simulation */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${p.spine} shadow-r`} />
      <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-black/5" />

      {/* Subtle top ornament */}
      <div className="pl-2 flex items-center gap-1.5 opacity-70">
        <div className={`w-1 h-3 rounded-full ${p.line}`} />
        <span className={`text-[9px] font-mono tracking-widest uppercase font-semibold ${p.sub}`}>
          Edition
        </span>
      </div>

      {/* Centered Title */}
      <div className="my-auto pl-2 pr-1">
        <h4 className={`font-serif font-bold text-sm sm:text-base leading-snug line-clamp-3 ${p.text}`}>
          {title || 'Untitled'}
        </h4>
        <div className={`w-6 h-0.5 mt-2 rounded-full ${p.line}`} />
      </div>

      {/* Author Footer */}
      <div className="pl-2 pt-2 border-t border-black/5">
        <p className={`text-[11px] font-medium truncate ${p.sub}`}>
          {author || 'Unknown'}
        </p>
      </div>
    </div>
  );
}
