export class ClassNamer {
  private base: string;
  private otherNames: string[] = [];

  constructor(base: string) {
    this.base = base;
  }

  addName(name: string) {
    this.otherNames.push(name);

    return this.name();
  }

  removeName(name: string) {
    const idx = this.otherNames.indexOf(name);
    this.otherNames = this.otherNames.splice(idx, 1);
  }

  addNames(...names: string[]) {
    this.otherNames = [...this.otherNames, ...names];

    return this.name();
  }

  addSuffix(suffix: string) {
    this.base += "__" + suffix;

    return this.name();
  }

  name() {
    if (this.otherNames.length)
      return this.base + " " + this.otherNames.join(" ");

    return this.base;
  }
}

export const addClassNames = (
  base: string,
  ...others: (string | undefined | false)[]
): string => {
  const names = Array.from(new Set(others.filter((s) => s && s !== "")));
  return [base, ...names].join(" ");
};

export const classNames = (base: string, other?: string): string => {
  if (!other) return base;

  const name = other.trim();
  if (!name) return base;

  const names = base
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  const idx = names.indexOf(name);

  return idx > -1 ? base : [...names, name].join(" ");
};

export const removeClassName = (base: string, name: string): string => {
  const names = base
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  const idx = names.indexOf(name.trim());

  if (idx === -1) {
    return base;
  }

  return names.splice(idx, 1).join(" ");
};
