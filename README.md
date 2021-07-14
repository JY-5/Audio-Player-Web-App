# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), Pthon, Flask, and MongoDB. I use Wavesurfer.js library to show the audio waveform. And HTML Canvas is used to draw thumnails on the timeline.

## Available Scripts

In the project directory, 
to run the front end, you need
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

and to run the back end, you need

in Windows:

### `cd api`
### `venv\Scripts\activate`
### `python api.py`

and you need also MongoDB running in the local environment.

## Extra Notes
1. I do not have time to the last feature - allow a user to read the comment along with the username on the timestamps as they hover over the overlaid thumbnails on the waveform.

I would achieve it by storing all thumbnail locations in the canvas. When hover on the thumnails, I would use canvas to draw text box with the corresponding comment.

2. I did not have time to store audio meta data (name and artist) in the database. I should also store that information. 
