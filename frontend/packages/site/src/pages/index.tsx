import { useCallback, useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getRequestAccounts,
  getSnap,  
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  SendHelloButton,
  ShowAlertSnap,
  Card,
  ProgressStep,
  CardGetToken
} from '../components';
import toast from 'react-hot-toast';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const steps = [
  { icon: '1', description: 'Instalation' },
  { icon: '2', description: 'Wallet Auth' },
  { icon: '3', description: 'Get NFT' },
  { icon: '4', description: 'Finish' },
];

let activeStep = 0;


const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);  
  const [user, setUser] = useState("");
  const [sendToken, setSendToken] = useState(false);

  

  if (state.isFlask) {
    if (!state.installedSnap) activeStep = 1;
    else if (sendToken) activeStep = 4;
    else activeStep = 2;
  } else {
    activeStep = 0;
  }

  useEffect(() => {    
    const queryParams = new URLSearchParams(window.location.search);
    const user = queryParams.get('user');
    setUser(user as string);
  }, [])


  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();
      const user = await getRequestAccounts();

      dispatch({type: MetamaskActions.SetInstalled, payload: installedSnap});
      toast.success("Wallet connected successfully!")
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
      toast.error("Error connecting to wallet!")
    }
  };

  const handleGetTokenClick = async () => {
    try {
      
      fetch('https://backend.snapconnect.us/mint-nft', {
        method: 'POST',
        body: JSON.stringify({
          userId: user,
          network: state.preferredNetwork,
          address: window.ethereum.selectedAddress,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then(() => {
          setSendToken(true); 
          toast.success("Token Received Successfully!");
        });
    } catch (e) {
      console.error(e);
      setSendToken(false);
      dispatch({ type: MetamaskActions.SetError, payload: e });
      toast.error("Error receiving token!!");
    }
  };

  

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };



  return (
    <Container>
      <Heading>
        Welcome to <Span>snap-connect</Span>!
      </Heading>
      <Subtitle></Subtitle>

      <ProgressStep steps={steps} activeStep={activeStep} />
      
      
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}

        {(state.isFlask && !state.installedSnap) && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            
          />
        )}

        {shouldDisplayReconnectButton(state.installedSnap) && (
        <CardGetToken
          content={{
            title: 'Get Token',
            button: (
              <ShowAlertSnap
                onClick={handleGetTokenClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
        />)}

        {state.installedSnap && (
        <Card
          content={{
            title: 'Invite a friend',
            description:
              'Invite a friend to the MetaMask platform.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}          
        />)}
        <div style={{textAlign: 'center', margin: `0 auto`}}>  
          {/* @ts-ignore       */}
          <iframe width="560" height="315" src="https://www.youtube.com/embed/ZjOQbMYcNSU" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
        </div>

      </CardContainer>
    </Container>
  );
};


export default Index;