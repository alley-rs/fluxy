export class OrderedSet<T extends object> {
  private items: T[] = [];
  private orderedKey: keyof T;

  constructor(orderedKey: keyof T) {
    this.orderedKey = orderedKey;
  }

  clone(): OrderedSet<T> {
    const newSet = new OrderedSet(this.orderedKey);
    newSet.items = [...this.items];

    return newSet;
  }

  push(item: T): OrderedSet<T> {
    const index = this.index(item);

    if (index === -1) this.items.push(item);
    else {
      this.items[index] = item;
    }

    return this.clone();
  }

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
    return this.items.map(callbackfn);
  }

  index(item: T): number {
    return this.items.findIndex(
      (v) => v[this.orderedKey] === item[this.orderedKey],
    );
  }

  contains(item: T): boolean {
    const value = this.items.find(
      (v) => v[this.orderedKey] === item[this.orderedKey],
    );

    return !!value;
  }

  remove(item: T): OrderedSet<T> {
    this.items = this.items.filter(
      (v) => v[this.orderedKey] !== item[this.orderedKey],
    );

    return this.clone();
  }

  clear(): OrderedSet<T> {
    return new OrderedSet(this.orderedKey);
  }

  empty(): boolean {
    return this.items.length === 0;
  }
}
