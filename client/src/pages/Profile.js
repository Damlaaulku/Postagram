import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import FavoriteIcon from '@material-ui/icons/Favorite';

function Profile() {

    let { id } = useParams()
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
            setUsername(response.data.username);
        });

        axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
            setListOfPosts(response.data);
        });

    }, [id, username]);

  return (
    <div>
        <div className='basicInfo'>
            <h1> Hello: { username } </h1>
            { authState.username === username && <button className='changePwdBttn' onClick= { () => navigate('/changepassword') } > Change Password </button>}
        </div>
      <div>
        {listOfPosts.map((value, key) => {
            return (
            <div key={key} className="post">
                <div className="title"> {value.title} </div>
                <div
                className="body"
                onClick={() => {
                    navigate(`/post/${value.id}`);
                }}
                >
                {value.postText}
                </div>
                <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                <FavoriteIcon /> <label> {value.Likes.length}</label>
                </div>
                </div>
            </div>
            );
        })}
      </div>
    </div>
  )
}

export default Profile
