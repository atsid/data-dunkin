// actual NBA court dimenstions in feet
const COURT_WIDTH = 94;
const COURT_HEIGHT = 50;
// svg court image background from NBA, in pixels
const WIDTH = 940;
const HEIGHT = 500;
const INTERVAL = 40; // set FPS to match data readings
const T1 = 1610612739;
const T2 = 1610612744;
const BALL_SIZE = 4;
const PLAYER_SIZE = 4;
const palette = {
  ballStroke: '#D35400',
  ballFill: '#DC7633',
  ballOpacity: 0.9,
  shotStroke: '#444',
  shotFill: '#999',
  shotOpacity: 0.2,
  t1Stroke: '#9B59B6',
  t1Fill: '#C39BD3',
  t2Stroke: '#16A085',
  t2Fill: '#73C6B6',
  playerOpacity: 0.7,
};
let ballPositions;
let playerPositions;
let handle;
let frame = 0;

function tick(data) {
  frame++;
  if (frame >= ballPositions.length) {
    frame = 0;
  }
  const ball = ballPositions[frame];
  const players = playerPositions[frame].players;

  // update the game and shot clock displays from the ball data
  $('#gc').html(`${ball.gr}`);
  $('#sc').html(`${ball.sc}`);

  const svg = d3.select('svg');
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
    .attr('cy', d => (d.y * 10));
}

function toggle() {
  if (handle > 0) {
    clearInterval(handle);
    handle = 0;
  } else {
    handle = setInterval(tick, INTERVAL);
  }
}

function init(ballData, playerData) {
  ballPositions = ballData;
  playerPositions = playerData;
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
  console.log(all);
  svg.selectAll('circle')
    .data(all)
    .enter()
    .append('circle')
    .attr('id', d => d.id)
    .attr('class', d => d.className);

  // setup the ball color with fixed size
  svg.select('#ball')
    .attr('r', BALL_SIZE)
    .attr('cx', d => (d.x * 10))
    .attr('cy', d => (d.y * 10))
    .attr('stroke', palette.ballStroke)
    .attr('stroke-opacity', palette.ballOpacity)
    .attr('fill', palette.ballFill)
    .attr('fill-opacity', palette.ballOpacity);

  // setup the ball color with variable size to indicate vertical position
  svg.select('#shot')
    .attr('r', d => d.r)
    .attr('cx', d => d.x * 10)
    .attr('cy', d => d.y * 10)
    .attr('stroke', palette.shotStroke)
    .attr('stroke-opacity', palette.shotOpacity)
    .attr('fill', palette.shotFill)
    .attr('fill-opacity', palette.shotOpacity);

  // setup the players with team colors and fixed size
  svg.selectAll('.player')
    .attr('r', d => {
      console.log(d);
      return PLAYER_SIZE;
    })
    .attr('cx', d => d.x * 10)
    .attr('cy', d => d.y * 10)
    .attr('stroke', d => d.tid === T1 ? palette.t1Stroke : palette.t2Stroke)
    .attr('stroke-opacity', palette.playerOpacity)
    .attr('fill', d => d.tid === T1 ? palette.t1Fill : palette.t2Fill)
    .attr('fill-opacity', palette.playerOpacity);

  toggle();
}

(function() {
  $('#toggle').click(toggle);
  $.ajax('/data/ball/1.json', {
    success: function(ballData) {
      $.ajax('/data/players/1.json', {
        success: function(playerData) {
          init(ballData, playerData);
        },
      });
    },
  });
}());
