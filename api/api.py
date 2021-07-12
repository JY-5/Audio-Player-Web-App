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
    #add_comment
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
    commentsList.sort(key=timesAscend)

    for comment in commentsListCursor:
        comment['_id'] = str(comment['_id'])
        commentsList.append(comment)
        lastTimelineComment = 0
        if lastTimelineComment != 0 and comment['timestamp'] == lastTimelineComment['timestamp']:
            lastTimelineComment['comment'] = comment['comment']
        else:
            timelineComments.append(comment)
        lastTimelineComment = timelineComments[len(timelineComments) - 1]

    print("commentlist", commentsList)
    print("timelinecoments", timelineComments)
    comments = {'commentsList' : commentsList, 'timelineComments' : timelineComments}
    return comments

def timesAscend(item1, item2):
    if item1['timestamp'] < item2['timestamp']:
        return -1
    elif item1['timestamp'] < item2['timestamp']:
        return 1
    else:
        if item1['createdTime'] < item2['createdTime']:
            return -1
        elif item1['createdTime'] > item2['createdTime']:
            return 1
        else:
            return 0

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)