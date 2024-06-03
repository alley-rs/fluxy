interface Remote {
  addr: string;
  name: string;
  os: OsType;
}

type ReceiveEvent = "Start" | "Running" | "End";
