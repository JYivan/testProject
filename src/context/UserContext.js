import React from 'react'

const UserContext = React.createContext({
  token: '',
  user: {},
  roles: [],
  updateUserContext: () => {}
})

export default UserContext

export function withUser (Component) {
  return function UserComponent (props) {
    return (
      <UserContext.Consumer>
        {userProps => <Component {...props} {...userProps} />}
      </UserContext.Consumer>
    )
  }
}
