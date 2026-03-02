const now = new Date();

const groups = [
  {
    id: 'g-123',
    title: 'Project Alpha',
    inviteOnly: true,
    members: [
      { id: 'u1', name: 'Alice', email: 'alice@example.com' },
      { id: 'u2', name: 'Bob', email: 'bob@example.com' }
    ],
    messages: [
      {
        id: 'm-1',
        author: { id: 'u1', name: 'Alice' },
  text: "Hello everyone! Let's start the first part of the project.",
        likedGreen: [{ id: 'u2', name: 'Bob' }],
        likedRed: [],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: 'm-2',
        author: { id: 'u2', name: 'Bob' },
  text: "I'll take care of the API part.",
        likedGreen: [],
        likedRed: [],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString()
      }
    ]
  },
  {
    id: 'g-456',
    title: 'Design Team',
    inviteOnly: true,
    members: [
      { id: 'u3', name: 'Charlie', email: 'charlie@example.com' }
    ],
    messages: [
      {
        id: 'm-3',
        author: { id: 'u3', name: 'Charlie' },
  text: 'Mockup version 2 is in the folder',
        likedGreen: [],
        likedRed: [],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString()
      }
    ]
  }
];

export default { groups };
