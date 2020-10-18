import React, { FC, memo } from 'react';

import UserList from '../../../User/components/UserList';
import { Member, MemberType } from '../../../Membership/types';

interface Props {
  membres: Member[]
}

const ParticipantSection: FC<Props> = ({ membres }) => {
  const participants = membres.filter((membre) => membre.type === MemberType.MEMBER);
  return participants.length > 0 ? (
    <UserList users={participants} />
  ) : <p>Aucun membre</p>;
};

export default memo(ParticipantSection);