export const getFileItemIndex = (
  file: File,
  fileList: FileListItem[],
): number => {
  return fileList.findIndex(
    (item) => item.file.size === file.size && item.file.name === file.name,
  );
};
