const formatFileSize = (size: number): string => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (size < KB) {
    return `${size} B`;
  } else if (size < MB) {
    const kb = size / KB;
    return `${kb.toFixed(2)} KB`;
  } else if (size < GB) {
    const mb = size / MB;
    return `${mb.toFixed(2)} MB`;
  } else {
    const gb = size / GB;
    return `${gb.toFixed(2)} GB`;
  }
};

export default formatFileSize;
