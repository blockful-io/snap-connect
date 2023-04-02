import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';




let encryptionPublicKey;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  console.log('request.method: ', request.method);

  switch (request.method) {
    

    case 'hello':
      const name = 'DevInvestidorxxxxxxx';
      // request rpc to get public key (eth_getEncryptionPublicKey)
      
      console.log('KARAN')


      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Alert',
          content: panel([            
            text('The thing that happened is...'),
          ]),
        },
      });

    default:
      throw new Error('Method not found.');
  }
};

