// actual NBA court dimenstions in feet
const COURT_WIDTH = 94;
const COURT_HEIGHT = 50;
// svg court image background from NBA, in pixels
const WIDTH = 940;
const HEIGHT = 500;
const INTERVAL = 40; // set FPS to match data readings
const palette = {
  ballStroke: '#D35400',
  ballFill: '#DC7633',
  ballOpacity: 0.9,
  shotStroke: '#444',
  shotFill: '#999',
  shotOpacity: 0.2,
  t1Stroke: '',
  t1Fill: '',
  t2Stroke: '',
  t2Fill: '',
};
let ballPositions;
let handle;
let frame = 0;

function tick(data) {
  frame++;
  if (frame >= ballPositions.length) {
    frame = 0;
  }
  const ball = ballPositions[frame];

  // update the game and shot clock displays from the ball data
  $('#gc').html(`${ball.gr}`);
  $('#sc').html(`${ball.sc}`);

  const svg = d3.select('svg');
  // update the circles for the ball position

  svg.select('#ball')
    .data([ball])
    .attr('cx', d => (d.x * 10))
    .attr('cy', d => (d.y * 10));
  svg.select('#shot')
    .data([ball])
    .attr('r', d => d.r)
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

(function init() {
  $('#toggle').click(toggle);
  $.ajax('/data/ball/1.json', {
    success: function(data) {
      frame = 0;
      ballPositions = data;
      const ball = ballPositions[frame];
      const svg = d3.select('svg');
      console.log(data);
      const pair = [
        Object.assign({id: 'ball'}, ball),
        Object.assign({id: 'shot'}, ball),
      ];
      svg.selectAll('circle')
        .data(pair)
        .enter()
        .append('circle')
        .attr('id', d => d.id);

      // setup the ball color with fixed size
      svg.select('#ball')
        .attr('r', 4)
        .attr('cx', d => (d.x * 10))
        .attr('cy', d => (d.y * 10))
        .attr('stroke', palette.ballStroke)
        .attr('stroke-opacity', palette.ballOpacity)
        .attr('fill', palette.ballFill)
        .attr('fill-opacity', palette.ballOpacity);

      svg.select('#shot')
        .attr('r', d => d.r)
        .attr('cx', d => d.x * 10)
        .attr('cy', d => d.y * 10)
        .attr('stroke', palette.shotStroke)
        .attr('stroke-opacity', palette.shotOpacity)
        .attr('fill', palette.shotFill)
        .attr('fill-opacity', palette.shotOpacity);

      toggle();
    },
  });
}());
