import React, { useState } from 'react'

const ShowData = ({ data }) => {
  // styling
  const classes = {
    wrapper: 'w-full max-w-5xl mx-auto mt-5 mb-10',
    title: 'text-3xl font-extrabold py-5 text-gray-700 mb-2',
    result: 'bg-white rounded-xl px-5 py-3 mr-3 mb-3 w-64',
    resultInfo: 'font-bold text-gray-600 mt-1',
    resultData: 'w-full text-lg text-gray-800 mt-2',
  }

  // conditional rendering
  if (data === null) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.title}>Result</h2>
      <div className={classes.result}>
        <p className={classes.resultInfo}>Username</p>
        <p className={classes.resultData}>{data.username}</p>
        <p className={classes.resultInfo}>Email</p>
        <p className={classes.resultData}>{data.email}</p>
      </div>
    </div>
  )
}

const CreatePlayerForm = () => {
  const [data, setData] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setData({
      username,
      email,
      password,
    })
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handleEmailChange = (event) => setEmail(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value)

  // styling
  const classes = {
    wrapper: 'w-full max-w-5xl mx-auto mt-5 mb-10',
    title: 'text-3xl font-extrabold py-5 text-gray-700 mb-2',
    form: 'flex flex-wrap rounded-xl bg-white rounded-xl py-2 px-5',
    formWrapper: 'w-full md:w-1/2 pr-3 mb-3',
    formLabel: 'block text-gray-600 font-bold py-3',
    formField:
      'bck border bg-gray-200 w-full border border-gray-200 rounded-xl h-12 px-3 focus:border-gray-600 focus:bg-yellow-100 focus:outline-none',
    button:
      'mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline',
  }

  // render
  return (
    <div className={classes.wrapper}>
      <h2 className={classes.title}>Create Player</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <div className={classes.formWrapper}>
            <label className={classes.formLabel} htmlFor="username">
              Username
            </label>
            <input
              className={classes.formField}
              type="text"
              name="username"
              value={username}
              onChange={handleUsernameChange}
            ></input>
          </div>
          <div className={classes.formWrapper}>
            <label className={classes.formLabel} htmlFor="email">
              Email
            </label>
            <input
              className={classes.formField}
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
            ></input>
          </div>
          <div className={classes.formWrapper}>
            <label className={classes.formLabel} htmlFor="password">
              Password
            </label>
            <input
              className={classes.formField}
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            ></input>
          </div>
          <div className={classes.formWrapper}>
            <label className={classes.formLabel} htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className={classes.formField}
              type="password"
              name="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            ></input>
          </div>
          <div className={classes.formWrapper}>
            <button className={classes.button} type="submit">
              Create
            </button>
          </div>
        </div>
      </form>
      <ShowData data={data} />
    </div>
  )
}

export default CreatePlayerForm
