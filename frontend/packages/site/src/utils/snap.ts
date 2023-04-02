import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
 
  window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  });

  // await getPublicKey().then(res => {
  //   console.log('PUBLICKEY c: ', res);    
  //   window.ethereum.request({
  //     method: 'wallet_invokeSnap',
  //     params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  //   });
  // });


};


async function getPublicKey () {  
  const accounts = await window.ethereum.enable();
  console.log('accounts: ', accounts);

  const encryptionPublicKey = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [accounts[0]]
  })

  return encryptionPublicKey
}

async function descrypt (obj : any) {  
  const value = await window.ethereum.request({
    method: 'eth_decrypt',
    params: [obj]
  })

  return value;
}




export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
