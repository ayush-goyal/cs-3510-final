<!--

// Note (202008): to support larger size boards, I have computed all very large numbers using logarithms. Unfortunately, this leads to more rounding errors; it also means that numbers very close to 1 may be hard to distinguish from 1. Preset position #2 is harmed by this as the center square is not actually forced to be a mine. The fix would be to bring in a large-number library; maybe I will do that sometime.

var cwidth=950, cheight=500; // size of canvas
var c; // canvas object
var h=16, w=30, m=99; // height, width, number of mines
var board = []; // h*w, -1 = mine, 0-8 = square, 10-11 = fixed point
var clues = []; // numbers 0-8. format: array of [y, x, clue]
var fixedPoints = []; // fixed points (known squares). format: array of [y, x, 0 or 1]

// presets
var cluePresets = [];
cluePresets[0] = []; // nothin'
cluePresets[1] = [[2, 10, 2], [2, 12, 2], [2, 14, 2], [2, 16, 2], [3, 9, 1], [3, 17, 1], [4, 8, 2], [6, 8, 2], [8, 8, 2], [10, 8, 2], [4, 18, 2], [6, 18, 2], [8, 18, 2], [10, 18, 2], [11, 9, 1], [11, 17, 1], [12, 10, 2], [12, 12, 2], [12, 14, 2], [12, 16, 2], [4, 13, 5], [5, 11, 5], [5, 15, 5], [6, 13, 1], [7, 10, 5], [7, 12, 1], [7, 14, 1], [7, 16, 5], [8, 13, 1], [9, 11, 5], [9, 15, 5], [10, 13, 5]]; // the position that took 3 hours for the Java solver
cluePresets[2] = [[2, 11, 5], [2, 13, 5], [2, 15, 5], [3, 9, 5], [3, 13, 3], [3, 17, 5], [4, 11, 1], [4, 15, 1], [5, 8, 5], [5, 10, 1], [5, 16, 1], [5, 18, 5], [6, 13, 5], [7, 6, 7], [7, 8, 4], [7, 12, 5], [7, 14, 5], [7, 18, 4], [7, 20, 7], [8, 13, 5], [9, 8, 5], [9, 10, 1], [9, 16, 1], [9, 18, 5], [10, 11, 1], [10, 15, 1], [11, 9, 5], [11, 17, 5], [12, 11, 5], [12, 13, 4], [12, 15, 5], [14, 13, 7]]; // a position with high probability in the center
cluePresets[3] = [[1,1,1],[4,1,1],[7,1,1],[10,1,1],[13,1,1],[13,4,1],[10,4,1],[7,4,1],[4,4,1],[1,4,1],[1,7,1],[4,7,1],[7,7,1],[10,7,1],[13,7,1],[13,10,1],[10,10,1],[7,10,1],[4,10,1],[1,10,1],[1,13,1],[4,13,1],[7,13,1],[10,13,1],[13,13,1],[3,3,2],[6,2,2],[9,3,2],[12,2,2],[3,6,2],[3,9,2],[3,12,2],[6,12,2],[9,12,2],[12,11,2],[9,8,2],[12,6,2]]; // just some random stuff
cluePresets[4] = [[1,2,3],[6,2,3],[4,4,3],[3,1,3],[2,3,3],[3,6,3],[1,6,3],[1,4,3],[7,4,3],[8,1,3],[9,3,3],[11,1,3],[12,2,3],[14,1,3],[13,3,3],[12,5,3],[12,7,3],[13,9,3],[14,6,3],[11,10,3],[2,8,3],[14,11,3],[12,12,3],[13,14,3],[11,14,3],[14,15,3],[12,16,3],[13,18,3],[11,18,3],[12,20,3],[14,19,3],[13,21,3],[11,22,3],[13,24,3],[11,24,3],[12,26,3],[13,27,3],[11,28,3],[14,26,3],[3,10,3],[1,11,3],[3,9,3],[2,12,3],[3,14,3],[1,15,3],[4,16,3],[4,12,3],[2,17,3],[3,19,3],[4,21,3],[1,20,3],[2,22,3],[3,23,3],[1,24,3],[2,25,3],[4,25,3],[4,27,3],[2,28,3],[5,28,3],[7,26,3],[8,28,3],[9,26,3]]; // don't even try to compute this with brute force lmao
var fixedPresets = [[], [], [], [[0,0,1],[6,6,0],[8,8,0],[11,11,0]], []]; // random stuff has one mine and three safe squares

