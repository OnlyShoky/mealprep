import React from 'react';

export default function InstructionsList({ instructionsString }) {
  if (!instructionsString) return null;

  const lines = instructionsString.split('\n').filter(line => line.trim().length > 0);
  
  const groups = [];
  let currentGroup = { name: 'Instructions', steps: [] };
  
  lines.forEach(line => {
    if (line.startsWith('GroupName :')) {
      if (currentGroup.steps.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = { name: line.replace('GroupName :', '').trim(), steps: [] };
    } else {
      currentGroup.steps.push(line);
    }
  });
  
  if (currentGroup.steps.length > 0) {
    groups.push(currentGroup);
  }

  // Remove the default 'Instructions' group if it's the first one and empty
  if (groups.length > 1 && groups[0].name === 'Instructions' && groups[0].steps.length === 0) {
    groups.shift();
  }

  return (
    <div className="bg-sepia-100 rounded-xl p-6 shadow-box-up">
      <h3 className="text-2xl font-bold text-normal ruslan-display mb-6">Instructions</h3>
      
      {groups.map((group, gIdx) => (
        <div key={gIdx} className="mb-8 last:mb-0">
          {groups.length > 1 && (
            <h4 className="font-bold text-lg text-sepia-warn mb-4 pb-2 border-b border-sepia-200">
              {group.name}
            </h4>
          )}
          <ul className="space-y-4">
            {group.steps.map((step, sIdx) => {
              // Strip numbering if present, e.g., "1. Do something" -> "Do something"
              const match = step.match(/^\d+\.\s*(.*)/);
              const text = match ? match[1] : step;
              return (
                <li key={sIdx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sepia-warn text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {sIdx + 1}
                  </span>
                  <p className="text-normal pt-1">{text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
