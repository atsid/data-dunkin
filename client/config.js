module.exports = {
  // actual NBA court dimenstions in feet
  courtWidth: 94,
  courtHeight: 50,
  // svg court image background from NBA, in pixels
  // TODO: pull from CSS
  width: 940,
  height: 500,
  interval: 120, // set FPS to match data readings of 25 FPS (/ 2 due to subsampling)
  ballSize: 4,
  playerSize: 4,
  ghostSize: 2,
  selectedPlayerColor: '#F1C40F',
  selectedPlayerSize: 8,
  selectedPlayerOpacity: 1.0,
  selectedPlayerStrokeWidth: 4,
  ballPlayerColor: '#C0392B',
  ballPlayerSize: 8,
  ballPlayerOpacity: 1.0,
  ballPlayerStrokeWidth: 4,
  ballStroke: '#D35400',
  strokeWidth: 1,
  ballFill: '#DC7633',
  ballOpacity: 0.9,
  shotStroke: '#444',
  shotFill: '#999',
  shotOpacity: 0.2,
  t1Stroke: '#9B59B6',
  t1Fill: '#C39BD3',
  t2Stroke: '#16A085',
  t2Fill: '#73C6B6',
  playerOpacity: 0.8,
  ghostOpacity: 0.2,
};
