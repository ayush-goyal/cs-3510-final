import numpy as np
import random

class AI1():

    # Define settings upon initialization. Here you can specify
    def __init__(self, numRows, numCols, numBombs, safeSquare):

        # game variables that can be accessed in any method in the class. For example, to access the number of rows, use "self.numRows"
        self.numRows = numRows
        self.numCols = numCols
        self.numBombs = numBombs
        self.safeSquare = safeSquare

        #self.heatmap = np.zeros([self.numRows, self.numCols])
        self.start = True
        x = safeSquare[0]
        y = safeSquare[1]
        self.directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
        self.beg = []
        self.store = []
        for i in range(1, numRows, 3):
            for j in range(1, numCols, 3):
                self.store.append((i,j))
                self.beg.append((i,j))

        if numCols % 3 != 0:
            for i in range(1, numCols + 1, 3):
                self.beg.append((numCols - 1, i))
        
        if numRows % 3 != 0:
            for i in range(1, numRows + 1, 3):
                self.beg.append((i, numRows - 1))

        self.store = list(set(self.store))
        self.leftSquares = self.store
        
    def open_square_format(self, squareToOpen):
        return ("open_square", squareToOpen)

    def submit_final_answer_format(self, listOfBombs):
        return ("final_answer", listOfBombs)

    # return the square (r, c) you want to open based on the given boardState
    # the boardState will contain the value (0-8 inclusive) of the square, or -1 if that square is unopened
    # an AI example that returns a random square (r, c) that you want to open
    # TODO: implement a better algorithm

    def performAI(self, boardState):
        print(self.store)
        if len(self.beg) != 0:
            temp = self.beg[0]
            self.beg.pop(0)
            return self.open_square_format(temp)
            
        print(boardState)
        #print(self.heatmap)
        # find all the unopened squares
        unopenedSquares = []
        bombsFoundSoFar = []

        for row in range(self.numRows):
            for col in range(self.numCols):
                if boardState[row][col] == -1:
                    unopenedSquares.append((row, col))
                elif boardState[row][col] == 9:
                    bombsFoundSoFar.append((row, col))
                #elif boardState[row][col] == 0:

        if len(bombsFoundSoFar) == self.numBombs:
            # If the number of unopened squares is equal to the number of bombs, all squares must be bombs, and we can submit our answer
            print(f"List of bombs is {bombsFoundSoFar}")
            return self.submit_final_answer_format(bombsFoundSoFar)
        else:
            for i in range(len(self.leftSquares) - 1, -1, -1):
                square = self.leftSquares[i]

                if (boardState[square] == 0 or boardState[square] == 9):
                    self.leftSquares.pop(i)
                elif (boardState[square] != -1):
                    numAround = 0

                    x = square[0]
                    y = square[1]
                    directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
                    for direction in directions:
                        newX = x + direction[0]
                        newY = y + direction[1]
                        if newX >= 0 and newX < self.numRows and newY >= 0 and newY < self.numCols and boardState[newX][newY] == 9:
                            numAround += 1

                    if (numAround == boardState[square]):
                        self.leftSquares.pop(i)

            x = self.leftSquares[0][0]
            y = self.leftSquares[0][1]
            directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
            for direction in directions:
                newX = x + direction[0]
                newY = y + direction[1]
                if newX >= 0 and newX < self.numRows and newY >= 0 and newY < self.numCols and boardState[newX][newY] == -1:
                    return self.open_square_format((newX, newY))