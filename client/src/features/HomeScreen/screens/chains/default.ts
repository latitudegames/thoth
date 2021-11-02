const chain = {
  id: 'demo@0.1.0',
  nodes: {
    '123': {
      id: 123,
      data: {
        socketKey: 'a2baf53a-d604-40cb-a102-609448c3f67c',
        dataControls: {
          name: {
            expanded: true,
          },
        },
        name: 'text',
      },
      inputs: {},
      outputs: {
        output: {
          connections: [],
        },
      },
      position: [-1555.0656080696986, -286.76976427120616],
      name: 'Module Input',
    },
    '124': {
      id: 124,
      data: {
        socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
        dataControls: {
          name: {
            expanded: true,
          },
        },
        name: 'default',
      },
      inputs: {},
      outputs: {
        trigger: {
          connections: [],
        },
      },
      position: [-1555.4724883179474, -132.7648214211178],
      name: 'Module Trigger In',
    },
    '125': {
      id: 125,
      data: {
        socketKey: '048b7f6e-c155-4958-975a-c7698fc7e84d',
        dataControls: {
          name: {
            expanded: true,
          },
        },
        name: 'result',
      },
      inputs: {
        input: {
          connections: [],
        },
        trigger: {
          connections: [],
        },
      },
      outputs: {},
      position: [-601.1864065822252, -230.90176968690835],
      name: 'Module Output',
    },
  },
}

export default chain
