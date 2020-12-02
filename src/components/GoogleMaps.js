import { Component } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    LoadScript,
    useLoadScript
} from '@react-google-maps/api';

const mapContainerStyle = {
    width: "100%",
    height: "100%"
};
const center = {
    lat: 44.1020958155653,
    lng: 20.843518592429295
}


export default function GoogleMaps() {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });
    console.log(isLoaded);
    console.log(loadError);

    if (loadError) return "load error";
    if (!isLoaded) return "Loaded...";

    return (
        <div className="GoogleMaps h-100">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={6.5}
                center={center}
            >
            </GoogleMap>
        </div>
    )
}