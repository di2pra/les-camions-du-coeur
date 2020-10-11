import React, { useEffect, useCallback } from 'react';
import { auth } from "../../Firebase";
import PageLoading from '../../components/PageLoading';


function Logout(props) {

  const processSignOut = useCallback(async () => {

    try {
      await auth.signOut();
    } catch (error) {
    }
    
  }, []);

	useEffect(() => {
		processSignOut();
	}, [processSignOut]);

	return <PageLoading />;
}

export default Logout;