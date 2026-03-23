"use client";

import React, { useState } from 'react';

export interface MagicNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface MagicNavProps {
  items: MagicNavItem[];
}

export default function MagicNav({ items }: MagicNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="magic-nav">
        <ul>
          {items.map((item, index) => (
            <li
              key={item.id}
              className={`list ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <a href={item.href}>
                <span className="icon flex items-center justify-center pt-5 pb-5">
                  {item.icon}
                </span>
                <span className="text">{item.label}</span>
              </a>
            </li>
          ))}
          <div
            className="indicator"
            style={{ transform: `translateX(calc(70px * ${activeIndex}))` }}
          ></div>
        </ul>
      </div>
      <style>
        {`
          .magic-nav {
            width: auto;
            height: 70px;
            background: transparent;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .magic-nav ul {
            display: flex;
            position: relative;
            width: ${items.length * 70}px;
          }
          .magic-nav ul li {
            position: relative;
            list-style: none;
            width: 70px;
            height: 70px;
            z-index: 2;
          }
          .magic-nav ul li a {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 100%;
            text-align: center;
            font-weight: 500;
            text-decoration: none;
          }
          .magic-nav ul li a .icon {
            position: relative;
            display: block;
            line-height: 75px;
            font-size: 1.4rem;
            text-align: center;
            transition: 0.5s;
            color: #fff;
          }
          .magic-nav ul li.active a .icon {
            transform: translateY(-35px);
            color: #fff;
          }
          .magic-nav ul li a .text {
            position: absolute;
            color: rgba(255,255,255,0.5);
            font-weight: 600;
            font-size: 0.6em;
            letter-spacing: 0.1em;
            transition: 0.5s;
            opacity: 0;
            transform: translateY(20px);
            text-transform: uppercase;
          }
          .magic-nav ul li.active a .text {
            transform: translateY(-4px);
            opacity: 1;
            color: #fff;
          }
          .magic-nav .indicator {
            position: absolute;
            top: -50%;
            width: 70px;
            height: 70px;
            background: #0065FF;
            border-radius: 50%;
            border: 6px solid #050505;
            transition: 0.5s;
            z-index: 1;
            box-shadow: 0 10px 20px rgba(0, 101, 255, 0.3);
          }
          .magic-nav .indicator::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -22px;
            width: 20px;
            height: 20px;
            background: transparent;
            border-top-right-radius: 20px;
            box-shadow: 0px -10px 0 0 #050505;
          }
          .magic-nav .indicator::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -22px;
            width: 20px;
            height: 20px;
            background: transparent;
            border-top-left-radius: 20px;
            box-shadow: 0px -10px 0 0 #050505;
          }
        `}
      </style>
    </>
  );
}
