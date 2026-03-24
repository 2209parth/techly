import React from 'react';
import { VscTag } from 'react-icons/vsc';

const AffordablePricing: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-[32px] shadow-inner select-none uppercase tracking-tighter text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <VscTag className="w-8 h-8 text-blue-600" />
      </div>
      <h5 className="text-[16px] font-black text-black leading-tight">
        EASY<br />AFFORDABLE
      </h5>
    </div>
  );
};

export default AffordablePricing;
