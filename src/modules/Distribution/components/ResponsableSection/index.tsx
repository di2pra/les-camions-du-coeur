import React, { FC, memo } from 'react';

import UserList from '../../../User/components/UserList';
import { Member, MemberType } from '../../../Membership/types';

interface Props {
  membres: Member[]
}

const ResponsableSection: FC<Props> = ({ membres }) => {
  const responsables = membres.filter((membre) => membre.type === MemberType.RESPONSABLE);
  return responsables.length > 0 ? (
    <UserList users={responsables} />
  ) : <p>Aucun responsable</p>;
};

export default memo(ResponsableSection);
