'use strict'

module.exports = {
  async up(queryInterface) {
    const chains = await queryInterface.rawSelect(
      'chains',
      {
        where: {},
        plain: false,
      },
      ['id']
    )
    const configs = await queryInterface.rawSelect(
      'config',
      {
        where: {},
        plain: false,
      },
      ['id']
    )
    // eslint-disable-next-line camelcase
    const client_settings = await queryInterface.rawSelect(
      'client_settings',
      {
        where: {},
        plain: false,
      },
      ['id']
    )

    if (configs.length <= 0) {
      await queryInterface.bulkInsert(
        'config',
        [
          { key: 'agent', value: 'Thales' },
          { key: 'openai_api_key', value: '' },
          { key: 'google_project_id', value: '' },
          { key: 'hf_api_token', value: '' },
          { key: 'use_gptj', value: '' },
          { key: 'editMessageMaxCount', value: '10' },
          { key: 'botNameRegex', value: '((?:digital|being)(?: |$))' },
          { key: 'chatHistoryMessagesCount', value: '20' },
          { key: 'botName', value: 'thoth' },
          { key: 'botNameHandler', value: 'thoth' },
          { key: 'digitalBeingsOnly', value: 'false' },
          { key: 'fastMode', value: 'false' },
          { key: 'discord_calendar_channel', value: '' },
          { key: 'initCalendar', value: 'false' },
          { key: 'discussion_channel_topics', value: '' },
          { key: 'use_logtail', value: 'false' },
          { key: 'logtail_key', value: '' },
          { key: 'fps', value: '60' },
        ],
        {}
      )
    }

    if (client_settings.length <= 0) {
      await queryInterface.bulkInsert(
        'client_settings',
        [
          {
            client: 'discord',
            name: 'discord_api_token',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterConsumerKey',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterConsumerSecret',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterAccessToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterAccessTokenSecret',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'ngrokToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterWebhookPort',
            type: 'string',
            defaultvalue: '3002',
          },
          {
            client: 'twitter',
            name: 'twitterID',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterBearerToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twitter',
            name: 'twitterTweetRules',
            type: 'string',
            defaultvalue: 'digital,being,digital being',
          },
          {
            client: 'twilio',
            name: 'twilioAccountSID',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twilio',
            name: 'twiolioPhoneNumber',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'twilio',
            name: 'twiolioAuthToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'telegram',
            name: 'telegramBotToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'xrengine',
            name: 'xrEngineURL',
            type: 'string',
            defaultvalue: 'https://dev.theoverlay.io/location/bot',
          },
          {
            client: 'whatsapp',
            name: 'whatsappBotName',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'harmony',
            name: 'harmonyURL',
            type: 'string',
            defaultvalue: 'https://dev.theoverlay.io/harmony',
          },
          {
            client: 'zoom',
            name: 'zoomInvitationLink',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'zoom',
            name: 'zoomPassword',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'messenger',
            name: 'messengerToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'messenger',
            name: 'messengerVerifyToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'reddit',
            name: 'redditAppID',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'reddit',
            name: 'redditAppSecretID',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'reddit',
            name: 'redditUsername',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'reddit',
            name: 'redditPassword',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'reddit',
            name: 'redditOAthToken',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'instagram',
            name: 'instagramUsername',
            type: 'string',
            defaultvalue: '',
          },
          {
            client: 'instagram',
            name: 'instagramPassword',
            type: 'string',
            defaultvalue: '',
          },
        ],
        {}
      )
    }

    if (chains.length <= 0) {
      await queryInterface.bulkInsert(
        'chains',
        [
          {
            id: '3599a8fa-4e3b-4e91-b329-43a907780ea7',
            name: 'default',
            user_id: 0,
            game_state: '{}',
            created_at: new Date(),
            updated_at: new Date(),
            chain: `{"id": "demo@0.1.0", "nodes": {"4": {"id": 4, "data": {"name": "DefaultOutput", "socketKey": "49cc040d-4368-4a00-88f8-012638d39eab", "dataControls": {"name": {"expanded": true}, "sendToPlaytest": {"expanded": true}}}, "name": "Output", "inputs": {"input": {"connections": [{"data": {"pins": []}, "node": 11, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 5, "output": "trigger"}, {"data": {"pins": []}, "node": 11, "output": "trigger"}]}}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 6, "input": "trigger"}]}}, "position": [-472.3212364212005, -479.86350854927025]}, "5": {"id": 5, "data": {"name": "DefaultTrigger", "socketKey": "8626681b-98d6-4bc8-8814-ddcc13ba0ca3", "dataControls": {"name": {"expanded": true}}}, "name": "Module Trigger In", "inputs": {}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 4, "input": "trigger"}]}}, "position": [-975.2524599611861, -508.09238341659784]}, "6": {"id": 6, "data": {"inputs": [{"name": "Outputs", "taskType": "output", "socketKey": "outputs", "socketType": "anySocket", "connectionType": "input"}], "dataControls": {"inputs": {"expanded": true}}}, "name": "State Write", "inputs": {"outputs": {"connections": [{"data": {"pins": []}, "node": 11, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 4, "output": "trigger"}]}}, "outputs": {}, "position": [1.5406570315050665, -591.8506571344452]}, "11": {"id": 11, "data": {"name": "TestInput", "text": "Input text here", "outputs": [{"name": "Playtest trigger", "taskType": "option", "socketKey": "trigger", "socketType": "triggerSocket"}], "socketKey": "cd6fcc4e-d26b-4be5-9663-6b8f874de913", "dataControls": {"name": {"expanded": true}, "useDefault": {"expanded": true}, "playtestToggle": {"expanded": true}}, "playtestToggle": {"outputs": [{"name": "Playtest trigger", "taskType": "option", "socketKey": "trigger", "socketType": "triggerSocket"}], "receivePlaytest": true}}, "name": "Universal Input", "inputs": {}, "outputs": {"output": {"connections": [{"data": {"pins": []}, "node": 4, "input": "input"}, {"data": {"pins": []}, "node": 6, "input": "outputs"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 4, "input": "trigger"}]}}, "position": [-970.8854735683269, -772.3573697507977]}}}`,
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'deployed_spells',
        [
          {
            id: 'a13b41e8-d2bd-4258-a259-32f426e98cdd',
            name: 'default',
            version: 1,
            user_id: 0,
            created_at: new Date(),
            updated_at: new Date(),
            chain: `{"id": "demo@0.1.0", "nodes": {"2": {"id": 2, "data": {"name": "DefaultInput", "text": "Input text here", "outputs": [], "socketKey": "cd6fcc4e-d26b-4be5-9663-6b8f874de913", "dataControls": {"name": {"expanded": true}, "useDefault": {"expanded": true}, "playtestToggle": {"expanded": true}}, "playtestToggle": {"outputs": [], "receivePlaytest": false}}, "name": "Universal Input", "inputs": {}, "outputs": {"output": {"connections": [{"data": {"pins": []}, "node": 4, "input": "input"}, {"data": {"pins": []}, "node": 6, "input": "outputs"}]}}, "position": [-797.200674002495, -505.3683553966747]}, "4": {"id": 4, "data": {"name": "DefaultOutput", "socketKey": "49cc040d-4368-4a00-88f8-012638d39eab", "dataControls": {"name": {"expanded": true}, "sendToPlaytest": {"expanded": true}}}, "name": "Output", "inputs": {"input": {"connections": [{"data": {"pins": []}, "node": 2, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 5, "output": "trigger"}]}}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 6, "input": "trigger"}]}}, "position": [-386.66075298933436, -456.18278434527997]}, "5": {"id": 5, "data": {"name": "DefaultTrigger", "socketKey": "8626681b-98d6-4bc8-8814-ddcc13ba0ca3", "dataControls": {"name": {"expanded": true}}}, "name": "Module Trigger In", "inputs": {}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 4, "input": "trigger"}]}}, "position": [-796.4439288922381, -268.1050207361015]}, "6": {"id": 6, "data": {"inputs": [{"name": "Outputs", "taskType": "output", "socketKey": "outputs", "socketType": "anySocket", "connectionType": "input"}], "dataControls": {"inputs": {"expanded": true}}}, "name": "State Write", "inputs": {"outputs": {"connections": [{"data": {"pins": []}, "node": 2, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 4, "output": "trigger"}]}}, "outputs": {}, "position": [5.466299235514526, -614.530153771113]}}}`,
          },
        ],
        {}
      )
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('chains', null, {
      id: '3599a8fa-4e3b-4e91-b329-43a907780ea7',
    })
    await queryInterface.bulkDelete('deployed_spells', null, {
      id: 'a13b41e8-d2bd-4258-a259-32f426e98cdd',
    })
  },
}
