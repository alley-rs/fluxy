interface RequestTask {
  xhr: XMLHttpRequest;
  data: File;
  done?: () => void;
}

interface BadRequest {
  error: string;
  advice: string | null;
}
