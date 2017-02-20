import config from './config';
module.exports = {
  init(teamData) {
    function p(player) {
      return `<div style="display: inline-block;" id="${player.playerid}" tooltip="${player.firstname} ${player.lastname}">
                <img id="headshot-${player.playerid}" class="headshot" src="./client/images/headshots/${player.playerid}.png"
                    title="${player.firstname} ${player.lastname}"
                />
            </div>`;
    }

    const homes = teamData.home.players.map(p);
    $('#home').html(`<h3 style="color: ${config.t1Fill};">${teamData.home.name}</h3>
                    ${homes.join(' ')}
                  `);
    const visitors = teamData.visitor.players.map(p);
    $('#visitor').html(`<h3 style="color: ${config.t2Fill};">${teamData.visitor.name}</h3>
                    ${visitors.join(' ')}
                     `);
  },
};
