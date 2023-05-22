import React, {useEffect, useState, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`)
        .then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`)
        .then((response) => {
            setComments(response.data);
        });

    }, [id])

    const addComment = () => {
        axios.post("http://localhost:3001/comments", {commentBody: newComment , PostId: id },
        {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }
        )
        .then((response) => {
            if (response.data.error){
                console.log(response.data.error);
            } else {
                const commentToAdd = { commentBody: newComment, username: response.data.username }
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }
        })
    }

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, {
            headers: {'accessToken': localStorage.getItem("accessToken")},
        }).then(() => {
            setComments(comments.filter((comment) => comment.id!== id));
        });
    }

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`,  {
            headers: {'accessToken': localStorage.getItem("accessToken")},
        }).then(() => {
            navigate("/");
        })
    }

    const editPost = (option) => {
        if (option === "title"){
            let newTitle = prompt("Enter New Title");
            axios.put("http://localhost:3001/posts/title", {newTitle: newTitle, id: id}, {headers: {'accessToken': localStorage.getItem("accessToken")}}).then(() => {
                setPostObject({...postObject, title: newTitle});
            });
        }else {
            let newPostText = prompt("Enter New Text");
            axios.put("http://localhost:3001/posts/postText", {newText: newPostText, id: id}, {headers: {'accessToken': localStorage.getItem("accessToken")}}).then(() => {
                setPostObject({...postObject, postText: newPostText});
            });
        }
    }

  return (
    <div className="postPage">
        <div className="leftSide">
            <div className="post" id="individual">
                <div className="title" onClick={() => {
                    if (authState.username === postObject.username){
                        editPost("title")
                    }
                    }} > {postObject.title} </div>
                <div className="body" onClick={() => {
                    if (authState.username === postObject.username){
                        editPost("body")
                    }
                    }} >{postObject.postText}</div>
                <div className="footer">{postObject.username} {authState.username === postObject.username && <DeleteOutlineIcon fontSize='large' style={{paddingLeft: '450px'}} onClick={() => {deletePost(postObject.id)}} />} </div>
            </div>
        </div>
        <div className="rightSide">
            <div className="addCommentContainer">
                <input type="text" value={newComment} placeholder="Write a Comment..." autoComplete="off" onChange={(e) => {setNewComment(e.target.value)}}/>
                <button onClick={ addComment }>Submit</button>
            </div>
            <div className="listOfComments">{
                comments.map((comment, key) => {
                    return (
                        <div key={key} className="comment">
                            {comment.commentBody}
                            <label style={{paddingLeft: '300px', paddingRight: '20px', cursor: "pointer"}}> -- {comment.username}</label>
                            {authState.username === comment.username && <DeleteOutlineIcon fontSize='medium' onClick={() => deleteComment(comment.id)} />}
                        </div>
                    )
                })
            }</div>
        </div>
    </div>
  )
}

export default Post
