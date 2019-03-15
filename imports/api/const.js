export const httpProvider = 'http://gateway.moac.io/testnet';
export const littleNoteContractAddr = '0xe6ba2932fcfab6b1ccb53580efbe68bd07c2c42b';
export const littleNoteContractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "userName",
				"type": "string"
			},
			{
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "AddAccount",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "areaid",
				"type": "string"
			},
			{
				"name": "noteText",
				"type": "string"
			},
			{
				"name": "lat",
				"type": "uint256"
			},
			{
				"name": "lng",
				"type": "uint256"
			},
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "forSell",
				"type": "bool"
			},
			{
				"name": "referral",
				"type": "address"
			},
			{
				"name": "mediaFlag",
				"type": "bool"
			}
		],
		"name": "AddNote",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "noteText",
				"type": "string"
			},
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "areaOwner",
				"type": "address"
			}
		],
		"name": "BuyNote",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "areaOwner",
				"type": "address"
			},
			{
				"name": "seller",
				"type": "address"
			},
			{
				"name": "sellerCost",
				"type": "uint256"
			}
		],
		"name": "distributePayment",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "noteText",
				"type": "string"
			},
			{
				"name": "lat",
				"type": "uint256"
			},
			{
				"name": "lng",
				"type": "uint256"
			},
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "forSell",
				"type": "bool"
			}
		],
		"name": "EditNote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "availableMoney",
				"type": "uint256"
			}
		],
		"name": "feesAndCharityReserve",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "pos_id",
				"type": "string"
			},
			{
				"name": "lat",
				"type": "uint256"
			},
			{
				"name": "lng",
				"type": "uint256"
			}
		],
		"name": "InArea",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "initPriceTable",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "Invest",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "to",
				"type": "address"
			}
		],
		"name": "ManualTransfer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "input",
				"type": "uint256"
			}
		],
		"name": "multiplyByRatio",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "winner1",
				"type": "address"
			},
			{
				"name": "winner2",
				"type": "address"
			},
			{
				"name": "winner3",
				"type": "address"
			},
			{
				"name": "winner4",
				"type": "address"
			},
			{
				"name": "winner5",
				"type": "address"
			}
		],
		"name": "PotRewardDistribution",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "SafetySendout",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "totalMoney",
				"type": "uint256"
			},
			{
				"name": "availableMoney",
				"type": "uint256"
			},
			{
				"name": "sellerCost",
				"type": "uint256"
			},
			{
				"name": "seller",
				"type": "address"
			}
		],
		"name": "sellerDistribution",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "SetAdmin",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newFounder",
				"type": "address"
			}
		],
		"name": "SetFounder",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "halt",
				"type": "bool"
			}
		],
		"name": "SetHalt",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "forSell",
				"type": "bool"
			}
		],
		"name": "ToggleSell",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_founder",
				"type": "address"
			},
			{
				"name": "_areaGameAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "AddAccountEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_id",
				"type": "string"
			}
		],
		"name": "AddNoteEvent",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accountsArray",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "anybodyAddOtherUser",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "AreaGameAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "AreaGameContract",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "developerAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "feesAndCharity",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "founder",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "getAccount",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "getAccountByName",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "n",
				"type": "uint256"
			}
		],
		"name": "getBigPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "lat",
				"type": "uint256"
			},
			{
				"name": "lng",
				"type": "uint256"
			}
		],
		"name": "getGrid",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "lat",
				"type": "uint256"
			},
			{
				"name": "lng",
				"type": "uint256"
			}
		],
		"name": "getGrid10",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "hourNumber",
				"type": "uint256"
			}
		],
		"name": "getHourlyPotReserves",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "investor",
				"type": "address"
			}
		],
		"name": "getInvestor",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getNote",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "grid10",
				"type": "uint256"
			}
		],
		"name": "getNotesCountByGrid10",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "grid10",
				"type": "uint256"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getNotesIdByGrid10",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "freeFlag",
				"type": "bool"
			},
			{
				"name": "newFlag",
				"type": "bool"
			},
			{
				"name": "grid10",
				"type": "uint256"
			},
			{
				"name": "mediaFlag",
				"type": "bool"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "note_id",
				"type": "string"
			}
		],
		"name": "GetPurchasePrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "haltFlag",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hourlyPotReservesArray",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "investorsArray",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastPurchaseTime",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lat0",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lat1",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lng0",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lng1",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MaxFreeNoteCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MaxNoteLength",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MaxPresetPricePower",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MaxPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MaxUserNameLength",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "mediaRate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MinPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "notesArray",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "notesArrayByTime",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "potDistBasisPointLimit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "potDistCountLimit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "potNotesId",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "potReserve",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "PriceTable",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ratio",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "threshold",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalPurchase",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
