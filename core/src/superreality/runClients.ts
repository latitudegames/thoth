// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import customConfig from '@latitudegames/thoth-core/src/superreality/customConfig'

import { initCalendar } from '../connectors/calendar'
import { handleInput } from './handleInput'

export async function runClients() {
   //reads the enabled services from the config and puts them in an array
   let enabledServices = ['discord', 'twitter', 'xrengine'] // customConfig.instance.get('enabledServices').split(', ')
   for (let i = 0; i < enabledServices.length; i++) {
      enabledServices[i] = enabledServices[i].trim().toLowerCase()
   }
   enabledServices = enabledServices.filter(function (elem, pos) {
      return enabledServices.indexOf(elem) == pos
   })

   //based on which clients are added in the array, it will run its script
   // Discord support
   if (enabledServices.includes('discord')) {
      import('../connectors/discord').then(module => module.default())
      try {
         if (customConfig.instance && customConfig.instance.getBool('initCalendar')) {
            await initCalendar()
         }
      } catch (err) {
         console.error("no customConfig instance -- ", err)
      }
   }
   // Twitter support
   if (enabledServices.includes('twitter')) {
      import('../connectors/twitter').then(module => module.default())
   }
   // XREngine support
   if (enabledServices.includes('xrengine')) {
      import('../connectors/xrengine').then(module => module.default())
   }
   //  // Reddit support
   //  if (enabledServices.includes('reddit')) {
   //    import('../connectors/reddit').then(module => module.default())
   // }
   // // Facebook Page Messenger
   // if (enabledServices.includes('messenger')) {
   //    import('../connectors/messenger').then(module => module.default())
   // }
   // // Instagram support
   // if (enabledServices.includes('instagram')) {
   //    import('../connectors/instagram').then(module => module.default())
   // }
   // // Telegram support
   // if (enabledServices.includes('telegram')) {
   //    import('../connectors/telegram').then(module => module.default())
   // }
   // // Twilio support for SMS
   // if (enabledServices.includes('twilio')) {
   //    import('../connectors/twilio').then(module =>
   //       module.default(app, router)
   //    )
   // }
   // // Whatsapp support
   // if (enabledServices.includes('whatsapp')) {
   //    import('../connectors/whatsapp').then(module => module.default())
   // }
   // // Zoom support
   // if (enabledServices.includes('zoom')) {
   //    await require('./zoom/zoom-client').createZoomClient()
   // }
}
