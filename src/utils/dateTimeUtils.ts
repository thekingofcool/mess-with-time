
export const highlightPythonCode = (code: string) => {
  // Basic keyword highlighting
  const keywords = ["def", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "class", "try", "except", "finally", "with", "as", "True", "False", "None"];
  const builtins = ["print", "len", "dict", "list", "tuple", "set", "int", "str", "float", "bool", "datetime", "timedelta", "pytz"];
  
  // Replace special HTML characters
  let highlightedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
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
