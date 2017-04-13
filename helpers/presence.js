const update = function (member){
  let guild = member.guild;
  let wow = guild.roles.find('name', 'Playing WoW');
  let hots = guild.roles.find('name', 'Playing HotS');
  let overwatch = guild.roles.find('name', 'Playing Overwatch');
  let games = guild.roles.find('name', 'Playing Games');
  if (!wow || !hots || !overwatch || !games) {
    return;
  }

  // Set role for WoW
  if (member.user.presence.game && member.user.presence.game.name === 'World of Warcraft') {
    member.addRole(wow);
  } else if (!member.user.presence.game && member.roles.has(wow.id)) {
    member.removeRole(wow);
  }
  // Set role for HotS
  if (member.user.presence.game && member.user.presence.game.name === 'Heroes of the Storm') {
    member.addRole(hots);
  } else if (!member.user.presence.game && member.roles.has(hots.id)) {
    member.removeRole(hots);
  }
  // Set role for Overwatch
  if (member.user.presence.game && member.user.presence.game.name === 'Overwatch') {
    member.addRole(overwatch);
  } else if (!member.user.presence.game && member.roles.has(overwatch.id)) {
    member.removeRole(overwatch);
  }
  // Set role for other games
  if (member.user.presence.game) {
    member.addRole(games);
  } else if (!member.user.presence.game && member.roles.has(games.id)) {
    member.removeRole(games);
  }
};

module.exports.update = update;
