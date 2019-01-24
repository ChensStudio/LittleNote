function compileSol() {
  const solc = require('solc');
  const fs = require('fs');

  // 1) compile the solidity code
  var input = {
    'littlenote.sol':     fs.readFileSync('../../../solidity/littlenote.sol',     'utf8')
  }

  console.log("Compiling....");
  // var content = fs.readFileSync(solFileName, 'utf8');
  var output = solc.compile({sources: input}, 1);
  console.log("output", output);


  for (var objContractName in output.contracts) {
    var contractJson = output.contracts[objContractName];
    var contractName = objContractName.substring(objContractName.indexOf(':')+1);
    var abiFileName = './' + contractName + '.abi';
    var hexFileName = './' + contractName + '.bin';
    var fhFileName = './' + contractName + '.funcHash';
    // // console.dir(output.contracts);
    // fs.writeFileSync(wholeFileName, JSON.stringify(output));
    fs.writeFileSync(abiFileName, 'contractAbi =' + contractJson.interface + ';');
    fs.writeFileSync(hexFileName, 'contractBytecode = \'0x' + contractJson.bytecode + '\';');
    fs.writeFileSync(fhFileName, 'functionHashes =' + JSON.stringify(contractJson.functionHashes) + ' ;');
    console.log('contract name:', contractName);
    // console.log('contract abi:\n', contractJson.interface);
    // console.log('contract bytecode:\n', contractJson.bytecode);
    // console.log('contract function hashes:\n', JSON.stringify(contractJson.functionHashes));
  }

}

// console.log("Compiling....", process.argv[1]);
compileSol(process.argv[2]);