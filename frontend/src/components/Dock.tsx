'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 hover:border-[#0065FF]/50 hover:bg-[#0065FF]/20 hover:shadow-[0_0_20px_rgba(0,101,255,0.4)] transition-all duration-150 group/dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute top-full left-1/2 mt-4 w-fit whitespace-pre rounded-lg border border-[#0065FF]/30 bg-[#000510]/90 backdrop-blur-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase text-white shadow-2xl z-[110]`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '', isHovered }: DockIconProps) {
  const defaultHovered = useMotionValue(0);
  const motionValue = isHovered || defaultHovered;

  const scale = useSpring(
    useTransform(motionValue, [0, 1], [1, 1.2]),
    { stiffness: 600, damping: 20 }
  );
  
  const color = useTransform(
    motionValue,
    [0, 1],
    ['#ffffff', '#0065FF']
  );

  return (
    <motion.div
      style={{ scale, color }}
      className={`flex items-center justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.05, stiffness: 350, damping: 20 },
  magnification = 70,
  distance = 140,
  panelHeight = 64,
  baseItemSize = 50
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div 
      className="fixed top-6 left-0 right-0 z-[100] flex justify-center items-center pointer-events-none"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
        }}
        className={`${className} flex items-start w-fit gap-3 rounded-[32px] border-[#0065FF]/30 border bg-[#000510]/40 backdrop-blur-[30px] pt-3 px-4 shadow-[0_0_80px_-10px_rgba(0,101,255,0.3),inset_0_0_20px_rgba(0,101,255,0.1)] pointer-events-auto transition-all duration-200`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}
