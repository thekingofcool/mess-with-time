
/**
 * Utility functions for consistent date and time formatting and validation
 */

/**
 * Format date input to yyyy-MM-dd format
 */
export const formatDateInput = (input: string) => {
  // Remove non-numeric characters except hyphens
  let formattedInput = input.replace(/[^\d-]/g, '');
  
  // Split by hyphens to get year, month, day
  const parts = formattedInput.split('-');
  let year = parts[0] || '';
  let month = parts.length > 1 ? parts[1] : '';
  let day = parts.length > 2 ? parts[2] : '';
  
  // Ensure year, month and day don't exceed their limits
  if (year.length > 4) year = year.slice(0, 4);
  if (month.length > 2) month = month.slice(0, 2);
  if (day.length > 2) day = day.slice(0, 2);
  
  // Format month
  if (month) {
    const monthNum = parseInt(month);
    if (monthNum > 12) month = '12';
    else if (monthNum === 0) month = '01';
    else if (month.length === 1 && monthNum > 0) month = monthNum.toString().padStart(2, '0');
  }
  
  // Format day based on month
  if (day) {
    const dayNum = parseInt(day);
    const monthNum = parseInt(month) || 0;
    let maxDays = 31;
    
    // Determine max days for the month
    if (monthNum === 2) {
      // February (leap year check)
      const yearNum = parseInt(year) || new Date().getFullYear();
      maxDays = ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(monthNum)) {
      // April, June, September, November have 30 days
      maxDays = 30;
    }
    
    if (dayNum > maxDays) day = maxDays.toString();
    else if (dayNum === 0) day = '01';
    else if (day.length === 1 && dayNum > 0) day = dayNum.toString().padStart(2, '0');
  }
  
  // Reconstruct the formatted date
  let result = year;
  if (month) result += result ? '-' + month : month;
  if (day) result += result && month ? '-' + day : day;
  
  return result;
};

/**
 * Format time input to HH:mm:ss format
 */
export const formatTimeInput = (input: string) => {
  // Remove non-numeric characters except colons
  let formattedInput = input.replace(/[^\d:]/g, '');
  
  // Split by colons to get hours, minutes, seconds
  const parts = formattedInput.split(':');
  let hours = parts[0] || '';
  let minutes = parts.length > 1 ? parts[1] : '';
  let seconds = parts.length > 2 ? parts[2] : '';
  
  // Ensure hours, minutes, seconds don't exceed their limits
  if (hours.length > 2) hours = hours.slice(0, 2);
  if (minutes.length > 2) minutes = minutes.slice(0, 2);
  if (seconds.length > 2) seconds = seconds.slice(0, 2);
  
  // Format hours
  if (hours) {
    const hoursNum = parseInt(hours);
    if (hoursNum > 23) hours = '23';
    else if (hours.length === 1 && hoursNum >= 0) hours = hoursNum.toString().padStart(2, '0');
  }
  
  // Format minutes
  if (minutes) {
    const minutesNum = parseInt(minutes);
    if (minutesNum > 59) minutes = '59';
    else if (minutes.length === 1 && minutesNum >= 0) minutes = minutesNum.toString().padStart(2, '0');
  }
  
  // Format seconds
  if (seconds) {
    const secondsNum = parseInt(seconds);
    if (secondsNum > 59) seconds = '59';
    else if (seconds.length === 1 && secondsNum >= 0) seconds = secondsNum.toString().padStart(2, '0');
  }
  
  // Reconstruct the formatted time
  let result = hours;
  if (minutes) result += result ? ':' + minutes : minutes;
  if (seconds) result += result && minutes ? ':' + seconds : seconds;
  
  return result;
};

/**
 * Parse date and time strings into a Date object
 */
export const parseDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return null;
  
  const formattedDate = formatDateInput(dateStr);
  const formattedTime = formatTimeInput(timeStr);
  
  if (formattedDate.length < 10 || !formattedTime) return null;
  
  const [year, month, day] = formattedDate.split('-').map(Number);
  const [hours, minutes, seconds] = formattedTime.split(':').map(Number);
  
  // Month is 0-indexed in JavaScript Date
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

/**
 * Generate syntax-highlighted HTML for Python code
 */
export const highlightPythonCode = (code: string) => {
  // Basic keyword highlighting
  const keywords = ["def", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "class", "try", "except", "finally", "with", "as", "True", "False", "None"];
  const builtins = ["print", "len", "dict", "list", "tuple", "set", "int", "str", "float", "bool", "datetime", "timedelta", "pytz"];
  
  // Replace keywords with highlighted spans
  let highlightedCode = code;
  
  // Highlight strings (simple version)
  highlightedCode = highlightedCode.replace(/(["'])(.*?)\1/g, '<span class="text-amber-400">$1$2$1</span>');
  
  // Highlight comments
  highlightedCode = highlightedCode.replace(/(#.*$)/gm, '<span class="text-gray-400">$1</span>');
  
  // Highlight numbers
  highlightedCode = highlightedCode.replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>');
  
  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, '<span class="text-purple-400">$1</span>');
  });
  
  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, '<span class="text-cyan-400">$1</span>');
  });
  
  // Highlight function definitions
  highlightedCode = highlightedCode.replace(/def\s+(\w+)(?=\()/g, 'def <span class="text-green-400">$1</span>');
  
  return highlightedCode;
};
