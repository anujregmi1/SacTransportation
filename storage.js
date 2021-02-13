function textRet(){
    /*
    var distance=document.getElementById("Distance").value;
    localStorage.setItem("Distance", distance);

    var mpg=document.getElementById("Mpg").value;
    localStorage.setItem("Mpg", mpg);

    var monthIn=document.getElementById("MonthIn").value;
    localStorage.setItem("MonthIn", monthIn);
    */
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzb0fZ34mDkj6tJHW3sUzcbu7BWRVJuY4VmIUrZtjruasDBORk/exec'
    const form = document.forms['google-sheet']  
    form.addEventListener('submit', e => {
        e.preventDefault()
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => window.location.href = "index.html")
        .catch(error => console.error('Error!', error.message))
    })
    return false;
}

function getValue(val, name){
    var temp = val;
    localStorage.setItem(name,temp);
}