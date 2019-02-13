#!/usr/bin/env python
# Name: Sofie Löhr
# Student number: 11038926
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# open csv and read Ratings into dictionary
with open(INPUT_CSV) as csvfile:
	input_file = csv.DictReader(csvfile)
	for row in input_file:
		for key in range(START_YEAR, END_YEAR):
			key = str(key)
			if row['Year'] == key:
				data_dict[key].append(float(row['Rating']))

# calculate the mean Rating for every year and put in dictionary
mean = {str(key): [] for key in range(START_YEAR, END_YEAR)}
for key in range(START_YEAR, END_YEAR):
	key = str(key)	
	ratings = data_dict[key]
	mean[key].append(round(sum(ratings)/len(ratings),2))

# VISUALIZE
# line with mean ratings by year
plt.subplot(211)
plt.plot(*zip(*sorted(mean.items())), 'r')
plt.ylim(0,10)
plt.title('Top 50: Average rating & number of movies by year')
plt.ylabel('Average rating')

# bar of number of movies in top 50 by year
number_movies = {str(key): [] for key in range(START_YEAR, END_YEAR)}
for key in range(START_YEAR, END_YEAR):
	key = str(key)	
	number_movies[key].append(len(data_dict[key]))

#plt.subplot(212)
plt.subplot(212)
plt.plot(*zip(*sorted(number_movies.items())), 'b')
plt.xlabel('Years')
plt.ylabel('Number of movies')
plt.show()



if __name__ == "__main__":
    print(data_dict)