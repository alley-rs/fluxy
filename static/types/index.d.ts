interface RequestTask {
  xhr: XMLHttpRequest;
  data: File;
  start?: number;
  done?: () => void;
}

interface BadRequest {
  error: string;
  advice: string | null;
}
