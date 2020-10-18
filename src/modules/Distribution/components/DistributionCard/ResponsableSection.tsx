import React, { FC, memo } from 'react';
import UserList from '../../../User/components/UserList';
import { MemberWithUserInfo } from '../../../User/types';
import { MemberType } from '../../../Membership/types';


interface Props {
  membres: MemberWithUserInfo[]
}

const ResponsableSection : FC<Props> = ({membres}) => {

  const responsables = membres.filter((membre) => membre.type === MemberType.RESPONSABLE);

  const sectionContent = (responsables.length > 0) ? <UserList users={responsables} /> : <p>Aucun responsable</p>;

  return (
    <section>
      <h1>Responsable(s)</h1>
      {sectionContent}
    </section>
  );
};

export default memo(ResponsableSection);