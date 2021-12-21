import React, {FC} from 'react';

import UserItem from './UserItem';
import {User} from "../types";

interface Props {
  users: User[];
}

const UserList : FC<Props> = ({users}) => {

  /*return (
    <div className="user-list-container">
      {
        users.map((user, index) => {
          return <UserItem key={index} user={user} />;
        })
      }
    </div>
  )*/

  return (
    <div className="user-list-container">
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Lise D.</p>
        </div>
      </div>
      <div className="user user-responsable">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Valentin L.</p>
        </div>
      </div>
      <div className="user user-responsable">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Sandrine B.</p>
        </div>
      </div>
      <div className="user user-responsable">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Olivier C.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Saffia H.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Sébastien D.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Dominique S.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Emmanuelle B.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Arthur d.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Kévin N.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Agathe C.</p>
        </div>
      </div>
      <div className="user user-responsable">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Patrice R.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Yara A.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Victor L.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Lionel C.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Bernard I.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Marina L.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Alix H.</p>
        </div>
      </div>
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Pradheep R.</p>
        </div>
      </div>
      <div className="user user-responsable">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/les-camions-du-coeur.appspot.com/o/profile_pic%2F63cec5a4-9df8-4a14-1146-a894f613560e.png?alt=media&amp;token=d91a02fe-3304-4694-a0c1-dc755a312c2a");'}}
          ></div>
        </div>
        <div className="user-name">
          <p>Gilles D.</p>
        </div>
      </div>
    </div>
  );

}

export default UserList;