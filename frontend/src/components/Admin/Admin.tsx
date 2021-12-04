import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import Notice from './NoticePage';

function Admin(): JSX.Element {
  const [currentProp, setCurrentProp] = useState<string>('');

  const location = useLocation();
  const urlInputId: string = location.pathname.substring(
    location.pathname.lastIndexOf('/') + 1,
    location.pathname.length
  );
  useEffect(() => {
    setCurrentProp(urlInputId);
  }, [urlInputId]);

  if (currentProp === 'Notice') return <Notice />;
  return <div>Admin</div>;
}

export default Admin;
