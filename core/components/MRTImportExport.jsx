import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Utility functions for converting data
function convertArrayToString(arr) {
  return arr
    .map((item) => {
      if (item.isBreak && !item.ability) return '// new phase';
      if (!item.ability) return null;
      const assignees = Array.isArray(item?.primary)
        ? item.primary.map((p) => p.label).join(', ')
        : '';
      if (!assignees.length) {
        return `{time:${item.time || '00:00'}} ${item.ability} - Unassigned`;
      }
      return `{time:${item.time || '00:00'}} ${item.ability} - ${assignees}`;
    })
    .filter(Boolean)
    .join('\n');
}

function convertStringToArray(str) {
  return str
    .split('\n')
    .filter((line) => !line.startsWith('//'))
    .map((line) => {
      const timeMatch = line.match(/{time:(\d{2}:\d{2})}/);
      const abilityMatch = line.match(/\} (.+?) -/);
      const assigneesMatch = line.match(/- (.+?)$/);
      const assignees =
        assigneesMatch && assigneesMatch[1] !== 'Unassigned'
          ? assigneesMatch[1].split(',').map((a) => ({
              label: a.trim(),
              id: a.trim(),
            }))
          : [];
      return {
        time: timeMatch ? timeMatch[1] : null,
        ability: abilityMatch ? abilityMatch[1] : null,
        primary: assignees,
        isBreak: !timeMatch,
      };
    });
}

const MRTImportExport = ({ handleToggle, data }) => {
  const [importData, setImportData] = useState(convertArrayToString(data));

  useEffect(() => {
    setImportData(convertArrayToString(data));
  }, [data]);

  const saveAndClose = () => {
    const parsedData = convertStringToArray(importData);
    handleToggle(parsedData);
  };

  return (
    <div className="flex flex-col gap-4 mrt-import-stack">
      <Textarea
        className="min-h-[200px] w-full font-mono text-sm mrt-import-textfield"
        value={importData}
        onChange={(e) => setImportData(e.target.value)}
      />
      <div className="mrt-import-actions">
        <Button onClick={saveAndClose}>
          Save & Close
        </Button>
      </div>
    </div>
  );
};

export default MRTImportExport; 