import numpy as np
import random
np.set_printoptions(linewidth=400)


class AI1():

    # Define settings upon initialization. Here you can specify
    def __init__(self, numRows, numCols, numBombs, safeSquare):

        # game variables that can be accessed in any method in the class. For example, to access the number of rows, use "self.numRows"
        self.numRows = numRows
        self.numCols = numCols
        self.numBombs = numBombs
        self.safeSquare = safeSquare

    def open_square_format(self, squareToOpen):
        return ("open_square", squareToOpen)

    def submit_final_answer_format(self, listOfBombs):
        return ("final_answer", listOfBombs)

    # return the square (r, c) you want to open based on the given boardState
    # the boardState will contain the value (0-8 inclusive) of the square, or -1 if that square is unopened
    # an AI example that returns a random square (r, c) that you want to open
    # TODO: implement a better algorithm
    def performAI(self, boardState):
        # print(boardState)

        prob = np.full((self.numRows, self.numCols), -1, dtype=float)
        directions = [[-1, -1], [-1, 0], [-1, 1],
                      [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

        bombsFoundSoFar = []

        for row in range(self.numRows):
            for col in range(self.numCols):
                val = float(boardState[row][col])

                if val == -1:
                    continue
                elif val == 9:
                    bombsFoundSoFar.append([row, col])
                    continue

                possible = []
                for direction in directions:
                    newRow = row + direction[0]
                    newCol = col + direction[1]

                    if (newRow >= 0 and newRow < self.numRows and newCol >= 0 and newCol < self.numCols):
                        if (boardState[newRow][newCol] == 9):
                            val -= 1
                        elif (boardState[newRow][newCol] == -1):
                            possible.append([newRow, newCol])

                numPossible = len(possible)
                for poss in possible:
                    print(val / numPossible)
                    prob[poss[0]][poss[1]] = max(
                        prob[poss[0]][poss[1]], val / numPossible)

        print(prob)

        # find all the unopened squares
        unopenedSquares = []
        bombsFoundSoFar = []
        for row in range(self.numRows):
            for col in range(self.numCols):
                if boardState[row][col] == -1:
                    unopenedSquares.append((row, col))
                elif boardState[row][col] == 9:
                    bombsFoundSoFar.append((row, col))

        if len(bombsFoundSoFar) == self.numBombs:
            # If the number of unopened squares is equal to the number of bombs, all squares must be bombs, and we can submit our answer
            print(f"List of bombs is {bombsFoundSoFar}")
            return self.submit_final_answer_format(bombsFoundSoFar)
        else:
            # Otherwise, pick a random square and open it
            squareToOpen = random.choice(unopenedSquares)
            print(f"Square to open is {squareToOpen}")
            return self.open_square_format(squareToOpen)
