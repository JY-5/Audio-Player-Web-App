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
def addComment():
    #add comment
    data = request.get_json()
    if (data['timestamp'] == '') | (data['comment'] == ''):
        return { 'err': "Comment should not be empty"}, 400
    if data['username'] == '':
        return { 'err': "Username should not be empty"}, 400
    data['createdTime'] = time.time()
    data['avatar'] = "https://ui-avatars.com/api/?background=random&bold=true&size=28&name=" + data['username'][0:1]
    db.comments.insert_one(data)
    return {}

@app.route('/api/comments', methods=['GET'])
def getComments():
    commentsListCursor = db.comments.find()
    commentsList = []
    timelineComments = []
    for comment in commentsListCursor:
        comment['_id'] = str(comment['_id'])
        commentsList.append(comment)
    commentsList.sort(key=timeAscend)

    # Get the latest comment at each timestamp
    for i in range(len(commentsList)):
        lastTimelineComment = 0
        while lastTimelineComment != 0 and commentsList[i]['timestamp'] == lastTimelineComment['timestamp']:
            timelineComments[len(timelineComments) - 1] = commentsList[i]
        else:
            timelineComments.append(commentsList[i])
        lastTimelineComment = timelineComments[len(timelineComments) - 1]
    comments = {'commentsList' : commentsList, 'timelineComments' : timelineComments}
    return comments

def timeAscend(e):
    return e['timestamp']


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)