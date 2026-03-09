import { useState } from 'react';
import { AutoComplete } from './MRTAutoComplete';

const MRTAbilityList = ({ bossTimerData, setbossTimerData, hoveredIndex, setHoveredIndex, finalOptions }) => {
  return (
    <div className="mrt-ability-list w-full">
      <div className="mrt-ability-list-header flex w-full font-bold mb-2">
        <div className="w-[100px] shrink-0 p-2">Time</div>
        <div className="flex-1 p-2">Ability</div>
        <div className="flex-[2] p-2">Assigned Players</div>
      </div>
      {Array.isArray(bossTimerData) ? bossTimerData.map((item, index) => {
        if (item.isBreak) {
          return <div key={index} className="h-px bg-border my-2" />;
        }
        if (!item.ability) return null;
        return (
          <div
            key={index}
            className={`mrt-ability-list-row flex items-center w-full py-2 border-b border-[#23243a] transition-colors ${
              hoveredIndex === index ? 'bg-white/5' : ''
            } ${item.isEnrage ? 'mrt-is-enrage' : ''} ${item.needsCD ? 'mrt-needs-cd' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-[100px] shrink-0 p-2 font-medium">{item.time || ''}</div>
            <div className={`flex-1 p-2 ${item.isEnrage ? 'font-bold text-red-500' : 'font-normal'}`}>
              {item.ability}
            </div>
            <div className="flex-[2] p-2">
              <AutoComplete
                placeholder="Assign players"
                value={item.primary || []}
                onChange={(value) => {
                  setbossTimerData((oldState) => {
                    const newState = [...oldState];
                    newState[index].primary = value;
                    return newState;
                  });
                }}
                finalOptions={finalOptions}
              />
            </div>
          </div>
        );
      }) : (
        <p>No timer data available</p>
      )}
    </div>
  );
};

export default MRTAbilityList; 