export const deleteRepetition = (
  paths: string[],
  files: SendFile[],
): string[] => {
  return paths.filter((p) => {
    const index = files?.findIndex((f) => f.path === p);
    return index === undefined ? true : index === -1;
  });
};
