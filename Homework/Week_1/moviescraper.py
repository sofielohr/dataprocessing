#!/usr/bin/env python
# Name: Sofie Löhr
# Student number: 11038926
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""
'sep=,' 

import csv
import time
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

def has_class_but_no_id(tag):
    return tag.has_attr('class') and not tag.has_attr('id')

def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    movie = []
    all_movies = []
    movies_list = dom.find_all('div', class_='lister-item-content')
    
    # search every lister item content
    for movies in movies_list: 
            
            # get title
            title = movies.h3.a.get_text()
            movie.append(title)
            
            # get rating
            rating = movies.strong.get_text()
            movie.append(rating)
            
            # get release year
            year_release = movies.h3.find_all('span')
            movie.append(year_release[1].get_text()[-5:-1])
            
            # get actors/actresses
            actors = ''
            cast = movies.find_all('a', href=re.compile("adv_li_st_"))
            for actor in cast:
                if actors == '':
                    actors = actor.get_text()
                else:
                    actors = actors + ', ' + actor.get_text()
            movie.append(actors)

            # get runtime
            runtime = movies.p.find('span', class_='runtime')
            movie.append(runtime.get_text()[:-4])

            # add movie to all movies
            all_movies.append(movie)
            
            # clear the movie list again for the new movie
            movie = []

    return [all_movies]


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    for row in movies:
        writer.writerows(movies[movies.index(row)])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)