import React, { useEffect, useState } from "react";



function HelloApp(){
    const[hello, setHello] = useState();
    useEffect(() => {
        fetch('/api/users/hello')
        .then(response=>response.json())
        .then(data=>setHello(data.message));
    })

    return (
        <div>
            <h1>{hello}</h1>
        </div>
    )


};

export default HelloApp;