var defaultColors = ["#DDDDDD", "#0000FF", "#008000", "#FF0000", "#000080", "#800000", "#008080", "#000000", "#808080"]; // colors to use for clues
var groupings = []; // set of [list of locations, list of clue#s]
var possibilities = "?"; // "?" if not computed, otherwise an array of solution possibilities
var nodesVisited = 0; // number of position-nodes visited in the algorithm
var totalSolutions = 0; // actual number of solutions found, ignoring the combinatorics of mines not adjacent to clues
var editSelection = 9; // selected thing to place in editing mode
var mode = "edit"; // edit or view?
var foundSafe = -1, foundMine = -1; // number of safe spaces and mines found

window.onkeydown=function(event){doKey(event)};

// load the page and set up some basics
function init() {
 document.bgColor = "#ccc";
 
 c = $('c').getContext('2d');
 $('c').height = cheight;
 $('c').width = cwidth;
 $('cube').height = cheight;
 $('cube').width = cwidth;
 $('c').addEventListener("mousedown", clicked, false);
 
 loadBoard();
 
 draw();
}


// #########################
// ### ALGORITHM SECTION ###
// #########################


// load "board" variable with info about where clues and fixed points are
function loadBoard() {
 board = [];
 for (var i=0; i<h; i++) {
  board[i] = [];
  for (var j=0; j<w; j++) {
   board[i][j] = -1;
  }
 }
 for (var i=0; i<clues.length; i++) {
  board[clues[i][0]][clues[i][1]] = clues[i][2];
 }
 for (var i=0; i<fixedPoints.length; i++) {
  board[fixedPoints[i][0]][fixedPoints[i][1]] = fixedPoints[i][2] + 10;
 }
}


// determine all groupings (either fixed points, or sets of squares adjacent to the same clues)
function getGroupings() {
 groupings = [];
 var fixedPointGroupings = [];
  // set of [list of locations, list of clue#s]
 for (var i=0; i<h; i++) {
  for (var j=0; j<w; j++) {
   if (board[i][j] >= 0 && board[i][j] <= 8) { // clue
    continue;
   }
   // get list of clue#s this square is adjacent to
   var adjacentClues = [];
   for (var k=0; k<clues.length; k++) {
    if (Math.abs(clues[k][0] - i) <= 1 && Math.abs(clues[k][1] - j) <= 1) {
	 adjacentClues.push(k);
	}
   }
   if (board[i][j] >= 10) { // fixed point
    fixedPointGroupings.push([[[i,j]], adjacentClues]);
	continue;
   }
   if (adjacentClues.length == 0) continue;
   // add this square to a grouping, or a new one if it doesn't match
   var added = false;
   for (var k=0; k<groupings.length; k++) {
    if (JSON.stringify(adjacentClues)==JSON.stringify(groupings[k][1])) {
	 groupings[k][0].push([i,j]);
	 added = true;
	 break;
	}
   }
   if (!added) {
    groupings.push([[[i,j]], adjacentClues]);
   }
  }
 }
 groupings = groupings.concat(fixedPointGroupings);
 return groupings;
}

// get the groupings adjacent to each clue
function getGroupingsByClue(groupings) {
 var groupingsByClue = [];
 for (var clue=0; clue<clues.length; clue++) {
  var subGroupings = [];
  for (var group=0; group<groupings.length; group++) {
   if (contains(groupings[group][1], clue)) subGroupings.push(group);
  }
  groupingsByClue[clue] = subGroupings;
 }
 return groupingsByClue;
}

