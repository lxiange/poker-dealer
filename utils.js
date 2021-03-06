function generateUUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

const INIT_CARDS = [
  "Ah",
  "2h",
  "3h",
  "4h",
  "5h",
  "6h",
  "7h",
  "8h",
  "9h",
  "10h",
  "Jh",
  "Qh",
  "Kh",
  "As",
  "2s",
  "3s",
  "4s",
  "5s",
  "6s",
  "7s",
  "8s",
  "9s",
  "10s",
  "Js",
  "Qs",
  "Ks",
  "Ad",
  "2d",
  "3d",
  "4d",
  "5d",
  "6d",
  "7d",
  "8d",
  "9d",
  "10d",
  "Jd",
  "Qd",
  "Kd",
  "Ac",
  "2c",
  "3c",
  "4c",
  "5c",
  "6c",
  "7c",
  "8c",
  "9c",
  "10c",
  "Jc",
  "Qc",
  "Kc"
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sortCardsFn = (a, b) => {
  const convToNum = c => {
    c = c.toLowerCase();
    c = c.slice(0, -1);
    c = c.replace("a", "14");
    c = c.replace("j", "11");
    c = c.replace("q", "12");
    c = c.replace("k", "13");
    return +c;
  };
  return convToNum(b) - convToNum(a);
};

function sortCards(cards) {
  if (!Array.isArray(cards)) {
    throw new Error("Cards is not array: ", cards);
  }
  for (let c of cards) {
    if (typeof c !== "string" || c.length < 2 || c.length > 3) {
      throw new Error("invalid card: " + c);
    }
  }
  cards.sort(sortCardsFn);
}

const generateCards = () => {
  const cards = [...INIT_CARDS];
  shuffle(cards);
  return cards;
};

const toRoomVO = room => {
  const res = { ...room };
  delete res.cards;
  return res;
};

module.exports = {
  generateUUID,
  shuffle,
  generateCards,
  sortCards,
  toRoomVO
};
