
export const formatDateInput = (input: string): string => {
  if (!input) return '';
  
  // Remove any non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, '');
  
  // Handle year input (1-4 digits)
  if (cleanedInput.length <= 4) {
    return cleanedInput;
  }
  
  // Validate year
  const year = cleanedInput.slice(0, 4);
  
  // Validate month (05-12)
  let month = cleanedInput.slice(4, 6);
  month = month === '00' ? '01' : 
          month > '12' ? '12' : 
          month.padStart(2, '0');
  
  // Validate day based on month and year
  let day = cleanedInput.slice(6, 8);
  const daysInMonth = [31, 
    // Check for leap year
    (parseInt(year) % 4 === 0 && (parseInt(year) % 100 !== 0 || parseInt(year) % 400 === 0)) ? 29 : 28, 
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ][parseInt(month) - 1];
  
  day = day === '00' ? '01' : 
        parseInt(day) > daysInMonth ? daysInMonth.toString() : 
        day.padStart(2, '0');
  
  return `${year}-${month}-${day}`.slice(0, 10);
};

export const formatTimeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove any non-digit characters
  const cleanedInput = input.replace(/[^0-9]/g, '');
  
  // Handle hour (00-23)
  let hour = cleanedInput.slice(0, 2);
  hour = hour > '23' ? '23' : hour.padStart(2, '0');
  
  // Handle minute (00-59)
  let minute = cleanedInput.slice(2, 4);
  minute = minute > '59' ? '59' : minute.padStart(2, '0');
  
  // Handle second (00-59)
  let second = cleanedInput.slice(4, 6);
  second = second > '59' ? '59' : second.padStart(2, '0');
  
  return `${hour}:${minute}:${second}`.slice(0, 8);
};

export const parseDateTime = (dateInput: string, timeInput: string): Date | null => {
  try {
    const formattedDate = formatDateInput(dateInput);
    const formattedTime = formatTimeInput(timeInput);
    
    if (formattedDate.length < 10 || !formattedTime) return null;
    
    const dateTimeStr = `${formattedDate} ${formattedTime}`;
    const date = new Date(dateTimeStr.replace(/-/g, '/'));
    
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const highlightPythonCode = (code: string) => {
  const keywords = ["def", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "class", "try", "except", "finally", "with", "as", "True", "False", "None"];
  const builtins = ["print", "len", "dict", "list", "tuple", "set", "int", "str", "float", "bool", "datetime", "timedelta", "pytz"];
  
  // Replace special HTML characters
  let highlightedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Function to wrap a section in a color span
  const wrapWithColor = (match: string, color: string) => {
    return `<span style="color: ${color}">${match}</span>`;
  };

  // Highlight strings
  highlightedCode = highlightedCode.replace(/(["'])(.*?)(\1)/g, (match, quote, content) => 
    `<span style="color: #F59E0B">${quote}${content}${quote}</span>`
  );
  
  // Highlight comments
  highlightedCode = highlightedCode.replace(/(#.*?)(?=\n|$)/g, match => 
    `<span style="color: #9CA3AF">${match}</span>`
  );
  
  // Highlight numbers
  highlightedCode = highlightedCode.replace(/\b(\d+)\b/g, match => 
    `<span style="color: #60A5FA">${match}</span>`
  );
  
  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, match => 
      `<span style="color: #A78BFA">${match}</span>`
    );
  });
  
  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, match => 
      `<span style="color: #22D3EE">${match}</span>`
    );
  });
  
  // Highlight function definitions
  highlightedCode = highlightedCode.replace(/(def\s+)(\w+)(?=\()/g, (match, def, funcName) => 
    `${def}<span style="color: #34D399">${funcName}</span>`
  );
  
  return highlightedCode;
};
