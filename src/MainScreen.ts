import { fromEvent, Observable, Subject } from "rxjs"
import { query } from "./utils"

export class MainScreen {
  private readonly screen: HTMLElement
  private readonly playButton: HTMLButtonElement
  private readonly resetButton: HTMLButtonElement
  private readonly scope: HTMLElement
  private readonly resolutionInput: HTMLInputElement
  private readonly enableAIButton: HTMLButtonElement
  private readonly disableAIButton: HTMLButtonElement
  private readonly aiPowerInput: HTMLInputElement
  private readonly aiSpeedInput: HTMLInputElement
  private readonly saveProgressButton: HTMLButtonElement
  private readonly loadProgressButton: HTMLButtonElement
  private readonly field: HTMLElement
  
  private isEnabledAI = false

  public readonly OnPlay: Observable<MouseEvent>
  public readonly OnReset: Observable<MouseEvent>
  public readonly OnEnableAI: Subject<boolean>

  constructor(gameManager) {
    this.screen = query('.screen.main')
    this.playButton = query('button.play', this.screen)
    this.resetButton = query('button.reset', this.screen)
    this.scope = query('p.scope', this.screen)

    this.resolutionInput = query('input.resolution', this.screen)

    this.enableAIButton = query('button.enable-ai', this.screen)
    this.disableAIButton = query('button.disable-ai', this.screen)
    this.aiPowerInput = query('input.ai-power', this.screen)
    this.aiSpeedInput = query('input.ai-speed', this.screen)

    this.saveProgressButton = query('button.save-progress', this.screen)
    this.loadProgressButton = query('button.load-progress', this.screen)

    this.field = query('.field', this.screen)

    this.OnPlay = fromEvent<MouseEvent>(this.playButton, 'click')
    this.OnReset = fromEvent<MouseEvent>(this.resetButton, 'click')

    this.OnEnableAI = new Subject<boolean>()

    fromEvent(this.enableAIButton, 'click').subscribe(() => {
      if (this.isEnabledAI)
        return
      this.isEnabledAI = true
      this.OnEnableAI.next(true)
    })
    fromEvent(this.disableAIButton, 'click').subscribe(() => {
      if (!this.isEnabledAI)
        return
      this.isEnabledAI = false
      this.OnEnableAI.next(false)
    })
  }
}