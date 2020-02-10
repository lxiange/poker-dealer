const utils = require("../utils");

const newEmptyRoom = roomId => {
  return {
    id: roomId,
    status: 0,
    members: [],
    players: [],
    cards: utils.generateCards(),
    publicCards: []
  };
};

const ROOM_MAP = new Map();
ROOM_MAP.set("_test", newEmptyRoom("_test"));

const createRoom = async roomId => {
  if (ROOM_MAP.get(roomId)) {
    throw new Error(`room ${roomId} exists`);
  }
  ROOM_MAP.set(roomId, newEmptyRoom(roomId));
  return ROOM_MAP.get(roomId);
};

const getRoom = async roomId => {
  return ROOM_MAP.get(roomId);
};

const deleteRoom = async roomId => {
  return ROOM_MAP.delete(roomId);
};

const listRoom = async () => {
  console.log("call listRoom", ROOM_MAP);
  return [...ROOM_MAP.values()];
};

const updateRoom = async (roomId, room) => {
  ROOM_MAP.set(roomId, room);
  return ROOM_MAP.get(roomId);
};

const resetRoomStatus = async roomId => {
  const room = ROOM_MAP.get(roomId);
  room.status = 0;
  room.cards = utils.generateCards();
  room.publicCards = [];
  return updateRoom(roomId, room);
};
module.exports = {
  createRoom,
  getRoom,
  deleteRoom,
  listRoom,
  updateRoom,
  resetRoomStatus
};
