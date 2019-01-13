const butt = document.getElementsByClassName('buttons');
let screen = document.getElementById('screen');


window.addEventListener('keydown', function(e) { 
    e.keyCode == 46 || e.keyCode === 8 ? store(e): window.addEventListener('keypress', store)}
);

for(let i = 0; i < butt.length; i++) butt[i].addEventListener('click', store, false);


const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,'.','Del','Backspace','=','*','/','+','-'];
let first,  // first input before operation
second, // second input thats evaluated with the first
clear, // checks if screen should clear
op, // temporary operator
opPass, // operator that's executed
opTrack, // checks if an operator was implemented
eqCheck, // checks if an evaluation took place
eqCount = 0; // number of evaluations
screen.innerText = 0; 


function store(event) {
    let charStr, p, key, item, index, k = event.keyCode;

    // stores value click mouse events
    if(event.target.innerText){
        k = event.target.innerText
    }
    
    charStr = String.fromCharCode(k); // Some values must be converted to a string for readability
    p = event.target;
    key = event.key;

    // Certain browsers output a different values and must be converted 
    if     (key === 'Del' && event.charCode !== 0) key ='.'; // NOTE: The '.' key sometimes returns a 'del' and must be converted
    else if(key === 'Enter')                       key = '=';
    else if(key === 'Multiply')                    key = '*';
    else if(key === 'Divide')                      key = '/';
    else if(key === 'Add')                         key = '+';
    else if(key === 'Subtract')                    key = '-';
    
    
    // Match and convert values for consistent values
    for(let i = 0; i < keys.length; i++) {
        if(key == keys[i] || k.indexOf(keys[i]) > -1 || charStr == keys[i]) {
            item = keys[i];
            if(keys[i] === 'Del') 
                key = 'Delete';

            else if(keys[i] === 'Backspace') 
                key = 'Backspace';

            index = i;
            if((charStr == keys[i] && keys[i] !== 0 ) || key == keys[i]) 
                break;
        }
    }
    
    // Changes key colors on keyboard events
    if(event.type != 'click') {
        const nums = document.getElementsByClassName('num buttons');
        const ops = document.getElementsByClassName('op buttons');
        let element;
        (function() {
            if ((key == 'Delete' || key == 'c' ) 
                colors(nums[11], '#fda1a1')
            
            else if (key == '=') 
                colors(ops[5], '#fefff2')
            
            else if (key == 'Backspace') 
                colors(ops[0], '#fda1a1')
            
            else if(index < 11) {
                for(let i = 0; i < nums.length; i++) {
                    if(nums[i].innerText.trim() == key)
                    element = nums[i]
                }
                colors(element, '#a9fca9') 
            }

            else if(index > 10) {
                for(let i = 0; i < ops.length; i++) {
                    if(ops[i].innerText.trim() == key)
                    element = ops[i]
                }
                colors(element, '#8bc7ff') 
            }
            
            // Temporarily add and remove background color to element
            function colors(el, init) {
                el.style.backgroundColor = init
                setTimeout(function() {el.style.backgroundColor = ''}, 100)
            }
        })()
    }

    // allows for addition of a negative value for initial number
    if((screen.innerText == 0 || eqCheck && opTrack) && (key === '-' || k === '-')) {
        screen.innerText = '-';
        return;
    }
    
    // Clears all data
    else if(p.id === 'clr' || key === 'c' || key === 'Delete' && key !=='.') {
        erased(); 
        return;
    }

    //Removes last character
    if((key === 'Backspace' || p.id === 'back') && !clear ) { 
        backSpace();
        return;
    } 
    
    else if(screen.innerText !== '-') {

        // Calculate input
        if(key === '=' || p.id === 'eq') {
            if(first || eqCount > 0){
                if(screen.innerText == 0 && eqCount === 0 || opTrack) {
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
            operate(item, key);
            return;
        }    

        // Clears screen after calculations
        if((clear || screen.innerText === '0')) {
            if(key === 'Backspace' || p.id == 'back') return;
            screen.innerText = '';
            clear = false;
        }    
    }

    // Adds characters to screen
    if((index < 11) && key != '=' ){
        charAdd(item, index);
        return;
    }   
}    

function backSpace() {
    // To erase the last character the screen must not be empty and when finally empty is replaced with a '0'
    // 'opTrack' and 'eqCheck' tell if there was a recent equation or operator input, in which case the values are set and cannot be remoed
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

function charAdd(item, index) {
    if(screen.innerText.length > 21) {
        return;
    }

    // Adds decimal once per line
    else if(item == '.' && screen.innerText.indexOf('.') > -1) { 
        return;  
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

function operate(item, key) {
    if(screen.innerText == '.') return;
    if(item) op = item;
    else op = key;
    
    /* Checks and returns if an operator was already initiated
       otherwise the operator itself would be calculated as a number */
    if(opTrack || clear) {
        eqCheck = false;
        opPass = op;
        return;

    }

    // Creates initial value if undefined
    else if(!first){
        first = screen.innerText;
    }

    // Equates recently added value upon pressing operator
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
    // Strings are converted to numbers here before equating for both first and second value
    if(typeof first ==='string') first = Number(first);
    let hold = parseFloat(first);

    /* The 'hold' value temporarily holds the 'first' value, and after equating with the 'second' value,
       is added back to the 'first'*/
    second = parseFloat(second);
    if(eqCount === 0) {
        second = screen.innerText;
        second = parseFloat(second);
    }
    /* After an initial equation, the value can
       continually be equated with the last operator entered */
    if     (opPass.indexOf('*') > -1) hold *= second;
    else if(opPass.indexOf('/') > -1) hold /= second;
    else if(opPass.indexOf('+') > -1) hold += second;
    else if(opPass.indexOf('-') > -1) hold -= second;
    first = hold;
    screen.innerText = hold;
    eqCount++;
    eqCheck = true;
}

function erased() {
    screen.innerText = 0;
    first = "";
    second = "";
    opPass = "";
    op = "";
    clear = false;
    opTrack = false;
    eqCheck = false;
    eqCount = 0;
    return;
}