// the main algorithm - compute all possible solutions
// a possibility is: [total mines, # cases, map of grouping ID -> # of mines]
function computeProbabilities() {
 // try not to recompute
 if (possibilities != "?") return;
 
 possibilities = [];

 startTime = new Date();
 foundSafe = 0;
 foundMine = 0;
 loadBoard();
 groupings = getGroupings();
 var groupingsByClue = getGroupingsByClue(groupings);
 nodesVisited = 0;
 
 // start with no clues
 var cluesUsed = [];
 for (var i=0; i<clues.length; i++) cluesUsed[i] = 0;
 var groupingsUsed = new Array(groupings.length).fill(0);
 var cluesUsedCount = 0;
 // possibility: [total mines, # cases, map of grouping ID -> # of mines]
 possibilities = [[0, 1, new Array(groupings.length).fill(0)]];
 
 // apply fixed points and mark each as already used so we don't try to put more mines in
 for (var i=0; i<fixedPoints.length; i++) {
  var fixedGrouping = whichGrouping(fixedPoints[i][1], fixedPoints[i][0]);
  possibilities[0][2][fixedGrouping] = fixedPoints[i][2];
  possibilities[0][0] += fixedPoints[i][2];
  groupingsUsed[fixedGrouping] = 1;
 }
 
 // add clues one at a time and keep track of possibilities
 while (cluesUsedCount < clues.length) {
  // find the best clue - the one with the smallest supergroup boundary
  var bestClue = -1;
  var bestClueBoundary = groupings.length+1; // change in # of boundary groups
  
  for (var tryClue=0; tryClue<clues.length; tryClue++) {
   if (cluesUsed[tryClue] == 1) continue;
   cluesUsed[tryClue] = 1;
   var newBoundary = getBoundary(groupings, cluesUsed);
   var newSupergroups = getBoundarySupergroups(groupings, cluesUsed, newBoundary);
   cluesUsed[tryClue] = 0;
   var boundaryChange = newSupergroups.length;
   if (boundaryChange < bestClueBoundary) {
    bestClue = tryClue;
	bestClueBoundary = boundaryChange;
   }
  }
  
  // add this clue
  cluesUsed[bestClue] = 1;
  cluesUsedCount++;
  var newBoundary = getBoundary(groupings, cluesUsed);
  var supergroups = getBoundarySupergroups(groupings, cluesUsed, newBoundary);
  
  // groupings we are going to be adding
  var relevantGroupings = [];
  for (var rg=0; rg<groupingsByClue[bestClue].length; rg++) {
   var grouping_id = groupingsByClue[bestClue][rg];
   if (groupingsUsed[grouping_id] == 0) {
    relevantGroupings.push(grouping_id);
	groupingsUsed[grouping_id] = 1;
   }
  }
  
  // construct new possibilities
  var newPossibilities = {};
  for (var p=0; p<possibilities.length; p++) {
   var possibilityVal = possibilities[p];
   
   // compute extraMines: number of mines that we need to add to satisfy the clue
   var extraMines = clues[bestClue][2];
   var removedTotalMines = 0;
   for (var i = 0; i < groupingsByClue[bestClue].length; i++) {
    var relevantGrouping = groupingsByClue[bestClue][i];
	removedTotalMines += possibilityVal[2][relevantGrouping];
   }
   extraMines -= Math.trunc(removedTotalMines / possibilityVal[1]);
   
   // determine all possible ways to extend this possibility to cover the rest of the clue, and add them to newPossibilities
   extendPossibilities(possibilityVal, extraMines, relevantGroupings, newPossibilities, supergroups, relevantGroupings.length - 1);
  }
  
  // put the merged possibilities into an array, ignoring any with too many mines
  var newPossibilitiesArray = [];
  for (var key in newPossibilities) {
   if (!newPossibilities.hasOwnProperty(key)) continue;
   if (newPossibilities[key][0] > m) continue;
   newPossibilitiesArray.push(newPossibilities[key]);
  }
  nodesVisited += newPossibilitiesArray.length;
  possibilities = newPossibilitiesArray;
 }
 
 // log some useful stuff
 console.log("Time: " + ((new Date()).getTime() - startTime.getTime()));
 
 // count total solutions by adding across the possibilities
 totalSolutions = 0;
 for (var i=0; i<possibilities.length; i++) {
  totalSolutions += possibilities[i][1];
 }
 
 // display data below the board, and draw it
 draw();
 displayProbability(-1, -1);
}

