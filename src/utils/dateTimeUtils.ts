
export const highlightPythonCode = (code: string) => {
  const keywords = ["def", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "class", "try", "except", "finally", "with", "as", "True", "False", "None"];
  const builtins = ["print", "len", "dict", "list", "tuple", "set", "int", "str", "float", "bool", "datetime", "timedelta", "pytz"];
  
  // Replace special HTML characters
  let highlightedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Create a array of lines to process each line
  const lines = highlightedCode.split('\n');
  const processedLines = lines.map(line => {
    // Process comments (must be done first to avoid conflicts)
    if (line.includes('#')) {
      const commentIndex = line.indexOf('#');
      const codeSection = line.substring(0, commentIndex);
      const commentSection = line.substring(commentIndex);
      
      // Process code part first
      let processedCode = processCodeSection(codeSection, keywords, builtins);
      
      // Then wrap comment in span without extra attributes
      return processedCode + `<span style="color:gray">${commentSection}</span>`;
    }
    
    // No comments, process normal code
    return processCodeSection(line, keywords, builtins);
  });
  
  // Join lines back together
  return processedLines.join('\n');
};
