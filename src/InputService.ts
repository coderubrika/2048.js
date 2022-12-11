import { fromEvent, Subject } from "rxjs"
import { Key } from "./utils"


export class InputService {
  public readonly OnKeyDown = new Subject<Key>()
  
  constructor() {
    fromEvent<KeyboardEvent>(window, 'keydown').subscribe(event => {
      this.OnKeyDown.next(Key[event.code])      
    })
  }
}