// get the supergroup boundary: a list of groupings on the boundary that are adjacent to the same clues, ignoring clues we have already used
function getBoundarySupergroups(groupings, usedClues, boundary) {
 var clueLists = {}; // list of clues (as string) => list of groupings
 for (var b=0; b<boundary.length; b++) {
  var bb = groupings[boundary[b]];
  boundaryClues = bb[1];
  var boundaryClueString = "";
  for (var bc=0; bc<boundaryClues.length; bc++) {
   bbc = boundaryClues[bc];
   if (usedClues[bbc] == 0) {
    boundaryClueString += bbc + ",";
   }
  }
  if (boundaryClueString in clueLists) {
   clueLists[boundaryClueString].push(boundary[b]);
  } else {
   clueLists[boundaryClueString] = [boundary[b]];
  }
 }
 var boundaryGroups = [];
 for (key in clueLists) {
  boundaryGroups.push(clueLists[key]);
 }
 return boundaryGroups;
}

// get the list of grouping IDs on the boundary
// recall groupings = set of [list of locations, list of clue#s]
// and usedClues = array of 0,1
function getBoundary(groupings, usedClues) {
 var boundary = [];
 for (var i=0; i<groupings.length; i++) {
  // it's a boundary if it's adjacent to some used clues and some unused clues
  var hasUsed = false;
  var hasUnused = false;
  // set of [list of locations, list of clue#s]
  for (var j=0; j<groupings[i][1].length; j++) {
   var clueID = groupings[i][1][j];
   if (usedClues[clueID] == 0) {
    hasUnused = true;
   } else {
    hasUsed = true;
   }
  }
  if (hasUsed && hasUnused) boundary.push(i);
 }
 return boundary;
}

// get a string with the information we need to determine whether we can combine two possibilities
function normalize(possibility, supergroups) {
 var str = "" + possibility[0];
 count = possibility[1];
 for (var i=0; i<supergroups.length; i++) {
  var minecount = 0;
  for (var j=0; j<supergroups[i].length; j++) {
   minecount += possibility[2][supergroups[i][j]];
  }
  str += Math.trunc(minecount / count); // this is OK because they're all single digits
 }
 return str;
}

// add a new possibility into the map, possibly by combining with an existing one
function addPossibility(possibility, possibilityMap, supergroups) {
  var key = normalize(possibility, supergroups);
  if (key in possibilityMap) {
   // combine the possibilities together
   var combined = possibilityMap[key];
   combined[1] += possibility[1];
   for (var i=0; i<groupings.length; i++) {
    combined[2][i] += possibility[2][i];
   }
   possibilityMap[key] = combined;
  } else {
   possibilityMap[key] = possibility;
  }
}

