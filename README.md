# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), Python3, Flask, and MongoDB. 
I use Wavesurfer.js library to show the audio waveform. 
And HTML Canvas is used to draw thumnails on the timeline.

## Install
You’ll need to have Node(>= 10), MongoDB, Python3, NPM/Yarn installed on your local development machine.

### Installation guidance for MongoDB on Mac OS 
(https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/ https://attacomsian.com/blog/install-mongodb-macos)

Install the Xcode command-line tools by running the following command in your macOS Terminal:
#### `xcode-select --install`

#### Creating data folder for storing MongoDB data:
Before macOS Catalina, you can create this folder in the user's root directory with the following command:
##### `$ sudo mkdir -p /data/db`
adjust permission:
##### ```$ sudo chown -R `id -un` /data/db```

If you are on macOS Catalina or Big Sur (or any future release), you can not use the root folder for this purpose. macOS Catalina runs in a read-only system volume, separate from other files on the system.

Apple created a secondary volume on Catalina that you need to use for storing MongoDB data folder:
##### `$ sudo mkdir -p /System/Volumes/Data/data/db`
##### ```$ sudo chown -R `id -un` /System/Volumes/Data/data/db```

#### Installing MongoDB
You can install the MongoDB community edition with Homebrew. If Homebrew is not already installed, execute the following command first:
##### `$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

Now update Homebrew to the latest version:
##### `$ brew update`
Next, tap the MongoDB formulae into Homebrew:
##### `$ brew tap mongodb/brew`
Finally, execute the following command to install the MongoDB community edition:
##### `$ brew install mongodb-community`

#### Managing MongoDB Service
First of all, install brew services by tapping homebrew/services:
##### `$ brew tap homebrew/services`
To start the MongoDB service, you use the following command:
##### `$ brew services start mongodb-community`
The above command will start MongoDB as a background service. Here's what you will see on the terminal:
==> Successfully started `mongodb-community` (label: homebrew.mxcl.mongodb-community)

## Available Scripts
In the project directory, 

to run the back end, you need

in macOS/Linux
### `cd api`
### `source venv/Scripts/activate`
### `pip install -r requirements.txt`
### `python api.py`

in Windows:
### `cd api`
### `venv\Scripts\activate`
### `pip install -r requirements.txt`
### `python api.py`

to run the front end, you need

### `npm install` 
to install dependencies

### `npm start`
to start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Screenshots

### Player with a hover effect on a user's avatar to show its comment:
![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/4%20hover.png)

### Comments List:
![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/5%20commentsList.png)

### Handle the comment at the last second
![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/7%20ending.png)

### Responsive and adaptive layout
![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/Responsive%202.png)

![image](https://github.com/JY-5/Audio-Player-Web-App/blob/main/Screenshots/Responsive%203.png)

## Reasons to choose a NoSQL database
1. NoSQL databases allow data schemas to change in the future. It is more convenient for us if product and data models change later.
2. It is faster to query the data we need from NoSQL databases because we do not need to join different tables as we do in SQL databases.
3. NoSQL databases can scale horizontally, which is faster and cheaper for scaling than SQL databases, which are vertically scalable.
4. SQL databases follow ACID properties (Atomicity, Consistency, Isolation, and Durability), whereas the NoSQL database follows the Brewers CAP theorem (Consistency, Availability and Partition tolerance) and BASE properties ( Basically Available, Soft state, Eventually Consistent). Since the comments on this app is for social networking or leisure, so it is acceptable for us to use NoSQL databases. We probably do not have to follow the highest standard for data integrity, based on our users' needs.
5. NoSQL databases are easier for developers to implement.

## Notes
Problem: Everything works fine except that the hover effect with y axis has a minor problem. When cursor moves away from the thumbnail, the comment may not disappear because coordinate in y axis is not handled perfectly. This needs more debugging and overall this does not affect the hover effect to show comments timely when we hover on different thumbnails.
