const fs = require('fs');
const content = fs.readFileSync('src/pages/ProfileView.jsx', 'utf8');
const lines = content.split('\n');

let divStack = [];
let inString = false;
let stringChar = '';
let inComment = false;
let inJsxComment = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let j = 0;
  while (j < line.length) {
    const char = line[j];
    const nextChar = line[j+1] || '';
    
    if (inComment) {
      if (char === '*' && nextChar === '/') {
        inComment = false;
        j += 2;
      } else {
        j++;
      }
      continue;
    }
    
    if (!inString && char === '/' && nextChar === '*') {
      inComment = true;
      j += 2;
      continue;
    }
    
    if (!inString && char === '/' && nextChar === '/') {
      break;
    }
    
    if (inString) {
      if (char === '\\') {
        j += 2;
      } else if (char === stringChar) {
        inString = false;
        j++;
      } else {
        j++;
      }
      continue;
    }
    
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      j++;
      continue;
    }
    
    // Check for <div
    if (char === '<' && line.substring(j, j+4) === '<div') {
      // Check if self-closing or has closing tag on same line
      let k = j + 4;
      let hasClosingTagOnSameLine = false;
      while (k < line.length) {
        if (line[k] === '/' && line[k+1] === '>') {
          // Self-closing
          j = k + 2;
          break;
        }
        if (line.substring(k, k+6) === '</div>') {
          // Has closing tag on same line
          hasClosingTagOnSameLine = true;
          j = k + 6;
          break;
        }
        if (line[k] === '>') {
          // Opening tag ends here
          if (hasClosingTagOnSameLine) {
            j = k + 1;
          } else {
            divStack.push({ line: i+1, type: 'open' });
            j = k + 1;
          }
          break;
        }
        k++;
      }
      continue;
    }
    
    // Check for </div>
    if (char === '<' && line.substring(j, j+6) === '</div>') {
      if (divStack.length === 0) {
        console.log(`Line ${i+1}: Unexpected closing </div>`);
      } else {
        divStack.pop();
      }
      j += 6;
      continue;
    }
    
    j++;
  }
}

if (divStack.length > 0) {
  console.log('Unclosed divs:');
  divStack.forEach(d => console.log(`  Line ${d.line}`));
  console.log(`Total unclosed: ${divStack.length}`);
} else {
  console.log('All divs are properly closed!');
}
