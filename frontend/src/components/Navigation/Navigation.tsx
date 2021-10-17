import {
  AccountCircle,
  Forum,
  Send,
  VideogameAsset,
} from '@mui/icons-material';
import { Box, Fab, Tab, Tabs } from '@mui/material';
import React from 'react';

interface NavigationProps {
  tabValue: number;
  handleChange: (e: React.SyntheticEvent, newValue: number) => void;
}

function Navigation({ tabValue, handleChange }: NavigationProps): JSX.Element {
  return (
    <Box
      py={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        borderRight: '1px solid #e0e0e0',
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleChange}
        orientation="vertical"
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab aria-label="game" icon={<VideogameAsset />} />
        <Tab aria-label="channel" icon={<Forum />} />
        <Tab aria-label="profile/my" icon={<AccountCircle />} />
      </Tabs>
      {/* <Fab color="secondary" size="medium">
        <Send />
      </Fab> */}
      <Tab icon={<Send />} />
    </Box>
  );
}

export default Navigation;
