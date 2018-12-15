console.log("henlo");

$(() => {
  const socket = io();
  $("#clicker").click(() => {
    socket.emit("click", 0);
  });

  socket.on("clickUpdate", (upd) => {
    $("#count").text(upd.clicks);
  });
});
