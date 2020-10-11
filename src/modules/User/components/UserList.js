import React from 'react';

import UserItem from './UserItem';

function UserList({users}) {

  return (
    <div className="user-list-container">
      {
        users.map((user, index) => {
          return <UserItem key={index} user={user} />;
        })
      }
    </div>
  )

}

export default UserList;