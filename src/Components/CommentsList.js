import React, { useEffect, useState } from 'react';

export const CommentsList = (props) => {


    return (
        <>

            <ul>
                {props.commentsList ? props.commentsList.map((comment) => {
                    //console.log('comment', comment);
                    return (<li key={comment._id}>
                        <img src={comment.avatar} alt=""/>
                        <p>
                            <span>{comment.username} </span>
                            at
                            <span> {comment.timestamp}</span>
                        </p>
                        <p>{comment.comment}</p>
                    </li>)

                }) : null}
            </ul>
        </>
    )
}