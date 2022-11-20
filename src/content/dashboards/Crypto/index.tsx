import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from './AccountBalance';
import Wallets from './Wallets';
import CMMDFunctions from './CMMDFunctions';
import Oracle from './Oracle';
import Tools from './Tools';

function DashboardCrypto() {
  return (
    <>
      <Helmet>
        <title>CMMD Dashboard</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <AccountBalance />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Wallets />
          </Grid>
          <Grid item lg={6} xs={12}>
            <CMMDFunctions />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Oracle />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Tools/>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
