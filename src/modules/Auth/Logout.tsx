import React, { useEffect, useCallback, FC } from 'react';
import { auth } from "../../Firebase";
import PageLoading from '../../components/PageLoading';


const Logout : FC<{}> = () => {

  const processSignOut = useCallback(async () => {

    try {
      await auth.signOut();
    } catch (error) {
      //
    }

  }, []);

	useEffect(() => {
		processSignOut();
	}, [processSignOut]);

	return <PageLoading />;
}

export default Logout;