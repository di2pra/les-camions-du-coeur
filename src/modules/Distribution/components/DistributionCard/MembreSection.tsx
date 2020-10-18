import React, { FC, memo } from 'react';
import UserList from '../../../User/components/UserList';
import { MemberWithUserInfo } from '../../../User/types';
import { MemberType } from '../../../Membership/types';


interface Props {
  membres: MemberWithUserInfo[]
}

const MembreSection : FC<Props> = ({membres}) => {

  const participants = membres.filter((membre) => membre.type === MemberType.MEMBER);

  const sectionContent = (participants.length > 0) ? <UserList users={participants} /> : <p>Aucun membre</p>;

  return (
    <section>
      <h1>Membre(s)</h1>
      {sectionContent}
    </section>
  );
};


export default memo(MembreSection);