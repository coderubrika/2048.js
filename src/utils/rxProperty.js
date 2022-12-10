import { Subject } from "rxjs"

export function RxProperty(initialValue) {
  const propertySubject = new Subject()
  let value = initialValue

  Object.defineProperty(propertySubject, "value", {

    get: function() {
      return value;
    },
  
    set: function(val) {
      value = val
      propertySubject.next(value)
    }
  })

  return propertySubject
}