let quest = -1;

$(() => {
  const socket = io();
  $("#clicker").click(() => {
    socket.emit("click", quest);
  });

  $("#quest-choose").click(() => {
     quest = $("#quest").val();
     socket.emit("join", quest);
  });

  socket.on("clickUpdate", (upd) => {
    $("#count").text(upd.clicks);
  });
});
