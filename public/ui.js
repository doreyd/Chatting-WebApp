let data = {
  kayla: [
    ["receiver", "this is a response to the test", true],
    ["sender", "this is a test", true],
    ["sender", "this", true],
    ["receiver", "hi", true],
    ["receiver", "how are you", true],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd", false],
    ["sender", "You wanna grab a coffee sometime next week ", true]
  ],
  dawn: [
    ["sender", "how was the book i gave you", true],
    ["receiver", "I really liked it !! ", true],
    ["sender", "I think i will be buying that car we saw last time. ", true]
  ]
};

// Counting how many messages correspond to a certain type and a certain state
const statusCount = (messages, type, state) => {
  return messages.reduce((sum, x) => {
    return (sum = x[0] === type && x[2] === state ? ++sum : sum);
  }, 0);
};

// Changing the state of messages from read (state=true) to unread (state=false) and vice versa
const msgStatus = (messages, type, state) => {
  return messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));
};

console.log(statusCount(data["kayla"], "sender", false));
