const dao = require("../dao/dao");
const utils = require("../utils");

const ioHandler = io => {
  return socket => {
    const checkRoomId = async roomId => {
      console.log(`socket receive message from ${socket.id}, roomId:`, roomId);
      if (!roomId) {
        socket.emit("errMsg", "no roomId provided");
        return false;
      }
      const room = await dao.getRoom(roomId);
      if (!room) {
        socket.emit("errMsg", "no room found");
        return false;
      }
      return true;
    };
    socket.on("joinRoom", async roomId => {
      if (!checkRoomId(roomId)) {
        return;
      }
      const room = await dao.getRoom(roomId);
      if (room.members.includes(socket.id)) {
        io.to(roomId).emit("roomMsg", "joinRoomResp", utils.toRoomVO(room));
        return;
      }
      if (room.members > 15) {
        socket.emit("errMsg", "This room is full");
        return;
      }
      console.log(`new member ${socket.id} join in room`);
      socket.join(roomId);
      room.members.push(socket.id);
      const room2 = await dao.updateRoom(roomId, room);
      io.to(roomId).emit("roomMsg", "joinRoomResp", utils.toRoomVO(room2));
    });
    socket.on("reset", async roomId => {
      if (!checkRoomId(roomId)) {
        return;
      }
      const room = await dao.resetRoomStatus(roomId);
      io.to(roomId).emit("roomMsg", "resetResp", utils.toRoomVO(room));
    });
    socket.on("play", async roomId => {
      if (!checkRoomId(roomId)) {
        return;
      }
      const room = await dao.getRoom(roomId);
      if (!room.members.includes(socket.id)) {
        socket.emit("errMsg", "You are not the member of this room");
        return;
      }
      if (room.players.includes(socket.id)) {
        socket.emit("errMsg", "You are already the player of this room");
        return;
      }

      room.players.push(socket.id);
      const room2 = await dao.updateRoom(roomId, room);
      io.to(roomId).emit("roomMsg", "playResp", utils.toRoomVO(room2));
    });
    socket.on("leave", async roomId => {
      if (!checkRoomId(roomId)) {
        return;
      }

      const room = await dao.getRoom(roomId);
      const index = room.players.indexOf(socket.id);
      if (index < 0) {
        socket.emit("errMsg", "You are not the player of this room");
        return;
      }
      room.players.splice(index, 1);
      const room2 = await dao.updateRoom(roomId, room);
      io.to(roomId).emit("roomMsg", "leaveResp", utils.toRoomVO(room2));
    });
    socket.on("deal", async roomId => {
      if (!checkRoomId(roomId)) {
        return;
      }
      const room = await dao.getRoom(roomId);
      if (room.players.length === 0) {
        socket.emit("errMsg", "no players in the room!");
        return;
      }
      if (room.status > 3) {
        const room = await dao.resetRoomStatus(roomId);
        io.to(roomId).emit("roomMsg", "resetResp", utils.toRoomVO(room));
        return;
      }
      if (room.status === 0) {
        room.players.forEach(player => {
          const c1 = room.cards.pop();
          const c2 = room.cards.pop();
          const holeCards = [c1, c2];
          utils.sortCards(holeCards);
          console.log("hole cards:", holeCards);
          io.to(player).emit("playerMsg", holeCards);
        });
      } else if (room.status === 1) {
        // flip
        const c1 = room.cards.pop();
        const c2 = room.cards.pop();
        const c3 = room.cards.pop();
        console.log("flip cards:", c1, c2, c3);
        room.publicCards.push(c1);
        room.publicCards.push(c2);
        room.publicCards.push(c3);
      } else if (room.status === 2) {
        const c1 = room.cards.pop();
        console.log("flip card:", c1);
        room.publicCards.push(c1);
      } else if (room.status === 3) {
        const c1 = room.cards.pop();
        console.log("river card:", c1);
        room.publicCards.push(c1);
      } else {
        io.to(roomId).emit("errMsg", `unknow status ${room.status}`);
      }
      room.status++;
      const room2 = await dao.updateRoom(roomId, room);
      io.to(roomId).emit("roomMsg", "dealResp", utils.toRoomVO(room2));
    });

    socket.on("disconnecting", reason => {
      console.log("disconnecting", reason, socket.rooms);
      Object.keys(socket.rooms).forEach(async roomId => {
        const room = await dao.getRoom(roomId);
        if (!room) {
          return;
        }
        const playerIndex = room.players.indexOf(socket.id);
        if (playerIndex >= 0) {
          room.players.splice(playerIndex, 1);
        }
        const memberIndex = room.members.indexOf(socket.id);
        if (memberIndex >= 0) {
          room.members.splice(memberIndex, 1);
        }
        if (room.members.length === 0) {
          dao.deleteRoom(roomId); // todo: in production
          // dao.updateRoom(roomId, room);
        } else {
          dao.updateRoom(roomId, room);
          io.to(roomId).emit(
            "roomMsg",
            "disconnectingResp",
            utils.toRoomVO(room)
          );
        }
      });
    });
  };
};

module.exports = ioHandler;
