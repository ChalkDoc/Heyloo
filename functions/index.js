const functions = require('firebase-functions');
var Filter = require('bad-words');

exports.sanitizeName = functions.database
  .ref('/games/{gameId}/player_list/{playerId}')
  .onWrite(event => {
    const player = event.data.val();

    // have we checked this name before?
    // Coded added because without it we'd create an infinite loop
    if (player.sanitized) {
      return
    }

    // Nope. let's check it out
    filter = new Filter();
    if (filter.isProfane(player.name)) {
      badword = player.name;
      player.name = filter.clean(player.name);
      console.log("Filtered name in game=" +
        event.params.gameId +
        ", player name:" +
        badword +
        " changed to:" +
        player.name)
    }

    player.sanitized = true;
    // This returns a promise
    return event.data.ref.set(player)
  })