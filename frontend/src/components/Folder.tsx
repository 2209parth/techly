import React, { useState } from 'react';

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({ color = '#0065FF', size = 1, items = [], className = '' }) => {
  const maxItems = 6;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.15);
  const paperBackgrounds = [
    'rgba(255, 255, 255, 0.95)',
    '#ffffff',
    'rgba(255, 255, 255, 0.98)'
  ];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.08;
    const offsetY = (e.clientY - centerY) * 0.08;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
    setHoveredIndex(null);
  };

  const folderStyle: React.CSSProperties = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
  } as React.CSSProperties;

  const scaleStyle = { transform: `scale(${size})` };

  const getOpenTransform = (index: number) => {
    // Compressed Arc for 160px cards (reduced from 200px)
    if (index === 0) return 'translate(0%, -115%) rotate(-12deg)';
    if (index === 1) return 'translate(65%, -110%) rotate(-5deg)';
    if (index === 2) return 'translate(125%, -95%) rotate(2deg)';
    if (index === 3) return 'translate(175%, -65%) rotate(10deg)';
    if (index === 4) return 'translate(210%, -20%) rotate(18deg)';
    if (index === 5) return 'translate(230%, 35%) rotate(26deg)';
    return '';
  };

  const getHoverTransform = (index: number) => {
    if (hoveredIndex !== index) return '';
    return ' scale(1.1) translateY(-5%)';
  };

  return (
    <div style={scaleStyle} className={`inline-block ${className}`}>
      <div
        className={`group relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer ${
          !open ? 'hover:-translate-y-4' : ''
        }`}
        style={{
          ...folderStyle,
          transform: open ? 'translateY(-10px)' : undefined
        }}
        onClick={handleClick}
      >
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/40 blur-2xl rounded-full" />
        
        <div
          className="relative w-[140px] h-[105px] rounded-tl-0 rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] shadow-2xl transition-colors duration-300"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute z-0 bottom-[99%] left-0 w-[50px] h-[16px] rounded-tl-[8px] rounded-tr-[8px]"
            style={{ backgroundColor: folderBackColor }}
          ></span>
          
          {papers.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const sizeClasses = open ? 'w-[160px] h-[160px]' : 'w-[90%] h-[75%]';

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)${getHoverTransform(i)}`
              : undefined;

            return (
              <div
                key={i}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseEnter={() => open && setHoveredIndex(i)}
                onMouseLeave={e => handlePaperMouseLeave(e, i)}
                className={`absolute z-20 bottom-[12%] left-1/2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl overflow-hidden ${
                  !open ? 'transform -translate-x-1/2 translate-y-[5%] group-hover:translate-y-[-5%]' : ''
                } ${sizeClasses}`}
                style={{
                  ...(!open ? {} : { transform: transformStyle }),
                  zIndex: isHovered ? 100 : 20 + i,
                  backgroundColor: paperBackgrounds[i % paperBackgrounds.length],
                  borderRadius: open ? '32px' : '16px',
                  pointerEvents: open ? 'auto' : 'none'
                }}
              >
                <div className="w-full h-full relative overflow-hidden bg-white/40 backdrop-blur-md">
                   {item}
                </div>
              </div>
            );
          })}
          
          {/* Front Flap */}
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              !open ? 'group-hover:[transform:skew(10deg)_scaleY(0.55)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '8px 16px 16px 16px',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
              ...(open && { transform: 'skew(10deg) scaleY(0.55)' })
            }}
          ></div>
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              !open ? 'group-hover:[transform:skew(-10deg)_scaleY(0.55)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '8px 16px 16px 16px',
              ...(open && { transform: 'skew(-10deg) scaleY(0.55)' })
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
