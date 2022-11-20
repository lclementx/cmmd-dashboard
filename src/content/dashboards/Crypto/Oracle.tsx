import {
    Button,
    Card,
    Grid,
    Box,
    CardContent,
    Typography,
    Avatar,
    alpha,
    Tooltip,
    CardActionArea,
    styled
  } from '@mui/material';
  import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasketTwoTone';
  import PriceChangeIcon from '@mui/icons-material/PriceChangeTwoTone';
  import { useCallback, useEffect, useState } from 'react';
  import { ethers } from "ethers";
  declare let window: any;
  var oracleAbi_json = require('./oracleABI.json');
  const factor = 10**18
  
  const AvatarWrapper = styled(Avatar)(
    ({ theme }) => `
      margin: ${theme.spacing(2, 0, 1, -0.5)};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: ${theme.spacing(1)};
      padding: ${theme.spacing(0.5)};
      border-radius: 60px;
      height: ${theme.spacing(5.5)};
      width: ${theme.spacing(5.5)};
      background-color: ${theme.colors.warning.lighter};
      color:  ${theme.colors.warning.main};
    
      img {
        background: ${theme.colors.alpha.trueWhite[100]};
        padding: ${theme.spacing(0.5)};
        display: block;
        border-radius: inherit;
        height: ${theme.spacing(4.5)};
        width: ${theme.spacing(4.5)};
      }
  `
  );
  
  const AvatarWrapperSuccess = styled(Avatar)(
    ({ theme }) => `
        background-color: ${theme.colors.success.lighter};
        color:  ${theme.colors.success.main};
  `
  );

  const AvatarAddWrapper = styled(Avatar)(
    ({ theme }) => `
          background: ${theme.colors.alpha.black[10]};
          color: ${theme.colors.primary.main};
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
  `
  );
  
  const CardAddAction = styled(Card)(
    ({ theme }) => `
          border: ${theme.colors.primary.main} dashed 1px;
          height: 100%;
          color: ${theme.colors.primary.main};
          transition: ${theme.transitions.create(['all'])};
          
          .MuiCardActionArea-root {
            height: 100%;
            justify-content: center;
            align-items: center;
            display: flex;
          }
          
          .MuiTouchRipple-root {
            opacity: .2;
          }
          
          &:hover {
            border-color: ${theme.colors.alpha.black[70]};
          }
  `
  );
    
  function Oracle() {
    const [marketData, setMarketData] = useState(0);
    const [cpiData, setCPIData] = useState(0);
    const [loading, setLoading] = useState(true);
  
    const onLoad = useEffect(() => {
      const invokeOracle = async () => {
        if (loading == true) {
          // get provider and signer
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
  
          // fetch abi
          const oracleAbi = JSON.parse(JSON.stringify(oracleAbi_json));
  
          // create contract instance
          const cpiOracleAddress = "0xb31fFa2e5d501F9f606Ff4A5F3E5E281394f7C60";
          const cpiOracle = new ethers.Contract(cpiOracleAddress, oracleAbi, signer);
          const marketOracleAddress = "0x91Be6B000dD141dEC7B71165049D93f50f0253DF";
          const marketOracle = new ethers.Contract(marketOracleAddress, oracleAbi, signer);

          const market = await marketOracle.getData().then(result => result[0]._hex) //First result is the value
          const cpi = await cpiOracle.getData().then(result => result[0]._hex) //First result is the value

          const marketPrice = parseInt(String(market), 16) / factor
          const cpiValue = parseInt(String(cpi), 16) / factor
          setLoading(false);
          setMarketData(marketPrice)
          setCPIData(cpiValue)
        }
      };
  
      invokeOracle().catch(console.error);
    })
  
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-fit"
          sx={{
            pb: 3
          }}
        >
        <Typography variant="h3">Oracles</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={4} item>
            <Card
              sx={{
                px: 1
              }}
            >
              <CardContent>
                <AvatarWrapper>
                  <PriceChangeIcon/>
                </AvatarWrapper>
                <Typography variant="h5" noWrap>
                  Market Price
                </Typography>
                <Box
                  sx={{
                    pt: 1
                  }}
                >
                  <Typography variant="h3" gutterBottom noWrap>
                  ${marketData}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={4} item>
            <Card
              sx={{
                px: 1
              }}
            >
              <CardContent>
                <AvatarWrapper>
                  <ShoppingBasketIcon/>
                </AvatarWrapper>
                <Typography variant="h5" noWrap>
                  CPI Data
                </Typography>
                <Box
                  sx={{
                    pt: 1
                  }}
                >
                  <Typography variant="h3" gutterBottom noWrap>
                    {cpiData}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
  
export default Oracle;
  