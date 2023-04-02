import { ReactNode, useContext, useState } from 'react';
import styled from 'styled-components';
import { MetaMaskContext, MetamaskActions } from '../hooks';

type CardProps = {
  content: {
    title?: string;
    button?: ReactNode;
  };
  disabled?: boolean;
  fullWidth?: boolean;
};

const CardWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '250px')};
  background-color: ${({ theme }) => theme.colors.card.default};
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const styles: { [name: string]: React.CSSProperties } = {
  container: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  select: {
    padding: 5,
    width: "100%",
    fontSize: "1.5rem"
  },
  result: {
    marginTop: 30,
  },
};

export const CardGetToken = ({ content, fullWidth }: CardProps) => {
  const [state, dispatch] = useContext(MetaMaskContext); 

  const { title, button } = content;
  return (
    <CardWrapper fullWidth={fullWidth}>
      {title && (
        <Title>{title}</Title>
      )}  
   
    <div style={styles.container}>
      <select style={styles.select} value={state.preferredNetwork} onChange={(event) => dispatch({type : MetamaskActions.SetPreferredNetwork, payload: event.target.value})}>        
        <option value="mumbai">Mumbai</option>
        <option value="celo">Celo</option>
        <option value="aurora">Aurora</option>
      </select>
      {/* {selectedOption && <h2 style={styles.result}>{selectedOption}</h2>} */}
    </div>      
      
      {button}
    </CardWrapper>
  );
};