// export const areaGameContractAddr = '0x4e3506a73C2fEE70d28286392868B85a5D690664';
// export const areaGameContractAbi = [{"constant":false,"inputs":[{"name":"gameId","type":"string"},{"name":"noteId","type":"string"}],"name":"AddGameNote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"},{"name":"lat0","type":"uint256"},{"name":"lng0","type":"uint256"},{"name":"lat1","type":"uint256"},{"name":"lng1","type":"uint256"}],"name":"AddPosRange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"gamesArray","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"},{"name":"nickname","type":"string"},{"name":"description","type":"string"},{"name":"_admin","type":"address"},{"name":"_startBidding","type":"uint256"},{"name":"_increaseAmount","type":"uint256"},{"name":"_startTime","type":"uint256"},{"name":"_endTime","type":"uint256"}],"name":"AddArea","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"SafetySendout","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"haltFlag","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"string"}],"name":"RefundBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"},{"name":"parentAreaId","type":"string"},{"name":"nickname","type":"string"},{"name":"description","type":"string"},{"name":"_admin","type":"address"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"question","type":"string"}],"name":"AddGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"founder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"areaId","type":"string"}],"name":"TriggerAreaAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"SetAdmin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidHistoryArray","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"string"},{"name":"posRangeId","type":"string"}],"name":"SetGamePosRange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"string"}],"name":"GetGameNoteLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"}],"name":"AddMoneyToArea","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"string"}],"name":"GetGame","outputs":[{"components":[{"name":"_id","type":"string"},{"name":"parentAreaId","type":"string"},{"name":"nickname","type":"string"},{"name":"description","type":"string"},{"name":"balance","type":"uint256"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"enabled","type":"uint256"},{"name":"question","type":"string"},{"name":"admin","type":"address"},{"name":"proposing","type":"uint256"},{"name":"activeFlag","type":"uint256"},{"name":"updatedAt","type":"uint256"},{"name":"posRangeId","type":"string"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"areaId","type":"string"},{"name":"posRangeId","type":"string"}],"name":"SetAreaPosRange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newFounder","type":"address"}],"name":"SetFounder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"to","type":"address"}],"name":"ManualTransfer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"string"},{"name":"i","type":"uint256"}],"name":"GetGameNote","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"halt","type":"bool"}],"name":"SetHalt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"areasArray","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"},{"name":"activeFlag","type":"uint256"}],"name":"ActivateArea","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"string"},{"name":"areaId","type":"string"}],"name":"AddBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"}],"name":"GetArea","outputs":[{"components":[{"name":"uid","type":"string"},{"name":"activeFlag","type":"uint256"},{"name":"nickname","type":"string"},{"name":"description","type":"string"},{"name":"admin","type":"address"},{"name":"highestBidding","type":"uint256"},{"name":"increaseAmount","type":"uint256"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"updatedAt","type":"uint256"},{"name":"balance","type":"uint256"},{"name":"highBidId","type":"string"},{"name":"posRangeId","type":"string"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posRangesArray","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"uid","type":"string"},{"name":"activeFlag","type":"uint256"}],"name":"ActivateGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_founder","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
export const areaGameContractAddr = "0xa4025195f9f2740c868a5a57b8ae1ed5d4b14265";
export const areaGameContractAbi =[
	{
		"constant": false,
		"inputs": [
			{
				"name": "uid",
				"type": "string"
			},
			{
				"name": "lat0",
				"type": "uint256"
			},
			{
				"name": "lng0",
				"type": "uint256"
			},
			{
				"name": "lat1",
				"type": "uint256"
			},
			{
				"name": "lng1",
				"type": "uint256"
			}
		],
		"name": "AddPosRange",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gamesArray",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_answerid",
				"type": "string"
			}
		],
		"name": "showAnswer",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "SafetySendout",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "haltFlag",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_gameid",
				"type": "string"
			}
		],
		"name": "getGameBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_areaid",
				"type": "string"
			}
		],
		"name": "getAreaBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_gameid",
				"type": "string"
			}
		],
		"name": "getAnswerCost",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "founder",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "gameid",
				"type": "string"
			}
		],
		"name": "getGame",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uid",
				"type": "string"
			},
			{
				"name": "nickname",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "_admin",
				"type": "address"
			},
			{
				"name": "posRangeId",
				"type": "string"
			},
			{
				"name": "_highestBidding",
				"type": "uint256"
			},
			{
				"name": "_increaseAmount",
				"type": "uint256"
			},
			{
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"name": "_endTime",
				"type": "uint256"
			}
		],
		"name": "AddArea",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "SetAdmin",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "areaid",
				"type": "string"
			}
		],
		"name": "endBid",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gameId",
				"type": "string"
			}
		],
		"name": "GetGameNoteLength",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uid",
				"type": "string"
			}
		],
		"name": "AddMoneyToArea",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "areaid",
				"type": "string"
			}
		],
		"name": "getBidHistory",
		"outputs": [
			{
				"name": "",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "areaid",
				"type": "string"
			}
		],
		"name": "ExtendBidTime",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "areaid",
				"type": "string"
			},
			{
				"name": "_admin",
				"type": "address"
			}
		],
		"name": "RefundBid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_gameid",
				"type": "string"
			},
			{
				"name": "_areaid",
				"type": "string"
			},
			{
				"name": "winner1",
				"type": "address"
			},
			{
				"name": "winner2",
				"type": "address"
			},
			{
				"name": "winner3",
				"type": "address"
			},
			{
				"name": "winner4",
				"type": "address"
			},
			{
				"name": "winner5",
				"type": "address"
			}
		],
		"name": "distributeForGame",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "area_id",
				"type": "string"
			}
		],
		"name": "getPosRangeId",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newFounder",
				"type": "address"
			}
		],
		"name": "SetFounder",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "pos_id",
				"type": "string"
			}
		],
		"name": "getPosRange",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "to",
				"type": "address"
			}
		],
		"name": "ManualTransfer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "halt",
				"type": "bool"
			}
		],
		"name": "SetHalt",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "areasArray",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_gameid",
				"type": "string"
			},
			{
				"name": "_answerid",
				"type": "string"
			},
			{
				"name": "_content",
				"type": "string"
			}
		],
		"name": "addAnswer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "areaId",
				"type": "string"
			}
		],
		"name": "AddBid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "uid",
				"type": "string"
			}
		],
		"name": "GetArea",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gameid",
				"type": "string"
			}
		],
		"name": "endGame",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uid",
				"type": "string"
			},
			{
				"name": "parentAreaId",
				"type": "string"
			},
			{
				"name": "_admin",
				"type": "address"
			},
			{
				"name": "_lat",
				"type": "uint256"
			},
			{
				"name": "_lng",
				"type": "uint256"
			},
			{
				"name": "startTime",
				"type": "uint256"
			},
			{
				"name": "endTime",
				"type": "uint256"
			},
			{
				"name": "question",
				"type": "string"
			},
			{
				"name": "answerCost",
				"type": "uint256"
			}
		],
		"name": "AddGame",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "posRangesArray",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_gameid",
				"type": "string"
			}
		],
		"name": "answersForQuestion",
		"outputs": [
			{
				"name": "",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "bidId",
				"type": "string"
			}
		],
		"name": "getBid",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_founder",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "uid",
				"type": "string"
			}
		],
		"name": "AddGameEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_answerid",
				"type": "string"
			}
		],
		"name": "addAnswerEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_gameid",
				"type": "string"
			}
		],
		"name": "distributeForGameEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "uid",
				"type": "string"
			}
		],
		"name": "AddAreaEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "AddBidEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "reciever",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "RefundBidEvent",
		"type": "event"
	}
];
export const founderAddr = '0x2cb3f047211d7b6c63c8ce51d1ffe7d4a34ff143';
export const founderKey = '0xa1dcb8850e440b3bf184d8fca0e986410d834d83b96db726b8ea93a3fcac4291';

// export const founderAddr = '0xb970f1f71ab96f6f2556e404ed7681900303bf31';
// export const founderKey = '18851e68e34f564e5b16f7a785e849792f672a8b1341186de8c0e84398eaabbb';


