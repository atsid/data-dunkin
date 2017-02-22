/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _teams = __webpack_require__(2);
	
	var _teams2 = _interopRequireDefault(_teams);
	
	var _config = __webpack_require__(3);
	
	var _config2 = _interopRequireDefault(_config);
	
	// TODO: extract from retrieved lists at runtime
	// const T1 = 1610612739;
	// const T2 = 1610612744;
	var settings = {
	  ghosts: true,
	  speed: 1
	};
	// TODO: manage these groups directly within D3
	var pGhosts = [];
	var bGhosts = [];
	var ballPositions = undefined;
	var playerPositions = undefined;
	var handle = undefined;
	var frame = 0;
	var t1 = undefined;
	var selectedPid = 0;
	
	function reset() {
	  frame = 0;
	  pGhosts = [];
	  bGhosts = [];
	  var svg = d3.select('svg');
	  svg.selectAll('.player-ghosts').remove();
	  svg.selectAll('.ball-ghosts').remove();
	}
	
	function toggle() {
	  if (handle > 0) {
	    clearInterval(handle);
	    handle = 0;
	  } else {
	    handle = setInterval(tick, _config2['default'].interval / settings.speed);
	  }
	}
	
	function tick() {
	  var svg = d3.select('svg');
	  frame++; // = Math.round(frame + (settings.speed / 2));
	  if (frame >= ballPositions.length) {
	    toggle();
	  }
	
	  var ball = ballPositions[frame];
	  var players = playerPositions[frame].players;
	
	  // update the game and shot clock displays from the ball data
	  var min = Math.round(ball.gr / 60);
	  var sec = (ball.gr % 60).toFixed(2);
	  $('#gc').html(min + ':' + sec);
	  // no shot clock during free throws
	  if (ball.sc) {
	    $('#sc').html('' + ball.sc.toFixed(2));
	  }
	
	  // update the style for the currently active roster and player "with ball"
	  $('.headshot').removeClass('active has-ball selected');
	  players.forEach(function (player) {
	    $('#headshot-' + player.pid).addClass('active');
	  });
	  var hasPid = ball.pid;
	  $('#headshot-' + hasPid).addClass('has-ball');
	  $('#headshot-' + selectedPid).addClass('selected');
	
	  // update the circles for the ball position and size indicator
	  svg.select('#ball').data([ball]).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  });
	  svg.select('#shot').data([ball]).attr('r', function (d) {
	    return d.r;
	  }).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  });
	
	  // update the circles for the player positions
	  svg.selectAll('.player').data(players).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  }).attr('r', function (d) {
	    if (d.pid === hasPid) {
	      return _config2['default'].ballPlayerSize;
	    }
	    if (d.pid === selectedPid) {
	      return _config2['default'].selectedPlayerSize;
	    }
	    return _config2['default'].playerSize;
	  }).attr('fill-opacity', function (d) {
	    if (d.pid === hasPid) {
	      return _config2['default'].ballPlayerOpacity;
	    }
	    if (d.pid === selectedPid) {
	      return _config2['default'].selectedPlayerOpacity;
	    }
	    return _config2['default'].playerOpacity;
	  }).attr('stroke', function (d) {
	    if (d.pid === hasPid) {
	      return _config2['default'].ballPlayerColor;
	    }
	    if (d.pid === selectedPid) {
	      return _config2['default'].selectedPlayerColor;
	    }
	    return d.tid === t1 ? _config2['default'].t1Stroke : _config2['default'].t2Stroke;
	  }).attr('stroke-width', function (d) {
	    if (d.pid === hasPid) {
	      return _config2['default'].ballPlayerStrokeWidth;
	    }
	    if (d.pid === selectedPid) {
	      return _config2['default'].selectedPlayerStrokeWidth;
	    }
	    return _config2['default'].strokeWidth;
	  }).attr('fill', function (d) {
	    return d.tid === t1 ? _config2['default'].t1Fill : _config2['default'].t2Fill;
	  });
	
	  // update the ghosts
	  if (settings.ghosts) {
	    pGhosts = pGhosts.concat(players);
	    svg.selectAll('.player-ghosts').data(pGhosts).enter().append('circle').attr('class', 'player-ghosts').attr('r', _config2['default'].ghostSize).attr('cx', function (d) {
	      return d.x;
	    }).attr('cy', function (d) {
	      return d.y;
	    }).attr('stroke', function (d) {
	      return d.tid === t1 ? _config2['default'].t1Stroke : _config2['default'].t2Stroke;
	    }).attr('stroke-opacity', _config2['default'].ghostOpacity).attr('fill', '#fff').attr('fill-opacity', 0.0);
	    bGhosts = bGhosts.concat([ball]);
	    svg.selectAll('.ball-ghost').data([ball]).enter().append('circle').attr('class', 'ball-ghosts').attr('r', function (d) {
	      return d.r;
	    }).attr('cx', function (d) {
	      return d.x;
	    }).attr('cy', function (d) {
	      return d.y;
	    }).attr('stroke', _config2['default'].ballStroke).attr('stroke-opacity', _config2['default'].ghostOpacity).attr('fill', '#fff').attr('fill-opacity', 0.0);
	  } else {
	    pGhosts = [];
	    bGhosts = [];
	    svg.selectAll('.player-ghosts').remove();
	    svg.selectAll('.ball-ghosts').remove();
	  }
	}
	
	function initControls() {
	  $('#toggle').click(toggle);
	  $('#reset').click(reset);
	  $('#ghost-chk').change(function (e) {
	    settings.ghosts = e.target.checked;
	  });
	  $('.speed').click(function (e) {
	    toggle();
	    settings.speed = e.target.value;
	    toggle();
	  });
	  $('.headshot').click(function (e) {
	    var newPid = e.target.id.replace('headshot-', '') * 1;
	    if (newPid === selectedPid) {
	      selectedPid = 0;
	    } else {
	      selectedPid = newPid;
	    }
	  });
	}
	
	function init(ballData, playerData, teamData) {
	  console.log(ballData.length + ' ball readings');
	  console.log(playerData.length + ' player readings');
	  ballPositions = ballData;
	  playerPositions = playerData;
	  _teams2['default'].init(teamData);
	  t1 = teamData.home.teamid;
	  frame = 0;
	  var ball = ballPositions[frame];
	  var players = playerPositions[frame].players;
	  var svg = d3.select('svg');
	
	  var all = [Object.assign({ id: 'ball', className: 'ball' }, ball), Object.assign({ id: 'shot', className: 'shot' }, ball)].concat(players.map(function (player) {
	    return Object.assign({ className: 'player' }, player);
	  }));
	
	  svg.selectAll('circle').data(all).enter().append('circle').attr('id', function (d) {
	    return d.id;
	  }).attr('class', function (d) {
	    return d.className;
	  });
	
	  // setup the ball color with fixed size
	  svg.select('#ball').attr('r', _config2['default'].ballSize).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  }).attr('stroke', _config2['default'].ballStroke).attr('stroke-opacity', _config2['default'].ballOpacity).attr('fill', _config2['default'].ballFill).attr('fill-opacity', _config2['default'].ballOpacity);
	
	  // setup the ball color with variable size to indicate vertical position
	  svg.select('#shot').attr('r', function (d) {
	    return d.r;
	  }).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  }).attr('stroke', _config2['default'].shotStroke).attr('stroke-opacity', _config2['default'].shotOpacity).attr('fill', _config2['default'].shotFill).attr('fill-opacity', _config2['default'].shotOpacity);
	
	  // setup the players with team colors and fixed size
	  svg.selectAll('.player').attr('r', _config2['default'].playerSize).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  }).attr('stroke', function (d) {
	    return d.tid === t1 ? _config2['default'].t1Stroke : _config2['default'].t2Stroke;
	  }).attr('stroke-opacity', _config2['default'].playerOpacity).attr('fill', function (d) {
	    return d.tid === t1 ? _config2['default'].t1Fill : _config2['default'].t2Fill;
	  }).attr('fill-opacity', _config2['default'].playerOpacity);
	
	  initControls();
	  toggle();
	}
	
	(function () {
	  $.ajax('dist/ball-q1.json', {
	    success: function success(ballData) {
	      $.ajax('dist/players-q1.json', {
	        success: function success(playerData) {
	          $.ajax('dist/teams.json', {
	            success: function success(teamData) {
	              init(ballData, playerData, teamData);
	            }
	          });
	        }
	      });
	    }
	  });
	})();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _config = __webpack_require__(3);
	
	var _config2 = _interopRequireDefault(_config);
	
	module.exports = {
	  init: function init(teamData) {
	    function p(player) {
	      return '<div style="display: inline-block;" id="' + player.playerid + '" tooltip="' + player.firstname + ' ' + player.lastname + '">\n                <img id="headshot-' + player.playerid + '" class="headshot" src="./client/images/headshots/' + player.playerid + '.png"\n                    title="' + player.firstname + ' ' + player.lastname + '"\n                />\n            </div>';
	    }
	
	    var homes = teamData.home.players.map(p);
	    $('#home').html('<h3 style="color: ' + _config2['default'].t1Fill + ';">' + teamData.home.name + '</h3>\n                    ' + homes.join(' ') + '\n                  ');
	    var visitors = teamData.visitor.players.map(p);
	    $('#visitor').html('<h3 style="color: ' + _config2['default'].t2Fill + ';">' + teamData.visitor.name + '</h3>\n                    ' + visitors.join(' ') + '\n                     ');
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  // actual NBA court dimenstions in feet
	  courtWidth: 94,
	  courtHeight: 50,
	  // svg court image background from NBA, in pixels
	  // TODO: pull from CSS
	  width: 940,
	  height: 500,
	  interval: 83, // set FPS to match data readings of 25 FPS (/ 2 due to subsampling)
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
	  ghostOpacity: 0.2
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map