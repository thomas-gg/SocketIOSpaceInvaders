const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// join the room
socket.emit('joinRoom', {username,room});

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// message from server
socket.on('message', message=> {
    //console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', event => {
    event.preventDefault();
    
    // get input text
    const msg = event.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    // Clear input
    event.target.elements.msg.value = '';
    
    // focus on input
    event.target.elements.msg.focus();
});


// output to DOM
function outputMessage(message){
    const div =  document.createElement('div');
    div.classList.add('message');
   /*div.innerHTML = `<p class="meta">Brad <span>meow</span></p>
    <p class="text">
        ${message}
    </p>`;*/
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

// add roomName to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers (users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
