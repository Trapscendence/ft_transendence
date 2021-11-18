import { Backdrop, CircularProgress } from '@mui/material';

interface LoadingBackdropProps {
  loading: boolean;
}

export default function LoadingBackdrop({
  loading,
}: LoadingBackdropProps): JSX.Element {
  return (
    <Backdrop
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={loading}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
