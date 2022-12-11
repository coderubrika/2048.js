import { FieldService } from "./FieldService"
import { MainScreen } from "./MainScreen"
import { RxProperty } from "./utils"

export class AIService {
  private readonly field: FieldService
  private readonly aiIds: number[] = []
  private readonly scope: RxProperty<number>
  
  private move: number = 0

  constructor(field: FieldService, mainScreen: MainScreen) {
    this.field = field
    this.scope = mainScreen.Scope
  }

  startAI(power, stepTime) {
    for(let i = 0; i < power; i++) {
      this.aiIds.push(this.ai(stepTime))
    }
  }

  stopAI() {
    this.aiIds.forEach(id => clearInterval(id))
    this.aiIds.length = 0
  }

  ai(stepTime) {
    const id = setInterval(()=> {
      if (this.move == 0) {
        this.field.down()
        this.move = 1
        const answer = this.field.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        return
      }
      if (this.move == 1) {
        this.field.right()
        this.move = 2
        const answer = this.field.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        return
      }
      if (this.move == 2) {
        this.field.up()
        this.move = 3
        const answer = this.field.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        return
      }
      if (this.move == 3) {
        this.field.left()
        this.move = 0
        const answer = this.field.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        return
      }
  
    }, stepTime);

    return id
  }
}