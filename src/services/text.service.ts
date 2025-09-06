export const convertToSingleString = (filesChangesContent) => {
  return filesChangesContent.data
    .map((file) => {
      return `File: ${file.filename}\nStatus: ${file.status}\nChanges:\n${
        file.patch || '(no patch available)'
      }\n`;
    })
    .join('\n---\n');
};
