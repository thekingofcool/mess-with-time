/**
 * Utility functions for consistent date and time formatting and validation
 */

/**
 * Format date input to yyyy-MM-dd format with auto-completion
 */
export const formatDateInput = (input: string) => {
  // Remove non-numeric characters except hyphens
  let formattedInput = input.replace(/[^\d-]/g, '');
  
  // Split by hyphens
  const parts = formattedInput.split('-');
  let year = parts[0] || '';
  let month = parts.length > 1 ? parts[1] : '';
  let day = parts.length > 2 ? parts[2] : '';
  
  // Auto-complete year
  if (year.length === 4) {
    formattedInput = `${year}-`;
  }
  
  // Auto-complete month
  if (year.length === 4 && month) {
    const monthNum = parseInt(month);
    if (month.length === 1) {
      if (monthNum >= 0 && monthNum <= 9) {
        month = month.padStart(2, '0');
        formattedInput = `${year}-${month}-`;
      }
    } else if (month.length === 2) {
      if (monthNum > 12) {
        month = '12';
      } else if (monthNum === 0) {
        month = '01';
      }
      formattedInput = `${year}-${month}-`;
    }
  }
  
  // Auto-complete and validate day
  if (year.length === 4 && month.length === 2 && day) {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    let maxDays = getDaysInMonth(new Date(yearNum, monthNum - 1));
    
    const dayNum = parseInt(day);
    if (day.length === 1) {
      if (dayNum >= 0 && dayNum <= 9) {
        day = day.padStart(2, '0');
      }
    } else if (day.length === 2) {
      if (dayNum > maxDays) {
        day = maxDays.toString();
      } else if (dayNum === 0) {
        day = '01';
      }
    }
    formattedInput = `${year}-${month}-${day}`;
  }
  
  return formattedInput;
};

/**
 * Format time input to HH:mm:ss format with auto-completion
 */
export const formatTimeInput = (input: string) => {
  // Remove non-numeric characters except colons
  let formattedInput = input.replace(/[^\d:]/g, '');
  
  // Split by colons
  const parts = formattedInput.split(':');
  let hours = parts[0] || '';
  let minutes = parts.length > 1 ? parts[1] : '';
  let seconds = parts.length > 2 ? parts[2] : '';
  
  // Auto-complete hours
  if (hours) {
    const hoursNum = parseInt(hours);
    if (hours.length === 1) {
      if (hoursNum >= 0 && hoursNum <= 9) {
        hours = hours.padStart(2, '0');
        formattedInput = `${hours}:`;
      }
    } else if (hours.length === 2) {
      if (hoursNum > 23) {
        hours = '23';
      }
      formattedInput = `${hours}:`;
    }
  }
  
  // Auto-complete minutes
  if (hours.length === 2 && minutes) {
    const minutesNum = parseInt(minutes);
    if (minutes.length === 1) {
      if (minutesNum >= 0 && minutesNum <= 9) {
        minutes = minutes.padStart(2, '0');
        formattedInput = `${hours}:${minutes}:`;
      }
    } else if (minutes.length === 2) {
      if (minutesNum > 59) {
        minutes = '59';
      }
      formattedInput = `${hours}:${minutes}:`;
    }
  }
  
  // Auto-complete seconds
  if (hours.length === 2 && minutes.length === 2 && seconds) {
    const secondsNum = parseInt(seconds);
    if (seconds.length === 1) {
      if (secondsNum >= 0 && secondsNum <= 9) {
        seconds = seconds.padStart(2, '0');
      }
    } else if (seconds.length === 2) {
      if (secondsNum > 59) {
        seconds = '59';
      }
    }
    formattedInput = `${hours}:${minutes}:${seconds}`;
  }
  
  return formattedInput;
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
  
  // Replace special HTML characters to prevent XSS and rendering issues
  let highlightedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Highlight strings (simple version)
  highlightedCode = highlightedCode.replace(/(["'])(.*?)\1/g, '<span style="color: #f59e0b;">$1$2$1</span>');
  
  // Highlight comments
  highlightedCode = highlightedCode.replace(/(#.*$)/gm, '<span style="color: #9ca3af;">$1</span>');
  
  // Highlight numbers
  highlightedCode = highlightedCode.replace(/\b(\d+)\b/g, '<span style="color: #60a5fa;">$1</span>');
  
  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, '<span style="color: #a78bfa;">$1</span>');
  });
  
  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b(${builtin})\\b`, 'g');
    highlightedCode = highlightedCode.replace(regex, '<span style="color: #22d3ee;">$1</span>');
  });
  
  // Highlight function definitions
  highlightedCode = highlightedCode.replace(/def\s+(\w+)(?=\()/g, 'def <span style="color: #4ade80;">$1</span>');
  
  return highlightedCode;
};
