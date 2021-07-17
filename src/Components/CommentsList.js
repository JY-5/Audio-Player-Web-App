import React from 'react';

export const CommentsList = (props) => {
    return (
        <>
            <ul className="comments-list">
                {props.commentsList ? props.commentsList.map((comment) => {
                    const minutes = Math.floor(comment.timestamp / 60);
                    const minutesStr = (minutes < 10 ? "0" : "") + minutes.toString();
                    const seconds = Math.floor(comment.timestamp % 60);
                    const secondsStr = (seconds < 10 ? "0" : "") + seconds.toString();
                    return (    
                        <li key={comment._id}>
                            <div className="info">
                                <img src={comment.avatar} alt="" className="avatar"/>
                                <span className="username">{comment.username} </span>
                                <span className="at"> at </span>
                                <span className="minute">{minutesStr}</span>
                                <span> : </span>
                                <span>{secondsStr}</span>
                            </div>
                            <p>{comment.comment}</p>
                        </li>)
                }) : null}
            </ul>
        </>
    )
}