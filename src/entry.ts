import { AIService } from './AIService'
import { Cell } from './Cell'
import { FieldService } from './FieldService'
import { InputService } from './InputService'
import { MainScreen } from './MainScreen'
import { UserInputService, UserMovement } from './UserInputService'

window.onload = start

function start() {
  const mainScreen = new MainScreen()
  const field = new FieldService(mainScreen)
  const ai = new AIService(field, mainScreen)
  const inputService = new InputService()
  const userInputService = new UserInputService(inputService)
  
  mainScreen.redraw()
  mainScreen.CellsViews.forEach(view => field.addToPool(new Cell(mainScreen, view)))

  mainScreen.OnPlay.subscribe(() => {
    mainScreen.Scope.Value = 0
    field.resetCells()
    field.useEmptyCell()

    userInputService.enable(true)
    userInputService.OnMovement.subscribe(movement => {
      if (movement == UserMovement.Down) field.down()
      if (movement == UserMovement.Up) field.up()
      if (movement == UserMovement.Left) field.left()
      if (movement == UserMovement.Right) field.right()
    })
  })
}