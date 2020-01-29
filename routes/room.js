const dao = require("../dao/dao");
const utils = require("../utils");

var express = require("express");
var router = express.Router();

const createRoom = async roomId => {
    if (!roomId) {
        roomId = utils.generateUUID();
    }
    return dao.createRoom(roomId);
};

router.post("/createRoom", async (req, res, next) => {
    try {
        const room = await createRoom(req.body.roomId);
        res.json(room);
    } catch (e) {
        next(e);
    }
});

router.post("/enterRoom", async (req, res, next) => {
    const roomId = req.body.roomId;
    const room = await dao.getRoom(roomId);
    if (room) {
        res.json(room);
    } else {
        next(new Error(`room ${roomId} not found`));
    }
});

router.get("/listRoom", async (req, res, next) => {
    const roomList = await dao.listRoom();
    res.json(roomList);
});

module.exports = router;
