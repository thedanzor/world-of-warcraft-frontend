import { useState, useRef, useMemo, useEffect } from 'react';
import { XIcon } from 'lucide-react';

const MRTAutoComplete = (props) => {
  const { onChange, value, placeholder, finalOptions, ...other } = props;
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const updatedOptions = useMemo(() => {
    return [
      ...(finalOptions || []),
      { label: 'pots', id: 'pots' },
      { label: 'defensives', id: 'defensives' },
    ];
  }, [finalOptions]);

  const sanitizedValue = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      if (typeof item === 'string') {
        return { label: item, id: item };
      }
      return item;
    });
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return updatedOptions;
    return updatedOptions.filter(opt => 
      (opt.label || opt.id || '').toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, updatedOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (item) => {
    const isExisting = sanitizedValue.some(v => v.id === item.id);
    if (!isExisting) {
      onChange([...sanitizedValue, item]);
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemove = (idToRemove) => {
    onChange(sanitizedValue.filter(v => v.id !== idToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // If there's an exact match in options, use it, else create freeSolo
      const exactMatch = filteredOptions.find(
        opt => opt.label.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (exactMatch) {
        handleAdd(exactMatch);
      } else {
        handleAdd({ label: inputValue.trim(), id: inputValue.trim() });
      }
    } else if (e.key === 'Backspace' && !inputValue && sanitizedValue.length > 0) {
      handleRemove(sanitizedValue[sanitizedValue.length - 1].id);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-background rounded-md border border-input focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 transition-colors">
        {sanitizedValue.map((item) => (
          <span
            key={item.id}
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-sm"
          >
            {item.label}
            <button
              type="button"
              className="hover:bg-muted p-0.5 rounded-full opacity-70 hover:opacity-100"
              onClick={() => handleRemove(item.id)}
            >
              <XIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm px-1 py-0.5 text-foreground placeholder:text-muted-foreground"
          placeholder={sanitizedValue.length === 0 ? (placeholder || 'Select players') : ''}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          {...other}
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleAdd(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { MRTAutoComplete as AutoComplete };
export default MRTAutoComplete; 