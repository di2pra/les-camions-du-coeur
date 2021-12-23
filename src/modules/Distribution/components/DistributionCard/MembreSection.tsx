import React, { FC } from 'react';
import UserList from '../../../User/components/UserList';
import { MemberWithUserInfo } from '../../../User/types';


interface Props {
  membres: MemberWithUserInfo[]
}

const MembreSection : FC<Props> = ({membres}) => {

  const participants = membres.filter((membre) => {return !membre.responsable});

  const sectionContent = (participants.length > 0) ? <UserList users={participants} /> : <p>Aucun membre</p>;

  return (
    <section>
      <h1>Membres</h1>
      {sectionContent}
    </section>
  )
}


export default MembreSection;