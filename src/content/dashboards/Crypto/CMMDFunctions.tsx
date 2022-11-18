import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  Input,
  ListItemText,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  Avatar,
  styled
} from '@mui/material';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import Text from 'src/components/Text';
import { ethers } from "ethers";
declare let window: any;
var abi_json = require('./abi.json');
var orcaleabi_json = require('./oracleABI.json');
var cmmdPolicyABI_json = require('./cmmdPolicyABI.json');
const factor = 10**18

const AvatarWrapperError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color:  ${theme.colors.error.main};
`
);

const AvatarWrapperSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
);

const AvatarWrapperWarning = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.lighter};
      color:  ${theme.colors.warning.main};
`
);

const cpi_url = 'https://www.censtatd.gov.hk/api/get.php?id=52&lang=en&param=N4IgxgbiBcoMJwJqJqAjDEAGHu+4DZ9iScQAaEAfQBcrMsLqAHe6bEAX0oFkfUQGdlXqVabDmNYMu3EAGcosFhIBMTBFTg8qaAJyrG0ANogASgEMA7roAmrAJa2AHlQB2TRAHtEd1gFIqeRAAXUoAQS0dfUMYU0sbNHsqJ1cPSm9fJICg0MoAISjdAyN46z8Ul3dPHwrA4LCQOCKY0vNy7Mq0mqzk+tC5ABsYGgAnAFcAU04gA';

function CMMDFunctions() {
  const [updateCPIValue, setUpdateCPIValue] = useState("0")
  const [updateMarketPrice, setUpdateMarketPrice] = useState("0")

  const handleCPIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateCPIValue((event.target.value));
    console.log(updateCPIValue);
  };

  const handleMarketPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateMarketPrice((event.target.value));
    console.log(updateMarketPrice);
  };

  // const requestHeaders = new Headers();
  // requestHeaders.set("Access-Control-Allow-Origin", "*");
  // requestHeaders.set("Access-Control-Allow-Headers", "X-Requested-With")
  const getData = async () => {
      const res = await axios.get(cpi_url);
      console.log(res)
  };

  const [loading, setLoading] = useState(true);

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
        const contractAddress = "0x566Bf25BA5ff47fBF179977b4CC8d8cF23fC76eF";
        const contract = new ethers.Contract(contractAddress, abi, signer);

        setLoading(false)
      }
    };

    invokeMetaMask().catch(console.error);
  })

  const updateCPI = useCallback( async (value) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const abi = JSON.parse(JSON.stringify(orcaleabi_json));
    const oracleAddress = "0xb31fFa2e5d501F9f606Ff4A5F3E5E281394f7C60";
    const cpiOracle = new ethers.Contract(oracleAddress, abi, signer);
    const entryValue = parseFloat(value.updateCPIValue)
    const res = await cpiOracle.pushReport(entryValue.toString())
  },[]);

  const updateMarketPriceManually = useCallback( async (value) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const abi = JSON.parse(JSON.stringify(orcaleabi_json));
    const oracleAddress = "0x91Be6B000dD141dEC7B71165049D93f50f0253DF";
    const marketOracle = new ethers.Contract(oracleAddress, abi, signer);
    const entryValue = parseFloat(value.updateMarketPrice) * factor
    const res = await marketOracle.pushReport(entryValue.toString())
  },[]);

  const cmmdRebase = useCallback( async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const abi = JSON.parse(JSON.stringify(orcaleabi_json));
    const policyAddress = "0xBc9e50fD908317ccbF9C4050a160D667F41729E5";
    const policyContract = new ethers.Contract(policyAddress, abi, signer);
    const res = await policyContract.rebase()
  },[]);

  return (
    <>
    <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      pb: 3
    }}
    >
      <Typography variant="h3">CMMD Functions</Typography>
    </Box>
    <Card>
      <List disablePadding>
        <ListItem
          sx={{
            py: 2
          }}
        >
          <ListItemAvatar>
              <AvatarWrapperSuccess>
               <Button fullWidth variant="contained" onClick={() => updateCPI({updateCPIValue})}>
                  <RefreshTwoToneIcon />
               </Button>
              </AvatarWrapperSuccess>
          </ListItemAvatar>
          <ListItemText
            primary={<Text color="black">Update CPI</Text>}
            primaryTypographyProps={{
              variant: 'body1',
              fontWeight: 'bold',
              color: 'textPrimary',
              gutterBottom: true,
              noWrap: true
            }}
          />
          <Input
            name="newCPIValue"
            value={updateCPIValue}
            onChange={handleCPIChange}
          />
        </ListItem>
        <ListItem
          sx={{
            py: 2
          }}
        >
          <ListItemAvatar>
              <AvatarWrapperSuccess>
               <Button fullWidth variant="contained" onClick={() => updateMarketPriceManually({updateMarketPrice})}>
                  <RefreshTwoToneIcon />
                </Button>
              </AvatarWrapperSuccess>
          </ListItemAvatar>
          <ListItemText
            primary={<Text color="black">Update Market Price</Text>}
            primaryTypographyProps={{
              variant: 'body1',
              fontWeight: 'bold',
              color: 'textPrimary',
              gutterBottom: true,
              noWrap: true
            }}
          />
          <Input
            name="newCPIValue"
            value={updateMarketPrice}
            type="text"
            onChange={handleMarketPriceChange}
          />
        </ListItem>
        <ListItem
          sx={{
            py: 2
          }}
        >
        <ListItemAvatar>
              <AvatarWrapperSuccess>
               <Button fullWidth variant="contained" onClick={() => cmmdRebase()}>
                  <RefreshTwoToneIcon />
                </Button>
              </AvatarWrapperSuccess>
          </ListItemAvatar>
          <ListItemText
            primary={<Text color="black">Rebase Supply</Text>}
            primaryTypographyProps={{
              variant: 'body1',
              fontWeight: 'bold',
              color: 'textPrimary',
              gutterBottom: true,
              noWrap: true
            }}
          />
        </ListItem>
      </List>
    </Card>
    </>
  );
}

export default CMMDFunctions;
