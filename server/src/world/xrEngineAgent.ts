import { xrengine_client } from '../../../core/src/connectors/xrengine'

export class xrEngineAgent {
  xrengine: xrengine_client

  constructor(url: string) {
    console.log('RUNING THE XR-ENGINE BOT')
    this.xrengine = new xrengine_client()
    this.xrengine.createXREngineClient(this, { url: url }, this.xrengine)
  }
}
