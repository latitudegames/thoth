'use strict'

module.exports = {
  async up(queryInterface) {
    const chains = await queryInterface.rawSelect(
      'chains',
      {
        where: {
          name: 'default',
        },
        plain: false,
      },
      ['id']
    )

    if (chains.length > 0) {
      console.log('Seeder found default chain, skipping re-seed')
    } else {
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
            chain: `{"id": "demo@0.1.0", "nodes": {"1": {"id": 1, "data": {"name": "Input", "text": "Input text here", "outputs": [], "socketKey": "98d25387-d2b3-493c-b61c-ec20689fb101", "dataControls": {"name": {"expanded": true}, "useDefault": {"expanded": true}, "playtestToggle": {"expanded": true}}, "playtestToggle": {"outputs": [], "receivePlaytest": false}}, "name": "Universal Input", "inputs": {}, "outputs": {"output": {"connections": [{"data": {"pins": []}, "node": 5, "input": "input"}, {"data": {"pins": []}, "node": 6, "input": "outputs"}]}}, "position": [-558.857827667479, -287.8964566771861]}, "2": {"id": 2, "data": {"name": "Trigger", "socketKey": "5ce31be1-de07-4669-8ca6-61463cb2c74d", "dataControls": {"name": {"expanded": true}}}, "name": "Module Trigger In", "inputs": {}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 5, "input": "trigger"}, {"data": {"pins": []}, "node": 6, "input": "trigger"}]}}, "position": [-570.1478847920745, -18.81676187432589]}, "3": {"id": 3, "data": {"socketKey": "6e5d5852-b5a6-410c-8f8c-37ea5a32532b"}, "name": "Module Trigger Out", "inputs": {"trigger": {"connections": []}}, "outputs": {}, "position": [83.9492364030962, -61.88793070021913]}, "5": {"id": 5, "data": {"name": "Output", "socketKey": "1a13b0de-0ec2-40b9-b139-0e44674cf090", "dataControls": {"name": {"expanded": true}}}, "name": "Module Output", "inputs": {"input": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [103.51577963166771, -267.8995017050695]}, "6": {"id": 6, "data": {"inputs": [{"name": "outputs", "taskType": "output", "socketKey": "outputs", "socketType": "anySocket", "connectionType": "input"}], "dataControls": {"inputs": {"expanded": true}}}, "name": "State Write", "inputs": {"outputs": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [59.65794741138853, -516.9197232909086]}}}`,
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
  },
}
