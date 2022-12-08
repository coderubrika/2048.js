export class MainScreen {
  constructor(gameManager) {
    this.screen = document.querySelector('.screen.main')
    
    this.playButton = this.screen.querySelector('button.play')
    this.resetButton = this.screen.querySelector('button.reset')
    this.scope = this.screen.querySelector('p.scope')

    this.resolutionInput = this.screen.querySelector('input.resolution')

    this.enableAIButton = this.screen.querySelector('button.enable-ai')
    this.disableAIButton = this.screen.querySelector('button.disable-ai')
    this.aiPowerInput = this.screen.querySelector('input.ai-power')
    this.ai.SpeedInput = this.screen.querySelector('input.ai-speed')

    this.saveProgressButton = this.screen.querySelector('button.save-progress')
    this.loadProgressButton = this.screen.querySelector('button.load-progress')

    this.field = this.screen.querySelector('.field')

    this.playButton.onclick.addEventListener(event => {
    }, false)
  }
}