import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isFlask,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  ShowAlertSnap,
  Card,
  ProgressStep
} from '../components';
import { FaCheckCircle, FaFileAlt, FaRegCircle } from 'react-icons/fa';


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

  console.log('-------------------');
  console.log('>> isFlask: ', state.isFlask);
  console.log('>> installedSnap: ', state.installedSnap);


  if (state.isFlask) {
    if (!state.installedSnap) activeStep = 1;
    else activeStep = 2;
  } else {
    activeStep = 0;
  }


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const user = queryParams.get('user');
  }, [])


  const handleConnectClick = async () => {
    try {
      console.log('>>> Trying connect Snap...')
      await connectSnap();
      const installedSnap = await getSnap();
      console.log('>>> Snap Connected Sucess!')
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
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
      <Subtitle>


      </Subtitle>

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
        <Card
          content={{
            title: 'Get Token',
            description:
              'Get my exclusive NFT as a gift and join the exclusive group on Telegram!',
            button: (
              <ShowAlertSnap
                onClick={handleSendHelloClick}
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

      </CardContainer>
    </Container>
  );
};


export default Index;
