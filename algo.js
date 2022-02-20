console.log('lance');

function getBruteForceRange(slaveIndex, totalSlave) {
    const tabAlphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                         'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                         '0','1','2','3','4','5','6','7','8','9'];
    const tailleAlphabet = tabAlphabet.length;
    const nbMaxLettres = 5;
    var nbDePossibilites = Math.pow(tailleAlphabet, nbMaxLettres);
    var nbDePossibilitesParSlave = parseInt(nbDePossibilites/totalSlave);

    console.log(nbDePossibilites);
    console.log(nbDePossibilitesParSlave);
    
    var tabValeur = [];
    
    var ancienMot = "";
    for(var i=0; i<totalSlave-1; i++) {
        var indiceLettre = parseInt((nbDePossibilitesParSlave * tailleAlphabet / nbDePossibilites)) * (i+1) - 1;
        var nouveauMot   = tabAlphabet[indiceLettre]+"9999";
        
        tabValeur[i] = [ancienMot, nouveauMot];
        console.log(tabValeur[i]);

        ancienMot = nouveauMot;
    }
    if(ancienMot !== "99999"){
        tabValeur[tabValeur.length] = [ancienMot, "99999"];

        console.log(tabValeur[tabValeur.length-1]);
    }

    return tabValeur[slaveIndex];
}

getBruteForceRange(1, 4);
getBruteForceRange(2, 4);
getBruteForceRange(3, 4);
getBruteForceRange(4, 4);