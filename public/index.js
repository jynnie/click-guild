let quest = -1;
const socket = io();

const loadQuests = function() {
  $.getJSON("/quests", res => {
    $("#quests").text("");
    res.forEach(quest => {
      $("#quests").append($("<div>" + quest._id + "</div>"));
    });
  });
};

const joinQuest = function(newQuest) {
  socket.emit("join", {
    leave: quest,
    join: newQuest
  });
  quest = newQuest;
};

const updateListings = (id, partial) => {
  console.log($(`#${id}`).length);
  if ($(`#${id}`).length == 0) {
    $("#quests").append($(partial));
  }
};

$(() => {
  //loadQuests();

  $("#clicker").click(() => {
    socket.emit("click", quest);
  });

  $("#quest-choose").click(() => {
    const newQuest = $("#quest").val();
    joinQuest(newQuest);
  });

  $("#find-quest").click(() => {
    socket.emit("find quest", quest);
  });

  socket.on("clickUpdate", upd => {
    $("#count").text(upd.clicks);
    $("#progress").val(upd.clicks);
  });

  socket.on("new quest", (id, partial) => {
    updateListings(id, partial);
  });

  socket.on("active quest", nq => {
    //loadQuests();
    $("#quest-info").text(
      `Current quest: click ${nq.target} times to ${nq.descript}`
    );
    $("#quest-actives").text(`${nq.clickers} players are on this quest`);
    $("#quest-code").text(
      `Tell your friends to join this quest with the code ${nq._id}`
    );
    $("#count").text(nq.clicks);
    $("#progress").val(nq.clicks);
    $("#progress").attr({ max: nq.target });
    quest = nq._id;
  });
});
