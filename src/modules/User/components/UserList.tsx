import React, {FC} from 'react';

import UserItem from './UserItem';
import {User} from "../types";

interface Props {
  users: User[];
}

const UserList : FC<Props> = ({users}) => {

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