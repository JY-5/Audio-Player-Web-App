import React, { useEffect, useState } from 'react';
import { Player } from '../Components/Player';
import { CommentsList } from '../Components/CommentsList';
import { getComments } from '../services';

export const AudioPage = () => {
    const [comments, setComments] = useState([]);

    useEffect (() => {
        fetchComments();
    }, [])
    
    const fetchComments = () => {
        getComments()
        .then((data) => {
            setComments(data);
        })
        .catch( err => {
            console.log("error getting comment");
            //setStatus(err.error);
            //setIsPending(false);
        });    
    }    

    return (
        <div>
            <Player fetchComments={fetchComments} timelineComments={comments.timelineComments ? comments.timelineComments : []}/>
            <CommentsList commentsList={comments.commentsList} />
        </div>
    )
}