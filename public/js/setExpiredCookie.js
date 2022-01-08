const setExpiredCookie = (isExpired,uid) => {
    fetch(`http://localhost:4000/api/auth/expired/${uid}`,{
        method:"PATCH",
        body:JSON.stringify({
            isExpired
        })
    })
    .then(response=>response.json())
    .then(result=>{
        if(!result.status){
            console.log(result);
        }
    })
    .catch(err=>{
        console.log(err);
    })
}