import { Subject } from "rxjs"

export function RxProperty<T>(initialValue: T) {
  const propertySubject = new Subject<T>()
  let value: T = initialValue

  Object.defineProperty(propertySubject, "value", {

    get: function() {
      return value;
    },
  
    set: function(val: T) {
      value = val
      propertySubject.next(value)
    }
  })

  return propertySubject
}