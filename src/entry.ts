import { GameManager } from './GameManager'
import { MainScreen } from './MainScreen'

window.onload = start

const resolution = 8

function start() {
  const mainScreen = new MainScreen()
  const manager = new GameManager(mainScreen)
  manager.initFieldView()
  manager.initCells()
  //manager.start()
  manager.subscribeInputHandler()
  manager.startAI(1, 500)
}