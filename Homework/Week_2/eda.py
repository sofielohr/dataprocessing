#!/usr/bin/env python
# Name: Sofie Löhr
# Student number: 11038926
"""
This script parses and processes the data from a csv file
"""

import csv
import pandas as pd 
import numpy
import matplotlib.pyplot as plt
import json


# Global constants
INPUT_CSV = "input.csv"
USE_COLUMNS = ['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']
OUTPUT_FILE = "output.json"

def processing(file):
	"""
	Function cleaning and processing file	

	Data has an outlier (as seen in histogram), namely Suriname (400.000), this value be replaced for NaN
	"""

	# remove whitespace
	file.loc[:,'Region'] = file.loc[:,'Region'].str.strip()

	# remove 'dollar' from GDP
	file.loc[:,'GDP ($ per capita) dollars'] = file.loc[:,'GDP ($ per capita) dollars'].str.strip(' dollars')
	
	# make from unknown 'Not a Number'
	file.iloc[:,1] = file.iloc[:,1].replace('unknown', numpy.nan)
	file.iloc[:,2] = file.iloc[:,2].replace('unknown', numpy.nan)
	file.iloc[:,3] = file.iloc[:,3].replace('unknown', numpy.nan)

	# replace comma by dot
	file['Pop. Density (per sq. mi.)'] = file['Pop. Density (per sq. mi.)'].str.replace(',', '.')
	file['Infant mortality (per 1000 births)'] = file['Infant mortality (per 1000 births)'].str.replace(',', '.')
	
	# convert strings to floats
	file.loc[:,'Pop. Density (per sq. mi.)'] = file.loc[:,'Pop. Density (per sq. mi.)'].astype('float')
	file.loc[:,'Infant mortality (per 1000 births)'] = file.loc[:,'Infant mortality (per 1000 births)'].astype('float')
	file.loc[:,'GDP ($ per capita) dollars'] = file.loc[:,'GDP ($ per capita) dollars'].astype('float')

	# replace outliers
	file = file.replace(400000, numpy.nan)

	return(file)

def central_tendancy(file):
	"""
	Function computing and printing central tendancy and histogram
	"""

	# compute & print mean, median, mode and standard deviation
	mean = file.mean()
	median = file.median()
	mode = file.mode()
	sd = file.std()

	print('Central Tendancy:')
	print('The mean of the variable GDP ($ per capita) is %.1f' % mean)
	print('The median of the variable GDP ($ per capita) is %i' % median)
	print('The mode of the variable GDP ($ per capita) is %i' % mode)
	print('The standard deviation of the variable GDP ($ per capita) is %.1f' % sd)

	# plot histogram
	plt.figure(1, figsize=(9,6))
	plt.subplot(121)
	plt.xlim(0,60000)
	plt.xlabel('GDP ($ per capita)')
	plt.title('Histogram of GDP ($ per capita)')
	file.hist(bins=18)

	return[]

def five_number(file):
	"""
	Function computing and printing five number summary and boxplot
	"""
	minimum = file.min()
	f_quantile = file.quantile(0.25)
	median = file.median()
	t_quantile = file.quantile(0.75)
	maximum = file.max()

	print('\nFive Number Summary:')
	print('The minimum of the variable Infant mortality (per 1000 births) is %.1f' % minimum)
	print('The first quantile of the variable Infant mortality (per 1000 births) is %.1f' % f_quantile)
	print('The median of the variable Infant mortality (per 1000 births) is %.1f' % median)
	print('The third quantile of the variable Infant mortality (per 1000 births) is %.1f' % t_quantile)
	print('The maximum of the variable Infant mortality (per 1000 births) is %.1f' % maximum)


	# plot boxplot
	plt.subplot(122)
	file.plot.box()
	plt.title('Boxplot of infant mortality (per 1000 births)')
	plt.show()

	return[]


if __name__ == "__main__":

	# open input file
	with open(INPUT_CSV) as csvfile:
		data_frame = pd.read_csv(csvfile, index_col=0, usecols=USE_COLUMNS)
	
	# process data
	data_frame = processing(data_frame)

	# central tendancy
	central_tendancy(data_frame.loc[:,'GDP ($ per capita) dollars'])
	
	# five number summary
	five_number(data_frame.loc[:,'Infant mortality (per 1000 births)'])

	# export to json
	export = data_frame.to_json(OUTPUT_FILE, orient='index')



