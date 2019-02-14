import './chain3Init';
import {littleNoteContractAddr, littleNoteContractAbi,areaGameContractAddr,areaGameContractAbi} from '../../api/const';

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

export function initArea(){
    let contractInstance = chain3.mc.contract(areaGameContractAbi).at(areaGameContractAddr);
    var areaIDs =[];
    var areaObjects = [];

     if(contractInstance){
        for(let i = 0; ; i++){
            try{
                var areaId = contractInstance.areasArray(i);

                if(addr != '0x')
                    areaIDs.push(areaID);
                else
                    break;
            }   
            catch(e){
                break;
            } 
        }

        console.log('area id array', areaIDs);

         for(let i=0; i<areaIDs.length; i++){
            let item = contractInstance.GetArea(areaIDs[i]);
            let history =[];

            areaObjects.push({
                 _id:Area_id,
                 admin:founderAddr,
                 bounds:bound,
                 highestBidding:5,
                 history:[],
                 startTime:new Date(),
                 endTime:new Date()
            });
        }
};
}

export function initGame(){
    console.log("run init game");
     let contractInstance = chain3.mc.contract(areaGameContractAbi).at(areaGameContractAddr);
     var arr = [];
     arr = contractInstance.getBidHistory("YdZFXWJEuLT5vkfuS");
     console.log(arr);
};
