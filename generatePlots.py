# import os
# import json

# directory = r'/Users/hennamian/Desktop/cs-3510-final/varied_density_boards'
# for filename in os.listdir(directory):
#     print(filename)
#     dire = '/Users/hennamian/Desktop/cs-3510-final/varied_density_boards' + '/' + str(filename)
#     print(dire)
#     with open(dire) as file:
#         data = json.load(dire)
#         print(data)

import json
import glob
import os
from datetime import datetime
import csv
import numpy as np
import matplotlib.pyplot as plt
import minesweeperPerformanceTest
from tkinter import *
import sys
sys.setrecursionlimit(20000)


# Place your JSON data in a directory named 'data/'
def alg1Size():
    src = '/Users/hennamian/Desktop/cs-3510-final/varied_size_boards'

    date = datetime.now()
    data = []

    # Change the glob if you want to only look through files with specific names
    files = glob.glob('/Users/hennamian/Desktop/cs-3510-final/varied_size_boards/*', recursive=True)

    # Loop through files


    gridAreaPlot = []
    runtimePlot = []
    numDigsPlot = []
    bombs = []


    for single_file in files:
      with open(single_file, 'r') as f:
        json_file = json.load(f)


        dimen = json_file['dim']
        bomb = json_file['bombs']
        bombs.append(bomb)
        x = dimen.split(",")
        rows = int(x[0])
        cols = int(x[1])
        gridArea = rows*cols
        gridAreaPlot.append(gridArea)

        root = Tk()
        root.geometry("800x800")

        app = minesweeperPerformanceTest.Window(master = root)

        app.setupFile(testcase_filename = str(single_file), AIType = 1)
        root.mainloop()

        runtimePlot.append(round(app.time, 3))
        numDigsPlot.append(app.numDigs)

    return gridAreaPlot, runtimePlot, numDigsPlot


def alg1Den():
    src = '/Users/hennamian/Desktop/cs-3510-final/varied_density_boards'

    date = datetime.now()
    data = []

    files = glob.glob('/Users/hennamian/Desktop/cs-3510-final/varied_density_boards/*', recursive=True)



    gridAreaPlot2 = []
    runtimePlot2 = []
    numDigsPlot2 = []
    bombs = []


    for single_file in files:
      with open(single_file, 'r') as f:
        json_file = json.load(f)


        dimen = json_file['dim']
        bomb = json_file['bombs']
        bombs.append(bomb)
        x = dimen.split(",")
        rows = int(x[0])
        cols = int(x[1])
        gridArea = rows*cols
        gridAreaPlot2.append(gridArea)

        root = Tk()
        root.geometry("800x800")

        app = minesweeperPerformanceTest.Window(master = root)

        app.setupFile(testcase_filename = str(single_file), AIType = 1)
        root.mainloop()

        runtimePlot2.append(round(app.time, 3))
        numDigsPlot2.append(app.numDigs)

    return gridAreaPlot2, runtimePlot2, numDigsPlot2, bombs


def alg2Size():
    src = '/Users/hennamian/Desktop/cs-3510-final/varied_size_boards'

    date = datetime.now()
    data = []

    # Change the glob if you want to only look through files with specific names
    files = glob.glob('/Users/hennamian/Desktop/cs-3510-final/varied_size_boards/*', recursive=True)

    # Loop through files


    gridAreaPlot10 = []
    runtimePlot10 = []
    numDigsPlot10 = []
    bombs = []


    for single_file in files:
      with open(single_file, 'r') as f:
        json_file = json.load(f)


        dimen = json_file['dim']
        bomb = json_file['bombs']
        bombs.append(bomb)
        x = dimen.split(",")
        rows = int(x[0])
        cols = int(x[1])
        gridArea = rows*cols
        gridAreaPlot10.append(gridArea)

        root = Tk()
        root.geometry("800x800")

        app = minesweeperPerformanceTest.Window(master = root)

        app.setupFile(testcase_filename = str(single_file), AIType = 2)
        root.mainloop()

        runtimePlot10.append(round(app.time, 3))
        numDigsPlot10.append(app.numDigs)

    return gridAreaPlot10, runtimePlot10, numDigsPlot10


