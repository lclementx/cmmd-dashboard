import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  Avatar,
  Divider,
  alpha,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  iconClasses
} from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
import Label from 'src/components/Label';
import type { ApexOptions } from 'apexcharts';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from "ethers";
declare let window: any;
var abi_json = require('./abi.json');

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
    background: ${theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.00)
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

const cpiDates = [
  'January 2021',
  'February 2021',
  'March 2021',
  'April 2021',
  'May 2021',
  'June 2021',
  'July 2021',
  'August 2021',
  'September 2021',
  'October 2021',
  'November 2021',
  'December 2021',
  'January 2022',
  'February 2022',
  'March 2022',
  'April 2022',
  'May 2022',
  'June 2022',
  'July 2022',
  'August 2022',
  'September 2022',
]

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
  background: ${theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.00)
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

function AccountBalance() {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 3
    },
    legend: {
      show: false
    },
    labels: cpiDates,
    xaxis: {
      labels: {
        show: true
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function () {
            return 'Index';
          }
        }
      },
      marker: {
        show: false
      }
    }
  }

  // create states
  const [clementBalance, setClementBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [supply, setSupply] = useState(0)
  const [weiSupply, setWeiSupply] = useState(0)

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
        const normalizedBalance = parseInt(String(balance._hex), 16) / (10 ** 18)
        setClementBalance(normalizedBalance);
        setLoading(false);

        const cmmdWeiSupply = await contract.totalSupply().then(result => parseInt(String(result._hex), 16))
        const cmmdSupply = cmmdWeiSupply / 10 ** 18
        setSupply(cmmdSupply)
        setWeiSupply(cmmdWeiSupply)
        console.log(supply)
      }
    };

    invokeMetaMask().catch(console.error);
  })

  const chart1Data = [
    {
      name: 'HK CPI',
      data: [
        101.1,
        101.4,
        101.5,
        101.8,
        101.6,
        101.3,
        101.4,
        101.5,
        99.2,
        102.0,
        102.2,
        102.2,
        102.3,
        103.1,
        103.3,
        103.1,
        102.9,
        103.2,
        103.3,
        103.4,
        103.5,
      ]
    }
  ];

  const latestDate = cpiDates[cpiDates.length - 1]
  const latestCPI = chart1Data[0].data[chart1Data[0].data.length - 1]

  return (
    <Card
      sx={{
        overflow: 'visible'
      }}
    >
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3
              }}
              variant="h4"
            >
              Total CMMD Supply
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                {supply} CMMD
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                {weiSupply} WEI
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <img
                  alt="CPI"
                  src="/static/images/placeholders/logo/07_00_Prices.svg"
                />
              </AvatarWrapper>
              <Box sx={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 1.5
              }}>
                <Typography variant="h4" noWrap>
                  Hong Kong CPI
                  </Typography>
                <Typography variant="subtitle1" noWrap>
                  CPI
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                {latestCPI}
              </Typography>
              <Typography variant="subtitle1">
                {latestDate}
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart1Data}
            type="area"
            height={200}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