// get all possible ways to take the possibility and extend it to the extra groupings, with a certain number of extra mines, and add it to newPossibilities. n is just an index into extraGroupings
// extraGroupings is an array of grouping IDs, not groupings
// possibility format: [total mines, # cases, map of grouping ID -> # of mines]
function extendPossibilities(possibility, extraMines, extraGroupings, newPossibilities, supergroups, n) {
 // if there are no groupings, just return the possibility
 if (n < 0) {
  if (extraMines == 0) addPossibility(possibility, newPossibilities, supergroups);
  return;
 }
 
 // if there is 1 grouping left, place the right number of mines in there
 var firstGrouping = extraGroupings[n];
 if (n == 0) {
  if (extraMines >= 0 && extraMines <= groupings[firstGrouping][0].length) {
   var multiplier = small_binomial[groupings[firstGrouping][0].length][extraMines];
   var newGroupingMap = new Array(groupings.length);
   for (var i=0; i<groupings.length; i++) {
    newGroupingMap[i] = possibility[2][i] * multiplier;
   }
   newGroupingMap[firstGrouping] = extraMines * possibility[1] * multiplier;
   newPossibility = [possibility[0] + extraMines, possibility[1] * multiplier, newGroupingMap];
   addPossibility(newPossibility, newPossibilities, supergroups);
   return;
  } else {
   return;
  }
 }
 
 // otherwise, consider the first grouping and try all possible #s of mines in there. for each one, add that choice to the possibility, then call this function with that many fewer mines & one fewer grouping
 var maxMines = groupings[firstGrouping][0].length;
 for (var usedMines = 0; usedMines <= maxMines; usedMines++) {
  // add this choice to the possibility
  var multiplier = small_binomial[maxMines][usedMines];
  var newGroupingMap = new Array(groupings.length);
  for (var i=0; i<groupings.length; i++) {
   newGroupingMap[i] = possibility[2][i] * multiplier;
  }
  newGroupingMap[firstGrouping] = usedMines * possibility[1] * multiplier;
  newPossibility = [possibility[0] + usedMines, possibility[1] * multiplier, newGroupingMap];
  extendPossibilities(newPossibility, extraMines - usedMines, extraGroupings, newPossibilities, supergroups, n-1);
 }
 return;
}

// which grouping is [x,y] in?
function whichGrouping(x, y) {
 for (var gr=0; gr<groupings.length; gr++) {
  var locs = groupings[gr][0];
  for (var l=0; l<locs.length; l++) {
   loc = locs[l];
   if (loc[0] == y && loc[1] == x) {
    return gr;
   }
  }
 }
 return -1;
}

// memoized binomial function for both values <=8
var small_binomial = [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1],[1,6,15,20,15,6,1],[1,7,21,35,35,21,7,1],[1,8,28,56,70,56,28,8,1]];

// compute n choose k
function binomial(n, k) {
 var coeff = 1;
 for (var x = n-k+1; x <= n; x++) coeff *= x;
 for (x = 2; x <= k; x++) coeff /= x;
 return coeff;
}

// compute log(n choose k)
function logbinomial(n, k) {
 if (n <= 8 && k <= n) {
  return Math.log(small_binomial[n][k]);
 } else {
  var coeff = 0;
  for (var x = n-k+1; x <= n; x++) coeff += Math.log(x);
  for (x = 2; x <= k; x++) coeff -= Math.log(x);
  return coeff;
 }
}

// compute log(e^x + e^y)
function logadd(x, y) {
 if (x == -Infinity) return y;
 min_input = Math.min(x, y);
 max_input = Math.max(x, y);
 if (max_input - min_input > 20) return max_input;
 return min_input + Math.log(1 + Math.exp(max_input - min_input));
}

// number of squares that are not next to a clue or fixed
function countExtraTiles() {
 var extraTileCount = 0;
 for (var i=0; i<h; i++) {
  for (var j=0; j<w; j++) {
   if (whichGrouping(j, i) == -1 && board[i][j] == -1) extraTileCount++;
  }
 }
 return extraTileCount;
}

