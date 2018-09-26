const butt = document.getElementsByClassName('buttons');
let screen = document.getElementById('screen');


if(window.addEventListener) {
    window.addEventListener('keydown', function(e) { 
        e.keyCode == 46 || e.keyCode === 8 ? store(e): window.addEventListener('keypress', store)}
    );
    for(let i = 0; i < butt.length; i++) butt[i].addEventListener('click', store, false);
}
else {
    window.attachEvent('onkeydown', function(e) { 
        e.keyCode == 46 || e.keyCode === 8 ? store(e): window.attachEvent('onkeypress', store)}
    );
    for(let i = 0; i < butt.length; i++) butt[i].attachEvent('onclick', store, false);
}


const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,'.','Del','Backspace','=','*','/','+','-'];
let d, 
first,  // first input before operation
second, // second input thats evaluated with the first
clear, // checks if screen should clear
op, // temporary operator
opPass, // operator that's executed
opTrack, // checks if an operator was implemented
eqCheck, // checks if an evaluation took place
eqCount = 0; // number of evaluations
screen.innerText = 0; 


function store(event) {
    let k, charStr, p, key, item, index;
    k = event.keyCode;
    if(event.target.innerText){k = event.target.innerText};
    charStr = String.fromCharCode(k);
    p = event.target;
    key = event.key;
    
    // Assign character ops from keyboard input
    if     (key === 'Del' && event.charCode !== 0) key ='.';
    else if(key === 'Enter')                       key = '=';
    else if(key === 'Multiply')                    key = '*';
    else if(key === 'Divide')                      key = '/';
    else if(key === 'Add')                         key = '+';
    else if(key === 'Subtract')                    key = '-';
    
    
    // Match input
    for(let i = 0; i < keys.length; i++) {
        if(key == keys[i] || k.indexOf(keys[i]) > -1 || charStr == keys[i]) {
            item = keys[i];
            if(keys[i] === 'Del') key = 'Delete';
            else if(keys[i] === 'Backspace') key = 'Backspace';
            index = i;
            if((charStr == keys[i] && keys[i] !== 0 )|| key == keys[i]) break;
        }
    }
   
    if((screen.innerText == 0 || eqCheck && opTrack) && (key === '-' || k === '-')) {
        screen.innerText = '-';
        return;
    }
    
    // Clears data
    else if(p.id === 'clr' || key === 'c' || key === 'Delete' && key !=='.') {
        erased(); 
        return;
    }
    
    else if(screen.innerText !== '-') {

        // Calculate input
        if(key === '=' || p.id === 'eq') {
            if(first || eqCount > 0){
                if(screen.innerText.length === '' && eqCount === 0 || opTrack) {
                    return;
                }
                equate();
                clear = true;
                return;
            }
            return;
        }
        
        // Select operator
        else if(p.id !== 'back' && p.className === 'op buttons' && p.id === 'eq' || index > 12) {
            operate();
            return;
        }    

        // Clears screen after calculations
        if((clear || screen.innerText === '0')) {
            if(key === 'Backspace' || p.id == 'back') return;
            screen.innerText = '';
            clear = false;
        }    
    }

    // Adds and removes characters to screen
    if((index < 11 || key === 'Backspace' || p.id === 'back') && key != '=' ){
        charAdd();
        return;
    }   

    function backSpace() {
        if(screen.innerText !== '' && !opTrack && !eqCheck){ 
            screen.innerText = screen.innerText.slice(0,-1);
            second = screen.innerText;
            if(screen.innerText == '') {
                screen.innerText = 0;
                second = 0;
            }
            return;
        }
        else if(screen.innerText == '') {
            screen.innerText = 0;
        }
        else {
            screen.innerText = first; 
        }
        return;
    }


    function charAdd() {
        if(screen.innerText.length > 21) {
            return;
        }

        //Removes characters
        if((key === 'Backspace' || p.id === 'back') && !clear ) { 
            backSpace();
            return;
        } 

        // Adds decimal once per line
        else if(item == '.'){ 
            if(item == '.' && d){
                return;   
            }
            d = true;
        }
        // Adds numbers
        if(index < 11) {
            if(eqCheck) {
                erased();
                screen.innerText = '';
            }
            screen.innerText += item;
            if(first){
                second = screen.innerText;
            }
            opTrack = false;
            eqCheck = false;
            return;
        }
        if(eqCheck && (key !== 'Backspace' || p.id !== 'back')) {
            screen.innerText = first;
            eqCheck = false;
            return;
        }
        return;
    }


    function operate() {
        if(screen.innerText == '.') return;
        if(item) op = item;
        else op = key;
        
        if(opTrack || clear) {
            eqCheck = false;
            opPass = op;
            return;

        }
        else if(!first){
            first = screen.innerText;
            d = false;
        }
        else if(first && !eqCheck){
            equate();
        }
        opPass = op
        opTrack = true;
        eqCheck = false;
        clear = true;
        return;
    }

    
    function equate() {
        if(typeof first ==='string') first = Number(first);
        let hold = parseFloat(first);
    
        second = parseFloat(second);
        if(eqCount === 0) {
            second = screen.innerText;
            second = parseFloat(second);
        }
        if     (opPass.indexOf('*') > -1) hold *= second;
        else if(opPass.indexOf('/') > -1) hold /= second;
        else if(opPass.indexOf('+') > -1) hold += second;
        else if(opPass.indexOf('-') > -1) hold -= second;
        first = hold;
        screen.innerText = hold;
        d = false;
        eqCount++;
        eqCheck = true;
    }


    function erased() {
            screen.innerText = 0;
            first = "";
            second = "";
            opPass = "";
            op = "";
            d = false;
            clear = false;
            opTrack = false;
            eqCheck = false;
            eqCount = 0;
            return;
    }
}


