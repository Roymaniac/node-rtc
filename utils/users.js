const users = [];

// Joined user
function userJoin(id, username, room) {
  const user = { id, username, room };

  // add the user to the array
  users.push(user);

  // return the user
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// user exit chat
function userExit(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get room users
function getRoomUser(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userExit,
  getRoomUser,
};
