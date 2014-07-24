'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('GameCtrl', ['$scope', function($scope) {

    // set some defaults
    $scope.gridRows = 8;
    $scope.gridCols = 8;
    $scope.numMines = 10;

    $scope.gameStatus = 'inactive';
    $scope.gameOutcome = '';

    $scope.revealCell = function(row, col, grid, cell) {
      if ($scope.gameStatus === 'active') {
        if (cell.isMine) {
          gameOver();
        } else if (!cell.isRevealed) {
          cell.isRevealed = true;
          if (cell.adjacentMines === 0) {
            aroundCellForEach(row, col, grid, function(r, cl, g, c) {
              $scope.revealCell(r, cl, g, c);
            });
          }
        }
      }
    };

    $scope.revealMines = function(toggle) {
      gridForEach($scope.grid, function(cell) {
        if (cell.isMine) {
          cell.boom = '*';
          if (toggle) {
            cell.isRevealed = !cell.isRevealed;
          } else {
            cell.isRevealed = true;
          }
        }
      });
    };

    $scope.validateGame = function(grid) {
      var lost = false;
      gridForEach(grid, function(cell) {
        if (!cell.isRevealed && !cell.isMine) {
          lost = true;
        }
      });
      if (lost) {
        gameOver();
      } else {
        $scope.gameStatus = 'inactive';
        $scope.gameOutcome = 'You won!  Now, make it harder. :)';
      }
    };

    $scope.restartGame = function(rows, cols, mines) {
      makeGameGrid(rows, cols, mines);
      $scope.gameStatus = 'active';
    };

    var gameOver = function() {
      $scope.revealMines();
      $scope.gameStatus = 'inactive';
      $scope.gameOutcome = 'You lost, try again.';
    };

    var makeGameGrid = function(rows, cols, mines) {
      // set up initial flat array
      var gridSetup = [];
      
      for (var i = 0; i < rows * cols; i++) {
        var isMine = i < mines;
        var adjacentMines = isMine ? null : 0;
        gridSetup.push({
          isMine: isMine,
          adjacentMines: adjacentMines,
          isRevealed: false
        });
      }

      // randomize order then transform to grid
      shuffle(gridSetup);
      var grid = makeMatrix(gridSetup, rows, cols);

      // go set the adjacentMines property of each non-mine
      gridForEach(grid, function(cell, grid, row, col) {
        if (!cell.isMine) {
          cell.adjacentMines = countMinesRoundCell(row, col, grid);
        }
      });

      $scope.grid = grid;
    };

    var gridForEach = function(grid, cb) {
      // cb(cell, grid, row, col)
      var rows = grid.length;
      var cols = grid[0].length;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          cb(grid[r][c], grid, r, c);
        }
      }      
    };

    var aroundCellForEach = function(rowI, colI, grid, cb) {
      // [xShift, yShift]
      var traversalPath = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1]];

      for (var i = 0; i < traversalPath.length; i++) {
        var row = rowI + traversalPath[i][0];
        var col = colI + traversalPath[i][1];
        // check that the point on the grid exists
        // use first row for col, just to check if col index is valid
        if (grid[row] && grid[0][col]) {
          cb(row, col, grid, grid[row][col]);
        }
      }
    };

    var countMinesRoundCell = function(rowI, colI, grid) {
      // never to be called on a mine iteself
      
      // [xShift, yShift]
      var traversalPath = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1]];

      var count = 0;
      for (var i = 0; i < traversalPath.length; i++) {
        var row = rowI + traversalPath[i][0];
        var col = colI + traversalPath[i][1];
        // check that the point on the grid exists
        // use first row for col, just to check if col index is valid
        if (grid[row] && grid[0][col]) {
          if (grid[row][col].isMine) {
            count++;
          }
        }
      }
      return count;
    };

    var makeMatrix = function(flatArr, rows, cols) {
      // turns flat array into m x n dimensional array
      var grid = [];

      var gridI = 0;
      for (var r = 0; r < rows; r++) {
        grid.push([]);
        for (var c = 0; c < cols; c++) {
          grid[r].push(flatArr[gridI]);
          gridI++;
        }
      }
      
      return grid;

    };

    var shuffle = function(arr) {
      // shuffles flat array in place
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        // ensure equal chance of getting index w/in unshuffled portion
        var randI = Math.floor(Math.random() * (len - i));
        var randItem = arr.splice(randI, 1)[0];
        arr.push(randItem);
      }
    };

    $scope.restartGame($scope.gridRows, $scope.gridCols, $scope.numMines);

  }])
  .controller('BoardCtrl', ['$scope', function($scope) {


  }]);
