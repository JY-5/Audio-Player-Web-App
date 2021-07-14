import React from 'react';

export const CommentsList = (props) => {
    return (
        <>
            <ul className="comments-list">
                {props.commentsList ? props.commentsList.map((comment) => {
                    return (<li key={comment._id}>
                        <div className="info">
                            <img src={comment.avatar} alt="" className="avatar"/>
                            <span className="username">{comment.username} </span>
                            <span className="at"> at </span>
                            <span className="minute">{Math.floor(comment.timestamp / 60)}</span>
                            <span> : </span>
                            <span>{Math.floor(comment.timestamp % 60)}</span>
                        </div>
                        <p>{comment.comment}</p>
                    </li>)

                }) : null}
            </ul>
        </>
    )
}