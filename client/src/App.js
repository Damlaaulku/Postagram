import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Registration from './pages/Registration';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function App() {

  const [authState, setAuthState] = useState({username: "", id: 0, status: false});

  useEffect(() => {
      axios.get('http://localhost:3001/auth/auth', {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        },
      }).then((response) => {
        if (response.data.error){
          setAuthState({...authState, status: false});
        } else {
          setAuthState({username: response.data.username, id: response.data.id, status: true});
        }
      });
  }, [authState])

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({username: "", id: 0, status: false});
    window.location.replace('/login');
  }

  return (
    <div className="App">
      <AuthContext.Provider value= {{authState, setAuthState}}>
        <Router>
          <div className='navbar'>
            { !authState.status ? ( <>
              <Link to="/login"> Login </Link>
              <div className='appTitle'>
                Welcome to Postagram!
              </div>  
            </>) : ( <>
                <Link to="/"> Home </Link>
                <Link to="/createpost"> Create A Post </Link>
                <div className='loggedInContainer'>
                  <AccountCircleIcon className='profileIcon' fontSize="large" style={{ cursor: "pointer" }} onClick={() => {
                    window.location.replace(`/profile/${authState.id}`);
                  }}/>
                  <button onClick={logout} > Logout </button>
                </div>
              </>)}
          </div>      
          <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/createpost" exact element={<CreatePost/>} />
            <Route path="/post/:id" exact element={<Post/>} />
            <Route path="/registration" exact element={<Registration/>} />
            <Route path="/login" exact element={<Login/>} />
            <Route path="/profile/:id" exact element={<Profile/>} />
            <Route path="/changepassword/" exact element={<ChangePassword/>} />
            <Route path="*" exact element={<PageNotFound/>} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
