import React, { FC } from 'react';
import UserList from '../../../User/components/UserList';
import { MemberWithUserInfo } from '../../../User/types';


interface Props {
  membres: MemberWithUserInfo[]
}



const ResponsableSection : FC<Props> = ({membres}) => {

  const responsables = membres.filter((membre) => {return membre.type === "responsable"});

  const sectionContent = (responsables.length > 0) ? <UserList users={responsables} /> : <p>Aucun responsable</p>;

  return (
    <section>
      <h1>Responsables</h1>
      {sectionContent}
    </section>
  )
}

export default ResponsableSection;