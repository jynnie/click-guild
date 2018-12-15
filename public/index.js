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

  $("#find-quest").click(() => {
    socket.emit("find quest", quest);
  });

  socket.on("clickUpdate", upd => {
    $("#count").text(upd.clicks);
  });

  socket.on("active quest", nq => {
    $("#quest-info").text(
      `Current quest: click ${nq.target} times to ${nq.descript}`
    );
    $("#quest-code").text(`
      Tell your friends to join this quest with the code ${nq._id}`);
    $("#count").text(nq.clicks);
    quest = nq._id;
  });
});
