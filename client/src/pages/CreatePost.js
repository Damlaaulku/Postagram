import React, { useContext, useEffect } from 'react'
import {Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext'


function CreatePost() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  const initialValues = {
      title: "",
      postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [authState, navigate])

  const validationSchema = Yup.object().shape({
      title: Yup.string().required("Title field is required"),
      postText: Yup.string().required("Post field is required"),
  });

  const onSubmit = (data) => {
    axios.post('http://localhost:3001/posts', data, { headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      navigate("/");
    });
  };

  return (
    <div className='createPostPage'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
            <label>Title: </label>
            <Field id="inputCreatePost" name="title" placeholder="Title" autocomplete= "off"/>
            <ErrorMessage name="title" component="span"/>
            <label>Post: </label>
            <Field id="inputCreatePost" name="postText" placeholder="Post Text" autocomplete= "off"/>
            <ErrorMessage name="postText" component="span"/>

            <button type='submit'> Create Post </button>
        </Form>
      </Formik>
    </div>
  )
}

export default CreatePost