// compute the probability at an individual square, once the solutions have been found
function computeProbability(x, y) {
 if (possibilities == "?") return -1;
 
 // find relevant group and get size
 var clickedGroup = whichGrouping(x, y);
 if (clickedGroup == -1) {
  // is it a clue?
  for (var c=0; c<clues.length; c++) {
   if (clues[c][0] == y && clues[c][1] == x) {
    return 0;
   }
  }
  
  // it's a square not next to a clue, so compute the probability of these separately
  var extraTileCount = countExtraTiles();
  
  var totalProbability = -Infinity;
  for (var p=0; p<possibilities.length; p++) {
   var possibility = possibilities[p];
   logProbability = logbinomial(extraTileCount, m - possibility[0]) + Math.log(possibility[1]);
   totalProbability = logadd(totalProbability, logProbability);
  }
  
  // compute expected # of mines in this group
  var groupProbability = -Infinity;
  for (var p=0; p<possibilities.length; p++) {
   var possibility = possibilities[p];
   logProbability = logbinomial(extraTileCount, m - possibility[0]) + Math.log(possibility[1]) + (Math.log(m - possibility[0]) - Math.log(extraTileCount));
   groupProbability = logadd(groupProbability, logProbability);
  }
  
  if (groupProbability == -Infinity) return 0;
  return Math.exp(groupProbability - totalProbability);
 }
 var clickedGroupSize = groupings[clickedGroup][0].length;
 
 var extraTileCount = countExtraTiles();
 
 // compute total probability
 var totalProbability = -Infinity;
 for (var p=0; p<possibilities.length; p++) {
  var possibility = possibilities[p];
  logProbability = logbinomial(extraTileCount, m - possibility[0]) + Math.log(possibility[1]);
  totalProbability = logadd(totalProbability, logProbability);
 }
 
 // compute expected # of mines in this group
 var groupProbability = -Infinity;
 for (var p=0; p<possibilities.length; p++) {
  var possibility = possibilities[p];
  logProbability = logbinomial(extraTileCount, m - possibility[0]) + (Math.log(possibility[2][clickedGroup]) - Math.log(clickedGroupSize))
  groupProbability = logadd(groupProbability, logProbability);
 }
 
 if (groupProbability == -Infinity) return 0;
 return Math.exp(groupProbability - totalProbability);
}

// #############################
// ### END ALGORITHM SECTION ###
// #############################

function customSize() {
 var newH = parseInt(prompt("Height of board:", "16"));
 var newW = parseInt(prompt("Width of board:", "30"));
 var newM = parseInt(prompt("Number of mines:", "99"));
 if (newH < 5) newH = 16;
 if (newW < 5) newW = 30;
 if (newM < 1 || newM >= (newH * newW)) newM = Math.ceil(newH * newW * 0.20625);
 h = newH;
 w = newW;
 m = newM;
 cheight = h*30 + 40;
 cwidth = w*30 + 40;
 clues = [];
 fixedPoints = [];
 possibilities = "?";
 nodesVisited = 0;
 totalSolutions = 0;
 init();
 c = $('c').getContext('2d');
}

// display info about the probability at a square (or no square)
function displayProbability(x, y) {
 if (possibilities == "?") {
  $("data").innerHTML = "Please click 'Compute Probabilities'";
 } else if (possibilities.length == 0) {
  $("data").innerHTML = "Nodes visited: " + nodesVisited + "<br>No solutions found!";
 } else {
  $("data").innerHTML = "Nodes visited: " + nodesVisited + "<br>Total solutions found: " + totalSolutions;
  if (x >= 0 && y >= 0) {
   $("data").innerHTML += "<br>Probability: " + computeProbability(x, y);
  }
  $("data").innerHTML += "<br>Found " + foundSafe + " safe squares and " + foundMine + " mines";
 }
}

