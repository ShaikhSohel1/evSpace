import { useEffect, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  setDoc,
  getDoc,
  where,
  query,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import Marker from "./Marker";
// import Geocode from "react-geocode";

// const AnyReactComponent = ({ text }) => (
//   <div onClick={() => console.log("hii")}>📌</div>
// );

export default function Gap({ place, setplace, placeid, setplaceid, todos }) {
  console.log(todos)
  const defaultProps = {
    center: {
      lat: 18.5204,
      lng: 73.8567,
    },
    zoom: 14,
  };
  const print1 = async () => {
    console.log("hii");
  };


  return (
    <div className="bg-slate-900 h-[30rem] mx-5 my-6 rounded-[12px] text-center">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_ID}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        // onClick={print1(latiti)}
        onClick={(ev) => {
          console.log("latitide = ", ev.lat);
          console.log("longitude = ", ev.lng);
        }}
      >
        {todos.map((val) => (
          <Marker
            key = {val.id}
            lat={val.lat}
            lng={val.lang}
            text="My Marker"
            color="blue"
            place={place}
            setplace={setplace}
            placeid={placeid}
            setplaceid={setplaceid}
            id={val.id}
          />
        ))}

        {/* <div>
  📌
  </div> */}
      </GoogleMapReact>
    </div>
  );
}


