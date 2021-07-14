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

## Reasons to choose a NoSQL database
1. NoSQL databases allow data schemas to change in the future. It is more convinient for us if product and data models change later.
2. It is faster to query the data we need from NoSQL databases because we do not need to join different tables as we do in SQL databases.
3. NoSQL databases can scale horizontally, which is faster and cheaper for scaling than SQL databases, which are vertically scalable.
4. SQL databases follow ACID properties (Atomicity, Consistency, Isolation, and Durability), whereas the NoSQL database follows the Brewers CAP theorem (Consistency, Availability and Partition tolerance) and BASE properties ( Basically Available, Soft state, Eventually Consistent). Since the comments on this app is for social networking or leisure, so it is acceptable for us to use NoSQL databases. We probably do not have to follow the highest standard for data integrity, based on our users' needs.
5. NoSQL databases are easier for developers to implement.

## Extra Notes
1. I do not have time to the last feature - allow a user to read the comment along with the username on the timestamps as they hover over the overlaid thumbnails on the waveform.

I would achieve it by storing all thumbnail locations in the canvas. When hover on the thumnails, I would use canvas to draw text box with the corresponding comment.
