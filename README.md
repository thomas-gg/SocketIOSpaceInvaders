# socket-io p5jsgame

## 1. Getting Started
An understanding of JavaScript and NodeJS will be helpful, but this is a simple implementation showing simple characteristics of the technologies so this makes for a great beginning to understanding multiplayer gameplay. This project provides a template for chat communication and gameplay with socket rooms (of strictly 2 people, the number of people is editable).

## 2. Install/Run
### Prerequisites:
Installed NPM and NodeJS
### Install:
```
cd <Your Chosen Directory>
git clone https://github.com/thomas-gg/SocketIOSpaceInvaders.git
npm install (to install express and other dependencies)
```
### Run:
```
npm run dev
OR
node index
```

## 3. Details
In order to begin the game you must have two clients connected. One way to do this is to have two Chrome windows open and both connect to the same room id (which can be any word you choose). 
If you have a mobile device which has chrome and is connected to the same wifi as what is running localhost, then you can connect to the game as well by typing "*<your ipaddress\>:3000*"

![EnterRoom](/public/Images/RoomEnterScreen.JPG)

![GamePlay](/public/Images/GamePlay.png)

### Author:
* Thomas Garry [GitHub](http://github.com/thomas-gg)

### Resources:
* [Socket.io Emitting Events Sheet (Extremely Important & Simple!)](https://socket.io/docs/emit-cheatsheet/)
* [Useful p5.js Examples](https://p5js.org/examples/)
* [Credit to Traversy Media (most html/css/utils/messages)](https://www.youtube.com/watch?v=jD7FnbI76Hg&t=1050s)
