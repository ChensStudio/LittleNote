import './chain3Init';
import {contractAddr, contractAbi} from '../../api/const';

export function initAccount(){
    let contractInstance = chain3.mc.contract(contractAbi).at(contractAddr);
    let accountAddr = [];
    let accountData = [];

    if(contractInstance){
        for(let i = 0; ; i++){
            try{
                var addr = contractInstance.accountsArray(i);

                if(addr != '0x')
                    accountAddr.push(addr);
                else
                    break;
            }   
            catch(e){
                break;
            } 
        }

        for(let i=0; i<accountAddr.length; i++){
            let item = contractInstance.getAccount(accountAddr[i]);

            accountData.push({
                address: accountAddr[i],
                name: item[0],
                noteCounts: item[1],
            });
        }
    }

    // console.log(accountData);
    return accountData;
};

export function initNote(){
    let contractInstance = chain3.mc.contract(contractAbi).at(contractAddr);
    let noteID = [];
    let noteData = [];

    if(contractInstance){
        for(let i = 0; ; i++){
            try{
                var id = contractInstance.notesArray(i);
                if(id != '0x')
                    noteID.push(id);
                else
                    break;
            }   
            catch(e){
                break;
            } 
        }

        for(let i=0; i<noteID.length; i++){
            let item = contractInstance.getNote(noteID[i]);

            noteData.push({
                address: item[1],
                latlng: {
                    lng: item[3],
                    lat: item[4]
                },
                grid: item[5],
                grid10: item[6],
                note: item[2],
                forSell: item[7],
                onChainFlag: true,
                createdAt: item[10],
                updatedAt: item[10]
            });
        }
    }

    return noteData;
};