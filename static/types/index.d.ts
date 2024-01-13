interface RequestTask {
  xhr: XMLHttpRequest;
  data: File;
  done?: () => void;
}