// handle a click by either showing a probability or editing the board
function clicked(event) {
 var x=0, y=0;
 if (event.x || event.y) {
 var rect = $('c').getBoundingClientRect();
  x = Math.floor((event.x - rect.left)/30);
  y = Math.floor((event.y - rect.top)/30);
 } else {
  x = Math.floor((event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - $('c').offsetLeft)/30);
  y = Math.floor((event.clientY + document.body.scrollTop + document.documentElement.scrollTop - $('c').offsetTop)/30);
 }
 if (x<0 || y<0 || x>=w || y>=h) {
  return;
 }
 
 console.log("Clicked at " + y + ", " + x);
 
 if (mode == "view") {
  displayProbability(x, y);
 } else if (mode == "edit") {
  // kill probabilities
  possibilities = "?";
  foundSafe = -1;
  foundMine = -1;
  nodesVisited = 0;
  totalSolutions = 0;
  
  var array_find = function(x, y, arr) {
   for (var i=0; i<arr.length; i++) {
    if (arr[i][0] == y && arr[i][1] == x) {
	 return i;
	}
   }
   return -1;
  };
  var array_remove = function(index, arr) {
   arr.splice(index, 1);
  };
  var array_find_and_remove = function(x, y, arr) {
   for (var i=0; i<arr.length; i++) {
    if (arr[i][0] == y && arr[i][1] == x) {
	 arr.splice(i, 1);
	 return;
	}
   }
  }
  
 
  // place a square or clue or whatever
  loadBoard();
  if (editSelection <= 8) { // CLUE
   if (board[y][x] >= 0 && board[y][x] <= 8) {
    // already have a clue here. find and either replace/remove
	var index = array_find(x, y, clues);
	if (clues[index][2] == editSelection) {
	 array_remove(index, clues);
	} else {
	 clues[index][2] = editSelection;
	}
   } else if (board[y][x] >= 10) {
    // fixed point, remove it & add clue
	array_find_and_remove(x, y, fixedPoints);
	clues.push([y, x, editSelection]);
   } else {
    // no clue here, add one
	clues.push([y, x, editSelection]);
   }
   
  } else if (editSelection == 9) { // UNKNOWN
   if (board[y][x] >= 0 && board[y][x] <= 8) {
    // have a clue here, find & remove
	array_find_and_remove(x, y, clues);
   } else if (board[y][x] >= 10) {
    // have a fixed point here, find & remove
	array_find_and_remove(x, y, fixedPoints);
   } else {
    // no clue here, do nothing
   }
   
  } else if (editSelection == 10 || editSelection == 11) { // MINE OR SAFE
   if (board[y][x] >= 10) {
    // already have a fixed point here. find & replace/remove
	var index = array_find(x, y, fixedPoints);
	if (fixedPoints[index][2] == editSelection - 10) {
	 array_remove(index, fixedPoints);
	} else {
	 fixedPoints[index][2] = editSelection - 10;
	}
   } else if (board[y][x] >= 0 && board[y][x] <= 8) {
    // clue, remove it & add fixed point
	array_find_and_remove(x, y, clues);
	fixedPoints.push([y, x, editSelection - 10]);
   } else {
    // no fixed point here, add one
	fixedPoints.push([y, x, editSelection - 10]);
   }
  }
  loadBoard();
  draw();
 }
}

// change the mode between edit and view
function changeMode(s) {
 mode = s;
 $("mode_edit").innerHTML = (mode == "edit" ? "[Edit]" : "Edit");
 $("mode_view").innerHTML = (mode == "view" ? "[View]" : "View");
}

// change what type of square we are placing
function changeEdit(n) {
 for (var i=0; i<12; i++) $("edit_"+i).style.backgroundColor = "#ccc";
 $("edit_"+n).style.backgroundColor = "white";
 editSelection = n;
}

// load a preset pattern
function loadPreset(n) {
 if (n < 0 || n >= cluePresets.length) return;
 clues = cluePresets[n];
 fixedPoints = fixedPresets[n];
 possibilities = "?";
 nodesVisited = 0;
 totalSolutions = 0;
 loadBoard();
 draw();
}

// draw the whole board
function draw() {
 // draw board
 c.font = "12px Arial"
 for (var i=0; i<h; i++) {
  for (var j=0; j<w; j++) {
   drawSquare("#ccc", j*30, i*30, 30);
  }
 }

 for (var i=0; i<h; i++) {
  for (var j=0; j<w; j++) {
   if (board[i][j] == -1) { //unknown
    
    if (possibilities != "?" && possibilities.length > 0) {
	 var probability = computeProbability(j, i);
	 if (probability == 0) {
	  drawButton("#98b9fe", "#7698dc", "#5476ba", j*30, i*30, 30);
	  foundSafe++;
	 } else if (probability >= 1) {
	  drawButton("#fe7e7f", "#dc5d5d", "#ba3b3b", j*30, i*30, 30);
	  foundMine++;
	 } else {
	  drawButton(greyColor(1 - probability/2), greyColor(0.75 - probability/2), greyColor(0.5 - probability/2), j*30, i*30, 30);
	 }
	} else {
	 drawButton("#fff", "#ccc", "#888", j*30, i*30, 30);
	}
   } else if (board[i][j] >= 0 && board[i][j] <= 8) {
    drawNumber(board[i][j], defaultColors[board[i][j]], j*30, i*30, 30);
   } else if (board[i][j] == 10) {
    drawNumber("O", "green", j*30, i*30, 30);
   } else if (board[i][j] == 11) {
    drawNumber("X", "red", j*30, i*30, 30);
   }
  }
 }
}

