from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_pymongo import PyMongo
import time

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/comments"
mongodb_client = PyMongo(app)
db = mongodb_client.db


@app.route('/api')
def index():
    return "hello"

@app.route('/api/comment', methods=['POST'])
def addComent():
    #add comment
    data = request.get_json()
    print(data)
    data['createdTime'] = time.time()
    db.comments.insert_one(data)
    return {}

@app.route('/api/comments', methods=['GET'])
def getComments():
    commentsListCursor = db.comments.find()
    commentsList = []
    timelineComments = []

    for comment in commentsListCursor:
        comment['_id'] = str(comment['_id'])
        comment['avatar'] = "https://ui-avatars.com/api/?background=random&bold=true&rounded=true&size=28&name=" + comment['username'][0:1]
        commentsList.append(comment)

    commentsList.sort(key=timeAscend)

    for i in range(len(commentsList)):
        lastTimelineComment = 0
        while lastTimelineComment != 0 and commentsList[i]['timestamp'] == lastTimelineComment['timestamp']:
            i += 1
        else:
            timelineComments.append(commentsList[i])
        lastTimelineComment = timelineComments[len(timelineComments) - 1]

    for comment in timelineComments:
        comment['avatar'] = "https://ui-avatars.com/api/?background=random&bold=true&size=28&name=" + comment['username'][0:1]
    
    comments = {'commentsList' : commentsList, 'timelineComments' : timelineComments}
    return comments

def timeAscend(e):
    return e['timestamp']


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)