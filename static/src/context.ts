import { createContext } from "solid-js";
import type { Locale } from "./i18n";

const LocaleContext = createContext<Locale>();

export default LocaleContext;