def alg2Den():
    src = '/Users/hennamian/Desktop/cs-3510-final/varied_density_boards'

    date = datetime.now()
    data = []

    files = glob.glob('/Users/hennamian/Desktop/cs-3510-final/varied_density_boards/*', recursive=True)



    gridAreaPlot20 = []
    runtimePlot20 = []
    numDigsPlot20 = []
    bombs = []


    for single_file in files:
      with open(single_file, 'r') as f:
        json_file = json.load(f)


        dimen = json_file['dim']
        bomb = json_file['bombs']
        bombs.append(bomb)
        x = dimen.split(",")
        rows = int(x[0])
        cols = int(x[1])
        gridArea = rows*cols
        gridAreaPlot20.append(gridArea)

        root = Tk()
        root.geometry("800x800")

        app = minesweeperPerformanceTest.Window(master = root)

        app.setupFile(testcase_filename = str(single_file), AIType = 2)
        root.mainloop()

        runtimePlot20.append(round(app.time, 3))
        numDigsPlot20.append(app.numDigs)

    return gridAreaPlot20, runtimePlot20, numDigsPlot20, bombs



gridAreaPlot, runtimePlot, numDigsPlot = alg1Size()
gridAreaPlot2, runtimePlot2, numDigsPlot2, bombs = alg1Den()
gridAreaPlot10, runtimePlot10, numDigsPlot10 = alg2Size()
gridAreaPlot20, runtimePlot20, numDigsPlot20, bombs = alg2Den()


#Alg 1, Runtime vs grid area
unique = np.unique(gridAreaPlot)
means = []
for ele in unique:
  args = np.argwhere(gridAreaPlot == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = runtimePlot[ele]
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)

unique = np.unique(gridAreaPlot10)
means = []
for ele in unique:
  args = np.argwhere(gridAreaPlot10 == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = runtimePlot10[ele]
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)




plt.plot(unique, means)

plt.title("Runtime vs Grid Area")
plt.xlabel("Grid Area")
plt.ylabel("Runtime")
plt.show()




#Alg 1, Runtime vs bomb density
densities = []

for i in range(len(bombs)):
  den = int(bombs[i])/gridAreaPlot2[i]
  densities.append(den)


unique = np.unique(densities)
means = []
for ele in unique:
  args = np.argwhere(densities == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = runtimePlot2[ele]
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)



densities = []

for i in range(len(bombs)):
  den = int(bombs[i])/gridAreaPlot20[i]
  densities.append(den)


unique = np.unique(densities)
means = []
for ele in unique:
  args = np.argwhere(densities == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = runtimePlot20[ele]
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)



plt.title("Runtime vs Bomb Density")
plt.xlabel("Bomb Density")
plt.ylabel("Runtime")
plt.show()


#Alg 1, Performance vs Grid Area

unique = np.unique(gridAreaPlot)
means = []
for ele in unique:
  args = np.argwhere(gridAreaPlot == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = (numDigsPlot[ele]/gridAreaPlot[ele])
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)


unique = np.unique(gridAreaPlot10)
means = []
for ele in unique:
  args = np.argwhere(gridAreaPlot10 == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = (numDigsPlot10[ele]/gridAreaPlot10[ele])
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)


plt.title("Performance vs Grid Area")
plt.xlabel("Grid Area")
plt.ylabel("Performance")
plt.show()




#Alg 1, Performance vs Bomb Density

densities = []

for i in range(len(bombs)):
  den = int(bombs[i])/gridAreaPlot2[i]
  densities.append(den)


unique = np.unique(densities)
means = []
for ele in unique:
  args = np.argwhere(densities == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = (numDigsPlot2[ele]/gridAreaPlot2[ele])
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)


densities = []

for i in range(len(bombs)):
  den = int(bombs[i])/gridAreaPlot20[i]
  densities.append(den)


unique = np.unique(densities)
means = []
for ele in unique:
  args = np.argwhere(densities == ele)
  runtime = []
  for i in args:
    ele = i[0]
    time = (numDigsPlot20[ele]/gridAreaPlot20[ele])
    runtime.append(time)
  mean = np.mean(runtime)
  means.append(mean)

plt.plot(unique, means)

plt.title("Performance vs Bomb Density")
plt.xlabel("Bomb Density")
plt.ylabel("Performance")
plt.show()


















# plt.plot(gridAreaPlot, runtimePlot)
# plt.title("Runtime vs Grid Area")
# plt.xlabel("Grid Area")
# plt.ylabel("Runtime")
# plt.show()










  #   data.append([
  #     json_file['dim']

  #     # json_file['bombs'],
  #     # json_file['safe'],
  #     # json_file['board']
  # ])




# Add headers
# data.insert(0, ['Requested URL', 'Date', 'Performance Score', 'LCP', 'Speed Index', 'FID', 'CLS', 'CPU Idle', 'Total Byte Weight'])

# Export to CSV.
# Add the date to the file name to avoid overwriting it each time.
# with open(str(date) + '.csv', "w", newline="") as f:
#     writer = csv.writer(f)
#     writer.writerows(data)

# print("Updated CSV")

# print(os.path.dirname(os.path.realpath('20_20_2_0.json')))