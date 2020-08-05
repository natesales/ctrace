import {useEffect, useState} from "react";

export default function QRCodes() {
    const [images, setImages] = useState(null);

    async function getQRCodes() {
        const res = await fetch("http://localhost:3000/api/admin/qrcodes", {method: 'GET'})
            .then(response => response.json())
            .then(data => setImages(data.data))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        getQRCodes();
    }, []);

    return (
        <div>
            {images !== null ?
                images.map((image) => {
                    return (
                        <div key={image.name} className="pageBreak">
                            <h1>{image.name}</h1>
                            <img src={image.image} alt={image.name}/>
                        </div>
                    )
                }) : <h1>Loading...</h1>}
        </div>
    )
}
