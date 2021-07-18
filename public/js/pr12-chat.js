const socket = io("/"); // This means your client will always be connected to your server, locally or on Heroku.

const chatBox = document.getElementById("chatBox");
const messageEl = document.getElementById("message");
const user = document.getElementById("user");

socket.on("new-message", (data) => {
  addMessage(data, false);
});

const getTime = () => {
  const d = new Date();

  const hours = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");

  return `${hours}:${mins}`;
};

// Post message to board
const postMessage = () => {
  /***********************************
   *         YOUR CODE HERE          *
   ***********************************/
  const message = messageEl.value.trim();
  const from = user.value;
  const time = getTime();

  const data = { message, from, time };

  // Emmit message to server
  socket.emit("message", data);

  // Add message to chatbox
  addMessage(data, true);

  // Clear input
  messageEl.value = "";
};

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, user = false) => {
  /***********************************
   *         YOUR CODE HERE          *
   ***********************************/
  chatBox.innerHTML += `
    <li class="message${user ? "uMessage" : ""}">
        ${data.from} @${data.time}: ${data.message}
    </li>
  `;
};
