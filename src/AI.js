export class AI {
  constructor(fieldModel, scope) {
    this.fieldModel = fieldModel
    this.aiIds = []
    this.move = 0
    this.scope = scope
  }

  startAI(power, stepTime) {
    for(let i = 0; i < power; i++) {
      this.aiIds.push(this.ai(stepTime))
    }
  }

  stopAI() {
    this.aiIds.forEach(id => clearInterval(id))
    this.aiIds = []
  }

  ai(stepTime) {
    const id = setInterval(()=> {
      if (this.move == 0) {
        this.fieldModel.down()
        this.move = 1
        const answer = this.fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        this.scope.textContent = this.fieldModel.scope
        return
      }
      if (this.move == 1) {
        this.fieldModel.right()
        this.move = 2
        const answer = this.fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        this.scope.textContent = this.fieldModel.scope
        return
      }
      if (this.move == 2) {
        this.fieldModel.up()
        this.move = 3
        const answer = this.fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        this.scope.textContent = this.fieldModel.scope
        return
      }
      if (this.move == 3) {
        this.fieldModel.left()
        this.move = 0
        const answer = this.fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        this.scope.textContent = this.fieldModel.scope
        return
      }
  
    }, stepTime);

    return id
  }
}