import React from 'react'
import {Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Registration() {

  let navigate = useNavigate();

    const initialValues = {
        username: "",
        password: "",
    };
  
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required("Username field is required"),
        password: Yup.string().min(4).max(20).required("Password field is required")
    });

    const onSubmit = (data) => {
        axios.post('http://localhost:3001/auth', data).then((response) => {
            console.log(response.data);
            navigate("/login");
      });
    };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
            <label>Username: </label>
            <Field id="inputCreatePost" name="username" placeholder="Username" autocomplete= "off"/>
            <ErrorMessage name="username" component="span"/>
            <label>Password: </label>
            <Field type="password" id="inputCreatePost" name="password" placeholder="Password" autocomplete= "off"/>
            <ErrorMessage name="password" component="span"/>

            <button type='submit'> Register </button>
        </Form>
      </Formik>
    </div>
  )
}

export default Registration
