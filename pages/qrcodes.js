import {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";

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
                            <Grid container justify = "center">
                                <h1>{image.name}</h1>
                            </Grid>

                            <Grid container justify = "center">
                                <img src={image.image} alt={image.name}/>
                            </Grid>

                            <Grid container justify = "center">
                                <h3>{image.ref}</h3>
                            </Grid>
                        </div>
                    )
                }) : <h1>Loading...</h1>}
        </div>
    )
}
