
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
# src = '/Users/hennamian/Desktop/cs-3510-final/varied_size_boards'

# date = datetime.now()
# data = []

# # Change the glob if you want to only look through files with specific names
# files = glob.glob('/Users/hennamian/Desktop/cs-3510-final/varied_size_boards/*', recursive=True)

# Loop through files


#Alg 1, different sizes
gridAreaPlot = [700, 400, 300, 200, 500, 600, 900, 800, 800, 900, 200, 300, 700, 400, 100, 1000, 200, 500, 600, 500, 600, 1000, 700, 400, 100, 900, 600, 500, 1000, 300, 100, 100, 1000, 600, 500, 800, 200, 300, 400, 700, 800, 900, 900, 800, 100, 400, 700, 300, 1000, 200]
runtimePlot = [2.928, 0.889, 0.589, 0.254, 1.597, 2.083, 4.985, 4.25, 4.148, 5.267, 0.148, 0.524, 3.062, 1.041, 0.055, 6.549, 0.259, 1.632, 2.352, 1.417, 2.196, 6.48, 2.855, 0.837, 0.057, 4.912, 2.318, 1.617, 6.266, 0.547, 0.059, 0.052, 6.365, 2.218, 1.55, 3.945, 0.253, 0.563, 1.017, 3.059, 5.525, 5.568, 5.635, 4.456, 0.071, 1.305, 3.414, 0.546, 6.689, 0.229]
numDigsPlot = [684, 376, 297, 198, 483, 577, 879, 798, 791, 873, 145, 280, 683, 399, 92, 992, 200, 495, 567, 468, 600, 1000, 671, 360, 95, 893, 597, 498, 1000, 298, 95, 88, 990, 591, 500, 774, 198, 300, 397, 698, 784, 880, 881, 773, 99, 395, 695, 299, 996, 189]


#Alg 1, different density
gridAreaPlot2 = [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400]
runtimePlot2 = [0.862, 0.946, 0.972, 1.06, 1.026, 1.024, 1.054, 1.065, 1.047, 0.941, 0.873, 0.891, 1.009, 0.955, 1.059, 0.604, 0.956, 0.94, 1.09, 0.94, 0.983, 1.051, 1.022, 0.992, 1.017, 1.062, 0.981, 0.473, 1.038, 0.939, 0.847, 0.957, 1.045, 0.892, 0.959, 1.149, 1.126, 1.065, 1.074, 0.896, 0.977, 1.125, 1.103, 0.809, 0.965, 0.923, 0.96, 1.045, 1.043, 0.934]
numDigsPlot2 = [389, 386, 373, 399, 385, 393, 381, 396, 399, 400, 390, 393, 397, 393, 381, 273, 389, 392, 400, 397, 400, 361, 394, 399, 395, 391, 399, 235, 378, 397, 398, 396, 396, 394, 384, 391, 393, 382, 390, 390, 390, 392, 400, 325, 393, 393, 367, 399, 399, 395]
bombs = ['72', '32', '16', '56', '40', '40', '16', '56', '24', '64', '80', '72', '32', '64', '24', '8', '48', '56', '16', '80', '80', '8', '48', '64', '24', '40', '48', '8', '24', '64', '80', '72', '32', '80', '24', '64', '48', '8', '32', '72', '40', '56', '16', '8', '48', '56', '16', '40', '32', '72']




#Alg 2, different sizes
gridAreaPlot10 = [100, 400, 300, 200, 500, 600, 100, 300, 800, 900, 200, 300, 700, 400, 100, 2000, 200, 500, 600, 100, 600, 1000, 700, 400, 100, 900, 600, 500, 1000, 300, 100, 100, 1000, 600, 500, 800, 200, 300, 400, 700, 800, 900, 900, 800, 100, 400, 700, 300, 1000, 200]
runtimePlot10 = [2.928, 0.889, 0.589, 0.254, 1.597, 2.083, 4.985, 4.25, 4.148, 5.267, 0.148, 0.524, 3.062, 1.041, 0.055, 6.549, 0.259, 1.632, 2.352, 1.417, 2.196, 6.48, 2.855, 0.837, 0.057, 4.912, 2.318, 1.617, 6.266, 0.547, 0.059, 0.052, 6.365, 2.218, 1.55, 3.945, 0.253, 0.563, 1.017, 3.059, 5.525, 5.568, 5.635, 4.456, 0.071, 1.305, 3.414, 0.546, 6.689, 0.229]
numDigsPlot10 = [684, 376, 297, 198, 483, 577, 879, 798, 791, 873, 145, 280, 683, 399, 92, 992, 200, 495, 567, 468, 600, 1000, 671, 360, 95, 893, 597, 498, 1000, 298, 95, 88, 990, 591, 500, 774, 198, 300, 397, 698, 784, 880, 881, 773, 99, 395, 695, 299, 996, 189]


#Alg 2, different density
gridAreaPlot20 = [1400, 400, 400, 400, 400, 400, 2300, 400, 3200, 350, 400, 400, 400, 400,   23300, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400]
runtimePlot20 = [0.862, 0.946, 0.972, 1.06, 1.026, 1.024, 1.054, 1.065, 1.047, 0.941, 0.873, 0.891, 1.009, 0.955, 1.059, 0.604, 0.956, 0.94, 1.09, 0.94, 0.983, 1.051, 1.022, 0.992, 1.017, 1.062, 0.981, 0.473, 1.038, 0.939, 0.847, 0.957, 1.045, 0.892, 0.959, 1.149, 1.126, 1.065, 1.074, 0.896, 0.977, 1.125, 1.103, 0.809, 0.965, 0.923, 0.96, 1.045, 1.043, 0.934]
numDigsPlot20 = [389, 386, 373, 399, 385, 393, 381, 396, 399, 400, 390, 393, 397, 393, 381, 273, 389, 392, 400, 397, 400, 361, 394, 399, 395, 391, 399, 235, 378, 397, 398, 396, 396, 394, 384, 391, 393, 382, 390, 390, 390, 392, 400, 325, 393, 393, 367, 399, 399, 395]
bombs = ['72', '32', '59', '56', '34', '28', '16', '56', '24', '64', '80', '32', '124', '64', '24', '82', '48', '56', '5', '80', '80', '8', '48', '64', '24', '40', '48', '8', '24', '64', '80', '72', '32', '80', '24', '64', '48', '8', '32', '72', '40', '56', '16', '8', '48', '56', '16', '40', '32', '72']








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