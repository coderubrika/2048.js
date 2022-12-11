import { Subject, Subscription } from "rxjs";
import { Key } from "./utils";
import { InputService } from "./InputService";

export enum UserMovement {
  Up,
  Down,
  Left,
  Right
}

export class UserInputService {
  private handlerSubscription: Subscription
  private isOn = false

  public readonly OnMovement = new Subject<UserMovement>

  constructor(private readonly inputService: InputService) {
  }

  public enable(isOn: boolean) {
    if (this.isOn == isOn) return

    this.isOn = isOn

    if (isOn)
      this.handlerSubscription = this.inputService.OnKeyDown.subscribe(this.handler.bind(this))
    else
      this.handlerSubscription.unsubscribe()
  }

  private handler(key: Key) {
    console.log(key);
    
    if (key == Key.KeyA) {
      this.OnMovement.next(UserMovement.Left)
      return
    }
    if (key == Key.KeyD) {
      this.OnMovement.next(UserMovement.Right)
      return
    }
    if (key == Key.KeyW) {
      this.OnMovement.next(UserMovement.Up)
      return
    }
    if (key == Key.KeyS) {
      this.OnMovement.next(UserMovement.Down)
      return
    }
  }
}