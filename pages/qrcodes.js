import {useEffect, useState} from "react";

export default function QRCodes() {
    const [images, setImages] = useState(null);

    useEffect(() => {
        fetch("/api/admin/qrcodes", {method: "GET"})
            .then(response => response.json())
            .then(data => setImages(data.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            {images !== null ?
                images.map((image) => {
                    return (
                        <div key={image.name} className="pageBreak">
                            <h1>{image.name}</h1>
                            <img src={image.image} alt={image.name}/>
                            <h3>{image.ref}</h3>
                        </div>
                    )
                }) : <h1>Loading...</h1>}
        </div>
    )
}
