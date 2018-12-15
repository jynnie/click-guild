let quest = -1;

$(() => {
  const socket = io();
  $("#clicker").click(() => {
    socket.emit("click", quest);
  });

  $("#quest-choose").click(() => {
     const newQuest = $("#quest").val();
     socket.emit("join", { 
       leave: quest,
       join: newQuest 
     });
     quest = newQuest;
  });

  socket.on("clickUpdate", (upd) => {
    $("#count").text(upd.clicks);
  });
});
