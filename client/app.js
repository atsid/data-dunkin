import teams from './teams';
import config from './config';
// TODO: extract from retrieved lists at runtime
// const T1 = 1610612739;
// const T2 = 1610612744;
const settings = {
  ghosts: true,
};
// TODO: manage these groups directly within D3
let pGhosts = [];
let bGhosts = [];
let ballPositions;
let playerPositions;
let handle;
let frame = 0;
let t1;

function tick(data) {
  const svg = d3.select('svg');
  frame++;
  if (frame >= ballPositions.length) {
    frame = 0;
    pGhosts = [];
    bGhosts = [];
    svg.selectAll('.player-ghosts').remove();
    svg.selectAll('.ball-ghosts').remove();
  }
  const ball = ballPositions[frame];
  const players = playerPositions[frame].players;

  // update the game and shot clock displays from the ball data
  const min = Math.round(ball.gr / 60);
  const sec = ((ball.gr) % 60).toFixed(2);
  $('#gc').html(`${min}:${sec}`);
  $('#sc').html(`${ball.sc.toFixed(2)}`);

  // update the style for the currently active roster and player "with ball"
  $('.headshot').removeClass('active');
  $('.headshot').removeClass('has-ball');
  players.forEach((player) => {
    $(`#headshot-${player.pid}`).addClass('active');
  });
  const hasPid = 2544;
  $(`#headshot-${hasPid}`).addClass('has-ball');

  // update the circles for the ball position and size indicator
  svg.select('#ball')
    .data([ball])
    .attr('cx', d => (d.x * 10))
    .attr('cy', d => (d.y * 10));
  svg.select('#shot')
    .data([ball])
    .attr('r', d => d.r)
    .attr('cx', d => (d.x * 10))
    .attr('cy', d => (d.y * 10));

  // update the circles for the player positions
  svg.selectAll('.player')
    .data(players)
    .attr('cx', d => (d.x * 10))
    .attr('cy', d => (d.y * 10))
    .attr('r', (d) => {
      return d.pid === hasPid ? config.ballPlayerSize : config.playerSize;
    })
    .attr('fill-opacity', (d) => {
      return d.pid === hasPid ? config.ballPlayerOpacity : config.playerOpacity;
    })
    .attr('stroke', (d) => {
      if (d.pid === hasPid) {
        return config.ballPlayerColor;
      }
      return d.tid === t1 ? config.t1Stroke : config.t2Stroke;
    })
    .attr('fill', (d) => {
      if (d.pid === hasPid) {
        return config.ballPlayerColor;
      }
      return d.tid === t1 ? config.t1Fill : config.t2Fill;
    });

  // update the ghosts
  if (settings.ghosts) {
    pGhosts = pGhosts.concat(players);
    svg.selectAll('.player-ghosts')
      .data(pGhosts)
      .enter()
      .append('circle')
      .attr('class', 'player-ghosts')
      .attr('r', config.ghostSize)
      .attr('cx', d => d.x * 10)
      .attr('cy', d => d.y * 10)
      .attr('stroke', d => d.tid === t1 ? config.t1Stroke : config.t2Stroke)
      .attr('stroke-opacity', config.ghostOpacity)
      .attr('fill', '#fff')
      .attr('fill-opacity', 0.0);
    bGhosts = bGhosts.concat([ball]);
    svg.selectAll('.ball-ghost')
      .data([ball])
      .enter()
      .append('circle')
      .attr('class', 'ball-ghosts')
      .attr('r', d => d.r)
      .attr('cx', d => (d.x * 10))
      .attr('cy', d => (d.y * 10))
      .attr('stroke', config.ballStroke)
      .attr('stroke-opacity', config.ghostOpacity)
      .attr('fill', '#fff')
      .attr('fill-opacity', 0.0);
  } else {
    pGhosts = [];
    bGhosts = [];
    svg.selectAll('.player-ghosts').remove();
    svg.selectAll('.ball-ghosts').remove();
  }
}

function toggle() {
  if (handle > 0) {
    clearInterval(handle);
    handle = 0;
  } else {
    handle = setInterval(tick, config.interval);
  }
}

function initControls() {
  $('#toggle').click(toggle);
  $('#ghost-chk').change((e) => {
    settings.ghosts = e.target.checked;
  });
}

function init(ballData, playerData, teamData) {
  ballPositions = ballData;
  playerPositions = playerData;
  teams.init(teamData);
  t1 = teamData.home.teamid;
  frame = 0;
  const ball = ballPositions[frame];
  const players = playerPositions[frame].players;
  const svg = d3.select('svg');

  const all = [
    Object.assign({id: 'ball', className: 'ball'}, ball),
    Object.assign({id: 'shot', className: 'shot'}, ball),
  ].concat(players.map((player) => {
    return Object.assign({className: 'player'}, player);
  }));

  svg.selectAll('circle')
    .data(all)
    .enter()
    .append('circle')
    .attr('id', d => d.id)
    .attr('class', d => d.className);

  // setup the ball color with fixed size
  svg.select('#ball')
    .attr('r', config.ballSize)
    .attr('cx', d => (d.x * 10))
    .attr('cy', d => (d.y * 10))
    .attr('stroke', config.ballStroke)
    .attr('stroke-opacity', config.ballOpacity)
    .attr('fill', config.ballFill)
    .attr('fill-opacity', config.ballOpacity);

  // setup the ball color with variable size to indicate vertical position
  svg.select('#shot')
    .attr('r', d => d.r)
    .attr('cx', d => d.x * 10)
    .attr('cy', d => d.y * 10)
    .attr('stroke', config.shotStroke)
    .attr('stroke-opacity', config.shotOpacity)
    .attr('fill', config.shotFill)
    .attr('fill-opacity', config.shotOpacity);

  // setup the players with team colors and fixed size
  svg.selectAll('.player')
    .attr('r', config.playerSize)
    .attr('cx', d => d.x * 10)
    .attr('cy', d => d.y * 10)
    .attr('stroke', d => d.tid === t1 ? config.t1Stroke : config.t2Stroke)
    .attr('stroke-opacity', config.playerOpacity)
    .attr('fill', d => d.tid === t1 ? config.t1Fill : config.t2Fill)
    .attr('fill-opacity', config.playerOpacity);

  toggle();
}

(function() {
  initControls();
  $.ajax('/data/ball/1.json', {
    success: function(ballData) {
      $.ajax('/data/players/1.json', {
        success: function(playerData) {
          $.ajax('/data/teams/1.json', {
            success: function(teamData) {
              init(ballData, playerData, teamData);
            },
          });
        },
      });
    },
  });
}());
