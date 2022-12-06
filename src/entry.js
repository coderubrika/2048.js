import { GameManager } from './GameManager'

window.onload = start

const resolution = 8


function start() {
  const manager = new GameManager(resolution)
  manager.initFieldView()
  manager.initCells()
  manager.subscribeInputHandler()
  manager.startAI(1, 500)
}