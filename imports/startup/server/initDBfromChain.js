import './chain3Init';
import {littleNoteContractAddr, littleNoteContractAbi} from '../../api/const';

export function initAccount(){
    let contractInstance = chain3.mc.contract(littleNoteContractAbi).at(littleNoteContractAddr);
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
                name: item[1],
                noteCounts: item[2].toNumber(),
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
                _id:item[0],
                address: item[1],
                latlng: {
                    lat: item[3].toNumber(),
                    lng: item[4].toNumber()
                },
                grid: item[5].toNumber(),
                grid10: item[6].toNumber(),
                note: item[2],
                forSell: item[7],
                onChainFlag: true,
                createdAt: item[10].toNumber(),
                updatedAt: item[10].toNumber()
            });
        }
    }

    // console.log('noteData',noteData);
    return noteData;
};