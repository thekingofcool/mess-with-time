
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
  highlightedCode = highlightedCode.replace(/(["'])(.*?)\1/g, '<span class="text-amber-500">$1$2$1</span>');
  
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
