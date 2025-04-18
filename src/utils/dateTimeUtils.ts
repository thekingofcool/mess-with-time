
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
  // Basic keyword highlighting
  const keywords = ["def", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "class", "try", "except", "finally", "with", "as", "True", "False", "None"];
  const builtins = ["print", "len", "dict", "list", "tuple", "set", "int", "str", "float", "bool", "datetime", "timedelta", "pytz"];
  
  // Replace special HTML characters
  let highlightedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Use a safer approach for highlighting that doesn't get confused by nested spans
  
  // First, wrap all the code in a container span
  highlightedCode = `<span>${highlightedCode}</span>`;
  
  // Highlight strings - special handling to avoid nesting issues
  highlightedCode = highlightedCode.replace(/(["'])(.*?)(\1)/g, '<span style="color: #F59E0B;">$1$2$3</span>');
  
  // Highlight comments
  highlightedCode = highlightedCode.replace(/(#.*?)(?=<\/span>|$)/g, '<span style="color: #9CA3AF;">$1</span>');
  
  // Highlight numbers
  highlightedCode = highlightedCode.replace(/\b(\d+)\b/g, '<span style="color: #60A5FA;">$1</span>');
  
  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, `<span style="color: #A78BFA;">$1</span>`);
  });
  
  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, `<span style="color: #22D3EE;">$1</span>`);
  });
  
  // Highlight function definitions
  highlightedCode = highlightedCode.replace(/(def\s+)(\w+)(?=\()/g, '$1<span style="color: #34D399;">$2</span>');
  
  return highlightedCode;
};
