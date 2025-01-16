export const extractNameFromCV = (cvText) => {
  // Get the first line of the CV
  const firstLine = cvText.split('\n')[0];
  
  // Clean up the line and use it as the name
  const name = firstLine.trim();
  
  // Return the name if it looks valid, otherwise return placeholder
  return name.length > 0 ? name : '[Your Name]';
};
