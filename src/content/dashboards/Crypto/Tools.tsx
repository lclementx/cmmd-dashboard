import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Card,
    Grid,
    ListItemText,
    List,
    ListItem,
    ListItemAvatar,
    Typography,
    Avatar,
    styled,
} from '@mui/material';
import CalculateTwoTone from '@mui/icons-material/CalculateTwoTone';
import Text from 'src/components/Text';
import { ethers, FixedNumber } from "ethers";
import { ConstructorFragment } from 'ethers/lib/utils';
import { MoneyTwoTone } from '@mui/icons-material';
declare let window: any;
var orcaleabi_json = require('./oracleABI.json');
var cmmdPolicyABI_json = require('./cmmdPolicyABI.json');
var facuetABI_json = require('./faucet_abi.json');
const factor = 10 ** 18

const AvatarWrapperSuccess = styled(Avatar)(
    ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
);

function Tools() {
    const [rebasePercentage,setRebasePercentage] = useState('--');
    const [cmmdRebasePercentage,setCMMDRebasePercentage] = useState('--');
    const [faucetResponse,setFaucetResponse] = useState("");
    const [responseColor,setResponseColor] = useState("green");


    const calculate = useCallback(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const abi = JSON.parse(JSON.stringify(orcaleabi_json));
        const polict_abi = JSON.parse(JSON.stringify(cmmdPolicyABI_json))

        //Initialize oracles
        const cpiOracleAddress = "0xb31fFa2e5d501F9f606Ff4A5F3E5E281394f7C60";
        const cpiOracle = new ethers.Contract(cpiOracleAddress, abi, signer);

        const marketOracleAddress = "0x91Be6B000dD141dEC7B71165049D93f50f0253DF";
        const marketOracle = new ethers.Contract(marketOracleAddress, abi, signer);

        const market = await marketOracle.getData().then(result => result[0]._hex) //First result is the value
        const cpi = await cpiOracle.getData().then(result => result[0]._hex) //First result is the value

        const marketPrice = parseInt(String(market), 16)
        const cpiValue = parseInt(String(cpi), 16)

        //Get rebaseFunctionLowerPercentage_, rebaseFunctionUpperPercentage_ , growth rate
        const policyAddress = "0xfa04fBe38ade87544253C013A136F61AeF72569A";
        const policyContract = new ethers.Contract(policyAddress, polict_abi, signer);
        const lowerPercentage = await policyContract.rebaseFunctionLowerPercentage().then(result => parseInt(String(result._hex), 16));
        const upperPercentage = await policyContract.rebaseFunctionUpperPercentage().then(result => parseInt(String(result._hex), 16));
        const growth = await policyContract.rebaseFunctionGrowth().then(result => parseInt(String(result._hex), 16));
        const baseCPI = await policyContract.baseCpi().then(result => parseInt(String(result._hex), 16));
        const targetRate = cpi / baseCPI
        const regularMarketPrice = marketPrice / factor
        console.log("target rate = ", cpi / baseCPI);
        console.log(growth);

        //Replicating CMMDPolicy equations
        const deltaRange = (upperPercentage - lowerPercentage) / factor;
        const deltaRatio = (upperPercentage / lowerPercentage);
        const growthDecimal = growth / factor
        const deltaPercetage = ((marketPrice / factor) / (cpi / baseCPI)) - 1
        console.log("deltaRange: ", deltaRange, "delta Ration: ", deltaRange, "delta Rate: ", deltaPercetage)
        const numerator = deltaRange
        const growthTerm = 2 ** (-growthDecimal * deltaPercetage)
        const rebasePercentage = (numerator / (1 - (deltaRatio * growthTerm))) + (lowerPercentage / factor)
        console.log(rebasePercentage * 100)

        //Percentage from CMMDPolicy
        const normalizedRate = String((regularMarketPrice / targetRate) * factor)
        const policyRebaseRate = await policyContract.computeRebasePercentage(normalizedRate, String(lowerPercentage),
            String(upperPercentage), String(growth)).then(result => parseInt(String(result._hex), 16));
        const policyRebaseRateNormalized = policyRebaseRate/factor
        console.log(policyRebaseRateNormalized)
        setRebasePercentage(String((rebasePercentage * 100).toFixed(3)))
        setCMMDRebasePercentage(String((policyRebaseRateNormalized * 100).toFixed(3)))
    }, []);

    const faucet = useCallback(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const facuet_abi = JSON.parse(JSON.stringify(facuetABI_json));
        const faucetAddress = "0x6A525C3CADf3e866a8AedcA9554266939386D709";
        const facuetContract = new ethers.Contract(faucetAddress, facuet_abi, signer);

        try{
            const res = await facuetContract.send().then(result => result.hash); 
            console.log(res)
            setFaucetResponse("SUCCESS!")   
            setResponseColor('green')

        } catch(e){
            console.log(e.error.data.message)
            const error = e.error.data.message
            setFaucetResponse(error)
            setResponseColor('red')
        }
    },[])

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
                <Typography variant="h3">Tools</Typography>
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
                                <Button fullWidth variant="contained" onClick={() => calculate()}>
                                    <CalculateTwoTone />
                                </Button>
                            </AvatarWrapperSuccess>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Text color="black">Calculate Rebase Percentage</Text>}
                            primaryTypographyProps={{
                                variant: 'body1',
                                fontWeight: 'bold',
                                color: 'textPrimary',
                                gutterBottom: true,
                                noWrap: true
                            }}
                        />
                        <ListItemText
                            primary={<Text color="warning">{rebasePercentage}%</Text>}
                            secondary={<Typography variant="subtitle1" color="b">Offchain</Typography>}
                            primaryTypographyProps={{
                                variant: 'body1',
                                color: 'textPrimary',
                                gutterBottom: true,
                            }}
                            secondaryTypographyProps={{
                                variant: 'subtitle1',
                                gutterBottom: true,
                            }}
                        />
                        <ListItemText
                            primary={<Text color="secondary">{cmmdRebasePercentage}%</Text>}
                            secondary={<Typography variant="subtitle1" color="b">Onchain</Typography>}
                            primaryTypographyProps={{
                                variant: 'subtitle2',
                                color: 'textSecondary',
                                gutterBottom: true,
                            }}
                        />
                    </ListItem>
                    <ListItem
                        sx={{
                            py: 2
                        }}
                    >
                        <ListItemAvatar>
                            <AvatarWrapperSuccess>
                                <Button fullWidth variant="contained" onClick={() => faucet()}>
                                    <MoneyTwoTone />
                                </Button>
                            </AvatarWrapperSuccess>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Text color="black">Faucet</Text>}
                            primaryTypographyProps={{
                                variant: 'body1',
                                fontWeight: 'bold',
                                color: 'textPrimary',
                                gutterBottom: true,
                                noWrap: true
                            }}
                        />
                         <Grid xs={6}>
                         <ListItemText
                            primary={<Typography color={responseColor} >{faucetResponse}</Typography>}
                            primaryTypographyProps={{
                                variant: 'body1',
                                color: 'textPrimary',
                                gutterBottom: true,
                            }}
                        />
                        </Grid>
                    </ListItem>
                </List>
            </Card>
        </>
    );
}

export default Tools;