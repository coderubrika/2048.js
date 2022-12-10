import { Subject } from "rxjs"

export class RxProperty<T> extends Subject<T> {
  public set Value(value: T) {
    this.value = value
    this.next(value)
  }
  
  public get Value() {
    return this.value
  }

  private value: T

  constructor(initialValue: T) {
    super();
    this.value = initialValue
  }
}