# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), Python3, Flask, and MongoDB. 
I use Wavesurfer.js library to show the audio waveform. 
And HTML Canvas is used to draw thumnails on the timeline.

## Install
You’ll need to have Node(>= 10), MongoDB, Python3, NPM/Yarn installed on your local development machine.

## Available Scripts
In the project directory, 

to run the back end, you need

in macOS/Linux
### `cd api`
### `pip install -r requirements.txt`
### `. venv/bin/activate`
### `python api.py`

in Windows:
### `cd api`
### `pip install -r requirements.txt`
### `venv\Scripts\activate`
### `python api.py`

to run the front end, you need

### `npm install` 
to install dependencies

### `npm start`
to start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Screenshots
![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/Screenshots1.png)
![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/Screenshots2.png)

## Extra Notes
1. I do not have time to the last feature - allow a user to read the comment along with the username on the timestamps as they hover over the overlaid thumbnails on the waveform.

I would achieve it by storing all thumbnail locations in the canvas. When hover on the thumnails, I would use canvas to draw text box with the corresponding comment.

2. I did not have time to store audio meta data (name and artist) in the database. I should also store that information. 