// get the hex code for a grey color
// n is a number from 0 (black) to 1 (white)
function greyColor(n) {
 var hex = "0123456789abcdef";
 var first = Math.floor(n*16);
 var second = Math.floor(n*256 - first*16);
 if (first >= 16) {
  first = 15;
  second = 15;
 }
 var hexcol = hex[first] + hex[second];
 return "#" + hexcol + hexcol + hexcol;
}

// draw a square at position (x,y) with a given color
function drawSquare(color, x, y, size) {
 c.strokeStyle = "#000";
 c.fillStyle = color;
 c.beginPath();
 c.moveTo(x, y);
 c.lineTo(x+size, y);
 c.lineTo(x+size, y+size);
 c.lineTo(x, y+size);
 c.closePath();
 c.fill();
 c.stroke();
}

// draw a number at position (x,y) with a given color
function drawNumber(num, color, x, y) {
 c.font = "Bold 24px Arial";
 c.fillStyle = color;
 c.textAlign = "center";
 c.fillText(""+num, x + 15, y + 24);
}

// draw a "button" at position (x,y) with given three colors and size
function drawButton(color1, color2, color3, x, y, size) {
 c.strokeStyle = "#000";
 c.fillStyle = color2;
 c.beginPath();
 c.moveTo(x, y);
 c.lineTo(x+size, y);
 c.lineTo(x+size, y+size);
 c.lineTo(x, y+size);
 c.closePath();
 c.fill();
 c.fillStyle = color1;
 c.beginPath();
 c.moveTo(x, y);
 c.lineTo(x+size, y);
 c.lineTo(x+size-(size/8), y+(size/8));
 c.lineTo(x+(size/8), y+(size/8));
 c.lineTo(x+(size/8), y+size-(size/8));
 c.lineTo(x, y+size);
 c.closePath();
 c.fill();
 c.fillStyle = color3;
 c.beginPath();
 c.moveTo(x+size, y+size);
 c.lineTo(x+size, y);
 c.lineTo(x+size-(size/8), y+(size/8));
 c.lineTo(x+size-(size/8), y+size-(size/8));
 c.lineTo(x+(size/8), y+size-(size/8));
 c.lineTo(x, y+size);
 c.closePath();
 c.fill();
}

function doKey(e) {
 var keyCode = 0;
 if (e.keyCode) {
  keyCode = e.keyCode;
 } else if (e.which) {
  keyCode = e.which;
 }

 if (keyCode == 48) changeEdit(0);
 else if (keyCode == 49) changeEdit(1);
 else if (keyCode == 50) changeEdit(2);
 else if (keyCode == 51) changeEdit(3);
 else if (keyCode == 52) changeEdit(4);
 else if (keyCode == 53) changeEdit(5);
 else if (keyCode == 54) changeEdit(6);
 else if (keyCode == 55) changeEdit(7);
 else if (keyCode == 56) changeEdit(8);
 else if (keyCode == 57) changeEdit(9);
 else if (keyCode == 83) changeEdit(10);
 else if (keyCode == 77) changeEdit(11);
}

// does array contain element?
function contains(arr, element) {
 for (var i=0; i<arr.length; i++) {
  if (JSON.stringify(arr[i]) == JSON.stringify(element)) {
   return true;
  }
 }
 return false;
}

// shorthand function
function $(str) {return document.getElementById(str);}

// -->