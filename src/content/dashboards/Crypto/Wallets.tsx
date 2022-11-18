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
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from "ethers";
declare let window: any;
var abi_json = require('./abi.json');

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -1)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.0)
    };
  
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
  
function Wallets() {
  const [clementBalance, setClementBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clementWalletAddress, setClementWalletAddress] = useState('0');

  const onLoad = useEffect(() => {
    const invokeMetaMask = async () => {
      if (loading == true) {
        // get provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        // fetch abi
        const abi = JSON.parse(JSON.stringify(abi_json));

        // create contract instance
        const contractAddress = "0xF2BB333930cF381f237F78B9451447c4Dec7Fa3f";
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // check balance
        const balance = await contract.balanceOf(await signer.getAddress());
        const decimalBalance = parseInt(String(balance._hex), 16)
        const normalizedBalance = (parseInt(String(balance._hex), 16) / (10 ** 18)).toFixed(10)
        setClementBalance(parseFloat(normalizedBalance));
        setLoading(false);
        const walletAddress = await signer.getAddress().then(result => result)
        console.log(walletAddress)
        setClementWalletAddress(walletAddress)
    
      }
    };

    invokeMetaMask().catch(console.error);
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
        <Typography variant="h3">Wallet</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={4} md={12} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="CMMD"
                  src="/static/images/placeholders/logo/CMMD-Logo.png"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Clement
              </Typography>
              <Typography variant="subtitle1" noWrap>
                {clementWalletAddress}
              </Typography>
              <Box
                sx={{
                  pt: 2.5
                }}
              >
                <Typography variant="h3" gutterBottom noWrap>
                {clementBalance} CMMD
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  {clementBalance} CMMD
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Wallets;
