import {
  Button,
  Card,
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
    background: ${theme.palette.mode === 'dark'
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
    </>
  );
}

export default Wallets;
