import { React, useEffect, useState } from 'react';
import { ethers, BigNumber } from "ethers";
import { BINAGORIANS_ABI, BINAGORIANS_ADDRESS } from './contracts-config';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  Stack,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

function App() {
  // CONNECTING
  const [account, setAccounts] = useState([]);

  async function connectAccounts() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
    }
  }

  useEffect(() => {
    connectAccounts();
  }, []);

  async function handleCreateBinagorian() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        BINAGORIANS_ADDRESS,
        BINAGORIANS_ABI,
        signer
      );

      try {
        const response = await contract.create("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", Date.parse('2019-01-05 00:00:00Z')/1000, "Binagorian_1", 20);
        console.log("response: ", response);
      }
      catch (err) {
        console.log("error: ", err);
      }
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Text>
              Create Binagorian
            </Text>
            <Stack spacing={3}>
              <Input placeholder='extra small size' size='xs' />
              <Input placeholder='small size' size='sm' />
              <Input placeholder='medium size' size='md' />
              <Input placeholder='large size' size='lg' />
              <ButtonGroup variant='outline' spacing='6'>
                <Button colorScheme='blue' onClick={handleCreateBinagorian}>Save</Button>
                <Button>Cancel</Button>
              </ButtonGroup>
            </Stack>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
