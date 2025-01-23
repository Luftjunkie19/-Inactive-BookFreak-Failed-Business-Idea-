import React from 'react'
import {ethers} from 'ethers';



function useCryptoConnect() {
    const connectWallet = async () => {

          try { 

              if (window['ethereum']) { 
                  console.log(window['ethereum']);
                  const provider = new ethers.BrowserProvider(window['ethereum']);
                  const accounts = await provider.listAccounts();
                  console.log(accounts, "accounts");
                  console.log(provider, "provider");
        }
              
          } catch (err) {
              console.log(err);
            }

      
    }
    
    return {connectWallet}
}

export default useCryptoConnect