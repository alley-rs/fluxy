/** Upload fileList. Replace file if exist or just push into it. */
export const updateFileList = (
  file: FileListItem,
  fileList: FileListItem[]
) => {
  const nextFileList = [...fileList];
  const fileIndex = nextFileList.findIndex(
    ({ file: { name, size } }) =>
      name === file.file.name && size === file.file.size
  );
  if (fileIndex === -1) {
    nextFileList.push(file);
  } else {
    nextFileList[fileIndex] = file;
  }
  return nextFileList;
};

export const getFileItem = (
  file: File,
  fileList: FileListItem[]
): FileListItem | undefined => {
  return fileList.find(
    (item) => item.file.size === file.size && item.file.name === file.name
  );
};

export const removeFileItem = (file: File, fileList: FileListItem[]) => {
  const removed = fileList.filter(
    (item) => !(item.file.size === file.size && item.file.name === file.name)
  );

  if (removed.length === fileList.length) {
    return null;
  }

  return removed;
};
