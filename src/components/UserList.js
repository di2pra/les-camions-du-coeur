import React from 'react';

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


function UserItem({user}) {

  if(typeof user == 'undefined') {
    return (
      <div className="user">
        <div className="user-image"><div className="user-image-content" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/img/profile.png'} )`}}></div></div>
        <div className="user-name"><p>Inconnu</p></div>
      </div>
    )
  } else {

    const name = (user.prenom && user.nom) ? (user.prenom + ' ' + user.nom.substring(0,1) + '.') : user.email;
    return (
      <div className="user">
        <div className="user-image"><div className="user-image-content" style={{backgroundImage: `url(${user.profil_pic === '' ? process.env.PUBLIC_URL + '/img/profile.png' : user.profil_pic } )`}}></div></div>
        <div className="user-name"><p>{name}</p></div>
      </div>
    )
  }

}


export default UserList;