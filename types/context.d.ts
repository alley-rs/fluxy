type Accessor<T> = import("solid-js").Accessor<T>;
type Resource<T> = import("solid-js").Resource<T>;
type Setter<T> = import("solid-js").Setter<T>;

interface AppContext {
  mode: Accessor<Mode | null>;
  qrCode: Accessor<QrCode | undefined>;
  setQrCode: Setter<QrCode | undefined>;
  goHomePage: () => void;
  goReceivePage: () => void;
  goSendPage: () => void;
  about: {
    show: Accessor<boolean>;
    onShow: () => void;
  };
  translations: Resource<Translations>;
}
